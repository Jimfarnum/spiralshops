# SPIRAL GitLab Deployment Guide (GitHub Alternative)

**Goal**: Deploy SPIRAL using GitLab instead of GitHub
**Security**: EU-based servers, GDPR compliant, more secure than GitHub
**Time**: 20 minutes setup + deployment

---

## 🔒 **Why GitLab is More Secure**

- **EU-based servers** (better privacy laws than US)
- **Open source core** (transparency)
- **GDPR compliant** by design
- **Self-hosted options** available
- **Enterprise security features** in free tier
- **No Microsoft ownership** concerns

---

## **STEP 1: CREATE GITLAB ACCOUNT** ⏱️ 3 minutes

### 1.1 Sign Up
1. Go to [gitlab.com](https://gitlab.com)
2. Click "Sign up"
3. Use your email (not required to link other accounts)
4. Verify email address
5. Complete profile setup

### 1.2 Create New Project
1. Click "Create a project"
2. Choose "Create blank project"
3. **Project name**: `spiral-platform`
4. **Visibility**: Private (keep your code secure)
5. Click "Create project"

---

## **STEP 2: PUSH SPIRAL CODE TO GITLAB** ⏱️ 5 minutes

### 2.1 Get Your Code Ready
```bash
# In your SPIRAL project directory
git init
git add .
git commit -m "Initial SPIRAL platform commit"
```

### 2.2 Connect to GitLab
```bash
# Add GitLab as remote (replace YOUR_USERNAME with your GitLab username)
git remote add origin https://gitlab.com/YOUR_USERNAME/spiral-platform.git

# Push to GitLab
git branch -M main
git push -u origin main
```

### 2.3 Verify Upload
- Refresh your GitLab project page
- Confirm all files are uploaded
- Check that `package.json`, `vite.config.ts`, and folders are present

---

## **STEP 3: CONNECT GITLAB TO VERCEL** ⏱️ 5 minutes

### 3.1 Access Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up or login
3. Click "New Project"

### 3.2 Connect GitLab
1. Look for "Import Git Repository" section
2. Click "Connect GitLab"
3. Authorize Vercel to access GitLab
4. Find your `spiral-platform` repository
5. Click "Import"

### 3.3 Configure Build Settings
- **Framework**: Vite (auto-detected)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Root Directory**: `./`

---

## **STEP 4: ADD ENVIRONMENT VARIABLES** ⏱️ 5 minutes

In Vercel, add these environment variables:

```bash
# Core Configuration
NODE_ENV=production
INVESTOR_MODE=1
WATSONX_ENABLED=0
RATE_LIMIT_RPM=60
SHIPPING_MODE=mock
PRIMARY_DOMAIN=spiralshops.com

# Database
CLOUDANT_URL=your-actual-cloudant-url
CLOUDANT_APIKEY=your-actual-apikey
CLOUDANT_DB=spiral

# Stripe (Test Mode)
STRIPE_MODE=test
STRIPE_SECRET_KEY=your-stripe-test-key
STRIPE_PUBLISHABLE_KEY=your-stripe-test-publishable-key
LIVE_SAFETY_ON=0

# AI Services
OPENAI_API_KEY=your-openai-key

# Security
JWT_SECRET=your-secure-jwt-secret
SESSION_SECRET=your-session-secret
DEMO_RESET_KEY=secure-demo-reset-key

# Admin
ADMIN_EMAIL=admin@spiralshops.com
ADMIN_PASS=your-secure-password
```

---

## **STEP 5: DEPLOY** ⏱️ 2 minutes

1. Click "Deploy" in Vercel
2. Wait for build completion (2-5 minutes)
3. Get your temporary URL (like `spiral-xyz.vercel.app`)
4. Test the deployment

---

## **STEP 6: CONFIGURE SPIRALSHOPS.COM DOMAIN**

### 6.1 Add Domain in Vercel
1. Project Settings → Domains
2. Add `spiralshops.com`
3. Add `www.spiralshops.com`

### 6.2 DNS Configuration
At your domain registrar:
- **A Record**: `spiralshops.com` → `76.76.19.61`
- **CNAME**: `www.spiralshops.com` → `cname.vercel-dns.com`

---

## **BENEFITS OF GITLAB APPROACH**

### **Security Advantages**
- EU data protection laws
- Open source transparency
- No US government access concerns
- Enterprise-grade security features

### **Development Advantages**
- Built-in CI/CD pipelines
- Issue tracking
- Wiki documentation
- Container registry
- Advanced merge request features

### **Deployment Advantages**
- Automatic deployments on code changes
- Preview deployments for testing
- Rollback capabilities
- Environment-specific deployments

---

## **ONGOING WORKFLOW**

### **Making Updates**
```bash
# Make changes to your SPIRAL platform
git add .
git commit -m "Feature: Added new functionality"
git push origin main

# Vercel automatically rebuilds and deploys
```

### **Security Features**
- All code stored on EU servers
- Private repository (only you have access)
- Two-factor authentication available
- SSH key authentication supported

---

## **ALTERNATIVE: VERCEL CLI (NO GIT)**

If you prefer not to use any Git provider at all:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy directly from your machine
vercel

# Add environment variables
vercel env add NODE_ENV production
vercel env add INVESTOR_MODE 1
# ... add all variables

# Deploy to production
vercel --prod
```

---

## **COMPARISON**

| Method | Security | Convenience | Auto-Deploy |
|--------|----------|-------------|-------------|
| GitLab + Vercel | Very High | High | Yes |
| Vercel CLI | High | Medium | No |
| GitHub + Vercel | Medium | High | Yes |

---

**Recommendation**: GitLab + Vercel gives you the best combination of security and convenience.

**Ready to start?** Create your GitLab account at [gitlab.com](https://gitlab.com) and follow Step 1 above.

---

*This approach gives you all the benefits of Git-based deployment while using a more secure platform than GitHub.*