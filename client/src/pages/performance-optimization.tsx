import { useState, useEffect, useCallback } from 'react';
import Header from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Zap, 
  Monitor, 
  Smartphone, 
  Gauge, 
  TrendingUp, 
  CheckCircle,
  AlertTriangle,
  Clock,
  Database,
  Wifi,
  Image,
  FileText,
  Cpu,
  MemoryStick
} from 'lucide-react';

interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  memoryUsage: number;
  bundleSize: number;
  cacheHitRate: number;
  apiResponseTime: number;
}

interface OptimizationResult {
  category: string;
  name: string;
  status: 'completed' | 'in-progress' | 'pending';
  improvement: number; // percentage improvement
  description: string;
  icon: any;
}

export default function PerformanceOptimization() {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 1.2,
    firstContentfulPaint: 0.8,
    largestContentfulPaint: 2.1,
    cumulativeLayoutShift: 0.05,
    firstInputDelay: 12,
    memoryUsage: 45.2,
    bundleSize: 1.8,
    cacheHitRate: 92,
    apiResponseTime: 180
  });

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [optimizations, setOptimizations] = useState<OptimizationResult[]>([
    {
      category: 'Loading',
      name: 'Code Splitting Implementation',
      status: 'completed',
      improvement: 35,
      description: 'Lazy loading of pages and components reduces initial bundle size',
      icon: FileText
    },
    {
      category: 'Images',
      name: 'WebP Image Optimization',
      status: 'completed',
      improvement: 28,
      description: 'Convert images to WebP format with automatic fallbacks',
      icon: Image
    },
    {
      category: 'Caching',
      name: 'Service Worker Cache Strategy',
      status: 'completed',
      improvement: 45,
      description: 'Aggressive caching for static assets and API responses',
      icon: Database
    },
    {
      category: 'Network',
      name: 'API Response Compression',
      status: 'completed',
      improvement: 22,
      description: 'Gzip compression for all API responses',
      icon: Wifi
    },
    {
      category: 'Rendering',
      name: 'Virtual Scrolling for Product Lists',
      status: 'in-progress',
      improvement: 0,
      description: 'Optimize rendering of large product catalogs',
      icon: Monitor
    },
    {
      category: 'Memory',
      name: 'Memory Leak Prevention',
      status: 'pending',
      improvement: 0,
      description: 'Cleanup event listeners and subscriptions',
      icon: MemoryStick
    }
  ]);

  const [realTimeMetrics, setRealTimeMetrics] = useState({
    activeUsers: 1247,
    requestsPerSecond: 89,
    errorRate: 0.2,
    averageResponseTime: 156
  });

  // Simulate real-time metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeMetrics(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 20) - 10,
        requestsPerSecond: Math.max(50, prev.requestsPerSecond + Math.floor(Math.random() * 10) - 5),
        errorRate: Math.max(0, Math.min(1, prev.errorRate + (Math.random() * 0.1) - 0.05)),
        averageResponseTime: Math.max(100, prev.averageResponseTime + Math.floor(Math.random() * 20) - 10)
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Performance audit function
  const runPerformanceAudit = useCallback(async () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);

    // Simulate optimization process
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setOptimizationProgress(i);
    }

    // Update metrics with improved values
    setMetrics(prev => ({
      ...prev,
      loadTime: Math.max(0.5, prev.loadTime * 0.85),
      firstContentfulPaint: Math.max(0.3, prev.firstContentfulPaint * 0.9),
      largestContentfulPaint: Math.max(1.0, prev.largestContentfulPaint * 0.8),
      memoryUsage: Math.max(20, prev.memoryUsage * 0.9),
      apiResponseTime: Math.max(100, prev.apiResponseTime * 0.85)
    }));

    // Mark optimizations as completed
    setOptimizations(prev => prev.map(opt => ({
      ...opt,
      status: opt.status === 'pending' ? 'completed' : opt.status,
      improvement: opt.status === 'pending' ? Math.floor(Math.random() * 30) + 15 : opt.improvement
    })));

    setIsOptimizing(false);
    toast({
      title: "Performance Optimization Complete",
      description: "All optimizations have been applied successfully",
    });
  }, [toast]);

  const getPerformanceScore = () => {
    const loadScore = Math.max(0, 100 - (metrics.loadTime - 0.5) * 40);
    const paintScore = Math.max(0, 100 - (metrics.firstContentfulPaint - 0.3) * 50);
    const lcpScore = Math.max(0, 100 - (metrics.largestContentfulPaint - 1.0) * 30);
    const memoryScore = Math.max(0, 100 - (metrics.memoryUsage - 20) * 2);
    
    return Math.round((loadScore + paintScore + lcpScore + memoryScore) / 4);
  };

  const performanceScore = getPerformanceScore();

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[var(--spiral-navy)] mb-2">
            Performance Optimization Suite
          </h1>
          <p className="text-xl text-gray-600">
            Real-time monitoring and optimization of SPIRAL platform performance
          </p>
        </div>

        {/* Performance Score */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-6 w-6 text-[var(--spiral-coral)]" />
              Overall Performance Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="text-6xl font-bold text-[var(--spiral-navy)]">
                {performanceScore}
              </div>
              <div className="flex-1">
                <Progress value={performanceScore} className="h-4 mb-2" />
                <p className="text-sm text-gray-600">
                  {performanceScore >= 90 ? 'Excellent' : 
                   performanceScore >= 70 ? 'Good' : 
                   performanceScore >= 50 ? 'Needs Improvement' : 'Poor'}
                </p>
              </div>
              <Button 
                onClick={runPerformanceAudit}
                disabled={isOptimizing}
                className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90"
              >
                {isOptimizing ? (
                  <>
                    <Cpu className="mr-2 h-4 w-4 animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Run Optimization
                  </>
                )}
              </Button>
            </div>
            
            {isOptimizing && (
              <div className="mt-4">
                <Progress value={optimizationProgress} className="h-2" />
                <p className="text-sm text-gray-600 mt-1">
                  Optimizing performance... {optimizationProgress}%
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="metrics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="metrics">Core Metrics</TabsTrigger>
            <TabsTrigger value="optimizations">Optimizations</TabsTrigger>
            <TabsTrigger value="realtime">Real-time</TabsTrigger>
            <TabsTrigger value="mobile">Mobile</TabsTrigger>
          </TabsList>

          {/* Core Metrics */}
          <TabsContent value="metrics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    Load Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[var(--spiral-navy)]">
                    {metrics.loadTime.toFixed(1)}s
                  </div>
                  <p className="text-xs text-gray-500">Target: &lt; 1.0s</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    First Contentful Paint
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[var(--spiral-navy)]">
                    {metrics.firstContentfulPaint.toFixed(1)}s
                  </div>
                  <p className="text-xs text-gray-500">Target: &lt; 0.5s</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Monitor className="h-4 w-4 text-purple-500" />
                    Largest Contentful Paint
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[var(--spiral-navy)]">
                    {metrics.largestContentfulPaint.toFixed(1)}s
                  </div>
                  <p className="text-xs text-gray-500">Target: &lt; 2.5s</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <MemoryStick className="h-4 w-4 text-orange-500" />
                    Memory Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[var(--spiral-navy)]">
                    {metrics.memoryUsage.toFixed(1)}MB
                  </div>
                  <p className="text-xs text-gray-500">Target: &lt; 50MB</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Database className="h-4 w-4 text-cyan-500" />
                    Cache Hit Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[var(--spiral-navy)]">
                    {metrics.cacheHitRate}%
                  </div>
                  <p className="text-xs text-gray-500">Target: &gt; 90%</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Wifi className="h-4 w-4 text-red-500" />
                    API Response Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[var(--spiral-navy)]">
                    {metrics.apiResponseTime}ms
                  </div>
                  <p className="text-xs text-gray-500">Target: &lt; 200ms</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Optimizations */}
          <TabsContent value="optimizations" className="space-y-4">
            {optimizations.map((opt, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <opt.icon className="h-5 w-5 text-[var(--spiral-coral)]" />
                      <div>
                        <h3 className="font-semibold text-[var(--spiral-navy)]">{opt.name}</h3>
                        <p className="text-sm text-gray-600">{opt.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {opt.improvement > 0 && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          +{opt.improvement}% faster
                        </Badge>
                      )}
                      <Badge 
                        className={
                          opt.status === 'completed' ? 'bg-green-100 text-green-800' :
                          opt.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }
                      >
                        {opt.status === 'completed' ? (
                          <>
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Completed
                          </>
                        ) : opt.status === 'in-progress' ? (
                          <>
                            <Clock className="mr-1 h-3 w-3" />
                            In Progress
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="mr-1 h-3 w-3" />
                            Pending
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Real-time Monitoring */}
          <TabsContent value="realtime" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[var(--spiral-navy)]">
                    {realTimeMetrics.activeUsers.toLocaleString()}
                  </div>
                  <p className="text-xs text-green-600">+2.3% from yesterday</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Requests/sec</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[var(--spiral-navy)]">
                    {realTimeMetrics.requestsPerSecond}
                  </div>
                  <p className="text-xs text-blue-600">Normal load</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[var(--spiral-navy)]">
                    {realTimeMetrics.errorRate.toFixed(2)}%
                  </div>
                  <p className="text-xs text-green-600">Within targets</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[var(--spiral-navy)]">
                    {realTimeMetrics.averageResponseTime}ms
                  </div>
                  <p className="text-xs text-green-600">Excellent</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Mobile Performance */}
          <TabsContent value="mobile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-[var(--spiral-coral)]" />
                  Mobile Performance Audit
                </CardTitle>
                <CardDescription>
                  Optimization specifically for mobile devices and touch interfaces
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-[var(--spiral-navy)]">Mobile Optimizations</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Touch-optimized buttons (48px+)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Responsive image loading</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Reduced motion preferences</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Offline capability</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-[var(--spiral-navy)]">Performance Metrics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Mobile Load Time</span>
                        <Badge className="bg-green-100 text-green-800">1.1s</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Touch Response</span>
                        <Badge className="bg-green-100 text-green-800">&lt;100ms</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Battery Impact</span>
                        <Badge className="bg-green-100 text-green-800">Low</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Data Usage</span>
                        <Badge className="bg-green-100 text-green-800">Optimized</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}