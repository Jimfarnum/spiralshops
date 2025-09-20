# SPIRAL Stripe Go Live Checklist

**⚠️ IMPORTANT: This document is for reference only. STRIPE_MODE remains in TEST until explicit approval.**

## Pre-Launch Requirements

### 1. Stripe Account Setup
- [ ] Business account fully verified with Stripe
- [ ] Business information complete (EIN, address, bank account)
- [ ] Identity verification completed for all account holders
- [ ] Processing limits reviewed and approved by Stripe

### 2. Required API Keys
Update these environment variables in Vercel:

```bash
# LIVE Stripe Keys (DO NOT SET YET)
STRIPE_SECRET_KEY=sk_live_51...
STRIPE_PUBLISHABLE_KEY=pk_live_51...
STRIPE_MODE=live
LIVE_SAFETY_ON=1
```

### 3. Webhook Configuration (if used)
- [ ] Production webhook endpoint configured: `https://spiralshops.com/api/webhooks/stripe`
- [ ] Webhook signing secret updated: `STRIPE_WEBHOOK_SECRET`
- [ ] Test webhook delivery and processing

## Go Live Process

### Phase 1: Environment Switch
1. **Update Environment Variables** (Vercel Dashboard → Settings → Environment Variables):
   ```
   STRIPE_MODE=live
   LIVE_SAFETY_ON=1
   STRIPE_SECRET_KEY=[live-secret-key]
   STRIPE_PUBLISHABLE_KEY=[live-publishable-key]
   ```

2. **Deploy Changes**:
   ```bash
   # Redeploy to pick up new environment variables
   vercel --prod
   ```

### Phase 2: Live Transaction Test
1. **Minimal Test Charge**:
   - Amount: $0.50 USD
   - Use real payment method (NOT test card)
   - Verify charge appears in Stripe Live Dashboard
   - **IMMEDIATELY REFUND** test charge

2. **Test Commands**:
   ```bash
   # Health check
   curl https://spiralshops.com/api/health

   # Verify Stripe mode
   curl https://spiralshops.com/api/stripe/status
   ```

### Phase 3: Verification
- [ ] Live charge processed successfully
- [ ] Refund processed within 1 hour
- [ ] No errors in Stripe Dashboard
- [ ] Sentry shows no payment-related errors
- [ ] Order appears in SPIRAL admin panel

## PCI/PII Compliance Notes

### Data Handling
- **Card Data**: Never stored - handled entirely by Stripe
- **Customer PII**: Minimal collection (email, name, address)
- **Data Retention**: Orders retained indefinitely, payment tokens via Stripe
- **Access Control**: Admin panel requires authentication

### Security Measures
- **HTTPS**: Enforced on all pages via Vercel SSL
- **CSP Headers**: Configured in vercel.json
- **Rate Limiting**: 60 requests per minute per IP
- **Session Security**: Secure cookies, PostgreSQL session storage

## Emergency Rollback

### Immediate Rollback Steps
1. **Revert Environment Variables**:
   ```bash
   STRIPE_MODE=test
   LIVE_SAFETY_ON=0
   STRIPE_SECRET_KEY=sk_test_51...
   STRIPE_PUBLISHABLE_KEY=pk_test_51...
   ```

2. **Redeploy**:
   ```bash
   vercel --prod
   ```

3. **Verify Rollback**:
   ```bash
   curl https://spiralshops.com/api/stripe/status
   # Should show: {"mode": "test"}
   ```

### Rollback Verification
- [ ] Test transaction with 4242 4242 4242 4242 works
- [ ] No live charges processed after rollback
- [ ] Admin panel functional
- [ ] No user-facing errors

## Launch Readiness Checklist

### Technical Requirements
- [ ] All smoke tests passing
- [ ] Error monitoring active (Sentry)
- [ ] Uptime monitoring configured
- [ ] Database backups automated
- [ ] CSP headers active
- [ ] Rate limiting functional

### Business Requirements
- [ ] Customer support process defined
- [ ] Refund policy published (/terms)
- [ ] Privacy policy complete (/privacy)
- [ ] Business bank account verified
- [ ] Sales tax setup (if applicable)

### Legal & Compliance
- [ ] Terms of Service reviewed by legal
- [ ] Privacy Policy GDPR/CCPA compliant
- [ ] DMCA takedown process active
- [ ] Business license current
- [ ] Insurance coverage verified

## Escalation Contacts

### Technical Issues
- **Primary**: Technical Team Lead
- **Stripe Issues**: business@spiralshops.com
- **Server Issues**: Vercel Support
- **Database Issues**: Neon Support

### Business Issues
- **Payment Disputes**: Customer Success
- **Legal Issues**: Legal Department
- **Compliance Issues**: Compliance Officer

## Post-Launch Monitoring

### Week 1: High Alert
- [ ] Monitor Stripe Dashboard hourly
- [ ] Daily Sentry error review  
- [ ] Customer support ticket review
- [ ] Failed payment analysis
- [ ] Refund processing verification

### Week 2-4: Standard Monitoring
- [ ] Weekly payment reconciliation
- [ ] Monthly chargeback review
- [ ] Quarterly compliance audit
- [ ] Performance metrics tracking

---

## CURRENT STATUS: TEST MODE ACTIVE

```bash
# Current Configuration (DO NOT CHANGE without approval)
STRIPE_MODE=test
LIVE_SAFETY_ON=0
INVESTOR_MODE=1
```

**✅ Test Environment Verified**  
**❌ Live Environment Not Activated**  
**🔒 Safety Controls Active**

---

*Last Updated: August 9, 2025*  
*Next Review: Before live launch approval*