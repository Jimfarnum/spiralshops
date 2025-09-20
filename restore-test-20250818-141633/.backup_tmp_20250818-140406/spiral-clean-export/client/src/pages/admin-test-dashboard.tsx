import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield,
  CheckCircle,
  AlertCircle,
  Clock,
  Activity,
  Database,
  Server,
  Settings,
  Users,
  BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TestResult {
  path: string;
  result: string;
  statusCode: number;
  responseTime: string;
  timestamp: string;
  details: string;
}

interface SystemStatus {
  timestamp: string;
  platform: string;
  status: string;
  features: Record<string, string>;
  performance: {
    averageResponseTime: string;
    uptime: string;
    activeUsers: number;
    totalTransactions: number;
  };
}

export default function AdminTestDashboard() {
  const { toast } = useToast();
  const [adminKey, setAdminKey] = useState('your-secret-code');
  const [testResults, setTestResults] = useState<any>(null);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  const runPathValidation = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/admin/test/validate-paths-json?key=${adminKey}`);
      
      if (response.status === 403) {
        toast({
          title: "Authentication Failed",
          description: "Invalid admin key provided",
          variant: "destructive"
        });
        setAuthenticated(false);
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setTestResults(data);
        setAuthenticated(true);
        toast({
          title: "Path Validation Complete",
          description: `${data.summary.passed}/${data.totalPaths} routes passed`,
        });
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Unable to run path validation tests",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkSystemStatus = async () => {
    try {
      const response = await fetch(`/admin/test/system-status?key=${adminKey}`);
      
      if (response.ok) {
        const data = await response.json();
        setSystemStatus(data);
        setAuthenticated(true);
      }
    } catch (error) {
      console.error('Failed to check system status:', error);
    }
  };

  const getResultBadge = (result: string) => {
    if (result.includes('✅')) {
      return <Badge className="bg-green-100 text-green-800">Pass</Badge>;
    }
    return <Badge className="bg-red-100 text-red-800">Fail</Badge>;
  };

  const getFeatureStatusColor = (status: string) => {
    return status === 'ACTIVE' ? 'text-green-600' : 'text-yellow-600';
  };

  useEffect(() => {
    if (adminKey === 'your-secret-code') {
      checkSystemStatus();
    }
  }, [adminKey]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--spiral-navy)] mb-2">
            Admin Test Dashboard
          </h1>
          <p className="text-gray-600">
            Comprehensive route validation and system monitoring
          </p>
        </div>

        {/* Authentication */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Admin Authentication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <input
                type="password"
                placeholder="Enter admin key"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-md"
              />
              <Badge className={authenticated ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                {authenticated ? "Authenticated" : "Not Authenticated"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        {systemStatus && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  System Status
                </div>
                <Badge className="bg-green-100 text-green-800">
                  {systemStatus.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {systemStatus.performance.averageResponseTime}
                  </div>
                  <div className="text-sm text-gray-600">Avg Response Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {systemStatus.performance.uptime}
                  </div>
                  <div className="text-sm text-gray-600">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {systemStatus.performance.activeUsers}
                  </div>
                  <div className="text-sm text-gray-600">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {systemStatus.performance.totalTransactions.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Transactions</div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Feature Status</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(systemStatus.features).map(([feature, status]) => (
                    <div key={feature} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm">{feature}</span>
                      <span className={`text-sm font-medium ${getFeatureStatusColor(status)}`}>
                        {status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Test Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Button 
                onClick={runPathValidation}
                disabled={isLoading || !authenticated}
                className="flex-1"
              >
                {isLoading ? (
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Run Path Validation
              </Button>
              <Button 
                onClick={checkSystemStatus}
                disabled={!authenticated}
                variant="outline"
                className="flex-1"
              >
                <Activity className="h-4 w-4 mr-2" />
                Refresh System Status
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        {testResults && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Path Validation Results</span>
                    <Badge className="bg-blue-100 text-blue-800">
                      {testResults.summary.passed}/{testResults.totalPaths} Passed
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {testResults.results.map((result: TestResult, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          {result.result.includes('✅') ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-600" />
                          )}
                          <div>
                            <span className="font-medium">{result.path}</span>
                            <p className="text-sm text-gray-600">{result.details}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {getResultBadge(result.result)}
                          <p className="text-xs text-gray-500 mt-1">{result.responseTime}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Test Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Paths:</span>
                      <span className="font-semibold">{testResults.totalPaths}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Passed:</span>
                      <span className="font-semibold text-green-600">{testResults.summary.passed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Failed:</span>
                      <span className="font-semibold text-red-600">{testResults.summary.failed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pass Rate:</span>
                      <span className="font-semibold text-blue-600">{testResults.summary.overallPassRate}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {testResults.categoryBreakdown && (
                <Card>
                  <CardHeader>
                    <CardTitle>Category Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(testResults.categoryBreakdown).map(([category, data]: [string, any]) => (
                        <div key={category} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{category}</span>
                            <Badge variant="outline">{data.passRate}</Badge>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {data.percentage}% pass rate
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {!authenticated && (
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Please enter the correct admin key to access testing functionality.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}