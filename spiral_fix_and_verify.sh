#!/bin/sh
set -eu

HR="===================================================="
echo "$HR"
echo "🌀 SpiralShops — Full Fix, Restart & Verify"
echo "$HR"

# 0) Preflight
command -v npm >/dev/null 2>&1 || { echo "❌ npm not found"; exit 1; }
command -v node >/dev/null 2>&1 || { echo "❌ node not found"; exit 1; }
command -v curl >/dev/null 2>&1 || { echo "❌ curl not found"; exit 1; }

# 1) Clean & rebuild
echo "➡️ Cleaning old build..."
rm -rf dist/
echo "➡️ Running: npm run build"
npm run build

# 2) Ensure static images are present in the built output
echo "➡️ Ensuring built images exist under dist/public/images"
mkdir -p dist/public/images
if [ -d public/images ]; then
  cp -r public/images/* dist/public/images/ 2>/dev/null || true
fi
# Make sure there is at least a default image to prove static serving works
if [ ! -f dist/public/images/default.png ] && [ -f public/images/default.png ]; then
  cp public/images/default.png dist/public/images/default.png || true
fi

# 3) Restart app
echo "➡️ Restarting server (kill 1)..."
kill 1 || true

# 4) Wait for server to boot (poll health)
echo "⏳ Waiting for server to boot..."
UP="no"
for i in 1 2 3 4 5 6 7 8 9 10; do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:5000/api/health" || echo 000)
  if [ "$CODE" = "200" ]; then
    UP="yes"; break
  fi
  sleep 2
done
[ "$UP" = "yes" ] || { echo "❌ Server did not report healthy in time"; exit 1; }

# 5) Local endpoint checks
echo
echo "➡️ Local endpoint checks:"
for ep in "" "api/health" "api/products"; do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:5000/$ep" || echo 000)
  echo "  /$ep : HTTP $CODE"
done

# 6) Local image checks (default + known example)
echo
echo "➡️ Local image checks:"
IMG1_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:5000/images/default.png" || echo 000)
echo "  /images/default.png : HTTP $IMG1_CODE"
IMG2_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:5000/public/images/beta-1.png" || echo 000)
echo "  /public/images/beta-1.png : HTTP $IMG2_CODE"

# 7) Pull first product's image field and test it
echo
echo "➡️ Detecting first product image path from /api/products..."
PRODUCTS_JSON="$(curl -s "http://localhost:5000/api/products" || echo '[]')"
FIRST_IMG_PATH="$(printf "%s" "$PRODUCTS_JSON" | node -e "
let s=''; process.stdin.on('data',d=>s+=d).on('end',()=>{
  try {
    const a = JSON.parse(s);
    if (Array.isArray(a) && a.length) {
      const p = a[0] || {};
      const url = p.imageUrl || p.image_url || p.image || '';
      process.stdout.write(String(url||''));
    }
  } catch(e){ /* ignore */ }
});
")"
if [ -n "${FIRST_IMG_PATH:-}" ]; then
  case "$FIRST_IMG_PATH" in
    http* ) TEST_URL="$FIRST_IMG_PATH" ;;
    /*    ) TEST_URL="http://localhost:5000$FIRST_IMG_PATH" ;;
    *     ) TEST_URL="http://localhost:5000/$FIRST_IMG_PATH" ;;
  esac
  CODE=$(curl -s -o /dev/null -w "%{http_code}" "$TEST_URL" || echo 000)
  echo "  First product image path: $FIRST_IMG_PATH → HTTP $CODE"
else
  echo "  ⚠️ Could not detect image path from first product"
fi

# 8) External domain checks
echo
echo "➡️ External domain checks:"
for EXT in "https://spiralshops.com" "https://www.spiralshops.com"; do
  EXT_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$EXT" || echo 000)
  echo "  $EXT : HTTP $EXT_CODE"
done

echo
echo "$HR"
echo "✅ Local summary:"
echo "   • /            : $(curl -s -o /dev/null -w "%{http_code}" "http://localhost:5000/")"
echo "   • /api/health  : $(curl -s -o /dev/null -w "%{http_code}" "http://localhost:5000/api/health")"
echo "   • /api/products: $(curl -s -o /dev/null -w "%{http_code}" "http://localhost:5000/api/products")"
echo "   • /images/default.png : $IMG1_CODE"
echo "   • /public/images/beta-1.png : $IMG2_CODE"
echo "$HR"

# 9) Final guidance based on external status
EXT_MAIN_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://www.spiralshops.com" || echo 000)
if [ "$EXT_MAIN_CODE" = "200" ]; then
  echo "🎉 SUCCESS: SpiralShops is LIVE at https://www.spiralshops.com and images should load."
elif [ "$EXT_MAIN_CODE" = "404" ]; then
  cat <<MSG

⚠️ External is still 404. That means your **Deploy container is serving old content**.
Do this now:
  1) Replit → **Deploy** tab
  2) **Build command**: npm run build
  3) **Run command**:   NODE_ENV=production node dist/index.js
  4) Click **Deploy latest build**
  5) Confirm the three secrets exist in Deploy env:
       CLOUDANT_URL
       CLOUDANT_APIKEY
       CLOUDANT_DBNAME
  6) Re-check https://www.spiralshops.com
MSG
else
  echo "❌ External returned HTTP $EXT_MAIN_CODE — open **Deploy → View logs** for the published app."
fi

echo "$HR"
