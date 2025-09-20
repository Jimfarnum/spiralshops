# 🌐 GoDaddy DNS Records for spiralmalls.com → Replit

## DNS Records to Add in GoDaddy

### Step 1: Login to GoDaddy
1. Go to [GoDaddy.com](https://godaddy.com)
2. Sign in → My Products → DNS
3. Click "Manage" next to spiralmalls.com

### Step 2: Add These DNS Records

#### A Record (Main Domain)
```
Type: A
Host: @ (or leave blank)
Points to: [Replit will provide this IP address after deployment]
TTL: 1 Hour
```

#### TXT Record (Domain Verification)
```
Type: TXT  
Host: @ (or leave blank)
Value: [Replit will provide this verification code after deployment]
TTL: 1 Hour
```

#### CNAME Record (WWW Subdomain)
```
Type: CNAME
Host: www
Points to: [Your Replit deployment URL - ends in .replit.app]
TTL: 1 Hour
```

## How to Get the Actual Values

**After you deploy your SPIRAL app on Replit:**

1. **Deploy First:**
   - Click "Deploy" button in your Replit workspace
   - Choose "Autoscale" for production
   - Wait for deployment to complete

2. **Get DNS Records:**
   - Go to Deployments tab → Settings
   - Click "Link a domain" 
   - Enter: `spiralmalls.com`
   - Replit will display the exact DNS records

3. **Example of what Replit will show:**
   ```
   A Record: 
   Host: @
   Value: 35.227.xxx.xxx (actual IP address)
   
   TXT Record:
   Host: @  
   Value: replit-domain-verification=abc123xyz456 (actual verification code)
   
   CNAME Record:
   Host: www
   Value: your-app-name.replit.app (actual deployment URL)
   ```

## Complete GoDaddy Setup Process

### Remove Old Records First:
- Delete any existing A records pointing to old hosting
- Delete any CNAME records that conflict
- Keep MX records (for email) if using GoDaddy email

### Add New Records:
1. **Add A Record** with Replit's IP address
2. **Add TXT Record** with Replit's verification code  
3. **Add CNAME Record** for www subdomain
4. **Save all changes**

### Verify Setup:
1. Return to Replit deployment settings
2. Click "Verify Domain"
3. Wait for verification (few minutes)
4. Test both spiralmalls.com and www.spiralmalls.com

## Timeline Expectations

- **DNS changes visible:** 15 minutes - 2 hours
- **Full propagation:** Up to 48 hours  
- **Most users see changes:** 4-6 hours
- **SSL certificate:** Automatic (provided by Replit)

## What You Need to Do Right Now

1. **Deploy your SPIRAL app** on Replit first
2. **Get the DNS records** from Replit deployment settings
3. **Add those specific records** to GoDaddy DNS management
4. **Wait for propagation** and verification

The exact IP address and verification code will be provided by Replit after you deploy your app.