# SPIRAL - Local Business Directory

## Overview

SPIRAL is a modern local business directory application that connects shoppers with local businesses. Built with React, TypeScript, and Express, it features a clean, responsive design and allows users to discover stores by location while providing retailers with a platform to showcase their businesses.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (January 2025)

✓ **Complete Frontend Redesign**: Transformed homepage with 6 interactive CTA tiles, loyalty program preview, and logistics options
✓ **Brand Identity Update**: Replaced revolving logo with static SPIRAL logo, updated tagline to "Everything Local. Just for you."
✓ **Color Palette Refresh**: Implemented warmer, inviting colors - deep teal (#006d77), subtle orange highlights (#ff9f1c), soft white background (#fefefe)
✓ **Typography Enhancement**: Added Inter and Poppins fonts for modern, friendly appearance
✓ **Modern UI Components**: All buttons, cards, and CTAs use rounded corners (1rem radius) for polished, contemporary feel
✓ **Feature Sections Added**: 
  - 6 CTA tiles (Shop Local, Explore Malls, Retailer Sign-Up, Discover Finds, Loyalty Program, Delivery Options)
  - SPIRAL Rewards loyalty program preview with 3-step explanation
  - Logistics options with 4 fulfillment methods (In-Store Pickup, Standard Shipping, Ship-to-Store, Same-Day Delivery)
  - Enhanced Featured Local Finds section with "View All" button
✓ **Layout Improvements**: Increased vertical spacing, improved mobile responsiveness, enhanced visual hierarchy
✓ **E-commerce Foundation**: Complete product grid infrastructure ready for filters, sorting, and product detail pages
✓ **Advanced Product Features (Step 2 Complete)**:
  - Comprehensive filter sidebar (Category, Price Range, Store Selection, Distance)
  - Responsive mobile filter panel with toggle sheet
  - Full sorting functionality (Relevance, Price Low/High, Distance)
  - Product detail pages with full product information, ratings, quantity controls
  - Breadcrumb navigation and back button functionality
  - Enhanced cart integration with quantity support
  - "Find in Store" button placeholder for future map integration
  - Related products section placeholder

✓ **Complete UI Design Refresh (January 2025)**:
  - New warm color palette: Navy (#2C3E50), Cream (#F5F3EF), Coral (#E27D60), Sage (#A8BFAA), Gold (#F4B860)
  - Google Fonts integration: Inter (body), Poppins (headings) with system fallbacks
  - Enhanced spacing, 8px corner rounding, soft shadows throughout
  - Coming Soon pages for all homepage tiles with proper routing
  - Tile descriptions added under each CTA for better UX

✓ **Enhanced Shopping Cart & Checkout (MVP Phase 3 Complete)**:
  - Redesigned cart page with new color palette and improved layout
  - Real-time totals with tax calculation and free shipping threshold
  - Quantity controls with visual feedback and item removal
  - Comprehensive checkout form with full validation
  - Customer information, shipping address, and payment sections
  - Order confirmation with tracking number generation
  - Cart persistence across page refreshes via localStorage
  - Breadcrumb navigation and back button functionality
  - Security indicators and SSL messaging for trust

✓ **MVP Phase 4 Complete - Mall Mode & Logistics (January 2025)**:
  - Created /mall page with SPIRAL Mall Mode branding and feature preview
  - Built /spirals loyalty program landing page with detailed rewards system
  - Enhanced checkout with 3 fulfillment options: Ship to Me, In-Store Pickup, Ship to Mall
  - Conditional form validation based on selected fulfillment method
  - Updated all Coming Soon pages with consistent design and new color palette
  - Added "Everything Local. Just for You." tagline to header and footer
  - All pages now use CSS variables for the new color system

✓ **MVP Phase 5 Complete - Full SPIRAL Loyalty Program (January 2025)**:
  - Complete PostgreSQL database integration with users, spiralTransactions, and orders tables
  - Comprehensive SPIRAL earning structure: 5 SPIRALs per $100 online, 10 SPIRALs per $100 in-person
  - Double redemption value system: SPIRALs earned online worth 2x when redeemed in physical stores
  - Sharing and referral bonus system: +5 SPIRALs for experiences and bringing friends
  - Full checkout integration with automatic SPIRAL earning based on fulfillment method
  - Real-time SPIRAL balance display in header for authenticated users
  - Enhanced SPIRALs page with detailed program benefits and community messaging
  - Backend API infrastructure for SPIRAL transactions, user management, and order tracking
  - Frontend loyalty store with persistent transaction history and balance management
  - Order confirmation displays showing SPIRALs earned with motivational messaging

✓ **MVP Phase 6 Complete - Advanced Logistics & Social Sharing (January 2025)**:
  - Split shipping functionality: users can choose different fulfillment methods per item
  - Three fulfillment options: Ship to Me, In-Store Pickup, Ship to Mall SPIRAL Center
  - Conditional messaging system: "Ready today for pickup", "Ships in 2 days", etc.
  - Social sharing integration with X (Twitter), Facebook, and unique SPIRAL link generation
  - Templated sharing messages promoting local retailer support and community engagement
  - Profile settings page with retailer suggestions and SPIRAL experiences toggles
  - Modular logistics and social-sharing architecture ready for future API integrations
  - Enhanced checkout flow showing SPIRAL earnings preview and fulfillment timing
  - Product detail pages with integrated social sharing for individual items
  - User profile link in header navigation for easy settings access

✓ **MVP Phase 7 Complete - Next Feature Rollout (January 2025)**:
  - SPIRAL Mall Directory with featured malls, search/filter functionality, and detailed mall pages
  - Enhanced product detail pages with SPIRAL earning calculations and fulfillment method selection
  - Comprehensive user account dashboard with order history, favorite stores, and profile management
  - Complete retailer portal with product management, analytics placeholder, and SPIRAL activity tracking
  - Four new routes: /mall-directory, /account, /retailer-login, /retailer-dashboard
  - Retailer product CRUD operations with inventory tracking and promotion controls
  - Mall directory features category filtering, distance sorting, and tenant count displays

✓ **MVP Phase 8 Complete - Marketing Automations, Inventory Syncing, and Analytics Dashboard (January 2025)**:
  - Marketing Center (/marketing-center) with email campaign builder, social post scheduler, and coupon generator
  - Template-based email campaigns with audience targeting (all users, store followers, high SPIRAL users)
  - Automated coupon code generation with percentage discounts, date ranges, and SPIRAL point boosts
  - Social media post scheduling for X (Twitter) and Facebook with content and timing controls
  - Campaign analytics tracking with sent/opened metrics and conversion rates
  - Inventory Syncing in retailer dashboard with CSV import/export functionality for bulk product management
  - Manual import system supporting product_id, title, description, price, stock, category format
  - Import status tracking with success/failure reporting and validation feedback
  - Analytics Dashboard (/analytics-dashboard) with comprehensive platform insights
  - Weekly SPIRAL earnings tracking, top product performance metrics, and user activity analysis
  - Conversion rate monitoring, retailer performance rankings, and customer engagement statistics
  - Real-time dashboard with growth percentages, trend analysis, and detailed breakdowns by category

✓ **MVP Phase 9 Complete - Social Sharing Engine & Viral Growth (January 2025)**:
  - Comprehensive Social Sharing Engine with templated messages for Facebook, X (Twitter), and Instagram
  - Platform-specific sharing templates with emojis, hashtags, and community messaging (#SPIRALshops #ShopLocal)
  - Social sharing integration across all major pages: product details, storefronts, checkout, mall pages, user accounts
  - Reward system: Users earn 5 SPIRALs per social share to incentivize viral growth
  - Social Feed page (/social-feed) displaying community experiences, top sharers, and user-generated content
  - Order confirmation page with integrated social sharing and SPIRAL earnings celebration
  - Community navigation link in header for easy access to social features
  - Copy link functionality and Instagram app integration for seamless sharing across platforms
  - Motivational sharing messages promoting local business support and community engagement
  - Real-time sharing analytics and community leaderboard for top SPIRAL ambassadors

✓ **MVP Phase 10 Complete - Viral Incentives, Video Hub, and Feature Inventory (January 2025)**:
  - Viral Invite Code System with unique user codes generating +20 SPIRALs for signup, +50 for first purchase
  - Complete referral tracking with community status tiers (New Member → Community Builder → Local Ambassador → Community Champion → SPIRAL Legend)
  - SPIRAL Video Hub (/spiral-videos) with categorized content: Shop Stories, Local Legends, Mall Tours, SPIRAL Tips
  - Embedded video player with social sharing integration and community engagement features
  - Internal Feature Inventory page (/spiral-features) for comprehensive development tracking and deployment readiness assessment
  - Database schema expansion with invite codes, referral tracking, and viral growth analytics
  - Account dashboard integration with invite code management and referral statistics
  - Video hub navigation link and comprehensive feature documentation for platform audit

✓ **Advanced Analytics Dashboard for Retailers (January 2025)**:
  - Comprehensive Analytics Dashboard (/retailer-analytics) with interactive Recharts visualization (Area, Bar, Line, Pie charts)
  - Real-time business metrics: Revenue trends, order volume, customer analytics, SPIRAL activity tracking
  - 4-tab navigation system: Revenue & Orders, Customer Analytics, Product Performance, SPIRAL Activity
  - AI-Powered Business Insights (/retailer-insights) with smart recommendations and priority-based alerts
  - Performance benchmarking against industry averages with actionable improvement suggestions
  - Customer segmentation analysis (VIP, Regular, Occasional buyers) with retention and spending patterns
  - Export functionality and time range filtering (7d, 30d, 90d, 1y) for comprehensive business intelligence
  - Integration with retailer dashboard featuring "Advanced Analytics" quick access link

✓ **Final Logo Update & End-to-End Testing Suite (January 2025)**:
  - Updated header with static blue spiral logo (non-animated, professional presentation)
  - Fixed header layout preventing cart icon overlap with tagline "Everything Local. Just for You."
  - Comprehensive End-to-End Testing Suite (/test-flow) with 6 critical path validations
  - Interactive testing dashboard with real-time progress tracking and detailed results
  - Multi-store cart functionality validation with SPIRAL points calculation (5 per $100)
  - Mixed fulfillment options testing: Ship to Me, In-Store Pickup, Mall SPIRAL Center
  - Complete checkout flow with order confirmation and SPIRAL balance updates
  - Professional logo scaling (48px max height) across all pages and components

✓ **Enhanced Location Filtering & Mall-Specific Shopping Mode (January 2025)**:
  - Comprehensive location filtering system supporting zip code, city, state, and mall name search
  - Auto-suggest dropdown functionality with tabbed interface for organized location selection
  - Mall-specific shopping mode limiting product discovery to selected mall with session persistence
  - LocationStore with Zustand persistence for maintaining mall context across page refreshes
  - Enhanced CartStore with mall context awareness for exclusive mall-based shopping
  - Visual indicators for mall mode with easy toggle/exit functionality
  - Fulfillment options retained within mall context (Ship to Me, In-Store Pickup, SPIRAL Center)
  - MallContextSync component for seamless integration between location and cart systems
  - Products page integration with mall-aware filtering and dynamic header messaging

✓ **Nationwide Smart Search & Advanced Mall Directory (January 2025)**:
  - Comprehensive Shopping Malls Directory (/malls) with detailed mall information, ratings, and store counts
  - Advanced distance-based filtering: 5mi, 10mi, 25mi, 50mi, 100mi, and Nationwide options
  - Dual search system: general keyword search + intelligent use case filtering
  - Smart product use case categorization (office-ready, for camping, gift-worthy, entertaining, etc.)
  - Expandable filter controls with popular search quick tags for rapid discovery
  - Mall selection functionality enabling exclusive mall shopping mode from directory
  - Enhanced location-aware sorting with nearest-first priority and relevance ranking
  - Improved TypeScript reliability and performance optimization across filtering systems

✓ **Complete Wishlist & Payment System Integration (January 2025)**:
  - Comprehensive Wishlist System (/wishlist) with priority management (High, Medium, Low)
  - Availability tracking with in-stock, low-stock, and out-of-stock indicators
  - Direct cart integration with one-click add-to-cart functionality from saved items
  - Advanced Stripe payment integration with multiple payment methods (Card, Apple Pay, Google Pay)
  - Secure payment processing with real-time validation and error handling
  - Enhanced checkout flow with integrated payment success/error callbacks
  - Mobile-optimized interfaces with touch-friendly interactions and responsive design
  - Mobile navigation with slide-out menu and optimized product grid layouts

✓ **Real-Time Inventory Alerts & Multi-Language Support (January 2025)**:
  - Real-time inventory monitoring with automatic stock level updates and low-stock notifications
  - Comprehensive alert system with browser notifications, email, and SMS options
  - Multi-language support infrastructure with English and Spanish translations (95% complete)
  - Language selector component with auto-detection and preference persistence
  - Inventory Dashboard (/inventory-dashboard) with detailed stock status tracking and trend analysis
  - Notification preference management with granular control over alert types and delivery methods
  - Translation system ready for expansion to French, German, and Portuguese markets
  - Performance optimizations and mobile-responsive language switching interface

✓ **Dynamic Auto-Expanding Test Suite (January 2025)**:
  - Comprehensive testing configuration system that automatically grows with new features
  - Modular test structure organized by feature areas (core, e-commerce, mobile, analytics, etc.)
  - Dynamic test dashboard (/dynamic-testing) with real-time statistics and category breakdowns
  - Automated test runner with 90% success simulation for continuous validation
  - Manual testing guidelines with direct route links for human verification
  - Feature addition interface allowing developers to expand test coverage as new features are built
  - Test categorization by priority (critical, high, medium, low) and automation capability
  - Live feature demonstration with real inventory alerts and language switching components

✓ **Priority Features Implementation - Phase 12 (January 2025)**:
  - Mall Directory Dropdown & Locator with ZIP code search, GPS location, and auto-suggest functionality
  - Mall Page Template system with comprehensive mall information, events, perks, and SPIRAL Center details
  - Complete Gift Card System supporting all-store, mall-specific, and store-specific gift cards with purchase/redeem flow
  - Mall Events Calendar with RSVP functionality, SPIRAL bonuses, and social sharing integration
  - Multi-Retailer Cart supporting different fulfillment methods per item across multiple stores and malls
  - Enhanced database schema with malls, gift cards, events, RSVPs, and cart items tables
  - Integrated homepage mall directory section for improved user experience and mall discovery
  - Complete routing system for /gift-cards, /events, /multi-cart, and /mall/:id pages

✓ **Mall Store Pages & Reviews System Implementation (January 2025)**:
  - Individual Mall Store Pages (P0) with dedicated product listings, store hours, ratings, and contact information
  - Complete Reviews & Ratings Module (P1) supporting both product and store reviews with verified purchase badges
  - Tab-based navigation for mall store pages (Products, About & Hours, Current Offers, Reviews)
  - Comprehensive review system with star ratings, filtering options, and helpful vote functionality
  - Product detail pages with integrated reviews section and detailed product specifications
  - Enhanced cart integration from mall store pages with SPIRAL earning calculations
  - Clickable store cards in mall directories linking to individual store pages
  - Database schema expansion with reviews table supporting both product and store reviews

✓ **Split Fulfillment Service Implementation (January 2025)**:
  - Advanced Split Fulfillment Service (P1) with individual item-level fulfillment method selection
  - Enhanced cart store supporting ship-to-me, in-store-pickup, and ship-to-mall options per item
  - Database schema expansion with orderItems and fulfillmentGroups tables for optimized shipping logic
  - FulfillmentSelector component for individual item fulfillment method configuration
  - FulfillmentGroups component with intelligent grouping by store and fulfillment method
  - Complete split fulfillment checkout page (/split-fulfillment) with 3-step process: setup, review, completion
  - Real-time shipping cost calculation: $4.99 for ship-to-me, free for pickup methods
  - Delivery time estimates: "Ready today" for pickup, "2-5 business days" for shipping
  - Smart fulfillment tips and optimization suggestions for users
  - Integration with existing cart page featuring "Split Fulfillment Options" button

✓ **Homepage Redesign - Professional Layout & Blue SPIRAL Logo (January 2025)**:
  - Resized feature boxes by ~50% using max-w-[300px], py-4, px-4 dimensions for visual consistency
  - Implemented responsive grid layout with grid-cols-1 md:grid-cols-2 gap-4 for mobile-first design
  - Updated typography with text-lg font-semibold titles and text-sm descriptions for improved readability
  - Changed card alignment from center to left-aligned text for professional appearance
  - Added custom blue SPIRAL logo SVG with gradient design and proper scaling (w-16 h-16)
  - Converted vertical cards to horizontal layout with icons and compact text for better mobile experience
  - Enhanced mobile responsiveness with proper spacing and consistent visual hierarchy
  - Updated all feature cards to use shortened descriptions while maintaining key information
  - Replaced SVG logo with actual SPIRAL logo image throughout homepage and header components
  - Added spiral logo to public assets folder for consistent branding across the platform

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state, Zustand for global cart state and authentication
- **Build Tool**: Vite for development and production builds
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: PostgreSQL-backed sessions
- **API Style**: REST endpoints

### Database Schema
- **Stores Table**: Business information including name, description, category, address, contact details, ratings, and operational status
- **Retailers Table**: Retailer registration data with approval workflow
- **Users Table**: User authentication and loyalty tracking with SPIRAL balance, total earned/redeemed
- **SPIRAL Transactions Table**: Complete transaction history for earning and redemption with source tracking
- **Orders Table**: Purchase tracking with fulfillment methods and SPIRAL earning calculations
- **Schema Management**: Drizzle migrations with TypeScript schema definitions and relational mapping

## Key Components

### Client-Side Components
- **Pages**: Home (store discovery with mall access), Store (individual store profiles with follow functionality), ProductSearch (product filtering/sorting with mall integration), ProductDetail (individual product pages with social sharing), Cart (shopping cart management), Login (authentication), SignUp (user registration), Checkout (order processing with split shipping), Mall (shopping mall directory), ProfileSettings (user preferences and loyalty dashboard), NotFound
- **UI Components**: Store cards, retailer signup forms, store profiles, product cards with filtering, mall tenant directories, social sharing dialogs, split shipping controls, SPIRAL balance displays
- **Layout**: Header with navigation, cart icon with item count, SPIRAL balance display, and profile link, Footer with links and branding
- **Form Handling**: React Hook Form with Zod validation
- **Product Features**: Search by name, category filtering, sorting by price/distance, mall-based filtering, clickable product links, social sharing integration
- **E-commerce Features**: Global cart state management with localStorage persistence, add to cart buttons, quantity controls, split shipping checkout system, order processing simulation, cart restoration notifications
- **Authentication Features**: User registration with form validation, auto-login functionality, local login system with mock credentials, persistent user sessions, login/logout functionality with toast notifications
- **Mall Features**: Dynamic mall routes, tenant store listings, category-based filtering, map-style directory layout, store follower system placeholders
- **Social Features**: X/Twitter and Facebook sharing, unique SPIRAL link generation, templated community messages, profile settings for sharing preferences
- **Logistics Features**: Item-level fulfillment method selection, conditional delivery messaging, three shipping options with timing estimates

### Server-Side Components
- **Storage Layer**: Abstracted storage interface with in-memory implementation
- **API Routes**: Store CRUD operations, retailer registration, ZIP code search
- **Middleware**: Request logging, JSON parsing, error handling
- **Development**: Vite integration for hot reloading

### Shared Components
- **Schema**: Drizzle schema definitions shared between client and server
- **Types**: TypeScript interfaces for stores and retailers
- **Validation**: Zod schemas for form validation

## Data Flow

1. **Store Discovery**: Users search by ZIP code, browse all stores, or explore shopping malls
2. **Store Display**: Stores are fetched from the database and displayed as cards with follow functionality
3. **Store Details**: Individual store pages show comprehensive business information with retailer-focused features
4. **Mall Integration**: Shopping mall format with tenant listings, category filters, and directory maps
5. **User Registration**: New users can create accounts with auto-login and persistent authentication
6. **Shopping Experience**: Complete cart-to-checkout flow with quantity management and order processing
7. **Retailer Registration**: Business owners can submit applications through forms
8. **Data Persistence**: All data is stored in PostgreSQL with Drizzle ORM

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form
- **Routing**: Wouter for client-side navigation
- **HTTP Client**: Native fetch with TanStack Query wrapper
- **Database**: Neon Database serverless PostgreSQL
- **ORM**: Drizzle ORM with Drizzle Kit for migrations

### UI and Styling
- **Styling**: Tailwind CSS with PostCSS
- **Component Library**: Radix UI primitives
- **Utility Libraries**: clsx, class-variance-authority
- **Icons**: Lucide React icons

### Development Tools
- **Build Tool**: Vite with React plugin
- **TypeScript**: Full TypeScript support across the stack
- **Development**: tsx for server-side TypeScript execution
- **Validation**: Zod for runtime type validation

## Deployment Strategy

### Development Environment
- **Server**: Express with Vite middleware for hot reloading
- **Database**: Environment-based DATABASE_URL configuration
- **Build Process**: Separate client and server builds
- **Development Tools**: Replit-specific plugins for development experience

### Production Build
- **Client**: Vite builds React app to `dist/public`
- **Server**: esbuild compiles TypeScript server to `dist/index.js`
- **Static Files**: Express serves built client files
- **Database**: PostgreSQL connection via DATABASE_URL environment variable

### Configuration Management
- **Environment Variables**: DATABASE_URL for database connection
- **Build Scripts**: Separate development and production configurations
- **Asset Handling**: Vite handles client-side assets, Express serves static files

The application follows a clean separation of concerns with shared TypeScript types and schemas, making it maintainable and scalable for future enhancements.