import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ShoppingCart, Truck, Store, MapPin, Package, Settings, CheckCircle } from "lucide-react";
import { useCartStore } from "@/lib/cartStore";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import FulfillmentSelector from "@/components/fulfillment-selector";
import FulfillmentGroups from "@/components/fulfillment-groups";

// Mock products with different stores for demonstration
const mockCartItems = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    category: "Electronics",
    quantity: 1,
    store: "TechHub Electronics",
    storeId: 1,
    mallId: "westfield-valley",
    mallName: "Westfield Valley Fair",
    fulfillmentMethod: 'ship-to-me' as const,
    estimatedDelivery: "Ships in 2-5 business days",
    shippingCost: 4.99
  },
  {
    id: 2,
    name: "Designer Sunglasses",
    price: 89.95,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    category: "Fashion",
    quantity: 2,
    store: "StylePoint Fashion",
    storeId: 2,
    mallId: "westfield-valley",
    mallName: "Westfield Valley Fair",
    fulfillmentMethod: 'in-store-pickup' as const,
    estimatedDelivery: "Ready today for pickup",
    shippingCost: 0
  },
  {
    id: 3,
    name: "Artisan Coffee Beans",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    category: "Food",
    quantity: 3,
    store: "Local Brew Coffee",
    storeId: 3,
    mallId: "downtown-crossing",
    mallName: "Downtown Crossing",
    fulfillmentMethod: 'ship-to-mall' as const,
    estimatedDelivery: "Ships to SPIRAL Center in 2-3 days",
    shippingCost: 0
  }
];

export default function SplitFulfillmentPage() {
  const { items, addItem, getFulfillmentGroups, clearCart } = useCartStore();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<'setup' | 'review' | 'completed'>('setup');

  useEffect(() => {
    // Add mock items if cart is empty for demonstration
    if (items.length === 0) {
      mockCartItems.forEach(item => {
        addItem(item, item.quantity);
      });
    }
  }, [items.length, addItem]);

  const fulfillmentGroups = getFulfillmentGroups();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalCost = fulfillmentGroups.reduce((sum, group) => sum + group.subtotal + group.shippingCost, 0);

  const handleProceedToReview = () => {
    setCurrentStep('review');
    toast({
      title: "Fulfillment Methods Set",
      description: `Split across ${fulfillmentGroups.length} fulfillment groups`,
    });
  };

  const handleCompleteOrder = () => {
    setCurrentStep('completed');
    toast({
      title: "Order Placed Successfully!",
      description: "Your split fulfillment order has been processed",
    });
    
    // Clear cart after successful order
    setTimeout(() => {
      clearCart();
    }, 3000);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'setup':
        return (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Choose Fulfillment Methods</h2>
                <p className="text-gray-600 mb-6">
                  Select how you'd like to receive each item. Items from the same store with the same fulfillment method will be grouped together.
                </p>
              </div>
              
              {items.map((item) => (
                <FulfillmentSelector
                  key={item.id}
                  item={item}
                />
              ))}
              
              <Card className="bg-[var(--spiral-sage)] bg-opacity-20 border-[var(--spiral-sage)]">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Settings className="h-5 w-5 text-[var(--spiral-coral)] mt-0.5" />
                    <div>
                      <h4 className="font-medium">Smart Fulfillment Tips</h4>
                      <ul className="text-sm text-gray-600 mt-2 space-y-1">
                        <li>• In-Store Pickup is fastest and free</li>
                        <li>• SPIRAL Center Pickup consolidates items from multiple stores</li>
                        <li>• Ship to Me includes tracking and delivery updates</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <FulfillmentGroups />
              
              <div className="sticky top-6">
                <Button 
                  onClick={handleProceedToReview}
                  className="w-full h-12 bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90 text-white font-semibold"
                  size="lg"
                >
                  Review Order ({totalItems} items)
                </Button>
              </div>
            </div>
          </div>
        );

      case 'review':
        return (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Review Your Split Fulfillment Order</h2>
              <p className="text-gray-600">
                Your order will be split into {fulfillmentGroups.length} separate fulfillments
              </p>
            </div>

            <FulfillmentGroups />

            <Card className="border-2 border-[var(--spiral-coral)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <ShoppingCart className="h-5 w-5 text-[var(--spiral-coral)]" />
                      <span className="font-semibold">Total Items</span>
                    </div>
                    <div className="text-2xl font-bold">{totalItems}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Package className="h-5 w-5 text-[var(--spiral-coral)]" />
                      <span className="font-semibold">Fulfillment Groups</span>
                    </div>
                    <div className="text-2xl font-bold">{fulfillmentGroups.length}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-xl">💰</span>
                      <span className="font-semibold">Total Cost</span>
                    </div>
                    <div className="text-2xl font-bold text-[var(--spiral-coral)]">
                      ${totalCost.toFixed(2)}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep('setup')}
                    className="flex-1"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Edit
                  </Button>
                  <Button
                    onClick={handleCompleteOrder}
                    className="flex-1 bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Place Order
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'completed':
        return (
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <h2 className="text-3xl font-bold">Order Placed Successfully!</h2>
              <p className="text-lg text-gray-600">
                Your order has been split into {fulfillmentGroups.length} fulfillment groups
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>What Happens Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-left">
                {fulfillmentGroups.map((group, index) => {
                  const Icon = group.fulfillmentMethod === 'ship-to-me' ? Truck : 
                              group.fulfillmentMethod === 'in-store-pickup' ? Store : MapPin;
                  
                  return (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <Icon className="h-5 w-5 text-[var(--spiral-coral)] mt-0.5" />
                      <div>
                        <h4 className="font-medium">
                          {group.fulfillmentMethod === 'ship-to-me' ? 'Shipping' :
                           group.fulfillmentMethod === 'in-store-pickup' ? 'In-Store Pickup' :
                           'SPIRAL Center Pickup'}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {group.items.length} items • {group.estimatedDelivery}
                        </p>
                        {group.storeName && (
                          <p className="text-xs text-gray-500">
                            From {group.storeName}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <div className="flex gap-4 justify-center">
              <Button variant="outline" asChild>
                <Link href="/account">View Order History</Link>
              </Button>
              <Button asChild>
                <Link href="/">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/cart" className="inline-flex items-center text-[var(--spiral-coral)] hover:underline mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Cart
          </Link>
          
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold text-[var(--spiral-navy)]">
              Split Fulfillment Checkout
            </h1>
            <Badge variant="outline" className="px-3 py-1">
              {currentStep === 'setup' ? 'Setup' : currentStep === 'review' ? 'Review' : 'Completed'}
            </Badge>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-600">
              <span className="font-semibold text-[var(--spiral-coral)]">SPIRAL's Split Fulfillment Service</span> lets you choose different delivery methods for each item. 
              Shop from multiple stores and get everything exactly how you want it.
            </p>
          </div>
        </div>

        {renderStepContent()}
      </div>
    </div>
  );
}