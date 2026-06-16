@echo off
cd /d "%~dp0"
title German Coach - Durdur

for %%P in (3000 3001 3010) do (
  for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":%%P" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
  )
)

del "%~dp0.german-coach.lock" 2>nul
echo Sunucu durduruldu.
echo CSS sorunu icin: fix-css.bat  veya  start.bat --rebuild
timeout /t 2 >nul
