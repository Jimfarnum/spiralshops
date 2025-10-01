# 🔧 spiralshops.com DNS Records - Clean Setup Guide

## Current Issue: Conflicting DNS Records

spiralshops.com likely has other DNS records that will conflict with the new CNAME records. These need to be cleaned up.

## Records That Should Be DELETED from spiralshops.com

### **Delete These Record Types:**
- **A records** for @ and www (these conflict with CNAME)
- **AAAA records** for @ and www (IPv6 addresses)
- **Old CNAME records** for @ and www (if different values)
- **MX records** for @ (if you don't use email from this domain)
- **TXT records** (unless needed for verification)

### **Keep These Records (If They Exist):**
- **NS records** (nameservers - never delete these)
- **MX records** (only if you receive email at @spiralshops.com)
- **TXT records** for domain verification (Google, etc.)

## Step-by-Step Cleanup Process

### **Step 1: Review Existing Records**
1. Log into GoDaddy DNS Manager for spiralshops.com
2. Look at all current records
3. Identify which ones conflict with CNAME

### **Step 2: Delete Conflicting Records**
Delete any records with these characteristics:
```
Name: @ (root domain) - DELETE A, AAAA, old CNAME
Name: www - DELETE A, AAAA, old CNAME
```

### **Step 3: Add New CNAME Records**
After cleaning up, add these:
```
Type: CNAME
Name: @
Value: 27d4f357-044c-4271-84d2-b2bf67be7115-00-18jv7lspv4am.janeway.replit.dev
TTL: 1 Hour

Type: CNAME
Name: www
Value: 27d4f357-044c-4271-84d2-b2bf67be7115-00-18jv7lspv4am.janeway.replit.dev
TTL: 1 Hour
```

## Common Conflicting Records

### **Typical Setup That Needs Cleaning:**
```
@ A 192.168.1.100 ← DELETE THIS
www A 192.168.1.100 ← DELETE THIS
@ MX mail.spiralshops.com ← DELETE (unless using email)
```

### **After Cleanup:**
```
@ CNAME 27d4f357-044c-4271-84d2-b2bf67be7115-00-18jv7lspv4am.janeway.replit.dev
www CNAME 27d4f357-044c-4271-84d2-b2bf67be7115-00-18jv7lspv4am.janeway.replit.dev
```

## Why This Matters

### **DNS Conflicts:**
- Can't have A record and CNAME for same name
- Browser doesn't know which record to use
- Causes SSL certificate errors
- Site may not load consistently

### **After Cleanup:**
- Clean CNAME records point to Replit
- Server redirects to spiralmalls.com
- SSL certificate works properly
- Consistent site access

## Email Considerations

### **If You DON'T Use Email at spiralshops.com:**
- Delete all MX records
- This simplifies DNS setup

### **If You DO Use Email at spiralshops.com:**
- Keep MX records
- Email will still work with CNAME setup
- Test email after DNS changes

## Verification After Cleanup

### **Test These URLs After 30 Minutes:**
- https://spiralshops.com (should redirect to spiralmalls.com)
- https://www.spiralshops.com (should redirect to spiralmalls.com)
- No SSL certificate warnings

### **DNS Lookup Check:**
- Use whatsmydns.net
- Enter "spiralshops.com"
- Should show CNAME pointing to Replit domain

## Quick Reference: Delete vs Keep

### **DELETE These:**
- A records for @ and www
- AAAA records for @ and www  
- Old/different CNAME records
- Unused MX records

### **KEEP These:**
- NS records (nameservers)
- MX records (if using email)
- TXT records (for verification)

The goal is clean DNS records with only the CNAME entries pointing to your Replit server.