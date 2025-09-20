import { useState } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';

interface TestResult {
  path: string;
  name: string;
  status: 'pending' | 'success' | 'error';
  message?: string;
  responseTime?: number;
}

export default function NavigationTest() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const testRoutes = [
    { path: '/products', name: 'Shop Local (Products)' },
    { path: '/about-spiral', name: 'Fuel Community (About SPIRAL)' },
    { path: '/loyalty', name: 'Earn SPIRALs (Loyalty Dashboard)' },
    { path: '/spirals', name: 'SPIRALs Page' },
    { path: '/cart', name: 'Shopping Cart' },
    { path: '/mall', name: 'Mall Directory' },
    { path: '/stores', name: 'Store Listings' },
    { path: '/login', name: 'User Login' },
    { path: '/signup', name: 'User Signup' },
    { path: '/retailer-login', name: 'Retailer Login' },
    { path: '/profile-settings', name: 'Profile Settings' },
    { path: '/wishlist', name: 'Wishlist' },
    { path: '/orders', name: 'Orders' },
    { path: '/notifications', name: 'Notifications' }
  ];

  const runNavigationTest = async () => {
    setIsRunning(true);
    setTestResults([]);

    for (const route of testRoutes) {
      const startTime = Date.now();
      setTestResults(prev => [...prev, { 
        ...route, 
        status: 'pending' 
      }]);

      try {
        const response = await fetch(route.path);
        const responseTime = Date.now() - startTime;
        
        if (response.ok) {
          setTestResults(prev => prev.map(result => 
            result.path === route.path 
              ? { 
                  ...result, 
                  status: 'success', 
                  message: `✓ Page loads successfully`,
                  responseTime 
                }
              : result
          ));
        } else {
          setTestResults(prev => prev.map(result => 
            result.path === route.path 
              ? { 
                  ...result, 
                  status: 'error', 
                  message: `✗ HTTP ${response.status}: ${response.statusText}`,
                  responseTime 
                }
              : result
          ));
        }
      } catch (error) {
        const responseTime = Date.now() - startTime;
        setTestResults(prev => prev.map(result => 
          result.path === route.path 
            ? { 
                ...result, 
                status: 'error', 
                message: `✗ Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                responseTime 
              }
            : result
        ));
      }

      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setIsRunning(false);
  };

  const testAPI = async () => {
    const apis = [
      '/api/stores',
      '/api/products', 
      '/api/check',
      '/api/products/featured',
      '/api/mall-events',
      '/api/promotions'
    ];

    console.log('🔍 SPIRAL API Test Results:');
    
    for (const api of apis) {
      try {
        const response = await fetch(api);
        if (response.ok) {
          console.log(`✅ ${api} OK`);
        } else {
          console.log(`❌ ${api} Failed: ${response.status}`);
        }
      } catch (error) {
        console.log(`❌ ${api} Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending': return <Clock className="h-5 w-5 text-yellow-500 animate-spin" />;
      default: return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success': return <Badge className="bg-green-100 text-green-800">Success</Badge>;
      case 'error': return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-800">Testing...</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-800">Ready</Badge>;
    }
  };

  const successCount = testResults.filter(r => r.status === 'success').length;
  const errorCount = testResults.filter(r => r.status === 'error').length;
  const totalTests = testRoutes.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      <Header />
      
      <main className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--spiral-navy)] mb-4">
              🧪 SPIRAL Navigation Test Suite
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Comprehensive testing of all platform navigation and routing
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Button 
                onClick={runNavigationTest}
                disabled={isRunning}
                className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90"
              >
                {isRunning ? 'Running Tests...' : 'Run Navigation Test'}
              </Button>
              
              <Button 
                onClick={testAPI}
                variant="outline"
                className="border-[var(--spiral-navy)] text-[var(--spiral-navy)]"
              >
                Test API Endpoints
              </Button>
            </div>

            {testResults.length > 0 && (
              <div className="flex justify-center gap-8 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{successCount}</div>
                  <div className="text-sm text-gray-600">Passed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">{errorCount}</div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{totalTests}</div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
              </div>
            )}
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5" />
                  Homepage Button Navigation Tests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link to="/products" className="block">
                      <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[var(--spiral-coral)] hover:bg-gray-50 transition-all">
                        <div className="text-2xl mb-2">🛒</div>
                        <h3 className="font-semibold text-[var(--spiral-navy)]">Shop Local</h3>
                        <p className="text-sm text-gray-600">→ /products</p>
                      </div>
                    </Link>

                    <Link to="/about-spiral" className="block">
                      <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[var(--spiral-coral)] hover:bg-gray-50 transition-all">
                        <div className="text-2xl mb-2">🏘️</div>
                        <h3 className="font-semibold text-[var(--spiral-navy)]">Fuel Community</h3>
                        <p className="text-sm text-gray-600">→ /about-spiral</p>
                      </div>
                    </Link>

                    <Link to="/loyalty" className="block">
                      <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[var(--spiral-coral)] hover:bg-gray-50 transition-all">
                        <div className="text-2xl mb-2">🎯</div>
                        <h3 className="font-semibold text-[var(--spiral-navy)]">Earn SPIRALs</h3>
                        <p className="text-sm text-gray-600">→ /loyalty</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Automated Test Results</CardTitle>
              </CardHeader>
              <CardContent>
                {testResults.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Click "Run Navigation Test" to start testing all routes
                  </div>
                ) : (
                  <div className="space-y-3">
                    {testResults.map((result, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(result.status)}
                          <div>
                            <div className="font-medium">{result.name}</div>
                            <div className="text-sm text-gray-600">{result.path}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {result.responseTime && (
                            <span className="text-xs text-gray-500">
                              {result.responseTime}ms
                            </span>
                          )}
                          {getStatusBadge(result.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Navigation Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {testRoutes.map((route) => (
                    <Link key={route.path} to={route.path}>
                      <Button variant="outline" className="w-full text-xs">
                        {route.name}
                      </Button>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}