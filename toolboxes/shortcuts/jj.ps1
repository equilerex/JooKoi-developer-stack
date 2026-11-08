# Defines the `jj` function for Windows PowerShell and PowerShell 7.
# Dot-sourced from $PROFILE by `npm run setup:jj`. jj.mjs writes "cd" or "run"
# plus a payload to a temp file, and this function applies it in the current shell.
function jj {
    $resultFile = [System.IO.Path]::GetTempFileName()
    try {
        $env:JJ_RESULT_FILE = $resultFile
        node (Join-Path $PSScriptRoot 'jj.mjs')
        if ($LASTEXITCODE -ne 0) { return }
        $lines = @(Get-Content -LiteralPath $resultFile -Encoding UTF8)
        if ($lines.Count -lt 2) { return }
        switch ($lines[0]) {
            'cd' { Set-Location -LiteralPath $lines[1] }
            'run' { Invoke-Expression $lines[1] }
        }
    }
    finally {
        Remove-Item -LiteralPath $resultFile -ErrorAction SilentlyContinue
        Remove-Item Env:\JJ_RESULT_FILE -ErrorAction SilentlyContinue
    }
}
