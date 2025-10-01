# SPIRAL Platform Backup & Storage Strategy

## Backup Plan Overview

### Core Platform Files (Essential - Keep Local)
```
Essential Code (Must Download):
├── server/                    # Backend API and AI agents
├── client/src/               # Frontend React components  
├── shared/                   # Database schemas and types
├── mobile/                   # iOS & Android app source
├── scripts/                  # Deployment and automation
├── package.json              # Dependencies configuration
├── drizzle.config.ts         # Database configuration
└── replit.md                 # Project documentation
```

### Large Files for External Storage
```
Can Move to External Storage:
├── attached_assets/          # ~200MB+ of screenshots/documents
├── backups/                  # Previous backup archives
├── security-reports/         # Security audit reports
├── docs/                     # Documentation files
├── agents/techwatch/reports/ # Competitive analysis screenshots
├── agents/funnels/out/       # Analysis output files
└── uploads/                  # User uploaded content
```

### Automatically Excluded (Rebuild from package.json)
```
Build Artifacts (Don't Backup):
├── node_modules/             # ~500MB+ dependencies
├── dist/                     # Built frontend files
├── build/                    # Compiled outputs
├── .cache/                   # Temporary cache files
└── *.log                     # Log files
```

## Backup Creation Process

### 1. Essential Code Archive (Recommended Download)
**File:** `spiral-essential-code-YYYYMMDD.tar.gz`
**Size:** ~50-100MB
**Contains:** All source code, configs, mobile app, database schemas

### 2. Complete Project Archive (Full Backup)
**File:** `spiral-complete-YYYYMMDD.tar.gz` 
**Size:** ~800MB-1GB
**Contains:** Everything except node_modules and build artifacts

### 3. Documentation & Assets Archive (Optional External)
**File:** `spiral-assets-docs-YYYYMMDD.tar.gz`
**Size:** ~300-400MB
**Contains:** Documentation, screenshots, reports, analysis files

## External Storage Recommendations

### Cloud Storage Options
1. **GitHub Repository** (Code only)
   - Essential source code: Free for public repos
   - Private repos: $4/month for unlimited
   - Best for: Core codebase versioning

2. **Google Drive / Dropbox** (Assets & Docs)
   - 15GB free (Google), 2GB free (Dropbox)
   - Best for: Documentation, screenshots, reports
   - Cost: $6-10/month for 1TB+

3. **AWS S3 / Google Cloud Storage** (Production Assets)
   - Pay-per-use storage
   - Best for: User uploads, production assets
   - Cost: ~$0.023/GB/month

4. **External CDN** (Static Assets)
   - Cloudinary, AWS CloudFront
   - Best for: Images, videos, downloadable files
   - Cost: $1-5/month for small projects

### Recommended Storage Split

**Keep in Replit (Core Development):**
- Source code (server/, client/, mobile/)
- Database schemas and migrations
- Package configurations
- Deployment scripts
- Current working documentation

**Move to GitHub:**
- Complete source code repository
- Version control and collaboration
- Automated CI/CD pipelines
- Issue tracking and documentation

**Move to Cloud Storage:**
- User uploaded files (uploads/)
- Competitive analysis screenshots (agents/techwatch/reports/)
- Security audit reports (security-reports/)
- Marketing assets and documentation (docs/)
- Previous backup archives (backups/)

## Implementation Strategy

### Phase 1: Immediate Backup (Today)
1. Create essential code archive for download
2. Set up GitHub repository for source code
3. Document external storage plan

### Phase 2: Asset Migration (This Week)
1. Move large documentation files to Google Drive
2. Set up S3 bucket for production uploads
3. Configure CDN for static assets
4. Update application to use external URLs

### Phase 3: Optimization (Ongoing)
1. Implement automatic cloud backups
2. Set up monitoring for storage usage
3. Regular cleanup of temporary files
4. Maintain lean Replit environment

## Cost Optimization

### Free Tier Options
- **GitHub:** Unlimited public repos, 500MB private
- **Google Drive:** 15GB free storage
- **AWS S3:** 5GB free tier for 12 months
- **Cloudinary:** 25GB free transformations/month

### Low-Cost Solutions (~$10-20/month)
- **GitHub Pro:** $4/month for unlimited private repos
- **Google Workspace:** $6/month for 30GB + collaboration tools
- **AWS/GCS:** $5-10/month for 100GB+ storage
- **CDN Service:** $1-5/month for global delivery

### Benefits of External Storage
1. **Reduced Replit Size:** Faster checkpoints and loading
2. **Better Performance:** Static assets served from CDN
3. **Scalability:** Handle growth without hitting storage limits
4. **Redundancy:** Multiple backup locations for safety
5. **Cost Efficiency:** Pay only for what you use

## File Migration Priority

### High Priority (Move First)
1. `attached_assets/` - Screenshots and documents
2. `agents/techwatch/reports/` - Analysis outputs  
3. `backups/` - Previous backup files
4. `security-reports/` - Audit documentation

### Medium Priority (Move Later)
1. `docs/` - Documentation files
2. `uploads/temp/` - Temporary uploads
3. Historical log files

### Keep Local (Development Critical)
1. All source code directories
2. Configuration files
3. Database migrations
4. Current working documentation

This strategy will reduce your Replit project size by 60-70% while maintaining full development capabilities.