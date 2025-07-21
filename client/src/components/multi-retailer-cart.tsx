import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Store, 
  MapPin, 
  Truck, 
  Package,
  Building2,
  CreditCard,
  Gift
} from 'lucide-react';
import { Link } from 'wouter';

interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  storeId: string;
  storeName: string;
  mallId?: string;
  mallName?: string;
  fulfillmentMethod: 'ship-to-me' | 'in-store-pickup' | 'ship-to-mall';
  imageUrl?: string;
  category: string;
  inStock: boolean;
  maxQuantity: number;
}

interface CartSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  spiralsEarned: number;
}

const mockCartItems: CartItem[] = [
  {
    id: '1',
    productId: 'prod-1',
    productName: 'iPhone 15 Pro Max',
    productPrice: 1199.00,
    quantity: 1,
    storeId: 'store-1',
    storeName: 'Apple Store',
    mallId: 'mall-1',
    mallName: 'Westfield Valley Fair',
    fulfillmentMethod: 'in-store-pickup',
    category: 'Electronics',
    inStock: true,
    maxQuantity: 2,
  },
  {
    id: '2',
    productId: 'prod-2',
    productName: 'Designer Handbag',
    productPrice: 450.00,
    quantity: 1,
    storeId: 'store-2',
    storeName: 'Nordstrom',
    mallId: 'mall-1',
    mallName: 'Westfield Valley Fair',
    fulfillmentMethod: 'ship-to-me',
    category: 'Fashion',
    inStock: true,
    maxQuantity: 1,
  },
  {
    id: '3',
    productId: 'prod-3',
    productName: 'Coffee Beans - Premium Blend',
    productPrice: 24.99,
    quantity: 2,
    storeId: 'store-3',
    storeName: 'Blue Bottle Coffee',
    mallId: 'mall-2',
    mallName: 'Stanford Shopping Center',
    fulfillmentMethod: 'ship-to-mall',
    category: 'Food & Beverage',
    inStock: true,
    maxQuantity: 10,
  },
];

export default function MultiRetailerCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems);
  const [appliedGiftCard, setAppliedGiftCard] = useState<string>('');
  const { toast } = useToast();

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.id === itemId) {
          if (newQuantity > item.maxQuantity) {
            toast({
              title: "Quantity Limit Reached",
              description: `Maximum quantity for ${item.productName} is ${item.maxQuantity}`,
              variant: "destructive",
            });
            return item;
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const updateFulfillmentMethod = (itemId: string, method: CartItem['fulfillmentMethod']) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, fulfillmentMethod: method } : item
      )
    );
    
    toast({
      title: "Fulfillment Updated",
      description: "Item fulfillment method has been updated.",
    });
  };

  const removeItem = (itemId: string) => {
    const item = cartItems.find(item => item.id === itemId);
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    
    toast({
      title: "Item Removed",
      description: `${item?.productName} removed from cart.`,
    });
  };

  const calculateSummary = (): CartSummary => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.productPrice * item.quantity), 0);
    
    // Calculate shipping by fulfillment method
    const shippingCost = cartItems.reduce((sum, item) => {
      if (item.fulfillmentMethod === 'ship-to-me') return sum + 9.99;
      if (item.fulfillmentMethod === 'ship-to-mall') return sum + 4.99;
      return sum; // in-store-pickup is free
    }, 0);
    
    const tax = subtotal * 0.0875; // 8.75% tax rate
    const total = subtotal + shippingCost + tax;
    const spiralsEarned = Math.floor(total / 100 * 5); // 5 SPIRALs per $100

    return {
      subtotal,
      shipping: shippingCost,
      tax,
      total,
      spiralsEarned,
    };
  };

  const groupItemsByStore = () => {
    return cartItems.reduce((groups, item) => {
      const key = `${item.storeId}-${item.mallId || 'online'}`;
      if (!groups[key]) {
        groups[key] = {
          storeId: item.storeId,
          storeName: item.storeName,
          mallId: item.mallId,
          mallName: item.mallName,
          items: [],
        };
      }
      groups[key].items.push(item);
      return groups;
    }, {} as Record<string, {
      storeId: string;
      storeName: string;
      mallId?: string;
      mallName?: string;
      items: CartItem[];
    }>);
  };

  const getFulfillmentIcon = (method: CartItem['fulfillmentMethod']) => {
    switch (method) {
      case 'ship-to-me': return <Truck className="h-4 w-4" />;
      case 'in-store-pickup': return <Store className="h-4 w-4" />;
      case 'ship-to-mall': return <Building2 className="h-4 w-4" />;
    }
  };

  const getFulfillmentLabel = (method: CartItem['fulfillmentMethod']) => {
    switch (method) {
      case 'ship-to-me': return 'Ship to Me';
      case 'in-store-pickup': return 'In-Store Pickup';
      case 'ship-to-mall': return 'Ship to Mall';
    }
  };

  const getFulfillmentColor = (method: CartItem['fulfillmentMethod']) => {
    switch (method) {
      case 'ship-to-me': return 'bg-blue-100 text-blue-800';
      case 'in-store-pickup': return 'bg-green-100 text-green-800';
      case 'ship-to-mall': return 'bg-purple-100 text-purple-800';
    }
  };

  const summary = calculateSummary();
  const storeGroups = groupItemsByStore();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Discover amazing products from local retailers</p>
          <Link href="/products">
            <Button className="button-primary">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--spiral-navy)] mb-2">Shopping Cart</h1>
        <p className="text-gray-600">
          {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} from {Object.keys(storeGroups).length} {Object.keys(storeGroups).length === 1 ? 'store' : 'stores'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {Object.values(storeGroups).map((storeGroup) => (
            <Card key={`${storeGroup.storeId}-${storeGroup.mallId}`}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Store className="h-5 w-5 text-[var(--spiral-coral)]" />
                    <div>
                      <CardTitle className="text-lg">{storeGroup.storeName}</CardTitle>
                      {storeGroup.mallName && (
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {storeGroup.mallName}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge variant="outline">
                    {storeGroup.items.length} {storeGroup.items.length === 1 ? 'item' : 'items'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {storeGroup.items.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package className="h-6 w-6 text-gray-400" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 mb-1">{item.productName}</h3>
                        <p className="text-sm text-gray-600 mb-2">{item.category}</p>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className={getFulfillmentColor(item.fulfillmentMethod)}>
                            {getFulfillmentIcon(item.fulfillmentMethod)}
                            <span className="ml-1 text-xs">{getFulfillmentLabel(item.fulfillmentMethod)}</span>
                          </Badge>
                          {!item.inStock && (
                            <Badge variant="destructive">Out of Stock</Badge>
                          )}
                        </div>
                        
                        {/* Fulfillment Method Selector */}
                        <div className="mb-3">
                          <Select 
                            value={item.fulfillmentMethod} 
                            onValueChange={(value: CartItem['fulfillmentMethod']) => 
                              updateFulfillmentMethod(item.id, value)
                            }
                          >
                            <SelectTrigger className="w-48 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ship-to-me">
                                <div className="flex items-center gap-2">
                                  <Truck className="h-3 w-3" />
                                  Ship to Me (+$9.99)
                                </div>
                              </SelectItem>
                              <SelectItem value="in-store-pickup">
                                <div className="flex items-center gap-2">
                                  <Store className="h-3 w-3" />
                                  In-Store Pickup (Free)
                                </div>
                              </SelectItem>
                              <SelectItem value="ship-to-mall">
                                <div className="flex items-center gap-2">
                                  <Building2 className="h-3 w-3" />
                                  Ship to Mall (+$4.99)
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900 mb-2">
                          ${item.productPrice.toFixed(2)}
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.maxQuantity}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${summary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${summary.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${summary.tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${summary.total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="bg-[var(--spiral-cream)] border border-[var(--spiral-coral)] rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[var(--spiral-navy)]">
                    SPIRALs Earned
                  </span>
                  <span className="font-bold text-[var(--spiral-coral)]">
                    +{summary.spiralsEarned}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Earn 5 SPIRALs per $100 spent
                </p>
              </div>
              
              <div className="space-y-3">
                <Button className="w-full button-primary" size="lg">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Proceed to Checkout
                </Button>
                
                <Button variant="outline" className="w-full">
                  <Gift className="h-4 w-4 mr-2" />
                  Apply Gift Card
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Fulfillment Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Fulfillment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['ship-to-me', 'in-store-pickup', 'ship-to-mall'].map((method) => {
                  const count = cartItems.filter(item => item.fulfillmentMethod === method).length;
                  if (count === 0) return null;
                  
                  return (
                    <div key={method} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        {getFulfillmentIcon(method as CartItem['fulfillmentMethod'])}
                        <span>{getFulfillmentLabel(method as CartItem['fulfillmentMethod'])}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {count} {count === 1 ? 'item' : 'items'}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}