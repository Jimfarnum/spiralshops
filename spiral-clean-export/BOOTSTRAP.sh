#!/bin/bash
# =====================================================================
# SPIRAL — NEW REPL BOOTSTRAP (for `spiral-clean-export/`)
# Paste this WHOLE block into the Replit Shell of your NEW Repl and hit Enter.
# It will:
#  1) Verify and move the clean export into place (if needed)
#  2) Create .env with required secrets (placeholders)
#  3) Install dependencies (npm ci)
#  4) Run DB migrate/seed (if scripts exist)
#  5) Start the server in the background on PORT=5000 and health-check it
#  6) Optionally run TechWatch cycle and security checks (if scripts exist)
#  7) Initialize git + make a safety backup (tar.gz + zip)
# =====================================================================

set -euo pipefail

cecho(){ printf "\033[1;32m%s\033[0m\n" "$*"; }
wecho(){ printf "\033[1;33m%s\033[0m\n" "$*"; }
eecho(){ printf "\033[1;31m%s\033[0m\n" "$*"; }
exists_script(){ jq -r --arg k "$1" '.scripts[$k] // ""' package.json 2>/dev/null | grep -q . ; }

ROOT="$(pwd)"
TS="$(date +%Y%m%d-%H%M%S)"
APP_DIR="${ROOT}"
SRC_DIR="${ROOT}/spiral-clean-export"

cecho "==> 0) Preparing workspace ..."

# 0A) If the clean export folder exists and project root looks empty, move contents up
if [ -d "${SRC_DIR}" ] && [ ! -f "${ROOT}/package.json" ]; then
  cecho "   • Detected spiral-clean-export/ → moving into project root ..."
  shopt -s dotglob
  mv "${SRC_DIR}"/* "${ROOT}/"
  rmdir "${SRC_DIR}" || true
  shopt -u dotglob
fi

# 0B) Sanity checks
if [ ! -f "${ROOT}/package.json" ]; then
  eecho "   ✖ package.json not found. Ensure spiral-clean-export/ is uploaded to this Repl."
  exit 1
fi

# 0C) Show project files
wecho "   • Top-level files:"
ls -1 | head -n 50

# 1) Create .env (or .env.local) with placeholders if not present
ENV_FILE=".env"
[ -f ".env.local" ] && ENV_FILE=".env.local"
if [ ! -f "$ENV_FILE" ]; then
  cecho "==> 1) Creating $ENV_FILE with placeholders (update in Replit Secrets later) ..."
  cat > "$ENV_FILE" <<'EOF'
# ====== SPIRAL ENV (placeholders; override via Replit Secrets UI) ======
PORT=5000
ADMIN_TOKEN=change-me-admin
ADMIN_SESSION_SECRET=change-me-session
INVESTOR_TOKEN=spiral-demo-2025-stonepath-67c9
OPENAI_API_KEY=change-me-openai
STRIPE_PUBLISHABLE_KEY=change-me-stripe-pub
STRIPE_SECRET_KEY=change-me-stripe-secret
DATABASE_URL=change-me-database
# Optional:
GITHUB_TOKEN=
MAIL_PROVIDER_KEY=
# TechWatch cadence
FUNNEL_RUN_INTERVAL_DAYS=14
FUNNEL_HEADLESS=true
EOF
else
  wecho "   • Using existing $ENV_FILE"
fi

# 2) Install dependencies (clean)
cecho "==> 2) Installing dependencies ..."
if [ -f package-lock.json ]; then
  npm ci --no-audit --no-fund
else
  npm install --no-audit --no-fund
fi

# 3) Database migrate/seed if available
cecho "==> 3) Running database tasks (if scripts exist) ..."
if exists_script "db:push"; then npm run db:push || true; fi
if exists_script "db:migrate"; then npm run db:migrate || true; fi
if exists_script "db:seed";    then npm run db:seed    || true; fi

# 4) Start server in background on a fixed port (5000) for health checks
cecho "==> 4) Starting server in background on PORT=5000 ..."
# Try to find a start command
START_CMD="node server/index.js"
if jq -e '.scripts.start' package.json >/dev/null 2>&1; then
  START_CMD="npm run start"
elif jq -e '.scripts.dev' package.json >/dev/null 2>&1; then
  START_CMD="npm run dev"
fi

# Kill any stray node first
pkill -f node || true
sleep 0.5

# Launch
( PORT=5000 $START_CMD > .startup.log 2>&1 & echo $! > .server.pid )
sleep 1

# 4A) Health check loop
cecho "==> 4A) Waiting for health endpoint ..."
HEALTH_OK=0
for i in {1..40}; do
  if curl -fsS "http://localhost:5000/api/check" >/dev/null 2>&1; then
    HEALTH_OK=1; break
  fi
  sleep 0.5
done
if [ "$HEALTH_OK" -eq 1 ]; then
  cecho "   • Health OK: /api/check reachable"
else
  eecho "   ! Health check failed. Showing last 80 lines of .startup.log:"
  tail -n 80 .startup.log || true
fi

# 4B) Smoke checks for common endpoints (best-effort)
wecho "==> 4B) Smoke-testing endpoints (best effort) ..."
curl -fsS "http://localhost:5000/api/check"   || true
curl -fsS "http://localhost:5000/api/products" || true
curl -fsS "http://localhost:5000/api/stores"   || true

# 5) Optional: run TechWatch cycle and Funnels (if scripts exist)
cecho "==> 5) TechWatch tasks (optional if present) ..."
if exists_script "techwatch:cycle";   then npm run techwatch:cycle   || true; fi
if exists_script "techwatch:funnels"; then npm run techwatch:funnels || true; fi

# 6) Security quick passes (non-blocking)
cecho "==> 6) Security quick passes (non-blocking) ..."
npm audit --production || true
if command -v npx >/dev/null 2>&1; then npx snyk test || true; fi
if exists_script "zap:scan";     then npm run zap:scan     || true; fi
if exists_script "newman:ci";    then npm run newman:ci    || true; fi

# 7) Initialize git, commit, and create backups
cecho "==> 7) Git init + safety backups ..."
if [ ! -d ".git" ]; then git init >/dev/null 2>&1 || true; fi
git add -A || true
git commit -m "Bootstrap ${TS}" || true
mkdir -p backups/${TS}

# 7A) Git bundle (full history snapshot)
git bundle create "backups/${TS}/spiral-full-history.bundle" --all || true

# 7B) Create source+git archives (exclude heavy artifacts)
wecho "   • Creating archives ..."
cat > .backup-excludes <<'EOF'
node_modules
dist
build
.cache
.tmp
.turbo
.next
coverage
tmp
logs
agents/techwatch/reports/*/shots
agents/funnels/out
*.log
*.tmp
.DS_Store
EOF

tar -czf "backups/${TS}/spiral-source-with-git-${TS}.tar.gz" --exclude-from=.backup-excludes .
if command -v zip >/dev/null 2>&1; then
  zip -rq "backups/${TS}/spiral-source-with-git-${TS}.zip" . -x \
    "node_modules/*" "dist/*" "build/*" ".cache/*" ".tmp/*" ".turbo/*" ".next/*" "coverage/*" "tmp/*" "logs/*" \
    "agents/techwatch/reports/*/shots/*" "agents/funnels/out/*" "*.log" "*.tmp" "*.DS_Store"
fi

# 8) Final status + instructions
cecho "==> 8) Final status"
if [ "$HEALTH_OK" -eq 1 ]; then
  cecho "   ✔ Server is up on http://localhost:5000"
  wecho  "   • Admin routes:        /admin"
  wecho  "   • Investor portal:     /investors?investor_token=${INVESTOR_TOKEN:-(set in .env)}"
else
  eecho "   ✖ Server did not report healthy. Check .startup.log and your env vars."
fi

wecho  "==> Backups available:"
ls -lh backups/${TS} | sed 's/^/   /'

echo
cecho "NEXT STEPS"
echo "  1) Open the 'Secrets' tab and set real values for:"
echo "       ADMIN_TOKEN, ADMIN_SESSION_SECRET, INVESTOR_TOKEN, OPENAI_API_KEY, STRIPE keys, DATABASE_URL"
echo "  2) Click Run (or keep background server) to serve on Replit's assigned PORT."
echo "  3) Test endpoints and investor portal."
echo
cecho "Done."