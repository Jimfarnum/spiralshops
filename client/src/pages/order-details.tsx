import React from 'react';
import { useLocation, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Package, 
  Store, 
  MapPin, 
  Calendar, 
  Star,
  Receipt,
  Truck
} from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';

const OrderDetails = () => {
  const [location] = useLocation();
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const orderId = urlParams.get('id') || 'ORD-2024-001';

  // Mock order data - in real app, fetch from API based on orderId
  const order = {
    id: orderId,
    date: '2025-01-18',
    total: 89.47,
    status: 'delivered',
    items: [
      {
        id: 1,
        name: 'Winter Clothing Collection',
        description: 'Cozy winter jacket and accessories bundle',
        price: 79.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=200&h=200&fit=crop',
        store: 'Fashion Forward Boutique'
      },
      {
        id: 2,
        name: 'Shipping Fee',
        description: 'Standard shipping',
        price: 9.48,
        quantity: 1,
        image: '',
        store: ''
      }
    ],
    spiralsEarned: 22,
    fulfillmentMethod: 'Ship to Me',
    shippingAddress: {
      name: 'Sarah Chen',
      address: '123 Main Street',
      city: 'Portland',
      state: 'OR',
      zip: '97201'
    },
    store: {
      id: 1,
      name: 'Fashion Forward Boutique',
      address: '456 Commerce St, Portland, OR 97201',
      phone: '(555) 123-4567',
      rating: 4.8
    },
    tracking: {
      carrier: 'UPS',
      number: '1Z999AA1234567890',
      status: 'Delivered',
      deliveredDate: '2025-01-20'
    }
  };

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/account">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Account
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-[var(--spiral-navy)] font-['Poppins']">
              Order Details
            </h1>
            <p className="text-gray-600 font-['Inter']">
              Order #{order.id} • Placed on {new Date(order.date).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Order Information */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Order Status */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[var(--spiral-navy)] font-['Poppins']">
                  <Package className="h-5 w-5" />
                  Order Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <Badge 
                    className={
                      order.status === 'delivered' 
                        ? 'bg-green-100 text-green-800 text-lg px-4 py-2' 
                        : order.status === 'shipped'
                        ? 'bg-blue-100 text-blue-800 text-lg px-4 py-2'
                        : 'bg-yellow-100 text-yellow-800 text-lg px-4 py-2'
                    }
                  >
                    {order.status.toUpperCase()}
                  </Badge>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 font-['Inter']">Fulfillment Method</p>
                    <p className="font-semibold text-[var(--spiral-navy)] font-['Inter']">{order.fulfillmentMethod}</p>
                  </div>
                </div>
                
                {order.tracking && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Truck className="h-4 w-4 text-[var(--spiral-coral)]" />
                      <p className="font-medium text-[var(--spiral-navy)] font-['Inter']">Tracking Information</p>
                    </div>
                    <p className="text-sm text-gray-600 font-['Inter']">
                      {order.tracking.carrier}: {order.tracking.number}
                    </p>
                    {order.tracking.deliveredDate && (
                      <p className="text-sm text-green-600 font-['Inter'] mt-1">
                        Delivered on {new Date(order.tracking.deliveredDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[var(--spiral-navy)] font-['Poppins']">
                  <Receipt className="h-5 w-5" />
                  Items Ordered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={item.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-[var(--spiral-navy)] mb-1 font-['Inter']">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2 font-['Inter']">
                          {item.description}
                        </p>
                        {item.store && (
                          <p className="text-sm text-[var(--spiral-coral)] font-['Inter']">
                            from {item.store}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[var(--spiral-navy)] font-['Inter']">
                          ${item.price.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600 font-['Inter']">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Store Information */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[var(--spiral-navy)] font-['Poppins']">
                  <Store className="h-5 w-5" />
                  Store Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-[var(--spiral-navy)] mb-2 font-['Inter']">
                      {order.store.name}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600 font-['Inter']">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{order.store.address}</span>
                      </div>
                      <p>Phone: {order.store.phone}</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{order.store.rating} rating</span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/store/${order.store.id}`}>
                    <Button variant="outline" size="sm">
                      Visit Store
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            
            {/* Order Summary */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-[var(--spiral-navy)] font-['Poppins']">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-['Inter']">Subtotal</span>
                    <span className="font-semibold font-['Inter']">${(order.total - 9.48).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-['Inter']">Shipping</span>
                    <span className="font-semibold font-['Inter']">$9.48</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold text-[var(--spiral-navy)] font-['Inter']">Total</span>
                    <span className="font-bold text-[var(--spiral-navy)] font-['Inter']">${order.total.toFixed(2)}</span>
                  </div>
                  
                  <div className="bg-[var(--spiral-coral)]/10 rounded-lg p-3 mt-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-[var(--spiral-coral)] font-['Poppins']">
                        +{order.spiralsEarned} SPIRALs Earned!
                      </p>
                      <p className="text-sm text-gray-600 font-['Inter']">
                        Thank you for supporting local business
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-[var(--spiral-navy)] font-['Poppins']">Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1 font-['Inter']">
                  <p className="font-semibold text-[var(--spiral-navy)]">{order.shippingAddress.name}</p>
                  <p className="text-gray-600">{order.shippingAddress.address}</p>
                  <p className="text-gray-600">
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-[var(--spiral-navy)] font-['Poppins']">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-[var(--spiral-navy)] hover:bg-[var(--spiral-coral)] text-white">
                  Reorder Items
                </Button>
                <Button variant="outline" className="w-full">
                  Leave a Review
                </Button>
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderDetails;