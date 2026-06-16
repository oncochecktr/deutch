@echo off
title German Coach - CSS Duzelt
cd /d "%~dp0"

echo ========================================
echo   CSS duzeltme (stop + derle + baslat)
echo ========================================
echo.

for %%P in (3000 3001 3010) do (
  for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":%%P" ^| findstr "LISTENING"') do (
    echo Eski sunucu kapatiliyor PID %%a
    taskkill /F /PID %%a >nul 2>&1
  )
)
del "%~dp0.german-coach.lock" 2>nul
timeout /t 1 >nul

echo Derleniyor (~20 sn)...
cd apps\web
node "..\..\node_modules\next\dist\bin\next" build
if errorlevel 1 (
    cd ..\..
    echo DERLEME HATASI!
    pause
    exit /b 1
)

echo Sunucu baslatiliyor...
start "German Coach" cmd /k "cd /d %~dp0apps\web && node ..\..\node_modules\next\dist\bin\next start -p 3000"

cd ..\..
timeout /t 3 >nul
node "%~dp0scripts\verify-css.mjs"
if errorlevel 1 (
    echo.
    echo CSS hala sorunlu — birkaç saniye bekleyip tarayicida Ctrl+F5 yapin.
) else (
    echo.
    echo OK — http://localhost:3000  ^(Ctrl+F5^)
)
pause
