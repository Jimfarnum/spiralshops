import React, { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Settings, Clock, ArrowLeft, ShoppingCart, Store, MapPin, Truck, Gift, Share2, BarChart3, Mail, Users, Star } from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';

interface Feature {
  id: string;
  name: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  category: string;
  priority: 'high' | 'medium' | 'low';
  implementedIn?: string;
}

const SpiralFeatures = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const features: Feature[] = [
    // Shopper Tools
    {
      id: 'store-discovery',
      name: 'Store Discovery & Search',
      description: 'Browse local stores by category, location, and ZIP code',
      status: 'completed',
      category: 'shopper-tools',
      priority: 'high',
      implementedIn: 'MVP Phase 1'
    },
    {
      id: 'product-search',
      name: 'Product Search & Filtering',
      description: 'Advanced product filtering by category, price, store, and distance',
      status: 'completed',
      category: 'shopper-tools',
      priority: 'high',
      implementedIn: 'MVP Phase 2'
    },
    {
      id: 'shopping-cart',
      name: 'Shopping Cart Management',
      description: 'Add to cart, quantity controls, persistent cart storage',
      status: 'completed',
      category: 'shopper-tools',
      priority: 'high',
      implementedIn: 'MVP Phase 3'
    },
    {
      id: 'checkout-system',
      name: 'Checkout & Payment Processing',
      description: 'Complete checkout flow with form validation and order processing',
      status: 'completed',
      category: 'shopper-tools',
      priority: 'high',
      implementedIn: 'MVP Phase 3'
    },
    {
      id: 'user-account',
      name: 'User Account Dashboard',
      description: 'Order history, favorite stores, profile management',
      status: 'completed',
      category: 'shopper-tools',
      priority: 'medium',
      implementedIn: 'MVP Phase 7'
    },
    {
      id: 'profile-settings',
      name: 'Profile Settings & Preferences',
      description: 'User preferences, retailer suggestions, sharing controls',
      status: 'completed',
      category: 'shopper-tools',
      priority: 'medium',
      implementedIn: 'MVP Phase 6'
    },

    // Retailer Tools
    {
      id: 'retailer-signup',
      name: 'Retailer Registration',
      description: 'Business owner registration and application system',
      status: 'completed',
      category: 'retailer-tools',
      priority: 'high',
      implementedIn: 'MVP Phase 1'
    },
    {
      id: 'retailer-dashboard',
      name: 'Retailer Dashboard',
      description: 'Product management, analytics, SPIRAL activity tracking',
      status: 'completed',
      category: 'retailer-tools',
      priority: 'high',
      implementedIn: 'MVP Phase 7'
    },
    {
      id: 'product-management',
      name: 'Product CRUD Operations',
      description: 'Add, edit, delete products with inventory tracking',
      status: 'completed',
      category: 'retailer-tools',
      priority: 'high',
      implementedIn: 'MVP Phase 7'
    },
    {
      id: 'inventory-sync',
      name: 'Inventory Syncing',
      description: 'CSV import/export for bulk product management',
      status: 'completed',
      category: 'retailer-tools',
      priority: 'medium',
      implementedIn: 'MVP Phase 8'
    },
    {
      id: 'marketing-center',
      name: 'Marketing Automation',
      description: 'Email campaigns, social scheduling, coupon generation',
      status: 'completed',
      category: 'retailer-tools',
      priority: 'medium',
      implementedIn: 'MVP Phase 8'
    },

    // Mall Mode
    {
      id: 'mall-landing',
      name: 'Mall Mode Landing Page',
      description: 'SPIRAL Mall Mode branding and feature preview',
      status: 'completed',
      category: 'mall-mode',
      priority: 'medium',
      implementedIn: 'MVP Phase 4'
    },
    {
      id: 'mall-directory',
      name: 'Mall Directory System',
      description: 'Featured malls, search/filter, detailed mall pages',
      status: 'completed',
      category: 'mall-mode',
      priority: 'medium',
      implementedIn: 'MVP Phase 7'
    },
    {
      id: 'combined-carts',
      name: 'Combined Cart Functionality',
      description: 'Shop multiple stores with unified checkout',
      status: 'pending',
      category: 'mall-mode',
      priority: 'low'
    },

    // Logistics
    {
      id: 'fulfillment-options',
      name: 'Multiple Fulfillment Methods',
      description: 'Ship to Me, In-Store Pickup, Ship to Mall options',
      status: 'completed',
      category: 'logistics',
      priority: 'high',
      implementedIn: 'MVP Phase 6'
    },
    {
      id: 'split-shipping',
      name: 'Split Shipping System',
      description: 'Different fulfillment methods per item in same order',
      status: 'completed',
      category: 'logistics',
      priority: 'medium',
      implementedIn: 'MVP Phase 6'
    },
    {
      id: 'delivery-timing',
      name: 'Conditional Delivery Messaging',
      description: 'Dynamic timing estimates based on fulfillment method',
      status: 'completed',
      category: 'logistics',
      priority: 'medium',
      implementedIn: 'MVP Phase 6'
    },
    {
      id: 'order-tracking',
      name: 'Order Tracking & Confirmation',
      description: 'Tracking numbers, order status, confirmation pages',
      status: 'completed',
      category: 'logistics',
      priority: 'high',
      implementedIn: 'MVP Phase 9'
    },

    // Loyalty & SPIRALs
    {
      id: 'spiral-program',
      name: 'SPIRAL Loyalty Program',
      description: 'Point earning, redemption, balance tracking',
      status: 'completed',
      category: 'loyalty-spirals',
      priority: 'high',
      implementedIn: 'MVP Phase 5'
    },
    {
      id: 'earning-structure',
      name: 'SPIRAL Earning Structure',
      description: '5 SPIRALs per $100 online, 10 SPIRALs per $100 in-person',
      status: 'completed',
      category: 'loyalty-spirals',
      priority: 'high',
      implementedIn: 'MVP Phase 5'
    },
    {
      id: 'redemption-system',
      name: 'Double Redemption Value',
      description: 'SPIRALs worth 2x when redeemed in physical stores',
      status: 'completed',
      category: 'loyalty-spirals',
      priority: 'high',
      implementedIn: 'MVP Phase 5'
    },
    {
      id: 'spiral-bonuses',
      name: 'Sharing & Referral Bonuses',
      description: '+5 SPIRALs for experiences and bringing friends',
      status: 'completed',
      category: 'loyalty-spirals',
      priority: 'medium',
      implementedIn: 'MVP Phase 9'
    },
    {
      id: 'invite-codes',
      name: 'Viral Invite Code System',
      description: 'Unique user codes, +20 signup, +50 purchase bonuses',
      status: 'in-progress',
      category: 'loyalty-spirals',
      priority: 'high'
    },

    // Social/Viral
    {
      id: 'social-sharing',
      name: 'Social Sharing Engine',
      description: 'Facebook, X (Twitter), Instagram sharing with templates',
      status: 'completed',
      category: 'social-viral',
      priority: 'high',
      implementedIn: 'MVP Phase 9'
    },
    {
      id: 'social-feed',
      name: 'Community Social Feed',
      description: 'User experiences, top sharers, community leaderboard',
      status: 'completed',
      category: 'social-viral',
      priority: 'medium',
      implementedIn: 'MVP Phase 9'
    },
    {
      id: 'share-reminders',
      name: 'Smart Share Reminder System',
      description: 'Targeted reminders for new users to share experiences',
      status: 'completed',
      category: 'social-viral',
      priority: 'medium',
      implementedIn: 'MVP Phase 9'
    },
    {
      id: 'viral-templates',
      name: 'Platform-Specific Templates',
      description: 'Optimized messaging for each social platform',
      status: 'completed',
      category: 'social-viral',
      priority: 'medium',
      implementedIn: 'MVP Phase 9'
    },
    {
      id: 'video-hub',
      name: 'SPIRAL Video Hub',
      description: 'Video content with categories and sharing capabilities',
      status: 'in-progress',
      category: 'social-viral',
      priority: 'medium'
    },

    // Analytics/Marketing
    {
      id: 'analytics-dashboard',
      name: 'Analytics Dashboard',
      description: 'Platform insights, user activity, performance metrics',
      status: 'completed',
      category: 'analytics-marketing',
      priority: 'medium',
      implementedIn: 'MVP Phase 8'
    },
    {
      id: 'email-campaigns',
      name: 'Email Campaign Builder',
      description: 'Template-based campaigns with audience targeting',
      status: 'completed',
      category: 'analytics-marketing',
      priority: 'medium',
      implementedIn: 'MVP Phase 8'
    },
    {
      id: 'coupon-generator',
      name: 'Automated Coupon System',
      description: 'Percentage discounts, date ranges, SPIRAL boosts',
      status: 'completed',
      category: 'analytics-marketing',
      priority: 'medium',
      implementedIn: 'MVP Phase 8'
    },
    {
      id: 'social-scheduling',
      name: 'Social Media Scheduling',
      description: 'Schedule posts for X (Twitter) and Facebook',
      status: 'completed',
      category: 'analytics-marketing',
      priority: 'low',
      implementedIn: 'MVP Phase 8'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Features', icon: Star },
    { id: 'shopper-tools', name: 'Shopper Tools', icon: ShoppingCart },
    { id: 'retailer-tools', name: 'Retailer Tools', icon: Store },
    { id: 'mall-mode', name: 'Mall Mode', icon: MapPin },
    { id: 'logistics', name: 'Logistics', icon: Truck },
    { id: 'loyalty-spirals', name: 'Loyalty & SPIRALs', icon: Gift },
    { id: 'social-viral', name: 'Social/Viral', icon: Share2 },
    { id: 'analytics-marketing', name: 'Analytics/Marketing', icon: BarChart3 }
  ];

  const filteredFeatures = selectedCategory === 'all' 
    ? features 
    : features.filter(feature => feature.category === selectedCategory);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in-progress':
        return <Settings className="h-5 w-5 text-blue-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-gray-400" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      'completed': '✅ Completed',
      'in-progress': '🔧 In Progress',
      'pending': '⏳ Pending'
    };
    return badges[status as keyof typeof badges] || '⏳ Pending';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'completed': 'bg-green-100 text-green-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'pending': 'bg-gray-100 text-gray-600'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-600';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'high': 'bg-red-100 text-red-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'low': 'bg-gray-100 text-gray-600'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-600';
  };

  const getStats = () => {
    const completed = features.filter(f => f.status === 'completed').length;
    const inProgress = features.filter(f => f.status === 'in-progress').length;
    const pending = features.filter(f => f.status === 'pending').length;
    const total = features.length;
    const completionPercentage = Math.round((completed / total) * 100);

    return { completed, inProgress, pending, total, completionPercentage };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">🔒</span>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--spiral-navy)] font-['Poppins']">
                SPIRAL Features Inventory
              </h1>
              <p className="text-red-600 font-semibold font-['Inter']">
                🔒 ADMIN ONLY - Internal Development Tracking
              </p>
            </div>
          </div>
          <p className="text-gray-600 text-lg font-['Inter'] max-w-3xl">
            Comprehensive feature audit for SPIRAL platform. This internal dashboard tracks all implemented features, current development status, and upcoming priorities for deployment readiness.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg border-0">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2 font-['Poppins']">
                {stats.completed}
              </div>
              <div className="text-sm text-gray-600 font-['Inter']">Completed</div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2 font-['Poppins']">
                {stats.inProgress}
              </div>
              <div className="text-sm text-gray-600 font-['Inter']">In Progress</div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-gray-600 mb-2 font-['Poppins']">
                {stats.pending}
              </div>
              <div className="text-sm text-gray-600 font-['Inter']">Pending</div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-[var(--spiral-coral)] mb-2 font-['Poppins']">
                {stats.completionPercentage}%
              </div>
              <div className="text-sm text-gray-600 font-['Inter']">Complete</div>
            </CardContent>
          </Card>
        </div>

        {/* Category Filters */}
        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`h-auto p-4 flex flex-col items-center gap-2 rounded-xl ${
                  selectedCategory === category.id 
                    ? 'bg-[var(--spiral-navy)] text-white' 
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                <category.icon className="h-5 w-5" />
                <div className="text-center">
                  <div className="font-semibold text-xs font-['Poppins']">{category.name}</div>
                  <div className="text-xs opacity-75">
                    ({selectedCategory === category.id ? filteredFeatures.length : features.filter(f => f.category === category.id).length})
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Features List */}
        <div className="space-y-4">
          {filteredFeatures.map((feature) => (
            <Card key={feature.id} className="shadow-lg border-0 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(feature.status)}
                      <h3 className="text-lg font-bold text-[var(--spiral-navy)] font-['Poppins']">
                        {feature.name}
                      </h3>
                      <Badge className={getStatusColor(feature.status)}>
                        {getStatusBadge(feature.status)}
                      </Badge>
                      <Badge className={getPriorityColor(feature.priority)}>
                        {feature.priority} priority
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3 font-['Inter']">
                      {feature.description}
                    </p>
                    {feature.implementedIn && (
                      <div className="text-sm text-[var(--spiral-coral)] font-semibold font-['Inter']">
                        📅 {feature.implementedIn}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Deployment Readiness */}
        <Card className="mt-8 shadow-lg border-0 bg-gradient-to-r from-green-50 to-blue-50">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-[var(--spiral-navy)] mb-4 font-['Poppins']">
              🚀 Deployment Readiness Assessment
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3 font-['Poppins']">✅ Production Ready</h3>
                <ul className="space-y-2 text-sm font-['Inter']">
                  <li>• Complete e-commerce functionality</li>
                  <li>• SPIRAL loyalty program with earning/redemption</li>
                  <li>• Social sharing engine for viral growth</li>
                  <li>• Retailer tools and analytics dashboard</li>
                  <li>• Multiple fulfillment options</li>
                  <li>• User authentication and account management</li>
                  <li>• Marketing automation tools</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3 font-['Poppins']">🔧 In Development</h3>
                <ul className="space-y-2 text-sm font-['Inter']">
                  <li>• Viral invite code system (Phase 10)</li>
                  <li>• SPIRAL Video Hub (Phase 10)</li>
                  <li>• Combined mall cart functionality</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 p-4 bg-green-100 rounded-xl">
              <p className="text-green-800 font-semibold font-['Inter']">
                🎯 <strong>Status:</strong> SPIRAL platform is {stats.completionPercentage}% complete and ready for public deployment. 
                Core functionality is fully operational with advanced features in final development phase.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default SpiralFeatures;