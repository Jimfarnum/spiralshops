#!/bin/sh
set -e

echo "🛠 Setting Products as the homepage + adding Features bar + keeping branding..."

# 0) Paths (adjust if your layout differs)
APP_TSX="client/src/App.tsx"
INDEX_HTML_SRC="client/public/index.html"   # common React/Vite layout
[ -f "client/index.html" ] && INDEX_HTML_SRC="client/index.html"  # fallback for Vite
[ -f "public/index.html" ] && INDEX_HTML_SRC="public/index.html"  # fallback for CRA-style

# 1) Make Products the homepage route in Wouter
if grep -q 'Route path="/" component={Home}' "$APP_TSX"; then
  sed -i 's|Route path="/" component={Home}|Route path="/" component={ProductsPage}|' "$APP_TSX"
  echo "✅ Updated '/' route to ProductsPage"
else
  if ! grep -q 'Route path="/" component={ProductsPage}' "$APP_TSX"; then
    echo "⚠️ Could not find Home route to replace. Please confirm $APP_TSX has Wouter routes."
  else
    echo "ℹ️ '/' already points to ProductsPage"
  fi
fi

# 2) Ensure branding & tagline in <title>
if [ -f "$INDEX_HTML_SRC" ]; then
  # Title -> SpiralShops — Local-first shopping
  if grep -q "<title>" "$INDEX_HTML_SRC"; then
    sed -i 's|<title>.*</title>|<title>SpiralShops — Local-first shopping</title>|' "$INDEX_HTML_SRC"
  else
    # insert a title if missing (after <head>)
    sed -i 's|<head>|<head>\n  <title>SpiralShops — Local-first shopping</title>|' "$INDEX_HTML_SRC"
  fi
  echo "✅ Branding / title set in $INDEX_HTML_SRC"
else
  echo "⚠️ Could not find index.html source ($INDEX_HTML_SRC)."
fi

# 3) Add a minimal, fixed top Features bar (non-invasive, pure HTML/CSS)
#    - Visible on every page (before React mounts)
#    - No framework imports required
if [ -f "$INDEX_HTML_SRC" ]; then
  if ! grep -q "id=\"spiral-features-bar\"" "$INDEX_HTML_SRC"; then
    awk '
      /<head>/ && !insertedStyle { 
        print; 
        print "  <style>";
        print "    #spiral-features-bar { position: sticky; top: 0; z-index: 9999; background:#0f172a; color:#fff; border-bottom:1px solid rgba(255,255,255,.1); font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; }";
        print "    #spiral-features-bar .wrap { max-width: 1200px; margin:0 auto; padding: 10px 16px; display:flex; align-items:center; gap:16px; }";
        print "    #spiral-features-bar .brand { font-weight:700; letter-spacing:.3px; }";
        print "    #spiral-features-bar nav a { color:#cbd5e1; text-decoration:none; margin-right:14px; font-size:14px; }";
        print "    #spiral-features-bar nav a:hover { color:#fff; text-decoration:underline; }";
        print "  </style>";
        insertedStyle=1; 
        next
      }
      /<body[^>]*>/ && !insertedBar { 
        print; 
        print "  <div id=\"spiral-features-bar\">";
        print "    <div class=\"wrap\">";
        print "      <div class=\"brand\">SpiralShops</div>";
        print "      <nav>";
        print "        <a href=\"/\">Home</a>";
        print "        <a href=\"/products\">Products</a>";
        print "        <a href=\"/stores\">Stores</a>";
        print "        <a href=\"/malls\">Malls</a>";
        print "        <a href=\"/deals\">Deals</a>";
        print "        <a href=\"/about\">About</a>";
        print "      </nav>";
        print "    </div>";
        print "  </div>";
        insertedBar=1; 
        next
      }
      { print }
    ' "$INDEX_HTML_SRC" > "$INDEX_HTML_SRC.tmp" && mv "$INDEX_HTML_SRC.tmp" "$INDEX_HTML_SRC"
    echo "✅ Added minimal top Features bar"
  else
    echo "ℹ️ Features bar already present"
  fi
fi

# 4) Rebuild production bundle
echo "📦 Rebuilding (server + frontend)..."
rm -rf dist/
npm run build

# 5) Quick local checks (these don’t fail the script; they just print)
echo "🔎 Local smoke tests:"
for ep in "" "api/health" "api/products" "products"; do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:5000/$ep" || echo 000)
  echo "  /$ep : HTTP $CODE"
done

# 6) External checks (public site)
echo "🌐 External checks:"
for url in "https://spiralshops.com/" "https://spiralshops.com/products"; do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" "$url" || echo 000)
  echo "  $url : HTTP $CODE"
done

echo "✅ Done. Products is now the homepage; branding + top features bar active."
