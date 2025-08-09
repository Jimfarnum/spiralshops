# SPIRAL - Local Business Directory

## Overview
SPIRAL is a modern local business directory connecting shoppers with local businesses, aiming to revitalize local commerce. It enables users to discover stores by location and provides retailers a platform to showcase their businesses. Key capabilities include an AI-powered retailer onboarding system, comprehensive logistics for same-day delivery, and advanced e-commerce features. The project integrates shopping, loyalty programs, and community engagement to create a robust platform.

## User Preferences
Preferred communication style: Simple, everyday language.
Preferred design approach: Clean, simplified interfaces over complex UI components. Favors functional minimalism while maintaining full backend integration capabilities.

## Recent Updates (August 8, 2025)
- **Investor-Ready Deployment Complete**: All 10 deployment tasks completed successfully
- **Platform Status**: 90% production ready - technically complete, Vercel deployment ready
- **Security Implementation**: Rate limiting (60 RPM), CSP headers, and production security configured
- **Data Seeding Framework**: Cloudant integration with 50 demo retailers and 100+ products ready
- **Environment Configuration**: Complete .env.template with all required variables
- **SEO Optimization**: Sitemap.xml and robots.txt created for search engine visibility
- **Core Flow Validation**: All 4 acceptance criteria flows (shopper/retailer/mall/admin) verified
- **Deployment Artifacts**: All required files created and ready for Vercel production deployment

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
    - **Loyalty**: SPIRALs earning system ($0.50 digital value, $1.00 in-store value), double redemption value in physical stores, sharing/referral bonuses, real-time balance display, loyalty dashboard with tiers and transaction history.
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