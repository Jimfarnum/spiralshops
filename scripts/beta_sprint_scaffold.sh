# =====================================================================================
# SPIRAL — One-Paste: Beta Sprint + IBM Staging CI/CD Scaffolder
# - Creates 21-day sprint structure, daily agent scripts
# - Adds GitHub Actions workflow for IBM Code Engine staging
# - Adds Dockerfile (if missing), and a short README for secrets
# - Commits everything
# =====================================================================================

set -euo pipefail
GREEN='\033[1;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
say(){ printf "${GREEN}%s${NC}\n" "$*"; }; warn(){ printf "${YELLOW}%s${NC}\n" "$*"; }

say "🚀 SPIRAL: scaffolding 21-day Beta Sprint + IBM staging CI/CD..."

# 0) Ensure dirs
mkdir -p scripts sprint/agents sprint/tasks sprint/reports sprint/logs .github/workflows docs

# 1) 21-day sprint tickets
for day in $(seq 1 21); do
  cat > "sprint/tasks/day${day}.md" <<EOF
# SPIRAL Beta Sprint - Day ${day}

## Agent B (Advisor) — Directive
- [ ] Goal(s):
- [ ] Commands for Agent A:
- [ ] Acceptance criteria:
- [ ] Copy/artifacts to produce (legal/SEO/social/press):
- [ ] Risks/assumptions:

## Agent A (Ops) — Execution
- [ ] Ran commands (attach logs/paths)
- [ ] Created/updated files:
- [ ] Validation (endpoints/tests passed):
- [ ] Issues/tickets opened:

## Daily Confirmation
- [ ] Demo build tested
- [ ] Security scans green (ZAP/Snyk/npm audit/Newman)
- [ ] Backup/restore check OK
- [ ] Log updated in docs/launch_log.md
EOF
done

# 2) Daily helper scripts for Agents
cat > sprint/agents/agentA_daily.sh <<'SH'
#!/usr/bin/env bash
set -e
echo "🤖 Agent A (Replit) — Daily Ops"
npm run agent:legal || true
npm run agent:seo || true
npm run agent:api || true
npm run agent:audits || true
npm run agent:backups || true
echo "Done."
SH
chmod +x sprint/agents/agentA_daily.sh

cat > sprint/agents/agentB_daily.md <<'MD'
# 🤖 Agent B (ChatGPT "SPIRAL Advisor") — Daily Template
**Use this template in ChatGPT each morning. Paste into `sprint/reports/day-YYYYMMDD.md`.**

## Plan (3–5 tasks)
1)
2)
3)

## Directives to Agent A
- Goal:
- Commands:
- Acceptance criteria:

## Drafts/Artifacts (paste here)
- Legal copy sections:
- SEO titles/desc/OG:
- Social posts / press pitch:

## End-of-day Review
- What shipped:
- What needs edits:
- Blockers & decisions:
MD

# 3) README for secrets & IBM setup
cat > docs/IBM_STAGING_README.md <<'MD'
# IBM Staging — Setup Guide (Code Engine)

## GitHub Secrets (required)
- IBM_CLOUD_APIKEY: IBM Cloud API key
- IBM_CR_NAMESPACE: Your IBM Container Registry namespace (e.g., spiralshops)
- (Optional) SENTRY_DSN, GA4_ID, STRIPE_SECRET, TWILIO keys, etc. (set in Code Engine env)

## IBM Prep
1. Create a Code Engine **project**: `spiralshops-staging`
2. Create a Container Registry namespace: `us.icr.io/<namespace>`
3. Create a registry secret in CE UI named `icr-secret` tied to your ICR creds
4. Map environment variables/secrets in the CE app (PORT=5000, tokens, etc.)

On push to `main`, GitHub Actions builds the Docker image, pushes to ICR, and deploys/updates CE app.
MD

# 4) GitHub Actions workflow (deploy to IBM staging)
cat > .github/workflows/deploy-ibm-staging.yml <<'YML'
name: Deploy to IBM Staging

on:
  push:
    branches: [ "main" ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repo
        uses: actions/checkout@v4

      - name: Install IBM Cloud CLI
        run: |
          curl -fsSL https://clis.cloud.ibm.com/install/linux | sh
          ibmcloud plugin install code-engine -f
          ibmcloud plugin install container-registry -f

      - name: IBM Cloud login
        env:
          IBM_CLOUD_APIKEY: ${{ secrets.IBM_CLOUD_APIKEY }}
        run: |
          ibmcloud login --apikey "$IBM_CLOUD_APIKEY" -r us-south

      - name: Build Docker image
        run: docker build -t spiralshops:staging .

      - name: Push to IBM Container Registry
        env:
          IBM_CR_NAMESPACE: ${{ secrets.IBM_CR_NAMESPACE }}
        run: |
          ibmcloud cr login
          docker tag spiralshops:staging us.icr.io/${IBM_CR_NAMESPACE}/spiralshops:staging
          docker push us.icr.io/${IBM_CR_NAMESPACE}/spiralshops:staging

      - name: Deploy/update Code Engine app (staging)
        env:
          IBM_CR_NAMESPACE: ${{ secrets.IBM_CR_NAMESPACE }}
        run: |
          ibmcloud ce project select --name spiralshops-staging || ibmcloud ce project create --name spiralshops-staging
          # Try create, else update
          ibmcloud ce app create --name spiralshops-staging \
            --image us.icr.io/${IBM_CR_NAMESPACE}/spiralshops:staging \
            --cpu 1 --memory 2G --concurrency 50 --min-scale 1 --max-scale 5 \
            --port 5000 --registry-secret icr-secret || \
          ibmcloud ce app update --name spiralshops-staging \
            --image us.icr.io/${IBM_CR_NAMESPACE}/spiralshops:staging
YML

# 5) Add a minimal Dockerfile if missing
if [ ! -f Dockerfile ]; then
  cat > Dockerfile <<'DOCKER'
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production || npm install --omit=dev
COPY . .
ENV NODE_ENV=production PORT=5000
EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:5000/api/check || exit 1
CMD ["node","server/index.js"]
DOCKER
  say "🧱 Added minimal Dockerfile"
else
  warn "Dockerfile already present — left untouched."
fi

# 6) Launch log and consolidated plan file
cat > docs/launch_log.md <<'MD'
# SPIRAL Launch Log
(Keep daily updates here: what shipped, blockers, decisions.)
MD

cat > docs/launch_readiness_plan.md <<'MD'
# SPIRAL — 21-Day Beta + IBM Staging (Merged Roadmap)

## Phase 1 (Days 0–7) – Trust + MVP
- Legal: ToS/Privacy/Refunds live; footer links
- Buyer Guarantee + Verified badges on PDP/Cart/Checkout
- Stripe Connect checkout + webhooks; wallets where verified
- Square POS inventory read; "Ready today" logic
- Security: Sentry + ZAP/Snyk/Newman; backups green

## Phase 2 (Days 8–14) – Onboarding + Lifecycle
- Retailer wizard <10 min; CSV import; Square connect
- Reviews v1 (order-verified); referral credit v1
- Email/SMS: welcome + abandoned cart (T+1h/T+24h)
- SEO: sitemap/robots/schema; GA4 confirmed

## Phase 3 (Days 15–21) – Mall + Trust + Soft Launch
- Mall Command Center (MVP): promo toggles, aggregates
- Public Trust page (beta): uptime, order success, refund ETA
- Pilot live: 1 mall, 10 retailers, 500 shoppers invite
- Go/No-Go checklist; IBM staging soak test passes
MD

# 7) Smoke test script for daily validation
cat > sprint/agents/daily_smoke_test.sh <<'SH'
#!/usr/bin/env bash
set -e
TS="$(date +%Y%m%d-%H%M%S)"
LOG_FILE="sprint/logs/smoke-test-${TS}.txt"
mkdir -p sprint/logs

echo "SPIRAL Daily Smoke Test - ${TS}" > "${LOG_FILE}"
echo "=================================" >> "${LOG_FILE}"

PASS=1
check_endpoint() {
  local url="$1"
  local name="$2"
  if curl -fsS "$url" >/dev/null 2>&1; then
    echo "✅ PASS: ${name} (${url})" >> "${LOG_FILE}"
  else
    echo "❌ FAIL: ${name} (${url})" >> "${LOG_FILE}"
    PASS=0
  fi
}

check_endpoint "http://localhost:5000/api/check" "Health Check"
check_endpoint "http://localhost:5000/api/products" "Products API"
check_endpoint "http://localhost:5000/api/stores" "Stores API"
check_endpoint "http://localhost:5000/api/promotions" "Promotions API"

if [ $PASS -eq 1 ]; then
  echo "✅ OVERALL: PASS - All endpoints responding" >> "${LOG_FILE}"
else
  echo "❌ OVERALL: FAIL - Some endpoints down" >> "${LOG_FILE}"
fi

echo "Test completed: ${TS}" >> "${LOG_FILE}"
cat "${LOG_FILE}"
SH
chmod +x sprint/agents/daily_smoke_test.sh

# 8) Commit all changes with environment-safe git operations
warn "Git operations may be restricted in this environment"
warn "Sprint scaffolding complete - manual git commit recommended"

say "✅ Done. Created sprint structure, CI workflow, Dockerfile, and docs."
say "Next:"
echo "  1) Open docs/IBM_STAGING_README.md and add GitHub secrets (IBM_CLOUD_APIKEY, IBM_CR_NAMESPACE)."
echo "  2) Push to GitHub main to trigger the IBM staging deploy workflow."
echo "  3) Use sprint/tasks/day1.md to drive today's work; Agent A script: sprint/agents/agentA_daily.sh"