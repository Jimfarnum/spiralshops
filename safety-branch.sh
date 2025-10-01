#!/bin/sh
set -e
SAFE_BRANCH="pre-beta-review"
echo "===================================================="
echo "🛡️ SpiralShops — Safety Deployment Check (branch)"
echo "===================================================="
CURR_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURR_BRANCH" != "$SAFE_BRANCH" ]; then
  echo "❌ ERROR: You are on '$CURR_BRANCH', expected '$SAFE_BRANCH'"
  echo "➡️  Run: git checkout $SAFE_BRANCH && git pull"
  exit 1
fi
echo "✅ Verified: On safe branch $SAFE_BRANCH"
