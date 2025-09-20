# SPIRAL Domain & DNS Configuration Guide

## Primary Domain Setup: spiralshops.com

### Step 1: Add Domain to Vercel
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add domain: `spiralshops.com`
3. Add domain: `www.spiralshops.com` (redirect to primary)

### Step 2: DNS Records Configuration
Configure the following DNS records with your domain registrar:

**A Records:**
```
Type: A
Name: @
Value: 76.76.19.61
TTL: 3600
```

**CNAME Records:**
```
Type: CNAME  
Name: www
Value: spiralshops.com
TTL: 3600
```

**Vercel DNS (Recommended):**
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
TTL: 3600

Type: CNAME
Name: www  
Value: cname.vercel-dns.com
TTL: 3600
```

### Step 3: SSL Certificate
- Vercel automatically provisions Let's Encrypt SSL certificates
- Wait 10-15 minutes for SSL propagation
- Verify HTTPS: `https://spiralshops.com`

---

## Optional Alias Domain: spiralmalls.com

### DNS Configuration (if registering spiralmalls.com):
```
Type: CNAME
Name: @
Value: spiralshops.com
TTL: 3600

Type: CNAME
Name: www
Value: spiralshops.com  
TTL: 3600
```

### Vercel Redirect Configuration:
Add to vercel.json:
```json
{
  "redirects": [
    {
      "source": "https://spiralmalls.com/:path*",
      "destination": "https://spiralshops.com/:path*",
      "permanent": true
    }
  ]
}
```

---

## DNS Propagation Verification

### Check DNS Status:
```bash
# Primary domain
dig spiralshops.com
nslookup spiralshops.com

# WWW subdomain  
dig www.spiralshops.com
nslookup www.spiralshops.com
```

### SSL Verification:
```bash
# Check SSL certificate
curl -I https://spiralshops.com
openssl s_client -connect spiralshops.com:443 -servername spiralshops.com
```

### Final Verification URLs:
- ✅ https://spiralshops.com (primary)
- ✅ https://www.spiralshops.com (redirect to primary)
- ✅ https://spiralshops.com/api/health (API health check)
- ✅ https://spiralshops.com/investor (investor demo page)

---

## Troubleshooting

### Common Issues:
1. **DNS not propagating**: Wait 24-48 hours, check different DNS servers
2. **SSL not ready**: Allow 15 minutes for Vercel SSL provisioning  
3. **CNAME conflicts**: Remove any existing A records for @ when using CNAME
4. **Redirect loops**: Ensure www CNAME points to apex domain, not Vercel

### Support Commands:
```bash
# Check current DNS
dig +short spiralshops.com
dig +short www.spiralshops.com

# Test HTTPS
curl -s -o /dev/null -w "%{http_code}" https://spiralshops.com
```

**Status**: Domain configuration ready for Vercel deployment