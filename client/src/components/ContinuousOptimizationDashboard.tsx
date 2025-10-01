import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Clock, Play, Square, Zap, TrendingUp, AlertTriangle, Activity } from 'lucide-react';

interface OptimizationReport {
  status: 'running' | 'stopped';
  lastHealthCheck: {
    issuesDetected: boolean;
    issues: Array<{
      type: string;
      severity: string;
      message?: string;
      endpoint?: string;
      duration?: number;
    }>;
    healthScore: number;
    timestamp: string;
  };
  optimizationHistory: Array<{
    timestamp: string;
    type: 'comprehensive' | 'targeted';
    analysis?: any;
    appliedOptimizations?: any[];
  }>;
  totalOptimizations: number;
  performanceThresholds: {
    slowRequest: number;
    verySlowRequest: number;
    highMemory: number;
    criticalMemory: number;
  };
}

export default function ContinuousOptimizationDashboard() {
  const [report, setReport] = useState<OptimizationReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Fetch optimization report
  const fetchReport = async () => {
    try {
      const response = await fetch('/api/continuous-optimization/report');
      const data = await response.json();
      if (data.success) {
        setReport(data.report);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch optimization report:', error);
    }
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    fetchReport();
    const interval = setInterval(fetchReport, 30000);
    return () => clearInterval(interval);
  }, []);

  // Start optimization
  const startOptimization = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/continuous-optimization/start', {
        method: 'POST'
      });
      const data = await response.json();
      if (data.success) {
        await fetchReport();
      }
    } catch (error) {
      console.error('Failed to start optimization:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Stop optimization
  const stopOptimization = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/continuous-optimization/stop', {
        method: 'POST'
      });
      const data = await response.json();
      if (data.success) {
        await fetchReport();
      }
    } catch (error) {
      console.error('Failed to stop optimization:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Run analysis
  const runAnalysis = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/continuous-optimization/analyze', {
        method: 'POST'
      });
      const data = await response.json();
      if (data.success) {
        await fetchReport();
      }
    } catch (error) {
      console.error('Failed to run analysis:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive">{severity}</Badge>;
      case 'high':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800">{severity}</Badge>;
      case 'medium':
        return <Badge variant="outline">{severity}</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  if (!report) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              SPIRAL Continuous Optimization Dashboard
            </CardTitle>
            <CardDescription>
              Loading optimization data...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center p-8">
              <Clock className="h-8 w-8 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Zap className="h-8 w-8 text-blue-600" />
            SPIRAL Continuous Optimization
          </h1>
          <p className="text-gray-600 mt-2">
            Automated performance monitoring, testing, and optimization for your platform
          </p>
        </div>
        <div className="flex gap-2">
          {report.status === 'running' ? (
            <Button onClick={stopOptimization} disabled={isLoading} variant="outline">
              <Square className="h-4 w-4 mr-2" />
              Stop Optimization
            </Button>
          ) : (
            <Button onClick={startOptimization} disabled={isLoading}>
              <Play className="h-4 w-4 mr-2" />
              Start Optimization
            </Button>
          )}
          <Button onClick={runAnalysis} disabled={isLoading} variant="secondary">
            <Activity className="h-4 w-4 mr-2" />
            Run Analysis
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {report.status === 'running' ? (
                <>
                  <Activity className="h-4 w-4 text-green-600 animate-pulse" />
                  <span className="text-green-600 font-medium">Active</span>
                </>
              ) : (
                <>
                  <Square className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Stopped</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Health Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-bold ${getHealthScoreColor(report.lastHealthCheck?.healthScore || 0)}`}>
                {report.lastHealthCheck?.healthScore || 0}
              </span>
              <span className="text-gray-500">/100</span>
            </div>
            <Progress 
              value={report.lastHealthCheck?.healthScore || 0} 
              className="mt-2" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {report.lastHealthCheck?.issuesDetected ? (
                <>
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-2xl font-bold text-yellow-600">
                    {report.lastHealthCheck.issues.length}
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-2xl font-bold text-green-600">0</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Optimizations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">
                {report.totalOptimizations}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Issues */}
      {report.lastHealthCheck?.issuesDetected && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Active Performance Issues
            </CardTitle>
            <CardDescription>
              Issues detected during the last health check
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {report.lastHealthCheck.issues.map((issue, index) => (
                <Alert key={index}>
                  <AlertDescription className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{issue.type.replace('_', ' ').toUpperCase()}</span>
                      {issue.endpoint && (
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {issue.endpoint}
                        </code>
                      )}
                      {issue.duration && (
                        <span className="text-sm text-gray-600">
                          {issue.duration}ms
                        </span>
                      )}
                    </div>
                    {getSeverityBadge(issue.severity)}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Thresholds */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Thresholds</CardTitle>
          <CardDescription>
            Current monitoring thresholds for optimization triggers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {report.performanceThresholds.slowRequest}ms
              </div>
              <div className="text-sm text-gray-600">Slow Request</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {report.performanceThresholds.verySlowRequest}ms
              </div>
              <div className="text-sm text-gray-600">Very Slow Request</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {report.performanceThresholds.highMemory}MB
              </div>
              <div className="text-sm text-gray-600">High Memory</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {report.performanceThresholds.criticalMemory}MB
              </div>
              <div className="text-sm text-gray-600">Critical Memory</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optimization History */}
      {report.optimizationHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Optimizations</CardTitle>
            <CardDescription>
              History of applied optimizations and analyses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {report.optimizationHistory.slice(0, 5).map((optimization, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      optimization.type === 'comprehensive' ? 'bg-blue-600' : 'bg-green-600'
                    }`} />
                    <div>
                      <div className="font-medium capitalize">{optimization.type} Optimization</div>
                      <div className="text-sm text-gray-600">
                        {new Date(optimization.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {optimization.appliedOptimizations && (
                      <Badge variant="outline">
                        {optimization.appliedOptimizations.length} applied
                      </Badge>
                    )}
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Footer */}
      <div className="text-center text-sm text-gray-500">
        Last updated: {lastUpdate.toLocaleTimeString()} • 
        Auto-refresh every 30 seconds
      </div>
    </div>
  );
}