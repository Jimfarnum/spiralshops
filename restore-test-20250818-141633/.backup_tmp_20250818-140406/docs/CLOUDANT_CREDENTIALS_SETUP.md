# Cloudant Credentials Integration for SPIRAL

**Status**: Database found in IBM Cloud resources  
**Next**: Extract service credentials and integrate with SPIRAL  

---

## 🔑 **GETTING YOUR CREDENTIALS**

Once you access your Cloudant database:

### **Step 1: Open Your Database**
- Click on your Cloudant database name from the list
- Wait for the service dashboard to load

### **Step 2: Access Service Credentials**
- Look for **"Service Credentials"** in the left navigation
- Click on **"Service Credentials"**

### **Step 3: View or Create Credentials**
- If credentials exist: Click **"View"** to see the JSON
- If no credentials: Click **"New Credential"** then **"Add"**

### **Step 4: Copy the JSON**
You'll see credentials like:
```json
{
  "apikey": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "host": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx-bluemix.cloudantnosqldb.appdomain.cloud",
  "iam_apikey_description": "Auto-generated for key",
  "iam_apikey_name": "Service credentials",
  "iam_role_crn": "crn:v1:bluemix:public:iam::::serviceRole:Manager",
  "iam_serviceid_crn": "crn:v1:bluemix:public:iam-identity::a/xxxxxxxxx::serviceid:ServiceId-xxxxxxxx",
  "password": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "port": 443,
  "url": "https://xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx-bluemix:XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx-bluemix.cloudantnosqldb.appdomain.cloud",
  "username": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx-bluemix"
}
```

---

## ⚙️ **SPIRAL INTEGRATION PROCESS**

### **Values SPIRAL Needs:**
- **CLOUDANT_URL**: Use the `url` field
- **CLOUDANT_APIKEY**: Use the `apikey` field  
- **CLOUDANT_HOST**: Use the `host` field
- **CLOUDANT_USERNAME**: Use the `username` field
- **CLOUDANT_PASSWORD**: Use the `password` field

### **Environment Configuration:**
```bash
# IBM Cloudant Production Database
CLOUDANT_URL=https://your-service.cloudantnosqldb.appdomain.cloud
CLOUDANT_APIKEY=your-api-key-here
CLOUDANT_DB=spiral_production
CLOUDANT_HOST=your-host.cloudantnosqldb.appdomain.cloud
CLOUDANT_USERNAME=your-username
CLOUDANT_PASSWORD=your-password
```

---

## 🚀 **IMMEDIATE INTEGRATION**

Once you provide the credentials, SPIRAL will:

1. **Connect** to IBM Cloudant production database
2. **Initialize** required collections (users, stores, products, orders)
3. **Migrate** from development to production data structure
4. **Verify** connection with health checks
5. **Enable** enterprise-grade scalability

---

## ✅ **PRODUCTION READINESS CHECKLIST**

After Cloudant integration:
- ✅ IBM Cloud database backend
- ✅ Enterprise authentication 
- ✅ Unlimited scaling capacity
- ✅ Geographic data replication
- ✅ 99.99% uptime SLA
- ✅ Production security compliance

---

**Ready**: Copy your JSON credentials when you access the Service Credentials section.

---

*Next: Paste credentials for immediate SPIRAL-IBM integration*