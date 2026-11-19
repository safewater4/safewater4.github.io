@echo off
title SafeWater Local Server
chcp 65001 >nul
echo Dang khoi dong may chu noi bo SafeWater...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-server.ps1"
pause
