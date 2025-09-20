#!/usr/bin/env bash
set -e
echo "🤖 Agent A (Replit) — Daily Ops"
npm run agent:legal || true
npm run agent:seo || true
npm run agent:api || true
npm run agent:audits || true
npm run agent:backups || true
echo "Done."
