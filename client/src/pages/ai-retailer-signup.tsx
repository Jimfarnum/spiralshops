import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Image, CheckCircle, AlertCircle, Clock, Bot } from 'lucide-react';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';

const AiRetailerSignup = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationId, setApplicationId] = useState<number | null>(null);
  const [aiReviewResult, setAiReviewResult] = useState<any>(null);

  const [formData, setFormData] = useState({
    storeName: '',
    email: '',
    phone: '',
    address: '',
    category: '',
    hours: '',
    description: ''
  });

  const [files, setFiles] = useState<{[key: string]: File | null}>({
    logo: null,
    storefrontPhoto: null,
    businessLicense: null,
    utilityBill: null,
    additionalDoc: null
  });

  const businessCategories = [
    'Restaurant', 'Retail', 'Services', 'Entertainment', 'Health & Beauty',
    'Automotive', 'Home & Garden', 'Electronics', 'Clothing', 'Grocery',
    'Pharmacy', 'Books & Media', 'Sports & Recreation', 'Professional Services'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: string, file: File | null) => {
    setFiles(prev => ({ ...prev, [field]: file }));
  };

  const validateStep1 = () => {
    const required = ['storeName', 'email', 'phone', 'address', 'category', 'hours', 'description'];
    return required.every(field => formData[field as keyof typeof formData].trim() !== '');
  };

  const submitApplication = async () => {
    if (!validateStep1()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before submitting.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      
      // Add form data
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value);
      });

      // Add files
      Object.entries(files).forEach(([key, file]) => {
        if (file) {
          submitData.append(key, file);
        }
      });

      const response = await fetch('/api/ai-retailer-onboarding/submit-application', {
        method: 'POST',
        body: submitData
      });

      const result = await response.json();

      if (result.success) {
        setApplicationId(result.applicationId);
        setAiReviewResult(result.aiReview);
        setCurrentStep(2);
        
        toast({
          title: "Application Submitted!",
          description: "Our AI agent is now reviewing your application.",
        });
      } else {
        throw new Error(result.error || 'Submission failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'needs_review': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default: return <Clock className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'needs_review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI-Powered Retailer Onboarding</h1>
          <p className="text-xl text-gray-600">Join SPIRAL with intelligent application review and verification</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${currentStep >= 1 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'}`}>
                1
              </div>
              <span className="ml-2 font-medium">Application</span>
            </div>
            <div className="w-16 h-px bg-gray-300"></div>
            <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${currentStep >= 2 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'}`}>
                <Bot className="w-4 h-4" />
              </div>
              <span className="ml-2 font-medium">AI Review</span>
            </div>
          </div>
        </div>

        {currentStep === 1 && (
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>Retailer Application Form</span>
              </CardTitle>
              <CardDescription>
                Fill out your business information below. Our AI agent will review your application automatically.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="storeName">Store Name*</Label>
                  <Input
                    id="storeName"
                    value={formData.storeName}
                    onChange={(e) => handleInputChange('storeName', e.target.value)}
                    placeholder="Enter your business name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Business Category*</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessCategories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="email">Email Address*</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="business@example.com"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number*</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="(555) 123-4567"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Business Address*</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Full street address"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="hours">Business Hours*</Label>
                <Input
                  id="hours"
                  value={formData.hours}
                  onChange={(e) => handleInputChange('hours', e.target.value)}
                  placeholder="Mon-Fri 9AM-6PM, Sat 10AM-4PM"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Store Description*</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your business, products, and services..."
                  className="mt-1"
                  rows={4}
                />
              </div>

              {/* File Uploads */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Document Uploads</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Logo Upload */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <div className="text-center">
                      <Image className="mx-auto h-8 w-8 text-gray-400" />
                      <Label htmlFor="logo" className="mt-2 block text-sm font-medium text-gray-900">
                        Logo (Optional)
                      </Label>
                      <Input
                        id="logo"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange('logo', e.target.files?.[0] || null)}
                        className="mt-2"
                      />
                      {files.logo && (
                        <p className="mt-2 text-sm text-green-600">✓ {files.logo.name}</p>
                      )}
                    </div>
                  </div>

                  {/* Storefront Photo */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <div className="text-center">
                      <Image className="mx-auto h-8 w-8 text-gray-400" />
                      <Label htmlFor="storefrontPhoto" className="mt-2 block text-sm font-medium text-gray-900">
                        Storefront Photo (Recommended)
                      </Label>
                      <Input
                        id="storefrontPhoto"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange('storefrontPhoto', e.target.files?.[0] || null)}
                        className="mt-2"
                      />
                      {files.storefrontPhoto && (
                        <p className="mt-2 text-sm text-green-600">✓ {files.storefrontPhoto.name}</p>
                      )}
                    </div>
                  </div>

                  {/* Business License */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <div className="text-center">
                      <FileText className="mx-auto h-8 w-8 text-gray-400" />
                      <Label htmlFor="businessLicense" className="mt-2 block text-sm font-medium text-gray-900">
                        Business License (Optional)
                      </Label>
                      <Input
                        id="businessLicense"
                        type="file"
                        accept=".pdf,.doc,.docx,image/*"
                        onChange={(e) => handleFileChange('businessLicense', e.target.files?.[0] || null)}
                        className="mt-2"
                      />
                      {files.businessLicense && (
                        <p className="mt-2 text-sm text-green-600">✓ {files.businessLicense.name}</p>
                      )}
                    </div>
                  </div>

                  {/* Utility Bill */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <div className="text-center">
                      <FileText className="mx-auto h-8 w-8 text-gray-400" />
                      <Label htmlFor="utilityBill" className="mt-2 block text-sm font-medium text-gray-900">
                        Utility Bill (Optional)
                      </Label>
                      <Input
                        id="utilityBill"
                        type="file"
                        accept=".pdf,.doc,.docx,image/*"
                        onChange={(e) => handleFileChange('utilityBill', e.target.files?.[0] || null)}
                        className="mt-2"
                      />
                      {files.utilityBill && (
                        <p className="mt-2 text-sm text-green-600">✓ {files.utilityBill.name}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Link href="/retailer-login">
                  <Button variant="outline">Back to Login</Button>
                </Link>
                <Button 
                  onClick={submitApplication}
                  disabled={isSubmitting || !validateStep1()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? (
                    <>
                      <Upload className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Submit Application
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && aiReviewResult && (
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bot className="w-6 h-6 text-blue-600" />
                <span>SPIRAL AI Agent Review</span>
              </CardTitle>
              <CardDescription>
                Application ID: {applicationId} - Your application has been processed by our AI agent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status Badge */}
              <div className="flex items-center space-x-4">
                {getStatusIcon(aiReviewResult.status)}
                <Badge className={getStatusColor(aiReviewResult.status)}>
                  {aiReviewResult.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>

              {/* AI Message */}
              <Alert>
                <Bot className="h-4 w-4" />
                <AlertDescription className="text-base">
                  {aiReviewResult.message}
                </AlertDescription>
              </Alert>

              {/* Issues (if any) */}
              {aiReviewResult.issues && aiReviewResult.issues.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-red-600 mb-2">Issues Found:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {aiReviewResult.issues.map((issue: string, index: number) => (
                      <li key={index} className="text-red-600">{issue}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requests (if any) */}
              {aiReviewResult.requests && aiReviewResult.requests.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-yellow-600 mb-2">Additional Information Needed:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {aiReviewResult.requests.map((request: string, index: number) => (
                      <li key={index} className="text-yellow-600">{request}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Next Steps */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Next Steps:</h3>
                <p className="text-gray-700">{aiReviewResult.nextStep}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between">
                <Link href="/">
                  <Button variant="outline">Return to Home</Button>
                </Link>
                <div className="space-x-2">
                  {aiReviewResult.status === 'needs_review' && (
                    <Link href={`/pending-application/${applicationId}`}>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        View Application Status
                      </Button>
                    </Link>
                  )}
                  {aiReviewResult.status === 'approved' && (
                    <Button className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Proceed to Verification
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AiRetailerSignup;