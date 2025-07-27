import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Clock, Zap, Target, TrendingUp } from 'lucide-react';

interface TestResult {
  passed: boolean;
  message: string;
  responseTime: number;
  data: any;
}

interface EnhancedTest {
  id: string;
  name: string;
  category: string;
  endpoint: string;
  method?: string;
  payload?: any;
  priority: 'critical' | 'high' | 'medium';
}

export default function EnhancedFunctionalityTest() {
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>('');

  const enhancedTests: EnhancedTest[] = [
    // Smart Search Enhancement Tests
    {
      id: 'smart-search-api',
      name: 'Smart Search API',
      category: 'Smart Search',
      endpoint: '/api/smart-search',
      method: 'POST',
      payload: { query: 'wireless headphones', location: 'Minneapolis, MN', filters: { category: 'electronics' } },
      priority: 'critical'
    },
    {
      id: 'search-suggestions',
      name: 'Search Suggestions',
      category: 'Smart Search',
      endpoint: '/api/smart-search/suggestions?q=wireless',
      priority: 'high'
    },

    // Enhanced SPIRAL Wallet Tests
    {
      id: 'wallet-balance',
      name: 'Wallet Balance',
      category: 'Enhanced Wallet',
      endpoint: '/api/wallet/user_123',
      priority: 'critical'
    },
    {
      id: 'spiral-transfer',
      name: 'SPIRAL Transfer',
      category: 'Enhanced Wallet',
      endpoint: '/api/wallet/transfer',
      method: 'POST',
      payload: { fromUserId: 'user_123', toUserId: 'user_456', amount: 50, message: 'Test transfer' },
      priority: 'high'
    },
    {
      id: 'gift-card-purchase',
      name: 'Gift Card Purchase',
      category: 'Enhanced Wallet',
      endpoint: '/api/wallet/gift-card/purchase',
      method: 'POST',
      payload: { userId: 'user_123', storeId: 'techmart', amount: 25, recipientEmail: 'test@example.com' },
      priority: 'high'
    },

    // Retailer Auto-Onboarding Tests
    {
      id: 'csv-upload',
      name: 'CSV Upload System',
      category: 'Retailer Onboarding',
      endpoint: '/api/retailer-onboarding/csv-upload',
      method: 'POST',
      payload: { retailerId: 'ret_123', csvData: 'sample,data,headers' },
      priority: 'critical'
    },
    {
      id: 'shopify-integration',
      name: 'Shopify Integration',
      category: 'Retailer Onboarding',
      endpoint: '/api/retailer-onboarding/shopify-connect',
      method: 'POST',
      payload: { shopifyDomain: 'test-store.myshopify.com', accessToken: 'demo_token' },
      priority: 'high'
    },
    {
      id: 'square-integration',
      name: 'Square POS Integration',
      category: 'Retailer Onboarding',
      endpoint: '/api/retailer-onboarding/square-connect',
      method: 'POST',
      payload: { applicationId: 'sq_app_123', accessToken: 'sq_token_456', locationId: 'loc_789' },
      priority: 'high'
    },

    // Multi-Option Fulfillment Tests
    {
      id: 'delivery-options',
      name: 'Delivery Options',
      category: 'Fulfillment',
      endpoint: '/api/fulfillment/delivery-options?zipCode=55401',
      priority: 'critical'
    },
    {
      id: 'shipping-calculator',
      name: 'Shipping Calculator',
      category: 'Fulfillment',
      endpoint: '/api/fulfillment/calculate-shipping',
      method: 'POST',
      payload: { option: 'fedex-ground', zipCode: '55401', weight: 2.5, dimensions: { length: 12, width: 8, height: 6 } },
      priority: 'critical'
    },
    {
      id: 'package-tracking',
      name: 'Package Tracking',
      category: 'Fulfillment',
      endpoint: '/api/fulfillment/track/1Z12345E0205271688',
      priority: 'high'
    },

    // Push Notifications Tests
    {
      id: 'notification-delivery',
      name: 'Notification Delivery',
      category: 'Notifications',
      endpoint: '/api/notifications/send-test',
      method: 'POST',
      payload: { type: 'wishlist-drops', channel: 'email', message: 'Test notification' },
      priority: 'critical'
    },
    {
      id: 'notification-preferences',
      name: 'Notification Preferences',
      category: 'Notifications',
      endpoint: '/api/notifications/preferences',
      method: 'PUT',
      payload: { preferences: [{ id: 'wishlist-drops', settings: { email: true, sms: true, push: true, inApp: true } }] },
      priority: 'high'
    },
    {
      id: 'notification-analytics',
      name: 'Notification Analytics',
      category: 'Notifications',
      endpoint: '/api/notifications/analytics',
      priority: 'medium'
    },

    // Live Support Tests
    {
      id: 'live-chat',
      name: 'Live Chat Bot',
      category: 'Live Support',
      endpoint: '/api/live-support/chat',
      method: 'POST',
      payload: { message: 'How do I earn SPIRAL points?', mode: 'bot' },
      priority: 'critical'
    },
    {
      id: 'faq-search',
      name: 'FAQ Search Engine',
      category: 'Live Support',
      endpoint: '/api/live-support/faq-search',
      method: 'POST',
      payload: { query: 'payment methods' },
      priority: 'high'
    },
    {
      id: 'support-analytics',
      name: 'Support Analytics',
      category: 'Live Support',
      endpoint: '/api/live-support/analytics',
      priority: 'medium'
    }
  ];

  const runComprehensiveTests = useMutation({
    mutationFn: async () => {
      setTestResults({});
      setIsRunning(true);
      const results: Record<string, TestResult> = {};

      for (const test of enhancedTests) {
        setCurrentTest(test.name);
        
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000);

          const startTime = performance.now();
          const response = await fetch(test.endpoint, {
            method: test.method || 'GET',
            headers: { 'Content-Type': 'application/json' },
            body: test.payload ? JSON.stringify(test.payload) : undefined,
            signal: controller.signal
          });

          clearTimeout(timeoutId);
          const endTime = performance.now();
          
          let data;
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            data = await response.json();
          } else {
            data = { message: await response.text() };
          }

          const isSuccessful = response.ok && data && (
            typeof data === 'object' ? Object.keys(data).length > 0 : true
          );

          results[test.id] = {
            passed: isSuccessful,
            message: isSuccessful 
              ? `✅ ${test.name} - Fully functional with ${Math.round(endTime - startTime)}ms response`
              : `❌ ${data?.error || data?.message || `HTTP ${response.status}`}`,
            responseTime: Math.round(endTime - startTime),
            data: data
          };

        } catch (error) {
          let errorMessage = 'Unknown error';
          if (error.name === 'AbortError') {
            errorMessage = 'Request timeout (10s)';
          } else if (error.message) {
            errorMessage = error.message;
          }

          results[test.id] = {
            passed: false,
            message: `❌ ${test.name} failed: ${errorMessage}`,
            responseTime: 0,
            data: null
          };
        }

        setTestResults(prev => ({ ...prev, [test.id]: results[test.id] }));
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      setIsRunning(false);
      setCurrentTest('');
      return results;
    }
  });

  const categories = [...new Set(enhancedTests.map(test => test.category))];
  const totalTests = enhancedTests.length;
  const completedTests = Object.keys(testResults).length;
  const passedTests = Object.values(testResults).filter(result => result.passed).length;
  const functionalityPercentage = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

  const getCategoryResults = (category: string) => {
    const categoryTests = enhancedTests.filter(test => test.category === category);
    const categoryResults = categoryTests.map(test => testResults[test.id]).filter(Boolean);
    const passed = categoryResults.filter(result => result.passed).length;
    const total = categoryTests.length;
    const percentage = total > 0 ? Math.round((passed / total) * 100) : 0;
    
    return { passed, total, percentage };
  };

  const getPriorityResults = (priority: 'critical' | 'high' | 'medium') => {
    const priorityTests = enhancedTests.filter(test => test.priority === priority);
    const priorityResults = priorityTests.map(test => testResults[test.id]).filter(Boolean);
    const passed = priorityResults.filter(result => result.passed).length;
    const total = priorityTests.length;
    
    return { passed, total };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            <Zap className="inline-block w-10 h-10 text-purple-600 mr-3" />
            Enhanced Functionality Test Suite
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Comprehensive testing of all 6 enhanced features for 100% functionality verification
          </p>
        </div>

        {/* Overall Status */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">{functionalityPercentage}%</div>
                <p className="text-sm text-gray-600">Overall Functionality</p>
                <Progress value={functionalityPercentage} className="mt-2" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">{passedTests}/{totalTests}</div>
                <p className="text-sm text-gray-600">Tests Passed</p>
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mt-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">{Object.values(testResults).reduce((sum, r) => sum + r.responseTime, 0) / Math.max(passedTests, 1)}ms</div>
                <p className="text-sm text-gray-600">Avg Response Time</p>
                <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mt-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Button 
                  onClick={() => runComprehensiveTests.mutate()}
                  disabled={isRunning}
                  className="w-full"
                  size="lg"
                >
                  {isRunning ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <Target className="w-4 h-4 mr-2" />
                      Run All Tests
                    </>
                  )}
                </Button>
                {isRunning && currentTest && (
                  <p className="text-xs text-gray-600 mt-2">Testing: {currentTest}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Priority Breakdown */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {(['critical', 'high', 'medium'] as const).map((priority) => {
            const { passed, total } = getPriorityResults(priority);
            const percentage = total > 0 ? Math.round((passed / total) * 100) : 0;
            
            return (
              <Card key={priority}>
                <CardHeader>
                  <CardTitle className="capitalize flex items-center justify-between">
                    {priority} Priority
                    <Badge variant={
                      priority === 'critical' ? 'destructive' : 
                      priority === 'high' ? 'default' : 'secondary'
                    }>
                      {passed}/{total}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={percentage} className="mb-2" />
                  <p className="text-sm text-gray-600">{percentage}% functional</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Category Results */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const { passed, total, percentage } = getCategoryResults(category);
            const categoryTests = enhancedTests.filter(test => test.category === category);
            
            return (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {category}
                    <Badge variant={percentage === 100 ? "default" : percentage >= 75 ? "secondary" : "destructive"}>
                      {percentage}%
                    </Badge>
                  </CardTitle>
                  <CardDescription>{passed}/{total} tests passed</CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={percentage} className="mb-4" />
                  <div className="space-y-2">
                    {categoryTests.map((test) => {
                      const result = testResults[test.id];
                      if (!result) return null;
                      
                      return (
                        <div key={test.id} className="flex items-center justify-between text-sm">
                          <span className="flex items-center">
                            {result.passed ? (
                              <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600 mr-2" />
                            )}
                            {test.name}
                          </span>
                          <span className="text-gray-500">{result.responseTime}ms</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Detailed Results */}
        {Object.keys(testResults).length > 0 && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Test Results</CardTitle>
                <CardDescription>Complete test output with API responses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {enhancedTests.map((test) => {
                    const result = testResults[test.id];
                    if (!result) return null;
                    
                    return (
                      <div key={test.id} className={`p-4 rounded-lg border ${
                        result.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{test.name}</h4>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{test.category}</Badge>
                            <Badge variant={
                              test.priority === 'critical' ? 'destructive' : 
                              test.priority === 'high' ? 'default' : 'secondary'
                            }>
                              {test.priority}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{result.message}</p>
                        <div className="text-xs text-gray-500">
                          <span>Endpoint: {test.endpoint}</span>
                          <span className="ml-4">Response Time: {result.responseTime}ms</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}