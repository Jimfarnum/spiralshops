import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Store, ShoppingCart, FileText, CheckCircle, Database, Download } from 'lucide-react';

export default function RetailerOnboardingDemo() {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [shopifyConnected, setShopifyConnected] = useState(false);
  const [squareConnected, setSquareConnected] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // CSV Upload mutation
  const csvUploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/retailer-onboarding/csv-upload', {
        method: 'POST',
        body: formData,
      });
      return response.json();
    },
    onSuccess: () => {
      setUploadProgress(100);
    },
  });

  // Shopify connection mutation
  const shopifyConnectMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/retailer-onboarding/shopify-connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopifyDomain: 'demo-store.myshopify.com' }),
      });
      return response.json();
    },
    onSuccess: () => {
      setShopifyConnected(true);
    },
  });

  // Square connection mutation  
  const squareConnectMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/retailer-onboarding/square-connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: 'demo-app-id' }),
      });
      return response.json();
    },
    onSuccess: () => {
      setSquareConnected(true);
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCsvFile(file);
    }
  };

  const handleCsvUpload = () => {
    if (csvFile) {
      csvUploadMutation.mutate(csvFile);
      // Simulate progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            <Store className="inline-block w-10 h-10 text-green-600 mr-3" />
            Retailer Auto-Onboarding Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Streamlined retailer onboarding with CSV import, Shopify OAuth, and Square POS synchronization
          </p>
        </div>

        {/* Onboarding Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Onboarding Progress</CardTitle>
            <CardDescription>Complete setup in 3 simple steps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${onboardingStep >= 1 ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                  1
                </div>
                <span className={onboardingStep >= 1 ? 'text-green-600' : 'text-gray-400'}>Business Info</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${onboardingStep >= 2 ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                  2
                </div>
                <span className={onboardingStep >= 2 ? 'text-green-600' : 'text-gray-400'}>Product Import</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${onboardingStep >= 3 ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                  3
                </div>
                <span className={onboardingStep >= 3 ? 'text-green-600' : 'text-gray-400'}>Platform Integration</span>
              </div>
            </div>
            <Progress value={(onboardingStep / 3) * 100} className="h-2" />
          </CardContent>
        </Card>

        <Tabs defaultValue="csv-import" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="csv-import">CSV Import</TabsTrigger>
            <TabsTrigger value="shopify">Shopify Integration</TabsTrigger>
            <TabsTrigger value="square">Square POS</TabsTrigger>
            <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
          </TabsList>

          <TabsContent value="csv-import">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Upload className="w-6 h-6 mr-2" />
                    CSV Product Upload
                  </CardTitle>
                  <CardDescription>
                    Bulk import your product catalog with a CSV file
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Drag and drop your CSV file here, or click to browse</p>
                    <Input
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="max-w-xs mx-auto"
                    />
                  </div>
                  
                  {csvFile && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-blue-600 mr-2" />
                          <span className="font-medium">{csvFile.name}</span>
                        </div>
                        <Badge variant="outline">{(csvFile.size / 1024).toFixed(1)} KB</Badge>
                      </div>
                      
                      {uploadProgress > 0 && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Upload Progress</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <Progress value={uploadProgress} className="h-2" />
                        </div>
                      )}
                      
                      <Button 
                        onClick={handleCsvUpload} 
                        disabled={csvUploadMutation.isPending}
                        className="w-full"
                      >
                        {csvUploadMutation.isPending ? 'Uploading...' : 'Upload Products'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>CSV Format Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Required Columns:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• product_id (unique identifier)</li>
                        <li>• title (product name)</li>
                        <li>• description (product details)</li>
                        <li>• price (numeric value)</li>
                        <li>• stock (inventory count)</li>
                        <li>• category (product category)</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Optional Columns:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• image_url (product image)</li>
                        <li>• weight (shipping weight)</li>
                        <li>• brand (manufacturer)</li>
                        <li>• tags (searchable keywords)</li>
                      </ul>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download Sample CSV
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="shopify">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="w-6 h-6 mr-2" />
                  Shopify Integration
                </CardTitle>
                <CardDescription>
                  Connect your Shopify store to sync products automatically
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Shopify Store URL</label>
                      <Input placeholder="your-store.myshopify.com" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">API Key</label>
                      <Input type="password" placeholder="Enter your API key" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">API Secret</label>
                      <Input type="password" placeholder="Enter your API secret" />
                    </div>
                    
                    <Button 
                      onClick={() => shopifyConnectMutation.mutate()}
                      disabled={shopifyConnectMutation.isPending}
                      className="w-full"
                    >
                      {shopifyConnectMutation.isPending ? 'Connecting...' : 'Connect Shopify Store'}
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold">Integration Benefits:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        Automatic product synchronization
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        Real-time inventory updates
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        Order management integration
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        Customer data synchronization
                      </li>
                    </ul>
                    
                    {shopifyConnected && (
                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                          <span className="font-medium text-green-800">Shopify Connected!</span>
                        </div>
                        <p className="text-sm text-green-600 mt-1">
                          Your store is now syncing with SPIRAL
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="square">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="w-6 h-6 mr-2" />
                  Square POS Integration
                </CardTitle>
                <CardDescription>
                  Sync your Square POS system with SPIRAL inventory
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Application ID</label>
                      <Input placeholder="Enter Square Application ID" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Access Token</label>
                      <Input type="password" placeholder="Enter access token" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Location ID</label>
                      <Input placeholder="Enter location ID" />
                    </div>
                    
                    <Button 
                      onClick={() => squareConnectMutation.mutate()}
                      disabled={squareConnectMutation.isPending}
                      className="w-full"
                    >
                      {squareConnectMutation.isPending ? 'Connecting...' : 'Connect Square POS'}
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold">Square POS Features:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        Real-time inventory tracking
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        In-store and online sync
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        Payment processing integration
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        Customer analytics sharing
                      </li>
                    </ul>
                    
                    {squareConnected && (
                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                          <span className="font-medium text-green-800">Square POS Connected!</span>
                        </div>
                        <p className="text-sm text-green-600 mt-1">
                          Your POS system is now integrated
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Onboarding Checklist</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Business Information</span>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Product Catalog Upload</span>
                      <Badge variant={csvFile ? "default" : "secondary"}>
                        {csvFile ? "Complete" : "Pending"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Shopify Integration</span>
                      <Badge variant={shopifyConnected ? "default" : "secondary"}>
                        {shopifyConnected ? "Connected" : "Not Connected"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Square POS Integration</span>
                      <Badge variant={squareConnected ? "default" : "secondary"}>
                        {squareConnected ? "Connected" : "Not Connected"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Payment Setup</span>
                      <Badge variant="outline">Recommended</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Next Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold">1. Complete Product Import</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Upload your product catalog via CSV or connect your existing store
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold">2. Configure Payment Processing</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Set up Stripe integration for seamless payment handling
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold">3. Launch Your Store</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Go live on SPIRAL and start reaching local customers
                      </p>
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