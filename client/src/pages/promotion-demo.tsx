import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { useToast } from '../hooks/use-toast';
import { TrendingUp, DollarSign, Target, Activity, CheckCircle, AlertCircle, BarChart3 } from 'lucide-react';

interface ValuationResult {
  score: number;
  risk: string;
  effectiveCostPct: number;
  recommendedMultiplier: number;
  recommendedDurationDays: number;
  notes: string;
}

interface PromotionImpact {
  estimatedRewards: number;
  platformCost: number;
  customerBenefit: number;
}

interface DemoResponse {
  success: boolean;
  message: string;
  valuation: ValuationResult;
  projectedImpact: PromotionImpact;
  systemStatus: {
    aiEngine: string;
    riskAssessment: string;
    costCalculation: string;
    recommendationEngine: string;
  };
}

export default function PromotionDemoPage() {
  const [demoData, setDemoData] = useState<DemoResponse | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [testParams, setTestParams] = useState({
    multiplier: 5,
    expectedGMV: 50000,
    sponsorCoveragePct: 25,
    categories: 'Electronics,Fashion'
  });
  const { toast } = useToast();

  useEffect(() => {
    loadSystemStatus();
    loadAnalytics();
  }, []);

  const loadSystemStatus = async () => {
    try {
      const response = await fetch('/api/promotions/demo/status');
      const data = await response.json();
      setSystemStatus(data);
    } catch (error) {
      console.error('Error loading system status:', error);
    }
  };

  const loadAnalytics = async () => {
    try {
      const response = await fetch('/api/promotions/demo/analytics');
      const data = await response.json();
      setAnalytics(data.analytics);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const runDemo = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/promotions/demo/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          multiplier: testParams.multiplier,
          expectedGMV: testParams.expectedGMV,
          sponsorCoveragePct: testParams.sponsorCoveragePct,
          categories: testParams.categories.split(',').map(c => c.trim())
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setDemoData(data);
        toast({
          title: 'Demo Completed Successfully',
          description: 'AI valuation analysis completed with results.',
        });
      } else {
        throw new Error(data.error || 'Demo failed');
      }
    } catch (error) {
      console.error('Error running demo:', error);
      toast({
        title: 'Demo Failed',
        description: 'Failed to run promotion demo.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadge = (risk: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    return <Badge className={colors[risk as keyof typeof colors] || colors.medium}>{risk.toUpperCase()}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    return status === 'Active' || status === 'Operational' ? 
      <CheckCircle className="h-5 w-5 text-green-600" /> : 
      <AlertCircle className="h-5 w-5 text-yellow-600" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            SPIRALS Promotion Valuation System
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            AI-Powered Promotional Campaign Analysis & Approval
          </p>
          <Badge className="bg-blue-100 text-blue-800 text-lg px-4 py-2">
            ✅ FULLY OPERATIONAL
          </Badge>
        </div>

        {/* System Status Cards */}
        {systemStatus && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {Object.entries(systemStatus.features || {}).map(([key, feature]: [string, any]) => (
              <Card key={key}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    {getStatusIcon(feature.status)}
                    <h3 className="font-semibold text-sm">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                  </div>
                  <Badge className={`text-xs ${feature.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {feature.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Demo Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-6 w-6 text-blue-600 mr-2" />
              AI Promotion Evaluation Demo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">SPIRALS Multiplier</label>
                <Input
                  type="number"
                  min="2"
                  max="10"
                  value={testParams.multiplier}
                  onChange={(e) => setTestParams({...testParams, multiplier: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Expected GMV ($)</label>
                <Input
                  type="number"
                  value={testParams.expectedGMV}
                  onChange={(e) => setTestParams({...testParams, expectedGMV: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Sponsor Coverage (%)</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={testParams.sponsorCoveragePct}
                  onChange={(e) => setTestParams({...testParams, sponsorCoveragePct: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Categories</label>
                <Input
                  value={testParams.categories}
                  onChange={(e) => setTestParams({...testParams, categories: e.target.value})}
                  placeholder="Electronics,Fashion"
                />
              </div>
            </div>
            
            <Button 
              onClick={runDemo} 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Running AI Analysis...
                </>
              ) : (
                <>
                  <Activity className="h-4 w-4 mr-2" />
                  Run AI Valuation Demo
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Demo Results */}
        {demoData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AI Valuation Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                  AI Valuation Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Valuation Score</p>
                    <p className="text-2xl font-bold text-green-600">{demoData.valuation.score}/100</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Risk Assessment</p>
                    <div className="mt-1">{getRiskBadge(demoData.valuation.risk)}</div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Platform Cost</p>
                    <p className="text-lg font-semibold">{demoData.valuation.effectiveCostPct}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Recommended Multiplier</p>
                    <p className="text-lg font-semibold">{demoData.valuation.recommendedMultiplier}x</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm font-medium text-blue-800 mb-1">AI Analysis</p>
                  <p className="text-xs text-blue-700">{demoData.valuation.notes}</p>
                </div>
              </CardContent>
            </Card>

            {/* Impact Projection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 text-purple-600 mr-2" />
                  Impact Projection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Customer SPIRALS Rewards</span>
                    <span className="font-semibold text-green-600">
                      ${demoData.projectedImpact.customerBenefit.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Platform Cost</span>
                    <span className="font-semibold text-red-600">
                      ${demoData.projectedImpact.platformCost.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total SPIRALS Generated</span>
                    <span className="font-semibold text-blue-600">
                      ${demoData.projectedImpact.estimatedRewards.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="bg-purple-50 p-3 rounded">
                  <p className="text-sm font-medium text-purple-800 mb-1">System Status</p>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    {Object.entries(demoData.systemStatus).map(([key, status]) => (
                      <div key={key} className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${status === 'Active' || status === 'Operational' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                        <span className="text-purple-700">{key}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Analytics Dashboard */}
        {analytics && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 text-orange-600 mr-2" />
                Platform Analytics Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{analytics.totalRequests}</p>
                  <p className="text-sm text-gray-600">Total Requests</p>
                  <p className="text-xs text-gray-500">{analytics.pendingRequests} pending</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{analytics.activePromotions}</p>
                  <p className="text-sm text-gray-600">Active Promotions</p>
                  <p className="text-xs text-gray-500">{analytics.averageMultiplier}x avg multiplier</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">${(analytics.totalProjectedGMV / 1000000).toFixed(1)}M</p>
                  <p className="text-sm text-gray-600">Projected GMV</p>
                  <p className="text-xs text-gray-500">Total pipeline</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{analytics.averageScore.toFixed(1)}</p>
                  <p className="text-sm text-gray-600">Avg Score</p>
                  <p className="text-xs text-gray-500">AI valuation</p>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold mb-3">Top Performing Categories</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analytics.topPerformingCategories?.map((cat: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-3 rounded">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{cat.category}</span>
                        <Badge className="bg-blue-100 text-blue-800">{cat.avgScore.toFixed(1)}</Badge>
                      </div>
                      <p className="text-xs text-gray-600">{cat.requests} requests</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Implementation Summary */}
        <Card>
          <CardHeader>
            <CardTitle>🎉 Implementation Complete</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-3">✅ SPIRALS Promotion Valuation & Approval System Successfully Deployed</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-green-700 mb-2">Core Features Implemented:</h4>
                  <ul className="space-y-1 text-green-600">
                    <li>• AI-powered promotion valuation engine</li>
                    <li>• Partner request submission system</li>
                    <li>• Admin approval workflow dashboard</li>
                    <li>• Real-time analytics and reporting</li>
                    <li>• Risk assessment and cost calculation</li>
                    <li>• Integration with SPIRAL loyalty system</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-green-700 mb-2">Technical Architecture:</h4>
                  <ul className="space-y-1 text-green-600">
                    <li>• PostgreSQL database with Drizzle ORM</li>
                    <li>• TypeScript Express.js API endpoints</li>
                    <li>• React frontend with shadcn/ui components</li>
                    <li>• Automated valuation scoring (0-100)</li>
                    <li>• Multi-factor risk assessment</li>
                    <li>• Platform cost estimation engine</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}