#!/usr/bin/env node
'use strict';
// Import mode: stage historic note files (Google Keep export, other dumps, single files) as captures in the queue.
// Usage: node import.js <file-or-folder>... [--label <source name>] [--root <repo>] [--include-archived] [--dry-run]
// Writes redacted copies to <staging>/queue/, never into the vault's Inbox. The source files are left alone.
// Never overwrites a file. Skips exact duplicates already queued.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { findRoot, loadPolicy, listMd, splitFrontmatter, parseFlatYaml, normBody, pad, stampFrom, freeName } = require('./lib');
const { redact } = require('./redact');

const TEXT_EXT = new Set(['.md', '.txt', '.markdown']);

function parseArgs(argv) {
  const opts = { inputs: [], dryRun: false, includeArchived: false, root: null, label: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--include-archived') opts.includeArchived = true;
    else if (a === '--root' || a === '--label') {
      if (i + 1 >= argv.length) throw new Error(`${a} needs a value`);
      opts[a.slice(2)] = argv[++i];
    } else if (a.startsWith('--')) throw new Error(`unknown option ${a}`);
    else opts.inputs.push(a);
  }
  if (!opts.inputs.length) throw new Error('give at least one file or folder to import');
  return opts;
}

function collectInputs(inputs) {
  const files = [];
  const skipped = [];
  const walk = (p) => {
    const st = fs.statSync(p);
    if (st.isDirectory()) {
      for (const name of fs.readdirSync(p).sort()) walk(path.join(p, name));
    } else if (TEXT_EXT.has(path.extname(p).toLowerCase())) files.push(p);
    else skipped.push({ file: p, reason: 'not a text note (.md/.txt)' });
  };
  for (const p of inputs) {
    if (!fs.existsSync(p)) skipped.push({ file: p, reason: 'does not exist' });
    else walk(p);
  }
  return { files, skipped };
}

// Content date: the latest edit the source records. Time only when a source gives one for that same day.
function captureStamp(fm, file) {
  const candidates = [fm.edited, fm.updated, fm.modified, fm.date, fm.created].map(stampFrom).filter(Boolean);
  const idStamp = stampFrom(fm.id) || stampFrom(path.basename(file));
  const chosen = candidates[0] || idStamp;
  if (chosen) {
    let time = chosen.time;
    if (!time && idStamp && idStamp.date === chosen.date) time = idStamp.time;
    return { date: chosen.date, time, source: candidates[0] ? 'frontmatter' : 'filename' };
  }
  const mt = fs.statSync(file).mtime;
  return {
    date: `${mt.getFullYear()}-${pad(mt.getMonth() + 1)}-${pad(mt.getDate())}`,
    time: null,
    source: 'file-mtime',
  };
}

const hash = (body) => crypto.createHash('sha256').update(normBody(body)).digest('hex');

function existingCaptures(dir) {
  const names = new Set();
  const hashes = new Set();
  for (const f of listMd(dir)) {
    names.add(path.basename(f));
    hashes.add(hash(splitFrontmatter(fs.readFileSync(f, 'utf8')).body));
  }
  return { names, hashes };
}

const yamlStr = (s) => JSON.stringify(String(s));
const listText = (v) => (Array.isArray(v) ? v.join(', ') : String(v));

function buildCapture(fm, body, meta) {
  const label = meta.label || 'import';
  const t = meta.stamp.time;
  const head = ['---', 'triage:', 'source: import', `source_file: ${yamlStr(meta.sourceFile)}`, `source_label: ${yamlStr(label)}`];
  head.push(`captured: ${meta.stamp.date}${t ? ` ${t.slice(0, 2)}:${t.slice(2, 4)}` : ''}`);
  if (!t) head.push('time_known: false');
  head.push(`provenance: ${yamlStr(`(src ${label} "${meta.sourceFile}")`)}`);
  if (meta.secret) head.push('secret: true');
  if (meta.stamp.source === 'file-mtime') head.push('date_source: file-mtime');
  head.push('---', '');
  // Context the source kept outside the body: title and labels become the first lines, so triage sees them.
  const ctx = [];
  if (fm.title) ctx.push(`Title: ${listText(fm.title)}`);
  if (fm.labels || fm.tags) ctx.push(`Labels: ${listText(fm.labels || fm.tags)}`);
  return head.join('\n') + (ctx.length ? ctx.join('\n') + '\n\n' : '') + body.replace(/^\n+/, '').replace(/\s+$/, '') + '\n';
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const p = loadPolicy(findRoot(opts.root));
  const stage = path.join(p.stagingDir, 'queue');
  const { files, skipped } = collectInputs(opts.inputs);
  const { names, hashes } = existingCaptures(stage);
  const created = [];
  const errors = [];

  for (const file of files) {
    try {
      const raw = fs.readFileSync(file, 'utf8').replace(/^﻿/, '');
      const { head, body } = splitFrontmatter(raw);
      const fm = parseFlatYaml(head);
      if (!opts.includeArchived && (fm.archived === true || fm.trashed === true)) {
        skipped.push({ file, reason: fm.trashed === true ? 'trashed' : 'archived' });
        continue;
      }
      if (!normBody(body) && !fm.title) {
        skipped.push({ file, reason: 'empty' });
        continue;
      }
      const stamp = captureStamp(fm, file);
      const red = redact(body);
      const text = buildCapture(fm, red.text, { sourceFile: path.basename(file), label: opts.label, stamp, secret: red.hits.length > 0 });
      // Compare what the capture body will be, so importing the same file twice is caught.
      const h = hash(splitFrontmatter(text).body);
      if (hashes.has(h) || hashes.has(hash(body))) {
        skipped.push({ file, reason: 'duplicate of an existing capture' });
        continue;
      }
      const name = freeName(stamp, names);
      if (!opts.dryRun) {
        fs.mkdirSync(stage, { recursive: true });
        fs.writeFileSync(path.join(stage, name), text, { encoding: 'utf8', flag: 'wx' });
      }
      names.add(name);
      hashes.add(h);
      created.push({ file, name, dateSource: stamp.source, timeKnown: Boolean(stamp.time), secret: [...new Set(red.hits)] });
    } catch (e) {
      errors.push({ file, reason: e.message });
    }
  }

  const tag = opts.dryRun ? '[dry-run] would create' : 'created';
  for (const c of created) {
    const notes = [c.dateSource !== 'frontmatter' ? `date from ${c.dateSource}` : '', c.timeKnown ? '' : 'time unknown', c.secret.length ? `secret: ${c.secret.join(', ')}` : ''].filter(Boolean);
    console.log(`${tag} ${c.name}  <- ${path.basename(c.file)}${notes.length ? `  (${notes.join(', ')})` : ''}`);
  }
  for (const s of skipped) console.log(`skipped ${s.file}: ${s.reason}`);
  for (const e of errors) console.error(`ERROR ${e.file}: ${e.reason}`);
  console.log(`\n${created.length} ${opts.dryRun ? 'to create' : 'created'}, ${skipped.length} skipped, ${errors.length} errors. Staged in: ${stage}`);
  if (errors.length) process.exitCode = 1;
}

try {
  main();
} catch (e) {
  console.error(`import: ${e.message}`);
  process.exit(1);
}
