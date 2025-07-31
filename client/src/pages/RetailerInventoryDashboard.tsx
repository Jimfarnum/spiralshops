import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, Download, Plus, Search, Filter, Package, AlertCircle, CheckCircle, Edit, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  variants?: string[];
  discount?: number;
  imageUrl?: string;
  category?: string;
  sku?: string;
  description?: string;
  timestamp: string;
}

interface UploadStats {
  totalRows: number;
  successfulUploads: number;
  errors: string[];
}

export default function RetailerInventoryDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [uploadStats, setUploadStats] = useState<UploadStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (Array.isArray(products)) {
      filterProducts();
    }
  }, [products, searchTerm, selectedCategory]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/products');
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      // Ensure data is an array
      const productsArray = Array.isArray(data) ? data : (data.products && Array.isArray(data.products) ? data.products : []);
      setProducts(productsArray);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]); // Ensure products is always an array
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterProducts = () => {
    // Ensure products is an array before filtering
    if (!Array.isArray(products)) {
      setFilteredProducts([]);
      return;
    }

    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  };

  const handleFileUpload = async () => {
    if (!csvFile) {
      toast({
        title: "No File Selected",
        description: "Please select a CSV or Excel file to upload",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('csv', csvFile);

      const response = await fetch('/api/upload-csv', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        // Ensure data.products is an array
        const productsArray = Array.isArray(data.products) ? data.products : [];
        setProducts(productsArray);
        setUploadStats(data.stats);
        setCsvFile(null);
        
        toast({
          title: "Upload Successful",
          description: `${data.stats?.successfulUploads || 0} products uploaded successfully`,
        });
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload inventory",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = `name,price,quantity,variants,discount,imageUrl,category,sku,description
Sample Product,29.99,100,"Red,Blue,Green",10,https://example.com/image.jpg,Electronics,SKU001,Sample product description
Another Product,49.99,50,"Small,Medium,Large",15,https://example.com/image2.jpg,Clothing,SKU002,Another sample product`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const deleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setProducts(prev => prev.filter(p => p.id !== productId));
        toast({
          title: "Product Deleted",
          description: "Product removed from inventory",
        });
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Unable to delete product",
        variant: "destructive"
      });
    }
  };

  const categories = Array.isArray(products) ? Array.from(new Set(products.map(p => p.category).filter(Boolean))) : [];
  const lowStockProducts = Array.isArray(products) ? products.filter(p => p.quantity < 10) : [];
  const totalValue = Array.isArray(products) ? products.reduce((sum, p) => sum + (p.price * p.quantity), 0) : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-600 flex items-center">
            <Package className="h-8 w-8 mr-3" />
            Retailer Inventory Manager
          </h1>
          <p className="text-gray-600 mt-2">Manage your product inventory with bulk upload capabilities</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-blue-600">{products.length}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Inventory Value</p>
                  <p className="text-2xl font-bold text-green-600">${totalValue.toLocaleString()}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                  <p className="text-2xl font-bold text-orange-600">{lowStockProducts.length}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Categories</p>
                  <p className="text-2xl font-bold text-purple-600">{categories.length}</p>
                </div>
                <Filter className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="inventory" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="inventory">Product Inventory</TabsTrigger>
            <TabsTrigger value="upload">Bulk Upload</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bulk Inventory Upload</CardTitle>
                <CardDescription>Upload CSV or Excel files to add multiple products at once</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label htmlFor="csv-upload">Select CSV/Excel File</Label>
                    <Input
                      id="csv-upload"
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                      disabled={isUploading}
                    />
                    {csvFile && (
                      <p className="text-sm text-gray-600">
                        Selected: {csvFile.name} ({(csvFile.size / 1024).toFixed(1)} KB)
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <Label>Actions</Label>
                    <div className="space-y-2">
                      <Button 
                        onClick={handleFileUpload} 
                        disabled={!csvFile || isUploading}
                        className="w-full"
                      >
                        {isUploading ? (
                          <>
                            <Upload className="h-4 w-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Inventory
                          </>
                        )}
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        onClick={downloadTemplate}
                        className="w-full"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Template
                      </Button>
                    </div>
                  </div>
                </div>

                {uploadStats && (
                  <div className="border rounded-lg p-4 bg-blue-50">
                    <h4 className="font-semibold mb-2">Upload Results</h4>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Total Rows:</span> {uploadStats.totalRows}
                      </div>
                      <div>
                        <span className="font-medium">Successful:</span> {uploadStats.successfulUploads}
                      </div>
                      <div>
                        <span className="font-medium">Errors:</span> {uploadStats.errors.length}
                      </div>
                    </div>
                    {uploadStats.errors.length > 0 && (
                      <div className="mt-3">
                        <h5 className="font-medium text-red-600">Errors:</h5>
                        <ul className="text-sm text-red-600 list-disc list-inside">
                          {uploadStats.errors.slice(0, 5).map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                          {uploadStats.errors.length > 5 && (
                            <li>... and {uploadStats.errors.length - 5} more errors</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search products by name or SKU..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-48">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="all">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Products Table */}
            <Card>
              <CardHeader>
                <CardTitle>Product Inventory ({filteredProducts.length} items)</CardTitle>
                <CardDescription>Manage your product listings and stock levels</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 mx-auto text-gray-400 mb-4 animate-spin" />
                    <p className="text-gray-600">Loading inventory...</p>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">No products found</p>
                    <p className="text-sm text-gray-500 mt-2">Upload a CSV file or add products manually</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="text-left p-3 font-semibold">Product</th>
                          <th className="text-left p-3 font-semibold">Price</th>
                          <th className="text-left p-3 font-semibold">Stock</th>
                          <th className="text-left p-3 font-semibold">Variants</th>
                          <th className="text-left p-3 font-semibold">Discount</th>
                          <th className="text-left p-3 font-semibold">Image</th>
                          <th className="text-left p-3 font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.map((product) => (
                          <tr key={product.id} className="border-b hover:bg-gray-50">
                            <td className="p-3">
                              <div>
                                <p className="font-medium">{product.name}</p>
                                {product.sku && <p className="text-sm text-gray-500">SKU: {product.sku}</p>}
                                {product.category && (
                                  <Badge variant="outline" className="mt-1 text-xs">
                                    {product.category}
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="p-3">
                              <span className="font-semibold">${product.price.toFixed(2)}</span>
                            </td>
                            <td className="p-3">
                              <Badge 
                                variant={product.quantity < 10 ? "destructive" : "default"}
                                className={product.quantity < 10 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}
                              >
                                {product.quantity}
                              </Badge>
                            </td>
                            <td className="p-3">
                              {product.variants && product.variants.length > 0 ? (
                                <div className="text-sm">
                                  {product.variants.slice(0, 2).join(', ')}
                                  {product.variants.length > 2 && ` +${product.variants.length - 2} more`}
                                </div>
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
                            </td>
                            <td className="p-3">
                              {product.discount ? (
                                <Badge variant="outline" className="bg-orange-100 text-orange-800">
                                  {product.discount}%
                                </Badge>
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
                            </td>
                            <td className="p-3">
                              {product.imageUrl ? (
                                <img 
                                  src={product.imageUrl} 
                                  alt={product.name}
                                  className="w-12 h-12 object-cover rounded border"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gray-200 rounded border flex items-center justify-center">
                                  <Package className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                            </td>
                            <td className="p-3">
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {/* TODO: Edit functionality */}}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => deleteProduct(product.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}