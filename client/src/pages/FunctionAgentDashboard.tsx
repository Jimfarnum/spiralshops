import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Play, 
  Square, 
  SkipForward, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Activity,
  Zap,
  Users,
  BarChart3,
  Target,
  Rocket
} from 'lucide-react';

interface FunctionAgentStatus {
  isActive: boolean;
  mode: string;
  currentStep: number;
  totalSteps: number;
  progress: number;
  completedTests: number;
  startTime: string | null;
  uptime: number;
}

interface TestResult {
  step: number;
  category: string;
  name: string;
  description: string;
  status: 'SUCCESS' | 'FAILED' | 'ERROR';
  responseTime: string;
  endpoint: string;
  method: string;
  timestamp: string;
  details?: any;
  error?: string;
}

interface DemoResults {
  success: boolean;
  results: TestResult[];
  summary: {
    totalSteps: number;
    successfulSteps: number;
    failedSteps: number;
    successRate: string;
    duration: string;
    mode: string;
  };
  investorReport: {
    platformOverview: {
      totalFunctionsTested: number;
      categoriesCovered: number;
      overallSuccessRate: string;
    };
    categoryBreakdown: Record<string, any>;
    keyHighlights: string[];
  };
}

export default function FunctionAgentDashboard() {
  const [selectedMode, setSelectedMode] = useState('investor');
  const [isRunning, setIsRunning] = useState(false);
  const [currentResults, setCurrentResults] = useState<TestResult[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current status
  const { data: status, refetch: refetchStatus } = useQuery({
    queryKey: ['/api/function-agent/status'],
    queryFn: async () => {
      const response = await fetch('/api/function-agent/status');
      if (!response.ok) throw new Error('Failed to get status');
      const data = await response.json();
      return data.data as FunctionAgentStatus;
    },
    refetchInterval: isRunning ? 1000 : false
  });

  // Get latest results
  const { data: results, refetch: refetchResults } = useQuery({
    queryKey: ['/api/function-agent/results'],
    queryFn: async () => {
      const response = await fetch('/api/function-agent/results');
      if (!response.ok) throw new Error('Failed to get results');
      return response.json() as DemoResults;
    },
    enabled: false
  });

  // Start demonstration
  const startDemo = useMutation({
    mutationFn: async (mode: string) => {
      const response = await fetch('/api/function-agent/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode })
      });
      if (!response.ok) throw new Error('Failed to start demonstration');
      return response.json();
    },
    onSuccess: () => {
      setIsRunning(true);
      toast({
        title: "Function Agent Started",
        description: "Platform demonstration is now running",
      });
      refetchStatus();
    },
    onError: (error: Error) => {
      toast({
        title: "Start Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Stop demonstration
  const stopDemo = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/function-agent/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to stop demonstration');
      return response.json();
    },
    onSuccess: () => {
      setIsRunning(false);
      toast({
        title: "Function Agent Stopped",
        description: "Platform demonstration has been stopped",
      });
      refetchStatus();
      refetchResults();
    }
  });

  // Execute next step
  const nextStep = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/function-agent/next', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to execute next step');
      return response.json();
    },
    onSuccess: (data) => {
      if (data.currentStep) {
        setCurrentResults(prev => [...prev, data.currentStep]);
      }
      if (data.progress?.completed === data.progress?.total) {
        setIsRunning(false);
        toast({
          title: "Demonstration Complete!",
          description: `${data.progress.completed} functions tested successfully`,
        });
        refetchResults();
      }
      refetchStatus();
    }
  });

  // Auto-run complete demonstration
  const autoDemo = useMutation({
    mutationFn: async (mode: string) => {
      const response = await fetch('/api/function-agent/demo/auto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode })
      });
      if (!response.ok) throw new Error('Failed to run auto demonstration');
      return response.json();
    },
    onSuccess: (data) => {
      setIsRunning(false);
      toast({
        title: "Auto Demo Complete!",
        description: `${data.summary.successfulSteps} of ${data.summary.totalSteps} functions passed`,
      });
      refetchStatus();
      refetchResults();
    },
    onError: (error: Error) => {
      toast({
        title: "Auto Demo Failed",
        description: error.message,
        variant: "destructive"
      });
      setIsRunning(false);
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS': return 'bg-green-100 text-green-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      case 'ERROR': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCESS': return <CheckCircle className="h-4 w-4" />;
      case 'FAILED': return <XCircle className="h-4 w-4" />;
      case 'ERROR': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  useEffect(() => {
    if (status?.isActive) {
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
  }, [status?.isActive]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Rocket className="h-8 w-8 text-teal-600" />
                Function Agent Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Comprehensive platform demonstration for investors and stakeholders
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Select value={selectedMode} onValueChange={setSelectedMode}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="investor">Investor</SelectItem>
                  <SelectItem value="developer">Developer</SelectItem>
                  <SelectItem value="full">Full Demo</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                onClick={() => autoDemo.mutate(selectedMode)}
                disabled={isRunning || autoDemo.isPending}
                className="bg-teal-600 hover:bg-teal-700"
              >
                <Zap className="h-4 w-4 mr-2" />
                Auto Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Control Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Control Panel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Button
                  onClick={() => startDemo.mutate(selectedMode)}
                  disabled={isRunning || startDemo.isPending}
                  className="w-full"
                  variant={isRunning ? "secondary" : "default"}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Demo ({selectedMode})
                </Button>
                
                <Button
                  onClick={() => nextStep.mutate()}
                  disabled={!isRunning || nextStep.isPending}
                  className="w-full"
                  variant="outline"
                >
                  <SkipForward className="h-4 w-4 mr-2" />
                  Next Step
                </Button>
                
                <Button
                  onClick={() => stopDemo.mutate()}
                  disabled={!isRunning}
                  className="w-full"
                  variant="destructive"
                >
                  <Square className="h-4 w-4 mr-2" />
                  Stop Demo
                </Button>
              </div>
              
              {status && (
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span>Status:</span>
                    <Badge variant={status.isActive ? "default" : "secondary"}>
                      {status.isActive ? "Running" : "Stopped"}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Mode:</span>
                    <span className="font-medium">{status.mode}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Progress:</span>
                    <span className="font-medium">{status.currentStep}/{status.totalSteps}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              {status && (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Overall Progress</span>
                      <span>{status.progress}%</span>
                    </div>
                    <Progress value={status.progress} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{status.currentStep}</div>
                      <div className="text-xs text-blue-600">Current Step</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{status.totalSteps}</div>
                      <div className="text-xs text-green-600">Total Steps</div>
                    </div>
                  </div>
                  
                  {status.uptime > 0 && (
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="text-sm text-gray-600">
                        Runtime: {Math.round(status.uptime)}s
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              {results?.summary && (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Success Rate:</span>
                    <Badge className="bg-green-100 text-green-800">
                      {results.summary.successRate}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Functions Tested:</span>
                    <span className="font-medium">{results.summary.totalSteps}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Duration:</span>
                    <span className="font-medium">{results.summary.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Failed:</span>
                    <span className="font-medium text-red-600">{results.summary.failedSteps}</span>
                  </div>
                </div>
              )}
              
              {!results?.summary && (
                <div className="text-center py-6 text-gray-500">
                  <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No results yet</p>
                  <p className="text-xs">Run a demonstration to see stats</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="live" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="live">Live Progress</TabsTrigger>
            <TabsTrigger value="results">Test Results</TabsTrigger>
            <TabsTrigger value="report">Investor Report</TabsTrigger>
          </TabsList>

          <TabsContent value="live" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Function Testing</CardTitle>
                <CardDescription>
                  Real-time view of function execution and results
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentResults.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {currentResults.map((result, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(result.status)}
                          <Badge className={getStatusColor(result.status)}>
                            {result.status}
                          </Badge>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{result.name}</h4>
                          <p className="text-sm text-gray-600">{result.category}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{result.responseTime}</div>
                          <div className="text-xs text-gray-500">{result.method}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Start a demonstration to see live progress</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Test Results</CardTitle>
                <CardDescription>
                  Complete breakdown of all function tests
                </CardDescription>
              </CardHeader>
              <CardContent>
                {results?.results && results.results.length > 0 ? (
                  <div className="space-y-4">
                    {results.results.map((result, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="font-medium">Step {result.step}</span>
                            <Badge className={getStatusColor(result.status)}>
                              {getStatusIcon(result.status)}
                              {result.status}
                            </Badge>
                            <Badge variant="outline">{result.category}</Badge>
                          </div>
                          <div className="text-sm text-gray-500">
                            {result.responseTime} • {result.method}
                          </div>
                        </div>
                        
                        <h4 className="font-semibold mb-1">{result.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{result.description}</p>
                        <p className="text-xs text-gray-500 mb-2">
                          <code>{result.endpoint}</code>
                        </p>
                        
                        {result.error && (
                          <div className="bg-red-50 border border-red-200 rounded p-2 text-sm text-red-800">
                            {result.error}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No test results available</p>
                    <p className="text-sm">Complete a demonstration to see detailed results</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="report">
            <Card>
              <CardHeader>
                <CardTitle>Investor Report</CardTitle>
                <CardDescription>
                  Comprehensive platform overview for stakeholders
                </CardDescription>
              </CardHeader>
              <CardContent>
                {results?.investorReport ? (
                  <div className="space-y-6">
                    {/* Platform Overview */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Platform Overview</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {results.investorReport.platformOverview.totalFunctionsTested}
                          </div>
                          <div className="text-sm text-blue-600">Functions Tested</div>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {results.investorReport.platformOverview.overallSuccessRate}
                          </div>
                          <div className="text-sm text-green-600">Success Rate</div>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">
                            {results.investorReport.platformOverview.categoriesCovered}
                          </div>
                          <div className="text-sm text-purple-600">Categories</div>
                        </div>
                      </div>
                    </div>

                    {/* Key Highlights */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Key Platform Highlights</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {results.investorReport.keyHighlights.map((highlight, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Category Breakdown */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Category Performance</h3>
                      <div className="space-y-3">
                        {Object.entries(results.investorReport.categoryBreakdown).map(([category, data]: [string, any]) => (
                          <div key={category} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{category}</h4>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">
                                  {data.successful}/{data.total} passed
                                </Badge>
                                <span className="text-sm text-gray-500">
                                  Avg: {data.avgResponseTime}
                                </span>
                              </div>
                            </div>
                            <Progress 
                              value={(data.successful / data.total) * 100} 
                              className="h-2"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No investor report available</p>
                    <p className="text-sm">Complete a demonstration to generate the report</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}