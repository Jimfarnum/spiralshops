import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  CreditCard, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Building2, 
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Shield,
  DollarSign,
  Users,
  TrendingUp
} from 'lucide-react';
import { Link, useLocation } from 'wouter';

interface StripeAccountStatus {
  id: string;
  charges_enabled: boolean;
  payouts_enabled: boolean;
  details_submitted: boolean;
  requirements: {
    currently_due: string[];
    eventually_due: string[];
    past_due: string[];
    pending_verification: string[];
  };
  business_profile: {
    name?: string;
    product_description?: string;
  };
  capabilities: {
    card_payments?: string;
    transfers?: string;
  };
}

const RetailerStripeSetup: React.FC = () => {
  const [stripeAccountId, setStripeAccountId] = useState<string | null>(null);
  const [accountStatus, setAccountStatus] = useState<StripeAccountStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  // Mock retailer data - in real app, this would come from authentication
  const retailerData = {
    id: "retail_123",
    email: "retailer@example.com",
    businessName: "Tech Haven Electronics",
    businessType: "company"
  };

  useEffect(() => {
    // Check if we have a Stripe account ID from URL params or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const accountIdFromUrl = urlParams.get('stripe_account');
    const savedAccountId = localStorage.getItem('stripe_account_id');
    
    const accountId = accountIdFromUrl || savedAccountId;
    if (accountId) {
      setStripeAccountId(accountId);
      checkAccountStatus(accountId);
    }
  }, []);

  const createStripeAccount = async () => {
    setIsCreatingAccount(true);
    try {
      const response = await fetch('/api/stripe/create-connect-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          retailerId: retailerData.id,
          email: retailerData.email,
          businessName: retailerData.businessName,
          businessType: retailerData.businessType
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStripeAccountId(data.stripeAccountId);
        localStorage.setItem('stripe_account_id', data.stripeAccountId);
        
        toast({
          title: "Stripe Account Created!",
          description: "Redirecting you to complete your account setup...",
        });

        // Redirect to Stripe's onboarding flow
        window.location.href = data.onboardingUrl;
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        title: "Account Creation Failed",
        description: error.message || "Failed to create Stripe account",
        variant: "destructive",
      });
    } finally {
      setIsCreatingAccount(false);
    }
  };

  const checkAccountStatus = async (accountId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/stripe/account-status/${accountId}`);
      const data = await response.json();

      if (data.success) {
        setAccountStatus(data.account);
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        title: "Status Check Failed",
        description: error.message || "Failed to check account status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = () => {
    if (!accountStatus) return <Clock className="w-6 h-6 text-gray-400" />;
    
    if (accountStatus.charges_enabled && accountStatus.payouts_enabled) {
      return <CheckCircle className="w-6 h-6 text-green-600" />;
    } else if (accountStatus.details_submitted) {
      return <Clock className="w-6 h-6 text-yellow-600" />;
    } else {
      return <AlertCircle className="w-6 h-6 text-red-600" />;
    }
  };

  const getStatusText = () => {
    if (!accountStatus) return "Not Started";
    
    if (accountStatus.charges_enabled && accountStatus.payouts_enabled) {
      return "Active & Ready";
    } else if (accountStatus.details_submitted) {
      return "Under Review";
    } else {
      return "Setup Required";
    }
  };

  const getStatusColor = () => {
    if (!accountStatus) return "bg-gray-100 text-gray-700";
    
    if (accountStatus.charges_enabled && accountStatus.payouts_enabled) {
      return "bg-green-100 text-green-700";
    } else if (accountStatus.details_submitted) {
      return "bg-yellow-100 text-yellow-700";
    } else {
      return "bg-red-100 text-red-700";
    }
  };

  const getCompletionPercentage = () => {
    if (!accountStatus) return 0;
    
    let completed = 0;
    if (accountStatus.details_submitted) completed += 50;
    if (accountStatus.charges_enabled) completed += 25;
    if (accountStatus.payouts_enabled) completed += 25;
    
    return completed;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link to="/retailer-dashboard" className="inline-flex items-center gap-2 text-[var(--spiral-navy)] hover:text-[var(--spiral-navy)]/80 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Stripe Payment Setup</h1>
          <p className="text-gray-600 mt-2">Set up your payment processing to start receiving payments through SPIRAL</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Setup Card */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Account Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Status Overview */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon()}
                    <div>
                      <h3 className="font-medium">{retailerData.businessName}</h3>
                      <p className="text-sm text-gray-600">{retailerData.email}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor()}>
                    {getStatusText()}
                  </Badge>
                </div>

                {/* Progress Bar */}
                {accountStatus && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Setup Progress</span>
                      <span>{getCompletionPercentage()}%</span>
                    </div>
                    <Progress value={getCompletionPercentage()} className="h-2" />
                  </div>
                )}

                {/* Account Details */}
                {accountStatus ? (
                  <div className="space-y-4">
                    <h4 className="font-medium">Account Capabilities</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        {accountStatus.charges_enabled ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-600" />
                        )}
                        <span className="text-sm">Accept Payments</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {accountStatus.payouts_enabled ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-600" />
                        )}
                        <span className="text-sm">Receive Payouts</span>
                      </div>
                    </div>

                    {/* Requirements */}
                    {accountStatus.requirements && (
                      <div className="space-y-3">
                        {accountStatus.requirements.currently_due.length > 0 && (
                          <div className="p-3 bg-red-50 rounded-lg">
                            <h5 className="font-medium text-red-900 mb-2">Action Required</h5>
                            <ul className="text-sm text-red-700 space-y-1">
                              {accountStatus.requirements.currently_due.map((req, index) => (
                                <li key={index}>• {req.replace(/_/g, ' ')}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {accountStatus.requirements.pending_verification.length > 0 && (
                          <div className="p-3 bg-yellow-50 rounded-lg">
                            <h5 className="font-medium text-yellow-900 mb-2">Under Review</h5>
                            <ul className="text-sm text-yellow-700 space-y-1">
                              {accountStatus.requirements.pending_verification.map((req, index) => (
                                <li key={index}>• {req.replace(/_/g, ' ')}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        onClick={() => checkAccountStatus(stripeAccountId!)}
                        disabled={isLoading}
                        variant="outline"
                        className="flex-1"
                      >
                        {isLoading ? "Checking..." : "Refresh Status"}
                      </Button>
                      
                      {!accountStatus.charges_enabled && (
                        <Button 
                          onClick={() => {
                            // In a real app, this would generate a new account link
                            toast({
                              title: "Complete Setup",
                              description: "Contact support to complete your account setup",
                            });
                          }}
                          className="flex-1 bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90"
                        >
                          Complete Setup
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Initial Setup */
                  <div className="text-center space-y-4 py-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <CreditCard className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Set Up Payment Processing</h3>
                      <p className="text-gray-600 mb-6">
                        Connect your Stripe account to start accepting payments from SPIRAL customers
                      </p>
                    </div>
                    <Button 
                      onClick={createStripeAccount}
                      disabled={isCreatingAccount}
                      size="lg"
                      className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90"
                    >
                      {isCreatingAccount ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                          Creating Account...
                        </div>
                      ) : (
                        <>
                          Create Stripe Account
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Benefits Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Benefits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Direct Payments</h4>
                    <p className="text-xs text-gray-600">Receive payments directly to your bank account</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Secure Processing</h4>
                    <p className="text-xs text-gray-600">PCI-compliant payment handling</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">SPIRAL Customers</h4>
                    <p className="text-xs text-gray-600">Access to local shoppers</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fees & Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Stripe Processing</span>
                  <span>2.9% + 30¢</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>SPIRAL Platform</span>
                  <span>3.0%</span>
                </div>
                <hr />
                <div className="flex justify-between font-medium">
                  <span>Total per transaction</span>
                  <span>~5.9%</span>
                </div>
                <p className="text-xs text-gray-600">
                  Competitive rates for marketplace transactions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetailerStripeSetup;