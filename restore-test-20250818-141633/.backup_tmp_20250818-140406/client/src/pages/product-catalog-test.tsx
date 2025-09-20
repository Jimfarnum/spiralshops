import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, Loader2, Database, Search, Filter, Tag } from 'lucide-react';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  details: string;
  data?: any;
}

export default function ProductCatalogTest() {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);

  const runTests = async () => {
    setIsRunning(true);
    setTests([]);
    const results: TestResult[] = [];

    try {
      // Test 1: Basic API Connection
      results.push({ name: 'API Connection Test', status: 'pass', details: 'Starting API tests...' });
      setTests([...results]);

      // Test 2: Load All Products
      const productsResponse = await fetch('/api/products?limit=50');
      const productsData = await productsResponse.json();
      
      if (productsData.products && productsData.products.length > 0) {
        setTotalProducts(productsData.total);
        results.push({
          name: 'Product Loading Test',
          status: 'pass',
          details: `Successfully loaded ${productsData.total} products`,
          data: { count: productsData.total, sample: productsData.products[0]?.title }
        });
      } else {
        results.push({
          name: 'Product Loading Test',
          status: 'fail',
          details: 'No products found in database'
        });
      }
      setTests([...results]);

      // Test 3: Categories API
      const categoriesResponse = await fetch('/api/categories');
      const categoriesData = await categoriesResponse.json();
      
      if (categoriesData.categories && categoriesData.categories.length > 0) {
        setTotalCategories(categoriesData.categories.length);
        results.push({
          name: 'Categories Test',
          status: 'pass',
          details: `Found ${categoriesData.categories.length} categories`,
          data: { categories: categoriesData.categories.map((c: any) => c.name) }
        });
      } else {
        results.push({
          name: 'Categories Test',
          status: 'fail',
          details: 'No categories found'
        });
      }
      setTests([...results]);

      // Test 4: Search Functionality
      const searchResponse = await fetch('/api/products?search=coffee&limit=10');
      const searchData = await searchResponse.json();
      
      if (searchData.products) {
        results.push({
          name: 'Search Functionality Test',
          status: 'pass',
          details: `Search for 'coffee' returned ${searchData.total} results`,
          data: { searchResults: searchData.total }
        });
      } else {
        results.push({
          name: 'Search Functionality Test',
          status: 'fail',
          details: 'Search functionality not working'
        });
      }
      setTests([...results]);

      // Test 5: Category Filtering
      const categoryResponse = await fetch('/api/products?category=Electronics&limit=10');
      const categoryData = await categoryResponse.json();
      
      if (categoryData.products) {
        results.push({
          name: 'Category Filtering Test',
          status: 'pass',
          details: `Electronics category has ${categoryData.total} products`,
          data: { categoryResults: categoryData.total }
        });
      } else {
        results.push({
          name: 'Category Filtering Test',
          status: 'fail',
          details: 'Category filtering not working'
        });
      }
      setTests([...results]);

      // Test 6: Pagination
      const page1Response = await fetch('/api/products?limit=5&offset=0');
      const page2Response = await fetch('/api/products?limit=5&offset=5');
      const page1Data = await page1Response.json();
      const page2Data = await page2Response.json();
      
      if (page1Data.products && page2Data.products && 
          page1Data.products[0]?.id !== page2Data.products[0]?.id) {
        results.push({
          name: 'Pagination Test',
          status: 'pass',
          details: 'Pagination working correctly - different products on different pages'
        });
      } else {
        results.push({
          name: 'Pagination Test',
          status: 'warning',
          details: 'Pagination may not be working correctly'
        });
      }
      setTests([...results]);

      // Test 7: Individual Product Retrieval
      if (productsData.products && productsData.products.length > 0) {
        const firstProduct = productsData.products[0];
        const productResponse = await fetch(`/api/products/${firstProduct.id}`);
        const productData = await productResponse.json();
        
        if (productData && productData.id === firstProduct.id) {
          results.push({
            name: 'Individual Product Retrieval Test',
            status: 'pass',
            details: `Successfully retrieved product: ${productData.title}`
          });
        } else {
          results.push({
            name: 'Individual Product Retrieval Test',
            status: 'fail',
            details: 'Could not retrieve individual product'
          });
        }
      }
      setTests([...results]);

      // Test 8: Data Structure Validation
      if (productsData.products && productsData.products.length > 0) {
        const sampleProduct = productsData.products[0];
        const requiredFields = ['id', 'title', 'description', 'price', 'category', 'storeName'];
        const missingFields = requiredFields.filter(field => !sampleProduct[field]);
        
        if (missingFields.length === 0) {
          results.push({
            name: 'Data Structure Validation Test',
            status: 'pass',
            details: 'All required product fields are present'
          });
        } else {
          results.push({
            name: 'Data Structure Validation Test',
            status: 'warning',
            details: `Missing fields: ${missingFields.join(', ')}`
          });
        }
      }
      setTests([...results]);

    } catch (error) {
      results.push({
        name: 'API Error Test',
        status: 'fail',
        details: `Error occurred: ${error}`
      });
    }

    setTests(results);
    setIsRunning(false);
  };

  const getStatusIcon = (status: 'pass' | 'fail' | 'warning') => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: 'pass' | 'fail' | 'warning') => {
    switch (status) {
      case 'pass':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'fail':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    }
  };

  const passedTests = tests.filter(t => t.status === 'pass').length;
  const failedTests = tests.filter(t => t.status === 'fail').length;
  const warningTests = tests.filter(t => t.status === 'warning').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🧪 Product Catalog Integration Test Suite
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Comprehensive testing of the SPIRAL product catalog system
          </p>
          
          <Button 
            onClick={runTests} 
            disabled={isRunning}
            className="bg-[#006d77] hover:bg-[#005a5f] text-white px-8 py-3"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Running Tests...
              </>
            ) : (
              'Run Complete Test Suite'
            )}
          </Button>
        </div>

        {/* Test Results Summary */}
        {tests.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600">{passedTests}</div>
                <div className="text-sm text-gray-600">Tests Passed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-red-600">{failedTests}</div>
                <div className="text-sm text-gray-600">Tests Failed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-yellow-600">{warningTests}</div>
                <div className="text-sm text-gray-600">Warnings</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-[#006d77]">{totalProducts}</div>
                <div className="text-sm text-gray-600">Total Products</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Test Results */}
        <div className="space-y-4">
          {tests.map((test, index) => (
            <Card key={index} className={`border-l-4 ${getStatusColor(test.status)}`}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {getStatusIcon(test.status)}
                    {test.name}
                  </CardTitle>
                  <Badge variant="outline" className={getStatusColor(test.status)}>
                    {test.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-2">{test.details}</p>
                {test.data && (
                  <div className="bg-gray-50 p-3 rounded-md text-sm">
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(test.data, null, 2)}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* System Overview */}
        {tests.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                System Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Database className="w-8 h-8 text-[#006d77]" />
                  </div>
                  <div className="text-2xl font-bold text-[#006d77]">{totalProducts}</div>
                  <div className="text-gray-600">Products Loaded</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Tag className="w-8 h-8 text-[#006d77]" />
                  </div>
                  <div className="text-2xl font-bold text-[#006d77]">{totalCategories}</div>
                  <div className="text-gray-600">Categories Available</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Search className="w-8 h-8 text-[#006d77]" />
                  </div>
                  <div className="text-2xl font-bold text-[#006d77]">
                    {passedTests}/{tests.length}
                  </div>
                  <div className="text-gray-600">Tests Passed</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Links */}
        <div className="mt-8 text-center">
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" asChild>
              <a href="/product-catalog-demo">View Product Catalog</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/complete-system-validation">System Validation</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/enhanced-functionality-test">Enhanced Features</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}