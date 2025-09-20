#!/bin/bash
set -e

# --- CONFIGURATION ---
REGION="us-south"
RESOURCE_GROUP="Default"
APP_NAME="spiral-platform-clean"
NAMESPACE="ce--48df1-1zym7jto6fc1"

echo "🚀 SPIRAL Platform - IBM Cloud Cleanup & Redeploy"
echo "=================================================="

# --- LOGIN CHECK ---
echo "🔑 Checking IBM Cloud login..."
if ! ibmcloud target &>/dev/null; then
    echo "❌ Not logged in to IBM Cloud. Please run: ibmcloud login"
    exit 1
fi

echo "✅ IBM Cloud login verified"

# --- TARGET SETUP ---
echo "🎯 Setting target region and resource group..."
ibmcloud target -r "$REGION" -g "$RESOURCE_GROUP"

# --- CLEANUP CONTAINER REGISTRY ---
echo "🗑️ Cleaning up container registry..."
echo "Quota before cleanup:"
ibmcloud cr quota

echo "Listing current images..."
ibmcloud cr images || echo "No images found or permission issue"

echo "Removing all images to clear storage..."
for img in $(ibmcloud cr images --format '{{.Repository}}:{{.Tag}}' 2>/dev/null || true); do
    if [[ -n "$img" && "$img" != ":" ]]; then
        echo "Deleting image: $img"
        ibmcloud cr image-rm "$img" -f || true
    fi
done

echo "Storage after cleanup:"
ibmcloud cr quota

# --- CLEANUP BUILD RUNS ---
echo "🗑️ Cleaning old build runs..."
ibmcloud ce buildrun list 2>/dev/null | grep -E "(failed|succeeded)" | awk '{print $1}' | while read br; do
    if [[ -n "$br" && "$br" != "Name" ]]; then
        echo "Deleting build run: $br"
        ibmcloud ce buildrun delete --name "$br" -f || true
    fi
done

# --- CLEANUP OLD APPS ---
echo "🗑️ Cleaning old applications..."
for app in spiral-platform spiral-platform-v2; do
    if ibmcloud ce app get --name "$app" &>/dev/null; then
        echo "Deleting app: $app"
        ibmcloud ce app delete --name "$app" -f || true
    fi
done

# --- REDEPLOY ---
echo "🚀 Deploying clean SPIRAL platform..."
ibmcloud ce app create \
    --name "$APP_NAME" \
    --build-source . \
    --port 5000 \
    --env NODE_ENV=production \
    --cpu 1 \
    --memory 2G \
    --min-scale 1 \
    --max-scale 3

echo "✅ Deployment complete!"
echo "📋 Getting application info..."
ibmcloud ce app get --name "$APP_NAME"

echo "🌐 Application URL:"
ibmcloud ce app get --name "$APP_NAME" --output url