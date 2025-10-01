import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  ShoppingCart, 
  Search, 
  MapPin, 
  CreditCard, 
  Users,
  Package,
  Truck,
  Star,
  Gift,
  Bell,
  Shield,
  Smartphone
} from 'lucide-react';

interface FeatureStatus {
  id: string;
  name: string;
  description: string;
  status: 'complete' | 'partial' | 'missing' | 'in-progress';
  priority: 'P0' | 'P1' | 'P2';
  comparison: {
    amazon: boolean;
    target: boolean;
    walmart: boolean;
  };
  routes?: string[];
}

export default function FeatureParityAudit() {
  const [activeCategory, setActiveCategory] = useState("commerce");

  const featureCategories = {
    commerce: "E-Commerce Core",
    search: "Search & Discovery",
    user: "User Experience",
    mobile: "Mobile Features",
    business: "Business Features"
  };

  const features: FeatureStatus[] = [
    // E-Commerce Core
    {
      id: "multi-cart",
      name: "Multi-Retailer Cart System",
      description: "Combined shopping cart across multiple stores with grouped fulfillment",
      status: "complete",
      priority: "P0",
      comparison: { amazon: true, target: false, walmart: false },
      routes: ["/cart", "/multi-cart", "/split-fulfillment"]
    },
    {
      id: "unified-checkout",
      name: "Unified Checkout Experience",
      description: "Single checkout for multiple stores with taxes, shipping, and payment",
      status: "complete", 
      priority: "P0",
      comparison: { amazon: true, target: true, walmart: true },
      routes: ["/checkout"]
    },
    {
      id: "payment-integration",
      name: "Multiple Payment Methods",
      description: "Credit cards, digital wallets, buy now pay later options",
      status: "complete",
      priority: "P0",
      comparison: { amazon: true, target: true, walmart: true },
      routes: ["/checkout"]
    },
    {
      id: "order-tracking",
      name: "Order Tracking & Management",
      description: "Real-time order status, delivery tracking, and order history",
      status: "complete",
      priority: "P0",
      comparison: { amazon: true, target: true, walmart: true },
      routes: ["/account", "/order-confirmation"]
    },

    // Search & Discovery
    {
      id: "smart-search",
      name: "Real-Time Smart Search",
      description: "Autocomplete, suggestions, filters, and intelligent results",
      status: "complete",
      priority: "P0",
      comparison: { amazon: true, target: true, walmart: true },
      routes: ["/products"]
    },
    {
      id: "category-browsing",
      name: "Category-Based Browsing",
      description: "Organized product categories with filtering and sorting",
      status: "complete",
      priority: "P0",
      comparison: { amazon: true, target: true, walmart: true },
      routes: ["/products", "/"]
    },
    {
      id: "location-search",
      name: "Location-Based Discovery",
      description: "Find products and stores by proximity and location",
      status: "complete",
      priority: "P1",
      comparison: { amazon: false, target: true, walmart: true },
      routes: ["/products", "/malls"]
    },

    // User Experience
    {
      id: "user-accounts",
      name: "User Account Management",
      description: "Registration, login, profile management, and preferences",
      status: "complete",
      priority: "P0",
      comparison: { amazon: true, target: true, walmart: true },
      routes: ["/account", "/login", "/signup"]
    },
    {
      id: "wishlist",
      name: "Wishlist & Favorites",
      description: "Save products for later purchase and management",
      status: "complete",
      priority: "P1",
      comparison: { amazon: true, target: true, walmart: true },
      routes: ["/wishlist"]
    },
    {
      id: "reviews-ratings",
      name: "Reviews & Ratings System",
      description: "Customer reviews, ratings, and feedback on products and stores",
      status: "complete",
      priority: "P1",
      comparison: { amazon: true, target: true, walmart: true },
      routes: ["/product/:id", "/mall-store/:id"]
    },
    {
      id: "loyalty-program", 
      name: "Loyalty & Rewards Program",
      description: "SPIRAL points system with earning, redeeming, and tier benefits",
      status: "complete",
      priority: "P0",
      comparison: { amazon: false, target: true, walmart: false },
      routes: ["/spirals", "/account"]
    },

    // Mobile Features
    {
      id: "pwa-support",
      name: "Progressive Web App",
      description: "Mobile app-like experience with offline support and installation",
      status: "complete",
      priority: "P1",
      comparison: { amazon: true, target: true, walmart: true }
    },
    {
      id: "mobile-navigation",
      name: "Mobile-Optimized Navigation",
      description: "Touch-friendly interface with slide-out menus and quick actions",
      status: "complete",
      priority: "P0",
      comparison: { amazon: true, target: true, walmart: true }
    },
    {
      id: "location-services",
      name: "GPS & Location Services",
      description: "Auto-detect location for nearby stores and delivery options",
      status: "partial",
      priority: "P1",
      comparison: { amazon: false, target: true, walmart: true }
    },

    // Business Features
    {
      id: "retailer-portal",
      name: "Retailer Dashboard & Management",
      description: "Complete business portal for inventory, orders, and analytics",
      status: "complete",
      priority: "P0",
      comparison: { amazon: true, target: false, walmart: false },
      routes: ["/retailer-dashboard", "/retailer-portal"]
    },
    {
      id: "inventory-management",
      name: "Real-Time Inventory Tracking",
      description: "Stock levels, low inventory alerts, and automatic updates",
      status: "complete",
      priority: "P0",
      comparison: { amazon: true, target: true, walmart: true },
      routes: ["/inventory-dashboard"]
    },
    {
      id: "analytics-dashboard",
      name: "Business Intelligence & Analytics",
      description: "Sales metrics, customer insights, and performance tracking",
      status: "complete",
      priority: "P1",
      comparison: { amazon: true, target: false, walmart: false },
      routes: ["/analytics-dashboard", "/retailer-analytics"]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'partial': return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'in-progress': return <Clock className="h-5 w-5 text-blue-600" />;
      case 'missing': return <XCircle className="h-5 w-5 text-red-600" />;
      default: return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      complete: "bg-green-100 text-green-800",
      partial: "bg-yellow-100 text-yellow-800",
      'in-progress': "bg-blue-100 text-blue-800",
      missing: "bg-red-100 text-red-800"
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"}>
        {status.replace('-', ' ')}
      </Badge>
    );
  };

  const getCategoryFeatures = (category: string) => {
    const categoryMap: { [key: string]: string[] } = {
      commerce: ['multi-cart', 'unified-checkout', 'payment-integration', 'order-tracking'],
      search: ['smart-search', 'category-browsing', 'location-search'],
      user: ['user-accounts', 'wishlist', 'reviews-ratings', 'loyalty-program'],
      mobile: ['pwa-support', 'mobile-navigation', 'location-services'],
      business: ['retailer-portal', 'inventory-management', 'analytics-dashboard']
    };

    return features.filter(f => categoryMap[category]?.includes(f.id) || false);
  };

  const calculateCompletionRate = () => {
    const completed = features.filter(f => f.status === 'complete').length;
    return Math.round((completed / features.length) * 100);
  };

  const completionRate = calculateCompletionRate();

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[var(--spiral-navy)]">Feature Parity Audit</h1>
              <p className="text-gray-600 mt-2">
                SPIRAL vs. Major E-Commerce Platforms (Amazon, Target, Walmart)
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-[var(--spiral-coral)]">{completionRate}%</div>
              <div className="text-sm text-gray-600">Feature Complete</div>
            </div>
          </div>
          
          <div className="mt-4">
            <Progress value={completionRate} className="h-3" />
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Complete</p>
                  <p className="text-2xl font-bold text-green-600">
                    {features.filter(f => f.status === 'complete').length}
                  </p>
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
                  <p className="text-2xl font-bold text-blue-600">
                    {features.filter(f => f.status === 'partial' || f.status === 'in-progress').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">P0 Priority</p>
                  <p className="text-2xl font-bold text-[var(--spiral-coral)]">
                    {features.filter(f => f.priority === 'P0').length}
                  </p>
                </div>
                <Star className="h-8 w-8 text-[var(--spiral-coral)]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">SPIRAL Unique</p>
                  <p className="text-2xl font-bold text-[var(--spiral-navy)]">
                    {features.filter(f => !f.comparison.amazon && !f.comparison.target && !f.comparison.walmart).length}
                  </p>
                </div>
                <Gift className="h-8 w-8 text-[var(--spiral-navy)]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Categories */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="grid w-full grid-cols-5">
            {Object.entries(featureCategories).map(([key, label]) => (
              <TabsTrigger key={key} value={key} className="text-sm">
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.keys(featureCategories).map((category) => (
            <TabsContent key={category} value={category} className="mt-6">
              <div className="space-y-4">
                {getCategoryFeatures(category).map((feature) => (
                  <Card key={feature.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {getStatusIcon(feature.status)}
                            <h3 className="text-lg font-semibold text-[var(--spiral-navy)]">
                              {feature.name}
                            </h3>
                            {getStatusBadge(feature.status)}
                            <Badge variant={feature.priority === 'P0' ? 'destructive' : feature.priority === 'P1' ? 'default' : 'secondary'}>
                              {feature.priority}
                            </Badge>
                          </div>
                          
                          <p className="text-gray-600 mb-4">{feature.description}</p>
                          
                          {/* Platform Comparison */}
                          <div className="flex items-center gap-6 mb-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">Amazon:</span>
                              {feature.comparison.amazon ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">Target:</span>
                              {feature.comparison.target ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">Walmart:</span>
                              {feature.comparison.walmart ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                            </div>
                          </div>

                          {/* Routes */}
                          {feature.routes && (
                            <div className="flex flex-wrap gap-2">
                              {feature.routes.map((route) => (
                                <Badge key={route} variant="outline" className="text-xs">
                                  {route}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        {feature.routes && (
                          <div className="flex gap-2">
                            {feature.routes.slice(0, 2).map((route) => (
                              <Button
                                key={route}
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(route, '_blank')}
                              >
                                Test
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Action Items */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Next Steps & Recommendations</CardTitle>
            <CardDescription>Priority actions to enhance feature parity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border-l-4 border-green-400">
                <h4 className="font-semibold text-green-800">Strengths</h4>
                <p className="text-green-700">
                  SPIRAL has achieved feature parity in core e-commerce functionality with unique advantages in 
                  multi-retailer shopping, local discovery, and community-driven loyalty programs.
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 border-l-4 border-blue-400">
                <h4 className="font-semibold text-blue-800">Opportunities</h4>
                <p className="text-blue-700">
                  Enhanced location services, more comprehensive mobile features, and advanced personalization 
                  could further differentiate SPIRAL from major competitors.
                </p>
              </div>
              
              <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400">
                <h4 className="font-semibold text-yellow-800">Focus Areas</h4>
                <p className="text-yellow-700">
                  Prioritize mobile-first enhancements, real-time inventory integration with local retailers, 
                  and advanced analytics for business intelligence.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}