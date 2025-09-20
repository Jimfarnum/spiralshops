import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Store, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Upload, 
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Building,
  CreditCard,
  Shield,
  Users,
  Package,
  Zap
} from 'lucide-react';
import { Link, useLocation } from 'wouter';

interface RetailerFormData {
  // Business Information
  businessName: string;
  businessType: string;
  businessCategory: string;
  businessDescription: string;
  
  // Contact Information
  ownerName: string;
  email: string;
  phone: string;
  website: string;
  
  // Address Information
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  
  // Business Details
  yearsInBusiness: string;
  numberOfEmployees: string;
  monthlyRevenue: string;
  
  // SPIRAL Integration
  acceptsSPIRALRewards: boolean;
  offersPickup: boolean;
  offersDelivery: boolean;
  socialMediaPresence: string[];
  
  // Verification Documents
  businessLicense: File | null;
  taxId: string;
  insuranceCertificate: File | null;
  
  // Terms & Agreements
  agreesToTerms: boolean;
  agreesToFees: boolean;
  marketingOptIn: boolean;
}

const RetailerOnboardingForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<RetailerFormData>({
    businessName: '',
    businessType: '',
    businessCategory: '',
    businessDescription: '',
    ownerName: '',
    email: '',
    phone: '',
    website: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    yearsInBusiness: '',
    numberOfEmployees: '',
    monthlyRevenue: '',
    acceptsSPIRALRewards: true,
    offersPickup: true,
    offersDelivery: false,
    socialMediaPresence: [],
    businessLicense: null,
    taxId: '',
    insuranceCertificate: null,
    agreesToTerms: false,
    agreesToFees: false,
    marketingOptIn: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const businessTypes = [
    'Sole Proprietorship',
    'Partnership',
    'LLC',
    'Corporation',
    'Non-Profit',
    'Other'
  ];

  const businessCategories = [
    'Retail Store',
    'Restaurant & Food Service',
    'Health & Beauty',
    'Professional Services',
    'Automotive',
    'Home & Garden',
    'Entertainment & Recreation',
    'Technology & Electronics',
    'Fashion & Apparel',
    'Sports & Fitness',
    'Arts & Crafts',
    'Other'
  ];

  const employeeRanges = [
    '1-5 employees',
    '6-20 employees',
    '21-50 employees',
    '51-100 employees',
    '100+ employees'
  ];

  const revenueRanges = [
    'Under $10,000',
    '$10,000 - $50,000',
    '$50,000 - $100,000',
    '$100,000 - $500,000',
    '$500,000 - $1M',
    'Over $1M'
  ];

  const socialPlatforms = [
    'Facebook',
    'Instagram',
    'Twitter/X',
    'TikTok',
    'LinkedIn',
    'YouTube',
    'Pinterest'
  ];

  // Step 1: Business Information
  const BusinessInfoStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Building className="w-16 h-16 text-[var(--spiral-coral)] mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-[var(--spiral-navy)] mb-2">Business Information</h3>
        <p className="text-gray-600">Tell us about your business</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="businessName">Business Name *</Label>
            <Input
              id="businessName"
              value={formData.businessName}
              onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
              placeholder="Enter your business name"
            />
          </div>

          <div>
            <Label htmlFor="businessType">Business Type *</Label>
            <Select
              value={formData.businessType}
              onValueChange={(value) => setFormData(prev => ({ ...prev, businessType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent>
                {businessTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="businessCategory">Business Category *</Label>
            <Select
              value={formData.businessCategory}
              onValueChange={(value) => setFormData(prev => ({ ...prev, businessCategory: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {businessCategories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="ownerName">Owner/Manager Name *</Label>
            <Input
              id="ownerName"
              value={formData.ownerName}
              onChange={(e) => setFormData(prev => ({ ...prev, ownerName: e.target.value }))}
              placeholder="Full name"
            />
          </div>

          <div>
            <Label htmlFor="yearsInBusiness">Years in Business</Label>
            <Input
              id="yearsInBusiness"
              type="number"
              value={formData.yearsInBusiness}
              onChange={(e) => setFormData(prev => ({ ...prev, yearsInBusiness: e.target.value }))}
              placeholder="Number of years"
            />
          </div>

          <div>
            <Label htmlFor="numberOfEmployees">Number of Employees</Label>
            <Select
              value={formData.numberOfEmployees}
              onValueChange={(value) => setFormData(prev => ({ ...prev, numberOfEmployees: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                {employeeRanges.map((range) => (
                  <SelectItem key={range} value={range}>{range}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="businessDescription">Business Description</Label>
        <Textarea
          id="businessDescription"
          value={formData.businessDescription}
          onChange={(e) => setFormData(prev => ({ ...prev, businessDescription: e.target.value }))}
          placeholder="Describe your business, products, and services..."
          rows={4}
        />
      </div>
    </div>
  );

  // Step 2: Contact & Location
  const ContactLocationStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <MapPin className="w-16 h-16 text-[var(--spiral-coral)] mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-[var(--spiral-navy)] mb-2">Contact & Location</h3>
        <p className="text-gray-600">How can customers find and contact you?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="business@example.com"
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(555) 123-4567"
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="website">Website (Optional)</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                placeholder="https://yourbusiness.com"
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="streetAddress">Street Address *</Label>
            <Input
              id="streetAddress"
              value={formData.streetAddress}
              onChange={(e) => setFormData(prev => ({ ...prev, streetAddress: e.target.value }))}
              placeholder="123 Main Street"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                placeholder="City"
              />
            </div>
            <div>
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                placeholder="State"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="zipCode">ZIP Code *</Label>
            <Input
              id="zipCode"
              value={formData.zipCode}
              onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
              placeholder="12345"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Step 3: SPIRAL Integration
  const SpiralIntegrationStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Zap className="w-16 h-16 text-[var(--spiral-coral)] mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-[var(--spiral-navy)] mb-2">SPIRAL Integration</h3>
        <p className="text-gray-600">Set up your SPIRAL features and services</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-4">Service Options</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="acceptsSPIRALRewards"
                  checked={formData.acceptsSPIRALRewards}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, acceptsSPIRALRewards: !!checked }))}
                />
                <Label htmlFor="acceptsSPIRALRewards">Accept SPIRAL Rewards</Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="offersPickup"
                  checked={formData.offersPickup}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, offersPickup: !!checked }))}
                />
                <Label htmlFor="offersPickup">Offer In-Store Pickup</Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="offersDelivery"
                  checked={formData.offersDelivery}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, offersDelivery: !!checked }))}
                />
                <Label htmlFor="offersDelivery">Offer Local Delivery</Label>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="monthlyRevenue">Monthly Revenue Range</Label>
            <Select
              value={formData.monthlyRevenue}
              onValueChange={(value) => setFormData(prev => ({ ...prev, monthlyRevenue: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                {revenueRanges.map((range) => (
                  <SelectItem key={range} value={range}>{range}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-4">Social Media Presence</h4>
            <div className="space-y-2">
              {socialPlatforms.map((platform) => (
                <div key={platform} className="flex items-center space-x-3">
                  <Checkbox
                    id={platform}
                    checked={formData.socialMediaPresence.includes(platform)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({
                          ...prev,
                          socialMediaPresence: [...prev.socialMediaPresence, platform]
                        }));
                      } else {
                        setFormData(prev => ({
                          ...prev,
                          socialMediaPresence: prev.socialMediaPresence.filter(p => p !== platform)
                        }));
                      }
                    }}
                  />
                  <Label htmlFor={platform}>{platform}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">SPIRAL Benefits</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Increased local visibility</li>
              <li>• Customer loyalty rewards</li>
              <li>• Social media integration</li>
              <li>• Analytics and insights</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  // Step 4: Verification & Terms
  const VerificationTermsStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Shield className="w-16 h-16 text-[var(--spiral-coral)] mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-[var(--spiral-navy)] mb-2">Verification & Terms</h3>
        <p className="text-gray-600">Complete your application with required documents</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="taxId">Tax ID / EIN *</Label>
            <Input
              id="taxId"
              value={formData.taxId}
              onChange={(e) => setFormData(prev => ({ ...prev, taxId: e.target.value }))}
              placeholder="12-3456789"
            />
          </div>

          <div>
            <Label htmlFor="businessLicense">Business License</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Upload business license (PDF, JPG, PNG)</p>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setFormData(prev => ({ ...prev, businessLicense: file }));
                }}
                className="mt-2"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="insuranceCertificate">Insurance Certificate (Optional)</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Upload insurance certificate</p>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setFormData(prev => ({ ...prev, insuranceCertificate: file }));
                }}
                className="mt-2"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-4 border rounded-lg">
        <h4 className="font-semibold">Terms & Agreements</h4>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="agreesToTerms"
              checked={formData.agreesToTerms}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreesToTerms: !!checked }))}
            />
            <Label htmlFor="agreesToTerms" className="text-sm">
              I agree to the <Link to="/terms" className="text-[var(--spiral-coral)] hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-[var(--spiral-coral)] hover:underline">Privacy Policy</Link> *
            </Label>
          </div>
          <div className="flex items-start space-x-3">
            <Checkbox
              id="agreesToFees"
              checked={formData.agreesToFees}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreesToFees: !!checked }))}
            />
            <Label htmlFor="agreesToFees" className="text-sm">
              I understand and agree to SPIRAL's <Link to="/fees" className="text-[var(--spiral-coral)] hover:underline">fee structure</Link> *
            </Label>
          </div>
          <div className="flex items-start space-x-3">
            <Checkbox
              id="marketingOptIn"
              checked={formData.marketingOptIn}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, marketingOptIn: !!checked }))}
            />
            <Label htmlFor="marketingOptIn" className="text-sm">
              Send me marketing emails and business tips (optional)
            </Label>
          </div>
        </div>
      </div>
    </div>
  );

  const steps = [
    {
      title: 'Business Info',
      component: <BusinessInfoStep />
    },
    {
      title: 'Contact & Location',
      component: <ContactLocationStep />
    },
    {
      title: 'SPIRAL Integration',
      component: <SpiralIntegrationStep />
    },
    {
      title: 'Verification & Terms',
      component: <VerificationTermsStep />
    }
  ];

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.businessName && formData.businessType && formData.businessCategory && formData.ownerName;
      case 1:
        return formData.email && formData.phone && formData.streetAddress && formData.city && formData.state && formData.zipCode;
      case 2:
        return true; // All fields are optional or have defaults
      case 3:
        return formData.agreesToTerms && formData.agreesToFees && formData.taxId;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Submit application to backend API
      const applicationData = {
        ...formData,
        submittedAt: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer || 'direct'
      };
      
      // Simulate API call - in production this would be a real API
      console.log('Submitting retailer application:', applicationData);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock application ID
      const applicationId = `APP-${Date.now()}`;
      
      // Store application locally for demonstration
      localStorage.setItem('spiralRetailerApplicationId', applicationId);
      localStorage.setItem('spiralRetailerApplicationData', JSON.stringify(applicationData));
      
      toast({
        title: "Application Submitted Successfully!",
        description: `Application ID: ${applicationId}. We'll review your application and contact you within 2-3 business days.`,
        duration: 6000,
      });
      
      navigate('/');
    } catch (error) {
      toast({
        title: "Submission Error",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
    setIsSubmitting(false);
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--spiral-cream)] to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--spiral-navy)] mb-2">Join SPIRAL as a Retailer</h1>
          <p className="text-lg text-gray-600">Connect with local customers and grow your business</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">Step {currentStep + 1} of {steps.length}</span>
            <Badge variant="outline">{Math.round(progress)}% Complete</Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Form Content */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-xl text-[var(--spiral-navy)]">
              {steps[currentStep].title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {steps[currentStep].component}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            onClick={handlePrevious}
            variant="outline"
            disabled={currentStep === 0}
            className="min-w-[120px]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!canProceed() || isSubmitting}
            className="min-w-[120px] bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90"
          >
            {isSubmitting ? (
              'Submitting...'
            ) : currentStep === steps.length - 1 ? (
              'Submit Application'
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Need help with your application?
          </p>
          <Link to="/contact-support" className="text-[var(--spiral-coral)] hover:underline text-sm">
            Contact our retailer support team
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RetailerOnboardingForm;