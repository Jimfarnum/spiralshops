import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Bell, 
  BellOff,
  Smartphone,
  Settings,
  Shield,
  Clock,
  Package,
  CreditCard,
  Store,
  Heart,
  TrendingDown,
  Gift,
  Users,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotificationCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  frequency: 'instant' | 'daily' | 'weekly';
  subcategories: Array<{
    id: string;
    name: string;
    enabled: boolean;
  }>;
}

export default function PushNotificationSettings() {
  const { toast } = useToast();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [permission, setPermission] = useState<'granted' | 'denied' | 'default'>('default');
  
  const [categories, setCategories] = useState<NotificationCategory[]>([
    {
      id: 'orders',
      name: 'Order Updates',
      description: 'Notifications about your orders and shipments',
      icon: <Package className="h-5 w-5" />,
      enabled: true,
      frequency: 'instant',
      subcategories: [
        { id: 'order_confirmed', name: 'Order Confirmed', enabled: true },
        { id: 'order_shipped', name: 'Order Shipped', enabled: true },
        { id: 'order_delivered', name: 'Order Delivered', enabled: true },
        { id: 'pickup_ready', name: 'Pickup Ready', enabled: true }
      ]
    },
    {
      id: 'wishlist',
      name: 'Wishlist Alerts',
      description: 'Updates about items in your wishlist',
      icon: <Heart className="h-5 w-5" />,
      enabled: true,
      frequency: 'instant',
      subcategories: [
        { id: 'back_in_stock', name: 'Back in Stock', enabled: true },
        { id: 'price_drop', name: 'Price Drops', enabled: true },
        { id: 'sale_alerts', name: 'Sale Alerts', enabled: true },
        { id: 'low_stock', name: 'Low Stock Warnings', enabled: false }
      ]
    },
    {
      id: 'spirals',
      name: 'SPIRAL Points',
      description: 'Updates about your loyalty points and rewards',
      icon: <Gift className="h-5 w-5" />,
      enabled: true,
      frequency: 'daily',
      subcategories: [
        { id: 'points_earned', name: 'Points Earned', enabled: true },
        { id: 'tier_upgrade', name: 'Tier Upgrades', enabled: true },
        { id: 'points_expiring', name: 'Points Expiring Soon', enabled: true },
        { id: 'bonus_opportunities', name: 'Bonus Opportunities', enabled: false }
      ]
    },
    {
      id: 'stores',
      name: 'Store Updates',
      description: 'News from your favorite stores',
      icon: <Store className="h-5 w-5" />,
      enabled: false,
      frequency: 'weekly',
      subcategories: [
        { id: 'new_products', name: 'New Products', enabled: false },
        { id: 'store_sales', name: 'Store Sales', enabled: false },
        { id: 'events', name: 'Store Events', enabled: false },
        { id: 'hours_changes', name: 'Hours Changes', enabled: true }
      ]
    },
    {
      id: 'social',
      name: 'Social & Community',
      description: 'Updates from friends and community activities',
      icon: <Users className="h-5 w-5" />,
      enabled: false,
      frequency: 'daily',
      subcategories: [
        { id: 'friend_activity', name: 'Friend Activity', enabled: false },
        { id: 'invite_responses', name: 'Invite Responses', enabled: true },
        { id: 'community_events', name: 'Community Events', enabled: false },
        { id: 'reviews_feedback', name: 'Review Feedback', enabled: false }
      ]
    },
    {
      id: 'payments',
      name: 'Payment & Security',
      description: 'Important payment and account security alerts',
      icon: <CreditCard className="h-5 w-5" />,
      enabled: true,
      frequency: 'instant',
      subcategories: [
        { id: 'payment_processed', name: 'Payment Processed', enabled: true },
        { id: 'payment_failed', name: 'Payment Failed', enabled: true },
        { id: 'security_alerts', name: 'Security Alerts', enabled: true },
        { id: 'login_attempts', name: 'Login Attempts', enabled: false }
      ]
    }
  ]);

  useEffect(() => {
    // Check current notification permission
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        setPermission(permission);
        
        if (permission === 'granted') {
          toast({
            title: "Notifications Enabled",
            description: "You'll now receive push notifications from SPIRAL",
          });
          
          // Send test notification
          new Notification("SPIRAL Notifications", {
            body: "Push notifications are now enabled!",
            icon: "/favicon.ico"
          });
        } else {
          toast({
            title: "Notifications Denied",
            description: "You can enable notifications in your browser settings",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error requesting notification permission:', error);
      }
    }
  };

  const toggleCategory = (categoryId: string) => {
    setCategories(prev => 
      prev.map(cat => 
        cat.id === categoryId 
          ? { ...cat, enabled: !cat.enabled }
          : cat
      )
    );
    
    toast({
      title: "Settings Updated",
      description: "Notification preferences have been saved",
    });
  };

  const toggleSubcategory = (categoryId: string, subcategoryId: string) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              subcategories: cat.subcategories.map(sub =>
                sub.id === subcategoryId
                  ? { ...sub, enabled: !sub.enabled }
                  : sub
              )
            }
          : cat
      )
    );
  };

  const updateFrequency = (categoryId: string, frequency: 'instant' | 'daily' | 'weekly') => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId
          ? { ...cat, frequency }
          : cat
      )
    );
  };

  const testNotification = (categoryName: string) => {
    if (permission === 'granted') {
      new Notification(`Test: ${categoryName}`, {
        body: `This is a test notification for ${categoryName.toLowerCase()}`,
        icon: "/favicon.ico"
      });
      
      toast({
        title: "Test Notification Sent",
        description: `Check your browser for the ${categoryName} test notification`,
      });
    } else {
      toast({
        title: "Permission Required",
        description: "Please enable notifications first",
        variant: "destructive"
      });
    }
  };

  const getPermissionBadge = () => {
    switch (permission) {
      case 'granted':
        return <Badge className="bg-green-100 text-green-800">Enabled</Badge>;
      case 'denied':
        return <Badge className="bg-red-100 text-red-800">Blocked</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Not Set</Badge>;
    }
  };

  const enabledCount = categories.filter(cat => cat.enabled).length;
  const totalSubcategoriesEnabled = categories.reduce((total, cat) => 
    total + cat.subcategories.filter(sub => sub.enabled).length, 0
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--spiral-navy)] mb-2">
            Push Notification Settings
          </h1>
          <p className="text-gray-600">
            Customize your notification preferences for the best SPIRAL experience
          </p>
        </div>

        {/* Permission Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Status
              </div>
              {getPermissionBadge()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Browser Notifications</h3>
                <p className="text-sm text-gray-600">
                  Allow SPIRAL to send push notifications to your device
                </p>
              </div>
              <div className="flex items-center space-x-3">
                {permission !== 'granted' && (
                  <Button onClick={requestPermission}>
                    Enable Notifications
                  </Button>
                )}
                {permission === 'granted' && (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                )}
              </div>
            </div>

            {permission === 'denied' && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Notifications are blocked. To enable them, click the lock icon in your browser's address bar and allow notifications for this site.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Master Toggle */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">All Notifications</h3>
                <p className="text-sm text-gray-600">
                  Master switch for all SPIRAL notifications
                </p>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Categories */}
        <div className="space-y-6">
          {categories.map((category) => (
            <Card key={category.id} className={!notificationsEnabled ? 'opacity-50' : ''}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    {category.icon}
                    <span className="ml-3">{category.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      onClick={() => testNotification(category.name)}
                      size="sm"
                      variant="outline"
                      disabled={!category.enabled || !notificationsEnabled || permission !== 'granted'}
                    >
                      Test
                    </Button>
                    <Switch
                      checked={category.enabled && notificationsEnabled}
                      onCheckedChange={() => toggleCategory(category.id)}
                      disabled={!notificationsEnabled}
                    />
                  </div>
                </CardTitle>
                <p className="text-sm text-gray-600">{category.description}</p>
              </CardHeader>
              
              {category.enabled && notificationsEnabled && (
                <CardContent>
                  <div className="space-y-4">
                    {/* Frequency Setting */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">Frequency</span>
                      </div>
                      <select
                        value={category.frequency}
                        onChange={(e) => updateFrequency(category.id, e.target.value as any)}
                        className="text-sm border rounded px-2 py-1"
                      >
                        <option value="instant">Instant</option>
                        <option value="daily">Daily Digest</option>
                        <option value="weekly">Weekly Summary</option>
                      </select>
                    </div>

                    {/* Subcategories */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {category.subcategories.map((sub) => (
                        <div key={sub.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="text-sm">{sub.name}</span>
                          <Switch
                            checked={sub.enabled}
                            onCheckedChange={() => toggleSubcategory(category.id, sub.id)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Summary */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Notification Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{enabledCount}</div>
                <div className="text-sm text-gray-600">Categories Active</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{totalSubcategoriesEnabled}</div>
                <div className="text-sm text-gray-600">Alert Types On</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {categories.filter(c => c.frequency === 'instant').length}
                </div>
                <div className="text-sm text-gray-600">Instant Alerts</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {permission === 'granted' ? 'Ready' : 'Setup Needed'}
                </div>
                <div className="text-sm text-gray-600">System Status</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}