@echo off
REM Tribe Backend Startup Script for Windows

echo.
echo ========================================
echo ^🚀 Tribe Backend Startup Script
echo ========================================
echo.

REM Check if virtual environment exists
if not exist "venv" (
    echo 📦 Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo ✅ Activating virtual environment...
call venv\Scripts\activate.bat

REM Install/upgrade dependencies
echo 📚 Installing dependencies...
pip install -q -r requirements.txt

REM Check if .env exists
if not exist ".env" (
    echo ⚠️  Creating .env from .env.example...
    copy .env.example .env
    echo ⚠️  Please update .env with your configuration
)

echo.
echo 🎉 Startup complete!
echo Start the server with: uvicorn app.main:app --reload
echo API documentation: http://localhost:8000/docs
echo.

pause
