import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Download, RefreshCw as Sync, Database, Settings, BarChart3, Package, AlertCircle, CheckCircle, Clock, FileText } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface RetailerIntegration {
  id: number;
  integrationType: string;
  integrationName: string;
  syncFrequency: string;
  isActive: boolean;
  lastSyncAt: string;
  syncStatus: string;
}

interface RetailerProduct {
  id: number;
  sku: string;
  name: string;
  category: string;
  price: string;
  stockQuantity: number;
  isActive: boolean;
  syncStatus: string;
  lastSyncedAt: string;
}

interface ImportHistory {
  id: number;
  importType: string;
  fileName: string;
  totalRecords: number;
  successfulRecords: number;
  failedRecords: number;
  status: string;
  createdAt: string;
}

export default function RetailerDataManagement() {
  const [activeTab, setActiveTab] = useState('overview');
  const [retailerId, setRetailerId] = useState(1); // Default to first retailer
  const [integrations, setIntegrations] = useState<RetailerIntegration[]>([]);
  const [products, setProducts] = useState<RetailerProduct[]>([]);
  const [importHistory, setImportHistory] = useState<ImportHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  // Load retailer data
  useEffect(() => {
    loadRetailerData();
  }, [retailerId]);

  const loadRetailerData = async () => {
    setLoading(true);
    try {
      // Load integrations, products, and import history
      await Promise.all([
        loadIntegrations(),
        loadProducts(),
        loadImportHistory()
      ]);
    } catch (error) {
      console.error('Failed to load retailer data:', error);
    }
    setLoading(false);
  };

  const loadIntegrations = async () => {
    // Mock data for now - will be replaced with API call
    setIntegrations([
      {
        id: 1,
        integrationType: 'csv_upload',
        integrationName: 'CSV Upload',
        syncFrequency: 'manual',
        isActive: true,
        lastSyncAt: '2025-08-01T10:30:00Z',
        syncStatus: 'completed'
      }
    ]);
  };

  const loadProducts = async () => {
    try {
      const response = await fetch(`/api/retailer/${retailerId}/products`);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to load products:', error);
      setProducts([]);
    }
  };

  const loadImportHistory = async () => {
    // Mock data for now
    setImportHistory([
      {
        id: 1,
        importType: 'csv',
        fileName: 'products_2025_08_01.csv',
        totalRecords: 150,
        successfulRecords: 148,
        failedRecords: 2,
        status: 'completed',
        createdAt: '2025-08-01T10:30:00Z'
      }
    ]);
  };

  const handleFileUpload = async () => {
    if (!uploadFile) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('productFile', uploadFile);

    try {
      const response = await fetch(`/api/retailer/${retailerId}/products/upload`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`Upload successful: ${result.results.successful} products imported`);
        loadRetailerData();
      } else {
        alert(`Upload failed: ${result.message}`);
      }
    } catch (error) {
      alert('Upload failed. Please try again.');
    }
    setLoading(false);
    setUploadFile(null);
  };

  const setupIntegration = async (integrationType: string) => {
    const integrationConfig = {
      type: integrationType,
      name: integrationType === 'api' ? 'API Integration' : 'CSV Upload',
      syncFrequency: 'daily',
      fieldMappings: {
        sku: 'sku',
        name: 'product_name', 
        price: 'price',
        stock: 'quantity'
      },
      autoSync: true
    };

    try {
      const response = await fetch(`/api/retailer/${retailerId}/integration/setup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(integrationConfig)
      });

      const result = await response.json();
      if (result.success) {
        alert('Integration setup successful!');
        loadIntegrations();
      } else {
        alert(`Setup failed: ${result.message}`);
      }
    } catch (error) {
      alert('Integration setup failed. Please try again.');
    }
  };

  const syncProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/retailer/${retailerId}/products/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds: [] })
      });

      const result = await response.json();
      if (result.success) {
        alert(`Sync completed: ${result.syncedCount} products synced`);
        loadProducts();
      } else {
        alert(`Sync failed: ${result.message}`);
      }
    } catch (error) {
      alert('Sync failed. Please try again.');
    }
    setLoading(false);
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const variants: Record<string, any> = {
      completed: 'default',
      synced: 'default',
      pending: 'secondary',
      processing: 'secondary',
      error: 'destructive',
      failed: 'destructive'
    };

    const icons: Record<string, React.ReactElement> = {
      completed: <CheckCircle className="w-3 h-3" />,
      synced: <CheckCircle className="w-3 h-3" />,
      pending: <Clock className="w-3 h-3" />,
      processing: <Clock className="w-3 h-3" />,
      error: <AlertCircle className="w-3 h-3" />,
      failed: <AlertCircle className="w-3 h-3" />
    };

    return (
      <Badge variant={variants[status] || 'secondary'} className="flex items-center gap-1">
        {icons[status] || <Clock className="w-3 h-3" />}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Retailer Data Management</h1>
        <p className="text-gray-600 mt-2">
          Manage your product inventory and integrate with SPIRAL's platform
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full max-w-md">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{products.length}</div>
                <p className="text-xs text-muted-foreground">
                  {products.filter(p => p.isActive).length} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sync Status</CardTitle>
                <Sync className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Synced</div>
                <p className="text-xs text-muted-foreground">
                  Last sync: Today
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Integration</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Ready</div>
                <p className="text-xs text-muted-foreground">
                  CSV Upload Active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue Ready</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">100%</div>
                <p className="text-xs text-muted-foreground">
                  Platform ready
                </p>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Ready for Retailer Data Integration!</strong> Your SPIRAL platform is fully configured to receive and manage retailer inventory data. You can upload CSV files, set up API integrations, or manually add products. When you're ready to go live, all systems are prepared for seamless inventory management.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks for managing your retailer data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button onClick={() => setActiveTab('upload')} className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Products
                </Button>
                <Button onClick={syncProducts} variant="outline" className="flex items-center gap-2" disabled={loading}>
                  <Sync className="w-4 h-4" />
                  Sync Data
                </Button>
                <Button onClick={() => setActiveTab('integrations')} variant="outline" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Setup Integration
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Inventory</CardTitle>
              <CardDescription>Manage your product catalog and inventory levels</CardDescription>
            </CardHeader>
            <CardContent>
              {products.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No products yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Upload a CSV file or add products manually to get started.
                  </p>
                  <div className="mt-6">
                    <Button onClick={() => setActiveTab('upload')}>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Products
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Input placeholder="Search products..." className="w-64" />
                      <Select defaultValue="all">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={syncProducts} disabled={loading}>
                      <Sync className="w-4 h-4 mr-2" />
                      Sync All
                    </Button>
                  </div>
                  
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sync</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {products.map((product) => (
                          <tr key={product.id}>
                            <td className="px-4 py-3">
                              <div>
                                <div className="font-medium text-gray-900">{product.name}</div>
                                <div className="text-sm text-gray-500">{product.category}</div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">{product.sku}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">${product.price}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{product.stockQuantity}</td>
                            <td className="px-4 py-3">
                              <Badge variant={product.isActive ? 'default' : 'secondary'}>
                                {product.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              <StatusBadge status={product.syncStatus} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Product Data</CardTitle>
              <CardDescription>Upload CSV files to add or update your product inventory</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <Label htmlFor="file-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Upload a CSV file
                      </span>
                      <span className="mt-1 block text-sm text-gray-500">
                        or drag and drop
                      </span>
                    </Label>
                    <Input 
                      id="file-upload" 
                      type="file" 
                      accept=".csv"
                      className="hidden"
                      onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    />
                  </div>
                </div>
              </div>

              {uploadFile && (
                <Alert>
                  <FileText className="h-4 w-4" />
                  <AlertDescription>
                    Ready to upload: <strong>{uploadFile.name}</strong> ({(uploadFile.size / 1024).toFixed(1)} KB)
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-between items-center">
                <Button variant="outline" onClick={() => {
                  // Download CSV template
                  const csvContent = "sku,name,description,category,brand,price,stock,weight\nSAMPLE001,Sample Product,Sample description,Electronics,Sample Brand,29.99,100,1.5";
                  const blob = new Blob([csvContent], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'product_template.csv';
                  a.click();
                }}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Template
                </Button>
                
                <Button onClick={handleFileUpload} disabled={!uploadFile || loading}>
                  {loading ? 'Uploading...' : 'Upload Products'}
                </Button>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">CSV Format Requirements:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Required columns: sku, name, price</li>
                  <li>• Optional columns: description, category, brand, stock, weight</li>
                  <li>• Use UTF-8 encoding</li>
                  <li>• Maximum file size: 50MB</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Integration Settings</CardTitle>
              <CardDescription>Configure how your inventory data syncs with SPIRAL</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="text-lg">CSV Upload</CardTitle>
                    <CardDescription>Manual file upload for inventory updates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Status</span>
                        <StatusBadge status="completed" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Sync Type</span>
                        <span className="text-sm text-gray-600">Manual</span>
                      </div>
                      <Button 
                        onClick={() => setupIntegration('csv_upload')} 
                        variant="outline" 
                        className="w-full"
                      >
                        Configure CSV Upload
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-dashed">
                  <CardHeader>
                    <CardTitle className="text-lg">API Integration</CardTitle>
                    <CardDescription>Real-time sync with your POS or inventory system</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Status</span>
                        <Badge variant="secondary">Coming Soon</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Sync Type</span>
                        <span className="text-sm text-gray-600">Real-time</span>
                      </div>
                      <Button 
                        onClick={() => setupIntegration('api')} 
                        variant="outline" 
                        className="w-full"
                        disabled
                      >
                        Setup API Integration
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Import History</CardTitle>
              <CardDescription>Track your data import and sync activities</CardDescription>
            </CardHeader>
            <CardContent>
              {importHistory.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No import history</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Your import activities will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {importHistory.map((importRecord) => (
                    <div key={importRecord.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{importRecord.fileName}</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {importRecord.importType.toUpperCase()} import • {new Date(importRecord.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <StatusBadge status={importRecord.status} />
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                        <div>
                          <span className="text-gray-500">Total:</span>
                          <span className="ml-1 font-medium">{importRecord.totalRecords}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Success:</span>
                          <span className="ml-1 font-medium text-green-600">{importRecord.successfulRecords}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Failed:</span>
                          <span className="ml-1 font-medium text-red-600">{importRecord.failedRecords}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}