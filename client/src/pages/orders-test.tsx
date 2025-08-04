import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { 
  Package, 
  Truck, 
  Calendar, 
  MapPin, 
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface OrderSummary {
  id: number;
  orderNumber: string;
  total: string;
  status: string;
  createdAt: string;
  itemCount: number;
  trackingNumber?: string;
  carrier?: string;
  shippingStatus: 'label_created' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'exception';
  estimatedDelivery?: string;
  lastUpdate?: string;
}

export default function OrdersTestPage() {
  // Fetch real orders from the API
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['/api/orders'],
    queryFn: async () => {
      const response = await fetch('/api/orders');
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      return response.json() as OrderSummary[];
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--spiral-cream)]">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--spiral-cream)]">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h1 className="text-2xl font-bold text-red-800 mb-2">Error Loading Orders</h1>
            <p className="text-red-600">Unable to load your orders. Please try again later.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-[var(--spiral-navy)] mb-4">
              Your Orders
            </h1>
            <p className="text-lg text-gray-600">
              Track your purchases and shipping status
            </p>
          </div>

          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-700 font-medium">
              ✅ Orders page is now working correctly! Found {orders?.length || 0} orders.
            </p>
          </div>

          {/* Orders List */}
          <div className="space-y-6">
            {orders?.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-[var(--spiral-coral)]" />
                        Order {order.orderNumber}
                      </CardTitle>
                      <CardDescription>
                        Placed on {new Date(order.createdAt).toLocaleDateString()} • {order.itemCount} items • {order.total}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-blue-100 text-blue-800">
                        <Truck className="h-3 w-3 mr-1" />
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    {/* Tracking Number */}
                    {order.trackingNumber && (
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-600">Tracking Number</div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono">{order.trackingNumber}</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Carrier */}
                    {order.carrier && (
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-600">Carrier</div>
                        <div className="text-sm">{order.carrier}</div>
                      </div>
                    )}
                    
                    {/* Estimated Delivery */}
                    {order.estimatedDelivery && (
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-600">Estimated Delivery</div>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {order.estimatedDelivery}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button variant="outline" size="sm">
                      <Package className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    {order.trackingNumber && (
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Track Package
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {orders?.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
              <Link to="/stores">
                <Button>
                  Browse Stores
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}