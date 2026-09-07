#!/usr/bin/env node
// Rename a markdown doc and rewrite every reference to it repo-wide.
//
// Problem this solves: renaming a doc by hand means grepping the whole repo
// for every relative link and bare-path mention pointing at the old name and
// fixing each one manually. This does that mechanically, one shot, and
// reports what it changed.
//
// Usage:
//   node utility-scripts/rename-doc.js <old-path> <new-path> [<old-path> <new-path> ...] [--dry-run]
//
// Paths are repo-root-relative (e.g. ai-tooling-crash-course-for-developers/topics/foo.md).
// Give as many old/new pairs as you like in one invocation — all renames run,
// then link rewriting happens once, in a single scan, so a later rename in
// the same batch can still find references that used to point at an earlier
// pair's old name (unlikely, but handled either way since git mv runs first
// and rewriting runs against final paths).
//
// What it rewrites, per .md file repo-wide:
//   - the full old repo-relative path, wherever it appears verbatim
//   - the bare old basename, wherever it appears as a whole path segment
//     (covers ./foo.md, ../foo.md, topics/foo.md, or a plain backticked
//     mention, regardless of which relative prefix a given link used)
//
// --dry-run prints what would change without touching git or files.

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

function gitRepoRoot() {
  try {
    return execSync("git rev-parse --show-toplevel", { encoding: "utf8" }).trim();
  } catch {
    fail("Not inside a git checkout.");
  }
}

function parseArgs(argv) {
  const dryRun = argv.includes("--dry-run");
  const positional = argv.filter((a) => a !== "--dry-run");
  if (positional.length === 0 || positional.length % 2 !== 0) {
    fail(
      "Usage: node utility-scripts/rename-doc.js <old-path> <new-path> [<old-path> <new-path> ...] [--dry-run]"
    );
  }
  const pairs = [];
  for (let i = 0; i < positional.length; i += 2) {
    pairs.push({ oldRel: positional[i], newRel: positional[i + 1] });
  }
  return { pairs, dryRun };
}

function listMarkdownFiles(root) {
  const out = execSync("git ls-files -- \"*.md\"", { cwd: root, encoding: "utf8" });
  return out.split("\n").filter(Boolean);
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function main() {
  const root = gitRepoRoot();
  const { pairs, dryRun } = parseArgs(process.argv.slice(2));

  for (const { oldRel, newRel } of pairs) {
    const oldAbs = path.join(root, oldRel);
    const newAbs = path.join(root, newRel);
    if (!fs.existsSync(oldAbs)) fail(`Old path doesn't exist: ${oldRel}`);
    if (fs.existsSync(newAbs)) fail(`New path already exists: ${newRel}`);
  }

  console.log(dryRun ? "[dry-run] Renames:" : "Renames:");
  for (const { oldRel, newRel } of pairs) {
    console.log(`  ${oldRel} -> ${newRel}`);
    if (!dryRun) {
      fs.mkdirSync(path.dirname(path.join(root, newRel)), { recursive: true });
      execSync(`git mv "${oldRel}" "${newRel}"`, { cwd: root });
    }
  }

  const files = listMarkdownFiles(root);
  const report = [];

  for (const relFile of files) {
    const absFile = path.join(root, relFile);
    if (!fs.existsSync(absFile)) continue; // just-moved file itself, if new path
    let content = fs.readFileSync(absFile, "utf8");
    let fileChanged = 0;

    for (const { oldRel, newRel } of pairs) {
      const oldBasename = path.basename(oldRel);
      const newBasename = path.basename(newRel);

      // Full repo-relative path, verbatim.
      const fullPathRe = new RegExp(escapeRegex(oldRel), "g");
      const fullMatches = content.match(fullPathRe);
      if (fullMatches) {
        content = content.replace(fullPathRe, newRel);
        fileChanged += fullMatches.length;
      }

      // Bare basename as a whole path segment: preceded by start/`/`/`(`/backtick,
      // followed by end/`)`/backtick/whitespace/punctuation — not part of a longer name.
      const basenameRe = new RegExp(
        `(?<![\\w.-])${escapeRegex(oldBasename)}(?![\\w.-])`,
        "g"
      );
      const baseMatches = content.match(basenameRe);
      if (baseMatches) {
        content = content.replace(basenameRe, newBasename);
        fileChanged += baseMatches.length;
      }
    }

    if (fileChanged > 0) {
      report.push({ file: relFile, count: fileChanged });
      if (!dryRun) fs.writeFileSync(absFile, content, "utf8");
    }
  }

  console.log(dryRun ? "\n[dry-run] Would rewrite references in:" : "\nRewrote references in:");
  if (report.length === 0) {
    console.log("  (no references found)");
  } else {
    for (const { file, count } of report) {
      console.log(`  ${file} (${count} occurrence${count === 1 ? "" : "s"})`);
    }
  }
}

main();
