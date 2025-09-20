import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  XCircle, 
  Star, 
  TrendingUp,
  ShoppingCart,
  Users,
  MapPin,
  Smartphone,
  CreditCard,
  Package,
  BarChart3,
  Zap,
  Globe,
  Truck,
  Gift,
  MessageSquare,
  Award,
  Target,
  Eye,
  Lightbulb
} from 'lucide-react';

interface CompetitorFeature {
  name: string;
  amazon: { has: boolean; strength: number; note?: string };
  target: { has: boolean; strength: number; note?: string };
  walmart: { has: boolean; strength: number; note?: string };
  shopify: { has: boolean; strength: number; note?: string };
  spiral: { has: boolean; strength: number; note?: string; unique?: boolean };
}

interface CompetitiveAdvantage {
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
  implementation: string;
  opportunity: string;
}

export default function CompetitiveAnalysis() {
  const [activeCategory, setActiveCategory] = useState("overview");

  const featureComparison: CompetitorFeature[] = [
    // E-Commerce Core
    {
      name: "Multi-Store Checkout",
      amazon: { has: false, strength: 0, note: "Amazon marketplace but single seller checkout" },
      target: { has: false, strength: 0 },
      walmart: { has: false, strength: 0 },
      shopify: { has: false, strength: 0, note: "Separate stores = separate checkouts" },
      spiral: { has: true, strength: 95, note: "Revolutionary multi-retailer cart system", unique: true }
    },
    {
      name: "Local Store Integration",
      amazon: { has: true, strength: 60, note: "Amazon Fresh, Whole Foods only" },
      target: { has: true, strength: 85, note: "Strong drive-up and store pickup" },
      walmart: { has: true, strength: 90, note: "Industry leader in grocery pickup" },
      shopify: { has: false, strength: 20, note: "Depends on individual merchant setup" },
      spiral: { has: true, strength: 100, note: "Built specifically for local business discovery", unique: true }
    },
    {
      name: "Community Loyalty Program",
      amazon: { has: true, strength: 70, note: "Prime membership benefits" },
      target: { has: true, strength: 80, note: "Target Circle rewards" },
      walmart: { has: true, strength: 60, note: "Walmart+ membership" },
      shopify: { has: false, strength: 30, note: "Third-party loyalty apps only" },
      spiral: { has: true, strength: 95, note: "SPIRAL points with local community focus", unique: true }
    },
    {
      name: "Real-Time Inventory",
      amazon: { has: true, strength: 95, note: "Advanced FBA system" },
      target: { has: true, strength: 85 },
      walmart: { has: true, strength: 90 },
      shopify: { has: true, strength: 75, note: "Varies by merchant implementation" },
      spiral: { has: true, strength: 80, note: "Real-time alerts and tracking" }
    },
    {
      name: "Payment Processing",
      amazon: { has: true, strength: 90, note: "Amazon Pay, multiple methods" },
      target: { has: true, strength: 85 },
      walmart: { has: true, strength: 85 },
      shopify: { has: true, strength: 95, note: "Industry-leading payment gateway" },
      spiral: { has: true, strength: 90, note: "Stripe integration with multiple methods" }
    },
    
    // Search & Discovery
    {
      name: "AI-Powered Search",
      amazon: { has: true, strength: 95, note: "Rufus AI assistant, advanced ML" },
      target: { has: true, strength: 70 },
      walmart: { has: true, strength: 75, note: "Generative AI integration" },
      shopify: { has: true, strength: 60, note: "Basic AI search features" },
      spiral: { has: true, strength: 80, note: "Smart search with local focus" }
    },
    {
      name: "Location-Based Discovery",
      amazon: { has: false, strength: 30, note: "Limited to delivery zones" },
      target: { has: true, strength: 90, note: "Store locator with inventory" },
      walmart: { has: true, strength: 95, note: "Hexagonal delivery mapping" },
      shopify: { has: false, strength: 20 },
      spiral: { has: true, strength: 100, note: "Core feature - local business discovery", unique: true }
    },
    {
      name: "Mall Directory Integration",
      amazon: { has: false, strength: 0 },
      target: { has: false, strength: 0 },
      walmart: { has: false, strength: 0 },
      shopify: { has: false, strength: 0 },
      spiral: { has: true, strength: 100, note: "Comprehensive mall ecosystem", unique: true }
    },

    // Mobile & Technology
    {
      name: "Progressive Web App",
      amazon: { has: true, strength: 85 },
      target: { has: true, strength: 90, note: "Excellent mobile app integration" },
      walmart: { has: true, strength: 85 },
      shopify: { has: true, strength: 80 },
      spiral: { has: true, strength: 85, note: "PWA with offline support" }
    },
    {
      name: "AR/VR Features",
      amazon: { has: true, strength: 70, note: "AR view for some products" },
      target: { has: false, strength: 20 },
      walmart: { has: true, strength: 80, note: "Retina AR platform with 10x adoption" },
      shopify: { has: true, strength: 60, note: "3D product viewing" },
      spiral: { has: false, strength: 30, note: "Opportunity for AR mall navigation" }
    },
    {
      name: "Social Commerce",
      amazon: { has: true, strength: 60, note: "Amazon Live shopping" },
      target: { has: true, strength: 70 },
      walmart: { has: true, strength: 65 },
      shopify: { has: true, strength: 85, note: "Strong social media integration" },
      spiral: { has: true, strength: 90, note: "Community-driven social sharing", unique: true }
    },

    // Business Intelligence
    {
      name: "Advanced Analytics",
      amazon: { has: true, strength: 100, note: "Industry-leading seller analytics" },
      target: { has: true, strength: 70 },
      walmart: { has: true, strength: 85, note: "Element ML platform" },
      shopify: { has: true, strength: 90, note: "60+ dashboards, real-time data" },
      spiral: { has: true, strength: 85, note: "Comprehensive retailer analytics" }
    },
    {
      name: "Merchant Tools",
      amazon: { has: true, strength: 95, note: "Seller Central with AI tools" },
      target: { has: false, strength: 30, note: "Limited merchant platform" },
      walmart: { has: true, strength: 80, note: "Walmart Marketplace" },
      shopify: { has: true, strength: 100, note: "Core business - merchant-first platform" },
      spiral: { has: true, strength: 90, note: "Complete retailer portal" }
    }
  ];

  const spiralAdvantages: CompetitiveAdvantage[] = [
    {
      title: "Multi-Retailer Cart System",
      description: "Shop from multiple local businesses in a single cart with unified checkout",
      impact: "high",
      category: "Innovation",
      implementation: "Complete - Revolutionary approach to local commerce",
      opportunity: "Expand to national retailers and international markets"
    },
    {
      title: "Local Business Discovery Engine",
      description: "AI-powered local business discovery with mall integration and community focus",
      impact: "high", 
      category: "Local Commerce",
      implementation: "Complete - Nationwide mall and store directory",
      opportunity: "Add AI-powered business recommendations and local event integration"
    },
    {
      title: "Community-Driven Loyalty Program",
      description: "SPIRAL points system that rewards local shopping and community engagement",
      impact: "high",
      category: "Customer Retention",
      implementation: "Complete - Earning, redeeming, and viral growth features",
      opportunity: "Partner with local governments and chambers of commerce"
    },
    {
      title: "Mall-Centric Shopping Experience",
      description: "Complete digital mall ecosystem with tenant management and unified shopping",
      impact: "medium",
      category: "Innovation",
      implementation: "Complete - Mall templates, directories, and store pages",
      opportunity: "Virtual mall tours, AR navigation, and pop-up event integration"
    },
    {
      title: "Social Commerce Integration",
      description: "Built-in social sharing with community leaderboards and viral incentives",
      impact: "medium",
      category: "Growth",
      implementation: "Complete - X/Twitter, Facebook sharing with SPIRAL rewards",
      opportunity: "TikTok commerce, Instagram shopping, and influencer partnerships"
    }
  ];

  const gapsToAddress = [
    {
      title: "Advanced AI & Machine Learning",
      description: "Amazon's Rufus AI, Walmart's Element ML platform outpace SPIRAL's current AI capabilities",
      priority: "high",
      competitors: ["Amazon", "Walmart"],
      solution: "Implement AI-powered product recommendations, chatbot assistant, and predictive inventory management"
    },
    {
      title: "Logistics & Fulfillment Scale",
      description: "Amazon FBA, Walmart's same-day delivery network provide superior logistics",
      priority: "high", 
      competitors: ["Amazon", "Walmart"],
      solution: "Partner with local delivery services, implement dark store network, and offer premium delivery options"
    },
    {
      title: "AR/VR Shopping Experience",
      description: "Walmart's Retina platform and Amazon's AR view provide immersive shopping",
      priority: "medium",
      competitors: ["Walmart", "Amazon"],
      solution: "Develop AR mall navigation, virtual store tours, and 3D product visualization"
    },
    {
      title: "International & B2B Markets",
      description: "All competitors have strong international presence and B2B offerings",
      priority: "medium",
      competitors: ["Amazon", "Shopify", "Walmart"],
      solution: "Expand to international markets, add B2B features, and multi-currency support"
    },
    {
      title: "Enterprise Scalability",
      description: "Shopify Plus and Amazon's enterprise tools serve large merchants better",
      priority: "low",
      competitors: ["Shopify", "Amazon"],
      solution: "Develop SPIRAL Enterprise with advanced analytics, API access, and white-label options"
    }
  ];

  const getStrengthColor = (strength: number) => {
    if (strength >= 90) return "text-green-600";
    if (strength >= 70) return "text-yellow-600";
    if (strength >= 50) return "text-orange-600";
    return "text-red-600";
  };

  const getStrengthBadge = (strength: number) => {
    if (strength >= 90) return "bg-green-100 text-green-800";
    if (strength >= 70) return "bg-yellow-100 text-yellow-800";
    if (strength >= 50) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
  };

  const calculateOverallScore = (platform: string) => {
    const scores = featureComparison.map(f => {
      switch(platform) {
        case 'amazon': return f.amazon.strength;
        case 'target': return f.target.strength;
        case 'walmart': return f.walmart.strength;
        case 'shopify': return f.shopify.strength;
        case 'spiral': return f.spiral.strength;
        default: return 0;
      }
    });
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--spiral-navy)] mb-4">
            Competitive Analysis: SPIRAL vs. Major E-Commerce Platforms
          </h1>
          <p className="text-gray-600 text-lg">
            Comprehensive feature comparison with Amazon, Target, Walmart, and Shopify
          </p>
        </div>

        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Platform Overview</TabsTrigger>
            <TabsTrigger value="features">Feature Comparison</TabsTrigger>
            <TabsTrigger value="advantages">SPIRAL Advantages</TabsTrigger>
            <TabsTrigger value="gaps">Gaps & Opportunities</TabsTrigger>
          </TabsList>

          {/* Platform Overview */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
              {[
                { name: 'Amazon', score: calculateOverallScore('amazon'), color: 'from-orange-500 to-yellow-500' },
                { name: 'Target', score: calculateOverallScore('target'), color: 'from-red-500 to-pink-500' },
                { name: 'Walmart', score: calculateOverallScore('walmart'), color: 'from-blue-500 to-cyan-500' },
                { name: 'Shopify', score: calculateOverallScore('shopify'), color: 'from-green-500 to-emerald-500' },
                { name: 'SPIRAL', score: calculateOverallScore('spiral'), color: 'from-[var(--spiral-coral)] to-[var(--spiral-navy)]' }
              ].map((platform) => (
                <Card key={platform.name}>
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${platform.color} flex items-center justify-center text-white font-bold text-xl`}>
                      {platform.score}
                    </div>
                    <h3 className="font-bold text-lg text-[var(--spiral-navy)]">{platform.name}</h3>
                    <div className="mt-2">
                      <Progress value={platform.score} className="h-2" />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Overall Score</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-[var(--spiral-coral)]" />
                    SPIRAL's Unique Position
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Only platform with multi-retailer cart system</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Local business discovery engine</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Mall-centric shopping experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Community-driven loyalty program</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-orange-500" />
                    Areas for Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm">Advanced AI/ML capabilities</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm">Large-scale logistics network</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm">AR/VR shopping features</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm">International market presence</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Feature Comparison */}
          <TabsContent value="features" className="mt-6">
            <div className="space-y-6">
              {featureComparison.map((feature, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-[var(--spiral-navy)]">{feature.name}</h3>
                      {feature.spiral.unique && (
                        <Badge className="bg-[var(--spiral-coral)] text-white">SPIRAL Unique</Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      {[
                        { name: 'Amazon', data: feature.amazon },
                        { name: 'Target', data: feature.target },
                        { name: 'Walmart', data: feature.walmart },
                        { name: 'Shopify', data: feature.shopify },
                        { name: 'SPIRAL', data: feature.spiral }
                      ].map((platform) => (
                        <div key={platform.name} className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            {platform.data.has ? (
                              <CheckCircle className={`h-5 w-5 ${getStrengthColor(platform.data.strength)}`} />
                            ) : (
                              <XCircle className="h-5 w-5 text-gray-400" />
                            )}
                            <span className="font-medium text-sm">{platform.name}</span>
                          </div>
                          {platform.data.has && (
                            <Badge className={getStrengthBadge(platform.data.strength)}>
                              {platform.data.strength}%
                            </Badge>
                          )}
                          {platform.data.note && (
                            <p className="text-xs text-gray-600 mt-1">{platform.data.note}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* SPIRAL Advantages */}
          <TabsContent value="advantages" className="mt-6">
            <div className="space-y-6">
              {spiralAdvantages.map((advantage, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Lightbulb className="h-5 w-5 text-[var(--spiral-coral)]" />
                          <h3 className="text-lg font-semibold text-[var(--spiral-navy)]">{advantage.title}</h3>
                          <Badge variant={advantage.impact === 'high' ? 'destructive' : advantage.impact === 'medium' ? 'default' : 'secondary'}>
                            {advantage.impact} impact
                          </Badge>
                        </div>
                        <p className="text-gray-700 mb-3">{advantage.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-sm text-[var(--spiral-navy)] mb-1">Current Implementation</h4>
                            <p className="text-sm text-gray-600">{advantage.implementation}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm text-[var(--spiral-navy)] mb-1">Expansion Opportunity</h4>
                            <p className="text-sm text-gray-600">{advantage.opportunity}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Gaps & Opportunities */}
          <TabsContent value="gaps" className="mt-6">
            <div className="space-y-6">
              {gapsToAddress.map((gap, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Eye className="h-5 w-5 text-orange-500" />
                          <h3 className="text-lg font-semibold text-[var(--spiral-navy)]">{gap.title}</h3>
                          <Badge variant={gap.priority === 'high' ? 'destructive' : gap.priority === 'medium' ? 'default' : 'secondary'}>
                            {gap.priority} priority
                          </Badge>
                        </div>
                        
                        <p className="text-gray-700 mb-3">{gap.description}</p>
                        
                        <div className="mb-3">
                          <h4 className="font-medium text-sm text-[var(--spiral-navy)] mb-1">Leading Competitors</h4>
                          <div className="flex gap-2">
                            {gap.competitors.map((competitor) => (
                              <Badge key={competitor} variant="outline">{competitor}</Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-sm text-[var(--spiral-navy)] mb-1">Recommended Solution</h4>
                          <p className="text-sm text-gray-600">{gap.solution}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Items */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Strategic Recommendations</CardTitle>
            <CardDescription>Prioritized roadmap for competitive advantage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-red-50 border-l-4 border-red-400">
                <h4 className="font-semibold text-red-800 mb-2">High Priority (Q1 2025)</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Implement AI-powered product recommendations</li>
                  <li>• Partner with local delivery services</li>
                  <li>• Add chatbot customer service</li>
                  <li>• Enhance mobile app performance</li>
                </ul>
              </div>
              
              <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400">
                <h4 className="font-semibold text-yellow-800 mb-2">Medium Priority (Q2-Q3 2025)</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Develop AR mall navigation</li>
                  <li>• Expand international markets</li>
                  <li>• Add B2B features</li>
                  <li>• Create enterprise tier</li>
                </ul>
              </div>
              
              <div className="p-4 bg-green-50 border-l-4 border-green-400">
                <h4 className="font-semibold text-green-800 mb-2">Maintain Advantage</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Expand multi-retailer cart features</li>
                  <li>• Enhance local discovery engine</li>
                  <li>• Grow community loyalty program</li>
                  <li>• Develop mall partnerships</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}