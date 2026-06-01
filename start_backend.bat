@echo off
echo ========================================
echo  Kids Learning Adventure - Backend
echo ========================================
cd /d "%~dp0server"

echo [1/3] Creating virtual environment...
if not exist venv (
    python -m venv venv
)

echo [2/3] Installing dependencies...
call venv\Scripts\activate.bat
pip install -r requirements.txt -q

echo [3/3] Starting FastAPI server...
echo.
echo   API Docs:  http://localhost:8000/api/docs
echo   Backend:   http://localhost:8000
echo.
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
