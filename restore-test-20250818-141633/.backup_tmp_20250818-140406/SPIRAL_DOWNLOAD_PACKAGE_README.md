# SPIRAL Platform Download Package

## 📦 Backup Files Created

### Essential Code Archive (DOWNLOAD THIS FIRST)
**File:** `spiral-essential-code-YYYYMMDD-HHMMSS.tar.gz`
**Contents:**
- Complete source code (server/, client/, mobile/)
- Database schemas and configurations
- iOS & Android mobile app source
- Deployment scripts and automation
- Package.json and dependencies list
- Project documentation (replit.md)

**Size:** ~9-15MB (Compressed)
**Rebuild:** Run `npm install` after extraction

### Documentation & Assets Archive
**File:** `spiral-documentation-assets-YYYYMMDD-HHMMSS.tar.gz`
**Contents:**
- Screenshots and user documentation (attached_assets/)
- Security audit reports (security-reports/)
- Project documentation files (docs/)
- Historical analysis data

**Size:** ~200-400MB
**Purpose:** Reference materials and project history

## 🔄 How to Restore Your SPIRAL Platform

### 1. Extract Essential Code
```bash
# Create new directory
mkdir spiral-platform
cd spiral-platform

# Extract essential code
tar -xzf spiral-essential-code-YYYYMMDD-HHMMSS.tar.gz

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys
```

### 2. Database Setup
```bash
# Push database schema
npm run db:push

# Seed with initial data (optional)
npm run db:seed
```

### 3. Start Development Server
```bash
# Start the application
npm run dev
# Server runs on http://localhost:5000
```

### 4. Mobile App Setup (Optional)
```bash
# iOS (requires macOS + Xcode)
cd mobile/ios
./launch-testflight.sh

# Android (requires Android Studio)
cd mobile/android
./gradlew assembleRelease
```

## 📁 Files You Can Store Externally

### High Priority for External Storage (Reduces 60% of project size)

**Move to Google Drive/Dropbox:**
- `attached_assets/` - Screenshots and documentation (~200MB)
- `security-reports/` - Security audit files (~50MB)
- `docs/` - Extended documentation (~30MB)
- `backups/` - Previous backup archives (~100-500MB)

**Move to GitHub Repository:**
- Complete source code with version control
- Collaboration and issue tracking
- Automated CI/CD pipeline setup
- Professional code management

**Move to AWS S3/Cloud Storage:**
- `uploads/` - User uploaded content
- `agents/techwatch/reports/` - Competitive analysis screenshots
- `agents/funnels/out/` - Analysis output files
- Production static assets

### Keep in Replit (Development Critical)
- Source code directories (server/, client/, mobile/)
- Configuration files (package.json, drizzle.config.ts)
- Environment variables (.env)
- Active development documentation (replit.md)

## 🚀 External Storage Setup Guide

### GitHub Repository (Recommended First Step)
```bash
# Initialize git repository
git init
git add .
git commit -m "Initial SPIRAL platform backup"

# Push to GitHub (create repository first)
git remote add origin https://github.com/yourusername/spiral-platform.git
git push -u origin main
```

### Google Drive Integration
1. Upload `spiral-documentation-assets-*.tar.gz` to Google Drive
2. Share folder with team members
3. Update documentation links to Google Drive URLs
4. Remove local copies from Replit

### AWS S3 Setup (Production Assets)
```bash
# Install AWS CLI
npm install -g aws-cli

# Configure AWS credentials
aws configure

# Create S3 bucket
aws s3 mb s3://spiral-platform-assets

# Upload assets
aws s3 sync uploads/ s3://spiral-platform-assets/uploads/
```

## 💡 Optimization Benefits

### Before External Storage
- **Project Size:** 1.2GB
- **File Count:** 34,483+ files
- **Checkpoint Issues:** Frequent timeouts
- **Loading Speed:** Slow due to large file count

### After External Storage  
- **Project Size:** ~400-500MB (60% reduction)
- **File Count:** ~5,000-8,000 files (75% reduction)
- **Checkpoint Speed:** Significantly faster
- **Development Speed:** Improved load times

## 🔧 Environment Variables Required

Create `.env` file with these variables:
```bash
# Database
DATABASE_URL=your_postgresql_url

# AI Services
OPENAI_API_KEY=your_openai_key

# Payment Processing  
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_PUBLISHABLE_KEY=your_stripe_public

# Admin Access
ADMIN_TOKEN=your_admin_token
ADMIN_SESSION_SECRET=your_session_secret

# Optional Services
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
```

## 📞 Support & Next Steps

### If You Need Help
1. Check `DEPLOYMENT_CHECKLIST.md` for step-by-step guides
2. Review `SPIRAL_BACKUP_STRATEGY.md` for detailed storage plans
3. Contact support with specific error messages

### Recommended Actions
1. **Immediate:** Download essential code archive
2. **This Week:** Set up GitHub repository for version control
3. **This Month:** Migrate large assets to cloud storage
4. **Ongoing:** Maintain lean Replit environment for development

Your SPIRAL platform is fully functional and ready for deployment. The backup ensures project integrity while external storage optimization will improve performance and reduce checkpoint issues.