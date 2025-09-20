# SPIRAL Production Deployment Checklist

**Complete checklist for deploying SPIRAL to production with Vercel + IBM Cloud**

---

## 🚀 **Pre-Deployment Phase**

### Code Preparation
- [ ] All features tested and working locally
- [ ] Build process completes without errors (`npm run build`)
- [ ] Bundle size optimized (~845KB compressed)
- [ ] Environment variables documented in `.env.template`
- [ ] Legal pages created (`/privacy`, `/terms`, `/dmca`)
- [ ] SEO files generated (`sitemap.xml`, `robots.txt`)

### Repository Setup
- [ ] Code pushed to main branch on GitHub
- [ ] No sensitive data committed to repository
- [ ] `vercel.json` configuration file present
- [ ] Build scripts configured in `package.json`
- [ ] Dependencies up to date and locked

---

## 🌐 **Vercel Deployment**

### Account & Project Setup
- [ ] Vercel account created and verified
- [ ] GitHub repository connected to Vercel
- [ ] Project configured with correct build settings:
  - Framework: Vite
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Install Command: `npm ci`

### Domain Configuration
- [ ] Custom domain purchased: `spiralshops.com`
- [ ] Domain added to Vercel project
- [ ] DNS records configured:
  - A record: `@` → `76.76.19.61`
  - CNAME record: `www` → `cname.vercel-dns.com`
- [ ] SSL certificate provisioned automatically
- [ ] HTTPS redirect working

### Environment Variables (Vercel)
```bash
# Core Configuration
- [ ] NODE_ENV=production
- [ ] INVESTOR_MODE=1
- [ ] WATSONX_ENABLED=0
- [ ] RATE_LIMIT_RPM=60

# Database
- [ ] DATABASE_URL (PostgreSQL)
- [ ] CLOUDANT_URL
- [ ] CLOUDANT_APIKEY
- [ ] CLOUDANT_DB=spiral

# Payment (Start in TEST mode)
- [ ] STRIPE_SECRET_KEY=sk_test_...
- [ ] STRIPE_PUBLISHABLE_KEY=pk_test_...
- [ ] STRIPE_MODE=test
- [ ] LIVE_SAFETY_ON=0

# AI Services
- [ ] OPENAI_API_KEY

# Security
- [ ] JWT_SECRET
- [ ] SESSION_SECRET
- [ ] DEMO_RESET_KEY

# Admin Access
- [ ] ADMIN_EMAIL
- [ ] ADMIN_PASS

# Monitoring
- [ ] SENTRY_DSN
- [ ] PLAUSIBLE_DOMAIN
```

---

## ☁️ **IBM Cloud Setup**

### Account & Services
- [ ] IBM Cloud account created
- [ ] IBM Cloud CLI installed and configured
- [ ] Resource group created or selected

### Cloudant Database
- [ ] Cloudant instance created
  - Service name: `spiral-cloudant`
  - Plan: Standard (production) or Lite (testing)
  - Region: `us-south` (recommended)
- [ ] Service credentials generated
- [ ] Databases created:
  - [ ] `spiral-retailers`
  - [ ] `spiral-products`
  - [ ] `spiral-orders` 
  - [ ] `spiral-users`
  - [ ] `spiral-sessions`

### Optional Services
- [ ] Watson Assistant (if using AI chat)
- [ ] Watson Discovery (if using content search)
- [ ] Cloud Object Storage (if storing files)
- [ ] Redis cache (if using session caching)

### Security Configuration
- [ ] IAM policies configured
- [ ] Service API keys generated
- [ ] Keys secured in Vercel environment variables

---

## 🧪 **Testing & Verification**

### Pre-Deployment Testing
- [ ] Local build successful
- [ ] All API endpoints responding
- [ ] Database connections working
- [ ] Authentication system functional
- [ ] Payment processing in test mode
- [ ] Legal pages accessible

### Post-Deployment Verification
```bash
# Core endpoints
- [ ] https://spiralshops.com/ (homepage loads)
- [ ] https://spiralshops.com/api/health (returns healthy)
- [ ] https://spiralshops.com/api/check (platform operational)

# API functionality  
- [ ] https://spiralshops.com/api/products (product catalog)
- [ ] https://spiralshops.com/api/stores (store directory)
- [ ] https://spiralshops.com/api/mall-events (events)

# Legal pages
- [ ] https://spiralshops.com/privacy
- [ ] https://spiralshops.com/terms
- [ ] https://spiralshops.com/dmca

# SEO files
- [ ] https://spiralshops.com/sitemap.xml
- [ ] https://spiralshops.com/robots.txt
```

### Database Integration Testing
- [ ] Cloudant connection successful
- [ ] Data reads/writes working
- [ ] Session management functional
- [ ] Backup system operational

### Security Testing
- [ ] Rate limiting active (test 60+ requests)
- [ ] CSP headers present
- [ ] Admin routes protected
- [ ] HTTPS enforced
- [ ] No sensitive data exposed

---

## 📊 **Monitoring & Analytics**

### Error Tracking
- [ ] Sentry configured and receiving errors
- [ ] Alert rules set up for critical errors
- [ ] Error notification emails configured

### Analytics
- [ ] Plausible Analytics installed
- [ ] Domain verified: `spiralshops.com`
- [ ] Goals configured:
  - [ ] Checkout Success
  - [ ] User Signup
  - [ ] Retailer Application

### Performance Monitoring
- [ ] Vercel Analytics enabled
- [ ] Core Web Vitals tracking
- [ ] Function execution monitoring
- [ ] Lighthouse scores recorded:
  - [ ] Performance > 90
  - [ ] Accessibility > 95
  - [ ] Best Practices > 90
  - [ ] SEO > 95

### Uptime Monitoring
- [ ] UptimeRobot configured (or similar)
- [ ] Check intervals set:
  - [ ] Homepage: 1 minute
  - [ ] API health: 5 minutes
  - [ ] Key endpoints: 5 minutes
- [ ] Alert notifications configured

---

## 🔐 **Security Hardening**

### Application Security
- [ ] Rate limiting: 60 RPM per IP
- [ ] CSP headers configured
- [ ] Admin routes not indexed (robots.txt)
- [ ] WatsonX disabled by default
- [ ] Demo reset key protection
- [ ] Session security (secure cookies)

### Infrastructure Security
- [ ] Environment variables encrypted
- [ ] API keys rotated and secured
- [ ] SSL/TLS certificates valid
- [ ] Database access restricted
- [ ] No public admin endpoints

---

## 🗄️ **Backup & Recovery**

### Automated Backups
- [ ] Backup script functional: `scripts/backup-cloudant.mjs`
- [ ] Daily backup schedule configured
- [ ] Backup verification successful (250+ documents)
- [ ] Backup storage location secured

### Recovery Procedures
- [ ] Database restore process documented
- [ ] Application rollback procedure tested
- [ ] Emergency contacts defined
- [ ] Recovery time objectives defined (< 1 hour)

---

## 📈 **Performance Optimization**

### Frontend Performance
- [ ] Bundle size optimized (~845KB)
- [ ] Code splitting implemented
- [ ] Image optimization enabled
- [ ] Lazy loading for non-critical resources
- [ ] CDN configuration active

### Backend Performance
- [ ] Database queries optimized
- [ ] API response times < 100ms average
- [ ] Caching strategy implemented
- [ ] Connection pooling configured

---

## 🚨 **Incident Response**

### Monitoring Setup
- [ ] 24/7 monitoring active
- [ ] Alert escalation procedures defined
- [ ] Incident response team identified
- [ ] Communication channels established

### Recovery Plans
- [ ] Rollback procedures documented
- [ ] Database restore procedures tested
- [ ] Emergency maintenance windows defined
- [ ] User communication templates prepared

---

## ✅ **Go-Live Checklist**

### Final Pre-Launch
- [ ] All tests passing (100% validation)
- [ ] Performance benchmarks met
- [ ] Security scan completed
- [ ] Legal review completed
- [ ] Stakeholder approval received

### Launch Day
- [ ] Final deployment executed
- [ ] DNS propagation verified (24-48 hours)
- [ ] All monitoring systems active
- [ ] Team on standby for first 24 hours
- [ ] User communication sent (if applicable)

### Post-Launch (Week 1)
- [ ] Daily monitoring reviews
- [ ] User feedback collection
- [ ] Performance optimization based on real traffic
- [ ] Issue tracking and resolution
- [ ] Success metrics reporting

---

## 📞 **Support Contacts**

### Technical Escalation
- **Platform Issues**: Vercel Support
- **Database Issues**: IBM Cloud Support  
- **DNS Issues**: Domain Registrar Support
- **Payment Issues**: Stripe Support

### Internal Team
- **Technical Lead**: [Name/Contact]
- **DevOps Engineer**: [Name/Contact]
- **Product Manager**: [Name/Contact]
- **On-Call Engineer**: [Name/Contact]

---

## 🎯 **Success Criteria**

### Technical Metrics
- [ ] Uptime > 99.9%
- [ ] Page load time < 2 seconds
- [ ] API response time < 100ms
- [ ] Error rate < 0.1%

### Business Metrics
- [ ] Zero critical bugs
- [ ] User registration functional
- [ ] Payment processing working (test mode)
- [ ] Search and discovery operational

---

## 🎉 **Deployment Complete**

### Final Sign-off
- [ ] Technical team approval
- [ ] Security team approval  
- [ ] Product team approval
- [ ] Business stakeholder approval

### Documentation
- [ ] Deployment guide updated
- [ ] API documentation current
- [ ] User guides available
- [ ] Support documentation ready

---

**🚀 SPIRAL IS NOW LIVE IN PRODUCTION! 🚀**

**Live URL**: https://spiralshops.com  
**Status**: Production Ready  
**Date**: [Deployment Date]  
**Version**: 1.0.0

---

*Checklist completed: [Date]*  
*Deployed by: [Team/Individual]*  
*Next review: 30 days post-launch*