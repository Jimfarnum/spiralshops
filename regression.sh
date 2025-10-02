#!/bin/sh
set -e

DOMAINS="https://spiralshops.com https://spiralmalls.com"

echo "===================================================="
echo "🌀 SPIRAL Platform — Regression & UX Verification"
echo "===================================================="

for BASE_URL in $DOMAINS; do
  echo "🌐 Testing $BASE_URL"
  echo

  # ✅ Core API endpoints
  echo "➡️ Checking Core API endpoints..."
  for ep in "" "api/health" "api/products" "api/stores"; do
    CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/$ep" || echo 000)
    echo "  /$ep : HTTP $CODE"
  done
  echo

  # ✅ PWA assets
  echo "➡️ Checking PWA assets..."
  for file in "manifest.json" "sw.js" "images/logo-192.png" "images/logo-512.png"; do
    CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/$file" || echo 000)
    echo "  /$file : HTTP $CODE"
  done
  echo

  # ✅ Wishlist page should be gone
  echo "➡️ Checking Wishlist page..."
  WISHLIST=$(curl -s "$BASE_URL/wishlist" || echo "")
  if echo "$WISHLIST" | grep -q "Loading"; then
    echo "  ⚠️ Wishlist page still shows 'Loading' → Needs fix"
  elif [ -z "$WISHLIST" ]; then
    echo "  ✅ Wishlist route disabled"
  else
    echo "  ✅ Wishlist page renders content"
  fi
  echo

  # ✅ Notifications API
  echo "➡️ Checking Notifications..."
  NOTIFY=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/notifications/status" || echo 000)
  echo "  /api/notifications/status : HTTP $NOTIFY"
  echo

  # ✅ Branding & UX checks
  echo "➡️ Checking Branding & UX..."
  HOME=$(curl -s "$BASE_URL" || echo "")
  if echo "$HOME" | grep -q "SpiralShops"; then
    echo "  ✅ Branding text 'SpiralShops' found"
  else
    echo "  ⚠️ Branding missing"
  fi

  if echo "$HOME" | grep -qi "<header"; then
    echo "  ✅ Header detected"
  else
    echo "  ⚠️ Header missing"
  fi

  if echo "$HOME" | grep -qi "<footer"; then
    echo "  ✅ Footer detected"
  else
    echo "  ⚠️ Footer missing"
  fi

  if echo "$HOME" | grep -qi "nav"; then
    echo "  ✅ Navigation bar present"
  else
    echo "  ⚠️ Navigation bar missing"
  fi
  echo
  echo "----------------------------------------------------"
done

# ✅ Final Report
echo "===================================================="
echo "🎯 Regression & UX verification complete across all domains"
echo "===================================================="
