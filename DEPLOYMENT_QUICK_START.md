# SPIRAL Deployment Quick Start

**Goal**: Get SPIRAL live on spiralshops.com in under 1 hour

---

## 🚀 **IMMEDIATE STEPS (15 minutes)**

### **Step 1: Vercel Deployment**
1. Go to **[vercel.com/new](https://vercel.com/new)**
2. **Import** your GitHub SPIRAL repository
3. **Configure**:
   - Framework: Vite ✅
   - Build: `npm run build` ✅
   - Output: `dist` ✅
4. **Add Environment Variables** (copy from `.env.template`):
   - `NODE_ENV=production`
   - `INVESTOR_MODE=1`
   - `WATSONX_ENABLED=0`
   - Your Cloudant, Stripe, OpenAI keys
   - (Full list in detailed guide)
5. **Deploy** - Get working URL like `spiral-xyz.vercel.app`

### **Step 2: Domain Configuration**
1. **In Vercel**: Settings → Domains → Add `spiralshops.com`
2. **At Domain Registrar** (GoDaddy/Namecheap/etc):
   - A record: `spiralshops.com` → `76.76.19.61`
   - CNAME: `www.spiralshops.com` → `cname.vercel-dns.com`

---

## ⏰ **WAITING PERIOD (2-48 hours)**

### **DNS Propagation**
- Your DNS changes spread globally
- Usually 2-8 hours, maximum 48 hours
- Check at [whatsmydns.net](https://whatsmydns.net)

### **SSL Certificate**
- Vercel creates HTTPS certificate automatically
- Happens after DNS is working
- No action needed from you

---

## ✅ **SUCCESS INDICATORS**

### **Right Now**
- [ ] Temporary Vercel URL works (`https://spiral-xyz.vercel.app`)
- [ ] All your platform features working
- [ ] Can use for investor demos immediately

### **After DNS Propagates**
- [ ] `https://spiralshops.com` loads without SSL errors
- [ ] All routes work (`/investor`, `/demo/shopper`, etc.)
- [ ] API endpoints responding (`/api/health`)

---

## 🆘 **COMMON ISSUES & FIXES**

**Build Fails**: Missing environment variables → Add all from `.env.template`
**DNS Not Working**: Wrong records → Verify A record is exactly `76.76.19.61`
**SSL Errors**: Too early → Wait 24-48 hours after DNS works

---

## 📞 **NEED HELP?**

**Full Guide**: `docs/STEP_BY_STEP_DEPLOYMENT.md` (complete details)
**DNS Guide**: `docs/DOMAIN_DNS_SETUP.md` (domain configuration)

**Next Action**: Go to [vercel.com/new](https://vercel.com/new) and import your repository!

---

*Platform Status: 100% Ready for Deployment*