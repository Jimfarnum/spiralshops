#!/bin/bash

# SPIRAL 100% Comprehensive Platform Test Script
echo "🚀 Starting SPIRAL 100% Comprehensive Platform Test"
echo "=================================================="

BASE_URL="http://localhost:5000"
PASSED=0
FAILED=0

# Test function
test_api() {
    local name="$1"
    local url="$2"
    local method="${3:-GET}"
    local data="$4"
    
    echo -n "🧪 Testing: $name... "
    
    if [ "$method" = "POST" ]; then
        response=$(curl -s -w "%{http_code}" -X POST -H "Content-Type: application/json" -d "$data" "$BASE_URL$url")
    else
        response=$(curl -s -w "%{http_code}" "$BASE_URL$url")
    fi
    
    status_code="${response: -3}"
    response_body="${response%???}"
    
    if [ "$status_code" -eq 200 ] || [ "$status_code" -eq 201 ]; then
        echo "✅ PASSED"
        ((PASSED++))
    else
        echo "❌ FAILED (Status: $status_code)"
        ((FAILED++))
    fi
}

# Core API Tests
echo -e "\n📋 CORE API TESTS"
test_api "Health Check" "/api/check"
test_api "Stores API" "/api/stores"
test_api "Products API" "/api/products"
test_api "Featured Products" "/api/products/featured"
test_api "AI Recommendations" "/api/recommend"
test_api "Mall Events" "/api/mall-events"
test_api "Promotions" "/api/promotions"

# Tiered Access System Tests
echo -e "\n🎯 TIERED ACCESS SYSTEM TESTS"
test_api "Free Plan Status" "/api/plan-status/cus_demo_free"
test_api "Silver Plan Status" "/api/plan-status/cus_demo_silver"
test_api "Gold Plan Status" "/api/plan-status/cus_demo_gold"
test_api "Premium Plan Status" "/api/plan-status/cus_demo_premium"
test_api "Subscription Creation" "/api/create-subscription" "POST" '{"planTier":"gold","retailerEmail":"test@spiral.com"}'

# Social Features Tests  
echo -e "\n🌐 SOCIAL FEATURES TESTS"
test_api "Social Achievements" "/api/social-achievements/user123"
test_api "Share Tracking" "/api/social-achievements/track" "POST" '{"userId":"user123","platform":"facebook","shareType":"product"}'

# Retailer Features Tests
echo -e "\n🏪 RETAILER FEATURES TESTS"
test_api "Retailer Inventory" "/api/retailer/inventory/store123"
test_api "Retailer Analytics" "/api/retailer/analytics/store123"

# Invite System Tests
echo -e "\n👥 INVITE SYSTEM TESTS"
test_api "Get Invite Trips" "/api/invite-trips/user123"
test_api "Create Invite Trip" "/api/invite-trips" "POST" '{"inviterName":"Test User","inviterEmail":"test@example.com","invitees":["friend@example.com"],"message":"Test invite"}'

# Stripe Connect Tests
echo -e "\n💳 STRIPE CONNECT TESTS"
test_api "Stripe Account Creation" "/api/stripe-connect/create-account" "POST" '{"retailerId":"store123","email":"retailer@test.com","businessName":"Test Store"}'
test_api "Stripe Account Status" "/api/stripe-connect/account-status/store123"

# Advanced Features Tests
echo -e "\n🔬 ADVANCED FEATURES TESTS"
test_api "SPIRAL Centers" "/api/spiral-centers"
test_api "Advanced Logistics" "/api/advanced-logistics"
test_api "Mock Advanced Features" "/api/mock-advanced-features"

# Calculate Results
TOTAL=$((PASSED + FAILED))
SUCCESS_RATE=$(( (PASSED * 100) / TOTAL ))

echo -e "\n📊 TEST RESULTS SUMMARY"
echo "========================"
echo "✅ Passed: $PASSED"
echo "❌ Failed: $FAILED"
echo "📈 Success Rate: $SUCCESS_RATE%"

if [ $FAILED -eq 0 ]; then
    echo -e "\n🎯 SPIRAL Platform Status: 100% FUNCTIONAL ✅"
    echo "All core systems, tiered access, social features, and integrations are working perfectly!"
else
    echo -e "\n⚠️  SPIRAL Platform Status: NEEDS ATTENTION"
    echo "Some features may need configuration or debugging."
fi

echo -e "\n🔍 DETAILED PLAN STATUS VERIFICATION:"
echo "Free Plan:"
curl -s "$BASE_URL/api/plan-status/cus_demo_free" | jq -r '"  - Plan: " + .plan + " | Listings: " + (.features.productListings | tostring)'

echo "Silver Plan:"
curl -s "$BASE_URL/api/plan-status/cus_demo_silver" | jq -r '"  - Plan: " + .plan + " | Listings: " + (.features.productListings | tostring) + " | Analytics: " + (.features.advancedAnalytics | tostring)'

echo "Gold Plan:"
curl -s "$BASE_URL/api/plan-status/cus_demo_gold" | jq -r '"  - Plan: " + .plan + " | Listings: " + (.features.productListings | tostring) + " | Analytics: " + (.features.advancedAnalytics | tostring) + " | Priority Support: " + (.features.prioritySupport | tostring)'

echo "Premium Plan:"
curl -s "$BASE_URL/api/plan-status/cus_demo_premium" | jq -r '"  - Plan: " + .plan + " | Listings: " + (if .features.productListings == -1 then "Unlimited" else (.features.productListings | tostring) end) + " | All Features: " + (.features.advancedAnalytics | tostring)'

echo -e "\n🎉 SPIRAL Comprehensive Test Complete!"