@echo off
rem Vault viewer: starts the server and opens http://localhost:4180
if not exist "C:\JooKoi-vault\start-viewer.bat" (
  echo Vault not found at C:\JooKoi-vault
  pause
  exit /b 1
)
call "C:\JooKoi-vault\start-viewer.bat"
