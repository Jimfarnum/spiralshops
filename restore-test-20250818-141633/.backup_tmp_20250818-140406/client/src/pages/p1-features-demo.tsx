import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/header";
import { 
  Star, 
  Calendar, 
  Store,
  Bell,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Zap,
  Database,
  Users,
  Gift
} from "lucide-react";

export default function P1FeaturesDemo() {
  const features = [
    {
      title: "SPIRALS Loyalty Engine",
      description: "Advanced loyalty points system with smart earning rules, multipliers, and redemption capabilities",
      status: "Complete",
      icon: <Star className="h-6 w-6" />,
      demoLinks: [
        { label: "Loyalty Dashboard", href: "/loyalty-dashboard", description: "View SPIRAL balance and activity" },
        { label: "User Profile", href: "/profile", description: "See loyalty stats in user account" }
      ],
      features: [
        "1 SPIRAL per $1 spent (configurable)",
        "Bonus multipliers for events & malls",
        "Real-time balance tracking",
        "Complete transaction history",
        "Redemption at checkout",
        "Admin configuration panel"
      ]
    },
    {
      title: "Mall Events Integration",
      description: "Complete event management system for malls with RSVP functionality and SPIRAL bonuses",
      status: "Complete",
      icon: <Calendar className="h-6 w-6" />,
      demoLinks: [
        { label: "Mall Events", href: "/mall/1/events", description: "View and RSVP to mall events" },
        { label: "Event Component Demo", href: "/mall-events-demo", description: "Standalone events showcase" }
      ],
      features: [
        "Event creation per mall",
        "RSVP and attendance tracking",
        "Bonus SPIRALS for events",
        "Event categories & filtering",
        "Social sharing integration",
        "Admin event management"
      ]
    },
    {
      title: "Mall-Specific Perks System",
      description: "Dynamic bonus logic and time-based perks for enhanced mall experiences",
      status: "Complete",
      icon: <Gift className="h-6 w-6" />,
      demoLinks: [
        { label: "Mall Perks", href: "/mall/1/perks", description: "View active mall perks" },
        { label: "Mall Directory", href: "/malls", description: "Browse malls with perks" }
      ],
      features: [
        "Double SPIRALS days",
        "Free pickup perks",
        "Time-based triggers",
        "Admin perk toggles",
        "Dynamic multipliers",
        "Mall-specific offers"
      ]
    },
    {
      title: "Retailer Onboarding Portal",
      description: "Public-facing system for new retailers to join SPIRAL with approval workflows",
      status: "Complete",
      icon: <Store className="h-6 w-6" />,
      demoLinks: [
        { label: "Retailer Application", href: "/retailer-onboarding", description: "Apply to join SPIRAL" },
        { label: "Benefits Overview", href: "/retailer-benefits", description: "Learn about retailer benefits" }
      ],
      features: [
        "Complete application form",
        "Business verification process",
        "Approval queue system",
        "Auto-dashboard creation",
        "Store page generation",
        "Support documentation"
      ]
    },
    {
      title: "Wishlist Alert System",
      description: "Smart notification system for inventory and price changes on wishlisted items",
      status: "Complete",
      icon: <Bell className="h-6 w-6" />,
      demoLinks: [
        { label: "Wishlist Notifications", href: "/wishlist-notifications", description: "Manage notification preferences" },
        { label: "Wishlist", href: "/wishlist", description: "View saved items" }
      ],
      features: [
        "Back-in-stock alerts",
        "Price drop notifications",
        "Target price setting",
        "Email & push notifications",
        "Notification preferences",
        "Real-time monitoring"
      ]
    },
    {
      title: "Cloudant Data Hooks",
      description: "Production-ready data layer with IBM Cloudant integration structure",
      status: "Complete",
      icon: <Database className="h-6 w-6" />,
      demoLinks: [
        { label: "Data Architecture", href: "/cloudant-demo", description: "View data integration layer" },
        { label: "API Status", href: "/api/health", description: "Check system health" }
      ],
      features: [
        "Loyalty points storage",
        "Mall events data hooks",
        "Perks data management",
        "Production-ready structure",
        "Health monitoring",
        "Scalable architecture"
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
                P1 Features Demo
              </h1>
              <p className="text-xl text-gray-600">
                Advanced loyalty engine, events, and notification systems
              </p>
            </div>
            <Badge className="bg-[var(--spiral-coral)] text-white px-4 py-2 text-lg">
              All P1 Features Complete
            </Badge>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-[var(--spiral-navy)]">6</div>
                <div className="text-sm text-gray-600">P1 Features</div>
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
                <div className="text-2xl font-bold text-[var(--spiral-coral)]">12</div>
                <div className="text-sm text-gray-600">Demo Links</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-[var(--spiral-navy)]">36+</div>
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

        {/* Technical Implementation Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-[var(--spiral-navy)]">P1 Technical Implementation</CardTitle>
            <CardDescription>
              Advanced architecture and database schema for enterprise-grade features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-[var(--spiral-navy)] mb-3 flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Database Schema
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Enhanced SPIRAL transactions tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Mall events with RSVP system
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Mall perks with time-based rules
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Retailer applications workflow
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Wishlist notifications system
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-[var(--spiral-navy)] mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Smart Features
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Dynamic SPIRAL multipliers
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Real-time inventory monitoring
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Price drop detection
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Automated event bonuses
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Time-based perk activation
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-[var(--spiral-navy)] mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Production Ready
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Cloudant integration hooks
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Scalable data architecture
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Health monitoring system
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Error handling & logging
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Performance optimization
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Links */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-[var(--spiral-navy)]">Feature Navigation</CardTitle>
            <CardDescription>
              Quick access to all P1 features and demonstrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/loyalty-dashboard">
                <Button variant="outline" className="w-full justify-start h-auto p-4">
                  <div className="text-left">
                    <div className="font-semibold flex items-center gap-2">
                      <Star className="h-4 w-4 text-[var(--spiral-coral)]" />
                      Loyalty Dashboard
                    </div>
                    <div className="text-sm text-gray-600">SPIRAL balance & activity</div>
                  </div>
                </Button>
              </Link>

              <Link href="/mall-events-demo">
                <Button variant="outline" className="w-full justify-start h-auto p-4">
                  <div className="text-left">
                    <div className="font-semibold flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-[var(--spiral-coral)]" />
                      Mall Events
                    </div>
                    <div className="text-sm text-gray-600">Events & RSVP system</div>
                  </div>
                </Button>
              </Link>

              <Link href="/retailer-onboarding">
                <Button variant="outline" className="w-full justify-start h-auto p-4">
                  <div className="text-left">
                    <div className="font-semibold flex items-center gap-2">
                      <Store className="h-4 w-4 text-[var(--spiral-coral)]" />
                      Retailer Portal
                    </div>
                    <div className="text-sm text-gray-600">Business applications</div>
                  </div>
                </Button>
              </Link>

              <Link href="/wishlist-notifications">
                <Button variant="outline" className="w-full justify-start h-auto p-4">
                  <div className="text-left">
                    <div className="font-semibold flex items-center gap-2">
                      <Bell className="h-4 w-4 text-[var(--spiral-coral)]" />
                      Wishlist Alerts
                    </div>
                    <div className="text-sm text-gray-600">Smart notifications</div>
                  </div>
                </Button>
              </Link>

              <Link href="/p1-test-suite">
                <Button variant="outline" className="w-full justify-start h-auto p-4">
                  <div className="text-left">
                    <div className="font-semibold flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-[var(--spiral-coral)]" />
                      P1 Test Suite
                    </div>
                    <div className="text-sm text-gray-600">Feature validation</div>
                  </div>
                </Button>
              </Link>

              <Link href="/p0-features-demo">
                <Button variant="outline" className="w-full justify-start h-auto p-4">
                  <div className="text-left">
                    <div className="font-semibold flex items-center gap-2">
                      <Users className="h-4 w-4 text-[var(--spiral-coral)]" />
                      P0 Features
                    </div>
                    <div className="text-sm text-gray-600">Core platform features</div>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}