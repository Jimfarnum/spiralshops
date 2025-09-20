import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Bot, Clock, CheckCircle, AlertCircle, User, 
  Building, Mail, Phone, MapPin, Calendar,
  FileText, ShieldCheck, XCircle, Search
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminRetailerApplications = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [adminDecision, setAdminDecision] = useState('');
  const [adminReason, setAdminReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/ai-retailer-onboarding/pending-applications');
      const result = await response.json();
      
      if (result.success) {
        setApplications(result.applications);
      } else {
        toast({
          title: "Error",
          description: "Failed to load applications.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to load applications.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdminOverride = async (applicationId: number, decision: string) => {
    if (!adminReason.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for this decision.",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch(`/api/ai-retailer-onboarding/admin-override/${applicationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          decision,
          reason: adminReason
        })
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Decision Applied",
          description: `Application has been ${decision}.`,
        });
        
        // Refresh applications
        fetchApplications();
        setSelectedApp(null);
        setAdminReason('');
      } else {
        throw new Error(result.error || 'Admin override failed');
      }
    } catch (error) {
      console.error('Admin override error:', error);
      toast({
        title: "Override Failed",
        description: "Failed to apply admin decision.",
        variant: "destructive"
      });
    }
  };

  const startVerification = async (applicationId: number) => {
    try {
      const response = await fetch(`/api/ai-retailer-onboarding/verify-application/${applicationId}`, {
        method: 'POST'
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Verification Started",
          description: "AI verification process has been initiated.",
        });
        
        fetchApplications();
      } else {
        throw new Error(result.error || 'Verification failed to start');
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: "Verification Failed",
        description: "Failed to start verification process.",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'needs_review':
      case 'needs_documents': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'manual_review': return <User className="w-5 h-5 text-purple-500" />;
      default: return <Clock className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'needs_review':
      case 'needs_documents': return 'bg-yellow-100 text-yellow-800';
      case 'manual_review': return 'bg-purple-100 text-purple-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const filteredApplications = applications.filter(app =>
    app.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedByStatus = {
    pending_review: filteredApplications.filter(app => app.status === 'pending_review'),
    needs_review: filteredApplications.filter(app => app.status === 'needs_review'),
    pending_verification: filteredApplications.filter(app => app.status === 'pending_verification'),
    needs_documents: filteredApplications.filter(app => app.status === 'needs_documents'),
    manual_review: filteredApplications.filter(app => app.status === 'manual_review')
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <Bot className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p>Loading applications...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Retailer Application Management</h1>
          <p className="text-xl text-gray-600">Monitor and manage AI-powered retailer onboarding</p>
        </div>

        {/* Search and Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="md:col-span-1">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{groupedByStatus.pending_review.length}</p>
                  <p className="text-sm text-gray-600">Pending Review</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{groupedByStatus.needs_review.length + groupedByStatus.needs_documents.length}</p>
                  <p className="text-sm text-gray-600">Needs Attention</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{groupedByStatus.manual_review.length}</p>
                  <p className="text-sm text-gray-600">Manual Review</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Applications List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Pending Applications</CardTitle>
                <CardDescription>
                  {filteredApplications.length} applications found
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredApplications.length > 0 ? (
                    filteredApplications.map((app) => (
                      <div
                        key={app.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                          selectedApp?.id === app.id ? 'border-blue-500 bg-blue-50' : ''
                        }`}
                        onClick={() => setSelectedApp(app)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Building className="w-5 h-5 text-gray-500" />
                            <div>
                              <h3 className="font-semibold">{app.storeName}</h3>
                              <p className="text-sm text-gray-600">{app.category}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(app.status)}
                            <Badge className={getStatusColor(app.status)}>
                              {app.status.replace(/_/g, ' ').toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-2" />
                            {app.email}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {new Date(app.submittedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600">No applications found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Application Details */}
          <div>
            {selectedApp ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="w-5 h-5" />
                    <span>{selectedApp.storeName}</span>
                  </CardTitle>
                  <CardDescription>Application ID: {selectedApp.id}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Status */}
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedApp.status)}
                    <Badge className={getStatusColor(selectedApp.status)}>
                      {selectedApp.status.replace(/_/g, ' ').toUpperCase()}
                    </Badge>
                  </div>

                  {/* Basic Info */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{selectedApp.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Building className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{selectedApp.category}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{new Date(selectedApp.submittedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* AI Status */}
                  <div className="space-y-2">
                    <h4 className="font-semibold">AI Processing Status</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>AI Review:</span>
                        <Badge variant="outline">{selectedApp.aiReviewStatus}</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Verification:</span>
                        <Badge variant="outline">{selectedApp.verificationStatus}</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Approval:</span>
                        <Badge variant="outline">{selectedApp.approvalStatus}</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Admin Actions</h4>
                    
                    {selectedApp.status === 'pending_verification' && (
                      <Button 
                        onClick={() => startVerification(selectedApp.id)}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        <Bot className="w-4 h-4 mr-2" />
                        Start AI Verification
                      </Button>
                    )}

                    {/* Admin Override */}
                    <div className="space-y-3">
                      <Label htmlFor="adminReason">Admin Decision Reason:</Label>
                      <Textarea
                        id="adminReason"
                        value={adminReason}
                        onChange={(e) => setAdminReason(e.target.value)}
                        placeholder="Provide reason for your decision..."
                        rows={3}
                      />
                      
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          onClick={() => handleAdminOverride(selectedApp.id, 'approved')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleAdminOverride(selectedApp.id, 'rejected')}
                          variant="destructive"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center p-8">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Select an application to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRetailerApplications;