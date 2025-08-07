# SPIRAL Platform - Complete Site Code Download Package

## Download Contents Overview
**Total Files**: 855+ code files  
**Package Size**: ~50MB compressed  
**Last Updated**: August 7, 2025  
**Status**: Production-Ready

## File Structure for Download

### Core Application Files
```
spiral-platform/
├── client/                     # Frontend React Application
│   ├── src/
│   │   ├── components/         # 50+ React components
│   │   │   ├── ImageSearchUpload.tsx
│   │   │   ├── ShopperAIImageAgent.tsx
│   │   │   ├── RetailerInventoryDashboard.tsx
│   │   │   ├── RetailerOnboardingForm.jsx
│   │   │   └── ... (46 more components)
│   │   ├── pages/              # 80+ application pages
│   │   │   ├── HomePage.tsx
│   │   │   ├── ShopperAIImagePage.tsx
│   │   │   ├── AdvancedImageSearchPage.tsx
│   │   │   ├── retailers-dashboard.tsx
│   │   │   └── ... (76 more pages)
│   │   ├── styles/
│   │   │   ├── mobile-config.ts
│   │   │   └── index.css
│   │   ├── lib/
│   │   │   ├── queryClient.ts
│   │   │   └── utils.ts
│   │   └── App.tsx
│   ├── public/                 # Static assets
│   └── index.html
├── server/                     # Backend Node.js/Express
│   ├── api/                    # 200+ API endpoints
│   │   ├── advanced-image-search.js
│   │   ├── ai-ops.js
│   │   ├── ai-retailer-onboarding.js
│   │   ├── location-search-continental-us.js
│   │   └── ... (196 more API files)
│   ├── routes/
│   │   ├── live-test.ts
│   │   ├── stripe-connect.js
│   │   └── auth.js
│   ├── middleware/
│   ├── utils/
│   ├── index.ts               # Main server entry
│   ├── routes.ts              # Route configuration
│   └── storage.ts             # Database layer
├── shared/                    # Shared TypeScript types
│   └── schema.ts              # Database schema (Drizzle ORM)
├── data/                      # Sample data files
│   ├── spiral_sample_products.json
│   └── store_locations.json
├── utils/                     # Utility functions
│   ├── cloudant.js
│   └── distance.js
└── uploads/                   # File upload directory
```

### Configuration Files
```
├── package.json               # Dependencies (80+ packages)
├── package-lock.json          # Locked versions
├── drizzle.config.ts          # Database configuration
├── vite.config.ts             # Frontend build
├── tailwind.config.ts         # Styling framework
├── postcss.config.js          # CSS processing
├── jest.config.js             # Testing framework
├── components.json            # UI components config
├── .gitignore                 # Git exclusions
├── .replit                    # Replit configuration
└── replit.md                  # Project documentation
```

### Documentation Files
```
├── SPIRAL_COMPLETE_CODE_BACKUP.md
├── SPIRAL_OPERATIONS_MANUAL.md
├── SPIRAL_PLATFORM_OVERVIEW.md
├── MOBILE_AI_IMAGE_SEARCH_TESTING_REPORT.md
└── README.md                  # Setup instructions
```

## Download Instructions

### Method 1: Git Clone (Recommended)
```bash
# Clone the repository
git clone [repository-url] spiral-platform
cd spiral-platform

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Initialize database
npm run db:push

# Start development server
npm run dev
```

### Method 2: Direct Download
1. Download ZIP package from repository
2. Extract to desired location
3. Follow setup instructions below

### Method 3: Replit Fork
1. Visit the Replit project
2. Click "Fork" to create your copy
3. Environment automatically configured
4. Start coding immediately

## Required Environment Variables
```env
# Database (Required)
DATABASE_URL=postgresql://user:password@host:port/database
PGUSER=postgres
PGPASSWORD=your_password
PGDATABASE=spiral_db
PGHOST=localhost
PGPORT=5432

# AI Services (Required for full functionality)
OPENAI_API_KEY=sk-your-openai-key

# Cloud Services (Optional - Mock fallbacks available)
GOOGLE_CLOUD_VISION_KEY=your-google-cloud-key
IBM_CLOUDANT_URL=your-cloudant-url
IBM_CLOUDANT_API_KEY=your-cloudant-key

# Payment Processing (Optional - Mock mode available)
STRIPE_SECRET_KEY=sk_test_your-stripe-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-key

# External Services (Optional)
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
SENDGRID_API_KEY=your-sendgrid-key
```

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Git (for version control)

### Installation Steps
1. **Download and Extract**
   ```bash
   unzip spiral-platform.zip
   cd spiral-platform
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb spiral_db
   
   # Push schema to database
   npm run db:push
   ```

4. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Access Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Production Deployment

#### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

#### Replit Deployment
1. Fork the Replit project
2. Configure environment variables
3. Click "Deploy" button
4. Custom domain configuration available

#### Manual Server Deployment
```bash
# Build for production
npm run build

# Start production server
npm start
```

## Key Dependencies

### Frontend
- **React 18**: Modern React with hooks
- **TypeScript**: Type safety
- **Vite**: Fast build tool
- **Tailwind CSS**: Utility-first styling
- **TanStack Query**: Data fetching
- **Wouter**: Lightweight routing
- **Zustand**: State management

### Backend
- **Express.js**: Web framework
- **TypeScript**: Type safety
- **Drizzle ORM**: Database operations
- **PostgreSQL**: Primary database
- **JWT**: Authentication
- **Stripe**: Payment processing
- **OpenAI**: AI functionality

### AI & Cloud Services
- **OpenAI GPT-4**: Conversational AI
- **Google Cloud Vision**: Image analysis
- **IBM Cloudant**: Document database
- **Twilio**: SMS notifications
- **SendGrid**: Email services

## Testing Framework
```bash
# Run all tests
npm test

# Run specific test suites
npm run test:components
npm run test:api
npm run test:integration

# Test coverage report
npm run test:coverage
```

## Development Commands
```bash
# Development server with hot reload
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Database operations
npm run db:push        # Push schema changes
npm run db:studio      # Open database studio
npm run db:generate    # Generate migrations

# Build operations
npm run build          # Production build
npm run preview        # Preview production build
```

## File Permissions and Security
- Ensure proper file permissions (644 for files, 755 for directories)
- Never commit `.env` files to version control
- Use secure secrets management in production
- Regular security updates for dependencies

## Support and Documentation
- **Operations Manual**: SPIRAL_OPERATIONS_MANUAL.md
- **Technical Overview**: SPIRAL_PLATFORM_OVERVIEW.md
- **API Documentation**: Available at /api/docs when running
- **Component Library**: Storybook available via npm run storybook

## License and Usage
- Commercial use permitted with proper attribution
- Modify and distribute as needed
- Maintain original copyright notices
- Report issues and contribute improvements

---
**Download Package Version**: 1.0  
**Compatible With**: Node.js 18+, PostgreSQL 12+  
**Browser Support**: Chrome, Firefox, Safari, Edge (latest versions)  
**Mobile Compatibility**: iOS Safari, Android Chrome