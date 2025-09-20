# SPIRAL Domain & DNS Configuration Guide

**Issue**: SSL certificate error when accessing spiralshops.com
**Solution**: Proper Vercel deployment and DNS configuration

---

## 🚨 **Current Issue Analysis**

### **Error**: NET::ERR_CERT_COMMON_NAME_INVALID
- **Cause**: Domain not properly configured at Vercel
- **Status**: Site not deployed to production yet
- **Solution**: Deploy to Vercel + configure DNS

---

## 🚀 **Step 1: Deploy SPIRAL to Vercel**

### **1.1 Create Vercel Project**
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import from GitHub: Select your SPIRAL repository
3. Configure deployment settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm ci`

### **1.2 Add Environment Variables**
In Vercel dashboard → Settings → Environment Variables:

```bash
# Core Configuration
NODE_ENV=production
INVESTOR_MODE=1
WATSONX_ENABLED=0
RATE_LIMIT_RPM=60

# Database
CLOUDANT_URL=https://your-service.cloudantnosqldb.appdomain.cloud
CLOUDANT_APIKEY=your-cloudant-apikey
CLOUDANT_DB=spiral

# Stripe (Test Mode)
STRIPE_MODE=test
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_PUBLISHABLE_KEY=pk_test_51...
LIVE_SAFETY_ON=0

# AI Services
OPENAI_API_KEY=sk-...

# Security
JWT_SECRET=your-jwt-secret
DEMO_RESET_KEY=secure-demo-reset-key
SESSION_SECRET=your-session-secret

# Admin
ADMIN_EMAIL=admin@spiralshops.com
ADMIN_PASS=secure-admin-password

# Monitoring
SENTRY_DSN=https://...@sentry.io/...
PLAUSIBLE_DOMAIN=spiralshops.com
```

### **1.3 Initial Deployment**
- Click "Deploy" to create initial deployment
- Wait for build to complete
- Test using the temporary Vercel URL (e.g., spiral-platform-xyz.vercel.app)

---

## 🌐 **Step 2: Configure Custom Domain**

### **2.1 Add Domain in Vercel**
1. Go to Project Settings → Domains
2. Add domain: `spiralshops.com`
3. Add www subdomain: `www.spiralshops.com`
4. Set `spiralshops.com` as primary domain

### **2.2 DNS Configuration**
At your domain registrar (GoDaddy, Namecheap, etc.), add these DNS records:

```dns
# A Record (Required)
Type: A
Name: @
Value: 76.76.19.61
TTL: 300 (or Auto)

# CNAME Record (For www subdomain)
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 300 (or Auto)

# Optional: Redirect subdomain
Type: CNAME  
Name: app
Value: cname.vercel-dns.com
TTL: 300
```

---

## ⏰ **Step 3: SSL Certificate Provisioning**

### **3.1 Automatic SSL**
- Vercel automatically provisions SSL certificates
- Process takes 24-48 hours after DNS propagation
- No manual configuration required

### **3.2 Verification Steps**
```bash
# Check DNS propagation
dig spiralshops.com
nslookup spiralshops.com 8.8.8.8

# Check SSL status
curl -I https://spiralshops.com

# Verify redirect
curl -I http://spiralshops.com
# Should return 301/302 to https://
```

---

## 🔧 **Step 4: Troubleshooting Common Issues**

### **Issue: DNS Not Propagating**
```bash
# Check current DNS
dig spiralshops.com +short

# If not showing 76.76.19.61:
1. Verify DNS records at registrar
2. Wait up to 48 hours for global propagation
3. Clear browser DNS cache
4. Try different DNS servers (8.8.8.8, 1.1.1.1)
```

### **Issue: SSL Certificate Not Provisioning**
1. Ensure DNS is fully propagated (24-48 hours)
2. Check Vercel domain status in dashboard
3. Verify A record points to correct IP
4. Contact Vercel support if issues persist

### **Issue: Browser Security Warning**
1. **Cause**: Accessing domain before SSL is ready
2. **Solution**: Wait for certificate provisioning
3. **Workaround**: Use temporary Vercel URL during setup

---

## 📋 **Step 5: Deployment Verification Checklist**

### **Pre-SSL (Temporary URL)**
- [ ] Vercel deployment successful
- [ ] Build completes without errors
- [ ] Temporary URL accessible (spiral-xyz.vercel.app)
- [ ] API endpoints responding (../api/health)
- [ ] Environment variables configured

### **Post-DNS Configuration**
- [ ] A record configured at registrar
- [ ] CNAME record for www configured
- [ ] DNS propagation verified (dig command)
- [ ] Domain added to Vercel project

### **Post-SSL Provisioning (24-48 hours)**
- [ ] https://spiralshops.com accessible
- [ ] SSL certificate valid (no browser warnings)
- [ ] HTTP redirects to HTTPS
- [ ] All routes working (/investor, /demo/*, etc.)
- [ ] API endpoints accessible

---

## 🚀 **Immediate Next Steps**

### **Right Now**
1. **Deploy to Vercel**: Create project and deploy with environment variables
2. **Test Temporary URL**: Verify platform works on Vercel infrastructure
3. **Configure DNS**: Add A and CNAME records at domain registrar

### **Within 24 Hours**
1. **Monitor DNS**: Check propagation status
2. **Verify SSL**: Wait for automatic certificate provisioning
3. **Test Domain**: Access https://spiralshops.com once ready

### **After Domain is Live**
1. **Full Testing**: Run complete platform verification
2. **Update Documentation**: Confirm all links work
3. **Launch Announcement**: Platform ready for investor demos

---

## ⚠️ **Important Notes**

### **Current Status**
- **Platform**: 100% ready for deployment
- **Code**: All features tested and working locally
- **Issue**: Domain not deployed to Vercel yet
- **Solution**: Follow deployment steps above

### **Expected Timeline**
- **Deployment**: 10-15 minutes
- **DNS Propagation**: 2-48 hours (typically 4-8 hours)
- **SSL Provisioning**: Automatic after DNS is ready
- **Full Access**: spiralshops.com live within 24-48 hours

### **Backup Plan**
- Use temporary Vercel URL for immediate demos
- spiralshops.com will work once DNS/SSL is ready
- All functionality identical between URLs

---

**Next Action**: Deploy to Vercel following Step 1 above, then configure DNS records at your domain registrar.

---

*Last Updated: August 9, 2025*  
*Status: Ready for Vercel deployment*