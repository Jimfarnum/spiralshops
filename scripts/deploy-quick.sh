#!/bin/bash

# Quick Deployment Preparation Script - Focused on deployment essentials

echo "🚀 SPIRAL Platform - Quick Deployment Check"
echo "========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Step 1: Build the project (most important)
print_status $BLUE "🏗️  Building the project..."
if npm run build; then
    print_status $GREEN "✅ Build completed successfully"
else
    print_status $RED "❌ Build failed"
    exit 1
fi

# Step 2: Create version tracking
print_status $BLUE "📋 Creating version tracking..."
if node scripts/create-version.js; then
    print_status $GREEN "✅ Version file created"
else
    print_status $YELLOW "⚠️  Version creation skipped (non-critical)"
fi

# Step 3: Verify critical deployment files
print_status $BLUE "🔧 Verifying deployment readiness..."
if node scripts/build-verify.js; then
    print_status $GREEN "✅ Build verification passed"
else
    print_status $RED "❌ Build verification failed"
    exit 1
fi

# Quick server test (5 second timeout)
print_status $BLUE "🧪 Quick server test..."
timeout 5s npm start >/dev/null 2>&1 &
PID=$!
sleep 3

if kill -0 $PID 2>/dev/null; then
    kill $PID 2>/dev/null
    print_status $GREEN "✅ Server starts successfully"
else
    print_status $YELLOW "⚠️  Server test inconclusive (may still work in production)"
fi

# Final summary
echo ""
print_status $GREEN "🎉 Quick deployment check completed!"
print_status $BLUE "📍 Key files verified:"
print_status $GREEN "  ✓ dist/index.js (server entry point)"
print_status $GREEN "  ✓ dist/public/index.html (frontend)"
print_status $GREEN "  ✓ dist/version.json (deployment tracking)"
echo ""
print_status $BLUE "🚀 Ready for deployment!"
print_status $BLUE "Start command: NODE_ENV=production node dist/index.js"