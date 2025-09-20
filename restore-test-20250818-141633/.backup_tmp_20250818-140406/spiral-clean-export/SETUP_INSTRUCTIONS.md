# SPIRAL Platform Fresh Setup Instructions

## Option 1: Automated Setup (RECOMMENDED)
**Copy and paste the entire contents of `BOOTSTRAP.sh` into your new Repl's Shell and press Enter.**

The bootstrap script will automatically:
- Move files into place
- Create environment configuration
- Install dependencies
- Setup database
- Start server with health checks
- Create safety backups

## Option 2: Manual Setup (5 minutes)
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
