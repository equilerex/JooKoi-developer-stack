'use strict';
// Write guard for a triage batch: snapshot the vault before the model runs, check and revert after.
// Retired by the operations layer (phase 3), which enforces the same rules on every write instead.
// Used by inbox.js (batch, finish). Not a CLI of its own.
const fs = require('fs');
const path = require('path');
const { walk, matches, frontmatter, splitFrontmatter, normBody } = require('./lib');

const snapDir = (p) => path.join(p.stagingDir, 'guard');

// A full copy of the vault, minus Obsidian's own folders. Vaults are small (hundreds of KB), a copy is cheap and
// works with or without git.
function snapshot(p, stagedCaptures) {
  const dir = snapDir(p);
  fs.rmSync(dir, { recursive: true, force: true });
  for (const f of walk(p.vaultDir)) {
    const to = path.join(dir, 'vault', f);
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(path.join(p.vaultDir, f), to);
  }
  // Staged capture bodies: the model may set frontmatter, never change the text.
  const bodies = {};
  for (const f of stagedCaptures) bodies[f] = splitFrontmatter(fs.readFileSync(f, 'utf8')).body;
  fs.writeFileSync(path.join(dir, 'bodies.json'), JSON.stringify(bodies));
}

const lineCounts = (text) => {
  const c = new Map();
  for (const l of text.split(/\r?\n/)) if (l.trim()) c.set(l, (c.get(l) || 0) + 1);
  return c;
};

// The one allowed change to an existing line: closing a task, `- [ ] x` -> `- [x] x ✅ YYYY-MM-DD`.
const isClosedVersion = (open, line) => {
  const m = open.match(/^(\s*)- \[ \] (.*)$/);
  if (!m) return false;
  const head = `${m[1]}- [x] ${m[2]} ✅ `;
  return line.startsWith(head) && /^\d{4}-\d{2}-\d{2}$/.test(line.slice(head.length).trim());
};

// True when every non-empty line of `before` still appears in `after` at least as often, or (allowClose) closed.
function onlyAppended(before, after, allowClose) {
  const b = lineCounts(before);
  const a = lineCounts(after);
  const afterLines = [...a.keys()];
  for (const [l, n] of b) {
    const missing = n - (a.get(l) || 0);
    if (missing <= 0) continue;
    if (!allowClose) return false;
    const closed = afterLines.filter((x) => isClosedVersion(l, x)).reduce((s, x) => s + a.get(x), 0);
    if (closed < missing) return false;
  }
  return true;
}

// Returns { touched, reverted }: vault-relative paths the batch changed and kept, and what was undone and why.
function check(p) {
  const dir = snapDir(p);
  const snapVault = path.join(dir, 'vault');
  if (!fs.existsSync(snapVault)) throw new Error('no guard snapshot, run `inbox.js batch` first');
  const before = new Set(walk(snapVault));
  const now = new Set(walk(p.vaultDir));
  const inboxTop = (f) => f.startsWith(p.inbox + '/') && !f.slice(p.inbox.length + 1).includes('/');
  const reverted = [];
  const touched = [];
  const restore = (f) => {
    fs.mkdirSync(path.dirname(path.join(p.vaultDir, f)), { recursive: true });
    fs.copyFileSync(path.join(snapVault, f), path.join(p.vaultDir, f));
  };

  for (const f of new Set([...before, ...now])) {
    const had = before.has(f);
    const has = now.has(f);
    const oldText = had ? fs.readFileSync(path.join(snapVault, f), 'utf8') : null;
    const newText = has ? fs.readFileSync(path.join(p.vaultDir, f), 'utf8') : null;
    if (oldText === newText) continue;

    // Inbox: new files are captures arriving through sync mid-run, and edits may be the owner's. The model works
    // on staged copies and never needs the originals, so only a deletion is undone.
    if (inboxTop(f)) {
      if (!has) (restore(f), reverted.push(`${f} (capture deleted, restored)`));
      continue;
    }
    if (f === p.log) continue; // written by finish after the check

    if (!matches(p.writable, f)) {
      if (had) restore(f);
      else fs.rmSync(path.join(p.vaultDir, f));
      reverted.push(`${f} (outside the writable list)`);
      continue;
    }
    if (!has) {
      restore(f);
      reverted.push(`${f} (deleted, restored)`);
      continue;
    }
    if (had && frontmatter(oldText).generated === true) {
      restore(f);
      reverted.push(`${f} (generated file)`);
      continue;
    }
    if (had && p.append_only.includes(f) && !onlyAppended(oldText, newText, f !== p.questions)) {
      restore(f);
      reverted.push(`${f} (existing lines changed)`);
      continue;
    }
    touched.push(f);
  }

  // Staged captures: restore any body edit. Whitespace-only drift is restored silently.
  const bodies = JSON.parse(fs.readFileSync(path.join(dir, 'bodies.json'), 'utf8'));
  for (const [f, body] of Object.entries(bodies)) {
    if (!fs.existsSync(f)) continue;
    const cur = splitFrontmatter(fs.readFileSync(f, 'utf8'));
    if (cur.body === body) continue;
    fs.writeFileSync(f, cur.raw + body);
    if (normBody(cur.body) !== normBody(body)) reverted.push(`${path.basename(f)} (staged capture body edited, restored)`);
  }
  return { touched, reverted };
}

module.exports = { snapshot, check, onlyAppended };
