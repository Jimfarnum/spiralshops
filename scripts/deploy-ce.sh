#!/bin/bash

# SPIRAL Platform - IBM Code Engine Deployment Script
# Usage: ./scripts/deploy-ce.sh <version>

set -e

VERSION=${1:-latest}
PROJECT_NAME="spiral-platform"
REGISTRY_NAMESPACE="spiral-registry"
IMAGE_NAME="spiral-platform"
TAG="v${VERSION}"

echo "🚀 Starting SPIRAL Platform deployment to IBM Code Engine..."
echo "Version: $VERSION"
echo "Tag: $TAG"
echo "Project: $PROJECT_NAME"

# Check if IBM CLI is installed
if ! command -v ibmcloud &> /dev/null; then
    echo "❌ IBM Cloud CLI not found. Please install it first:"
    echo "https://cloud.ibm.com/docs/cli"
    exit 1
fi

# Check if user is logged in
if ! ibmcloud target &> /dev/null; then
    echo "❌ Not logged in to IBM Cloud. Please run: ibmcloud login"
    exit 1
fi

# Install Code Engine plugin if not already installed
if ! ibmcloud plugin show code-engine &> /dev/null; then
    echo "📦 Installing IBM Code Engine plugin..."
    ibmcloud plugin install code-engine
fi

# Set target region
echo "🌍 Setting target region..."
ibmcloud target -r us-south

# Build the application
echo "🏗️  Building SPIRAL platform..."
npm run build

if [ ! -f "dist/index.js" ]; then
    echo "❌ Build failed - dist/index.js not found"
    exit 1
fi

echo "✅ Build completed successfully"

# Create or update Code Engine project
echo "📋 Setting up Code Engine project..."
if ! ibmcloud ce project get --name $PROJECT_NAME &> /dev/null; then
    echo "Creating new project: $PROJECT_NAME"
    ibmcloud ce project create --name $PROJECT_NAME
else
    echo "Using existing project: $PROJECT_NAME"
    ibmcloud ce project select --name $PROJECT_NAME
fi

# Skip container build for now - use direct deployment
echo "🚀 Skipping container build - deploying directly from local source..."

# Deploy or update application
echo "🚀 Deploying application version $VERSION..."
if ibmcloud ce app get --name $PROJECT_NAME &> /dev/null; then
    echo "Updating existing application to version $VERSION..."
    ibmcloud ce app update \
        --name $PROJECT_NAME \
        --source ./deploy \
        --port 5000 \
        --min-scale 0 \
        --max-scale 10 \
        --cpu 1 \
        --memory 2G \
        --env NODE_ENV=production \
        --env SPIRAL_VERSION=${VERSION} \
        --env SPIRAL_ENVIRONMENT=production
else
    echo "Creating new application with version $VERSION..."
    ibmcloud ce app create \
        --name $PROJECT_NAME \
        --source ./deploy \
        --port 5000 \
        --min-scale 0 \
        --max-scale 10 \
        --cpu 1 \
        --memory 2G \
        --env NODE_ENV=production \
        --env SPIRAL_VERSION=${VERSION} \
        --env SPIRAL_ENVIRONMENT=production
fi

# Get application URL
echo "🌐 Getting application URL..."
APP_URL=$(ibmcloud ce app get --name $PROJECT_NAME --output json | grep -o '"url":"[^"]*"' | cut -d'"' -f4)

echo ""
echo "✅ Deployment completed successfully!"
echo "🔗 Application URL: $APP_URL"
echo "📊 Monitor at: https://cloud.ibm.com/codeengine/projects"
echo "🏷️  Version deployed: $VERSION"
echo ""
echo "🧪 Testing deployment..."
curl -f "$APP_URL/healthz" && echo "✅ Health check passed!" || echo "❌ Health check failed"

echo ""
echo "🎉 SPIRAL Platform v$VERSION is now running on IBM Code Engine!"