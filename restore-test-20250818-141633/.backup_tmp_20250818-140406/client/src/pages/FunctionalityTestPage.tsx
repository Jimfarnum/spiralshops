import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Zap, 
  Settings, 
  Database,
  ShoppingCart,
  CreditCard,
  Users,
  Search,
  Star
} from 'lucide-react';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'pass' | 'fail';
  endpoint?: string;
  responseTime?: number;
  error?: string;
}

export default function FunctionalityTestPage() {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [summary, setSummary] = useState({ total: 0, passed: 0, failed: 0 });

  const testSuites = [
    {
      category: 'Core APIs',
      icon: <Database className="w-5 h-5" />,
      tests: [
        { name: 'Health Check', endpoint: '/api/check' },
        { name: 'Products API', endpoint: '/api/products' },
        { name: 'Stores API', endpoint: '/api/stores' },
        { name: 'Featured Products', endpoint: '/api/products/featured' },
        { name: 'Categories', endpoint: '/api/categories' },
        { name: 'Mall Events', endpoint: '/api/mall-events' },
        { name: 'Promotions', endpoint: '/api/promotions' }
      ]
    },
    {
      category: 'Search & Discovery',
      icon: <Search className="w-5 h-5" />,
      tests: [
        { name: 'Product Search', endpoint: '/api/search?q=wireless' },
        { name: 'Recommendations', endpoint: '/api/recommend' },
        { name: 'Smart Search', endpoint: '/api/ai/smart-search' }
      ]
    },
    {
      category: 'E-Commerce',
      icon: <ShoppingCart className="w-5 h-5" />,
      tests: [
        { name: 'Cart Operations', endpoint: '/api/cart' },
        { name: 'Wishlist', endpoint: '/api/wishlist' },
        { name: 'Inventory', endpoint: '/api/inventory' }
      ]
    },
    {
      category: 'Payment System',
      icon: <CreditCard className="w-5 h-5" />,
      tests: [
        { name: 'Payment Methods', endpoint: '/api/payment-methods' },
        { name: 'Payment Intent', endpoint: '/api/create-payment-intent' }
      ]
    },
    {
      category: 'User Management',
      icon: <Users className="w-5 h-5" />,
      tests: [
        { name: 'SPIRAL Points', endpoint: '/api/loyalty/points' },
        { name: 'User Profile', endpoint: '/api/user/profile' },
        { name: 'User Preferences', endpoint: '/api/user/preferences' }
      ]
    }
  ];

  const runTest = async (test: TestResult): Promise<TestResult> => {
    try {
      const startTime = Date.now();
      const response = await fetch(test.endpoint!, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const endTime = Date.now();
      
      return {
        ...test,
        status: response.ok ? 'pass' : 'fail',
        responseTime: endTime - startTime,
        error: response.ok ? undefined : `HTTP ${response.status}`
      };
    } catch (error) {
      return {
        ...test,
        status: 'fail',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setProgress(0);
    
    const allTests = testSuites.flatMap(suite => 
      suite.tests.map(test => ({ ...test, status: 'pending' as const }))
    );
    
    setTests(allTests);
    setSummary({ total: allTests.length, passed: 0, failed: 0 });

    let completedTests = 0;
    const results: TestResult[] = [];

    for (const test of allTests) {
      // Update test status to running
      setTests(prev => prev.map(t => 
        t.name === test.name ? { ...t, status: 'running' } : t
      ));

      const result = await runTest(test);
      results.push(result);
      completedTests++;

      // Update test with result
      setTests(prev => prev.map(t => 
        t.name === test.name ? result : t
      ));

      // Update progress
      setProgress((completedTests / allTests.length) * 100);

      // Small delay to show progress
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Calculate final summary
    const passed = results.filter(r => r.status === 'pass').length;
    const failed = results.filter(r => r.status === 'fail').length;
    setSummary({ total: allTests.length, passed, failed });
    
    setIsRunning(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'fail':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'running':
        return <div className="w-4 h-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'pass':
        return <Badge className="bg-green-100 text-green-800">PASS</Badge>;
      case 'fail':
        return <Badge variant="destructive">FAIL</Badge>;
      case 'running':
        return <Badge className="bg-blue-100 text-blue-800">RUNNING</Badge>;
      default:
        return <Badge variant="secondary">PENDING</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">SPIRAL Functionality Test Suite</h1>
        <p className="text-gray-600">Comprehensive testing for 100% seamless operation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Passed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{summary.passed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{summary.failed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.total > 0 ? Math.round((summary.passed / summary.total) * 100) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Test Progress</h2>
          <Button 
            onClick={runAllTests} 
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            {isRunning ? (
              <>
                <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Running Tests...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Run All Tests
              </>
            )}
          </Button>
        </div>
        <Progress value={progress} className="w-full" />
      </div>

      {summary.total > 0 && (
        <Alert className="mb-6">
          {summary.failed === 0 ? (
            <>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>All tests passed!</strong> SPIRAL platform is operating at 100% functionality 
                with seamless user experience across all features.
              </AlertDescription>
            </>
          ) : (
            <>
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>{summary.failed} test(s) failed.</strong> Some functionality issues detected 
                that may impact user experience.
              </AlertDescription>
            </>
          )}
        </Alert>
      )}

      <div className="space-y-6">
        {testSuites.map((suite, suiteIndex) => (
          <Card key={suiteIndex}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {suite.icon}
                {suite.category}
              </CardTitle>
              <CardDescription>
                Testing {suite.tests.length} endpoints in this category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {suite.tests.map((test, testIndex) => {
                  const result = tests.find(t => t.name === test.name);
                  return (
                    <div key={testIndex} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(result?.status || 'pending')}
                        <div>
                          <div className="font-medium">{test.name}</div>
                          <div className="text-sm text-gray-600">{test.endpoint}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {result?.responseTime && (
                          <span className="text-xs text-gray-500">
                            {result.responseTime}ms
                          </span>
                        )}
                        {result?.error && (
                          <span className="text-xs text-red-600">
                            {result.error}
                          </span>
                        )}
                        {getStatusBadge(result?.status || 'pending')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}