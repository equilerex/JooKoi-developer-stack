#!/usr/bin/env node
'use strict';
// Git-and-checks step around the operations layer (obsidian-mcp). Reads the MCP audit log from where the last run
// stopped, checks every vault path an agent wrote against HEAD, reverts what breaks the rules, then commits:
// first a snapshot of everything else (owner edits that arrived through Sync), then the agent writes, with the
// audit entries as the commit body (provenance).
//
//   node checkpoint.js [--root <repo>] [--audit <path>] [--dry-run]
//
// Audit log default: <repo>/.ops/audit.jsonl. State: <repo>/.ops/checkpoint.json (lines already processed).
// Skips while a triage batch is open: inbox.js finish checks and commits those writes itself.
const fs = require('fs');
const path = require('path');
const L = require('./lib');
const { onlyAppended } = require('./guard');
const { redactFile } = require('./redact');

function main() {
  const opts = L.parseArgs(process.argv.slice(2), ['--root', '--audit']);
  const p = L.loadPolicy(L.findRoot(opts.root));
  const audit = path.resolve(p.root, opts.audit || '.ops/audit.jsonl');
  const stateFile = path.join(p.root, '.ops', 'checkpoint.json');
  if (!fs.existsSync(audit)) return;
  if (fs.existsSync(path.join(p.stagingDir, 'batch.json'))) return console.log('checkpoint: triage batch open, skipped');
  if (!L.hasGit(p.root)) throw new Error('no git repo at the root');

  const lines = fs.readFileSync(audit, 'utf8').split('\n').filter(Boolean);
  const state = L.readJson(stateFile, { lines: 0 });
  if (state.lines > lines.length) state.lines = 0; // log was rotated or replaced
  const entries = lines.slice(state.lines).map((l) => {
    try {
      return JSON.parse(l);
    } catch {
      return null;
    }
  }).filter((e) => e && e.path);
  if (!entries.length) return;

  const inVault = (f) => `${p.vault}/${f}`;
  const changed = (f) =>
    L.git(p.root, ['status', '--porcelain', '--', inVault(f)]).stdout.trim().length > 0;
  const headText = (f) => {
    const r = L.git(p.root, ['show', `HEAD:${inVault(f)}`], true);
    return r.status === 0 ? r.stdout : null;
  };
  const restore = (f, text) => {
    const abs = path.join(p.vaultDir, f);
    if (text === null) fs.rmSync(abs, { force: true });
    else fs.writeFileSync(abs, text);
  };

  const paths = [...new Set(entries.map((e) => e.path))].filter(changed);
  const reverted = [];
  for (const f of paths) {
    const abs = path.join(p.vaultDir, f);
    const before = headText(f);
    const now = fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : null;
    let why = null;
    // Write paths are enforced by the MCP server's own policy, so only the rules it lacks are checked here.
    if (before !== null && L.frontmatter(before).generated === true) why = 'generated file';
    else if (before !== null && now === null) why = 'deleted';
    else if (before !== null && p.append_only.includes(f) && !onlyAppended(before, now, f !== p.questions)) why = 'existing lines changed';
    if (why) {
      reverted.push(`${f} (${why})`);
      if (!opts['dry-run']) restore(f, before);
    }
  }
  const kept = paths.filter((f) => !reverted.some((r) => r.startsWith(`${f} (`)) && changed(f));
  const redacted = kept.filter((f) => f.endsWith('.md') && fs.existsSync(path.join(p.vaultDir, f)))
    .filter((f) => !opts['dry-run'] && redactFile(path.join(p.vaultDir, f)).length);

  if (opts['dry-run']) {
    console.log(`checkpoint (dry run): ${entries.length} audit entries, ${kept.length} paths to commit, reverts: ${reverted.join(', ') || 'none'}`);
    return;
  }

  const BOT = ['-c', 'user.name=vault-ops', '-c', 'user.email=vault-ops@localhost'];
  // Owner edits first, so the agent commit holds only what the audit log names.
  L.git(p.root, ['add', '-A', '--', p.vault]);
  for (const f of kept) L.git(p.root, ['reset', '-q', '--', inVault(f)]);
  if (L.git(p.root, ['diff', '--cached', '--quiet'], true).status !== 0)
    L.git(p.root, [...BOT, 'commit', '-q', '-m', 'snapshot: vault edits outside the operations layer']);
  if (kept.length) {
    L.git(p.root, ['add', '-A', '--', ...kept.map(inVault)]);
    const body = entries.filter((e) => kept.includes(e.path))
      .map((e) => `${e.timestamp} ${e.tool} ${e.path}: ${e.summary}`).join('\n');
    L.git(p.root, [...BOT, 'commit', '-q', '-m', `vault-ops: ${kept.length} files`, '-m', body]);
  }
  L.writeJson(stateFile, { lines: lines.length });
  console.log(`checkpoint: ${kept.length} files committed` +
    (reverted.length ? `, REVERTED ${reverted.join(', ')}` : '') +
    (redacted.length ? `, redacted ${redacted.join(', ')}` : ''));
  if (reverted.length) process.exitCode = 1;
}

try {
  main();
} catch (e) {
  console.error(`checkpoint: ${e.message}`);
  process.exit(1);
}
