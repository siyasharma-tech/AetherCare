@echo off
cd /d "%~dp0"
echo Cleaning old install...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
echo Installing packages (this can take a minute)...
call npm install
if errorlevel 1 (
  echo.
  echo npm install failed. Check your internet connection and try again.
  pause
  exit /b 1
)
echo Starting AetherCare...
call npm run dev
pause
