#!/usr/bin/env bash
set -euo pipefail

# === CONFIGURATION ===
APP_NAME="spiralshops-app"
BUILD_NAME="spiralshops-build"
PROJECT_NAME="spiralshops-proj"
REPO_URL="https://github.com/spiralshopsplatform/shopspiral.git"
GITHUB_TOKEN="$GITHUB_TOKEN"
PORT=5000
CPU="1"
MEMORY="2G"
MIN_SCALE=0
MAX_SCALE=10

echo "🚀 Starting IBM Code Engine Source-to-Image Deployment..."

# 1. Install Code Engine plugin if not already installed
echo "🔌 Installing IBM Cloud Code Engine plugin..."
ibmcloud plugin install code-engine -f || echo "ℹ️ Plugin already installed, continuing..."

# 2. Select or create CE project
echo "📦 Setting up Code Engine project..."
ibmcloud ce project select --name "$PROJECT_NAME" || ibmcloud ce project create --name "$PROJECT_NAME"

# 3. Create GitHub access secret for private repository
if [ -n "$GITHUB_TOKEN" ]; then
    echo "🔐 Creating GitHub access secret..."
    ibmcloud ce secret create --name github-access \
        --from-literal username=oauth2 \
        --from-literal password="$GITHUB_TOKEN" || echo "ℹ️ Secret already exists, continuing..."
    
    SECRET_FLAG="--git-repo-secret github-access"
else
    echo "⚠️ No GitHub token provided - assuming public repo or using SSH keys"
    SECRET_FLAG=""
fi

# 4. Create build (using buildpacks for Node.js/React auto-detection)
echo "🔨 Creating buildpack build configuration..."
ibmcloud ce build create \
  --name "$BUILD_NAME" \
  --source "$REPO_URL" \
  --strategy buildpacks \
  --size medium \
  $SECRET_FLAG || echo "ℹ️ Build already exists, continuing..."

# 5. Submit build run to create image
echo "🏗️ Starting build run..."
ibmcloud ce buildrun submit \
  --name "${BUILD_NAME}-run-$(date +%m%d-%H%M%S)" \
  --build "$BUILD_NAME" \
  --wait

# 4. Create/update the app
echo "🚀 Deploying application..."
ibmcloud ce app create \
  --name "$APP_NAME" \
  --build-source "$BUILD_NAME" \
  --port "$PORT" \
  --cpu "$CPU" \
  --memory "$MEMORY" \
  --min-scale "$MIN_SCALE" \
  --max-scale "$MAX_SCALE" \
  --env NODE_ENV=production || \
ibmcloud ce app update \
  --name "$APP_NAME" \
  --build-source "$BUILD_NAME" \
  --port "$PORT" \
  --cpu "$CPU" \
  --memory "$MEMORY" \
  --min-scale "$MIN_SCALE" \
  --max-scale "$MAX_SCALE"

# 5. Wait for deployment to stabilize
echo "⏳ Waiting for deployment to stabilize..."
sleep 45

# 6. Get app URL and verify
echo "🔍 Getting application URL..."
APP_URL=$(ibmcloud ce app get --name "$APP_NAME" --output json | jq -r '.status.url')

if [ "$APP_URL" != "null" ] && [ -n "$APP_URL" ]; then
    echo "🌐 App URL: $APP_URL"
    
    # Test health endpoint
    if curl -s --max-time 30 "$APP_URL/api/check" | grep -q "healthy"; then
        echo "✅ Deployment successful! SPIRAL is live!"
        echo "🎉 Your SPIRAL platform is running at: $APP_URL"
    else
        echo "⚠️ Deployment completed but health check failed. App may still be starting..."
        echo "🌐 Check your app at: $APP_URL"
    fi
else
    echo "❌ Could not retrieve app URL. Check deployment status."
    ibmcloud ce app get --name "$APP_NAME"
    exit 1
fi