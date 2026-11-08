@echo off
rem jj menu for CMD. Must be on PATH, `npm run setup:jj` adds this folder to the user PATH.
rem jj.mjs writes "cd" or "run" plus a payload to a temp file, and this script applies it in the calling cmd.
setlocal
set "JJ_RESULT_FILE=%TEMP%\jj-%RANDOM%%RANDOM%.txt"
node "%~dp0jj.mjs"
if errorlevel 1 (
  if exist "%JJ_RESULT_FILE%" del "%JJ_RESULT_FILE%"
  endlocal
  exit /b 1
)
set "jj_kind="
set "jj_payload="
if exist "%JJ_RESULT_FILE%" (
  for /f "usebackq delims=" %%L in ("%JJ_RESULT_FILE%") do if not defined jj_kind (set "jj_kind=%%L") else if not defined jj_payload set "jj_payload=%%L"
  del "%JJ_RESULT_FILE%"
)
if /i "%jj_kind%"=="cd" endlocal & cd /d "%jj_payload%" & exit /b 0
if /i "%jj_kind%"=="run" endlocal & %jj_payload% & exit /b 0
endlocal
