#!/usr/bin/env bash
set -euo pipefail

echo "🔑 Verifying SPIRAL secrets & connectivity..."

# === Required secrets ===
REQUIRED_SECRETS=(
  "IBM_CLOUD_APIKEY"
  "CLOUDANT_URL"
  "CLOUDANT_APIKEY"
  "CLOUDANT_DBNAME"
)

MISSING=0

for SECRET in "${REQUIRED_SECRETS[@]}"; do
  if [[ -z "${!SECRET:-}" ]]; then
    echo "❌ Missing: $SECRET"
    MISSING=1
  else
    echo "✅ Found: $SECRET"
  fi
done

if [[ "$MISSING" -eq 1 ]]; then
  echo "⚠️  One or more required secrets are missing. Please add them in Replit before deployment."
  exit 1
fi

# === Connectivity check (Cloudant) ===
echo ""
echo "🌐 Testing Cloudant connectivity..."

# Build Cloudant auth header
AUTH_HEADER="apikey:${CLOUDANT_APIKEY}"

# Try listing databases (lightweight test)
HTTP_CODE=$(curl -s -o /tmp/cloudant_test.json -w "%{http_code}" \
  -u "$AUTH_HEADER" \
  "${CLOUDANT_URL}/_all_dbs")

if [[ "$HTTP_CODE" == "200" ]]; then
  echo "✅ Cloudant connectivity successful."
  echo "📂 Databases found:"
  cat /tmp/cloudant_test.json
else
  echo "❌ Cloudant connectivity failed (HTTP $HTTP_CODE)"
  cat /tmp/cloudant_test.json || true
  exit 1
fi

echo ""
echo "🎉 All secrets verified and Cloudant connectivity confirmed. You're ready to deploy!"