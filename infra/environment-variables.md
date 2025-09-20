# SPIRAL Platform Environment Variables

## Required Environment Variables

### Core Platform
```bash
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:pass@host:port/dbname
```

### API Configuration
```bash
SPIRAL_API_BASE=https://api.spiralshops.com
SPIRAL_API_KEY=sk_live_xxx
```

### Security & CORS
```bash
CORS_ALLOWLIST=https://rosedalecenter.com,https://www.rosedalecenter.com
WEBHOOK_SECRET=whsec_xxx
SUPERADMIN_TOKEN=super-secret-admin-token
```

### Multi-tenant Mall Configuration
```bash
MALL_HOST=rosedale.spiralmalls.com
# OR use host mapping in tenant.ts
```

## Vercel Deployment

Set these in Vercel Dashboard → Project Settings → Environment Variables:

```bash
SPIRAL_API_BASE=https://api.spiralshops.com
SPIRAL_API_KEY=sk_live_xxx
MALL_HOST=rosedale.spiralmalls.com
CORS_ALLOWLIST=https://rosedalecenter.com,https://www.rosedalecenter.com
WEBHOOK_SECRET=whsec_xxx
SUPERADMIN_TOKEN=super-secret-admin-token
DATABASE_URL=postgresql://user:pass@host:port/dbname
```

## IBM Code Engine Deployment

Use these flags with `ibmcloud ce application create`:

```bash
ibmcloud ce application create \
  --name spiral-mall \
  --image us.icr.io/YOUR_NS/spiral-mall:1.1.0 \
  --port 5000 \
  --env SPIRAL_API_BASE=https://api.spiralshops.com \
  --env SPIRAL_API_KEY=sk_live_xxx \
  --env CORS_ALLOWLIST=https://rosedalecenter.com \
  --env WEBHOOK_SECRET=whsec_xxx \
  --env SUPERADMIN_TOKEN=super-secret \
  --env DATABASE_URL=postgresql://user:pass@host:port/dbname \
  --cpu 1 --memory 1G --max-scale 10
```

## Optional Environment Variables

### Rate Limiting
```bash
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Caching
```bash
CACHE_TTL_SECONDS=300
MEMORY_CACHE_MAX_SIZE=100
```

### AI Features
```bash
OPENAI_API_KEY=sk-xxx (if using OpenAI features)
```

### Admin Features
```bash
X_SPIRAL_ADMIN=admin-access-token (for Clara AI admin routes)
```

## Security Notes

- Never commit secrets to repository
- Use Vercel/IBM secure environment variable storage
- Rotate WEBHOOK_SECRET and SUPERADMIN_TOKEN regularly
- Use production API keys for live deployments
- Ensure DATABASE_URL points to production database