# SPIRAL Platform - Complete Setup Instructions
**Downloadable Guide for Full Platform Installation**

## Quick Start Guide

### 1. Prerequisites Check
Before beginning, ensure you have:
- **Node.js 18 or higher** (`node --version`)
- **npm package manager** (`npm --version`)
- **PostgreSQL database** (local or cloud)
- **Git** for version control
- **Code editor** (VS Code recommended)

### 2. Download and Initial Setup
```bash
# Download the platform files
# Extract ZIP file or clone repository
cd spiral-platform

# Install all dependencies (80+ packages)
npm install

# This installs frontend, backend, and development tools
```

### 3. Database Configuration
```bash
# Option A: Local PostgreSQL
createdb spiral_platform
export DATABASE_URL="postgresql://username:password@localhost:5432/spiral_platform"

# Option B: Use provided Neon Database URL
# Set DATABASE_URL in .env file
```

### 4. Environment Variables Setup
Create `.env` file in root directory:
```env
# Core Database (Required)
DATABASE_URL=postgresql://user:pass@host:port/db
PGUSER=postgres
PGPASSWORD=your_password
PGDATABASE=spiral_platform
PGHOST=localhost
PGPORT=5432

# AI Services (Required for full functionality)
OPENAI_API_KEY=sk-your-openai-api-key

# Optional Services (platform works without these)
GOOGLE_CLOUD_VISION_KEY=your-google-cloud-key
STRIPE_SECRET_KEY=sk_test_your-stripe-key
TWILIO_ACCOUNT_SID=your-twilio-sid
```

### 5. Database Schema Setup
```bash
# Push database schema (creates all tables)
npm run db:push

# Verify database connection
npm run db:studio
# Opens database browser interface
```

### 6. Start Development Server
```bash
# Start both frontend and backend
npm run dev

# Platform will be available at:
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
```

## Detailed Installation Steps

### Step 1: System Requirements
**Minimum Requirements:**
- RAM: 4GB (8GB recommended)
- Storage: 2GB free space
- Internet: Broadband connection
- OS: Windows 10+, macOS 10.15+, Linux Ubuntu 18+

**Development Tools:**
```bash
# Check Node.js version (must be 18+)
node --version

# Check npm version
npm --version

# Install globally if needed
# Windows: Download from nodejs.org
# macOS: brew install node
# Linux: sudo apt install nodejs npm
```

### Step 2: Download Methods

#### Method A: Git Clone (Recommended)
```bash
git clone [repository-url] spiral-platform
cd spiral-platform
```

#### Method B: Direct Download
1. Download ZIP file from repository
2. Extract to desired location
3. Navigate to extracted folder

#### Method C: Replit Fork
1. Visit Replit project page
2. Click "Fork" button
3. Skip to Step 6 (environment pre-configured)

### Step 3: Dependency Installation
```bash
# Navigate to project directory
cd spiral-platform

# Install all packages (takes 2-5 minutes)
npm install

# Expected output: "added XXX packages"
# If errors occur, try: npm cache clean --force
```

### Step 4: Database Setup Options

#### Option A: Local PostgreSQL
```bash
# Install PostgreSQL
# Windows: Download from postgresql.org
# macOS: brew install postgresql
# Linux: sudo apt install postgresql

# Create database
sudo -u postgres createdb spiral_platform

# Set connection string
export DATABASE_URL="postgresql://postgres:password@localhost:5432/spiral_platform"
```

#### Option B: Cloud Database (Neon/Supabase)
```bash
# Sign up for free database at neon.tech
# Copy connection string
# Add to .env file
```

### Step 5: Environment Configuration
Create `.env` file with required variables:

```env
# ===================
# REQUIRED SETTINGS
# ===================

# Database Connection (MUST HAVE)
DATABASE_URL=postgresql://user:password@host:port/database

# AI Functionality (MUST HAVE for full features)
OPENAI_API_KEY=sk-your-openai-key-here

# ===================
# OPTIONAL SETTINGS
# ===================

# Image Recognition (falls back to mock if not provided)
GOOGLE_CLOUD_VISION_KEY=your-google-cloud-key

# Payment Processing (falls back to mock if not provided)
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key

# Communication Services (optional)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
SENDGRID_API_KEY=your-sendgrid-api-key

# Cloud Storage (optional)
IBM_CLOUDANT_URL=your-cloudant-url
IBM_CLOUDANT_API_KEY=your-cloudant-api-key
```

### Step 6: Database Schema Initialization
```bash
# Push schema to database (creates all tables)
npm run db:push

# Expected output: "✅ Database schema updated"

# Verify tables were created
npm run db:studio
# Opens browser interface to view database
```

### Step 7: First Startup
```bash
# Start development servers
npm run dev

# Expected output:
# ✅ Frontend server: http://localhost:3000
# ✅ Backend server: http://localhost:5000
# ✅ Database connected
# ✅ AI services initialized
```

## Verification Steps

### 1. Frontend Verification
Visit `http://localhost:3000`:
- Page loads without errors
- Navigation menu appears
- "SPIRAL" logo visible
- No console errors in browser

### 2. Backend Verification
Visit `http://localhost:5000/api/check`:
```json
{
  "status": "healthy",
  "message": "SPIRAL platform is running",
  "services": {
    "database": "connected",
    "authentication": "active"
  }
}
```

### 3. Database Verification
```bash
# Open database studio
npm run db:studio

# Verify tables exist:
# - users, retailers, products
# - orders, loyalty_points
# - stores, categories
```

### 4. AI Services Verification
Visit `http://localhost:3000/ai-retailer-signup`:
- AI chat interface loads
- Can interact with onboarding agent
- No OpenAI errors in console

## Common Issues and Solutions

### Issue 1: Node.js Version Error
```bash
# Error: "node version not supported"
# Solution: Update Node.js
nvm install 18
nvm use 18
```

### Issue 2: Database Connection Failed
```bash
# Error: "database connection refused"
# Solution: Check PostgreSQL is running
sudo service postgresql start  # Linux
brew services start postgresql  # macOS
```

### Issue 3: Port Already in Use
```bash
# Error: "EADDRINUSE port 5000"
# Solution: Kill existing processes
lsof -ti:5000 | xargs kill -9
npm run dev
```

### Issue 4: Missing Environment Variables
```bash
# Error: "OpenAI API key not found"
# Solution: Add to .env file
echo "OPENAI_API_KEY=your-key-here" >> .env
```

### Issue 5: Package Installation Fails
```bash
# Error: "npm install failed"
# Solution: Clear cache and retry
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## Production Deployment

### Vercel Deployment (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod

# Add environment variables in Vercel dashboard
```

### Replit Deployment
1. Fork project in Replit
2. Add environment variables in Secrets tab
3. Click Deploy button
4. Choose deployment type (Autoscale recommended)

### Manual Server Deployment
```bash
# Build for production
npm run build

# Set production environment
export NODE_ENV=production

# Start production server
npm start
```

## Development Workflow

### Daily Development
```bash
# Start development
npm run dev

# Make code changes
# Hot reload automatically updates browser

# Run tests
npm test

# Check types
npm run type-check

# Lint code
npm run lint
```

### Database Changes
```bash
# After modifying shared/schema.ts
npm run db:push

# View database
npm run db:studio
```

### Adding New Features
1. Create component in `client/src/components/`
2. Add page in `client/src/pages/`
3. Create API endpoint in `server/api/`
4. Update routing in `client/src/App.tsx`
5. Test functionality

## Support Resources

### Documentation Files
- `SPIRAL_PLATFORM_OVERVIEW.md` - Complete platform description
- `SPIRAL_OPERATIONS_MANUAL.md` - Daily operations guide
- `SPIRAL_COMPLETE_CODE_BACKUP.md` - Code architecture overview

### Getting Help
1. Check console logs for specific errors
2. Review documentation files
3. Verify environment variables are set correctly
4. Ensure all prerequisites are installed
5. Try restarting development server

### Development Commands Reference
```bash
npm run dev          # Start development servers
npm run build        # Build for production
npm run start        # Start production server
npm run test         # Run test suite
npm run lint         # Check code quality
npm run type-check   # TypeScript verification
npm run db:push      # Update database schema
npm run db:studio    # Open database browser
```

---
**Setup Guide Version**: 1.0  
**Platform Version**: Production-Ready  
**Last Updated**: August 7, 2025  
**Estimated Setup Time**: 15-30 minutes