#!/usr/bin/env node
// Installs a global `jnote` shortcut for PowerShell and Git Bash, pointed at
// this repo's utility-scripts/jnote.js by absolute path. Windows Terminal and
// VS Code's integrated terminal both host these same shells/profiles, so no
// separate setup is needed for them.
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '..');
const JNOTE_JS = path.join(REPO_ROOT, 'utility-scripts', 'jnote.js');
const MARK_START = '# >>> jnote (JooKoi-developer-stack) >>>';
const MARK_END = '# <<< jnote (JooKoi-developer-stack) <<<';

function upsertBlock(filePath, block) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  let existing = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
  const re = new RegExp(`${MARK_START}[\\s\\S]*?${MARK_END}\\n?`, 'g');
  existing = existing.replace(re, '');
  const trimmed = existing.length && !existing.endsWith('\n') ? existing + '\n' : existing;
  fs.writeFileSync(filePath, trimmed + block + '\n', 'utf8');
}

function setupPowerShell() {
  const block = [
    MARK_START,
    `function jnote { node "${JNOTE_JS}" @args }`,
    MARK_END,
  ].join('\n');

  // Windows PowerShell 5.1 and PowerShell 7 (pwsh) keep separate $PROFILE
  // paths, and either or both may be the one a given terminal launches.
  for (const exe of ['powershell', 'pwsh']) {
    let profilePath;
    try {
      profilePath = execSync(`${exe} -NoProfile -Command "$PROFILE"`, { encoding: 'utf8' }).trim();
    } catch (e) {
      console.warn(`jnote setup: ${exe} not found or $PROFILE unresolved. Skipping.`);
      continue;
    }
    upsertBlock(profilePath, block);
    console.log(`jnote setup: ${exe} function installed in ${profilePath}`);
  }
}

function toGitBashPath(winPath) {
  // C:\repos\foo -> /c/repos/foo
  return '/' + winPath.replace(/^([A-Za-z]):/, (_, d) => d.toLowerCase()).replace(/\\/g, '/');
}

function setupGitBash() {
  const bashrc = path.join(os.homedir(), '.bashrc');
  const unixPath = toGitBashPath(JNOTE_JS);
  const block = [
    MARK_START,
    `jnote() { node "${unixPath}" "$@"; }`,
    MARK_END,
  ].join('\n');
  upsertBlock(bashrc, block);
  console.log(`jnote setup: Git Bash function installed in ${bashrc}`);
}

function main() {
  if (!fs.existsSync(JNOTE_JS)) {
    console.error(`jnote setup: expected ${JNOTE_JS} to exist. Aborting.`);
    process.exit(1);
  }
  setupPowerShell();
  setupGitBash();
  console.log('jnote setup: done. Restart your terminal(s) (or re-source $PROFILE / .bashrc) then run: jnote "test note"');
}

main();
