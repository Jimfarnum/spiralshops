#!/bin/bash
set -euo pipefail

############################
# Configuration (env vars) #
############################
: "${IBM_API_KEY:?Missing IBM_API_KEY}"
: "${VERCEL_TOKEN:?Missing VERCEL_TOKEN}"
: "${VERCEL_PROJECT_ID:?Missing VERCEL_PROJECT_ID}"
: "${GODADDY_API_KEY:?Missing GODADDY_API_KEY}"
: "${GODADDY_API_SECRET:?Missing GODADDY_API_SECRET}"

DOMAIN="${DOMAIN:-spiralshops.com}"
SUBDOMAIN="${SUBDOMAIN:-api}"

REGION="${REGION:-us-south}"
RESOURCE_GROUP="${RESOURCE_GROUP:-Default}"
PROJECT_NAME="${PROJECT_NAME:-spiral-platform}"

APP_NAME="${APP_NAME:-spiral-api}"
IMAGE_NAME="${IMAGE_NAME:-spiral-api}"
IMAGE_URL="${IMAGE_URL:-us.icr.io/spiral/$IMAGE_NAME:latest}"
PORT="${PORT:-5000}"

# Optional notifications (Slack + SendGrid email)
SLACK_WEBHOOK="${SLACK_WEBHOOK:-}"           # e.g., https://hooks.slack.com/services/XXXXX/XXXXX/XXXXX
SENDGRID_API_KEY="${SENDGRID_API_KEY:-}"     # optional
EMAIL_TO="${EMAIL_TO:-}"                     # optional, e.g., you@example.com
EMAIL_FROM="${EMAIL_FROM:-}"                 # optional, verified sender in SendGrid

#####################
# Helper: Notify    #
#####################
notify() {
  local level="$1"  # INFO | SUCCESS | ERROR | WARN
  local text="$2"
  local title="${3:-SPIRAL Hybrid Deploy}"

  echo "[$level] $text"

  # Slack
  if [[ -n "$SLACK_WEBHOOK" ]]; then
    curl -s -X POST "$SLACK_WEBHOOK" \
      -H "Content-Type: application/json" \
      -d "$(jq -n --arg t "$title" --arg l "$level" --arg msg "$text" \
        '{attachments:[{color:($l=="ERROR"?"#e01e5a":($l=="WARN"?"#e3b341":($l=="SUCCESS"?"#2eb886":"#439fe0"))), title:$t, text:$msg}]}')" >/dev/null || true
  fi

  # Email (SendGrid)
  if [[ -n "$SENDGRID_API_KEY" && -n "$EMAIL_TO" && -n "$EMAIL_FROM" ]]; then
    curl -s --request POST \
      --url https://api.sendgrid.com/v3/mail/send \
      --header "Authorization: Bearer $SENDGRID_API_KEY" \
      --header 'Content-Type: application/json' \
      --data "$(jq -n --arg sub "$title [$level]" --arg to "$EMAIL_TO" --arg from "$EMAIL_FROM" --arg msg "$text" \
        '{personalizations:[{to:[{email:$to}]}], from:{email:$from}, subject:$sub, content:[{type:"text/plain", value:$msg}]}')" >/dev/null || true
  fi
}

#########################################
# Helper: Rollback IBM & Vercel on fail #
#########################################
LAST_IMAGE=""
LAST_API_URL=""

rollback_ibm() {
  notify "WARN" "Rolling back IBM Code Engine app to previous image: $LAST_IMAGE"
  if [[ -n "$LAST_IMAGE" ]]; then
    ibmcloud ce app delete --name "$APP_NAME" -f || true
    ibmcloud ce app create \
      --name "$APP_NAME" \
      --image "$LAST_IMAGE" \
      --port "$PORT" \
      --cpu 1 \
      --memory 2G \
      --min-scale 1 \
      --max-scale 3 \
      --env NODE_ENV=production || true
    notify "SUCCESS" "IBM rollback complete (image: $LAST_IMAGE)."
  else
    notify "WARN" "No previous IBM image found; IBM rollback skipped."
  fi
}

rollback_vercel() {
  if [[ -n "$LAST_API_URL" ]]; then
    notify "WARN" "Rolling back Vercel env VITE_API_BASE_URL to previous value."
    # Upsert previous value back
    curl -s -X POST "https://api.vercel.com/v10/projects/$VERCEL_PROJECT_ID/env?upsert=1" \
      -H "Authorization: Bearer $VERCEL_TOKEN" \
      -H "Content-Type: application/json" \
      -d "$(jq -n --arg val "$LAST_API_URL" \
        '{key:"VITE_API_BASE_URL","value":$val,"type":"plain","target":["production","preview","development"]}')" >/dev/null || true

    # Trigger fresh deployment
    curl -s -X POST "https://api.vercel.com/v13/deployments" \
      -H "Authorization: Bearer $VERCEL_TOKEN" \
      -H "Content-Type: application/json" \
      -d "$(jq -n --arg pid "$VERCEL_PROJECT_ID" '{project:$pid}')" >/dev/null || true
    notify "SUCCESS" "Vercel rollback triggered (env restored)."
  else
    notify "WARN" "No previous Vercel VITE_API_BASE_URL captured; Vercel rollback skipped."
  fi
}

handle_failure() {
  local reason="$1"
  notify "ERROR" "Deployment failed: $reason"
  rollback_ibm
  rollback_vercel
  exit 1
}

#########################
# IBM Cloud Login/Init  #
#########################
notify "INFO" "Logging into IBM Cloud & selecting project…"
ibmcloud login --apikey "$IBM_API_KEY" -r "$REGION" -g "$RESOURCE_GROUP" >/dev/null

ibmcloud ce project select -n "$PROJECT_NAME" >/dev/null || \
  ibmcloud ce project create -n "$PROJECT_NAME" >/dev/null

#########################################
# Capture current state for rollbacks   #
#########################################
notify "INFO" "Capturing previous IBM image & Vercel env…"
LAST_IMAGE=$(ibmcloud ce app get -n "$APP_NAME" --output json 2>/dev/null | jq -r '.spec.image // empty' || echo "")
# Get current Vercel env var value (prev API URL)
LAST_API_URL=$(curl -s -X GET "https://api.vercel.com/v9/projects/$VERCEL_PROJECT_ID/env?decrypt=true" \
  -H "Authorization: Bearer $VERCEL_TOKEN" | jq -r '.env[] | select(.key=="VITE_API_BASE_URL") | .value // empty' || echo "")

if [[ -n "$LAST_IMAGE" ]]; then notify "INFO" "Previous IBM image: $LAST_IMAGE"; fi
if [[ -n "$LAST_API_URL" ]]; then notify "INFO" "Previous Vercel VITE_API_BASE_URL: $LAST_API_URL"; fi

###############################
# Build & Push backend image  #
###############################
notify "INFO" "Building Docker image: $IMAGE_URL"
docker build -t "$IMAGE_URL" ./server || handle_failure "Docker build failed"

notify "INFO" "Pushing image to IBM Container Registry…"
ibmcloud cr login >/dev/null
docker push "$IMAGE_URL" || handle_failure "Docker push failed"

###############################
# Deploy backend to CodeEngine#
###############################
notify "INFO" "Deploying IBM Code Engine app: $APP_NAME"
ibmcloud ce app delete --name "$APP_NAME" -f >/dev/null || true
if ! ibmcloud ce app create \
  --name "$APP_NAME" \
  --image "$IMAGE_URL" \
  --port "$PORT" \
  --cpu 1 \
  --memory 2G \
  --min-scale 1 \
  --max-scale 3 \
  --env NODE_ENV=production >/dev/null; then
  handle_failure "IBM app deployment failed"
fi

API_URL="$(ibmcloud ce app get -n "$APP_NAME" --output json | jq -r '.status.url // empty')"
[[ -z "$API_URL" ]] && handle_failure "Failed to get IBM app URL"
notify "SUCCESS" "Backend live at: $API_URL"

########################################
# Upsert env in Vercel & redeploy FE   #
########################################
notify "INFO" "Upserting Vercel env VITE_API_BASE_URL…"
curl -s -X POST "https://api.vercel.com/v10/projects/$VERCEL_PROJECT_ID/env?upsert=1" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg val "$API_URL" \
    '{key:"VITE_API_BASE_URL","value":$val,"type":"plain","target":["production","preview","development"]}')" >/dev/null \
  || handle_failure "Vercel env upsert failed"

notify "INFO" "Triggering Vercel redeploy…"
curl -s -X POST "https://api.vercel.com/v13/deployments" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg pid "$VERCEL_PROJECT_ID" '{project:$pid}')" >/dev/null \
  || handle_failure "Vercel redeploy failed"
notify "SUCCESS" "Vercel redeploy triggered."

###########################
# GoDaddy DNS: CNAME fix  #
###########################
# Extract hostname from API_URL for the CNAME target
API_HOST="$(echo "$API_URL" | sed -E 's#^https?://([^/]+)/?.*$#\1#')"
if [[ -z "$API_HOST" ]]; then handle_failure "Could not parse API hostname"; fi

notify "INFO" "Updating GoDaddy DNS: $SUBDOMAIN.$DOMAIN CNAME → $API_HOST"
curl -s -X PUT "https://api.godaddy.com/v1/domains/$DOMAIN/records/CNAME/$SUBDOMAIN" \
  -H "Authorization: sso-key $GODADDY_API_KEY:$GODADDY_API_SECRET" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg h "$API_HOST" '{[0]: {data:$h, ttl:600}}')" >/dev/null \
  || handle_failure "GoDaddy DNS update failed"
notify "SUCCESS" "DNS set: $SUBDOMAIN.$DOMAIN → $API_HOST"

#############################
# SSL readiness verification#
#############################
FULL_DOMAIN="$SUBDOMAIN.$DOMAIN"
notify "INFO" "Waiting for SSL at https://$FULL_DOMAIN …"
READY=0
for i in {1..30}; do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://$FULL_DOMAIN" || true)
  if [[ "$CODE" -ge 200 && "$CODE" -lt 500 ]]; then
    READY=1
    break
  fi
  notify "INFO" "Attempt $i/30: Status $CODE, retry in 30s…"
  sleep 30
done

if [[ "$READY" -ne 1 ]]; then
  handle_failure "SSL not verified for $FULL_DOMAIN after ~15 minutes"
fi

notify "SUCCESS" "SSL verified for $FULL_DOMAIN. Full hybrid deployment complete 🎉"
exit 0
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
