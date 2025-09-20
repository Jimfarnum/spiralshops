import React from 'react';
import { Link, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Package, Gift, ArrowLeft, Share2, Star } from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import SocialSharingEngine from '@/components/social-sharing-engine';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  storeName: string;
}

const OrderConfirmation = () => {
  const { orderId } = useParams();
  
  // Mock order data - in real app, this would come from API
  const order = {
    id: orderId || 'ORD-2025-001',
    status: 'confirmed',
    items: [
      {
        id: '1',
        name: 'Artisan Coffee Blend',
        price: 24.99,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop',
        storeName: 'Local Roasters'
      },
      {
        id: '2',
        name: 'Handmade Ceramic Mug',
        price: 18.50,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1609950020584-6fd7bc09a5b2?w=300&h=300&fit=crop',
        storeName: 'Clay Studio'
      }
    ] as OrderItem[],
    subtotal: 68.48,
    tax: 6.85,
    shipping: 0,
    total: 75.33,
    spiralsEarned: 38,
    fulfillmentMethod: 'ship-to-me',
    estimatedDelivery: '3-5 business days',
    trackingNumber: 'SP' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    customerInfo: {
      name: 'Sarah Chen',
      email: 'sarah@example.com'
    }
  };

  const getFulfillmentMessage = () => {
    switch (order.fulfillmentMethod) {
      case 'in-store-pickup':
        return 'Ready for pickup in 2-4 hours';
      case 'ship-to-mall':
        return 'Ships to mall SPIRAL center in 2-3 days';
      default:
        return `Ships in ${order.estimatedDelivery}`;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--spiral-navy)] mb-2 font-['Poppins']">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 text-lg font-['Inter']">
            Thank you for supporting local businesses with SPIRAL!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Info */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-[var(--spiral-navy)] font-['Poppins'] flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order #{order.id}
                </CardTitle>
                <CardDescription className="font-['Inter']">
                  Confirmation sent to {order.customerInfo.email}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 font-['Inter']">Status</p>
                    <Badge className="bg-green-100 text-green-800 capitalize">
                      {order.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-['Inter']">Fulfillment</p>
                    <p className="font-medium text-[var(--spiral-navy)] font-['Inter']">
                      {getFulfillmentMessage()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-['Inter']">Tracking Number</p>
                    <p className="font-medium text-[var(--spiral-navy)] font-mono">
                      {order.trackingNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-['Inter']">Total Amount</p>
                    <p className="font-bold text-[var(--spiral-navy)] text-lg font-['Poppins']">
                      ${order.total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Items */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-[var(--spiral-navy)] font-['Poppins']">
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-[var(--spiral-navy)] font-['Inter']">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 font-['Inter']">
                          {item.storeName} • Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[var(--spiral-navy)] font-['Inter']">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* SPIRAL Earnings */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-[var(--spiral-coral)]/10 to-[var(--spiral-gold)]/10">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-[var(--spiral-coral)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[var(--spiral-navy)] mb-2 font-['Poppins']">
                  🎉 You Earned SPIRALs!
                </h3>
                <div className="text-3xl font-bold text-[var(--spiral-coral)] mb-2 font-['Poppins']">
                  {order.spiralsEarned}
                </div>
                <p className="text-sm text-gray-600 mb-4 font-['Inter']">
                  Use these points for discounts at local stores!
                </p>
                <div className="bg-white rounded-lg p-3 mb-4">
                  <p className="text-xs text-gray-600 font-['Inter']">
                    Worth <strong className="text-[var(--spiral-gold)]">
                      ${(order.spiralsEarned * 0.20).toFixed(2)}
                    </strong> when redeemed in-store
                  </p>
                </div>
                <Link href="/spirals">
                  <Button className="bg-[var(--spiral-gold)] hover:bg-[var(--spiral-coral)] text-white rounded-xl">
                    View My SPIRALs
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Share Your Purchase */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-[var(--spiral-sage)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Share2 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--spiral-navy)] mb-2 font-['Poppins']">
                  Share Your Purchase
                </h3>
                <p className="text-sm text-gray-600 mb-4 font-['Inter']">
                  Share your local shopping win on X! Tell your followers about supporting local businesses and earn 5 bonus SPIRALs.
                </p>
                <SocialSharingEngine
                  type="checkout"
                  title="I just shopped local with SPIRAL!"
                  description={`Just completed a purchase earning ${order.spiralsEarned} SPIRALs! Supporting local businesses feels amazing. 🛍️✨ #SPIRALshops #ShopLocal`}
                  spiralEarnings={order.spiralsEarned}
                  showEarningsPreview={true}
                />
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-6 space-y-3">
                <h3 className="font-semibold text-[var(--spiral-navy)] mb-4 font-['Poppins']">
                  What's Next?
                </h3>
                <Link href="/products">
                  <Button variant="outline" className="w-full justify-start rounded-xl">
                    <Package className="h-4 w-4 mr-2" />
                    Continue Shopping
                  </Button>
                </Link>
                <Link href="/account">
                  <Button variant="outline" className="w-full justify-start rounded-xl">
                    <Star className="h-4 w-4 mr-2" />
                    View Order History
                  </Button>
                </Link>
                <Link href="/social-feed">
                  <Button variant="outline" className="w-full justify-start rounded-xl">
                    <Share2 className="h-4 w-4 mr-2" />
                    See Community
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link href="/">
            <Button variant="ghost" className="hover:bg-gray-100">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Homepage
            </Button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;