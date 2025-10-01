# 🔧 Complete DNS Setup Guide - Both Domains Working

## Current Status
- **spiralmalls.com** - Working with valid SSL certificate
- **spiralshops.com** - Needs DNS configuration to fix SSL issue

## DNS Records You Need to Add

### **For spiralshops.com at GoDaddy:**

```
Record Type: CNAME
Name: @
Value: 27d4f357-044c-4271-84d2-b2bf67be7115-00-18jv7lspv4am.janeway.replit.dev
TTL: 1 Hour

Record Type: CNAME  
Name: www
Value: 27d4f357-044c-4271-84d2-b2bf67be7115-00-18jv7lspv4am.janeway.replit.dev
TTL: 1 Hour
```

## How This Fixes the SSL Issue

### **Current Problem:**
1. spiralshops.com has DNS pointing somewhere else
2. That server has wrong SSL certificate
3. Browser shows "NET::ERR_CERT_COMMON_NAME_INVALID"

### **After DNS Fix:**
1. spiralshops.com points to your Replit server
2. Replit server redirects to spiralmalls.com
3. Users reach working site with valid SSL
4. No browser warnings

## Quick Visual Guide

### **GoDaddy DNS Manager Screenshot Guide:**
1. **Login** → My Products → Find spiralshops.com
2. **Click DNS** button next to domain name
3. **Look for "Add Record"** button (usually prominent)
4. **Select "CNAME"** from record type dropdown
5. **Fill in exact values** from the table above
6. **Click Save** for each record

### **What Each Field Means:**
- **Name/@:** This is the domain itself (spiralshops.com)
- **Name/www:** This is www.spiralshops.com  
- **Value:** Where the domain should point (your Replit server)
- **TTL:** How long DNS servers cache the record (1 hour is good)

## Alternative Approach (Simpler)

If you want spiralshops.com to redirect directly without going through Replit:

```
Record Type: CNAME
Name: @
Value: spiralmalls.com
TTL: 1 Hour

Record Type: CNAME
Name: www  
Value: spiralmalls.com
TTL: 1 Hour
```

This makes spiralshops.com immediately redirect to spiralmalls.com at the DNS level.

## After You Add the Records

### **Wait Time:**
- 15-30 minutes for initial propagation
- Up to 24 hours for global propagation

### **Test Results:**
- Visit https://spiralshops.com
- Should automatically redirect to https://spiralmalls.com
- No SSL warnings or certificate errors
- Seamless user experience

### **Verify It's Working:**
1. Clear browser cache
2. Try spiralshops.com in incognito mode
3. Test from mobile device
4. Both domains should work without errors

## Remove Any Conflicting Records

### **Delete These if They Exist:**
- A records for @ or www
- Other CNAME records for same names
- AAAA records (IPv6)
- Any forwarding rules that conflict

### **Keep These Records:**
- MX records (for email)
- TXT records (for verification)
- NS records (nameservers)

## What Happens After Setup

### **User Experience:**
1. User types spiralshops.com
2. DNS resolves to your Replit server
3. Server redirects to spiralmalls.com
4. User sees working SPIRAL platform
5. No SSL warnings anywhere

### **SEO Benefits:**
- 301 redirect preserves search rankings
- Both domains contribute to site authority
- No duplicate content issues
- Users can find site via either domain

The DNS setup is the final piece to completely resolve the SSL certificate issue and ensure both domains work seamlessly.