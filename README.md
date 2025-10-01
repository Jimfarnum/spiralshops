# SPIRAL Platform - Competitive Intelligence & Local Business Directory

**Revolutionizing local commerce through AI-powered competitive analysis and unified retail coordination**

[![Deploy to IBM Code Engine](https://img.shields.io/badge/Deploy-IBM%20Code%20Engine-blue.svg)](./deploy-spiral.sh)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)

## Overview

SPIRAL is a comprehensive competitive intelligence platform designed to unite brick-and-mortar retailers and compete with Amazon, Shopify, and Walmart. The platform features advanced AI-powered competitive analysis, automated funnel intelligence, and real-time mobile monitoring capabilities.

### Key Innovations

- **SOAP G Central Brain**: 7 specialized AI agents for comprehensive business intelligence
- **18 AI Agents Total**: 7 SOAP G + 11 AI Ops agents with cross-agent coordination
- **Automated Competitor Analysis**: Real-time monitoring of Amazon, Target, Walmart, Shopify
- **Mobile Monitoring**: React Native app for remote system management
- **Enterprise Scalability**: IBM Code Engine deployment with auto-scaling (0-10 instances)

## Features

### 🛍️ Shopping & Commerce
- Multi-mall cart support with extensive product categories
- SPIRALS loyalty system (1 SPIRAL per $1 spent with multipliers)
- Advanced product filtering, sorting, and search
- QR code pickup system
- Mall gift card integration

### 🤖 AI-Powered Intelligence
- **ShopperAssist AI**: Personalized shopping recommendations
- **RetailerOnboard AI**: 5-step automated retailer onboarding
- **ProductEntry AI**: AI-validated inventory management
- **MallDirectory AI**: Smart mall and store discovery
- **AdminAudit AI**: Automated system monitoring
- **Wishlist AI**: Intelligent wishlist management
- **ImageSearch AI**: Visual product discovery

### 📱 Mobile Experience
- Cross-platform React Native app (iOS/Android)
- Real-time competitive intelligence monitoring
- Push notifications for system health and performance
- Remote management capabilities
- Mobile-responsive web interface

### 🏪 Retailer Platform
- Comprehensive retailer portal with inventory dashboard
- CSV bulk operations with AI validation
- Real-time inventory statistics and analytics
- 5-tier store verification system
- Stripe Connect payment integration

### 📊 Analytics & Reporting
- Real-time performance metrics and KPI tracking
- Automated daily reports (9:00 AM Central)
- Competitive funnel intelligence
- Social media integration with pixel tracking
- Launch readiness monitoring

### ⚖️ Legal Compliance
- Minnesota LLC legal framework
- MCDPA, CCPA, GDPR compliance
- Complete Terms of Service and Privacy Policy
- Consent management system
- E-SIGN/UETA compliance

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** build tool
- **Tailwind CSS** with shadcn/ui components
- **Wouter** routing
- **TanStack Query** for server state
- **Zustand** for global state management

### Backend
- **Node.js** with Express.js
- **PostgreSQL** with Drizzle ORM
- **JWT** authentication
- **OpenAI GPT-4** integration
- **IBM Cloud** services integration

### Deployment
- **IBM Code Engine** for production
- **Replit** for development
- **Vercel** deployment ready
- **Docker** containerization

### AI & ML
- **OpenAI GPT-4** for smart search and business intelligence
- **18 Specialized AI Agents** for comprehensive automation
- **IBM Watson** integration ready
- **Google Cloud Vision** for image analysis

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- OpenAI API key
- IBM Cloud account (for production deployment)

### Development Setup

```bash
# Clone the repository
git clone https://github.com/your-username/spiral-platform.git
cd spiral-platform

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys and database URL

# Run database migrations
npm run db:push

# Start development server
npm run dev
```

### Production Deployment

Deploy to IBM Code Engine using the included script:

```bash
# Update repository URL in deploy-spiral.sh
vim deploy-spiral.sh

# Run deployment
./deploy-spiral.sh
```

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# AI Services
OPENAI_API_KEY=your_openai_api_key
IBM_WATSON_API_KEY=your_watson_api_key

# Authentication
JWT_SECRET=your_jwt_secret

# Payment Processing
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Cloud Services
IBM_CLOUD_APIKEY=your_ibm_cloud_api_key
CLOUDANT_URL=your_cloudant_database_url
```

## API Documentation

### Core Endpoints
- `GET /api/check` - Health check
- `GET /api/products` - Product catalog
- `GET /api/stores` - Store directory
- `GET /api/malls` - Mall directory

### AI Agent Endpoints
- `POST /api/ai/shopper-assist` - Shopping recommendations
- `POST /api/ai/retailer-onboard` - Retailer onboarding
- `POST /api/ai/product-entry` - Product management
- `GET /api/ai/agents/status` - Agent health monitoring

### Analytics Endpoints
- `GET /api/analytics/dashboard` - Performance metrics
- `GET /api/reports/daily` - Daily reports
- `POST /api/kpi/platform/overview` - Platform KPIs

## Architecture

### SOAP G Central Brain (7 Agents)
1. **Mall Manager AI** - Mall operations and coordination
2. **Retailer AI** - Retailer support and onboarding
3. **Shopper Engagement AI** - Customer experience optimization
4. **Social Media AI** - Social integration and analytics
5. **Marketing & Partnerships AI** - Growth and partnerships
6. **Admin AI** - System administration and monitoring
7. **Supervisor AI** - Cross-agent coordination

### AI Ops System (11 Agents)
- ShopperUXAgent, DevOpsAgent, AnalyticsAgent
- RetailerPlatformAgent, ShopperAssistAgent
- WishlistAgent, ImageSearchAgent, MallDirectoryAgent
- AdminAuditAgent, RetailerOnboardAgent, ProductEntryAgent

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Testing

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:frontend
npm run test:backend
npm run test:ai-agents

# Run integration tests
npm run test:integration
```

## Performance

- **App initialization**: ~61ms average
- **Database queries**: <50ms P99
- **AI response times**: <2s average
- **Mobile app**: Cross-platform parity
- **Auto-scaling**: 0-10 instances based on demand

## Security

- JWT-based authentication
- 3-tier API rate limiting
- CSP and XSS protection
- Input sanitization
- CORS configuration
- Secure session management

## Support

- **Documentation**: [docs.spiral-platform.com](https://docs.spiral-platform.com)
- **Issues**: [GitHub Issues](https://github.com/your-username/spiral-platform/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/spiral-platform/discussions)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with love for local businesses
- Powered by advanced AI and machine learning
- Designed for enterprise scalability
- Committed to privacy and security

---

**SPIRAL Platform** - Revolutionizing local commerce through intelligent coordination and competitive analysis.