# === SPIRAL UNIVERSAL VERIFIER ===
set -e

# 0) Detect backend directory
detect_backend() {
  for d in backend server; do
    [ -f "$d/package.json" ] && echo "$d" && return
  done
  # last resort: search for src/index.ts
  p=$(dirname "$(grep -Rsl --include="index.ts" "^import express" */src/index.ts 2>/dev/null | head -n1)")
  [ -n "$p" ] && echo "$p" | sed 's|/src$||' || true
}
BACKEND_DIR="$(detect_backend)"
if [ -z "$BACKEND_DIR" ]; then echo "❌ Could not find backend directory (backend/ or server/)"; exit 1; fi
echo "📁 Using BACKEND_DIR=$BACKEND_DIR"

# 1) Build file checker for whichever dir we detected
cat > spiral_check_files.sh <<EOF2
#!/bin/bash
set -e
BD="$BACKEND_DIR"
core=(
  "\$BD/package.json"
  "\$BD/tsconfig.json"
  "\$BD/src/index.ts"
  "\$BD/src/lib/cloudant.ts"
  "\$BD/src/lib/registry.ts"
  "\$BD/src/middleware/agent_logger.ts"
  "\$BD/src/routes/shipping.ts"
  "\$BD/src/routes/discounts.ts"
  "\$BD/src/routes/discounts_apply.ts"
  "\$BD/src/routes/onboarding.ts"
  "\$BD/src/routes/orders.ts"
  "\$BD/src/routes/shipments.ts"
  "\$BD/src/routes/retailers.ts"
  "\$BD/src/routes/malls.ts"
  "\$BD/src/routes/security.ts"
  "\$BD/src/routes/marketing.ts"
  "\$BD/src/routes/partnerships.ts"
  "\$BD/src/routes/carriers/types.ts"
  "\$BD/src/routes/carriers/usps.ts"
  "\$BD/src/routes/carriers/ups.ts"
  "\$BD/src/routes/carriers/fedex_usps_hybrid.ts"
)
missing=0
echo "📄 Checking expected backend files..."
for f in "\${core[@]}"; do
  if [ -f "\$f" ]; then echo "  ✅ \$f"; else echo "  ❌ \$f"; missing=\$((missing+1)); fi
done
if [ -d "frontend" ]; then
  [ -f "frontend/src/components/WhyJoinSpiral.tsx" ] && echo "  ✅ frontend/src/components/WhyJoinSpiral.tsx" || { echo "  ❌ frontend/src/components/WhyJoinSpiral.tsx"; missing=\$((missing+1)); }
  [ -f "frontend/public/test.html" ] && echo "  ✅ frontend/public/test.html" || echo "  ⚠️  frontend/public/test.html (optional)"
  [ -f "frontend/public/admin.html" ] && echo "  ✅ frontend/public/admin.html" || echo "  ⚠️  frontend/public/admin.html (optional)"
fi
[ "\$missing" -eq 0 ] && echo "✅ All required files present." || { echo "❌ Missing \$missing file(s)."; exit 2; }
EOF2
chmod +x spiral_check_files.sh
./spiral_check_files.sh || true

# 2) Create self-test (independent of backend dir)
mkdir -p scripts
cat > scripts/selftest.mjs <<'EOF3'
const BASE = process.env.BASE || `http://localhost:${process.env.PORT||4000}`;
let pass=0, fail=0; const out=[];
const ok=(n,c,d='')=>{ c?(pass++,out.push(`✅ ${n}`)):(fail++,out.push(`❌ ${n}${d?` — ${d}`:''}`)) };
const j=async r=>{ const t=await r.text(); try{return JSON.parse(t)}catch{throw new Error('Invalid JSON: '+t.slice(0,200))} };
(async()=>{
  try{
    let r=await fetch(`${BASE}/api/health`); ok('GET /api/health', r.ok); let d=await j(r); ok('health ok:true', d?.ok===true);
    r=await fetch(`${BASE}/api/retailers/onboarding/questions`); ok('GET onboarding', r.ok); d=await j(r); ok('has shipping_free_us', JSON.stringify(d).includes('shipping_free_us'));
    r=await fetch(`${BASE}/api/discounts/tier?volume=75000000`); ok('GET discounts/tier', r.ok); d=await j(r); ok('tier >=2', d && (d.tier===2 || d.tier===3));
    r=await fetch(`${BASE}/api/discounts/apply`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({subtotal:100,shippingBase:8,annualVolumeUSD:75000000,parcelsPerMonth:20000,coupon:{type:'percent',value:10}})}); ok('POST discounts/apply', r.ok); d=await j(r); ok('total numeric', typeof d.total==='number');
    r=await fetch(`${BASE}/api/shipping/quote`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({destinationZip:'55101',weightOz:16,speed:'standard',mode:'outbound'})}); ok('POST shipping/quote', r.ok); d=await j(r); ok('quote has carrier & cost', !!d.carrierChosen && typeof d.cost==='number');
    r=await fetch(`${BASE}/api/agents`); ok('GET agents', r.ok); const a=await j(r); ok('has shoppingLogistics', Array.isArray(a)&&a.includes('shoppingLogistics'));
    r=await fetch(`${BASE}/api/agents/run`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'shoppingLogistics'})}); ok('POST agents/run', r.ok); d=await j(r); ok('agent run ok', d?.ok===true);
    r=await fetch(`${BASE}/api/partnerships/upsert`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({partner:'FedEx',type:'logistics',tiers:[{label:'Tier 1',minVolume:0,maxVolume:10000,discountPct:10},{label:'Tier 2',minVolume:10000,maxVolume:100000,discountPct:20},{label:'Tier 3',minVolume:100000,discountPct:35}]})}); ok('POST partnerships/upsert', r.ok);
    r=await fetch(`${BASE}/api/partnerships/get?type=logistics&partner=FedEx`); ok('GET partnerships/get', r.ok); d=await j(r); ok('get tiers', Array.isArray(d?.tiers)&&d.tiers.length>0);
    r=await fetch(`${BASE}/api/retailers/apply`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({business_name:'SelfTest Boutique',categories:['apparel'],shipping_free_us:true,contact:{name:'Alex QA',email:'alex.qa@example.com'}})}); ok('POST retailers/apply', r.ok);
    r=await fetch(`${BASE}/api/malls/apply`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({mall_name:'SelfTest Galleria',city:'Minneapolis',state:'MN',contact:{name:'Ops QA',email:'ops.qa@example.com'},wants_spiral_center:true})}); ok('POST malls/apply', r.ok);
    r=await fetch(`${BASE}/api/orders`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({retailerId:'ret_selftest',items:[{sku:'SKU1',name:'Demo',qty:1,price:25}],subtotal:25,shippingFee:5,shippingAddress:{name:'Jane',line1:'1 Main',city:'City',state:'NY',zip:'10001'},mode:'ship'})}); ok('POST orders', r.ok); d=await j(r); const orderId=d?.id; ok('order id', !!orderId);
    r=await fetch(`${BASE}/api/shipments`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({orderId,carrier:'USPS',tracking:'TRKSELFTEST'})}); ok('POST shipments', r.ok);
    r=await fetch(`${BASE}/api/shipments/track`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({tracking:'TRKSELFTEST'})}); ok('POST shipments/track', r.ok); d=await j(r); ok('track status', typeof d.status==='string');
  }catch(e){ fail++; out.push('❌ Exception: '+(e?.message||e)); }
  finally{ out.forEach(l=>console.log(l)); console.log(`\nSummary: ${pass} passed, ${fail} failed, ${pass+fail} total.`); if(fail>0) process.exit(1); }
})();
EOF3

# 3) Check if server is running (skip boot since server already running)
BASE=${BASE:-http://localhost:${PORT:-4000}}
echo "🌐 Using BASE=$BASE"
echo "🧪 Probing server..."
if curl -s "$BASE/api/health" | grep -q '"ok":true'; then
  echo "✅ Server already up."
else
  echo "⚠️ Server not responding at $BASE/api/health"
  exit 3
fi

# 4) Run self-test
echo "▶️ Running integration self-test…"
PORT="${PORT:-4000}" BASE="$BASE" node scripts/selftest.mjs || { echo "❌ Tests failed."; exit 4; }

echo "🎉 All tests passed."
