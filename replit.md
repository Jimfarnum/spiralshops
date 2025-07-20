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