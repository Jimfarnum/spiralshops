import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, TrendingUp, Clock, DollarSign, Package2, 
  Zap, Target, Calendar, AlertTriangle, CheckCircle,
  Star, ArrowUp, ArrowDown, Minus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Recommendation {
  name: string;
  category: string;
  price: number;
  reasoning: string;
  confidence: number;
}

interface PricePrediction {
  nextWeek: {
    predictedPrice: number;
    confidence: number;
    reasoning: string;
  };
  nextMonth: {
    predictedPrice: number;
    confidence: number;
    reasoning: string;
  };
  bestTimeThisSell: {
    timeframe: string;
    reasoning: string;
    savingsOpportunity: number;
  };
}

interface CompetitorPrice {
  retailer: string;
  price: number;
  availability: string;
  shipping: string;
  priceAdvantage: number;
}

const IntelligentWishlist = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('recommendations');
  const shopperId = 'shopper_123'; // In real app, get from auth context

  // AI-Powered Recommendations
  const { data: recommendations, isLoading: loadingRecs } = useQuery({
    queryKey: ['/api/intelligent-wishlist/recommendations', shopperId],
    queryFn: async () => {
      const response = await fetch(`/api/intelligent-wishlist/recommendations/${shopperId}`);
      if (!response.ok) throw new Error('Failed to fetch recommendations');
      return response.json();
    }
  });

  // Price Predictions
  const { data: priceData, isLoading: loadingPrice } = useQuery({
    queryKey: ['/api/intelligent-wishlist/price-prediction', 'prod_1'],
    queryFn: async () => {
      const response = await fetch('/api/intelligent-wishlist/price-prediction/prod_1');
      if (!response.ok) throw new Error('Failed to fetch price prediction');
      return response.json();
    }
  });

  // Shopping Timing Intelligence
  const { data: timingData, isLoading: loadingTiming } = useQuery({
    queryKey: ['/api/intelligent-wishlist/timing-optimization', shopperId],
    queryFn: async () => {
      const response = await fetch(`/api/intelligent-wishlist/timing-optimization/${shopperId}`);
      if (!response.ok) throw new Error('Failed to fetch timing data');
      return response.json();
    }
  });

  // Competitor Analysis
  const { data: competitorData, isLoading: loadingCompetitors } = useQuery({
    queryKey: ['/api/intelligent-wishlist/competitor-analysis', 'prod_1'],
    queryFn: async () => {
      const response = await fetch('/api/intelligent-wishlist/competitor-analysis/prod_1');
      if (!response.ok) throw new Error('Failed to fetch competitor data');
      return response.json();
    }
  });

  // Smart Bundles
  const { data: bundleData, isLoading: loadingBundles } = useQuery({
    queryKey: ['/api/intelligent-wishlist/smart-bundles', shopperId],
    queryFn: async () => {
      const response = await fetch(`/api/intelligent-wishlist/smart-bundles/${shopperId}`);
      if (!response.ok) throw new Error('Failed to fetch bundle data');
      return response.json();
    }
  });

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getPriceDirection = (current: number, predicted: number) => {
    if (predicted > current * 1.05) return { icon: ArrowUp, color: 'text-red-500', text: 'Likely to increase' };
    if (predicted < current * 0.95) return { icon: ArrowDown, color: 'text-green-500', text: 'Likely to decrease' };
    return { icon: Minus, color: 'text-gray-500', text: 'Stable pricing expected' };
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="h-8 w-8 text-[hsl(183,100%,23%)]" />
            <h1 className="text-3xl font-bold text-gray-900">SPIRAL Intelligence</h1>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              AI-Powered
            </Badge>
          </div>
          <p className="text-gray-600 text-lg">
            Advanced shopping intelligence with AI recommendations, price predictions, and market analysis
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Smart Recommendations
            </TabsTrigger>
            <TabsTrigger value="pricing" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Price Intelligence
            </TabsTrigger>
            <TabsTrigger value="timing" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Optimal Timing
            </TabsTrigger>
            <TabsTrigger value="competitors" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Market Analysis
            </TabsTrigger>
            <TabsTrigger value="bundles" className="flex items-center gap-2">
              <Package2 className="h-4 w-4" />
              Smart Bundles
            </TabsTrigger>
          </TabsList>

          {/* AI Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  AI-Powered Product Recommendations
                </CardTitle>
                <p className="text-gray-600">
                  Personalized suggestions based on your preferences, browsing history, and shopping patterns
                </p>
              </CardHeader>
              <CardContent>
                {loadingRecs ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="animate-pulse bg-gray-200 h-32 rounded-lg" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recommendations?.recommendations?.map((rec: Recommendation, index: number) => (
                      <Card key={index} className="border-l-4 border-l-purple-500">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-gray-900">{rec.name}</h3>
                            <Badge className={getConfidenceColor(rec.confidence)}>
                              {Math.round(rec.confidence * 100)}%
                            </Badge>
                          </div>
                          <Badge variant="outline" className="mb-2">{rec.category}</Badge>
                          <p className="text-lg font-bold text-[hsl(183,100%,23%)] mb-3">
                            ${rec.price?.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600 mb-3">{rec.reasoning}</p>
                          <Button size="sm" className="w-full">
                            Add to Wishlist
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Price Intelligence Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Price Predictions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingPrice ? (
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-8 bg-gray-200 rounded" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Current Price</span>
                          <span className="text-2xl font-bold text-[hsl(183,100%,23%)]">
                            ${priceData?.currentPrice?.toFixed(2)}
                          </span>
                        </div>
                        
                        {priceData?.predictions?.nextWeek && (
                          <div className="border-t pt-4">
                            <div className="flex items-center gap-2 mb-2">
                              {(() => {
                                const direction = getPriceDirection(priceData.currentPrice, priceData.predictions.nextWeek.predictedPrice);
                                const IconComponent = direction.icon;
                                return (
                                  <>
                                    <IconComponent className={`h-4 w-4 ${direction.color}`} />
                                    <span className="font-medium">Next Week Prediction</span>
                                    <Badge className={getConfidenceColor(priceData.predictions.nextWeek.confidence)}>
                                      {Math.round(priceData.predictions.nextWeek.confidence * 100)}%
                                    </Badge>
                                  </>
                                );
                              })()}
                            </div>
                            <p className="text-lg font-semibold">
                              ${priceData.predictions.nextWeek.predictedPrice?.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-600">
                              {priceData.predictions.nextWeek.reasoning}
                            </p>
                          </div>
                        )}

                        {priceData?.predictions?.bestTimeThisSell && (
                          <div className="border-t pt-4 bg-green-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Zap className="h-4 w-4 text-green-600" />
                              <span className="font-medium text-green-800">Buying Opportunity</span>
                            </div>
                            <p className="text-sm text-green-700">
                              {priceData.predictions.bestTimeThisSell.reasoning}
                            </p>
                            <p className="text-sm font-medium text-green-800">
                              Potential savings: ${priceData.predictions.bestTimeThisSell.savingsOpportunity}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-orange-600" />
                    Price History Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {priceData?.analytics && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Average Price</p>
                          <p className="text-lg font-semibold">${priceData.analytics.avgPrice}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Lowest Price</p>
                          <p className="text-lg font-semibold text-green-600">${priceData.analytics.lowestPrice}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Highest Price</p>
                          <p className="text-lg font-semibold text-red-600">${priceData.analytics.highestPrice}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Volatility</p>
                          <Badge variant="outline">{priceData.analytics.volatility}</Badge>
                        </div>
                      </div>
                      <div className="pt-4 border-t">
                        <p className="text-sm text-gray-600 mb-1">Current Trend</p>
                        <Badge className="bg-blue-100 text-blue-800">
                          {priceData.analytics.trend}
                        </Badge>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Optimal Timing Tab */}
          <TabsContent value="timing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-600" />
                  Smart Shopping Timing
                </CardTitle>
                <p className="text-gray-600">
                  AI-powered insights on when to buy for maximum savings
                </p>
              </CardHeader>
              <CardContent>
                {loadingTiming ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {timingData?.timingIntelligence?.personalizedTiming && (
                      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-l-blue-500">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="h-5 w-5 text-blue-600" />
                          <h3 className="font-semibold text-blue-900">Personalized Recommendation</h3>
                        </div>
                        <p className="text-blue-800 mb-2">
                          {timingData.timingIntelligence.personalizedTiming.suggestion}
                        </p>
                        <div className="flex items-center gap-4">
                          <Badge className="bg-blue-100 text-blue-800">
                            {Math.round(timingData.timingIntelligence.personalizedTiming.confidence * 100)}% Confidence
                          </Badge>
                          <span className="text-sm font-medium text-blue-900">
                            {timingData.timingIntelligence.personalizedTiming.potentialSavings}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold mb-3">Upcoming Sales Events</h3>
                        <div className="space-y-3">
                          {timingData?.timingIntelligence?.upcomingDeals?.map((deal: any, index: number) => (
                            <Card key={index} className="border-l-4 border-l-orange-500">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-1">{deal.event}</h4>
                                <p className="text-sm text-gray-600 mb-2">{deal.dates}</p>
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {deal.categories.map((cat: string) => (
                                    <Badge key={cat} variant="outline" className="text-xs">
                                      {cat}
                                    </Badge>
                                  ))}
                                </div>
                                <p className="text-sm font-medium text-green-600">
                                  Expected Savings: {deal.expectedSavings}
                                </p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-3">Optimal Shopping Times</h3>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Best Days</p>
                            <div className="flex gap-2">
                              {timingData?.timingIntelligence?.bestDaysToShop?.map((day: string) => (
                                <Badge key={day} className="bg-green-100 text-green-800">
                                  {day}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Best Times</p>
                            <div className="space-y-1">
                              {timingData?.timingIntelligence?.bestTimes?.map((time: string) => (
                                <p key={time} className="text-sm font-medium">{time}</p>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Market Analysis Tab */}
          <TabsContent value="competitors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-red-600" />
                  Competitive Price Analysis
                </CardTitle>
                <p className="text-gray-600">
                  Real-time price comparison across major retailers
                </p>
              </CardHeader>
              <CardContent>
                {loadingCompetitors ? (
                  <div className="animate-pulse space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-16 bg-gray-200 rounded" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <p className="text-sm text-gray-600">Product</p>
                        <p className="font-semibold">{competitorData?.competitorData?.productName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Market Position</p>
                        <Badge variant="outline">{competitorData?.competitorData?.marketPosition}</Badge>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {competitorData?.competitorData?.competitors?.map((comp: CompetitorPrice, index: number) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="font-medium">{comp.retailer}</p>
                              <p className="text-sm text-gray-600">{comp.availability}</p>
                            </div>
                            <div>
                              <p className="text-lg font-bold">${comp.price.toFixed(2)}</p>
                              <p className="text-xs text-gray-500">{comp.shipping}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            {comp.priceAdvantage > 0 ? (
                              <Badge className="bg-green-100 text-green-800">
                                +${comp.priceAdvantage.toFixed(2)}
                              </Badge>
                            ) : comp.priceAdvantage < 0 ? (
                              <Badge className="bg-red-100 text-red-800">
                                ${comp.priceAdvantage.toFixed(2)}
                              </Badge>
                            ) : (
                              <Badge variant="outline">Equal</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {competitorData?.competitorData?.recommendation && (
                      <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-l-yellow-500 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-5 w-5 text-yellow-600" />
                          <h3 className="font-semibold text-yellow-900">Market Recommendation</h3>
                        </div>
                        <p className="text-yellow-800 mb-2">
                          {competitorData.competitorData.recommendation.action}
                        </p>
                        <p className="text-sm text-yellow-700">
                          {competitorData.competitorData.recommendation.reasoning}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Smart Bundles Tab */}
          <TabsContent value="bundles" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package2 className="h-5 w-5 text-purple-600" />
                  AI-Powered Bundle Suggestions
                </CardTitle>
                <p className="text-gray-600">
                  Intelligent product combinations for maximum value and utility
                </p>
              </CardHeader>
              <CardContent>
                {loadingBundles ? (
                  <div className="animate-pulse space-y-4">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="h-32 bg-gray-200 rounded" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {bundleData?.suggestedBundles?.map((bundle: any, index: number) => (
                      <Card key={index} className="border-l-4 border-l-purple-500">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-lg mb-2">{bundle.name}</h3>
                              <p className="text-sm text-gray-600 mb-3">{bundle.reasoning}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500 line-through">
                                ${bundle.totalPrice?.toFixed(2)}
                              </p>
                              <p className="text-xl font-bold text-[hsl(183,100%,23%)]">
                                ${bundle.bundlePrice?.toFixed(2)}
                              </p>
                              <Badge className="bg-green-100 text-green-800">
                                Save ${bundle.savings?.toFixed(2)}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            {bundle.items?.map((item: any, itemIndex: number) => (
                              <div key={itemIndex} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                                <span className="text-sm">{item.name}</span>
                                <span className="text-sm font-medium">${item.price?.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                          
                          <Button className="w-full">
                            Add Bundle to Cart
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default IntelligentWishlist;