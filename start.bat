@echo off
title German Coach
cd /d "%~dp0"
set "LOCK=%~dp0.german-coach.lock"

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
if not exist "apps\web\.next\static\css\*.css" set "DO_BUILD=1"
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
    cd ..\..
) else (
    echo Hizli acilis ^(--fast^): derleme atlandi.
)

echo.
echo   http://localhost:3000
echo   CSS patlaksa: fix-css.bat  veya  start.bat --rebuild
echo   Tarayici: Ctrl+F5
echo.

cd apps\web
node "..\..\node_modules\next\dist\bin\next" start -p 3000

cd ..\..
del "%LOCK%" 2>nul
pause
