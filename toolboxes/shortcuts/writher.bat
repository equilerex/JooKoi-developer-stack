@echo off
rem Writher voice dictation, runs in the background (no window)
if not exist "D:\repos\Babylon-5\jookoi-forked-writher\main.py" (
  echo Writher not found at D:\repos\Babylon-5\jookoi-forked-writher
  pause
  exit /b 1
)
cd /d "D:\repos\Babylon-5\jookoi-forked-writher"
start "" pythonw main.py
