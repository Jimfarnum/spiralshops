import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertTriangle,
  Package,
  TrendingDown,
  Bell,
  Settings,
  Clock,
  CheckCircle,
  XCircle,
  Smartphone,
  Mail
} from 'lucide-react';

interface InventoryAlert {
  id: string;
  productId: string;
  productName: string;
  currentStock: number;
  lowStockThreshold: number;
  isOutOfStock: boolean;
  alertEnabled: boolean;
  alertMethods: ('browser' | 'email' | 'sms')[];
  lastChecked: string;
  imageUrl: string;
  storeId: string;
  storeName: string;
}

interface AlertPreferences {
  browserEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  checkFrequency: number; // minutes
}

export default function InventoryAlerts() {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<InventoryAlert[]>([
    {
      id: '1',
      productId: 'prod-123',
      productName: 'Artisan Leather Wallet',
      currentStock: 2,
      lowStockThreshold: 5,
      isOutOfStock: false,
      alertEnabled: true,
      alertMethods: ['browser', 'email'],
      lastChecked: '2025-01-22T11:30:00Z',
      imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop',
      storeId: 'store-1',
      storeName: 'Local Artisan Goods'
    },
    {
      id: '2',
      productId: 'prod-456',
      productName: 'Organic Coffee Blend',
      currentStock: 0,
      lowStockThreshold: 10,
      isOutOfStock: true,
      alertEnabled: true,
      alertMethods: ['browser', 'email', 'sms'],
      lastChecked: '2025-01-22T11:25:00Z',
      imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=100&h=100&fit=crop',
      storeId: 'store-2',
      storeName: 'Heritage Roasters'
    },
    {
      id: '3',
      productId: 'prod-789',
      productName: 'Hand-Painted Ceramic Mug',
      currentStock: 8,
      lowStockThreshold: 3,
      isOutOfStock: false,
      alertEnabled: false,
      alertMethods: ['browser'],
      lastChecked: '2025-01-22T11:32:00Z',
      imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=100&h=100&fit=crop',
      storeId: 'store-3',
      storeName: 'Clay & Co Pottery'
    }
  ]);

  const [preferences, setPreferences] = useState<AlertPreferences>({
    browserEnabled: true,
    emailEnabled: true,
    smsEnabled: false,
    checkFrequency: 15
  });

  const [isMonitoring, setIsMonitoring] = useState(true);

  // Simulate real-time inventory monitoring
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      setAlerts(prev => prev.map(alert => {
        // Simulate stock level changes
        const stockChange = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        const newStock = Math.max(0, alert.currentStock + stockChange);
        const wasOutOfStock = alert.isOutOfStock;
        const isNowOutOfStock = newStock === 0;
        const isLowStock = newStock > 0 && newStock <= alert.lowStockThreshold;

        // Trigger notifications for significant changes
        if (alert.alertEnabled) {
          if (!wasOutOfStock && isNowOutOfStock) {
            triggerAlert(alert, 'out_of_stock');
          } else if (wasOutOfStock && !isNowOutOfStock) {
            triggerAlert(alert, 'back_in_stock');
          } else if (!alert.isOutOfStock && !isNowOutOfStock && isLowStock && alert.currentStock > alert.lowStockThreshold) {
            triggerAlert(alert, 'low_stock');
          }
        }

        return {
          ...alert,
          currentStock: newStock,
          isOutOfStock: isNowOutOfStock,
          lastChecked: new Date().toISOString()
        };
      }));
    }, 30000); // Check every 30 seconds for demo

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const triggerAlert = (alert: InventoryAlert, type: 'out_of_stock' | 'back_in_stock' | 'low_stock') => {
    if (!alert.alertEnabled) return;

    const messages = {
      out_of_stock: `${alert.productName} is now out of stock at ${alert.storeName}`,
      back_in_stock: `${alert.productName} is back in stock at ${alert.storeName}!`,
      low_stock: `${alert.productName} is running low (${alert.currentStock} left) at ${alert.storeName}`
    };

    const variants = {
      out_of_stock: 'destructive' as const,
      back_in_stock: 'default' as const,
      low_stock: 'default' as const
    };

    if (alert.alertMethods.includes('browser') && preferences.browserEnabled) {
      toast({
        title: type === 'back_in_stock' ? 'Back in Stock!' : type === 'low_stock' ? 'Low Stock Alert' : 'Out of Stock',
        description: messages[type],
        variant: variants[type],
        duration: 5000,
      });

      // Browser notification if permission granted
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`SPIRAL - ${type.replace('_', ' ').toUpperCase()}`, {
          body: messages[type],
          icon: alert.imageUrl
        });
      }
    }
  };

  const toggleAlert = (alertId: string, enabled: boolean) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, alertEnabled: enabled } : alert
    ));
    
    toast({
      title: enabled ? 'Alert Enabled' : 'Alert Disabled',
      description: `Inventory monitoring ${enabled ? 'enabled' : 'disabled'} for this item`,
      duration: 3000,
    });
  };

  const updateAlertMethods = (alertId: string, methods: ('browser' | 'email' | 'sms')[]) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, alertMethods: methods } : alert
    ));
  };

  const updateThreshold = (alertId: string, threshold: number) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, lowStockThreshold: threshold } : alert
    ));
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        toast({
          title: 'Notifications Enabled',
          description: 'You\'ll now receive browser notifications for inventory alerts',
          duration: 3000,
        });
      }
    }
  };

  const getStockStatus = (alert: InventoryAlert) => {
    if (alert.isOutOfStock) {
      return { status: 'Out of Stock', color: 'bg-red-100 text-red-800', icon: <XCircle className="h-3 w-3" /> };
    } else if (alert.currentStock <= alert.lowStockThreshold) {
      return { status: 'Low Stock', color: 'bg-yellow-100 text-yellow-800', icon: <AlertTriangle className="h-3 w-3" /> };
    } else {
      return { status: 'In Stock', color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-3 w-3" /> };
    }
  };

  const formatLastChecked = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const activeAlerts = alerts.filter(a => a.alertEnabled);
  const criticalAlerts = alerts.filter(a => a.isOutOfStock && a.alertEnabled);
  const lowStockAlerts = alerts.filter(a => !a.isOutOfStock && a.currentStock <= a.lowStockThreshold && a.alertEnabled);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header & Stats */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[var(--spiral-navy)]">Inventory Alerts</h1>
          <p className="text-gray-600">Real-time monitoring of your watched products</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge className={isMonitoring ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
            {isMonitoring ? 'Monitoring Active' : 'Monitoring Paused'}
          </Badge>
          <Button
            onClick={() => setIsMonitoring(!isMonitoring)}
            variant={isMonitoring ? 'outline' : 'default'}
            size="sm"
          >
            {isMonitoring ? 'Pause' : 'Resume'}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-[var(--spiral-navy)]">{alerts.length}</div>
            <div className="text-sm text-gray-600">Watched Items</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{activeAlerts.length}</div>
            <div className="text-sm text-gray-600">Active Alerts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{criticalAlerts.length}</div>
            <div className="text-sm text-gray-600">Out of Stock</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{lowStockAlerts.length}</div>
            <div className="text-sm text-gray-600">Low Stock</div>
          </CardContent>
        </Card>
      </div>

      {/* Alert Preferences */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-[var(--spiral-coral)]" />
            Alert Preferences
          </CardTitle>
          <CardDescription>Configure how you receive inventory notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-[var(--spiral-navy)]">Notification Methods</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    <span className="text-sm">Browser Notifications</span>
                  </div>
                  <Switch
                    checked={preferences.browserEnabled}
                    onCheckedChange={(checked) => {
                      setPreferences(prev => ({ ...prev, browserEnabled: checked }));
                      if (checked) requestNotificationPermission();
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">Email Alerts</span>
                  </div>
                  <Switch
                    checked={preferences.emailEnabled}
                    onCheckedChange={(checked) => 
                      setPreferences(prev => ({ ...prev, emailEnabled: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    <span className="text-sm">SMS Alerts</span>
                  </div>
                  <Switch
                    checked={preferences.smsEnabled}
                    onCheckedChange={(checked) => 
                      setPreferences(prev => ({ ...prev, smsEnabled: checked }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-[var(--spiral-navy)]">Monitoring Frequency</h4>
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Check every (minutes)</label>
                <Input
                  type="number"
                  min="1"
                  max="60"
                  value={preferences.checkFrequency}
                  onChange={(e) => 
                    setPreferences(prev => ({ ...prev, checkFrequency: parseInt(e.target.value) || 15 }))
                  }
                  className="w-24"
                />
                <p className="text-xs text-gray-500">Real-time monitoring for critical alerts</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-[var(--spiral-navy)]">Quick Actions</h4>
              <div className="space-y-2">
                <Button
                  onClick={requestNotificationPermission}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Enable Browser Notifications
                </Button>
                <Button
                  onClick={() => setIsMonitoring(!isMonitoring)}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  {isMonitoring ? 'Pause All Monitoring' : 'Resume All Monitoring'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alert Items */}
      <div className="space-y-4">
        {alerts.map(alert => {
          const stockStatus = getStockStatus(alert);
          
          return (
            <Card key={alert.id} className={alert.isOutOfStock ? 'border-red-200 bg-red-50' : alert.currentStock <= alert.lowStockThreshold ? 'border-yellow-200 bg-yellow-50' : ''}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <img 
                    src={alert.imageUrl} 
                    alt={alert.productName}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-[var(--spiral-navy)] mb-1">
                          {alert.productName}
                        </h3>
                        <p className="text-sm text-gray-600">{alert.storeName}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={stockStatus.color}>
                          {stockStatus.icon}
                          <span className="ml-1">{stockStatus.status}</span>
                        </Badge>
                        <Switch
                          checked={alert.alertEnabled}
                          onCheckedChange={(checked) => toggleAlert(alert.id, checked)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-1">Current Stock</div>
                        <div className="text-2xl font-bold text-[var(--spiral-navy)]">
                          {alert.currentStock}
                          <span className="text-sm font-normal text-gray-500 ml-1">units</span>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-1">Low Stock Threshold</div>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="0"
                            value={alert.lowStockThreshold}
                            onChange={(e) => updateThreshold(alert.id, parseInt(e.target.value) || 0)}
                            className="w-20 h-8 text-sm"
                            disabled={!alert.alertEnabled}
                          />
                          <span className="text-sm text-gray-500">units</span>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-1">Alert Methods</div>
                        <div className="flex gap-2">
                          {['browser', 'email', 'sms'].map(method => (
                            <Button
                              key={method}
                              onClick={() => {
                                const methods = alert.alertMethods.includes(method as any)
                                  ? alert.alertMethods.filter(m => m !== method)
                                  : [...alert.alertMethods, method as any];
                                updateAlertMethods(alert.id, methods);
                              }}
                              variant={alert.alertMethods.includes(method as any) ? 'default' : 'outline'}
                              size="sm"
                              className="h-8 px-2 text-xs"
                              disabled={!alert.alertEnabled}
                            >
                              {method === 'browser' && <Bell className="h-3 w-3" />}
                              {method === 'email' && <Mail className="h-3 w-3" />}
                              {method === 'sms' && <Smartphone className="h-3 w-3" />}
                              <span className="ml-1 capitalize">{method}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>Last checked {formatLastChecked(alert.lastChecked)}</span>
                      </div>
                      
                      {alert.isOutOfStock && (
                        <Badge className="bg-red-100 text-red-800">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Action Required
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {alerts.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Items Being Monitored</h3>
              <p className="text-gray-500">Add items to your wishlist to start monitoring their inventory levels!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}