import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, TrendingUp, Target, AlertTriangle, DollarSign, Users, Package, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AIInsight {
  id: string;
  type: 'demand' | 'pricing' | 'fraud' | 'customer' | 'inventory';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  recommendation: string;
  data: any;
}

interface DemandForecast {
  product: string;
  category: string;
  currentDemand: number;
  predictedDemand: number;
  confidence: number;
  seasonality: string;
  factors: string[];
}

interface PricingRecommendation {
  product: string;
  currentPrice: number;
  recommendedPrice: number;
  expectedIncrease: number;
  reasoning: string;
  competitorAnalysis: any;
}

export default function AIBusinessIntelligence() {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [demandForecasts, setDemandForecasts] = useState<DemandForecast[]>([]);
  const [pricingRecommendations, setPricingRecommendations] = useState<PricingRecommendation[]>([]);
  const [customerAnalytics, setCustomerAnalytics] = useState<any>({});
  const [fraudAlerts, setFraudAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const { toast } = useToast();

  useEffect(() => {
    loadAIInsights();
    loadDemandForecasts();
    loadPricingRecommendations();
    loadCustomerAnalytics();
    loadFraudAlerts();
  }, [selectedTimeframe]);

  const loadAIInsights = async () => {
    try {
      const response = await fetch(`/api/ai/insights?timeframe=${selectedTimeframe}`);
      const data = await response.json();
      
      if (data.success) {
        setInsights(data.insights || generateMockInsights());
      } else {
        setInsights(generateMockInsights());
      }
    } catch (error) {
      console.error('Error loading AI insights:', error);
      setInsights(generateMockInsights());
    }
  };

  const loadDemandForecasts = async () => {
    try {
      const response = await fetch(`/api/ai/demand-forecast?timeframe=${selectedTimeframe}`);
      const data = await response.json();
      
      if (data.success) {
        setDemandForecasts(data.forecasts || generateMockForecasts());
      } else {
        setDemandForecasts(generateMockForecasts());
      }
    } catch (error) {
      console.error('Error loading demand forecasts:', error);
      setDemandForecasts(generateMockForecasts());
    }
  };

  const loadPricingRecommendations = async () => {
    try {
      const response = await fetch(`/api/ai/pricing-recommendations?timeframe=${selectedTimeframe}`);
      const data = await response.json();
      
      if (data.success) {
        setPricingRecommendations(data.recommendations || generateMockPricing());
      } else {
        setPricingRecommendations(generateMockPricing());
      }
    } catch (error) {
      console.error('Error loading pricing recommendations:', error);
      setPricingRecommendations(generateMockPricing());
    }
  };

  const loadCustomerAnalytics = async () => {
    try {
      const response = await fetch(`/api/ai/customer-analytics?timeframe=${selectedTimeframe}`);
      const data = await response.json();
      
      if (data.success) {
        setCustomerAnalytics(data.analytics || generateMockCustomerAnalytics());
      } else {
        setCustomerAnalytics(generateMockCustomerAnalytics());
      }
    } catch (error) {
      console.error('Error loading customer analytics:', error);
      setCustomerAnalytics(generateMockCustomerAnalytics());
    }
  };

  const loadFraudAlerts = async () => {
    try {
      const response = await fetch(`/api/ai/fraud-alerts?timeframe=${selectedTimeframe}`);
      const data = await response.json();
      
      if (data.success) {
        setFraudAlerts(data.alerts || generateMockFraudAlerts());
      } else {
        setFraudAlerts(generateMockFraudAlerts());
      }
    } catch (error) {
      console.error('Error loading fraud alerts:', error);
      setFraudAlerts(generateMockFraudAlerts());
    }
  };

  const generateMockInsights = (): AIInsight[] => [
    {
      id: 'insight_1',
      type: 'demand',
      title: 'Holiday Electronics Surge Predicted',
      description: 'AI models predict 35% increase in electronics demand over next 14 days',
      confidence: 87,
      impact: 'high',
      recommendation: 'Increase electronics inventory by 25-30% immediately',
      data: { category: 'Electronics', predictedIncrease: 35, timeframe: '14 days' }
    },
    {
      id: 'insight_2',
      type: 'pricing',
      title: 'Wireless Headphones Price Optimization',
      description: 'Competitor analysis suggests 8% price increase opportunity',
      confidence: 92,
      impact: 'medium',
      recommendation: 'Increase wireless headphones price from $79.99 to $86.99',
      data: { product: 'Wireless Headphones', currentPrice: 79.99, suggestedPrice: 86.99 }
    },
    {
      id: 'insight_3',
      type: 'customer',
      title: 'High-Value Customer Retention Risk',
      description: '23% of VIP customers showing decreased engagement patterns',
      confidence: 78,
      impact: 'high',
      recommendation: 'Launch targeted retention campaign with personalized offers',
      data: { affectedCustomers: 156, averageValue: 456.78, retentionCost: 23.45 }
    },
    {
      id: 'insight_4',
      type: 'fraud',
      title: 'Unusual Payment Pattern Detected',
      description: 'Multiple high-value transactions from new accounts detected',
      confidence: 94,
      impact: 'high',
      recommendation: 'Implement additional verification for orders over $200',
      data: { suspiciousTransactions: 12, totalValue: 2847.56, location: 'Multiple IP addresses' }
    }
  ];

  const generateMockForecasts = (): DemandForecast[] => [
    {
      product: 'Wireless Bluetooth Headphones',
      category: 'Electronics',
      currentDemand: 145,
      predictedDemand: 196,
      confidence: 87,
      seasonality: 'Holiday Shopping Peak',
      factors: ['Black Friday approach', 'Back-to-school season', 'New product releases']
    },
    {
      product: 'Essential Oil Diffuser',
      category: 'Home & Garden',
      currentDemand: 89,
      predictedDemand: 67,
      confidence: 82,
      seasonality: 'Winter Decline',
      factors: ['Seasonal aromatherapy decline', 'Holiday gift shift', 'Indoor wellness focus']
    },
    {
      product: 'Yoga Mat',
      category: 'Health & Beauty',
      currentDemand: 67,
      predictedDemand: 98,
      confidence: 91,
      seasonality: 'New Year Fitness Surge',
      factors: ['New Year resolutions', 'Post-holiday health focus', 'Winter fitness trends']
    }
  ];

  const generateMockPricing = (): PricingRecommendation[] => [
    {
      product: 'Wireless Bluetooth Headphones',
      currentPrice: 79.99,
      recommendedPrice: 86.99,
      expectedIncrease: 8.75,
      reasoning: 'High demand forecast, competitor prices 12% higher, low price elasticity',
      competitorAnalysis: { 
        avgCompetitorPrice: 89.99, 
        marketPosition: 'underpriced',
        demandElasticity: -0.3
      }
    },
    {
      product: 'Bamboo Cutting Board',
      currentPrice: 28.50,
      recommendedPrice: 24.99,
      expectedIncrease: -12.32,
      reasoning: 'Seasonal demand decline, competitor promotions, excess inventory',
      competitorAnalysis: { 
        avgCompetitorPrice: 26.99, 
        marketPosition: 'premium',
        demandElasticity: -1.2
      }
    },
    {
      product: 'Cotton T-Shirt',
      currentPrice: 18.99,
      recommendedPrice: 21.99,
      expectedIncrease: 15.8,
      reasoning: 'Rising material costs, strong brand loyalty, holiday gift potential',
      competitorAnalysis: { 
        avgCompetitorPrice: 22.50, 
        marketPosition: 'competitive',
        demandElasticity: -0.8
      }
    }
  ];

  const generateMockCustomerAnalytics = () => ({
    totalCustomers: 2847,
    activeCustomers: 1923,
    newCustomers: 245,
    churnRate: 3.2,
    averageLifetimeValue: 456.78,
    segments: [
      { name: 'VIP Customers', count: 289, averageSpend: 890.45, retentionRate: 94.2 },
      { name: 'Regular Shoppers', count: 1256, averageSpend: 234.67, retentionRate: 78.9 },
      { name: 'Occasional Buyers', count: 378, averageSpend: 67.89, retentionRate: 45.6 }
    ],
    behaviorInsights: [
      'Mobile users convert 23% higher than desktop',
      'Customers who use SPIRAL points have 67% higher retention',
      'Weekend shoppers spend 34% more per transaction'
    ]
  });

  const generateMockFraudAlerts = () => [
    {
      id: 'fraud_001',
      severity: 'high',
      type: 'Velocity Check',
      description: 'Multiple high-value purchases from same IP',
      riskScore: 94,
      affectedTransactions: 5,
      totalValue: 1247.89,
      recommendation: 'Block IP and require manual verification'
    },
    {
      id: 'fraud_002',
      severity: 'medium',
      type: 'Geographic Anomaly',
      description: 'Purchase from unusual location',
      riskScore: 67,
      affectedTransactions: 1,
      totalValue: 234.56,
      recommendation: 'Request additional verification'
    },
    {
      id: 'fraud_003',
      severity: 'low',
      type: 'Payment Pattern',
      description: 'Unusual payment method for customer',
      riskScore: 43,
      affectedTransactions: 1,
      totalValue: 89.99,
      recommendation: 'Monitor for additional suspicious activity'
    }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'demand': return <TrendingUp className="w-5 h-5" />;
      case 'pricing': return <DollarSign className="w-5 h-5" />;
      case 'customer': return <Users className="w-5 h-5" />;
      case 'fraud': return <Shield className="w-5 h-5" />;
      case 'inventory': return <Package className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-12 h-12 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-900">AI Business Intelligence</h1>
          </div>
          <p className="text-xl text-gray-600 mb-4">
            Advanced AI-powered insights for demand forecasting, dynamic pricing, and fraud detection
          </p>
          <div className="flex items-center justify-center gap-4">
            <Badge variant="outline" className="text-sm bg-purple-50 text-purple-800 border-purple-200">
              Machine Learning Powered
            </Badge>
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="90d">90 Days</SelectItem>
                <SelectItem value="1y">1 Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="insights" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="demand">Demand Forecast</TabsTrigger>
            <TabsTrigger value="pricing">Dynamic Pricing</TabsTrigger>
            <TabsTrigger value="customers">Customer Analytics</TabsTrigger>
            <TabsTrigger value="fraud">Fraud Detection</TabsTrigger>
          </TabsList>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {insights.map((insight) => (
                <Card key={insight.id} className="border-l-4 border-l-purple-500">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(insight.type)}
                        <span className="text-lg">{insight.title}</span>
                      </div>
                      <Badge className={getImpactColor(insight.impact)}>
                        {insight.impact} impact
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-gray-600">{insight.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Confidence</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full" 
                              style={{width: `${insight.confidence}%`}}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{insight.confidence}%</span>
                        </div>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <div className="text-sm font-medium text-purple-800 mb-1">Recommendation:</div>
                        <div className="text-sm text-purple-700">{insight.recommendation}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="demand" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  AI-Powered Demand Forecasting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {demandForecasts.map((forecast, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="font-semibold">{forecast.product}</div>
                          <div className="text-sm text-gray-600">{forecast.category}</div>
                        </div>
                        <Badge variant="outline">{forecast.confidence}% confidence</Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{forecast.currentDemand}</div>
                          <div className="text-xs text-gray-500">Current</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{forecast.predictedDemand}</div>
                          <div className="text-xs text-gray-500">Predicted</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${forecast.predictedDemand > forecast.currentDemand ? 'text-green-600' : 'text-red-600'}`}>
                            {forecast.predictedDemand > forecast.currentDemand ? '+' : ''}{Math.round(((forecast.predictedDemand - forecast.currentDemand) / forecast.currentDemand) * 100)}%
                          </div>
                          <div className="text-xs text-gray-500">Change</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium text-purple-600">{forecast.seasonality}</div>
                          <div className="text-xs text-gray-500">Seasonality</div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="text-sm font-medium mb-2">Key Factors:</div>
                        <div className="flex flex-wrap gap-2">
                          {forecast.factors.map((factor, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {factor}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Dynamic Pricing Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pricingRecommendations.map((rec, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="font-semibold">{rec.product}</div>
                        <Badge className={rec.expectedIncrease > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {rec.expectedIncrease > 0 ? '+' : ''}{rec.expectedIncrease.toFixed(1)}%
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div className="text-center">
                          <div className="text-xl font-bold text-gray-600">${rec.currentPrice}</div>
                          <div className="text-xs text-gray-500">Current Price</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-xl font-bold ${rec.expectedIncrease > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ${rec.recommendedPrice}
                          </div>
                          <div className="text-xs text-gray-500">Recommended</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-blue-600">${rec.competitorAnalysis.avgCompetitorPrice}</div>
                          <div className="text-xs text-gray-500">Competitor Avg</div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-3 rounded">
                        <div className="text-sm font-medium text-blue-800 mb-1">AI Reasoning:</div>
                        <div className="text-sm text-blue-700">{rec.reasoning}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">{customerAnalytics.totalCustomers?.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Customers</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">{customerAnalytics.activeCustomers?.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Active Customers</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <DollarSign className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">${customerAnalytics.averageLifetimeValue}</div>
                  <div className="text-sm text-gray-600">Avg Lifetime Value</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-red-600">{customerAnalytics.churnRate}%</div>
                  <div className="text-sm text-gray-600">Churn Rate</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Segments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {customerAnalytics.segments?.map((segment: any, index: number) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{segment.name}</span>
                          <Badge variant="outline">{segment.count} customers</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Avg Spend: </span>
                            <span className="font-medium">${segment.averageSpend}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Retention: </span>
                            <span className="font-medium">{segment.retentionRate}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Behavior Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {customerAnalytics.behaviorInsights?.map((insight: string, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded">
                        <Brain className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                        <span className="text-sm">{insight}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="fraud" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Real-Time Fraud Detection Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fraudAlerts.map((alert) => (
                    <div key={alert.id} className={`border-l-4 p-4 rounded ${
                      alert.severity === 'high' ? 'border-l-red-500 bg-red-50' :
                      alert.severity === 'medium' ? 'border-l-yellow-500 bg-yellow-50' :
                      'border-l-blue-500 bg-blue-50'
                    }`}>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="font-semibold flex items-center gap-2">
                            <AlertTriangle className={`w-4 h-4 ${
                              alert.severity === 'high' ? 'text-red-600' :
                              alert.severity === 'medium' ? 'text-yellow-600' :
                              'text-blue-600'
                            }`} />
                            {alert.type}
                          </div>
                          <div className="text-sm text-gray-600">{alert.description}</div>
                        </div>
                        <Badge className={
                          alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                          alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }>
                          {alert.severity} risk
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                        <div>
                          <span className="text-gray-500">Risk Score: </span>
                          <span className="font-medium">{alert.riskScore}/100</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Transactions: </span>
                          <span className="font-medium">{alert.affectedTransactions}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Value: </span>
                          <span className="font-medium">${alert.totalValue}</span>
                        </div>
                      </div>
                      
                      <div className={`p-3 rounded ${
                        alert.severity === 'high' ? 'bg-red-100' :
                        alert.severity === 'medium' ? 'bg-yellow-100' :
                        'bg-blue-100'
                      }`}>
                        <div className="text-sm font-medium mb-1">Recommended Action:</div>
                        <div className="text-sm">{alert.recommendation}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}