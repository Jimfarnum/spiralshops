import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Brain,
  Search,
  MessageSquare,
  TrendingUp,
  Zap,
  Clock,
  Target,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GPTResponse {
  id: string;
  message?: string;
  content?: string;
  confidence?: number;
  aiSummary?: string;
  recommendations?: string[];
  metadata?: any;
}

export default function GPTIntegrationDemo() {
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('smart-search');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<GPTResponse | null>(null);
  
  // Smart Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  
  // Business Insights State
  const [businessType, setBusinessType] = useState('');
  const [timeframe, setTimeframe] = useState('30days');
  
  // Customer Support State
  const [supportMessage, setSupportMessage] = useState('');
  const [supportContext, setSupportContext] = useState('');

  const handleSmartSearch = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gpt/smart-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          location: searchLocation,
          category: searchCategory
        })
      });
      
      const data = await res.json();
      setResponse(data);
      
      toast({
        title: "Smart Search Complete",
        description: `Found ${data.totalResults} results in ${data.searchTime}`,
      });
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "Unable to complete smart search",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const handleBusinessInsights = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gpt/business-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessType,
          timeframe,
          metrics: { revenue: 50000, customers: 1200, orders: 450 }
        })
      });
      
      const data = await res.json();
      setResponse(data);
      
      toast({
        title: "Insights Generated",
        description: `${data.aiInsights?.length || 0} actionable insights discovered`,
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to generate business insights",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const handleSupportAssistant = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gpt/support-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: supportMessage,
          context: supportContext,
          userId: 'demo-user'
        })
      });
      
      const data = await res.json();
      setResponse(data);
      
      toast({
        title: "Support Response Ready",
        description: `Response generated with ${data.confidence}% confidence`,
      });
    } catch (error) {
      toast({
        title: "Support Failed",
        description: "Unable to generate support response",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--spiral-navy)] mb-2 flex items-center">
            <Brain className="h-8 w-8 mr-3" />
            SPIRAL GPT Integration
          </h1>
          <p className="text-gray-600">
            Advanced AI-powered features for enhanced shopping and business intelligence
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="smart-search" className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <span>Smart Search</span>
            </TabsTrigger>
            <TabsTrigger value="business-insights" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Business Insights</span>
            </TabsTrigger>
            <TabsTrigger value="customer-support" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>AI Support</span>
            </TabsTrigger>
          </TabsList>

          {/* Smart Search Tab */}
          <TabsContent value="smart-search">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Search className="h-5 w-5 mr-2" />
                    AI-Powered Search
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Search Query</label>
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Find the best coffee shops with WiFi..."
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Location</label>
                    <Input
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      placeholder="Downtown Minneapolis, MN"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <Select value={searchCategory} onValueChange={setSearchCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="food">Food & Dining</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="services">Services</SelectItem>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="health">Health & Wellness</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    onClick={handleSmartSearch}
                    disabled={loading || !searchQuery}
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        AI Smart Search
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {response && 'aiSummary' in response && (
                <Card>
                  <CardHeader>
                    <CardTitle>Search Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Alert className="mb-4">
                      <Brain className="h-4 w-4" />
                      <AlertDescription>
                        {response.aiSummary}
                      </AlertDescription>
                    </Alert>
                    
                    <div className="space-y-3">
                      {(response as any).recommendations?.map((rec: any, index: number) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{rec.name}</h4>
                            <Badge className="bg-green-100 text-green-800">
                              {rec.aiMatch}% match
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                          <div className="flex space-x-3 text-xs text-gray-500">
                            <span>⭐ {rec.rating}</span>
                            <span>📍 {rec.distance}</span>
                            <span>🏷️ {rec.category}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Business Insights Tab */}
          <TabsContent value="business-insights">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Business Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Business Type</label>
                    <Select value={businessType} onValueChange={setBusinessType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="restaurant">Restaurant</SelectItem>
                        <SelectItem value="retail">Retail Store</SelectItem>
                        <SelectItem value="electronics">Electronics Shop</SelectItem>
                        <SelectItem value="services">Service Business</SelectItem>
                        <SelectItem value="health">Health & Wellness</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Analysis Timeframe</label>
                    <Select value={timeframe} onValueChange={setTimeframe}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7days">Last 7 Days</SelectItem>
                        <SelectItem value="30days">Last 30 Days</SelectItem>
                        <SelectItem value="90days">Last 3 Months</SelectItem>
                        <SelectItem value="1year">Last Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    onClick={handleBusinessInsights}
                    disabled={loading || !businessType}
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Generate AI Insights
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {response && 'aiInsights' in response && (
                <Card>
                  <CardHeader>
                    <CardTitle>AI Business Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {(response as any).aiInsights?.map((insight: any, index: number) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{insight.category}</h4>
                            <div className="flex items-center space-x-2">
                              <Badge className={
                                insight.impact === 'high' ? 'bg-red-100 text-red-800' :
                                insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                              }>
                                {insight.impact}
                              </Badge>
                              <span className="text-xs text-gray-500">{insight.confidence}%</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{insight.insight}</p>
                          {insight.actionable && (
                            <div className="flex items-center text-xs text-green-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Actionable
                            </div>
                          )}
                        </div>
                      ))}
                      
                      <div className="mt-4 pt-4 border-t">
                        <h5 className="font-medium mb-2">Recommendations:</h5>
                        <ul className="space-y-1">
                          {(response as any).recommendations?.map((rec: string, index: number) => (
                            <li key={index} className="text-sm text-gray-600 flex items-center">
                              <Target className="h-3 w-3 mr-2 text-blue-500" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Customer Support Tab */}
          <TabsContent value="customer-support">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    AI Customer Support
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Customer Message</label>
                    <Textarea
                      value={supportMessage}
                      onChange={(e) => setSupportMessage(e.target.value)}
                      placeholder="I'm having trouble with my order delivery..."
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Additional Context</label>
                    <Input
                      value={supportContext}
                      onChange={(e) => setSupportContext(e.target.value)}
                      placeholder="Order #12345, SPIRAL member since 2023"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleSupportAssistant}
                    disabled={loading || !supportMessage}
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Generate AI Response
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {response && 'message' in response && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      AI Support Response
                      <Badge className="bg-blue-100 text-blue-800">
                        {(response as any).confidence}% confidence
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Alert className="mb-4">
                      <MessageSquare className="h-4 w-4" />
                      <AlertDescription>
                        {response.message}
                      </AlertDescription>
                    </Alert>
                    
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium mb-2">Suggested Actions:</h5>
                        <div className="space-y-2">
                          {(response as any).suggestedActions?.map((action: string, index: number) => (
                            <Button key={index} variant="outline" size="sm" className="mr-2 mb-2">
                              {action}
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      {(response as any).escalate && (
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            This issue may require human escalation for optimal resolution.
                          </AlertDescription>
                        </Alert>
                      )}
                      
                      <div className="text-xs text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Response generated in {(response as any).metadata?.responseTime}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}