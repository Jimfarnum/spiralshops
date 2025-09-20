import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCartStore } from '@/stores/cartStore';
import { CreditCard, MapPin, Truck, Zap, Shield, Check, Clock, Package, Star, Sparkles } from 'lucide-react';
import { Link } from 'wouter';

export default function OneClickCheckout() {
  const [selectedPayment, setSelectedPayment] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedShipping, setSelectedShipping] = useState('standard');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { items, getTotalPrice, clearCart } = useCartStore();
  
  // Mock user ID - in real app, get from auth
  const userId = '1';

  // Load saved payment methods
  const { data: paymentMethods, isLoading: paymentLoading } = useQuery({
    queryKey: ['/api/saved-payment-methods', userId],
    queryFn: async () => {
      const response = await fetch(`/api/saved-payment-methods/${userId}`);
      if (!response.ok) throw new Error('Failed to load payment methods');
      const data = await response.json();
      return data.paymentMethods || [];
    }
  });

  // Load saved addresses
  const { data: addresses, isLoading: addressLoading } = useQuery({
    queryKey: ['/api/saved-addresses', userId],
    queryFn: async () => {
      const response = await fetch(`/api/saved-addresses/${userId}`);
      if (!response.ok) throw new Error('Failed to load addresses');
      const data = await response.json();
      return data.addresses || [];
    }
  });

  // Set defaults when data loads
  useEffect(() => {
    if (paymentMethods?.length && !selectedPayment) {
      const defaultMethod = paymentMethods.find((m: any) => m.isDefault);
      setSelectedPayment(defaultMethod?.id || paymentMethods[0]?.id || '');
    }
  }, [paymentMethods, selectedPayment]);

  useEffect(() => {
    if (addresses?.length && !selectedAddress) {
      const defaultAddress = addresses.find((a: any) => a.isDefault);
      setSelectedAddress(defaultAddress?.id || addresses[0]?.id || '');
    }
  }, [addresses, selectedAddress]);

  // One-click checkout mutation
  const oneClickCheckoutMutation = useMutation({
    mutationFn: async () => {
      const cartItems = items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        store: item.store
      }));

      const response = await fetch('/api/one-click-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          cartItems,
          paymentMethodId: selectedPayment,
          addressId: selectedAddress,
          shippingOption: selectedShipping
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Checkout failed');
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Order Completed! 🎉",
        description: `Order ${data.orderId} processed in ${data.processingTime}. You earned ${data.spiralsEarned} SPIRALs!`,
      });
      
      // Clear cart after successful checkout
      clearCart();
      
      // Redirect to order confirmation
      window.location.href = `/order-confirmation?orderId=${data.orderId}`;
    },
    onError: (error: Error) => {
      toast({
        title: "Checkout Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const processOneClickCheckout = () => {
    if (!selectedPayment || !selectedAddress) {
      toast({
        title: "Missing Information",
        description: "Please select payment method and shipping address.",
        variant: "destructive"
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before checkout.",
        variant: "destructive"
      });
      return;
    }

    oneClickCheckoutMutation.mutate();
  };

  const subtotal = getTotalPrice();
  const totalSpirals = Math.round(subtotal * 20); // 20 SPIRALs per dollar
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

  const isLoading = paymentLoading || addressLoading;
  const isProcessing = oneClickCheckoutMutation.isPending;

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex flex-col justify-center items-center h-64 space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          <p className="text-gray-600">Loading your saved information...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some items to your cart to use one-click checkout.</p>
            <Link href="/products">
              <Button className="bg-teal-600 hover:bg-teal-700">
                <Package className="h-4 w-4 mr-2" />
                Start Shopping
              </Button>
            </Link>
          </CardContent>
        </Card>
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
                    src={item.image || '/api/placeholder/300/300'}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.store || 'SPIRAL Mall'}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="bg-orange-100 text-orange-800">
                        <Sparkles className="h-3 w-3 mr-1" />
                        +{Math.round(item.price * item.quantity * 20)} SPIRALs
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${item.price.toFixed(2)}</p>
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
                {paymentMethods && paymentMethods.length > 0 ? (
                  paymentMethods.map((method: any) => (
                    <div key={method.id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value={method.id} id={method.id} />
                      <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <CreditCard className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="font-medium">
                                {method.card ? `${method.card.brand.charAt(0).toUpperCase() + method.card.brand.slice(1)} •••• ${method.card.last4}` : method.type}
                              </p>
                              <p className="text-sm text-gray-600">
                                {method.card ? `Expires ${method.card.exp_month}/${method.card.exp_year}` : 'Saved payment method'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {method.isDefault && (
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Star className="h-3 w-3" />
                                Default
                              </Badge>
                            )}
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                    <CreditCard className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-600 mb-2">No saved payment methods</p>
                    <Button variant="outline" size="sm">
                      Add Payment Method
                    </Button>
                  </div>
                )}
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
                {addresses && addresses.length > 0 ? (
                  addresses.map((address: any) => (
                    <div key={address.id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value={address.id} id={address.id} />
                      <Label htmlFor={address.id} className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <MapPin className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="font-medium">{address.name}</p>
                              <p className="text-sm text-gray-600">
                                {address.address}, {address.city}, {address.state} {address.zip}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {address.isDefault && (
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Star className="h-3 w-3" />
                                Default
                              </Badge>
                            )}
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                    <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-600 mb-2">No saved addresses</p>
                    <Button variant="outline" size="sm">
                      Add Address
                    </Button>
                  </div>
                )}
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
            disabled={isProcessing || !selectedPayment || !selectedAddress || items.length === 0}
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white shadow-lg"
            size="lg"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Processing Payment...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Complete Order - ${total.toFixed(2)}
              </div>
            )}
          </Button>

          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="text-center text-sm text-gray-600">
              <Clock className="w-4 h-4 inline mr-1" />
              Processing in &lt; 2 seconds
            </div>
            <div className="text-center text-sm text-gray-600">
              <Shield className="w-4 h-4 inline mr-1" />
              256-bit encrypted
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}