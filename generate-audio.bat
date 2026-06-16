@echo off
title German Coach - MP3 Ses Uretimi
cd /d "%~dp0"

echo ========================================
echo   Edge TTS - MP3 Ses Uretimi
echo ========================================
echo.
echo 1 = Timur Modu (depo/lojistik) ~204 dosya
echo 2 = A1 tum kelimeler ~1020 dosya (uzun surer)
echo 3 = Hepsi
echo.

set /p CHOICE="Secim (1/2/3) [1]: "
if "%CHOICE%"=="" set CHOICE=1

if "%CHOICE%"=="1" (
  call node scripts/generate-audio.mjs --pack timur
) else if "%CHOICE%"=="2" (
  call node scripts/generate-audio.mjs --pack a1
) else (
  call node scripts/generate-audio.mjs --pack all
)

echo.
echo Bitti. MP3 dosyalari: apps\web\public\audio\
pause
