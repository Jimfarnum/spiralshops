#!/bin/bash
set -e
BD="backend"
core=(
  "$BD/package.json"
  "$BD/tsconfig.json"
  "$BD/src/index.ts"
  "$BD/src/lib/cloudant.ts"
  "$BD/src/lib/registry.ts"
  "$BD/src/middleware/agent_logger.ts"
  "$BD/src/routes/shipping.ts"
  "$BD/src/routes/discounts.ts"
  "$BD/src/routes/discounts_apply.ts"
  "$BD/src/routes/onboarding.ts"
  "$BD/src/routes/orders.ts"
  "$BD/src/routes/shipments.ts"
  "$BD/src/routes/retailers.ts"
  "$BD/src/routes/malls.ts"
  "$BD/src/routes/security.ts"
  "$BD/src/routes/marketing.ts"
  "$BD/src/routes/partnerships.ts"
  "$BD/src/routes/carriers/types.ts"
  "$BD/src/routes/carriers/usps.ts"
  "$BD/src/routes/carriers/ups.ts"
  "$BD/src/routes/carriers/fedex_usps_hybrid.ts"
)
missing=0
echo "📄 Checking expected backend files..."
for f in "${core[@]}"; do
  if [ -f "$f" ]; then echo "  ✅ $f"; else echo "  ❌ $f"; missing=$((missing+1)); fi
done
if [ -d "frontend" ]; then
  [ -f "frontend/src/components/WhyJoinSpiral.tsx" ] && echo "  ✅ frontend/src/components/WhyJoinSpiral.tsx" || { echo "  ❌ frontend/src/components/WhyJoinSpiral.tsx"; missing=$((missing+1)); }
  [ -f "frontend/public/test.html" ] && echo "  ✅ frontend/public/test.html" || echo "  ⚠️  frontend/public/test.html (optional)"
  [ -f "frontend/public/admin.html" ] && echo "  ✅ frontend/public/admin.html" || echo "  ⚠️  frontend/public/admin.html (optional)"
fi
[ "$missing" -eq 0 ] && echo "✅ All required files present." || { echo "❌ Missing $missing file(s)."; exit 2; }
