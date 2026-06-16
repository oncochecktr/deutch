@echo off
title German Coach - Gelistirici Modu
cd /d "%~dp0"

echo ========================================
echo   UYARI: dev.bat AYRI bir CMD acar!
echo   Normal kullanim: sadece start.bat
echo ========================================
echo.
echo Devam etmek icin bir tusa basin...
pause >nul
echo.

for %%P in (3000 3001 3010) do (
  for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":%%P" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
  )
)
timeout /t 1 >nul

if exist "apps\web\.next" rmdir /s /q "apps\web\.next"

cd apps\web
node "..\..\node_modules\next\dist\bin\next" dev -p 3000

pause
