# 🌐 Redirect spiralmalls.com from GoDaddy to Replit

**Goal:** Point your spiralmalls.com domain from GoDaddy to your SPIRAL platform on Replit

## Step 1: Deploy Your SPIRAL App on Replit

1. **Click the "Deploy" button** in your Replit workspace
2. **Choose your deployment settings:**
   - App Name: `spiral-platform` (or your preferred name)
   - Region: Choose closest to your target audience
   - Plan: Select appropriate plan based on traffic needs

3. **Wait for deployment to complete** - Replit will provide you with:
   - Deployment URL (e.g., `spiral-platform-username.replit.app`)
   - DNS records for custom domain setup

## Step 2: Get DNS Records from Replit

After successful deployment:

1. **Go to Deployments tab** in your Replit workspace
2. **Click on Settings tab**
3. **Select "Link a domain"** or **"Manually connect from another registrar"**
4. **Enter your domain:** `spiralmalls.com`
5. **Copy the generated DNS records** - Replit will provide:
   - **A Record:** Points to Replit's IP address
   - **TXT Record:** For domain verification
   - **CNAME Record:** (if using subdomain)

## Step 3: Configure DNS in GoDaddy

### Login to GoDaddy Account
1. Go to [GoDaddy.com](https://godaddy.com)
2. Sign in to your account
3. Navigate to **"My Products"** → **"DNS"**
4. Click **"Manage"** next to spiralmalls.com

### Add DNS Records

#### For Main Domain (spiralmalls.com):

**Add A Record:**
- **Type:** A
- **Host:** @ (or spiralmalls.com if @ not supported)
- **Points to:** [IP address provided by Replit]
- **TTL:** 1 Hour

**Add TXT Record:**
- **Type:** TXT
- **Host:** @ (or spiralmalls.com)
- **Value:** [TXT value provided by Replit]
- **TTL:** 1 Hour

#### For WWW Subdomain (www.spiralmalls.com):

**Add CNAME Record:**
- **Type:** CNAME
- **Host:** www
- **Points to:** [Your Replit deployment URL]
- **TTL:** 1 Hour

### Remove Conflicting Records
- **Delete any existing A records** that point to old hosting
- **Delete any CNAME records** that conflict with your new setup
- **Keep MX records** (for email) if you use GoDaddy email

## Step 4: Verify Domain Connection

### In Replit:
1. Return to your Replit deployment settings
2. Click **"Verify Domain"** after adding DNS records
3. Wait for verification (may take a few minutes)

### Test Your Domain:
- Visit `spiralmalls.com` in browser
- Visit `www.spiralmalls.com` in browser
- Both should show your SPIRAL platform

## Step 5: Enable HTTPS (Automatic)

Replit automatically provides SSL/HTTPS for custom domains:
- Certificate generation is automatic
- Your site will be accessible via `https://spiralmalls.com`
- HTTP traffic automatically redirects to HTTPS

## ⏰ DNS Propagation Timeline

- **Initial propagation:** 15 minutes - 2 hours
- **Full global propagation:** Up to 48 hours
- **Most users see changes:** Within 4-6 hours

## 🔧 Troubleshooting

### If Domain Doesn't Work:

1. **Check DNS propagation:**
   - Use [whatsmydns.net](https://www.whatsmydns.net)
   - Enter spiralmalls.com and check A record

2. **Verify DNS records in GoDaddy:**
   - Ensure A record points to correct Replit IP
   - Ensure TXT record matches Replit's verification code

3. **Clear browser cache:**
   - Hard refresh (Ctrl+F5 or Cmd+Shift+R)
   - Try incognito/private browsing

4. **Check Replit deployment status:**
   - Ensure deployment is active and running
   - Check deployment logs for any issues

### Common Issues:

- **"DNS_PROBE_FINISHED_NXDOMAIN"** = DNS records not propagated yet
- **"This site can't be reached"** = A record pointing to wrong IP
- **Security warnings** = Wait for SSL certificate generation

## 📋 Quick Checklist

Before starting:
- [ ] SPIRAL app is working correctly in Replit
- [ ] You have admin access to GoDaddy account
- [ ] You have spiralmalls.com domain in GoDaddy

GoDaddy DNS Setup:
- [ ] A record added with Replit IP
- [ ] TXT record added for verification
- [ ] CNAME record added for www subdomain
- [ ] Old conflicting records removed

Verification:
- [ ] Domain verified in Replit deployment settings
- [ ] spiralmalls.com loads your SPIRAL platform
- [ ] www.spiralmalls.com redirects properly
- [ ] HTTPS works automatically

## 🎯 Expected Result

After completion:
- `spiralmalls.com` → Shows your SPIRAL platform
- `www.spiralmalls.com` → Redirects to spiralmalls.com
- **HTTPS enabled** with automatic SSL certificate
- **Fast loading** with Replit's global CDN
- **Professional domain** for investor demos and public launch

## Need Help?

If you encounter issues:
1. Check the DNS records in both GoDaddy and Replit
2. Wait 24-48 hours for full DNS propagation
3. Contact Replit support if domain verification fails
4. Use DNS checker tools to verify propagation status

Your SPIRAL platform will be accessible at spiralmalls.com once setup is complete!