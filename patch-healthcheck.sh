#!/bin/bash
set -e

FILE="hybrid-full-deploy.sh"

# Backup first
cp "$FILE" "$FILE.bak"

# Remove the old SSL verification loop
sed -i '/# --- SSL VERIFICATION LOOP ---/,/notify "SUCCESS"/d' "$FILE"

# Append the new SSL + health check block at the end of the file
cat <<'EOF' >> "$FILE"

# --- SSL + Health Check Verification Loop ---
FULL_DOMAIN="$SUBDOMAIN.$DOMAIN"
HEALTH_URL="https://$FULL_DOMAIN/healthz"

notify "INFO" "Waiting for SSL + health check at $HEALTH_URL and root …"
READY=0
for i in {1..30}; do
  HEALTH_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_URL" || true)
  ROOT_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://$FULL_DOMAIN" || true)

  if [[ "$HEALTH_CODE" -eq 200 && "$ROOT_CODE" -ge 200 && "$ROOT_CODE" -lt 500 ]]; then
    READY=1
    break
  fi

  notify "INFO" "Attempt $i/30: /healthz=$HEALTH_CODE root=$ROOT_CODE → retry in 30s…"
  sleep 30
done

if [[ "$READY" -ne 1 ]]; then
  handle_failure "Health check failed: $HEALTH_URL or root not verified after ~15 minutes"
fi

notify "SUCCESS" "SSL + health check verified at $HEALTH_URL and root 🎉"
EOF

echo "✅ Patch applied. Old version saved at $FILE.bak"