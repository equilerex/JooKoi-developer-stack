#!/usr/bin/env node
// jnote: append one entry to _architecture/process-improvement/logs.jsonl
// Usage:
//   jnote "content text" [--type=note] [--source=path] [--session=id] [--agent=name] [--model=name]
//   jnote --json '{"type":"inefficiency","content":"...","source":"..."}'
'use strict';

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const LOG_PATH = path.join(REPO_ROOT, '_architecture', 'process-improvement', 'logs.jsonl');

const VALID_TYPES = new Set([
  'note',
  'inefficiency',
  'confusion',
  'lost-context',
  'useful-pattern',
  'follow-up',
]);

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const m = arg.match(/^--([a-zA-Z]+)(?:=(.*))?$/);
    if (m) {
      const key = m[1];
      const val = m[2] !== undefined ? m[2] : argv[++i];
      out[key] = val;
    } else {
      out._.push(arg);
    }
  }
  return out;
}

function fail(msg) {
  process.stderr.write(`jnote: ${msg}\n`);
  process.exit(1);
}

function buildEntry(args) {
  let entry;

  if (args.json !== undefined) {
    try {
      entry = JSON.parse(args.json);
    } catch (e) {
      fail(`--json is not valid JSON: ${e.message}`);
    }
  } else {
    const content = args._.join(' ').trim();
    if (!content) fail('missing note content (pass as an argument or via --json)');
    entry = {
      content,
      type: args.type,
      source: args.source,
      sessionId: args.session,
      agent: args.agent,
      model: args.model,
    };
  }

  if (!entry.content || typeof entry.content !== 'string' || !entry.content.trim()) {
    fail('entry requires non-empty "content" (markdown string)');
  }

  entry.type = entry.type || 'note';
  if (!VALID_TYPES.has(entry.type)) {
    fail(`unknown type "${entry.type}". Valid: ${[...VALID_TYPES].join(', ')}`);
  }

  entry.ts = entry.ts || new Date().toISOString();

  // Drop unset optional fields so the JSONL stays minimal.
  const ordered = { ts: entry.ts, type: entry.type, content: entry.content };
  for (const key of ['source', 'sessionId', 'agent', 'model']) {
    if (entry[key]) ordered[key] = entry[key];
  }
  return ordered;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const entry = buildEntry(args);

  fs.mkdirSync(path.dirname(LOG_PATH), { recursive: true });
  fs.appendFileSync(LOG_PATH, JSON.stringify(entry) + '\n', 'utf8');

  process.stdout.write(`jnote: logged [${entry.type}] to ${path.relative(REPO_ROOT, LOG_PATH)}\n`);
}

main();
