// 📦 /components/RetailerOrderDashboard.jsx
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  Users, 
  Calendar,
  Star,
  Package,
  Eye
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const RetailerOrderDashboard = ({ retailerId = "demo_retailer_456" }) => {
  const [orders, setOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [weeklyOrders, setWeeklyOrders] = useState(0);

  useEffect(() => {
    const fetchRetailerOrders = async () => {
      try {
        const response = await apiRequest("GET", `/api/order/retailer/${retailerId}`);
        const data = await response.json();
        const orderList = data.orders || [];
        
        setOrders(orderList);
        
        // Calculate total revenue
        const revenue = orderList.reduce((acc, order) => {
          const amount = parseFloat(order.totalAmount) || 0;
          return acc + amount;
        }, 0);
        setTotalRevenue(revenue);

        // Calculate monthly revenue (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const monthlyOrders = orderList.filter(order => 
          new Date(order.timestamp) > thirtyDaysAgo
        );
        const monthlyRev = monthlyOrders.reduce((acc, order) => 
          acc + (parseFloat(order.totalAmount) || 0), 0
        );
        setMonthlyRevenue(monthlyRev);

        // Calculate weekly orders
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const recentOrders = orderList.filter(order => 
          new Date(order.timestamp) > weekAgo
        );
        setWeeklyOrders(recentOrders.length);

      } catch (err) {
        console.error("Retailer order load error", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRetailerOrders();
  }, [retailerId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Retailer Order Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Revenue Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-blue-600">${monthlyRevenue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Weekly Orders</p>
                <p className="text-2xl font-bold">{weeklyOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Recent Orders
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {orders.length} order{orders.length !== 1 ? 's' : ''} found
          </p>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No orders yet.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Orders from customers will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <Card key={order.orderId} className="border-l-4 border-l-green-500">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">Order #{order.orderId?.slice(-8) || 'N/A'}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(order.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {order.status || 'Completed'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Customer</p>
                          <p className="text-sm text-muted-foreground">{order.shopperId}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Order Total</p>
                          <p className="text-sm text-green-600 font-semibold">
                            ${typeof order.totalAmount === 'number' ? order.totalAmount.toFixed(2) : order.totalAmount}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-orange-500" />
                        <div>
                          <p className="text-sm font-medium">SPIRALs Given</p>
                          <p className="text-sm text-orange-600 font-semibold">
                            {order.spiralsEarned || 0} points
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="w-full">
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>

                    {order.items && order.items.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-medium mb-2">Items Sold:</p>
                        <div className="space-y-1">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="text-sm text-muted-foreground flex justify-between">
                              <span>{item.name || 'Product'}</span>
                              <span>${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Revenue Goal Progress</span>
                <span>{Math.min(100, Math.round((monthlyRevenue / 5000) * 100))}%</span>
              </div>
              <Progress value={Math.min(100, (monthlyRevenue / 5000) * 100)} />
              <p className="text-xs text-muted-foreground mt-1">
                Monthly goal: $5,000 | Current: ${monthlyRevenue.toFixed(2)}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">
                  ${orders.length > 0 ? (totalRevenue / orders.length).toFixed(2) : '0.00'}
                </p>
                <p className="text-sm text-blue-600">Average Order Value</p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {orders.reduce((acc, order) => acc + (order.spiralsEarned || 0), 0)}
                </p>
                <p className="text-sm text-green-600">Total SPIRALs Given</p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">
                  {new Set(orders.map(order => order.shopperId)).size}
                </p>
                <p className="text-sm text-purple-600">Unique Customers</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RetailerOrderDashboard;