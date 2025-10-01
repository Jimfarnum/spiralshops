# IBM Staging — Setup Guide (Code Engine)

## GitHub Secrets (required)
- IBM_CLOUD_APIKEY: IBM Cloud API key
- IBM_CR_NAMESPACE: Your IBM Container Registry namespace (e.g., spiralshops)
- (Optional) SENTRY_DSN, GA4_ID, STRIPE_SECRET, TWILIO keys, etc. (set in Code Engine env)

## IBM Prep
1. Create a Code Engine **project**: `spiralshops-staging`
2. Create a Container Registry namespace: `us.icr.io/<namespace>`
3. Create a registry secret in CE UI named `icr-secret` tied to your ICR creds
4. Map environment variables/secrets in the CE app (PORT=5000, tokens, etc.)

On push to `main`, GitHub Actions builds the Docker image, pushes to ICR, and deploys/updates CE app.
