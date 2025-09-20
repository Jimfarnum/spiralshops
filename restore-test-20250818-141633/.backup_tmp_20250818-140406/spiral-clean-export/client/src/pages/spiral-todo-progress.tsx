import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  Clock,
  Smartphone,
  Brain,
  Globe,
  Megaphone,
  Shield,
  Rocket,
  Target,
  Users,
  Store,
  ShoppingCart,
  Eye
} from 'lucide-react';
import { useLocation } from 'wouter';

interface TodoItem {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  priority: 'high' | 'medium' | 'low';
  category: string;
  route?: string;
  implementedDate?: string;
}

export default function SpiralTodoProgress() {
  const [, setLocation] = useLocation();

  const [todoItems] = useState<TodoItem[]>([
    // PHASE 1: MVP COMPLETION
    {
      id: 'unified-cart',
      title: 'Unified Multi-Retailer Cart',
      description: 'Shopping cart supporting items from multiple stores and malls',
      status: 'completed',
      priority: 'high',
      category: 'Shopper Features',
      route: '/multi-mall-cart',
      implementedDate: '2025-01-30'
    },
    {
      id: 'product-search',
      title: 'Product Search with Filters',
      description: 'Advanced search and filtering system for products',
      status: 'completed',
      priority: 'high',
      category: 'Shopper Features',
      route: '/products',
      implementedDate: '2025-01-25'
    },
    {
      id: 'product-detail',
      title: 'Product Detail Pages',
      description: 'Comprehensive product pages with reviews and purchase options',
      status: 'completed',
      priority: 'high',
      category: 'Shopper Features',
      route: '/product-new/1',
      implementedDate: '2025-01-25'
    },
    {
      id: 'store-directory',
      title: 'Store Directory with ZIP Search',
      description: 'Directory of stores with location-based search',
      status: 'completed',
      priority: 'high',
      category: 'Shopper Features',
      route: '/discover-stores',
      implementedDate: '2025-01-20'
    },
    {
      id: 'shipping-options',
      title: 'Multiple Shipping & Pickup Options',
      description: 'Pickup, local delivery, and split shipping functionality',
      status: 'completed',
      priority: 'high',
      category: 'Shopper Features',
      route: '/split-fulfillment',
      implementedDate: '2025-01-25'
    },
    {
      id: 'wishlist-alerts',
      title: 'Wishlist with Alerts',
      description: 'Save products and receive notifications for availability',
      status: 'completed',
      priority: 'high',
      category: 'Shopper Features',
      route: '/wishlist',
      implementedDate: '2025-01-20'
    },
    {
      id: 'invite-to-shop',
      title: 'Invite-to-Shop Social Feature',
      description: 'Social shopping feature with shared deals and group benefits',
      status: 'completed',
      priority: 'medium',
      category: 'Shopper Features',
      route: '/invite-to-shop',
      implementedDate: '2025-01-25'
    },
    {
      id: 'spiral-loyalty',
      title: 'SPIRAL Loyalty Engine',
      description: 'Complete points-based loyalty and rewards system',
      status: 'completed',
      priority: 'high',
      category: 'Shopper Features',
      route: '/loyalty',
      implementedDate: '2025-01-15'
    },
    {
      id: 'shopper-onboarding',
      title: 'Shopper Onboarding & Walkthrough',
      description: 'Step-by-step onboarding process for new users',
      status: 'completed',
      priority: 'high',
      category: 'Shopper Features',
      route: '/shopper-onboarding',
      implementedDate: '2025-01-30'
    },
    {
      id: 'user-settings',
      title: 'Enhanced User Settings',
      description: 'Comprehensive profile management with addresses, payments, notifications',
      status: 'completed',
      priority: 'high',
      category: 'Shopper Features',
      route: '/enhanced-profile-settings',
      implementedDate: '2025-01-30'
    },
    {
      id: 'mobile-responsive',
      title: 'Full Mobile Responsiveness',
      description: 'Complete mobile testing and optimization across all features',
      status: 'completed',
      priority: 'high',
      category: 'Shopper Features',
      route: '/mobile-responsive-test',
      implementedDate: '2025-01-30'
    },

    // RETAILER FEATURES
    {
      id: 'retailer-dashboard',
      title: 'Retailer Demo Dashboard',
      description: 'Complete business portal with product, order, and analytics management',
      status: 'completed',
      priority: 'high',
      category: 'Retailer Features',
      route: '/retailer-dashboard-new',
      implementedDate: '2025-01-20'
    },
    {
      id: 'gift-card-management',
      title: 'Gift Card Creation & Management',
      description: 'System for retailers to create and manage gift cards',
      status: 'completed',
      priority: 'medium',
      category: 'Retailer Features',
      route: '/admin/gift-cards',
      implementedDate: '2025-01-25'
    },
    {
      id: 'spiral-rewards-setup',
      title: 'SPIRAL Rewards Setup',
      description: 'Tools for retailers to configure loyalty rewards',
      status: 'completed',
      priority: 'medium',
      category: 'Retailer Features',
      route: '/retailer-analytics',
      implementedDate: '2025-01-20'
    },
    {
      id: 'retailer-onboarding-portal',
      title: 'Retailer Onboarding Portal',
      description: 'Step-by-step onboarding flow for new business partners',
      status: 'in-progress',
      priority: 'high',
      category: 'Retailer Features',
      route: '/retailer-onboarding-demo'
    },
    {
      id: 'retailer-documentation',
      title: 'Retailer Self-Setup Documentation',
      description: 'Video and text guides for retailer platform setup',
      status: 'pending',
      priority: 'medium',
      category: 'Retailer Features'
    },
    {
      id: 'large-retailer-api',
      title: 'Large Retailer API Setup',
      description: 'Integration tools for inventory and promotions sync',
      status: 'pending',
      priority: 'medium',
      category: 'Retailer Features'
    },
    {
      id: 'retailer-profile-page',
      title: 'Retailer Profile Pages',
      description: 'Public-facing retailer profiles viewable by shoppers',
      status: 'completed',
      priority: 'medium',
      category: 'Retailer Features',
      route: '/store/1',
      implementedDate: '2025-01-15'
    },

    // MALL FEATURES
    {
      id: 'mall-selector',
      title: 'Mall Selector Dropdown',
      description: 'Interface for selecting and filtering by specific malls',
      status: 'completed',
      priority: 'high',
      category: 'Mall Features',
      route: '/malls',
      implementedDate: '2025-01-20'
    },
    {
      id: 'mall-store-directory',
      title: 'Mall-Specific Store Directory',
      description: 'Store listings filtered by individual mall locations',
      status: 'completed',
      priority: 'high',
      category: 'Mall Features',
      route: '/mall-directory',
      implementedDate: '2025-01-20'
    },
    {
      id: 'mall-homepage',
      title: 'Mall Homepage with Promos',
      description: 'Individual mall pages featuring promotions, perks, and events',
      status: 'completed',
      priority: 'high',
      category: 'Mall Features',
      route: '/mall/1',
      implementedDate: '2025-01-20'
    },
    {
      id: 'spiral-center-pickup',
      title: 'SPIRAL Center Pickup Option',
      description: 'Centralized pickup locations within malls',
      status: 'completed',
      priority: 'high',
      category: 'Mall Features',
      route: '/split-fulfillment',
      implementedDate: '2025-01-25'
    },
    {
      id: 'mall-gift-cards',
      title: 'Mall Gift Card Purchase & Redemption',
      description: 'Complete mall-specific gift card system',
      status: 'completed',
      priority: 'high',
      category: 'Mall Features',
      route: '/mall-gift-card-system',
      implementedDate: '2025-01-30'
    },
    {
      id: 'multi-mall-cart',
      title: 'Multi-Mall Cart Support',
      description: 'Shopping cart supporting items from multiple mall locations',
      status: 'completed',
      priority: 'high',
      category: 'Mall Features',
      route: '/multi-mall-cart',
      implementedDate: '2025-01-30'
    },
    {
      id: 'mall-loyalty-integration',
      title: 'Mall Loyalty & SPIRAL Integration',
      description: 'Integration between mall-specific rewards and SPIRAL points',
      status: 'completed',
      priority: 'medium',
      category: 'Mall Features',
      route: '/loyalty/mall-perks',
      implementedDate: '2025-01-25'
    },

    // PHASE 2: MOBILE APP
    {
      id: 'react-native-skeleton',
      title: 'React Native App Skeleton',
      description: 'Basic mobile app structure and navigation',
      status: 'pending',
      priority: 'high',
      category: 'Mobile App'
    },
    {
      id: 'mobile-backend-connection',
      title: 'Connect with Firebase Backend',
      description: 'Mobile app integration with existing backend services',
      status: 'pending',
      priority: 'high',
      category: 'Mobile App'
    },
    {
      id: 'mobile-shopper-features',
      title: 'Mobile Shopper Features Parity',
      description: 'All web shopper features adapted for mobile',
      status: 'pending',
      priority: 'high',
      category: 'Mobile App'
    },

    // PHASE 3: AI SYSTEMS
    {
      id: 'spiral-admin-gpt',
      title: 'SPIRAL Admin GPT',
      description: 'AI assistant for platform control and diagnostics',
      status: 'pending',
      priority: 'medium',
      category: 'AI Systems'
    },
    {
      id: 'shopper-gpt',
      title: 'Shopper GPT',
      description: 'AI recommendations and guided shopping assistant',
      status: 'pending',
      priority: 'medium',
      category: 'AI Systems'
    },

    // PHASE 4: INFRASTRUCTURE
    {
      id: 'vercel-deployment',
      title: 'Deploy Frontend to Vercel',
      description: 'Migration from Replit to production Vercel hosting',
      status: 'pending',
      priority: 'high',
      category: 'Infrastructure'
    },
    {
      id: 'domain-linking',
      title: 'Link Spiralshops.com Domain',
      description: 'Connect custom domains to Vercel deployment',
      status: 'pending',
      priority: 'high',
      category: 'Infrastructure'
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in-progress': return <Clock className="h-5 w-5 text-blue-600" />;
      case 'pending': return <XCircle className="h-5 w-5 text-gray-400" />;
      default: return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Shopper Features': return <Users className="h-5 w-5" />;
      case 'Retailer Features': return <Store className="h-5 w-5" />;
      case 'Mall Features': return <ShoppingCart className="h-5 w-5" />;
      case 'Mobile App': return <Smartphone className="h-5 w-5" />;
      case 'AI Systems': return <Brain className="h-5 w-5" />;
      case 'Infrastructure': return <Globe className="h-5 w-5" />;
      default: return <Target className="h-5 w-5" />;
    }
  };

  const getStats = () => {
    const totalItems = todoItems.length;
    const completed = todoItems.filter(item => item.status === 'completed').length;
    const inProgress = todoItems.filter(item => item.status === 'in-progress').length;
    const pending = todoItems.filter(item => item.status === 'pending').length;
    const completionPercentage = Math.round((completed / totalItems) * 100);

    return { totalItems, completed, inProgress, pending, completionPercentage };
  };

  const getCategoryStats = (category: string) => {
    const categoryItems = todoItems.filter(item => item.category === category);
    const completed = categoryItems.filter(item => item.status === 'completed').length;
    const total = categoryItems.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { completed, total, percentage };
  };

  const categories = [...new Set(todoItems.map(item => item.category))];
  const stats = getStats();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--spiral-navy)] mb-2">SPIRAL To-Do Progress Dashboard</h1>
          <p className="text-gray-600">Comprehensive tracking of all platform features and implementation progress</p>
        </div>

        {/* Overall Progress */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overall Progress</p>
                  <p className="text-3xl font-bold text-[var(--spiral-navy)]">{stats.completionPercentage}%</p>
                </div>
                <Target className="h-8 w-8 text-[var(--spiral-navy)]" />
              </div>
              <Progress value={stats.completionPercentage} className="h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-600">{stats.pending}</p>
                </div>
                <XCircle className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Progress by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => {
                const categoryStats = getCategoryStats(category);
                return (
                  <div key={category} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      {getCategoryIcon(category)}
                      <h3 className="font-semibold">{category}</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{categoryStats.completed}/{categoryStats.total}</span>
                      </div>
                      <Progress value={categoryStats.percentage} className="h-2" />
                      <div className="text-sm text-gray-600">{categoryStats.percentage}% Complete</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Task List */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
            <TabsTrigger value="all">All Tasks</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>

          {['all', 'completed', 'in-progress', 'pending'].map((filter) => (
            <TabsContent key={filter} value={filter}>
              <div className="space-y-4">
                {todoItems
                  .filter(item => filter === 'all' || item.status === filter)
                  .map((item) => (
                    <Card key={item.id} className="transition-all hover:shadow-md">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              {getStatusIcon(item.status)}
                              <h3 className="font-semibold text-lg">{item.title}</h3>
                              <Badge className={getStatusColor(item.status)}>
                                {item.status.replace('-', ' ').toUpperCase()}
                              </Badge>
                              <Badge className={getPriorityColor(item.priority)}>
                                {item.priority.toUpperCase()}
                              </Badge>
                            </div>
                            
                            <p className="text-gray-600 mb-3">{item.description}</p>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-2">
                                {getCategoryIcon(item.category)}
                                <span>{item.category}</span>
                              </div>
                              {item.implementedDate && (
                                <div>Completed: {item.implementedDate}</div>
                              )}
                            </div>
                          </div>
                          
                          <div className="ml-4">
                            {item.route && item.status === 'completed' && (
                              <Button
                                onClick={() => setLocation(item.route!)}
                                variant="outline"
                                size="sm"
                                className="flex items-center space-x-2"
                              >
                                <Eye className="h-4 w-4" />
                                <span>View</span>
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Next Steps */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Rocket className="h-5 w-5" />
              <span>Next Priority Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todoItems
                .filter(item => item.status === 'in-progress' || (item.status === 'pending' && item.priority === 'high'))
                .slice(0, 5)
                .map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="flex-shrink-0">
                      {getStatusIcon(item.status)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <Badge className={getPriorityColor(item.priority)}>
                      {item.priority.toUpperCase()}
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}