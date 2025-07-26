import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CreditCard, 
  Smartphone, 
  Banknote, 
  Bitcoin, 
  Shield, 
  Zap, 
  Globe, 
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react";
import { StripePayment } from "@/components/StripePayment";
import { useToast } from "@/hooks/use-toast";

interface PaymentFeature {
  id: string;
  name: string;
  icon: React.ReactNode;
  status: "live" | "coming_soon" | "beta";
  description: string;
  features: string[];
  benefits: string[];
}

export default function PaymentFeaturesDemo() {
  const [selectedDemo, setSelectedDemo] = useState("stripe");
  const { toast } = useToast();

  const paymentFeatures: PaymentFeature[] = [
    {
      id: "stripe",
      name: "Stripe Payment Processing",
      icon: <CreditCard className="w-6 h-6" />,
      status: "live",
      description: "Real-time credit/debit card processing with global coverage",
      features: [
        "Visa, Mastercard, American Express support",
        "International payment acceptance",
        "Real-time fraud detection",
        "PCI DSS compliant processing",
        "Instant payment confirmation",
        "Automatic receipt generation"
      ],
      benefits: [
        "99.99% uptime reliability",
        "Lower processing fees than competitors",
        "Advanced security protection",
        "Global currency support",
        "Easy integration with existing systems"
      ]
    },
    {
      id: "express",
      name: "Express Checkout (Apple Pay / Google Pay)",
      icon: <Smartphone className="w-6 h-6" />,
      status: "live",
      description: "One-touch mobile payments for faster checkout",
      features: [
        "Apple Pay integration",
        "Google Pay support",
        "Biometric authentication",
        "Stored payment methods",
        "Mobile-optimized interface",
        "Touch ID / Face ID support"
      ],
      benefits: [
        "3x faster checkout process",
        "Reduced cart abandonment",
        "Enhanced mobile experience",
        "Increased customer satisfaction",
        "Higher conversion rates"
      ]
    },
    {
      id: "bnpl",
      name: "Buy Now, Pay Later",
      icon: <Banknote className="w-6 h-6" />,
      status: "coming_soon",
      description: "Flexible payment options with installment plans",
      features: [
        "Klarna 4-payment plans",
        "Afterpay integration",
        "Credit assessment",
        "Automatic payment scheduling",
        "Early payment options",
        "Customer payment tracking"
      ],
      benefits: [
        "Higher average order values",
        "Attracts budget-conscious customers",
        "No additional costs to merchants",
        "Risk managed by BNPL providers",
        "Increased purchasing power"
      ]
    },
    {
      id: "crypto",
      name: "Cryptocurrency Payments",
      icon: <Bitcoin className="w-6 h-6" />,
      status: "coming_soon",
      description: "Accept Bitcoin, Ethereum, and other cryptocurrencies",
      features: [
        "Bitcoin (BTC) payments",
        "Ethereum (ETH) support",
        "Automatic conversion to USD",
        "Real-time exchange rates",
        "Wallet integration",
        "Transaction verification"
      ],
      benefits: [
        "Appeal to tech-forward customers",
        "Lower transaction fees",
        "Global accessibility",
        "Instant settlement",
        "Hedge against currency fluctuation"
      ]
    }
  ];

  const handlePaymentSuccess = (paymentIntentId: string) => {
    toast({
      title: "Demo Payment Successful!",
      description: "This was a test payment. No charges were made.",
    });
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Demo Payment Failed",
      description: "This is expected in demo mode.",
      variant: "destructive",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "live":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Live</Badge>;
      case "beta":
        return <Badge className="bg-blue-100 text-blue-800"><Zap className="w-3 h-3 mr-1" />Beta</Badge>;
      case "coming_soon":
        return <Badge className="bg-gray-100 text-gray-800"><Clock className="w-3 h-3 mr-1" />Coming Soon</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">SPIRAL Payment & Financial Integration</h1>
          <p className="text-lg text-gray-600 mb-6">
            Advanced payment processing designed to compete with Amazon and major e-commerce platforms
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-600" />
              <span>Bank-level Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <span>Global Coverage</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-600" />
              <span>Instant Processing</span>
            </div>
          </div>
        </div>

        <Tabs value={selectedDemo} onValueChange={setSelectedDemo} className="space-y-6">
          {/* Payment Method Tabs */}
          <TabsList className="grid w-full grid-cols-4">
            {paymentFeatures.map((feature) => (
              <TabsTrigger 
                key={feature.id} 
                value={feature.id}
                className="flex items-center gap-2"
              >
                {feature.icon}
                {feature.name.split(" ")[0]}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Payment Feature Details */}
          {paymentFeatures.map((feature) => (
            <TabsContent key={feature.id} value={feature.id} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Feature Information */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-3">
                          {feature.icon}
                          {feature.name}
                        </CardTitle>
                        {getStatusBadge(feature.status)}
                      </div>
                      <p className="text-gray-600">{feature.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Key Features</h4>
                        <ul className="space-y-1 text-sm">
                          {feature.features.map((featureItem, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                              {featureItem}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="font-semibold mb-2">Business Benefits</h4>
                        <ul className="space-y-1 text-sm">
                          {feature.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <Zap className="w-4 h-4 text-blue-600 flex-shrink-0" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Demo Interface */}
                <div>
                  {feature.status === "live" && feature.id === "stripe" && (
                    <StripePayment
                      amount={24.99}
                      orderId="DEMO_ORDER_123"
                      title="Live Stripe Demo"
                      description="Test the real Stripe payment processing (demo mode)"
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  )}

                  {feature.status === "live" && feature.id === "express" && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Express Checkout Demo</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-center py-8">
                          <Smartphone className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                          <h3 className="text-lg font-semibold mb-2">Apple Pay / Google Pay</h3>
                          <p className="text-gray-600 mb-4">
                            Express checkout options would appear here on mobile devices
                          </p>
                          <Button className="w-full bg-black text-white hover:bg-gray-800">
                            <Smartphone className="w-4 h-4 mr-2" />
                            Pay with Apple Pay
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {feature.status === "coming_soon" && (
                    <Card>
                      <CardContent className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                          {feature.icon}
                        </div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-600">Coming Soon</h3>
                        <p className="text-gray-500 mb-4">
                          {feature.name} integration is currently under development
                        </p>
                        <Badge variant="secondary">Expected Q2 2025</Badge>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              {/* Technical Implementation Details */}
              {feature.status === "live" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Technical Implementation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                      <div>
                        <h4 className="font-semibold mb-2">Security</h4>
                        <ul className="space-y-1 text-gray-600">
                          <li>• PCI DSS Level 1 compliant</li>
                          <li>• End-to-end encryption</li>
                          <li>• Fraud detection AI</li>
                          <li>• 3D Secure authentication</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Performance</h4>
                        <ul className="space-y-1 text-gray-600">
                          <li>• Sub-second processing</li>
                          <li>• 99.99% uptime SLA</li>
                          <li>• Global edge network</li>
                          <li>• Real-time webhooks</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Integration</h4>
                        <ul className="space-y-1 text-gray-600">
                          <li>• RESTful API</li>
                          <li>• React component library</li>
                          <li>• Webhook notifications</li>
                          <li>• Dashboard analytics</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Competitive Advantage */}
        <Card className="mt-8 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">SPIRAL's Payment Advantage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2 text-blue-800">vs. Amazon</h4>
                <ul className="space-y-1 text-blue-700">
                  <li>• Lower merchant fees (2.9% vs 3.5%)</li>
                  <li>• Local business priority</li>
                  <li>• SPIRAL loyalty integration</li>
                  <li>• Community-focused features</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-blue-800">vs. Traditional POS</h4>
                <ul className="space-y-1 text-blue-700">
                  <li>• No monthly fees</li>
                  <li>• Real-time analytics</li>
                  <li>• Multi-channel support</li>
                  <li>• Integrated marketing tools</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-blue-800">Unique Features</h4>
                <ul className="space-y-1 text-blue-700">
                  <li>• SPIRAL points on all transactions</li>
                  <li>• Multi-retailer cart support</li>
                  <li>• Local business verification</li>
                  <li>• Community impact tracking</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}