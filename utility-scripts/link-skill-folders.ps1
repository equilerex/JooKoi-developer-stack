[CmdletBinding()]
param(
    [string[]]$SourceRoot,
    [string]$DestinationRoot,
    [switch]$Force
)

$resolvedHome = if ($env:USERPROFILE) {
    $env:USERPROFILE
} elseif ($HOME) {
    $HOME
} else {
    $env:USERNAME
}

if (-not $resolvedHome -or -not (Test-Path $resolvedHome)) {
    throw "Could not resolve a valid home/profile directory. Set USERPROFILE or HOME before running this script."
}

$sourceRoots = @()
if ($SourceRoot) {
    $sourceRoots = @($SourceRoot | Where-Object { $_ -and $_.Trim() })
} else {
    $candidateRoots = @(
        (Join-Path $resolvedHome '.agents\skills'),
        (Join-Path $resolvedHome '.gemini\antigravity-cli\skills')
    )
    $sourceRoots = @($candidateRoots | Where-Object { Test-Path $_ })
}

if (-not $sourceRoots -or $sourceRoots.Count -eq 0) {
    throw "No source skill folders were found. Checked: ~/.agents/skills and ~/.gemini/antigravity-cli/skills"
}

if (-not $DestinationRoot) {
    $DestinationRoot = Join-Path $resolvedHome '.claude\skills'
}

$destDir = $DestinationRoot
if (-not (Test-Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir -Force | Out-Null
    Write-Host "Created destination folder: $destDir" -ForegroundColor Cyan
}

$seenNames = @{}
foreach ($sourceDir in $sourceRoots) {
    if (-not (Test-Path $sourceDir)) {
        Write-Host "Skipping missing source folder: $sourceDir" -ForegroundColor Yellow
        continue
    }

    if (-not (Get-ChildItem -Path $sourceDir -Force -ErrorAction SilentlyContinue)) {
        Write-Host "No skills found in $sourceDir" -ForegroundColor Yellow
        continue
    }

    foreach ($item in (Get-ChildItem -Path $sourceDir -Force)) {
        if ($item.Name -in @('.', '..', '~')) {
            continue
        }

        if ($seenNames.ContainsKey($item.Name)) {
            continue
        }

        $seenNames[$item.Name] = $sourceDir
        $targetPath = Join-Path $destDir $item.Name

        if (Test-Path $targetPath) {
            Write-Host "Replacing existing target: $($item.Name)" -ForegroundColor Yellow
            Remove-Item -Path $targetPath -Force -Recurse
        }

        try {
            if ($item.PSIsContainer) {
                New-Item -ItemType Junction -Path $targetPath -Target $item.FullName | Out-Null
                Write-Host "Linked directory: $($item.Name) -> $targetPath" -ForegroundColor Green
            }
            else {
                New-Item -ItemType HardLink -Path $targetPath -Target $item.FullName | Out-Null
                Write-Host "Linked file: $($item.Name) -> $targetPath" -ForegroundColor Green
            }
        }
        catch {
            Write-Host "Failed to link $($item.Name): $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

Write-Host "Done. Sources: $($sourceRoots -join '; ')" -ForegroundColor Cyan
Write-Host "Destination: $destDir" -ForegroundColor Cyan
