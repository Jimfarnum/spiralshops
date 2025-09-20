import { useQuery } from '@tanstack/react-query';
import { useRoute, Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { 
  ArrowLeft,
  Package, 
  Truck, 
  Calendar, 
  MapPin, 
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle,
  Navigation,
  Phone,
  Mail,
  RefreshCw
} from 'lucide-react';

interface TrackingEvent {
  timestamp: string;
  status: string;
  location: string;
  description: string;
}

interface OrderDetail {
  id: number;
  orderNumber: string;
  total: string;
  subtotal: string;
  tax: string;
  shipping: string;
  status: string;
  createdAt: string;
  items: Array<{
    id: string;
    name: string;
    price: string;
    quantity: number;
    image: string;
    store: string;
  }>;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  tracking: {
    carrier: string;
    trackingNumber: string;
    status: 'label_created' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'exception';
    estimatedDelivery: string;
    lastUpdate: string;
    lastLocation: string;
    progress: number;
    events: TrackingEvent[];
  };
}

// Mock detailed order data
const mockOrderDetails: { [key: string]: OrderDetail } = {
  '1': {
    id: 1,
    orderNumber: 'SPIRAL-2025-001',
    total: '$127.45',
    subtotal: '$115.97',
    tax: '$6.98',
    shipping: '$4.50',
    status: 'shipped',
    createdAt: '2025-01-20T10:30:00Z',
    items: [
      {
        id: 'item-1',
        name: 'Organic Coffee Beans - Dark Roast',
        price: '$24.99',
        quantity: 2,
        image: '/api/placeholder/80/80',
        store: 'Local Coffee Roasters'
      },
      {
        id: 'item-2',
        name: 'Ceramic Coffee Mug Set',
        price: '$32.99',
        quantity: 1,
        image: '/api/placeholder/80/80',
        store: 'Local Coffee Roasters'
      },
      {
        id: 'item-3',
        name: 'Artisan Honey',
        price: '$32.99',
        quantity: 2,
        image: '/api/placeholder/80/80',
        store: 'Farmers Market Co-op'
      }
    ],
    shippingAddress: {
      name: 'John Smith',
      address: '123 Main Street',
      city: 'Minneapolis',
      state: 'MN',
      zipCode: '55401'
    },
    tracking: {
      carrier: 'UPS',
      trackingNumber: '1Z999AA1234567890',
      status: 'in_transit',
      estimatedDelivery: 'January 24, 2025',
      lastUpdate: '2025-01-22T14:30:00Z',
      lastLocation: 'Des Moines, IA',
      progress: 65,
      events: [
        {
          timestamp: '2025-01-22T14:30:00Z',
          status: 'In Transit',
          location: 'Des Moines, IA',
          description: 'Package is in transit to the next facility'
        },
        {
          timestamp: '2025-01-22T06:15:00Z',
          status: 'Departed Facility',
          location: 'Chicago, IL',
          description: 'Departed from Chicago Distribution Center'
        },
        {
          timestamp: '2025-01-21T18:45:00Z',
          status: 'Arrived at Facility',
          location: 'Chicago, IL',
          description: 'Arrived at Chicago Distribution Center'
        },
        {
          timestamp: '2025-01-21T10:20:00Z',
          status: 'In Transit',
          location: 'Minneapolis, MN',
          description: 'Package picked up from origin'
        },
        {
          timestamp: '2025-01-20T16:00:00Z',
          status: 'Label Created',
          location: 'Minneapolis, MN',
          description: 'Shipping label created and ready for pickup'
        }
      ]
    }
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'delivered': return <CheckCircle className="h-5 w-5 text-green-600" />;
    case 'out_for_delivery': return <Truck className="h-5 w-5 text-blue-600" />;
    case 'in_transit': return <Package className="h-5 w-5 text-orange-600" />;
    case 'exception': return <AlertCircle className="h-5 w-5 text-red-600" />;
    default: return <Clock className="h-5 w-5 text-gray-600" />;
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

export default function OrderDetailPage() {
  const [match, params] = useRoute('/order/:id');
  const orderId = params?.id;

  const { data: orderDetail, isLoading, refetch } = useQuery({
    queryKey: ['/api/order', orderId],
    queryFn: () => Promise.resolve(mockOrderDetails[orderId!]),
    enabled: !!orderId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--spiral-cream)]">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-48 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!orderDetail) {
    return (
      <div className="min-h-screen bg-[var(--spiral-cream)]">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Order not found</h3>
              <p className="text-gray-500 mb-6">
                The order you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <Link href="/orders">
                <Button>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Orders
                </Button>
              </Link>
            </CardContent>
          </Card>
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
          {/* Header with Back Button */}
          <div className="flex items-center gap-4">
            <Link href="/orders">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Orders
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-[var(--spiral-navy)]">
                Order {orderDetail.orderNumber}
              </h1>
              <p className="text-gray-600">
                Placed on {new Date(orderDetail.createdAt).toLocaleDateString()} • {orderDetail.items.length} items
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Tracking Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Current Status Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-[var(--spiral-coral)]" />
                      Shipping Status
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={() => refetch()}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Status Badge and Progress */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge className={`${getStatusColor(orderDetail.tracking.status)} text-sm px-3 py-1`}>
                        {getStatusIcon(orderDetail.tracking.status)}
                        <span className="ml-2">{getStatusText(orderDetail.tracking.status)}</span>
                      </Badge>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Progress</div>
                        <div className="text-lg font-semibold">{orderDetail.tracking.progress}%</div>
                      </div>
                    </div>
                    <Progress value={orderDetail.tracking.progress} className="h-2" />
                  </div>

                  {/* Tracking Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm font-medium text-gray-600 mb-1">Carrier & Tracking</div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-semibold">{orderDetail.tracking.carrier}</span>
                          <a
                            href={getCarrierUrl(orderDetail.tracking.carrier, orderDetail.tracking.trackingNumber)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--spiral-coral)] hover:text-[var(--spiral-coral)]/80"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                        <div className="text-sm font-mono text-gray-600 mt-1">
                          {orderDetail.tracking.trackingNumber}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-medium text-gray-600 mb-1">Last Location</div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span>{orderDetail.tracking.lastLocation}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="text-sm font-medium text-gray-600 mb-1">
                          {orderDetail.tracking.status === 'delivered' ? 'Delivered' : 'Estimated Delivery'}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="font-semibold">{orderDetail.tracking.estimatedDelivery}</span>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-medium text-gray-600 mb-1">Last Update</div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            {new Date(orderDetail.tracking.lastUpdate).toLocaleDateString()} at{' '}
                            {new Date(orderDetail.tracking.lastUpdate).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* External Tracking Button */}
                  <div className="pt-4 border-t">
                    <a
                      href={getCarrierUrl(orderDetail.tracking.carrier, orderDetail.tracking.trackingNumber)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button variant="outline" className="w-full">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Track on {orderDetail.tracking.carrier} Website
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Tracking History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Navigation className="h-5 w-5 text-[var(--spiral-coral)]" />
                    Tracking History
                  </CardTitle>
                  <CardDescription>
                    Detailed tracking events for your package
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orderDetail.tracking.events.map((event, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full ${
                            index === 0 ? 'bg-[var(--spiral-coral)]' : 'bg-gray-300'
                          }`}></div>
                          {index < orderDetail.tracking.events.length - 1 && (
                            <div className="w-0.5 h-12 bg-gray-200 mt-2"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-8">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div>
                              <div className="font-semibold text-[var(--spiral-navy)]">{event.status}</div>
                              <div className="text-sm text-gray-600">{event.description}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">{event.location}</div>
                              <div className="text-xs text-gray-500">
                                {new Date(event.timestamp).toLocaleDateString()} at{' '}
                                {new Date(event.timestamp).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>{orderDetail.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax:</span>
                      <span>{orderDetail.tax}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping:</span>
                      <span>{orderDetail.shipping}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>{orderDetail.total}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Shipping Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-1">
                    <div className="font-semibold">{orderDetail.shippingAddress.name}</div>
                    <div>{orderDetail.shippingAddress.address}</div>
                    <div>
                      {orderDetail.shippingAddress.city}, {orderDetail.shippingAddress.state} {orderDetail.shippingAddress.zipCode}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Items in This Order</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orderDetail.items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{item.name}</div>
                          <div className="text-xs text-gray-500">{item.store}</div>
                          <div className="text-sm text-gray-600">
                            Qty: {item.quantity} • {item.price}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Support */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Phone className="mr-2 h-4 w-4" />
                    Call Support
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="mr-2 h-4 w-4" />
                    Email Support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}