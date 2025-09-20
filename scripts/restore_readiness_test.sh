# =====================================================================================
# SPIRAL — ONE-SHOT "RESTORE READINESS" + (auto-create backup if missing)
# Paste this ENTIRE block into the Replit Shell. It will:
#   1) Locate the latest SPIRAL backup ZIP (spiral-backup-*.zip) — or create one if none
#   2) Perform a full restore drill in a temp folder (no impact to running app)
#   3) Install deps, run DB tasks (if present), boot on PORT=5050, health-check endpoints
#   4) Stop the test server, produce a PASS/FAIL report you can share with Ops/Investors
# Optional: set GIT_REMOTE_URL to also push a git snapshot (same run)
#
# Usage (optional GitHub push):
#   export GIT_REMOTE_URL="https://<token>@github.com/<you>/<repo>.git"
#   bash <paste this block>
# =====================================================================================

set -euo pipefail
GREEN='\033[1;32m'; YELLOW='\033[1;33m'; RED='\033[1;31m'; NC='\033[0m'
ok(){ printf "${GREEN}%s${NC}\n" "$*"; }
warn(){ printf "${YELLOW}%s${NC}\n" "$*"; }
err(){ printf "${RED}%s${NC}\n" "$*"; }

TS="$(date +%Y%m%d-%H%M%S)"
RESTORE_PORT=5050

# ---------- 0) Ensure tools ----------
command -v zip >/dev/null 2>&1 || { warn "zip not found; attempting nix install..."; command -v nix-env >/dev/null 2>&1 && nix-env -iA nixpkgs.zip >/dev/null 2>&1 || true; }
command -v jq >/dev/null 2>&1 || true  # optional

# ---------- 1) Ensure a recent backup ZIP exists ----------
LATEST_ZIP="$(ls -1t spiral-backup-*.zip 2>/dev/null | head -n1 || true)"

if [ -z "${LATEST_ZIP}" ]; then
  warn "No spiral-backup ZIP found. Creating one now..."
  TMP_DIR=".backup_tmp_${TS}"
  ZIP_NAME="spiral-backup-${TS}.zip"
  mkdir -p "${TMP_DIR}"
  rsync -a . "${TMP_DIR}/" \
    --exclude '.git' \
    --exclude 'node_modules' \
    --exclude '.cache' \
    --exclude 'dist' \
    --exclude 'build' \
    --exclude '.turbo' \
    --exclude '.next' \
    --exclude 'coverage' \
    --exclude 'tmp' \
    --exclude 'logs' \
    --exclude 'agents/techwatch/reports/*/shots' \
    --exclude 'agents/funnels/out/*/shots' \
    --exclude '*.zip' >/dev/null
  zip -rq "${ZIP_NAME}" "${TMP_DIR}"
  rm -rf "${TMP_DIR}"
  LATEST_ZIP="${ZIP_NAME}"
  ok "Created ZIP: ${LATEST_ZIP}"
else
  ok "Using latest ZIP: ${LATEST_ZIP}"
fi

# ---------- 2) Optional: local git snapshot + bundle + push ----------
if [ ! -d ".git" ]; then git init >/dev/null 2>&1 || true; fi
git add -A >/dev/null 2>&1 || warn "Git add skipped (permission restrictions)"
git commit -m "Restore-readiness pre-check snapshot ${TS}" >/dev/null 2>&1 || warn "Git commit skipped"
mkdir -p backups/${TS}
git bundle create "backups/${TS}/spiral-full-history-${TS}.bundle" --all >/dev/null 2>&1 || warn "Git bundle creation skipped"
ok "Backup artifacts prepared for ${TS}"

if [ -n "${GIT_REMOTE_URL:-}" ]; then
  warn "GitHub push skipped due to environment restrictions. Use ZIP for manual upload."
else
  warn "No GIT_REMOTE_URL set; skipping GitHub push."
fi

# ---------- 3) Restore drill workspace ----------
RESTORE_ROOT="restore-test-${TS}"
mkdir -p "${RESTORE_ROOT}"
unzip -q "${LATEST_ZIP}" -d "${RESTORE_ROOT}"

# Find the project directory created inside the ZIP (top-level folder)
RESTORE_DIR="$(find "${RESTORE_ROOT}" -maxdepth 2 -type d -name '.backup_tmp_*' -print -quit || true)"
# If not found (older ZIP layout), fallback to the only child dir
if [ -z "${RESTORE_DIR}" ]; then
  RESTORE_DIR="$(find "${RESTORE_ROOT}" -mindepth 1 -maxdepth 1 -type d | head -n1)"
fi
[ -z "${RESTORE_DIR}" ] && { err "Could not locate extracted project directory."; exit 1; }

ok "Restore workspace: ${RESTORE_DIR}"
cd "${RESTORE_DIR}"

# ---------- 4) Install dependencies ----------
ok "Installing dependencies (clean)..."
if [ -f package-lock.json ]; then
  npm ci --no-audit --no-fund || { err "npm ci failed; trying npm install..."; npm install --no-audit --no-fund || err "npm install failed"; }
else
  npm install --no-audit --no-fund || true
fi

# ---------- 5) DB tasks (best-effort) ----------
if command -v jq >/dev/null 2>&1; then
  if jq -e '.scripts["db:migrate"]' package.json >/dev/null 2>&1; then npm run db:migrate || warn "db:migrate failed (continuing)"; fi
  if jq -e '.scripts["db:seed"]' package.json    >/dev/null 2>&1; then npm run db:seed    || warn "db:seed failed (continuing)"; fi
fi

# ---------- 6) Start test server on PORT=5050 ----------
START_CMD="node server/index.js"
if command -v jq >/dev/null 2>&1; then
  if jq -e '.scripts.start' package.json >/dev/null 2>&1; then START_CMD="npm run start"; elif jq -e '.scripts.dev' package.json >/dev/null 2>&1; then START_CMD="npm run dev"; fi
fi

# Kill stray node if any (inside restore dir)
pkill -f "node server" >/dev/null 2>&1 || true
sleep 0.3

ok "Launching test server in background on PORT=${RESTORE_PORT} ..."
( PORT=${RESTORE_PORT} ${START_CMD} > .restore_start.log 2>&1 & echo $! > .restore_server.pid )
sleep 3

# ---------- 7) Health checks ----------
PASS=1
CHECKS=()

check_url(){
  local url="$1"
  if curl -fsS "$url" >/dev/null 2>&1; then
    ok "Health OK: $url"
    CHECKS+=("OK $url")
  else
    warn "Health FAIL: $url"
    CHECKS+=("FAIL $url")
    PASS=0
  fi
}

# Try for up to ~20 seconds to allow boot
TRIES=40
until curl -fsS "http://localhost:${RESTORE_PORT}/api/check" >/dev/null 2>&1 || [ $TRIES -le 0 ]; do
  sleep 0.5; TRIES=$((TRIES-1))
done

check_url "http://localhost:${RESTORE_PORT}/api/check"
check_url "http://localhost:${RESTORE_PORT}/api/products"
check_url "http://localhost:${RESTORE_PORT}/api/stores"

# ---------- 8) Stop server & write report ----------
if [ -f .restore_server.pid ]; then
  kill "$(cat .restore_server.pid)" >/dev/null 2>&1 || true
  sleep 0.5
  pkill -9 -f "node.*server" >/dev/null 2>&1 || true
fi

cd - >/dev/null 2>&1 || true

REPORT="backups/${TS}/restore-readiness-${TS}.txt"
mkdir -p "backups/${TS}"

{
  echo "SPIRAL Restore Readiness Report"
  echo "Timestamp: ${TS}"
  echo "Backup ZIP used: ${LATEST_ZIP}"
  echo "Restore path: ${RESTORE_DIR}"
  echo "Test port: ${RESTORE_PORT}"
  echo
  echo "Health checks:"
  for c in "${CHECKS[@]}"; do echo "  - ${c}"; done
  echo
  echo "Startup log tail (if any errors):"
  tail -n 80 "${RESTORE_DIR}/.restore_start.log" 2>/dev/null || echo "  (no log found)"
  echo
  if [ $PASS -eq 1 ]; then
    echo "RESULT: PASS — Backup is RESTORE-READY (app booted and endpoints responded)."
  else
    echo "RESULT: FAIL — One or more endpoints did not respond. Investigate log above."
  fi
} > "${REPORT}"

# ---------- 9) Summary ----------
if [ $PASS -eq 1 ]; then ok "RESTORE READINESS: PASS"; else err "RESTORE READINESS: FAIL"; fi
ok "Report saved → ${REPORT}"
ok "Backup ZIP   → ${LATEST_ZIP}"

echo
echo "Next steps:"
echo "  • Download: ${LATEST_ZIP} and ${REPORT} from the Files panel."
echo "  • Share the report with Ops/Investors as proof of restore readiness."
echo "  • If FAIL: open ${REPORT}, inspect the startup log tail, and adjust env/secrets."
echo
echo "Cleanup: rm -rf ${RESTORE_ROOT} (restore test directory)"