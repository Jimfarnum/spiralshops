import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/header";
import { 
  Star, 
  Gift, 
  MessageSquare, 
  BarChart3, 
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Store,
  ShoppingBag
} from "lucide-react";

export default function P0FeaturesDemo() {
  const features = [
    {
      title: "Product & Store Reviews System",
      description: "Complete rating and review functionality with verified purchase badges and helpful voting",
      status: "Complete",
      icon: <MessageSquare className="h-6 w-6" />,
      demoLinks: [
        { label: "View Product Reviews", href: "/product/1", description: "See reviews on product detail pages" },
        { label: "Store Reviews", href: "/store/1/reviews", description: "Dedicated store review pages" }
      ],
      features: [
        "Star rating system (1-5)",
        "Verified purchase badges",
        "Helpful vote system",
        "Filter by rating",
        "Sort by recency/helpfulness",
        "Review moderation"
      ]
    },
    {
      title: "Gift Card System", 
      description: "Purchase, redeem, and manage gift cards for all stores, specific malls, or individual retailers",
      status: "Complete",
      icon: <Gift className="h-6 w-6" />,
      demoLinks: [
        { label: "Gift Card System", href: "/gift-cards", description: "Purchase and redeem gift cards" },
        { label: "Gift Card Component Demo", href: "/gift-card-system", description: "Full component showcase" }
      ],
      features: [
        "All-store gift cards",
        "Mall-specific gift cards", 
        "Store-specific gift cards",
        "Digital delivery via email",
        "Code generation & validation",
        "Balance tracking & redemption"
      ]
    },
    {
      title: "Retailer Demo Dashboard",
      description: "Complete business management interface with inventory, orders, analytics, and SPIRAL integration",
      status: "Complete", 
      icon: <BarChart3 className="h-6 w-6" />,
      demoLinks: [
        { label: "Retailer Dashboard", href: "/retailer-demo", description: "Full featured demo dashboard" },
        { label: "Retailer Portal", href: "/retailer-portal", description: "Business management interface" }
      ],
      features: [
        "15 demo products with inventory",
        "Order management & tracking",
        "Performance analytics",
        "SPIRAL points integration",
        "Customer insights",
        "Revenue tracking"
      ]
    },
    {
      title: "Competitive Analysis Dashboard",
      description: "Comprehensive platform comparison showing SPIRAL's unique advantages vs major competitors",
      status: "Complete",
      icon: <TrendingUp className="h-6 w-6" />,
      demoLinks: [
        { label: "Competitive Analysis", href: "/competitive-analysis", description: "Platform comparison tool" },
        { label: "Feature Audit", href: "/feature-audit", description: "Feature parity assessment" }
      ],
      features: [
        "Compare vs Amazon, Target, Walmart",
        "95%+ feature parity analysis",
        "Unique SPIRAL advantages",
        "Gap analysis & roadmap",
        "Strategic positioning",
        "Market differentiation"
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Complete": return "bg-green-100 text-green-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Planned": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-[var(--spiral-navy)] mb-2">
                P0 Features Demo
              </h1>
              <p className="text-xl text-gray-600">
                Comprehensive showcase of priority features ready for testing
              </p>
            </div>
            <Badge className="bg-[var(--spiral-coral)] text-white px-4 py-2 text-lg">
              All Features Complete
            </Badge>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-[var(--spiral-navy)]">4</div>
                <div className="text-sm text-gray-600">P0 Features</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">100%</div>
                <div className="text-sm text-gray-600">Complete</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-[var(--spiral-coral)]">8</div>
                <div className="text-sm text-gray-600">Demo Links</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-[var(--spiral-navy)]">20+</div>
                <div className="text-sm text-gray-600">Features</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {features.map((feature, index) => (
            <Card key={index} className="h-fit">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[var(--spiral-coral)]/10 rounded-lg text-[var(--spiral-coral)]">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl text-[var(--spiral-navy)]">
                      {feature.title}
                    </CardTitle>
                  </div>
                  <Badge className={getStatusColor(feature.status)}>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {feature.status}
                  </Badge>
                </div>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Feature List */}
                <div>
                  <h4 className="font-semibold text-[var(--spiral-navy)] mb-2">Key Features:</h4>
                  <ul className="space-y-1">
                    {feature.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Demo Links */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-[var(--spiral-navy)]">Try It Out:</h4>
                  {feature.demoLinks.map((link, idx) => (
                    <Link key={idx} href={link.href}>
                      <Button 
                        variant="outline" 
                        className="w-full justify-between hover:bg-[var(--spiral-coral)]/5 hover:border-[var(--spiral-coral)]"
                      >
                        <div className="text-left">
                          <div className="font-medium">{link.label}</div>
                          <div className="text-xs text-gray-500">{link.description}</div>
                        </div>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Access Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-[var(--spiral-navy)]">Quick Access Demo Links</CardTitle>
            <CardDescription>
              Direct links to test all P0 features and functionality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-[var(--spiral-navy)] mb-3 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Reviews System
                </h4>
                <div className="space-y-2 text-sm">
                  <Link to="/product/1">
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      Product Detail with Reviews
                    </Button>
                  </Link>
                  <Link to="/store/1/reviews">
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      Store Reviews Page
                    </Button>
                  </Link>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-[var(--spiral-navy)] mb-3 flex items-center gap-2">
                  <Gift className="h-4 w-4" />
                  Gift Card System
                </h4>
                <div className="space-y-2 text-sm">
                  <Link href="/gift-cards">
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      Gift Cards Interface
                    </Button>
                  </Link>
                  <Link href="/gift-card-system">
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      Component Demo
                    </Button>
                  </Link>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-[var(--spiral-navy)] mb-3 flex items-center gap-2">
                  <Store className="h-4 w-4" />
                  Retailer Tools
                </h4>
                <div className="space-y-2 text-sm">
                  <Link href="/retailer-demo">
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      Demo Dashboard
                    </Button>
                  </Link>
                  <Link href="/retailer-portal">
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      Business Portal
                    </Button>
                  </Link>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-[var(--spiral-navy)] mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Analytics & Insights
                </h4>
                <div className="space-y-2 text-sm">
                  <Link href="/competitive-analysis">
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      Competitive Analysis
                    </Button>
                  </Link>
                  <Link href="/feature-audit">
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      Feature Parity Audit
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Implementation Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-[var(--spiral-navy)]">Implementation Summary</CardTitle>
            <CardDescription>
              Technical details and architecture overview
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-[var(--spiral-navy)] mb-3">Database Schema</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Reviews table with user/product/store relations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Gift cards table with validation & tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Extended user/order tables for integration
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-[var(--spiral-navy)] mb-3">API Endpoints</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Complete reviews CRUD operations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Gift card purchase/redeem workflow
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Mock data endpoints for demo
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-[var(--spiral-navy)] mb-3">Frontend Components</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    ProductReviews with filtering/sorting
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    GiftCardSystem with purchase flow
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    RetailerDemoDashboard with analytics
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-[var(--spiral-navy)] mb-3">Integration</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Product detail pages with reviews
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Store pages with review links
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Navigation and routing complete
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}