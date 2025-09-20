// Feature Registry - Automatically tracks all SPIRAL features for testing
export interface Feature {
  id: string;
  name: string;
  route: string;
  category: 'core' | 'ecommerce' | 'mobile' | 'performance' | 'security' | 'social' | 'analytics' | 'loyalty';
  status: 'live' | 'beta' | 'coming-soon' | 'deprecated';
  description: string;
  testCriteria: string[];
  dependencies?: string[];
  dateAdded: string;
  lastUpdated: string;
  version: string;
}

export const SPIRAL_FEATURES: Feature[] = [
  // Core Platform Features
  {
    id: 'homepage',
    name: 'Homepage & Navigation',
    route: '/',
    category: 'core',
    status: 'live',
    description: 'Main landing page with navigation and hero content',
    testCriteria: ['Page loads under 3s', 'Navigation works', 'Hero content displays'],
    dateAdded: '2024-12-01',
    lastUpdated: '2025-01-21',
    version: '2.1.0'
  },
  {
    id: 'product-search',
    name: 'Product Search & Discovery',
    route: '/products',
    category: 'ecommerce',
    status: 'live',
    description: 'Advanced product search with filtering and sorting',
    testCriteria: ['Search results load', 'Filters work correctly', 'Sorting functions', 'Pagination works'],
    dateAdded: '2024-12-15',
    lastUpdated: '2025-01-20',
    version: '3.2.0'
  },
  {
    id: 'shopping-cart',
    name: 'Shopping Cart System',
    route: '/cart',
    category: 'ecommerce',
    status: 'live',
    description: 'Full shopping cart with quantity controls and persistence',
    testCriteria: ['Add to cart works', 'Quantity updates', 'Cart persists', 'Remove items works'],
    dateAdded: '2024-12-20',
    lastUpdated: '2025-01-18',
    version: '2.8.0'
  },
  {
    id: 'checkout-flow',
    name: 'Checkout & Payment',
    route: '/checkout',
    category: 'ecommerce',
    status: 'live',
    description: 'Complete checkout with Stripe payment integration',
    testCriteria: ['Form validation works', 'Payment methods load', 'Order processing completes', 'SPIRAL calculation correct'],
    dependencies: ['shopping-cart', 'user-auth'],
    dateAdded: '2025-01-05',
    lastUpdated: '2025-01-21',
    version: '1.5.0'
  },
  {
    id: 'wishlist-system',
    name: 'Wishlist Management',
    route: '/wishlist',
    category: 'ecommerce',
    status: 'live',
    description: 'Priority-based wishlist with availability tracking',
    testCriteria: ['Add to wishlist works', 'Priority changes work', 'Availability updates', 'Cart integration works'],
    dateAdded: '2025-01-15',
    lastUpdated: '2025-01-21',
    version: '1.2.0'
  },
  {
    id: 'inventory-alerts',
    name: 'Real-Time Inventory Alerts',
    route: '/inventory-dashboard',
    category: 'core',
    status: 'live',
    description: 'Real-time stock monitoring with browser notifications',
    testCriteria: ['Stock updates in real-time', 'Notifications work', 'Alert toggles function', 'Progress bars update'],
    dateAdded: '2025-01-21',
    lastUpdated: '2025-01-21',
    version: '1.0.0'
  },
  {
    id: 'multi-language',
    name: 'Multi-Language Support',
    route: '/inventory-dashboard',
    category: 'core',
    status: 'live',
    description: 'English/Spanish language switching with persistence',
    testCriteria: ['Language switching works', 'Translations persist', 'Auto-detection works', 'All UI elements translate'],
    dateAdded: '2025-01-21',
    lastUpdated: '2025-01-21',
    version: '1.0.0'
  },
  {
    id: 'user-authentication',
    name: 'User Authentication',
    route: '/login',
    category: 'core',
    status: 'live',
    description: 'User registration, login, and session management',
    testCriteria: ['Registration works', 'Login validates correctly', 'Sessions persist', 'Logout clears session'],
    dateAdded: '2024-12-10',
    lastUpdated: '2025-01-10',
    version: '2.0.0'
  },
  {
    id: 'spiral-loyalty',
    name: 'SPIRAL Loyalty Program',
    route: '/spirals',
    category: 'loyalty',
    status: 'live',
    description: 'Complete loyalty program with earning and redemption',
    testCriteria: ['SPIRAL earning works', 'Balance displays correctly', 'Redemption functions', 'Transaction history accurate'],
    dateAdded: '2024-12-25',
    lastUpdated: '2025-01-15',
    version: '3.0.0'
  },
  {
    id: 'mall-directory',
    name: 'Shopping Mall Directory',
    route: '/malls',
    category: 'ecommerce',
    status: 'live',
    description: 'Comprehensive mall directory with location filtering',
    testCriteria: ['Mall search works', 'Location filtering accurate', 'Mall details load', 'Store listings complete'],
    dateAdded: '2025-01-05',
    lastUpdated: '2025-01-18',
    version: '2.0.0'
  },
  {
    id: 'social-sharing',
    name: 'Social Sharing Engine',
    route: '/social-feed',
    category: 'social',
    status: 'live',
    description: 'Social sharing with SPIRAL rewards and community features',
    testCriteria: ['Share buttons work', 'SPIRAL rewards credited', 'Community feed loads', 'Platform integration works'],
    dateAdded: '2025-01-08',
    lastUpdated: '2025-01-16',
    version: '1.8.0'
  },
  {
    id: 'retailer-dashboard',
    name: 'Retailer Management Portal',
    route: '/retailer-dashboard',
    category: 'analytics',
    status: 'live',
    description: 'Complete business management dashboard for retailers',
    testCriteria: ['Login works', 'Product management functions', 'Analytics load', 'Inventory sync works'],
    dateAdded: '2024-12-28',
    lastUpdated: '2025-01-12',
    version: '2.5.0'
  },
  {
    id: 'mobile-optimization',
    name: 'Mobile Optimization',
    route: '*',
    category: 'mobile',
    status: 'live',
    description: 'Complete mobile-responsive design and touch optimization',
    testCriteria: ['Responsive design works', 'Touch interactions smooth', 'Mobile navigation functions', 'Performance optimized'],
    dateAdded: '2025-01-18',
    lastUpdated: '2025-01-21',
    version: '1.3.0'
  },
  {
    id: 'payment-integration',
    name: 'Stripe Payment Integration',
    route: '/checkout',
    category: 'ecommerce',
    status: 'live',
    description: 'Complete payment processing with multiple payment methods',
    testCriteria: ['Card payments work', 'Apple Pay functions', 'Google Pay works', 'Payment validation correct'],
    dependencies: ['checkout-flow'],
    dateAdded: '2025-01-20',
    lastUpdated: '2025-01-21',
    version: '1.1.0'
  },
  // Coming Soon Features
  {
    id: 'ai-recommendations',
    name: 'AI Product Recommendations',
    route: '/products',
    category: 'ecommerce',
    status: 'coming-soon',
    description: 'Machine learning-powered product recommendations',
    testCriteria: ['Recommendations display', 'Accuracy tracking', 'Performance optimization', 'User feedback integration'],
    dateAdded: '2025-01-21',
    lastUpdated: '2025-01-21',
    version: '0.1.0'
  },
  {
    id: 'voice-search',
    name: 'Voice Search',
    route: '/products',
    category: 'core',
    status: 'coming-soon',
    description: 'Voice-activated product search functionality',
    testCriteria: ['Voice recognition works', 'Search accuracy high', 'Multi-language support', 'Privacy compliance'],
    dateAdded: '2025-01-21',
    lastUpdated: '2025-01-21',
    version: '0.1.0'
  },
  {
    id: 'ar-try-on',
    name: 'AR Product Try-On',
    route: '/products/:id',
    category: 'ecommerce',
    status: 'coming-soon',
    description: 'Augmented reality product visualization',
    testCriteria: ['AR loads correctly', 'Product placement accurate', 'Performance optimized', 'Device compatibility'],
    dateAdded: '2025-01-21',
    lastUpdated: '2025-01-21',
    version: '0.1.0'
  }
];

// Dynamic test generation based on features
export function generateTestsFromFeatures(): any[] {
  return SPIRAL_FEATURES.map(feature => ({
    name: `${feature.name} - Basic Functionality`,
    status: 'pending' as const,
    category: feature.category,
    route: feature.route,
    criteria: feature.testCriteria,
    featureId: feature.id,
    version: feature.version,
    dependencies: feature.dependencies || []
  }));
}

// Get features by category
export function getFeaturesByCategory(category: string): Feature[] {
  return SPIRAL_FEATURES.filter(feature => feature.category === category);
}

// Get live features only
export function getLiveFeatures(): Feature[] {
  return SPIRAL_FEATURES.filter(feature => feature.status === 'live');
}

// Get features by status
export function getFeaturesByStatus(status: string): Feature[] {
  return SPIRAL_FEATURES.filter(feature => feature.status === status);
}

// Add new feature (for dynamic expansion)
export function addNewFeature(feature: Omit<Feature, 'dateAdded' | 'lastUpdated'>): Feature {
  const newFeature: Feature = {
    ...feature,
    dateAdded: new Date().toISOString().split('T')[0],
    lastUpdated: new Date().toISOString().split('T')[0]
  };
  
  SPIRAL_FEATURES.push(newFeature);
  return newFeature;
}

// Update existing feature
export function updateFeature(featureId: string, updates: Partial<Feature>): Feature | null {
  const featureIndex = SPIRAL_FEATURES.findIndex(f => f.id === featureId);
  if (featureIndex === -1) return null;
  
  SPIRAL_FEATURES[featureIndex] = {
    ...SPIRAL_FEATURES[featureIndex],
    ...updates,
    lastUpdated: new Date().toISOString().split('T')[0]
  };
  
  return SPIRAL_FEATURES[featureIndex];
}

// Get testing coverage statistics
export function getTestingCoverage() {
  const totalFeatures = SPIRAL_FEATURES.length;
  const liveFeatures = getLiveFeatures().length;
  const categories = [...new Set(SPIRAL_FEATURES.map(f => f.category))];
  
  return {
    total: totalFeatures,
    live: liveFeatures,
    comingSoon: getFeaturesByStatus('coming-soon').length,
    categories: categories.length,
    categoryBreakdown: categories.map(cat => ({
      name: cat,
      count: getFeaturesByCategory(cat).length,
      live: getFeaturesByCategory(cat).filter(f => f.status === 'live').length
    }))
  };
}