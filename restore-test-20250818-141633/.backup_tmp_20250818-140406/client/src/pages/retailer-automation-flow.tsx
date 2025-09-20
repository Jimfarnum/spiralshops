import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Store, 
  CheckCircle,
  Clock,
  FileText,
  Upload,
  Settings,
  User,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Building,
  Package
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
  fields: Array<{
    name: string;
    label: string;
    type: 'text' | 'email' | 'tel' | 'textarea' | 'file' | 'select';
    required: boolean;
    value?: string;
    options?: string[];
  }>;
}

export default function RetailerAutomationFlow() {
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  
  const [onboardingSteps] = useState<OnboardingStep[]>([
    {
      id: 'business-info',
      title: 'Business Information',
      description: 'Basic details about your business',
      completed: false,
      required: true,
      fields: [
        { name: 'businessName', label: 'Business Name', type: 'text', required: true },
        { name: 'businessType', label: 'Business Type', type: 'select', required: true, 
          options: ['Retail Store', 'Restaurant', 'Service Provider', 'Boutique', 'Electronics', 'Fashion', 'Other'] },
        { name: 'description', label: 'Business Description', type: 'textarea', required: true },
        { name: 'website', label: 'Website URL', type: 'text', required: false },
        { name: 'establishedYear', label: 'Year Established', type: 'text', required: false }
      ]
    },
    {
      id: 'contact-details',
      title: 'Contact Details',
      description: 'How customers can reach you',
      completed: false,
      required: true,
      fields: [
        { name: 'ownerName', label: 'Owner/Manager Name', type: 'text', required: true },
        { name: 'businessEmail', label: 'Business Email', type: 'email', required: true },
        { name: 'businessPhone', label: 'Business Phone', type: 'tel', required: true },
        { name: 'customerServiceEmail', label: 'Customer Service Email', type: 'email', required: false },
        { name: 'customerServicePhone', label: 'Customer Service Phone', type: 'tel', required: false }
      ]
    },
    {
      id: 'location-info',
      title: 'Location & Hours',
      description: 'Store location and operating hours',
      completed: false,
      required: true,
      fields: [
        { name: 'address', label: 'Street Address', type: 'text', required: true },
        { name: 'city', label: 'City', type: 'text', required: true },
        { name: 'state', label: 'State', type: 'text', required: true },
        { name: 'zipCode', label: 'ZIP Code', type: 'text', required: true },
        { name: 'operatingHours', label: 'Operating Hours', type: 'textarea', required: true }
      ]
    },
    {
      id: 'documents',
      title: 'Documentation',
      description: 'Required business documents and verification',
      completed: false,
      required: true,
      fields: [
        { name: 'businessLicense', label: 'Business License', type: 'file', required: true },
        { name: 'taxId', label: 'Tax ID Number', type: 'text', required: true },
        { name: 'insuranceCert', label: 'Insurance Certificate', type: 'file', required: false },
        { name: 'permits', label: 'Special Permits', type: 'file', required: false }
      ]
    },
    {
      id: 'payment-setup',
      title: 'Payment Setup',
      description: 'Configure payment processing and banking',
      completed: false,
      required: true,
      fields: [
        { name: 'bankName', label: 'Bank Name', type: 'text', required: true },
        { name: 'accountNumber', label: 'Account Number', type: 'text', required: true },
        { name: 'routingNumber', label: 'Routing Number', type: 'text', required: true },
        { name: 'paymentProcessor', label: 'Preferred Payment Processor', type: 'select', required: true,
          options: ['Stripe', 'Square', 'PayPal', 'Shopify Payments', 'Other'] }
      ]
    },
    {
      id: 'inventory-setup',
      title: 'Initial Inventory',
      description: 'Upload your first products',
      completed: false,
      required: false,
      fields: [
        { name: 'inventoryFile', label: 'Product Catalog (CSV)', type: 'file', required: false },
        { name: 'productCount', label: 'Estimated Product Count', type: 'text', required: false },
        { name: 'categories', label: 'Main Product Categories', type: 'textarea', required: false }
      ]
    }
  ]);

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateStep = (step: OnboardingStep) => {
    const requiredFields = step.fields.filter(field => field.required);
    return requiredFields.every(field => formData[field.name]?.trim());
  };

  const handleNextStep = () => {
    const currentStepData = onboardingSteps[currentStep];
    
    if (currentStepData.required && !validateStep(currentStepData)) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields before continuing",
        variant: "destructive"
      });
      return;
    }
    
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = () => {
    toast({
      title: "Onboarding Complete!",
      description: "Your retailer account has been submitted for review",
    });
    
    // Simulate account creation and review process
    setTimeout(() => {
      toast({
        title: "Account Approved!",
        description: "Welcome to SPIRAL! You can now start adding products",
      });
    }, 3000);
  };

  const getStepIcon = (stepIndex: number) => {
    const step = onboardingSteps[stepIndex];
    if (stepIndex < currentStep || (stepIndex === currentStep && validateStep(step))) {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    } else if (stepIndex === currentStep) {
      return <Clock className="h-5 w-5 text-blue-600" />;
    } else {
      return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
    }
  };

  const renderField = (field: any) => {
    const commonProps = {
      value: formData[field.name] || '',
      onChange: (e: any) => updateFormData(field.name, e.target.value),
      required: field.required
    };

    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            {...commonProps}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            rows={3}
          />
        );
      case 'select':
        return (
          <select
            {...commonProps}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select {field.label}</option>
            {field.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      case 'file':
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">Upload {field.label}</p>
            <input
              type="file"
              className="mt-2"
              onChange={(e) => updateFormData(field.name, e.target.files?.[0]?.name || '')}
            />
          </div>
        );
      default:
        return (
          <Input
            {...commonProps}
            type={field.type}
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        );
    }
  };

  const currentStepData = onboardingSteps[currentStep];
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--spiral-navy)] mb-2">
            Retailer Onboarding Automation
          </h1>
          <p className="text-gray-600">
            Complete step-by-step setup to join the SPIRAL platform
          </p>
        </div>

        {/* Progress Indicator */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Setup Progress</span>
              <span className="text-sm text-gray-600">
                Step {currentStep + 1} of {onboardingSteps.length}
              </span>
            </div>
            <Progress value={progress} className="h-3 mb-4" />
            
            <div className="flex items-center justify-between">
              {onboardingSteps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    {getStepIcon(index)}
                    <span className={`text-xs mt-1 ${
                      index <= currentStep ? 'text-blue-600' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  {index < onboardingSteps.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-gray-300 mx-2" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Step */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              {currentStep === 0 && <Building className="h-5 w-5 mr-2" />}
              {currentStep === 1 && <User className="h-5 w-5 mr-2" />}
              {currentStep === 2 && <MapPin className="h-5 w-5 mr-2" />}
              {currentStep === 3 && <FileText className="h-5 w-5 mr-2" />}
              {currentStep === 4 && <CreditCard className="h-5 w-5 mr-2" />}
              {currentStep === 5 && <Package className="h-5 w-5 mr-2" />}
              {currentStepData.title}
            </CardTitle>
            <p className="text-gray-600">{currentStepData.description}</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentStepData.fields.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium mb-2">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {renderField(field)}
                </div>
              ))}
            </div>

            {currentStepData.required && (
              <Alert className="mt-6">
                <AlertDescription>
                  All required fields must be completed to continue to the next step.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-between mt-8">
              <Button 
                onClick={handlePreviousStep}
                variant="outline"
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              
              <Button onClick={handleNextStep}>
                {currentStep === onboardingSteps.length - 1 ? 'Complete Setup' : 'Next Step'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Onboarding Benefits */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Why Join SPIRAL?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <Store className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                <h4 className="font-medium">Local Discovery</h4>
                <p className="text-sm text-gray-600">
                  Get discovered by local shoppers in your area
                </p>
              </div>
              <div className="text-center p-4">
                <Settings className="h-8 w-8 mx-auto text-green-600 mb-2" />
                <h4 className="font-medium">Easy Management</h4>
                <p className="text-sm text-gray-600">
                  Simple tools to manage inventory and orders
                </p>
              </div>
              <div className="text-center p-4">
                <CreditCard className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                <h4 className="font-medium">Secure Payments</h4>
                <p className="text-sm text-gray-600">
                  Fast, secure payment processing with low fees
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}