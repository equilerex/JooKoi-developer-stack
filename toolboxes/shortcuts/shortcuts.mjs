import { execFileSync, spawn } from 'node:child_process';
import { existsSync, readdirSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const resultFile = process.env.FAVORITES_RESULT_FILE;

if (!resultFile) {
  throw new Error('FAVORITES_RESULT_FILE is required.');
}

const npmRoot = process.platform === 'win32'
  ? join(process.env.APPDATA ?? '', 'npm', 'node_modules')
  : execFileSync('npm', ['root', '--global'], {
    encoding: 'utf8',
  }).trim();
const clackPath = join(npmRoot, '@clack', 'prompts', 'dist', 'index.mjs');

if (!existsSync(clackPath)) {
  throw new Error(`Cannot find @clack/prompts at ${clackPath}.`);
}

const { isCancel, select } = await import(pathToFileURL(clackPath).href);

const vaultRoot = 'C:\\BB\\Serenity\\jookoi-vault\\jookoi-corporate-env-personal-assistant\\vault';
const shortcutRoot = join(vaultRoot, 'shortcuts');
const projectRoot = 'C:\\BB';
const discoveryScript = fileURLToPath(new URL('./favorites-projects.mjs', import.meta.url));
const folderFavorites = [
  'C:\\Users\\G05582\\.agents',
  'C:\\Users\\G05582\\.agents\\skills',
  'C:\\Users\\G05582\\.gemini',
  'C:\\BB',
  'C:\\BB\\Babylon-5',
  'C:\\BB\\Serenity',
  'C:\\BB\\Daedalus',
  'C:\\BB\\Rocinante',
  'C:\\BB\\Nostromo',
  'C:\\BB\\skunkworks',
  'C:\\BB\\Serenity\\jookoi-vault',
  vaultRoot,
];
const hardcodedProjectCandidates = [
  ['ndhw-src-savings', 'C:\\BB\\Babylon-5\\ndhw-src-savings'],
  ['ndhw-src-savings', 'C:\\BB\\Daedalus\\ndhw-src-savings'],
  ['ndw-ui', 'C:\\BB\\Daedalus\\ndw-ui'],
  ['ndw-core', 'C:\\BB\\Babylon-5\\ndw-core'],
  ['devx-toolkit', 'C:\\BB\\Babylon-5\\devx-toolkit'],
  ['jookoi-vault', 'C:\\BB\\Serenity\\jookoi-vault'],
  ['JooKoi-developer-stack', 'C:\\BB\\Babylon-5\\JooKoi-developer-stack'],
];

const toBashPath = (windowsPath) => windowsPath.replaceAll('\\', '/');
const toCdCommand = (windowsPath) => `cd "${toBashPath(windowsPath)}"`;

const backOption = { label: '← Back', value: '__back__' };

const normalizeProjectName = (name) => name.replace(/-\d+$/, '');

const hardcodedProjects = hardcodedProjectCandidates
  .filter(([, path]) => existsSync(path))
  .map(([name, path]) => ({
    name,
    path,
    parent: basename(dirname(path)),
    branch: null,
  }));

let discoveryPromise;
let discoveredProjects;
let discoveryError;

const startDiscovery = () => {
  if (discoveryPromise) {
    return discoveryPromise;
  }

  discoveryPromise = new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [discoveryScript, projectRoot], {
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let output = '';
    let errorOutput = '';

    child.stdout.on('data', (chunk) => {
      output += chunk;
    });
    child.stderr.on('data', (chunk) => {
      errorOutput += chunk;
    });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(errorOutput || `Project discovery exited with code ${code}.`));
        return;
      }
      try {
        resolve(JSON.parse(output));
      } catch (error) {
        reject(error);
      }
    });
  }).catch((error) => {
    discoveryPromise = undefined;
    throw error;
  });

  return discoveryPromise;
};

void startDiscovery()
  .then((repositories) => {
    discoveredProjects = repositories;
  })
  .catch((error) => {
    discoveryError = error;
    discoveredProjects = [];
  });

const groupProjects = (repositories) => {
  const grouped = new Map();

  for (const repo of repositories) {
    const name = normalizeProjectName(repo.name);
    const group = grouped.get(name) ?? [];
    const existing = group.find((candidate) => candidate.path === repo.path);
    if (!existing) {
      group.push({ ...repo, name });
    } else if (repo.branch) {
      existing.branch = repo.branch;
    }
    grouped.set(name, group);
  }

  return grouped;
};

const choose = async (message, options) => {
  const selected = await select({ message, options });
  return isCancel(selected) ? '__cancel__' : selected;
};

const chooseCommand = async (message, items) => {
  const selected = await choose(message, [...items, backOption]);
  return selected === '__back__' || selected === '__cancel__' ? null : selected;
};

const chooseFolder = async () => chooseCommand(
  'Folders',
  folderFavorites
    .filter((folder) => existsSync(folder))
    .map((folder) => ({ label: folder, value: toCdCommand(folder) })),
);

const utilBatFiles = new Set([
  'gemini-repair.bat',
  'gemini-session-doctor.bat',
  'favorites.bat',
  'check-resources.bat',
  'watch-bluetooth.bat',
  'start-telemetry.bat',
  'stop-telemetry.bat',
  'show-telemetry.bat',
]);

const chooseConfig = async () => {
  const configs = readdirSync(shortcutRoot, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.bat') && !utilBatFiles.has(entry.name))
    .sort((left, right) => left.name.localeCompare(right.name))
    .map((entry) => {
      const path = join(shortcutRoot, entry.name);
      return {
        label: entry.name,
        hint: path,
        value: `cmd.exe /c call "${toBashPath(path)}"`,
      };
    });
  return chooseCommand('Configs', configs);
};

const chooseApp = async () => {
  const apps = readdirSync(vaultRoot, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /^start-.*\.bat$/i.test(entry.name))
    .sort((left, right) => left.name.localeCompare(right.name))
    .map((entry) => {
      const path = join(vaultRoot, entry.name);
      return {
        label: entry.name,
        hint: 'Open in another terminal',
        value: `cmd.exe /c start "" "${toBashPath(path)}"`,
      };
    });
  return chooseCommand('Apps', apps);
};

const chooseUtils = async () => chooseCommand('Utils', [
  { label: 'Git status', value: 'git status' },
  { label: 'Git root', value: 'git rev-parse --show-toplevel' },
  { label: 'npm scripts approve', value: 'npm approve-scripts --allow-scripts-pending' },
  {
    label: 'Resource Monitor (RAM/CPU)',
    hint: 'Snapshot of memory pools, top apps & command lines',
    value: `cmd.exe /c start "" "${toBashPath(join(shortcutRoot, 'check-resources.bat'))}"`,
  },
  {
    label: 'Bluetooth Watcher (Live)',
    hint: 'Live stream of driver packet drops & adapter resets',
    value: `cmd.exe /c start "" "${toBashPath(join(shortcutRoot, 'watch-bluetooth.bat'))}"`,
  },
  {
    label: 'Telemetry: Start background daemon',
    hint: 'Silently logs RAM/CPU spikes to vault/_meta/resource-telemetry.log',
    value: `cmd.exe /c call "${toBashPath(join(shortcutRoot, 'start-telemetry.bat'))}"`,
  },
  {
    label: 'Telemetry: Stop background daemon',
    hint: 'Kills the running telemetry background worker',
    value: `cmd.exe /c call "${toBashPath(join(shortcutRoot, 'stop-telemetry.bat'))}"`,
  },
  {
    label: 'Telemetry: Show spike logs',
    hint: 'View the last recorded resource spikes',
    value: `cmd.exe /c start "" "${toBashPath(join(shortcutRoot, 'show-telemetry.bat'))}"`,
  },
  {
    label: 'Repair Gemini CLI',
    hint: 'Reapply the local resume-history guard',
    value: `cmd.exe /c call "${toBashPath(join(shortcutRoot, 'gemini-repair.bat'))}"`,
  },
  {
    label: 'Repair Gemini sessions',
    hint: 'Scan all sessions for corrupt resume tails, pick which to purge (or fix all)',
    value: `cmd.exe /c call "${toBashPath(join(shortcutRoot, 'gemini-session-doctor.bat'))}"`,
  },
]);

const chooseProjectInstance = async (name, repositories) => {
  if (repositories.length === 1) {
    return toCdCommand(repositories[0].path);
  }

  return chooseCommand(
    `${name} instances`,
    repositories.map((repo) => ({
      label: repo.branch ? `${repo.parent} | ${repo.branch}` : repo.parent,
      hint: repo.path,
      value: toCdCommand(repo.path),
    })),
  );
};

const preferredOrder = [
  'ndhw-src-savings',
  'ndw-ui',
  'ndw-core',
  'devx-toolkit',
  'jookoi-vault',
  'JooKoi-developer-stack',
];

const sortProjectNames = (names) => [...names].sort((left, right) => {
  const leftIndex = preferredOrder.indexOf(left);
  const rightIndex = preferredOrder.indexOf(right);
  if (leftIndex !== -1 || rightIndex !== -1) {
    return (leftIndex === -1 ? Number.MAX_SAFE_INTEGER : leftIndex) -
      (rightIndex === -1 ? Number.MAX_SAFE_INTEGER : rightIndex);
  }
  return left.localeCompare(right);
});

const projectOptions = (grouped, status) => [
  ...sortProjectNames(grouped.keys()).map((name) => ({
    label: name,
    hint: grouped.get(name).length > 1
      ? `${grouped.get(name).length} instances`
      : grouped.get(name)[0].branch
        ? `${grouped.get(name)[0].parent} | ${grouped.get(name)[0].branch}`
        : grouped.get(name)[0].parent,
    value: name,
  })),
  ...(status ? [{
    label: status.label,
    hint: status.hint,
    value: status.value,
    disabled: true,
  }] : []),
  backOption,
];

const chooseProject = async () => {
  const grouped = groupProjects([
    ...hardcodedProjects,
    ...(discoveredProjects ?? []),
  ]);
  const selectedName = await choose('Projects', projectOptions(
    grouped,
    discoveredProjects
      ? discoveryError
        ? { label: 'Project discovery unavailable', hint: discoveryError.message, value: '__unavailable__' }
        : null
      : { label: 'More projects are still loading…', value: '__loading__' },
  ));

  if (selectedName === '__back__' || selectedName === '__cancel__') {
    return null;
  }

  if (selectedName === '__loading__' || selectedName === '__unavailable__') {
    return null;
  }

  return chooseProjectInstance(selectedName, grouped.get(selectedName));
};

const groups = [
  { label: 'Folders', value: 'folders' },
  { label: 'Projects', value: 'projects' },
  { label: 'Apps', value: 'apps' },
  { label: 'Configs', value: 'configs' },
  { label: 'Utils', value: 'utils' },
];

let command = null;
while (command === null) {
  const group = await choose('Favorites', groups);
  if (group === '__cancel__') {
    break;
  }

  command = await ({
    folders: chooseFolder,
    projects: chooseProject,
    apps: chooseApp,
    configs: chooseConfig,
    utils: chooseUtils,
  }[group])();
}

if (command && command !== '__none__') {
  writeFileSync(resultFile, command, 'utf8');
}