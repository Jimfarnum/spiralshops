import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Truck, Shield, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OneClickPurchaseProps {
  product: {
    id: string;
    name: string;
    price: number;
    store: string;
    image?: string;
  };
  quantity?: number;
}

export function OneClickPurchase({ product, quantity = 1 }: OneClickPurchaseProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleOneClickPurchase = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/purchase/one-click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity,
          userId: 'demo_user', // In real app, get from auth context
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Order Placed Successfully! 🎉",
          description: `Order ${result.order.id} confirmed. Delivery in 2 days.`,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: "Please try again or use regular checkout.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const total = product.price * quantity;
  const tax = total * 0.0825;
  const shipping = quantity > 2 ? 0 : 4.99;
  const grandTotal = total + tax + shipping;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          One-Click Purchase
          <Badge variant="secondary" className="ml-auto">Amazon-Level</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Product Summary */}
        <div className="space-y-2">
          <h3 className="font-semibold">{product.name}</h3>
          <p className="text-sm text-gray-600">from {product.store}</p>
          <div className="flex justify-between">
            <span>Quantity: {quantity}</span>
            <span>${product.price.toFixed(2)} each</span>
          </div>
        </div>

        <Separator />

        {/* Price Breakdown */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax:</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Total:</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment & Shipping Info */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            <span>Visa ending in 4242</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4" />
            <span>2-day delivery to home address</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>SPIRAL Buyer Protection included</span>
          </div>
        </div>

        {/* One-Click Button */}
        <Button 
          onClick={handleOneClickPurchase}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          size="lg"
        >
          {isLoading ? 'Processing...' : `Buy Now - $${grandTotal.toFixed(2)}`}
        </Button>

        {/* SPIRAL Rewards Info */}
        <div className="text-center text-sm text-gray-600">
          Earn {Math.floor(grandTotal * 5)} SPIRAL points with this purchase
        </div>
      </CardContent>
    </Card>
  );
}

export default OneClickPurchase;