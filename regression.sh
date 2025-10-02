#!/bin/sh
set -e
echo "===================================================="
echo "🌀 SPIRAL Platform — Regression Verification"
echo "===================================================="

BASE="${1:-https://spiralshops.com}"

echo "➡️ Testing deployment at: $BASE"
echo

echo "➡️ Checking Core API endpoints..."
for ep in "" "api/health" "api/products" "api/stores" "api/categories" "api/auth/me"; do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/$ep" || echo 000)
  printf "  %-30s : HTTP %s\n" "$BASE/${ep}" "$CODE"
done
echo

echo "➡️ Checking PWA assets..."
for f in "manifest.json" "sw.js" "spiral-blue.svg" "images/logo-192.png" "images/logo-512.png"; do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/$f" || echo 000)
  printf "  %-30s : HTTP %s\n" "$BASE/$f" "$CODE"
done
echo

echo "➡️ Checking Homepage HTML sanity..."
HOME=$(curl -s "$BASE/" || echo "")
echo "$HOME" | grep -q "SPIRAL" && echo "  ✅ SPIRAL branding present" || echo "  ⚠️ SPIRAL text not found"
echo "$HOME" | grep -q "Local" && echo "  ✅ Local commerce messaging present" || echo "  ⚠️ Local messaging not found"
echo

echo "➡️ Checking key routes..."
for route in "products" "stores" "malls" "spirals" "login"; do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/$route" || echo 000)
  printf "  %-30s : HTTP %s\n" "$BASE/$route" "$CODE"
done
echo

echo "➡️ Checking AI Agent endpoints..."
for ep in "api/ai/agents" "api/ai/health"; do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/$ep" || echo 000)
  printf "  %-30s : HTTP %s\n" "$BASE/$ep" "$CODE"
done
echo

echo "➡️ Checking Notifications..."
NOTIFY=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/notifications/status" || echo 000)
printf "  %-30s : HTTP %s\n" "$BASE/api/notifications/status" "$NOTIFY"
echo

echo "===================================================="
echo "🎯 Regression check complete"
echo "===================================================="
echo
echo "Usage: ./regression.sh [base_url]"
echo "Example: ./regression.sh http://localhost:5000"
echo "Example: ./regression.sh https://spiralshops.com"
