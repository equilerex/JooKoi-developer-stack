#!/usr/bin/env node
// jj: quick menu for folders, projects, apps and commands.
// Menu content comes from jj.config.json (+ optional private _jookoi-jj.config.json).
// The shell wrappers (jj.ps1, jj.sh) read the result file this script writes, so
// `cd` and `run` happen in the calling shell. See CONTEXT.md.
import { spawn } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const shortcutsDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(shortcutsDir, '..', '..');

let clack;
try {
  clack = await import('@clack/prompts');
} catch {
  console.error(`jj: @clack/prompts is missing. Run "npm install" in ${repoRoot}`);
  process.exit(1);
}
const { autocomplete, isCancel, select } = clack;

// ---------- config ----------

const readConfigFile = (path) => {
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    console.error(`jj: cannot read ${path}\n${error.message}`);
    process.exit(1);
  }
};

// Private config adds entries to groups with the same label, or adds new groups.
const mergeConfigs = (shared, personal) => {
  const merged = {
    projectRoots: personal?.projectRoots ?? shared.projectRoots ?? [],
    groups: (shared.groups ?? []).map((group) => ({ ...group, entries: [...(group.entries ?? [])] })),
  };
  for (const personalGroup of personal?.groups ?? []) {
    const existing = merged.groups.find((group) => group.label === personalGroup.label);
    if (existing) {
      existing.entries.push(...(personalGroup.entries ?? []));
      if (personalGroup.source) existing.source = personalGroup.source;
      if (personalGroup.folder) existing.folder = personalGroup.folder;
    } else {
      merged.groups.push({ ...personalGroup, entries: [...(personalGroup.entries ?? [])] });
    }
  }
  return merged;
};

const config = mergeConfigs(
  readConfigFile(join(shortcutsDir, 'jj.config.json')) ?? { groups: [] },
  readConfigFile(join(shortcutsDir, '_jookoi-jj.config.json')),
);

const toForwardSlashes = (path) => path.replaceAll('\\', '/');

// `~` = home folder, `{repo}` = this repo, `{shortcuts}` = this folder.
const expandTokens = (text) => text
  .replace(/^~(?=$|[\\/])/, homedir())
  .replaceAll('{repo}', repoRoot)
  .replaceAll('{shortcuts}', shortcutsDir);
const expandPath = (path) => resolve(expandTokens(path));
const expandCommand = (command) => command
  .replaceAll('{repo}', toForwardSlashes(repoRoot))
  .replaceAll('{shortcuts}', toForwardSlashes(shortcutsDir));

// ---------- actions ----------

// cd and run go back to the shell wrapper; open is done here.
const writeResult = (kind, payload) => {
  const resultFile = process.env.JJ_RESULT_FILE;
  if (!resultFile) {
    console.log(kind === 'cd' ? `cd "${payload}"` : payload);
    console.log('(jj was run without its shell wrapper, so nothing was applied. Run `npm run setup:jj`.)');
    return;
  }
  writeFileSync(resultFile, `${kind}\n${payload}\n`, 'utf8');
};

const openInNewWindow = (target) => {
  const child = spawn('cmd.exe', ['/d', '/c', `start "" "${target}"`], {
    cwd: existsSync(target) ? dirname(target) : undefined,
    detached: true,
    stdio: 'ignore',
    windowsVerbatimArguments: true,
  });
  child.unref();
};

const runEntry = (entry) => {
  if (entry.cd) return writeResult('cd', expandPath(entry.cd));
  if (entry.run) return writeResult('run', expandCommand(entry.run));
  if (entry.open) {
    const target = /^[a-z]+:\/\//i.test(entry.open) ? entry.open : expandPath(entry.open);
    return openInNewWindow(target);
  }
  console.error(`jj: entry "${entry.label}" needs one of "cd", "run" or "open".`);
};

// ---------- menus ----------

const BACK = Symbol('back');
const CANCEL = Symbol('cancel');

const choose = async (prompt, message, options, extra = {}) => {
  const selected = await prompt({ message, options, ...extra });
  return isCancel(selected) ? CANCEL : selected;
};

const backOption = { label: '← Back', value: BACK };

const chooseEntry = async (groupLabel, entries) => {
  const visible = entries.filter((entry) => !entry.cd || existsSync(expandPath(entry.cd)));
  if (visible.length === 0) {
    console.log(`jj: "${groupLabel}" has no entries on this machine.`);
    return BACK;
  }
  const selected = await choose(select, groupLabel, [
    ...visible.map((entry) => ({ label: entry.label, hint: entry.hint, value: entry })),
    backOption,
  ], { maxItems: 15 });
  return selected;
};

// First `rem` or `::` comment line of a .bat file becomes its hint.
const readBatDescription = (path) => {
  const match = readFileSync(path, 'utf8').match(/^\s*(?:@?rem|::)\s+(.+)$/im);
  return match ? match[1].trim() : undefined;
};

const batFileEntries = (folder) => {
  const folderPath = expandPath(folder ?? '{shortcuts}');
  if (!existsSync(folderPath)) return [];
  return readdirSync(folderPath, { withFileTypes: true })
    .filter((file) => file.isFile() && /\.(bat|cmd)$/i.test(file.name))
    .sort((left, right) => left.name.localeCompare(right.name))
    .map((file) => {
      const path = join(folderPath, file.name);
      return { label: file.name.replace(/\.(bat|cmd)$/i, ''), hint: readBatDescription(path), open: path };
    });
};

// ---------- npm scripts of the current folder ----------

// Nearest package.json at or above the folder jj was started from, like npm itself.
const findNearestPackageJson = (startFolder) => {
  let folder = resolve(startFolder);
  while (true) {
    const candidate = join(folder, 'package.json');
    if (existsSync(candidate)) return candidate;
    const parent = dirname(folder);
    if (parent === folder) return null;
    folder = parent;
  }
};

// Hint: a `"// name": "description"` key if the package has one, else the script itself.
const npmScriptEntries = () => {
  const packagePath = findNearestPackageJson(process.cwd());
  if (!packagePath) return { packagePath: null, entries: [] };
  let scripts;
  try {
    scripts = JSON.parse(readFileSync(packagePath, 'utf8')).scripts ?? {};
  } catch (error) {
    console.error(`jj: cannot read ${packagePath}\n${error.message}`);
    return { packagePath, entries: [] };
  }
  const entries = Object.entries(scripts)
    .filter(([name]) => !name.startsWith('//'))
    .map(([name, command]) => ({
      label: name,
      hint: scripts[`// ${name}`] ?? (command.length > 70 ? `${command.slice(0, 67)}...` : command),
      run: `npm run ${name}`,
    }));
  return { packagePath, entries };
};

const chooseNpmScript = async (group) => {
  const { packagePath, entries } = npmScriptEntries();
  if (!packagePath) {
    console.log(`jj: no package.json in ${process.cwd()} or above.`);
    return BACK;
  }
  if (entries.length === 0) {
    console.log(`jj: ${packagePath} has no scripts.`);
    return BACK;
  }
  return choose(autocomplete, `${group.label}: ${basename(dirname(packagePath))} (type to filter)`, [
    ...entries.map((entry) => ({ label: entry.label, hint: entry.hint, value: entry })),
    backOption,
  ], { maxItems: 15 });
};

// ---------- project discovery ----------

const readBranch = (gitPath) => {
  try {
    let gitDir = gitPath;
    if (statSync(gitPath).isFile()) {
      // worktree or submodule: `.git` is a file pointing at the real git dir
      const pointer = readFileSync(gitPath, 'utf8').match(/^gitdir:\s*(.+)$/m);
      if (!pointer) return null;
      gitDir = resolve(dirname(gitPath), pointer[1].trim());
    }
    const head = readFileSync(join(gitDir, 'HEAD'), 'utf8').trim();
    const ref = head.match(/^ref: refs\/heads\/(.+)$/);
    return ref ? ref[1] : head.slice(0, 7);
  } catch {
    return null;
  }
};

const findRepositories = (folder, depthLeft) => {
  let children;
  try {
    children = readdirSync(folder, { withFileTypes: true });
  } catch {
    return [];
  }
  if (children.some((child) => child.name === '.git')) {
    return [{
      name: basename(folder),
      path: folder,
      parent: basename(dirname(folder)),
      branch: readBranch(join(folder, '.git')),
    }];
  }
  if (depthLeft === 0) return [];
  return children
    .filter((child) => child.isDirectory() && !child.name.startsWith('.') && child.name !== 'node_modules')
    .flatMap((child) => findRepositories(join(folder, child.name), depthLeft - 1));
};

// `ndw-ui` and `ndw-ui-2` are copies of one project.
const projectName = (repositoryName) => repositoryName.replace(/-\d+$/, '');

const groupRepositoriesByProject = (repositories) => {
  const projects = new Map();
  for (const repository of repositories) {
    const name = projectName(repository.name);
    const copies = projects.get(name) ?? [];
    if (!copies.some((copy) => copy.path === repository.path)) copies.push(repository);
    projects.set(name, copies);
  }
  return projects;
};

const describeCopy = (repository) => (repository.branch
  ? `${repository.parent} | ${repository.branch}`
  : repository.parent);

const chooseProject = async () => {
  const repositories = (config.projectRoots ?? [])
    .map(expandPath)
    .flatMap((root) => findRepositories(root, 3));
  const projects = groupRepositoriesByProject(repositories);
  if (projects.size === 0) {
    console.log('jj: no git repositories found under projectRoots in jj.config.json.');
    return BACK;
  }

  const names = [...projects.keys()].sort((left, right) => left.localeCompare(right, undefined, { sensitivity: 'base' }));
  const selectedName = await choose(autocomplete, 'Projects (type to filter)', [
    ...names.map((name) => {
      const copies = projects.get(name);
      return {
        label: name,
        hint: copies.length > 1 ? `${copies.length} copies` : describeCopy(copies[0]),
        value: name,
      };
    }),
    backOption,
  ], { maxItems: 15 });
  if (typeof selectedName !== 'string') return selectedName;

  const copies = projects.get(selectedName);
  if (copies.length === 1) return { label: selectedName, cd: copies[0].path };

  const selectedCopy = await choose(select, `${selectedName} copies`, [
    ...copies.map((repository) => ({ label: describeCopy(repository), hint: repository.path, value: repository })),
    backOption,
  ]);
  return selectedCopy?.path ? { label: selectedName, cd: selectedCopy.path } : selectedCopy;
};

const openGroup = async (group) => {
  if (group.source === 'projects') return chooseProject();
  if (group.source === 'npm-scripts') return chooseNpmScript(group);
  if (group.source === 'bat-files') return chooseEntry(group.label, [...batFileEntries(group.folder), ...group.entries]);
  return chooseEntry(group.label, group.entries ?? []);
};

// ---------- main loop ----------

while (true) {
  const group = await choose(select, 'jj', config.groups.map((candidate) => ({
    label: candidate.label,
    hint: candidate.hint,
    value: candidate,
  })));
  if (group === CANCEL) break;

  const entry = await openGroup(group);
  if (!entry || entry === BACK) continue;
  if (entry === CANCEL) break;
  runEntry(entry);
  break;
}
