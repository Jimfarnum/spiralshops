import React, { useEffect, useState } from 'react';
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, CreditCard, Shield, ArrowLeft, Package } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useCartStore } from '@/lib/cartStore';
import SpiralsExplainer from '@/components/SpiralsExplainer';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface CheckoutFormProps {
  clientSecret: string;
  orderDetails: any;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ clientSecret, orderDetails }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const clearCart = useCartStore(state => state.clearCart);
  const [, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation`,
        },
        redirect: 'if_required'
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Process the successful payment
        try {
          const response = await fetch('/api/process-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              paymentIntentId: paymentIntent.id,
              orderData: orderDetails,
              spiralPoints: orderDetails.spiralPointsUsed || 0
            }),
          });

          const result = await response.json();

          if (result.success) {
            clearCart();
            toast({
              title: "Payment Successful!",
              description: `Order confirmed! You earned ${result.spiralPointsEarned} SPIRAL points.`,
            });
            navigate('/order-confirmation?payment_intent=' + paymentIntent.id);
          } else {
            throw new Error(result.error || 'Order processing failed');
          }
        } catch (processingError: any) {
          toast({
            title: "Payment Successful, Order Processing Issue",
            description: "Your payment went through, but there was an issue processing your order. Please contact support.",
            variant: "destructive",
          });
        }
      }
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Complete Your Payment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <PaymentElement 
            options={{
              layout: 'tabs'
            }}
          />
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Shield className="w-4 h-4 text-green-600" />
            <span>Secured by Stripe • Your payment information is encrypted</span>
          </div>
          
          <Button 
            type="submit" 
            disabled={!stripe || isLoading}
            className="w-full mobile-button bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Processing...
              </div>
            ) : (
              `Pay $${orderDetails.total?.toFixed(2) || '0.00'}`
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const cartItems = useCartStore(state => state.items);
  const [, navigate] = useLocation();

  // Calculate order totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.0875; // 8.75% tax
  const shipping = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
  const total = subtotal + tax + shipping;

  useEffect(() => {
    if (cartItems.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Add some items before checking out.",
        variant: "destructive",
      });
      navigate('/products');
      return;
    }

    // Create PaymentIntent as soon as the page loads
    const createPaymentIntent = async () => {
      try {
        setLoading(true);
        
        const orderData = {
          items: cartItems,
          subtotal,
          tax,
          shipping,
          total,
          metadata: {
            source: "SPIRAL_checkout",
            itemCount: cartItems.length
          }
        };

        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: total,
            metadata: orderData.metadata
          }),
        });

        const data = await response.json();
        
        if (data.success) {
          setClientSecret(data.clientSecret);
          setOrderDetails(orderData);
        } else {
          throw new Error(data.error || 'Failed to create payment intent');
        }
      } catch (error: any) {
        toast({
          title: "Checkout Error",
          description: error.message || "Failed to initialize checkout",
          variant: "destructive",
        });
        navigate('/cart');
      } finally {
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [cartItems, total, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-[var(--spiral-coral)] border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-gray-600">Preparing your checkout...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-600">Unable to initialize checkout. Please try again.</p>
            <Link to="/cart">
              <Button className="mt-4">Return to Cart</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link to="/cart" className="inline-flex items-center gap-2 text-[var(--spiral-navy)] hover:text-[var(--spiral-navy)]/80 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your purchase securely with Stripe</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.store}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-green-700">
                    💰 You'll earn <strong>{Math.floor(total * 5)}</strong> SPIRAL points with this purchase!
                  </p>
                  <div className="mt-2">
                    <SpiralsExplainer triggerText="How SPIRALS work" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div className="space-y-6">
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm clientSecret={clientSecret} orderDetails={orderDetails} />
            </Elements>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-white rounded-lg">
                <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Secure</p>
                <p className="text-xs text-gray-600">SSL Encrypted</p>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <CreditCard className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Stripe</p>
                <p className="text-xs text-gray-600">Payment Processing</p>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <Badge className="w-8 h-8 text-[var(--spiral-coral)] mx-auto mb-2" />
                <p className="text-sm font-medium">SPIRAL</p>
                <p className="text-xs text-gray-600">Rewards Included</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}