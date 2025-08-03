import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  ShoppingBag, 
  MapPin, 
  Heart, 
  Gift, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  Star,
  Users,
  Truck,
  Zap,
  Trophy
} from 'lucide-react';
import { Link, useLocation } from 'wouter';

interface OnboardingStep {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

const ShopperOnboardingWalkthrough: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userPreferences, setUserPreferences] = useState({
    zipCode: '',
    shoppingInterests: [] as string[],
    preferredDelivery: '',
    notificationPreferences: [] as string[],
    loyaltyGoals: '',
    socialSharing: false
  });
  const [isCompleted, setIsCompleted] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const categories = [
    'Electronics', 'Fashion & Clothing', 'Home & Garden', 'Books & Media',
    'Sports & Outdoors', 'Health & Beauty', 'Food & Beverages', 'Automotive',
    'Arts & Crafts', 'Baby & Kids', 'Pet Supplies', 'Jewelry & Accessories'
  ];

  const deliveryOptions = [
    { id: 'pickup', label: 'In-Store Pickup', description: 'Pick up at the store' },
    { id: 'delivery', label: 'Local Delivery', description: 'Same-day or next-day delivery' },
    { id: 'shipping', label: 'Ship to Me', description: 'Standard shipping to your address' },
    { id: 'spiral-center', label: 'SPIRAL Center', description: 'Hub pickup location' }
  ];

  const loyaltyGoals = [
    { id: 'savings', label: 'Maximum Savings', description: 'Earn the most SPIRALs possible' },
    { id: 'local', label: 'Support Local', description: 'Help local businesses thrive' },
    { id: 'convenience', label: 'Convenience', description: 'Fast and easy shopping experience' },
    { id: 'discovery', label: 'Discovery', description: 'Find unique local products and experiences' }
  ];

  // Welcome Step
  const WelcomeStep = () => (
    <div className="text-center space-y-6">
      <div className="w-24 h-24 bg-gradient-to-br from-[var(--spiral-coral)] to-[var(--spiral-navy)] rounded-full flex items-center justify-center mx-auto">
        <ShoppingBag className="w-12 h-12 text-white" />
      </div>
      <div>
        <h2 className="text-3xl font-bold text-[var(--spiral-navy)] mb-3">Welcome to SPIRAL!</h2>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Let's set up your personalized local shopping experience in just a few steps.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        <div className="text-center p-4 bg-[var(--spiral-cream)] rounded-lg">
          <Trophy className="w-8 h-8 text-[var(--spiral-coral)] mx-auto mb-2" />
          <p className="text-sm font-medium">Earn SPIRALs</p>
        </div>
        <div className="text-center p-4 bg-[var(--spiral-cream)] rounded-lg">
          <Heart className="w-8 h-8 text-[var(--spiral-coral)] mx-auto mb-2" />
          <p className="text-sm font-medium">Support Local</p>
        </div>
      </div>
    </div>
  );

  // Location Step
  const LocationStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <MapPin className="w-16 h-16 text-[var(--spiral-coral)] mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-[var(--spiral-navy)] mb-2">Where do you shop?</h3>
        <p className="text-gray-600">Help us find local stores and deals near you</p>
      </div>
      
      <div className="space-y-4 max-w-md mx-auto">
        <div>
          <Label htmlFor="zipCode" className="text-sm font-medium">ZIP Code</Label>
          <Input
            id="zipCode"
            type="text"
            placeholder="Enter your ZIP code"
            value={userPreferences.zipCode}
            onChange={(e) => setUserPreferences(prev => ({ ...prev, zipCode: e.target.value }))}
            className="mt-1"
          />
        </div>
        
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Smart Location Benefits</span>
          </div>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Personalized store recommendations</li>
            <li>• Local deals and promotions</li>
            <li>• Accurate delivery estimates</li>
            <li>• Nearby pickup locations</li>
          </ul>
        </div>
      </div>
    </div>
  );

  // Interests Step
  const InterestsStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Star className="w-16 h-16 text-[var(--spiral-coral)] mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-[var(--spiral-navy)] mb-2">What interests you?</h3>
        <p className="text-gray-600">Select categories to personalize your shopping experience</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
        {categories.map((category) => (
          <div key={category} className="relative">
            <Checkbox
              id={category}
              checked={userPreferences.shoppingInterests.includes(category)}
              onCheckedChange={(checked) => {
                if (checked) {
                  setUserPreferences(prev => ({
                    ...prev,
                    shoppingInterests: [...prev.shoppingInterests, category]
                  }));
                } else {
                  setUserPreferences(prev => ({
                    ...prev,
                    shoppingInterests: prev.shoppingInterests.filter(item => item !== category)
                  }));
                }
              }}
              className="peer sr-only"
            />
            <label
              htmlFor={category}
              className="block p-3 text-sm font-medium text-center bg-white border-2 border-gray-200 rounded-lg cursor-pointer peer-checked:border-[var(--spiral-coral)] peer-checked:bg-[var(--spiral-coral)]/10 hover:border-[var(--spiral-coral)]/50 transition-all"
            >
              {category}
            </label>
          </div>
        ))}
      </div>
      
      <p className="text-center text-sm text-gray-500 max-w-md mx-auto">
        Selected {userPreferences.shoppingInterests.length} categories. You can change these anytime in your profile.
      </p>
    </div>
  );

  // Delivery Preferences Step
  const DeliveryStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Truck className="w-16 h-16 text-[var(--spiral-coral)] mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-[var(--spiral-navy)] mb-2">How do you prefer to get your orders?</h3>
        <p className="text-gray-600">Choose your preferred fulfillment method</p>
      </div>
      
      <RadioGroup
        value={userPreferences.preferredDelivery}
        onValueChange={(value) => setUserPreferences(prev => ({ ...prev, preferredDelivery: value }))}
        className="space-y-4 max-w-2xl mx-auto"
      >
        {deliveryOptions.map((option) => (
          <div key={option.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
            <RadioGroupItem value={option.id} id={option.id} />
            <div className="flex-1">
              <Label htmlFor={option.id} className="font-medium cursor-pointer">
                {option.label}
              </Label>
              <p className="text-sm text-gray-500">{option.description}</p>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );

  // Loyalty Goals Step
  const LoyaltyStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Gift className="w-16 h-16 text-[var(--spiral-coral)] mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-[var(--spiral-navy)] mb-2">What's your shopping goal?</h3>
        <p className="text-gray-600">Help us tailor your SPIRAL rewards experience</p>
      </div>
      
      <RadioGroup
        value={userPreferences.loyaltyGoals}
        onValueChange={(value) => setUserPreferences(prev => ({ ...prev, loyaltyGoals: value }))}
        className="space-y-4 max-w-2xl mx-auto"
      >
        {loyaltyGoals.map((goal) => (
          <div key={goal.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
            <RadioGroupItem value={goal.id} id={goal.id} />
            <div className="flex-1">
              <Label htmlFor={goal.id} className="font-medium cursor-pointer">
                {goal.label}
              </Label>
              <p className="text-sm text-gray-500">{goal.description}</p>
            </div>
          </div>
        ))}
      </RadioGroup>

      <div className="p-4 bg-[var(--spiral-cream)] rounded-lg max-w-2xl mx-auto">
        <div className="flex items-center space-x-2 mb-3">
          <Checkbox
            id="socialSharing"
            checked={userPreferences.socialSharing}
            onCheckedChange={(checked) => setUserPreferences(prev => ({ ...prev, socialSharing: !!checked }))}
          />
          <Label htmlFor="socialSharing" className="font-medium">
            Enable Social Sharing Rewards
          </Label>
        </div>
        <p className="text-sm text-gray-600">
          Earn bonus SPIRALs by sharing your favorite local finds on social media. You can opt out anytime.
        </p>
      </div>
    </div>
  );

  // Completion Step
  const CompletionStep = () => (
    <div className="text-center space-y-6">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-12 h-12 text-green-600" />
      </div>
      <div>
        <h2 className="text-3xl font-bold text-[var(--spiral-navy)] mb-3">You're all set!</h2>
        <p className="text-lg text-gray-600 max-w-md mx-auto mb-6">
          Welcome to the SPIRAL community. Start exploring local businesses and earning rewards!
        </p>
      </div>
      
      <div className="bg-gradient-to-r from-[var(--spiral-coral)] to-[var(--spiral-navy)] p-6 rounded-lg text-white max-w-md mx-auto">
        <h4 className="font-bold text-lg mb-2">🎉 Welcome Bonus!</h4>
        <p className="text-sm mb-3">You've earned 50 SPIRALs for completing onboarding</p>
        <Badge className="bg-white text-[var(--spiral-navy)]">+50 SPIRALs</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
        <Button 
          onClick={() => navigate('/products')}
          className="w-full bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90"
        >
          Start Shopping
        </Button>
        <Button 
          onClick={() => navigate('/social-rewards')}
          variant="outline"
          className="w-full border-[var(--spiral-coral)] text-[var(--spiral-coral)]"
        >
          View Rewards
        </Button>
      </div>
    </div>
  );

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome',
      subtitle: 'Get started with SPIRAL',
      icon: <ShoppingBag className="w-5 h-5" />,
      component: <WelcomeStep />
    },
    {
      id: 'location',
      title: 'Location',
      subtitle: 'Set your shopping area',
      icon: <MapPin className="w-5 h-5" />,
      component: <LocationStep />
    },
    {
      id: 'interests',
      title: 'Interests',
      subtitle: 'Choose your categories',
      icon: <Star className="w-5 h-5" />,
      component: <InterestsStep />
    },
    {
      id: 'delivery',
      title: 'Delivery',
      subtitle: 'Set preferences',
      icon: <Truck className="w-5 h-5" />,
      component: <DeliveryStep />
    },
    {
      id: 'loyalty',
      title: 'Goals',
      subtitle: 'Personalize rewards',
      icon: <Gift className="w-5 h-5" />,
      component: <LoyaltyStep />
    },
    {
      id: 'complete',
      title: 'Complete',
      subtitle: 'Ready to shop!',
      icon: <CheckCircle className="w-5 h-5" />,
      component: <CompletionStep />
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = async () => {
    try {
      // Save onboarding preferences to localStorage/backend
      localStorage.setItem('spiralOnboardingComplete', 'true');
      localStorage.setItem('spiralUserPreferences', JSON.stringify(userPreferences));
      
      setIsCompleted(true);
      toast({
        title: "Welcome to SPIRAL!",
        description: "Your preferences have been saved. Enjoy shopping local!",
        duration: 4000,
      });
    } catch (error) {
      toast({
        title: "Setup complete",
        description: "Welcome to SPIRAL! Start exploring local businesses.",
        duration: 3000,
      });
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: // Location
        return userPreferences.zipCode.length >= 5;
      case 2: // Interests
        return userPreferences.shoppingInterests.length > 0;
      case 3: // Delivery
        return userPreferences.preferredDelivery !== '';
      case 4: // Loyalty
        return userPreferences.loyaltyGoals !== '';
      default:
        return true;
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--spiral-cream)] to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-[var(--spiral-navy)]">Setup Your SPIRAL Experience</h1>
            <Badge variant="outline" className="text-sm">
              Step {currentStep + 1} of {steps.length}
            </Badge>
          </div>
          
          <Progress value={progress} className="h-2 mb-4" />
          
          {/* Step indicators */}
          <div className="flex justify-between text-sm">
            {steps.map((step, index) => (
              <div 
                key={step.id}
                className={`flex flex-col items-center ${
                  index <= currentStep ? 'text-[var(--spiral-coral)]' : 'text-gray-400'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                  index <= currentStep ? 'bg-[var(--spiral-coral)] text-white' : 'bg-gray-200'
                }`}>
                  {step.icon}
                </div>
                <span className="hidden md:block font-medium">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <Card className="shadow-lg border-0">
          <CardContent className="p-8">
            {steps[currentStep].component}
          </CardContent>
        </Card>

        {/* Navigation */}
        {currentStep < steps.length - 1 && (
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
              disabled={!canProceed()}
              className="min-w-[120px] bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90"
            >
              {currentStep === steps.length - 2 ? 'Complete Setup' : 'Next'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopperOnboardingWalkthrough;