import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, BellOff, CheckCircle, AlertTriangle, Info, Settings, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import SEOHead from "@/components/SEOHead";

interface Alert {
  id: string;
  type: 'wishlist' | 'inventory' | 'price' | 'promo' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
  actionUrl?: string;
}

interface AlertSettings {
  wishlistAlerts: boolean;
  inventoryAlerts: boolean;
  priceDropAlerts: boolean;
  promoAlerts: boolean;
  systemAlerts: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

const AlertIcon = ({ type, priority }: { type: string; priority: string }) => {
  if (priority === 'high') return <AlertTriangle className="h-5 w-5 text-red-500" />;
  if (type === 'system') return <Info className="h-5 w-5 text-blue-500" />;
  return <Bell className="h-5 w-5 text-orange-500" />;
};

export default function AlertsPage() {
  const [activeTab, setActiveTab] = useState("alerts");
  const queryClient = useQueryClient();

  // Fetch alerts
  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ['/api/alerts'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/alerts');
        if (!response.ok) {
          // Return demo data if API not available
          return [
            {
              id: '1',
              type: 'wishlist',
              title: 'Item Back in Stock',
              message: 'Wireless Bluetooth Headphones are now available at Tech Haven',
              timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
              read: false,
              priority: 'high',
              actionUrl: '/products/1'
            },
            {
              id: '2',
              type: 'price',
              title: 'Price Drop Alert',
              message: 'The item in your wishlist dropped by 15%',
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
              read: false,
              priority: 'medium'
            },
            {
              id: '3',
              type: 'promo',
              title: 'Special Promotion',
              message: 'Local Electronics Store is offering 20% off all accessories',
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
              read: true,
              priority: 'low'
            }
          ];
        }
        return response.json();
      } catch {
        return [];
      }
    }
  });

  // Fetch alert settings
  const { data: settings = {
    wishlistAlerts: true,
    inventoryAlerts: true,
    priceDropAlerts: true,
    promoAlerts: true,
    systemAlerts: true,
    emailNotifications: true,
    pushNotifications: false
  } } = useQuery({
    queryKey: ['/api/alerts/settings'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/alerts/settings');
        if (!response.ok) throw new Error('Settings not available');
        return response.json();
      } catch {
        return {
          wishlistAlerts: true,
          inventoryAlerts: true,
          priceDropAlerts: true,
          promoAlerts: true,
          systemAlerts: true,
          emailNotifications: true,
          pushNotifications: false
        };
      }
    }
  });

  // Mark alert as read
  const markAsReadMutation = useMutation({
    mutationFn: (alertId: string) => apiRequest('POST', `/api/alerts/${alertId}/read`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
    }
  });

  // Update settings
  const updateSettingsMutation = useMutation({
    mutationFn: (newSettings: AlertSettings) => 
      apiRequest('POST', '/api/alerts/settings', newSettings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/alerts/settings'] });
    }
  });

  const unreadCount = alerts.filter((alert: Alert) => !alert.read).length;

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return `${minutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const updateSetting = (key: keyof AlertSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    updateSettingsMutation.mutate(newSettings);
  };

  return (
    <>
      <SEOHead 
        title="Alerts & Notifications - SPIRAL"
        description="Manage your SPIRAL alerts and notification preferences"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[var(--spiral-navy)]">
                Alerts & Notifications
              </h1>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-600">
                  You have {unreadCount} unread alert{unreadCount > 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="alerts" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Alerts
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-1 px-1.5 py-0.5 text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Alerts Tab */}
            <TabsContent value="alerts" className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--spiral-navy)] mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading alerts...</p>
                </div>
              ) : alerts.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <BellOff className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No alerts yet
                    </h3>
                    <p className="text-gray-600">
                      We'll notify you about wishlist items, price drops, and promotions
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {alerts.map((alert: Alert) => (
                    <Card 
                      key={alert.id} 
                      className={`transition-colors ${!alert.read ? 'bg-blue-50 border-blue-200' : ''}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <AlertIcon type={alert.type} priority={alert.priority} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900 truncate">
                                {alert.title}
                              </h3>
                              <Badge 
                                variant={alert.priority === 'high' ? 'destructive' : 
                                       alert.priority === 'medium' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {alert.priority}
                              </Badge>
                              {!alert.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {alert.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">
                                {formatTimestamp(alert.timestamp)}
                              </span>
                              <div className="flex gap-2">
                                {alert.actionUrl && (
                                  <Link href={alert.actionUrl}>
                                    <Button size="sm" variant="outline">
                                      View
                                    </Button>
                                  </Link>
                                )}
                                {!alert.read && (
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={() => markAsReadMutation.mutate(alert.id)}
                                    disabled={markAsReadMutation.isPending}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Mark as read
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Alert Preferences</CardTitle>
                  <CardDescription>
                    Choose which types of alerts you'd like to receive
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="wishlist-alerts">Wishlist Alerts</Label>
                      <p className="text-sm text-gray-600">
                        Get notified when wishlist items are back in stock
                      </p>
                    </div>
                    <Switch 
                      id="wishlist-alerts"
                      checked={settings.wishlistAlerts}
                      onCheckedChange={(checked) => updateSetting('wishlistAlerts', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="inventory-alerts">Inventory Alerts</Label>
                      <p className="text-sm text-gray-600">
                        Notifications about low stock and restocks
                      </p>
                    </div>
                    <Switch 
                      id="inventory-alerts"
                      checked={settings.inventoryAlerts}
                      onCheckedChange={(checked) => updateSetting('inventoryAlerts', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="price-alerts">Price Drop Alerts</Label>
                      <p className="text-sm text-gray-600">
                        Get notified when items go on sale
                      </p>
                    </div>
                    <Switch 
                      id="price-alerts"
                      checked={settings.priceDropAlerts}
                      onCheckedChange={(checked) => updateSetting('priceDropAlerts', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="promo-alerts">Promotional Alerts</Label>
                      <p className="text-sm text-gray-600">
                        Special offers and store promotions
                      </p>
                    </div>
                    <Switch 
                      id="promo-alerts"
                      checked={settings.promoAlerts}
                      onCheckedChange={(checked) => updateSetting('promoAlerts', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="system-alerts">System Alerts</Label>
                      <p className="text-sm text-gray-600">
                        Important platform updates and maintenance
                      </p>
                    </div>
                    <Switch 
                      id="system-alerts"
                      checked={settings.systemAlerts}
                      onCheckedChange={(checked) => updateSetting('systemAlerts', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Delivery Methods</CardTitle>
                  <CardDescription>
                    How would you like to receive notifications?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-gray-600">
                        Receive alerts via email
                      </p>
                    </div>
                    <Switch 
                      id="email-notifications"
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-gray-600">
                        Instant browser notifications
                      </p>
                    </div>
                    <Switch 
                      id="push-notifications"
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              {updateSettingsMutation.isPending && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--spiral-navy)] mx-auto"></div>
                  <p className="text-sm text-gray-600 mt-2">Saving settings...</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}