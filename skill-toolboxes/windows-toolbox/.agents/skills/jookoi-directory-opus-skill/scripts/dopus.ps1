<#
.SYNOPSIS
  Helper for agents working with Directory Opus 13: locate, back up, restore, diff, run commands, stop/start.
  Windows PowerShell 5.1, no dependencies.

.USAGE
  powershell -NoProfile -ExecutionPolicy Bypass -File dopus.ps1 <action> [options]
  help                              print this usage (also when no action is given)

  info                              program/config paths, version, running state (JSON)
  backup   [-Label x]               copy the whole config folder to a dated backup, prints its path
  backups                           list backups, newest first
  diff     -From <backup>           files added/removed/changed in config since that backup.
                                    -From takes a full path or just the backup folder name (see: backups)
  restore  -From <backup> [-File <relative path>]
                                    whole restore needs Opus stopped (robocopy /MIR). -File restores one file
  cmd      -Command "<opus command line>" | -CommandFile <file>
                                    run an internal command in the active Lister via dopusrt /acmd.
                                    Use -CommandFile (one line of UTF-8 text) when the command has double quotes:
                                    shells strip them from -Command. Waits -WaitMs (1500), then reports
                                    any new Opus dialog and exits 2
  ui       -Query <text>            where does this appear in the installed menus/toolbars? Matches button labels
                                    and command lines in Buttons\*.dop. Prints "Settings > Toolbars > ..." paths with the
                                    on-screen label text (version-exact, includes the user's customizations)
  kb       -Query <words> [-Top 3]  search the knowledge base (references/kb): prints the best matching entries
                                    (all words must appear; heading and user-words weigh more) and lists further hits
  prefs    -Query <text>            which Preferences page holds this option? Searches the installed Preferences
                                    search cache and prints "Category / Page : matching option label"
  dialogs  [-Close]                 list open Opus dialogs (errors, prompts). -Close: Abort error prompts, Cancel the rest
  stop     [-TimeoutSec 30]         graceful exit (Close PROGRAM), waits until dopus.exe is gone
  start                             start dopus.exe
  install-script -Path <file>       copy a .js/.vbs add-in into Script AddIns (auto-loads, hot-reloads)
  remove-script  -Name <file name>  delete an add-in from Script AddIns (unloads)
  audit                             inspect setup state (pristine/customized), companion tools, passive usage history, and telemetry (JSON)
  apply-wizard -ConfigFile <json>   apply Setup/Optimization Wizard choices at the file + silent command level (backs up, stops, edits XML, restarts, persists)
  telemetry-on                      install JooKoiTelemetry.js into Script AddIns to log navigation/UI/tab habits
  telemetry-off                     remove JooKoiTelemetry.js from Script AddIns

  Overrides: -ProgramDir, -ConfigDir, or env DOPUS_PROGRAM_DIR, DOPUS_CONFIG_DIR, DOPUS_BACKUP_DIR.
#>
param(
    [Parameter(Position = 0)]
    [ValidateSet('help', 'info', 'backup', 'backups', 'diff', 'restore', 'cmd', 'ui', 'prefs', 'kb', 'dialogs', 'stop', 'start', 'install-script', 'remove-script', 'audit', 'apply-wizard', 'telemetry-on', 'telemetry-off')]
    [string]$Action,
    [string]$Label = 'manual',
    [string]$From,
    [string]$File,
    [string]$Command,
    [string]$CommandFile,
    [string]$ConfigFile,
    [string]$Query,
    [int]$Top = 3,
    [string]$Path,
    [string]$Name,
    [int]$TimeoutSec = 30,
    [int]$WaitMs = 1500,
    [switch]$Close,
    [string]$ProgramDir = $env:DOPUS_PROGRAM_DIR,
    [string]$ConfigDir = $env:DOPUS_CONFIG_DIR
)

$ErrorActionPreference = 'Stop'

# No action (or 'help'): print the usage header and exit 0. Agents run non-interactively, so never prompt.
if (-not $Action -or $Action -eq 'help') {
    $source = [IO.File]::ReadAllText($PSCommandPath, [Text.Encoding]::UTF8)
    $start = $source.IndexOf('.USAGE')
    $end = $source.IndexOf('#>', $start)
    Write-Output ('Usage (run through powershell -NoProfile -ExecutionPolicy Bypass -File <this file> <action> [options]):')
    Write-Output $source.Substring($start + 6, $end - $start - 6).TrimEnd()
    Write-Output 'Errors go to stderr with exit code 1. Data goes to stdout.'
    exit 0
}

function Resolve-ProgramDir {
    if ($ProgramDir) { return $ProgramDir }
    $appPath = 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\dopus.exe'
    if (Test-Path $appPath) {
        $registered = (Get-ItemProperty $appPath).Path
        if ($registered -and (Test-Path (Join-Path $registered 'dopus.exe'))) { return $registered }
    }
    $default = Join-Path $env:ProgramFiles 'GPSoftware\Directory Opus'
    if (Test-Path (Join-Path $default 'dopus.exe')) { return $default }
    return $null
}

function Resolve-ConfigDir {
    if ($ConfigDir) { return $ConfigDir }
    $default = Join-Path $env:APPDATA 'GPSoftware\Directory Opus'
    if (Test-Path (Join-Path $default 'ConfigFiles')) { return $default }
    return $null
}

function Get-BackupRoot {
    if ($env:DOPUS_BACKUP_DIR) { return $env:DOPUS_BACKUP_DIR }
    return (Join-Path $env:LOCALAPPDATA 'jookoi-directory-opus-skill\backups')
}

# -From accepts a full path or the bare backup folder name that `backups` and `backup` print.
function Resolve-BackupFolder([string]$from) {
    if (-not $from) { throw 'Pass -From <backup folder> (see: backups).' }
    if (Test-Path $from) { return (Resolve-Path $from).Path }
    $byName = Join-Path (Get-BackupRoot) $from
    if (Test-Path $byName) { return (Resolve-Path $byName).Path }
    throw "Backup '$from' not found. Run 'backups' to list them."
}

function Require([string]$value, [string]$what) {
    if (-not $value) { throw "$what not found. Ask the user where Directory Opus is installed, then pass -ProgramDir / -ConfigDir." }
    return $value
}

function Test-OpusRunning { return [bool](Get-Process -Name dopus -ErrorAction SilentlyContinue) }

function Start-OpusDetached {
    $program = Require (Resolve-ProgramDir) 'Program folder'
    $exe = Join-Path $program 'dopus.exe'
    $openPath = if ($env:USERPROFILE -and (Test-Path $env:USERPROFILE)) { $env:USERPROFILE } else { 'C:\' }
    Start-Process -FilePath $exe -ArgumentList "`"$openPath`"" | Out-Null
}

function Invoke-OpusCommand([string]$line) {
    $rt = Join-Path (Require (Resolve-ProgramDir) 'Program folder') 'dopusrt.exe'
    # Do not use Start-Process -Wait or -WindowStyle Hidden: dopusrt.exe is already a GUI-subsystem binary,
    # and -Wait in PowerShell 5.1 waits on child processes (dopus.exe + crashhandler).
    $process = Start-Process -FilePath $rt -ArgumentList "/acmd $line" -PassThru
    [void]$process.WaitForExit(5000)
    if ($process.HasExited) { return $process.ExitCode }
    return 0
}

# dopusrt gives no feedback. Errors and prompts surface as modal dialogs (window class #32770) owned by dopus.exe,
# so the helper reads them from the window list.
Add-Type -TypeDefinition @'
using System; using System.Text; using System.Runtime.InteropServices; using System.Collections.Generic;
public class OpusDialog { public long Handle; public string Title; public string Text; public string[] Buttons; }
public static class OpusWindows {
    delegate bool EnumProc(IntPtr h, IntPtr l);
    [DllImport("user32.dll")] static extern bool EnumWindows(EnumProc f, IntPtr l);
    [DllImport("user32.dll")] static extern bool EnumChildWindows(IntPtr p, EnumProc f, IntPtr l);
    [DllImport("user32.dll")] static extern uint GetWindowThreadProcessId(IntPtr h, out uint pid);
    [DllImport("user32.dll")] static extern bool IsWindowVisible(IntPtr h);
    [DllImport("user32.dll", CharSet = CharSet.Unicode)] static extern int GetClassName(IntPtr h, StringBuilder s, int n);
    [DllImport("user32.dll", CharSet = CharSet.Unicode)] static extern int GetWindowText(IntPtr h, StringBuilder s, int n);
    [DllImport("user32.dll")] static extern IntPtr SendMessage(IntPtr h, uint msg, IntPtr w, IntPtr l);
    static string ClassOf(IntPtr h) { var s = new StringBuilder(256); GetClassName(h, s, 256); return s.ToString(); }
    static string TextOf(IntPtr h) { var s = new StringBuilder(2048); GetWindowText(h, s, 2048); return s.ToString(); }
    public static List<OpusDialog> Dialogs(uint[] pids) {
        var found = new List<OpusDialog>();
        EnumWindows((h, l) => {
            uint pid; GetWindowThreadProcessId(h, out pid);
            if (Array.IndexOf(pids, pid) < 0 || !IsWindowVisible(h) || ClassOf(h) != "#32770") return true;
            var texts = new List<string>(); var buttons = new List<string>();
            EnumChildWindows(h, (child, l2) => {
                string text = TextOf(child), cls = ClassOf(child);
                if (text.Length == 0) return true;
                if (cls == "Static") texts.Add(text); else if (cls.EndsWith("button", StringComparison.OrdinalIgnoreCase)) buttons.Add(text.Replace("&", ""));
                return true; }, IntPtr.Zero);
            found.Add(new OpusDialog { Handle = h.ToInt64(), Title = TextOf(h), Text = string.Join(" ", texts.ToArray()), Buttons = buttons.ToArray() });
            return true; }, IntPtr.Zero);
        return found;
    }
    // Abort on error prompts so nothing half-finished continues, otherwise the dialog's own Cancel (WM_CLOSE).
    public static void Dismiss(long handle) {
        IntPtr h = new IntPtr(handle); IntPtr abort = IntPtr.Zero;
        EnumChildWindows(h, (child, l) => { if (TextOf(child).Replace("&", "") == "Abort") { abort = child; return false; } return true; }, IntPtr.Zero);
        if (abort != IntPtr.Zero) SendMessage(abort, 0x00F5, IntPtr.Zero, IntPtr.Zero); // BM_CLICK
        else SendMessage(h, 0x0010, IntPtr.Zero, IntPtr.Zero); // WM_CLOSE
    }
}
'@

function Get-OpusDialogs {
    $pids = [uint32[]]@(Get-Process -Name dopus -ErrorAction SilentlyContinue | ForEach-Object { $_.Id })
    if ($pids.Count -eq 0) { return @() }
    return @([OpusWindows]::Dialogs($pids))
}

function Format-OpusDialog($dialog) { return "$($dialog.Title): $($dialog.Text) [buttons: $($dialog.Buttons -join ', ')]" }

switch ($Action) {
    'info' {
        $program = Resolve-ProgramDir
        $config = Resolve-ConfigDir
        $version = $null
        if ($program) { $version = (Get-Item (Join-Path $program 'dopus.exe')).VersionInfo.ProductVersion }
        [pscustomobject]@{
            programDir   = $program
            version      = $version
            running      = Test-OpusRunning
            configDir    = $config
            localDataDir = (Join-Path $env:LOCALAPPDATA 'GPSoftware\Directory Opus')
            backupRoot   = Get-BackupRoot
        } | ConvertTo-Json
    }
    'backup' {
        $config = Require (Resolve-ConfigDir) 'Config folder'
        $safeLabel = ($Label -replace '[^\w\-]', '_')
        $target = Join-Path (Get-BackupRoot) ((Get-Date -Format 'yyyyMMdd-HHmmss') + "-$safeLabel")
        New-Item -ItemType Directory -Force -Path $target | Out-Null
        # /E copies subfolders, /XD Logs skips live logs (not config), /R:1 /W:1 avoid retry stalls, /NJH.. keep output quiet.
        robocopy $config $target /E /XD Logs /R:1 /W:1 /NJH /NJS /NFL /NDL | Out-Null
        if ($LASTEXITCODE -ge 8) { throw "robocopy failed with exit code $LASTEXITCODE" }
        $count = (Get-ChildItem $target -Recurse -File).Count
        Write-Output "backup: $target ($count files)"
    }
    'backups' {
        $root = Get-BackupRoot
        if (Test-Path $root) { Get-ChildItem $root -Directory | Sort-Object Name -Descending | ForEach-Object { $_.FullName } }
    }
    'diff' {
        $config = Require (Resolve-ConfigDir) 'Config folder'
        $From = Resolve-BackupFolder $From
        $hashes = @{}
        foreach ($side in @(@{ name = 'backup'; root = $From }, @{ name = 'live'; root = $config })) {
            $rootPath = (Resolve-Path $side.root).Path.TrimEnd('\')
            Get-ChildItem $rootPath -Recurse -File | ForEach-Object {
                $relative = $_.FullName.Substring($rootPath.Length + 1)
                if ($relative -like 'Logs\*') { return }
                if (-not $hashes.ContainsKey($relative)) { $hashes[$relative] = @{} }
                try { $hashes[$relative][$side.name] = (Get-FileHash $_.FullName -Algorithm SHA1).Hash }
                catch { $hashes[$relative][$side.name] = 'locked' }
            }
        }
        $hashes.Keys | Sort-Object | ForEach-Object {
            $entry = $hashes[$_]
            if (-not $entry.ContainsKey('backup')) { "added    $_" }
            elseif (-not $entry.ContainsKey('live')) { "removed  $_" }
            elseif ($entry['backup'] -ne $entry['live']) { "changed  $_" }
        }
    }
    'restore' {
        $config = Require (Resolve-ConfigDir) 'Config folder'
        $From = Resolve-BackupFolder $From
        if ($File) {
            $source = Join-Path $From $File
            $destination = Join-Path $config $File
            if (Test-Path $source) { Copy-Item $source $destination -Force; Write-Output "restored $File" }
            elseif (Test-Path $destination) { Remove-Item $destination -Force; Write-Output "removed $File (not in backup)" }
            else { Write-Output "nothing to do for $File" }
        }
        else {
            if (Test-OpusRunning) { throw 'Opus is running. Run "stop" first, a full restore must not race with Opus writing its config.' }
            # /MIR makes the config folder an exact copy of the backup, including deleting files added since.
            robocopy $From $config /MIR /XD Logs /R:1 /W:1 /NJH /NJS /NFL /NDL | Out-Null
            if ($LASTEXITCODE -ge 8) { throw "robocopy failed with exit code $LASTEXITCODE" }
            Write-Output "restored $config from $From"
        }
    }
    'cmd' {
        if ($CommandFile) { $Command = ([IO.File]::ReadAllText($CommandFile, [Text.Encoding]::UTF8)).Trim() }
        if (-not $Command) { throw 'Pass -Command "<opus command line>" or -CommandFile <file>.' }
        $before = @(Get-OpusDialogs | ForEach-Object { $_.Handle })
        Invoke-OpusCommand $Command | Out-Null
        Write-Output "sent: $Command"
        Start-Sleep -Milliseconds $WaitMs
        $opened = @(Get-OpusDialogs | Where-Object { $before -notcontains $_.Handle })
        if ($opened.Count -gt 0) {
            $opened | ForEach-Object { Write-Output ("DIALOG OPEN: " + (Format-OpusDialog $_)) }
            Write-Output 'The command did not finish silently. Report the dialog to the user, then run "dialogs -Close" or let them answer it.'
            exit 2
        }
    }
    'ui' {
        $config = Require (Resolve-ConfigDir) 'Config folder'
        if (-not $Query) { throw 'Pass -Query <label or command text>.' }
        $shown = 0
        foreach ($toolbarFile in Get-ChildItem (Join-Path $config 'Buttons') -Filter *.dop -Recurse -File) {
            $doc = New-Object System.Xml.XmlDocument
            try { $doc.Load($toolbarFile.FullName) } catch { continue }
            foreach ($button in $doc.SelectNodes('//button')) {
                $own = $button.SelectSingleNode('label')
                $instructions = @($button.SelectNodes('function/instruction') | ForEach-Object { $_.InnerText }) -join ' ; '
                $ownLabel = ''
                if ($own) { $ownLabel = $own.InnerText.Replace('&', '') }
                if (-not ($ownLabel -like "*$Query*" -or $instructions -like "*$Query*")) { continue }
                $trail = @()
                for ($node = $button; $node -and $node.Name -eq 'button'; $node = $node.ParentNode) {
                    $labelNode = $node.SelectSingleNode('label')
                    if ($labelNode) { $trail = @($labelNode.InnerText.Replace('&', '')) + $trail }
                }
                Write-Output ("[{0}] {1}   => {2}" -f $toolbarFile.BaseName, ($trail -join ' > '), $instructions)
                if (++$shown -ge 25) { Write-Output '(first 25 shown, narrow -Query)'; return }
            }
        }
        if ($shown -eq 0) { Write-Output 'no match in installed toolbars/menus. Try a shorter query, or grep references/.' }
    }
    'prefs' {
        if (-not $Query) { throw 'Pass -Query <option or page text>.' }
        $cache = Join-Path $env:LOCALAPPDATA 'GPSoftware\Directory Opus\State Data\prefs_search_cache.osd'
        if (-not (Test-Path $cache)) { Write-Output 'no Preferences search cache yet. Open Preferences once so Opus builds it.'; break }
        $doc = New-Object System.Xml.XmlDocument
        $doc.Load($cache)
        $terms = @($Query -split '\s+' | Where-Object { $_ })
        $shown = 0
        foreach ($category in $doc.SelectNodes('//category')) {
            $pages = @($category.SelectNodes('page') | ForEach-Object { $_.InnerText })
            # Page text starts with the category name and page name run together ("File DisplaysMouse").
            # The category name is the shared prefix up to the first lowercase-to-uppercase join.
            $heads = @($pages | ForEach-Object { ($_ -split ' \|\$0 ')[0] })
            $prefix = $heads[0]
            foreach ($head in $heads) { while ($prefix -and -not $head.StartsWith($prefix)) { $prefix = $prefix.Substring(0, $prefix.Length - 1) } }
            $join = [regex]::Match($prefix, '[a-z\)](?=[A-Z])')
            if ($join.Success) { $prefix = $prefix.Substring(0, $join.Index + 1) }
            foreach ($page in $pages) {
                $parts = $page -split ' \|\$0 '
                $pageName = $parts[0]
                if ($pageName.StartsWith($prefix)) { $pageName = $pageName.Substring($prefix.Length).Trim() }
                $cleanParts = @($parts | Select-Object -Skip 1 | ForEach-Object { (($_ -replace '<[^>]+>', '') -replace '&', '').Trim() } | Where-Object { $_ })
                $hits = @($cleanParts | Where-Object {
                    $lineText = $_
                    $allMatch = $true
                    foreach ($term in $terms) {
                        if ($lineText.IndexOf($term, [StringComparison]::OrdinalIgnoreCase) -lt 0) { $allMatch = $false; break }
                    }
                    $allMatch
                })
                $pageMatch = $true
                foreach ($term in $terms) {
                    if ($pageName.IndexOf($term, [StringComparison]::OrdinalIgnoreCase) -lt 0 -and $prefix.IndexOf($term, [StringComparison]::OrdinalIgnoreCase) -lt 0) { $pageMatch = $false; break }
                }
                if ($pageMatch -and $hits.Count -eq 0) { $hits = @('(page name)') }
                foreach ($hit in @($hits | Select-Object -First 4)) {
                    Write-Output ("Preferences / {0} / {1} : {2}" -f $prefix.Trim(), $pageName, $hit)
                    if (++$shown -ge 25) { Write-Output '(first 25 shown, narrow -Query)'; return }
                }
            }
        }
        if ($shown -eq 0) { Write-Output 'no match in the Preferences search cache.' }
    }
    'kb' {
        if (-not $Query) { throw 'Pass -Query <words>.' }
        $kbRoot = Join-Path (Split-Path $PSScriptRoot -Parent) 'references\kb'
        if (-not (Test-Path $kbRoot)) { throw "kb folder not found: $kbRoot" }
        $terms = @($Query -split '\s+' | Where-Object { $_ })
        $found = New-Object System.Collections.ArrayList
        foreach ($kbFile in Get-ChildItem $kbRoot -Filter '*.md') {
            if ($kbFile.Name -notmatch '^\d\d-') { continue }
            $kbLines = [IO.File]::ReadAllLines($kbFile.FullName, [Text.Encoding]::UTF8)
            $blockStart = -1
            for ($index = 0; $index -le $kbLines.Count; $index++) {
                $atHeader = ($index -lt $kbLines.Count) -and ($kbLines[$index] -match '^## [a-z0-9._-]+ \| ')
                if (-not ($atHeader -or $index -eq $kbLines.Count)) { continue }
                if ($blockStart -ge 0) {
                    $block = @($kbLines[$blockStart..($index - 1)])
                    $blockText = $block -join "`n"
                    $heading = $block[0]
                    $words = ''
                    foreach ($blockLine in $block) { if ($blockLine.StartsWith('user-words: ')) { $words = $blockLine } }
                    $score = 0
                    foreach ($term in $terms) {
                        if ($blockText.IndexOf($term, [StringComparison]::OrdinalIgnoreCase) -lt 0) { $score = 0; break }
                        $score += 1
                        if ($heading.IndexOf($term, [StringComparison]::OrdinalIgnoreCase) -ge 0) { $score += 5 }
                        if ($words.IndexOf($term, [StringComparison]::OrdinalIgnoreCase) -ge 0) { $score += 3 }
                    }
                    if ($score -gt 0) { [void]$found.Add([pscustomobject]@{ Score = $score; File = $kbFile.Name; Heading = $heading; Block = $block }) }
                }
                $blockStart = $index
            }
        }
        if ($found.Count -eq 0) { Write-Output 'no kb entry has all words. Try fewer or different words, then grep references/, then the install lookup.'; break }
        $ranked = @($found | Sort-Object -Property Score -Descending)
        foreach ($hit in ($ranked | Select-Object -First $Top)) {
            Write-Output ("--- references/kb/" + $hit.File)
            Write-Output (@($hit.Block | Select-Object -First 45) -join "`n")
            if ($hit.Block.Count -gt 45) { Write-Output '[entry truncated]' }
        }
        $more = @($ranked | Select-Object -Skip $Top -First 8)
        if ($more.Count -gt 0) { Write-Output '--- other matches'; foreach ($hit in $more) { Write-Output ($hit.Heading.Substring(3) + '  [references/kb/' + $hit.File + ']') } }
    }
    'dialogs' {
        $open = @(Get-OpusDialogs)
        if ($open.Count -eq 0) { Write-Output 'no dialogs open'; break }
        foreach ($dialog in $open) {
            Write-Output (Format-OpusDialog $dialog)
            if ($Close) { [OpusWindows]::Dismiss($dialog.Handle); Write-Output '  -> dismissed' }
        }
    }
    'stop' {
        if (-not (Test-OpusRunning)) { Write-Output 'not running'; break }
        $hasLister = @(Get-Process -Name dopus -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -ne 0 }).Count -gt 0
        if (-not $hasLister) {
            # Close PROGRAM via /acmd requires an active Lister; open one first if Opus is background-only.
            Start-OpusDetached
            Start-Sleep -Milliseconds 1800
        }
        Invoke-OpusCommand 'Close PROGRAM' | Out-Null
        $deadline = (Get-Date).AddSeconds($TimeoutSec)
        while ((Test-OpusRunning) -and (Get-Date) -lt $deadline) { Start-Sleep -Milliseconds 300 }
        if (Test-OpusRunning) { throw "Opus still running after $TimeoutSec s. Check for an open modal dialog or quit it from the tray icon." }
        Write-Output 'stopped'
    }
    'start' {
        Start-OpusDetached
        Write-Output 'started'
    }
    'install-script' {
        $config = Require (Resolve-ConfigDir) 'Config folder'
        if (-not $Path -or -not (Test-Path $Path)) { throw 'Pass -Path <script file>.' }
        $addins = Join-Path $config 'Script AddIns'
        New-Item -ItemType Directory -Force -Path $addins | Out-Null
        Copy-Item $Path $addins -Force
        Write-Output ("installed " + (Join-Path $addins (Split-Path $Path -Leaf)))
    }
    'remove-script' {
        $config = Require (Resolve-ConfigDir) 'Config folder'
        if (-not $Name) { throw 'Pass -Name <script file name>.' }
        $target = Join-Path (Join-Path $config 'Script AddIns') $Name
        if (Test-Path $target) { Remove-Item $target -Force; Write-Output "removed $target" } else { Write-Output "not found: $target" }
    }
    'telemetry-on' {
        $config = Require (Resolve-ConfigDir) 'Config folder'
        $source = Join-Path $PSScriptRoot 'JooKoiTelemetry.js'
        if (-not (Test-Path $source)) { throw "JooKoiTelemetry.js not found at $source" }
        $addins = Join-Path $config 'Script AddIns'
        New-Item -ItemType Directory -Force -Path $addins | Out-Null
        $dest = Join-Path $addins 'JooKoiTelemetry.js'
        Copy-Item $source $dest -Force
        $logDir = Join-Path $env:LOCALAPPDATA 'jookoi-directory-opus-skill'
        New-Item -ItemType Directory -Force -Path $logDir | Out-Null
        Write-Output "telemetry enabled: $dest (logging to $logDir\telemetry.jsonl)"
    }
    'telemetry-off' {
        $config = Require (Resolve-ConfigDir) 'Config folder'
        $dest = Join-Path (Join-Path $config 'Script AddIns') 'JooKoiTelemetry.js'
        if (Test-Path $dest) { Remove-Item $dest -Force; Write-Output "telemetry disabled: removed $dest" }
        else { Write-Output "telemetry already off" }
    }
    'audit' {
        $config = Require (Resolve-ConfigDir) 'Config folder'
        $localData = Join-Path $env:LOCALAPPDATA 'GPSoftware\Directory Opus'

        function ConvertFrom-OpusInt([string]$val) {
            if (-not $val) { return [int64]0 }
            $v = $val.Trim()
            if ($v -match '^0x([0-9a-fA-F]+)$') { return [Convert]::ToInt64($Matches[1], 16) }
            $out = [int64]0
            if ([int64]::TryParse($v, [ref]$out)) { return $out }
            return [int64]0
        }

        # 1. Companion tools, installed apps & environment
        $everythingPaths = @()
        foreach ($r in @($env:ProgramFiles, ${env:ProgramFiles(x86)}, (Join-Path $env:LOCALAPPDATA 'Programs'))) {
            if ($r) { $everythingPaths += (Join-Path $r 'Everything\Everything.exe') }
        }
        $everythingFound = [bool]($everythingPaths | Where-Object { $_ -and (Test-Path $_) }) -or [bool](Get-Command Everything.exe -ErrorAction SilentlyContinue) -or [bool](Get-Service 'Everything*' -ErrorAction SilentlyContinue)
        $pwshFound = [bool](Get-Command pwsh.exe -ErrorAction SilentlyContinue)
        $darkTheme = $false
        try {
            $themeReg = Get-ItemProperty 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize' -ErrorAction SilentlyContinue
            if ($null -ne $themeReg -and $themeReg.AppsUseLightTheme -eq 0) { $darkTheme = $true }
        } catch {}

        $installedApps = @()
        $appChecks = @(
            @{ name = 'vscode';   cmd = 'code.cmd';   paths = @((Join-Path $env:LOCALAPPDATA 'Programs\Microsoft VS Code\Code.exe')) },
            @{ name = 'cursor';   cmd = 'cursor.cmd'; paths = @((Join-Path $env:LOCALAPPDATA 'Programs\cursor\Cursor.exe')) },
            @{ name = 'git';      cmd = 'git.exe';    paths = @((Join-Path $env:ProgramFiles 'Git\cmd\git.exe')) },
            @{ name = 'wt';       cmd = 'wt.exe';     paths = @((Join-Path $env:LOCALAPPDATA 'Microsoft\WindowsApps\wt.exe')) },
            @{ name = '7zip';     cmd = '7z.exe';     paths = @((Join-Path $env:ProgramFiles '7-Zip\7zFM.exe')) },
            @{ name = 'obsidian'; cmd = $null;        paths = @((Join-Path $env:LOCALAPPDATA 'Programs\Obsidian\Obsidian.exe')) },
            @{ name = 'ffmpeg';   cmd = 'ffmpeg.exe'; paths = @() },
            @{ name = 'magick';   cmd = 'magick.exe'; paths = @() },
            @{ name = 'sharex';   cmd = 'ShareX.exe'; paths = @((Join-Path $env:ProgramFiles 'ShareX\ShareX.exe')) },
            @{ name = 'blender';  cmd = 'blender.exe';paths = @((Join-Path $env:ProgramFiles 'Blender Foundation')) },
            @{ name = 'adobe';    cmd = $null;        paths = @((Join-Path $env:ProgramFiles 'Adobe')) }
        )
        foreach ($ac in $appChecks) {
            $found = $false
            if ($ac.cmd -and (Get-Command $ac.cmd -ErrorAction SilentlyContinue)) { $found = $true }
            if (-not $found) {
                foreach ($p in $ac.paths) { if ($p -and (Test-Path $p)) { $found = $true; break } }
            }
            if ($found) { $installedApps += $ac.name }
        }

        # 2. Setup state (pristine vs customized) & stock indicators
        $addInsDir = Join-Path $config 'Script AddIns'
        $customScripts = @()
        if (Test-Path $addInsDir) {
            $customScripts = @(Get-ChildItem $addInsDir -File | Where-Object { $_.Extension -in '.js', '.vbs' -and $_.Name -ne 'JooKoiTelemetry.js' } | Select-Object -ExpandProperty Name)
        }
        $userCmdDir = Join-Path $config 'UserCommands'
        $userCmds = @()
        if (Test-Path $userCmdDir) { $userCmds = @(Get-ChildItem $userCmdDir -Filter '*.ouc' -File | Select-Object -ExpandProperty BaseName) }
        $formatsDir = Join-Path $config 'Formats'
        $customFormats = @()
        if (Test-Path $formatsDir) { $customFormats = @(Get-ChildItem $formatsDir -Filter '*.off' -File | Where-Object { $_.Name -notin @('contenttype.off', 'default.off', 'system.off') } | Select-Object -ExpandProperty Name) }
        $layoutsDir = Join-Path $config 'Layouts'
        $customLayouts = @()
        if (Test-Path $layoutsDir) { $customLayouts = @(Get-ChildItem $layoutsDir -Filter '*.oll' -File | Select-Object -ExpandProperty BaseName) }

        $favFile = Join-Path $config 'ConfigFiles\favorites.ofv'
        $favPaths = @()
        if (Test-Path $favFile) {
            try {
                [xml]$favXml = Get-Content $favFile -Raw
                $favPaths = @($favXml.SelectNodes('//pathstring') | ForEach-Object { $_.InnerText.Trim() } | Where-Object { $_ })
            } catch {}
        }

        $listerHotkeysFile = Join-Path $config 'ConfigFiles\lister_hotkeys.oxc'
        $hotkeyCount = 0
        if (Test-Path $listerHotkeysFile) {
            try {
                [xml]$hkXml = Get-Content $listerHotkeysFile -Raw
                $hotkeyCount = @($hkXml.SelectNodes('//key')).Count
            } catch {}
        }

        $explorerOverride = Test-Path (Join-Path $config 'ConfigFiles\exploreroverride.oxc')
        $prefsFile = Join-Path $config 'ConfigFiles\prefs.oxc'
        $goUpBackEnabled = $false
        if (Test-Path $prefsFile) {
            $prefsRaw = Get-Content $prefsFile -Raw
            if ($prefsRaw -match 'command="Go UP BACK"\s+enable="yes"') { $goUpBackEnabled = $true }
        }
        $toolbarsFile = Join-Path $config 'ConfigFiles\toolbars.oxc'
        $operationsToolbarOpen = $false
        if (Test-Path $toolbarsFile) {
            $tbRaw = Get-Content $toolbarsFile -Raw
            if ($tbRaw -match 'name="Operations"') { $operationsToolbarOpen = $true }
        }

        $defaultOllFile = Join-Path $config 'Layouts\System\default.oll'
        $currentLayout = 'side-by-side'
        $folderTreeOpen = $false
        if (Test-Path $defaultOllFile) {
            try {
                [xml]$ollXml = Get-Content $defaultOllFile -Raw
                $layoutNode = $ollXml.SelectSingleNode('//lister_layout/lister/layout')
                if ($layoutNode) {
                    $fStr = $layoutNode.GetAttribute('flags')
                    if ($fStr -match '^0x([0-9a-fA-F]+)$') {
                        $fVal = [Convert]::ToInt64($Matches[1], 16)
                        $folderTreeOpen = (($fVal -band 0x6L) -ne 0)
                        if (($fVal -band 0x8L) -eq 0) { $currentLayout = 'single' }
                        elseif (($fVal -band 0x20L) -ne 0 -or ($fVal -band 0x8000000L) -ne 0) { $currentLayout = 'side-by-side' }
                        else { $currentLayout = 'top-and-bottom' }
                    }
                }
            } catch {}
        }

        $existingToolbarButtons = @()
        foreach ($dopRel in @('Buttons\Favorites Bar.dop', 'Buttons\File Display.dop')) {
            $dopPath = Join-Path $config $dopRel
            if (Test-Path $dopPath) {
                try {
                    [xml]$dXml = Get-Content $dopPath -Raw
                    $lbls = @($dXml.SelectNodes('//toolbar/buttons/button/label') | ForEach-Object { ($_.InnerText -replace '&', '').Trim() } | Where-Object { $_ -and $_ -notin @('Spacer', 'Begin Hide', 'End Hide') })
                    $existingToolbarButtons += $lbls
                } catch {}
            }
        }
        $existingToolbarButtons = @($existingToolbarButtons | Select-Object -Unique)

        # Stock DOpus 13 ships with ~25 keys in lister_hotkeys.oxc and 0 custom scripts/user commands.
        $score = 0
        if ($customScripts.Count -gt 0) { $score += 2 }
        if ($userCmds.Count -gt 0) { $score += 2 }
        if ($customFormats.Count -gt 1) { $score += 2 }
        if ($customLayouts.Count -gt 1) { $score += 1 }
        if ($favPaths.Count -gt 8) { $score += 1 }
        if ($hotkeyCount -gt 26) { $score += 1 }
        if ($goUpBackEnabled) { $score += 1 }

        $setupState = if ($score -le 2) { 'pristine' } else { 'customized' }

        # 3. Passive Usage: SmartFavorites (smartfav.osf) — filter out temp/cache/appdata/recycle/private noise
        $noisePattern = '(?i)(\\AppData\\|\\Temp(\\|$)|\\\$Recycle\.Bin|\\Windows\\|\\node_modules(\\|$)|\\\.git(\\|$)|\\\.claude(\\|$)|\\\.gemini(\\|$)|\\porn(\\|$)|\\nsfw(\\|$)|\\xxx(\\|$)|\\private(\\|$))'
        $smartFavFile = Join-Path $config 'ConfigFiles\smartfav.osf'
        $topSources = @()
        $topDests = @()
        if (Test-Path $smartFavFile) {
            try {
                [xml]$sfXml = Get-Content $smartFavFile -Raw
                $entries = @($sfXml.SelectNodes('//entry') | ForEach-Object {
                    $p = if ($_.pathstring) { $_.pathstring.Trim() } else { '' }
                    [pscustomobject]@{
                        path        = $p
                        points      = ConvertFrom-OpusInt ($_.GetAttribute('points'))
                        destPoints  = ConvertFrom-OpusInt ($_.GetAttribute('dest_points'))
                        inFavorites = ($favPaths -contains $p)
                    }
                } | Where-Object { $_.path -and $_.path -notmatch $noisePattern -and (Test-Path $_.path) })
                $topSources = @($entries | Sort-Object points -Descending | Select-Object -First 8)
                $topDests = @($entries | Where-Object { $_.destPoints -gt 0 } | Sort-Object destPoints -Descending | Select-Object -First 6)
            } catch {}
        }

        # 4. Passive Usage: AutoFormats (State Data/AutoFormats/formats.xml)
        $autoFormatsFile = Join-Path $localData 'State Data\AutoFormats\formats.xml'
        $autoFormatTweaks = @()
        if (Test-Path $autoFormatsFile) {
            try {
                [xml]$afXml = Get-Content $autoFormatsFile -Raw
                $stdCols = @('name', 'size', 'modified', 'type', 'attr', 'ext')
                $tweaks = @()
                foreach ($node in $afXml.SelectNodes('//format')) {
                    $pNode = $node.SelectSingleNode('path')
                    $folderPath = if ($pNode -and $pNode.GetAttribute('Path')) { $pNode.GetAttribute('Path') } else { '' }
                    if (-not $folderPath -or $folderPath -match $noisePattern) { continue }
                    $vm = $node.GetAttribute('view_mode')
                    $cols = @($node.SelectNodes('fields/field') | ForEach-Object { $_.GetAttribute('id') } | Where-Object { $_ })
                    $extraCols = @($cols | Where-Object { $_ -notin $stdCols })
                    $sortField = ($node.SelectNodes('fields/field[@sort]') | Select-Object -First 1)
                    $sortBy = if ($sortField) { $sortField.GetAttribute('id') } else { 'name' }
                    if (($vm -and $vm -ne 'details') -or $extraCols.Count -gt 0 -or ($sortBy -and $sortBy -ne 'name')) {
                        $tweaks += [pscustomobject]@{
                            path      = $folderPath
                            viewMode  = if ($vm) { $vm } else { 'details' }
                            extraCols = ($extraCols -join ',')
                            sortBy    = $sortBy
                        }
                    }
                }
                $autoFormatTweaks = @($tweaks | Select-Object -First 10)
            } catch {}
        }

        # 5. Passive Usage: MRU (rename, find, select)
        $mruDir = Join-Path $localData 'State Data\MRU'
        $mruSummary = @{}
        foreach ($mruName in @('rename_files', 'rename_folders', 'find_name', 'find_path', 'select')) {
            $f = Join-Path $mruDir "$mruName.osd"
            if (Test-Path $f) {
                try {
                    [xml]$mXml = Get-Content $f -Raw
                    $items = @($mXml.SelectNodes('//item') | ForEach-Object { $_.InnerText } | Where-Object { $_ -and $_ -notmatch $noisePattern } | Select-Object -First 5)
                    if ($items.Count -gt 0) { $mruSummary[$mruName] = $items }
                } catch {}
            }
        }

        # 6. Passive Usage: Binary File Function Log (Logs/funclog.dfl) tail paths
        $funcLogFile = Join-Path $config 'Logs\funclog.dfl'
        $funcLogTopFolders = @()
        if (Test-Path $funcLogFile) {
            try {
                $fs = [System.IO.File]::Open($funcLogFile, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::ReadWrite)
                $readLen = [Math]::Min([int64]65536, $fs.Length)
                $null = $fs.Seek(-$readLen, [System.IO.SeekOrigin]::End)
                $buf = New-Object byte[] $readLen
                $null = $fs.Read($buf, 0, [int]$readLen)
                $fs.Close()
                $ascii = [System.Text.Encoding]::UTF8.GetString($buf)
                $matches = [regex]::Matches($ascii, '[A-Za-z]:\\[^\x00\r\n"<>|?*]{2,180}')
                $dirs = @($matches | ForEach-Object {
                    $v = $_.Value
                    $parent = Split-Path $v -Parent -ErrorAction SilentlyContinue
                    if ($parent) { $parent } else { $v }
                } | Where-Object { $_ -and $_ -notmatch $noisePattern })
                $funcLogTopFolders = @($dirs | Group-Object | Sort-Object Count -Descending | Select-Object -First 8 | ForEach-Object {
                    [pscustomobject]@{ folder = $_.Name; hits = $_.Count }
                })
            } catch {}
        }

        # 7. Staging / intake folders in top traffic (Downloads, Screenshots, DCIM, Keep, Temp)
        $stagingCandidates = @($topSources | ForEach-Object { $_.path }) + @($funcLogTopFolders | ForEach-Object { $_.folder })
        $stagingFolders = @($stagingCandidates | Where-Object { $_ -match '(?i)(downloads|screenshots|dcim|camera|keep|temp|inbox)' } | Select-Object -Unique | Select-Object -First 6)

        # 8. Active Telemetry Status & Summary
        $telemetryScript = Join-Path $addInsDir 'JooKoiTelemetry.js'
        $telemetryLog = Join-Path (Join-Path $env:LOCALAPPDATA 'jookoi-directory-opus-skill') 'telemetry.jsonl'
        $telemetryEvents = 0
        $uiToggleSummary = @()
        $stepWalkTargets = @()
        $tabPingPongs = @()
        if (Test-Path $telemetryLog) {
            try {
                $lines = @(Get-Content $telemetryLog -Tail 1000)
                $telemetryEvents = $lines.Count
                $parsed = @($lines | ForEach-Object { try { $_ | ConvertFrom-Json } catch {} } | Where-Object { $_ })
                $uiToggleSummary = @($parsed | Where-Object { $_.ev -eq 'ui' } | Group-Object chg | Sort-Object Count -Descending | ForEach-Object {
                    [pscustomobject]@{ element = $_.Name; count = $_.Count }
                })
                $navChain = 0
                $chainPaths = @()
                foreach ($ev in $parsed) {
                    if ($ev.ev -eq 'nav' -and $ev.act -in @('dblclk', 'parent', 'back')) {
                        $navChain++
                        if ($navChain -ge 3 -and $ev.path) { $chainPaths += $ev.path }
                    } else {
                        $navChain = 0
                    }
                }
                $stepWalkTargets = @($chainPaths | Group-Object | Sort-Object Count -Descending | Select-Object -First 5 | ForEach-Object {
                    [pscustomobject]@{ path = $_.Name; chains = $_.Count }
                })
                $switches = @($parsed | Where-Object { $_.ev -eq 'tab' -and $_.act -eq 'activate' -and $_.from -and $_.to -and $_.from -ne $_.to } | ForEach-Object {
                    $pair = @($_.from, $_.to) | Sort-Object
                    "$($pair[0]) <-> $($pair[1])"
                })
                $tabPingPongs = @($switches | Group-Object | Where-Object { $_.Count -ge 3 } | Sort-Object Count -Descending | Select-Object -First 5 | ForEach-Object {
                    [pscustomobject]@{ pair = $_.Name; switches = $_.Count }
                })
            } catch {}
        }

        [pscustomobject]@{
            environment = [pscustomobject]@{
                everythingInstalled = $everythingFound
                pwshInstalled       = $pwshFound
                windowsDarkMode     = $darkTheme
                installedApps       = $installedApps
            }
            setup = [pscustomobject]@{
                state                  = $setupState
                score                  = $score
                currentLayout          = $currentLayout
                folderTreeOpen         = $folderTreeOpen
                explorerReplacementOn  = $explorerOverride
                goUpBackEnabled        = $goUpBackEnabled
                operationsToolbarOpen  = $operationsToolbarOpen
                existingToolbarButtons = $existingToolbarButtons
                favoritesCount         = $favPaths.Count
                hotkeyCount            = $hotkeyCount
                customScripts          = $customScripts
                customFormats          = $customFormats
            }
            telemetry = [pscustomobject]@{
                installed       = (Test-Path $telemetryScript)
                logPath         = $telemetryLog
                recentEvents    = $telemetryEvents
                uiToggles       = $uiToggleSummary
                stepWalkTargets = $stepWalkTargets
                tabPingPongs    = $tabPingPongs
            }
            passiveUsage = [pscustomobject]@{
                topSourceFolders  = $topSources
                topDestFolders    = $topDests
                stagingFolders    = $stagingFolders
                autoFormatTweaks  = $autoFormatTweaks
                mru               = $mruSummary
                funcLogTopFolders = $funcLogTopFolders
            }
        } | ConvertTo-Json -Depth 5
    }
    'apply-wizard' {
        $config = Require (Resolve-ConfigDir) 'Config folder'
        $program = Require (Resolve-ProgramDir) 'Program folder'
        if (-not $ConfigFile -or -not (Test-Path $ConfigFile)) { throw 'Pass -ConfigFile <path to wizard JSON>.' }

        $openDialogs = @(Get-OpusDialogs)
        if ($openDialogs.Count -gt 0) {
            $desc = ($openDialogs | ForEach-Object { Format-OpusDialog $_ }) -join ' | '
            throw "Open Directory Opus dialog detected ($desc). Run 'dialogs -Close' or ask the user to answer it before running apply-wizard."
        }

        $cfgRaw = [IO.File]::ReadAllText((Resolve-Path $ConfigFile).Path, [Text.Encoding]::UTF8)
        $cfg = $cfgRaw | ConvertFrom-Json
        $applied = New-Object System.Collections.ArrayList
        $skipped = New-Object System.Collections.ArrayList

        function Save-OpusXml([xml]$doc, [string]$filePath) {
            $settings = New-Object System.Xml.XmlWriterSettings
            $settings.Encoding = New-Object System.Text.UTF8Encoding($true)
            $settings.Indent = $true
            $settings.IndentChars = "`t"
            $settings.NewLineChars = "`r`n"
            $settings.NewLineHandling = [System.Xml.NewLineHandling]::Replace
            $writer = [System.Xml.XmlWriter]::Create($filePath, $settings)
            try { $doc.Save($writer) } finally { $writer.Close() }
        }

        # 1. Backup
        $backupTarget = Join-Path (Get-BackupRoot) ((Get-Date -Format 'yyyyMMdd-HHmmss') + '-wizard-apply')
        New-Item -ItemType Directory -Force -Path $backupTarget | Out-Null
        robocopy $config $backupTarget /E /XD Logs /R:1 /W:1 /NJH /NJS /NFL /NDL | Out-Null
        if ($LASTEXITCODE -ge 8) { throw "robocopy backup failed with exit code $LASTEXITCODE" }

        # 2. Stop DOpus gracefully before editing XML
        if (Test-OpusRunning) {
            $hasLister = @(Get-Process -Name dopus -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -ne 0 }).Count -gt 0
            if (-not $hasLister) {
                Start-OpusDetached
                Start-Sleep -Milliseconds 1800
            }
            Invoke-OpusCommand 'Close PROGRAM' | Out-Null
            $deadline = (Get-Date).AddSeconds($TimeoutSec)
            while ((Test-OpusRunning) -and (Get-Date) -lt $deadline) { Start-Sleep -Milliseconds 300 }
            if (Test-OpusRunning) { throw "Directory Opus is still running after $TimeoutSec s. Check for an open prompt or quit it from the tray icon." }
        }

        # 3. CleanTopToolbar (and optional legacy Quick Tools.dop removal when explicitly requested)
        if ($cfg.removeLegacyQuickTools -eq $true) {
            $quickToolsDop = Join-Path $config 'Buttons\Quick Tools.dop'
            if (Test-Path $quickToolsDop) {
                Remove-Item $quickToolsDop -Force
                [void]$applied.Add('Removed legacy Quick Tools.dop separate toolbar')
            }
        }
        $toolbarsOxc = Join-Path $config 'ConfigFiles\toolbars.oxc'
        if (Test-Path $toolbarsOxc) {
            $tbDoc = New-Object System.Xml.XmlDocument
            $tbDoc.Load($toolbarsOxc)
            $tbModified = $false
            foreach ($tbNode in @($tbDoc.SelectNodes('//toolbar'))) {
                $fNode = $tbNode.SelectSingleNode('file')
                if ($fNode -and (($cfg.removeLegacyQuickTools -eq $true -and $fNode.InnerText -eq 'Quick Tools.dop') -or ($cfg.cleanTopToolbar -eq $true -and $fNode.InnerText -eq 'Operations.dop'))) {
                    [void]$tbNode.ParentNode.RemoveChild($tbNode)
                    $tbModified = $true
                }
            }
            if ($tbModified) {
                Save-OpusXml $tbDoc $toolbarsOxc
                if ($cfg.cleanTopToolbar -eq $true) { [void]$applied.Add('ConfigFiles\toolbars.oxc: hid Operations toolbar from default top toolbars') }
            }
        } elseif ($cfg.cleanTopToolbar -eq $true) {
            [void]$skipped.Add('ConfigFiles\toolbars.oxc not found for cleanTopToolbar')
        }

        # 4. ConfigFiles\prefs.oxc (instantSizes, typeToFilter, goUpBack)
        $prefsOxc = Join-Path $config 'ConfigFiles\prefs.oxc'
        if (Test-Path $prefsOxc) {
            $pDoc = New-Object System.Xml.XmlDocument
            $pDoc.Load($prefsOxc)
            $pChanged = $false

            if ($cfg.instantSizes -eq $true) {
                $flagsNode = $pDoc.SelectSingleNode('//prefs/flags')
                if ($flagsNode) {
                    $s1Str = $flagsNode.GetAttribute('settings1')
                    if ($s1Str -match '^0x([0-9a-fA-F]+)$') {
                        $s1Val = [Convert]::ToInt64($Matches[1], 16) -bor 0x2L
                        $flagsNode.SetAttribute('settings1', ('0x{0:x}' -f $s1Val))
                    }
                    $s7Str = $flagsNode.GetAttribute('settings7')
                    if ($s7Str -match '^0x([0-9a-fA-F]+)$') {
                        $s7Val = [Convert]::ToInt64($Matches[1], 16) -bor 0x80L
                        $flagsNode.SetAttribute('settings7', ('0x{0:x}' -f $s7Val))
                    }
                    $pChanged = $true
                    [void]$applied.Add('ConfigFiles\prefs.oxc: enabled automatic folder size calculation + update after file ops')
                } else {
                    [void]$skipped.Add('ConfigFiles\prefs.oxc: //prefs/flags node missing for instantSizes')
                }
            }

            if ($cfg.typeToFilter -eq $true) {
                $faytNode = $pDoc.SelectSingleNode('//prefs/fayt')
                if ($faytNode) {
                    $faytNode.SetAttribute('defaultmode', '%fayt_filter')
                    $pChanged = $true
                    [void]$applied.Add('ConfigFiles\prefs.oxc: set Find-As-You-Type default mode to Filter (%fayt_filter)')
                } else {
                    [void]$skipped.Add('ConfigFiles\prefs.oxc: //prefs/fayt node missing for typeToFilter')
                }
            }

            if ($cfg.goUpBack -eq $true) {
                $bgNode = $pDoc.SelectSingleNode('//prefs/dblclk/bg_commands')
                if ($bgNode) {
                    $evNode = $bgNode.SelectSingleNode('event[@id="0"]')
                    if (-not $evNode) {
                        $evNode = $pDoc.CreateElement('event')
                        [void]$bgNode.AppendChild($evNode)
                    }
                    $evNode.SetAttribute('command', 'Go UP BACK')
                    $evNode.SetAttribute('enable', 'yes')
                    $evNode.SetAttribute('id', '0')
                    $pChanged = $true
                    [void]$applied.Add('ConfigFiles\prefs.oxc: enabled double-click file display background -> Go UP BACK')
                } else {
                    [void]$skipped.Add('ConfigFiles\prefs.oxc: //prefs/dblclk/bg_commands node missing for goUpBack')
                }
            }

            if ($pChanged) { Save-OpusXml $pDoc $prefsOxc }
        }

        # 5. Formats\default.off (User Default columns)
        if ($cfg.columns -and @($cfg.columns).Count -gt 0) {
            $defOff = Join-Path $config 'Formats\default.off'
            if (Test-Path $defOff) {
                $fDoc = New-Object System.Xml.XmlDocument
                $fDoc.Load($defOff)
                $defFmt = $fDoc.SelectSingleNode('//folder_formats/path[@name="default"]/format')
                if (-not $defFmt) {
                    $ffRoot = $fDoc.SelectSingleNode('//folder_formats')
                    if ($ffRoot) {
                        $defPathEl = $fDoc.CreateElement('path')
                        $defPathEl.SetAttribute('name', 'default')
                        $defFmt = $fDoc.CreateElement('format')
                        $defFmt.SetAttribute('autosize', 'yes')
                        $defFmt.SetAttribute('getsizes', 'default')
                        $defFmt.SetAttribute('numericname', 'yes')
                        $defFmt.SetAttribute('sort', 'dirsfirst')
                        $defFmt.SetAttribute('sortnewfiles', 'default')
                        $defFmt.SetAttribute('threshhold', '25')
                        $defFmt.SetAttribute('v', '3')
                        $defFmt.SetAttribute('view_mode', 'details')
                        [void]$defPathEl.AppendChild($defFmt)
                        [void]$ffRoot.AppendChild($defPathEl)
                    }
                }
                if ($defFmt) {
                    $existingSizes = @{}
                    foreach ($oldField in @($defFmt.SelectNodes('field'))) {
                        $fid = $oldField.GetAttribute('id')
                        if ($fid) {
                            $existingSizes[$fid] = @{
                                size     = $oldField.GetAttribute('size')
                                size_dpi = $oldField.GetAttribute('size_dpi')
                            }
                        }
                        [void]$defFmt.RemoveChild($oldField)
                    }
                    $colIdx = 0
                    foreach ($colId in @($cfg.columns)) {
                        $fieldEl = $fDoc.CreateElement('field')
                        $fieldEl.SetAttribute('id', [string]$colId)
                        if ($existingSizes.ContainsKey([string]$colId)) {
                            $sz = $existingSizes[[string]$colId]
                            if ($sz.size) { $fieldEl.SetAttribute('size', $sz.size) }
                            if ($sz.size_dpi) { $fieldEl.SetAttribute('size_dpi', $sz.size_dpi) }
                        }
                        if ($colIdx -eq 0) { $fieldEl.SetAttribute('sort', '1') }
                        [void]$defFmt.AppendChild($fieldEl)
                        $colIdx++
                    }
                    Save-OpusXml $fDoc $defOff
                    [void]$applied.Add(('Formats\default.off: set User Default columns to ' + (@($cfg.columns) -join ', ')))
                }
            } else {
                [void]$skipped.Add('Formats\default.off not found; relying on live Set COLUMNS + Set SAVEFORMAT')
            }
        }

        # 6. Formats\contenttype.off (photoAutoSwitch, videoAutoSwitch)
        if ($null -ne $cfg.photoAutoSwitch -or $null -ne $cfg.videoAutoSwitch) {
            $ctOff = Join-Path $config 'Formats\contenttype.off'
            if (Test-Path $ctOff) {
                $ctDoc = New-Object System.Xml.XmlDocument
                $ctDoc.Load($ctOff)
                if ($null -ne $cfg.photoAutoSwitch) {
                    $imgFmt = $ctDoc.SelectSingleNode('//folder_formats/path[@name="Images"]/format')
                    if ($imgFmt) {
                        $imgFmt.SetAttribute('disable', $(if ($cfg.photoAutoSwitch) { 'no' } else { 'yes' }))
                        $photoView = if ($cfg.photoThumbnails -eq $true) { 'thumbnails' } else { 'details' }
                        if ($cfg.photoAutoSwitch) { $imgFmt.SetAttribute('view_mode', $photoView) }
                        [void]$applied.Add(('Formats\contenttype.off: Images auto-switch = ' + [bool]$cfg.photoAutoSwitch + " (view_mode=$photoView)"))
                    } else {
                        [void]$skipped.Add('Formats\contenttype.off: Images content-type format missing')
                    }
                }
                if ($null -ne $cfg.videoAutoSwitch) {
                    $movFmt = $ctDoc.SelectSingleNode('//folder_formats/path[@name="Movies"]/format')
                    if ($movFmt) {
                        $movFmt.SetAttribute('disable', $(if ($cfg.videoAutoSwitch) { 'no' } else { 'yes' }))
                        [void]$applied.Add(('Formats\contenttype.off: Movies auto-switch = ' + [bool]$cfg.videoAutoSwitch))
                    } else {
                        [void]$skipped.Add('Formats\contenttype.off: Movies content-type format missing')
                    }
                }
                Save-OpusXml $ctDoc $ctOff
            } else {
                [void]$skipped.Add('Formats\contenttype.off not found')
            }
        }

        # 6b. Layouts\System\default.oll (offline layout & tree flags so restart state matches immediately)
        $defOllPath = Join-Path $config 'Layouts\System\default.oll'
        if ((Test-Path $defOllPath) -and ($cfg.layout -or $cfg.tree)) {
            try {
                $ollDoc = New-Object System.Xml.XmlDocument
                $ollDoc.Load($defOllPath)
                $ollLayout = $ollDoc.SelectSingleNode('//lister_layout/lister/layout')
                if ($ollLayout) {
                    $flStr = $ollLayout.GetAttribute('flags')
                    if ($flStr -match '^0x([0-9a-fA-F]+)$') {
                        $flVal = [Convert]::ToInt64($Matches[1], 16)
                        if ($cfg.layout -in @('side-by-side', 'dual')) {
                            $flVal = ($flVal -bor 0x8L -bor 0x20L) -band (-bnot 0x8000000L)
                        } elseif ($cfg.layout -in @('top-and-bottom', 'stacked')) {
                            $flVal = ($flVal -bor 0x8L) -band (-bnot 0x20L) -band (-bnot 0x8000000L)
                        } elseif ($cfg.layout -eq 'single') {
                            $flVal = $flVal -band (-bnot 0x8L)
                        }
                        if ($cfg.tree -eq 'off') {
                            $flVal = $flVal -band (-bnot 0x6L)
                        } elseif ($cfg.tree -in @('single', 'on')) {
                            $flVal = ($flVal -bor 0x2L) -band (-bnot 0x4L)
                        } elseif ($cfg.tree -eq 'dual') {
                            $flVal = $flVal -bor 0x6L
                        }
                        $ollLayout.SetAttribute('flags', ('0x{0:x}' -f $flVal))
                        Save-OpusXml $ollDoc $defOllPath
                        [void]$applied.Add(('Layouts\System\default.oll: updated Default Lister layout/tree flags to 0x{0:x}' -f $flVal))
                    }
                }
            } catch {}
        }

        # 7. ConfigFiles\foldercolors.oxc (highlightFreshFiles)
        if ($cfg.highlightFreshFiles -eq $true) {
            $fcOxc = Join-Path $config 'ConfigFiles\foldercolors.oxc'
            $fcDoc = New-Object System.Xml.XmlDocument
            if (Test-Path $fcOxc) {
                try { $fcDoc.Load($fcOxc) } catch {}
            }
            if (-not $fcDoc.DocumentElement) {
                [void]$fcDoc.AppendChild($fcDoc.CreateXmlDeclaration('1.0', 'UTF-8', $null))
                [void]$fcDoc.AppendChild($fcDoc.CreateElement('foldercolors'))
            }
            $fcRoot = $fcDoc.DocumentElement
            $rules = @(
                @{ desc = 'Modified last hour'; eval = 'modified > Now() - 1h'; guid = '{DEA7AD56-705E-46E7-96EB-66FC16625A1C}'; stop = 'yes' },
                @{ desc = 'Modified today';     eval = 'modified > Now() - 1d'; guid = '{A3B60A15-3008-40C5-B96B-615CF0005B25}'; stop = $null }
            )
            foreach ($r in $rules) {
                $existingRule = $fcRoot.SelectSingleNode(('path[filter/@desc="{0}"]' -f $r.desc))
                if (-not $existingRule) {
                    $pathEl = $fcDoc.CreateElement('path')
                    $pathEl.SetAttribute('color', $r.guid)
                    if ($r.stop) { $pathEl.SetAttribute('stop', $r.stop) }
                    $pathEl.SetAttribute('type', '16')
                    $labelsEl = $fcDoc.CreateElement('labels')
                    $colorEl = $fcDoc.CreateElement('color')
                    $colorEl.InnerText = $r.guid
                    [void]$labelsEl.AppendChild($colorEl)
                    [void]$pathEl.AppendChild($labelsEl)
                    $filterEl = $fcDoc.CreateElement('filter')
                    $filterEl.SetAttribute('changed', 'yes')
                    $filterEl.SetAttribute('desc', $r.desc)
                    $filterEl.SetAttribute('name', '')
                    $evalEl = $fcDoc.CreateElement('eval')
                    $evalEl.InnerText = $r.eval
                    [void]$filterEl.AppendChild($evalEl)
                    [void]$pathEl.AppendChild($filterEl)
                    [void]$fcRoot.AppendChild($pathEl)
                }
            }
            Save-OpusXml $fcDoc $fcOxc
            [void]$applied.Add('ConfigFiles\foldercolors.oxc: added Green (last hour) and Blue (today) fresh-file highlight filters')
        }

        # 8. ConfigFiles\lister_hotkeys.oxc (Ctrl+Shift+V smartPaste; F8 is already bound in shipped Menu.dop)
        $hkOxc = Join-Path $config 'ConfigFiles\lister_hotkeys.oxc'
        if (Test-Path $hkOxc) {
            $hkDoc = New-Object System.Xml.XmlDocument
            $hkDoc.Load($hkOxc)
            $hkRoot = $hkDoc.DocumentElement
            $hkChanged = $false

            function Set-ListerHotkey([string]$hotkeyStr, [string]$labelStr, [string]$tipStr, [string]$instrStr) {
                foreach ($existingKey in @($hkRoot.SelectNodes('key'))) {
                    if ($existingKey.GetAttribute('hotkey') -eq $hotkeyStr) {
                        [void]$hkRoot.RemoveChild($existingKey)
                    }
                }
                $keyEl = $hkDoc.CreateElement('key')
                $keyEl.SetAttribute('hotkey', $hotkeyStr)
                $lblEl = $hkDoc.CreateElement('label'); $lblEl.InnerText = $labelStr; [void]$keyEl.AppendChild($lblEl)
                $tipEl = $hkDoc.CreateElement('tip'); $tipEl.InnerText = $tipStr; [void]$keyEl.AppendChild($tipEl)
                $fnEl = $hkDoc.CreateElement('function'); $fnEl.SetAttribute('type', 'normal')
                $insEl = $hkDoc.CreateElement('instruction'); $insEl.InnerText = $instrStr; [void]$fnEl.AppendChild($insEl)
                [void]$keyEl.AppendChild($fnEl)
                [void]$hkRoot.AppendChild($keyEl)
            }

            if ($cfg.tree -eq 'off') {
                $menuDop = Join-Path $config 'Buttons\Menu.dop'
                $menuHasF8 = (Test-Path $menuDop) -and ((Get-Content $menuDop -Raw) -match 'hotkey="f8"')
                if (-not $menuHasF8) {
                    Set-ListerHotkey 'f8' 'Toggle Folder Tree' 'Show or hide the Folder Tree panel' 'Set TREE=toggle'
                    $hkChanged = $true
                    [void]$applied.Add('ConfigFiles\lister_hotkeys.oxc: bound F8 to Set TREE=toggle')
                }
            }
            if ($cfg.smartPaste -eq $true) {
                Set-ListerHotkey 'ctrl+shift+v' 'Smart Paste' 'Paste clipboard text or image as a new file with filename prompt' 'Clipboard PASTE AS=ask'
                $hkChanged = $true
                [void]$applied.Add('ConfigFiles\lister_hotkeys.oxc: bound Ctrl+Shift+V to Clipboard PASTE AS=ask')
            }
            if ($hkChanged) { Save-OpusXml $hkDoc $hkOxc }
        }

        # 9. ConfigFiles\favorites.ofv (favoritePins)
        if ($cfg.favoritePins -and @($cfg.favoritePins).Count -gt 0) {
            $favOfv = Join-Path $config 'ConfigFiles\favorites.ofv'
            if (Test-Path $favOfv) {
                $favDoc = New-Object System.Xml.XmlDocument
                $favDoc.Load($favOfv)
                $favBarNode = $favDoc.SelectSingleNode('//favorites/folder[@label="Favorites Bar"]')
                if (-not $favBarNode) { $favBarNode = $favDoc.DocumentElement }
                $existingPaths = @($favBarNode.SelectNodes('path/dir/pathstring') | ForEach-Object { $_.InnerText.Trim().TrimEnd('\').ToLowerInvariant() })
                $existingLabels = @($favBarNode.SelectNodes('path') | ForEach-Object { $_.GetAttribute('label').ToLowerInvariant() })
                $addedPins = @()
                foreach ($pin in @($cfg.favoritePins)) {
                    $pinPath = if ($pin -is [string]) { $pin } else { [string]$pin.path }
                    if (-not $pinPath) { continue }
                    $normPath = $pinPath.Trim().TrimEnd('\').ToLowerInvariant()
                    if ($existingPaths -contains $normPath) {
                        [void]$skipped.Add("ConfigFiles\favorites.ofv: $pinPath already pinned")
                        continue
                    }
                    $pinLabel = if ($pin -isnot [string] -and $pin.label) { [string]$pin.label } else { Split-Path $pinPath -Leaf }
                    if (-not $pinLabel) { $pinLabel = $pinPath }
                    if ($existingLabels -contains $pinLabel.ToLowerInvariant() -and $pinPath -match '^([A-Za-z]):') {
                        $pinLabel = "$pinLabel ($($Matches[1].ToUpperInvariant()):)"
                    }
                    $pathEl = $favDoc.CreateElement('path')
                    $pathEl.SetAttribute('label', $pinLabel)
                    $dirEl = $favDoc.CreateElement('dir')
                    $psEl = $favDoc.CreateElement('pathstring')
                    $psEl.InnerText = $pinPath.Trim()
                    [void]$dirEl.AppendChild($psEl)
                    [void]$pathEl.AppendChild($dirEl)
                    [void]$favBarNode.AppendChild($pathEl)
                    $existingPaths += $normPath
                    $existingLabels += $pinLabel.ToLowerInvariant()
                    $addedPins += "$pinLabel -> $pinPath"
                }
                if ($addedPins.Count -gt 0) {
                    Save-OpusXml $favDoc $favOfv
                    [void]$applied.Add(('ConfigFiles\favorites.ofv: pinned ' + ($addedPins -join ', ')))
                }
            }
        }

        # 10. Buttons\Favorites Bar.dop (appButtons, copyPathButton, smartPaste, columnToggleButton, columnPresetsButton)
        $wantColToggle = ($cfg.columnToggleButton -eq $true -or $cfg.columnSwitcherButton -eq $true)
        $wantColPresets = ($cfg.columnPresetsButton -eq $true -or $cfg.columnSwitcherButton -eq $true)
        if ($cfg.smartPaste -eq $true -or $cfg.copyPathButton -eq $true -or $wantColToggle -or $wantColPresets -or ($cfg.appButtons -and @($cfg.appButtons).Count -gt 0)) {
            $favBarDop = Join-Path $config 'Buttons\Favorites Bar.dop'
            if (Test-Path $favBarDop) {
                $fbDoc = New-Object System.Xml.XmlDocument
                $fbDoc.Load($favBarDop)
                $buttonsNode = $fbDoc.SelectSingleNode('//toolbar/buttons')
                if ($buttonsNode) {
                    $managedLabels = @('Smart Paste', 'Copy Path', 'Columns', 'Extra Columns', 'Column Presets', 'VS Code', 'Cursor', 'Terminal', 'Git Bash', '7-Zip', 'Obsidian')
                    foreach ($btn in @($buttonsNode.SelectNodes('button'))) {
                        $lbl = $btn.SelectSingleNode('label')
                        if ($lbl -and ($managedLabels -contains $lbl.InnerText)) {
                            [void]$buttonsNode.RemoveChild($btn)
                        }
                    }

                    $anchorNode = $null
                    foreach ($btn in @($buttonsNode.SelectNodes('button'))) {
                        $lbl = $btn.SelectSingleNode('label')
                        if ($lbl -and $lbl.InnerText -like '*Other*Favor*') { $anchorNode = $btn; break }
                    }

                    function Add-FavBarButton([System.Xml.XmlElement]$btnEl) {
                        if ($anchorNode) { [void]$buttonsNode.InsertBefore($btnEl, $anchorNode) }
                        else { [void]$buttonsNode.AppendChild($btnEl) }
                    }

                    function New-SimpleButton([string]$label, [string]$tip, [string]$icon, [string[]]$instrList, [string]$funcType = 'normal') {
                        $b = $fbDoc.CreateElement('button')
                        $b.SetAttribute('backcol', 'none')
                        $b.SetAttribute('display', 'both')
                        $b.SetAttribute('label_pos', 'right')
                        $b.SetAttribute('textcol', 'none')
                        $l = $fbDoc.CreateElement('label'); $l.InnerText = $label; [void]$b.AppendChild($l)
                        $t = $fbDoc.CreateElement('tip'); $t.InnerText = $tip; [void]$b.AppendChild($t)
                        $i = $fbDoc.CreateElement('icon1'); $i.InnerText = $icon; [void]$b.AppendChild($i)
                        $fn = $fbDoc.CreateElement('function'); $fn.SetAttribute('type', $funcType)
                        foreach ($insText in @($instrList)) {
                            $ins = $fbDoc.CreateElement('instruction'); $ins.InnerText = [string]$insText; [void]$fn.AppendChild($ins)
                        }
                        [void]$b.AppendChild($fn)
                        return $b
                    }

                    function Resolve-AppExe([string[]]$candidates, [string]$cmdName) {
                        foreach ($c in $candidates) { if ($c -and (Test-Path $c)) { return $c } }
                        if ($cmdName) {
                            $found = Get-Command $cmdName -ErrorAction SilentlyContinue
                            if ($found -and $found.Source) { return $found.Source }
                        }
                        return $null
                    }

                    $addedBarItems = @()
                    if ($cfg.appButtons) {
                        foreach ($appId in @($cfg.appButtons)) {
                            switch ($appId.ToLowerInvariant()) {
                                'vscode' {
                                    $exe = Resolve-AppExe @((Join-Path $env:LOCALAPPDATA 'Programs\Microsoft VS Code\Code.exe'), (Join-Path $env:ProgramFiles 'Microsoft VS Code\Code.exe')) 'Code.exe'
                                    $icon = if ($exe) { "$exe,0" } else { '#cli' }
                                    $cmd = if ($exe) { "`"$exe`" {sourcepath|noterm}" } else { 'code {sourcepath|noterm}' }
                                    Add-FavBarButton (New-SimpleButton 'VS Code' 'Open current folder in VS Code' $icon @($cmd))
                                    $addedBarItems += 'VS Code'
                                }
                                'cursor' {
                                    $exe = Resolve-AppExe @((Join-Path $env:LOCALAPPDATA 'Programs\cursor\Cursor.exe'), (Join-Path $env:ProgramFiles 'cursor\Cursor.exe')) 'Cursor.exe'
                                    $icon = if ($exe) { "$exe,0" } else { '#cli' }
                                    $cmd = if ($exe) { "`"$exe`" {sourcepath|noterm}" } else { 'cursor {sourcepath|noterm}' }
                                    Add-FavBarButton (New-SimpleButton 'Cursor' 'Open current folder in Cursor' $icon @($cmd))
                                    $addedBarItems += 'Cursor'
                                }
                                'wt' {
                                    $exe = Resolve-AppExe @((Join-Path $env:LOCALAPPDATA 'Microsoft\WindowsApps\wt.exe')) 'wt.exe'
                                    $wtRealExe = $null
                                    if ($exe) {
                                        try {
                                            $wtItem = Get-Item $exe -ErrorAction SilentlyContinue
                                            if ($wtItem -and $wtItem.Target) {
                                                $candTarget = $wtItem.Target | Select-Object -First 1
                                                if ($candTarget -and (Test-Path $candTarget)) { $wtRealExe = $candTarget }
                                            }
                                        } catch {}
                                    }
                                    $icon = if ($wtRealExe) { "$wtRealExe,0" } else { '#cli' }
                                    $launchExe = if ($wtRealExe) { "`"$wtRealExe`"" } elseif ($exe) { "`"$exe`"" } else { 'wt.exe' }
                                    Add-FavBarButton (New-SimpleButton 'Terminal' 'Open Windows Terminal in current folder' $icon @("$launchExe -d {sourcepath|noterm}"))
                                    $addedBarItems += 'Terminal'
                                }
                                'gitbash' {
                                    $exe = Resolve-AppExe @((Join-Path $env:ProgramFiles 'Git\git-bash.exe')) 'git-bash.exe'
                                    if ($exe) {
                                        Add-FavBarButton (New-SimpleButton 'Git Bash' 'Open Git Bash in current folder' "$exe,0" @("`"$exe`" --cd={sourcepath|noterm}"))
                                        $addedBarItems += 'Git Bash'
                                    } else {
                                        [void]$skipped.Add('App button gitbash skipped: git-bash.exe not found')
                                    }
                                }
                                '7zip' {
                                    $exe = Resolve-AppExe @((Join-Path $env:ProgramFiles '7-Zip\7zFM.exe')) '7zFM.exe'
                                    if ($exe) {
                                        Add-FavBarButton (New-SimpleButton '7-Zip' 'Open current folder in 7-Zip File Manager' "$exe,0" @("`"$exe`" {sourcepath|noterm}"))
                                        $addedBarItems += '7-Zip'
                                    } else {
                                        [void]$skipped.Add('App button 7zip skipped: 7zFM.exe not found')
                                    }
                                }
                                'obsidian' {
                                    $exe = Resolve-AppExe @((Join-Path $env:LOCALAPPDATA 'Programs\Obsidian\Obsidian.exe')) $null
                                    if ($exe) {
                                        Add-FavBarButton (New-SimpleButton 'Obsidian' 'Launch Obsidian' "$exe,0" @("`"$exe`""))
                                        $addedBarItems += 'Obsidian'
                                    } else {
                                        [void]$skipped.Add('App button obsidian skipped: Obsidian.exe not found')
                                    }
                                }
                            }
                        }
                    }

                    if ($cfg.copyPathButton -eq $true) {
                        $cpBtn = $fbDoc.CreateElement('button')
                        $cpBtn.SetAttribute('backcol', 'none')
                        $cpBtn.SetAttribute('display', 'both')
                        $cpBtn.SetAttribute('label_pos', 'right')
                        $cpBtn.SetAttribute('textcol', 'none')
                        $cpBtn.SetAttribute('type', 'menu_button')
                        $l = $fbDoc.CreateElement('label'); $l.InnerText = 'Copy Path'; [void]$cpBtn.AppendChild($l)
                        $t = $fbDoc.CreateElement('tip'); $t.InnerText = 'Click: Copy current folder path | Arrow: Selected item paths, forward-slash paths, or filenames'; [void]$cpBtn.AppendChild($t)
                        $i = $fbDoc.CreateElement('icon1'); $i.InnerText = '#copyfilenames'; [void]$cpBtn.AppendChild($i)
                        $fn = $fbDoc.CreateElement('function'); $fn.SetAttribute('type', 'normal')
                        $ins = $fbDoc.CreateElement('instruction'); $ins.InnerText = 'Clipboard COPYNAMES=unc FILE {sourcepath}'; [void]$fn.AppendChild($ins)
                        [void]$cpBtn.AppendChild($fn)

                        [void]$cpBtn.AppendChild((New-SimpleButton 'Copy Current Folder Path' 'Copy the path of the active folder' '#copyfilenames' @('Clipboard COPYNAMES=unc FILE {sourcepath}')))
                        [void]$cpBtn.AppendChild((New-SimpleButton 'Copy Selected Full Path (C:\folder\file.txt)' 'Copy full paths of selected items' '#copyfilenames' @('Clipboard COPYNAMES=unc')))
                        [void]$cpBtn.AppendChild((New-SimpleButton 'Copy Selected Forward-Slash Path (C:/folder/file.txt)' 'Copy full paths with forward slashes for scripts and configs' '#copyfilenames' @('Clipboard COPYNAMES=unc REGEXP (.*)\\(.*)# \1/\2')))
                        [void]$cpBtn.AppendChild((New-SimpleButton 'Copy Selected Filename Only (file.txt)' 'Copy filenames without folder path' '#copyfilenames' @('Clipboard COPYNAMES=nopaths')))
                        Add-FavBarButton $cpBtn
                        $addedBarItems += 'Copy Path (menu-button)'
                    }

                    if ($cfg.smartPaste -eq $true) {
                        Add-FavBarButton (New-SimpleButton 'Smart Paste' 'Paste clipboard text or image as a new file (Ctrl+Shift+V)' '#clippaste' @('Clipboard PASTE AS=ask'))
                        $addedBarItems += 'Smart Paste'
                    }

                    if ($wantColToggle) {
                        $mb = $fbDoc.CreateElement('button')
                        $mb.SetAttribute('backcol', 'none')
                        $mb.SetAttribute('display', 'both')
                        $mb.SetAttribute('label_pos', 'right')
                        $mb.SetAttribute('textcol', 'none')
                        $mb.SetAttribute('type', 'menu_button')
                        $l = $fbDoc.CreateElement('label'); $l.InnerText = 'Extra Columns'; [void]$mb.AppendChild($l)
                        $t = $fbDoc.CreateElement('tip'); $t.InnerText = 'Click: Toggle Total File & Sub-folder Counts together | Arrow: Toggle individual extra columns with live checkmarks'; [void]$mb.AppendChild($t)
                        $i = $fbDoc.CreateElement('icon1'); $i.InnerText = '#folderformatslist'; [void]$mb.AppendChild($i)
                        $fn = $fbDoc.CreateElement('function'); $fn.SetAttribute('type', 'normal')
                        foreach ($line in @(
                            '@toggle:if&COLUMNSTOGGLE=filecounttotal',
                            '@if:Set COLUMNSTOGGLE=filecounttotal',
                            'Set COLUMNSREMOVE=filecounttotal,dircounttotal',
                            '@if:else',
                            'Set COLUMNSADD=filecounttotal,dircounttotal'
                        )) {
                            $ins = $fbDoc.CreateElement('instruction'); $ins.InnerText = $line; [void]$fn.AppendChild($ins)
                        }
                        [void]$mb.AppendChild($fn)

                        [void]$mb.AppendChild((New-SimpleButton 'Total File Count (Recursive)' 'Show or hide recursive file count in subfolders' '#folderformatslist' @('Set COLUMNSTOGGLE=filecounttotal')))
                        [void]$mb.AppendChild((New-SimpleButton 'Total Sub-folders (Recursive)' 'Show or hide recursive sub-folder count' '#folderformatslist' @('Set COLUMNSTOGGLE=dircounttotal')))
                        [void]$mb.AppendChild((New-SimpleButton 'File Count (Immediate only)' 'Show or hide top-level file count (zero disk lag)' '#folderformatslist' @('Set COLUMNSTOGGLE=filecount')))
                        $immDirBtn = New-SimpleButton 'Sub-folder Count (Immediate only)' 'Show or hide top-level sub-folder count' '#folderformatslist' @('Set COLUMNSTOGGLE=dircount')
                        $immDirBtn.SetAttribute('separate', 'yes')
                        [void]$mb.AppendChild($immDirBtn)

                        [void]$mb.AppendChild((New-SimpleButton 'Created Date' 'Show or hide file creation timestamp' '#folderformatslist' @('Set COLUMNSTOGGLE=created')))
                        $ageBtn = New-SimpleButton 'Relative Age (e.g. 2h ago)' 'Show or hide human-readable Modified age' '#folderformatslist' @('Set COLUMNSTOGGLE=daterel')
                        $ageBtn.SetAttribute('separate', 'yes')
                        [void]$mb.AppendChild($ageBtn)

                        [void]$mb.AppendChild((New-SimpleButton 'File Type' 'Show or hide sortable file type description' '#folderformatslist' @('Set COLUMNSTOGGLE=type')))
                        [void]$mb.AppendChild((New-SimpleButton 'File Extension (.ext)' 'Show or hide dedicated file extension column' '#folderformatslist' @('Set COLUMNSTOGGLE=ext')))
                        [void]$mb.AppendChild((New-SimpleButton 'Description (Auto metadata)' 'Show or hide image dimensions / bitrate summary' '#folderformatslist' @('Set COLUMNSTOGGLE=desc')))
                        [void]$mb.AppendChild((New-SimpleButton 'Symlink / Target Path' 'Show or hide junction/symlink target column' '#folderformatslist' @('Set COLUMNSTOGGLE=target')))

                        Add-FavBarButton $mb
                        $addedBarItems += 'Extra Columns (toggle + checklist)'
                    }

                    if ($wantColPresets) {
                        $pb = $fbDoc.CreateElement('button')
                        $pb.SetAttribute('backcol', 'none')
                        $pb.SetAttribute('display', 'icon')
                        $pb.SetAttribute('dropdown_glyph_slim', 'yes')
                        $pb.SetAttribute('label_pos', 'right')
                        $pb.SetAttribute('no_label', 'yes')
                        $pb.SetAttribute('textcol', 'none')
                        $pb.SetAttribute('type', 'menu')
                        $l = $fbDoc.CreateElement('label'); $l.InnerText = 'Column Presets'; [void]$pb.AppendChild($l)
                        $t = $fbDoc.CreateElement('tip'); $t.InnerText = 'Switch folder column presets (changes columns only, never changes view mode to thumbnails)'; [void]$pb.AppendChild($t)
                        $i = $fbDoc.CreateElement('icon1'); $i.InnerText = '#folderformatslist'; [void]$pb.AppendChild($i)

                        [void]$pb.AppendChild((New-SimpleButton 'Standard (Name, Size, Modified, Type)' 'Clean everyday columns' '#detailsmode' @('Set COLUMNS=name,sizeauto,modified,type')))
                        [void]$pb.AppendChild((New-SimpleButton 'Storage & Counts (Size, Total Files, Sub-folders, Created)' 'Audit folder sizes and nested item counts' '#getsizes' @('Set COLUMNS=name,sizeauto,filecounttotal,dircounttotal,modified,created')))
                        [void]$pb.AppendChild((New-SimpleButton 'Developer & Code (Ext, Size, Modified, Age, Attr, Target)' 'Code, scripts, attributes, and symlinks' '#cli' @('Set COLUMNS=name,ext,sizeauto,modified,daterel,attr,target')))
                        [void]$pb.AppendChild((New-SimpleButton 'Photos & EXIF (Size, Dimensions, Date Taken, Camera)' 'Photo metadata columns in list view (does not switch to thumbnails)' '#imageconversion' @('Set COLUMNS=name,sizeauto,picsize,datetaken,cameramake,cameramodel,modified')))
                        $vidPresetBtn = New-SimpleButton 'Video & Audio (Size, Dimensions, Duration, Codec, FPS, Bitrate)' 'Media production columns in list view' '#play' @('Set COLUMNS=name,sizeauto,picsize,duration,videocodec,framerate,mp3bitrate,modified')
                        $vidPresetBtn.SetAttribute('separate', 'yes')
                        [void]$pb.AppendChild($vidPresetBtn)

                        [void]$pb.AppendChild((New-SimpleButton 'Reset to Folder Default' 'Restore this folder to its saved default columns' '#refresh' @('Set FORMAT=!folder')))
                        [void]$pb.AppendChild((New-SimpleButton 'Edit Folder Format...' 'Open Folder Format dialog for the current folder' '#prefs' @('Properties FOLDERFORMAT')))

                        Add-FavBarButton $pb
                        $addedBarItems += 'Column Presets (mini-icon menu)'
                    }

                    Save-OpusXml $fbDoc $favBarDop
                    [void]$applied.Add(('Buttons\Favorites Bar.dop: placed ' + ($addedBarItems -join ', ') + ' on the Favorites Bar'))
                }
            } else {
                [void]$skipped.Add('Buttons\Favorites Bar.dop not found')
            }
        }

        # 11. Buttons\Staging Triage.dop & ConfigFiles\foldertoolbars.xml (stagingTriageFolders)
        if ($cfg.stagingTriageFolders -and @($cfg.stagingTriageFolders).Count -gt 0) {
            $stDop = Join-Path $config 'Buttons\Staging Triage.dop'
            $stDoc = New-Object System.Xml.XmlDocument
            [void]$stDoc.AppendChild($stDoc.CreateXmlDeclaration('1.0', 'UTF-8', $null))
            $tbRoot = $stDoc.CreateElement('toolbar')
            $btnsEl = $stDoc.CreateElement('buttons')
            $btnsEl.SetAttribute('backcol', 'none')
            $btnsEl.SetAttribute('display', 'both')
            $btnsEl.SetAttribute('textcol', 'none')

            $stDefs = @(
                @{ label = 'Flatten';         tip = 'Toggle Flat View (show all files in subfolders without folders)'; icon = '#flatviewmixednofolders'; cmd = 'Set FLATVIEW=toggle,mixednofolders' },
                @{ label = 'Group by age';    tip = 'Toggle grouping by Modified date';                                icon = '#groupby';                cmd = 'Set GROUPBY=modified,toggle' },
                @{ label = 'Move to Archive'; tip = 'Move selected items into an Archive subfolder here';              icon = '#move';                   cmd = 'Copy MOVE HERE CREATEFOLDER="Archive"' }
            )
            foreach ($sd in $stDefs) {
                $b = $stDoc.CreateElement('button')
                $b.SetAttribute('backcol', 'none'); $b.SetAttribute('display', 'both'); $b.SetAttribute('label_pos', 'right'); $b.SetAttribute('textcol', 'none')
                $l = $stDoc.CreateElement('label'); $l.InnerText = $sd.label; [void]$b.AppendChild($l)
                $t = $stDoc.CreateElement('tip'); $t.InnerText = $sd.tip; [void]$b.AppendChild($t)
                $ic = $stDoc.CreateElement('icon1'); $ic.InnerText = $sd.icon; [void]$b.AppendChild($ic)
                $fn = $stDoc.CreateElement('function'); $fn.SetAttribute('type', 'normal')
                $ins = $stDoc.CreateElement('instruction'); $ins.InnerText = $sd.cmd; [void]$fn.AppendChild($ins)
                [void]$b.AppendChild($fn)
                [void]$btnsEl.AppendChild($b)
            }
            [void]$tbRoot.AppendChild($btnsEl)
            [void]$stDoc.AppendChild($tbRoot)
            Save-OpusXml $stDoc $stDop

            $ftXml = Join-Path $config 'ConfigFiles\foldertoolbars.xml'
            $ftDoc = New-Object System.Xml.XmlDocument
            if (Test-Path $ftXml) {
                $ftDoc.Load($ftXml)
            } else {
                [void]$ftDoc.AppendChild($ftDoc.CreateXmlDeclaration('1.0', 'UTF-8', $null))
                [void]$ftDoc.AppendChild($ftDoc.CreateElement('foldertoolbars'))
            }
            $ftRoot = $ftDoc.DocumentElement
            $existingFt = @($ftRoot.SelectNodes('entry[@toolbar="Staging Triage"]/pathstring') | ForEach-Object { $_.InnerText.Trim().TrimEnd('\').ToLowerInvariant() })
            foreach ($stFolder in @($cfg.stagingTriageFolders)) {
                if (-not $stFolder) { continue }
                $normSt = ([string]$stFolder).Trim().TrimEnd('\').ToLowerInvariant()
                if ($existingFt -contains $normSt) { continue }
                $en = $ftDoc.CreateElement('entry')
                $en.SetAttribute('pos', '0')
                $en.SetAttribute('set', 'no')
                $en.SetAttribute('subfolders', 'yes')
                $en.SetAttribute('toolbar', 'Staging Triage')
                $en.SetAttribute('type', 'folder')
                $ps = $ftDoc.CreateElement('pathstring')
                $ps.InnerText = ([string]$stFolder).Trim()
                [void]$en.AppendChild($ps)
                [void]$ftRoot.AppendChild($en)
                $existingFt += $normSt
            }
            Save-OpusXml $ftDoc $ftXml
            [void]$applied.Add(('ConfigFiles\foldertoolbars.xml: attached Staging Triage toolbar to ' + (@($cfg.stagingTriageFolders) -join ', ')))
        }

        # 12. Telemetry script add-in
        if ($cfg.telemetry -eq 'on') {
            $source = Join-Path $PSScriptRoot 'JooKoiTelemetry.js'
            if (Test-Path $source) {
                $addins = Join-Path $config 'Script AddIns'
                New-Item -ItemType Directory -Force -Path $addins | Out-Null
                Copy-Item $source (Join-Path $addins 'JooKoiTelemetry.js') -Force
                $logDir = Join-Path $env:LOCALAPPDATA 'jookoi-directory-opus-skill'
                New-Item -ItemType Directory -Force -Path $logDir | Out-Null
                [void]$applied.Add('Script AddIns\JooKoiTelemetry.js: enabled local telemetry')
            } else {
                [void]$skipped.Add('Script AddIns\JooKoiTelemetry.js source not found')
            }
        } elseif ($cfg.telemetry -eq 'off') {
            $dest = Join-Path (Join-Path $config 'Script AddIns') 'JooKoiTelemetry.js'
            if (Test-Path $dest) {
                Remove-Item $dest -Force
                [void]$applied.Add('Script AddIns\JooKoiTelemetry.js: disabled local telemetry')
            }
        }

        # 13. Start DOpus and apply live Lister state + silent persistence
        Start-OpusDetached
        $startDeadline = (Get-Date).AddSeconds(15)
        while (-not (Test-OpusRunning) -and (Get-Date) -lt $startDeadline) { Start-Sleep -Milliseconds 300 }
        Start-Sleep -Milliseconds 1500
        $hasWindow = @(Get-Process -Name dopus -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -ne 0 }).Count -gt 0
        if (-not $hasWindow) {
            Invoke-OpusCommand 'Prefs LAYOUT=default' | Out-Null
            Start-Sleep -Milliseconds 1500
        }

        $liveCmds = New-Object System.Collections.ArrayList
        if ($cfg.layout -in @('side-by-side', 'dual')) {
            [void]$liveCmds.Add('Set DUAL=off')
            [void]$liveCmds.Add('Set DUAL=on,vert,remember')
        } elseif ($cfg.layout -in @('top-and-bottom', 'stacked')) {
            [void]$liveCmds.Add('Set DUAL=off')
            [void]$liveCmds.Add('Set DUAL=on,horiz,remember')
        } elseif ($cfg.layout -eq 'single') {
            [void]$liveCmds.Add('Set DUAL=off,remember')
        }

        if ($cfg.tree -eq 'off') { [void]$liveCmds.Add('Set TREE=off') }
        elseif ($cfg.tree -in @('single', 'on')) { [void]$liveCmds.Add('Set TREE=on') }
        elseif ($cfg.tree -eq 'dual') { [void]$liveCmds.Add('Set TREE=on,dual') }

        if ($cfg.darkMode -eq $true) { [void]$liveCmds.Add('Set DARKMODE=on') }
        elseif ($cfg.darkMode -eq $false) { [void]$liveCmds.Add('Set DARKMODE=off') }

        if ($cfg.viewerPane -eq $true) { [void]$liveCmds.Add('Set VIEWPANE=on,vert') }
        elseif ($cfg.viewerPane -eq $false) { [void]$liveCmds.Add('Set VIEWPANE=off') }

        if ($cfg.compactRows -eq $true) { [void]$liveCmds.Add('Set SPACINGSCHEME="Compact"') }
        elseif ($cfg.compactRows -eq $false) { [void]$liveCmds.Add('Set SPACINGSCHEME="Standard"') }

        if ($cfg.titlebarMenu -eq $true) { [void]$liveCmds.Add('Set TITLEBARTOOLBARS=on') }
        elseif ($cfg.titlebarMenu -eq $false) { [void]$liveCmds.Add('Set TITLEBARTOOLBARS=off') }

        if ($cfg.cleanTopToolbar -eq $true) { [void]$liveCmds.Add('Toolbar NAME="Operations" CLOSE') }
        elseif ($cfg.cleanTopToolbar -eq $false) { [void]$liveCmds.Add('Toolbar NAME="Operations" STATE=top LINE=1') }
        if ($cfg.instantSizes -eq $true) { [void]$liveCmds.Add('Set CALCFOLDERSIZES=all') }

        if ($cfg.columns -and @($cfg.columns).Count -gt 0) {
            [void]$liveCmds.Add(('Set COLUMNS=' + (@($cfg.columns) -join ',')))
        }

        $saveFmtFlags = if ($cfg.replaceContainerFormats -eq $true) { 'all,replace,quiet' } else { 'all,quiet' }
        [void]$liveCmds.Add("Set SAVEFORMAT=$saveFmtFlags")
        [void]$liveCmds.Add('Set FORMAT=!folder')
        [void]$liveCmds.Add('Toolbar SETDEFAULT=quiet')
        [void]$liveCmds.Add('Prefs SETLISTERDEFAULTS=force,quiet,toolbars,formats')

        foreach ($lc in $liveCmds) {
            Invoke-OpusCommand $lc | Out-Null
            Start-Sleep -Milliseconds 250
        }

        # Verify dual layout orientation bit in default.oll and flip with togglelayout if needed
        if ((Test-Path $defOllPath) -and ($cfg.layout -in @('side-by-side', 'dual', 'top-and-bottom', 'stacked'))) {
            try {
                [xml]$chkOll = Get-Content $defOllPath -Raw
                $chkLay = $chkOll.SelectSingleNode('//lister_layout/lister/layout')
                if ($chkLay -and ($chkLay.GetAttribute('flags') -match '^0x([0-9a-fA-F]+)$')) {
                    $chkVal = [Convert]::ToInt64($Matches[1], 16)
                    $isSideBySide = (($chkVal -band 0x20L) -ne 0)
                    $wantSideBySide = ($cfg.layout -in @('side-by-side', 'dual'))
                    if ($isSideBySide -ne $wantSideBySide) {
                        Invoke-OpusCommand 'Set DUAL=togglelayout' | Out-Null
                        Start-Sleep -Milliseconds 250
                        Invoke-OpusCommand 'Prefs SETLISTERDEFAULTS=force,quiet,toolbars,formats' | Out-Null
                        Start-Sleep -Milliseconds 300
                        [void]$liveCmds.Add('Set DUAL=togglelayout')
                        [void]$liveCmds.Add('Prefs SETLISTERDEFAULTS=force,quiet,toolbars,formats')
                    }
                }
            } catch {}
        }

        # Optional per-folder custom views (Step 2b)
        if ($cfg.folderFormats -and @($cfg.folderFormats).Count -gt 0) {
            foreach ($ff in @($cfg.folderFormats)) {
                if (-not $ff.path -or -not (Test-Path $ff.path)) {
                    [void]$skipped.Add(("Per-folder format skipped (path not found): " + $ff.path))
                    continue
                }
                Invoke-OpusCommand ('Go "' + $ff.path + '"') | Out-Null
                Start-Sleep -Milliseconds 350
                if ($ff.viewMode) { Invoke-OpusCommand ('Set VIEW=' + $ff.viewMode) | Out-Null }
                if ($ff.columns -and @($ff.columns).Count -gt 0) {
                    Invoke-OpusCommand ('Set COLUMNS=' + (@($ff.columns) -join ',')) | Out-Null
                }
                if ($ff.sortBy) {
                    $rev = if ($ff.sortReverse -eq $true) { ' SORTREVERSE=on' } elseif ($ff.sortReverse -eq $false) { ' SORTREVERSE=off' } else { '' }
                    Invoke-OpusCommand ('Set SORTBY=' + $ff.sortBy + $rev) | Out-Null
                }
                $subFlag = if ($ff.subfolders -eq $true) { ',subfolders' } else { '' }
                Invoke-OpusCommand ("Set SAVEFORMAT=folder${subFlag},replace,quiet") | Out-Null
                Start-Sleep -Milliseconds 250
                [void]$applied.Add(('Saved per-folder format for ' + $ff.path))
            }
            Invoke-OpusCommand 'Go BACK' | Out-Null
        }

        Start-Sleep -Milliseconds 800
        $afterDialogs = @(Get-OpusDialogs | ForEach-Object { Format-OpusDialog $_ })

        # 14. Post-check verification of saved XML state + file diff against backup
        $verLayout = 'unknown'
        $verTreeOpen = $false
        if (Test-Path $defOllPath) {
            try {
                [xml]$vOll = Get-Content $defOllPath -Raw
                $vLay = $vOll.SelectSingleNode('//lister_layout/lister/layout')
                if ($vLay -and ($vLay.GetAttribute('flags') -match '^0x([0-9a-fA-F]+)$')) {
                    $vVal = [Convert]::ToInt64($Matches[1], 16)
                    $verTreeOpen = (($vVal -band 0x6L) -ne 0)
                    if (($vVal -band 0x8L) -eq 0) { $verLayout = 'single' }
                    elseif (($vVal -band 0x20L) -ne 0) { $verLayout = 'side-by-side' }
                    else { $verLayout = 'top-and-bottom' }
                }
            } catch {}
        }
        $verOpsOpen = (Test-Path $toolbarsOxc) -and ((Get-Content $toolbarsOxc -Raw) -match 'name="Operations"')
        $verCols = @()
        $defOffCheck = Join-Path $config 'Formats\default.off'
        if (Test-Path $defOffCheck) {
            try {
                [xml]$vDef = Get-Content $defOffCheck -Raw
                $verCols = @($vDef.SelectNodes('//folder_formats/path[@name="default"]/format/field') | ForEach-Object { $_.GetAttribute('id') })
            } catch {}
        }

        $changedFiles = New-Object System.Collections.ArrayList
        $oldHashes = @{}
        Get-ChildItem $backupTarget -Recurse -File | ForEach-Object {
            $rel = $_.FullName.Substring($backupTarget.Length).TrimStart('\')
            $oldHashes[$rel] = (Get-FileHash $_.FullName -Algorithm SHA256).Hash
        }
        Get-ChildItem $config -Recurse -File | Where-Object { $_.FullName -notmatch '\\Logs(\\|$)' } | ForEach-Object {
            $rel = $_.FullName.Substring($config.Length).TrimStart('\')
            $h = (Get-FileHash $_.FullName -Algorithm SHA256).Hash
            if (-not $oldHashes.ContainsKey($rel)) { [void]$changedFiles.Add("+ $rel") }
            elseif ($oldHashes[$rel] -ne $h) { [void]$changedFiles.Add("~ $rel") }
        }

        [pscustomobject]@{
            status        = if ($afterDialogs.Count -eq 0) { 'ok' } else { 'dialog_open' }
            backupPath    = $backupTarget
            revertCommand = "powershell -NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`" restore -From `"$backupTarget`""
            verified      = [pscustomobject]@{
                layout                = $verLayout
                folderTreeOpen        = $verTreeOpen
                operationsToolbarOpen = [bool]$verOpsOpen
                defaultColumns        = $verCols
            }
            applied       = $applied
            skipped       = $skipped
            changedFiles  = $changedFiles
            liveCommands  = $liveCmds
            openDialogs   = $afterDialogs
        } | ConvertTo-Json -Depth 5
    }
}
