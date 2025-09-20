import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Activity, Target } from "lucide-react";

interface LeaderboardEntry {
  agent: string;
  TER: number;
  totalTasks: number;
  lastScore: number;
}

interface DashboardStats {
  totalTasks: number;
  averageTER: number;
  topAgent: string;
  topAgentTER: number;
  healthStatus: string;
}

export function AgentLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [dashboard, setDashboard] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leaderboardRes, dashboardRes] = await Promise.all([
          fetch("/api/metrics/leaderboard"),
          fetch("/api/metrics/dashboard")
        ]);
        
        const leaderboardData = await leaderboardRes.json();
        const dashboardData = await dashboardRes.json();
        
        setLeaderboard(leaderboardData.leaderboard || []);
        setDashboard(dashboardData);
      } catch (error) {
        console.error("Failed to fetch metrics:", error);
        setLeaderboard([]);
        setDashboard(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getTERBadgeColor = (ter: number) => {
    if (ter >= 90) return "bg-green-500";
    if (ter >= 85) return "bg-blue-500";
    if (ter >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case "Excellent": return "text-green-600";
      case "Good": return "text-blue-600";
      default: return "text-yellow-600";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-spiral-orange"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Stats */}
      {dashboard && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-spiral-orange" />
                <div>
                  <p className="text-sm text-gray-600">Total Tasks</p>
                  <p className="text-2xl font-bold">{dashboard.totalTasks}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-spiral-orange" />
                <div>
                  <p className="text-sm text-gray-600">Average TER</p>
                  <p className="text-2xl font-bold">{dashboard.averageTER}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Trophy className="h-4 w-4 text-spiral-orange" />
                <div>
                  <p className="text-sm text-gray-600">Top Agent</p>
                  <p className="text-lg font-bold">{dashboard.topAgent}</p>
                  <p className="text-sm text-gray-500">TER: {dashboard.topAgentTER}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-spiral-orange" />
                <div>
                  <p className="text-sm text-gray-600">Team Health</p>
                  <p className={`text-lg font-bold ${getHealthColor(dashboard.healthStatus)}`}>
                    {dashboard.healthStatus}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-spiral-orange" />
            AI Team Efficiency Rating (TER)
          </CardTitle>
          <p className="text-sm text-gray-600">
            PhD-level cognition + Navy SEAL efficiency + Team coordination
          </p>
        </CardHeader>
        <CardContent>
          {leaderboard.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No agent performance data yet. Start using AI agents to see metrics.
            </p>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((entry, index) => (
                <div key={entry.agent} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{entry.agent}</p>
                      <p className="text-sm text-gray-500">
                        {entry.totalTasks} tasks completed
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      className={`${getTERBadgeColor(entry.TER)} text-white`}
                    >
                      TER: {entry.TER}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      Last: {entry.lastScore}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scoring Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">TER Scoring Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-spiral-orange mb-2">Cognition (40%)</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Accuracy & Grounding (30%)</li>
                <li>• Reasoning Depth (25%)</li>
                <li>• Actionability (20%)</li>
                <li>• Consistency & Style (15%)</li>
                <li>• Safety & Privacy (10%)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-spiral-orange mb-2">Efficiency (35%)</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Latency (25%)</li>
                <li>• Success Rate (25%)</li>
                <li>• Resource Discipline (20%)</li>
                <li>• Reliability (20%)</li>
                <li>• Operational Readiness (10%)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-spiral-orange mb-2">Teamwork (25%)</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Handoff Quality (35%)</li>
                <li>• Tool/Agent Selection (25%)</li>
                <li>• Duplicate Avoidance (15%)</li>
                <li>• Conflict Resolution (15%)</li>
                <li>• Outcome Alignment (10%)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}