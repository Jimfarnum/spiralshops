import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import TripNotifications from '@/components/TripNotifications';
import RetailerPlanStatus from '@/components/RetailerPlanStatus';
import RetailerOrderDashboard from '@/components/RetailerOrderDashboard';
import CampaignPack from '@/components/CampaignPack';
import RetailerRecognition from '@/components/RetailerRecognition';
import RetailerProgress from '@/components/RetailerProgress';
import { Store, Users, ShoppingCart, TrendingUp, Bell, Settings, CheckCircle, Star, Award } from 'lucide-react';

export default function RetailerDashboard() {
  const [activeTab, setActiveTab] = useState('trips');
  const [showSubscriptionAlert, setShowSubscriptionAlert] = useState(false);
  
  // Check for subscription confirmation in URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const subscribed = urlParams.get('subscribed');
    
    if (subscribed === '1') {
      setShowSubscriptionAlert(true);
      // Auto-hide alert after 5 seconds
      setTimeout(() => setShowSubscriptionAlert(false), 5000);
      
      // Clean URL by removing the parameter
      const url = new URL(window.location.href);
      url.searchParams.delete('subscribed');
      window.history.replaceState({}, document.title, url.pathname);
      
      // Refresh plan status to show updated features
      window.location.reload();
    }
  }, []);

  // Mock retailer data (in production, this would come from auth/API)
  const retailerData = {
    storeName: "Local Electronics Store",
    storeId: "store_1",
    mallId: "mall_1",
    location: "Downtown Shopping Center",
    status: "Verified",
    todaySales: 1247.50,
    weekSales: 8932.75,
    monthSales: 42156.30,
    spiralBalance: 15780, // SPIRAL balance earned by retailer
    spiralsPaidOut: 3240, // SPIRALs paid to customers
    spiralsEarned: 890, // SPIRALs earned this week
    stripeCustomerId: "cus_demo_gold" // Demo customer ID for plan status
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Store className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {retailerData.storeName}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {retailerData.location} • <Badge variant="secondary">{retailerData.status}</Badge>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Subscription Success Alert */}
        {showSubscriptionAlert && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Subscription Activated!</strong> Your plan upgrade is now active and all premium features are available.
            </AlertDescription>
          </Alert>
        )}
        
        {/* Plan Status Section */}
        <RetailerPlanStatus stripeCustomerId={retailerData.stripeCustomerId} />
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Today's Sales</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    ${retailerData.todaySales.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <ShoppingCart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">This Week</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    ${retailerData.weekSales.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">This Month</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    ${retailerData.monthSales.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <Star className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">SPIRAL Balance</p>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {retailerData.spiralBalance.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    +{retailerData.spiralsEarned} this week
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="trips">Live Shopping Trips</TabsTrigger>
            <TabsTrigger value="recognition">Recognition</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="campaigns">Social Campaigns</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
          </TabsList>

          <TabsContent value="trips" className="space-y-6">
            {/* Trip Notifications Component */}
            <TripNotifications 
              storeId={retailerData.storeId} 
              mallId={retailerData.mallId} 
            />
          </TabsContent>

          <TabsContent value="recognition" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RetailerRecognition retailerId="retailer_1" />
              <RetailerProgress retailerId="retailer_1" />
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <RetailerOrderDashboard retailerId={retailerData.storeId} />
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Inventory management tools will be displayed here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Detailed analytics and reporting tools will be displayed here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-6">
            <CampaignPack />
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Customer relationship management tools will be displayed here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}