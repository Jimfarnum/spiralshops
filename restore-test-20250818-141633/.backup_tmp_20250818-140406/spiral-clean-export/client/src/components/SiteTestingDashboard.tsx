import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Clock, Play, Square, Eye, AlertTriangle } from 'lucide-react';

interface TestStep {
  name: string;
  status: 'success' | 'failed' | 'running';
  duration: number;
  error?: string;
  timestamp: number;
}

interface TestJourney {
  journey: string;
  steps: TestStep[];
  issues: Array<{
    type: string;
    message: string;
    step?: string;
  }>;
  performance: Array<{
    step: string;
    duration: number;
    success: boolean;
  }>;
  startTime: number;
  endTime?: number;
  duration?: number;
}

interface TestStatus {
  isRunning: boolean;
  currentTest: string | null;
  completedTests: number;
  totalJourneys: number;
}

export default function SiteTestingDashboard() {
  const [testStatus, setTestStatus] = useState<TestStatus | null>(null);
  const [testResults, setTestResults] = useState<TestJourney[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Auto-refresh data every 2 seconds when testing is running
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (testStatus?.isRunning) {
      interval = setInterval(() => {
        fetchTestStatus();
        fetchTestResults();
      }, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [testStatus?.isRunning]);

  const fetchTestStatus = async () => {
    try {
      const response = await fetch('/api/site-testing/status');
      const data = await response.json();
      if (data.success) {
        setTestStatus(data.status);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch test status:', error);
    }
  };

  const fetchTestResults = async () => {
    try {
      const response = await fetch('/api/site-testing/results');
      const data = await response.json();
      if (data.success) {
        setTestResults(data.results);
      }
    } catch (error) {
      console.error('Failed to fetch test results:', error);
    }
  };

  const startTesting = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/site-testing/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      
      if (data.success) {
        await fetchTestStatus();
        await fetchTestResults();
      } else {
        console.error('Failed to start testing:', data.message);
      }
    } catch (error) {
      console.error('Error starting tests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const stopTesting = async () => {
    try {
      const response = await fetch('/api/site-testing/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      
      if (data.success) {
        await fetchTestStatus();
      }
    } catch (error) {
      console.error('Error stopping tests:', error);
    }
  };

  const runQuickTest = async (journey: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/site-testing/quick-test/${journey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      
      if (data.success) {
        await fetchTestResults();
      }
    } catch (error) {
      console.error('Error running quick test:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchTestStatus();
    fetchTestResults();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const getPerformanceBadge = (duration: number) => {
    if (duration < 1000) return <Badge variant="default" className="bg-green-100 text-green-800">Fast</Badge>;
    if (duration < 3000) return <Badge variant="secondary">Normal</Badge>;
    return <Badge variant="destructive">Slow</Badge>;
  };

  const totalIssues = testResults.reduce((sum, journey) => sum + journey.issues.length, 0);
  const totalSteps = testResults.reduce((sum, journey) => sum + journey.steps.length, 0);
  const failedSteps = testResults.reduce((sum, journey) => 
    sum + journey.steps.filter(step => step.status === 'failed').length, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SPIRAL Site Testing AI Agent</h1>
          <p className="text-gray-600">Watch the AI test your entire platform as a real user</p>
        </div>
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-blue-500" />
          <span className="text-sm text-gray-500">
            Last update: {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Testing Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button
              onClick={startTesting}
              disabled={isLoading || testStatus?.isRunning}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Start Complete Testing
            </Button>
            
            {testStatus?.isRunning && (
              <Button
                onClick={stopTesting}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <Square className="h-4 w-4" />
                Stop Testing
              </Button>
            )}
          </div>

          {/* Quick Test Buttons */}
          <div>
            <h3 className="text-sm font-medium mb-2">Quick Tests:</h3>
            <div className="flex flex-wrap gap-2">
              {['homepage_visitor', 'product_browser', 'store_explorer', 'shopper_signup', 'retailer_signup'].map((journey) => (
                <Button
                  key={journey}
                  onClick={() => runQuickTest(journey)}
                  disabled={isLoading || testStatus?.isRunning}
                  variant="outline"
                  size="sm"
                >
                  {journey.replace('_', ' ').toUpperCase()}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Overview */}
      {testStatus && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <p className="text-2xl font-bold">
                    {testStatus.isRunning ? 'Running' : 'Idle'}
                  </p>
                </div>
                <div className={`h-3 w-3 rounded-full ${testStatus.isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div>
                <p className="text-sm font-medium">Current Test</p>
                <p className="text-2xl font-bold">
                  {testStatus.currentTest?.replace('_', ' ') || 'None'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div>
                <p className="text-sm font-medium">Progress</p>
                <div className="flex items-center gap-2">
                  <Progress 
                    value={(testStatus.completedTests / testStatus.totalJourneys) * 100} 
                    className="flex-1"
                  />
                  <span className="text-sm">
                    {testStatus.completedTests}/{testStatus.totalJourneys}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div>
                <p className="text-sm font-medium">Issues Found</p>
                <p className="text-2xl font-bold text-red-500">{totalIssues}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results ({testResults.length} journeys completed)</CardTitle>
            <CardDescription>
              {totalSteps} total steps, {failedSteps} failed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testResults.map((journey, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">
                      {journey.journey.replace('_', ' ').toUpperCase()}
                    </h3>
                    <div className="flex items-center gap-2">
                      {journey.duration && getPerformanceBadge(journey.duration)}
                      <span className="text-sm text-gray-500">
                        {journey.duration ? formatDuration(journey.duration) : 'Running...'}
                      </span>
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="space-y-2 mb-3">
                    {journey.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(step.status)}
                          <span className="text-sm">{step.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getPerformanceBadge(step.duration)}
                          <span className="text-xs text-gray-500">
                            {formatDuration(step.duration)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Issues */}
                  {journey.issues.length > 0 && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>{journey.issues.length} issues found:</strong>
                        <ul className="mt-1 list-disc list-inside space-y-1">
                          {journey.issues.map((issue, issueIndex) => (
                            <li key={issueIndex} className="text-sm">
                              {issue.step && <strong>{issue.step}:</strong>} {issue.message}
                            </li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {testResults.length === 0 && !testStatus?.isRunning && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <Eye className="h-12 w-12 text-gray-400" />
              <div>
                <h3 className="font-semibold text-lg">No tests run yet</h3>
                <p className="text-gray-600">
                  Click "Start Complete Testing" to watch the AI navigate through your entire SPIRAL platform
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}