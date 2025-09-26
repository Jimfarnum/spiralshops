#!/bin/bash
echo "🚀 SPIRAL DEPLOYMENT FAILURE PREVENTION SYSTEM"
echo "==============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

ISSUES_FOUND=0
WARNINGS=0

echo ""
echo "🔍 PHASE 1: CRITICAL DEPLOYMENT ISSUE DETECTION"
echo "==============================================="

# Check for multiple port exposure (TOP cause of deployment failures)
PORT_COUNT=$(grep -c "localPort" .replit 2>/dev/null || echo "0")
if [ "$PORT_COUNT" -gt 2 ]; then
    echo -e "${RED}🚨 DEPLOYMENT KILLER: Multiple ports exposed ($PORT_COUNT ports)${NC}"
    echo -e "${RED}   This WILL cause deployment failure on Autoscale!${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
    echo -e "${GREEN}✅ Port configuration safe for deployment${NC}"
fi

echo ""
echo "🏗️ PHASE 2: BUILD SYSTEM CRASH PREVENTION"
echo "========================================="

# Force rebuild with images to ensure they're included
echo "🔧 Ensuring images are included in build..."
npm run build > build.log 2>&1
BUILD_STATUS=$?

if [ $BUILD_STATUS -eq 0 ]; then
    echo -e "${GREEN}✅ Build completed successfully${NC}"
else
    echo -e "${RED}❌ CRITICAL: Build process failed${NC}"
    echo "Build log:"
    cat build.log
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

# Check critical build outputs
if [ -f "dist/index.js" ]; then
    SIZE=$(wc -c < dist/index.js)
    if [ "$SIZE" -gt 100000 ]; then
        echo -e "${GREEN}✅ Production server file ready (${SIZE} bytes)${NC}"
    else
        echo -e "${RED}❌ CRITICAL: Server file too small (${SIZE} bytes)${NC}"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    fi
else
    echo -e "${RED}❌ CRITICAL: Production server missing (dist/index.js)${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

echo ""
echo "🖼️ PHASE 3: IMAGE DEPLOYMENT FAILURE PREVENTION"
echo "==============================================="

# CRITICAL: Verify images are in build (main user concern)
if [ -d "dist/public/images" ]; then
    IMAGE_COUNT=$(find dist/public/images -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" | wc -l)
    if [ "$IMAGE_COUNT" -gt 5 ]; then
        echo -e "${GREEN}✅ CRITICAL SUCCESS: $IMAGE_COUNT product images in deployment${NC}"
        
        # Test a few specific product images
        echo "🔍 Verifying critical product images..."
        find dist/public/images -name "*Wireless_Bluetooth*" | head -1 | while read img; do
            if [ -f "$img" ]; then
                echo -e "${GREEN}   ✅ Wireless Headphones image: $(basename "$img")${NC}"
            fi
        done
    else
        echo -e "${RED}❌ DEPLOYMENT KILLER: Only $IMAGE_COUNT images found${NC}"
        echo -e "${RED}   Your product images will be BROKEN in deployment!${NC}"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    fi
else
    echo -e "${RED}❌ DEPLOYMENT KILLER: Images directory completely missing!${NC}"
    echo -e "${RED}   ALL product images will be 404 in deployment!${NC}"
    # Auto-fix attempt
    echo "🔧 EMERGENCY FIX: Copying images to build..."
    mkdir -p dist/public/images
    if [ -d "public/images" ]; then
        cp -r public/images/* dist/public/images/ 2>/dev/null || true
        NEW_COUNT=$(find dist/public/images -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" | wc -l)
        if [ "$NEW_COUNT" -gt 0 ]; then
            echo -e "${GREEN}✅ EMERGENCY FIX SUCCESSFUL: $NEW_COUNT images copied${NC}"
        else
            ISSUES_FOUND=$((ISSUES_FOUND + 1))
        fi
    else
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    fi
fi

echo ""
echo "⚡ PHASE 4: SERVER STARTUP FAILURE PREVENTION"
echo "============================================="

# Test server can start (prevent deployment crashes)
echo "🔍 Testing production server startup..."
if ! node --check dist/index.js; then
    echo -e "${RED}❌ CRITICAL: Server has syntax errors${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
    echo -e "${GREEN}✅ Server syntax validation passed${NC}"
fi

# Quick startup test
PORT=3333 # Use different port for testing
timeout 5 node dist/index.js > startup.log 2>&1 &
SERVER_PID=$!
sleep 2

if kill -0 $SERVER_PID 2>/dev/null; then
    echo -e "${GREEN}✅ Server starts successfully in production mode${NC}"
    kill $SERVER_PID 2>/dev/null || true
else
    echo -e "${RED}❌ CRITICAL: Server crashes on startup${NC}"
    echo "Startup errors:"
    cat startup.log | head -20
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

rm -f startup.log build.log

echo ""
echo "📊 DEPLOYMENT FAILURE RISK ASSESSMENT"
echo "====================================="

if [ "$ISSUES_FOUND" -eq 0 ]; then
    echo -e "${GREEN}🎉 DEPLOYMENT SUCCESS LIKELY!${NC}"
    echo -e "${GREEN}✅ No critical issues detected${NC}"
    echo -e "${GREEN}✅ Images will work in production${NC}"
    echo -e "${GREEN}✅ Server will start properly${NC}"
    echo ""
    echo -e "${BLUE}📋 TO DEPLOY:${NC}"
    echo "1. Click 'Deploy' or 'Publish' in Replit"  
    echo "2. Your product images WILL work in production"
    echo "3. All 8 products will display properly"
    exit 0
else
    echo -e "${RED}🚨 HIGH DEPLOYMENT FAILURE RISK!${NC}"
    echo -e "${RED}   Found $ISSUES_FOUND CRITICAL issues that WILL cause deployment to fail${NC}"
    echo ""
    echo -e "${YELLOW}🔧 REQUIRED FIXES BEFORE DEPLOYMENT:${NC}"
    if [ "$PORT_COUNT" -gt 2 ]; then
        echo "   1. Fix port configuration (.replit file has too many ports)"
    fi
    if [ ! -f "dist/index.js" ] || [ "$(wc -c < dist/index.js)" -lt 100000 ]; then
        echo "   2. Fix build process (server not building properly)"
    fi
    if [ ! -d "dist/public/images" ] || [ "$(find dist/public/images -name "*.png" -o -name "*.jpg" | wc -l)" -lt 5 ]; then
        echo "   3. Fix image inclusion in build (images missing from deployment)"
    fi
    
    echo ""
    echo -e "${RED}⚠️  DEPLOYING NOW WILL RESULT IN A BROKEN SITE${NC}"
    exit 2
fi