import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Bell, 
  Heart, 
  TrendingDown, 
  Package, 
  Settings, 
  Trash2, 
  DollarSign, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  Mail,
  Smartphone,
  Monitor,
  Play,
  RefreshCw,
  BarChart3,
  Users,
  Zap
} from 'lucide-react';

interface WishlistAlert {
  id: number;
  productId: number;
  productName: string;
  currentPrice: number;
  targetPrice?: number;
  alertType: 'stock' | 'price' | 'promo';
  notificationMethods: string[];
  isActive: boolean;
  createdAt: string;
}

interface NotificationPreferences {
  enableEmail: boolean;
  enableSms: boolean;
  enablePush: boolean;
  globalOptOut: boolean;
  email?: string;
  phone?: string;
}

interface NotificationHistory {
  id: number;
  productName: string;
  notificationType: string;
  alertType: string;
  message: string;
  status: string;
  sentAt: string;
}

export default function Feature13Demo() {
  const [wishlistAlerts, setWishlistAlerts] = useState<WishlistAlert[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    enableEmail: true,
    enableSms: false,
    enablePush: true,
    globalOptOut: false,
    email: 'user@spiral.local',
    phone: '+15551234567'
  });
  const [notificationHistory, setNotificationHistory] = useState<NotificationHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('alerts');
  const [testingAlert, setTestingAlert] = useState<number | null>(null);
  const [stats, setStats] = useState({
    totalAlerts: 0,
    activeAlerts: 0,
    notificationsSent: 0,
    monitoredProducts: 0
  });
  
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load wishlist alerts
      const alertsRes = await fetch('/api/wishlist/alerts/1');
      let alertsData: WishlistAlert[] = [];
      if (alertsRes.ok) {
        alertsData = await alertsRes.json();
        setWishlistAlerts(alertsData);
      }

      // Load notification history
      const historyRes = await fetch('/api/notifications/history/1');
      let historyData: NotificationHistory[] = [];
      if (historyRes.ok) {
        historyData = await historyRes.json();
        setNotificationHistory(historyData);
      }

      // Load preferences
      const prefsRes = await fetch('/api/notifications/preferences/1');
      if (prefsRes.ok) {
        const prefsData = await prefsRes.json();
        setPreferences(prefsData);
      }

      // Update stats
      const activeCount = alertsData?.filter((alert: WishlistAlert) => alert.isActive).length || 0;
      setStats({
        totalAlerts: alertsData?.length || 0,
        activeAlerts: activeCount,
        notificationsSent: historyData?.length || 0,
        monitoredProducts: alertsData?.length || 0
      });
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Loading Error",
        description: "Failed to load wishlist alert data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createAlert = async () => {
    try {
      const response = await fetch('/api/wishlist/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: Math.floor(Math.random() * 1000) + 1,
          productName: `Demo Product ${Date.now()}`,
          currentPrice: Math.floor(Math.random() * 5000) + 1000,
          targetPrice: Math.floor(Math.random() * 3000) + 500,
          alertType: ['stock', 'price', 'promo'][Math.floor(Math.random() * 3)],
          notificationMethods: ['email', 'push']
        }),
      });

      if (response.ok) {
        toast({
          title: "Alert Created",
          description: "New wishlist alert has been created successfully!",
        });
        loadData();
      }
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "Failed to create wishlist alert",
        variant: "destructive",
      });
    }
  };

  const testAlert = async (alertId: number, alertType: string) => {
    setTestingAlert(alertId);
    try {
      const response = await fetch('/api/wishlist/alerts/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: alertId,
          alertType,
          userId: 1
        }),
      });

      if (response.ok) {
        toast({
          title: "Test Alert Sent! 📧📱🔔",
          description: `${alertType} notification sent via email, SMS, and push`,
        });
        
        // Refresh history to show new notification
        setTimeout(() => loadData(), 1000);
      }
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Failed to send test alert",
        variant: "destructive",
      });
    } finally {
      setTestingAlert(null);
    }
  };

  const updatePreferences = async (newPrefs: Partial<NotificationPreferences>) => {
    try {
      const response = await fetch('/api/notifications/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...preferences, ...newPrefs }),
      });

      if (response.ok) {
        setPreferences(prev => ({ ...prev, ...newPrefs }));
        toast({
          title: "Preferences Updated",
          description: "Your notification preferences have been saved",
        });
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update notification preferences",
        variant: "destructive",
      });
    }
  };

  const triggerProductCheck = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/notifications/check-changes', {
        method: 'POST',
      });

      if (response.ok) {
        toast({
          title: "Product Check Complete! 🔍",
          description: "Automated inventory and price check has been performed",
        });
        
        // Refresh data to show any new notifications
        setTimeout(() => loadData(), 1500);
      }
    } catch (error) {
      toast({
        title: "Check Failed",
        description: "Failed to run product change check",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => `$${(price / 100).toFixed(2)}`;
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case 'stock': return <Package className="h-4 w-4" />;
      case 'price': return <TrendingDown className="h-4 w-4" />;
      case 'promo': return <Zap className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'sms': return <Smartphone className="h-4 w-4" />;
      case 'push': return <Monitor className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-['Poppins']">
            Feature 13: Wishlist Alert System Demo
          </h1>
          <p className="text-xl text-gray-600 font-['Inter'] mb-6">
            Complete Push/Email/SMS notification system for wishlist items
          </p>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.activeAlerts}</p>
                  </div>
                  <Bell className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Products Monitored</p>
                    <p className="text-2xl font-bold text-green-600">{stats.monitoredProducts}</p>
                  </div>
                  <Package className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Notifications Sent</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.notificationsSent}</p>
                  </div>
                  <Mail className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Success Rate</p>
                    <p className="text-2xl font-bold text-orange-600">92%</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-6">
            <Button onClick={createAlert} className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Create Demo Alert
            </Button>
            <Button 
              onClick={triggerProductCheck} 
              variant="outline" 
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Run Product Check
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="alerts">
              Wishlist Alerts ({wishlistAlerts.length})
            </TabsTrigger>
            <TabsTrigger value="preferences">
              Notification Preferences
            </TabsTrigger>
            <TabsTrigger value="history">
              Notification History ({notificationHistory.length})
            </TabsTrigger>
          </TabsList>

          {/* Wishlist Alerts Tab */}
          <TabsContent value="alerts" className="mt-6">
            <div className="space-y-4">
              {wishlistAlerts.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No Wishlist Alerts</h3>
                    <p className="text-gray-500 mb-4">Create an alert to get notified when products change!</p>
                    <Button onClick={createAlert}>Create Your First Alert</Button>
                  </CardContent>
                </Card>
              ) : (
                wishlistAlerts.map(alert => (
                  <Card key={alert.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getAlertTypeIcon(alert.alertType)}
                            <h3 className="text-lg font-semibold">{alert.productName}</h3>
                            <Badge variant={alert.isActive ? "default" : "secondary"}>
                              {alert.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            <Badge variant="outline">
                              {alert.alertType}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-2">
                            Current Price: {formatPrice(alert.currentPrice)}
                            {alert.targetPrice && (
                              <span className="ml-2 text-green-600">
                                • Target: {formatPrice(alert.targetPrice)}
                              </span>
                            )}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="h-4 w-4" />
                            Created: {formatDate(alert.createdAt)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => testAlert(alert.id, alert.alertType)}
                            disabled={testingAlert === alert.id}
                          >
                            {testingAlert === alert.id ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                            Test Alert
                          </Button>
                        </div>
                      </div>
                      
                      {/* Notification Methods */}
                      <div className="border-t pt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Notification Methods:</p>
                        <div className="flex items-center gap-3">
                          {alert.notificationMethods.map(method => (
                            <div key={method} className="flex items-center gap-1 text-sm">
                              {getNotificationIcon(method)}
                              <span className="capitalize">{method}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Notification Preferences Tab */}
          <TabsContent value="preferences" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Configure how you want to receive wishlist alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-700">Contact Information</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Email Address</label>
                        <Input
                          type="email"
                          value={preferences.email}
                          onChange={(e) => updatePreferences({ email: e.target.value })}
                          placeholder="your@email.com"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Phone Number</label>
                        <Input
                          type="tel"
                          value={preferences.phone}
                          onChange={(e) => updatePreferences({ phone: e.target.value })}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-700">Notification Channels</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span>Email Notifications</span>
                        </div>
                        <Switch
                          checked={preferences.enableEmail}
                          onCheckedChange={(checked) => updatePreferences({ enableEmail: checked })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4" />
                          <span>SMS Notifications</span>
                        </div>
                        <Switch
                          checked={preferences.enableSms}
                          onCheckedChange={(checked) => updatePreferences({ enableSms: checked })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Monitor className="h-4 w-4" />
                          <span>Push Notifications</span>
                        </div>
                        <Switch
                          checked={preferences.enablePush}
                          onCheckedChange={(checked) => updatePreferences({ enablePush: checked })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          <span>Opt Out of All Notifications</span>
                        </div>
                        <Switch
                          checked={preferences.globalOptOut}
                          onCheckedChange={(checked) => updatePreferences({ globalOptOut: checked })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification History Tab */}
          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification History</CardTitle>
                <CardDescription>
                  Recent notifications sent for your wishlist items
                </CardDescription>
              </CardHeader>
              <CardContent>
                {notificationHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No notifications sent yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notificationHistory.map(notification => (
                      <div key={notification.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.notificationType)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{notification.productName}</h4>
                            <Badge variant="outline">{notification.alertType}</Badge>
                            <Badge variant={notification.status === 'sent' ? 'default' : 'destructive'}>
                              {notification.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{notification.message}</p>
                          <p className="text-xs text-gray-500">{formatDate(notification.sentAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}