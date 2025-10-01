#!/bin/bash
echo "🔎 Checking SPIRAL project files..."

core=(
  "backend/package.json"
  "backend/tsconfig.json"
  "backend/.env.sample"
  "backend/src/index.ts"
  "backend/src/lib/cloudant.ts"
  "backend/src/lib/registry.ts"
  "backend/src/middleware/agent_logger.ts"
  "backend/src/routes/shipping.ts"
  "backend/src/routes/discounts.ts"
  "backend/src/routes/discounts_apply.ts"
  "backend/src/routes/onboarding.ts"
  "backend/src/routes/orders.ts"
  "backend/src/routes/shipments.ts"
  "backend/src/routes/retailers.ts"
  "backend/src/routes/malls.ts"
  "backend/src/routes/security.ts"
  "backend/src/routes/marketing.ts"
  "backend/src/routes/partnerships.ts"
  "backend/src/routes/carriers/types.ts"
  "backend/src/routes/carriers/usps.ts"
  "backend/src/routes/carriers/ups.ts"
  "backend/src/routes/carriers/fedex_usps_hybrid.ts"
  "backend/src/config/retailer_onboarding_questions.ts"
  "frontend/src/components/WhyJoinSpiral.tsx"
  "frontend/public/test.html"
  "frontend/public/admin.html"
)
for f in "${core[@]}"; do
  if [ -f "$f" ]; then echo "✅ $f"; else echo "❌ $f"; fi
done
echo "✅ Check complete."
