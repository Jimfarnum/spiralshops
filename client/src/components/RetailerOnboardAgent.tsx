import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Store, CreditCard, Upload, ArrowRight, Star, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface Plan {
  id: string;
  name: string;
  price: string;
  features: string[];
  recommended: boolean;
}

interface OnboardingData {
  plan: string;
  businessName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  description: string;
  zipCode: string;
  mallName: string;
}

interface AgentMessage {
  role: 'agent' | 'user';
  content: string;
  timestamp: Date;
}

export default function RetailerOnboardAgent() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [messages, setMessages] = useState<AgentMessage[]>([
    {
      role: 'agent',
      content: '👋 Welcome to SPIRAL, the Local Shopping Platform that connects you directly with shoppers in your area and across the country. Let\'s get you set up!\n\n✅ Step 1: Choose your plan:\n\n**Free**: Basic listing + 1 product\n**Silver**: Full listing, analytics, 50 products — $29/month\n**Gold**: Unlimited listings, premium placement, perks — $99/month\n\nPlease select your preferred plan to continue.',
      timestamp: new Date()
    }
  ]);
  
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    plan: '',
    businessName: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    category: '',
    description: '',
    zipCode: '',
    mallName: ''
  });

  const steps = [
    { id: 1, title: 'Plan Selection', icon: Star },
    { id: 2, title: 'Business Info', icon: Store },
    { id: 3, title: 'Payment Setup', icon: CreditCard },
    { id: 4, title: 'Inventory Upload', icon: Upload },
    { id: 5, title: 'Complete', icon: CheckCircle }
  ];

  // Load plans on component mount
  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const response = await fetch('/api/retailer-onboard/plans');
      const data = await response.json();
      if (data.success) {
        setPlans(data.data.plans);
      }
    } catch (error) {
      console.error('Failed to load plans:', error);
    }
  };

  const handlePlanSelection = (planId: string) => {
    setOnboardingData(prev => ({ ...prev, plan: planId }));
    const selectedPlan = plans.find(p => p.id === planId);
    
    addAgentMessage(
      `Great choice! You've selected the ${selectedPlan?.name} plan (${selectedPlan?.price}).\n\n` +
      `✅ Step 2: Now let's collect your business details:\n\n` +
      `Please provide:\n` +
      `• Store name\n` +
      `• Business category (e.g., Jewelry, Apparel)\n` +
      `• Contact information\n` +
      `• Business address\n` +
      `• Mall location (if applicable)`
    );
    
    setCurrentStep(2);
  };

  const handleBusinessInfoSubmit = async () => {
    if (!onboardingData.businessName || !onboardingData.email || !onboardingData.phone || !onboardingData.address || !onboardingData.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/retailer-onboard/retailer-onboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(onboardingData),
      });
      const data = await response.json();
      
      if (data.success) {
        addAgentMessage(
          `✅ Excellent! Your business information has been saved.\n\n` +
          `✅ Step 3: Payment Setup\n\n` +
          `To receive payments from SPIRAL customers, you'll need to connect your Stripe account. ` +
          `This allows us to securely transfer funds to your bank account.\n\n` +
          `Click the "Connect Stripe Account" button below to continue.`
        );
        setCurrentStep(3);
        
        toast({
          title: "Business Info Saved",
          description: "Your information has been successfully saved.",
        });
      } else {
        throw new Error(data.error || 'Submission failed');
      }
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStripeConnect = () => {
    // Real Stripe Connect OAuth integration
    const clientId = process.env.VITE_STRIPE_CLIENT_ID || 'ca_test';
    const redirectUri = encodeURIComponent(`${window.location.origin}/api/stripe/callback`);
    const stripeConnectUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${clientId}&scope=read_write&redirect_uri=${redirectUri}&state=${Date.now()}`;
    
    addAgentMessage(
      `🔄 Redirecting you to Stripe Connect...\n\n` +
      `You'll be redirected to Stripe to securely connect your bank account. ` +
      `After completing the setup, you'll be brought back to continue with inventory upload.\n\n` +
      `This is a secure OAuth flow that protects your financial information.`
    );
    
    // Redirect to actual Stripe Connect
    setTimeout(() => {
      window.location.href = stripeConnectUrl;
    }, 2000);
  };

  const handleInventoryUpload = (method: string) => {
    if (method === 'upload CSV file') {
      addAgentMessage(
        `✅ Great choice! CSV upload is perfect for adding multiple products quickly.\n\n` +
        `🎉 Congratulations! Your SPIRAL onboarding is complete.\n\n` +
        `Your store will be live on SPIRAL once our team completes the verification process (usually within 24 hours).\n\n` +
        `Next steps:\n` +
        `• Upload your product catalog\n` +
        `• Access your retailer dashboard\n` +
        `• Start connecting with SPIRAL customers\n\n` +
        `Welcome to the SPIRAL family! 🌟`
      );
    } else if (method === 'add products manually with ProductEntryAgent') {
      addAgentMessage(
        `✅ Perfect! The ProductEntryAgent will help you create optimized product listings.\n\n` +
        `🚀 Redirecting you to ProductEntryAgent...\n\n` +
        `The AI will guide you through:\n` +
        `• Creating detailed product descriptions\n` +
        `• Optimizing categories and tags\n` +
        `• Setting competitive pricing\n` +
        `• Publishing to SPIRAL marketplace\n\n` +
        `Your onboarding is complete! Let's add your first product.`
      );
      
      setTimeout(() => {
        window.location.href = '/product-entry-agent';
      }, 3000);
    } else {
      addAgentMessage(
        `✅ Excellent! We'll help you integrate your existing ${method} system.\n\n` +
        `🎉 Your SPIRAL onboarding is complete!\n\n` +
        `Our integration team will contact you within 24 hours to set up your ${method} sync.\n\n` +
        `Welcome to the SPIRAL family! 🌟`
      );
    }
    setCurrentStep(5);
  };

  const addAgentMessage = (content: string) => {
    setMessages(prev => [...prev, {
      role: 'agent',
      content,
      timestamp: new Date()
    }]);
  };

  const progressPercentage = (currentStep / steps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-teal-600">SPIRAL Retailer Onboarding</h1>
        <p className="text-gray-600 mt-2">Your AI-powered onboarding assistant</p>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-gray-500">{currentStep} of {steps.length}</span>
          </div>
          <Progress value={progressPercentage} className="mb-4" />
          <div className="flex justify-between">
            {steps.map((step) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              
              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center mb-2
                    ${isCompleted ? 'bg-teal-500 text-white' : 
                      isCurrent ? 'bg-teal-100 text-teal-600 border-2 border-teal-500' : 
                      'bg-gray-100 text-gray-400'}
                  `}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs text-center ${isCurrent ? 'font-medium' : ''}`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-teal-500" />
            RetailerOnboardAgent Chat
          </CardTitle>
          <CardDescription>
            Your AI assistant will guide you through each step
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`
                  max-w-[80%] p-3 rounded-lg whitespace-pre-line
                  ${message.role === 'user' 
                    ? 'bg-teal-500 text-white' 
                    : 'bg-gray-100 text-gray-800'}
                `}>
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step-specific Content */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Choose Your Plan</CardTitle>
            <CardDescription>Select the SPIRAL plan that best fits your business</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card key={plan.id} className={`cursor-pointer transition-all hover:shadow-lg ${plan.recommended ? 'ring-2 ring-teal-500' : ''}`}>
                  <CardContent className="p-6">
                    {plan.recommended && (
                      <Badge className="mb-3 bg-teal-500">Recommended</Badge>
                    )}
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-2xl font-bold text-teal-600 mb-4">{plan.price}</p>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      onClick={() => handlePlanSelection(plan.id)}
                      className="w-full"
                      variant={plan.recommended ? "default" : "outline"}
                    >
                      Select {plan.name}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>Tell us about your business</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="businessName">Store Name *</Label>
                <Input
                  id="businessName"
                  placeholder="Your Business Name"
                  value={onboardingData.businessName}
                  onChange={(e) => setOnboardingData(prev => ({ ...prev, businessName: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select onValueChange={(value) => setOnboardingData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jewelry">Jewelry</SelectItem>
                    <SelectItem value="apparel">Apparel & Fashion</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="food">Food & Beverage</SelectItem>
                    <SelectItem value="health">Health & Beauty</SelectItem>
                    <SelectItem value="home">Home & Garden</SelectItem>
                    <SelectItem value="sports">Sports & Recreation</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="First Name"
                  value={onboardingData.firstName}
                  onChange={(e) => setOnboardingData(prev => ({ ...prev, firstName: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Last Name"
                  value={onboardingData.lastName}
                  onChange={(e) => setOnboardingData(prev => ({ ...prev, lastName: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@yourbusiness.com"
                  value={onboardingData.email}
                  onChange={(e) => setOnboardingData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={onboardingData.phone}
                  onChange={(e) => setOnboardingData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Business Address *</Label>
              <Input
                id="address"
                placeholder="123 Main St, City, State, ZIP"
                value={onboardingData.address}
                onChange={(e) => setOnboardingData(prev => ({ ...prev, address: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="mallName">Mall (Optional)</Label>
              <Input
                id="mallName"
                placeholder="e.g., Westfield Mall, Downtown Shopping Center"
                value={onboardingData.mallName}
                onChange={(e) => setOnboardingData(prev => ({ ...prev, mallName: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="description">Business Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your business, products, and what makes you unique..."
                value={onboardingData.description}
                onChange={(e) => setOnboardingData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <Button 
              onClick={handleBusinessInfoSubmit} 
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Submit Business Information'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Setup</CardTitle>
            <CardDescription>Connect your Stripe account to receive payments</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="p-6 bg-blue-50 rounded-lg">
              <CreditCard className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Secure Payment Processing</h3>
              <p className="text-gray-600">
                Connect with Stripe to securely accept payments and get funds transferred directly to your bank account.
              </p>
            </div>
            <Button onClick={handleStripeConnect} size="lg" className="w-full">
              Connect Stripe Account
            </Button>
          </CardContent>
        </Card>
      )}

      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Inventory Upload</CardTitle>
            <CardDescription>Add your products to SPIRAL</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => handleInventoryUpload('upload CSV file')}>
                <CardContent className="p-6 text-center">
                  <Upload className="w-8 h-8 text-teal-500 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">CSV Upload</h3>
                  <p className="text-sm text-gray-600">Upload bulk inventory via spreadsheet</p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => handleInventoryUpload('add products manually with ProductEntryAgent')}>
                <CardContent className="p-6 text-center">
                  <Store className="w-8 h-8 text-teal-500 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">AI Product Entry</h3>
                  <p className="text-sm text-gray-600">Add products with AI-powered assistance</p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => handleInventoryUpload('connect existing Shopify store')}>
                <CardContent className="p-6 text-center">
                  <Zap className="w-8 h-8 text-teal-500 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Shopify Integration</h3>
                  <p className="text-sm text-gray-600">Connect your existing Shopify store</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 5 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center">🎉 Welcome to SPIRAL!</CardTitle>
            <CardDescription className="text-center">Your onboarding is complete</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Onboarding Complete!</h3>
              <p className="text-gray-600">
                Your store will be live on SPIRAL once our team completes verification (usually within 24 hours).
              </p>
            </div>
            <Separator />
            <div className="grid md:grid-cols-2 gap-4">
              <Button variant="outline" className="w-full">
                Access Retailer Dashboard
              </Button>
              <Button className="w-full">
                View Store Preview
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}