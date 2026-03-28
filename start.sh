#!/bin/bash
# Quick Start Script for MindSathi

echo "🚀 Starting MindSathi..."
echo ""

# Check if frontend/.env exists
if [ ! -f "frontend/.env" ]; then
    echo "⚠️  frontend/.env file not found!"
    echo "Please create frontend/.env file with Firebase credentials"
    echo "See frontend/.env.example for template"
    exit 1
fi

# Check if backend/.env exists
if [ ! -f "backend/.env" ]; then
    echo "⚠️  backend/.env file not found!"
    echo "Creating basic backend/.env..."
    echo "FIREBASE_CREDENTIALS_PATH=./firebase_admin_sdk.json" > backend/.env
fi

# Check if service account exists
if [ ! -f "backend/firebase_admin_sdk.json" ]; then
    echo "⚠️  backend/firebase_admin_sdk.json not found!"
    echo "Please download service account key from Firebase Console"
    exit 1
fi

# Start backend
echo "📦 Starting backend (FastAPI)..."
cd backend
python -m venv venv 2>/dev/null
source venv/bin/activate 2>/dev/null || . venv/Scripts/activate 2>/dev/null
pip install -q -r requirements.txt 2>/dev/null
cd ..
python -m uvicorn backend.main:app --reload --port 8000 &
BACKEND_PID=$!

# Start frontend
echo "🎨 Starting frontend (Vite)..."
cd frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ MindSathi started!"
echo "Frontend: http://localhost:5173"
echo "Backend: http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
