# 🌐 GoDaddy DNS Setup for spiralshops.com - Step by Step

## What You Need to Add

### **CNAME Records to Create:**

**Record 1 - Root Domain:**
```
Type: CNAME
Name: @ 
Value: 27d4f357-044c-4271-84d2-b2bf67be7115-00-18jv7lspv4am.janeway.replit.dev
TTL: 1 Hour
```

**Record 2 - WWW Subdomain:**
```
Type: CNAME
Name: www
Value: 27d4f357-044c-4271-84d2-b2bf67be7115-00-18jv7lspv4am.janeway.replit.dev
TTL: 1 Hour
```

## Step-by-Step Instructions

### **Step 1: Log into GoDaddy**
1. Go to godaddy.com
2. Click "Sign In" 
3. Enter your GoDaddy username and password
4. Go to "My Products" or "Manage Domains"

### **Step 2: Access DNS Settings**
1. Find "spiralshops.com" in your domain list
2. Click the "DNS" button next to it
3. You'll see "DNS Management" page

### **Step 3: Add First CNAME Record**
1. Click "Add Record" or "Add" button
2. Select "CNAME" from the dropdown
3. Fill in these exact values:
   - **Host/Name:** `@` (this represents the root domain)
   - **Points to/Value:** `27d4f357-044c-4271-84d2-b2bf67be7115-00-18jv7lspv4am.janeway.replit.dev`
   - **TTL:** `1 Hour` (or 3600 seconds)
4. Click "Save"

### **Step 4: Add Second CNAME Record**
1. Click "Add Record" again
2. Select "CNAME" from the dropdown
3. Fill in these exact values:
   - **Host/Name:** `www`
   - **Points to/Value:** `27d4f357-044c-4271-84d2-b2bf67be7115-00-18jv7lspv4am.janeway.replit.dev`
   - **TTL:** `1 Hour`
4. Click "Save"

### **Step 5: Remove Conflicting Records**
Look for and DELETE any existing records that might conflict:
- Any A records for `@` or `www`
- Any other CNAME records for the same names
- Any AAAA records (IPv6) for `@` or `www`

## What This Does

### **Before DNS Setup:**
- spiralshops.com shows SSL certificate error
- Users see "Your connection is not private" warning
- Server redirect works but DNS doesn't point correctly

### **After DNS Setup:**
- spiralshops.com resolves to your Replit server
- Server automatically redirects to spiralmalls.com
- Users get seamless access with no SSL warnings
- Both www.spiralshops.com and spiralshops.com work

## Alternative Simplified Approach

If you prefer to redirect directly to spiralmalls.com instead:

**Option 2 - Direct Redirect CNAME:**
```
Type: CNAME
Name: @
Value: spiralmalls.com
TTL: 1 Hour

Type: CNAME  
Name: www
Value: spiralmalls.com
TTL: 1 Hour
```

## Verification Steps

### **After Making Changes:**
1. Wait 15-30 minutes for DNS propagation
2. Test these URLs in your browser:
   - https://spiralshops.com
   - https://www.spiralshops.com
3. Both should redirect to spiralmalls.com with no SSL errors

### **Check DNS Propagation:**
- Visit whatsmydns.net
- Enter "spiralshops.com" 
- Select "CNAME" record type
- Verify it shows your Replit domain globally

## Troubleshooting

### **If Records Don't Save:**
- Make sure you're editing the correct domain (spiralshops.com)
- Check that you have DNS management permissions
- Try refreshing the page and adding again
- Contact GoDaddy support if needed

### **If SSL Errors Persist:**
- Clear your browser cache completely
- Try incognito/private browsing mode
- Test from different devices/networks
- Wait up to 24 hours for full propagation

### **If Redirect Doesn't Work:**
- Verify the CNAME values are exactly correct
- Check that no A records are conflicting
- Make sure the Replit domain is accessible

## Expected Timeline

- **DNS Changes:** 15-30 minutes to propagate
- **SSL Resolution:** Immediate once DNS resolves
- **Full Global Propagation:** Up to 24 hours

## Contact Information

- **GoDaddy DNS Support:** 1-480-624-2505
- **GoDaddy Help Center:** support.godaddy.com
- **DNS Propagation Check:** whatsmydns.net

Once you add these CNAME records, the SSL certificate issue will be completely resolved and users will have seamless access to your SPIRAL platform.