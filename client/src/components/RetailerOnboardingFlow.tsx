import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Building2, 
  Users, 
  DollarSign, 
  MapPin,
  Star,
  Sparkles,
  CreditCard,
  Shield,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  sales: string;
  employees: string;
  locations: string;
  businessType: string;
  tier: string;
  description: string;
}

export default function RetailerOnboardingFlow() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    sales: "",
    employees: "",
    locations: "1",
    businessType: "",
    tier: "",
    description: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [retailerId, setRetailerId] = useState<string>("");
  const [stripeConnecting, setStripeConnecting] = useState(false);
  const [stripeStatus, setStripeStatus] = useState<string>("");
  const { toast } = useToast();

  // Check URL params for Stripe return
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true' && urlParams.get('step') === 'complete') {
      setStep(5);
      setStripeStatus('completed');
      toast({
        title: "Payment Setup Complete!",
        description: "Your Stripe account has been successfully connected.",
      });
    }
    if (urlParams.get('retry') === 'true' && urlParams.get('step') === 'stripe') {
      setStep(4);
      toast({
        title: "Please Complete Payment Setup",
        description: "Finish connecting your Stripe account to activate your store.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setStep(step + 1);
    }
  };

  const prevStep = () => setStep(step - 1);

  const validateCurrentStep = () => {
    switch (step) {
      case 1:
        return form.name && form.email && form.phone;
      case 2:
        return form.sales && form.employees && form.locations;
      case 3:
        return form.businessType && form.tier;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/retailer/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const result = await response.json();
      if (result.ok) {
        setRetailerId(result.record.id);
        toast({
          title: "Profile Created!",
          description: "Now let's set up your payments to complete onboarding.",
        });
        setStep(4); // Stripe Connect step
      } else {
        toast({
          title: "Onboarding Error",
          description: result.error || "Failed to complete onboarding",
          variant: "destructive"
        });
      }
    } catch (err) {
      toast({
        title: "Network Error",
        description: "Failed to submit onboarding form. Please try again.",
        variant: "destructive"
      });
    }
    setIsSubmitting(false);
  };

  const handleStripeConnect = async () => {
    setStripeConnecting(true);
    try {
      const response = await fetch(`/api/stripe/onboard/${retailerId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          businessName: form.name,
          businessType: form.businessType
        })
      });

      const result = await response.json();
      if (result.ok && result.url) {
        toast({
          title: "Redirecting to Stripe...",
          description: "Complete your payment setup to activate your store.",
        });
        // Redirect to Stripe Connect onboarding
        window.location.href = result.url;
      } else {
        toast({
          title: "Payment Setup Error",
          description: result.error || "Failed to initialize payment setup",
          variant: "destructive"
        });
      }
    } catch (err) {
      toast({
        title: "Network Error",
        description: "Failed to connect to payment system. Please try again.",
        variant: "destructive"
      });
    }
    setStripeConnecting(false);
  };

  const getTierInfo = (tier: string) => {
    const tiers = {
      "Growing": {
        price: "Free",
        features: ["Basic store listing", "Customer reviews", "SPIRAL loyalty integration"],
        badge: "success"
      },
      "Standard": {
        price: "$29/month", 
        features: ["Inventory management", "Basic analytics", "Campaign participation", "Priority support"],
        badge: "default"
      },
      "Premium": {
        price: "$79/month",
        features: ["Advanced analytics", "Custom campaigns", "API access", "Dedicated account manager", "White-label options"],
        badge: "secondary"
      }
    };
    return tiers[tier as keyof typeof tiers];
  };

  const progressPercentage = (step / 5) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center space-x-2 mb-2">
            <Building2 className="h-6 w-6 text-blue-600" />
            <CardTitle className="text-2xl">SPIRAL Retailer Onboarding</CardTitle>
            <Badge variant="outline">Step {step} of {step === 5 ? 5 : 4}</Badge>
          </div>
          <Progress value={progressPercentage} className="w-full" />
          <CardDescription>
            Join the SPIRAL network and connect with shoppers across multiple malls
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Business Information */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-lg font-semibold text-blue-600">
                <Building2 className="h-5 w-5" />
                <span>Business Information</span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Business Name *</label>
                  <Input 
                    placeholder="Your Store Name" 
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Business Email *</label>
                  <Input 
                    type="email" 
                    placeholder="contact@yourstore.com" 
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone Number *</label>
                  <Input 
                    placeholder="(555) 123-4567" 
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Business Address</label>
                  <Textarea 
                    placeholder="123 Main Street, City, State, ZIP" 
                    value={form.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Website</label>
                  <Input 
                    placeholder="https://yourstore.com" 
                    value={form.website}
                    onChange={(e) => handleChange('website', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Business Details */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-lg font-semibold text-blue-600">
                <DollarSign className="h-5 w-5" />
                <span>Business Details</span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Annual Sales Volume *</label>
                  <Select onValueChange={(value) => handleChange('sales', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select sales range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-100k">Under $100K</SelectItem>
                      <SelectItem value="100k-500k">$100K - $500K</SelectItem>
                      <SelectItem value="500k-1m">$500K - $1M</SelectItem>
                      <SelectItem value="1m-5m">$1M - $5M</SelectItem>
                      <SelectItem value="over-5m">Over $5M</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Number of Employees *</label>
                  <Select onValueChange={(value) => handleChange('employees', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select employee count" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-5">1-5 employees</SelectItem>
                      <SelectItem value="6-15">6-15 employees</SelectItem>
                      <SelectItem value="16-50">16-50 employees</SelectItem>
                      <SelectItem value="51-100">51-100 employees</SelectItem>
                      <SelectItem value="over-100">Over 100 employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Number of Locations *</label>
                  <Input 
                    type="number" 
                    placeholder="1" 
                    value={form.locations}
                    onChange={(e) => handleChange('locations', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Business Type & Tier Selection */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-lg font-semibold text-blue-600">
                <Star className="h-5 w-5" />
                <span>Business Type & Plan</span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Business Type *</label>
                  <Select onValueChange={(value) => handleChange('businessType', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clothing">Clothing & Fashion</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="food">Food & Beverage</SelectItem>
                      <SelectItem value="home">Home & Garden</SelectItem>
                      <SelectItem value="health">Health & Beauty</SelectItem>
                      <SelectItem value="sports">Sports & Recreation</SelectItem>
                      <SelectItem value="books">Books & Media</SelectItem>
                      <SelectItem value="automotive">Automotive</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Select Your Plan *</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                    {["Growing", "Standard", "Premium"].map((tier) => {
                      const tierInfo = getTierInfo(tier);
                      return (
                        <Card 
                          key={tier} 
                          className={`cursor-pointer transition-all ${form.tier === tier ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}
                          onClick={() => handleChange('tier', tier)}
                        >
                          <CardContent className="p-4 text-center">
                            <div className="font-semibold">{tier}</div>
                            <div className="text-lg font-bold text-blue-600">{tierInfo?.price}</div>
                            <div className="text-sm text-gray-600 mt-2">
                              {tierInfo?.features.slice(0, 2).map(feature => (
                                <div key={feature}>• {feature}</div>
                              ))}
                            </div>
                            {form.tier === tier && (
                              <div className="mt-2">
                                <Check className="h-5 w-5 text-blue-600 mx-auto" />
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Business Description (Optional)</label>
                  <Textarea 
                    placeholder="Tell us about your business, products, and what makes you unique..." 
                    value={form.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Payment Setup (Stripe Connect) */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-lg font-semibold text-blue-600">
                <CreditCard className="h-5 w-5" />
                <span>Payment Setup (Required)</span>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-3">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                    SPIRAL Payments powered by Stripe
                  </h4>
                </div>
                <p className="text-blue-800 dark:text-blue-200 text-sm mb-4">
                  To complete your onboarding and start selling on SPIRAL, you must connect your business 
                  to our secure payment system. This ensures:
                </p>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Secure payment processing for all transactions</li>
                  <li>• Automatic SPIRAL loyalty point distribution</li>
                  <li>• 5% platform fee for sustainable growth</li>
                  <li>• Fast, reliable payouts to your business account</li>
                  <li>• Built-in fraud protection and dispute management</li>
                </ul>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                  💰 Revenue Share Model
                </h4>
                <p className="text-sm text-green-800 dark:text-green-200">
                  SPIRAL takes a 5% platform fee on all sales, which funds our marketing, technology, 
                  and loyalty program that drives customers to your store. You keep 95% of every sale!
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">What you'll need:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Business bank account information</li>
                  <li>• Tax ID (EIN or SSN)</li>
                  <li>• Business license or registration documents</li>
                  <li>• Personal identification for verification</li>
                </ul>
              </div>

              <Button
                onClick={handleStripeConnect}
                disabled={stripeConnecting || !retailerId}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white"
                size="lg"
              >
                {stripeConnecting ? (
                  <>
                    <CreditCard className="mr-2 h-4 w-4 animate-pulse" />
                    Connecting to Stripe...
                  </>
                ) : (
                  <>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Connect with Stripe
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                This step is mandatory to activate your SPIRAL store. 
                You'll be redirected to Stripe's secure platform to complete setup.
              </p>
            </div>
          )}

          {/* Step 5: Review & Submit (now step 4) */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-lg font-semibold text-blue-600">
                <Check className="h-5 w-5" />
                <span>Review & Submit</span>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div><strong>Business:</strong> {form.name}</div>
                <div><strong>Email:</strong> {form.email}</div>
                <div><strong>Phone:</strong> {form.phone}</div>
                <div><strong>Business Type:</strong> {form.businessType}</div>
                <div><strong>Selected Plan:</strong> 
                  <Badge className="ml-2" variant="secondary">
                    {form.tier} - {getTierInfo(form.tier)?.price}
                  </Badge>
                </div>
                <div><strong>Locations:</strong> {form.locations}</div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">🚀 What happens next?</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Account creation and verification (1-2 business days)</li>
                  <li>• Store setup and inventory integration assistance</li>
                  <li>• SPIRAL loyalty program integration</li>
                  <li>• Access to retailer dashboard and analytics</li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 5: Success */}
          {step === 5 && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Sparkles className="h-16 w-16 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">Welcome to SPIRAL!</div>
              <div className="text-gray-600">
                Your retailer account has been created successfully. You'll receive a confirmation email shortly with next steps.
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-800">
                  <strong>Account ID:</strong> retailer_{Date.now()}<br/>
                  <strong>Status:</strong> Pending Verification<br/>
                  <strong>Next Step:</strong> Check your email for verification instructions
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          {step < 5 && (
            <div className="flex justify-between pt-6">
              <Button 
                variant="outline" 
                onClick={prevStep} 
                disabled={step === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {step < 3 ? (
                <Button 
                  onClick={nextStep}
                  disabled={!validateCurrentStep()}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : step === 3 ? (
                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? "Creating Profile..." : "Create Profile & Continue"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}