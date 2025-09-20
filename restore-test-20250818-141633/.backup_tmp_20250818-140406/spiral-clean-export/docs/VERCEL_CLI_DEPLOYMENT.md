# SPIRAL Vercel CLI Deployment (No Git Required)

**Goal**: Deploy SPIRAL directly from your machine without any Git provider
**Security**: No third-party Git provider, full local control
**Time**: 10 minutes setup + deployment

---

## 🚀 **Why Vercel CLI is Ideal**

- **No Git provider needed** - deploy directly from your machine
- **Full control** - you decide exactly when to deploy
- **More secure** - no code stored on third-party Git services
- **Faster setup** - skip Git configuration entirely
- **Same functionality** - identical to Git-based deployments

---

## **STEP 1: INSTALL VERCEL CLI** ⏱️ 2 minutes

### 1.1 Install CLI
```bash
# Install globally
npm install -g vercel

# Or using yarn
yarn global add vercel
```

### 1.2 Login to Vercel
```bash
vercel login
```
- Choose your preferred login method (email recommended)
- Follow the verification steps

---

## **STEP 2: PREPARE YOUR PROJECT** ⏱️ 2 minutes

### 2.1 Navigate to SPIRAL Directory
```bash
cd /path/to/your/spiral/project
```

### 2.2 Verify Project Structure
Ensure these files exist:
- `package.json` ✓
- `vite.config.ts` ✓
- `client/`, `server/`, `shared/` directories ✓

---

## **STEP 3: INITIAL DEPLOYMENT** ⏱️ 3 minutes

### 3.1 Deploy Command
```bash
vercel
```

### 3.2 Configuration Questions
Vercel will ask:
- **Set up and deploy?** → Yes
- **Which scope?** → Your account
- **Link to existing project?** → No
- **Project name?** → `spiral-platform`
- **Directory?** → `./` (default)
- **Override settings?** → Yes

### 3.3 Build Settings
- **Framework?** → `Other`
- **Build Command?** → `npm run build`
- **Output Directory?** → `dist`
- **Development Command?** → `npm run dev`

---

## **STEP 4: ADD ENVIRONMENT VARIABLES** ⏱️ 5 minutes

### 4.1 Add Variables via CLI
```bash
# Core Configuration
vercel env add NODE_ENV
# When prompted, enter: production

vercel env add INVESTOR_MODE
# When prompted, enter: 1

vercel env add WATSONX_ENABLED  
# When prompted, enter: 0

vercel env add RATE_LIMIT_RPM
# When prompted, enter: 60

vercel env add SHIPPING_MODE
# When prompted, enter: mock

vercel env add PRIMARY_DOMAIN
# When prompted, enter: spiralshops.com

# Database
vercel env add CLOUDANT_URL
# When prompted, enter: your-actual-cloudant-url

vercel env add CLOUDANT_APIKEY
# When prompted, enter: your-actual-apikey

vercel env add CLOUDANT_DB
# When prompted, enter: spiral

# Stripe (Test Mode)
vercel env add STRIPE_MODE
# When prompted, enter: test

vercel env add STRIPE_SECRET_KEY
# When prompted, enter: your-stripe-test-key

vercel env add STRIPE_PUBLISHABLE_KEY
# When prompted, enter: your-stripe-test-publishable-key

vercel env add LIVE_SAFETY_ON
# When prompted, enter: 0

# AI Services
vercel env add OPENAI_API_KEY
# When prompted, enter: your-openai-key

# Security
vercel env add JWT_SECRET
# When prompted, enter: your-secure-jwt-secret

vercel env add SESSION_SECRET
# When prompted, enter: your-session-secret

vercel env add DEMO_RESET_KEY
# When prompted, enter: secure-demo-reset-key

# Admin
vercel env add ADMIN_EMAIL
# When prompted, enter: admin@spiralshops.com

vercel env add ADMIN_PASS
# When prompted, enter: your-secure-password
```

### 4.2 Alternative: Bulk Environment Setup
Create a `.env.production` file locally:
```bash
# Copy your .env.template to .env.production
cp .env.template .env.production
# Edit with your actual values
```

Then import:
```bash
vercel env pull .env.production
```

---

## **STEP 5: PRODUCTION DEPLOYMENT** ⏱️ 2 minutes

### 5.1 Deploy to Production
```bash
vercel --prod
```

### 5.2 Get Your URL
Vercel will provide:
- **Preview URL**: For testing
- **Production URL**: Like `spiral-platform-abc123.vercel.app`

### 5.3 Test Deployment
Visit your production URL and test:
- Homepage: `/`
- Health check: `/api/health`
- Investor page: `/investor`
- Demo routes: `/demo/shopper`

---

## **STEP 6: CONFIGURE CUSTOM DOMAIN**

### 6.1 Add Domain via CLI
```bash
vercel domains add spiralshops.com
vercel domains add www.spiralshops.com
```

### 6.2 DNS Configuration
At your domain registrar, add:
- **A Record**: `spiralshops.com` → `76.76.19.61`
- **CNAME**: `www.spiralshops.com` → `cname.vercel-dns.com`

---

## **ONGOING WORKFLOW**

### **Making Updates**
```bash
# After making changes to your code
vercel --prod
# Deploys updated version immediately
```

### **Managing Environment Variables**
```bash
# List all variables
vercel env ls

# Add new variable
vercel env add NEW_VARIABLE

# Remove variable
vercel env rm OLD_VARIABLE
```

### **Project Information**
```bash
# Get project info
vercel inspect

# View logs
vercel logs
```

---

## **ADVANTAGES OF CLI DEPLOYMENT**

### **Security**
- No Git provider involved
- Code never stored on third-party services
- Full control over deployment timing
- Local environment variable management

### **Simplicity**
- Fewer moving parts
- Direct deployment process
- No Git configuration needed
- No repository management

### **Control**
- Deploy when ready
- No automatic deployments
- Selective file deployment
- Easy rollbacks

---

## **TROUBLESHOOTING**

### **Build Fails**
```bash
# Check build locally first
npm run build

# View detailed logs
vercel --debug
```

### **Environment Variables Missing**
```bash
# List current variables
vercel env ls

# Add missing variables
vercel env add MISSING_VAR
```

### **Domain Issues**
```bash
# Check domain status
vercel domains ls

# Verify DNS
nslookup spiralshops.com
```

---

## **COMPARISON WITH OTHER METHODS**

| Aspect | Vercel CLI | GitLab | GitHub |
|--------|------------|---------|---------|
| Setup Time | 10 min | 20 min | 15 min |
| Security | High | Very High | Medium |
| Auto-Deploy | No | Yes | Yes |
| Git Required | No | Yes | Yes |
| Control | Full | Medium | Medium |

---

## **RECOMMENDED WORKFLOW**

### **Initial Setup** (Today)
1. Install Vercel CLI
2. Deploy with `vercel`
3. Add environment variables
4. Deploy to production with `vercel --prod`
5. Configure domain DNS

### **Future Updates**
1. Make code changes locally
2. Test with `npm run dev`
3. Deploy with `vercel --prod`
4. Verify at spiralshops.com

---

**Ready to start?** Run `npm install -g vercel` in your terminal and follow Step 1 above.

This method gives you the fastest, most secure deployment without any Git provider dependencies.

---

*Perfect for developers who want full control over their deployment process.*