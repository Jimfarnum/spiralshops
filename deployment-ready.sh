#!/bin/bash
# SPIRAL Platform - Deployment Readiness Test Script
# Ensures all deployment requirements are met

set -e

echo "🚀 SPIRAL Platform - Deployment Readiness Check"
echo "=============================================="
echo ""

# 1. Check dist/index.js exists and has correct size
if [ ! -f "dist/index.js" ]; then
    echo "❌ CRITICAL: dist/index.js not found"
    exit 1
fi

SIZE=$(stat -c%s "dist/index.js" 2>/dev/null || stat -f%z "dist/index.js")
SIZE_KB=$((SIZE / 1024))

if [ $SIZE_KB -lt 100 ]; then
    echo "❌ CRITICAL: dist/index.js too small (${SIZE_KB}KB)"
    exit 1
fi

echo "✅ Server build verified: dist/index.js (${SIZE_KB}KB)"

# 2. Check frontend assets
if [ ! -d "dist/public" ] || [ ! -f "dist/public/index.html" ]; then
    echo "❌ CRITICAL: Frontend assets missing"
    exit 1
fi

ASSET_COUNT=$(find dist/public -type f | wc -l)
echo "✅ Frontend build verified: ${ASSET_COUNT} files"

# 3. Quick syntax validation
echo "🔍 Testing server syntax..."
if ! node --check dist/index.js; then
    echo "❌ CRITICAL: Server syntax errors detected"
    exit 1
fi
echo "✅ Server syntax validation passed"

# 4. Test server startup (quick test)
echo "🔍 Testing server startup..."
timeout 8 node dist/index.js > startup.log 2>&1 &
SERVER_PID=$!
sleep 3

if kill -0 $SERVER_PID 2>/dev/null; then
    echo "✅ Server starts successfully"
    kill $SERVER_PID 2>/dev/null || true
    wait $SERVER_PID 2>/dev/null || true
else
    echo "❌ CRITICAL: Server failed to start"
    cat startup.log
    exit 1
fi

rm -f startup.log

echo ""
echo "=============================================="
echo "🎉 DEPLOYMENT READINESS CHECK PASSED"
echo "✅ dist/index.js: Ready (${SIZE_KB}KB)"
echo "✅ Frontend assets: Ready (${ASSET_COUNT} files)"  
echo "✅ Syntax validation: Passed"
echo "✅ Server startup: Confirmed"
echo ""
echo "🚀 Ready for production deployment!"
echo "📋 To deploy: Upload dist/ directory and run 'node dist/index.js'"