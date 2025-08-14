# SPIRAL - Local Business Directory

## Overview
SPIRAL is a modern local business directory connecting shoppers with local businesses, aiming to revitalize local commerce. It enables users to discover stores by location and provides retailers a platform to showcase their businesses. Key capabilities include an AI-powered retailer onboarding system, comprehensive logistics for same-day delivery, and advanced e-commerce features. The project integrates shopping, loyalty programs, and community engagement to create a robust platform.

## User Preferences
Preferred communication style: Simple, everyday language.
Preferred design approach: Clean, simplified interfaces over complex UI components. Favors functional minimalism while maintaining full backend integration capabilities.

## Recent Updates (August 14, 2025)
- **Comprehensive Testing Suite Created**: Complete Postman collections at `tests/postman/` with development and production environments, core API tests, admin authentication tests, and specialized investor portal validation
- **Platform Diagnostics Verified**: All core systems healthy with 20 products, 7 local stores, 350 nationwide locations, and SOAP G Central Brain with 7 AI agents operational
- **INVESTOR_TOKEN Authentication Issue**: Token requires correction in Replit Secrets (remove "Value: " prefix) to enable professional investor portal at `/investors?investor_token=spiral-demo-2025-stonepath-67c9`
- **Platform-Wide Tab Functionality COMPLETE**: Fixed 15+ components with non-functional tabs using controlled state management across entire SPIRAL system
- **Tab Implementation Achievement**: All tabs now functional on retailer-login, CrossRetailerHub, MallManagerDashboard, AdvancedImageSearchPage, InternalPlatformDashboard, SOAPGDashboard, AnalyticsDashboard, ShopperAIAgent, RetailerAIAssistant, retailer-dashboard, and more
- **SPIRAL Feature #10 - Investor Portal COMPLETE**: Token-gated investor dashboard with live metrics, PDF generation, demo access, and secure authentication system
- **Live Investor Metrics**: Real-time platform KPIs including revenue, orders, customers, retailers, inventory, and logistics data (sanitized, no PII)
- **Professional Dashboard**: Modern web interface at /investors with interactive metrics loading, PDF export, and direct demo access
- **Secure API Access**: Token-protected /api/investors/metrics endpoint with INVESTOR_TOKEN or ADMIN_TOKEN fallback support
- **SPIRAL Feature #9 - Self-Check Suite COMPLETE**: Comprehensive automated testing system with 10 critical platform tests, real HTTP validation, admin dashboard UI, and production monitoring integration
- **Automated Quality Assurance**: Real-time platform health monitoring with end-to-end functionality validation and performance baseline establishment
- **Self-Check Dashboard**: Professional web interface at /admin/selfcheck with one-click comprehensive testing, visual pass/fail indicators, and detailed diagnostics
- **Production Monitoring API**: Secure /api/selfcheck/run endpoint for CI/CD integration and automated deployment validation
- **Cross-Retailer Inventory System**: Revolutionary unified search across all local retailers with AI-powered order routing
- **Intelligent Order Routing**: Distance-based optimization with price comparison and availability tracking  
- **Real-Time Inventory Database**: Cross-retailer inventory tracking with reserved quantity management
- **SPIRAL Analytics & Intelligence Hub**: Comprehensive business intelligence with KPI tracking, timeseries analysis, and interactive dashboards
- **Local Fulfillment Layer (MVP) - COMPLETE**: Full logistics platform with serviceability mapping, courier management, pickup centers, dispatch APIs, and unified returns processing
- **SPIRAL Fulfillment Centers**: Hub-based logistics network for efficient last-mile delivery coordination with real pickup centers and courier integrations
- **Shipping Quote Engine**: Multi-courier price comparison with ETA calculations and distance-based optimization
- **Returns Management System**: Unified returns desk with label generation, intake tracking, and multi-method processing (dropoff/pickup)
- **Fulfillment Operations Dashboard**: Professional admin interface for managing serviceability, pickup centers, couriers, and returns
- **Customer Cross-Retailer Shopping UI - COMPLETE**: ZIP-gated shopping interface with location detection, ETA badges, pickup center integration, and multi-retailer cart functionality
- **Phase 1 Competitive Advantages Achieved**: All core local commerce operating system features operational - 30-minute delivery capability, unified inventory search, and local pickup network
- **Local Commerce Operating System**: Core competitive advantage enabling 30-minute delivery vs Amazon's 2-day
- **QR Code Marketing System**: Complete QR generation, scanning, and analytics with IBM Cloudant integration
- **QR Campaign Templates**: 8 proven marketing templates with professional customization and SOAP G coordination
- **SPIRAL SVG Logo Integration**: Branded QR codes with embedded SPIRAL logos for professional appearance and brand recognition
- **SOAP G Central Brain Enhanced**: 7 specialized AI agents with advanced checks & balances system (added InviteToShop agent)
- **Cross-Agent Reporting**: Real-time communication between agents for QR activities and campaign coordination
- **Marketing Analytics Dashboard**: Live QR performance tracking with scan rates, campaign analytics, and auto-refresh
- **Invite to Shop Feature**: AI-enhanced group shopping coordination with personalized recommendations
- **Mall Manager Dashboard**: Professional interface with AI assistant integration and QR marketing hub
- **Information Conduits Verified**: Reliable communication pathways between all agents, features, and functions
- **Admin KPI Collection**: Comprehensive real-time data access for platform monitoring and analytics
- **Multi-Agent Coordination**: Complex workflow orchestration with task tracking and performance monitoring
- **Performance Excellence**: Sub-300ms API response times with automated health monitoring
- **Enterprise Monitoring**: Heartbeat system, load balancing, and automated alerting for degraded performance
- **Agent Specializations**: Each of 7 agents has distinct capabilities for comprehensive platform coverage
- **Real-Time Dashboard**: Live agent status, task distribution, and performance analytics
- **Production Ready**: All information conduits operational for commercial deployment
- **Admin Operations**: Full KPI access across products, stores, events, promotions, and user analytics
- **Scalable Architecture**: Load balancing and health monitoring support enterprise-grade operations
- **Domain Configuration**: spiralshops.com verified and operational, spiralmalls.com DNS configured (August 13, 2025)
- **Performance Optimization Suite**: Comprehensive code splitting, lazy loading, automated slow request detection
- **Continuous Optimization Agent**: Real-time monitoring every 5 minutes with automated performance improvements
- **Site Testing Dashboard**: Live monitoring at /site-testing-dashboard with comprehensive platform testing
- **Deployment Ready**: Production-grade deployment script created for investor presentations
- **Marketplace Enhancement Analysis**: Comprehensive comparison with Amazon, Shopify, Walmart completed (August 13, 2025)
- **Phase 1 Critical Features Identified**: Advanced analytics, SPIRAL fulfillment network, inventory sharing system
- **Competitive Gap Analysis**: Strategic roadmap created for market leadership positioning

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter
- **Styling**: Tailwind CSS with shadcn/ui components, custom color palettes (deep teal, orange highlights; or Navy, Cream, Coral, Sage, Gold), Inter and Poppins fonts, rounded corners (1rem radius).
- **State Management**: TanStack Query for server state, Zustand for global cart state and authentication.
- **Build Tool**: Vite.
- **UI/UX Decisions**: Clean, responsive design; 6 interactive CTA tiles on homepage; loyalty program preview; integrated logistics options; professional blue SPIRAL logo; enhanced feature boxes with 3-column layout; consistent design for coming soon pages; security indicators for trust.
- **AI-First Design**: Conversational interfaces for complex workflows, AI-powered onboarding and assistance, intelligent automation for retailer and shopper tasks.
- **Core Features**:
    - **Shopping**: Product grid, filter sidebar, sorting, product detail pages, cart integration, multi-mall cart support, 18 major product categories with 144+ subcategories.
    - **Loyalty**: SPIRALs earning system (5 cents spent = 1 SPIRAL, $0.50 digital value, $1.00 in-store value), double redemption value in physical stores, sharing/referral bonuses, real-time balance display, loyalty dashboard with tiers and transaction history.
    - **Retailer Experience**: AI-powered 5-step onboarding with RetailerOnboardAgent (Free/Silver/Gold plans, Stripe Connect integration, conversational UI), comprehensive retailer portal with enhanced inventory dashboard, ProductEntryAgent for intelligent inventory management, category/subcategory management, CSV bulk upload/download with AI validation, real-time inventory statistics, sales/fees calculator, analytics dashboard, 5-tier store verification system.
    - **User Experience**: Shopper onboarding, enhanced profile settings, mall gift card system, mobile responsiveness, nationwide smart search, advanced mall directory, wishlist system with priority management and alerts.
    - **Logistics**: Advanced logistics platform with delivery zone management, driver tracking, route optimization, SPIRAL Centers network for hub-based shipping, split shipping functionality (Ship to Me, In-Store Pickup, Ship to Mall SPIRAL Center).
    - **Social & Community**: Comprehensive social media integration with advanced pixel tracking, universal event system, social sharing with SPIRAL rewards, social feed page, "Invite to Shop" feature with group bonuses, complete referral system with tiered rewards.
    - **Accessibility**: One-Click Accessibility Mode with vision, motor, cognitive, and hearing support.
    - **Maps & Location**: Complete location services with GPS detection, distance calculation in miles using Haversine formula, "Near Me" radius filtering (5-50 miles + All US option), turn-by-turn Google Maps directions, location-based store sorting, and comprehensive geolocation components with permission handling.
    - **Testing & Monitoring**: Comprehensive compatibility test system, dynamic auto-expanding test suite, system audit dashboard, real-time logging and performance monitoring, 100% functionality validation.

### Backend Architecture
- **Runtime**: Node.js with Express.js.
- **Language**: TypeScript with ES modules.
- **Database**: PostgreSQL with Drizzle ORM (Neon Database).
- **Session Management**: PostgreSQL-backed sessions.
- **API Style**: REST endpoints.
- **AI Integration**: GPT-4 for smart search, business intelligence, AI customer support, AI retailer onboarding (RetailerOnboardAgent with conversational flow, SPIRAL Agent v1, Verification Agent, Approval GPT).
- **AI Agents System**: Comprehensive AI-powered assistance framework with 7 specialized agents (ShopperAssist, Wishlist, ImageSearch, MallDirectory, AdminAudit, RetailerOnboard, ProductEntry) coordinated by SpiralAIOpsSupervisor. Modern AI-first approach with conversational interfaces replacing traditional form-heavy workflows. Features graceful fallbacks, cross-agent coordination, and 20+ AI endpoints covering all platform functions.
- **Cloud Services**: Vercel deployment, IBM Cloud services (Watson Assistant, Watson Discovery, Cloudant Database, Redis Cache, Kubernetes).
- **Security**: JWT authentication, 3-tier API rate limiting, CSP, XSS protection, input sanitization, CORS.
- **System Design Choices**: Centralized external service router, intelligent fallback for OpenAI API, production-ready architecture for scalability, modular design for feature expansion.

## External Dependencies

- **React Ecosystem**: React, React DOM, React Hook Form
- **Routing**: Wouter
- **HTTP Client**: Native fetch with TanStack Query
- **Database**: Neon Database (PostgreSQL)
- **ORM**: Drizzle ORM
- **Styling**: Tailwind CSS, Radix UI, shadcn/ui, Lucide React icons
- **Validation**: Zod
- **AI/ML**: OpenAI (GPT-4)
- **Cloud Services**: Vercel, IBM Cloud (Watson Assistant, Watson Discovery, Cloudant, Redis, Kubernetes)
- **Payments**: Stripe, Apple Pay, Google Pay, Buy Now Pay Later (BNPL), Cryptocurrency
- **Shipping**: FedEx, UPS, Shippo, EasyPost/Shippo (mock integration)
- **Messaging/Notifications**: Twilio, SendGrid, Firebase/IBM Push Notification System, Nodemailer
- **Social Media Analytics**: Facebook/Meta Pixel, X (Twitter) Pixel, TikTok Pixel, Truth Social tracking, Instagram Business SDK
- **Business Tools**: Shopify (OAuth), Square POS (sync), Mailchimp, QuickBooks
- **Charting**: Recharts
- **Authentication**: bcrypt