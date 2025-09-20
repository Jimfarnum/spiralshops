# SPIRAL Platform - IBM Code Engine Deployment Guide

## Overview
This guide walks you through deploying your SPIRAL platform from Replit development to IBM Code Engine production using the recommended hybrid approach.

## Prerequisites

1. **IBM Cloud Account** with Code Engine service enabled
2. **IBM Cloud CLI** installed locally
3. **Docker** (optional, Code Engine can build from source)
4. **Git** for source code management

## Deployment Strategy

**Development**: Continue using Replit for development and testing  
**Production**: Deploy to IBM Code Engine for enterprise-scale hosting

### Benefits
- ✅ Keep excellent Replit development experience
- ✅ Enterprise-grade auto-scaling (0-10 instances based on demand)
- ✅ Cost optimization (pay only for usage, scales to zero when idle)
- ✅ Seamless IBM Cloud services integration
- ✅ Production-ready security and compliance

## Step 1: Install IBM Cloud CLI

```bash
# Install IBM Cloud CLI (choose your platform)
# macOS
brew install ibmcloud-cli

# Linux
curl -fsSL https://clis.cloud.ibm.com/install/linux | sh

# Windows
# Download from: https://cloud.ibm.com/docs/cli
```

## Step 2: Login and Setup

```bash
# Login to IBM Cloud
ibmcloud login

# Install Code Engine plugin
ibmcloud plugin install code-engine

# Set target region
ibmcloud target -r us-south
```

## Step 3: Build Your Application

In your Replit environment:

```bash
# Build the application
npm run build

# Verify build output
ls -la dist/index.js  # Should be ~1.8MB
```

## Step 4: Deploy to IBM Code Engine

Make the deployment script executable and run:

```bash
chmod +x deploy-to-ibm.sh
./deploy-to-ibm.sh production
```

## Step 5: Configure Secrets

Run the secrets setup script to configure your API keys and database connections:

```bash
chmod +x setup-ibm-secrets.sh
./setup-ibm-secrets.sh
```

This will prompt you for:
- Database URL (PostgreSQL)
- OpenAI API Key
- Stripe keys
- Watson API credentials
- Cloudant configuration

## Step 6: Verify Deployment

1. **Check Application Status**:
   ```bash
   ibmcloud ce app get --name spiral-platform
   ```

2. **View Logs**:
   ```bash
   ibmcloud ce app logs --name spiral-platform
   ```

3. **Test Health Endpoint**:
   ```bash
   curl https://your-app-url.us-south.codeengine.appdomain.cloud/api/check
   ```

## Monitoring and Management

- **IBM Cloud Dashboard**: https://cloud.ibm.com/codeengine/projects
- **Application Metrics**: Auto-scaling, request volume, response times
- **Cost Monitoring**: Real-time usage and billing information

## Development Workflow

1. **Develop on Replit**: Continue using your current development setup
2. **Test Locally**: Use your existing `npm run dev` workflow
3. **Build**: Run `npm run build` to create production assets
4. **Deploy**: Run `./deploy-to-ibm.sh` to push to production
5. **Monitor**: Check IBM Cloud dashboard for performance metrics

## Auto-scaling Configuration

Your application is configured to:
- **Scale to zero** when no traffic (cost-efficient)
- **Auto-scale up** to 10 instances based on demand
- **Target 70% CPU utilization** per instance
- **Handle 100 concurrent requests** per instance

## Environment Differences

| Feature | Replit Development | IBM Code Engine Production |
|---------|-------------------|---------------------------|
| Scaling | Fixed single instance | Auto-scale 0-10 instances |
| Cost | Fixed monthly | Pay-per-use |
| Performance | Development-focused | Production-optimized |
| IBM Services | External API calls | Native integration |
| SSL/TLS | Replit-managed | IBM-managed |
| Monitoring | Basic logging | Enterprise metrics |

## Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Ensure `dist/index.js` exists after `npm run build`
   - Check Node.js version compatibility (using Node 20)

2. **Application Not Starting**:
   - Verify health check endpoint `/api/check` is working
   - Check environment variables are set correctly

3. **Scaling Issues**:
   - Monitor CPU/memory usage in IBM dashboard
   - Adjust resource limits if needed

### Support Commands:

```bash
# View detailed app info
ibmcloud ce app get --name spiral-platform --output yaml

# Check resource usage
ibmcloud ce app events --name spiral-platform

# View application logs
ibmcloud ce app logs --name spiral-platform --tail
```

## Next Steps

After successful deployment:

1. **Setup Custom Domain** (optional)
2. **Configure CI/CD Pipeline** for automated deployments
3. **Setup Monitoring Alerts** for production issues
4. **Performance Optimization** based on usage metrics

Your SPIRAL platform is now running on enterprise-grade infrastructure while maintaining your efficient Replit development workflow!