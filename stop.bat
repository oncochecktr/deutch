@echo off
cd /d "%~dp0"
title German Coach - Durdur

REM Port dinleyen sunuculari kapat (node + alt processler)
for %%P in (3000 3001 3010) do (
  for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":%%P" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a /T >nul 2>&1
  )
)

REM next start / next dev kalintilari
powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \"Name='node.exe'\" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -match 'next' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }" >nul 2>&1

REM start.bat ile acilan CMD penceresini kapat
if exist "%~dp0.german-coach-shell.pid" (
  for /f "usebackq delims=" %%p in ("%~dp0.german-coach-shell.pid") do (
    taskkill /F /PID %%p /T >nul 2>&1
  )
  del "%~dp0.german-coach-shell.pid" 2>nul
)

del "%~dp0.german-coach.lock" 2>nul
echo Sunucu durduruldu. start.bat penceresi kapandi.
timeout /t 2 >nul
exit /b 0
