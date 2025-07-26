import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CreditCard, Smartphone, Banknote, Bitcoin } from "lucide-react";
import { StripePayment, ExpressCheckout } from "@/components/StripePayment";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  storeName: string;
  imageUrl?: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  available: boolean;
}

export default function EnhancedCheckout() {
  const [, setLocation] = useLocation();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("stripe");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const paymentMethods: PaymentMethod[] = [
    {
      id: "stripe",
      name: "Credit/Debit Card",
      icon: <CreditCard className="w-5 h-5" />,
      description: "Visa, Mastercard, American Express",
      available: true,
    },
    {
      id: "express",
      name: "Express Checkout",
      icon: <Smartphone className="w-5 h-5" />,
      description: "Apple Pay, Google Pay",
      available: true,
    },
    {
      id: "bnpl",
      name: "Buy Now, Pay Later",
      icon: <Banknote className="w-5 h-5" />,
      description: "Klarna, Afterpay (Coming Soon)",
      available: false,
    },
    {
      id: "crypto",
      name: "Cryptocurrency",
      icon: <Bitcoin className="w-5 h-5" />,
      description: "Bitcoin, Ethereum (Coming Soon)",
      available: false,
    },
  ];

  useEffect(() => {
    // Load cart items from localStorage
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error loading cart:", error);
      }
    }
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
  const spiralPoints = Math.floor(subtotal / 100) * 5; // 5 SPIRALs per $100
  const total = subtotal + tax + shipping;

  const handlePaymentSuccess = (paymentIntentId: string) => {
    setIsProcessing(true);
    
    // Simulate order processing
    setTimeout(() => {
      // Clear cart
      localStorage.removeItem("cart");
      
      // Award SPIRAL points
      const currentBalance = parseInt(localStorage.getItem("spiralBalance") || "0");
      localStorage.setItem("spiralBalance", (currentBalance + spiralPoints).toString());
      
      toast({
        title: "Payment Successful!",
        description: `Order confirmed! You earned ${spiralPoints} SPIRAL points.`,
      });
      
      setLocation("/payment-success");
    }, 2000);
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive",
    });
    setIsProcessing(false);
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-6">Add some items to your cart to proceed with checkout.</p>
            <Button onClick={() => setLocation("/")}>
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setLocation("/cart")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </Button>
        <h1 className="text-3xl font-bold">Enhanced Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Methods */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedPaymentMethod === method.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  } ${!method.available ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => method.available && setSelectedPaymentMethod(method.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {method.icon}
                      <div>
                        <div className="font-semibold">{method.name}</div>
                        <div className="text-sm text-gray-600">{method.description}</div>
                      </div>
                    </div>
                    {!method.available && (
                      <Badge variant="secondary">Coming Soon</Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Payment Form */}
          {selectedPaymentMethod === "stripe" && (
            <StripePayment
              amount={total}
              orderId={`ORDER_${Date.now()}`}
              title="Complete Your Payment"
              description="Secure payment processing with Stripe"
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          )}

          {selectedPaymentMethod === "express" && (
            <Card>
              <CardHeader>
                <CardTitle>Express Checkout</CardTitle>
              </CardHeader>
              <CardContent>
                <ExpressCheckout
                  amount={total}
                  orderId={`ORDER_${Date.now()}`}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </CardContent>
            </Card>
          )}

          {(selectedPaymentMethod === "bnpl" || selectedPaymentMethod === "crypto") && (
            <Card>
              <CardContent className="text-center py-8">
                <div className="text-gray-500 mb-4">
                  {selectedPaymentMethod === "bnpl" ? (
                    <>
                      <Banknote className="w-12 h-12 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Buy Now, Pay Later</h3>
                      <p>Klarna and Afterpay integration coming soon!</p>
                    </>
                  ) : (
                    <>
                      <Bitcoin className="w-12 h-12 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Cryptocurrency Payments</h3>
                      <p>Bitcoin and Ethereum payments coming soon!</p>
                    </>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedPaymentMethod("stripe")}
                >
                  Use Credit Card Instead
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Cart Items */}
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium">{item.title}</div>
                      <div className="text-sm text-gray-600">{item.storeName}</div>
                      <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Totals */}
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
                  <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                </div>
                {shipping === 0 && (
                  <div className="text-sm text-green-600">Free shipping on orders over $50!</div>
                )}
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              {/* SPIRAL Points */}
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">SPIRAL Points</span>
                  <span className="text-sm font-bold text-blue-600">+{spiralPoints} SPIRALs</span>
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Earn 5 SPIRALs for every $100 spent online
                </div>
              </div>

              {/* Security Badge */}
              <div className="text-center pt-4">
                <div className="text-xs text-gray-500">
                  🔒 Secured by Stripe • SSL Encrypted
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Processing Payment</h3>
              <p className="text-gray-600">Please wait while we process your order...</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}