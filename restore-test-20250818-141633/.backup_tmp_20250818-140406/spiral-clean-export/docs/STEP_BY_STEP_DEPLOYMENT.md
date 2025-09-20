# SPIRAL Step-by-Step Deployment Guide

**Goal**: Deploy SPIRAL to Vercel and configure spiralshops.com domain
**Time**: 15 minutes deployment + 24-48 hours for domain/SSL

---

## STEP 1: PREPARE YOUR GITHUB REPOSITORY

### 1.1 Push Latest Code
```bash
# In your local SPIRAL project directory
git add .
git commit -m "Production deployment ready"
git push origin main
```

### 1.2 Verify Repository
- Go to your GitHub repository
- Confirm all files are present including:
  - `package.json`
  - `vite.config.ts`
  - `vercel.json`
  - `dist/` folder (if you've built locally)

---

## STEP 2: CREATE VERCEL PROJECT

### 2.1 Sign Up/Login to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" or "Login"
3. Choose "Continue with GitHub" (recommended)
4. Authorize Vercel to access your repositories

### 2.2 Import Project
1. Click "New Project" (or "Add New..." → "Project")
2. Find your SPIRAL repository in the list
3. Click "Import" next to your repository

### 2.3 Configure Project Settings
**Framework Preset**: Should auto-detect as "Vite" ✅
**Root Directory**: `./` (leave as default) ✅
**Build Command**: `npm run build` ✅
**Output Directory**: `dist` ✅
**Install Command**: `npm ci` ✅

If any are wrong, click "Override" and fix them.

---

## STEP 3: ADD ENVIRONMENT VARIABLES

### 3.1 Access Environment Settings
1. Before clicking "Deploy", click "Environment Variables" section
2. Or skip deployment and go to Settings → Environment Variables after

### 3.2 Add Required Variables
Add these one by one (click "Add" after each):

```bash
# Core Configuration
NODE_ENV = production
INVESTOR_MODE = 1
WATSONX_ENABLED = 0
RATE_LIMIT_RPM = 60
SHIPPING_MODE = mock
PRIMARY_DOMAIN = spiralshops.com

# Database (Get from your IBM Cloudant service)
CLOUDANT_URL = https://your-service.cloudantnosqldb.appdomain.cloud
CLOUDANT_APIKEY = your-cloudant-apikey
CLOUDANT_DB = spiral

# Stripe (Test Mode - Safe)
STRIPE_MODE = test
STRIPE_SECRET_KEY = sk_test_51...
STRIPE_PUBLISHABLE_KEY = pk_test_51...
LIVE_SAFETY_ON = 0

# AI Services
OPENAI_API_KEY = sk-...

# Security
JWT_SECRET = your-random-secret-here-make-it-long
SESSION_SECRET = another-random-secret-here
DEMO_RESET_KEY = secure-demo-reset-key

# Admin Access
ADMIN_EMAIL = admin@spiralshops.com
ADMIN_PASS = your-secure-admin-password

# Optional Monitoring
SENTRY_DSN = https://your-sentry-dsn...
PLAUSIBLE_DOMAIN = spiralshops.com
```

**Important**: Replace `your-service`, `sk_test_51...`, `sk-...`, etc. with your actual values.

---

## STEP 4: DEPLOY TO VERCEL

### 4.1 Start Deployment
1. Click "Deploy" button
2. Wait for build process (2-5 minutes)
3. Watch the build logs for any errors

### 4.2 Verify Deployment Success
1. Look for "✅ Build Completed"
2. Click "Visit" or the provided URL
3. Test your temporary URL (something like `spiral-abc123.vercel.app`)

### 4.3 Test Key Routes
Visit these URLs on your temporary domain:
- `/` (homepage)
- `/api/health` (should return healthy status)
- `/investor` (investor dashboard)
- `/privacy` (legal page)

---

## STEP 5: CONFIGURE CUSTOM DOMAIN

### 5.1 Add Domain in Vercel
1. In Vercel dashboard, go to your project
2. Go to "Settings" → "Domains"
3. Click "Add" 
4. Enter `spiralshops.com`
5. Click "Add"
6. Also add `www.spiralshops.com` (optional but recommended)

### 5.2 Get DNS Instructions
Vercel will show you DNS records needed:
- **A Record**: `spiralshops.com` → `76.76.19.61`
- **CNAME**: `www.spiralshops.com` → `cname.vercel-dns.com`

---

## STEP 6: CONFIGURE DNS AT YOUR REGISTRAR

### 6.1 Access Your Domain Registrar
Go to where you bought spiralshops.com (GoDaddy, Namecheap, etc.)

### 6.2 Add DNS Records

**A Record**:
- Type: `A`
- Name: `@` (or blank, or `spiralshops.com`)
- Value: `76.76.19.61`
- TTL: `300` (or Auto)

**CNAME Record** (for www):
- Type: `CNAME`
- Name: `www`
- Value: `cname.vercel-dns.com`
- TTL: `300` (or Auto)

### 6.3 Save DNS Changes
Click "Save" or "Apply Changes" at your registrar.

---

## STEP 7: WAIT FOR PROPAGATION

### 7.1 DNS Propagation (2-48 hours)
- DNS changes take time to spread globally
- Usually 2-8 hours, but can take up to 48 hours
- You can check status at [whatsmydns.net](https://whatsmydns.net)

### 7.2 SSL Certificate (Automatic)
- Vercel automatically creates SSL certificates
- Happens after DNS is working
- No action needed from you

---

## STEP 8: VERIFY LIVE DOMAIN

### 8.1 Check Domain Status
1. In Vercel dashboard → Settings → Domains
2. Look for green checkmarks next to your domains
3. Status should show "Valid Configuration"

### 8.2 Test Live Site
Once DNS propagates, test:
- `https://spiralshops.com` (should work without SSL errors)
- `http://spiralshops.com` (should redirect to https)
- All your key routes (`/investor`, `/api/health`, etc.)

---

## TROUBLESHOOTING COMMON ISSUES

### Build Fails
**Check**: Environment variables are correctly set
**Fix**: Go to Settings → Environment Variables and verify all required variables

### DNS Not Working
**Check**: DNS records at your registrar
**Fix**: Verify A record points to `76.76.19.61` exactly

### SSL Certificate Issues
**Wait**: SSL certificates take time after DNS works
**Check**: Try accessing in 24 hours

### 500 Internal Server Error
**Check**: Server logs in Vercel dashboard → Functions tab
**Fix**: Usually missing environment variables

---

## VERIFICATION CHECKLIST

### Immediate (After Deployment)
- [ ] Temporary Vercel URL works
- [ ] Homepage loads correctly
- [ ] `/api/health` returns healthy status
- [ ] All environment variables configured
- [ ] DNS records added at registrar

### Within 24-48 Hours
- [ ] `https://spiralshops.com` accessible
- [ ] No SSL certificate warnings
- [ ] All routes working (`/investor`, `/demo/*`)
- [ ] API endpoints responding
- [ ] Admin functionality requires login

---

## SUCCESS INDICATORS

### You'll Know It's Working When:
1. **Immediate**: Temporary Vercel URL shows your SPIRAL platform
2. **2-8 hours**: spiralshops.com starts resolving to Vercel
3. **24-48 hours**: HTTPS works without any browser warnings
4. **Complete**: All investor demo links work perfectly

### Final Test Commands:
```bash
# Check if DNS is working
dig spiralshops.com

# Test HTTPS
curl -I https://spiralshops.com

# Verify API
curl https://spiralshops.com/api/health
```

---

## WHAT TO EXPECT TIMELINE

| Time | Status |
|------|--------|
| Now | Deploy to Vercel (15 minutes) |
| Now | Temporary URL working immediately |
| 2-8 hours | DNS starts working |
| 24-48 hours | SSL certificate active |
| Complete | spiralshops.com fully operational |

---

**Next Step**: Follow Step 1 to push your code to GitHub, then Step 2 to create your Vercel project.

Need help with any specific step? I can guide you through each one in detail.

---

*Last Updated: August 9, 2025*  
*Estimated Total Time: 15 minutes active work + 24-48 hours waiting*