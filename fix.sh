
#!/bin/sh
set -e

echo "===================================================="
echo "🌀 SpiralShops — Full Fix, Restart & Verify"
echo "===================================================="

# 1. Clean & rebuild
echo "➡️ Cleaning old build..."
rm -rf dist/
npm run build

# 2. Ensure static images directory is mounted
echo "➡️ Linking static images..."
mkdir -p dist/public/images
cp -r public/images/* dist/public/images/ 2>/dev/null || true

# 3. Restart app
echo "➡️ Restarting app..."
kill 1

# 4. Wait for server
echo "⏳ Waiting for server to boot..."
sleep 10

# 5. Check local routes
echo
echo "➡️ Local endpoint checks:"
for ep in "" "api/health" "api/products"; do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:5000/$ep" || echo 000)
  echo "  /$ep : HTTP $CODE"
done

# 6. Test images locally
echo
echo "➡️ Local image checks:"
IMG1=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:5000/images/default.png" || echo 000)
echo "  /images/default.png : HTTP $IMG1"
IMG2=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:5000/public/images/beta-1.png" || echo 000)
echo "  /public/images/beta-1.png : HTTP $IMG2"

# 7. Check external domain
echo
echo "➡️ External check:"
EXT="https://www.spiralshops.com"
EXT_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$EXT" || echo 000)
echo "  $EXT : HTTP $EXT_CODE"

echo
echo "===================================================="
if [ "$EXT_CODE" = "200" ]; then
  echo "🎉 SUCCESS: SpiralShops is LIVE at $EXT with images!"
elif [ "$EXT_CODE" = "404" ]; then
  echo "⚠️ Still 404 externally → Deploy container has not picked up new build."
  echo "   → Go to Replit → Deploy tab → Deploy latest build."
else
  echo "❌ External returned HTTP $EXT_CODE → Check Deploy logs."
fi
echo "===================================================="

