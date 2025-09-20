import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Package, 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Search,
  Phone,
  Mail,
  AlertCircle,
  Calendar,
  Navigation
} from 'lucide-react';

interface TrackingEvent {
  id: string;
  status: string;
  description: string;
  location: string;
  timestamp: Date;
  completed: boolean;
}

interface ShipmentDetails {
  trackingNumber: string;
  orderId: string;
  carrier: string;
  service: string;
  status: 'processing' | 'shipped' | 'in-transit' | 'out-for-delivery' | 'delivered' | 'exception';
  estimatedDelivery: Date;
  actualDelivery?: Date;
  origin: string;
  destination: string;
  weight: string;
  dimensions: string;
  events: TrackingEvent[];
}

interface OrderInfo {
  id: string;
  items: Array<{
    name: string;
    image: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  shippingMethod: string;
  trackingNumbers: string[];
}

export default function ShippingTracking() {
  const { toast } = useToast();
  
  const [trackingInput, setTrackingInput] = useState('');
  const [searchResults, setSearchResults] = useState<ShipmentDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock data for demonstration
  const [mockShipments] = useState<ShipmentDetails[]>([
    {
      trackingNumber: '1Z999AA1234567890',
      orderId: 'SPIRAL-1753150001',
      carrier: 'UPS',
      service: 'Ground',
      status: 'out-for-delivery',
      estimatedDelivery: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
      origin: 'Minneapolis, MN',
      destination: 'Saint Paul, MN',
      weight: '2.5 lbs',
      dimensions: '12" × 8" × 4"',
      events: [
        {
          id: '1',
          status: 'Order Processed',
          description: 'Package prepared for shipment',
          location: 'Minneapolis, MN',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          completed: true
        },
        {
          id: '2',
          status: 'Shipped',
          description: 'Package shipped from origin facility',
          location: 'Minneapolis, MN',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          completed: true
        },
        {
          id: '3',
          status: 'In Transit',
          description: 'Package arrived at sorting facility',
          location: 'Minneapolis, MN',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
          completed: true
        },
        {
          id: '4',
          status: 'Out for Delivery',
          description: 'Package is on the delivery truck',
          location: 'Saint Paul, MN',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          completed: true
        },
        {
          id: '5',
          status: 'Delivered',
          description: 'Package will be delivered today',
          location: 'Saint Paul, MN',
          timestamp: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
          completed: false
        }
      ]
    },
    {
      trackingNumber: '92001901755477000000046',
      orderId: 'SPIRAL-1753149001',
      carrier: 'USPS',
      service: 'Priority Mail',
      status: 'delivered',
      estimatedDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      actualDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      origin: 'Chicago, IL',
      destination: 'Minneapolis, MN',
      weight: '1.2 lbs',
      dimensions: '10" × 6" × 3"',
      events: [
        {
          id: '1',
          status: 'Order Processed',
          description: 'Package prepared for shipment',
          location: 'Chicago, IL',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          completed: true
        },
        {
          id: '2',
          status: 'Shipped',
          description: 'Package shipped from origin facility',
          location: 'Chicago, IL',
          timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          completed: true
        },
        {
          id: '3',
          status: 'In Transit',
          description: 'Package in transit to destination',
          location: 'Milwaukee, WI',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          completed: true
        },
        {
          id: '4',
          status: 'Out for Delivery',
          description: 'Package out for delivery',
          location: 'Minneapolis, MN',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          completed: true
        },
        {
          id: '5',
          status: 'Delivered',
          description: 'Package delivered to front door',
          location: 'Minneapolis, MN',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          completed: true
        }
      ]
    }
  ]);

  const [userOrders] = useState<OrderInfo[]>([
    {
      id: 'SPIRAL-1753150001',
      items: [
        {
          name: 'Artisan Coffee Blend',
          image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=100&h=100&fit=crop',
          quantity: 2,
          price: 24.99
        },
        {
          name: 'Handmade Ceramic Mug',
          image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=100&h=100&fit=crop',
          quantity: 1,
          price: 18.50
        }
      ],
      total: 68.48,
      shippingMethod: 'UPS Ground',
      trackingNumbers: ['1Z999AA1234567890']
    },
    {
      id: 'SPIRAL-1753149001',
      items: [
        {
          name: 'Organic Honey',
          image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=100&h=100&fit=crop',
          quantity: 1,
          price: 12.99
        }
      ],
      total: 12.99,
      shippingMethod: 'USPS Priority Mail',
      trackingNumbers: ['92001901755477000000046']
    }
  ]);

  const handleTrackingSearch = async () => {
    if (!trackingInput.trim()) {
      toast({
        title: "Please enter a tracking number",
        description: "Enter a valid tracking number to search.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const results = mockShipments.filter(shipment => 
      shipment.trackingNumber.toLowerCase().includes(trackingInput.toLowerCase()) ||
      shipment.orderId.toLowerCase().includes(trackingInput.toLowerCase())
    );

    setSearchResults(results);
    setIsLoading(false);

    if (results.length === 0) {
      toast({
        title: "No shipments found",
        description: "Please check your tracking number and try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing': return Package;
      case 'shipped': return Truck;
      case 'in-transit': return Navigation;
      case 'out-for-delivery': return Truck;
      case 'delivered': return CheckCircle;
      case 'exception': return AlertCircle;
      default: return Package;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return 'text-yellow-600';
      case 'shipped': return 'text-blue-600';
      case 'in-transit': return 'text-purple-600';
      case 'out-for-delivery': return 'text-orange-600';
      case 'delivered': return 'text-green-600';
      case 'exception': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'in-transit': return 'bg-purple-100 text-purple-800';
      case 'out-for-delivery': return 'bg-orange-100 text-orange-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'exception': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getDeliveryProgress = (events: TrackingEvent[]) => {
    const completedEvents = events.filter(event => event.completed).length;
    return (completedEvents / events.length) * 100;
  };

  useEffect(() => {
    // Auto-load user's recent orders
    setSearchResults(mockShipments);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-[var(--spiral-coral)]" />
            Shipping & Tracking
          </CardTitle>
          <CardDescription>
            Track your packages and get real-time delivery updates
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Tracking Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="Enter tracking number or order ID..."
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTrackingSearch()}
              />
            </div>
            <Button 
              onClick={handleTrackingSearch}
              disabled={isLoading}
              className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Search className="h-4 w-4" />
              )}
              {!isLoading && "Track"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders with Tracking */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[var(--spiral-navy)]">Your Recent Orders</h3>
        
        {userOrders.map(order => {
          const shipments = mockShipments.filter(s => s.orderId === order.id);
          
          return (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-[var(--spiral-navy)]">Order {order.id}</h4>
                    <p className="text-sm text-gray-600">{order.shippingMethod} • ${order.total.toFixed(2)}</p>
                  </div>
                  {shipments.length > 0 && (
                    <Badge className={getStatusBadgeColor(shipments[0].status)}>
                      {shipments[0].status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover" />
                      <div>
                        <h5 className="font-medium text-sm">{item.name}</h5>
                        <p className="text-xs text-gray-600">Qty: {item.quantity} • ${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {order.trackingNumbers.map(trackingNum => {
                  const shipment = mockShipments.find(s => s.trackingNumber === trackingNum);
                  if (!shipment) return null;
                  
                  return (
                    <div key={trackingNum} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-medium">Tracking: {trackingNum}</p>
                        <p className="text-sm text-gray-600">{shipment.carrier}</p>
                      </div>
                      
                      <div className="mb-3">
                        <Progress value={getDeliveryProgress(shipment.events)} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">From: {shipment.origin}</p>
                          <p className="text-gray-600">To: {shipment.destination}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">
                            Expected: {formatDate(shipment.estimatedDelivery)}
                          </p>
                          {shipment.actualDelivery && (
                            <p className="text-green-600 font-medium">
                              Delivered: {formatDate(shipment.actualDelivery)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Tracking Results */}
      {searchResults.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-[var(--spiral-navy)]">Tracking Details</h3>
          
          {searchResults.map(shipment => {
            const StatusIcon = getStatusIcon(shipment.status);
            
            return (
              <Card key={shipment.trackingNumber}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <StatusIcon className={`h-5 w-5 ${getStatusColor(shipment.status)}`} />
                        {shipment.trackingNumber}
                      </CardTitle>
                      <CardDescription>
                        Order {shipment.orderId} • {shipment.carrier} {shipment.service}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusBadgeColor(shipment.status)}>
                      {shipment.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Delivery Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Delivery Progress</span>
                      <span className="text-sm text-gray-600">
                        {Math.round(getDeliveryProgress(shipment.events))}% Complete
                      </span>
                    </div>
                    <Progress value={getDeliveryProgress(shipment.events)} className="h-3" />
                  </div>

                  {/* Shipment Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <h4 className="font-medium text-[var(--spiral-navy)] mb-2">Origin</h4>
                      <p className="text-sm text-gray-600">{shipment.origin}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-[var(--spiral-navy)] mb-2">Destination</h4>
                      <p className="text-sm text-gray-600">{shipment.destination}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-[var(--spiral-navy)] mb-2">Weight</h4>
                      <p className="text-sm text-gray-600">{shipment.weight}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-[var(--spiral-navy)] mb-2">Dimensions</h4>
                      <p className="text-sm text-gray-600">{shipment.dimensions}</p>
                    </div>
                  </div>

                  {/* Expected Delivery */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800">
                        {shipment.status === 'delivered' ? 'Delivered' : 'Expected Delivery'}
                      </span>
                    </div>
                    <p className="text-blue-700">
                      {shipment.actualDelivery 
                        ? formatDate(shipment.actualDelivery)
                        : formatDate(shipment.estimatedDelivery)
                      }
                    </p>
                    {shipment.status === 'out-for-delivery' && (
                      <p className="text-sm text-blue-600 mt-1">
                        Package is on the delivery truck and will arrive today
                      </p>
                    )}
                  </div>

                  {/* Tracking Timeline */}
                  <div>
                    <h4 className="font-medium text-[var(--spiral-navy)] mb-4">Tracking History</h4>
                    <div className="space-y-4">
                      {shipment.events.map((event, index) => (
                        <div key={event.id} className="flex items-start gap-4">
                          <div className={`w-3 h-3 rounded-full mt-1 ${
                            event.completed ? 'bg-green-500' : 'bg-gray-300'
                          }`}></div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h5 className={`font-medium ${
                                event.completed ? 'text-[var(--spiral-navy)]' : 'text-gray-500'
                              }`}>
                                {event.status}
                              </h5>
                              <span className="text-sm text-gray-500">
                                {event.completed ? formatDate(event.timestamp) : 'Pending'}
                              </span>
                            </div>
                            <p className={`text-sm ${
                              event.completed ? 'text-gray-600' : 'text-gray-400'
                            }`}>
                              {event.description}
                            </p>
                            <p className={`text-xs ${
                              event.completed ? 'text-gray-500' : 'text-gray-400'
                            }`}>
                              <MapPin className="inline h-3 w-3 mr-1" />
                              {event.location}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-[var(--spiral-navy)] mb-3">Need Help?</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-[var(--spiral-coral)]" />
                        <span className="text-sm">Call: 1-800-SPIRAL-1</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-[var(--spiral-coral)]" />
                        <span className="text-sm">Email: support@spiral.com</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}