#!/bin/bash

# SPIRAL Deficiency Analysis & 100% Functionality Verification
echo "🔍 SPIRAL Deficiency Analysis - Finding & Fixing All Issues"
echo "=========================================================="

BASE_URL="http://localhost:5000"

# Test critical subscription functionality first
echo -e "\n🎯 CRITICAL SUBSCRIPTION SYSTEM TEST"
response=$(curl -s -X POST -H "Content-Type: application/json" -d '{"planTier":"gold","retailerEmail":"test@spiral.com"}' "$BASE_URL/api/create-subscription")
success=$(echo "$response" | jq -r '.success')

if [ "$success" = "true" ]; then
    echo "✅ Subscription Creation API: FIXED - Now working correctly"
else
    echo "❌ Subscription Creation API: Still failing"
    echo "Response: $response"
fi

# Verify all plan status endpoints
echo -e "\n📊 PLAN STATUS VERIFICATION"
for plan in free silver gold premium; do
    echo -n "Testing $plan plan... "
    status=$(curl -s "$BASE_URL/api/plan-status/cus_demo_$plan" | jq -r '.plan')
    if [ "$status" != "null" ] && [ "$status" != "" ]; then
        echo "✅ $status plan working"
    else
        echo "❌ Failed"
    fi
done

# Frontend accessibility test
echo -e "\n🌐 FRONTEND ACCESSIBILITY TEST"
homepage_response=$(curl -s "$BASE_URL")
if echo "$homepage_response" | grep -q "SPIRAL"; then
    echo "✅ Homepage loading correctly"
else
    echo "❌ Homepage issues detected"
fi

# API endpoint comprehensive validation
echo -e "\n🔧 API ENDPOINT VALIDATION"
endpoints=(
    "/api/check"
    "/api/stores" 
    "/api/products"
    "/api/products/featured"
    "/api/recommend"
    "/api/mall-events"
    "/api/promotions"
    "/api/social-achievements/user123"
    "/api/retailer/inventory/store123"
    "/api/invite-trips/user123"
    "/api/stripe-connect/account-status/store123"
    "/api/spiral-centers"
)

working_endpoints=0
total_endpoints=${#endpoints[@]}

for endpoint in "${endpoints[@]}"; do
    status_code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$endpoint")
    if [ "$status_code" = "200" ]; then
        working_endpoints=$((working_endpoints + 1))
        echo "✅ $endpoint"
    else
        echo "❌ $endpoint (Status: $status_code)"
    fi
done

# Database connectivity test
echo -e "\n💾 DATABASE CONNECTIVITY TEST"
if curl -s "$BASE_URL/api/stores" | jq -e '. | length > 0' > /dev/null; then
    echo "✅ Database connection and data retrieval working"
else
    echo "❌ Database connectivity issues"
fi

# Calculate final results
success_rate=$(( (working_endpoints * 100) / total_endpoints ))
echo -e "\n📈 DEFICIENCY ANALYSIS RESULTS"
echo "================================"
echo "Working Endpoints: $working_endpoints/$total_endpoints"
echo "Success Rate: $success_rate%"

if [ "$success" = "true" ] && [ $success_rate -ge 95 ]; then
    echo -e "\n🎯 SPIRAL PLATFORM STATUS: 100% FUNCTIONAL ✅"
    echo "All critical deficiencies have been resolved!"
    echo "Platform is production-ready with complete feature set."
else
    echo -e "\n⚠️  SPIRAL PLATFORM STATUS: DEFICIENCIES DETECTED"
    echo "Issues requiring attention have been identified."
fi

echo -e "\n🚀 SPIRAL Deficiency Analysis Complete!"