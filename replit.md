# SPIRAL - Local Business Directory

## Overview
SPIRAL is a modern local business directory connecting shoppers with local businesses, aiming to revitalize local commerce. It enables users to discover stores by location and provides retailers a platform to showcase their businesses. Key capabilities include an AI-powered retailer onboarding system, comprehensive logistics for same-day delivery, and advanced e-commerce features. The project integrates shopping, loyalty programs, and community engagement to create a robust platform.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter
- **Styling**: Tailwind CSS with shadcn/ui components, custom color palettes (deep teal, orange highlights; or Navy, Cream, Coral, Sage, Gold), Inter and Poppins fonts, rounded corners (1rem radius).
- **State Management**: TanStack Query for server state, Zustand for global cart state and authentication.
- **Build Tool**: Vite.
- **UI/UX Decisions**: Clean, responsive design; 6 interactive CTA tiles on homepage; loyalty program preview; integrated logistics options; professional blue SPIRAL logo; enhanced feature boxes with 3-column layout; consistent design for coming soon pages; security indicators for trust.
- **Core Features**:
    - **Shopping**: Product grid, filter sidebar, sorting, product detail pages, cart integration, multi-mall cart support, 18 major product categories with 144+ subcategories.
    - **Loyalty**: SPIRALs earning system, double redemption value in physical stores, sharing/referral bonuses, real-time balance display, loyalty dashboard with tiers and transaction history.
    - **Retailer Experience**: AI-powered 5-step onboarding, comprehensive retailer portal with enhanced inventory dashboard, category/subcategory management, CSV bulk upload/download, real-time inventory statistics, sales/fees calculator, analytics dashboard, 5-tier store verification system.
    - **User Experience**: Shopper onboarding, enhanced profile settings, mall gift card system, mobile responsiveness, nationwide smart search, advanced mall directory, wishlist system with priority management and alerts.
    - **Logistics**: Advanced logistics platform with delivery zone management, driver tracking, route optimization, SPIRAL Centers network for hub-based shipping, split shipping functionality (Ship to Me, In-Store Pickup, Ship to Mall SPIRAL Center).
    - **Social & Community**: Comprehensive social media integration with advanced pixel tracking, universal event system, social sharing with SPIRAL rewards, social feed page, "Invite to Shop" feature with group bonuses.
    - **Accessibility**: One-Click Accessibility Mode with vision, motor, cognitive, and hearing support.
    - **Maps & Location**: Complete Google Maps integration with precise coordinates, one-click directions, store location display, mall navigation, user geolocation support, responsive maps components, Near Me smart filter with radius-based proximity search, category filtering, and intelligent suggestions.
    - **Testing & Monitoring**: Comprehensive compatibility test system, dynamic auto-expanding test suite, system audit dashboard, real-time logging and performance monitoring, 100% functionality validation.

### Backend Architecture
- **Runtime**: Node.js with Express.js.
- **Language**: TypeScript with ES modules.
- **Database**: PostgreSQL with Drizzle ORM (Neon Database).
- **Session Management**: PostgreSQL-backed sessions.
- **API Style**: REST endpoints.
- **AI Integration**: GPT-4 for smart search, business intelligence, AI customer support, AI retailer onboarding (SPIRAL Agent v1, Verification Agent, Approval GPT).
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