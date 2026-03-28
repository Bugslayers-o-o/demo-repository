@echo off
REM Quick Start Script for MindSathi (Windows)

echo 🚀 Starting MindSathi...
echo.

REM Check if frontend .env exists
if not exist "frontend\.env" (
    echo ⚠️  frontend\.env file not found!
    echo Please create frontend\.env file with Firebase credentials
    echo See frontend\.env.example for template
    exit /b 1
)

REM Check if backend firebase-key.json exists
if not exist "backend\firebase_admin_sdk.json" (
    echo ⚠️  backend\firebase_admin_sdk.json not found!
    echo Please download service account key from Firebase Console
    exit /b 1
)

REM Create backend .env if not exists
if not exist "backend\.env" (
    echo FIREBASE_CREDENTIALS_PATH=./firebase_admin_sdk.json > backend\.env
)

echo 📦 Starting backend (FastAPI)...
cd backend
if not exist "venv" (
    python -m venv venv
)
call venv\Scripts\activate.bat
pip install -q -r requirements.txt
cd ..
start cmd /k "python -m uvicorn backend.main:app --reload --port 8000"

echo 🎨 Starting frontend (Vite)...
cd frontend
start cmd /k "npm run dev"

echo.
echo ✅ MindSathi started!
echo Frontend: http://localhost:5173
echo Backend: http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
pause
