import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Store, 
  Package, 
  BarChart3, 
  MapPin, 
  Clock, 
  Upload,
  DollarSign,
  Users,
  Star,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function RetailerPortal() {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  const handleStoreUpdate = () => {
    toast({
      title: "Store Updated",
      description: "Your store information has been saved successfully.",
    });
  };

  const handleProductUpload = () => {
    toast({
      title: "Products Uploaded",
      description: "Your product catalog has been updated.",
    });
  };

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[var(--spiral-coral)] rounded-lg flex items-center justify-center">
              <Store className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[var(--spiral-navy)]">Retailer Dashboard</h1>
              <p className="text-gray-600">Manage your SPIRAL presence and grow your business</p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-none lg:flex">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="store">Store Details</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$12,234</div>
                  <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Orders</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">143</div>
                  <p className="text-xs text-muted-foreground">+12 from yesterday</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Customers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">856</div>
                  <p className="text-xs text-muted-foreground">+15.2% growth</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rating</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.8</div>
                  <p className="text-xs text-muted-foreground">Based on 127 reviews</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks to manage your store</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="h-auto p-4 flex flex-col items-start bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90">
                  <Upload className="h-5 w-5 mb-2" />
                  <span className="font-semibold">Upload Products</span>
                  <span className="text-xs opacity-90">Add new inventory</span>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                  <MapPin className="h-5 w-5 mb-2" />
                  <span className="font-semibold">Update Store Info</span>
                  <span className="text-xs text-gray-600">Hours, location, contact</span>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                  <BarChart3 className="h-5 w-5 mb-2" />
                  <span className="font-semibold">View Analytics</span>
                  <span className="text-xs text-gray-600">Sales & performance data</span>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Store Details Tab */}
          <TabsContent value="store" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Store Information</CardTitle>
                <CardDescription>Update your store details visible to customers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Store Name</label>
                    <Input placeholder="Your Business Name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <Input placeholder="e.g., Clothing, Electronics, Food" />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea placeholder="Tell customers about your store..." className="h-20" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Address</label>
                    <Input placeholder="123 Main St, City, State 12345" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <Input placeholder="(555) 123-4567" />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Store Hours</label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <Input placeholder="Mon-Fri: 9AM-7PM" />
                    <Input placeholder="Sat-Sun: 10AM-6PM" />
                  </div>
                </div>
                
                <Button onClick={handleStoreUpdate} className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90">
                  Update Store Information
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Product Catalog
                  <Button size="sm" className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload CSV
                  </Button>
                </CardTitle>
                <CardDescription>Manage your product inventory and pricing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Input placeholder="Product name" />
                    <Input placeholder="Price" type="number" />
                    <Input placeholder="Stock quantity" type="number" />
                    <Button onClick={handleProductUpload}>Add Product</Button>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Recent Products</h4>
                    <div className="space-y-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded"></div>
                            <div>
                              <p className="font-medium">Sample Product {i}</p>
                              <p className="text-sm text-gray-600">$29.99 • 15 in stock</p>
                            </div>
                          </div>
                          <Badge variant="outline">Active</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
                <CardDescription>Track and fulfill customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-semibold">Order #SP{1000 + i}</p>
                          <p className="text-sm text-gray-600">Customer Name • $45.99</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={i <= 2 ? "default" : "secondary"}>
                          {i <= 2 ? "Processing" : "Completed"}
                        </Badge>
                        <Button size="sm" variant="outline">View</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Sales Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-32 bg-gradient-to-r from-[var(--spiral-coral)]/20 to-[var(--spiral-sage)]/20 rounded-lg flex items-center justify-center">
                    <p className="text-gray-600">Chart visualization would go here</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>SPIRAL Points Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Points Earned by Customers</span>
                      <span className="font-semibold">2,847 SP</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Points Redeemed</span>
                      <span className="font-semibold">1,205 SP</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Bonus Points Given</span>
                      <span className="font-semibold">438 SP</span>
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