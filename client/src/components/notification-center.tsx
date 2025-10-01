import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Package, 
  ShoppingCart, 
  Star, 
  AlertCircle,
  CheckCircle,
  Clock,
  Truck
} from 'lucide-react';

interface NotificationPreferences {
  email: {
    orderConfirmation: boolean;
    shipmentUpdates: boolean;
    deliveryNotifications: boolean;
    inventoryAlerts: boolean;
    spiralRewards: boolean;
    promotions: boolean;
  };
  sms: {
    orderConfirmation: boolean;
    shipmentUpdates: boolean;
    deliveryNotifications: boolean;
    urgentAlerts: boolean;
  };
  push: {
    orderUpdates: boolean;
    inventoryAlerts: boolean;
    spiralRewards: boolean;
    promotions: boolean;
  };
  frequency: 'immediate' | 'daily' | 'weekly';
}

interface Notification {
  id: string;
  type: 'order' | 'shipment' | 'delivery' | 'inventory' | 'spiral' | 'promotion';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionRequired?: boolean;
  actionLink?: string;
}

export default function NotificationCenter() {
  const { toast } = useToast();
  
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email: {
      orderConfirmation: true,
      shipmentUpdates: true,
      deliveryNotifications: true,
      inventoryAlerts: false,
      spiralRewards: true,
      promotions: false,
    },
    sms: {
      orderConfirmation: true,
      shipmentUpdates: true,
      deliveryNotifications: true,
      urgentAlerts: true,
    },
    push: {
      orderUpdates: true,
      inventoryAlerts: true,
      spiralRewards: true,
      promotions: false,
    },
    frequency: 'immediate'
  });

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'order',
      title: 'Order Confirmed',
      message: 'Your order #SPIRAL-1753150001 has been confirmed and is being prepared for shipment.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: false,
      actionRequired: false,
      actionLink: '/orders/SPIRAL-1753150001'
    },
    {
      id: '2',
      type: 'shipment',
      title: 'Package Shipped',
      message: 'Your package has shipped! Track your order with tracking number 1Z999AA1234567890.',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      read: false,
      actionRequired: false,
      actionLink: '/tracking/1Z999AA1234567890'
    },
    {
      id: '3',
      type: 'inventory',
      title: 'Back in Stock',
      message: 'Artisan Coffee Blend is now available! The item you wishlisted is ready to order.',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      read: true,
      actionRequired: true,
      actionLink: '/product/1'
    },
    {
      id: '4',
      type: 'spiral',
      title: 'SPIRAL Points Earned',
      message: 'You earned 25 SPIRAL points from your recent purchase! Current balance: 156 points.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      read: true,
      actionRequired: false,
      actionLink: '/spirals'
    },
    {
      id: '5',
      type: 'delivery',
      title: 'Out for Delivery',
      message: 'Your package is out for delivery and will arrive today between 2-6 PM.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      read: false,
      actionRequired: false,
      actionLink: '/tracking/1Z999AA1234567890'
    }
  ]);

  const updatePreference = (category: keyof NotificationPreferences, setting: string, value: boolean | string) => {
    setPreferences(prev => ({
      ...prev,
      [category]: typeof prev[category] === 'object' 
        ? { ...prev[category], [setting]: value }
        : value
    }));
    
    toast({
      title: "Preferences updated",
      description: "Your notification settings have been saved.",
    });
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    toast({
      title: "All notifications marked as read",
      description: "Your notification list has been cleared.",
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order': return ShoppingCart;
      case 'shipment': return Package;
      case 'delivery': return Truck;
      case 'inventory': return AlertCircle;
      case 'spiral': return Star;
      case 'promotion': return Bell;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'order': return 'text-blue-600';
      case 'shipment': return 'text-purple-600';
      case 'delivery': return 'text-green-600';
      case 'inventory': return 'text-orange-600';
      case 'spiral': return 'text-[var(--spiral-coral)]';
      case 'promotion': return 'text-pink-600';
      default: return 'text-gray-600';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Notification Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-[var(--spiral-coral)]" />
            Notification Center
            {unreadCount > 0 && (
              <Badge className="bg-[var(--spiral-coral)] text-white">
                {unreadCount} new
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Manage your notifications and communication preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          {unreadCount > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={markAllAsRead}
              className="mb-4"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark all as read
            </Button>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Notifications */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[var(--spiral-navy)]">Recent Notifications</h3>
          
          {notifications.map((notification) => {
            const IconComponent = getNotificationIcon(notification.type);
            
            return (
              <Card 
                key={notification.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  !notification.read ? 'border-l-4 border-l-[var(--spiral-coral)] bg-blue-50' : ''
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <IconComponent className={`h-5 w-5 mt-0.5 ${getNotificationColor(notification.type)}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-medium ${!notification.read ? 'text-[var(--spiral-navy)]' : 'text-gray-800'}`}>
                          {notification.title}
                        </h4>
                        {notification.actionRequired && (
                          <Badge variant="outline" className="text-xs">
                            Action Required
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          <Clock className="inline h-3 w-3 mr-1" />
                          {formatTimestamp(notification.timestamp)}
                        </span>
                        {notification.actionLink && (
                          <Button variant="link" size="sm" className="h-auto p-0 text-[var(--spiral-coral)]">
                            View Details →
                          </Button>
                        )}
                      </div>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-[var(--spiral-coral)] rounded-full flex-shrink-0"></div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Notification Preferences */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[var(--spiral-navy)]">Notification Preferences</h3>
          
          {/* Email Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Mail className="h-4 w-4 text-blue-600" />
                Email Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(preferences.email).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <Label htmlFor={`email-${key}`} className="text-sm capitalize">
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </Label>
                  <Switch
                    id={`email-${key}`}
                    checked={value}
                    onCheckedChange={(checked) => updatePreference('email', key, checked)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* SMS Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageSquare className="h-4 w-4 text-green-600" />
                SMS Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(preferences.sms).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <Label htmlFor={`sms-${key}`} className="text-sm capitalize">
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </Label>
                  <Switch
                    id={`sms-${key}`}
                    checked={value}
                    onCheckedChange={(checked) => updatePreference('sms', key, checked)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Push Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="h-4 w-4 text-purple-600" />
                Push Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(preferences.push).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <Label htmlFor={`push-${key}`} className="text-sm capitalize">
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </Label>
                  <Switch
                    id={`push-${key}`}
                    checked={value}
                    onCheckedChange={(checked) => updatePreference('push', key, checked)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Frequency Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notification Frequency</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={preferences.frequency} onValueChange={(value) => updatePreference('frequency', '', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="daily">Daily Digest</SelectItem>
                  <SelectItem value="weekly">Weekly Summary</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-2">
                Choose how often you receive non-urgent notifications
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}