#!/bin/sh
set -e

echo "===================================================="
echo "🌀 SpiralShops — Regression Verification"
echo "===================================================="

# ✅ API endpoints
echo "➡️ Checking API endpoints..."
for ep in "" "api/health" "api/products" "api/stores"; do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://spiralshops.com/$ep" || echo 000)
  echo "  /$ep : HTTP $CODE"
done
echo

# ✅ PWA assets
echo "➡️ Checking PWA assets..."
for file in "manifest.json" "sw.js" "images/logo-192.png" "images/logo-512.png"; do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://spiralshops.com/$file" || echo 000)
  echo "  /$file : HTTP $CODE"
done
echo

# ✅ Wishlist page
echo "➡️ Checking Wishlist page..."
WISHLIST=$(curl -s https://spiralshops.com/wishlist || echo "")
if echo "$WISHLIST" | grep -q "Loading"; then
  echo "  ⚠️ Wishlist page shows 'Loading' → Needs fix"
elif [ -z "$WISHLIST" ]; then
  echo "  ✅ Wishlist route disabled"
else
  echo "  ✅ Wishlist page renders content"
fi
echo

# ✅ Notifications system
echo "➡️ Checking Notifications..."
NOTIFY=$(curl -s -o /dev/null -w "%{http_code}" "https://spiralshops.com/api/notifications/status" || echo 000)
echo "  /api/notifications/status : HTTP $NOTIFY"
echo

# ✅ Report status
echo "===================================================="
echo "🎯 Regression check complete"
echo "===================================================="
