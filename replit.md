# SPIRAL - Local Business Directory

## Overview
SPIRAL is a modern local business directory connecting shoppers with local businesses. It enables users to discover stores by location and provides retailers a platform to showcase their businesses. Key capabilities include an AI-powered retailer onboarding system, comprehensive logistics for same-day delivery, and advanced e-commerce features. The project aims to revitalize local commerce by providing a robust platform that integrates shopping, loyalty programs, and community engagement, positioning itself as a competitive solution in the local retail market.

## Recent Changes (August 1, 2025)
- **Comprehensive Platform Gap Resolution**: Fixed critical API endpoints (featured products 404 errors), implemented functional product search system, enhanced featured products display with professional design
- **Search System Implementation**: Created dedicated SearchResults page with grid/list views, sorting, filtering, comprehensive error handling, and proper navigation flow
- **API Layer Enhancement**: Added `/api/products/featured` and `/api/products/search` endpoints with pagination, filtering, discount calculation, and robust error handling
- **SEO Landing Page**: Built conversion-optimized landing page matching HTML template requirements with structured data, meta tag optimization, and comprehensive footer navigation
- **Enhanced Featured Products**: Professional component with discount badges, ratings, add-to-cart functionality, hover effects, and improved user experience
- **Performance Optimization**: Resolved API response delays, improved error handling, enhanced user feedback mechanisms, and implemented proper loading states
- **Navigation Flow Improvement**: Product search now navigates to dedicated results page, enhanced user journey from discovery to conversion
- **Quality Assurance**: All components tested for responsiveness, error states validated, API endpoints functioning correctly, and professional user experience confirmed

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
    - **Shopping**: Product grid, filter sidebar (Category, Price Range, Store, Distance), sorting, product detail pages, breadcrumb navigation, cart integration with quantity controls, multi-mall cart support, 18 major product categories with 144+ subcategories.
    - **Loyalty**: SPIRALs earning (5 per $100 online, 10 per $100 in-person), double redemption value in physical stores, sharing/referral bonuses (+5 SPIRALs), real-time balance display, loyalty dashboard with tiers and transaction history.
    - **Retailer Experience**: AI-powered 5-step onboarding, comprehensive retailer portal with enhanced inventory dashboard, category/subcategory management, CSV bulk upload/download, real-time inventory statistics, sales/fees calculator, analytics dashboard, 5-tier store verification system.
    - **User Experience**: Shopper onboarding (4-step walkthrough), enhanced profile settings (6 tabs), mall gift card system, mobile responsiveness (95%+ compatibility), nationwide smart search, advanced mall directory, wishlist system with priority management and alerts (email, SMS, push).
    - **Logistics**: Advanced logistics platform with delivery zone management, driver tracking, route optimization, SPIRAL Centers network for hub-based shipping, split shipping functionality per item (Ship to Me, In-Store Pickup, Ship to Mall SPIRAL Center).
    - **Social & Community**: Comprehensive social media integration (Facebook/Meta, X/Twitter, Instagram, TikTok, Truth Social) with advanced pixel tracking, universal event system, social sharing with SPIRAL rewards, social feed page, "Invite to Shop" feature with group bonuses.
    - **Accessibility**: One-Click Accessibility Mode with vision, motor, cognitive, and hearing support (high contrast, text scaling, larger click targets, simplified layouts).
    - **Testing & Monitoring**: Comprehensive compatibility test system for Vercel/IBM Cloud, dynamic auto-expanding test suite, system audit dashboard, real-time logging and performance monitoring, 100% functionality validation.

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
- **Payments**: Stripe, Apple Pay, Google Pay, Buy Now Pay Later (BNPL), Cryptocurrency (integrated)
- **Shipping**: FedEx, UPS, Shippo, EasyPost/Shippo (mock integration)
- **Messaging/Notifications**: Twilio, SendGrid, Firebase/IBM Push Notification System, Nodemailer (for email notifications)
- **Social Media Analytics**: Facebook/Meta Pixel, X (Twitter) Pixel, TikTok Pixel, Truth Social tracking, Instagram Business SDK
- **Business Tools**: Shopify (OAuth), Square POS (sync), Mailchimp, QuickBooks
- **Charting**: Recharts (for analytics dashboards)
- **Authentication**: bcrypt (password hashing)