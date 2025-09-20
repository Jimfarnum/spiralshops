# Creating New IBM Cloud Account for SPIRAL

**Situation**: You deleted your previous IBM account and need to create a new one  
**Goal**: Fresh IBM Cloud account setup for spiralshops.com  
**Time**: 10-15 minutes  

---

## 🚀 **STEP 1: CREATE NEW IBM CLOUD ACCOUNT**

### **Go to IBM Cloud Registration**
1. **Visit**: https://cloud.ibm.com/registration
2. **Use business email**: Your spiralshops.com email (or business email)
3. **Complete registration form**:
   - First/Last Name
   - Business Email
   - Strong Password
   - Phone Number (for verification)

### **Account Verification**
1. **Check email** for verification link
2. **Click verification link** 
3. **Complete phone verification** (SMS code)
4. **Accept terms and conditions**

### **Choose Account Type**
- **Select**: "Pay-As-You-Go" account
- **Benefits**: Free tier access + ability to scale
- **No credit card required** for free tier services

---

## 🎯 **STEP 2: IMMEDIATE CLOUDANT SETUP**

### **Access IBM Cloud Console**
1. **Login** to your new account
2. **Navigate** to main dashboard
3. **Look for**: "Catalog" or "Create Resource" button

### **Create Cloudant Database**
1. **Click**: "Catalog" in top navigation
2. **Search**: "Cloudant" 
3. **Select**: "Cloudant" service
4. **Configure**:
   - **Service name**: "spiral-production-db"
   - **Region**: "US East" or "US South" (closest to users)
   - **Plan**: "Lite" (FREE - 1GB storage, forever)
   - **Authentication**: "IAM" (default)

### **Create Service**
1. **Review** configuration
2. **Click**: "Create"
3. **Wait** 2-3 minutes for provisioning

---

## 🔑 **STEP 3: GET CREDENTIALS**

### **Access Your Cloudant Service**
1. **Go to**: IBM Cloud Dashboard
2. **Click**: "Resource List" in left menu
3. **Find**: Your Cloudant service under "Services"
4. **Click**: Service name to open

### **Generate Service Credentials**
1. **Click**: "Service Credentials" tab
2. **Click**: "New Credential" button
3. **Name**: "spiral-production-access"
4. **Role**: "Manager" (full access)
5. **Click**: "Add"

### **Copy Credentials**
You'll get JSON like this:
```json
{
  "apikey": "your-api-key-here",
  "host": "your-host.cloudantnosqldb.appdomain.cloud",
  "iam_apikey_description": "Auto-generated for key spiral-production-access",
  "iam_apikey_name": "spiral-production-access",
  "iam_role_crn": "crn:v1:bluemix:public:iam::::serviceRole:Manager",
  "iam_serviceid_crn": "crn:v1:bluemix:public:iam-identity::a/...",
  "password": "your-password",
  "port": 443,
  "url": "https://apikey:your-api-key@your-host.cloudantnosqldb.appdomain.cloud",
  "username": "apikey"
}
```

---

## ⚙️ **STEP 4: CONFIGURE SPIRAL**

### **Add to Environment Variables**
In your SPIRAL project, update `.env` file:
```bash
# IBM Cloudant Configuration
CLOUDANT_URL=https://your-host.cloudantnosqldb.appdomain.cloud
CLOUDANT_APIKEY=your-api-key-here
CLOUDANT_DATABASE=spiral_production
CLOUDANT_USERNAME=apikey
CLOUDANT_PASSWORD=your-password
```

### **Test Connection**
```bash
# Test from terminal:
curl -X GET "https://your-host.cloudantnosqldb.appdomain.cloud/_all_dbs" \
  -u "apikey:your-api-key"
```

Should return: `["_replicator","_users"]`

---

## 💰 **FREE TIER BENEFITS**

### **Cloudant Lite Plan (FREE Forever)**
- **Storage**: 1GB
- **Reads**: 20 per second
- **Writes**: 10 per second
- **No time limit** - free forever
- **Perfect for SPIRAL's current scale**

### **Cost Projections**
- **Current usage**: $0/month (well within free tier)
- **1K users**: Still $0/month
- **10K users**: ~$5-15/month (if you exceed free tier)

---

## 🔐 **SECURITY SETUP**

### **Enable 2-Factor Authentication**
1. **Go to**: Account Settings
2. **Enable**: "Multi-factor authentication"
3. **Use**: Authenticator app (Google Authenticator, etc.)

### **API Key Security**
- **Store** credentials in environment variables only
- **Never** commit to code repository
- **Rotate** keys every 90 days
- **Use** least-privilege access

---

## ✅ **VERIFICATION CHECKLIST**

After setup, verify these work:
- [ ] Can login to IBM Cloud dashboard
- [ ] Cloudant service shows "Active" status
- [ ] Service credentials generated successfully
- [ ] Can connect to database via API
- [ ] SPIRAL can read/write to Cloudant

---

## 🚨 **COMMON ISSUES & SOLUTIONS**

### **"Service limit exceeded"**
- **Cause**: Too many free services
- **Solution**: Delete unused services or upgrade account

### **"Authentication failed"**
- **Cause**: Wrong API key format
- **Solution**: Use the full `url` field from credentials

### **"Database not found"**
- **Cause**: Database doesn't exist yet
- **Solution**: SPIRAL will auto-create on first run

---

## 📞 **NEXT STEPS**

### **Immediate (Today)**
1. ✅ Create new IBM account
2. ✅ Setup Cloudant Lite service
3. ✅ Get service credentials
4. ✅ Add to SPIRAL environment

### **This Week**
1. **Test** database connection from SPIRAL
2. **Import** existing data to Cloudant
3. **Run** production tests
4. **Deploy** to production

### **Optional Enhancements**
1. **Add** Watson Assistant for AI features
2. **Setup** monitoring/alerts
3. **Configure** backup strategies
4. **Plan** scaling thresholds

---

**Bottom Line**: Your fresh IBM account gives you a clean start with full free tier benefits. The Cloudant Lite plan will handle SPIRAL's needs for months at zero cost while you grow the platform.

---

*Created: August 10, 2025*