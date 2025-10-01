#!/usr/bin/env bash
set -euo pipefail

ENV_FILE=".env"
TMP="${ENV_FILE}.tmp"

touch "$ENV_FILE"

# remove any existing lines for these keys
grep -v -E '^(CLOUDANT_URL|CLOUDANT_APIKEY|CLOUDANT_HOST|CLOUDANT_USERNAME|CLOUDANT_DB|IBM_CLOUDANT_URL|IBM_CLOUDANT_API_KEY)=' "$ENV_FILE" > "$TMP" || true

# append the desired values
cat >> "$TMP" <<'VARS'
CLOUDANT_URL=https://4b726532-3535-45fe-b69e-f764e22e542e-bluemix.cloudantnosqldb.appdomain.cloud
CLOUDANT_APIKEY=YPvyK1d8H6wpFPwnNzXFCRe8D0yhuDMkCfEFfZo9TBKo
CLOUDANT_HOST=4b726532-3535-45fe-b69e-f764e22e542e-bluemix.cloudantnosqldb.appdomain.cloud
CLOUDANT_USERNAME=4b726532-3535-45fe-b69e-f764e22e542e-bluemix
CLOUDANT_DB=spiral_production
IBM_CLOUDANT_URL=https://4b726532-3535-45fe-b69e-f764e22e542e-bluemix.cloudantnosqldb.appdomain.cloud
IBM_CLOUDANT_API_KEY=YPvyK1d8H6wpFPwnNzXFCRe8D0yhuDMkCfEFfZo9TBKo
VARS

mv "$TMP" "$ENV_FILE"
echo "✅ Secrets written to $ENV_FILE"