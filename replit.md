# SPIRAL - Local Business Directory

## Overview
SPIRAL is a modern local business directory designed to revitalize local commerce by connecting shoppers with local businesses. It provides a platform for retailers to showcase their stores and offers users the ability to discover businesses by location. Key capabilities include an AI-powered retailer onboarding system, comprehensive logistics for same-day delivery, and advanced e-commerce features. The project integrates shopping, loyalty programs, and community engagement to create a robust platform with a vision to achieve competitive advantages in local commerce, such as 30-minute delivery and unified inventory search.

## User Preferences
Preferred communication style: Simple, everyday language.
Preferred design approach: Clean, simplified interfaces over complex UI components. Favors functional minimalism while maintaining full backend integration capabilities.
Preferred server configuration: Simplified JavaScript server using `node server/index.js` with `npm start` command, port 3000 default.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript.
- **Routing**: Wouter.
- **Styling**: Tailwind CSS with shadcn/ui components, custom color palettes (deep teal, orange highlights; or Navy, Cream, Coral, Sage, Gold), Inter and Poppins fonts, rounded corners (1rem radius).
- **State Management**: TanStack Query for server state, Zustand for global cart state and authentication.
- **Build Tool**: Vite.
- **UI/UX Decisions**: Clean, responsive design with a focus on interactive CTAs, loyalty program integration, professional blue SPIRAL logo, consistent design, and security indicators. Emphasis on AI-first design with conversational interfaces for complex workflows.
- **Core Features**:
    - **Shopping**: Product grid, filtering, sorting, product detail pages, multi-mall cart support, extensive product categories.
    - **Loyalty**: SPIRALs earning system (5 cents spent = 1 SPIRAL, digital and in-store redemption), sharing bonuses, real-time balance, loyalty dashboard.
    - **Retailer Experience**: AI-powered 5-step onboarding (RetailerOnboardAgent), comprehensive retailer portal with enhanced inventory dashboard (ProductEntryAgent), category management, CSV bulk operations with AI validation, real-time inventory statistics, sales/fees calculator, analytics, 5-tier store verification.
    - **User Experience**: Shopper onboarding, enhanced profile settings, mall gift card system, mobile responsiveness, nationwide smart search, advanced mall directory, wishlist system.
    - **Logistics**: Advanced platform with delivery zone management, driver tracking, route optimization, SPIRAL Centers network, split shipping (Ship to Me, In-Store Pickup, Ship to Mall SPIRAL Center).
    - **Social & Community**: Comprehensive social media integration with pixel tracking, universal event system, social sharing with SPIRAL rewards, social feed, "Invite to Shop" feature, referral system.
    - **Accessibility**: One-Click Accessibility Mode (vision, motor, cognitive, hearing support).
    - **Maps & Location**: Complete location services with GPS detection, distance calculation (Haversine formula), "Near Me" radius filtering, turn-by-turn Google Maps directions, location-based store sorting, geolocation components.
    - **Testing & Monitoring**: Comprehensive compatibility test system, dynamic auto-expanding test suite, system audit dashboard, real-time logging and performance monitoring, 100% functionality validation, including a self-check suite and production monitoring.

### Backend Architecture
- **Runtime**: Node.js with Express.js.
- **Language**: JavaScript ES modules with TypeScript development support.
- **Server Configuration**: Dual setup - TypeScript development server (server/index.ts) and simplified JavaScript production server (server/index.js).
- **Database**: PostgreSQL with Drizzle ORM (Neon Database).
- **Session Management**: PostgreSQL-backed sessions.
- **API Style**: REST endpoints.
- **AI Integration**: GPT-4 for smart search, business intelligence, customer support, and retailer onboarding.
- **AI Agents System**: Comprehensive AI-powered assistance framework with 7 specialized agents (ShopperAssist, Wishlist, ImageSearch, MallDirectory, AdminAudit, RetailerOnboard, ProductEntry) coordinated by SpiralAIOpsSupervisor. Features graceful fallbacks, cross-agent coordination, and over 20 AI endpoints.
- **Cloud Services**: Vercel deployment, IBM Cloud services (Watson Assistant, Watson Discovery, Cloudant Database, Redis Cache, Kubernetes).
- **Security**: JWT authentication, 3-tier API rate limiting, CSP, XSS protection, input sanitization, CORS.
- **System Design Choices**: Centralized external service router, intelligent fallback for OpenAI API, production-ready architecture for scalability, modular design for feature expansion.

#### Recent Changes (August 15, 2025)
- Created simplified JavaScript server (server/index.js) for direct Node.js execution
- Configured for port 3000 default with PORT environment variable support
- Maintains all SPIRAL AI systems and 7 SOAP G Central Brain agents
- Ready for npm start configuration with node server/index.js

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
- **Shipping**: FedEx, UPS, Shippo, EasyPost/Shippo
- **Messaging/Notifications**: Twilio, SendGrid, Firebase/IBM Push Notification System, Nodemailer
- **Social Media Analytics**: Facebook/Meta Pixel, X (Twitter) Pixel, TikTok Pixel, Truth Social tracking, Instagram Business SDK
- **Business Tools**: Shopify (OAuth), Square POS (sync), Mailchimp, QuickBooks
- **Charting**: Recharts
- **Authentication**: bcrypt