import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useToast } from '@/hooks/use-toast';
import { 
  Bell, 
  Users, 
  Send,
  BarChart3,
  Mail,
  Smartphone,
  Monitor,
  Package,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Play,
  Radio
} from 'lucide-react';

interface AlertStats {
  total: number;
  stockAlerts: number;
  priceAlerts: number;
}

interface PendingAlert {
  tracker: {
    id: number;
    productId: number;
    originalPrice: string;
    alertType: string;
    lastAlertedAt: string | null;
    createdAt: string;
  };
  user: {
    id: number;
    username: string;
    email: string;
  };
}

export default function AdminWishlistAlertsPage() {
  const { toast } = useToast();
  const [alertStats, setAlertStats] = useState<AlertStats>({ total: 0, stockAlerts: 0, priceAlerts: 0 });
  const [pendingAlerts, setPendingAlerts] = useState<PendingAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [broadcasting, setBroadcasting] = useState(false);
  const [testingProduct, setTestingProduct] = useState('');
  const [testingType, setTestingType] = useState('back_in_stock');
  const [broadcastData, setBroadcastData] = useState({
    productId: '',
    alertType: 'back_in_stock',
    message: ''
  });

  useEffect(() => {
    loadAlertData();
  }, []);

  const loadAlertData = async () => {
    try {
      const response = await fetch('/api/admin/wishlist-alerts');
      if (response.ok) {
        const data = await response.json();
        setAlertStats(data.stats);
        setPendingAlerts(data.pendingAlerts);
      }
    } catch (error) {
      console.error('Error loading alert data:', error);
      toast({
        title: "Loading Error",
        description: "Failed to load alert data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendTestAlert = async () => {
    if (!testingProduct) {
      toast({
        title: "Missing Product ID",
        description: "Please enter a product ID to test",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/wishlist-alerts/trigger-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          productId: parseInt(testingProduct), 
          alertType: testingType 
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        toast({
          title: "Test Alert Sent",
          description: `${result.message} (${result.trackersFound} trackers found)`,
        });
        loadAlertData(); // Refresh data
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Failed to send test alert",
        variant: "destructive",
      });
    }
  };

  const sendBroadcast = async () => {
    if (!broadcastData.productId) {
      toast({
        title: "Missing Product ID",
        description: "Please enter a product ID for broadcast",
        variant: "destructive",
      });
      return;
    }

    setBroadcasting(true);
    try {
      const response = await fetch('/api/admin/wishlist-alerts/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(broadcastData),
      });

      const result = await response.json();
      
      if (response.ok) {
        toast({
          title: "Broadcast Sent",
          description: result.message,
        });
        setBroadcastData({
          productId: '',
          alertType: 'back_in_stock',
          message: ''
        });
        loadAlertData();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        title: "Broadcast Failed",
        description: "Failed to send broadcast alert",
        variant: "destructive",
      });
    } finally {
      setBroadcasting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case 'stock':
        return <Package className="h-4 w-4" />;
      case 'price':
        return <DollarSign className="h-4 w-4" />;
      case 'both':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--spiral-cream)]">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
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
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Bell className="h-8 w-8 text-[var(--spiral-coral)]" />
              <h1 className="text-4xl font-bold text-[var(--spiral-navy)]">
                Wishlist Alerts Admin
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Monitor and manage wishlist alert system. Send test alerts, view active trackers, and broadcast notifications.
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Active Alerts</p>
                    <p className="text-3xl font-bold text-[var(--spiral-navy)]">{alertStats.total}</p>
                  </div>
                  <Bell className="h-12 w-12 text-[var(--spiral-coral)]" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Stock Alerts</p>
                    <p className="text-3xl font-bold text-blue-600">{alertStats.stockAlerts}</p>
                  </div>
                  <Package className="h-12 w-12 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Price Alerts</p>
                    <p className="text-3xl font-bold text-green-600">{alertStats.priceAlerts}</p>
                  </div>
                  <DollarSign className="h-12 w-12 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Alert Overview</TabsTrigger>
              <TabsTrigger value="testing">Testing Tools</TabsTrigger>
              <TabsTrigger value="broadcast">Send Alerts</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Active Alert Trackers ({pendingAlerts.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {pendingAlerts.length === 0 ? (
                    <div className="text-center py-8">
                      <Bell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Alerts</h3>
                      <p className="text-gray-600">No users are currently tracking products for alerts.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingAlerts.map((alert, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                {getAlertTypeIcon(alert.tracker.alertType)}
                                <h3 className="font-medium">Product {alert.tracker.productId}</h3>
                                <Badge variant="outline">
                                  {alert.tracker.alertType === 'both' ? 'Stock & Price' : 
                                   alert.tracker.alertType === 'stock' ? 'Stock Only' : 'Price Only'}
                                </Badge>
                              </div>
                              <div className="text-sm text-gray-600">
                                <p>User: {alert.user.username} ({alert.user.email})</p>
                                <p>Original Price: ${alert.tracker.originalPrice}</p>
                                <p>Created: {formatDate(alert.tracker.createdAt)}</p>
                                {alert.tracker.lastAlertedAt && (
                                  <p>Last Alert: {formatDate(alert.tracker.lastAlertedAt)}</p>
                                )}
                              </div>
                            </div>
                            <Badge variant={alert.tracker.lastAlertedAt ? 'secondary' : 'default'}>
                              {alert.tracker.lastAlertedAt ? 'Previously Alerted' : 'Never Alerted'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Testing Tab */}
            <TabsContent value="testing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5" />
                    Alert Testing Tools
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="test-product-id">Product ID</Label>
                        <Input
                          id="test-product-id"
                          placeholder="Enter product ID (e.g., 1)"
                          value={testingProduct}
                          onChange={(e) => setTestingProduct(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="test-alert-type">Alert Type</Label>
                        <select
                          id="test-alert-type"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          value={testingType}
                          onChange={(e) => setTestingType(e.target.value)}
                        >
                          <option value="back_in_stock">Back in Stock</option>
                          <option value="price_drop">Price Drop</option>
                        </select>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={sendTestAlert}
                      className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/80"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Send Test Alert
                    </Button>
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Test alerts will be sent to all users who have active tracking for the specified product.
                      This helps verify the notification system is working correctly.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Broadcast Tab */}
            <TabsContent value="broadcast" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Radio className="h-5 w-5" />
                    Send Alert to All Users
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="broadcast-product-id">Product ID</Label>
                        <Input
                          id="broadcast-product-id"
                          placeholder="Enter product ID"
                          value={broadcastData.productId}
                          onChange={(e) => setBroadcastData({
                            ...broadcastData,
                            productId: e.target.value
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="broadcast-alert-type">Alert Type</Label>
                        <select
                          id="broadcast-alert-type"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          value={broadcastData.alertType}
                          onChange={(e) => setBroadcastData({
                            ...broadcastData,
                            alertType: e.target.value
                          })}
                        >
                          <option value="back_in_stock">Back in Stock</option>
                          <option value="price_drop">Price Drop</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="broadcast-message">Custom Message (Optional)</Label>
                      <Textarea
                        id="broadcast-message"
                        placeholder="Add a custom message for this broadcast..."
                        value={broadcastData.message}
                        onChange={(e) => setBroadcastData({
                          ...broadcastData,
                          message: e.target.value
                        })}
                        rows={3}
                      />
                    </div>
                    
                    <Button 
                      onClick={sendBroadcast}
                      disabled={broadcasting}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      {broadcasting ? (
                        <>
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                          Broadcasting...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Broadcast Alert
                        </>
                      )}
                    </Button>
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Warning:</strong> Broadcast alerts will be sent to ALL users tracking the specified product.
                      Use this feature carefully as it will generate real notifications.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* System Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                System Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Mail className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                  <h3 className="font-semibold">Email Notifications</h3>
                  <p className="text-sm text-gray-600">Simulated email alerts for demo</p>
                </div>
                <div className="text-center">
                  <Smartphone className="h-8 w-8 mx-auto text-green-600 mb-2" />
                  <h3 className="font-semibold">SMS Notifications</h3>
                  <p className="text-sm text-gray-600">Mock SMS integration ready</p>
                </div>
                <div className="text-center">
                  <Monitor className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                  <h3 className="font-semibold">Browser Push</h3>
                  <p className="text-sm text-gray-600">Browser notifications enabled</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}