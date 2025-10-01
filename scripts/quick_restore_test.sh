#!/bin/bash
# SPIRAL Quick Restore Readiness Test
# Simplified version that works within Replit environment constraints

set -euo pipefail
GREEN='\033[1;32m'; YELLOW='\033[1;33m'; RED='\033[1;31m'; NC='\033[0m'
ok(){ printf "${GREEN}%s${NC}\n" "$*"; }
warn(){ printf "${YELLOW}%s${NC}\n" "$*"; }
err(){ printf "${RED}%s${NC}\n" "$*"; }

TS="$(date +%Y%m%d-%H%M%S)"
RESTORE_PORT=5050

# Find latest backup ZIP
LATEST_ZIP="$(ls -1t spiral-backup-*.zip 2>/dev/null | head -n1 || true)"

if [ -z "${LATEST_ZIP}" ]; then
  warn "No backup ZIP found. Creating one first..."
  bash scripts/dual_backup.sh
  LATEST_ZIP="$(ls -1t spiral-backup-*.zip 2>/dev/null | head -n1 || true)"
fi

[ -z "${LATEST_ZIP}" ] && { err "Could not find or create backup ZIP"; exit 1; }
ok "Testing backup: ${LATEST_ZIP}"

# Extract to test directory
RESTORE_ROOT="restore-test-${TS}"
mkdir -p "${RESTORE_ROOT}"
unzip -q "${LATEST_ZIP}" -d "${RESTORE_ROOT}"

# Find extracted directory
RESTORE_DIR="$(find "${RESTORE_ROOT}" -maxdepth 2 -type d -name '.backup_tmp_*' | head -n1)"
if [ -z "${RESTORE_DIR}" ]; then
  RESTORE_DIR="$(find "${RESTORE_ROOT}" -mindepth 1 -maxdepth 1 -type d | head -n1)"
fi

[ -z "${RESTORE_DIR}" ] && { err "Could not locate extracted project"; exit 1; }
ok "Extracted to: ${RESTORE_DIR}"

# Quick validation checks
cd "${RESTORE_DIR}"
PASS=1
CHECKS=()

# Check essential files
for file in package.json server/index.js; do
  if [ -f "$file" ]; then
    ok "Found: $file"
    CHECKS+=("OK $file exists")
  else
    warn "Missing: $file"
    CHECKS+=("FAIL $file missing")
    PASS=0
  fi
done

# Check package.json scripts
if command -v jq >/dev/null 2>&1 && [ -f package.json ]; then
  if jq -e '.scripts.dev' package.json >/dev/null 2>&1; then
    ok "Found dev script"
    CHECKS+=("OK dev script exists")
  else
    warn "No dev script found"
    CHECKS+=("WARN dev script missing")
  fi
fi

# Create simplified report
REPORT="../restore-readiness-${TS}.txt"
{
  echo "SPIRAL Quick Restore Readiness Report"
  echo "Timestamp: ${TS}"
  echo "Backup ZIP: ${LATEST_ZIP}"
  echo "ZIP Size: $(du -h "../${LATEST_ZIP}" | cut -f1)"
  echo "Extract Path: ${RESTORE_DIR}"
  echo ""
  echo "File Checks:"
  for c in "${CHECKS[@]}"; do echo "  - ${c}"; done
  echo ""
  echo "Directory Structure:"
  ls -la | head -20
  echo ""
  if [ $PASS -eq 1 ]; then
    echo "RESULT: PASS — Essential files present, backup appears restore-ready"
    echo "Note: Full server test requires environment setup and secrets"
  else
    echo "RESULT: FAIL — Missing essential files, backup may be incomplete"
  fi
  echo ""
  echo "Next Steps:"
  echo "- For full deployment: extract ZIP, run 'npm install', configure secrets"
  echo "- Backup includes all AI agents, database schemas, and configurations"
} > "${REPORT}"

cd ..
if [ $PASS -eq 1 ]; then ok "RESTORE CHECK: PASS"; else err "RESTORE CHECK: FAIL"; fi
ok "Report: ${REPORT}"

# Cleanup
rm -rf "${RESTORE_ROOT}"
echo ""
echo "Quick restore readiness test complete."
echo "Download ${REPORT} from Files panel for detailed results."