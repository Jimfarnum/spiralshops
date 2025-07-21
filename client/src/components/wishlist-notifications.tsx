import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  CheckCircle
} from 'lucide-react';

interface WishlistItem {
  id: string;
  productId: string;
  productName: string;
  currentPrice: number;
  originalPrice: number;
  imageUrl: string;
  storeId: string;
  storeName: string;
  isInStock: boolean;
  lastChecked: string;
}

interface NotificationSettings {
  productId: string;
  backInStockEnabled: boolean;
  priceDropEnabled: boolean;
  targetPrice?: number;
}

export default function WishlistNotifications() {
  const { toast } = useToast();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([
    {
      id: '1',
      productId: 'prod-123',
      productName: 'Artisan Leather Wallet',
      currentPrice: 89.99,
      originalPrice: 89.99,
      imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop',
      storeId: 'store-1',
      storeName: 'Local Artisan Goods',
      isInStock: true,
      lastChecked: '2025-01-21T10:30:00Z'
    },
    {
      id: '2',
      productId: 'prod-456',
      productName: 'Organic Coffee Blend',
      currentPrice: 24.99,
      originalPrice: 29.99,
      imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop',
      storeId: 'store-2',
      storeName: 'Heritage Roasters',
      isInStock: false,
      lastChecked: '2025-01-21T09:15:00Z'
    },
    {
      id: '3',
      productId: 'prod-789',
      productName: 'Hand-Painted Ceramic Mug',
      currentPrice: 32.00,
      originalPrice: 40.00,
      imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&h=200&fit=crop',
      storeId: 'store-3',
      storeName: 'Clay & Co Pottery',
      isInStock: true,
      lastChecked: '2025-01-21T11:45:00Z'
    }
  ]);

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings[]>([
    { productId: 'prod-123', backInStockEnabled: true, priceDropEnabled: true, targetPrice: 75 },
    { productId: 'prod-456', backInStockEnabled: true, priceDropEnabled: false },
    { productId: 'prod-789', backInStockEnabled: false, priceDropEnabled: true, targetPrice: 25 }
  ]);

  const [recentNotifications, setRecentNotifications] = useState([
    {
      id: '1',
      type: 'price_drop',
      productName: 'Hand-Painted Ceramic Mug',
      message: 'Price dropped from $40.00 to $32.00',
      timestamp: '2025-01-21T08:30:00Z',
      isRead: false
    },
    {
      id: '2', 
      type: 'back_in_stock',
      productName: 'Organic Coffee Blend',
      message: 'Back in stock at Heritage Roasters',
      timestamp: '2025-01-20T14:20:00Z',
      isRead: true
    }
  ]);

  const getSettings = (productId: string): NotificationSettings => {
    return notificationSettings.find(s => s.productId === productId) || {
      productId,
      backInStockEnabled: false,
      priceDropEnabled: false
    };
  };

  const updateSettings = (productId: string, updates: Partial<NotificationSettings>) => {
    setNotificationSettings(prev => {
      const existing = prev.find(s => s.productId === productId);
      if (existing) {
        return prev.map(s => s.productId === productId ? { ...s, ...updates } : s);
      } else {
        return [...prev, { productId, backInStockEnabled: false, priceDropEnabled: false, ...updates }];
      }
    });

    toast({
      title: 'Notification settings updated',
      description: 'You\'ll be notified when your preferences are met',
      duration: 3000,
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistItems(prev => prev.filter(item => item.productId !== productId));
    setNotificationSettings(prev => prev.filter(s => s.productId !== productId));
    
    toast({
      title: 'Removed from wishlist',
      description: 'Item and notifications have been removed',
      duration: 3000,
    });
  };

  const markNotificationRead = (notificationId: string) => {
    setRecentNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
  };

  const formatLastChecked = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes} minutes ago`;
    } else if (diffMinutes < 1440) {
      return `${Math.floor(diffMinutes / 60)} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const formatTimestamp = (timestamp: string): string => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const unreadCount = recentNotifications.filter(n => !n.isRead).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--spiral-navy)]">Wishlist Notifications</h1>
          <p className="text-gray-600">Get notified when items are back in stock or prices drop</p>
        </div>
        <Badge className="bg-[var(--spiral-coral)] text-white px-3 py-1">
          <Bell className="h-4 w-4 mr-1" />
          {unreadCount} new
        </Badge>
      </div>

      <Tabs defaultValue="wishlist" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="wishlist">
            Wishlist Items ({wishlistItems.length})
          </TabsTrigger>
          <TabsTrigger value="notifications">
            Recent Notifications ({recentNotifications.length})
          </TabsTrigger>
        </TabsList>

        {/* Wishlist Items Tab */}
        <TabsContent value="wishlist" className="mt-6">
          <div className="space-y-4">
            {wishlistItems.map(item => {
              const settings = getSettings(item.productId);
              const hasDiscount = item.currentPrice < item.originalPrice;
              
              return (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img 
                          src={item.imageUrl} 
                          alt={item.productName}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-[var(--spiral-navy)]">
                              {item.productName}
                            </h3>
                            <p className="text-sm text-gray-600">{item.storeName}</p>
                          </div>
                          <Button
                            onClick={() => removeFromWishlist(item.productId)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Price and Stock Status */}
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-[var(--spiral-navy)]">
                              ${item.currentPrice}
                            </span>
                            {hasDiscount && (
                              <span className="text-sm text-gray-500 line-through">
                                ${item.originalPrice}
                              </span>
                            )}
                            {hasDiscount && (
                              <Badge className="bg-green-100 text-green-800">
                                <TrendingDown className="h-3 w-3 mr-1" />
                                Price Drop
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            {item.isInStock ? (
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                In Stock
                              </Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-800">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Out of Stock
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Notification Settings */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-gray-600" />
                              <span className="text-sm font-medium">Back in Stock Alerts</span>
                            </div>
                            <Switch
                              checked={settings.backInStockEnabled}
                              onCheckedChange={(checked) => 
                                updateSettings(item.productId, { backInStockEnabled: checked })
                              }
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <TrendingDown className="h-4 w-4 text-gray-600" />
                              <span className="text-sm font-medium">Price Drop Alerts</span>
                            </div>
                            <Switch
                              checked={settings.priceDropEnabled}
                              onCheckedChange={(checked) => 
                                updateSettings(item.productId, { priceDropEnabled: checked })
                              }
                            />
                          </div>

                          {settings.priceDropEnabled && (
                            <div className="md:col-span-2">
                              <div className="flex items-center gap-2 mb-2">
                                <DollarSign className="h-4 w-4 text-gray-600" />
                                <span className="text-sm font-medium">Target Price</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm">$</span>
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={settings.targetPrice || ''}
                                  onChange={(e) => 
                                    updateSettings(item.productId, { 
                                      targetPrice: parseFloat(e.target.value) || undefined 
                                    })
                                  }
                                  className="w-24"
                                  placeholder="0.00"
                                />
                                <span className="text-sm text-gray-600">
                                  (Current: ${item.currentPrice})
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Last Checked */}
                        <div className="flex items-center gap-1 mt-3 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>Last checked {formatLastChecked(item.lastChecked)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {wishlistItems.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No Wishlist Items</h3>
                  <p className="text-gray-500">Start adding items to your wishlist to get notifications!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-6">
          <div className="space-y-4">
            {recentNotifications.map(notification => (
              <Card 
                key={notification.id}
                className={`cursor-pointer transition-colors ${
                  !notification.isRead ? 'bg-blue-50 border-blue-200' : ''
                }`}
                onClick={() => markNotificationRead(notification.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <div className={`p-2 rounded-full ${
                        notification.type === 'price_drop' 
                          ? 'bg-green-100 text-green-600'
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        {notification.type === 'price_drop' ? (
                          <TrendingDown className="h-4 w-4" />
                        ) : (
                          <Package className="h-4 w-4" />
                        )}
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-[var(--spiral-navy)]">
                          {notification.productName}
                        </h4>
                        <p className="text-sm text-gray-600">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatTimestamp(notification.timestamp)}
                        </p>
                      </div>
                    </div>

                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {recentNotifications.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No Notifications</h3>
                  <p className="text-gray-500">Enable notifications on your wishlist items to get started!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Global Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-[var(--spiral-coral)]" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Configure how you receive wishlist notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Email Notifications</h4>
                <p className="text-sm text-gray-600">Receive notifications via email</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Push Notifications</h4>
                <p className="text-sm text-gray-600">Receive browser push notifications</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Daily Summary</h4>
                <p className="text-sm text-gray-600">Get a daily summary of price changes</p>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}