# Get Your Cloudant Credentials for SPIRAL

**Status**: Your Cloudant-a1 database is created and provisioning  
**Next Step**: Get service credentials to connect SPIRAL  
**Time**: 2-3 minutes  

---

## 🔑 **STEP 1: ACCESS YOUR CLOUDANT SERVICE**

From your current IBM Cloud dashboard:

1. **Click on "Cloudant-a1"** (your database name in the list)
2. **Wait for status** to change from "In progress" to "Active" (1-2 minutes)
3. **Open the service** when ready

---

## 🎯 **STEP 2: CREATE SERVICE CREDENTIALS**

Once inside your Cloudant service:

1. **Look for tabs** across the top of the page
2. **Click "Service Credentials"** tab
3. **Click "New Credential"** (blue button)
4. **Configure**:
   - **Name**: `spiral-production-access`
   - **Role**: `Manager` (gives full read/write access)
   - **Service ID**: (leave default)
5. **Click "Add"**

---

## 📋 **STEP 3: COPY THE CREDENTIALS**

You'll see a JSON block that looks like this:
```json
{
  "apikey": "your-api-key-here-long-string",
  "host": "cloudant-a1-xxxx.cloudantnosqldb.appdomain.cloud", 
  "iam_apikey_description": "Auto-generated",
  "iam_apikey_name": "spiral-production-access",
  "iam_role_crn": "crn:v1:bluemix:public:iam...",
  "iam_serviceid_crn": "crn:v1:bluemix:public:iam-identity...",
  "password": "another-long-string-here",
  "port": 443,
  "url": "https://apikey:your-api-key@cloudant-a1-xxxx.cloudantnosqldb.appdomain.cloud",
  "username": "apikey"
}
```

**Copy this entire JSON** - you'll need these values for SPIRAL.

---

## ⚙️ **STEP 4: ADD TO SPIRAL ENVIRONMENT**

In your SPIRAL project, you'll add these to your `.env` file:

```bash
# IBM Cloudant Configuration for SPIRAL
CLOUDANT_URL=https://cloudant-a1-xxxx.cloudantnosqldb.appdomain.cloud
CLOUDANT_APIKEY=your-api-key-here-long-string
CLOUDANT_DATABASE=spiral_production
CLOUDANT_USERNAME=apikey
CLOUDANT_PASSWORD=another-long-string-here
```

---

## ✅ **VERIFICATION TEST**

Once you have the credentials, we can test the connection:

```bash
# Test command (replace with your actual values):
curl -X GET "https://your-host.cloudantnosqldb.appdomain.cloud/_all_dbs" \
  -u "apikey:your-api-key"
```

Should return: `["_replicator","_users"]`

---

## 🎯 **WHAT'S NEXT**

After you get the credentials:

1. ✅ **Copy JSON** from IBM Cloud
2. ✅ **Add to SPIRAL** environment variables  
3. ✅ **Test connection** to verify it works
4. ✅ **Deploy SPIRAL** to production with IBM backend

Your Cloudant Lite plan gives you:
- **1GB storage** (plenty for current scale)
- **20 reads/sec, 10 writes/sec** (handles thousands of users)
- **$0 cost forever** (true free tier)

---

**Ready**: Once you have those credentials, SPIRAL can connect to production IBM infrastructure and you'll be fully deployment-ready!

---

*Next: Get credentials from Service Credentials tab*