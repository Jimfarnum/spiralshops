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
- **Schema Management**: Drizzle migrations with TypeScript schema definitions

## Key Components

### Client-Side Components
- **Pages**: Home (store discovery with mall access), Store (individual store profiles with follow functionality), ProductSearch (product filtering/sorting with mall integration), ProductDetail (individual product pages), Cart (shopping cart management), Login (authentication), SignUp (user registration), Checkout (order processing), Mall (shopping mall directory), NotFound
- **UI Components**: Store cards, retailer signup forms, store profiles, product cards with filtering, mall tenant directories, store follower placeholders
- **Layout**: Header with navigation and cart icon with item count, Footer with links and branding
- **Form Handling**: React Hook Form with Zod validation
- **Product Features**: Search by name, category filtering, sorting by price/distance, mall-based filtering, clickable product links
- **E-commerce Features**: Global cart state management with localStorage persistence, add to cart buttons, quantity controls, one-cart checkout system, order processing simulation, cart restoration notifications
- **Authentication Features**: User registration with form validation, auto-login functionality, local login system with mock credentials, persistent user sessions, login/logout functionality with toast notifications
- **Mall Features**: Dynamic mall routes, tenant store listings, category-based filtering, map-style directory layout, store follower system placeholders

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