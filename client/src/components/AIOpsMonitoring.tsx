import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock, Activity, RefreshCw } from "lucide-react";

interface AIAgent {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  averageDuration: number;
  successRate: number;
  lastStatus: string;
  lastTestTime: string;
}

interface AIOpsData {
  success: boolean;
  performance: Record<string, AIAgent>;
  totalLogs: number;
  recentLogsAnalyzed: number;
}

export default function AIOpsMonitoring() {
  const { data: status, refetch: refetchStatus } = useQuery({
    queryKey: ["/api/ai-ops/status"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: performance, refetch: refetchPerformance } = useQuery<AIOpsData>({
    queryKey: ["/api/ai-ops/performance"],
    refetchInterval: 30000,
  });

  const { data: logs } = useQuery({
    queryKey: ["/api/ai-ops/logs"],
    refetchInterval: 60000, // Refresh logs every minute
  });

  const runManualTests = async () => {
    try {
      const response = await fetch("/api/ai-ops/run-tests", { method: "POST" });
      const result = await response.json();
      if (result.success) {
        // Refresh all data after manual test
        refetchStatus();
        refetchPerformance();
      }
    } catch (error) {
      console.error("Failed to run manual tests:", error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "OK":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "ERROR":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OK":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Operational</Badge>;
      case "ERROR":
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI Ops GPT Monitoring</h2>
          <p className="text-muted-foreground">
            Autonomous agents monitoring SPIRAL platform health
          </p>
        </div>
        <Button onClick={runManualTests} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Run Tests
        </Button>
      </div>

      {/* System Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {status?.status?.totalAgents || 0}
              </div>
              <div className="text-sm text-muted-foreground">Active Agents</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {logs?.totalLogs || 0}
              </div>
              <div className="text-sm text-muted-foreground">Total Tests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {performance?.recentLogsAnalyzed || 0}
              </div>
              <div className="text-sm text-muted-foreground">Recent Tests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {status?.systemActive ? "Active" : "Inactive"}
              </div>
              <div className="text-sm text-muted-foreground">System Status</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agent Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {performance?.performance && Object.entries(performance.performance).map(([agentName, agent]) => (
          <Card key={agentName}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  {getStatusIcon(agent.lastStatus)}
                  {agentName.replace("Agent", "")}
                </span>
                {getStatusBadge(agent.lastStatus)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Success Rate</span>
                  <span className="font-semibold">{agent.successRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Tests Run</span>
                  <span className="font-semibold">{agent.totalTests}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Avg Duration</span>
                  <span className="font-semibold">{agent.averageDuration}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Last Test</span>
                  <span className="text-xs text-muted-foreground">
                    {agent.lastTestTime ? new Date(agent.lastTestTime).toLocaleTimeString() : "N/A"}
                  </span>
                </div>
                
                {/* Progress bar for success rate */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      agent.successRate >= 90 ? 'bg-green-500' :
                      agent.successRate >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${agent.successRate}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Test Results */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {logs?.logs?.slice(-10).reverse().map((log: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(log.status)}
                  <div>
                    <div className="font-medium">{log.agent.replace("Agent", "")}</div>
                    <div className="text-sm text-muted-foreground">{log.detail}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </div>
                  {log.duration && (
                    <div className="text-xs text-muted-foreground">
                      {log.duration}ms
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}