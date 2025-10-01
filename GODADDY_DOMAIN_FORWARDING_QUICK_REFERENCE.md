# 🔧 GoDaddy Priority Value Issue - Quick Fix

## Problem: GoDaddy Asking for Priority Value

When GoDaddy asks for a "priority value," it means you accidentally selected **MX record** instead of **CNAME record**.

## Quick Fix

### **Step 1: Check Record Type**
- Make sure you selected **"CNAME"** from the dropdown
- NOT "MX" or "A" or any other type
- **CNAME records do NOT need priority values**

### **Step 2: Correct Form Fields**
For spiralshops.com CNAME records:

**Record 1:**
```
Type: CNAME (select from dropdown)
Host/Name: @
Points to/Value: 27d4f357-044c-4271-84d2-b2bf67be7115-00-18jv7lspv4am.janeway.replit.dev
TTL: 1 Hour
Priority: [Leave blank - should not appear for CNAME]
```

**Record 2:**
```
Type: CNAME (select from dropdown)  
Host/Name: www
Points to/Value: 27d4f357-044c-4271-84d2-b2bf67be7115-00-18jv7lspv4am.janeway.replit.dev
TTL: 1 Hour
Priority: [Leave blank - should not appear for CNAME]
```

## GoDaddy Interface Tips

### **If Priority Field Appears:**
1. **Go back** and verify record type is **CNAME**
2. **Refresh the page** if needed
3. **Start over** with adding the record

### **Common GoDaddy Interface Issues:**
- Sometimes defaults to MX record type
- May show priority field by mistake
- Page might need refresh to show correct fields

### **Correct CNAME Form Should Show:**
- Record Type: CNAME (dropdown)
- Host/Name: (text field)
- Points to/Value: (text field)
- TTL: (dropdown)
- **NO Priority field**

## Alternative: Use Domain Forwarding

### **If CNAME Won't Work:**
Use GoDaddy's domain forwarding feature instead:

1. Go to **Domain Forwarding** section (not DNS)
2. **Forward spiralshops.com** to: `https://spiralmalls.com`
3. **Redirect type**: 301 (Permanent)
4. **Keep path**: Yes

This achieves the same result - users typing spiralshops.com get redirected to spiralmalls.com.

## Verification

### **After Adding Records:**
- No priority values should be saved
- Records should show as CNAME type
- Wait 15-30 minutes for DNS propagation
- Test https://spiralshops.com

## Troubleshooting

### **If Still Seeing Priority Field:**
- Clear browser cache
- Try different browser
- Contact GoDaddy support
- Use domain forwarding as alternative

The key is making sure you select **CNAME** record type, which should never ask for priority values.