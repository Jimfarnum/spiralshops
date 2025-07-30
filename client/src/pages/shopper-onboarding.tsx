import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ArrowLeft, CheckCircle, MapPin, ShoppingBag, Star, Gift } from 'lucide-react';
import { useLocation } from 'wouter';

export default function ShopperOnboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    zipCode: '',
    interests: [] as string[],
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    preferredStores: [] as string[]
  });
  const [, setLocation] = useLocation();

  const steps = [
    { 
      id: 1, 
      title: "Welcome to SPIRAL", 
      description: "Let's get you started with local shopping",
      icon: <ShoppingBag className="h-6 w-6" />
    },
    { 
      id: 2, 
      title: "Your Profile", 
      description: "Tell us about yourself",
      icon: <MapPin className="h-6 w-6" />
    },
    { 
      id: 3, 
      title: "Your Interests", 
      description: "What do you love to shop for?",
      icon: <Star className="h-6 w-6" />
    },
    { 
      id: 4, 
      title: "Welcome Bonus", 
      description: "Claim your 100 SPIRAL points!",
      icon: <Gift className="h-6 w-6" />
    }
  ];

  const interestOptions = [
    'Electronics & Tech',
    'Fashion & Clothing',
    'Home & Garden',
    'Health & Beauty',
    'Sports & Outdoors',
    'Books & Media',
    'Food & Beverages',
    'Arts & Crafts',
    'Baby & Kids',
    'Automotive'
  ];

  const storeOptions = [
    'Target Store',
    'Local Coffee Shop',
    'Best Buy Electronics',
    'Downtown Boutique',
    'Garden Center Plus',
    'Health & Wellness Co',
    'Sports Authority',
    'Book Corner',
    'Baby Bliss',
    'Auto Parts Express'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleStoreToggle = (store: string) => {
    setFormData(prev => ({
      ...prev,
      preferredStores: prev.preferredStores.includes(store)
        ? prev.preferredStores.filter(s => s !== store)
        : [...prev.preferredStores, store]
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const completeOnboarding = () => {
    // Save user preferences to localStorage or send to API
    localStorage.setItem('spiralUserOnboarded', 'true');
    localStorage.setItem('spiralUserPreferences', JSON.stringify(formData));
    
    // Navigate to welcome dashboard
    setLocation('/');
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return true;
      case 2:
        return formData.firstName && formData.lastName && formData.email && formData.zipCode;
      case 3:
        return formData.interests.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center space-y-6">
            <div className="bg-gradient-to-br from-[var(--spiral-navy)] to-[var(--spiral-coral)] p-8 rounded-2xl text-white">
              <ShoppingBag className="h-16 w-16 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">Welcome to SPIRAL</h2>
              <p className="text-xl opacity-90">Everything Local. Just for You.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="p-4 border border-gray-200 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600 mb-2" />
                <h3 className="font-semibold mb-2">Shop Multiple Stores</h3>
                <p className="text-sm text-gray-600">Add items from different local stores to one cart</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600 mb-2" />
                <h3 className="font-semibold mb-2">Earn SPIRAL Points</h3>
                <p className="text-sm text-gray-600">Get rewarded for shopping local businesses</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600 mb-2" />
                <h3 className="font-semibold mb-2">Local Pickup & Delivery</h3>
                <p className="text-sm text-gray-600">Flexible fulfillment options for every item</p>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-[var(--spiral-navy)] mb-2">Tell Us About Yourself</h2>
              <p className="text-gray-600">We'll personalize your shopping experience</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Enter your last name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  placeholder="12345"
                />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Notification Preferences</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="email-notifications"
                    checked={formData.notifications.email}
                    onCheckedChange={(checked) => 
                      handleInputChange('notifications', {...formData.notifications, email: checked})
                    }
                  />
                  <Label htmlFor="email-notifications">Email notifications for deals and updates</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="push-notifications"
                    checked={formData.notifications.push}
                    onCheckedChange={(checked) => 
                      handleInputChange('notifications', {...formData.notifications, push: checked})
                    }
                  />
                  <Label htmlFor="push-notifications">Push notifications for order updates</Label>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-[var(--spiral-navy)] mb-2">What Do You Love to Shop For?</h2>
              <p className="text-gray-600">Select your interests to get personalized recommendations</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {interestOptions.map((interest) => (
                <button
                  key={interest}
                  onClick={() => handleInterestToggle(interest)}
                  className={`p-3 rounded-lg border-2 text-sm transition-all ${
                    formData.interests.includes(interest)
                      ? 'border-[var(--spiral-coral)] bg-[var(--spiral-coral)] text-white'
                      : 'border-gray-200 hover:border-[var(--spiral-coral)] hover:bg-gray-50'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
            <div className="mt-8">
              <h3 className="font-semibold mb-4">Favorite Local Stores (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {storeOptions.map((store) => (
                  <div key={store} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`store-${store}`}
                      checked={formData.preferredStores.includes(store)}
                      onCheckedChange={() => handleStoreToggle(store)}
                    />
                    <Label htmlFor={`store-${store}`} className="text-sm">{store}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center space-y-6">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 rounded-2xl text-white">
              <Gift className="h-16 w-16 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">Welcome Bonus!</h2>
              <div className="text-6xl font-bold mb-2">100</div>
              <p className="text-xl">SPIRAL Points Earned</p>
            </div>
            <div className="space-y-4">
              <p className="text-lg text-gray-700">
                Congratulations! You've earned 100 SPIRAL points just for joining our community.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">How to Use Points</h3>
                  <p className="text-sm text-blue-700">Use SPIRAL points at checkout for discounts on your purchases</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-2">Earn More Points</h3>
                  <p className="text-sm text-purple-700">Get 5 points per $100 spent online, 10 points per $100 in-store</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className={`flex items-center space-x-2 ${
                  currentStep >= step.id ? 'text-[var(--spiral-coral)]' : 'text-gray-400'
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    currentStep >= step.id 
                      ? 'border-[var(--spiral-coral)] bg-[var(--spiral-coral)] text-white' 
                      : 'border-gray-300'
                  }`}>
                    {currentStep > step.id ? <CheckCircle className="h-5 w-5" /> : step.icon}
                  </div>
                  <div className="hidden md:block">
                    <div className="font-semibold text-sm">{step.title}</div>
                    <div className="text-xs text-gray-500">{step.description}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-[var(--spiral-coral)]' : 'bg-gray-300'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>

          {currentStep < steps.length ? (
            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90 flex items-center space-x-2"
            >
              <span>Continue</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={completeOnboarding}
              className="bg-green-600 hover:bg-green-700 flex items-center space-x-2"
            >
              <span>Start Shopping</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}