# SPIRAL Testing Environment Configurations

## Overview
Pre-configured Postman environments for comprehensive SPIRAL platform testing across development and production environments.

## Environment Files

### `development.json`
- **Base URL**: `http://localhost:5000`
- **Admin Token**: Pre-configured for local testing
- **Investor Token**: `spiral-demo-2025-stonepath-67c9`
- **Usage**: Local development and feature validation

### `production.json`  
- **Base URL**: Your deployed Replit URL
- **Tokens**: Reference environment variables for security
- **Usage**: Production deployment testing

## Quick Testing
Run the automated test script:
```bash
./tests/postman/quick-test-commands.sh
```

## Import Instructions
1. Open Postman
2. Click Import → File
3. Select environment files from this directory
4. Choose appropriate environment for testing
5. Run collections with selected environment

## Current Status
- Development environment: Ready for immediate use
- Production environment: Template prepared for deployment
- All test collections configured for both environments