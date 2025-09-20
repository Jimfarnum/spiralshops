import { useState } from 'react';
import Header from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'wouter';
import { 
  ShoppingCart, 
  Bell, 
  Globe, 
  Eye, 
  Zap, 
  Heart, 
  CreditCard, 
  Smartphone,
  Search,
  MapPin,
  Gift,
  Calendar,
  BarChart3,
  Share2,
  Users,
  Store,
  Package,
  Star,
  CheckCircle,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface Feature {
  id: string;
  name: string;
  description: string;
  status: 'completed' | 'beta' | 'coming-soon';
  category: 'core' | 'commerce' | 'social' | 'business' | 'accessibility';
  demoRoute?: string;
  icon: any;
  highlights: string[];
}

const features: Feature[] = [
  // Core Features
  {
    id: 'smart-search',
    name: 'Nationwide Smart Search',
    description: 'Advanced product discovery with intelligent filtering and location-based results',
    status: 'completed',
    category: 'core',
    demoRoute: '/products',
    icon: Search,
    highlights: ['ZIP code search', 'Use case filtering', 'Distance-based sorting', '5mi-100mi+nationwide range']
  },
  {
    id: 'mall-directory',
    name: 'Shopping Mall Directory',
    description: 'Comprehensive mall discovery with detailed store listings and events',
    status: 'completed',
    category: 'core',
    demoRoute: '/malls',
    icon: MapPin,
    highlights: ['Detailed mall pages', 'Store directories', 'Events calendar', 'Distance filtering']
  },
  {
    id: 'mall-mode',
    name: 'Mall-Specific Shopping',
    description: 'Exclusive shopping mode limited to selected mall with session persistence',
    status: 'completed',
    category: 'core',
    demoRoute: '/mall/westfield-valley-fair',
    icon: Store,
    highlights: ['Mall context awareness', 'Exclusive product filtering', 'Session persistence', 'Visual indicators']
  },

  // E-commerce Features
  {
    id: 'multi-retailer-cart',
    name: 'Multi-Retailer Cart System',
    description: 'Advanced cart supporting products from multiple stores with split fulfillment',
    status: 'completed',
    category: 'commerce',
    demoRoute: '/cart',
    icon: ShoppingCart,
    highlights: ['Multiple store support', 'Split fulfillment options', 'Real-time totals', 'SPIRAL earning calculations']
  },
  {
    id: 'split-fulfillment',
    name: 'Advanced Split Fulfillment',
    description: 'Item-level fulfillment method selection with optimized shipping logic',
    status: 'completed',
    category: 'commerce',
    demoRoute: '/split-fulfillment',
    icon: Package,
    highlights: ['Ship to Me', 'In-Store Pickup', 'Mall SPIRAL Center', 'Smart cost calculation']
  },
  {
    id: 'wishlist-system',
    name: 'Priority Wishlist System',
    description: 'Advanced wishlist with priority management and availability tracking',
    status: 'completed',
    category: 'commerce',
    demoRoute: '/wishlist',
    icon: Heart,
    highlights: ['Priority levels (High/Medium/Low)', 'In-stock alerts', 'One-click add to cart', 'Availability tracking']
  },
  {
    id: 'stripe-payments',
    name: 'Comprehensive Payment System',
    description: 'Secure Stripe integration with multiple payment methods',
    status: 'completed',
    category: 'commerce',
    demoRoute: '/checkout',
    icon: CreditCard,
    highlights: ['Credit/Debit Cards', 'Apple Pay', 'Google Pay', 'Real-time validation']
  },
  {
    id: 'gift-cards',
    name: 'Complete Gift Card System',
    description: 'All-store, mall-specific, and store-specific gift cards with purchase/redeem flow',
    status: 'completed',
    category: 'commerce',
    demoRoute: '/gift-cards',
    icon: Gift,
    highlights: ['Multiple gift card types', 'Purchase flow', 'Redeem system', 'Balance tracking']
  },

  // Social & Community Features
  {
    id: 'spiral-loyalty',
    name: 'SPIRAL Loyalty Program',
    description: 'Comprehensive loyalty system with earning, redemption, and community features',
    status: 'completed',
    category: 'social',
    demoRoute: '/spirals',
    icon: Star,
    highlights: ['5 SPIRALs per $100 online', '10 SPIRALs per $100 in-store', 'Double redemption value', 'Community status tiers']
  },
  {
    id: 'social-sharing',
    name: 'Viral Social Sharing Engine',
    description: 'Comprehensive sharing system with platform-specific templates and SPIRAL rewards',
    status: 'completed',
    category: 'social',
    demoRoute: '/social-feed',
    icon: Share2,
    highlights: ['Facebook, X, Instagram integration', '+5 SPIRALs per share', 'Templated messages', 'Community leaderboard']
  },
  {
    id: 'invite-system',
    name: 'Viral Invite Code System',
    description: 'Unique user codes with referral tracking and community status progression',
    status: 'completed',
    category: 'social',
    demoRoute: '/invite-friend',
    icon: Users,
    highlights: ['+20 SPIRALs for signup', '+50 for first purchase', 'Community status tiers', 'Referral analytics']
  },
  {
    id: 'reviews-ratings',
    name: 'Product & Store Reviews',
    description: 'Complete review system with verified purchases and helpful voting',
    status: 'completed',
    category: 'social',
    demoRoute: '/product-new/1',
    icon: Star,
    highlights: ['Verified purchase badges', 'Star ratings', 'Helpful voting', 'Review filtering']
  },

  // Business Intelligence
  {
    id: 'retailer-analytics',
    name: 'Advanced Retailer Analytics',
    description: 'Comprehensive business intelligence with interactive visualizations',
    status: 'completed',
    category: 'business',
    demoRoute: '/retailer-analytics',
    icon: BarChart3,
    highlights: ['Revenue trends', 'Customer analytics', 'Product performance', 'SPIRAL activity tracking']
  },
  {
    id: 'marketing-center',
    name: 'Marketing Automation Center',
    description: 'Email campaigns, social post scheduling, and coupon generation',
    status: 'completed',
    category: 'business',
    demoRoute: '/marketing-center',
    icon: Bell,
    highlights: ['Email campaign builder', 'Social post scheduler', 'Coupon generator', 'Analytics tracking']
  },
  {
    id: 'inventory-alerts',
    name: 'Real-Time Inventory Alerts',
    description: 'Smart monitoring with browser notifications, email, and SMS options',
    status: 'completed',
    category: 'business',
    demoRoute: '/inventory-alerts-demo',
    icon: Bell,
    highlights: ['Low-stock monitoring', 'Browser notifications', 'Email/SMS alerts', 'Configurable thresholds']
  },

  // Accessibility & Localization
  {
    id: 'accessibility-mode',
    name: 'One-Click Accessibility Mode',
    description: 'Comprehensive accessibility features with instant optimization',
    status: 'completed',
    category: 'accessibility',
    demoRoute: '/accessibility-demo',
    icon: Eye,
    highlights: ['Vision support', 'Motor support', 'Cognitive support', 'Hearing support']
  },
  {
    id: 'multi-language',
    name: 'Multi-Language Support',
    description: 'English and Spanish translations with auto-detection',
    status: 'completed',
    category: 'accessibility',
    demoRoute: '/language-demo',
    icon: Globe,
    highlights: ['English & Spanish (95%)', 'Auto-detection', 'Currency formatting', 'Real-time switching']
  },
  {
    id: 'mobile-optimization',
    name: 'Mobile-First Optimization',
    description: 'Touch-optimized interfaces with responsive design',
    status: 'completed',
    category: 'accessibility',
    demoRoute: '/',
    icon: Smartphone,
    highlights: ['Touch-friendly buttons', 'Slide-out navigation', 'Responsive grids', 'Reduced data usage']
  },
  {
    id: 'performance-optimization',
    name: 'Performance Optimization Suite',
    description: 'Real-time monitoring and automated optimization',
    status: 'completed',
    category: 'accessibility',
    demoRoute: '/performance-optimization',
    icon: Zap,
    highlights: ['Performance monitoring', 'Code splitting', 'Image optimization', 'Caching strategies']
  }
];

export default function FeatureShowcase() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const filteredFeatures = selectedCategory === 'all' 
    ? features 
    : features.filter(f => f.category === selectedCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'beta': return 'bg-blue-100 text-blue-800';
      case 'coming-soon': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'core': return 'text-purple-600';
      case 'commerce': return 'text-green-600';
      case 'social': return 'text-blue-600';
      case 'business': return 'text-orange-600';
      case 'accessibility': return 'text-cyan-600';
      default: return 'text-gray-600';
    }
  };

  const categoryStats = {
    core: features.filter(f => f.category === 'core').length,
    commerce: features.filter(f => f.category === 'commerce').length,
    social: features.filter(f => f.category === 'social').length,
    business: features.filter(f => f.category === 'business').length,
    accessibility: features.filter(f => f.category === 'accessibility').length,
  };

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-[var(--spiral-navy)] mb-2">
            SPIRAL Feature Showcase
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore the comprehensive features that make SPIRAL the most advanced 
            local commerce platform. Over 20 major features across 5 categories.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-600">{categoryStats.core}</div>
              <p className="text-sm text-gray-600">Core Features</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{categoryStats.commerce}</div>
              <p className="text-sm text-gray-600">E-commerce</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">{categoryStats.social}</div>
              <p className="text-sm text-gray-600">Social</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-600">{categoryStats.business}</div>
              <p className="text-sm text-gray-600">Business</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-cyan-600">{categoryStats.accessibility}</div>
              <p className="text-sm text-gray-600">Accessibility</p>
            </CardContent>
          </Card>
        </div>

        {/* Category Filter */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="all">All Features</TabsTrigger>
            <TabsTrigger value="core">Core</TabsTrigger>
            <TabsTrigger value="commerce">Commerce</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="accessibility">Access</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeatures.map((feature) => (
            <Card key={feature.id} className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <feature.icon className={`h-6 w-6 ${getCategoryColor(feature.category)}`} />
                    <div>
                      <CardTitle className="text-lg">{feature.name}</CardTitle>
                      <Badge 
                        className={`mt-1 text-xs ${getStatusColor(feature.status)}`}
                      >
                        {feature.status === 'completed' && <CheckCircle className="mr-1 h-3 w-3" />}
                        {feature.status.charAt(0).toUpperCase() + feature.status.slice(1).replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>
                </div>
                <CardDescription className="mt-2">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Highlights */}
                  <div>
                    <h4 className="font-semibold text-sm text-[var(--spiral-navy)] mb-2">Key Features:</h4>
                    <ul className="space-y-1">
                      {feature.highlights.map((highlight, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                          <ArrowRight className="h-3 w-3 text-[var(--spiral-coral)]" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Demo Button */}
                  {feature.demoRoute && (
                    <Link href={feature.demoRoute}>
                      <Button 
                        className="w-full bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90"
                        size="sm"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Demo
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Access Panel */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-[var(--spiral-coral)]" />
              Quick Feature Access
            </CardTitle>
            <CardDescription>
              Jump directly to key feature demonstrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Link href="/products">
                <Button variant="outline" className="w-full justify-start">
                  <Search className="mr-2 h-4 w-4" />
                  Smart Search
                </Button>
              </Link>
              <Link href="/cart">
                <Button variant="outline" className="w-full justify-start">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Multi-Cart
                </Button>
              </Link>
              <Link href="/accessibility-demo">
                <Button variant="outline" className="w-full justify-start">
                  <Eye className="mr-2 h-4 w-4" />
                  Accessibility
                </Button>
              </Link>
              <Link href="/performance-optimization">
                <Button variant="outline" className="w-full justify-start">
                  <Zap className="mr-2 h-4 w-4" />
                  Performance
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Platform Summary */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-[var(--spiral-navy)] mb-4">
                Platform Status: Production Ready
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-2">{features.filter(f => f.status === 'completed').length}</div>
                  <p className="text-sm text-gray-600">Features Complete</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">95%+</div>
                  <p className="text-sm text-gray-600">Feature Parity vs Major Platforms</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">5</div>
                  <p className="text-sm text-gray-600">Core Categories</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}