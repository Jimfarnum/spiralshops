import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AgentLeaderboard } from "./AgentLeaderboard";
import { Brain, Zap, Users, Play } from "lucide-react";

export function AgentMetricsDemo() {
  const [isRunning, setIsRunning] = useState(false);
  const [demoResults, setDemoResults] = useState<any[]>([]);

  const runDemo = async () => {
    setIsRunning(true);
    setDemoResults([]);

    // Demo agents with different performance profiles
    const demoAgents = [
      {
        agent: "Clara-Promptwright",
        role: "retailer",
        measurements: { latencyMs: 580, tokensIn: 2200, tokensOut: 450, cpuMs: 180, memMB: 320, error: false, retries: 0, escalated: false },
        rubric: { accuracy: 0.95, grounding: 0.92, reasoning: 0.90, actionable: 0.95, consistency: 0.88, safety: 1.0, reliability: 0.95, resourceDiscipline: 0.90, readiness: 0.85, handoff: 0.92, selection: 0.95, dedup: 0.88, conflictResolution: 0.85, outcomeAlignment: 0.95 }
      },
      {
        agent: "ShopperUXAgent",
        role: "shopper", 
        measurements: { latencyMs: 420, tokensIn: 1800, tokensOut: 380, cpuMs: 140, memMB: 280, error: false, retries: 0, escalated: false },
        rubric: { accuracy: 0.88, grounding: 0.85, reasoning: 0.82, actionable: 0.90, consistency: 0.85, safety: 0.95, reliability: 0.90, resourceDiscipline: 0.95, readiness: 0.88, handoff: 0.85, selection: 0.88, dedup: 0.90, conflictResolution: 0.80, outcomeAlignment: 0.88 }
      },
      {
        agent: "MallManagerAI",
        role: "mall",
        measurements: { latencyMs: 750, tokensIn: 2800, tokensOut: 520, cpuMs: 220, memMB: 450, error: false, retries: 1, escalated: false },
        rubric: { accuracy: 0.90, grounding: 0.88, reasoning: 0.85, actionable: 0.88, consistency: 0.82, safety: 0.98, reliability: 0.85, resourceDiscipline: 0.82, readiness: 0.80, handoff: 0.88, selection: 0.85, dedup: 0.82, conflictResolution: 0.88, outcomeAlignment: 0.90 }
      },
      {
        agent: "InventoryAgent",
        role: "retailer",
        measurements: { latencyMs: 1200, tokensIn: 1500, tokensOut: 200, cpuMs: 350, memMB: 180, error: true, retries: 2, escalated: false },
        rubric: { accuracy: 0.75, grounding: 0.80, reasoning: 0.70, actionable: 0.85, consistency: 0.78, safety: 0.90, reliability: 0.70, resourceDiscipline: 0.85, readiness: 0.75, handoff: 0.75, selection: 0.80, dedup: 0.85, conflictResolution: 0.70, outcomeAlignment: 0.75 }
      },
      {
        agent: "SocialMediaAI",
        role: "vendor",
        measurements: { latencyMs: 480, tokensIn: 1200, tokensOut: 300, cpuMs: 120, memMB: 200, error: false, retries: 0, escalated: false },
        rubric: { accuracy: 0.92, grounding: 0.90, reasoning: 0.88, actionable: 0.92, consistency: 0.90, safety: 0.95, reliability: 0.95, resourceDiscipline: 0.92, readiness: 0.90, handoff: 0.90, selection: 0.92, dedup: 0.95, conflictResolution: 0.88, outcomeAlignment: 0.92 }
      }
    ];

    // Submit scores with delays to simulate real performance
    for (let i = 0; i < demoAgents.length; i++) {
      const agent = demoAgents[i];
      
      try {
        const response = await fetch('/api/metrics/score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...agent,
            taskId: `demo-task-${Date.now()}-${i}`
          })
        });
        
        const result = await response.json();
        setDemoResults(prev => [...prev, result]);
        
        // Wait a bit between submissions
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error('Error submitting score:', error);
      }
    }

    setIsRunning(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-spiral-orange" />
            AI Team Performance Metrics Demo
          </CardTitle>
          <p className="text-sm text-gray-600">
            Demonstration of the "PhD + Navy SEAL" AI scoring system in action
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <Button 
              onClick={runDemo} 
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              {isRunning ? "Running Demo..." : "Run Performance Demo"}
            </Button>
            
            <div className="text-sm text-gray-600">
              <p>This will simulate 5 AI agents completing tasks with different performance profiles:</p>
              <ul className="mt-2 space-y-1">
                <li>• <strong>Clara-Promptwright:</strong> Elite performer (TER ~90+)</li>
                <li>• <strong>ShopperUXAgent:</strong> Efficient specialist (TER ~85)</li>
                <li>• <strong>MallManagerAI:</strong> Good generalist (TER ~82)</li>
                <li>• <strong>InventoryAgent:</strong> Needs improvement (TER ~75)</li>
                <li>• <strong>SocialMediaAI:</strong> Strong performer (TER ~88)</li>
              </ul>
            </div>
          </div>

          {demoResults.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold mb-3">Demo Results:</h4>
              <div className="space-y-2">
                {demoResults.map((result, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{result.agent}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">C: {result.cognition}</Badge>
                      <Badge variant="outline">E: {result.efficiency}</Badge>
                      <Badge variant="outline">T: {result.teamwork}</Badge>
                      <Badge className={`${
                        result.TER >= 90 ? 'bg-green-500' : 
                        result.TER >= 85 ? 'bg-blue-500' : 
                        result.TER >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                      } text-white`}>
                        TER: {result.TER}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Real-time leaderboard */}
      <AgentLeaderboard />

      {/* Scoring rubric reference */}
      <Card>
        <CardHeader>
          <CardTitle>TER Scoring Standards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-spiral-orange" />
                <h4 className="font-semibold">PhD-Level Cognition (40%)</h4>
              </div>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Accuracy & Grounding</span>
                  <span className="text-gray-500">30%</span>
                </div>
                <div className="flex justify-between">
                  <span>Reasoning Depth</span>
                  <span className="text-gray-500">25%</span>
                </div>
                <div className="flex justify-between">
                  <span>Actionability</span>
                  <span className="text-gray-500">20%</span>
                </div>
                <div className="flex justify-between">
                  <span>Consistency & Style</span>
                  <span className="text-gray-500">15%</span>
                </div>
                <div className="flex justify-between">
                  <span>Safety & Privacy</span>
                  <span className="text-gray-500">10%</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-spiral-orange" />
                <h4 className="font-semibold">Navy SEAL Efficiency (35%)</h4>
              </div>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Latency (≤600ms)</span>
                  <span className="text-gray-500">25%</span>
                </div>
                <div className="flex justify-between">
                  <span>Success Rate</span>
                  <span className="text-gray-500">25%</span>
                </div>
                <div className="flex justify-between">
                  <span>Resource Discipline</span>
                  <span className="text-gray-500">20%</span>
                </div>
                <div className="flex justify-between">
                  <span>Reliability</span>
                  <span className="text-gray-500">20%</span>
                </div>
                <div className="flex justify-between">
                  <span>Operational Readiness</span>
                  <span className="text-gray-500">10%</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-spiral-orange" />
                <h4 className="font-semibold">Team Coordination (25%)</h4>
              </div>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Handoff Quality</span>
                  <span className="text-gray-500">35%</span>
                </div>
                <div className="flex justify-between">
                  <span>Tool/Agent Selection</span>
                  <span className="text-gray-500">25%</span>
                </div>
                <div className="flex justify-between">
                  <span>Duplicate Avoidance</span>
                  <span className="text-gray-500">15%</span>
                </div>
                <div className="flex justify-between">
                  <span>Conflict Resolution</span>
                  <span className="text-gray-500">15%</span>
                </div>
                <div className="flex justify-between">
                  <span>Outcome Alignment</span>
                  <span className="text-gray-500">10%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-spiral-teal/10 rounded-lg">
            <h4 className="font-semibold text-spiral-teal mb-2">Performance Standards</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <Badge className="bg-green-500 text-white mb-1">Excellent</Badge>
                <p>TER ≥ 90</p>
              </div>
              <div>
                <Badge className="bg-blue-500 text-white mb-1">Good</Badge>
                <p>TER 85-89</p>
              </div>
              <div>
                <Badge className="bg-yellow-500 text-white mb-1">Acceptable</Badge>
                <p>TER 70-84</p>
              </div>
              <div>
                <Badge className="bg-red-500 text-white mb-1">Needs Work</Badge>
                <p>TER &lt; 70</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}