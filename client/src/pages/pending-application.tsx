import React, { useState, useEffect } from 'react';
import { useParams } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Bot, Clock, CheckCircle, AlertCircle, Upload, FileText, 
  MapPin, Phone, Mail, Building, Calendar, User
} from 'lucide-react';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';

const PendingApplication = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [resubmitting, setResubmitting] = useState(false);
  const [additionalFiles, setAdditionalFiles] = useState<{[key: string]: File | null}>({
    businessLicense: null,
    utilityBill: null,
    additionalDoc: null
  });

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const fetchApplication = async () => {
    try {
      const response = await fetch(`/api/ai-retailer-onboarding/application/${id}`);
      const result = await response.json();
      
      if (result.success) {
        setApplication(result.application);
      } else {
        toast({
          title: "Application Not Found",
          description: "The application you're looking for doesn't exist.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error fetching application:', error);
      toast({
        title: "Error",
        description: "Failed to load application details.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (field: string, file: File | null) => {
    setAdditionalFiles(prev => ({ ...prev, [field]: file }));
  };

  const resubmitDocuments = async () => {
    if (Object.values(additionalFiles).every(file => !file)) {
      toast({
        title: "No Files Selected",
        description: "Please select at least one document to resubmit.",
        variant: "destructive"
      });
      return;
    }

    setResubmitting(true);

    try {
      const formData = new FormData();
      
      Object.entries(additionalFiles).forEach(([key, file]) => {
        if (file) {
          formData.append(key, file);
        }
      });

      const response = await fetch(`/api/ai-retailer-onboarding/resubmit-documents/${id}`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Documents Resubmitted",
          description: "Your documents have been resubmitted for verification.",
        });
        
        // Refresh application data
        fetchApplication();
        
        // Clear file selections
        setAdditionalFiles({
          businessLicense: null,
          utilityBill: null,
          additionalDoc: null
        });
      } else {
        throw new Error(result.error || 'Resubmission failed');
      }
    } catch (error) {
      console.error('Resubmission error:', error);
      toast({
        title: "Resubmission Failed",
        description: "There was an error resubmitting your documents. Please try again.",
        variant: "destructive"
      });
    } finally {
      setResubmitting(false);
    }
  };

  const startVerification = async () => {
    try {
      const response = await fetch(`/api/ai-retailer-onboarding/verify-application/${id}`, {
        method: 'POST'
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Verification Started",
          description: "Our AI agent is now verifying your documents.",
        });
        
        // Refresh application data
        fetchApplication();
      } else {
        throw new Error(result.error || 'Verification failed to start');
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: "Verification Failed",
        description: "Failed to start verification process. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'needs_review':
      case 'needs_documents': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
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

  const getProgressValue = () => {
    if (!application) return 0;
    switch (application.status) {
      case 'pending_review': return 25;
      case 'needs_review': return 25;
      case 'pending_verification': return 50;
      case 'needs_documents': return 50;
      case 'approved': return 100;
      case 'rejected': return 100;
      case 'manual_review': return 75;
      default: return 0;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <Clock className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p>Loading application details...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="text-center p-8">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-semibold mb-2">Application Not Found</h3>
            <p className="text-gray-600 mb-4">The application you're looking for doesn't exist.</p>
            <Link href="/">
              <Button>Return Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Application Status</h1>
          <p className="text-xl text-gray-600">Application ID: {application.id}</p>
        </div>

        {/* Progress Bar */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">Application Progress</span>
              <span className="text-sm text-gray-500">{getProgressValue()}% Complete</span>
            </div>
            <Progress value={getProgressValue()} className="mb-4" />
            
            <div className="flex items-center space-x-4">
              {getStatusIcon(application.status)}
              <Badge className={getStatusColor(application.status)}>
                {application.status.replace(/_/g, ' ').toUpperCase()}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="status" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="details">Application Details</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="status">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bot className="w-6 h-6 text-blue-600" />
                  <span>AI Review Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* AI Review Results */}
                {application.aiReview && (
                  <Alert>
                    <Bot className="h-4 w-4" />
                    <AlertDescription className="text-base">
                      <strong>SPIRAL Agent v1:</strong> {application.aiReview.message}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Verification Results */}
                {application.verificationResult && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription className="text-base">
                      <strong>Verification Agent:</strong> {application.verificationResult.message}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Approval Results */}
                {application.approvalResult && (
                  <Alert>
                    <User className="h-4 w-4" />
                    <AlertDescription className="text-base">
                      <strong>Approval Decision:</strong> {application.approvalResult.reasoning}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Issues */}
                {application.aiReview?.issues && application.aiReview.issues.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-red-600 mb-2">Issues to Address:</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {application.aiReview.issues.map((issue: string, index: number) => (
                        <li key={index} className="text-red-600">{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Requests */}
                {application.aiReview?.requests && application.aiReview.requests.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-600 mb-2">Additional Information Needed:</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {application.aiReview.requests.map((request: string, index: number) => (
                        <li key={index} className="text-yellow-600">{request}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Application Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Building className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">{application.storeName}</p>
                      <p className="text-sm text-gray-500">Store Name</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">{application.email}</p>
                      <p className="text-sm text-gray-500">Email</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">{application.phone}</p>
                      <p className="text-sm text-gray-500">Phone</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">{application.address}</p>
                      <p className="text-sm text-gray-500">Address</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Building className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">{application.category}</p>
                      <p className="text-sm text-gray-500">Category</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">{application.hours}</p>
                      <p className="text-sm text-gray-500">Hours</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="font-medium mb-2">Description:</p>
                  <p className="text-gray-700">{application.description}</p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium">{new Date(application.submittedAt).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-500">Submitted</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Uploaded Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {application.documents && application.documents.length > 0 ? (
                    application.documents.map((doc: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="font-medium">{doc.originalName}</p>
                            <p className="text-sm text-gray-500">{doc.type} • {Math.round(doc.size / 1024)} KB</p>
                          </div>
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No documents uploaded</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="actions">
            <Card>
              <CardHeader>
                <CardTitle>Available Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Resubmit Documents */}
                {application.status === 'needs_documents' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Resubmit Documents</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <Label htmlFor="businessLicense">Business License</Label>
                        <Input
                          id="businessLicense"
                          type="file"
                          accept=".pdf,.doc,.docx,image/*"
                          onChange={(e) => handleFileChange('businessLicense', e.target.files?.[0] || null)}
                          className="mt-1"
                        />
                        {additionalFiles.businessLicense && (
                          <p className="mt-1 text-sm text-green-600">✓ {additionalFiles.businessLicense.name}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="utilityBill">Utility Bill</Label>
                        <Input
                          id="utilityBill"
                          type="file"
                          accept=".pdf,.doc,.docx,image/*"
                          onChange={(e) => handleFileChange('utilityBill', e.target.files?.[0] || null)}
                          className="mt-1"
                        />
                        {additionalFiles.utilityBill && (
                          <p className="mt-1 text-sm text-green-600">✓ {additionalFiles.utilityBill.name}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="additionalDoc">Additional Document</Label>
                        <Input
                          id="additionalDoc"
                          type="file"
                          accept=".pdf,.doc,.docx,image/*"
                          onChange={(e) => handleFileChange('additionalDoc', e.target.files?.[0] || null)}
                          className="mt-1"
                        />
                        {additionalFiles.additionalDoc && (
                          <p className="mt-1 text-sm text-green-600">✓ {additionalFiles.additionalDoc.name}</p>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      onClick={resubmitDocuments}
                      disabled={resubmitting}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {resubmitting ? (
                        <>
                          <Upload className="w-4 h-4 mr-2 animate-spin" />
                          Resubmitting...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Resubmit Documents
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {/* Start Verification */}
                {application.status === 'pending_verification' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Ready for Verification</h3>
                    <p className="text-gray-600 mb-4">Your application is ready for document verification.</p>
                    <Button onClick={startVerification} className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Start Verification Process
                    </Button>
                  </div>
                )}

                {/* Contact Support */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
                  <p className="text-gray-600 mb-4">If you have questions about your application status, contact our support team.</p>
                  <div className="space-x-2">
                    <Button variant="outline">Contact Support</Button>
                    <Link href="/">
                      <Button variant="outline">Return Home</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PendingApplication;