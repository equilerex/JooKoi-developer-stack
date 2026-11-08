'use strict';
// Shared helpers for the triage scripts. No dependencies.
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const pad = (n) => String(n).padStart(2, '0');

// Policy defaults. A vault's TRIAGE.md frontmatter overrides any of them.
// `vault` and `staging` are relative to the repo root, everything else to the vault folder.
const DEFAULTS = {
  vault: 'vault',
  staging: '.intake',
  inbox: 'Inbox',
  questions: 'Questions.md',
  log: '_meta/LOG.md',
  templates: 'Templates',
  append_only: [],
  writable: [],
  living: [],
  batch_size: 10,
  min_age_minutes: 5,
};

// Folders inside the vault that Obsidian itself writes. Never snapshotted, checked or committed by the guard.
const IGNORED_DIRS = new Set(['.obsidian', '.trash', '.git']);

// Repo root: --root, else walk up from the working directory to a folder holding TRIAGE.md.
function findRoot(explicit) {
  if (explicit) {
    const d = path.resolve(explicit);
    if (!fs.existsSync(path.join(d, 'TRIAGE.md'))) throw new Error(`${d} has no TRIAGE.md`);
    return d;
  }
  let d = process.cwd();
  for (;;) {
    if (fs.existsSync(path.join(d, 'TRIAGE.md'))) return d;
    const up = path.dirname(d);
    if (up === d) throw new Error('no TRIAGE.md found above the working directory, pass --root <repo>');
    d = up;
  }
}

function splitFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/);
  return m ? { head: m[1], body: text.slice(m[0].length), raw: m[0] } : { head: '', body: text, raw: '' };
}

// Flat `key: value` YAML only: scalars, booleans, numbers and JSON-style ["a", "b"] lists.
function parseFlatYaml(head) {
  const out = {};
  for (const line of head.split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if (v === 'true' || v === 'false') v = v === 'true';
    else if (/^\d+$/.test(v)) v = Number(v);
    else if ((v.startsWith('[') && v.endsWith(']')) || /^".*"$/.test(v)) {
      try {
        v = JSON.parse(v);
      } catch {
        if (v.startsWith('"')) v = v.slice(1, -1);
      }
    } else if (/^'.*'$/.test(v)) v = v.slice(1, -1);
    out[m[1]] = v;
  }
  return out;
}

const frontmatter = (text) => parseFlatYaml(splitFrontmatter(text).head);

// Set or remove (value null) frontmatter keys. The body is kept byte for byte.
function setFrontmatter(text, values) {
  const { head, body, raw } = splitFrontmatter(text);
  const lines = raw ? head.split(/\r?\n/) : [];
  for (const [k, v] of Object.entries(values)) {
    const i = lines.findIndex((l) => l.startsWith(`${k}:`));
    if (v === null) {
      if (i >= 0) lines.splice(i, 1);
      continue;
    }
    const line = v === '' ? `${k}:` : `${k}: ${typeof v === 'string' && /[:#"'\[\]{}]|^\s|\s$/.test(v) ? JSON.stringify(v) : v}`;
    if (i >= 0) lines[i] = line;
    else lines.push(line);
  }
  return `---\n${lines.join('\n')}\n---\n` + (raw ? body : body.replace(/^\n+/, ''));
}

function loadPolicy(root) {
  const fm = frontmatter(fs.readFileSync(path.join(root, 'TRIAGE.md'), 'utf8'));
  const p = { ...DEFAULTS, ...fm };
  for (const k of ['append_only', 'writable', 'living']) if (!Array.isArray(p[k])) throw new Error(`TRIAGE.md: ${k} must be a ["..."] list`);
  p.root = root;
  p.vaultDir = path.join(root, p.vault);
  p.stagingDir = path.join(root, p.staging);
  if (!fs.existsSync(p.vaultDir)) throw new Error(`vault folder ${p.vaultDir} does not exist (TRIAGE.md vault:)`);
  return p;
}

// Vault-relative posix path.
const rel = (base, f) => path.relative(base, f).split(path.sep).join('/');

// Every file under dir, vault-relative, skipping Obsidian's own folders.
function walk(dir, base = dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (!IGNORED_DIRS.has(e.name)) out.push(...walk(path.join(dir, e.name), base));
    } else if (e.isFile()) out.push(rel(base, path.join(dir, e.name)));
  }
  return out;
}

const listMd = (dir) => walk(dir).filter((f) => f.endsWith('.md')).map((f) => path.join(dir, f));

// Allowed: exact entries, or a folder prefix ending in `/`.
const matches = (list, p) => list.some((x) => (x.endsWith('/') ? p.startsWith(x) : p === x));

// A timestamp inside a filename or field: 2026-09-25-081200, 2023-10-11T16_31_49, 2024-08-25 23.41.38, 20240825-234138.
const STAMP = /(\d{4})-?(\d{2})-?(\d{2})(?:[T _-]?(\d{2})[_:.-]?(\d{2})(?:[_:.-]?(\d{2}))?)?/;
const validDate = (y, m, d) => {
  const dt = new Date(Date.UTC(+y, +m - 1, +d));
  return dt.getUTCFullYear() === +y && dt.getUTCMonth() === +m - 1 && dt.getUTCDate() === +d && +y >= 1990 && +y <= 2100;
};
function stampFrom(text) {
  const m = String(text || '').match(STAMP);
  if (!m || !validDate(m[1], m[2], m[3])) return null;
  const date = `${m[1]}-${m[2]}-${m[3]}`;
  if (m[4] === undefined || +m[4] > 23 || +m[5] > 59 || +(m[6] || 0) > 59) return { date, time: null };
  return { date, time: `${m[4]}${m[5]}${m[6] || '00'}` };
}

const localStamp = (d) => ({
  date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
  time: `${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`,
});

// Next free `YYYY-MM-DD-HHmmss.md`, stepping one second at a time across everything already taken.
function freeName(stamp, taken) {
  const [y, mo, d] = stamp.date.split('-').map(Number);
  const t = stamp.time || '120000';
  let dt = new Date(Date.UTC(y, mo - 1, d, +t.slice(0, 2), +t.slice(2, 4), +t.slice(4, 6)));
  for (let i = 0; i < 86400; i++) {
    const name = `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}-${pad(dt.getUTCHours())}${pad(dt.getUTCMinutes())}${pad(dt.getUTCSeconds())}.md`;
    if (!taken.has(name)) return name;
    dt = new Date(dt.getTime() + 1000);
  }
  throw new Error(`no free capture name near ${stamp.date}`);
}

const normBody = (s) => s.replace(/\r\n/g, '\n').replace(/[ \t]+$/gm, '').trim();

function git(root, args, allowFail = false) {
  const r = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  if (r.status !== 0 && !allowFail) throw new Error(`git ${args.join(' ')} failed: ${r.stderr || r.stdout}`);
  return r;
}
const hasGit = (root) => git(root, ['rev-parse', '--show-toplevel'], true).status === 0;

const BOT = ['-c', 'user.name=vault-triage', '-c', 'user.email=vault-triage@localhost'];

// Commit everything under the vault folder. Returns the short hash, or null when there was nothing to commit.
function commitVault(p, message) {
  git(p.root, ['add', '-A', '--', p.vault]);
  if (git(p.root, ['diff', '--cached', '--quiet', '--', p.vault], true).status === 0) return null;
  git(p.root, [...BOT, 'commit', '-m', message, '--', p.vault]);
  return git(p.root, ['rev-parse', '--short', 'HEAD']).stdout.trim();
}

function parseArgs(argv, valueFlags = []) {
  const opts = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) opts._.push(a);
    else if (valueFlags.includes(a)) {
      if (i + 1 >= argv.length) throw new Error(`${a} needs a value`);
      opts[a.slice(2)] = argv[++i];
    } else opts[a.slice(2)] = true;
  }
  return opts;
}

const readJson = (f, fallback) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : fallback);
const writeJson = (f, v) => {
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, JSON.stringify(v, null, 2) + '\n');
};

module.exports = {
  pad, findRoot, loadPolicy, splitFrontmatter, parseFlatYaml, frontmatter, setFrontmatter, rel, walk, listMd,
  matches, stampFrom, localStamp, freeName, normBody, git, hasGit, commitVault, parseArgs, readJson, writeJson,
};
