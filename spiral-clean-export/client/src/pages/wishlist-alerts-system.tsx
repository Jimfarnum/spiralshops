import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Bell, 
  BellOff, 
  Heart,
  Star,
  TrendingDown,
  Package,
  Settings,
  Smartphone,
  Mail,
  MessageSquare
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WishlistItem {
  id: string;
  name: string;
  store: string;
  currentPrice: number;
  targetPrice?: number;
  inStock: boolean;
  alertsEnabled: boolean;
  image: string;
}

interface AlertSettings {
  stockAlerts: boolean;
  priceDropAlerts: boolean;
  saleAlerts: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  frequency: 'instant' | 'daily' | 'weekly';
}

export default function WishlistAlertsSystem() {
  const { toast } = useToast();
  
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([
    {
      id: '1',
      name: 'Nike Air Max 270',
      store: 'Athletic Zone',
      currentPrice: 120,
      targetPrice: 100,
      inStock: true,
      alertsEnabled: true,
      image: '/api/placeholder/200/200'
    },
    {
      id: '2', 
      name: 'iPhone 15 Pro Case',
      store: 'Tech Central',
      currentPrice: 45,
      targetPrice: 35,
      inStock: false,
      alertsEnabled: true,
      image: '/api/placeholder/200/200'
    },
    {
      id: '3',
      name: 'Coffee Table Book',
      store: 'Barnes & Noble',
      currentPrice: 28,
      inStock: true,
      alertsEnabled: false,
      image: '/api/placeholder/200/200'
    }
  ]);

  const [alertSettings, setAlertSettings] = useState<AlertSettings>({
    stockAlerts: true,
    priceDropAlerts: true,
    saleAlerts: true,
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    frequency: 'instant'
  });

  const [activeAlerts, setActiveAlerts] = useState([
    {
      id: '1',
      type: 'price_drop',
      item: 'Nike Air Max 270',
      message: 'Price dropped from $130 to $120',
      timestamp: '2 hours ago',
      read: false
    },
    {
      id: '2',
      type: 'back_in_stock',
      item: 'iPhone 15 Pro Case',
      message: 'Back in stock at Tech Central!',
      timestamp: '1 day ago',
      read: false
    }
  ]);

  const toggleItemAlert = (itemId: string) => {
    setWishlistItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, alertsEnabled: !item.alertsEnabled }
          : item
      )
    );
    
    toast({
      title: "Alert Setting Updated",
      description: "Wishlist alert preferences saved",
    });
  };

  const updateTargetPrice = (itemId: string, price: number) => {
    setWishlistItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, targetPrice: price }
          : item
      )
    );
  };

  const updateAlertSettings = (key: keyof AlertSettings, value: boolean | string) => {
    setAlertSettings(prev => ({
      ...prev,
      [key]: value
    }));
    
    toast({
      title: "Settings Updated",
      description: "Alert preferences have been saved",
    });
  };

  const simulateAlert = () => {
    const newAlert = {
      id: Date.now().toString(),
      type: 'sale_alert',
      item: 'Nike Air Max 270',
      message: '25% off sale starting now!',
      timestamp: 'Just now',
      read: false
    };
    
    setActiveAlerts(prev => [newAlert, ...prev]);
    
    if (alertSettings.pushNotifications) {
      toast({
        title: "🔔 Wishlist Alert!",
        description: newAlert.message,
      });
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'price_drop': return <TrendingDown className="h-4 w-4 text-green-600" />;
      case 'back_in_stock': return <Package className="h-4 w-4 text-blue-600" />;
      case 'sale_alert': return <Star className="h-4 w-4 text-yellow-600" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--spiral-navy)] mb-2">
            Wishlist Alerts System
          </h1>
          <p className="text-gray-600">
            Manage notifications for your favorite items with intelligent alert preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Alert Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Alert Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Alert Types</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Stock Alerts</span>
                    <Switch
                      checked={alertSettings.stockAlerts}
                      onCheckedChange={(checked) => updateAlertSettings('stockAlerts', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Price Drop Alerts</span>
                    <Switch
                      checked={alertSettings.priceDropAlerts}
                      onCheckedChange={(checked) => updateAlertSettings('priceDropAlerts', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sale Alerts</span>
                    <Switch
                      checked={alertSettings.saleAlerts}
                      onCheckedChange={(checked) => updateAlertSettings('saleAlerts', checked)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Notification Methods</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Smartphone className="h-4 w-4 mr-2" />
                      <span className="text-sm">Push Notifications</span>
                    </div>
                    <Switch
                      checked={alertSettings.pushNotifications}
                      onCheckedChange={(checked) => updateAlertSettings('pushNotifications', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      <span className="text-sm">Email</span>
                    </div>
                    <Switch
                      checked={alertSettings.emailNotifications}
                      onCheckedChange={(checked) => updateAlertSettings('emailNotifications', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      <span className="text-sm">SMS</span>
                    </div>
                    <Switch
                      checked={alertSettings.smsNotifications}
                      onCheckedChange={(checked) => updateAlertSettings('smsNotifications', checked)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Frequency</h4>
                <Select
                  value={alertSettings.frequency}
                  onValueChange={(value) => updateAlertSettings('frequency', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instant">Instant</SelectItem>
                    <SelectItem value="daily">Daily Digest</SelectItem>
                    <SelectItem value="weekly">Weekly Summary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={simulateAlert} className="w-full">
                <Bell className="h-4 w-4 mr-2" />
                Test Alert
              </Button>
            </CardContent>
          </Card>

          {/* Wishlist Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="h-5 w-5 mr-2" />
                Wishlist Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {wishlistItems.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-600">{item.store}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={item.inStock ? "default" : "secondary"}>
                              {item.inStock ? 'In Stock' : 'Out of Stock'}
                            </Badge>
                            <span className="text-sm font-medium">${item.currentPrice}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {item.alertsEnabled ? (
                          <Bell className="h-4 w-4 text-blue-600" />
                        ) : (
                          <BellOff className="h-4 w-4 text-gray-400" />
                        )}
                        <Switch
                          checked={item.alertsEnabled}
                          onCheckedChange={() => toggleItemAlert(item.id)}
                          className="ml-2"
                        />
                      </div>
                    </div>
                    
                    {item.alertsEnabled && (
                      <div className="mt-3 pt-3 border-t">
                        <label className="text-sm font-medium">Target Price</label>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm">$</span>
                          <Input
                            type="number"
                            value={item.targetPrice || ''}
                            onChange={(e) => updateTargetPrice(item.id, parseFloat(e.target.value))}
                            className="w-20"
                            placeholder="0"
                          />
                          <span className="text-xs text-gray-500">
                            Alert when below this price
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Active Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Recent Alerts
                </div>
                <Badge variant="outline">
                  {activeAlerts.filter(a => !a.read).length} new
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeAlerts.map((alert) => (
                  <div key={alert.id} className={`p-4 rounded-lg border ${!alert.read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'}`}>
                    <div className="flex items-start space-x-3">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{alert.item}</h4>
                        <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                        <p className="text-xs text-gray-400 mt-2">{alert.timestamp}</p>
                      </div>
                      {!alert.read && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {activeAlerts.length === 0 && (
                <Alert>
                  <Bell className="h-4 w-4" />
                  <AlertDescription>
                    No recent alerts. We'll notify you when there are updates to your wishlist items.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Summary Stats */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Alert Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{wishlistItems.length}</div>
                <div className="text-sm text-gray-600">Tracked Items</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {wishlistItems.filter(item => item.alertsEnabled).length}
                </div>
                <div className="text-sm text-gray-600">Active Alerts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {activeAlerts.filter(a => !a.read).length}
                </div>
                <div className="text-sm text-gray-600">Unread Alerts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {wishlistItems.filter(item => item.targetPrice && item.currentPrice <= item.targetPrice).length}
                </div>
                <div className="text-sm text-gray-600">Price Targets Met</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}