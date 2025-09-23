#!/bin/bash
# Check Spiralshops Vercel deployment with jq parsing

DEPLOY_INFO=$(vercel inspect spiralshops --prod --json 2>/dev/null)

URL=$(echo $DEPLOY_INFO | jq -r '.url')
STATE=$(echo $DEPLOY_INFO | jq -r '.readyState')
DEPLOY_UID=$(echo $DEPLOY_INFO | jq -r '.uid')
COMMIT=$(echo $DEPLOY_INFO | jq -r '.meta.githubCommitSha // ""')

echo "🌍 Deployment: https://$URL"
echo "🔑 Commit: $COMMIT"
echo "📊 State: $STATE"

if [ "$STATE" = "READY" ]; then
  echo "✅ Deployment is live → https://spiralshops.com"
elif [ "$STATE" = "ERROR" ]; then
  echo "❌ Deployment FAILED"
  echo "🔎 Check logs at: https://vercel.com/spiral-s-projects/spiralshops/$DEPLOY_UID"
else
  echo "⏳ Deployment still in progress..."
  vercel logs https://$URL
fi
