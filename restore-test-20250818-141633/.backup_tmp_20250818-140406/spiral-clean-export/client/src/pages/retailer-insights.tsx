import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Star, 
  Eye, 
  Heart, 
  Share2,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function RetailerInsights() {
  // AI-powered insights and recommendations
  const insights = [
    {
      type: 'opportunity',
      priority: 'high',
      title: 'Peak Sales Window Identified',
      description: 'Your sales peak between 2-4 PM on weekdays. Consider scheduling social media posts and promotions during this time.',
      impact: '+25% potential revenue increase',
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      type: 'warning',
      priority: 'medium',
      title: 'Inventory Alert',
      description: 'Your top-selling "Custom Engagement Ring" is running low (5 units left). Consider restocking to avoid missed sales.',
      impact: 'Prevent potential lost sales',
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      type: 'success',
      priority: 'info',
      title: 'Customer Retention Strong',
      description: 'Your repeat customer rate (67.5%) is 23% above industry average. Your personalized service is working!',
      impact: 'Sustainable growth indicator',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      type: 'opportunity',
      priority: 'high',
      title: 'Social Sharing Momentum',
      description: 'Posts featuring your handmade jewelry get 3x more engagement. Focus content strategy on behind-the-scenes crafting.',
      impact: '+40% social reach potential',
      icon: Share2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    }
  ];

  const recommendations = [
    {
      category: 'Marketing',
      title: 'Launch Weekend Workshop Series',
      description: 'Based on customer engagement data, jewelry-making workshops could generate $2,250+ monthly revenue.',
      effort: 'Medium',
      impact: 'High',
      timeframe: '2-3 weeks'
    },
    {
      category: 'Inventory',
      title: 'Expand Bestseller Line',
      description: 'Your artisan necklace sets are your 2nd bestseller. Consider creating variations in different metals.',
      effort: 'Low',
      impact: 'High',
      timeframe: '1 week'
    },
    {
      category: 'Customer Experience',
      title: 'Implement Appointment Booking',
      description: 'Custom consultation requests increased 45%. An online booking system could capture more high-value sales.',
      effort: 'High',
      impact: 'Medium',
      timeframe: '3-4 weeks'
    },
    {
      category: 'SPIRAL Program',
      title: 'Create SPIRAL Loyalty Tiers',
      description: 'Offer exclusive previews to customers who\'ve earned 500+ SPIRALs. Could increase repeat purchases by 30%.',
      effort: 'Low',
      impact: 'Medium',
      timeframe: '1 week'
    }
  ];

  const competitorBenchmarks = [
    { metric: 'Average Order Value', yourValue: 115.2, industry: 89.5, performance: 'above' },
    { metric: 'Conversion Rate', yourValue: 3.2, industry: 2.8, performance: 'above' },
    { metric: 'Customer Retention', yourValue: 67.5, industry: 52.0, performance: 'above' },
    { metric: 'Social Engagement', yourValue: 4.1, industry: 3.2, performance: 'above' },
    { metric: 'Response Time', yourValue: 2.3, industry: 4.1, performance: 'above' },
    { metric: 'Review Rating', yourValue: 4.8, industry: 4.3, performance: 'above' }
  ];

  const customerSegments = [
    {
      name: 'VIP Customers',
      size: '15%',
      revenue: '45%',
      characteristics: 'High-value purchases, frequent custom orders, strong brand loyalty',
      avgSpend: '$285',
      spiralBalance: '850+',
      retention: '89%'
    },
    {
      name: 'Regular Shoppers',
      size: '35%',
      revenue: '40%',
      characteristics: 'Monthly purchases, mix of ready-made and custom items',
      avgSpend: '$125',
      spiralBalance: '200-500',
      retention: '72%'
    },
    {
      name: 'Occasional Buyers',
      size: '50%',
      revenue: '15%',
      characteristics: 'Special occasion purchases, price-sensitive, gift buyers',
      avgSpend: '$65',
      spiralBalance: '50-200',
      retention: '34%'
    }
  ];

  const InsightCard = ({ insight }: any) => (
    <Card className={`section-box border-l-4 ${
      insight.priority === 'high' ? 'border-l-red-500' : 
      insight.priority === 'medium' ? 'border-l-yellow-500' : 'border-l-blue-500'
    }`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg ${insight.bgColor}`}>
            <insight.icon className={`h-6 w-6 ${insight.color}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold text-[var(--spiral-navy)]">{insight.title}</h4>
              <Badge variant={insight.priority === 'high' ? 'destructive' : insight.priority === 'medium' ? 'default' : 'secondary'}>
                {insight.priority}
              </Badge>
            </div>
            <p className="text-gray-600 mb-3">{insight.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--spiral-coral)]">{insight.impact}</span>
              <Button size="sm" variant="outline">Act on This</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      
      <main className="section-modern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[var(--spiral-navy)] mb-2">
              Business Insights & Recommendations
            </h1>
            <p className="text-gray-600">AI-powered analysis to grow your business</p>
          </div>

          <Tabs defaultValue="insights" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="insights">Smart Insights</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
              <TabsTrigger value="segments">Customer Segments</TabsTrigger>
            </TabsList>

            {/* Smart Insights Tab */}
            <TabsContent value="insights" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {insights.map((insight, index) => (
                  <InsightCard key={index} insight={insight} />
                ))}
              </div>

              {/* Quick Stats */}
              <Card className="section-box bg-gradient-to-r from-[var(--spiral-navy)]/5 to-[var(--spiral-coral)]/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-[var(--spiral-coral)]" />
                    Performance Highlights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[var(--spiral-navy)]">23%</div>
                      <div className="text-sm text-gray-600">Above Industry Average</div>
                      <div className="text-xs text-[var(--spiral-coral)]">Customer Retention</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[var(--spiral-navy)]">+18.4%</div>
                      <div className="text-sm text-gray-600">Month-over-Month</div>
                      <div className="text-xs text-[var(--spiral-coral)]">SPIRAL Activity</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[var(--spiral-navy)]">4.8/5</div>
                      <div className="text-sm text-gray-600">Customer Rating</div>
                      <div className="text-xs text-[var(--spiral-coral)]">247 Reviews</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[var(--spiral-navy)]">89%</div>
                      <div className="text-sm text-gray-600">VIP Retention</div>
                      <div className="text-xs text-[var(--spiral-coral)]">Top Customers</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Recommendations Tab */}
            <TabsContent value="recommendations" className="space-y-6">
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <Card key={index} className="section-box">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{rec.category}</Badge>
                          <h4 className="font-semibold text-[var(--spiral-navy)]">{rec.title}</h4>
                        </div>
                        <Button className="button-primary">Implement</Button>
                      </div>
                      <p className="text-gray-600 mb-4">{rec.description}</p>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-gray-400" />
                          <span>Effort: </span>
                          <Badge variant={rec.effort === 'High' ? 'destructive' : rec.effort === 'Medium' ? 'default' : 'secondary'}>
                            {rec.effort}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-gray-400" />
                          <span>Impact: </span>
                          <Badge variant={rec.impact === 'High' ? 'default' : 'secondary'}>
                            {rec.impact}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>{rec.timeframe}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Benchmarks Tab */}
            <TabsContent value="benchmarks" className="space-y-6">
              <Card className="section-box">
                <CardHeader>
                  <CardTitle>Industry Benchmarks</CardTitle>
                  <CardDescription>How your business compares to similar retailers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {competitorBenchmarks.map((benchmark, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-700">{benchmark.metric}</span>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-semibold text-[var(--spiral-navy)]">
                              {benchmark.yourValue}
                              {benchmark.metric.includes('Rate') || benchmark.metric.includes('Rating') ? '' : 
                               benchmark.metric.includes('Time') ? 'h' : 
                               benchmark.metric.includes('Value') ? '' : '%'}
                            </div>
                            <div className="text-xs text-gray-500">Your Store</div>
                          </div>
                          <div className="text-right">
                            <div className="text-gray-600">
                              {benchmark.industry}
                              {benchmark.metric.includes('Rate') || benchmark.metric.includes('Rating') ? '' : 
                               benchmark.metric.includes('Time') ? 'h' : 
                               benchmark.metric.includes('Value') ? '' : '%'}
                            </div>
                            <div className="text-xs text-gray-500">Industry Avg</div>
                          </div>
                          <div className="flex items-center">
                            {benchmark.performance === 'above' ? (
                              <TrendingUp className="h-5 w-5 text-green-600" />
                            ) : (
                              <TrendingDown className="h-5 w-5 text-red-600" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Customer Segments Tab */}
            <TabsContent value="segments" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {customerSegments.map((segment, index) => (
                  <Card key={index} className="section-box">
                    <CardHeader>
                      <CardTitle className="text-lg">{segment.name}</CardTitle>
                      <CardDescription>
                        {segment.size} of customers • {segment.revenue} of revenue
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-600">{segment.characteristics}</p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Avg Spend:</span>
                          <span className="font-medium">{segment.avgSpend}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">SPIRAL Balance:</span>
                          <span className="font-medium text-[var(--spiral-coral)]">{segment.spiralBalance}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Retention:</span>
                          <span className="font-medium">{segment.retention}</span>
                        </div>
                      </div>
                      
                      <Button variant="outline" className="w-full">
                        Target This Segment
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}