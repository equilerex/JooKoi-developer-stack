#!/usr/bin/env node
// jookoi-paper-trail — vault sync.
// Design: _architecture/plans/2026-08-30-jookoi-paper-trail.md
//
// Usage:
//   node utility-scripts/vault-sync.js push  [--vault <path>] [--force-full] [--confirm] [--dry-run]
//   node utility-scripts/vault-sync.js pull  [--vault <path>] [--force-full] [--confirm] [--dry-run]
//
// Vault path resolution: --vault flag, else JOOKOI_VAULT_PATH env var.
// Only `_jookoi`-prefixed files/folders sync. Repo identity = the checkout's
// leaf folder name; the vault records the git remote seen on first sync and
// verifies it on every later sync, aborting on mismatch.

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

function parseArgs(argv) {
  const args = { mode: argv[0], vault: process.env.JOOKOI_VAULT_PATH, forceFull: false, confirm: false, dryRun: false };
  for (let i = 1; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--vault") args.vault = argv[++i];
    else if (a === "--force-full") args.forceFull = true;
    else if (a === "--confirm") args.confirm = true;
    else if (a === "--dry-run") args.dryRun = true;
    else { console.error(`Unknown arg: ${a}`); process.exit(1); }
  }
  return args;
}

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

function gitRepoRoot(cwd) {
  try {
    return execSync("git rev-parse --show-toplevel", { cwd, encoding: "utf8" }).trim();
  } catch {
    fail("Not inside a git checkout.");
  }
}

function gitRemoteUrl(repoRoot) {
  try {
    return execSync("git remote get-url origin", { cwd: repoRoot, encoding: "utf8" }).trim();
  } catch {
    return null;
  }
}

function isJookoiName(name) {
  return name.startsWith("_jookoi");
}

// Walk repoRoot, collecting relative paths of every `_jookoi`-prefixed file
// or directory. Once a `_jookoi`-prefixed directory is found, everything
// under it is included without re-checking each entry's own prefix.
function collectJookoiPaths(root, rel = "") {
  const abs = path.join(root, rel);
  let entries;
  try {
    entries = fs.readdirSync(abs, { withFileTypes: true });
  } catch {
    return [];
  }
  let out = [];
  for (const entry of entries) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const entryRel = rel ? path.join(rel, entry.name) : entry.name;
    if (entry.isDirectory()) {
      if (isJookoiName(entry.name)) {
        out = out.concat(collectAllFiles(root, entryRel));
      } else {
        out = out.concat(collectJookoiPaths(root, entryRel));
      }
    } else if (entry.isFile() && isJookoiName(entry.name)) {
      out.push(entryRel);
    }
  }
  return out;
}

function collectAllFiles(root, rel) {
  const abs = path.join(root, rel);
  const stat = fs.statSync(abs);
  if (stat.isFile()) return [rel];
  let out = [];
  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    out = out.concat(collectAllFiles(root, path.join(rel, entry.name)));
  }
  return out;
}

function mtimeMs(p) {
  try { return fs.statSync(p).mtimeMs; } catch { return null; }
}

function ensureDirFor(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function checkIdentity(vaultRepoDir, repoRoot, dryRun) {
  const identityFile = path.join(vaultRepoDir, ".jookoi-remote");
  const currentRemote = gitRemoteUrl(repoRoot);
  if (!fs.existsSync(identityFile)) {
    if (currentRemote) {
      if (!dryRun) {
        fs.mkdirSync(vaultRepoDir, { recursive: true });
        fs.writeFileSync(identityFile, currentRemote + "\n");
      }
      console.log(`Recorded remote for this vault entry: ${currentRemote}`);
    } else {
      console.log("No git remote on this checkout — skipping identity check (recorded on first sync from a checkout that has one).");
    }
    return;
  }
  const recorded = fs.readFileSync(identityFile, "utf8").trim();
  if (currentRemote && recorded && currentRemote !== recorded) {
    fail(
      `Identity mismatch for vault entry "${path.basename(vaultRepoDir)}":\n` +
      `  vault recorded remote: ${recorded}\n` +
      `  this checkout's remote: ${currentRemote}\n` +
      `Two different repos are sharing a leaf folder name. Resolve by hand before syncing — ` +
      `rename one checkout's mirror folder in the vault, or confirm this is the same repo and update .jookoi-remote.`
    );
  }
}

function sync({ mode, srcRoot, destRoot, forceFull, confirm, dryRun, destMustExist }) {
  const srcFiles = collectJookoiPaths(srcRoot);
  const srcSet = new Set(srcFiles);
  const added = [], updated = [], skippedNoFolder = [], conflicts = [], upToDate = [];

  for (const rel of srcFiles) {
    const srcPath = path.join(srcRoot, rel);
    const destPath = path.join(destRoot, rel);
    if (destMustExist && !fs.existsSync(path.dirname(destPath))) {
      skippedNoFolder.push(rel);
      continue;
    }
    const srcM = mtimeMs(srcPath);
    const destM = mtimeMs(destPath);
    if (destM === null) {
      added.push(rel);
      if (!dryRun) { ensureDirFor(destPath); fs.copyFileSync(srcPath, destPath); }
    } else if (srcM > destM) {
      updated.push(rel);
      if (!dryRun) fs.copyFileSync(srcPath, destPath);
    } else if (srcM < destM) {
      conflicts.push({ rel, srcM: new Date(srcM).toISOString(), destM: new Date(destM).toISOString() });
    } else {
      upToDate.push(rel);
    }
  }

  // Deletions: destination files under `_jookoi-*` paths with no source counterpart.
  let toDelete = [];
  if (fs.existsSync(destRoot)) {
    toDelete = collectJookoiPaths(destRoot).filter((rel) => !srcSet.has(rel));
  }

  console.log(`\n[${mode}] ${srcRoot} -> ${destRoot}`);
  console.log(`  added:      ${added.length}`);
  added.forEach((f) => console.log(`    + ${f}`));
  console.log(`  updated:    ${updated.length}`);
  updated.forEach((f) => console.log(`    ~ ${f}`));
  if (skippedNoFolder.length) {
    console.log(`  skipped (target folder doesn't exist): ${skippedNoFolder.length}`);
    skippedNoFolder.forEach((f) => console.log(`    . ${f}`));
  }
  if (conflicts.length) {
    console.log(`  CONFLICTS (destination newer than source — not overwritten): ${conflicts.length}`);
    conflicts.forEach((c) => console.log(`    ! ${c.rel}  (src: ${c.srcM}, dest: ${c.destM})`));
    console.log(`  Resolve by hand: keep one side's file, delete the other, then re-run sync.`);
  }
  if (toDelete.length) {
    if (forceFull) {
      console.log(`  ${confirm ? "DELETING" : "would delete (pass --confirm to actually delete)"} ${toDelete.length} file(s) missing from source:`);
      toDelete.forEach((f) => console.log(`    - ${f}`));
      if (confirm && !dryRun) {
        toDelete.forEach((f) => fs.rmSync(path.join(destRoot, f), { force: true }));
      }
    } else {
      console.log(`  ${toDelete.length} file(s) exist at destination but not source — left alone (pass --force-full --confirm to remove).`);
    }
  }
  if (dryRun) console.log("  (dry run — no files written)");
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.mode !== "push" && args.mode !== "pull") {
    fail("Usage: vault-sync.js <push|pull> [--vault <path>] [--force-full] [--confirm] [--dry-run]");
  }
  if (!args.vault) fail("No vault path. Pass --vault <path> or set JOOKOI_VAULT_PATH.");
  const repoRoot = gitRepoRoot(process.cwd());
  const repoName = path.basename(repoRoot);
  const vaultRepoDir = path.join(args.vault, "repo-mirrors", repoName);

  checkIdentity(vaultRepoDir, repoRoot, args.dryRun);

  if (args.mode === "push") {
    sync({ mode: "push", srcRoot: repoRoot, destRoot: vaultRepoDir, forceFull: args.forceFull, confirm: args.confirm, dryRun: args.dryRun, destMustExist: false });
  } else {
    sync({ mode: "pull", srcRoot: vaultRepoDir, destRoot: repoRoot, forceFull: args.forceFull, confirm: args.confirm, dryRun: args.dryRun, destMustExist: true });
  }
}

main();
