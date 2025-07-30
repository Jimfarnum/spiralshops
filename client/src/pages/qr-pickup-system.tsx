import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  QrCode, 
  Smartphone,
  MapPin,
  Clock,
  CheckCircle,
  Package,
  Camera,
  RefreshCw,
  Store,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PickupOrder {
  id: string;
  orderNumber: string;
  store: string;
  storeLocation: string;
  items: Array<{
    name: string;
    quantity: number;
    image: string;
  }>;
  status: 'ready' | 'picked_up' | 'expired';
  readyTime: string;
  expiresAt: string;
  qrCode: string;
  pickupInstructions: string;
}

export default function QRPickupSystem() {
  const { toast } = useToast();
  
  const [activeOrders, setActiveOrders] = useState<PickupOrder[]>([
    {
      id: '1',
      orderNumber: 'ORD-2025-001',
      store: 'Target Store',
      storeLocation: 'Mall Level 1, Near Food Court',
      items: [
        { name: 'iPhone 15 Case', quantity: 1, image: '/api/placeholder/60/60' },
        { name: 'Wireless Charger', quantity: 1, image: '/api/placeholder/60/60' }
      ],
      status: 'ready',
      readyTime: '2025-01-30 12:30 PM',
      expiresAt: '2025-01-30 6:00 PM',
      qrCode: 'QR123456789',
      pickupInstructions: 'Show QR code at customer service counter'
    },
    {
      id: '2',
      orderNumber: 'ORD-2025-002',
      store: 'Best Buy',
      storeLocation: 'Electronics Center, Customer Pickup',
      items: [
        { name: 'Bluetooth Headphones', quantity: 1, image: '/api/placeholder/60/60' }
      ],
      status: 'ready',
      readyTime: '2025-01-30 1:15 PM',
      expiresAt: '2025-01-30 7:00 PM',
      qrCode: 'QR987654321',
      pickupInstructions: 'Present QR code and ID at pickup counter'
    }
  ]);

  const [scannerActive, setScannerActive] = useState(false);
  const [scannedCode, setScannedCode] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<PickupOrder | null>(null);

  const generateQRCode = (orderNumber: string) => {
    // In a real implementation, this would generate an actual QR code
    return `https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${encodeURIComponent(orderNumber)}`;
  };

  const handlePickupComplete = (orderId: string) => {
    setActiveOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, status: 'picked_up' as const }
          : order
      )
    );
    
    toast({
      title: "Pickup Complete!",
      description: "Your order has been successfully picked up",
    });
  };

  const simulateQRScan = (orderNumber: string) => {
    const order = activeOrders.find(o => o.orderNumber === orderNumber);
    if (order) {
      setSelectedOrder(order);
      setScannedCode(orderNumber);
      setScannerActive(false);
      
      toast({
        title: "QR Code Scanned",
        description: `Order ${orderNumber} detected`,
      });
    } else {
      toast({
        title: "Invalid QR Code",
        description: "Order not found or already picked up",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800';
      case 'picked_up': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <Package className="h-4 w-4" />;
      case 'picked_up': return <CheckCircle className="h-4 w-4" />;
      case 'expired': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatTime = (timeStr: string) => {
    return new Date(timeStr).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--spiral-navy)] mb-2">
            QR Code Pickup System
          </h1>
          <p className="text-gray-600">
            Seamless contactless pickup using QR code verification
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Orders */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Ready for Pickup
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {activeOrders.filter(order => order.status === 'ready').map((order) => (
                    <div key={order.id} className="border rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{order.orderNumber}</h3>
                          <div className="flex items-center text-gray-600 mt-1">
                            <Store className="h-4 w-4 mr-1" />
                            <span className="text-sm">{order.store}</span>
                          </div>
                          <div className="flex items-center text-gray-600 mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span className="text-sm">{order.storeLocation}</span>
                          </div>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status.replace('_', ' ')}</span>
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-3">Items ({order.items.length})</h4>
                          <div className="space-y-2">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex items-center space-x-3">
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  className="w-10 h-10 rounded object-cover"
                                />
                                <div>
                                  <span className="text-sm font-medium">{item.name}</span>
                                  <span className="text-xs text-gray-500 ml-2">×{item.quantity}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="text-center">
                          <h4 className="font-medium mb-3">Pickup QR Code</h4>
                          <div className="inline-block p-4 bg-white border rounded-lg">
                            <img 
                              src={generateQRCode(order.orderNumber)}
                              alt="Pickup QR Code"
                              className="w-32 h-32"
                            />
                          </div>
                          <p className="text-xs text-gray-600 mt-2">
                            Show this code at pickup
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-1 text-blue-600" />
                            <span>Ready: {order.readyTime}</span>
                          </div>
                          <div className="flex items-center text-sm text-red-600">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            <span>Expires: {order.expiresAt}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700">{order.pickupInstructions}</p>
                      </div>

                      <div className="mt-4 flex space-x-3">
                        <Button 
                          onClick={() => setSelectedOrder(order)}
                          variant="outline"
                          className="flex-1"
                        >
                          <QrCode className="h-4 w-4 mr-2" />
                          View QR Code
                        </Button>
                        <Button 
                          onClick={() => handlePickupComplete(order.id)}
                          className="flex-1"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark as Picked Up
                        </Button>
                      </div>
                    </div>
                  ))}

                  {activeOrders.filter(order => order.status === 'ready').length === 0 && (
                    <Alert>
                      <Package className="h-4 w-4" />
                      <AlertDescription>
                        No orders ready for pickup. Check back later or visit your order history.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* QR Scanner & Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="h-5 w-5 mr-2" />
                  QR Scanner
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  {scannerActive ? (
                    <div className="p-8 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50">
                      <Camera className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                      <p className="text-sm text-gray-600 mb-4">
                        Point camera at QR code
                      </p>
                      <Button 
                        onClick={() => setScannerActive(false)}
                        variant="outline"
                      >
                        Cancel Scan
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Button 
                        onClick={() => setScannerActive(true)}
                        className="w-full mb-4"
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Start QR Scanner
                      </Button>
                      
                      <div className="text-sm text-gray-600">
                        <p className="mb-2">Or enter order number manually:</p>
                        <Input
                          placeholder="ORD-2025-001"
                          value={scannedCode}
                          onChange={(e) => setScannedCode(e.target.value)}
                          className="mb-2"
                        />
                        <Button 
                          onClick={() => simulateQRScan(scannedCode)}
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          Verify Order
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => simulateQRScan('ORD-2025-001')}
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  Simulate Pickup Scan
                </Button>
                <Button 
                  onClick={() => window.location.reload()}
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Orders
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <Smartphone className="h-4 w-4 mr-2" />
                  Mobile App Instructions
                </Button>
              </CardContent>
            </Card>

            {/* Pickup Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Pickup Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {activeOrders.filter(o => o.status === 'ready').length}
                    </div>
                    <div className="text-sm text-gray-600">Ready</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {activeOrders.filter(o => o.status === 'picked_up').length}
                    </div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Selected Order Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>QR Pickup Code</span>
                  <Button 
                    onClick={() => setSelectedOrder(null)}
                    variant="ghost"
                    size="sm"
                  >
                    ×
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-4">
                  <h3 className="font-semibold">{selectedOrder.orderNumber}</h3>
                  <p className="text-sm text-gray-600">{selectedOrder.store}</p>
                </div>
                
                <div className="inline-block p-6 bg-white border rounded-lg mb-4">
                  <img 
                    src={generateQRCode(selectedOrder.orderNumber)}
                    alt="Pickup QR Code"
                    className="w-48 h-48"
                  />
                </div>
                
                <Alert>
                  <AlertDescription>
                    {selectedOrder.pickupInstructions}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}