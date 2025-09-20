#!/usr/bin/env bash
set -euo pipefail

echo "🔍 Checking CLOUDANT_URL formatting..."

# Grab current value
CURRENT=$(echo $CLOUDANT_URL || true)

if [[ -z "$CURRENT" ]]; then
  echo "❌ CLOUDANT_URL is not set"
  exit 1
fi

echo "📋 Current CLOUDANT_URL: $CURRENT"

# Check if it starts with https://
if [[ "$CURRENT" =~ ^https:// ]]; then
  echo "✅ URL format is correct (starts with https://)"
  
  # Test connectivity quickly
  echo "🌐 Testing connectivity..."
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
    --connect-timeout 5 \
    -u "apikey:${CLOUDANT_APIKEY}" \
    "${CURRENT}/_all_dbs" || echo "000")
  
  if [[ "$HTTP_CODE" == "200" ]]; then
    echo "✅ Cloudant connectivity successful!"
  else
    echo "⚠️  Connectivity test failed (HTTP $HTTP_CODE)"
    echo "   This might be due to network or credentials issues"
  fi
  
elif [[ "$CURRENT" =~ ^http:// ]]; then
  echo "⚠️  URL uses http:// but should use https://"
  SUGGESTED="${CURRENT/http:/https:}"
  echo "💡 Suggested fix: $SUGGESTED"
  
else
  echo "❌ URL format issue - should start with https://"
  
  # Try to construct proper URL if it looks like a hostname
  if [[ "$CURRENT" =~ \.cloudantnosqldb\.appdomain\.cloud$ ]]; then
    SUGGESTED="https://$CURRENT"
    echo "💡 Suggested fix: $SUGGESTED"
  else
    echo "💡 Expected format: https://your-service-id.cloudantnosqldb.appdomain.cloud"
  fi
fi

echo ""
echo "🎯 To fix the URL, update your CLOUDANT_URL secret in Replit"
echo "   Then re-run: ./scripts/verify-secrets-and-connectivity.sh"