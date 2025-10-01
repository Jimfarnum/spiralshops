import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, MessageCircle, Upload, Store, CreditCard, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

interface BusinessData {
  businessName: string;
  businessType: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website: string;
  revenue: number;
  employees: number;
  locations: number;
  productCount: number;
  techSavvy: string;
}

interface AIResponse {
  message: string;
  nextStep?: string;
  suggestedTier?: string;
  requiresData?: string[];
  confidence: number;
  escalate: boolean;
}

export default function RetailerOnboarding() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [chatHistory, setChatHistory] = useState<Array<{role: string, content: string}>>([]);
  const [userMessage, setUserMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [businessData, setBusinessData] = useState<BusinessData>({
    businessName: '',
    businessType: '',
    description: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    website: '',
    revenue: 0,
    employees: 0,
    locations: 1,
    productCount: 0,
    techSavvy: 'medium'
  });

  const steps: OnboardingStep[] = [
    { id: 1, title: 'Welcome & Chat', description: 'AI-guided introduction and business overview', completed: false },
    { id: 2, title: 'Business Details', description: 'Complete your business information', completed: false },
    { id: 3, title: 'Tier Selection', description: 'Choose your SPIRAL plan', completed: false },
    { id: 4, title: 'Payment Setup', description: 'Configure Stripe Connect for payments', completed: false },
    { id: 5, title: 'Launch Ready', description: 'Start selling on SPIRAL', completed: false }
  ];

  const tiers = [
    {
      name: 'Bronze',
      price: '$29/month',
      features: ['Basic listing', 'Standard support', 'Basic analytics'],
      color: 'bg-amber-500'
    },
    {
      name: 'Silver',
      price: '$59/month',
      features: ['Enhanced visibility', 'Priority support', 'Advanced analytics'],
      color: 'bg-gray-400'
    },
    {
      name: 'Gold',
      price: '$99/month',
      features: ['Premium features', 'Marketing tools', 'Custom branding'],
      color: 'bg-yellow-500'
    },
    {
      name: 'Platinum',
      price: '$199/month',
      features: ['White-glove service', 'Dedicated support', 'Custom features'],
      color: 'bg-purple-500'
    }
  ];

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userMessage.trim()) return;

    setIsLoading(true);
    const newHistory = [...chatHistory, { role: 'user', content: userMessage }];
    setChatHistory(newHistory);

    try {
      const response = await apiRequest('POST', '/api/ai-agents/retailer-onboard/chat', {
        query: userMessage,
        context: {
          step: currentStep,
          businessType: businessData.businessType,
          history: chatHistory,
          collectedData: businessData
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAiResponse(data.data);
        setChatHistory(prev => [...prev, { role: 'assistant', content: data.data.message }]);
        
        if (data.data.nextStep) {
          toast({
            title: "Next Step",
            description: data.data.nextStep,
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setUserMessage('');
    }
  };

  const handleBusinessDataChange = (field: keyof BusinessData, value: string | number) => {
    setBusinessData(prev => ({ ...prev, [field]: value }));
  };

  const validateBusinessData = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/ai-agents/retailer-onboard/validate', {
        businessData
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Validation Complete",
          description: data.data.isValid ? "Business data looks good!" : "Please review the suggestions",
        });
        
        if (data.data.isValid) {
          setCurrentStep(3);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to validate business data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSuggestedTier = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/ai-agents/retailer-onboard/suggest-tier', {
        businessProfile: businessData
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Tier Recommendation",
          description: `We recommend ${data.data.suggestedTier} tier for your business`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get tier recommendation.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to SPIRAL Retailer Platform
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Let our AI guide you through a personalized onboarding experience
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  currentStep === step.id
                    ? 'bg-blue-100 border-2 border-blue-500'
                    : step.completed
                    ? 'bg-green-100 border-2 border-green-500'
                    : 'bg-gray-100 border-2 border-gray-300'
                }`}
              >
                {step.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <div className="h-5 w-5 rounded-full bg-gray-400 text-white text-xs flex items-center justify-center">
                    {step.id}
                  </div>
                )}
                <span className="text-sm font-medium">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AI Chat Interface */}
          {currentStep === 1 && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="h-6 w-6 text-blue-600" />
                  <span>Chat with SPIRAL AI Assistant</span>
                </CardTitle>
                <CardDescription>
                  Tell us about your business and let our AI guide you through the setup process
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Chat History */}
                  <div className="h-64 overflow-y-auto border rounded-lg p-4 bg-gray-50">
                    {chatHistory.length === 0 ? (
                      <div className="text-center text-gray-500 mt-8">
                        <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p>Start by telling us about your business!</p>
                        <p className="text-sm mt-2">Try: "I run a small boutique clothing store"</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {chatHistory.map((msg, idx) => (
                          <div
                            key={idx}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-sm p-3 rounded-lg ${
                                msg.role === 'user'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-white border'
                              }`}
                            >
                              {msg.content}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* AI Response Display */}
                  {aiResponse && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="secondary">AI Suggestion</Badge>
                        <div className="text-sm text-gray-600">
                          Confidence: {Math.round(aiResponse.confidence * 100)}%
                        </div>
                      </div>
                      {aiResponse.suggestedTier && (
                        <div className="mt-2">
                          <span className="text-sm font-medium">Recommended Tier: </span>
                          <Badge variant="outline">{aiResponse.suggestedTier}</Badge>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Chat Input */}
                  <form onSubmit={handleChatSubmit} className="flex space-x-2">
                    <Input
                      value={userMessage}
                      onChange={(e) => setUserMessage(e.target.value)}
                      placeholder="Tell us about your business..."
                      disabled={isLoading}
                    />
                    <Button type="submit" disabled={isLoading || !userMessage.trim()}>
                      {isLoading ? 'Sending...' : 'Send'}
                    </Button>
                  </form>

                  <div className="flex justify-end mt-4">
                    <Button onClick={() => setCurrentStep(2)}>
                      Continue to Business Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Business Details Form */}
          {currentStep === 2 && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Store className="h-6 w-6 text-blue-600" />
                  <span>Business Information</span>
                </CardTitle>
                <CardDescription>
                  Complete your business profile for accurate tier recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="businessName">Business Name *</Label>
                      <Input
                        id="businessName"
                        value={businessData.businessName}
                        onChange={(e) => handleBusinessDataChange('businessName', e.target.value)}
                        placeholder="Your Business Name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="businessType">Business Type *</Label>
                      <Select onValueChange={(value) => handleBusinessDataChange('businessType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="retail">Retail Store</SelectItem>
                          <SelectItem value="restaurant">Restaurant/Food</SelectItem>
                          <SelectItem value="service">Service Business</SelectItem>
                          <SelectItem value="boutique">Boutique/Fashion</SelectItem>
                          <SelectItem value="electronics">Electronics</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="description">Business Description</Label>
                      <Textarea
                        id="description"
                        value={businessData.description}
                        onChange={(e) => handleBusinessDataChange('description', e.target.value)}
                        placeholder="Describe your business..."
                      />
                    </div>

                    <div>
                      <Label htmlFor="revenue">Annual Revenue</Label>
                      <Input
                        id="revenue"
                        type="number"
                        value={businessData.revenue}
                        onChange={(e) => handleBusinessDataChange('revenue', parseInt(e.target.value) || 0)}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address">Address *</Label>
                      <Input
                        id="address"
                        value={businessData.address}
                        onChange={(e) => handleBusinessDataChange('address', e.target.value)}
                        placeholder="Street Address"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={businessData.city}
                          onChange={(e) => handleBusinessDataChange('city', e.target.value)}
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          value={businessData.state}
                          onChange={(e) => handleBusinessDataChange('state', e.target.value)}
                          placeholder="State"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="employees">Number of Employees</Label>
                      <Input
                        id="employees"
                        type="number"
                        value={businessData.employees}
                        onChange={(e) => handleBusinessDataChange('employees', parseInt(e.target.value) || 0)}
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <Label htmlFor="productCount">Estimated Product Count</Label>
                      <Input
                        id="productCount"
                        type="number"
                        value={businessData.productCount}
                        onChange={(e) => handleBusinessDataChange('productCount', parseInt(e.target.value) || 0)}
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    Back to Chat
                  </Button>
                  <div className="space-x-2">
                    <Button variant="outline" onClick={getSuggestedTier} disabled={isLoading}>
                      Get Tier Recommendation
                    </Button>
                    <Button onClick={validateBusinessData} disabled={isLoading}>
                      {isLoading ? 'Validating...' : 'Continue'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tier Selection */}
          {currentStep === 3 && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-6 w-6 text-blue-600" />
                  <span>Choose Your SPIRAL Plan</span>
                </CardTitle>
                <CardDescription>
                  Select the tier that best fits your business needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {tiers.map((tier) => (
                    <Card key={tier.name} className="cursor-pointer hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className={`w-8 h-8 rounded-full ${tier.color} mb-2`}></div>
                        <CardTitle className="text-xl">{tier.name}</CardTitle>
                        <CardDescription className="text-2xl font-bold">{tier.price}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {tier.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center space-x-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button className="w-full mt-4" onClick={() => setCurrentStep(4)}>
                          Select {tier.name}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-center mt-6">
                  <Button variant="outline" onClick={() => setCurrentStep(2)}>
                    Back to Business Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}