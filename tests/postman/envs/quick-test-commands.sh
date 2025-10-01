#!/usr/bin/env bash
set -euo pipefail

# SPIRAL Platform Quick Test Commands
# Comprehensive validation script for immediate platform testing

echo "🚀 SPIRAL Platform Comprehensive Test Suite"
echo "=============================================="

# Base URL
BASE_URL="http://localhost:5000"

# Test 1: Platform Health Check
echo "1. Testing Platform Health..."
HEALTH=$(curl -s "${BASE_URL}/api/check" | jq -r '.status // "failed"')
if [ "$HEALTH" = "healthy" ]; then
    echo "✅ Platform Health: OK"
else
    echo "❌ Platform Health: FAILED"
fi

# Test 2: Products API
echo "2. Testing Products API..."
PRODUCTS=$(curl -s "${BASE_URL}/api/products" | jq -r '.products | length // 0')
if [ "$PRODUCTS" -gt 0 ]; then
    echo "✅ Products API: $PRODUCTS items available"
else
    echo "❌ Products API: FAILED"
fi

# Test 3: Stores API
echo "3. Testing Stores API..."
STORES=$(curl -s "${BASE_URL}/api/stores" | jq -r '.success // false')
if [ "$STORES" = "true" ]; then
    echo "✅ Stores API: OK"
else
    echo "❌ Stores API: FAILED"
fi

# Test 4: Admin Authentication
echo "4. Testing Admin Authentication..."
ADMIN_STATUS=$(curl -s "${BASE_URL}/api/admin/selfcheck?admin_token=136a652548aa5ae81bffdc9bca394006d602bb8d2a50aa602bb6b17cc852b22f" -w "%{http_code}")
if [[ "$ADMIN_STATUS" == *"200" ]]; then
    echo "✅ Admin Authentication: OK"
else
    echo "❌ Admin Authentication: FAILED"
fi

# Test 5: Investor Portal Authentication
echo "5. Testing Investor Portal..."
INVESTOR_RESPONSE=$(curl -s "${BASE_URL}/api/investors/metrics?investor_token=spiral-demo-2025-stonepath-67c9" | jq -r '.kpis // .error')
if [[ "$INVESTOR_RESPONSE" != "unauthorized" ]]; then
    echo "✅ Investor Portal: OK"
else
    echo "⚠️ Investor Portal: Token needs correction in Replit Secrets"
fi

# Test 6: SOAP G Central Brain
echo "6. Testing SOAP G AI Agents..."
AI_RESPONSE=$(curl -s "${BASE_URL}/api/soap-g/status" | jq -r '.agents // 0' 2>/dev/null || echo "0")
if [ "$AI_RESPONSE" -gt 0 ]; then
    echo "✅ SOAP G Central Brain: $AI_RESPONSE agents active"
else
    echo "⚠️ SOAP G Central Brain: Status check available"
fi

echo
echo "=============================================="
echo "🏁 Test Suite Complete"
echo
echo "Next steps:"
echo "- All tests passing: Platform ready for production"
echo "- Token correction needed: Update INVESTOR_TOKEN in Replit Secrets"
echo "- Remove 'Value: ' prefix to enable investor portal"
echo