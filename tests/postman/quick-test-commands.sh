#!/usr/bin/env bash
set -euo pipefail

# SPIRAL Platform Quick Test Commands
# For immediate validation of all systems

echo "🧪 SPIRAL Platform Quick Test Suite"
echo "=================================="

# Core System Health
echo "Testing platform health..."
curl -s "http://localhost:5000/api/check" | jq -r '.status'

# Core API Validation
echo "Testing products API..."
curl -s "http://localhost:5000/api/products" | jq -r '.products | length'

echo "Testing stores API..."
curl -s "http://localhost:5000/api/stores" | jq -r '.data.stores | length'

echo "Testing location search..."
curl -s "http://localhost:5000/api/location-search-continental-us?scope=all" | jq -r '.stores | length'

# Admin Authentication
echo "Testing admin access..."
curl -s "http://localhost:5000/api/selfcheck/run" \
  -H "x-admin-token: 136a652548aa5ae81bffdc9bca394006d602bb8d2a50aa602bb6b17cc852b22f" \
  | jq -r '.data.pass // "failed"'

# Investor Portal Test
echo "Testing investor portal..."
RESULT=$(curl -s "http://localhost:5000/api/investors/metrics?investor_token=spiral-demo-2025-stonepath-67c9" | jq -r 'if .kpis then "✅ AUTHENTICATED" else "❌ " + .error end')
echo "$RESULT"

if [[ "$RESULT" == *"unauthorized"* ]]; then
    echo ""
    echo "⚠️  INVESTOR_TOKEN Fix Required:"
    echo "   Go to Replit Secrets and remove 'Value: ' prefix"
    echo "   Current should be: spiral-demo-2025-stonepath-67c9"
    echo ""
fi

echo "=================================="
echo "✅ Test suite complete"