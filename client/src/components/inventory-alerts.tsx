import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Bell, AlertTriangle, CheckCircle, Clock, Package, TrendingDown, TrendingUp } from 'lucide-react';

interface InventoryItem {
  id: number;
  productId: number;
  name: string;
  store: string;
  currentStock: number;
  lowStockThreshold: number;
  image: string;
  price: number;
  category: string;
  lastUpdated: string;
  trend: 'increasing' | 'decreasing' | 'stable';
  alertsEnabled: boolean;
}

interface InventoryAlertsProps {
  userId?: number;
  className?: string;
}

// Mock inventory data - in production this would come from real-time API
const mockInventoryItems: InventoryItem[] = [
  {
    id: 1,
    productId: 1,
    name: "Artisan Coffee Blend",
    store: "Local Roasters",
    currentStock: 3,
    lowStockThreshold: 5,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
    price: 24.99,
    category: "food",
    lastUpdated: "2025-01-21T08:30:00Z",
    trend: 'decreasing',
    alertsEnabled: true
  },
  {
    id: 2,
    productId: 4,
    name: "Vintage Leather Jacket",
    store: "Vintage Threads",
    currentStock: 1,
    lowStockThreshold: 3,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
    price: 89.99,
    category: "clothing",
    lastUpdated: "2025-01-21T09:15:00Z",
    trend: 'decreasing',
    alertsEnabled: true
  },
  {
    id: 3,
    productId: 7,
    name: "Tech Startup Hoodie",
    store: "Silicon Style",
    currentStock: 0,
    lowStockThreshold: 2,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
    price: 65.00,
    category: "clothing",
    lastUpdated: "2025-01-21T07:45:00Z",
    trend: 'stable',
    alertsEnabled: false
  },
  {
    id: 4,
    productId: 12,
    name: "Organic Honey",
    store: "Nature's Best",
    currentStock: 15,
    lowStockThreshold: 10,
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
    price: 18.50,
    category: "food",
    lastUpdated: "2025-01-21T10:00:00Z",
    trend: 'increasing',
    alertsEnabled: true
  }
];

export default function InventoryAlerts({ userId, className = '' }: InventoryAlertsProps) {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(mockInventoryItems);
  const [notifications, setNotifications] = useState<string[]>([]);
  const { toast } = useToast();

  // Simulate real-time inventory updates
  useEffect(() => {
    const interval = setInterval(() => {
      setInventoryItems(prevItems => 
        prevItems.map(item => {
          // Simulate stock changes
          const changeChance = Math.random();
          if (changeChance < 0.1) { // 10% chance of stock change
            const stockChange = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
            const newStock = Math.max(0, item.currentStock + stockChange);
            
            // Check if this triggers a low stock alert
            if (item.alertsEnabled && newStock <= item.lowStockThreshold && item.currentStock > item.lowStockThreshold) {
              const alertMessage = `Low stock alert: ${item.name} at ${item.store} now has only ${newStock} items left!`;
              setNotifications(prev => [...prev, alertMessage]);
              
              toast({
                title: "Low Stock Alert",
                description: alertMessage,
                variant: "destructive",
                duration: 5000
              });
            }
            
            return {
              ...item,
              currentStock: newStock,
              lastUpdated: new Date().toISOString(),
              trend: stockChange > 0 ? 'increasing' as const : stockChange < 0 ? 'decreasing' as const : 'stable' as const
            };
          }
          return item;
        })
      );
    }, 10000); // Update every 10 seconds for demo purposes

    return () => clearInterval(interval);
  }, [toast]);

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock === 0) {
      return { status: 'out-of-stock', label: 'Out of Stock', color: 'bg-red-100 text-red-800 border-red-200' };
    } else if (item.currentStock <= item.lowStockThreshold) {
      return { status: 'low-stock', label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    } else {
      return { status: 'in-stock', label: 'In Stock', color: 'bg-green-100 text-green-800 border-green-200' };
    }
  };

  const getTrendIcon = (trend: InventoryItem['trend']) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'decreasing':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const toggleAlerts = (itemId: number) => {
    setInventoryItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, alertsEnabled: !item.alertsEnabled } : item
      )
    );
    
    toast({
      title: "Alert Settings Updated",
      description: "Your inventory alert preferences have been saved.",
      duration: 2000
    });
  };

  const dismissNotification = (index: number) => {
    setNotifications(prev => prev.filter((_, i) => i !== index));
  };

  const criticalItems = inventoryItems.filter(item => 
    item.currentStock === 0 || (item.currentStock <= item.lowStockThreshold && item.alertsEnabled)
  );

  const lowStockItems = inventoryItems.filter(item => 
    item.currentStock > 0 && item.currentStock <= item.lowStockThreshold
  );

  const inStockItems = inventoryItems.filter(item => 
    item.currentStock > item.lowStockThreshold
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Alert Notifications */}
      {notifications.length > 0 && (
        <div className="space-y-2">
          {notifications.map((notification, index) => (
            <Alert key={index} className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="flex items-center justify-between">
                <span className="text-red-800">{notification}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dismissNotification(index)}
                  className="text-red-600 hover:text-red-800 h-6 w-6 p-0"
                >
                  ×
                </Button>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-red-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Critical Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{criticalItems.length}</div>
            <p className="text-sm text-gray-600">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-yellow-700">
              <Clock className="h-5 w-5" />
              Low Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">{lowStockItems.length}</div>
            <p className="text-sm text-gray-600">Below threshold levels</p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              Well Stocked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{inStockItems.length}</div>
            <p className="text-sm text-gray-600">Above threshold levels</p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Items */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900 font-['Poppins'] flex items-center gap-2">
          <Package className="h-5 w-5" />
          Inventory Status
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {inventoryItems.map(item => {
            const stockStatus = getStockStatus(item);
            
            return (
              <Card key={item.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div>
                        <CardTitle className="text-lg font-semibold font-['Poppins']">
                          {item.name}
                        </CardTitle>
                        <CardDescription className="font-['Inter']">
                          {item.store} • ${item.price}
                        </CardDescription>
                      </div>
                    </div>
                    
                    <Badge className={stockStatus.color}>
                      {stockStatus.label}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* Stock Information */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Current Stock:</span>
                      <span className="font-bold text-lg">
                        {item.currentStock}
                      </span>
                      {getTrendIcon(item.trend)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Threshold: {item.lowStockThreshold}
                    </div>
                  </div>

                  {/* Stock Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        item.currentStock === 0 ? 'bg-red-500' :
                        item.currentStock <= item.lowStockThreshold ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ 
                        width: `${Math.min(100, (item.currentStock / (item.lowStockThreshold * 2)) * 100)}%` 
                      }}
                    />
                  </div>

                  {/* Alert Toggle */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-gray-600" />
                      <Label htmlFor={`alerts-${item.id}`} className="text-sm font-['Inter']">
                        Low stock alerts
                      </Label>
                    </div>
                    <Switch
                      id={`alerts-${item.id}`}
                      checked={item.alertsEnabled}
                      onCheckedChange={() => toggleAlerts(item.id)}
                    />
                  </div>

                  {/* Last Updated */}
                  <div className="text-xs text-gray-500 font-['Inter']">
                    Last updated: {new Date(item.lastUpdated).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}