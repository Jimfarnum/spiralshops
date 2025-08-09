# How to Get IBM Cloudant Credentials for SPIRAL

**Goal**: Get your IBM Cloudant database credentials for production deployment
**Time**: 10-15 minutes setup
**Cost**: Free tier available, ~$25-50/month for production usage

---

## 🚀 **STEP 1: CREATE IBM CLOUD ACCOUNT**

### 1.1 Sign Up for IBM Cloud
1. Go to [cloud.ibm.com](https://cloud.ibm.com)
2. Click "Create an IBM Cloud account"
3. Use your business email for the account
4. Verify email and complete profile setup
5. Choose "Pay-As-You-Go" or "Lite" plan

### 1.2 Access IBM Cloud Console
1. Login to IBM Cloud console
2. Navigate to the main dashboard
3. Look for "Create resource" or "Catalog" button

---

## 📊 **STEP 2: CREATE CLOUDANT DATABASE SERVICE**

### 2.1 Find Cloudant in Catalog
1. Click "Catalog" in top navigation
2. Search for "Cloudant"
3. Click on "Cloudant" service
4. Or go directly to: https://cloud.ibm.com/catalog/services/cloudant

### 2.2 Configure Cloudant Instance
**Service Configuration:**
- **Service name**: `spiral-production-db` (or your preferred name)
- **Region**: Choose closest to your users (US East, US South, EU, etc.)
- **Plan**: 
  - **Lite** (Free): Good for testing, 1GB storage
  - **Standard** (Paid): Production use, starts ~$25/month
- **Authentication**: IAM (default, recommended)

### 2.3 Create Service Instance
1. Review configuration
2. Click "Create"
3. Wait for provisioning (2-3 minutes)

---

## 🔑 **STEP 3: GET CREDENTIALS**

### 3.1 Access Service Instance
1. Go to IBM Cloud dashboard
2. Click "Resource list" in left menu
3. Find your Cloudant service under "Services"
4. Click on the service name

### 3.2 Generate Service Credentials
1. In the Cloudant service page, click "Service credentials"
2. Click "New credential" button
3. **Credential name**: `spiral-production-credentials`
4. **Role**: Manager (full access needed)
5. Click "Add"

### 3.3 Copy Credentials
Click "View credentials" and copy these values:
```json
{
  "apikey": "your-actual-apikey-here",
  "host": "your-service-name.cloudantnosqldb.appdomain.cloud",
  "iam_apikey_description": "Auto-generated for key...",
  "iam_apikey_name": "spiral-production-credentials",
  "iam_role_crn": "crn:v1:bluemix:public:iam::::serviceRole:Manager",
  "iam_serviceid_crn": "crn:v1:bluemix:public:iam...",
  "url": "https://your-service-name.cloudantnosqldb.appdomain.cloud",
  "username": "your-service-name"
}
```

---

## 🛠️ **STEP 4: CONFIGURE ENVIRONMENT VARIABLES**

### 4.1 Extract Key Values
From the credentials JSON, you need:
- **CLOUDANT_URL**: The "url" field
- **CLOUDANT_APIKEY**: The "apikey" field
- **CLOUDANT_DB**: Choose database name (use "spiral")

### 4.2 Environment Variables Format
```bash
CLOUDANT_URL=https://your-service-name.cloudantnosqldb.appdomain.cloud
CLOUDANT_APIKEY=your-actual-apikey-from-credentials
CLOUDANT_DB=spiral
```

**Example** (with fake credentials):
```bash
CLOUDANT_URL=https://a1b2c3d4-1234-5678-9abc-def123456789-bluemix.cloudantnosqldb.appdomain.cloud
CLOUDANT_APIKEY=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-
CLOUDANT_DB=spiral
```

---

## 🗄️ **STEP 5: CREATE DATABASE**

### 5.1 Access Cloudant Dashboard
1. In your Cloudant service page, click "Launch Cloudant Dashboard"
2. Or go directly to your Cloudant URL in browser
3. Login with IBM Cloud credentials

### 5.2 Create SPIRAL Database
1. Click "Create Database" 
2. **Database name**: `spiral`
3. **Partitioned**: No (leave unchecked for SPIRAL)
4. Click "Create"

### 5.3 Verify Database Creation
- Database "spiral" should appear in your database list
- Status should show as "Active"
- Ready to receive data from SPIRAL platform

---

## 📋 **STEP 6: TEST CONNECTION**

### 6.1 Test API Access
Using curl or browser:
```bash
curl -H "Authorization: Bearer $CLOUDANT_APIKEY" \
     https://your-service-name.cloudantnosqldb.appdomain.cloud/spiral
```

Should return database info JSON.

### 6.2 Test from SPIRAL
Add your credentials to environment and restart:
```bash
CLOUDANT_URL=https://your-actual-url
CLOUDANT_APIKEY=your-actual-apikey
CLOUDANT_DB=spiral
```

Check server logs for successful connection.

---

## 💰 **PRICING INFORMATION**

### **Lite Plan (Free)**
- **Storage**: 1 GB
- **Requests**: 20 lookups/sec, 10 writes/sec
- **Best for**: Development and testing
- **Good for**: SPIRAL demo and initial launch

### **Standard Plan (Production)**
- **Base cost**: ~$25/month minimum
- **Storage**: $1.00 per GB/month
- **Requests**: $0.25 per 100 requests
- **Calculations**: $0.50 per 100 calculations
- **Best for**: Production SPIRAL deployment

### **SPIRAL Usage Estimate**
- **Storage**: ~2-5 GB (stores, products, orders, users)
- **Monthly cost**: ~$25-75/month for typical usage
- **Scaling**: Grows with your platform usage

---

## 🔒 **SECURITY BEST PRACTICES**

### **API Key Security**
- Never commit API keys to code repositories
- Use environment variables only
- Rotate keys regularly (quarterly recommended)
- Use IAM roles with minimum required permissions

### **Database Security**
- Enable CORS only for your domains
- Use HTTPS for all connections
- Implement proper authentication in SPIRAL
- Regular security audits of database access

### **Network Security**
- Cloudant uses TLS 1.2+ encryption
- All data encrypted in transit and at rest
- IBM Cloud security compliance (SOC 2, ISO 27001)

---

## 🚀 **DEPLOYMENT INTEGRATION**

### **For Replit Deployment**
1. Get Cloudant credentials (above steps)
2. Click Deploy in Replit
3. Add environment variables:
   - CLOUDANT_URL
   - CLOUDANT_APIKEY  
   - CLOUDANT_DB
4. Deploy - database connects automatically

### **For Vercel Deployment**
1. Get Cloudant credentials (above steps)
2. Use Vercel CLI:
```bash
vercel env add CLOUDANT_URL
vercel env add CLOUDANT_APIKEY
vercel env add CLOUDANT_DB
vercel --prod
```

---

## ❓ **COMMON ISSUES & SOLUTIONS**

### **"Authentication failed" errors**
- Verify CLOUDANT_APIKEY is complete and correct
- Check IAM role has Manager permissions
- Ensure no extra spaces in environment variables

### **"Database not found" errors**  
- Create "spiral" database in Cloudant dashboard
- Verify CLOUDANT_DB=spiral exactly
- Check database name spelling

### **Connection timeout errors**
- Verify CLOUDANT_URL is complete with https://
- Check network connectivity
- Try different IBM Cloud region if needed

---

## 📞 **SUPPORT RESOURCES**

### **IBM Cloud Support**
- Documentation: https://cloud.ibm.com/docs/Cloudant
- Support tickets: Available through IBM Cloud console
- Community forums: IBM Developer community

### **SPIRAL Integration Help**
- Check server/storage.ts for Cloudant integration code
- Verify environment variables in deployment settings
- Test connection with /api/health endpoint

---

**Next Step**: Create your IBM Cloud account at [cloud.ibm.com](https://cloud.ibm.com) and follow Step 1 above.

---

*Total time: 10-15 minutes active work + database provisioning time*