#!/usr/bin/env node
// jookoi-paper-trail — context-file mechanics.
// Design: _architecture/plans/2026-08-30-jookoi-paper-trail.md
// Spec:   ../references/file-formats.md, ../references/pipeline.md
//
// Usage:
//   jookoi-doc note "<text>" [--title "<t>"]        append to the current-state session log
//   jookoi-doc backlog "<title>" "<body>" [--status OPEN]
//   jookoi-doc flush [--title "<t>"]                session log -> progress.md
//   jookoi-doc rotate                               progress.md -> archive/, update index
//   jookoi-doc status                               line counts, cap headroom, pending flush
//   jookoi-doc stale                                updated: vs folder's last commit
//   jookoi-doc check                                validate managed files against the spec
//   jookoi-doc new-decision "<title>"               next NNN from template
//   jookoi-doc new-plan "<topic>"                   dated plan file from template
//
// Global flags: --private (operate on _jookoi-architecture/), --root <path>, --dry-run
//
// This script owns mechanics only: dating, heading grammar, newest-first insertion,
// duplicate detection, the line cap, roll-off, archive-index pointers, NNN allocation,
// updated: bumping, template instantiation, the session marker. Judgement -- what
// happened, where it belongs, and the standing-summary rewrite -- stays with the model.

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const CAP = 200;
const ENTRY_RE = /^## (\d{4}-\d{2}-\d{2}) — (.+)$/;
const TEMPLATES = path.join(__dirname, "..", "assets", "templates");
const BACKLOG_STATUS = ["OPEN", "DESIGNED", "BLOCKED", "MOVED", "DROPPED"];

class Refusal extends Error {}
function refuse(file, detail) {
  throw new Refusal(`${file}: ${detail}`);
}

// ---------------------------------------------------------------- environment

function repoRoot(explicit) {
  if (explicit) return path.resolve(explicit);
  try {
    return execSync("git rev-parse --show-toplevel", { encoding: "utf8" }).trim();
  } catch {
    return process.cwd();
  }
}

function archDir(root, priv) {
  return path.join(root, priv ? "_jookoi-architecture" : "_architecture");
}

function today() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
}

function template(name) {
  return fs.readFileSync(path.join(TEMPLATES, name), "utf8");
}

function readOrTemplate(file, templateName) {
  if (fs.existsSync(file)) return fs.readFileSync(file, "utf8");
  return template(templateName);
}

// ------------------------------------------------------------------- parsing

// Splits a document body into `## YYYY-MM-DD — Title` entries. Text before the
// first entry is returned as `preamble`. Refuses on a `##` heading that is not an
// entry, since that means the file is not in the shape this script can move.
function parseEntries(text, file, { allowOtherHeadings = false } = {}) {
  const lines = text.split(/\r?\n/);
  const entries = [];
  const preamble = [];
  let current = null;

  lines.forEach((line, i) => {
    const m = line.match(ENTRY_RE);
    if (m) {
      if (current) entries.push(current);
      current = { date: m[1], title: m[2], body: [], line: i + 1 };
      return;
    }
    if (/^## /.test(line) && !allowOtherHeadings) {
      refuse(file, `line ${i + 1}: heading is not a dated entry -- expected "## YYYY-MM-DD — Title", got ${JSON.stringify(line)}`);
    }
    (current ? current.body : preamble).push(line);
  });
  if (current) entries.push(current);

  entries.forEach((e) => {
    e.body = e.body.join("\n").replace(/^\n+|\n+$/g, "");
  });
  return { preamble: preamble.join("\n").replace(/\n+$/, ""), entries };
}

function renderEntries(entries) {
  return entries.map((e) => `## ${e.date} — ${e.title}\n\n${e.body}`).join("\n\n");
}

// Newest first; stable within a date so an earlier flush keeps its position.
function sortEntries(entries) {
  return entries.slice().sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

// current-state.md is the one file with two differently-behaving blocks.
function splitCurrentState(text, file) {
  const sIdx = text.indexOf("\n## Standing summary");
  const lIdx = text.indexOf("\n## Session log");
  if (sIdx === -1) refuse(file, 'missing "## Standing summary" heading');
  if (lIdx === -1) refuse(file, 'missing "## Session log" heading');
  if (lIdx < sIdx) refuse(file, '"## Session log" appears before "## Standing summary"');
  return {
    head: text.slice(0, sIdx).replace(/\n+$/, ""),
    summary: text.slice(sIdx + 1, lIdx).replace(/^## Standing summary\n?/, "").replace(/\n+$/, ""),
    log: text.slice(lIdx + 1).replace(/^## Session log\n?/, "").replace(/^\n+|\n+$/g, ""),
  };
}

function joinCurrentState(parts) {
  return [
    parts.head,
    "",
    "## Standing summary",
    "",
    parts.summary.trim(),
    "",
    "## Session log",
    "",
    parts.log.trim(),
    "",
  ].join("\n").replace(/\n{3,}/g, "\n\n");
}

// ---------------------------------------------------------------- similarity

// Trigram Jaccard. Cheap, order-insensitive enough for "is this the same entry
// written twice", which is the only thing it is used for.
function trigrams(s) {
  const t = s.toLowerCase().replace(/\s+/g, " ").trim();
  const out = new Set();
  for (let i = 0; i < t.length - 2; i++) out.add(t.slice(i, i + 3));
  return out;
}

function similarity(a, b) {
  const A = trigrams(a);
  const B = trigrams(b);
  if (A.size === 0 || B.size === 0) return a.trim() === b.trim() ? 1 : 0;
  let inter = 0;
  A.forEach((g) => { if (B.has(g)) inter++; });
  return inter / (A.size + B.size - inter);
}

// ------------------------------------------------------------------ commands

function cmdNote(ctx, [text], opts) {
  if (!text) refuse("note", "needs text");
  const file = path.join(ctx.arch, "current-state.md");
  const parts = splitCurrentState(readOrTemplate(file, "current-state.md"), file);
  const { entries } = parseEntries(parts.log, file);

  const date = today();
  const title = opts.title || text.split(/[.\n]/)[0].trim().slice(0, 72);
  const body = opts.title ? text : text;

  const dup = entries.find((e) => similarity(e.body, body) >= 0.95);
  if (dup) return ctx.report(`skipped as duplicate of the ${dup.date} session-log entry`);

  entries.push({ date, title, body });
  parts.log = renderEntries(sortEntries(entries));
  ctx.write(file, joinCurrentState(parts));
  ctx.report(`session log += "${title}"`);
}

function cmdBacklog(ctx, [title, body], opts) {
  if (!title || !body) refuse("backlog", "needs a title and a body");
  const status = (opts.status || "OPEN").toUpperCase();
  if (!BACKLOG_STATUS.includes(status)) {
    refuse("backlog", `Status ${status} is outside ${BACKLOG_STATUS.join(" | ")}`);
  }
  const file = path.join(ctx.arch, "backlog.md");
  const text = readOrTemplate(file, "backlog.md").replace(/\n+$/, "");
  if (new RegExp(`^## ${title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "m").test(text)) {
    refuse(file, `an item titled "${title}" already exists -- edit it rather than adding a second`);
  }
  ctx.write(file, `${text}\n\n## ${title}\n\nStatus: ${status}\n\n${body}\n`);
  ctx.report(`backlog += "${title}" (${status})`);
}

function cmdFlush(ctx, _args, opts) {
  const csFile = path.join(ctx.arch, "current-state.md");
  if (!fs.existsSync(csFile)) refuse(csFile, "does not exist -- nothing to flush");
  const parts = splitCurrentState(fs.readFileSync(csFile, "utf8"), csFile);
  const { entries: logEntries } = parseEntries(parts.log, csFile);

  if (logEntries.length === 0) {
    ctx.report("session log is empty -- nothing to flush");
    return;
  }

  // Merge the session's entries into one per date, chronological within a date.
  const byDate = new Map();
  logEntries.slice().reverse().forEach((e) => {
    if (!byDate.has(e.date)) byDate.set(e.date, { date: e.date, title: opts.title || e.title, bodies: [] });
    byDate.get(e.date).bodies.push(e.body);
  });

  const pFile = path.join(ctx.arch, "progress.md");
  const pText = readOrTemplate(pFile, "progress.md");
  const { preamble, entries: pEntries } = parseEntries(pText, pFile);

  const moved = [];
  const dropped = [];

  byDate.forEach((m) => {
    const existing = pEntries.find((e) => e.date === m.date);
    const target = existing || { date: m.date, title: m.title, body: "" };
    m.bodies.forEach((b) => {
      const against = [target.body, ...pEntries.map((e) => e.body)];
      if (against.some((x) => x && similarity(x, b) >= 0.95)) {
        dropped.push(`${m.date}: ${b.split("\n")[0].slice(0, 60)}`);
        return;
      }
      target.body = target.body ? `${target.body}\n\n${b}` : b;
      moved.push(`${m.date}: ${b.split("\n")[0].slice(0, 60)}`);
    });
    if (!existing && target.body) pEntries.push(target);
  });

  ctx.write(pFile, `${preamble}\n\n${renderEntries(sortEntries(pEntries))}\n`);

  parts.log = "";
  ctx.write(csFile, joinCurrentState(parts));

  ctx.report(`flushed ${moved.length} entr${moved.length === 1 ? "y" : "ies"} into progress.md`);
  moved.forEach((m) => ctx.report(`  moved   ${m}`));
  dropped.forEach((d) => ctx.report(`  dropped ${d} (duplicate)`));

  const lines = fs.existsSync(pFile) ? fs.readFileSync(pFile, "utf8").split("\n").length : 0;
  if (lines > CAP) {
    ctx.report(`progress.md is ${lines}/${CAP} lines -- rotating`);
    cmdRotate(ctx, [], {});
  }

  writeMarker(ctx, opts);

  ctx.report("");
  ctx.report("STILL NEEDS YOU:");
  ctx.report("  1. Rewrite ## Standing summary in current-state.md against the flushed entries.");
  ctx.report("  2. Route unfinished + newly surfaced work: sequenced -> next-steps.md, unscoped -> backlog.md.");
  ctx.report("     Remove next-steps.md items the flushed entries show as done.");
}

function cmdRotate(ctx, _args, _opts) {
  const pFile = path.join(ctx.arch, "progress.md");
  if (!fs.existsSync(pFile)) return ctx.report("progress.md does not exist -- nothing to rotate");
  const pText = fs.readFileSync(pFile, "utf8");
  if (pText.split("\n").length <= CAP) {
    return ctx.report(`progress.md is ${pText.split("\n").length}/${CAP} lines -- under cap, no rotation`);
  }

  const { preamble, entries } = parseEntries(pText, pFile);
  const kept = sortEntries(entries);
  const rolled = [];

  // Oldest first off the end; never split an entry to make the number.
  while (kept.length > 1) {
    const candidate = `${preamble}\n\n${renderEntries(kept)}\n`;
    if (candidate.split("\n").length <= CAP) break;
    rolled.push(kept.pop());
  }

  const finalText = `${preamble}\n\n${renderEntries(kept)}\n`;
  if (finalText.split("\n").length > CAP) {
    refuse(pFile, `cannot reach the ${CAP}-line cap without splitting a single entry (${kept[0].date} — ${kept[0].title}); shorten it by hand`);
  }
  if (rolled.length === 0) return ctx.report("nothing to roll off");

  const archDirPath = path.join(ctx.arch, "archive");
  if (!ctx.dryRun) fs.mkdirSync(archDirPath, { recursive: true });

  const byMonth = new Map();
  rolled.forEach((e) => {
    const m = e.date.slice(0, 7);
    if (!byMonth.has(m)) byMonth.set(m, []);
    byMonth.get(m).push(e);
  });

  byMonth.forEach((es, month) => {
    const mFile = path.join(archDirPath, `${month}.md`);
    const mText = fs.existsSync(mFile)
      ? fs.readFileSync(mFile, "utf8")
      : template("archive-month.md").replace(/YYYY-MM/g, month);
    const parsed = parseEntries(mText, mFile);
    const all = sortEntries([...parsed.entries, ...es]);
    ctx.write(mFile, `${parsed.preamble}\n\n${renderEntries(all)}\n`);
    ctx.report(`archived ${es.length} entr${es.length === 1 ? "y" : "ies"} to archive/${month}.md`);
  });

  ctx.write(pFile, finalText);
  updateArchiveIndex(ctx, archDirPath);
}

function updateArchiveIndex(ctx, archDirPath) {
  const iFile = path.join(archDirPath, "index.md");
  const iText = readOrTemplate(iFile, "archive-index.md");
  const head = iText.split("\n").slice(0, 2).join("\n");

  const months = fs.existsSync(archDirPath)
    ? fs.readdirSync(archDirPath).filter((f) => /^\d{4}-\d{2}\.md$/.test(f)).sort().reverse()
    : [];

  const existing = new Map();
  iText.split("\n").forEach((l) => {
    const m = l.match(/^- \*\*`(\d{4}-\d{2}\.md)`\*\* — [^:]*: (.*)$/);
    if (m) existing.set(m[1], m[2]);
  });

  const pointers = months.map((f) => {
    const parsed = parseEntries(fs.readFileSync(path.join(archDirPath, f), "utf8"), f);
    const dates = parsed.entries.map((e) => e.date).sort();
    const range = dates.length ? (dates[0] === dates[dates.length - 1] ? dates[0] : `${dates[0]} to ${dates[dates.length - 1]}`) : "empty";
    const summary = existing.get(f) || parsed.entries.map((e) => e.title).slice(0, 3).join("; ") || "no entries";
    return `- **\`${f}\`** — ${range}: ${summary}`;
  });

  ctx.write(iFile, `${head}\n\n${pointers.join("\n")}\n`);
  ctx.report(`archive/index.md now lists ${pointers.length} file${pointers.length === 1 ? "" : "s"}`);
}

function cmdStatus(ctx) {
  const files = ["current-state.md", "progress.md", "next-steps.md", "backlog.md", "architecture.md"];
  files.forEach((f) => {
    const p = path.join(ctx.arch, f);
    if (!fs.existsSync(p)) return ctx.report(`${f.padEnd(20)} absent`);
    const n = fs.readFileSync(p, "utf8").split("\n").length;
    const cap = f === "progress.md" ? ` / ${CAP}${n > CAP ? "  OVER CAP -- run rotate" : ""}` : "";
    ctx.report(`${f.padEnd(20)} ${n} lines${cap}`);
  });

  const csFile = path.join(ctx.arch, "current-state.md");
  if (fs.existsSync(csFile)) {
    const parts = splitCurrentState(fs.readFileSync(csFile, "utf8"), csFile);
    const { entries } = parseEntries(parts.log, csFile);
    ctx.report("");
    ctx.report(entries.length
      ? `UNFLUSHED: ${entries.length} session-log entr${entries.length === 1 ? "y" : "ies"} -- run flush`
      : "session log clean");
  }

  const marker = markerPath(ctx, {});
  if (marker) ctx.report(fs.existsSync(marker) ? "flush marker present for this session" : "no flush marker for this session");
}

function cmdStale(ctx) {
  const out = execSync("git ls-files", { cwd: ctx.root, encoding: "utf8" }).split("\n");
  const contexts = out.filter((f) => /(^|\/)(_jookoi-)?CONTEXT\.md$/.test(f));
  if (contexts.length === 0) return ctx.report("no context files found -- nothing to check");

  let flagged = 0;
  contexts.forEach((rel) => {
    const abs = path.join(ctx.root, rel);
    const m = fs.readFileSync(abs, "utf8").match(/^updated:\s*(\d{4}-\d{2}-\d{2})/m);
    if (!m) { ctx.report(`${rel}  NO updated: LINE`); flagged++; return; }
    const dir = path.dirname(rel);
    let committed;
    try {
      committed = execSync(`git log -1 --format=%cd --date=short -- "${dir}"`, { cwd: ctx.root, encoding: "utf8" }).trim();
    } catch { return; }
    if (committed && committed > m[1]) {
      ctx.report(`${rel}  updated ${m[1]}, folder committed ${committed}  LIKELY STALE`);
      flagged++;
    }
  });
  ctx.report("");
  ctx.report(flagged ? `${flagged} of ${contexts.length} flagged` : `${contexts.length} checked, none stale`);
}

function cmdCheck(ctx) {
  let problems = 0;
  const say = (m) => { problems++; ctx.report(m); };

  const csFile = path.join(ctx.arch, "current-state.md");
  if (fs.existsSync(csFile)) {
    try {
      const parts = splitCurrentState(fs.readFileSync(csFile, "utf8"), csFile);
      parseEntries(parts.log, csFile);
    } catch (e) { say(String(e.message)); }
  }

  ["progress.md"].forEach((f) => {
    const p = path.join(ctx.arch, f);
    if (!fs.existsSync(p)) return;
    try { parseEntries(fs.readFileSync(p, "utf8"), p); } catch (e) { say(String(e.message)); }
  });

  const bFile = path.join(ctx.arch, "backlog.md");
  if (fs.existsSync(bFile)) {
    const text = fs.readFileSync(bFile, "utf8");
    const heads = [...text.matchAll(/^## (.+)$/gm)];
    heads.forEach((h) => {
      const after = text.slice(h.index).split("\n").slice(1, 4).join("\n");
      const s = after.match(/^Status:\s*(\S+)/m);
      if (!s) say(`backlog.md: "${h[1]}" has no Status: line`);
      else if (!BACKLOG_STATUS.includes(s[1])) say(`backlog.md: "${h[1]}" Status ${s[1]} outside ${BACKLOG_STATUS.join(" | ")}`);
    });
  }

  const dDir = path.join(ctx.arch, "plans", "decisions");
  if (fs.existsSync(dDir)) {
    const required = ["Problem", "Options considered", "Decision", "Why not the alternatives", "Next step"];
    fs.readdirSync(dDir).filter((f) => f.endsWith(".md")).forEach((f) => {
      const text = fs.readFileSync(path.join(dDir, f), "utf8");
      required.forEach((sec) => {
        if (!new RegExp(`^## ${sec}$`, "m").test(text)) say(`plans/decisions/${f}: missing "## ${sec}"`);
      });
    });
  }

  ctx.report("");
  ctx.report(problems ? `${problems} problem${problems === 1 ? "" : "s"} -- fix by hand; this script will not rewrite them` : "all managed files conform");
}

function cmdNewDecision(ctx, [title]) {
  if (!title) refuse("new-decision", "needs a title");
  const dir = path.join(ctx.arch, "plans", "decisions");
  if (!ctx.dryRun) fs.mkdirSync(dir, { recursive: true });
  const used = fs.existsSync(dir)
    ? fs.readdirSync(dir).map((f) => parseInt((f.match(/^(\d{3})-/) || [])[1], 10)).filter(Number.isInteger)
    : [];
  const n = String((used.length ? Math.max(...used) : 0) + 1).padStart(3, "0");
  const file = path.join(dir, `${n}-${slugify(title)}.md`);
  const body = template("decision-record.md")
    .replace("# Decision NNN — <Title>", `# Decision ${n} — ${title}`)
    .replace("Date: YYYY-MM-DD", `Date: ${today()}`);
  ctx.write(file, body);
  ctx.report(`created plans/decisions/${path.basename(file)}`);
}

function cmdNewPlan(ctx, [topic]) {
  if (!topic) refuse("new-plan", "needs a topic");
  const dir = path.join(ctx.arch, "plans");
  if (!ctx.dryRun) fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${today()}-${slugify(topic)}.md`);
  if (fs.existsSync(file)) refuse(file, "already exists");
  const body = template("plan-session.md")
    .replace("# <Title>", `# ${topic}`)
    .replace("Session: YYYY-MM-DD.", `Session: ${today()}.`);
  ctx.write(file, body);
  ctx.report(`created plans/${path.basename(file)}`);
}

// -------------------------------------------------------------------- marker

function markerPath(ctx, opts) {
  const id = opts.session || process.env.CLAUDE_SESSION_ID || process.env.JOOKOI_SESSION_ID;
  if (!id) return null;
  return path.join(ctx.root, "_jookoi-architecture", `.jookoi-doc-ran-${id}`);
}

function writeMarker(ctx, opts) {
  const p = markerPath(ctx, opts);
  if (!p) return;
  if (!ctx.dryRun) {
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, `${new Date().toISOString()}\n`);
  }
}

// ---------------------------------------------------------------------- main

const COMMANDS = {
  note: cmdNote,
  backlog: cmdBacklog,
  flush: cmdFlush,
  rotate: cmdRotate,
  status: cmdStatus,
  stale: cmdStale,
  check: cmdCheck,
  "new-decision": cmdNewDecision,
  "new-plan": cmdNewPlan,
};

function main(argv) {
  const cmd = argv[0];
  if (!cmd || cmd === "--help" || cmd === "-h" || !COMMANDS[cmd]) {
    const usage = fs.readFileSync(__filename, "utf8").split("\n").slice(5, 18).map((l) => l.replace(/^\/\/ ?/, "")).join("\n");
    console.log(usage);
    process.exit(cmd && !COMMANDS[cmd] ? 1 : 0);
  }

  const opts = { private: false, dryRun: false };
  const positional = [];
  for (let i = 1; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--private") opts.private = true;
    else if (a === "--dry-run") opts.dryRun = true;
    else if (a === "--root") opts.root = argv[++i];
    else if (a === "--title") opts.title = argv[++i];
    else if (a === "--status") opts.status = argv[++i];
    else if (a === "--session") opts.session = argv[++i];
    else if (a.startsWith("--")) { console.error(`Unknown flag: ${a}`); process.exit(1); }
    else positional.push(a);
  }

  const root = repoRoot(opts.root);
  const lines = [];
  const ctx = {
    root,
    arch: archDir(root, opts.private),
    dryRun: opts.dryRun,
    report: (m) => lines.push(m),
    write: (file, content) => {
      if (opts.dryRun) { lines.push(`[dry-run] would write ${path.relative(root, file)}`); return; }
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, content.replace(/\n{3,}/g, "\n\n"));
    },
  };

  try {
    COMMANDS[cmd](ctx, positional, opts);
    lines.forEach((l) => console.log(l));
  } catch (e) {
    if (e instanceof Refusal) {
      console.error(`REFUSED -- ${e.message}`);
      console.error("Nothing was written. Fix the file by hand; this script does not rewrite content it did not write.");
      process.exit(2);
    }
    throw e;
  }
}

main(process.argv.slice(2));
