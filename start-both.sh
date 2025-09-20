#!/bin/bash

# SPIRAL Phase 2: Start both backend and frontend
echo "🚀 Starting SPIRAL backend + frontend..."

# Start backend on port 5000
NODE_ENV=development tsx server/index.ts &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend on port 5173
vite --host 0.0.0.0 --port 5173 &
FRONTEND_PID=$!

echo "✅ Backend running on port 5000 (PID: $BACKEND_PID)"
echo "✅ Frontend running on port 5173 (PID: $FRONTEND_PID)"
echo "🌐 Preview URL: https://<your-repl>.replit.dev:5173"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID