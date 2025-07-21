import React, { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Store, 
  Package, 
  TrendingUp, 
  Star, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  BarChart3,
  Users,
  DollarSign,
  Gift,
  Image,
  Megaphone
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/header';
import Footer from '@/components/footer';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  inventory: number;
  sales: number;
  spiralEarnings: number;
  isPromoted: boolean;
  fulfillmentMethods: string[];
}

const RetailerDashboard = () => {
  const { toast } = useToast();
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Mock retailer data
  const retailerInfo = {
    businessName: "Local Roasters Coffee",
    ownerName: "Sarah Chen",
    email: "sarah@localroasters.com",
    joinDate: "January 2024",
    totalProducts: 12,
    totalSales: 4890.50,
    spiralRedemptions: 127,
    customers: 89
  };

  // Mock products data
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Artisan Coffee Blend',
      price: 24.99,
      category: 'beverages',
      description: 'Our signature blend of premium single-origin beans',
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
      inventory: 45,
      sales: 127,
      spiralEarnings: 63,
      isPromoted: true,
      fulfillmentMethods: ['ship', 'pickup', 'mall']
    },
    {
      id: '2',
      name: 'Cold Brew Concentrate',
      price: 18.50,
      category: 'beverages',
      description: 'Smooth cold brew concentrate for home brewing',
      image: 'https://images.unsplash.com/photo-1517701550917-90325ffdb5e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
      inventory: 32,
      sales: 89,
      spiralEarnings: 44,
      isPromoted: false,
      fulfillmentMethods: ['ship', 'pickup']
    }
  ]);

  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    price: 0,
    category: '',
    description: '',
    image: '',
    inventory: 0,
    fulfillmentMethods: []
  });

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const product: Product = {
      id: (products.length + 1).toString(),
      name: newProduct.name!,
      price: newProduct.price!,
      category: newProduct.category!,
      description: newProduct.description || '',
      image: newProduct.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
      inventory: newProduct.inventory || 0,
      sales: 0,
      spiralEarnings: 0,
      isPromoted: false,
      fulfillmentMethods: newProduct.fulfillmentMethods || []
    };

    setProducts(prev => [...prev, product]);
    setNewProduct({
      name: '',
      price: 0,
      category: '',
      description: '',
      image: '',
      inventory: 0,
      fulfillmentMethods: []
    });
    setShowAddProduct(false);

    toast({
      title: "Product added!",
      description: `${product.name} has been added to your store.`,
    });
  };

  const togglePromoted = (productId: string) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === productId 
          ? { ...product, isPromoted: !product.isPromoted }
          : product
      )
    );
    
    toast({
      title: "Product updated!",
      description: "Promotion status has been changed.",
    });
  };

  const removeProduct = (productId: string) => {
    setProducts(prev => prev.filter(product => product.id !== productId));
    toast({
      title: "Product removed",
      description: "The product has been deleted from your store.",
    });
  };

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-[var(--spiral-navy)] font-['Poppins']">
                {retailerInfo.businessName}
              </h1>
              <p className="text-gray-600 mt-2 text-lg font-['Inter']">
                Retailer Dashboard
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 font-['Inter']">Welcome back, {retailerInfo.ownerName}</p>
              <p className="text-xs text-gray-500 font-['Inter']">Member since {retailerInfo.joinDate}</p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-['Inter']">Total Sales</p>
                  <p className="text-2xl font-bold text-[var(--spiral-navy)] font-['Poppins']">
                    ${retailerInfo.totalSales.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-[var(--spiral-coral)]/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-[var(--spiral-coral)]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-['Inter']">Products</p>
                  <p className="text-2xl font-bold text-[var(--spiral-navy)] font-['Poppins']">
                    {products.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-[var(--spiral-sage)]/20 rounded-lg flex items-center justify-center">
                  <Package className="h-6 w-6 text-[var(--spiral-sage)]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-['Inter']">SPIRAL Redemptions</p>
                  <p className="text-2xl font-bold text-[var(--spiral-navy)] font-['Poppins']">
                    {retailerInfo.spiralRedemptions}
                  </p>
                </div>
                <div className="w-12 h-12 bg-[var(--spiral-gold)]/20 rounded-lg flex items-center justify-center">
                  <Gift className="h-6 w-6 text-[var(--spiral-gold)]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-['Inter']">Customers</p>
                  <p className="text-2xl font-bold text-[var(--spiral-navy)] font-['Poppins']">
                    {retailerInfo.customers}
                  </p>
                </div>
                <div className="w-12 h-12 bg-[var(--spiral-navy)]/20 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-[var(--spiral-navy)]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link href="/marketing-center">
            <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer bg-gradient-to-r from-[var(--spiral-sage)]/10 to-[var(--spiral-coral)]/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[var(--spiral-sage)] rounded-xl flex items-center justify-center">
                    <Megaphone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--spiral-navy)] font-['Poppins']">
                      Marketing Center
                    </h3>
                    <p className="text-gray-600 text-sm font-['Inter']">
                      Create campaigns, coupons, and social posts
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/retailer-analytics">
            <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer bg-gradient-to-r from-[var(--spiral-coral)]/10 to-[var(--spiral-gold)]/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[var(--spiral-coral)] rounded-xl flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--spiral-navy)] font-['Poppins']">
                      Advanced Analytics
                    </h3>
                    <p className="text-gray-600 text-sm font-['Inter']">
                      Comprehensive business insights and performance metrics
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 rounded-xl">
            <TabsTrigger value="products" className="rounded-lg">Products</TabsTrigger>
            <TabsTrigger value="inventory" className="rounded-lg">Inventory</TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-lg">Analytics</TabsTrigger>
            <TabsTrigger value="spirals" className="rounded-lg">SPIRAL Activity</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[var(--spiral-navy)] font-['Poppins']">
                Product Management
              </h2>
              <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
                <DialogTrigger asChild>
                  <Button className="bg-[var(--spiral-navy)] hover:bg-[var(--spiral-coral)] text-white rounded-xl">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-[var(--spiral-navy)] font-['Poppins']">Add New Product</DialogTitle>
                    <DialogDescription className="font-['Inter']">
                      Create a new product for your SPIRAL store listing
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="product-name" className="text-sm font-medium text-gray-700 font-['Inter']">
                          Product Name *
                        </Label>
                        <Input
                          id="product-name"
                          value={newProduct.name || ''}
                          onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                          className="mt-1 rounded-lg"
                          placeholder="Enter product name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="product-price" className="text-sm font-medium text-gray-700 font-['Inter']">
                          Price *
                        </Label>
                        <Input
                          id="product-price"
                          type="number"
                          step="0.01"
                          value={newProduct.price || ''}
                          onChange={(e) => setNewProduct(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                          className="mt-1 rounded-lg"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="product-category" className="text-sm font-medium text-gray-700 font-['Inter']">
                        Category *
                      </Label>
                      <Select value={newProduct.category || ''} onValueChange={(value) => setNewProduct(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger className="mt-1 rounded-lg">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beverages">Beverages</SelectItem>
                          <SelectItem value="food">Food</SelectItem>
                          <SelectItem value="crafts">Crafts</SelectItem>
                          <SelectItem value="home">Home & Garden</SelectItem>
                          <SelectItem value="clothing">Clothing</SelectItem>
                          <SelectItem value="gifts">Gifts</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="product-description" className="text-sm font-medium text-gray-700 font-['Inter']">
                        Description
                      </Label>
                      <Textarea
                        id="product-description"
                        value={newProduct.description || ''}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                        className="mt-1 rounded-lg"
                        placeholder="Describe your product..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="product-inventory" className="text-sm font-medium text-gray-700 font-['Inter']">
                        Inventory Count
                      </Label>
                      <Input
                        id="product-inventory"
                        type="number"
                        value={newProduct.inventory || ''}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, inventory: parseInt(e.target.value) }))}
                        className="mt-1 rounded-lg"
                        placeholder="0"
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowAddProduct(false)} className="rounded-lg">
                        Cancel
                      </Button>
                      <Button onClick={handleAddProduct} className="bg-[var(--spiral-navy)] hover:bg-[var(--spiral-coral)] text-white rounded-lg">
                        Add Product
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="shadow-lg border-0 hover:shadow-xl transition-shadow">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-32 object-cover rounded-t-lg"
                    />
                    {product.isPromoted && (
                      <Badge className="absolute top-2 right-2 bg-[var(--spiral-gold)] text-white text-xs">
                        Promoted
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-[var(--spiral-navy)] font-['Inter']">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 font-['Inter']">{product.description}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-[var(--spiral-coral)] font-['Poppins']">
                          ${product.price.toFixed(2)}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {product.category}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 font-['Inter']">
                        <div>
                          <p className="font-semibold">{product.inventory}</p>
                          <p>In Stock</p>
                        </div>
                        <div>
                          <p className="font-semibold">{product.sales}</p>
                          <p>Sold</p>
                        </div>
                        <div>
                          <p className="font-semibold">{product.spiralEarnings}</p>
                          <p>SPIRALs</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => togglePromoted(product.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Star className={`h-4 w-4 ${product.isPromoted ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeProduct(product.id)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <Link href={`/product/${product.id}`}>
                          <Button variant="outline" size="sm" className="text-xs rounded-lg">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-[var(--spiral-navy)] font-['Poppins'] flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Inventory Management
                </CardTitle>
                <CardDescription className="font-['Inter']">
                  Import and export your product inventory
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* CSV Import Section */}
                <div className="border rounded-xl p-6 bg-gray-50">
                  <h3 className="text-lg font-semibold text-[var(--spiral-navy)] mb-4 font-['Poppins']">
                    Import Products from CSV
                  </h3>
                  <p className="text-gray-600 mb-4 font-['Inter']">
                    Upload a CSV file with the following format: product_id, title, description, price, stock, category
                  </p>
                  <div className="space-y-4">
                    <div>
                      <input
                        type="file"
                        accept=".csv"
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--spiral-navy)] file:text-white hover:file:bg-[var(--spiral-coral)]"
                      />
                    </div>
                    <Button className="bg-[var(--spiral-navy)] hover:bg-[var(--spiral-coral)] text-white rounded-xl">
                      <Plus className="h-4 w-4 mr-2" />
                      Import Products
                    </Button>
                  </div>
                </div>

                {/* Export Section */}
                <div className="border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-[var(--spiral-navy)] mb-4 font-['Poppins']">
                    Export Current Inventory
                  </h3>
                  <p className="text-gray-600 mb-4 font-['Inter']">
                    Download your current product inventory as a CSV file
                  </p>
                  <Button variant="outline" className="border-[var(--spiral-navy)] text-[var(--spiral-navy)] hover:bg-[var(--spiral-navy)] hover:text-white rounded-xl">
                    Download CSV
                  </Button>
                </div>

                {/* Import Status */}
                <div className="border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-[var(--spiral-navy)] mb-4 font-['Poppins']">
                    Recent Import Status
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <div>
                        <p className="font-medium text-green-800 font-['Inter']">inventory_update_2024-01-20.csv</p>
                        <p className="text-sm text-green-600 font-['Inter']">15 products imported successfully</p>
                      </div>
                      <Badge className="bg-green-500 text-white">Success</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div>
                        <p className="font-medium text-yellow-800 font-['Inter']">inventory_update_2024-01-18.csv</p>
                        <p className="text-sm text-yellow-600 font-['Inter']">12 imported, 3 failed validation</p>
                      </div>
                      <Badge className="bg-yellow-500 text-white">Partial</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-[var(--spiral-navy)] font-['Poppins'] flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Sales Analytics
                </CardTitle>
                <CardDescription className="font-['Inter']">
                  Performance overview for your SPIRAL store
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2 font-['Inter']">
                    Analytics Coming Soon
                  </h3>
                  <p className="text-gray-500 font-['Inter']">
                    Detailed sales metrics, customer insights, and performance tracking will be available here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SPIRAL Activity Tab */}
          <TabsContent value="spirals" className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-[var(--spiral-navy)] font-['Poppins'] flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  SPIRAL Redemptions
                </CardTitle>
                <CardDescription className="font-['Inter']">
                  Track customer loyalty program activity at your store
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-[var(--spiral-sage)]/10 rounded-lg p-4">
                      <p className="text-2xl font-bold text-[var(--spiral-coral)] font-['Poppins']">
                        {retailerInfo.spiralRedemptions}
                      </p>
                      <p className="text-sm text-gray-600 font-['Inter']">Total Redemptions</p>
                    </div>
                    <div className="bg-[var(--spiral-coral)]/10 rounded-lg p-4">
                      <p className="text-2xl font-bold text-[var(--spiral-sage)] font-['Poppins']">
                        $1,247
                      </p>
                      <p className="text-sm text-gray-600 font-['Inter']">Value Redeemed</p>
                    </div>
                    <div className="bg-[var(--spiral-navy)]/10 rounded-lg p-4">
                      <p className="text-2xl font-bold text-[var(--spiral-navy)] font-['Poppins']">
                        67
                      </p>
                      <p className="text-sm text-gray-600 font-['Inter']">Active Members</p>
                    </div>
                  </div>

                  <div className="text-center py-8">
                    <Gift className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2 font-['Inter']">
                      SPIRAL Activity Details
                    </h3>
                    <p className="text-gray-500 font-['Inter']">
                      Detailed redemption history and customer loyalty insights coming soon.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default RetailerDashboard;