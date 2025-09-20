# SPIRAL Platform Deployment Guide

## Build Process

The SPIRAL platform uses a dual-build system:

1. **Frontend Build**: `vite build` creates optimized React app in `dist/public/`
2. **Backend Build**: `esbuild` compiles TypeScript server to `dist/index.js`

### Build Command
```bash
npm run build
```

This runs:
```bash
vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist
```

## Build Verification

After building, verify the deployment readiness:

```bash
node verify-build.js
```

This checks:
- ✅ `dist/index.js` exists and is substantial (>100KB)
- ✅ `dist/public/index.html` exists
- ✅ Frontend assets are built
- ✅ Server file contains valid code

## Production Start

The built application starts with:

```bash
NODE_ENV=production node dist/index.js
```

### Expected Behavior
1. Server binds to port 3000 (or PORT env variable)
2. Serves static files from `dist/public/`
3. All API routes become available under `/api/`
4. Database connection is established
5. All AI agents initialize successfully

## Deployment Checklist

Before deploying:

1. **Build Success**: ✅ `npm run build` completes without errors
2. **Verification**: ✅ `node verify-build.js` passes all checks
3. **Environment**: ✅ All required environment variables are set
4. **Database**: ✅ PostgreSQL connection string is configured
5. **Port**: ✅ PORT environment variable is set (default: 3000)

## File Structure

After build:
```
dist/
├── index.js          # Compiled server (1.8MB)
├── public/           # Frontend assets
│   ├── index.html    # Main HTML file
│   └── assets/       # CSS, JS, and other assets
└── version.json      # Build metadata (optional)
```

## Troubleshooting

### "Cannot find module 'dist/index.js'"
- **Cause**: Build process didn't create the server file
- **Fix**: Run `npm run build` and check for errors

### "Module build failed"
- **Cause**: TypeScript compilation errors
- **Fix**: Run `npm run check` to see TypeScript errors

### "ENOENT: no such file or directory"
- **Cause**: Missing frontend build files
- **Fix**: Ensure `vite build` completed successfully

## Server Features

The production server includes:
- ✅ All SPIRAL APIs (18 AI agents)
- ✅ Static file serving for SPA routing
- ✅ Security middleware and SSL handling
- ✅ Database connection management
- ✅ Error handling and logging
- ✅ Performance monitoring
- ✅ Rate limiting and protection

## Environment Variables

Required for production:
```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://...
# Additional API keys as needed
```

## Health Check

Verify deployment:
```bash
curl http://your-domain/api/check
```

Expected response:
```json
{
  "status": "healthy",
  "message": "SPIRAL platform is running",
  "services": {
    "database": "connected",
    "authentication": "active",
    "payment": "configured"
  }
}
```