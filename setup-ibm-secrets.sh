#!/bin/bash

# SPIRAL Platform - IBM Code Engine Secrets Setup
# This script helps set up secrets in IBM Code Engine for production deployment

PROJECT_NAME="spiral-platform"

echo "🔐 Setting up secrets for SPIRAL Platform in IBM Code Engine..."
echo "Project: $PROJECT_NAME"

# Ensure we're targeting the correct project
ibmcloud ce project select --name $PROJECT_NAME

echo ""
echo "Setting up production secrets..."
echo "You'll need to provide the following secret values:"

# Create secrets for sensitive environment variables
echo ""
echo "1. Database Configuration:"
read -s -p "DATABASE_URL: " DATABASE_URL
ibmcloud ce secret create --name database-config --from-literal DATABASE_URL="$DATABASE_URL"

echo ""
echo "2. OpenAI Configuration:"
read -s -p "OPENAI_API_KEY: " OPENAI_API_KEY
ibmcloud ce secret create --name openai-config --from-literal OPENAI_API_KEY="$OPENAI_API_KEY"

echo ""
echo "3. Stripe Configuration:"
read -s -p "STRIPE_SECRET_KEY: " STRIPE_SECRET_KEY
read -p "STRIPE_PUBLISHABLE_KEY: " STRIPE_PUBLISHABLE_KEY
ibmcloud ce secret create --name stripe-config \
  --from-literal STRIPE_SECRET_KEY="$STRIPE_SECRET_KEY" \
  --from-literal STRIPE_PUBLISHABLE_KEY="$STRIPE_PUBLISHABLE_KEY"

echo ""
echo "4. IBM Watson Configuration:"
read -s -p "WATSON_API_KEY: " WATSON_API_KEY
read -p "WATSON_ASSISTANT_ID: " WATSON_ASSISTANT_ID
ibmcloud ce secret create --name watson-config \
  --from-literal WATSON_API_KEY="$WATSON_API_KEY" \
  --from-literal WATSON_ASSISTANT_ID="$WATSON_ASSISTANT_ID"

echo ""
echo "5. IBM Cloudant Configuration:"
read -s -p "CLOUDANT_URL: " CLOUDANT_URL
read -s -p "CLOUDANT_APIKEY: " CLOUDANT_APIKEY
ibmcloud ce secret create --name cloudant-config \
  --from-literal CLOUDANT_URL="$CLOUDANT_URL" \
  --from-literal CLOUDANT_APIKEY="$CLOUDANT_APIKEY"

echo ""
echo "✅ All secrets created successfully!"
echo ""
echo "Now update your application to use these secrets:"
echo "ibmcloud ce app update --name $PROJECT_NAME \\"
echo "  --env-from-secret database-config \\"
echo "  --env-from-secret openai-config \\"
echo "  --env-from-secret stripe-config \\"
echo "  --env-from-secret watson-config \\"
echo "  --env-from-secret cloudant-config"
echo ""