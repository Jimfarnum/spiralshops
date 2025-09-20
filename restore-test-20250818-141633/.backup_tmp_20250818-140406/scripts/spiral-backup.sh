#!/usr/bin/env bash
# SPIRAL — One-Message Replit Agent Task
# Purpose: create clean backups + easy-download zip, reduce checkpoint issues,
# add git hygiene, and (optionally) scaffold IBM deploy files — in one go.
# Safe, idempotent, minimal-destructive (moves heavy dirs to staging, no deletes).

set -euo pipefail

### ───────────────────────── CONFIG (edit if needed) ─────────────────────────
# Heavy folders to keep OUT of the active dev workspace (improves Replit checkpoints)
HEAVY_DIRS=("attached_assets" "security-reports")

# Also stage older backups to reduce file watcher load (keeps the newest in /backups)
STAGE_OLD_BACKUPS=1

# Run quick Node checks (npm ci/build) after backup? (0/1)
RUN_NODE_CHECKS=0

# Scaffold IBM deployment files (Dockerfile + GitHub Action)? (0/1)
SCAFFOLD_IBM=1
IBM_REGION="us-south"          # IBM region for Container Registry / Code Engine
IBM_CR_NS="spiral"             # IBM Container Registry namespace
CE_PROJECT="spiral-prod"       # Code Engine project name
CE_APP_NAME="spiral-web"       # Code Engine app name
NODE_VERSION="20"              # Node version for CI

### ────────────────────────── PREP & UTILITIES ───────────────────────────────
STAMP="$(date +%Y%m%d-%H%M%S)"
ROOT_DIR="$(pwd)"
BACKUP_DIR="${ROOT_DIR}/backups/${STAMP}"
STAGING_DIR="${ROOT_DIR}/_to-migrate"
ARCHIVES_DIR="${STAGING_DIR}/archives/${STAMP}"

info() { printf "\n\033[1;34m[INFO]\033[0m %s\n" "$*"; }
ok()   { printf "\033[1;32m[OK]\033[0m %s\n" "$*"; }
warn() { printf "\033[1;33m[WARN]\033[0m %s\n" "$*"; }
err()  { printf "\033[1;31m[ERR]\033[0m %s\n" "$*"; }

has_cmd() { command -v "$1" >/dev/null 2>&1; }

mkdir -p "${BACKUP_DIR}" "${ARCHIVES_DIR}" "${STAGING_DIR}"

### ───────────────────── WORKSPACE SNAPSHOT (BEFORE) ─────────────────────────
info "Workspace stats (before):"
if has_cmd du; then du -sh . 2>/dev/null || true; fi
if has_cmd find; then
  TOTAL_FILES=$(find . -type f | wc -l | tr -d ' ')
  echo "Total files: ${TOTAL_FILES}"
fi

### ───────────────────── CREATE CLEAN BACKUP + ZIP ──────────────────────────
info "Creating essential code backup (tar.gz) with sensible excludes…"
# Excludes: node_modules, git, backups, staging, heavy dirs
TAR_EXCLUDES=(
  "--exclude=./node_modules"
  "--exclude=./.git"
  "--exclude=./backups"
  "--exclude=./_to-migrate"
)
for d in "${HEAVY_DIRS[@]}"; do TAR_EXCLUDES+=("--exclude=./${d}"); done

TAR_PATH="${BACKUP_DIR}/spiral-essential-code-${STAMP}.tar.gz"
tar -czf "${TAR_PATH}" "${TAR_EXCLUDES[@]}" .
ok "Backup tar created: ${TAR_PATH}"

info "Creating easy-download ZIP (if zip is available)…"
ZIP_PATH="${BACKUP_DIR}/latest-spiral-code.zip"
if has_cmd zip; then
  ZIP_EXCLUDES=(
    "node_modules/*" ".git/*" "backups/*" "_to-migrate/*"
  )
  for d in "${HEAVY_DIRS[@]}"; do ZIP_EXCLUDES+=("${d}/*"); done
  zip -qr "${ZIP_PATH}" . -x "${ZIP_EXCLUDES[@]}" || warn "zip encountered warnings"
  ok "ZIP created: ${ZIP_PATH}"
else
  warn "zip not found — skipping ZIP (tar.gz backup is available)."
fi

info "Generating SHA256 checksums…"
(
  cd "${BACKUP_DIR}"
  if has_cmd sha256sum; then
    sha256sum *.tar.gz 2>/dev/null > SHA256SUMS || true
    [ -f "latest-spiral-code.zip" ] && sha256sum latest-spiral-code.zip >> SHA256SUMS || true
    ok "Checksums written: ${BACKUP_DIR}/SHA256SUMS"
  else
    warn "sha256sum not found — skipping checksum generation."
  fi
)

### ───────────────────── MOVE HEAVY DIRECTORIES TO STAGING ───────────────────
info "Staging heavy directories to reduce file-watcher load…"
for d in "${HEAVY_DIRS[@]}"; do
  if [ -d "${ROOT_DIR}/${d}" ]; then
    mkdir -p "${STAGING_DIR}/drive"
    mv "${ROOT_DIR}/${d}" "${STAGING_DIR}/drive/" || warn "Could not move ${d}"
    ok "Moved ${d} -> ${STAGING_DIR}/drive/${d}"
  fi
done

if [ "${STAGE_OLD_BACKUPS}" = "1" ]; then
  info "Staging older backups (keeping newest ${STAMP} in place)…"
  mkdir -p "${STAGING_DIR}/archives"
  shopt -s nullglob
  for bdir in "${ROOT_DIR}/backups"/*; do
    [ -d "$bdir" ] || continue
    base="$(basename "$bdir")"
    if [ "$base" != "${STAMP}" ]; then
      mv "$bdir" "${STAGING_DIR}/archives/" || warn "Could not move backups/${base}"
      ok "Moved backups/${base} -> ${STAGING_DIR}/archives/${base}"
    fi
  done
  shopt -u nullglob
fi

### ─────────────────────────── GIT HYGIENE FILES ─────────────────────────────
info "Ensuring .gitignore and .env.example exist…"
GITIGNORE_CONTENT=$(cat <<'EOF'
# deps & builds
node_modules/
dist/
build/
.next/
.cache/

# env & secrets
.env
.env.*
!.env.example

# logs & OS junk
*.log
logs/
.DS_Store
Thumbs.db

# heavy/out-of-repl dirs
attached_assets/
security-reports/
backups/
_to-migrate/
EOF
)
if [ ! -f ".gitignore" ]; then
  echo "${GITIGNORE_CONTENT}" > .gitignore
  ok "Created .gitignore"
else
  # Append any missing lines
  while IFS= read -r line; do
    grep -qxF "$line" .gitignore || echo "$line" >> .gitignore
  done <<< "${GITIGNORE_CONTENT}"
  ok "Updated .gitignore"
fi

if [ ! -f ".env.example" ]; then
  cat > .env.example <<'EOF'
NODE_ENV=production
PORT=3000
# IBM Cloudant (example)
CLOUDANT_URL=
CLOUDANT_APIKEY=
CLOUDANT_DB=
# IBM Cloud Object Storage (example)
COS_BUCKET=
COS_REGION=
COS_ENDPOINT=
COS_ACCESS_KEY_ID=
COS_SECRET_ACCESS_KEY=
# Stripe (example)
STRIPE_PUBLIC_KEY=
STRIPE_SECRET_KEY=
# App
SPIRAL_API_BASE=
EOF
  ok "Created .env.example"
fi

### ───────────────────── OPTIONAL: IBM DEPLOYMENT SCAFFOLD ───────────────────
if [ "${SCAFFOLD_IBM}" = "1" ]; then
  info "Scaffolding IBM deployment files…"

  if [ ! -f "Dockerfile" ]; then
    cat > Dockerfile <<'EOF'
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build || true
EXPOSE 3000
CMD ["npm","start"]
EOF
    ok "Created Dockerfile"
  else
    ok "Dockerfile already exists — left unchanged"
  fi

  mkdir -p .github/workflows
  cat > .github/workflows/deploy-ibm.yml <<EOF
name: Deploy to IBM Code Engine
on:
  push:
    branches: [ main ]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    env:
      IMAGE: ${IBM_REGION/./}.icr.io/${IBM_CR_NS}/${CE_APP_NAME}:\${{ github.sha }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '${NODE_VERSION}' }
      - run: npm ci
      - run: npm run build --if-present
      - name: Install IBM Cloud CLI
        run: curl -fsSL https://clis.cloud.ibm.com/install/linux | sh
      - name: IBM login
        run: |
          echo "\${{ secrets.IBM_API_KEY }}" > /tmp/ibm.key
          ibmcloud login --apikey @/tmp/ibm.key -r ${IBM_REGION}
          ibmcloud cr region-set ${IBM_REGION}
          ibmcloud cr login
          ibmcloud cr namespace-add ${IBM_CR_NS} || true
      - name: Build & Push Image
        run: |
          docker build -t \$IMAGE .
          docker push \$IMAGE
      - name: Deploy to Code Engine
        run: |
          ibmcloud plugin install code-engine -f
          ibmcloud ce project select --name ${CE_PROJECT} || (ibmcloud ce project create --name ${CE_PROJECT} && ibmcloud ce project select --name ${CE_PROJECT})
          if ibmcloud ce app get --name ${CE_APP_NAME} >/dev/null 2>&1; then
            ibmcloud ce app update --name ${CE_APP_NAME} --image \$IMAGE
          else
            ibmcloud ce app create --name ${CE_APP_NAME} --image \$IMAGE --port 3000 --min-scale 0 --max-scale 10
          fi
EOF
  ok "Created .github/workflows/deploy-ibm.yml (set GitHub secret: IBM_API_KEY)"
fi

### ───────────────────── OPTIONAL: NODE CHECKS (OFF BY DEFAULT) ──────────────
if [ "${RUN_NODE_CHECKS}" = "1" ]; then
  info "Running minimal Node checks (npm ci/build)…"
  npm ci || warn "npm ci had issues (may be fine in this environment)"
  npm run build --if-present || warn "build script not present or failed"
  ok "Node checks complete"
fi

### ───────────────────────── RESTORE README + SCRIPTS ────────────────────────
info "Writing restore instructions…"
cat > README-RESTORE.md <<EOF
# Restore from backup
1) Pick an archive from \`backups/${STAMP}/\` (or any timestamp under \`backups/\`).
2) Extract:
   \`\`\`bash
   tar -xzf backups/${STAMP}/spiral-essential-code-${STAMP}.tar.gz -C /tmp/spiral-restore
   \`\`\`
3) Install & run:
   \`\`\`bash
   cd /tmp/spiral-restore
   npm ci
   npm run build --if-present
   npm start
   \`\`\`
4) Configure environment via \`.env\` (use \`.env.example\` as a template).
EOF
ok "Created README-RESTORE.md"

mkdir -p scripts
cat > scripts/backup.sh <<'EOF'
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
EOF
chmod +x scripts/backup.sh
ok "Created scripts/backup.sh"

### ───────────────────── CLEAN CACHES (NON-DESTRUCTIVE) ─────────────────────
info "Clearing harmless caches to reduce noise…"
rm -rf .cache 2>/dev/null || true
rm -rf node_modules/.cache 2>/dev/null || true
ok "Cache cleanup complete"

### ───────────────────── WORKSPACE SNAPSHOT (AFTER) ─────────────────────────
info "Workspace stats (after):"
if has_cmd du; then du -sh . 2>/dev/null || true; fi
if has_cmd find; then
  TOTAL_FILES_AFTER=$(find . -type f | wc -l | tr -d ' ')
  echo "Total files: ${TOTAL_FILES_AFTER}"
fi

### ───────────────────────────── SUMMARY & NEXT ──────────────────────────────
echo
ok "All done."
echo "➤ New backup (tar/zip): ${BACKUP_DIR}"
[ -f "${TAR_PATH}" ] && echo "   - ${TAR_PATH}"
[ -f "${ZIP_PATH}" ] && echo "   - ${ZIP_PATH}"
echo "➤ Staged heavy dirs: ${STAGING_DIR}/drive (upload to Google Drive / COS, then you can remove)"
echo "➤ Older backups (if moved): ${STAGING_DIR}/archives"
[ "${SCAFFOLD_IBM}" = "1" ] && echo "➤ IBM deploy files scaffolded (set GitHub secret IBM_API_KEY, push to main to auto-deploy)"
echo
echo "Next:"
echo "  1) Download ${ZIP_PATH} for an easy local copy."
echo "  2) Upload ${STAGING_DIR}/drive/* and ${STAGING_DIR}/archives/* to external storage, then delete them to shrink the repl."
echo "  3) (If using IBM) Connect GitHub, create secret IBM_API_KEY, push to main — Code Engine will deploy."