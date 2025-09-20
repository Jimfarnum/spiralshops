import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Store,
  Package,
  DollarSign,
  Users,
  TrendingUp,
  Star,
  ShoppingCart,
  Bell,
  Calendar,
  BarChart3,
  Settings,
  Eye,
  Edit,
  Plus,
  MessageSquare
} from 'lucide-react';

interface DemoProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  sales: number;
  rating: number;
  reviews: number;
  category: string;
}

interface DemoOrder {
  id: string;
  orderNumber: string;
  customer: string;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  fulfillmentMethod: string;
  createdAt: string;
}

export default function RetailerDemoDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Demo store data
  const storeInfo = {
    name: "Local Artisan Goods",
    category: "Home & Garden",
    rating: 4.8,
    totalReviews: 127,
    totalProducts: 15,
    activeOrders: 8,
    monthlyRevenue: 3750,
    spiralBalance: 245,
    followersCount: 89
  };

  // Demo products data
  const demoProducts: DemoProduct[] = [
    {
      id: "prod_1",
      name: "Handcrafted Ceramic Vase",
      price: 45.99,
      stock: 12,
      sales: 23,
      rating: 4.9,
      reviews: 15,
      category: "Home Decor"
    },
    {
      id: "prod_2", 
      name: "Organic Lavender Candle Set",
      price: 28.50,
      stock: 8,
      sales: 18,
      rating: 4.7,
      reviews: 12,
      category: "Candles"
    },
    {
      id: "prod_3",
      name: "Bamboo Kitchen Utensil Set",
      price: 32.00,
      stock: 15,
      sales: 31,
      rating: 4.8,
      reviews: 24,
      category: "Kitchenware"
    },
    {
      id: "prod_4",
      name: "Succulent Garden Starter Kit",
      price: 19.99,
      stock: 6,
      sales: 14,
      rating: 4.6,
      reviews: 9,
      category: "Plants"
    },
    {
      id: "prod_5",
      name: "Macrame Wall Hanging",
      price: 38.75,
      stock: 4,
      sales: 8,
      rating: 5.0,
      reviews: 6,
      category: "Wall Art"
    }
  ];

  // Demo orders data
  const demoOrders: DemoOrder[] = [
    {
      id: "ord_1",
      orderNumber: "ORD-2025-0121",
      customer: "Sarah M.",
      total: 74.49,
      status: "pending",
      fulfillmentMethod: "In-Store Pickup",
      createdAt: "2025-01-21T10:30:00Z"
    },
    {
      id: "ord_2",
      orderNumber: "ORD-2025-0120", 
      customer: "Mike R.",
      total: 32.00,
      status: "confirmed",
      fulfillmentMethod: "Ship to Me",
      createdAt: "2025-01-20T15:45:00Z"
    },
    {
      id: "ord_3",
      orderNumber: "ORD-2025-0119",
      customer: "Lisa K.",
      total: 28.50,
      status: "shipped",
      fulfillmentMethod: "Ship to Mall",
      createdAt: "2025-01-19T09:15:00Z"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[var(--spiral-navy)] mb-2">
                Retailer Dashboard Demo
              </h1>
              <p className="text-gray-600">
                Welcome to {storeInfo.name} - Your SPIRAL business hub
              </p>
            </div>
            <Badge className="bg-[var(--spiral-coral)] text-white px-4 py-2">
              DEMO MODE
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-[var(--spiral-navy)]">
                    ${storeInfo.monthlyRevenue.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-[var(--spiral-coral)]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Orders</p>
                  <p className="text-2xl font-bold text-[var(--spiral-navy)]">
                    {storeInfo.activeOrders}
                  </p>
                </div>
                <ShoppingCart className="h-8 w-8 text-[var(--spiral-coral)]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">SPIRAL Points</p>
                  <p className="text-2xl font-bold text-[var(--spiral-navy)]">
                    {storeInfo.spiralBalance}
                  </p>
                </div>
                <Star className="h-8 w-8 text-[var(--spiral-coral)]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Store Followers</p>
                  <p className="text-2xl font-bold text-[var(--spiral-navy)]">
                    {storeInfo.followersCount}
                  </p>
                </div>
                <Users className="h-8 w-8 text-[var(--spiral-coral)]" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products ({storeInfo.totalProducts})</TabsTrigger>
            <TabsTrigger value="orders">Orders ({storeInfo.activeOrders})</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Store Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-[var(--spiral-coral)]" />
                    Store Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Rating</span>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= Math.round(storeInfo.rating)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-semibold">{storeInfo.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Reviews</span>
                    <span className="font-semibold">{storeInfo.totalReviews}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Conversion Rate</span>
                    <span className="font-semibold">12.4%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Repeat Customers</span>
                    <span className="font-semibold">68%</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-[var(--spiral-coral)]" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Product
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Update Store Hours
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Bell className="h-4 w-4 mr-2" />
                    Create Promotion
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    View Customer Reviews
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-[var(--spiral-coral)]" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New order received</p>
                        <p className="text-xs text-gray-600">Sarah M. ordered Ceramic Vase + Candle Set - $74.49</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Product review received</p>
                        <p className="text-xs text-gray-600">5-star review for Bamboo Kitchen Utensils</p>
                        <p className="text-xs text-gray-500">4 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Order shipped</p>
                        <p className="text-xs text-gray-600">ORD-2025-0119 shipped to SPIRAL Center</p>
                        <p className="text-xs text-gray-500">1 day ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Low inventory alert</p>
                        <p className="text-xs text-gray-600">Macrame Wall Hanging has only 4 units left</p>
                        <p className="text-xs text-gray-500">2 days ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[var(--spiral-navy)]">
                  Product Inventory
                </h3>
                <Button className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {demoProducts.map((product) => (
                  <Card key={product.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-[var(--spiral-navy)]">
                              {product.name}
                            </h4>
                            <Badge variant="outline">{product.category}</Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Price:</span>
                              <p className="font-semibold">${product.price}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Stock:</span>
                              <p className={`font-semibold ${product.stock < 10 ? 'text-red-600' : 'text-green-600'}`}>
                                {product.stock} units
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-600">Sales:</span>
                              <p className="font-semibold">{product.sales} sold</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Rating:</span>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                <span className="font-semibold">{product.rating}</span>
                                <span className="text-gray-500">({product.reviews})</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {product.stock < 10 && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-800">
                            ⚠️ Low inventory alert - Consider restocking soon
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="mt-6">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[var(--spiral-navy)]">
                Recent Orders
              </h3>

              <div className="space-y-4">
                {demoOrders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-[var(--spiral-navy)]">
                              {order.orderNumber}
                            </h4>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Customer:</span>
                              <p className="font-semibold">{order.customer}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Total:</span>
                              <p className="font-semibold">${order.total}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Fulfillment:</span>
                              <p className="font-semibold">{order.fulfillmentMethod}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Date:</span>
                              <p className="font-semibold">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-[var(--spiral-coral)]" />
                    Sales Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">This Month</span>
                      <span className="font-semibold">$3,750</span>
                    </div>
                    <Progress value={75} className="h-2" />
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Goal: $5,000</span>
                      <span>75% Complete</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {demoProducts
                      .sort((a, b) => b.sales - a.sales)
                      .slice(0, 3)
                      .map((product, index) => (
                        <div key={product.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-[var(--spiral-coral)] text-white rounded-full flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </div>
                            <span className="text-sm font-medium">{product.name}</span>
                          </div>
                          <span className="text-sm text-gray-600">{product.sales} sold</span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>SPIRAL Community Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gradient-to-br from-[var(--spiral-coral)] to-[var(--spiral-navy)] rounded-lg text-white">
                      <h4 className="font-bold text-lg">{storeInfo.spiralBalance}</h4>
                      <p className="text-sm text-white/80">SPIRAL Points Earned</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-bold text-lg text-[var(--spiral-navy)]">{storeInfo.followersCount}</h4>
                      <p className="text-sm text-gray-600">Store Followers</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-bold text-lg text-[var(--spiral-navy)]">94%</h4>
                      <p className="text-sm text-gray-600">Local Discovery Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}