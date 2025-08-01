import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Package, Truck, Gift, ArrowRight, Home } from 'lucide-react';

export default function PaymentSuccessPage() {
  const [location] = useLocation();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Extract payment intent from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const paymentIntentId = urlParams.get('payment_intent');
    const paymentIntentClientSecret = urlParams.get('payment_intent_client_secret');

    if (paymentIntentId) {
      // Process the completed payment
      fetch('/api/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId,
          orderData: {
            items: [], // This would normally come from session/cart
            amount: 0 // This would be calculated from cart
          }
        }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setOrderDetails(data.order);
          }
          setLoading(false);
        })
        .catch(error => {
          console.error('Error processing payment:', error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-green-600 mb-2">Payment Successful!</h1>
        <p className="text-gray-600">Thank you for your purchase. Your order has been confirmed.</p>
      </div>

      <div className="space-y-6">
        {/* Order Confirmation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Confirmation
            </CardTitle>
            <CardDescription>
              Your order details and tracking information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {orderDetails ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <Badge variant="secondary" className="text-sm">#{orderDetails.id}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="font-semibold">${orderDetails.amount.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <p className="font-medium">Card ending in ••••</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Order Date</p>
                    <p className="font-medium">{new Date(orderDetails.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">Order details are being processed...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* SPIRAL Points Earned */}
        {orderDetails && (
          <Alert>
            <Gift className="h-4 w-4" />
            <AlertDescription>
              <strong>Congratulations!</strong> You earned {orderDetails.spiralPointsEarned} SPIRAL points with this purchase. 
              Use them for discounts on future orders!
            </AlertDescription>
          </Alert>
        )}

        {/* Shipping Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Shipping & Delivery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">1</span>
                </div>
                <div>
                  <p className="font-medium">Order Confirmed</p>
                  <p className="text-sm text-gray-600">Your order has been received and is being prepared</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-semibold text-sm">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-600">Processing</p>
                  <p className="text-sm text-gray-600">We're preparing your items for shipment</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-semibold text-sm">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-600">Shipped</p>
                  <p className="text-sm text-gray-600">Your order is on its way to you</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-semibold text-sm">4</span>
                </div>
                <div>
                  <p className="font-medium text-gray-600">Delivered</p>
                  <p className="text-sm text-gray-600">Estimated delivery: 3-5 business days</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={() => window.location.href = '/orders'} 
                className="flex items-center gap-2"
              >
                <Package className="w-4 h-4" />
                Track Your Order
                <ArrowRight className="w-4 h-4" />
              </Button>
              
              <Button 
                onClick={() => window.location.href = '/spirals'} 
                variant="outline"
                className="flex items-center gap-2"
              >
                <Gift className="w-4 h-4" />
                View SPIRAL Points
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            
            <Button 
              onClick={() => window.location.href = '/'} 
              variant="ghost"
              className="w-full flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Continue Shopping
            </Button>
          </CardContent>
        </Card>

        {/* Support Information */}
        <div className="text-center text-sm text-gray-600">
          <p>Need help with your order? <a href="/contact" className="text-blue-600 hover:underline">Contact our support team</a></p>
        </div>
      </div>
    </div>
  );
}