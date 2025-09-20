# 🔒 GoDaddy SSL Certificate Fix for spiralshops.com

## Step-by-Step Fix Guide

### **Option 1: Redirect spiralshops.com to spiralmalls.com (Recommended)**

#### **Step 1: Log into GoDaddy Account**
1. Go to godaddy.com
2. Sign in to your account
3. Navigate to "My Products"
4. Find "spiralshops.com" domain

#### **Step 2: Set Up Domain Forwarding**
1. Click "DNS" next to spiralshops.com
2. Click "Forwarding" tab
3. Click "Add Forwarding"
4. Configure:
   ```
   Forward to: https://spiralmalls.com
   Redirect type: 301 (Permanent)
   Forward settings: Forward only
   ```
5. Click "Save"

#### **Step 3: Update DNS Records**
1. Go to "DNS Records" tab
2. Delete any existing A records for spiralshops.com
3. Add CNAME record:
   ```
   Type: CNAME
   Name: @
   Value: spiralmalls.com
   TTL: 1 Hour
   ```
4. Add CNAME for www:
   ```
   Type: CNAME
   Name: www
   Value: spiralmalls.com
   TTL: 1 Hour
   ```

### **Option 2: Get New SSL Certificate for spiralshops.com**

#### **Step 1: Request SSL Certificate from GoDaddy**
1. In GoDaddy account, go to "SSL Certificates"
2. Click "New Certificate"
3. Select domain: spiralshops.com
4. Choose certificate type: "Single Domain" or "Wildcard"
5. Complete validation process

#### **Step 2: Configure DNS for Replit**
1. In DNS settings for spiralshops.com:
2. Add A record:
   ```
   Type: A
   Name: @
   Value: [Replit IP Address]
   TTL: 1 Hour
   ```
3. Add CNAME for www:
   ```
   Type: CNAME
   Name: www
   Value: spiralshops.com
   TTL: 1 Hour
   ```

#### **Step 3: Configure Replit with SSL**
1. In Replit project settings
2. Add custom domain: spiralshops.com
3. Upload SSL certificate files
4. Enable HTTPS enforcement

### **Quick Fix (Immediate)**

#### **For Immediate Access:**
1. Go to GoDaddy DNS Manager for spiralshops.com
2. Add CNAME record:
   ```
   Type: CNAME
   Name: @
   Value: your-replit-domain.repl.dev
   TTL: 600 seconds
   ```
3. This will use Replit's SSL certificate temporarily

### **Testing Steps**

#### **After DNS Changes:**
1. Wait 10-15 minutes for propagation
2. Test in browser: https://spiralshops.com
3. Check for SSL warnings
4. Verify mobile compatibility

#### **Validation Commands:**
```bash
# Check DNS resolution
nslookup spiralshops.com

# Test SSL certificate
openssl s_client -connect spiralshops.com:443 -servername spiralshops.com

# Check certificate details
curl -I https://spiralshops.com
```

### **Expected Results**

#### **With Domain Forwarding:**
- spiralshops.com redirects to spiralmalls.com
- No SSL warnings
- Users reach SPIRAL platform safely
- SEO benefits from proper redirect

#### **With New Certificate:**
- spiralshops.com loads directly
- Green padlock in browser
- Full SSL/HTTPS protection
- Independent domain operation

### **Troubleshooting**

#### **If Still Getting SSL Errors:**
1. Clear browser cache and cookies
2. Try incognito/private browsing mode
3. Test from different devices/networks
4. Check DNS propagation status

#### **If DNS Not Propagating:**
1. Reduce TTL to 300 seconds
2. Use different DNS servers for testing
3. Contact GoDaddy support if issues persist
4. Consider using Cloudflare for faster propagation

### **Production Considerations**

#### **For Live Traffic:**
- Implement monitoring for certificate expiration
- Set up automatic renewal if possible
- Create backup certificates
- Document SSL management procedures

#### **For SEO:**
- Update all internal links to use correct domain
- Submit updated sitemap to search engines
- Monitor for any ranking impact
- Set up proper canonical URLs

### **Contact Information**

#### **If You Need Help:**
- GoDaddy Support: 1-480-624-2505
- GoDaddy SSL Support: Available 24/7
- Replit Support: support@replit.com

This fix will resolve the SSL certificate error and allow users to access spiralshops.com safely.