#!/bin/bash
# Check Spiralshops Vercel deployment

# Get latest deployment info using vercel inspect on production
DEPLOY_INFO=$(vercel inspect spiralshops --prod --json 2>/dev/null)

URL=$(echo $DEPLOY_INFO | grep -o '"url":"[^"]*' | cut -d'"' -f4)
STATE=$(echo $DEPLOY_INFO | grep -o '"readyState":"[^"]*' | cut -d'"' -f4)
DEPLOY_UID=$(echo $DEPLOY_INFO | grep -o '"uid":"[^"]*' | cut -d'"' -f4)
COMMIT=$(echo $DEPLOY_INFO | grep -o '"commit":"[^"]*' | cut -d'"' -f4)

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
