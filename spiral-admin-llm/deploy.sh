#!/bin/bash

# SPIRAL Admin LLM Deployment Script
echo "🚀 Deploying SPIRAL Admin LLM with Clara Promptwright..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the spiral-admin-llm directory."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if environment variables are set
echo "🔧 Checking environment configuration..."
if [ -z "$OPENAI_API_KEY" ]; then
    echo "⚠️  Warning: OPENAI_API_KEY not set"
fi

if [ -z "$CLOUDANT_URL" ]; then
    echo "⚠️  Warning: CLOUDANT_URL not set (using fallback storage)"
fi

# Build if TypeScript
if [ -f "tsconfig.json" ]; then
    echo "🔨 Building TypeScript..."
    npm run build 2>/dev/null || echo "ℹ️  No build script found, running directly"
fi

# Start the server
echo "🌟 Starting SPIRAL Admin LLM server..."
echo "📡 Clara Promptwright will be available at:"
echo "   - Health: http://localhost:3000/health"
echo "   - About: http://localhost:3000/about"
echo "   - Insights: http://localhost:3000/admin/insights/:storeId"
echo ""

# Run the server
npm start