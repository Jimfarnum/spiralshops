#!/bin/bash
# SPIRAL Platform Clean Export Script
# Creates a minimal export without large files for fresh workspace setup

set -e

echo "🚀 Creating SPIRAL Platform Clean Export..."

# Create export directory
mkdir -p spiral-clean-export
cd spiral-clean-export

# Copy essential source code
echo "📁 Copying core application files..."
cp -r ../src . 2>/dev/null || true
cp -r ../client . 2>/dev/null || true
cp -r ../server . 2>/dev/null || true
cp -r ../shared . 2>/dev/null || true
cp -r ../mobile . 2>/dev/null || true

# Copy configuration files
echo "⚙️ Copying configuration..."
cp ../package.json . 2>/dev/null || true
cp ../package-lock.json . 2>/dev/null || true
cp ../vite.config.ts . 2>/dev/null || true
cp ../tsconfig.json . 2>/dev/null || true
cp ../tailwind.config.ts . 2>/dev/null || true
cp ../drizzle.config.ts . 2>/dev/null || true
cp ../replit.md . 2>/dev/null || true

# Copy essential data and utilities
cp -r ../data . 2>/dev/null || true
cp -r ../utils . 2>/dev/null || true
cp -r ../docs . 2>/dev/null || true

# Copy environment template (without secrets)
cp ../.env.example . 2>/dev/null || true

# Copy essential scripts (not backup scripts)
mkdir -p scripts
cp ../scripts/setupSpiralCart.js scripts/ 2>/dev/null || true

# Create setup instructions
cat > SETUP_INSTRUCTIONS.md << 'EOF'
# SPIRAL Platform Fresh Setup Instructions

## Quick Setup (5 minutes)
1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment:**
   - Copy `.env.example` to `.env`
   - Add your API keys (OPENAI_API_KEY, STRIPE keys, etc.)

3. **Setup Database:**
   ```bash
   npm run db:push
   ```

4. **Start Platform:**
   ```bash
   npm run dev
   ```

## What's Included
✅ All SPIRAL source code (18 AI agents)
✅ Mobile app (iOS & Android)
✅ Complete configuration files
✅ Sample data and utilities
✅ Documentation

## What's Excluded (to keep workspace small)
❌ node_modules (will be recreated)
❌ .git history (fresh git init needed)
❌ Large assets and backups
❌ Old documentation files

## Features Ready
- 🧠 SOAP G Central Brain (7 AI agents)
- 🤖 AI Ops System (11 agents)
- 📱 Cross-platform mobile app
- 💳 Stripe payment processing
- 🏪 Multi-retailer marketplace
- 📍 Location-based services
- 🔍 AI-powered search

Your SPIRAL platform will be fully operational in the new workspace!
EOF

echo "✅ Clean export created in spiral-clean-export/"
echo "📊 Export size:" 
du -sh . 2>/dev/null || echo "Size calculation complete"

cd ..
echo "🎯 Ready for fresh workspace setup!"