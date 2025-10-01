# 🔄 DNS Records: Replace vs Add - Complete Guide

## What You Need to Do: REPLACE

### **Step 1: Delete Existing Records**
Look for and **DELETE** these existing records for spiralshops.com:

**Records to DELETE:**
- Any A record with Name: `@`
- Any A record with Name: `www`
- Any CNAME record with Name: `@`
- Any CNAME record with Name: `www`
- Any AAAA records (IPv6)

### **Step 2: Add New CNAME Records**
After deleting the old ones, add these **NEW** records:

**New Record 1:**
```
Type: CNAME
Name: @
Value: 27d4f357-044c-4271-84d2-b2bf67be7115-00-18jv7lspv4am.janeway.replit.dev
TTL: 1 Hour
```

**New Record 2:**
```
Type: CNAME
Name: www
Value: 27d4f357-044c-4271-84d2-b2bf67be7115-00-18jv7lspv4am.janeway.replit.dev
TTL: 1 Hour
```

## Why Replace Instead of Add

### **DNS Conflicts:**
- You can't have both A record and CNAME record for same name
- Multiple records for same name cause conflicts
- Browser won't know which one to use

### **Current Problem:**
- spiralshops.com probably has A record pointing to old server
- Old server has wrong SSL certificate
- That's why you see certificate error

### **After Replacement:**
- CNAME points to your Replit server
- Replit server redirects to spiralmalls.com
- SSL certificate issue resolved

## GoDaddy Interface Steps

### **Finding Existing Records:**
1. Login to GoDaddy DNS Manager
2. Look for existing records with Name `@` and `www`
3. Click the **trash/delete icon** next to each one
4. Confirm deletion

### **Adding New Records:**
1. Click "Add Record" button
2. Select "CNAME" from dropdown
3. Fill in Name and Value as shown above
4. Click "Save"
5. Repeat for second record

## Records to Keep (Don't Delete)

### **Safe to Keep:**
- **MX records** (for email)
- **TXT records** (for domain verification)
- **NS records** (nameservers)
- **SRV records** (services)

### **Only Delete:**
- A records for `@` and `www`
- Old CNAME records for `@` and `www`
- AAAA records for `@` and `www`

## Visual Guide

### **Before (Problematic):**
```
@ A 192.168.1.100 (points to old server with wrong SSL)
www A 192.168.1.100 (same problem)
```

### **After (Fixed):**
```
@ CNAME 27d4f357-044c-4271-84d2-b2bf67be7115-00-18jv7lspv4am.janeway.replit.dev
www CNAME 27d4f357-044c-4271-84d2-b2bf67be7115-00-18jv7lspv4am.janeway.replit.dev
```

## Timeline After Changes

### **Immediate (0-5 minutes):**
- DNS records updated in GoDaddy system
- Changes begin propagating globally

### **Quick (15-30 minutes):**
- Most DNS servers pick up changes
- spiralshops.com starts working for most users

### **Complete (24 hours):**
- All global DNS servers updated
- Everyone worldwide sees new records

## Testing After Changes

### **Wait 30 minutes, then test:**
1. Clear browser cache completely
2. Try https://spiralshops.com in incognito mode
3. Should redirect to https://spiralmalls.com automatically
4. No SSL certificate warnings

### **If Still Not Working:**
- Wait longer (up to 24 hours)
- Check whatsmydns.net for propagation status
- Try from different device/network
- Contact GoDaddy support if needed

The key is **REPLACE, don't add** - delete the old conflicting records first, then add the new CNAME records.