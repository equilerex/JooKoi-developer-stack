#!/usr/bin/env node
// Copy skills from one indexed source into indexed destinations, as real files. No links.
// Locations come from _jookoi-skill-locations.json at the repo root. Nothing is scanned.
// Flow: source -> skills -> destinations -> plan -> confirm -> copy. Nothing is written before the confirm.
// Each copy replaces the destination skill folder in full: files the source no longer has are removed.
// --dry-run stops after the plan (testing aid).
const fs = require('fs');
const os = require('os');
const path = require('path');
const p = require('@clack/prompts');

const repo = path.resolve(__dirname, '..');
const indexFile = path.join(repo, '_jookoi-skill-locations.json');
const home = os.homedir();
const GLOBAL = '__global__';
const EXCLUDE = new Set(['__pycache__', 'node_modules']);
const dryRun = process.argv.includes('--dry-run');

const cancelled = (v) => {
  if (p.isCancel(v)) {
    p.cancel('Cancelled. Nothing copied.');
    process.exit(0);
  }
  return v;
};

// "~/x" is the home folder. Anything else is a plain path.
const expand = (input) => (input.startsWith('~/') ? path.join(home, input.slice(2)) : path.resolve(input));

// Case-insensitive on Windows, so one folder cannot pass as two.
const norm = (x) => {
  const r = path.resolve(x);
  return process.platform === 'win32' ? r.toLowerCase() : r;
};
const samePath = (a, b) => norm(a) === norm(b);

const isDir = (d) => {
  try {
    return fs.statSync(d).isDirectory();
  } catch {
    return false;
  }
};

const exists = (t) => {
  try {
    fs.lstatSync(t);
    return true;
  } catch {
    return false;
  }
};

const readIndex = () => {
  if (!exists(indexFile)) {
    p.cancel(`Missing ${path.basename(indexFile)} in ${repo}. Add the sources and destinations there first.`);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(indexFile, 'utf8'));
};

// Index entries whose folder is missing are warned about and left out.
const usable = (entries = [], kind) =>
  entries.flatMap((e) => {
    const dir = expand(e.path);
    if (isDir(dir)) return [{ label: e.label, dir }];
    p.log.warn(`skip ${kind} ${e.label}: ${dir} does not exist`);
    return [];
  });

// A skill is a folder that holds a SKILL.md. Anything else in the root is ignored.
const skillNames = (root) => {
  if (!isDir(root)) return [];
  return fs
    .readdirSync(root, { withFileTypes: true })
    .map((e) => e.name)
    .filter((n) => fs.existsSync(path.join(root, n, 'SKILL.md')))
    .sort();
};

// Recursive relative file list, skipping EXCLUDE names. statSync follows junctions.
const listFiles = (dir, base = dir) =>
  fs.readdirSync(dir).flatMap((name) => {
    if (EXCLUDE.has(name)) return [];
    const full = path.join(dir, name);
    return isDir(full) ? listFiles(full, base) : [path.relative(base, full)];
  });

// Same file set and same bytes. Extra files in the destination make the trees differ.
const sameTree = (a, b) => {
  const fa = listFiles(a).sort();
  const fb = listFiles(b).sort();
  if (fa.length !== fb.length || fa.some((f, i) => f !== fb[i])) return false;
  return fa.every((f) => fs.readFileSync(path.join(a, f)).equals(fs.readFileSync(path.join(b, f))));
};

// new: nothing there. replace link: junction or symlink, unlinked then replaced.
// blocked: a file is in the way, or the folder cannot be read. same: skipped. differs: replaced in full.
const statusOf = (src, dest) => {
  if (!exists(dest)) return 'new';
  const st = fs.lstatSync(dest);
  if (st.isSymbolicLink()) return 'replace link';
  if (!st.isDirectory()) return 'blocked';
  try {
    return sameTree(src, dest) ? 'same' : 'differs';
  } catch {
    return 'blocked';
  }
};

// A link is removed as a link, never followed into its target.
const removeDest = (dest) => {
  if (!exists(dest)) return;
  if (fs.lstatSync(dest).isSymbolicLink()) {
    try {
      fs.unlinkSync(dest);
    } catch {
      fs.rmdirSync(dest); // Windows directory junctions need rmdir
    }
    return;
  }
  fs.rmSync(dest, { recursive: true, force: true });
};

const keep = (f) => !EXCLUDE.has(path.basename(f));

// Stage the whole source folder beside the destination, then swap it in.
// A failed stage leaves the old destination as it was.
const replaceFolder = (src, dest) => {
  const tmp = `${dest}.copy-tmp`;
  removeDest(tmp);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  try {
    fs.cpSync(src, tmp, { recursive: true, dereference: true, filter: keep });
  } catch (e) {
    removeDest(tmp);
    throw e;
  }
  removeDest(dest);
  fs.renameSync(tmp, dest);
};

async function main() {
  p.intro('copy:skill');

  const index = readIndex();
  const sources = usable(index.sources, 'source');
  if (!sources.length) {
    p.cancel('No indexed source folder exists.');
    process.exit(1);
  }

  const sourceLabel = cancelled(
    await p.select({
      message: 'Source',
      options: sources.map((s) => ({ value: s.label, label: s.label, hint: s.dir })),
    }),
  );
  const src = sources.find((s) => s.label === sourceLabel);

  const names = skillNames(src.dir);
  if (!names.length) {
    p.cancel(`No skills (folders with SKILL.md) in ${src.dir}`);
    process.exit(1);
  }
  // Which other indexed sources hold each skill name. Shown as a hint, never merged.
  const owners = new Map();
  for (const s of sources) {
    for (const n of skillNames(s.dir)) owners.set(n, [...(owners.get(n) ?? []), s.label]);
  }
  const chosen = cancelled(
    await p.autocompleteMultiselect({
      message: `Skills from ${src.label} (type to filter, space toggles, enter confirms)`,
      options: names.map((n) => {
        const others = (owners.get(n) ?? []).filter((l) => l !== src.label);
        return { value: n, label: n, hint: others.length ? `also in ${others.join(', ')}` : undefined };
      }),
      required: true,
    }),
  );

  // Destination options: each indexed folder, plus the one global option that expands to both home folders.
  const options = usable(index.destinations, 'destination').map((d) => ({ label: d.label, dirs: [d.dir] }));
  if ((index.global ?? []).length) {
    options.push({ label: `global (${index.global.join(' + ')})`, dirs: index.global.map(expand) });
  }
  const offered = options
    .map((o) => ({ ...o, dirs: o.dirs.filter((d) => !samePath(d, src.dir)) }))
    .filter((o) => o.dirs.length);
  const picked = cancelled(
    await p.multiselect({
      message: 'Copy into',
      options: offered.map((o, i) => ({ value: i, label: o.label, hint: o.dirs.join('  ') })),
      required: true,
    }),
  );

  const targets = [];
  for (const i of picked) {
    for (const d of offered[i].dirs) if (!targets.some((t) => samePath(t, d))) targets.push(d);
  }

  const actions = [];
  for (const d of targets) {
    for (const s of chosen) {
      const from = path.join(src.dir, s);
      const to = path.join(d, s);
      actions.push({ from, to, status: statusOf(from, to) });
    }
  }

  const width = Math.max(...actions.map((a) => a.status.length));
  p.note(actions.map((a) => `${a.status.padEnd(width)}  ${a.to}`).join('\n'), `Plan: ${actions.length} copy(ies)`);

  if (dryRun) {
    p.outro('Dry run: nothing written.');
    return;
  }

  const blocked = actions.filter((a) => a.status === 'blocked');
  if (blocked.length) p.log.warn(`${blocked.length} blocked row(s) skipped. Remove the file in the way, then rerun.`);

  const todo = actions.filter((a) => a.status !== 'same' && a.status !== 'blocked');
  if (!todo.length) {
    p.outro('Nothing to copy. Every destination already matches the source, or is blocked.');
    return;
  }
  const replaced = todo.filter((a) => a.status !== 'new').length;
  const go = cancelled(
    await p.confirm({
      message: `Copy ${todo.length} folder(s)? ${replaced} existing folder(s) replaced in full; files not in the source are removed.`,
      initialValue: false,
    }),
  );
  if (!go) {
    p.cancel('No changes made.');
    return;
  }

  let failed = 0;
  for (const a of todo) {
    try {
      replaceFolder(a.from, a.to);
      p.log.success(`${a.status} -> ${a.to}`);
    } catch (e) {
      failed++;
      p.log.error(`${a.to}: ${e.message}`);
    }
  }
  if (failed) process.exitCode = 1;
  p.outro(`Done: ${todo.length - failed} copied${failed ? `, ${failed} failed` : ''}`);
}

main();
