import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Play, 
  FileText, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Brain,
  Zap,
  Eye,
  Target,
  BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RDReport {
  generated: string;
  platform: string;
  total_items: number;
  decisions: {
    initiate: number;
    watch: number;
    discard: number;
  };
  items: RDItem[];
}

interface RDItem {
  title: string;
  url: string;
  source: string;
  topic: string;
  summary: string;
  key_points: string[];
  scores: {
    relevance_0_5: number;
    impact_now_0_5: number;
    impact_12mo_0_5: number;
    effort_low_med_high: string;
    legal_risk_low_med_high: string;
  };
  recommendations: string[];
  next_actions: Array<{
    title: string;
    owner_role: string;
    eta_days: number;
  }>;
  decision: string;
  rationale: string;
}

interface Ticket {
  filename: string;
  title: string;
  created: string;
  modified: string;
  content: string;
}

export default function TechWatchDashboard() {
  const [report, setReport] = useState<RDReport | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  useEffect(() => {
    fetchLatestReport();
    fetchTickets();
    fetchStatus();
  }, []);

  const fetchLatestReport = async () => {
    try {
      const response = await fetch('/api/rd-agent/report/latest');
      if (response.ok) {
        const data = await response.json();
        setReport(data.report);
      }
    } catch (error) {
      console.error('Failed to fetch report:', error);
    }
  };

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/rd-agent/tickets');
      if (response.ok) {
        const data = await response.json();
        setTickets(data.tickets);
      }
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    }
  };

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/rd-agent/status');
      if (response.ok) {
        const data = await response.json();
        setStatus(data.status);
      }
    } catch (error) {
      console.error('Failed to fetch status:', error);
    }
  };

  const runAnalysis = async () => {
    setIsRunning(true);
    try {
      const response = await fetch('/api/rd-agent/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Analysis Complete",
          description: `Processed ${data.results.summary.total} items, created ${data.results.ticketCount} tickets.`,
        });
        
        // Refresh data
        await fetchLatestReport();
        await fetchTickets();
      } else {
        const error = await response.json();
        toast({
          title: "Analysis Failed",
          description: error.message || "Unknown error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to run R&D analysis",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const getDecisionBadge = (decision: string) => {
    switch (decision) {
      case 'INITIATE':
        return <Badge className="bg-green-500 text-white"><CheckCircle className="w-3 h-3 mr-1" />INITIATE</Badge>;
      case 'WATCH':
        return <Badge className="bg-yellow-500 text-white"><Eye className="w-3 h-3 mr-1" />WATCH</Badge>;
      case 'DISCARD':
        return <Badge className="bg-red-500 text-white"><XCircle className="w-3 h-3 mr-1" />DISCARD</Badge>;
      default:
        return <Badge variant="outline">{decision}</Badge>;
    }
  };

  const getEffortBadge = (effort: string) => {
    const colors: { [key: string]: string } = {
      low: 'bg-green-100 text-green-800',
      med: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    return <Badge className={colors[effort] || 'bg-gray-100 text-gray-800'}>{effort.toUpperCase()}</Badge>;
  };

  const getRiskBadge = (risk: string) => {
    const colors: { [key: string]: string } = {
      low: 'bg-green-100 text-green-800',
      med: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    return <Badge className={colors[risk] || 'bg-gray-100 text-gray-800'}>{risk.toUpperCase()} RISK</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Brain className="w-8 h-8 mr-3 text-blue-600" />
            SPIRAL AI R&D Agent
          </h1>
          <p className="text-gray-600 mt-2">
            Intelligent technology analysis, decision-making, and implementation planning
          </p>
        </div>
        <Button 
          onClick={runAnalysis} 
          disabled={isRunning}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Play className="w-4 h-4 mr-2" />
          {isRunning ? 'Analyzing...' : 'Run Analysis'}
        </Button>
      </div>

      {status && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{status.reports_generated}</div>
                <div className="text-sm text-gray-600">Reports Generated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{status.tickets_created}</div>
                <div className="text-sm text-gray-600">Tickets Created</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {status.capabilities?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Capabilities</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <div className="text-sm font-medium">Active</div>
                </div>
                <div className="text-xs text-gray-600">Agent Status</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="analysis">
            <Brain className="w-4 h-4 mr-2" />
            Analysis
          </TabsTrigger>
          <TabsTrigger value="tickets">
            <Target className="w-4 h-4 mr-2" />
            Tickets
          </TabsTrigger>
          <TabsTrigger value="reports">
            <FileText className="w-4 h-4 mr-2" />
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {report && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                    Ready to Implement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {report.decisions.initiate}
                  </div>
                  <p className="text-sm text-gray-600">
                    High-impact items approved for implementation
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Eye className="w-5 h-5 mr-2 text-yellow-500" />
                    Monitoring
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-600 mb-2">
                    {report.decisions.watch}
                  </div>
                  <p className="text-sm text-gray-600">
                    Items under observation for development
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <XCircle className="w-5 h-5 mr-2 text-red-500" />
                    Filtered Out
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600 mb-2">
                    {report.decisions.discard}
                  </div>
                  <p className="text-sm text-gray-600">
                    Items deemed not relevant
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {report && (
            <Card>
              <CardHeader>
                <CardTitle>Latest Analysis Summary</CardTitle>
                <p className="text-sm text-gray-600">
                  Generated: {new Date(report.generated).toLocaleString()}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">Implementation Ready Items</h4>
                    {report.items
                      .filter(item => item.decision === 'INITIATE')
                      .slice(0, 3)
                      .map((item, index) => (
                        <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                          <h5 className="font-medium">{item.title}</h5>
                          <p className="text-sm text-gray-600">{item.summary}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge className="text-xs">
                              Relevance: {item.scores.relevance_0_5}/5
                            </Badge>
                            <Badge className="text-xs">
                              Impact: {item.scores.impact_now_0_5}/5
                            </Badge>
                            {getEffortBadge(item.scores.effort_low_med_high)}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          {report && (
            <div className="space-y-4">
              {report.items.map((item, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          {item.source} • {item.topic}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {getDecisionBadge(item.decision)}
                        {getEffortBadge(item.scores.effort_low_med_high)}
                        {getRiskBadge(item.scores.legal_risk_low_med_high)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm">{item.summary}</p>
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-semibold text-blue-600">
                          {item.scores.relevance_0_5}/5
                        </div>
                        <div className="text-xs text-gray-600">Relevance</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-green-600">
                          {item.scores.impact_now_0_5}/5
                        </div>
                        <div className="text-xs text-gray-600">Immediate Impact</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-purple-600">
                          {item.scores.impact_12mo_0_5}/5
                        </div>
                        <div className="text-xs text-gray-600">12-Month Impact</div>
                      </div>
                    </div>

                    {item.key_points.length > 0 && (
                      <div>
                        <h5 className="font-medium mb-2">Key Points</h5>
                        <ul className="list-disc list-inside space-y-1">
                          {item.key_points.map((point, i) => (
                            <li key={i} className="text-sm text-gray-700">{point}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {item.recommendations.length > 0 && (
                      <div>
                        <h5 className="font-medium mb-2">Recommendations</h5>
                        <ul className="list-disc list-inside space-y-1">
                          {item.recommendations.map((rec, i) => (
                            <li key={i} className="text-sm text-gray-700">{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {item.next_actions.length > 0 && (
                      <div>
                        <h5 className="font-medium mb-2">Next Actions</h5>
                        <div className="space-y-2">
                          {item.next_actions.map((action, i) => (
                            <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span className="text-sm">{action.title}</span>
                              <div className="flex gap-2">
                                <Badge variant="outline">{action.owner_role}</Badge>
                                <Badge variant="outline">{action.eta_days} days</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="border-t pt-4">
                      <h5 className="font-medium mb-2">Rationale</h5>
                      <p className="text-sm text-gray-700">{item.rationale}</p>
                    </div>

                    <div className="text-xs text-gray-500">
                      <a href={item.url} target="_blank" rel="noopener noreferrer" 
                         className="hover:text-blue-600 underline">
                        View Source
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="tickets" className="space-y-4">
          <div className="grid gap-4">
            {tickets.map((ticket, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{ticket.title}</CardTitle>
                    <div className="text-sm text-gray-500">
                      {new Date(ticket.created).toLocaleDateString()}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-40">
                    <pre className="text-sm whitespace-pre-wrap font-mono">
                      {ticket.content}
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analysis Reports</CardTitle>
              <p className="text-sm text-gray-600">
                Historical R&D analysis reports and recommendations
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4" />
                <p>Report history will appear here after multiple analysis runs</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}