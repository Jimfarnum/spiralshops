import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from '../hooks/use-toast';
import { CheckCircle, XCircle, AlertTriangle, DollarSign, Calendar, Users, TrendingUp } from 'lucide-react';

interface PromotionRequest {
  id: number;
  requesterType: string;
  requesterName: string;
  contactEmail: string;
  desiredMultiplier: string;
  desiredStartsAt: string;
  desiredEndsAt: string;
  expectedGMV: string;
  sponsorCoveragePct: string;
  status: string;
  valuationScore: string;
  valuationRisk: string;
  effectiveCostPct: string;
  recommendedMultiplier: string;
  recommendedDurationDays: number;
  valuationNotes: string;
  createdAt: string;
}

interface Promotion {
  id: number;
  code: string;
  name: string;
  multiplier: string;
  partners: string[];
  categories: string[];
  storeIds: string[];
  mallIds: string[];
  startsAt: string;
  endsAt: string;
  active: boolean;
  projectedImpact?: {
    estimatedRewards: number;
    platformCost: number;
    customerBenefit: number;
  };
}

interface Analytics {
  requests: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    averageScore: number;
  };
  promotions: {
    active: number;
    totalProjectedGMV: number;
    averageMultiplier: number;
  };
  risk: {
    high: number;
    medium: number;
    low: number;
  };
}

export default function PromotionAdminDashboard() {
  const [requests, setRequests] = useState<PromotionRequest[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<PromotionRequest | null>(null);
  const [approvalData, setApprovalData] = useState({
    code: '',
    overrideMultiplier: '',
    overrideStartsAt: '',
    overrideEndsAt: '',
    adminNotes: ''
  });
  const [rejectionReason, setRejectionReason] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const adminKey = localStorage.getItem('spiral_admin_key') || process.env.VITE_ADMIN_KEY;
      
      if (!adminKey) {
        toast({
          title: 'Admin Access Required',
          description: 'Please set your admin key in localStorage as spiral_admin_key',
          variant: 'destructive'
        });
        return;
      }

      const headers = { 'x-admin-key': adminKey };

      // Load all data in parallel
      const [requestsRes, promotionsRes, analyticsRes] = await Promise.all([
        fetch('/api/admin/promotions/requests', { headers }),
        fetch('/api/admin/promotions/promotions', { headers }),
        fetch('/api/admin/promotions/analytics', { headers })
      ]);

      if (requestsRes.ok) {
        const requestsData = await requestsRes.json();
        setRequests(requestsData.requests || []);
      }

      if (promotionsRes.ok) {
        const promotionsData = await promotionsRes.json();
        setPromotions(promotionsData.promotions || []);
      }

      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        setAnalytics(analyticsData.analytics);
      }

    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load promotion data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const revalueRequest = async (requestId: number) => {
    try {
      const adminKey = localStorage.getItem('spiral_admin_key') || process.env.VITE_ADMIN_KEY;
      const response = await fetch(`/api/admin/promotions/requests/${requestId}/revalue`, {
        method: 'POST',
        headers: { 'x-admin-key': adminKey || '' }
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Request revalued successfully'
        });
        loadData();
      } else {
        throw new Error('Failed to revalue request');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to revalue request',
        variant: 'destructive'
      });
    }
  };

  const approveRequest = async () => {
    if (!selectedRequest || !approvalData.code) {
      toast({
        title: 'Error',
        description: 'Please fill in the promotion code',
        variant: 'destructive'
      });
      return;
    }

    try {
      const adminKey = localStorage.getItem('spiral_admin_key') || process.env.VITE_ADMIN_KEY;
      const response = await fetch(`/api/admin/promotions/requests/${selectedRequest.id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey || ''
        },
        body: JSON.stringify(approvalData)
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Request approved and promotion created'
        });
        setSelectedRequest(null);
        setApprovalData({ code: '', overrideMultiplier: '', overrideStartsAt: '', overrideEndsAt: '', adminNotes: '' });
        loadData();
      } else {
        throw new Error('Failed to approve request');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve request',
        variant: 'destructive'
      });
    }
  };

  const rejectRequest = async (requestId: number) => {
    try {
      const adminKey = localStorage.getItem('spiral_admin_key') || process.env.VITE_ADMIN_KEY;
      const response = await fetch(`/api/admin/promotions/requests/${requestId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey || ''
        },
        body: JSON.stringify({ reason: rejectionReason })
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Request rejected'
        });
        setRejectionReason('');
        loadData();
      } else {
        throw new Error('Failed to reject request');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject request',
        variant: 'destructive'
      });
    }
  };

  const togglePromotion = async (code: string) => {
    try {
      const adminKey = localStorage.getItem('spiral_admin_key') || process.env.VITE_ADMIN_KEY;
      const response = await fetch(`/api/admin/promotions/promotions/${code}/toggle`, {
        method: 'POST',
        headers: { 'x-admin-key': adminKey || '' }
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Promotion status updated'
        });
        loadData();
      } else {
        throw new Error('Failed to toggle promotion');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update promotion status',
        variant: 'destructive'
      });
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

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return <Badge className={colors[status as keyof typeof colors] || colors.pending}>{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading promotion dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">SPIRALS Promotion Management</h1>
        <Button onClick={loadData} variant="outline">Refresh Data</Button>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold">{analytics.requests.total}</p>
                  <p className="text-xs text-gray-500">{analytics.requests.pending} pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Active Promotions</p>
                  <p className="text-2xl font-bold">{analytics.promotions.active}</p>
                  <p className="text-xs text-gray-500">{analytics.promotions.averageMultiplier.toFixed(1)}x avg multiplier</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Projected GMV</p>
                  <p className="text-2xl font-bold">${(analytics.promotions.totalProjectedGMV / 1000000).toFixed(1)}M</p>
                  <p className="text-xs text-gray-500">Total pipeline</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Risk Distribution</p>
                  <div className="flex space-x-1 text-sm">
                    <span className="text-green-600">{analytics.risk.low}L</span>
                    <span className="text-yellow-600">{analytics.risk.medium}M</span>
                    <span className="text-red-600">{analytics.risk.high}H</span>
                  </div>
                  <p className="text-xs text-gray-500">Low/Med/High risk</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="requests">Promotion Requests</TabsTrigger>
          <TabsTrigger value="promotions">Active Promotions</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Partner Promotion Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {requests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{request.requesterName}</h3>
                        <p className="text-sm text-gray-600">{request.contactEmail} • {request.requesterType}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(request.status)}
                        {getRiskBadge(request.valuationRisk)}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Desired Multiplier</p>
                        <p className="font-semibold">{request.desiredMultiplier}x</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Expected GMV</p>
                        <p className="font-semibold">${Number(request.expectedGMV).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Sponsor Coverage</p>
                        <p className="font-semibold">{request.sponsorCoveragePct}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Valuation Score</p>
                        <p className="font-semibold">{request.valuationScore}/100</p>
                      </div>
                    </div>

                    <div className="text-sm">
                      <p className="text-gray-600">Duration</p>
                      <p>{new Date(request.desiredStartsAt).toLocaleDateString()} - {new Date(request.desiredEndsAt).toLocaleDateString()}</p>
                    </div>

                    <div className="text-sm">
                      <p className="text-gray-600">AI Analysis</p>
                      <p className="text-xs bg-gray-50 p-2 rounded">{request.valuationNotes}</p>
                    </div>

                    {request.status === 'pending' && (
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          onClick={() => setSelectedRequest(request)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => rejectRequest(request.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => revalueRequest(request.id)}
                        >
                          Re-evaluate
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="promotions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Promotions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {promotions.map((promotion) => (
                  <div key={promotion.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{promotion.name}</h3>
                        <p className="text-sm text-gray-600">Code: {promotion.code}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={promotion.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {promotion.active ? 'ACTIVE' : 'INACTIVE'}
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => togglePromotion(promotion.code)}
                        >
                          {promotion.active ? 'Deactivate' : 'Activate'}
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Multiplier</p>
                        <p className="font-semibold">{promotion.multiplier}x</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Partners</p>
                        <p className="font-semibold">{promotion.partners.length} partners</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Categories</p>
                        <p className="font-semibold">{promotion.categories.length} categories</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Duration</p>
                        <p className="font-semibold">
                          {new Date(promotion.startsAt).toLocaleDateString()} - {new Date(promotion.endsAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {promotion.projectedImpact && (
                      <div className="bg-blue-50 p-3 rounded text-sm">
                        <p className="font-semibold text-blue-800 mb-1">Projected Impact (per $100K GMV)</p>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-blue-600">Customer Rewards</p>
                            <p className="font-semibold">${promotion.projectedImpact.customerBenefit.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-blue-600">Platform Cost</p>
                            <p className="font-semibold">${promotion.projectedImpact.platformCost.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-blue-600">Total Rewards</p>
                            <p className="font-semibold">${promotion.projectedImpact.estimatedRewards.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Approval Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Approve Promotion Request</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Requester: {selectedRequest.requesterName}</p>
                <p className="text-sm text-gray-600">Score: {selectedRequest.valuationScore}/100 • Risk: {selectedRequest.valuationRisk}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Promotion Code *</label>
                  <Input
                    value={approvalData.code}
                    onChange={(e) => setApprovalData({...approvalData, code: e.target.value})}
                    placeholder="e.g., SUMMER2025"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Override Multiplier (optional)</label>
                    <Input
                      type="number"
                      min="2"
                      max="10"
                      step="0.1"
                      value={approvalData.overrideMultiplier}
                      onChange={(e) => setApprovalData({...approvalData, overrideMultiplier: e.target.value})}
                      placeholder={`Recommended: ${selectedRequest.recommendedMultiplier}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Recommended Duration</label>
                    <Input
                      value={`${selectedRequest.recommendedDurationDays} days`}
                      disabled
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Admin Notes</label>
                  <Textarea
                    value={approvalData.adminNotes}
                    onChange={(e) => setApprovalData({...approvalData, adminNotes: e.target.value})}
                    placeholder="Internal notes about this approval..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button onClick={approveRequest} className="bg-green-600 hover:bg-green-700">
                  Approve & Create Promotion
                </Button>
                <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}