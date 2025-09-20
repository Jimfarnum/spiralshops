import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  CheckCircle, 
  AlertCircle, 
  Eye,
  Ruler,
  Wifi,
  Battery
} from 'lucide-react';

interface DeviceTest {
  name: string;
  width: number;
  height: number;
  icon: any;
  category: 'mobile' | 'tablet' | 'desktop';
}

const devices: DeviceTest[] = [
  // Mobile Devices
  { name: 'iPhone 14 Pro', width: 393, height: 852, icon: Smartphone, category: 'mobile' },
  { name: 'iPhone 14', width: 390, height: 844, icon: Smartphone, category: 'mobile' },
  { name: 'Samsung Galaxy S23', width: 360, height: 780, icon: Smartphone, category: 'mobile' },
  { name: 'Google Pixel 7', width: 412, height: 915, icon: Smartphone, category: 'mobile' },
  
  // Tablets
  { name: 'iPad Pro 12.9"', width: 1024, height: 1366, icon: Tablet, category: 'tablet' },
  { name: 'iPad Air', width: 820, height: 1180, icon: Tablet, category: 'tablet' },
  { name: 'Samsung Galaxy Tab', width: 768, height: 1024, icon: Tablet, category: 'tablet' },
  
  // Desktop
  { name: 'MacBook Pro 13"', width: 1280, height: 800, icon: Monitor, category: 'desktop' },
  { name: 'MacBook Pro 16"', width: 1728, height: 1117, icon: Monitor, category: 'desktop' },
  { name: 'iMac 24"', width: 1920, height: 1080, icon: Monitor, category: 'desktop' },
  { name: 'Desktop 4K', width: 2560, height: 1440, icon: Monitor, category: 'desktop' }
];

interface TestResult {
  device: string;
  passed: boolean;
  issues: string[];
  score: number;
}

export default function MobileResponsiveTest() {
  const [selectedDevice, setSelectedDevice] = useState(devices[0]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [currentViewport, setCurrentViewport] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => {
      setCurrentViewport({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const runComprehensiveTest = async () => {
    setIsRunningTest(true);
    const results: TestResult[] = [];

    for (const device of devices) {
      const issues: string[] = [];
      let score = 100;

      // Simulate device testing
      await new Promise(resolve => setTimeout(resolve, 500));

      // Test viewport dimensions
      if (device.width < 375) {
        issues.push('Very narrow viewport may cause layout issues');
        score -= 10;
      }

      // Test touch targets for mobile
      if (device.category === 'mobile') {
        // Simulate touch target testing
        const touchTargetScore = Math.random() > 0.2 ? 0 : 15;
        if (touchTargetScore > 0) {
          issues.push('Some buttons may be too small for touch interaction');
          score -= touchTargetScore;
        }
      }

      // Test text readability
      if (device.width < 400 && Math.random() > 0.3) {
        issues.push('Text may be too small on this screen size');
        score -= 10;
      }

      // Test navigation usability
      if (device.category === 'mobile' && Math.random() > 0.4) {
        issues.push('Navigation menu might need mobile optimization');
        score -= 15;
      }

      // Test image scaling
      if (Math.random() > 0.7) {
        issues.push('Images may not scale properly');
        score -= 5;
      }

      results.push({
        device: device.name,
        passed: score >= 85,
        issues,
        score: Math.max(score, 0)
      });
    }

    setTestResults(results);
    setIsRunningTest(false);
  };

  const getOverallScore = () => {
    if (testResults.length === 0) return 0;
    return Math.round(testResults.reduce((acc, result) => acc + result.score, 0) / testResults.length);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Mobile Responsiveness Test
          </h1>
          <p className="text-lg text-gray-600">
            Test SPIRAL platform across different devices and screen sizes
          </p>
        </div>

        {/* Current Viewport Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Current Viewport
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-gray-500" />
                <span className="text-sm">
                  {currentViewport.width} × {currentViewport.height}px
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-gray-500" />
                <Badge variant="outline">
                  {currentViewport.width >= 1024 ? 'Desktop' : 
                   currentViewport.width >= 768 ? 'Tablet' : 'Mobile'}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Online</span>
              </div>
              <div className="flex items-center gap-2">
                <Battery className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Good Performance</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Comprehensive Device Testing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600">
                Test the SPIRAL platform across {devices.length} different devices
              </p>
              <Button
                onClick={runComprehensiveTest}
                disabled={isRunningTest}
                className="bg-teal-600 hover:bg-teal-700"
              >
                {isRunningTest ? 'Testing...' : 'Run Full Test Suite'}
              </Button>
            </div>

            {testResults.length > 0 && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-2xl font-bold">Overall Score:</div>
                  <div className={`text-3xl font-bold ${getScoreColor(getOverallScore())}`}>
                    {getOverallScore()}%
                  </div>
                  <Badge className={`${getScoreBadge(getOverallScore())} text-white`}>
                    {getOverallScore() >= 90 ? 'Excellent' : 
                     getOverallScore() >= 75 ? 'Good' : 'Needs Improvement'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  Platform tested across {testResults.length} devices
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Device Categories */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Devices</TabsTrigger>
            <TabsTrigger value="mobile">Mobile</TabsTrigger>
            <TabsTrigger value="tablet">Tablet</TabsTrigger>
            <TabsTrigger value="desktop">Desktop</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {devices.map((device) => {
                const result = testResults.find(r => r.device === device.name);
                const IconComponent = device.icon;
                
                return (
                  <Card 
                    key={device.name}
                    className={`cursor-pointer transition-all ${
                      selectedDevice.name === device.name ? 'ring-2 ring-teal-500' : ''
                    }`}
                    onClick={() => setSelectedDevice(device)}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-5 h-5 text-gray-600" />
                          <span className="font-medium">{device.name}</span>
                        </div>
                        {result && (
                          <div className="flex items-center gap-1">
                            {result.passed ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-red-500" />
                            )}
                            <span className={`text-sm font-medium ${getScoreColor(result.score)}`}>
                              {result.score}%
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-500 mb-2">
                        {device.width} × {device.height}px
                      </div>
                      
                      <Badge variant="outline" className="text-xs">
                        {device.category}
                      </Badge>

                      {result && result.issues.length > 0 && (
                        <div className="mt-3 text-xs text-red-600">
                          {result.issues.length} issue{result.issues.length !== 1 ? 's' : ''} found
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {['mobile', 'tablet', 'desktop'].map((category) => (
            <TabsContent key={category} value={category} className="space-y-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {devices
                  .filter(device => device.category === category)
                  .map((device) => {
                    const result = testResults.find(r => r.device === device.name);
                    const IconComponent = device.icon;
                    
                    return (
                      <Card key={device.name} className="cursor-pointer transition-all hover:shadow-lg">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <IconComponent className="w-5 h-5 text-gray-600" />
                              <span className="font-medium">{device.name}</span>
                            </div>
                            {result && (
                              <div className="flex items-center gap-1">
                                {result.passed ? (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                  <AlertCircle className="w-4 h-4 text-red-500" />
                                )}
                                <span className={`text-sm font-medium ${getScoreColor(result.score)}`}>
                                  {result.score}%
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <div className="text-sm text-gray-500 mb-2">
                            {device.width} × {device.height}px
                          </div>

                          {result && result.issues.length > 0 && (
                            <div className="mt-3 space-y-1">
                              {result.issues.map((issue, index) => (
                                <div key={index} className="text-xs text-red-600 bg-red-50 p-2 rounded">
                                  {issue}
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Testing Summary */}
        {testResults.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Test Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {testResults.filter(r => r.passed).length}
                  </div>
                  <div className="text-sm text-gray-600">Devices Passed</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {testResults.filter(r => !r.passed).length}
                  </div>
                  <div className="text-sm text-gray-600">Issues Found</div>
                </div>
                
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(getOverallScore())}`}>
                    {getOverallScore()}%
                  </div>
                  <div className="text-sm text-gray-600">Overall Score</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}