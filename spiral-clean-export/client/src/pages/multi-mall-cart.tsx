import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ShoppingCart,
  Store,
  MapPin,
  Truck,
  Package,
  CreditCard,
  Plus,
  Minus,
  Trash2,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  storeId: string;
  storeName: string;
  mallId: string;
  mallName: string;
  category: string;
  fulfillmentMethod: 'ship-to-me' | 'pickup' | 'mall-center';
  availability: 'in-stock' | 'low-stock' | 'out-of-stock';
  estimatedDelivery: string;
}

interface Mall {
  id: string;
  name: string;
  location: string;
  storeCount: number;
  spiralCenter: boolean;
  shippingFee: number;
}

export default function MultiMallCart() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Wireless Bluetooth Headphones',
      price: 89.99,
      quantity: 1,
      image: '/api/placeholder/100/100',
      storeId: 'store1',
      storeName: 'Best Buy',
      mallId: 'mall1',
      mallName: 'Southdale Center',
      category: 'Electronics',
      fulfillmentMethod: 'pickup',
      availability: 'in-stock',
      estimatedDelivery: 'Ready today'
    },
    {
      id: '2',
      name: 'Designer Leather Handbag',
      price: 249.99,
      quantity: 1,
      image: '/api/placeholder/100/100',
      storeId: 'store2',
      storeName: 'Nordstrom',
      mallId: 'mall1',
      mallName: 'Southdale Center',
      category: 'Fashion',
      fulfillmentMethod: 'ship-to-me',
      availability: 'in-stock',
      estimatedDelivery: '2-3 business days'
    },
    {
      id: '3',
      name: 'Smart Home Speaker',
      price: 129.99,
      quantity: 2,
      image: '/api/placeholder/100/100',
      storeId: 'store3',
      storeName: 'Apple Store',
      mallId: 'mall2',
      mallName: 'Mall of America',
      category: 'Electronics',
      fulfillmentMethod: 'mall-center',
      availability: 'in-stock',
      estimatedDelivery: 'Ready in 2 hours'
    },
    {
      id: '4',
      name: 'Organic Coffee Beans',
      price: 24.99,
      quantity: 3,
      image: '/api/placeholder/100/100',
      storeId: 'store4',
      storeName: 'Local Coffee Roasters',
      mallId: 'mall2',
      mallName: 'Mall of America',
      category: 'Food & Beverage',
      fulfillmentMethod: 'pickup',
      availability: 'low-stock',
      estimatedDelivery: 'Ready today'
    }
  ]);

  const [malls] = useState<Mall[]>([
    { id: 'mall1', name: 'Southdale Center', location: 'Edina, MN', storeCount: 120, spiralCenter: true, shippingFee: 0 },
    { id: 'mall2', name: 'Mall of America', location: 'Bloomington, MN', storeCount: 500, spiralCenter: true, shippingFee: 0 },
    { id: 'mall3', name: 'Ridgedale Center', location: 'Minnetonka, MN', storeCount: 145, spiralCenter: false, shippingFee: 4.99 }
  ]);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }

    setCartItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
    toast({
      title: "Item Removed",
      description: "Item has been removed from your cart."
    });
  };

  const updateFulfillmentMethod = (itemId: string, method: 'ship-to-me' | 'pickup' | 'mall-center') => {
    setCartItems(prev => prev.map(item => 
      item.id === itemId ? { 
        ...item, 
        fulfillmentMethod: method,
        estimatedDelivery: getEstimatedDelivery(method)
      } : item
    ));
  };

  const getEstimatedDelivery = (method: string) => {
    switch (method) {
      case 'pickup': return 'Ready today';
      case 'mall-center': return 'Ready in 2 hours';
      case 'ship-to-me': return '2-3 business days';
      default: return 'TBD';
    }
  };

  const groupItemsByMall = () => {
    const grouped: { [mallId: string]: CartItem[] } = {};
    cartItems.forEach(item => {
      if (!grouped[item.mallId]) {
        grouped[item.mallId] = [];
      }
      grouped[item.mallId].push(item);
    });
    return grouped;
  };

  const getMallSubtotal = (mallItems: CartItem[]) => {
    return mallItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getMallShippingFee = (mallId: string, items: CartItem[]) => {
    const mall = malls.find(m => m.id === mallId);
    const hasShippingItems = items.some(item => item.fulfillmentMethod === 'ship-to-me');
    
    if (!hasShippingItems) return 0;
    if (mall?.spiralCenter) return 0; // Free shipping from SPIRAL Centers
    
    return mall?.shippingFee || 4.99;
  };

  const getTotalSPIRALPoints = () => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return Math.floor(total * 0.05); // 5 points per dollar
  };

  const getTotalAmount = () => {
    const groupedItems = groupItemsByMall();
    let total = 0;
    
    Object.entries(groupedItems).forEach(([mallId, items]) => {
      total += getMallSubtotal(items);
      total += getMallShippingFee(mallId, items);
    });
    
    return total;
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'in-stock': return 'text-green-600';
      case 'low-stock': return 'text-yellow-600';
      case 'out-of-stock': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getFulfillmentIcon = (method: string) => {
    switch (method) {
      case 'pickup': return <Store className="h-4 w-4" />;
      case 'mall-center': return <MapPin className="h-4 w-4" />;
      case 'ship-to-me': return <Truck className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const proceedToCheckout = () => {
    toast({
      title: "Proceeding to Checkout",
      description: `${cartItems.length} items from ${Object.keys(groupItemsByMall()).length} malls`
    });
    setLocation('/multi-retailer-checkout');
  };

  const groupedItems = groupItemsByMall();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--spiral-navy)] mb-2">Multi-Mall Cart</h1>
          <p className="text-gray-600">
            Shopping from {Object.keys(groupedItems).length} malls • {cartItems.length} items total
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {Object.entries(groupedItems).map(([mallId, mallItems]) => {
              const mall = malls.find(m => m.id === mallId);
              const subtotal = getMallSubtotal(mallItems);
              const shippingFee = getMallShippingFee(mallId, mallItems);

              return (
                <Card key={mallId} className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-[var(--spiral-navy)] to-[var(--spiral-coral)] text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-6 w-6" />
                        <div>
                          <CardTitle>{mall?.name}</CardTitle>
                          <p className="text-sm opacity-90">{mall?.location} • {mallItems.length} items</p>
                        </div>
                      </div>
                      {mall?.spiralCenter && (
                        <Badge className="bg-white text-[var(--spiral-navy)]">
                          SPIRAL Center
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {mallItems.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-16 h-16 rounded object-cover"
                          />
                          
                          <div className="flex-1">
                            <h3 className="font-semibold">{item.name}</h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Store className="h-4 w-4" />
                              <span>{item.storeName}</span>
                              <Badge variant="outline">{item.category}</Badge>
                            </div>
                            <div className={`text-sm ${getAvailabilityColor(item.availability)}`}>
                              {item.availability.replace('-', ' ').toUpperCase()}
                            </div>
                          </div>

                          <div className="text-center">
                            <div className="flex items-center space-x-2 mb-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="font-semibold">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                          </div>

                          <div className="text-center">
                            <select
                              value={item.fulfillmentMethod}
                              onChange={(e) => updateFulfillmentMethod(item.id, e.target.value as any)}
                              className="border rounded px-2 py-1 text-sm mb-2"
                            >
                              <option value="pickup">Store Pickup</option>
                              <option value="mall-center">SPIRAL Center</option>
                              <option value="ship-to-me">Ship to Me</option>
                            </select>
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              {getFulfillmentIcon(item.fulfillmentMethod)}
                              <span>{item.estimatedDelivery}</span>
                            </div>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-4" />

                    {/* Mall Subtotal */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal ({mallItems.length} items)</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      {shippingFee > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Shipping Fee</span>
                          <span>${shippingFee.toFixed(2)}</span>
                        </div>
                      )}
                      {shippingFee === 0 && mallItems.some(item => item.fulfillmentMethod === 'ship-to-me') && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Shipping Fee</span>
                          <span>FREE (SPIRAL Center)</span>
                        </div>
                      )}
                      <div className="flex justify-between font-semibold">
                        <span>Mall Total</span>
                        <span>${(subtotal + shippingFee).toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Order Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {Object.entries(groupedItems).map(([mallId, mallItems]) => {
                    const mall = malls.find(m => m.id === mallId);
                    const subtotal = getMallSubtotal(mallItems);
                    const shippingFee = getMallShippingFee(mallId, mallItems);

                    return (
                      <div key={mallId} className="p-3 bg-gray-50 rounded-lg">
                        <div className="font-semibold text-sm mb-1">{mall?.name}</div>
                        <div className="flex justify-between text-sm">
                          <span>{mallItems.length} items</span>
                          <span>${(subtotal + shippingFee).toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Items ({cartItems.length})</span>
                    <span>${cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      ${Object.entries(groupedItems).reduce((sum, [mallId, items]) => 
                        sum + getMallShippingFee(mallId, items), 0
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (estimated)</span>
                    <span>${(getTotalAmount() * 0.08).toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${(getTotalAmount() * 1.08).toFixed(2)}</span>
                </div>

                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-semibold">
                      You'll earn {getTotalSPIRALPoints()} SPIRAL points!
                    </span>
                  </div>
                </div>

                <Button
                  onClick={proceedToCheckout}
                  className="w-full bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90"
                  disabled={cartItems.length === 0}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Proceed to Checkout
                </Button>

                <div className="text-xs text-gray-500 text-center">
                  Secure checkout powered by SPIRAL
                </div>
              </CardContent>
            </Card>

            {/* Fulfillment Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Fulfillment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {['pickup', 'mall-center', 'ship-to-me'].map(method => {
                    const methodItems = cartItems.filter(item => item.fulfillmentMethod === method);
                    if (methodItems.length === 0) return null;

                    const methodNames = {
                      'pickup': 'Store Pickup',
                      'mall-center': 'SPIRAL Center',
                      'ship-to-me': 'Ship to Me'
                    };

                    return (
                      <div key={method} className="flex justify-between">
                        <div className="flex items-center space-x-2">
                          {getFulfillmentIcon(method)}
                          <span>{methodNames[method as keyof typeof methodNames]}</span>
                        </div>
                        <span>{methodItems.length} items</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}