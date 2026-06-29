@echo off
setlocal EnableDelayedExpansion
title German Coach
cd /d "%~dp0"
set "LOCK=%~dp0.german-coach.lock"
set "SHELL_PID=%~dp0.german-coach-shell.pid"

REM stop.bat bu CMD penceresini kapatabilsin diye PID kaydet
for /f %%i in ('powershell -NoProfile -Command "(Get-CimInstance Win32_Process -Filter \"ProcessId=$PID\").ParentProcessId"') do echo %%i> "%SHELL_PID%"

echo ========================================
echo   German Coach - Tek pencere
echo ========================================
echo.

REM Eski lock kaldi ama sunucu yoksa kilidi sil
if exist "%LOCK%" (
  set "PORT_BUSY=0"
  for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":3000" ^| findstr "LISTENING"') do set "PORT_BUSY=1"
  if "%PORT_BUSY%"=="0" (
    del "%LOCK%" 2>nul
  ) else (
    echo [HATA] Port 3000 dolu — baska sunucu calisiyor.
    echo   fix-css.bat veya stop.bat calistir, sonra start.bat
    echo.
    pause
    exit /b 1
  )
)

echo running> "%LOCK%"

if not exist "node_modules" (
    echo Bagimliliklar yukleniyor...
    call npm install
    if errorlevel 1 (
        del "%LOCK%" 2>nul
        pause
        exit /b 1
    )
)

echo Eski sunucular kapatiliyor (CSS uyumu icin sart)...
for %%P in (3000 3001 3010) do (
  for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":%%P" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
  )
)
timeout /t 1 >nul

set "DO_BUILD=0"
if /i "%~1"=="--fast" goto :build_check_done
if /i "%~1"=="--rebuild" set "DO_BUILD=1"
if not exist "apps\web\.next\BUILD_ID" set "DO_BUILD=1"
if not exist "apps\web\.next\static\css" set "DO_BUILD=1"
for /f %%h in ('git rev-parse HEAD 2^>nul') do set "GIT_HEAD=%%h"
if defined GIT_HEAD (
  if exist "apps\web\.next\SOURCE_REV" (
    set /p BUILT_REV=<"apps\web\.next\SOURCE_REV"
    if not "!GIT_HEAD!"=="!BUILT_REV!" set "DO_BUILD=1"
  ) else (
    set "DO_BUILD=1"
  )
)
if "%DO_BUILD%"=="0" (
  dir /b "apps\web\.next\static\css\*.css" >nul 2>&1
  if errorlevel 1 (
    dir /b /s "apps\web\.next\static\css\*.css" >nul 2>&1
    if errorlevel 1 set "DO_BUILD=1"
  )
)
goto :build_check_done

:build_check_done
if "%DO_BUILD%"=="1" (
    echo Derleme ^(~20 sn^)...
    cd apps\web
    node "..\..\node_modules\next\dist\bin\next" build
    if errorlevel 1 (
        cd ..\..
        del "%LOCK%" 2>nul
        echo DERLEME HATASI!
        pause
        exit /b 1
    )
    if defined GIT_HEAD echo !GIT_HEAD!> .next\SOURCE_REV
    cd ..\..
) else (
    echo Hizli acilis ^(--fast^): derleme atlandi.
)

echo.
echo   Tek adres: http://localhost:3000
echo   (Baska port kullanilmaz — 3000 doluysa once stop.bat)
echo   CSS patlaksa: fix-css.bat  veya  start.bat --rebuild
echo   Chunk hatasi: start.bat --rebuild  sonra  Ctrl+F5
echo   Tarayici: Ctrl+F5
echo.

cd apps\web
node "..\..\node_modules\next\dist\bin\next" start -p 3000

cd ..\..
del "%LOCK%" 2>nul
del "%SHELL_PID%" 2>nul
echo Sunucu kapandi.
timeout /t 2 >nul
exit /b 0
