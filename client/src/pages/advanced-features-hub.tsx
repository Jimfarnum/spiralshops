import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CreditCard, 
  Globe, 
  BarChart3, 
  Palette, 
  Building2, 
  Plug,
  Crown,
  Zap,
  Shield,
  TrendingUp,
  Users,
  Settings,
  CheckCircle,
  Clock,
  ArrowRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdvancedFeature {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: string;
  status: "live" | "beta" | "coming_soon";
  description: string;
  benefits: string[];
  pricing?: string;
}

export default function AdvancedFeaturesHub() {
  const [selectedCategory, setSelectedCategory] = useState("subscription");
  const { toast } = useToast();

  const advancedFeatures: AdvancedFeature[] = [
    {
      id: "subscription",
      name: "Enterprise Subscription Management",
      icon: <Crown className="w-6 h-6" />,
      category: "subscription",
      status: "live",
      description: "Tiered subscription plans with advanced features and priority support",
      benefits: [
        "Basic ($29/month) - Up to 100 products",
        "Professional ($99/month) - Up to 1,000 products + API access",
        "Enterprise ($299/month) - Unlimited + white-label"
      ],
      pricing: "Starting at $29/month"
    },
    {
      id: "multicurrency",
      name: "Global Multi-Currency Support",
      icon: <Globe className="w-6 h-6" />,
      category: "international",
      status: "live",
      description: "Accept payments in 10+ currencies with real-time exchange rates",
      benefits: [
        "Real-time currency conversion",
        "Automatic tax calculation by region",
        "Localized pricing display",
        "Global payment processing"
      ],
      pricing: "Included in Professional+"
    },
    {
      id: "advanced_analytics",
      name: "AI-Powered Business Intelligence",
      icon: <BarChart3 className="w-6 h-6" />,
      category: "analytics",
      status: "live",
      description: "Machine learning analytics with predictive insights and recommendations",
      benefits: [
        "Demand forecasting algorithms",
        "Customer behavior analysis",
        "Dynamic pricing optimization",
        "Inventory management AI"
      ],
      pricing: "Included in Enterprise"
    },
    {
      id: "whitelabel",
      name: "White-Label Solutions",
      icon: <Palette className="w-6 h-6" />,
      category: "branding",
      status: "live",
      description: "Complete platform customization with your brand identity",
      benefits: [
        "Custom domain and branding",
        "Branded mobile apps",
        "Custom CSS and themes",
        "Remove SPIRAL branding"
      ],
      pricing: "$500 setup + $199/month"
    },
    {
      id: "b2b_marketplace",
      name: "B2B Wholesale Marketplace",
      icon: <Building2 className="w-6 h-6" />,
      category: "b2b",
      status: "beta",
      description: "Dedicated B2B portal with wholesale pricing and bulk ordering",
      benefits: [
        "Tiered wholesale pricing",
        "Bulk order management",
        "Credit terms and invoicing",
        "B2B customer portal"
      ],
      pricing: "Contact for pricing"
    },
    {
      id: "api_marketplace",
      name: "Integration Marketplace",
      icon: <Plug className="w-6 h-6" />,
      category: "integrations",
      status: "live",
      description: "Connect with 50+ business tools and services",
      benefits: [
        "Shopify/WooCommerce migration",
        "Mailchimp, HubSpot integration",
        "QuickBooks accounting sync",
        "FedEx/UPS shipping APIs"
      ],
      pricing: "Free basic integrations"
    }
  ];

  const categories = [
    { id: "subscription", name: "Subscription Plans", icon: <Crown className="w-4 h-4" /> },
    { id: "international", name: "Global Commerce", icon: <Globe className="w-4 h-4" /> },
    { id: "analytics", name: "AI Analytics", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "branding", name: "White-Label", icon: <Palette className="w-4 h-4" /> },
    { id: "b2b", name: "B2B Solutions", icon: <Building2 className="w-4 h-4" /> },
    { id: "integrations", name: "Integrations", icon: <Plug className="w-4 h-4" /> }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "live":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Live</Badge>;
      case "beta":
        return <Badge className="bg-blue-100 text-blue-800"><Zap className="w-3 h-3 mr-1" />Beta</Badge>;
      case "coming_soon":
        return <Badge className="bg-gray-100 text-gray-800"><Clock className="w-3 h-3 mr-1" />Coming Soon</Badge>;
      default:
        return null;
    }
  };

  const handleFeatureAction = (featureId: string, action: string) => {
    toast({
      title: `${action} Initiated`,
      description: `Processing your request for ${featureId}. You'll receive an email with next steps.`,
    });
  };

  const filteredFeatures = advancedFeatures.filter(feature => feature.category === selectedCategory);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">SPIRAL Advanced Features Hub</h1>
          <p className="text-lg text-gray-600 mb-6">
            Enterprise-grade capabilities to scale your local business platform
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-600" />
              <span>Enterprise Security</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span>Scalable Infrastructure</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className="flex flex-col items-center gap-2 h-auto py-4"
            >
              {category.icon}
              <span className="text-xs text-center">{category.name}</span>
            </Button>
          ))}
        </div>

        {/* Feature Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredFeatures.map((feature) => (
            <Card key={feature.id} className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    {feature.icon}
                    {feature.name}
                  </CardTitle>
                  {getStatusBadge(feature.status)}
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Key Benefits</h4>
                  <ul className="space-y-1 text-sm">
                    {feature.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                {feature.pricing && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-blue-800">Pricing</div>
                    <div className="text-lg font-bold text-blue-900">{feature.pricing}</div>
                  </div>
                )}

                <div className="flex gap-2">
                  {feature.status === "live" && (
                    <Button 
                      onClick={() => handleFeatureAction(feature.name, "Setup")}
                      className="flex-1"
                    >
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                  {feature.status === "beta" && (
                    <Button 
                      variant="outline"
                      onClick={() => handleFeatureAction(feature.name, "Beta Access")}
                      className="flex-1"
                    >
                      Join Beta
                    </Button>
                  )}
                  {feature.status === "coming_soon" && (
                    <Button 
                      variant="outline"
                      onClick={() => handleFeatureAction(feature.name, "Waitlist")}
                      className="flex-1"
                    >
                      Join Waitlist
                    </Button>
                  )}
                  <Button variant="ghost" size="sm">
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Competitive Advantage Section */}
        <Card className="mt-8 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">Why Choose SPIRAL Advanced Features?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2 text-blue-800">vs. Shopify Plus</h4>
                <ul className="space-y-1 text-blue-700">
                  <li>• 50% lower transaction fees</li>
                  <li>• Built-in local business focus</li>
                  <li>• SPIRAL loyalty integration</li>
                  <li>• No additional app costs</li>
                  <li>• True white-label solutions</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-blue-800">vs. Magento Commerce</h4>
                <ul className="space-y-1 text-blue-700">
                  <li>• No hosting complexity</li>
                  <li>• Built-in AI analytics</li>
                  <li>• Faster time to market</li>
                  <li>• Integrated payment processing</li>
                  <li>• Local discovery features</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-blue-800">SPIRAL Unique Value</h4>
                <ul className="space-y-1 text-blue-700">
                  <li>• Multi-retailer cart system</li>
                  <li>• Community-driven loyalty</li>
                  <li>• Local business verification</li>
                  <li>• Mall management platform</li>
                  <li>• Viral referral engine</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enterprise Contact */}
        <Card className="mt-6 border-purple-200 bg-purple-50">
          <CardContent className="text-center py-8">
            <h3 className="text-xl font-bold text-purple-800 mb-2">
              Need Custom Enterprise Solutions?
            </h3>
            <p className="text-purple-700 mb-4">
              Get in touch with our enterprise team for custom pricing and features
            </p>
            <div className="flex justify-center gap-4">
              <Button 
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => handleFeatureAction("Enterprise Consultation", "Schedule")}
              >
                Schedule Consultation
              </Button>
              <Button variant="outline" className="border-purple-300 text-purple-700">
                View Case Studies
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}