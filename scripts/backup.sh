#!/usr/bin/env bash
set -euo pipefail
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_DIR="backups/${STAMP}"
mkdir -p "${BACKUP_DIR}"
tar -czf "${BACKUP_DIR}/spiral-essential-code-${STAMP}.tar.gz" \
  --exclude=./node_modules --exclude=./.git --exclude=./backups --exclude=./_to-migrate \
  --exclude=./attached_assets --exclude=./security-reports .
if command -v zip >/dev/null 2>&1; then
  zip -qr "${BACKUP_DIR}/latest-spiral-code.zip" . -x "node_modules/*" ".git/*" "backups/*" "_to-migrate/*" "attached_assets/*" "security-reports/*"
fi
if command -v sha256sum >/dev/null 2>&1; then
  ( cd "${BACKUP_DIR}" && sha256sum *.tar.gz *.zip 2>/dev/null > SHA256SUMS || true )
fi
echo "Backups ready in ${BACKUP_DIR}"
