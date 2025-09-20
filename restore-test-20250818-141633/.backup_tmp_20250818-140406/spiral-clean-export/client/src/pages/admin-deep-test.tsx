import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  Settings,
  Play,
  RotateCcw,
  Shield,
  TestTube,
  TrendingUp,
  Database
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TestResult {
  feature: string;
  status: 'PASS' | 'FAIL';
  score: number;
  route?: string;
}

interface DeepTestResults {
  phase1_mvp: TestResult[];
  overall_metrics: {
    total_features: number;
    passed: number;
    failed: number;
    pass_rate: number;
    average_score: number;
  };
}

export default function AdminDeepTest() {
  const [adminKey, setAdminKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [testResults, setTestResults] = useState<DeepTestResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progressData, setProgressData] = useState<any>(null);
  const { toast } = useToast();

  const authenticateAdmin = () => {
    if (adminKey === 'your-secret-code') {
      setIsAuthenticated(true);
      toast({
        title: "Admin Access Granted",
        description: "Welcome to SPIRAL Deep Testing Dashboard",
      });
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid admin key",
        variant: "destructive"
      });
    }
  };

  const runDeepTest = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/admin/spiral-agent/deep-test?key=${adminKey}`);
      const data = await response.json();
      
      if (data.success) {
        setTestResults(data.results);
        toast({
          title: "Deep Testing Complete",
          description: data.summary,
        });
      } else {
        throw new Error('Test failed');
      }
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Could not complete deep testing",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getProgressReport = async () => {
    try {
      const response = await fetch(`/admin/spiral-agent/progress?key=${adminKey}`);
      const data = await response.json();
      
      if (data.success) {
        setProgressData(data.data);
        toast({
          title: "Progress Report Generated",
          description: "Latest platform progress retrieved",
        });
      }
    } catch (error) {
      toast({
        title: "Failed to Get Progress",
        description: "Could not retrieve progress data",
        variant: "destructive"
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 mx-auto text-blue-600 mb-4" />
            <CardTitle>SPIRAL Admin Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Admin Key</label>
              <Input
                type="password"
                placeholder="Enter admin key..."
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && authenticateAdmin()}
              />
            </div>
            <Button onClick={authenticateAdmin} className="w-full">
              Authenticate
            </Button>
            <Alert>
              <AlertDescription>
                Enter the admin key to access deep testing capabilities
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--spiral-navy)] mb-2">
            SPIRAL Admin Deep Testing Dashboard
          </h1>
          <p className="text-gray-600">
            Comprehensive platform testing and validation system
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <TestTube className="h-8 w-8 mx-auto text-blue-600 mb-3" />
              <h3 className="font-semibold mb-2">Deep Feature Test</h3>
              <Button 
                onClick={runDeepTest}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                {isLoading ? 'Testing...' : 'Run Test'}
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 mx-auto text-green-600 mb-3" />
              <h3 className="font-semibold mb-2">Progress Report</h3>
              <Button 
                onClick={getProgressReport}
                variant="outline"
                className="w-full"
              >
                <Database className="h-4 w-4 mr-2" />
                Get Report
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Settings className="h-8 w-8 mx-auto text-purple-600 mb-3" />
              <h3 className="font-semibold mb-2">System Status</h3>
              <Badge className="bg-green-100 text-green-800">
                OPERATIONAL
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Test Results */}
        {testResults && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Phase 1 MVP Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-4">Feature Results</h4>
                  <div className="space-y-3">
                    {testResults.phase1_mvp.map((result, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {result.status === 'PASS' ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                          <span className="font-medium">{result.feature}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">{result.score}%</span>
                          <Badge className={result.status === 'PASS' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {result.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-4">Overall Metrics</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Pass Rate</span>
                        <span>{testResults.overall_metrics.pass_rate}%</span>
                      </div>
                      <Progress value={testResults.overall_metrics.pass_rate} className="h-3" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 bg-green-50 rounded">
                        <div className="text-2xl font-bold text-green-600">
                          {testResults.overall_metrics.passed}
                        </div>
                        <div className="text-sm text-gray-600">Passed</div>
                      </div>
                      <div className="p-3 bg-red-50 rounded">
                        <div className="text-2xl font-bold text-red-600">
                          {testResults.overall_metrics.failed}
                        </div>
                        <div className="text-sm text-gray-600">Failed</div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-blue-50 rounded text-center">
                      <div className="text-lg font-semibold text-blue-600">
                        {testResults.overall_metrics.average_score}%
                      </div>
                      <div className="text-sm text-gray-600">Average Score</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Progress Data */}
        {progressData && (
          <Card>
            <CardHeader>
              <CardTitle>Platform Progress Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-4">Overall Progress</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Completed</span>
                      <span>{progressData.overall.complete}/{progressData.overall.total}</span>
                    </div>
                    <Progress value={parseFloat(progressData.overall.percent)} className="h-3" />
                    <div className="text-center text-lg font-semibold text-blue-600">
                      {progressData.overall.percent}% Complete
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-4">Phase Breakdown</h4>
                  <div className="space-y-2">
                    {progressData.phases.map((phase, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm">{phase.name}</span>
                        <Badge variant="outline">
                          {phase.completed}/{phase.total} ({phase.percent}%)
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}