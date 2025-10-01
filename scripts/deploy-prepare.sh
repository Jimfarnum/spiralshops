#!/bin/bash

# SPIRAL Platform Deployment Preparation Script
# Ensures all build requirements are met before deployment

echo "🚀 SPIRAL Platform - Deployment Preparation"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Step 1: Clean previous build
print_status $BLUE "📁 Step 1: Cleaning previous build..."
if [ -d "dist" ]; then
    rm -rf dist
    print_status $GREEN "✅ Previous build cleaned"
else
    print_status $YELLOW "⚠️  No previous build found"
fi

# Step 2: Run TypeScript check
print_status $BLUE "🔍 Step 2: Running TypeScript compilation check..."
if npm run check; then
    print_status $GREEN "✅ TypeScript compilation check passed"
else
    print_status $RED "❌ TypeScript compilation check failed"
    exit 1
fi

# Step 3: Build the project
print_status $BLUE "🏗️  Step 3: Building the project..."
if npm run build; then
    print_status $GREEN "✅ Build completed successfully"
else
    print_status $RED "❌ Build failed"
    exit 1
fi

# Step 4: Verify build output
print_status $BLUE "🔧 Step 4: Verifying build output..."
if node scripts/build-verify.js; then
    print_status $GREEN "✅ Build verification passed"
else
    print_status $RED "❌ Build verification failed"
    exit 1
fi

# Step 5: Test production start (quick test)
print_status $BLUE "🧪 Step 5: Testing production start..."
timeout 10s npm start &
PID=$!
sleep 5

if kill -0 $PID 2>/dev/null; then
    kill $PID
    print_status $GREEN "✅ Production server starts successfully"
else
    print_status $RED "❌ Production server failed to start"
    exit 1
fi

# Summary
echo ""
print_status $GREEN "🎉 Deployment preparation completed successfully!"
echo ""
print_status $BLUE "📋 Deployment Checklist:"
print_status $GREEN "✅ TypeScript compilation verified"
print_status $GREEN "✅ Build process completed"
print_status $GREEN "✅ dist/index.js server entry point created"
print_status $GREEN "✅ Frontend assets generated"
print_status $GREEN "✅ Production server startup tested"
echo ""
print_status $BLUE "🚀 Ready for deployment to production environment"
print_status $BLUE "📍 Server entry point: dist/index.js"
print_status $BLUE "📍 Start command: NODE_ENV=production node dist/index.js"