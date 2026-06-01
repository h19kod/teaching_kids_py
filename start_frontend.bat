@echo off
echo ========================================
echo  Kids Learning Adventure - Frontend
echo ========================================
cd /d "%~dp0client"

echo [1/2] Installing npm packages...
call npm install

echo [2/2] Starting Vite dev server...
echo.
echo   Frontend: http://localhost:5173
echo.
npm run dev
