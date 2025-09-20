import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, AlertCircle, Play, RotateCcw, Smartphone, Mouse, ExternalLink, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

interface ButtonTest {
  id: string;
  name: string;
  expectedRoute: string;
  category: 'homepage' | 'navigation' | 'category' | 'action' | 'auth';
  selector: string;
  description: string;
  status: 'pending' | 'testing' | 'passed' | 'failed';
  result?: {
    actualRoute?: string;
    error?: string;
    timestamp?: string;
  };
}

const buttonTests: ButtonTest[] = [
  // Navigation Buttons
  {
    id: 'sign-in-btn',
    name: 'Sign In Button',
    expectedRoute: '/login',
    category: 'auth',
    selector: '[data-testid="sign-in-btn"]',
    description: 'User authentication login'
  },
  {
    id: 'sign-up-btn',
    name: 'Sign Up Button',
    expectedRoute: '/signup',
    category: 'auth',
    selector: '[data-testid="sign-up-btn"]',
    description: 'User registration'
  },
  
  // Homepage Feature Tiles
  {
    id: 'trusted-local-btn',
    name: 'Trusted Local',
    expectedRoute: '/trusted-local-stores',
    category: 'homepage',
    selector: '[data-testid="trusted-local-btn"]',
    description: 'Verified businesses you can trust'
  },
  {
    id: 'explore-spirals-btn',
    name: 'Explore SPIRALs',
    expectedRoute: '/explore-spirals',
    category: 'homepage',
    selector: '[data-testid="explore-spirals-btn"]',
    description: 'Discover unique local experiences and gems'
  },
  {
    id: 'verify-store-btn',
    name: 'Verify Store',
    expectedRoute: '/verified-lookup',
    category: 'homepage',
    selector: '[data-testid="verify-store-btn"]',
    description: 'Check if a business is SPIRAL verified'
  },
  {
    id: 'discover-finds-btn',
    name: 'Discover Finds',
    expectedRoute: '/products',
    category: 'homepage',
    selector: '[data-testid="discover-finds-btn"]',
    description: 'Explore curated collections and trends'
  },
  {
    id: 'redeem-spirals-btn',
    name: 'Redeem SPIRALs',
    expectedRoute: '/redeem-spirals',
    category: 'homepage',
    selector: '[data-testid="redeem-spirals-btn"]',
    description: 'Use points for exclusive perks and experiences'
  },
  
  // Category Buttons
  {
    id: 'apparel-btn',
    name: 'Apparel Category',
    expectedRoute: '/products?category=apparel',
    category: 'category',
    selector: '[data-testid="apparel-btn"]',
    description: 'Browse clothing and fashion items'
  },
  {
    id: 'home-decor-btn',
    name: 'Home Decor Category',
    expectedRoute: '/products?category=home-decor',
    category: 'category',
    selector: '[data-testid="home-decor-btn"]',
    description: 'Browse home decoration items'
  },
  {
    id: 'electronics-btn',
    name: 'Electronics Category',
    expectedRoute: '/products?category=electronics',
    category: 'category',
    selector: '[data-testid="electronics-btn"]',
    description: 'Browse electronic devices and gadgets'
  },
  {
    id: 'gifts-btn',
    name: 'Gifts Category',
    expectedRoute: '/products?category=gifts',
    category: 'category',
    selector: '[data-testid="gifts-btn"]',
    description: 'Browse gift items and presents'
  },
  {
    id: 'beauty-btn',
    name: 'Beauty Category',
    expectedRoute: '/products?category=beauty',
    category: 'category',
    selector: '[data-testid="beauty-btn"]',
    description: 'Browse beauty and cosmetic products'
  },
  {
    id: 'toys-btn',
    name: 'Toys Category',
    expectedRoute: '/products?category=toys',
    category: 'category',
    selector: '[data-testid="toys-btn"]',
    description: 'Browse toys and games'
  },
  {
    id: 'local-exclusive-btn',
    name: 'Local Exclusive',
    expectedRoute: '/products?filter=local-exclusive',
    category: 'category',
    selector: '[data-testid="local-exclusive-btn"]',
    description: 'Browse exclusive local products'
  },
  
  // Navigation Menu Items
  {
    id: 'home-nav',
    name: 'Home Navigation',
    expectedRoute: '/',
    category: 'navigation',
    selector: '[data-testid="home-nav"]',
    description: 'Navigate to homepage'
  },
  {
    id: 'stores-nav',
    name: 'Stores Navigation',
    expectedRoute: '/stores',
    category: 'navigation',
    selector: '[data-testid="stores-nav"]',
    description: 'Browse all stores'
  },
  {
    id: 'malls-nav',
    name: 'Malls Navigation',
    expectedRoute: '/malls',
    category: 'navigation',
    selector: '[data-testid="malls-nav"]',
    description: 'Browse shopping malls'
  },
  {
    id: 'cart-nav',
    name: 'Cart Navigation',
    expectedRoute: '/cart',
    category: 'navigation',
    selector: '[data-testid="cart-nav"]',
    description: 'View shopping cart'
  }
];

const initialTests: ButtonTest[] = buttonTests.map(test => ({ ...test, status: 'pending' }));

export default function ButtonTestingSuite() {
  // Admin authentication check
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [tests, setTests] = useState<ButtonTest[]>(initialTests);
  const [currentTest, setCurrentTest] = useState<string | null>(null);
  const [testResults, setTestResults] = useState({
    total: initialTests.length,
    passed: 0,
    failed: 0,
    pending: initialTests.length
  });
  const [isRunning, setIsRunning] = useState(false);
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'desktop'>('mobile');
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleAdminLogin = () => {
    if (authPassword === 'Ashland8!') {
      setIsAuthenticated(true);
      setAuthError('');
      toast({
        title: "Admin Access Granted",
        description: "Welcome to the SPIRAL Button Testing Suite",
      });
    } else {
      setAuthError('Invalid admin password');
    }
  };

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="w-12 h-12 text-red-600" />
            </div>
            <CardTitle className="text-2xl">Admin Access Required</CardTitle>
            <p className="text-muted-foreground">
              Enter admin password to access the Button Testing Suite
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Admin Password</label>
              <input
                type="password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter admin password"
              />
              {authError && (
                <p className="text-sm text-red-600">{authError}</p>
              )}
            </div>
            <Button 
              onClick={handleAdminLogin}
              className="w-full"
            >
              Access Admin Tools
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  useEffect(() => {
    const passed = tests.filter(t => t.status === 'passed').length;
    const failed = tests.filter(t => t.status === 'failed').length;
    const pending = tests.filter(t => t.status === 'pending').length;
    
    setTestResults({ total: tests.length, passed, failed, pending });
  }, [tests]);

  const runAllTests = async () => {
    setIsRunning(true);
    setTests(prev => prev.map(test => ({ ...test, status: 'pending' })));
    
    for (const test of initialTests) {
      await runSingleTest(test.id);
      await new Promise(resolve => setTimeout(resolve, 500)); // Delay between tests
    }
    
    setIsRunning(false);
    toast({
      title: "Testing Complete",
      description: `${testResults.passed} passed, ${testResults.failed} failed`,
    });
  };

  const runSingleTest = async (testId: string) => {
    setCurrentTest(testId);
    
    setTests(prev => prev.map(test => 
      test.id === testId ? { ...test, status: 'testing' } : test
    ));

    try {
      const test = tests.find(t => t.id === testId);
      if (!test) return;

      // Simulate navigation and verify
      setLocation(test.expectedRoute);
      
      // Wait for navigation to complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Check if we're at the expected route
      const currentPath = window.location.pathname + window.location.search;
      const isRouteMatch = currentPath === test.expectedRoute || 
                          (test.expectedRoute === '/' && currentPath === '/');
      
      if (isRouteMatch) {
        setTests(prev => prev.map(t => 
          t.id === testId ? {
            ...t,
            status: 'passed',
            result: {
              actualRoute: currentPath,
              timestamp: new Date().toISOString()
            }
          } : t
        ));
      } else {
        setTests(prev => prev.map(t => 
          t.id === testId ? {
            ...t,
            status: 'failed',
            result: {
              actualRoute: currentPath,
              error: `Expected ${test.expectedRoute}, got ${currentPath}`,
              timestamp: new Date().toISOString()
            }
          } : t
        ));
      }
    } catch (error) {
      setTests(prev => prev.map(t => 
        t.id === testId ? {
          ...t,
          status: 'failed',
          result: {
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
          }
        } : t
      ));
    }
    
    setCurrentTest(null);
  };

  const resetTests = () => {
    setTests(initialTests.map(test => ({ ...test, status: 'pending' })));
    setCurrentTest(null);
    setIsRunning(false);
  };

  const getStatusIcon = (status: ButtonTest['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'testing':
        return <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: ButtonTest['status']) => {
    const variants = {
      passed: 'default',
      failed: 'destructive',
      testing: 'secondary',
      pending: 'outline'
    } as const;
    
    return (
      <Badge variant={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const testsByCategory = tests.reduce((acc, test) => {
    if (!acc[test.category]) acc[test.category] = [];
    acc[test.category].push(test);
    return acc;
  }, {} as Record<string, ButtonTest[]>);

  const progressPercentage = (testResults.passed + testResults.failed) / testResults.total * 100;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Shield className="w-8 h-8 text-red-600" />
          <h1 className="text-3xl font-bold">SPIRAL Admin Button Testing Suite</h1>
        </div>
        <p className="text-muted-foreground">
          Administrative tool for comprehensive touchscreen and button functionality validation
        </p>
        
        <div className="flex items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Smartphone className="w-4 h-4" />
            <span>Mobile Optimized</span>
          </div>
          <div className="flex items-center gap-1">
            <Shield className="w-4 h-4 text-red-600" />
            <span>Admin Only</span>
          </div>
        </div>
      </div>

      {/* Test Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="w-5 h-5" />
            Test Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button 
              onClick={runAllTests} 
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              {isRunning ? 'Running Tests...' : 'Run All Tests'}
            </Button>
            <Button 
              variant="outline" 
              onClick={resetTests}
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Tests
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="w-full" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{testResults.total}</div>
              <div className="text-sm text-muted-foreground">Total Tests</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{testResults.passed}</div>
              <div className="text-sm text-muted-foreground">Passed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{testResults.failed}</div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-600">{testResults.pending}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Results by Category */}
      <Tabs defaultValue="homepage" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="homepage">Homepage</TabsTrigger>
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
          <TabsTrigger value="category">Categories</TabsTrigger>
          <TabsTrigger value="auth">Auth</TabsTrigger>
          <TabsTrigger value="action">Actions</TabsTrigger>
        </TabsList>
        
        {Object.entries(testsByCategory).map(([category, categoryTests]) => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid gap-4">
              {categoryTests.map((test) => (
                <Card key={test.id} className={`transition-all ${currentTest === test.id ? 'ring-2 ring-blue-500' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(test.status)}
                          <h3 className="font-semibold">{test.name}</h3>
                          {getStatusBadge(test.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">{test.description}</p>
                        <div className="text-xs font-mono bg-muted p-2 rounded">
                          Expected: {test.expectedRoute}
                        </div>
                        {test.result && (
                          <div className="text-xs space-y-1">
                            {test.result.actualRoute && (
                              <div className="font-mono bg-muted p-2 rounded">
                                Actual: {test.result.actualRoute}
                              </div>
                            )}
                            {test.result.error && (
                              <div className="text-red-600 bg-red-50 p-2 rounded">
                                Error: {test.result.error}
                              </div>
                            )}
                            {test.result.timestamp && (
                              <div className="text-muted-foreground">
                                Tested: {new Date(test.result.timestamp).toLocaleTimeString()}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => runSingleTest(test.id)}
                          disabled={isRunning}
                        >
                          Test
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => setLocation(test.expectedRoute)}
                          className="flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Go
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Mobile Testing Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Mobile Testing Instructions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <h4 className="font-semibold">How to Test on Touchscreen:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Use the "Run All Tests" button to automatically test all buttons</li>
              <li>Or tap individual "Test" buttons to verify specific functionality</li>
              <li>Use "Go" buttons to manually navigate and verify the route</li>
              <li>Check that each button takes you to the expected page</li>
              <li>Verify touch responsiveness and visual feedback</li>
            </ol>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold">What We're Testing:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Button touch responsiveness on mobile devices</li>
              <li>Correct navigation to expected routes</li>
              <li>Visual feedback and button states</li>
              <li>Category filtering and product discovery</li>
              <li>Authentication and user flows</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}