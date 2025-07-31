import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Shield, Users, FileCheck, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface RetailerApplication {
  id: string;
  name: string;
  address: string;
  category: string;
  storePhotoURL: string;
  licenseDocURL: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  feedback?: string;
  submittedAt: string;
  businessEmail: string;
  phone: string;
}

interface AIReviewResult {
  status: 'approved' | 'rejected' | 'under_review';
  confidence: number;
  feedback: string;
  reasoning: string[];
}

const AdminDashboard = () => {
  const [applications, setApplications] = useState<RetailerApplication[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/pending-retailers');
      const data = await response.json();
      setApplications(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch retailer applications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAIReview = async (appId: string, applicationData: RetailerApplication) => {
    setReviewingId(appId);
    try {
      // First, run AI review
      const reviewResponse = await fetch('/api/review-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData)
      });

      if (!reviewResponse.ok) {
        throw new Error('AI review failed');
      }

      const reviewResult: AIReviewResult = await reviewResponse.json();

      // Update retailer status based on AI decision
      const statusResponse = await fetch('/api/set-retailer-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: appId,
          status: reviewResult.status,
          feedback: reviewResult.feedback,
          aiReviewed: true,
          confidence: reviewResult.confidence
        })
      });

      if (!statusResponse.ok) {
        throw new Error('Failed to update retailer status');
      }

      // Update local state
      setApplications(prev => prev.map(app => 
        app.id === appId 
          ? { ...app, status: reviewResult.status, feedback: reviewResult.feedback }
          : app
      ));

      setMessage(`✅ ${applicationData.name}: ${reviewResult.status} (${Math.round(reviewResult.confidence * 100)}% confidence)`);
      
      toast({
        title: "AI Review Complete",
        description: `${applicationData.name} has been ${reviewResult.status}`,
        variant: reviewResult.status === 'approved' ? 'default' : 'destructive'
      });

    } catch (error) {
      setMessage('⚠️ AI Review failed');
      toast({
        title: "Review Failed",
        description: "Unable to complete AI review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setReviewingId(null);
    }
  };

  const handleManualReview = async (appId: string, decision: 'approved' | 'rejected', feedback: string) => {
    try {
      const response = await fetch('/api/set-retailer-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: appId,
          status: decision,
          feedback,
          manualReview: true
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      setApplications(prev => prev.map(app => 
        app.id === appId 
          ? { ...app, status: decision, feedback }
          : app
      ));

      toast({
        title: "Manual Review Complete",
        description: `Application has been ${decision}`,
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      case 'under_review':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Under Review</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    }
  };

  const pendingApps = applications.filter(app => app.status === 'pending');
  const reviewedApps = applications.filter(app => app.status !== 'pending');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 mx-auto text-blue-600 mb-4 animate-spin" />
          <h2 className="text-xl font-semibold">Loading Applications...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-600 flex items-center">
            <Shield className="h-8 w-8 mr-3" />
            SPIRAL Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Manage retailer applications with AI-powered review system</p>
          {message && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800">{message}</p>
            </div>
          )}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-blue-600">{applications.length}</p>
                </div>
                <FileCheck className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-orange-600">{pendingApps.length}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600">
                    {applications.filter(app => app.status === 'approved').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">
                    {applications.filter(app => app.status === 'rejected').length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pending">Pending Applications ({pendingApps.length})</TabsTrigger>
            <TabsTrigger value="reviewed">Reviewed Applications ({reviewedApps.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-6">
            {pendingApps.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileCheck className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No Pending Applications</h3>
                  <p className="text-gray-500">All retailer applications have been reviewed.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {pendingApps.map((app) => (
                  <Card key={app.id} className="overflow-hidden">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{app.name}</CardTitle>
                          <CardDescription>{app.address} | {app.category}</CardDescription>
                        </div>
                        {getStatusBadge(app.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p><strong>Email:</strong> {app.businessEmail}</p>
                          <p><strong>Phone:</strong> {app.phone}</p>
                          <p><strong>Submitted:</strong> {new Date(app.submittedAt).toLocaleDateString()}</p>
                        </div>
                        <div className="space-y-2">
                          {app.storePhotoURL && (
                            <div>
                              <p className="text-sm font-medium mb-2">Store Photo:</p>
                              <img 
                                src={app.storePhotoURL} 
                                alt="Storefront" 
                                className="w-48 h-32 object-cover rounded-lg border"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {app.licenseDocURL && (
                        <div>
                          <p className="text-sm font-medium mb-2">Business License:</p>
                          <Button variant="outline" size="sm" asChild>
                            <a href={app.licenseDocURL} target="_blank" rel="noreferrer">
                              View Document
                            </a>
                          </Button>
                        </div>
                      )}

                      <div className="flex space-x-3 pt-4 border-t">
                        <Button 
                          onClick={() => handleAIReview(app.id, app)}
                          disabled={reviewingId === app.id}
                          className="flex-1"
                        >
                          {reviewingId === app.id ? (
                            <>
                              <Clock className="h-4 w-4 mr-2 animate-spin" />
                              AI Reviewing...
                            </>
                          ) : (
                            <>
                              <Shield className="h-4 w-4 mr-2" />
                              Run AI Review
                            </>
                          )}
                        </Button>
                        
                        <Button 
                          variant="outline"
                          onClick={() => handleManualReview(app.id, 'approved', 'Manually approved by admin')}
                          disabled={reviewingId === app.id}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        
                        <Button 
                          variant="destructive"
                          onClick={() => handleManualReview(app.id, 'rejected', 'Manually rejected by admin')}
                          disabled={reviewingId === app.id}
                        >
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviewed" className="space-y-6">
            {reviewedApps.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No Reviewed Applications</h3>
                  <p className="text-gray-500">Applications will appear here after review.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {reviewedApps.map((app) => (
                  <Card key={app.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">{app.name}</h3>
                          <p className="text-gray-600">{app.address} | {app.category}</p>
                          {app.feedback && (
                            <p className="text-sm text-gray-500 mt-2"><strong>Feedback:</strong> {app.feedback}</p>
                          )}
                        </div>
                        <div className="text-right">
                          {getStatusBadge(app.status)}
                          <p className="text-xs text-gray-500 mt-1">
                            Reviewed: {new Date(app.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;