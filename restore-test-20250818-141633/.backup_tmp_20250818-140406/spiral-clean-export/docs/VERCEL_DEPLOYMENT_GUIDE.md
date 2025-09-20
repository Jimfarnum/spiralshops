# SPIRAL Vercel Deployment Guide

**Complete guide for deploying SPIRAL platform to Vercel with production configuration**

---

## 🚀 **Pre-Deployment Checklist**

### Required Accounts & Services
- [ ] Vercel account (vercel.com)
- [ ] GitHub repository with SPIRAL code
- [ ] Domain registered (spiralshops.com)
- [ ] Stripe account (test/live keys)
- [ ] IBM Cloudant database
- [ ] OpenAI API key
- [ ] Sentry account for monitoring

---

## 📋 **Step 1: Repository Preparation**

### 1.1 Verify Build Configuration
```bash
# Ensure these files are present and configured:
├── vercel.json          # Deployment configuration
├── package.json         # Dependencies and scripts
├── vite.config.ts       # Build configuration
├── .env.template        # Environment variables template
└── public/              # Static assets
    ├── sitemap.xml
    ├── robots.txt
    └── favicon.ico
```

### 1.2 Test Local Build
```bash
# Verify the build works locally
npm run build
npm run preview

# Check bundle size
du -sh dist/
# Should be ~845KB compressed
```

### 1.3 Push to GitHub
```bash
git add .
git commit -m "Production deployment ready"
git push origin main
```

---

## 🔧 **Step 2: Vercel Project Setup**

### 2.1 Create New Project
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import from GitHub: Select your SPIRAL repository
4. Configure project settings:
   - **Project Name**: spiral-platform
   - **Framework Preset**: Vite
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 2.2 Configure Build Settings
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm ci",
  "devCommand": "npm run dev"
}
```

---

## ⚙️ **Step 3: Environment Variables**

### 3.1 Production Environment Setup
In Vercel Dashboard → Settings → Environment Variables, add:

```bash
# Core Configuration
NODE_ENV=production
PORT=5000
INVESTOR_MODE=1
WATSONX_ENABLED=0
RATE_LIMIT_RPM=60
SHIPPING_MODE=mock

# Database Connections
DATABASE_URL=postgresql://username:password@hostname:5432/database_name
CLOUDANT_URL=https://your-service.cloudantnosqldb.appdomain.cloud
CLOUDANT_APIKEY=your-cloudant-apikey
CLOUDANT_DB=spiral
IBM_CLOUDANT_URL=https://your-service.cloudantnosqldb.appdomain.cloud
IBM_CLOUDANT_API_KEY=your-cloudant-apikey

# AI Services
OPENAI_API_KEY=sk-...

# Payment Processing (START IN TEST MODE)
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_MODE=test
LIVE_SAFETY_ON=0

# Security & Authentication
JWT_SECRET=your-random-jwt-secret-key-here
SESSION_SECRET=your-session-secret-key
DEMO_RESET_KEY=secure-demo-reset-key

# Admin Access
ADMIN_EMAIL=admin@spiralshops.com
ADMIN_PASS=secure-admin-password

# Monitoring & Analytics
SENTRY_DSN=https://...@sentry.io/...
PLAUSIBLE_DOMAIN=spiralshops.com

# Optional Services
SENDGRID_API_KEY=SG....
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----...
GOOGLE_CLOUD_CLIENT_EMAIL=service-account@project.iam.gserviceaccount.com
```

### 3.2 Environment Variable Security
- Use "Encrypted" for sensitive values
- Set appropriate scopes (Production, Preview, Development)
- Never commit actual keys to repository

---

## 🌐 **Step 4: Domain Configuration**

### 4.1 Add Custom Domain
1. Vercel Dashboard → Settings → Domains
2. Add domain: `spiralshops.com`
3. Add www subdomain: `www.spiralshops.com`
4. Configure DNS records at your registrar:

```dns
# A Record
@ → 76.76.19.61

# CNAME Record  
www → cname.vercel-dns.com

# Optional subdomains
api → cname.vercel-dns.com
admin → cname.vercel-dns.com
```

### 4.2 SSL Configuration
- Vercel automatically provisions SSL certificates
- Verify HTTPS redirect is working
- Check certificate validity at ssllabs.com

---

## 🚀 **Step 5: Deployment Process**

### 5.1 Initial Deployment
```bash
# Deploy via Vercel CLI (optional)
npm i -g vercel
vercel login
vercel --prod

# Or deploy via GitHub integration (recommended)
# Push to main branch triggers automatic deployment
```

### 5.2 Deployment Verification
```bash
# Check deployment status
curl https://spiralshops.com/api/health
# Expected: {"status":"healthy","message":"SPIRAL platform is running"}

# Verify key endpoints
curl https://spiralshops.com/
curl https://spiralshops.com/privacy
curl https://spiralshops.com/sitemap.xml
curl https://spiralshops.com/robots.txt
```

### 5.3 Performance Testing
```bash
# Test Core Web Vitals
# Use Lighthouse or GTmetrix
lighthouse https://spiralshops.com --view

# Verify bundle size
curl -I https://spiralshops.com/_next/static/chunks/main-*.js
# Should show compressed size ~845KB
```

---

## 📊 **Step 6: Monitoring & Analytics**

### 6.1 Vercel Analytics
- Enable in Vercel Dashboard → Analytics
- Monitor Core Web Vitals
- Track deployment frequency
- Review function execution logs

### 6.2 External Monitoring
```bash
# Sentry Error Tracking
# Verify errors are being captured
curl https://spiralshops.com/api/test-error

# Plausible Analytics
# Add tracking script validation
# Goal: Checkout Success, User Signup, etc.
```

---

## 🔧 **Step 7: Production Optimizations**

### 7.1 Serverless Function Configuration
```json
// vercel.json
{
  "functions": {
    "server/index.ts": {
      "maxDuration": 30
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/server/index.ts"
    }
  ]
}
```

### 7.2 Caching Strategy
```json
{
  "headers": [
    {
      "source": "/sitemap.xml",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=86400"
        }
      ]
    },
    {
      "source": "/robots.txt",
      "headers": [
        {
          "key": "Cache-Control", 
          "value": "public, max-age=86400"
        }
      ]
    }
  ]
}
```

---

## 🔄 **Step 8: Continuous Deployment**

### 8.1 GitHub Integration
- Automatic deployments on push to `main`
- Preview deployments for pull requests
- Branch deployments for staging

### 8.2 Deployment Pipeline
```yaml
# .github/workflows/deploy.yml (optional)
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 🛠️ **Step 9: Post-Deployment Verification**

### 9.1 Health Checks
```bash
# API Endpoints
curl https://spiralshops.com/api/health
curl https://spiralshops.com/api/check
curl https://spiralshops.com/api/products
curl https://spiralshops.com/api/stores

# Frontend Routes
curl https://spiralshops.com/
curl https://spiralshops.com/privacy
curl https://spiralshops.com/terms
curl https://spiralshops.com/investor
```

### 9.2 Database Connectivity
```bash
# Test database connections
curl https://spiralshops.com/api/stores
# Should return store data from Cloudant

# Test PostgreSQL session storage
curl -c cookies.txt https://spiralshops.com/api/auth/status
# Should handle sessions properly
```

### 9.3 Security Validation
```bash
# Test rate limiting
for i in {1..70}; do curl https://spiralshops.com/api/health; done
# Should return 429 after 60 requests

# Verify CSP headers
curl -I https://spiralshops.com/
# Should include Content-Security-Policy header

# Test admin protection
curl https://spiralshops.com/admin/
# Should redirect to login or return 401
```

---

## 🚨 **Troubleshooting**

### Common Issues & Solutions

#### Build Failures
```bash
# Check build logs in Vercel dashboard
# Common fixes:
- Verify all dependencies in package.json
- Check TypeScript errors
- Ensure environment variables are set
- Verify file paths are correct
```

#### Runtime Errors
```bash
# Check function logs in Vercel dashboard
# Common fixes:
- Verify database connection strings
- Check API key permissions
- Validate environment variable names
- Review serverless function timeouts
```

#### DNS Issues
```bash
# Verify DNS propagation
dig spiralshops.com
nslookup spiralshops.com

# Check Vercel domain configuration
# Ensure A record points to 76.76.19.61
```

### Rollback Procedure
```bash
# Via Vercel Dashboard
1. Go to Deployments tab
2. Find previous working deployment
3. Click "..." → Promote to Production

# Via CLI
vercel rollback [deployment-url]
```

---

## ✅ **Deployment Success Checklist**

- [ ] Build completes without errors
- [ ] All environment variables configured
- [ ] Custom domain configured with SSL
- [ ] Health endpoints responding
- [ ] Database connections working
- [ ] Authentication system functional
- [ ] Payment processing in TEST mode
- [ ] Legal pages accessible
- [ ] SEO files (sitemap.xml, robots.txt) served
- [ ] Analytics and monitoring active
- [ ] Rate limiting functional
- [ ] Admin routes protected
- [ ] Performance targets met (<2s load time)

---

## 📈 **Post-Launch Monitoring**

### Week 1: High Alert
- [ ] Monitor Vercel function logs daily
- [ ] Check Sentry error reports
- [ ] Verify uptime and performance
- [ ] Review analytics data
- [ ] Test critical user flows

### Ongoing Maintenance
- [ ] Weekly performance reviews
- [ ] Monthly dependency updates
- [ ] Quarterly security audits
- [ ] Monitor and optimize costs

---

**🎉 Deployment Complete: SPIRAL is now live on Vercel!**

**Live URL**: https://spiralshops.com  
**Status**: Production Ready  
**Next Steps**: Monitor performance and user feedback

---

*Last Updated: August 9, 2025*  
*Next Review: Post-deployment monitoring (7 days)*