#!/usr/bin/env node
// Installs the global `jj` shortcut. Adds one marked block to the Windows
// PowerShell, PowerShell 7 and Git Bash profiles that loads jj.ps1 / jj.sh from
// this folder, so later edits here apply without re-running setup.
// Also adds this folder to the user PATH so CMD finds jj.cmd, and a second
// marked block in ~/.bashrc that shows terminal-welcome-screen.sh.
// Safe to re-run: the marked block is replaced, never duplicated.
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const shortcutsDir = dirname(fileURLToPath(import.meta.url));
const powerShellWrapper = join(shortcutsDir, 'jj.ps1');
const bashWrapper = join(shortcutsDir, 'jj.sh');
const welcomeScript = join(shortcutsDir, 'terminal-welcome-screen.sh');

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const upsertBlock = (profilePath, lines, blockName = 'jj') => {
  const markStart = `# >>> ${blockName} (JooKoi-developer-stack) >>>`;
  const markEnd = `# <<< ${blockName} (JooKoi-developer-stack) <<<`;
  const markedBlock = new RegExp(`${escapeRegExp(markStart)}[\\s\\S]*?${escapeRegExp(markEnd)}\\r?\\n?`, 'g');
  mkdirSync(dirname(profilePath), { recursive: true });
  const existing = existsSync(profilePath) ? readFileSync(profilePath, 'utf8').replace(markedBlock, '') : '';
  const separator = existing.length && !existing.endsWith('\n') ? '\n' : '';
  writeFileSync(profilePath, `${existing}${separator}${[markStart, ...lines, markEnd].join('\n')}\n`, 'utf8');
};

// CMD has no profile, so jj.cmd is found through the user PATH instead.
// Drops entries left behind by the old skill-toolboxes location, keeps the rest as is.
const addShortcutsToUserPath = () => {
  const script = `
    $dir = $env:JJ_SHORTCUTS_DIR
    $current = [Environment]::GetEnvironmentVariable('Path', 'User')
    $kept = @($current -split ';' | Where-Object { $_ -and $_ -notmatch 'skill-toolboxes[\\\\/]shortcuts' -and $_.TrimEnd('\\') -ne $dir.TrimEnd('\\') })
    [Environment]::SetEnvironmentVariable('Path', (($kept + $dir) -join ';'), 'User')
  `;
  const encodedScript = Buffer.from(script, 'utf16le').toString('base64');
  execSync(`powershell -NoProfile -EncodedCommand ${encodedScript}`, {
    env: { ...process.env, JJ_SHORTCUTS_DIR: shortcutsDir },
  });
};

const toGitBashPath = (windowsPath) => `/${windowsPath.replace(/^([A-Za-z]):/, (_, drive) => drive.toLowerCase()).replaceAll('\\', '/')}`;

for (const exe of ['powershell', 'pwsh']) {
  let profilePath;
  try {
    profilePath = execSync(`${exe} -NoProfile -Command "$PROFILE"`, { encoding: 'utf8' }).trim();
  } catch {
    console.warn(`jj setup: ${exe} not found, skipped.`);
    continue;
  }
  upsertBlock(profilePath, [`if (Test-Path '${powerShellWrapper}') { . '${powerShellWrapper}' }`]);
  console.log(`jj setup: ${exe} -> ${profilePath}`);
}

const bashrc = join(homedir(), '.bashrc');
const bashWrapperPath = toGitBashPath(bashWrapper);
upsertBlock(bashrc, [`[ -f "${bashWrapperPath}" ] && source "${bashWrapperPath}"`]);
console.log(`jj setup: Git Bash -> ${bashrc}`);

const welcomePath = toGitBashPath(welcomeScript);
upsertBlock(bashrc, [`[ -f "${welcomePath}" ] && source "${welcomePath}"`], 'welcome');
console.log(`jj setup: Git Bash welcome screen -> ${bashrc}`);

try {
  addShortcutsToUserPath();
  console.log('jj setup: CMD -> shortcuts folder added to the user PATH (jj.cmd)');
} catch (error) {
  console.warn(`jj setup: could not update the user PATH for CMD: ${error.message}`);
}

console.log('jj setup: done. Open a new terminal and type jj.');
