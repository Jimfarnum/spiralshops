import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Store, CreditCard, Truck, CheckCircle, Plus, Minus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CartItem {
  id: string;
  title: string;
  price: number;
  category: string;
  storeName: string;
  storeId: number;
  quantity: number;
  imageUrl: string;
  inStock: boolean;
}

interface RetailerGroup {
  storeId: number;
  storeName: string;
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

export default function MultiRetailerCheckout() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [groupedCart, setGroupedCart] = useState<RetailerGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const { toast } = useToast();

  // Customer Information
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  });

  // Payment Information
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });

  // Load sample cart items from different retailers
  useEffect(() => {
    const loadSampleCart = async () => {
      try {
        const response = await fetch('/api/products?limit=20');
        const data = await response.json();
        
        if (data.products && data.products.length > 0) {
          // Create sample cart items from different stores - ensuring we get variety
          const sampleItems: CartItem[] = data.products.slice(0, 8).map((product: any, index: number) => ({
            id: product.id || product._id || `item_${index}`,
            title: product.title || `Product ${index + 1}`,
            price: (product.price || (Math.floor(Math.random() * 5000) + 1000)) / 100, // Convert from cents
            category: product.category || 'General',
            storeName: product.storeName || ['Target Store', 'Local Coffee Shop', 'Best Buy Electronics', 'Fashion Boutique'][index % 4],
            storeId: product.storeId || (index % 4) + 1,
            quantity: Math.floor(Math.random() * 3) + 1,
            imageUrl: product.imageUrl || '',
            inStock: product.inStock !== false
          }));
          
          setCartItems(sampleItems);
          groupItemsByRetailer(sampleItems);
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        toast({
          title: "Error",
          description: "Failed to load cart items",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadSampleCart();
  }, [toast]);

  const groupItemsByRetailer = (items: CartItem[]) => {
    const grouped = items.reduce((acc: { [key: number]: RetailerGroup }, item) => {
      if (!acc[item.storeId]) {
        acc[item.storeId] = {
          storeId: item.storeId,
          storeName: item.storeName,
          items: [],
          subtotal: 0,
          itemCount: 0
        };
      }
      
      acc[item.storeId].items.push(item);
      acc[item.storeId].subtotal += item.price * item.quantity;
      acc[item.storeId].itemCount += item.quantity;
      
      return acc;
    }, {});

    setGroupedCart(Object.values(grouped));
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedItems = cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedItems);
    groupItemsByRetailer(updatedItems);
  };

  const removeItem = (itemId: string) => {
    const updatedItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedItems);
    groupItemsByRetailer(updatedItems);
    
    toast({
      title: "Item Removed",
      description: "Item has been removed from your cart"
    });
  };

  const calculateTotals = () => {
    const subtotal = groupedCart.reduce((sum, group) => sum + group.subtotal, 0);
    const tax = subtotal * 0.08; // 8% tax
    const shipping = groupedCart.length * 4.99; // $4.99 per retailer
    const total = subtotal + tax + shipping;
    
    return {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      shipping: shipping.toFixed(2),
      total: total.toFixed(2),
      retailerCount: groupedCart.length,
      totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0)
    };
  };

  const processOrder = async () => {
    setIsProcessing(true);
    
    // Validate forms
    if (!customerInfo.name || !customerInfo.email || !paymentInfo.cardNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      setIsProcessing(false);
      return;
    }

    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const totals = calculateTotals();
      
      // Create order
      const orderData = {
        items: cartItems,
        customer: customerInfo,
        payment: { ...paymentInfo, cardNumber: '****' },
        totals,
        retailers: groupedCart.map(group => ({
          storeId: group.storeId,
          storeName: group.storeName,
          itemCount: group.itemCount,
          subtotal: group.subtotal.toFixed(2)
        })),
        orderDate: new Date().toISOString(),
        orderNumber: `SPIRAL-${Date.now()}`
      };

      console.log('Order processed:', orderData);
      setOrderComplete(true);
      
      toast({
        title: "Order Successful!",
        description: `Your order for $${totals.total} has been processed across ${totals.retailerCount} retailers`
      });
      
    } catch (error) {
      toast({
        title: "Order Failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const totals = calculateTotals();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-[#006d77] animate-pulse" />
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-6 flex items-center justify-center">
        <Card className="max-w-2xl w-full">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Complete!</h1>
            <p className="text-gray-600 mb-6">
              Your order for ${totals.total} has been successfully processed across {totals.retailerCount} retailers.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-600">Order Number: SPIRAL-{Date.now()}</p>
              <p className="text-sm text-gray-600">Confirmation email sent to {customerInfo.email}</p>
            </div>
            <Button onClick={() => window.location.href = '/'} className="bg-[#006d77] hover:bg-[#005a5f]">
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🛒 Multi-Retailer Checkout
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Shop from multiple retailers, pay once
          </p>
          <Badge variant="outline" className="text-sm bg-blue-50 text-blue-800 border-blue-200">
            {totals.totalItems} items from {totals.retailerCount} retailers
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items - Left Column */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Your Cart ({totals.totalItems} items)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {groupedCart.map((group) => (
                  <div key={group.storeId} className="mb-6">
                    <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
                      <Store className="w-5 h-5 text-[#006d77]" />
                      <h3 className="font-semibold text-lg">{group.storeName}</h3>
                      <Badge variant="outline" className="ml-auto">
                        {group.itemCount} items - ${group.subtotal.toFixed(2)}
                      </Badge>
                    </div>
                    
                    {group.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg mb-3">
                        <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                          <Store className="w-8 h-8 text-gray-400" />
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-gray-600">{item.category}</p>
                          <p className="text-lg font-semibold text-[#006d77]">${item.price.toFixed(2)}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                      placeholder="123 Main St"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={customerInfo.city}
                      onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})}
                      placeholder="Minneapolis"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={customerInfo.state}
                      onChange={(e) => setCustomerInfo({...customerInfo, state: e.target.value})}
                      placeholder="MN"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary & Payment - Right Column */}
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal ({totals.totalItems} items)</span>
                    <span>${totals.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${totals.tax}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping ({totals.retailerCount} retailers)</span>
                    <span>${totals.shipping}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-[#006d77]">${totals.total}</span>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Payment Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Payment Information</h4>
                  <div>
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      value={paymentInfo.cardNumber}
                      onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})}
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry</Label>
                      <Input
                        id="expiryDate"
                        value={paymentInfo.expiryDate}
                        onChange={(e) => setPaymentInfo({...paymentInfo, expiryDate: e.target.value})}
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        value={paymentInfo.cvv}
                        onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
                        placeholder="123"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="nameOnCard">Name on Card</Label>
                    <Input
                      id="nameOnCard"
                      value={paymentInfo.nameOnCard}
                      onChange={(e) => setPaymentInfo({...paymentInfo, nameOnCard: e.target.value})}
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <Button
                  onClick={processOrder}
                  disabled={isProcessing}
                  className="w-full mt-6 bg-[#006d77] hover:bg-[#005a5f] text-white py-3 text-lg"
                >
                  {isProcessing ? (
                    <>Processing Order...</>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Complete Order - ${totals.total}
                    </>
                  )}
                </Button>

                <div className="mt-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <Truck className="w-4 h-4" />
                    <span>Secure checkout across {totals.retailerCount} retailers</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}