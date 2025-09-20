import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, MapPin, Truck, Zap, Shield, Check, Clock, Package } from 'lucide-react';

interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  retailer: string;
  spiralsEarned: number;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'applepay' | 'googlepay';
  name: string;
  details: string;
  isDefault: boolean;
}

interface ShippingAddress {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
}

export default function OneClickCheckout() {
  const [items, setItems] = useState<CheckoutItem[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedShipping, setSelectedShipping] = useState('standard');
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadCheckoutData();
  }, []);

  const loadCheckoutData = async () => {
    setLoading(true);
    
    try {
      // Mock data for demo
      const mockItems: CheckoutItem[] = [
        {
          id: '1',
          name: 'Wireless Bluetooth Headphones',
          price: 89.99,
          quantity: 1,
          image: '/api/placeholder/300/300',
          retailer: 'Tech Hub Electronics',
          spiralsEarned: 150
        },
        {
          id: '2',
          name: 'Summer Fashion Dress',
          price: 79.99,
          quantity: 1,
          image: '/api/placeholder/300/300',
          retailer: 'Fashion Forward Boutique',
          spiralsEarned: 200
        }
      ];

      const mockPaymentMethods: PaymentMethod[] = [
        {
          id: 'card_1',
          type: 'card',
          name: 'Visa ending in 4242',
          details: 'Expires 12/2027',
          isDefault: true
        },
        {
          id: 'paypal_1',
          type: 'paypal',
          name: 'PayPal',
          details: 'user@example.com',
          isDefault: false
        },
        {
          id: 'apple_1',
          type: 'applepay',
          name: 'Apple Pay',
          details: 'Touch ID or Face ID',
          isDefault: false
        }
      ];

      const mockAddresses: ShippingAddress[] = [
        {
          id: 'addr_1',
          name: 'John Smith',
          address: '123 Main Street',
          city: 'San Francisco',
          state: 'CA',
          zip: '94102',
          isDefault: true
        },
        {
          id: 'addr_2',
          name: 'John Smith (Work)',
          address: '456 Market Street, Suite 300',
          city: 'San Francisco',
          state: 'CA',
          zip: '94105',
          isDefault: false
        }
      ];

      setItems(mockItems);
      setPaymentMethods(mockPaymentMethods);
      setAddresses(mockAddresses);
      
      // Set defaults
      setSelectedPayment(mockPaymentMethods.find(p => p.isDefault)?.id || '');
      setSelectedAddress(mockAddresses.find(a => a.isDefault)?.id || '');
      
    } catch (error) {
      toast({
        title: "Loading Error",
        description: "Could not load checkout data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const processOneClickCheckout = async () => {
    if (!selectedPayment || !selectedAddress) {
      toast({
        title: "Missing Information",
        description: "Please select payment method and shipping address.",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Order Placed Successfully!",
        description: `Your order has been confirmed. You'll receive a confirmation email shortly.`,
      });

      // Redirect to order confirmation (in real app)
      console.log('Order placed successfully');
      
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an issue processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalSpirals = items.reduce((sum, item) => sum + item.spiralsEarned, 0);
  const shipping = selectedShipping === 'express' ? 9.99 : selectedShipping === 'overnight' ? 19.99 : 0;
  const tax = subtotal * 0.0875; // 8.75% tax
  const total = subtotal + shipping + tax;

  const shippingOptions = [
    {
      id: 'standard',
      name: 'Standard Shipping',
      description: '5-7 business days',
      price: 0,
      icon: Package
    },
    {
      id: 'express',
      name: 'Express Shipping',
      description: '2-3 business days',
      price: 9.99,
      icon: Truck
    },
    {
      id: 'overnight',
      name: 'Overnight Shipping',
      description: 'Next business day',
      price: 19.99,
      icon: Zap
    }
  ];

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-teal-600 flex items-center gap-2">
          <Zap className="w-8 h-8 text-yellow-500" />
          One-Click Checkout
        </h1>
        <p className="text-gray-600 mt-2">Complete your purchase in seconds with saved payment and shipping information</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Order Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.retailer}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="bg-orange-100 text-orange-800">
                        +{item.spiralsEarned} SPIRALs
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${item.price}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{method.name}</p>
                          <p className="text-sm text-gray-600">{method.details}</p>
                        </div>
                        {method.isDefault && (
                          <Badge variant="outline">Default</Badge>
                        )}
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                {addresses.map((address) => (
                  <div key={address.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value={address.id} id={address.id} />
                    <Label htmlFor={address.id} className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{address.name}</p>
                          <p className="text-sm text-gray-600">
                            {address.address}, {address.city}, {address.state} {address.zip}
                          </p>
                        </div>
                        {address.isDefault && (
                          <Badge variant="outline">Default</Badge>
                        )}
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Shipping Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Shipping Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedShipping} onValueChange={setSelectedShipping}>
                {shippingOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <div key={option.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value={option.id} id={option.id} />
                      <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="font-medium">{option.name}</p>
                              <p className="text-sm text-gray-600">{option.description}</p>
                            </div>
                          </div>
                          <p className="font-medium">
                            {option.price === 0 ? 'Free' : `$${option.price}`}
                          </p>
                        </div>
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* Order Total & Checkout */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              
              <div className="bg-orange-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-orange-800">
                  You'll earn {totalSpirals} SPIRALs with this order!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Security Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-500" />
                Security Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-500" />
                <span>256-bit SSL encryption</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-500" />
                <span>PCI DSS compliant</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-500" />
                <span>Fraud protection</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-500" />
                <span>Purchase protection</span>
              </div>
            </CardContent>
          </Card>

          {/* One-Click Checkout Button */}
          <Button
            onClick={processOneClickCheckout}
            disabled={processing || !selectedPayment || !selectedAddress}
            className="w-full h-12 text-lg font-semibold"
            size="lg"
          >
            {processing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Processing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Complete Order - ${total.toFixed(2)}
              </div>
            )}
          </Button>

          <div className="text-center text-sm text-gray-600">
            <Clock className="w-4 h-4 inline mr-1" />
            Secure checkout in under 10 seconds
          </div>
        </div>
      </div>
    </div>
  );
}