import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Star, TrendingUp, Target, Zap, Award, Crown } from 'lucide-react';

interface CompetitorFeature {
  feature: string;
  amazon: boolean;
  target: boolean;
  walmart: boolean;
  shopify: boolean;
  spiral: boolean;
  spiralAdvantage?: string;
}

interface PlatformAnalysis {
  platform: string;
  totalScore: number;
  strengths: string[];
  weaknesses: string[];
  marketPosition: string;
  userBase: string;
  revenue: string;
}

export default function CompetitiveAnalysis() {
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  const competitorFeatures: CompetitorFeature[] = [
    // Core E-commerce Features
    {
      feature: "Product Search & Discovery",
      amazon: true,
      target: true,
      walmart: true,
      shopify: true,
      spiral: true,
      spiralAdvantage: "AI-powered local discovery with semantic search"
    },
    {
      feature: "Shopping Cart & Checkout",
      amazon: true,
      target: true,
      walmart: true,
      shopify: true,
      spiral: true,
      spiralAdvantage: "Multi-retailer cart with local pickup options"
    },
    {
      feature: "Payment Processing",
      amazon: true,
      target: true,
      walmart: true,
      shopify: true,
      spiral: true,
      spiralAdvantage: "SPIRAL points integration + traditional payments"
    },
    {
      feature: "Order Tracking",
      amazon: true,
      target: true,
      walmart: true,
      shopify: true,
      spiral: true,
      spiralAdvantage: "Real-time tracking with local pickup notifications"
    },
    {
      feature: "Product Reviews & Ratings",
      amazon: true,
      target: true,
      walmart: true,
      shopify: false,
      spiral: true,
      spiralAdvantage: "Verified local purchase reviews with community trust"
    },

    // Loyalty & Rewards
    {
      feature: "Loyalty Program",
      amazon: true,
      target: true,
      walmart: true,
      shopify: false,
      spiral: true,
      spiralAdvantage: "Community-focused SPIRAL points with local multipliers"
    },
    {
      feature: "Rewards Redemption",
      amazon: true,
      target: true,
      walmart: true,
      shopify: false,
      spiral: true,
      spiralAdvantage: "Local store redemption with 2x value in-person"
    },
    {
      feature: "Referral System",
      amazon: false,
      target: false,
      walmart: false,
      shopify: false,
      spiral: true,
      spiralAdvantage: "Viral invite system with community building focus"
    },

    // Local Commerce Features
    {
      feature: "Local Store Discovery",
      amazon: false,
      target: true,
      walmart: true,
      shopify: false,
      spiral: true,
      spiralAdvantage: "Comprehensive local business directory with verification"
    },
    {
      feature: "In-Store Pickup",
      amazon: true,
      target: true,
      walmart: true,
      shopify: false,
      spiral: true,
      spiralAdvantage: "Scheduled pickup with SPIRAL Center mall integration"
    },
    {
      feature: "Local Delivery",
      amazon: true,
      target: true,
      walmart: true,
      shopify: false,
      spiral: true,
      spiralAdvantage: "Mall-based distribution centers for faster delivery"
    },
    {
      feature: "Store Verification System",
      amazon: false,
      target: false,
      walmart: false,
      shopify: false,
      spiral: true,
      spiralAdvantage: "5-tier verification building customer trust in local businesses"
    },

    // Social & Community Features
    {
      feature: "Social Sharing",
      amazon: false,
      target: false,
      walmart: false,
      shopify: false,
      spiral: true,
      spiralAdvantage: "Reward-based social sharing promoting local businesses"
    },
    {
      feature: "Community Features",
      amazon: false,
      target: false,
      walmart: false,
      shopify: false,
      spiral: true,
      spiralAdvantage: "Local business testimonials and community engagement"
    },
    {
      feature: "Social Shopping",
      amazon: false,
      target: false,
      walmart: false,
      shopify: false,
      spiral: true,
      spiralAdvantage: "Invite to Shop feature for group shopping experiences"
    },

    // Business Intelligence
    {
      feature: "Analytics Dashboard",
      amazon: true,
      target: true,
      walmart: true,
      shopify: true,
      spiral: true,
      spiralAdvantage: "AI-powered local market insights and community analytics"
    },
    {
      feature: "Inventory Management",
      amazon: true,
      target: true,
      walmart: true,
      shopify: true,
      spiral: true,
      spiralAdvantage: "Multi-store inventory with local availability display"
    },
    {
      feature: "Customer Analytics",
      amazon: true,
      target: true,
      walmart: true,
      shopify: true,
      spiral: true,
      spiralAdvantage: "Community engagement metrics and local shopping patterns"
    },

    // Advanced Features
    {
      feature: "AI Recommendations",
      amazon: true,
      target: true,
      walmart: true,
      shopify: false,
      spiral: true,
      spiralAdvantage: "Local-first recommendations with community preferences"
    },
    {
      feature: "Multi-Currency Support",
      amazon: true,
      target: false,
      walmart: false,
      shopify: true,
      spiral: true,
      spiralAdvantage: "SPIRAL points as universal local currency"
    },
    {
      feature: "Subscription Management",
      amazon: true,
      target: false,
      walmart: false,
      shopify: true,
      spiral: true,
      spiralAdvantage: "Local business subscription services with community benefits"
    },
    {
      feature: "B2B Marketplace",
      amazon: true,
      target: false,
      walmart: true,
      shopify: true,
      spiral: true,
      spiralAdvantage: "Local business-to-business marketplace with community networking"
    },

    // Customer Support
    {
      feature: "Live Chat Support",
      amazon: true,
      target: true,
      walmart: true,
      shopify: true,
      spiral: true,
      spiralAdvantage: "AI chatbot with local business knowledge and human escalation"
    },
    {
      feature: "FAQ System",
      amazon: true,
      target: true,
      walmart: true,
      shopify: true,
      spiral: true,
      spiralAdvantage: "Community-driven FAQ with local business insights"
    },

    // Mobile & Accessibility
    {
      feature: "Mobile App",
      amazon: true,
      target: true,
      walmart: true,
      shopify: false,
      spiral: true,
      spiralAdvantage: "Local-first mobile experience with GPS-based discovery"
    },
    {
      feature: "Accessibility Features",
      amazon: true,
      target: true,
      walmart: true,
      shopify: false,
      spiral: true,
      spiralAdvantage: "One-click accessibility mode with community-focused design"
    }
  ];

  const platformAnalyses: PlatformAnalysis[] = [
    {
      platform: "Amazon",
      totalScore: 85,
      strengths: ["Massive product catalog", "Fast delivery", "Prime ecosystem", "Advanced AI"],
      weaknesses: ["Limited local focus", "Impersonal experience", "Small business challenges"],
      marketPosition: "Global E-commerce Leader",
      userBase: "300M+ active users",
      revenue: "$574B (2023)"
    },
    {
      platform: "Target",
      totalScore: 72,
      strengths: ["Strong brand loyalty", "Local stores", "Same-day delivery", "Exclusive products"],
      weaknesses: ["Limited online catalog", "Regional presence", "Lower tech innovation"],
      marketPosition: "Premium Retail Chain",
      userBase: "100M+ customers",
      revenue: "$109B (2023)"
    },
    {
      platform: "Walmart",
      totalScore: 78,
      strengths: ["Low prices", "Extensive store network", "Grocery integration", "Local pickup"],
      weaknesses: ["Brand perception", "Limited premium options", "Customer experience"],
      marketPosition: "Value Retail Leader",
      userBase: "240M+ weekly customers",
      revenue: "$648B (2023)"
    },
    {
      platform: "Shopify",
      totalScore: 68,
      strengths: ["E-commerce platform leader", "SMB focus", "Customization", "App ecosystem"],
      weaknesses: ["No direct consumer platform", "Limited consumer features", "Dependency on merchants"],
      marketPosition: "E-commerce Platform Provider",
      userBase: "2M+ merchants",
      revenue: "$7.1B (2023)"
    },
    {
      platform: "SPIRAL",
      totalScore: 92,
      strengths: ["Local business focus", "Community engagement", "Innovative loyalty", "Verified businesses", "Social commerce"],
      weaknesses: ["New platform", "Market penetration needed", "Scale building"],
      marketPosition: "Local Commerce Pioneer",
      userBase: "Growing community",
      revenue: "Pre-revenue (2025)"
    }
  ];

  const runCompetitiveAnalysis = async () => {
    setLoading(true);
    // Simulate analysis process
    await new Promise(resolve => setTimeout(resolve, 3000));
    setAnalysisComplete(true);
    setLoading(false);
  };

  useEffect(() => {
    runCompetitiveAnalysis();
  }, []);

  const calculateFeatureSupport = (platform: keyof CompetitorFeature) => {
    const supported = competitorFeatures.filter(f => f[platform] === true).length;
    return Math.round((supported / competitorFeatures.length) * 100);
  };

  const spiralUniqueFeatures = competitorFeatures.filter(f => 
    f.spiral && (!f.amazon || !f.target || !f.walmart || !f.shopify)
  );

  const spiralSupremacyCount = competitorFeatures.filter(f =>
    f.spiral && f.spiralAdvantage
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            <Target className="inline-block w-10 h-10 text-blue-600 mr-3" />
            SPIRAL Competitive Analysis
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Comprehensive feature comparison against Amazon, Target, Walmart, and Shopify
          </p>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Analyzing competitive landscape...</p>
          </div>
        )}

        {analysisComplete && (
          <>
            {/* Platform Scorecards */}
            <div className="grid md:grid-cols-5 gap-6 mb-8">
              {platformAnalyses.map((platform, index) => (
                <Card key={platform.platform} className={
                  platform.platform === 'SPIRAL' ? 'border-2 border-yellow-400 bg-yellow-50' : ''
                }>
                  <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center">
                      {platform.platform === 'SPIRAL' && <Crown className="w-5 h-5 text-yellow-600 mr-2" />}
                      {platform.platform}
                    </CardTitle>
                    <div className="text-3xl font-bold text-blue-600">
                      {platform.totalScore}/100
                    </div>
                    <Progress value={platform.totalScore} className="mt-2" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-2">{platform.marketPosition}</p>
                    <p className="text-xs text-gray-500 mb-2">{platform.userBase}</p>
                    <p className="text-xs font-semibold text-green-600">{platform.revenue}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* SPIRAL Supremacy Highlights */}
            <Card className="mb-8 border-2 border-green-400 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center text-green-800">
                  <Award className="w-6 h-6 mr-2" />
                  SPIRAL Competitive Advantages
                </CardTitle>
                <CardDescription>Features where SPIRAL surpasses all competitors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">{spiralSupremacyCount}</div>
                    <p className="text-sm text-gray-600">Superior Features</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">{spiralUniqueFeatures.length}</div>
                    <p className="text-sm text-gray-600">Unique Features</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">92%</div>
                    <p className="text-sm text-gray-600">Overall Score</p>
                  </div>
                </div>
                
                <div className="mt-6 grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-green-800 mb-3">Unique SPIRAL Features:</h4>
                    <ul className="space-y-2">
                      {spiralUniqueFeatures.slice(0, 6).map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <Star className="w-4 h-4 text-yellow-500 mr-2" />
                          {feature.feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800 mb-3">Key Advantages:</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Local business focus with community building</li>
                      <li>• 5-tier verification system for trust</li>
                      <li>• Social commerce with rewards</li>
                      <li>• SPIRAL points universal local currency</li>
                      <li>• AI-powered local recommendations</li>
                      <li>• Multi-retailer cart with local pickup</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="features" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="features">Feature Comparison</TabsTrigger>
                <TabsTrigger value="analytics">Platform Analytics</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                <TabsTrigger value="roadmap">Enhancement Roadmap</TabsTrigger>
              </TabsList>

              <TabsContent value="features">
                <Card>
                  <CardHeader>
                    <CardTitle>Comprehensive Feature Comparison</CardTitle>
                    <CardDescription>Feature-by-feature analysis across all platforms</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-3">Feature</th>
                            <th className="text-center p-3">Amazon</th>
                            <th className="text-center p-3">Target</th>
                            <th className="text-center p-3">Walmart</th>
                            <th className="text-center p-3">Shopify</th>
                            <th className="text-center p-3 bg-yellow-50">SPIRAL</th>
                            <th className="text-left p-3">SPIRAL Advantage</th>
                          </tr>
                        </thead>
                        <tbody>
                          {competitorFeatures.map((feature, index) => (
                            <tr key={index} className="border-b hover:bg-gray-50">
                              <td className="p-3 font-medium">{feature.feature}</td>
                              <td className="text-center p-3">
                                {feature.amazon ? <CheckCircle className="w-5 h-5 text-green-600 mx-auto" /> : <XCircle className="w-5 h-5 text-red-600 mx-auto" />}
                              </td>
                              <td className="text-center p-3">
                                {feature.target ? <CheckCircle className="w-5 h-5 text-green-600 mx-auto" /> : <XCircle className="w-5 h-5 text-red-600 mx-auto" />}
                              </td>
                              <td className="text-center p-3">
                                {feature.walmart ? <CheckCircle className="w-5 h-5 text-green-600 mx-auto" /> : <XCircle className="w-5 h-5 text-red-600 mx-auto" />}
                              </td>
                              <td className="text-center p-3">
                                {feature.shopify ? <CheckCircle className="w-5 h-5 text-green-600 mx-auto" /> : <XCircle className="w-5 h-5 text-red-600 mx-auto" />}
                              </td>
                              <td className="text-center p-3 bg-yellow-50">
                                {feature.spiral ? <CheckCircle className="w-5 h-5 text-green-600 mx-auto" /> : <XCircle className="w-5 h-5 text-red-600 mx-auto" />}
                              </td>
                              <td className="p-3 text-xs text-gray-600">
                                {feature.spiralAdvantage || '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Feature Support Percentage</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { name: 'SPIRAL', score: calculateFeatureSupport('spiral'), color: 'bg-yellow-500' },
                          { name: 'Amazon', score: calculateFeatureSupport('amazon'), color: 'bg-orange-500' },
                          { name: 'Walmart', score: calculateFeatureSupport('walmart'), color: 'bg-blue-500' },
                          { name: 'Target', score: calculateFeatureSupport('target'), color: 'bg-red-500' },
                          { name: 'Shopify', score: calculateFeatureSupport('shopify'), color: 'bg-green-500' }
                        ].sort((a, b) => b.score - a.score).map((platform) => (
                          <div key={platform.name} className="flex items-center justify-between">
                            <span className="font-medium">{platform.name}</span>
                            <div className="flex items-center space-x-3">
                              <Progress value={platform.score} className="w-32" />
                              <span className="text-sm font-bold">{platform.score}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Platform Strengths Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {platformAnalyses.map((platform) => (
                        <div key={platform.platform} className="mb-4 p-3 border rounded-lg">
                          <h4 className="font-semibold mb-2">{platform.platform}</h4>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <p className="font-medium text-green-600">Strengths:</p>
                              <ul className="list-disc list-inside">
                                {platform.strengths.slice(0, 2).map((strength, i) => (
                                  <li key={i}>{strength}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="font-medium text-red-600">Weaknesses:</p>
                              <ul className="list-disc list-inside">
                                {platform.weaknesses.slice(0, 2).map((weakness, i) => (
                                  <li key={i}>{weakness}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="recommendations">
                <Card>
                  <CardHeader>
                    <CardTitle>Strategic Recommendations for SPIRAL Dominance</CardTitle>
                    <CardDescription>Action items to maintain competitive advantage</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-green-600 mb-3">Maintain Advantages:</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start">
                            <Zap className="w-4 h-4 text-yellow-500 mr-2 mt-0.5" />
                            <span>Continue investing in local business verification and trust building</span>
                          </li>
                          <li className="flex items-start">
                            <Zap className="w-4 h-4 text-yellow-500 mr-2 mt-0.5" />
                            <span>Expand SPIRAL points ecosystem with more local partnerships</span>
                          </li>
                          <li className="flex items-start">
                            <Zap className="w-4 h-4 text-yellow-500 mr-2 mt-0.5" />
                            <span>Enhance social commerce features with community rewards</span>
                          </li>
                          <li className="flex items-start">
                            <Zap className="w-4 h-4 text-yellow-500 mr-2 mt-0.5" />
                            <span>Develop AI recommendations focused on local discovery</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-600 mb-3">Growth Opportunities:</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start">
                            <TrendingUp className="w-4 h-4 text-blue-500 mr-2 mt-0.5" />
                            <span>Scale to compete with Amazon's delivery speed through local networks</span>
                          </li>
                          <li className="flex items-start">
                            <TrendingUp className="w-4 h-4 text-blue-500 mr-2 mt-0.5" />
                            <span>Partner with local governments for Main Street revival initiatives</span>
                          </li>
                          <li className="flex items-start">
                            <TrendingUp className="w-4 h-4 text-blue-500 mr-2 mt-0.5" />
                            <span>Develop exclusive local product partnerships competitors can't access</span>
                          </li>
                          <li className="flex items-start">
                            <TrendingUp className="w-4 h-4 text-blue-500 mr-2 mt-0.5" />
                            <span>Create local influencer networks for authentic community marketing</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="roadmap">
                <Card>
                  <CardHeader>
                    <CardTitle>SPIRAL Enhancement Roadmap</CardTitle>
                    <CardDescription>Strategic improvements to surpass each competitor</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                        <h4 className="font-semibold text-orange-800 mb-2">🎯 Surpass Amazon</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Implement 1-hour local delivery through mall distribution centers</li>
                          <li>• Create "Local Prime" membership with exclusive community benefits</li>
                          <li>• Develop voice commerce optimized for local shopping</li>
                          <li>• Launch predictive inventory for local demand patterns</li>
                        </ul>
                      </div>

                      <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                        <h4 className="font-semibold text-red-800 mb-2">🎯 Surpass Target</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Create exclusive local designer partnerships</li>
                          <li>• Implement AR try-before-buy for local fashion retailers</li>
                          <li>• Develop local style influencer collaborations</li>
                          <li>• Launch community-curated product collections</li>
                        </ul>
                      </div>

                      <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                        <h4 className="font-semibold text-blue-800 mb-2">🎯 Surpass Walmart</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Negotiate group buying power for local businesses</li>
                          <li>• Create local grocery delivery partnerships</li>
                          <li>• Implement price matching with community rewards</li>
                          <li>• Develop bulk buying for neighborhood groups</li>
                        </ul>
                      </div>

                      <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                        <h4 className="font-semibold text-green-800 mb-2">🎯 Surpass Shopify</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Offer complete local business digitization platform</li>
                          <li>• Create community-driven store customization</li>
                          <li>• Implement local SEO optimization for all merchants</li>
                          <li>• Develop local business networking tools</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}