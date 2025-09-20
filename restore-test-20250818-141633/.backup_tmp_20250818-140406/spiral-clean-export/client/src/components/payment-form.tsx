import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Smartphone, Wallet, Shield, Lock } from 'lucide-react';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

interface PaymentFormProps {
  amount: number;
  currency?: string;
  onSuccess?: (paymentIntent: any) => void;
  onError?: (error: any) => void;
  className?: string;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'apple_pay' | 'google_pay' | 'paypal';
  name: string;
  icon: React.ReactNode;
  description: string;
  enabled: boolean;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'card',
    type: 'card',
    name: 'Credit or Debit Card',
    icon: <CreditCard className="h-5 w-5" />,
    description: 'Visa, Mastercard, American Express',
    enabled: true
  },
  {
    id: 'apple_pay',
    type: 'apple_pay',
    name: 'Apple Pay',
    icon: <Smartphone className="h-5 w-5" />,
    description: 'Pay with Touch ID or Face ID',
    enabled: true
  },
  {
    id: 'google_pay',
    type: 'google_pay',
    name: 'Google Pay',
    icon: <Wallet className="h-5 w-5" />,
    description: 'Fast and secure checkout',
    enabled: true
  }
];

export default function PaymentForm({ amount, currency = 'usd', onSuccess, onError, className = '' }: PaymentFormProps) {
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
    zip: ''
  });
  
  const { toast } = useToast();

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount / 100);
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-digit characters
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    // Add space every 4 digits
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '');
    }
    return v;
  };

  const handleCardInputChange = (field: string, value: string) => {
    let formattedValue = value;
    
    if (field === 'number') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'expiry') {
      formattedValue = formatExpiry(value);
    } else if (field === 'cvc') {
      formattedValue = value.replace(/[^0-9]/g, '').substring(0, 4);
    }
    
    setCardDetails(prev => ({
      ...prev,
      [field]: formattedValue
    }));
  };

  const validateCardDetails = () => {
    const errors: string[] = [];
    
    if (!cardDetails.number || cardDetails.number.replace(/\s/g, '').length < 13) {
      errors.push('Valid card number is required');
    }
    
    if (!cardDetails.expiry || !/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
      errors.push('Valid expiry date is required (MM/YY)');
    }
    
    if (!cardDetails.cvc || cardDetails.cvc.length < 3) {
      errors.push('Valid CVC is required');
    }
    
    if (!cardDetails.name.trim()) {
      errors.push('Cardholder name is required');
    }
    
    if (!cardDetails.zip.trim()) {
      errors.push('ZIP code is required');
    }
    
    return errors;
  };

  const processPayment = async () => {
    if (selectedMethod === 'card') {
      const errors = validateCardDetails();
      if (errors.length > 0) {
        toast({
          title: "Payment Error",
          description: errors.join(', '),
          variant: "destructive"
        });
        return;
      }
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In a real implementation, you would:
      // 1. Create payment intent on your backend
      // 2. Confirm payment with Stripe
      // 3. Handle 3D Secure if required
      // 4. Update order status

      const mockPaymentIntent = {
        id: `pi_${Math.random().toString(36).substring(2, 15)}`,
        amount,
        currency,
        status: 'succeeded',
        payment_method: selectedMethod
      };

      toast({
        title: "Payment Successful",
        description: `Payment of ${formatAmount(amount)} has been processed successfully.`
      });

      onSuccess?.(mockPaymentIntent);

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
      onError?.(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getCardBrand = (number: string) => {
    const num = number.replace(/\s/g, '');
    if (/^4/.test(num)) return 'Visa';
    if (/^5[1-5]/.test(num)) return 'Mastercard';
    if (/^3[47]/.test(num)) return 'American Express';
    if (/^6/.test(num)) return 'Discover';
    return null;
  };

  return (
    <Card className={`w-full max-w-md ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-['Poppins']">
          <Shield className="h-5 w-5 text-green-600" />
          Secure Payment
        </CardTitle>
        <CardDescription className="font-['Inter']">
          Total: <span className="font-semibold text-[hsl(183,100%,23%)]">{formatAmount(amount)}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Payment Method Selection */}
        <Tabs value={selectedMethod} onValueChange={setSelectedMethod}>
          <TabsList className="grid w-full grid-cols-3">
            {paymentMethods.filter(method => method.enabled).map(method => (
              <TabsTrigger key={method.id} value={method.id} className="text-xs">
                {method.icon}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Credit Card Form */}
          <TabsContent value="card" className="space-y-4 mt-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="card-number" className="text-sm font-semibold">Card Number</Label>
                <div className="relative">
                  <Input
                    id="card-number"
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.number}
                    onChange={(e) => handleCardInputChange('number', e.target.value)}
                    maxLength={23}
                    className="pr-16"
                  />
                  {getCardBrand(cardDetails.number) && (
                    <Badge variant="secondary" className="absolute right-2 top-1/2 -translate-y-1/2 text-xs">
                      {getCardBrand(cardDetails.number)}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="expiry" className="text-sm font-semibold">Expiry</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) => handleCardInputChange('expiry', e.target.value)}
                    maxLength={5}
                  />
                </div>
                <div>
                  <Label htmlFor="cvc" className="text-sm font-semibold">CVC</Label>
                  <Input
                    id="cvc"
                    placeholder="123"
                    value={cardDetails.cvc}
                    onChange={(e) => handleCardInputChange('cvc', e.target.value)}
                    maxLength={4}
                    type="password"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="name" className="text-sm font-semibold">Cardholder Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={cardDetails.name}
                  onChange={(e) => handleCardInputChange('name', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="zip" className="text-sm font-semibold">ZIP Code</Label>
                <Input
                  id="zip"
                  placeholder="12345"
                  value={cardDetails.zip}
                  onChange={(e) => handleCardInputChange('zip', e.target.value)}
                  maxLength={10}
                />
              </div>
            </div>
          </TabsContent>

          {/* Apple Pay */}
          <TabsContent value="apple_pay" className="mt-6">
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Smartphone className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 font-['Inter']">
                Use Touch ID or Face ID to pay with Apple Pay
              </p>
            </div>
          </TabsContent>

          {/* Google Pay */}
          <TabsContent value="google_pay" className="mt-6">
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Wallet className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 font-['Inter']">
                Fast and secure checkout with Google Pay
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Security Notice */}
        <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
          <Lock className="h-4 w-4 text-green-600" />
          <span className="font-['Inter']">
            Your payment information is encrypted and secure. We use Stripe for payment processing.
          </span>
        </div>

        {/* Payment Button */}
        <Button 
          onClick={processPayment}
          disabled={isProcessing}
          className="w-full bg-[hsl(183,100%,23%)] hover:bg-[hsl(183,60%,40%)] h-12 text-lg font-semibold"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              Processing...
            </div>
          ) : (
            `Pay ${formatAmount(amount)}`
          )}
        </Button>

        {/* Accepted Cards */}
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-2 font-['Inter']">We accept</p>
          <div className="flex justify-center gap-3">
            {['Visa', 'Mastercard', 'Amex', 'Discover'].map(card => (
              <Badge key={card} variant="outline" className="text-xs">
                {card}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}