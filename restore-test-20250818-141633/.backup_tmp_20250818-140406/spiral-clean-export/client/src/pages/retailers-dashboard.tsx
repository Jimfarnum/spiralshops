import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useToast } from '@/hooks/use-toast';
import { Link, useLocation } from 'wouter';
import { 
  Store, 
  Package,
  BarChart3,
  Settings,
  Plus,
  Upload,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  FileText,
  DollarSign,
  Users,
  TrendingUp,
  Calendar,
  LogOut,
  Eye,
  Download
} from 'lucide-react';

// Product form schema
const productSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional(),
  price: z.string().min(1, 'Price is required'),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional(),
  brand: z.string().optional(),
  sku: z.string().optional(),
  stock: z.string().min(0, 'Stock cannot be negative'),
  imageUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  tags: z.string().optional(),
  weight: z.string().optional(),
  dimensions: z.string().optional(),
  spiralBonus: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface RetailerData {
  id: number;
  businessName: string;
  email: string;
  isApproved: boolean;
}

export default function RetailerDashboardPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [retailerData, setRetailerData] = useState<RetailerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [uploads, setUploads] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvUploading, setCsvUploading] = useState(false);

  const productForm = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      description: '',
      price: '',
      category: '',
      subcategory: '',
      brand: '',
      sku: '',
      stock: '0',
      imageUrl: '',
      tags: '',
      weight: '',
      dimensions: '',
      spiralBonus: '0',
    },
  });

  // Check authentication and load data
  useEffect(() => {
    const token = localStorage.getItem('retailerToken');
    const storedData = localStorage.getItem('retailerData');
    
    if (!token || !storedData) {
      setLocation('/retailers/login');
      return;
    }

    setRetailerData(JSON.parse(storedData));
    if (token) {
      loadDashboardData(token);
    }
  }, [setLocation]);

  const loadDashboardData = async (token: string) => {
    try {
      const headers = { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const [profileRes, productsRes, uploadsRes] = await Promise.all([
        fetch('/api/retailers/profile', { headers }),
        fetch('/api/retailers/products', { headers }),
        fetch('/api/retailers/uploads', { headers })
      ]);

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData.retailer);
      }

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData.products || []);
      }

      if (uploadsRes.ok) {
        const uploadsData = await uploadsRes.json();
        setUploads(uploadsData.uploads || []);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('retailerToken');
    localStorage.removeItem('retailerData');
    toast({
      title: "Logged Out",
      description: "Successfully logged out of your retailer account",
    });
    setLocation('/');
  };

  const handleAddProduct = async (data: ProductFormData) => {
    try {
      const token = localStorage.getItem('retailerToken');
      const response = await fetch('/api/retailers/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          price: parseFloat(data.price),
          stock: parseInt(data.stock),
          weight: data.weight ? parseFloat(data.weight) : null,
          spiralBonus: data.spiralBonus ? parseInt(data.spiralBonus) : 0,
          tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        toast({
          title: "Product Added",
          description: "Product successfully added to your inventory",
        });
        setProducts([result.product, ...products]);
        productForm.reset();
        setShowAddProduct(false);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add product",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Failed to add product",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = localStorage.getItem('retailerToken');
      const response = await fetch(`/api/retailers/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Product Deleted",
          description: "Product removed from your inventory",
        });
        setProducts(products.filter(p => p.id !== productId));
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const handleCsvUpload = async () => {
    if (!csvFile) return;

    setCsvUploading(true);
    try {
      const token = localStorage.getItem('retailerToken');
      const formData = new FormData();
      formData.append('csvFile', csvFile);

      const response = await fetch('/api/retailers/products/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      
      if (response.ok) {
        toast({
          title: "CSV Upload Complete",
          description: result.message,
        });
        setCsvFile(null);
        loadDashboardData(token);
      } else {
        toast({
          title: "Upload Failed",
          description: result.error || "Failed to upload CSV",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Failed to upload CSV",
        variant: "destructive",
      });
    } finally {
      setCsvUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--spiral-cream)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[var(--spiral-coral)] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!retailerData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--spiral-navy)]">
              Retailer Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Welcome back, {retailerData.businessName}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {!retailerData.isApproved && (
              <Badge variant="outline" className="border-yellow-400 text-yellow-600">
                <AlertCircle className="h-4 w-4 mr-1" />
                Pending Approval
              </Badge>
            )}
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Approval Notice */}
        {!retailerData.isApproved && (
          <Alert className="mb-6 border-yellow-200 bg-yellow-50">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Your retailer account is pending approval. You can manage your profile and products, 
              but customers won't see your store until approval is complete.
            </AlertDescription>
          </Alert>
        )}

        {/* Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Products ({products.length})
            </TabsTrigger>
            <TabsTrigger value="uploads" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Uploads
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Products</p>
                      <p className="text-2xl font-bold text-[var(--spiral-navy)]">{products.length}</p>
                    </div>
                    <Package className="h-8 w-8 text-[var(--spiral-coral)]" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">In Stock</p>
                      <p className="text-2xl font-bold text-[var(--spiral-navy)]">
                        {products.filter(p => p.stock > 0).length}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Categories</p>
                      <p className="text-2xl font-bold text-[var(--spiral-navy)]">
                        {new Set(products.map(p => p.category)).size}
                      </p>
                    </div>
                    <FileText className="h-8 w-8 text-[var(--spiral-coral)]" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Status</p>
                      <p className="text-lg font-bold text-[var(--spiral-navy)]">
                        {retailerData.isApproved ? 'Active' : 'Pending'}
                      </p>
                    </div>
                    {retailerData.isApproved ? (
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    ) : (
                      <AlertCircle className="h-8 w-8 text-yellow-500" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => setShowAddProduct(true)}
                    className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/80"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab('uploads')}>
                    <Upload className="h-4 w-4 mr-2" />
                    Bulk Upload
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab('settings')}>
                    <Settings className="h-4 w-4 mr-2" />
                    Update Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[var(--spiral-navy)]">Product Inventory</h2>
              <Button 
                onClick={() => setShowAddProduct(true)}
                className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/80"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>

            {/* Add Product Form */}
            {showAddProduct && (
              <Card>
                <CardHeader>
                  <CardTitle>Add New Product</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...productForm}>
                    <form onSubmit={productForm.handleSubmit(handleAddProduct)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={productForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Product Title *</FormLabel>
                              <FormControl>
                                <Input placeholder="iPhone 15 Pro Max" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={productForm.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category *</FormLabel>
                              <FormControl>
                                <Input placeholder="Electronics" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={productForm.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price ($) *</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" placeholder="999.99" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={productForm.control}
                          name="stock"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Stock Quantity *</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="10" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={productForm.control}
                          name="brand"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Brand</FormLabel>
                              <FormControl>
                                <Input placeholder="Apple" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={productForm.control}
                          name="sku"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>SKU</FormLabel>
                              <FormControl>
                                <Input placeholder="IPH15PM-256-BLU" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={productForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Detailed product description..."
                                rows={3}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex gap-4">
                        <Button type="submit" className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/80">
                          Add Product
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setShowAddProduct(false)}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}

            {/* Products List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-[var(--spiral-navy)]">{product.title}</h3>
                          <p className="text-sm text-gray-600">{product.category}</p>
                        </div>
                        <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </Badge>
                      </div>
                      
                      <p className="text-lg font-bold text-[var(--spiral-coral)]">
                        ${parseFloat(product.price).toFixed(2)}
                      </p>
                      
                      {product.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {products.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No Products Yet</h3>
                  <p className="text-gray-500 mb-4">Add your first product to get started</p>
                  <Button 
                    onClick={() => setShowAddProduct(true)}
                    className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/80"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Product
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Uploads Tab */}
          <TabsContent value="uploads" className="space-y-6">
            <h2 className="text-2xl font-bold text-[var(--spiral-navy)]">Bulk Product Upload</h2>
            
            {/* CSV Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Products via CSV</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Choose CSV File</label>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[var(--spiral-coral)] file:text-white hover:file:bg-[var(--spiral-coral)]/80"
                  />
                </div>
                
                {csvFile && (
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                      Selected: {csvFile.name}
                    </span>
                    <Button 
                      onClick={handleCsvUpload}
                      disabled={csvUploading}
                      className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/80"
                    >
                      {csvUploading ? 'Uploading...' : 'Upload CSV'}
                    </Button>
                  </div>
                )}

                <Alert>
                  <FileText className="h-4 w-4" />
                  <AlertDescription>
                    CSV should include columns: title, price, category, description (optional), 
                    stock (optional), brand (optional), sku (optional)
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Upload History */}
            <Card>
              <CardHeader>
                <CardTitle>Upload History</CardTitle>
              </CardHeader>
              <CardContent>
                {uploads.length > 0 ? (
                  <div className="space-y-4">
                    {uploads.map((upload) => (
                      <div key={upload.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{upload.filename}</h4>
                            <p className="text-sm text-gray-600">
                              {upload.successRows} successful, {upload.errorRows} errors
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge variant={upload.status === 'completed' ? 'default' : 'destructive'}>
                              {upload.status}
                            </Badge>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(upload.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No uploads yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold text-[var(--spiral-navy)]">Account Settings</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Business Profile</CardTitle>
              </CardHeader>
              <CardContent>
                {profile ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Business Name</label>
                        <p className="text-lg">{profile.businessName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <p className="text-lg">{profile.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Phone</label>
                        <p className="text-lg">{profile.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Website</label>
                        <p className="text-lg">{profile.website || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Address</label>
                      <p className="text-lg">
                        {profile.address}, {profile.city}, {profile.state} {profile.zipCode}
                      </p>
                    </div>
                    
                    {profile.bio && (
                      <div>
                        <label className="block text-sm font-medium mb-1">Business Description</label>
                        <p className="text-gray-700">{profile.bio}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">Loading profile...</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}