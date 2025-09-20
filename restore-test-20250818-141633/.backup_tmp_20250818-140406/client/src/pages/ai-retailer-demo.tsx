import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, CheckCircle, AlertCircle, XCircle, 
  Building, Mail, Phone, MapPin, Clock, 
  FileText, Image, Send
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AiRetailerDemo = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    category: '',
    hours: '',
    storePhotoURL: '',
    licenseDocURL: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/ai-retailer-onboarding/review-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.decision) {
        setResult(data.decision);
        toast({
          title: "AI Review Complete",
          description: `Application ${data.decision.status}`,
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Review error:', error);
      toast({
        title: "Review Failed",
        description: "Failed to process AI review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'denied': return <XCircle className="w-6 h-6 text-red-500" />;
      case 'needs_more_info': return <AlertCircle className="w-6 h-6 text-yellow-500" />;
      default: return <Bot className="w-6 h-6 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'denied': return 'bg-red-100 text-red-800';
      case 'needs_more_info': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Retailer Review Demo</h1>
          <p className="text-xl text-gray-600">Test the AI-powered application review system</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Application Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="w-6 h-6 text-blue-600" />
                <span>Retailer Application</span>
              </CardTitle>
              <CardDescription>
                Submit retailer information for AI review
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Store Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter store name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter full address"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    placeholder="e.g., Clothing, Electronics, Food"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="hours">Operating Hours</Label>
                  <Input
                    id="hours"
                    value={formData.hours}
                    onChange={(e) => handleInputChange('hours', e.target.value)}
                    placeholder="e.g., Mon-Fri 9AM-6PM"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="storePhotoURL">Storefront Photo URL</Label>
                  <Input
                    id="storePhotoURL"
                    value={formData.storePhotoURL}
                    onChange={(e) => handleInputChange('storePhotoURL', e.target.value)}
                    placeholder="https://example.com/storefront.jpg"
                    type="url"
                  />
                </div>

                <div>
                  <Label htmlFor="licenseDocURL">Business License URL</Label>
                  <Input
                    id="licenseDocURL"
                    value={formData.licenseDocURL}
                    onChange={(e) => handleInputChange('licenseDocURL', e.target.value)}
                    placeholder="https://example.com/license.pdf"
                    type="url"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <>
                      <Bot className="w-4 h-4 mr-2 animate-spin" />
                      AI Reviewing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit for AI Review
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bot className="w-6 h-6 text-purple-600" />
                <span>AI Review Results</span>
              </CardTitle>
              <CardDescription>
                AI-powered application evaluation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(result.status)}
                    <Badge className={getStatusColor(result.status)}>
                      {result.status.replace(/_/g, ' ').toUpperCase()}
                    </Badge>
                  </div>

                  <Alert>
                    <Bot className="h-4 w-4" />
                    <AlertDescription className="text-base">
                      <strong>AI Feedback:</strong><br />
                      {result.feedback}
                    </AlertDescription>
                  </Alert>

                  {result.status === 'approved' && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-800">Application Approved!</span>
                      </div>
                      <p className="text-green-700 text-sm">
                        Your retailer application has been approved by our AI system. You can now proceed with store setup.
                      </p>
                    </div>
                  )}

                  {result.status === 'denied' && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <XCircle className="w-5 h-5 text-red-600" />
                        <span className="font-semibold text-red-800">Application Denied</span>
                      </div>
                      <p className="text-red-700 text-sm">
                        Please review the feedback above and resubmit with corrections.
                      </p>
                    </div>
                  )}

                  {result.status === 'needs_more_info' && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                        <span className="font-semibold text-yellow-800">More Information Needed</span>
                      </div>
                      <p className="text-yellow-700 text-sm">
                        Please provide the additional information requested above.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Bot className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Submit an application to see AI review results</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Demo Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Demo Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <FileText className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <h3 className="font-semibold mb-1">1. Fill Application</h3>
                <p className="text-sm text-gray-600">Complete the retailer application form with your store details</p>
              </div>
              <div className="text-center">
                <Bot className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <h3 className="font-semibold mb-1">2. AI Review</h3>
                <p className="text-sm text-gray-600">Our AI agent analyzes your application for completeness</p>
              </div>
              <div className="text-center">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <h3 className="font-semibold mb-1">3. Get Results</h3>
                <p className="text-sm text-gray-600">Receive instant feedback and next steps</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AiRetailerDemo;