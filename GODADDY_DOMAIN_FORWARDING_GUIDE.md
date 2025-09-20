# 🌐 Domain Forwarding Setup Guide

*Step-by-step instructions for forwarding spiralshops.com to spiralmalls.com*

---

## 🎯 Quick Overview

**Goal:** Redirect spiralshops.com → spiralmalls.com to fix SSL certificate errors
**Method:** Domain forwarding at registrar level
**Result:** Seamless user experience with valid SSL certificate

---

## 📋 GoDaddy Domain Forwarding

### **Step 1: Access Your Account**
1. Go to **godaddy.com**
2. Click **Sign In** (top right)
3. Enter your GoDaddy username and password
4. Navigate to **My Products** → **All Products and Services**

### **Step 2: Find Domain Management**
1. Locate **spiralshops.com** in your domain list
2. Click **DNS** button next to the domain
3. Or click **Manage** → **DNS Management**

### **Step 3: Set Up Domain Forwarding**
1. Scroll down to **Domain** section
2. Click **Manage** next to "Forwarding"
3. Click **Add Forwarding**
4. Configure settings:
   - **Forward to:** `https://spiralmalls.com`
   - **Forward type:** `301 (Permanent Redirect)`
   - **Settings:** Check "Forward path" and "Update SEO"

### **Step 4: Save and Activate**
1. Click **Save**
2. Changes take effect in 1-4 hours
3. Full global propagation: 24-48 hours

---

## 📋 Alternative: Namecheap Domain Forwarding

### **Step 1: Account Access**
1. Go to **namecheap.com**
2. Sign in to your account
3. Go to **Domain List** → **Manage**

### **Step 2: Domain Forwarding**
1. Find **spiralshops.com**
2. Click **Manage**
3. Go to **Redirect Domain** tab
4. Set up forwarding:
   - **Type:** `301 Permanent Redirect`
   - **Source URL:** `spiralshops.com`
   - **Target URL:** `https://spiralmalls.com`
   - **Redirect type:** `URL Redirect`

### **Step 3: Apply Changes**
1. Click **Save All Changes**
2. Propagation time: 30 minutes - 48 hours

---

## 📋 Generic Domain Registrar Steps

### **For Any Domain Registrar:**
1. **Log in** to your domain registrar account
2. **Find domain management** section
3. **Look for these options:**
   - "Domain Forwarding"
   - "URL Redirect"
   - "Domain Redirect"
   - "HTTP Redirect"
4. **Configure redirect:**
   - From: `spiralshops.com`
   - To: `https://spiralmalls.com`
   - Type: `301 Permanent Redirect`
5. **Save changes** and wait for propagation

---

## 📋 DNS Method (Advanced)

### **If Forwarding Not Available:**
1. **Delete existing DNS records**
2. **Add new A records:**
   ```
   Host: @
   Points to: 185.199.108.153
   TTL: 1 hour
   
   Host: www
   Points to: 185.199.108.153
   TTL: 1 hour
   ```
3. **Set up redirect service** (like redirect.pizza or similar)

---

## 🔍 Testing Your Setup

### **After Configuration:**
```bash
# Test the redirect (should show 301 response)
curl -I http://spiralshops.com

# Should return:
# HTTP/1.1 301 Moved Permanently
# Location: https://spiralmalls.com
```

### **Browser Test:**
1. Open browser
2. Type `spiralshops.com`
3. Should automatically redirect to `spiralmalls.com`
4. No SSL certificate errors

---

## ⏰ Timeline Expectations

### **Immediate (0-1 hours):**
- Domain registrar changes applied
- Basic redirect functionality active

### **Short Term (1-4 hours):**
- DNS cache updates begin
- Most users see the redirect

### **Complete (24-48 hours):**
- Global DNS propagation complete
- All users worldwide see redirect
- Search engines recognize new setup

---

## 🎯 Why This Works

### **SSL Certificate Issue Solved:**
- Users never reach problematic Replit servers
- spiralmalls.com has valid SSL certificate
- No certificate domain mismatch errors

### **SEO Benefits:**
- 301 redirect preserves search rankings
- Link equity transfers to spiralmalls.com
- Professional, permanent solution

### **User Experience:**
- Seamless automatic redirect
- No broken links or error pages
- Single working domain for all users

---

## 🆘 Troubleshooting

### **Common Issues:**

**"I don't see forwarding options"**
- Look for "URL Redirect" or "HTTP Redirect"
- Check under DNS management or domain settings
- Contact registrar support if not found

**"Changes aren't working"**
- Wait 4-48 hours for full propagation
- Clear browser cache and DNS cache
- Test from different devices/networks

**"Still getting SSL errors"**
- Verify redirect points to `https://spiralmalls.com` (with https)
- Check that 301 redirect type is selected
- Ensure no conflicting DNS records exist

---

## 📞 Need Help?

**GoDaddy Support:** 1-781-373-6808
**Namecheap Support:** Live chat available 24/7
**Generic Help:** Most registrars have 24/7 support chat

The key is finding the "Domain Forwarding" or "URL Redirect" feature in your registrar's control panel and setting up a 301 permanent redirect from spiralshops.com to https://spiralmalls.com.