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

// Mock data for demonstration
const mockOrders: OrderSummary[] = [
  {
    id: 1,
    orderNumber: 'SPIRAL-2025-001',
    total: '$127.45',
    status: 'shipped',
    createdAt: '2025-01-20',
    itemCount: 3,
    trackingNumber: '1Z999AA1234567890',
    carrier: 'UPS',
    shippingStatus: 'in_transit',
    estimatedDelivery: 'January 24, 2025',
    lastUpdate: '2025-01-22T14:30:00Z'
  },
  {
    id: 2,
    orderNumber: 'SPIRAL-2025-002',
    total: '$89.99',
    status: 'delivered',
    createdAt: '2025-01-18',
    itemCount: 2,
    trackingNumber: '9400111899562123456789',
    carrier: 'USPS',
    shippingStatus: 'delivered',
    estimatedDelivery: 'January 22, 2025',
    lastUpdate: '2025-01-22T10:15:00Z'
  },
  {
    id: 3,
    orderNumber: 'SPIRAL-2025-003',
    total: '$234.67',
    status: 'processing',
    createdAt: '2025-01-22',
    itemCount: 5,
    trackingNumber: '771234567890',
    carrier: 'FedEx',
    shippingStatus: 'label_created',
    estimatedDelivery: 'January 26, 2025',
    lastUpdate: '2025-01-22T16:45:00Z'
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'delivered': return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'out_for_delivery': return <Truck className="h-4 w-4 text-blue-600" />;
    case 'in_transit': return <Package className="h-4 w-4 text-orange-600" />;
    case 'exception': return <AlertCircle className="h-4 w-4 text-red-600" />;
    default: return <Clock className="h-4 w-4 text-gray-600" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'delivered': return 'bg-green-100 text-green-800';
    case 'out_for_delivery': return 'bg-blue-100 text-blue-800';
    case 'in_transit': return 'bg-orange-100 text-orange-800';
    case 'exception': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'label_created': return 'Label Created';
    case 'in_transit': return 'In Transit';
    case 'out_for_delivery': return 'Out for Delivery';
    case 'delivered': return 'Delivered';
    case 'exception': return 'Delivery Exception';
    default: return 'Processing';
  }
};

const getCarrierUrl = (carrier: string, trackingNumber: string) => {
  switch (carrier.toLowerCase()) {
    case 'ups':
      return `https://www.ups.com/track?loc=en_US&tracknum=${trackingNumber}`;
    case 'fedex':
      return `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`;
    case 'usps':
      return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`;
    case 'dhl':
      return `https://www.dhl.com/us-en/home/tracking/tracking-express.html?submit=1&tracking-id=${trackingNumber}`;
    default:
      return '#';
  }
};

export default function OrdersPage() {
  // In production, this would fetch real orders from backend
  const { data: orders, isLoading } = useQuery({
    queryKey: ['/api/orders'],
    queryFn: () => Promise.resolve(mockOrders),
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
                      <Badge className={getStatusColor(order.shippingStatus)}>
                        {getStatusIcon(order.shippingStatus)}
                        <span className="ml-1">{getStatusText(order.shippingStatus)}</span>
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    {/* Tracking Number */}
                    {order.trackingNumber && (
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-600">Tracking Number</div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono">{order.trackingNumber}</span>
                          <a
                            href={getCarrierUrl(order.carrier!, order.trackingNumber)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--spiral-coral)] hover:text-[var(--spiral-coral)]/80"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Carrier */}
                    {order.carrier && (
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-600">Carrier</div>
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{order.carrier}</span>
                        </div>
                      </div>
                    )}

                    {/* Estimated Delivery */}
                    {order.estimatedDelivery && (
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-600">
                          {order.shippingStatus === 'delivered' ? 'Delivered' : 'Estimated Delivery'}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{order.estimatedDelivery}</span>
                        </div>
                      </div>
                    )}

                    {/* Last Update */}
                    {order.lastUpdate && (
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-600">Last Update</div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            {new Date(order.lastUpdate).toLocaleDateString()} at {new Date(order.lastUpdate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
                    <Link href={`/order/${order.id}`}>
                      <Button variant="outline" className="w-full sm:w-auto">
                        <MapPin className="mr-2 h-4 w-4" />
                        View Detailed Tracking
                      </Button>
                    </Link>
                    {order.trackingNumber && (
                      <a
                        href={getCarrierUrl(order.carrier!, order.trackingNumber)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" className="w-full sm:w-auto">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Track on {order.carrier}
                        </Button>
                      </a>
                    )}
                    <Button variant="outline" className="w-full sm:w-auto">
                      <Package className="mr-2 h-4 w-4" />
                      Order Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {(!orders || orders.length === 0) && (
              <Card>
                <CardContent className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No orders yet</h3>
                  <p className="text-gray-500 mb-6">
                    Start shopping to see your orders and tracking information here
                  </p>
                  <Link href="/products">
                    <Button>
                      Start Shopping
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}