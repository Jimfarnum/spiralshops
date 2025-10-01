#!/bin/sh
set -e

SAFE_TAG="pre-beta-stable"

echo "===================================================="
echo "🛡️  SpiralShops — Safety Deployment Check"
echo "===================================================="

CURR_COMMIT=$(git rev-parse HEAD)
SAFE_COMMIT=$(git rev-parse $SAFE_TAG)

if [ "$CURR_COMMIT" != "$SAFE_COMMIT" ]; then
  echo "❌ ERROR: You are not on the $SAFE_TAG tag!"
  echo "   Current: $CURR_COMMIT"
  echo "   Expected: $SAFE_COMMIT"
  echo
  echo "➡️  Run: git checkout $SAFE_TAG && git pull origin $SAFE_TAG"
  exit 1
fi

echo "✅ Verified: On safe tag $SAFE_TAG"
