# SPIRAL IBM Cloud Deployment Guide

**Complete guide for deploying SPIRAL services to IBM Cloud with Cloudant database and Watson services**

---

## 🌐 **IBM Cloud Services Overview**

### Core Services Used by SPIRAL
- **IBM Cloudant**: Primary NoSQL database
- **IBM Watson Assistant**: AI chat functionality (optional)
- **IBM Watson Discovery**: Content search (optional)
- **IBM Cloud Kubernetes**: Container orchestration (optional)
- **IBM Cloud Object Storage**: File storage (optional)
- **Redis Cache**: Session storage (optional)

---

## 📋 **Step 1: IBM Cloud Account Setup**

### 1.1 Account Creation
1. Go to [cloud.ibm.com](https://cloud.ibm.com)
2. Sign up for IBM Cloud account
3. Verify email and complete profile
4. Choose appropriate pricing plan:
   - **Lite**: Free tier (limited usage)
   - **Pay-As-You-Go**: Production recommended
   - **Enterprise**: Large scale deployments

### 1.2 Install IBM Cloud CLI
```bash
# macOS
brew install ibm-cloud-cli

# Linux/Windows
curl -fsSL https://clis.cloud.ibm.com/install/linux | sh

# Verify installation
ibmcloud version
```

### 1.3 Login and Setup
```bash
# Login to IBM Cloud
ibmcloud login

# Target resource group
ibmcloud target -g default

# List available regions
ibmcloud regions
# Recommended: us-south, eu-gb, ap-north
```

---

## 🗄️ **Step 2: IBM Cloudant Database Setup**

### 2.1 Create Cloudant Instance
```bash
# Via CLI
ibmcloud resource service-instance-create spiral-cloudant cloudantnosqldb lite us-south

# Via Web Console
1. Go to IBM Cloud Dashboard
2. Click "Create Resource"
3. Search "Cloudant"
4. Configure:
   - Service name: spiral-cloudant
   - Plan: Lite (free) or Standard (production)
   - Region: us-south (recommended)
```

### 2.2 Create Service Credentials
```bash
# Create service credentials
ibmcloud resource service-key-create spiral-cloudant-key Manager --instance-name spiral-cloudant

# Get credentials
ibmcloud resource service-key spiral-cloudant-key
```

### 2.3 Database Configuration
```bash
# Access Cloudant dashboard
# URL format: https://[username].cloudantnosqldb.appdomain.cloud

# Create databases:
- spiral-retailers
- spiral-products  
- spiral-orders
- spiral-users
- spiral-sessions
```

### 2.4 Set Environment Variables
```bash
# For Vercel deployment, add these to environment variables:
CLOUDANT_URL=https://your-service.cloudantnosqldb.appdomain.cloud
CLOUDANT_APIKEY=your-cloudant-apikey
CLOUDANT_DB=spiral
IBM_CLOUDANT_URL=https://your-service.cloudantnosqldb.appdomain.cloud
IBM_CLOUDANT_API_KEY=your-cloudant-apikey
```

---

## 🤖 **Step 3: Watson Services Setup (Optional)**

### 3.1 Watson Assistant
```bash
# Create Watson Assistant instance
ibmcloud resource service-instance-create spiral-assistant conversation lite us-south

# Create credentials
ibmcloud resource service-key-create spiral-assistant-key Writer --instance-name spiral-assistant

# Environment variables
WATSON_ASSISTANT_URL=https://api.us-south.assistant.watson.cloud.ibm.com
WATSON_ASSISTANT_APIKEY=your-assistant-apikey
WATSON_ASSISTANT_ID=your-assistant-id
```

### 3.2 Watson Discovery
```bash
# Create Discovery instance
ibmcloud resource service-instance-create spiral-discovery discovery lite us-south

# Create credentials
ibmcloud resource service-key-create spiral-discovery-key Manager --instance-name spiral-discovery

# Environment variables
WATSON_DISCOVERY_URL=https://api.us-south.discovery.watson.cloud.ibm.com
WATSON_DISCOVERY_APIKEY=your-discovery-apikey
WATSON_DISCOVERY_ENVIRONMENT_ID=your-environment-id
```

---

## ☁️ **Step 4: Kubernetes Deployment (Optional)**

### 4.1 Create Kubernetes Cluster
```bash
# Create free cluster (1 worker node)
ibmcloud ks cluster create classic --name spiral-cluster --location dal10 --machine-type free --workers 1

# Or standard cluster (production)
ibmcloud ks cluster create classic --name spiral-cluster --location dal10 --machine-type b3c.4x16 --workers 3
```

### 4.2 Configure kubectl
```bash
# Get cluster configuration
ibmcloud ks cluster config --cluster spiral-cluster

# Verify connection
kubectl get nodes
```

### 4.3 Deploy SPIRAL to Kubernetes
```yaml
# spiral-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: spiral-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: spiral-app
  template:
    metadata:
      labels:
        app: spiral-app
    spec:
      containers:
      - name: spiral-app
        image: spiral/app:latest
        ports:
        - containerPort: 5000
        env:
        - name: CLOUDANT_URL
          valueFrom:
            secretKeyRef:
              name: spiral-secrets
              key: cloudant-url
        - name: CLOUDANT_APIKEY
          valueFrom:
            secretKeyRef:
              name: spiral-secrets
              key: cloudant-apikey
---
apiVersion: v1
kind: Service
metadata:
  name: spiral-service
spec:
  selector:
    app: spiral-app
  ports:
  - port: 80
    targetPort: 5000
  type: LoadBalancer
```

```bash
# Deploy application
kubectl apply -f spiral-deployment.yaml

# Check deployment status
kubectl get deployments
kubectl get pods
kubectl get services
```

---

## 📦 **Step 5: Object Storage Setup (Optional)**

### 5.1 Create Cloud Object Storage
```bash
# Create COS instance
ibmcloud resource service-instance-create spiral-storage cloud-object-storage lite global

# Create credentials
ibmcloud resource service-key-create spiral-storage-key Writer --instance-name spiral-storage
```

### 5.2 Configure Storage Buckets
```bash
# Create buckets via CLI or web interface
- spiral-uploads (user uploads)
- spiral-backups (database backups)
- spiral-assets (static assets)
```

### 5.3 Environment Variables
```bash
COS_ENDPOINT=https://s3.us-south.cloud-object-storage.appdomain.cloud
COS_API_KEY=your-cos-apikey
COS_INSTANCE_CRN=your-cos-instance-crn
COS_BUCKET_NAME=spiral-uploads
```

---

## 🔄 **Step 6: Redis Cache Setup (Optional)**

### 6.1 Create Redis Instance
```bash
# Via CLI
ibmcloud resource service-instance-create spiral-redis databases-for-redis standard us-south

# Get connection details
ibmcloud resource service-key-create spiral-redis-key Editor --instance-name spiral-redis
```

### 6.2 Configuration
```bash
# Environment variables
REDIS_URL=redis://username:password@hostname:port/database
REDIS_TLS_URL=rediss://username:password@hostname:port/database
```

---

## 🔒 **Step 7: Security Configuration**

### 7.1 IAM Policies
```bash
# Create service ID for application
ibmcloud iam service-id-create spiral-app-service

# Assign policies
ibmcloud iam service-policy-create spiral-app-service --roles Editor --service-name cloudantnosqldb
ibmcloud iam service-policy-create spiral-app-service --roles Writer --service-name conversation
```

### 7.2 API Key Management
```bash
# Create API key for service ID
ibmcloud iam service-api-key-create spiral-app-key spiral-app-service

# Store securely in environment variables
IBM_CLOUD_API_KEY=your-service-api-key
```

---

## 📊 **Step 8: Monitoring & Logging**

### 8.1 IBM Cloud Monitoring
```bash
# Create monitoring instance
ibmcloud resource service-instance-create spiral-monitoring monitoring standard us-south

# Configure dashboards for:
- Database performance
- API response times
- Error rates
- Resource usage
```

### 8.2 Log Analysis
```bash
# Create log analysis instance
ibmcloud resource service-instance-create spiral-logs logdna 7-day us-south

# Configure log streaming from:
- Cloudant database
- Application logs
- Watson services
```

---

## 🧪 **Step 9: Testing IBM Cloud Integration**

### 9.1 Database Connectivity Test
```bash
# Test Cloudant connection
curl -X GET "https://your-service.cloudantnosqldb.appdomain.cloud/_all_dbs" \
  -H "Authorization: Bearer $CLOUDANT_APIKEY"

# Expected response: ["_replicator","_users","spiral","spiral-retailers",...]
```

### 9.2 Watson Services Test
```bash
# Test Watson Assistant
curl -X POST "https://api.us-south.assistant.watson.cloud.ibm.com/instances/$WATSON_ASSISTANT_ID/v2/assistants/$ASSISTANT_ID/sessions" \
  -H "Authorization: Bearer $WATSON_APIKEY" \
  -H "Content-Type: application/json"
```

### 9.3 Integration Test
```javascript
// Test from SPIRAL application
const testIBMConnection = async () => {
  try {
    // Test Cloudant
    const storesResponse = await fetch('/api/stores');
    console.log('Cloudant connection:', storesResponse.status === 200 ? 'OK' : 'Failed');
    
    // Test Watson (if enabled)
    const chatResponse = await fetch('/api/watson/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Hello' })
    });
    console.log('Watson connection:', chatResponse.status === 200 ? 'OK' : 'Failed');
    
  } catch (error) {
    console.error('IBM Cloud integration test failed:', error);
  }
};
```

---

## 🔧 **Step 10: Data Migration**

### 10.1 Seed Data Upload
```bash
# Upload initial data to Cloudant
# Use the backup script to populate databases

node scripts/backup-cloudant.mjs --restore --source=seed/

# Or via Cloudant dashboard bulk import
```

### 10.2 Data Validation
```bash
# Verify data integrity
curl "https://your-service.cloudantnosqldb.appdomain.cloud/spiral-retailers/_all_docs?include_docs=true" \
  -H "Authorization: Bearer $CLOUDANT_APIKEY"

# Check document counts match expectations
```

---

## 💰 **Step 11: Cost Management**

### 11.1 Monitor Usage
```bash
# Check current usage
ibmcloud billing account-usage

# Set spending notifications
ibmcloud billing account-notifications-create --threshold 100 --email your-email@domain.com
```

### 11.2 Optimize Costs
- Use Lite plans for development
- Monitor database read/write operations
- Implement caching to reduce API calls
- Set up automatic scaling policies
- Review and cleanup unused resources monthly

---

## 📈 **Step 12: Production Optimization**

### 12.1 Performance Tuning
```bash
# Cloudant optimization
- Create appropriate indexes
- Optimize query patterns
- Use bulk operations
- Implement proper caching

# Watson optimization  
- Train models with production data
- Optimize conversation flows
- Implement response caching
```

### 12.2 Scaling Configuration
```yaml
# Kubernetes auto-scaling
apiVersion: autoscaling/v1
kind: HorizontalPodAutoscaler
metadata:
  name: spiral-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: spiral-app
  minReplicas: 3
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70
```

---

## 🚨 **Troubleshooting**

### Common Issues

#### Cloudant Connection Errors
```bash
# Check service status
ibmcloud resource service-instances --service-name cloudantnosqldb

# Verify credentials
curl -X GET "https://your-service.cloudantnosqldb.appdomain.cloud" \
  -H "Authorization: Bearer $CLOUDANT_APIKEY"

# Common solutions:
- Regenerate API key
- Check regional endpoints
- Verify IAM permissions
```

#### Watson Service Issues
```bash
# Check service availability
ibmcloud resource service-instances --service-name conversation

# Test API endpoint
curl -X GET "https://api.us-south.assistant.watson.cloud.ibm.com/v2/assistants" \
  -H "Authorization: Bearer $WATSON_APIKEY"
```

### Recovery Procedures
```bash
# Database backup/restore
ibmcloud cdb backups --service-instance spiral-cloudant
ibmcloud cdb backup-restore --backup-id [backup-id] --target-instance spiral-cloudant-new

# Service instance recovery
ibmcloud resource service-instance-update spiral-cloudant --service-plan-id [new-plan-id]
```

---

## ✅ **IBM Cloud Deployment Checklist**

### Core Services
- [ ] IBM Cloudant database created and configured
- [ ] Service credentials generated and secured
- [ ] Databases created (retailers, products, orders, users)
- [ ] Connection tested from application

### Optional Services
- [ ] Watson Assistant configured (if using AI chat)
- [ ] Watson Discovery set up (if using content search)
- [ ] Cloud Object Storage provisioned (if storing files)
- [ ] Redis cache configured (if using session caching)
- [ ] Kubernetes cluster deployed (if using containers)

### Security & Monitoring
- [ ] IAM policies configured
- [ ] API keys secured in environment variables
- [ ] Monitoring dashboards created
- [ ] Log analysis configured
- [ ] Cost notifications set up

### Integration Testing
- [ ] Database connectivity verified
- [ ] Watson services tested (if applicable)
- [ ] API endpoints responding correctly
- [ ] Performance benchmarks met
- [ ] Error handling working properly

---

## 🎉 **Deployment Success**

**SPIRAL is now fully integrated with IBM Cloud services!**

### Production URLs
- **Cloudant Dashboard**: https://your-service.cloudantnosqldb.appdomain.cloud/_utils
- **Watson Assistant**: https://cloud.ibm.com/services/conversation/instances
- **Monitoring**: https://cloud.ibm.com/observe/monitoring

### Next Steps
1. Monitor performance and usage
2. Optimize costs based on actual usage patterns
3. Scale services as user base grows
4. Implement disaster recovery procedures
5. Regular security reviews and updates

---

*Last Updated: August 9, 2025*  
*Next Review: Monthly optimization review*