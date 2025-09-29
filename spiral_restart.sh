#!/bin/sh
set -e

echo "===================================================="
echo "🌀 SpiralShops — Build + Restart + Verify"
echo "===================================================="

# 1. Clean build
echo "➡️ Cleaning and rebuilding dist/"
rm -rf dist/
npm run build

# 2. Restart app (kill PID 1)
echo "➡️ Restarting server..."
kill 1

# 3. Wait for restart
echo "⏳ Waiting for server to boot..."
sleep 8

# 4. Verify local endpoints
echo
echo "➡️ Checking local endpoints..."
for ep in "" "api/health" "api/products"; do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:5000/$ep" || echo 000)
  echo "  /$ep : HTTP $CODE"
done

# 5. Verify external site
echo
echo "➡️ Checking external domain..."
EXT="https://www.spiralshops.com"
EXT_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$EXT" || echo 000)
echo "  $EXT : HTTP $EXT_CODE"

echo
echo "===================================================="
if [ "$EXT_CODE" = "200" ]; then
  echo "🎉 SUCCESS: SpiralShops is live at $EXT"
elif [ "$EXT_CODE" = "404" ]; then
  echo "⚠️ Still 404 externally — means the Deploy container has not picked up the new build."
  echo "   → Fix: Go to Replit ➜ Deploy tab ➜ Deploy latest build"
else
  echo "❌ External returned HTTP $EXT_CODE — check Deploy logs."
fi
echo "===================================================="
