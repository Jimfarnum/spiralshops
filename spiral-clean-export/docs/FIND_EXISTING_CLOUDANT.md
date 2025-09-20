# Find Your Existing Cloudant Database

**Status**: Database likely created successfully  
**Issue**: IBM showing "only one account" limit  
**Solution**: Find and access your existing Cloudant database  

---

## 🔍 **FIND YOUR CLOUDANT DATABASE**

### **Method 1: Resource List**
Go to your IBM Cloud resource list:
- **URL**: `https://cloud.ibm.com/resources`
- **Or**: Dashboard → "View resources" 
- **Look for**: "Cloudant-a1" or similar database name
- **Status**: Should show "Active" or "Provisioned"

### **Method 2: Dashboard Navigation**
From IBM Cloud dashboard:
1. Look for **"Resource summary"** section
2. Click **"Services"** or **"Databases"** 
3. Find your Cloudant instance
4. Click on it to access

### **Method 3: Direct Services Page**
- **URL**: `https://cloud.ibm.com/services`
- Shows all your active services
- Look for Cloudant database

---

## ✅ **WHAT TO LOOK FOR**

Your database should appear as:
- **Name**: "Cloudant-a1" (or whatever you named it)
- **Service**: "Cloudant" 
- **Status**: "Active" or "Running"
- **Region**: "Washington DC"
- **Plan**: "Lite"

---

## 🔑 **GET SERVICE CREDENTIALS**

Once you find your Cloudant database:

1. **Click on the database name** to open it
2. **Click "Service Credentials"** tab (left sidebar)
3. **Click "New Credential"** if none exist
4. **Copy the JSON credentials** that appear

The credentials will look like:
```json
{
  "apikey": "your-api-key-here",
  "host": "cloudant-a1-xxx.cloudantnosqldb.appdomain.cloud",
  "url": "https://apikey:key@host.cloudant...",
  "username": "apikey",
  "password": "password-here"
}
```

---

## 🚨 **IF DATABASE DOESN'T EXIST**

If you don't see any Cloudant database:
- The creation might have failed silently
- Try creating again with a different name like "spiral-db"
- The "one account" error might be about billing, not databases

---

## 📝 **NEXT STEPS**

1. ✅ **Find** your existing Cloudant database
2. ✅ **Access** the service credentials 
3. ✅ **Copy** the JSON credentials
4. ✅ **Add** to SPIRAL environment variables
5. ✅ **Test** the connection

---

**Quick link to check**: `https://cloud.ibm.com/resources`

---

*Your database likely exists - IBM Lite plans allow one free Cloudant instance per account*