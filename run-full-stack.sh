#!/bin/bash
# Phase 2 Final Fix: Run Frontend + Backend Together

echo "🚀 Starting SPIRAL Full-Stack Application..."
echo "Backend: server/index.ts → port 5000"
echo "Frontend: Vite React → port 5173"

# Kill any existing processes
pkill -f "tsx server/index.ts" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true

# Start backend in background
echo "✅ Starting backend server..."
NODE_ENV=development tsx server/index.ts &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend in background  
echo "✅ Starting frontend server..."
vite --host 0.0.0.0 --port 5173 &
FRONTEND_PID=$!

echo ""
echo "🎯 SPIRAL Dashboard URLs:"
echo "Frontend UI: http://localhost:5173"
echo "Backend API: http://localhost:5000"
echo ""
echo "📊 Test Routes:"
echo "http://localhost:5000/test/entities"
echo "http://localhost:5000/test/rewards" 
echo "http://localhost:5000/test/events"
echo "http://localhost:5000/test/dashboard"
echo ""
echo "✨ Preview should now show React Dashboard with working data!"

# Keep both running
wait $BACKEND_PID $FRONTEND_PID