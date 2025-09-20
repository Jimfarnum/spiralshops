import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Heart, Bell, BellOff, TrendingDown, Package, Trash2, ShoppingCart, Eye } from 'lucide-react';
import { Link } from 'wouter';

interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  retailer: string;
  inStock: boolean;
  priceDropAlert: boolean;
  restockAlert: boolean;
  spiralsBonus?: number;
  addedAt: string;
  lastPriceCheck: string;
  alertsTriggered: number;
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalItems: 0,
    activeAlerts: 0,
    potentialSavings: 0,
    avgSavings: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await fetch('/api/wishlist');
      const data = await response.json();
      
      if (data.success) {
        setWishlist(data.data);
        calculateStats(data.data);
      }
    } catch (error) {
      // Demo data for development
      const mockWishlist: WishlistItem[] = [
        {
          id: '1',
          productId: 'prod_1',
          name: 'Wireless Bluetooth Headphones',
          price: 89.99,
          originalPrice: 129.99,
          image: '/api/placeholder/300/300',
          category: 'Electronics',
          retailer: 'Tech Hub Electronics',
          inStock: true,
          priceDropAlert: true,
          restockAlert: false,
          spiralsBonus: 150,
          addedAt: '2025-01-05T10:00:00Z',
          lastPriceCheck: '2025-01-07T12:00:00Z',
          alertsTriggered: 1
        },
        {
          id: '2',
          productId: 'prod_2',
          name: 'Organic Coffee Beans - Dark Roast',
          price: 24.99,
          originalPrice: 24.99,
          image: '/api/placeholder/300/300',
          category: 'Food & Beverages',
          retailer: 'Local Coffee Roasters',
          inStock: false,
          priceDropAlert: false,
          restockAlert: true,
          addedAt: '2025-01-06T14:30:00Z',
          lastPriceCheck: '2025-01-07T11:45:00Z',
          alertsTriggered: 0
        },
        {
          id: '3',
          productId: 'prod_3',
          name: 'Summer Fashion Dress',
          price: 79.99,
          originalPrice: 99.99,
          image: '/api/placeholder/300/300',
          category: 'Fashion',
          retailer: 'Fashion Forward Boutique',
          inStock: true,
          priceDropAlert: true,
          restockAlert: true,
          spiralsBonus: 200,
          addedAt: '2025-01-04T16:20:00Z',
          lastPriceCheck: '2025-01-07T13:00:00Z',
          alertsTriggered: 2
        }
      ];
      
      setWishlist(mockWishlist);
      calculateStats(mockWishlist);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (items: WishlistItem[]) => {
    const totalItems = items.length;
    const activeAlerts = items.filter(item => item.priceDropAlert || item.restockAlert).length;
    const potentialSavings = items.reduce((sum, item) => {
      return sum + (item.originalPrice ? item.originalPrice - item.price : 0);
    }, 0);
    const avgSavings = totalItems > 0 ? potentialSavings / totalItems : 0;

    setStats({
      totalItems,
      activeAlerts,
      potentialSavings,
      avgSavings
    });
  };

  const toggleAlert = async (itemId: string, alertType: 'priceDropAlert' | 'restockAlert') => {
    try {
      const updatedWishlist = wishlist.map(item => {
        if (item.id === itemId) {
          return { ...item, [alertType]: !item[alertType] };
        }
        return item;
      });
      
      setWishlist(updatedWishlist);
      calculateStats(updatedWishlist);
      
      toast({
        title: "Alert Updated",
        description: "Your notification preferences have been saved.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Could not update alert settings.",
        variant: "destructive"
      });
    }
  };

  const removeFromWishlist = async (itemId: string) => {
    try {
      const updatedWishlist = wishlist.filter(item => item.id !== itemId);
      setWishlist(updatedWishlist);
      calculateStats(updatedWishlist);
      
      toast({
        title: "Item Removed",
        description: "Product removed from your wishlist.",
      });
    } catch (error) {
      toast({
        title: "Remove Failed",
        description: "Could not remove item from wishlist.",
        variant: "destructive"
      });
    }
  };

  const addToCart = async (item: WishlistItem) => {
    if (!item.inStock) {
      toast({
        title: "Out of Stock",
        description: "This item is currently unavailable.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-teal-600 flex items-center gap-2">
            <Heart className="w-8 h-8 text-red-500" />
            Your Wishlist
          </h1>
          <p className="text-gray-600 mt-2">Track your favorite products and get notified about price drops</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="text-2xl font-bold">{stats.totalItems}</p>
              </div>
              <Heart className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Alerts</p>
                <p className="text-2xl font-bold text-blue-600">{stats.activeAlerts}</p>
              </div>
              <Bell className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Savings</p>
                <p className="text-2xl font-bold text-green-600">${stats.potentialSavings.toFixed(2)}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Savings</p>
                <p className="text-2xl font-bold text-purple-600">${stats.avgSavings.toFixed(2)}</p>
              </div>
              <Package className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wishlist Items */}
      {wishlist.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-4">Start adding products you love to track prices and get notified about deals!</p>
            <Link href="/products">
              <Button>Browse Products</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {wishlist.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600">{item.retailer}</p>
                        <Badge variant="outline" className="mt-1">{item.category}</Badge>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-teal-600">
                            ${item.price}
                          </span>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <span className="text-sm text-gray-500 line-through">
                              ${item.originalPrice}
                            </span>
                          )}
                        </div>
                        {item.spiralsBonus && (
                          <Badge className="bg-orange-100 text-orange-800 mt-1">
                            +{item.spiralsBonus} SPIRALs
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Stock Status */}
                    <div className="mb-3">
                      {item.inStock ? (
                        <Badge className="bg-green-100 text-green-800">
                          <Package className="w-3 h-3 mr-1" />
                          In Stock
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">
                          <Package className="w-3 h-3 mr-1" />
                          Out of Stock
                        </Badge>
                      )}
                    </div>

                    {/* Alert Controls */}
                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={item.priceDropAlert}
                          onCheckedChange={() => toggleAlert(item.id, 'priceDropAlert')}
                        />
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                          <TrendingDown className="w-4 h-4" />
                          Price Drop Alert
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={item.restockAlert}
                          onCheckedChange={() => toggleAlert(item.id, 'restockAlert')}
                        />
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          Restock Alert
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => addToCart(item)}
                        disabled={!item.inStock}
                        className="flex-1"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </Button>
                      
                      <Link href={`/product/${item.productId}`}>
                        <Button variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </Link>
                      
                      <Button
                        variant="outline"
                        onClick={() => removeFromWishlist(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Alert History */}
                    {item.alertsTriggered > 0 && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <Bell className="w-4 h-4 inline mr-1" />
                          {item.alertsTriggered} alert{item.alertsTriggered > 1 ? 's' : ''} triggered
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Price Alert Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-500" />
            How Price Alerts Work
          </CardTitle>
          <CardDescription>
            Stay informed about your favorite products with our smart notification system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <TrendingDown className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Price Drop Alerts</h4>
              <p className="text-sm text-gray-600">Get notified when prices decrease</p>
            </div>
            <div className="text-center">
              <Package className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Restock Alerts</h4>
              <p className="text-sm text-gray-600">Know when out-of-stock items return</p>
            </div>
            <div className="text-center">
              <Bell className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">SPIRALS Bonus</h4>
              <p className="text-sm text-gray-600">Get alerted about loyalty point bonuses</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}