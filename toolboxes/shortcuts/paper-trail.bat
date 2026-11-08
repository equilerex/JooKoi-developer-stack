@echo off
rem Paper-trail viewer: working-set items of every repo at http://127.0.0.1:4173
set "VIEWER_SERVER=%USERPROFILE%\.agents\skills\jookoi-paper-trail\scripts\viewer\server.js"
if not exist "%VIEWER_SERVER%" (
  echo Paper-trail skill not found at %VIEWER_SERVER%
  pause
  exit /b 1
)
node "%VIEWER_SERVER%" ensure --open
if errorlevel 1 pause
