# SPIRAL DNS Configuration Guide
## Pointing spiralmalls.com from GoDaddy to Replit/Vercel

## 🌐 **Domain Configuration Overview**

Since you're deploying to Vercel (not directly to Replit), you'll need to configure DNS to point to Vercel's servers. Here's the complete configuration:

---

## 📋 **DNS Records Configuration for spiralmalls.com**

### **Option 1: Vercel Deployment (Recommended)**

#### **A Records** (for root domain)
```
Type: A
Name: @
Value: 76.76.19.19
TTL: 3600 (1 hour)
```

#### **CNAME Records** (for subdomains)
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600 (1 hour)
```

#### **Additional Subdomains** (if needed)
```
Type: CNAME
Name: api
Value: cname.vercel-dns.com
TTL: 3600 (1 hour)

Type: CNAME
Name: admin
Value: cname.vercel-dns.com
TTL: 3600 (1 hour)
```

---

### **Option 2: Direct Replit Deployment**

#### **If deploying directly to Replit:**
```
Type: CNAME
Name: @
Value: your-repl-name.replit.app
TTL: 3600 (1 hour)

Type: CNAME
Name: www
Value: your-repl-name.replit.app
TTL: 3600 (1 hour)
```

---

## 🔧 **GoDaddy DNS Configuration Steps**

### **Step 1: Access DNS Management**
1. Log into your GoDaddy account
2. Go to "My Products" → "Domains"
3. Click on "spiralmalls.com"
4. Select "DNS" tab or "Manage DNS"

### **Step 2: Configure DNS Records**
1. **Delete existing A records** pointing to old servers
2. **Add new A record** for root domain:
   - Type: A
   - Host: @
   - Points to: 76.76.19.19
   - TTL: 1 hour

3. **Add CNAME record** for www subdomain:
   - Type: CNAME
   - Host: www
   - Points to: cname.vercel-dns.com
   - TTL: 1 hour

### **Step 3: Verify Configuration**
- DNS changes can take 24-48 hours to propagate globally
- Use tools like `dig` or online DNS checkers to verify
- Test both `spiralmalls.com` and `www.spiralmalls.com`

---

## 🚀 **Vercel Custom Domain Setup**

### **Step 1: Add Domain in Vercel Dashboard**
1. Go to your Vercel project dashboard
2. Navigate to "Settings" → "Domains"
3. Add "spiralmalls.com" and "www.spiralmalls.com"
4. Vercel will provide DNS configuration instructions

### **Step 2: SSL Certificate**
- Vercel automatically provisions SSL certificates
- HTTPS will be available once domain is verified
- Automatic redirect from HTTP to HTTPS

### **Step 3: Domain Verification**
- Vercel will verify domain ownership
- May require adding TXT record for verification
- Follow Vercel's specific instructions in dashboard

---

## 📊 **DNS Propagation and Testing**

### **Check DNS Propagation**
```bash
# Check A record
dig spiralmalls.com A

# Check CNAME record
dig www.spiralmalls.com CNAME

# Check from multiple locations
nslookup spiralmalls.com 8.8.8.8
```

### **Online Tools**
- whatsmydns.net
- dnschecker.org
- mxtoolbox.com/SuperTool.aspx

---

## 🔒 **Additional Security Configurations**

### **CAA Records** (Optional but recommended)
```
Type: CAA
Name: @
Value: 0 issue "letsencrypt.org"
TTL: 3600

Type: CAA
Name: @
Value: 0 issue "sectigo.com"
TTL: 3600
```

### **DMARC Record** (Email security)
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:admin@spiralmalls.com
TTL: 3600
```

### **SPF Record** (Email security)
```
Type: TXT
Name: @
Value: v=spf1 include:_spf.google.com ~all
TTL: 3600
```

---

## ⚡ **Performance Optimization**

### **CDN Configuration**
- Vercel provides global CDN automatically
- Static assets served from edge locations
- Optimal performance worldwide

### **Caching Headers**
- Browser caching configured automatically
- API response caching optimized
- Image optimization enabled

---

## 🎯 **Complete DNS Configuration Summary**

### **Required Records for spiralmalls.com:**

```dns
; Root domain
spiralmalls.com.        IN  A       76.76.19.19

; WWW subdomain  
www.spiralmalls.com.    IN  CNAME   cname.vercel-dns.com.

; Optional API subdomain
api.spiralmalls.com.    IN  CNAME   cname.vercel-dns.com.

; Optional admin subdomain
admin.spiralmalls.com.  IN  CNAME   cname.vercel-dns.com.

; Email MX records (if using email)
spiralmalls.com.        IN  MX  10  mail.spiralmalls.com.

; Security records
spiralmalls.com.        IN  CAA     0 issue "letsencrypt.org"
spiralmalls.com.        IN  TXT     "v=spf1 include:_spf.google.com ~all"
_dmarc.spiralmalls.com. IN  TXT     "v=DMARC1; p=quarantine; rua=mailto:admin@spiralmalls.com"
```

---

## 📋 **Migration Checklist**

### **Pre-Migration**
- [ ] Backup current DNS settings
- [ ] Note current TTL values
- [ ] Document existing subdomains
- [ ] Verify email configuration won't be affected

### **During Migration**
- [ ] Update A record for root domain
- [ ] Update CNAME for www subdomain
- [ ] Configure custom domain in Vercel
- [ ] Verify SSL certificate provisioning
- [ ] Test all subdomains and redirects

### **Post-Migration**
- [ ] Monitor DNS propagation (24-48 hours)
- [ ] Test website functionality
- [ ] Verify SSL/HTTPS working
- [ ] Check email delivery (if applicable)
- [ ] Update any hardcoded URLs in applications

---

## 🚨 **Important Notes**

### **TTL Considerations**
- Lower TTL before migration (300 seconds) for faster changes
- Increase TTL after successful migration (3600 seconds)
- DNS changes can take up to 48 hours to propagate globally

### **Email Services**
- Ensure MX records remain unchanged if using email
- Consider separate email hosting from web hosting
- Test email delivery after DNS changes

### **Subdomain Management**
- Plan subdomain structure (api, admin, blog, etc.)
- Configure all subdomains in Vercel dashboard
- Ensure consistent SSL coverage across subdomains

---

## ✅ **Final Verification**

After completing DNS configuration:

1. **Test main domain**: https://spiralmalls.com
2. **Test www subdomain**: https://www.spiralmalls.com  
3. **Verify SSL certificate**: Check for green lock icon
4. **Test all functionality**: Ensure SPIRAL platform works correctly
5. **Monitor performance**: Check load times and responsiveness

Your SPIRAL platform will be accessible at spiralmalls.com once DNS propagation completes!