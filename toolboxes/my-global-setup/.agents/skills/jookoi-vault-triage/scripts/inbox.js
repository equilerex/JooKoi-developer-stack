#!/usr/bin/env node
'use strict';
// Mechanical half of vault triage: stage captures as redacted copies, hand out batches, check and close them.
// The model triages the staged copies between `batch` and `finish`. See SKILL.md for the loop.
//
//   node inbox.js stage  [--min-age <minutes>] [--no-commit]   copy Inbox captures into the queue, redacted
//   node inbox.js batch  [--size <n>]                           next batch, guard snapshot
//   node inbox.js finish [--note "<summary>"] [--no-commit]     guard check, close captures, log, commit
//   node inbox.js dump   [--file <f>]                           write pasted text (stdin or file) as a capture
//   node inbox.js mark   <staged capture> done|unresolved [--reason "<why>"]
//   node inbox.js status
// Every command takes --root <repo>; default is the nearest folder above holding TRIAGE.md.
const fs = require('fs');
const path = require('path');
const L = require('./lib');
const { redact, redactFile } = require('./redact');
const guard = require('./guard');

const queueDir = (p) => path.join(p.stagingDir, 'queue');
const batchFile = (p) => path.join(p.stagingDir, 'batch.json');
const inboxDir = (p) => path.join(p.vaultDir, p.inbox);
const now = () => new Date();
const stampText = (s) => (s.time ? `${s.date} ${s.time.slice(0, 2)}:${s.time.slice(2, 4)}` : s.date);

function queued(p) {
  const out = [];
  const dir = queueDir(p);
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir).filter((n) => n.endsWith('.md')).sort()) {
    const f = path.join(dir, name);
    out.push({ f, name, fm: L.frontmatter(fs.readFileSync(f, 'utf8')) });
  }
  return out;
}

// Keeps a capture holding a secret out of git: local-only ignore, never committed, never pushed.
function excludeFromGit(p, name) {
  if (!L.hasGit(p.root)) return;
  const gitDir = L.git(p.root, ['rev-parse', '--absolute-git-dir']).stdout.trim();
  const f = path.join(gitDir, 'info', 'exclude');
  const line = `/${p.vault}/${p.inbox}/**/${name}`;
  const cur = fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : '';
  if (cur.split(/\r?\n/).includes(line)) return;
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.appendFileSync(f, (cur && !cur.endsWith('\n') ? '\n' : '') + line + '\n');
  if (L.git(p.root, ['ls-files', '--error-unmatch', '--', `${p.vault}/${p.inbox}/${name}`], true).status === 0)
    console.log(`warning: ${name} holds a secret and is already in git history`);
}

// Capture time: the filename (YYYY-MM-DD-HHmmss), else a `created:` field, else the file's mtime (reported).
// Sync sets mtime to arrival on this machine, so mtime is the last resort.
function captureStamp(file, fm) {
  const fromName = L.stampFrom(path.basename(file, '.md'));
  if (fromName) return { ...fromName, source: 'filename' };
  const fromField = L.stampFrom(fm.created);
  if (fromField) return { ...fromField, source: 'created' };
  return { ...L.localStamp(fs.statSync(file).mtime), source: 'file-mtime' };
}

function stage(p, opts) {
  const dir = inboxDir(p);
  if (!fs.existsSync(dir)) return console.log(`no ${p.inbox}/ folder, nothing to stage`);
  const minAge = Number(opts['min-age'] ?? p.min_age_minutes) * 60000;
  const inQueue = new Set(queued(p).map((q) => q.fm.source_file));
  const taken = new Set(queued(p).map((q) => q.name));
  const picked = [];
  let held = 0;
  let young = 0;

  for (const name of fs.readdirSync(dir).filter((n) => n.endsWith('.md')).sort()) {
    const f = path.join(dir, name);
    if (!fs.statSync(f).isFile()) continue;
    const text = fs.readFileSync(f, 'utf8');
    const fm = L.frontmatter(text);
    if (fm.triage === 'done') held++;
    else if (inQueue.has(`${p.inbox}/${name}`)) continue;
    else if (now() - fs.statSync(f).mtimeMs < minAge) young++;
    else picked.push({ f, name, text, fm });
  }

  // Secrets first, so the snapshot commit never contains them.
  for (const c of picked) {
    c.red = redact(c.text);
    if (c.red.hits.length) excludeFromGit(p, c.name);
  }
  const git = L.hasGit(p.root) && !opts['no-commit'];
  let snap = null;
  if (git && picked.length) snap = L.commitVault(p, 'snapshot: vault before triage') || L.git(p.root, ['rev-parse', '--short', 'HEAD']).stdout.trim();

  fs.mkdirSync(queueDir(p), { recursive: true });
  for (const c of picked) {
    const s = captureStamp(c.f, c.fm);
    const secret = c.red.hits.length > 0;
    const base = path.basename(c.name, '.md');
    const qname = L.freeName(s, taken);
    taken.add(qname);
    const fields = {
      triage: '',
      unresolved: null,
      source: c.fm.source || 'inbox',
      source_file: `${p.inbox}/${c.name}`,
      captured: stampText(s),
      time_known: s.time ? null : false,
      date_source: s.source === 'file-mtime' ? 'file-mtime' : null,
      provenance: secret || !snap ? `(src ${base})` : `(src ${base} @${snap})`,
      secret: secret ? true : null,
    };
    fs.writeFileSync(path.join(queueDir(p), qname), L.setFrontmatter(c.red.text, fields), { flag: 'wx' });
    if (secret) fs.writeFileSync(c.f, L.setFrontmatter(c.text, { secret: true }));
    console.log(`staged ${qname} <- ${c.name}${secret ? `  (secret: ${[...new Set(c.red.hits)].join(', ')})` : ''}${s.source === 'file-mtime' ? '  (date from file mtime)' : ''}`);
  }
  console.log(`\n${picked.length} staged, ${young} still being edited, ${held} held (triaged, waiting on the owner)${snap ? `, snapshot @${snap}` : ''}. Queue: ${queued(p).filter((q) => !q.fm.triage).length}`);
}

function batch(p, opts) {
  if (fs.existsSync(batchFile(p))) throw new Error('a batch is open, run `finish` first');
  const size = Number(opts.size ?? p.batch_size);
  const files = queued(p).filter((q) => !q.fm.triage).slice(0, size);
  guard.snapshot(p, files.map((q) => q.f));
  L.writeJson(batchFile(p), { started: now().toISOString(), files: files.map((q) => q.f) });
  const d = L.localStamp(now());
  console.log(`Run date ${d.date} (bookkeeping only). Vault: ${p.vaultDir}`);
  if (!files.length) return console.log('No captures. Act on answered questions only, then run finish.');
  console.log(`Triage these ${files.length} staged captures (set \`triage:\` in each one's frontmatter):`);
  for (const q of files) console.log(`- ${q.f}  captured ${q.fm.captured}  ${q.fm.provenance}${q.fm.secret ? '  SECRET REDACTED' : ''}`);
}

function finish(p, opts) {
  const b = L.readJson(batchFile(p), null);
  if (!b) throw new Error('no open batch, run `batch` first');
  const { touched, reverted } = guard.check(p);

  // Output net: nothing the batch wrote may hold a secret.
  const redacted = touched.filter((f) => f.endsWith('.md')).filter((f) => redactFile(path.join(p.vaultDir, f)).length);

  const noCommit = opts['no-commit'] || !L.hasGit(p.root);
  const count = { done: 0, unresolved: 0, pending: 0, held: 0 };
  for (const f of b.files) {
    if (!fs.existsSync(f)) continue;
    const text = fs.readFileSync(f, 'utf8');
    const fm = L.frontmatter(text);
    const orig = fm.source !== 'import' ? path.join(p.vaultDir, fm.source_file) : null;
    const move = (to) => {
      fs.mkdirSync(path.dirname(to), { recursive: true });
      fs.renameSync(f, to);
    };
    if (fm.triage === 'done' && reverted.length) {
      // Part of the filing may have been undone: requeue, the next pass dedupes against what stayed.
      fs.writeFileSync(f, L.setFrontmatter(text, { triage: '' }));
      count.pending++;
    } else if (fm.triage === 'done') {
      count.done++;
      if (fm.secret) count.held++;
      if (!orig) {
        if (fm.secret) move(path.join(p.stagingDir, 'held', path.basename(f)));
        else fs.rmSync(f);
        continue;
      }
      if (fs.existsSync(orig)) {
        const o = fs.readFileSync(orig, 'utf8');
        if (fm.secret || noCommit) fs.writeFileSync(orig, L.setFrontmatter(o, { triage: 'done' }));
        else fs.rmSync(orig);
      }
      fs.rmSync(f);
    } else if (fm.triage === 'unresolved') {
      count.unresolved++;
      if (!orig) {
        move(path.join(p.stagingDir, 'unresolved', path.basename(f)));
        continue;
      }
      if (fs.existsSync(orig)) {
        const to = path.join(inboxDir(p), '_unresolved', path.basename(orig));
        fs.mkdirSync(path.dirname(to), { recursive: true });
        fs.writeFileSync(to, L.setFrontmatter(fs.readFileSync(orig, 'utf8'), { triage: 'unresolved', unresolved: fm.unresolved || 'see staged copy' }));
        fs.rmSync(orig);
      }
      fs.rmSync(f);
    } else count.pending++;
  }

  const d = L.localStamp(now());
  const line =
    `- ${stampText(d)}: ${b.files.length} captures (${count.done} done, ${count.unresolved} unresolved, ${count.pending} pending, ${count.held} held for a secret)` +
    (touched.length ? `; touched ${touched.join(', ')}` : '') +
    (reverted.length ? `; REVERTED ${reverted.join(', ')}` : '') +
    (opts.note ? `; ${opts.note}` : '');
  const log = path.join(p.vaultDir, p.log);
  fs.mkdirSync(path.dirname(log), { recursive: true });
  const cur = fs.existsSync(log) ? fs.readFileSync(log, 'utf8') : '';
  fs.appendFileSync(log, (cur && !cur.endsWith('\n') ? '\n' : '') + line + '\n');

  const hash = noCommit ? null : L.commitVault(p, `triage: ${count.done} captures`);
  fs.rmSync(batchFile(p));
  fs.rmSync(path.join(p.stagingDir, 'guard'), { recursive: true, force: true });

  console.log(line.slice(2));
  if (redacted.length) console.log(`redacted in output: ${redacted.join(', ')}`);
  if (hash) console.log(`committed @${hash}`);
  console.log(`queue: ${queued(p).filter((q) => !q.fm.triage).length} left`);
  if (reverted.length) process.exitCode = 1;
}

function dump(p, opts) {
  const text = opts.file ? fs.readFileSync(opts.file, 'utf8') : fs.readFileSync(0, 'utf8');
  if (!text.trim()) throw new Error('nothing to dump');
  const dir = inboxDir(p);
  fs.mkdirSync(dir, { recursive: true });
  const name = L.freeName(L.localStamp(now()), new Set(fs.readdirSync(dir)));
  fs.writeFileSync(path.join(dir, name), `---\ntriage:\nsource: dump\n---\n${text.replace(/\s+$/, '')}\n`, { flag: 'wx' });
  console.log(`${p.inbox}/${name}. Stage it with: stage --min-age 0`);
}

// Sets a staged capture's triage status, so a run that writes the vault through MCP needs no file edit tools.
function mark(p, opts) {
  const [, name, value] = opts._;
  if (!name || !['done', 'unresolved'].includes(value)) throw new Error('usage: mark <staged capture> done|unresolved [--reason "<why>"]');
  const f = path.join(queueDir(p), path.basename(name).replace(/(\.md)?$/, '.md'));
  if (!fs.existsSync(f)) throw new Error(`not in the queue: ${path.basename(f)}`);
  if (value === 'unresolved' && !opts.reason) throw new Error('unresolved needs --reason');
  fs.writeFileSync(f, L.setFrontmatter(fs.readFileSync(f, 'utf8'), { triage: value, unresolved: value === 'unresolved' ? opts.reason : null }));
  console.log(`${path.basename(f)}: triage ${value}`);
}

function status(p) {
  const q = queued(p);
  const dir = inboxDir(p);
  const inbox = fs.existsSync(dir) ? fs.readdirSync(dir).filter((n) => n.endsWith('.md')) : [];
  const held = inbox.filter((n) => L.frontmatter(fs.readFileSync(path.join(dir, n), 'utf8')).triage === 'done');
  console.log(`inbox: ${inbox.length - held.length} captures, ${held.length} held (${held.join(', ') || 'none'})`);
  console.log(`queue: ${q.filter((x) => !x.fm.triage).length} waiting`);
  console.log(`batch: ${fs.existsSync(batchFile(p)) ? 'open, run finish' : 'none open'}`);
}

try {
  const opts = L.parseArgs(process.argv.slice(2), ['--root', '--min-age', '--size', '--note', '--file', '--reason']);
  const cmd = opts._[0];
  const commands = { stage, batch, finish, dump, mark, status };
  if (!commands[cmd]) throw new Error(`usage: inbox.js ${Object.keys(commands).join('|')} [options]`);
  commands[cmd](L.loadPolicy(L.findRoot(opts.root)), opts);
} catch (e) {
  console.error(`inbox: ${e.message}`);
  process.exit(1);
}
