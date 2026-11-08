@echo off
rem AI Engineering Fluency dashboard: starts the server and opens http://localhost:3333
set "FLUENCY_WEB=D:\repos\Babylon-5\jookoi-forked-ai-engineering-fluency\web"
if not exist "%FLUENCY_WEB%\package.json" (
  echo Fluency web not found at %FLUENCY_WEB%
  pause
  exit /b 1
)
cd /d "%FLUENCY_WEB%"
if not exist dist\server.js (
  echo Building fluency web...
  call npm run build || goto :fail
)
start "" http://localhost:3333
node dist\server.js
if errorlevel 1 goto :fail
goto :eof
:fail
echo.
echo Fluency dashboard failed to start.
pause
