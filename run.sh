#!/usr/bin/env bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "============================================================"
echo "  Starting LAMU-AI Full-Stack Platform"
echo "  1. Python FastAPI Backend (Port 8000)"
echo "  2. Next.js Research Dashboard (Port 3000)"
echo "============================================================"

# Ensure venv exists
if [ ! -d "venv" ]; then
    echo "Creating Python virtualenv..."
    python3 -m venv venv
    ./venv/bin/pip install --upgrade pip
    ./venv/bin/pip install -r backend/requirements.txt
fi

# Kill any existing processes on 8000 or 3000
echo "Checking existing ports..."
kill -9 $(lsof -ti :8000) 2>/dev/null || true
kill -9 $(lsof -ti :3000) 2>/dev/null || true

# Start FastAPI backend in background
echo "Starting FastAPI backend on http://127.0.0.1:8000..."
PYTHONPATH=backend ./venv/bin/python3 -m uvicorn main:app --app-dir backend --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!

# Wait for backend health
echo "Waiting for FastAPI health check..."
for i in {1..15}; do
    if curl -s http://127.0.0.1:8000/api/health > /dev/null; then
        echo "FastAPI is healthy and ready on port 8000! ✓"
        break
    fi
    sleep 0.5
done

# Start Next.js frontend
echo "Starting Next.js frontend on http://localhost:3000..."
npm run dev

# Cleanup on exit
trap "kill -9 $BACKEND_PID 2>/dev/null || true" EXIT
