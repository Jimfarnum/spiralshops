#!/bin/bash
# SPIRAL Deployment Verification Script
# Smoke tests for post-deploy health checks

echo "🚀 SPIRAL Deployment Verification"
echo "================================="

# Check if URL is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <deployment-url>"
    echo "Example: $0 https://spiral-app.vercel.app"
    exit 1
fi

DEPLOYMENT_URL="$1"
echo "Testing deployment: $DEPLOYMENT_URL"

# Health check endpoint
echo -n "📊 Health Check... "
HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL/healthz")
if [ "$HEALTH_STATUS" = "200" ]; then
    echo "✅ OK ($HEALTH_STATUS)"
else
    echo "❌ FAILED ($HEALTH_STATUS)"
    exit 1
fi

# API endpoints test
echo -n "🔍 API Check... "
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL/api/check")
if [ "$API_STATUS" = "200" ]; then
    echo "✅ OK ($API_STATUS)"
else
    echo "❌ FAILED ($API_STATUS)"
    exit 1
fi

# TER Metrics endpoint
echo -n "📈 TER Metrics... "
TER_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL/api/metrics/ter")
if [ "$TER_STATUS" = "200" ]; then
    echo "✅ OK ($TER_STATUS)"
else
    echo "❌ FAILED ($TER_STATUS)"
    exit 1
fi

# Clara AI Router test
echo -n "🤖 Clara Router... "
CLARA_RESPONSE=$(curl -s -X POST "$DEPLOYMENT_URL/api/clara/route" \
  -H 'Content-Type: application/json' \
  -d '{"to":"harbor","subject":"Import Test","mallId":"test","payload":{"directoryUrl":"https://example.com/stores"}}')

if echo "$CLARA_RESPONSE" | grep -q "success\|routed\|agent"; then
    echo "✅ OK"
else
    echo "❌ FAILED"
    echo "Response: $CLARA_RESPONSE"
    exit 1
fi

# Avatar serving test
echo -n "👤 Avatar System... "
AVATAR_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL/avatars/clara.svg")
if [ "$AVATAR_STATUS" = "200" ]; then
    echo "✅ OK ($AVATAR_STATUS)"
else
    echo "❌ FAILED ($AVATAR_STATUS)"
    exit 1
fi

echo ""
echo "🎉 All tests passed! Deployment is healthy."
echo "✅ Health endpoint: $DEPLOYMENT_URL/healthz"
echo "✅ API endpoints: $DEPLOYMENT_URL/api/*"
echo "✅ Clara AI Router: $DEPLOYMENT_URL/api/clara/*"
echo "✅ Avatar system: $DEPLOYMENT_URL/avatars/*"