#!/usr/bin/env bash
set -euo pipefail

# === CONFIGURATION ===
APP_NAME="spiralshops-app"
BUILD_NAME="spiralshops-build"
PROJECT_NAME="spiralshops-proj"
GITHUB_TOKEN="$GITHUB_TOKEN"
REPO_URL="https://github.com/spiralshopsplatform/shopspiral.git"
PORT=5000
CPU="1"
MEMORY="2G"
MIN_SCALE=0
MAX_SCALE=10
REGION="us-south"

echo "🚀 Starting IBM Code Engine Source-to-Image Deployment..."

# === Step 1: Install IBM Cloud CLI & Code Engine plugin ===
if ! command -v ibmcloud &> /dev/null; then
  echo "🔌 Installing IBM Cloud CLI..."
  curl -fsSL https://clis.cloud.ibm.com/install/linux | sh
fi

echo "🔌 Installing IBM Cloud Code Engine plugin..."
ibmcloud plugin install code-engine -f || echo "ℹ️ Plugin already installed, continuing..."

# === Step 2: Login Check ===
echo "🔐 Checking IBM Cloud login status..."
if ! ibmcloud target &> /dev/null; then
    echo "❌ Not logged in to IBM Cloud"
    echo "Please run: ibmcloud login"
    echo "Then run this script again"
    exit 1
fi

# === Step 3: Set region ===
echo "🌍 Setting target region to $REGION..."
ibmcloud target -r "$REGION"

# === Step 4: Select or create CE project ===
echo "📦 Setting up Code Engine project..."
ibmcloud ce project select --name "$PROJECT_NAME" || ibmcloud ce project create --name "$PROJECT_NAME"

# === Step 5: Create GitHub access secret for private repository ===
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

# === Step 6: Create build (using buildpacks for Node.js/React auto-detection) ===
echo "🔨 Creating buildpack build configuration..."
ibmcloud ce build create \
  --name "$BUILD_NAME" \
  --source "$REPO_URL" \
  --strategy buildpacks \
  --size medium \
  $SECRET_FLAG || echo "ℹ️ Build already exists, continuing..."

# === Step 7: Submit build run to create image ===
echo "🏗️ Starting build run..."
BUILD_RUN_NAME="${BUILD_NAME}-run-$(date +%m%d-%H%M%S)"
ibmcloud ce buildrun submit \
  --name "$BUILD_RUN_NAME" \
  --build "$BUILD_NAME" \
  --wait

echo "📋 Build logs (last 50 lines):"
ibmcloud ce buildrun logs --name "$BUILD_RUN_NAME" --tail 50

# === Step 8: Deploy application ===
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

# === Step 9: Wait for deployment to stabilize ===
echo "⏳ Waiting for deployment to stabilize..."
sleep 45

# === Step 10: Get app URL and verify ===
echo "🔍 Getting application URL..."
APP_URL=$(ibmcloud ce app get --name "$APP_NAME" --output json | jq -r '.status.url')

if [ "$APP_URL" != "null" ] && [ -n "$APP_URL" ]; then
    echo "🌐 App URL: $APP_URL"
    
    # Test health endpoint
    if curl -s --max-time 30 "$APP_URL/api/check" | grep -q "healthy"; then
        echo "✅ Deployment successful! SPIRAL is live!"
        echo "🎉 Your SPIRAL platform is running at: $APP_URL"
        echo ""
        echo "📋 Next Steps:"
        echo "1. Update your GoDaddy DNS to point to: $APP_URL"
        echo "2. Configure SSL certificate for your custom domain"
        echo "3. Test all platform features"
    else
        echo "⚠️ Deployment completed but health check failed. App may still be starting..."
        echo "🌐 Check your app at: $APP_URL"
    fi
else
    echo "❌ Could not retrieve app URL. Check deployment status."
    ibmcloud ce app get --name "$APP_NAME"
    exit 1
fi