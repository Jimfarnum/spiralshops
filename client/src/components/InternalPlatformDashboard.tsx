// Internal Platform Monitor Dashboard - Real-time monitoring interface
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Zap, 
  TrendingUp,
  Clock,
  Shield,
  Gauge,
  Monitor
} from 'lucide-react';

interface HealthStatus {
  overall: 'healthy' | 'degraded' | 'critical';
  api: 'good' | 'slow';
  memory: 'good' | 'high';
  errors: 'low' | 'high';
  ui: 'fast' | 'slow';
  bottlenecks: number;
  corrections: number;
  monitoring: boolean;
  lastCheck: number;
}

interface Bottleneck {
  type: string;
  location: string;
  value: number;
  timestamp: number;
  severity: 'warning' | 'critical';
}

interface Correction {
  type: string;
  location: string;
  action: string;
  timestamp: number;
}

const InternalPlatformDashboard: React.FC = () => {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [bottlenecks, setBottlenecks] = useState<Bottleneck[]>([]);
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const [healthRes, bottlenecksRes, correctionsRes, metricsRes] = await Promise.all([
        fetch('/api/internal-monitor/health'),
        fetch('/api/internal-monitor/bottlenecks?timeframe=1h'),
        fetch('/api/internal-monitor/corrections?limit=20'),
        fetch('/api/internal-monitor/metrics')
      ]);

      const [healthData, bottlenecksData, correctionsData, metricsData] = await Promise.all([
        healthRes.json(),
        bottlenecksRes.json(),
        correctionsRes.json(),
        metricsRes.json()
      ]);

      if (healthData.success) setHealth(healthData.health);
      if (bottlenecksData.success) setBottlenecks(bottlenecksData.bottlenecks);
      if (correctionsData.success) setCorrections(correctionsData.corrections);
      if (metricsData.success) setMetrics(metricsData.metrics);

      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setLoading(false);
    }
  };

  // Start monitoring
  const startMonitoring = async () => {
    try {
      const response = await fetch('/api/internal-monitor/start', { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Failed to start monitoring:', error);
    }
  };

  // Trigger analysis
  const triggerAnalysis = async () => {
    try {
      const response = await fetch('/api/internal-monitor/analyze', { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        console.log('Analysis triggered:', data.analysis);
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Failed to trigger analysis:', error);
    }
  };

  // Auto-refresh effect
  useEffect(() => {
    fetchDashboardData();
    
    if (autoRefresh) {
      const interval = setInterval(fetchDashboardData, 30000); // Every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'good':
      case 'fast':
      case 'low':
        return 'text-green-600';
      case 'degraded':
      case 'slow':
      case 'high':
        return 'text-yellow-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'good':
      case 'fast':
      case 'low':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'degraded':
      case 'slow':
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading Internal Platform Monitor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Internal Platform Monitor</h1>
          <p className="text-gray-600">AI-powered continuous monitoring and auto-correction</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant={health?.monitoring ? 'default' : 'secondary'}>
            {health?.monitoring ? 'Active' : 'Inactive'}
          </Badge>
          <Button onClick={startMonitoring} size="sm">
            <Monitor className="h-4 w-4 mr-2" />
            Start Monitor
          </Button>
          <Button onClick={triggerAnalysis} size="sm" variant="outline">
            <Zap className="h-4 w-4 mr-2" />
            AI Analysis
          </Button>
          <Button 
            onClick={() => setAutoRefresh(!autoRefresh)} 
            size="sm" 
            variant={autoRefresh ? 'default' : 'outline'}
          >
            Auto Refresh
          </Button>
        </div>
      </div>

      {/* Health Overview */}
      {health && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Health</CardTitle>
              {getStatusIcon(health.overall)}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getStatusColor(health.overall)}`}>
                {health.overall.toUpperCase()}
              </div>
              <p className="text-xs text-gray-500">
                Last check: {Math.round(health.lastCheck / 1000)}s ago
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">API Performance</CardTitle>
              <Gauge className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getStatusColor(health.api)}`}>
                {health.api.toUpperCase()}
              </div>
              <Progress 
                value={health.api === 'good' ? 85 : 45} 
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
              <Activity className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getStatusColor(health.memory)}`}>
                {health.memory.toUpperCase()}
              </div>
              <Progress 
                value={health.memory === 'good' ? 60 : 85} 
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Auto-Corrections</CardTitle>
              <Shield className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {health.corrections}
              </div>
              <p className="text-xs text-gray-500">
                {health.bottlenecks} active bottlenecks
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Alert for critical issues */}
      {health?.overall === 'critical' && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Critical issues detected. Platform AI Agent is actively correcting bottlenecks and crash points.
          </AlertDescription>
        </Alert>
      )}

      {/* Detailed Monitoring */}
      <Tabs defaultValue="bottlenecks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="bottlenecks">Bottlenecks</TabsTrigger>
          <TabsTrigger value="corrections">Auto-Corrections</TabsTrigger>
          <TabsTrigger value="metrics">Real-time Metrics</TabsTrigger>
          <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="bottlenecks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bottlenecks</CardTitle>
              <CardDescription>
                Detected performance bottlenecks in the last hour
              </CardDescription>
            </CardHeader>
            <CardContent>
              {bottlenecks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  No bottlenecks detected in the last hour
                </div>
              ) : (
                <div className="space-y-3">
                  {bottlenecks.slice(0, 10).map((bottleneck, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge variant={bottleneck.severity === 'critical' ? 'destructive' : 'secondary'}>
                          {bottleneck.severity}
                        </Badge>
                        <div>
                          <p className="font-medium">{bottleneck.type}</p>
                          <p className="text-sm text-gray-500">{bottleneck.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{bottleneck.value}ms</p>
                        <p className="text-xs text-gray-500">
                          {new Date(bottleneck.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="corrections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Auto-Corrections History</CardTitle>
              <CardDescription>
                Recent automated fixes applied by the Platform AI Agent
              </CardDescription>
            </CardHeader>
            <CardContent>
              {corrections.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Shield className="h-12 w-12 mx-auto mb-4" />
                  No corrections needed recently
                </div>
              ) : (
                <div className="space-y-3">
                  {corrections.map((correction, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-medium">{correction.action}</p>
                          <p className="text-sm text-gray-500">
                            {correction.type} at {correction.location}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          {new Date(correction.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>API Performance</CardTitle>
              </CardHeader>
              <CardContent>
                {metrics?.api ? (
                  <div className="space-y-2">
                    {Object.entries(metrics.api).map(([endpoint, data]: [string, any]) => (
                      <div key={endpoint} className="flex justify-between">
                        <span className="text-sm">{endpoint}</span>
                        <span className="text-sm font-medium">
                          {data.length > 0 ? `${Math.round(data[data.length - 1].duration)}ms` : 'N/A'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No API metrics available</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>UI Performance</CardTitle>
              </CardHeader>
              <CardContent>
                {metrics?.ui ? (
                  <div className="space-y-2">
                    {Object.entries(metrics.ui).map(([component, data]: [string, any]) => (
                      <div key={component} className="flex justify-between">
                        <span className="text-sm">{component}</span>
                        <span className="text-sm font-medium">
                          {data.length > 0 ? `${Math.round(data[data.length - 1].duration)}ms` : 'N/A'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No UI metrics available</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Analysis</CardTitle>
              <CardDescription>
                Intelligent platform monitoring and optimization recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">Continuous AI Monitoring Active</span>
                </div>
                <p className="text-sm text-gray-600">
                  The Platform AI Agent continuously monitors all aspects of the SPIRAL platform, 
                  including UI/UX performance, API response times, onboarding flows, and user experience. 
                  It automatically detects and corrects bottlenecks and crash points in real-time.
                </p>
                <Button onClick={triggerAnalysis} className="mt-4">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Trigger Deep Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InternalPlatformDashboard;