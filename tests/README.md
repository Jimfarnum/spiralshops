# SPIRAL Platform Testing Suite

## Overview
Comprehensive testing infrastructure for the SPIRAL local commerce platform, including API testing, environment configurations, and automated validation.

## Directory Structure
```
tests/
├── postman/
│   ├── envs/              # Environment configurations
│   │   ├── development.json
│   │   └── production.json
│   └── collections/       # API test collections
│       ├── spiral-core-apis.json
│       └── spiral-admin-apis.json
└── README.md
```

## Test Environments

### Development Environment
- **Base URL**: `http://localhost:5000`
- **Admin Token**: Pre-configured for local testing
- **Investor Token**: `spiral-demo-2025-stonepath-67c9`

### Production Environment
- **Base URL**: Your deployed Replit URL
- **Tokens**: Reference environment variables for security

## Test Collections

### 1. SPIRAL Core APIs (`spiral-core-apis.json`)
Tests essential platform functionality:
- ✅ Health & System Status
- ✅ Investor Portal Authentication & Metrics
- ✅ Products & Inventory Management
- ✅ Store & Location Services
- ✅ AI Agents & SOAP G Central Brain

### 2. SPIRAL Admin APIs (`spiral-admin-apis.json`)
Tests administrative and authenticated endpoints:
- ✅ Self-Check System Validation
- ✅ Analytics & Business Intelligence
- ✅ Cross-Retailer Inventory System
- ✅ Fulfillment Network & Logistics

## Usage Instructions

### Import into Postman
1. Open Postman application
2. Click **Import** button
3. Select **File** tab
4. Import environment files from `tests/postman/envs/`
5. Import collection files from `tests/postman/collections/`
6. Select appropriate environment (Development/Production)

### Running Tests
1. **Individual Tests**: Click on any request and hit Send
2. **Collection Runner**: 
   - Click on collection name
   - Click **Run collection**
   - Select environment and run
3. **Automated Testing**: Set up Newman for CI/CD integration

### Key Test Scenarios

#### Investor Portal Testing
```bash
# Test with correct token
GET /api/investors/metrics?investor_token=spiral-demo-2025-stonepath-67c9

# Expected: 200 OK with KPIs and platform metrics
```

#### Platform Health Validation
```bash  
# System health check
GET /api/check

# Expected: 200 OK with "healthy" status
```

#### Cross-Retailer Search
```bash
# Search inventory across retailers
GET /api/cross-retailer/search?query=electronics&zip=55401

# Expected: 200 OK with aggregated results
```

## Test Validation

### Automatic Assertions
- Status code validation (200, 401, 500)
- Response structure validation
- Required field presence checks
- Data type validation

### Manual Verification Points
- ✅ All 7 SOAP G AI agents operational
- ✅ Database connections established
- ✅ Real-time metrics displaying correctly
- ✅ Authentication working for protected endpoints

## Troubleshooting

### Common Issues
1. **401 Unauthorized on Investor Portal**
   - Verify INVESTOR_TOKEN is correctly set in Replit Secrets
   - Ensure token matches exactly: `spiral-demo-2025-stonepath-67c9`

2. **Connection Refused**
   - Confirm SPIRAL platform is running (`npm run dev`)
   - Check port 5000 is accessible

3. **Database Errors**
   - Verify PostgreSQL connection in logs
   - Check DATABASE_URL environment variable

## Integration with CI/CD

### Newman Command Line
```bash
# Install Newman
npm install -g newman

# Run core API tests
newman run tests/postman/collections/spiral-core-apis.json \
  -e tests/postman/envs/development.json

# Run admin API tests  
newman run tests/postman/collections/spiral-admin-apis.json \
  -e tests/postman/envs/development.json
```

## Security Notes
- Production tokens stored as environment variables
- Development environment includes test credentials only
- All sensitive data excluded from version control
- Token validation implemented on all protected endpoints

## Next Steps
1. Fix INVESTOR_TOKEN format in Replit Secrets
2. Run comprehensive test suite validation
3. Set up automated testing in deployment pipeline
4. Add performance benchmarking tests

---
**Status**: Ready for comprehensive API testing and validation
**Last Updated**: August 14, 2025