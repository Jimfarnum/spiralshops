import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  Heart, 
  HeartOff, 
  TrendingDown, 
  Package, 
  Bell, 
  BellOff,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Star 
} from 'lucide-react';

interface WishlistItem {
  id: number;
  shopperId: string;
  productId: string;
  addedAt: string;
  alertPreferences: {
    priceDrop: boolean;
    restock: boolean;
  };
  lastPrice: number;
  isActive: boolean;
  product: {
    name: string;
    price: number;
    inStock: boolean;
  };
}

interface PriceAlert {
  id: number;
  productId: string;
  alertType: 'price_drop' | 'restock' | 'price_increase';
  originalPrice: number;
  currentPrice: number;
  percentageChange?: number;
  createdAt: string;
  product: {
    name: string;
  };
}

const WishlistAlerts = () => {
  const [selectedShopperId] = useState('shopper_123'); // Mock shopper ID
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch wishlist items
  const { data: wishlistData, isLoading: loadingWishlist } = useQuery({
    queryKey: ['wishlist', selectedShopperId],
    queryFn: () => fetch(`/api/wishlist/${selectedShopperId}`).then(res => res.json()),
  });

  // Fetch pending alerts
  const { data: alertsData, isLoading: loadingAlerts } = useQuery({
    queryKey: ['alerts', selectedShopperId],
    queryFn: () => fetch(`/api/alerts/${selectedShopperId}`).then(res => res.json()),
  });

  // Fetch current product prices
  const { data: pricesData } = useQuery({
    queryKey: ['product-prices'],
    queryFn: () => fetch('/api/products/prices').then(res => res.json()),
  });

  // Add to wishlist mutation
  const addToWishlistMutation = useMutation({
    mutationFn: (productData: { productId: string; alertPreferences: any }) =>
      apiRequest('POST', '/api/wishlist/add', {
        shopperId: selectedShopperId,
        ...productData,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast({
        title: "Added to Wishlist",
        description: "Product added with alert preferences",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add to wishlist",
        variant: "destructive",
      });
    },
  });

  // Update alert preferences mutation
  const updateAlertsMutation = useMutation({
    mutationFn: ({ itemId, alertPreferences }: { itemId: number; alertPreferences: any }) =>
      apiRequest('PUT', `/api/wishlist/${itemId}/alerts`, { alertPreferences }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast({
        title: "Alert Preferences Updated",
        description: "Your notification settings have been saved",
      });
    },
  });

  // Remove from wishlist mutation
  const removeFromWishlistMutation = useMutation({
    mutationFn: (itemId: number) =>
      apiRequest('DELETE', `/api/wishlist/${itemId}`, { shopperId: selectedShopperId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast({
        title: "Removed from Wishlist",
        description: "Product removed from your wishlist",
      });
    },
  });

  // Simulate price change for demo
  const simulatePriceChangeMutation = useMutation({
    mutationFn: (data: { productId: string; newPrice: number; inStock?: boolean }) =>
      apiRequest('POST', '/api/products/simulate-price-change', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      queryClient.invalidateQueries({ queryKey: ['product-prices'] });
      toast({
        title: "Price Update Simulated",
        description: "Check your alerts for notifications",
      });
    },
  });

  // Mark alerts as sent
  const markAlertsSentMutation = useMutation({
    mutationFn: (alertIds: number[]) =>
      apiRequest('POST', '/api/alerts/mark-sent', { alertIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });

  const handleAddSampleProduct = () => {
    addToWishlistMutation.mutate({
      productId: 'prod_1',
      alertPreferences: { priceDrop: true, restock: true }
    });
  };

  const handleAlertPreferenceChange = (itemId: number, preference: string, value: boolean) => {
    const item = wishlistData?.wishlistItems?.find((item: WishlistItem) => item.id === itemId);
    if (item) {
      updateAlertsMutation.mutate({
        itemId,
        alertPreferences: {
          ...item.alertPreferences,
          [preference]: value
        }
      });
    }
  };

  const handleSimulatePriceDrop = (productId: string, currentPrice: number) => {
    const newPrice = currentPrice * 0.8; // 20% discount
    simulatePriceChangeMutation.mutate({ productId, newPrice });
  };

  const handleSimulateRestock = (productId: string) => {
    simulatePriceChangeMutation.mutate({ productId, newPrice: 0, inStock: true });
  };

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

  if (loadingWishlist || loadingAlerts) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          SPIRAL Wishlist & Price Alerts
        </h1>
        <p className="text-gray-600">
          Track your favorite products and get notified of price drops and restocks
        </p>
      </div>

      {/* Demo Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Demo Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleAddSampleProduct}
            disabled={addToWishlistMutation.isPending}
            className="w-full sm:w-auto"
          >
            Add Sample Product to Wishlist
          </Button>
          
          {pricesData?.products && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(pricesData.products).map(([productId, product]: [string, any]) => (
                <div key={productId} className="p-3 border rounded-lg space-y-2">
                  <h4 className="font-medium">{product.name}</h4>
                  <p className="text-sm text-gray-600">{formatPrice(product.price)}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSimulatePriceDrop(productId, product.price)}
                      disabled={simulatePriceChangeMutation.isPending}
                    >
                      <TrendingDown className="h-4 w-4 mr-1" />
                      Price Drop
                    </Button>
                    {!product.inStock && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSimulateRestock(productId)}
                        disabled={simulatePriceChangeMutation.isPending}
                      >
                        <Package className="h-4 w-4 mr-1" />
                        Restock
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending Alerts */}
      {alertsData?.pendingAlerts?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-500" />
              Pending Alerts ({alertsData.pendingAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {alertsData.pendingAlerts.map((alert: PriceAlert) => (
              <div key={alert.id} className="p-4 border rounded-lg bg-orange-50">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {alert.alertType === 'price_drop' ? (
                        <TrendingDown className="h-5 w-5 text-green-600" />
                      ) : alert.alertType === 'restock' ? (
                        <Package className="h-5 w-5 text-blue-600" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      )}
                      <Badge variant={alert.alertType === 'price_drop' ? 'default' : 'secondary'}>
                        {alert.alertType === 'price_drop' ? 'Price Drop' : 
                         alert.alertType === 'restock' ? 'Back in Stock' : 'Price Change'}
                      </Badge>
                    </div>
                    <h4 className="font-medium">{alert.product.name}</h4>
                    {alert.alertType === 'price_drop' && (
                      <div className="flex items-center gap-4 text-sm">
                        <span className="line-through text-gray-500">
                          {formatPrice(alert.originalPrice)}
                        </span>
                        <span className="text-green-600 font-semibold">
                          {formatPrice(alert.currentPrice)}
                        </span>
                        {alert.percentageChange && (
                          <Badge variant="outline" className="text-green-600">
                            -{alert.percentageChange}%
                          </Badge>
                        )}
                      </div>
                    )}
                    <p className="text-xs text-gray-500">
                      {formatDate(alert.createdAt)}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => markAlertsSentMutation.mutate([alert.id])}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Mark as Read
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Wishlist Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            My Wishlist ({wishlistData?.wishlistItems?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {wishlistData?.wishlistItems?.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Your wishlist is empty</p>
              <p className="text-sm">Add products to track price drops and restocks</p>
            </div>
          ) : (
            <div className="space-y-4">
              {wishlistData?.wishlistItems?.map((item: WishlistItem) => (
                <div key={item.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium">{item.product.name}</h4>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="text-lg font-semibold">
                          {formatPrice(item.product.price)}
                        </span>
                        <Badge variant={item.product.inStock ? 'default' : 'secondary'}>
                          {item.product.inStock ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">
                        Added {formatDate(item.addedAt)}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeFromWishlistMutation.mutate(item.id)}
                      disabled={removeFromWishlistMutation.isPending}
                    >
                      <HeartOff className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <h5 className="text-sm font-medium text-gray-700">Alert Preferences</h5>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingDown className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Price drop notifications</span>
                        </div>
                        <Switch
                          checked={item.alertPreferences.priceDrop}
                          onCheckedChange={(checked) => 
                            handleAlertPreferenceChange(item.id, 'priceDrop', checked)
                          }
                          disabled={updateAlertsMutation.isPending}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-blue-600" />
                          <span className="text-sm">Restock notifications</span>
                        </div>
                        <Switch
                          checked={item.alertPreferences.restock}
                          onCheckedChange={(checked) => 
                            handleAlertPreferenceChange(item.id, 'restock', checked)
                          }
                          disabled={updateAlertsMutation.isPending}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WishlistAlerts;