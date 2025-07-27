import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Store, CreditCard, CheckCircle, ArrowRight, Users, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DemoCartItem {
  id: string;
  title: string;
  price: number;
  storeName: string;
  storeId: number;
  quantity: number;
  category: string;
}

const DEMO_CART_ITEMS: DemoCartItem[] = [
  {
    id: '1',
    title: 'Wireless Bluetooth Headphones',
    price: 89.99,
    storeName: 'Best Buy Electronics',
    storeId: 1,
    quantity: 1,
    category: 'Electronics'
  },
  {
    id: '2', 
    title: 'Premium Coffee Beans (Dark Roast)',
    price: 24.99,
    storeName: 'Local Coffee Shop',
    storeId: 2,
    quantity: 2,
    category: 'Food & Beverage'
  },
  {
    id: '3',
    title: 'Cotton Casual T-Shirt',
    price: 19.99,
    storeName: 'Target Store',
    storeId: 3,
    quantity: 3,
    category: 'Clothing'
  },
  {
    id: '4',
    title: 'LED Desk Lamp',
    price: 34.99,
    storeName: 'Best Buy Electronics', 
    storeId: 1,
    quantity: 1,
    category: 'Home & Office'
  },
  {
    id: '5',
    title: 'Organic Face Moisturizer',
    price: 28.99,
    storeName: 'Fashion Boutique',
    storeId: 4,
    quantity: 1,
    category: 'Beauty'
  }
];

export default function CheckoutDemo() {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Group items by retailer
  const groupedItems = DEMO_CART_ITEMS.reduce((acc, item) => {
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
  }, {} as any);

  const retailers = Object.values(groupedItems);
  const totalItems = DEMO_CART_ITEMS.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = retailers.reduce((sum: number, retailer: any) => sum + retailer.subtotal, 0);
  const tax = subtotal * 0.08;
  const shipping = retailers.length * 4.99;
  const total = subtotal + tax + shipping;

  const handleNextStep = () => {
    if (step < 4) {
      setStep(step + 1);
      toast({
        title: `Step ${step + 1} Complete`,
        description: `Moving to step ${step + 1}`
      });
    }
  };

  const processOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setStep(4);
      setIsProcessing(false);
      toast({
        title: "Order Successful!",
        description: `Your order for $${total.toFixed(2)} across ${retailers.length} retailers has been processed`
      });
    }, 2000);
  };

  const getStepIcon = (stepNumber: number) => {
    if (step > stepNumber) return <CheckCircle className="w-6 h-6 text-green-600" />;
    if (step === stepNumber) return <div className="w-6 h-6 bg-[#006d77] rounded-full flex items-center justify-center text-white text-sm font-bold">{stepNumber}</div>;
    return <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm">{stepNumber}</div>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Live Multi-Retailer Checkout Demo
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Experience shopping from multiple retailers in one transaction
          </p>
          <Badge variant="outline" className="text-sm bg-blue-50 text-blue-800 border-blue-200">
            {totalItems} items from {retailers.length} retailers
          </Badge>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              {getStepIcon(1)}
              <span className={`ml-2 ${step >= 1 ? 'text-[#006d77] font-semibold' : 'text-gray-500'}`}>
                Review Cart
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <div className="flex items-center">
              {getStepIcon(2)}
              <span className={`ml-2 ${step >= 2 ? 'text-[#006d77] font-semibold' : 'text-gray-500'}`}>
                Customer Info
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <div className="flex items-center">
              {getStepIcon(3)}
              <span className={`ml-2 ${step >= 3 ? 'text-[#006d77] font-semibold' : 'text-gray-500'}`}>
                Payment
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <div className="flex items-center">
              {getStepIcon(4)}
              <span className={`ml-2 ${step >= 4 ? 'text-[#006d77] font-semibold' : 'text-gray-500'}`}>
                Complete
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Cart Review - Items from {retailers.length} Retailers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {retailers.map((retailer: any) => (
                    <div key={retailer.storeId} className="mb-6">
                      <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
                        <Store className="w-5 h-5 text-[#006d77]" />
                        <h3 className="font-semibold text-lg">{retailer.storeName}</h3>
                        <Badge variant="outline" className="ml-auto">
                          {retailer.itemCount} items - ${retailer.subtotal.toFixed(2)}
                        </Badge>
                      </div>
                      
                      {retailer.items.map((item: DemoCartItem) => (
                        <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg mb-3">
                          <div>
                            <h4 className="font-medium">{item.title}</h4>
                            <p className="text-sm text-gray-600">{item.category}</p>
                            <p className="text-lg font-semibold text-[#006d77]">${item.price.toFixed(2)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                            <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                  
                  <Button onClick={handleNextStep} className="w-full bg-[#006d77] hover:bg-[#005a5f] mt-4">
                    Continue to Customer Information
                  </Button>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="font-medium">Customer Name</p>
                        <p className="text-gray-600">John Smith</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="font-medium">Email</p>
                        <p className="text-gray-600">john.smith@email.com</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="font-medium">Phone</p>
                        <p className="text-gray-600">(555) 123-4567</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="font-medium">Shipping Address</p>
                        <p className="text-gray-600">123 Main St, Minneapolis, MN 55401</p>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-800">
                        ✓ Information will be shared with all {retailers.length} retailers for order fulfillment
                      </p>
                    </div>
                  </div>
                  
                  <Button onClick={handleNextStep} className="w-full bg-[#006d77] hover:bg-[#005a5f] mt-6">
                    Continue to Payment
                  </Button>
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium mb-2">Payment Method</p>
                      <p className="text-gray-600">Visa ending in 1234</p>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-800 mb-2">
                        ✓ Single payment method covers all retailers
                      </p>
                      <p className="text-sm text-green-700">
                        Your card will be charged once for the entire order. Payments will be distributed to each retailer automatically.
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={processOrder} 
                    disabled={isProcessing}
                    className="w-full bg-[#006d77] hover:bg-[#005a5f] mt-6"
                  >
                    {isProcessing ? 'Processing Order...' : `Complete Order - $${total.toFixed(2)}`}
                  </Button>
                </CardContent>
              </Card>
            )}

            {step === 4 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Complete!</h2>
                  <p className="text-gray-600 mb-6">
                    Your multi-retailer order has been successfully processed
                  </p>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Order Number</p>
                        <p className="text-gray-600">SPIRAL-{Date.now()}</p>
                      </div>
                      <div>
                        <p className="font-medium">Total Amount</p>
                        <p className="text-gray-600">${total.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="font-medium">Retailers</p>
                        <p className="text-gray-600">{retailers.length} stores</p>
                      </div>
                      <div>
                        <p className="font-medium">Items</p>
                        <p className="text-gray-600">{totalItems} products</p>
                      </div>
                    </div>
                  </div>
                  
                  <Button onClick={() => setStep(1)} className="bg-[#006d77] hover:bg-[#005a5f]">
                    Start New Demo
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping ({retailers.length} retailers)</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-[#006d77]">${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <h4 className="font-semibold">Retailers in Order:</h4>
                  {retailers.map((retailer: any) => (
                    <div key={retailer.storeId} className="flex justify-between text-sm">
                      <span>{retailer.storeName}</span>
                      <span>${retailer.subtotal.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-800">
                    One transaction covers all retailers. Each store will receive their portion automatically.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}