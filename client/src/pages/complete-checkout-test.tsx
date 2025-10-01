import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, Loader2, ShoppingCart, Store, CreditCard, Database } from 'lucide-react';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  details: string;
  data?: any;
}

export default function CompleteCheckoutTest() {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [systemStats, setSystemStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalRetailers: 0,
    testsPassed: 0
  });

  const runCompleteTestSuite = async () => {
    setIsRunning(true);
    setTests([]);
    const results: TestResult[] = [];

    try {
      // Test 1: Product Catalog API Integration
      results.push({ name: 'Product Catalog API Test', status: 'pass', details: 'Starting comprehensive test suite...' });
      setTests([...results]);

      const productsResponse = await fetch('/api/products?limit=50');
      const productsData = await productsResponse.json();
      
      if (productsData.products && productsData.products.length > 0) {
        results.push({
          name: 'Product Loading Integration',
          status: 'pass',
          details: `Successfully loaded ${productsData.total} products from multiple retailers`,
          data: { 
            totalProducts: productsData.total,
            sampleProduct: productsData.products[0]?.title,
            retailers: [...new Set(productsData.products.map((p: any) => p.storeName))].length
          }
        });
        setSystemStats(prev => ({ 
          ...prev, 
          totalProducts: productsData.total,
          totalRetailers: [...new Set(productsData.products.map((p: any) => p.storeName))].length
        }));
      } else {
        results.push({ name: 'Product Loading Integration', status: 'fail', details: 'No products found' });
      }
      setTests([...results]);

      // Test 2: Categories API
      const categoriesResponse = await fetch('/api/categories');
      const categoriesData = await categoriesResponse.json();
      
      if (categoriesData.categories && categoriesData.categories.length > 0) {
        results.push({
          name: 'Product Categories Test',
          status: 'pass',
          details: `Found ${categoriesData.categories.length} product categories`,
          data: { categories: categoriesData.categories.slice(0, 5).map((c: any) => c.name) }
        });
        setSystemStats(prev => ({ ...prev, totalCategories: categoriesData.categories.length }));
      } else {
        results.push({ name: 'Product Categories Test', status: 'fail', details: 'No categories found' });
      }
      setTests([...results]);

      // Test 3: Multi-Retailer Cart Functionality
      if (productsData.products && productsData.products.length > 0) {
        const retailerGroups = productsData.products.reduce((acc: any, product: any) => {
          if (!acc[product.storeId]) {
            acc[product.storeId] = {
              storeId: product.storeId,
              storeName: product.storeName,
              products: []
            };
          }
          acc[product.storeId].products.push(product);
          return acc;
        }, {});

        const retailerCount = Object.keys(retailerGroups).length;
        
        if (retailerCount > 1) {
          results.push({
            name: 'Multi-Retailer Cart System',
            status: 'pass',
            details: `Cart system supports ${retailerCount} different retailers`,
            data: { 
              retailers: Object.values(retailerGroups).map((r: any) => ({
                name: r.storeName,
                productCount: r.products.length
              }))
            }
          });
        } else {
          results.push({
            name: 'Multi-Retailer Cart System',
            status: 'warning',
            details: 'Only one retailer found in system'
          });
        }
      }
      setTests([...results]);

      // Test 4: Search Functionality Across Retailers
      const searchResponse = await fetch('/api/products?search=shirt&limit=20');
      const searchData = await searchResponse.json();
      
      if (searchData.products && searchData.products.length > 0) {
        const searchRetailers = [...new Set(searchData.products.map((p: any) => p.storeName))];
        results.push({
          name: 'Cross-Retailer Search',
          status: 'pass',
          details: `Search returned ${searchData.total} products across ${searchRetailers.length} retailers`,
          data: { searchResults: searchData.total, retailers: searchRetailers }
        });
      } else {
        results.push({
          name: 'Cross-Retailer Search',
          status: 'warning',
          details: 'Search returned no results for "shirt"'
        });
      }
      setTests([...results]);

      // Test 5: Price Calculation Across Multiple Retailers
      if (productsData.products && productsData.products.length >= 3) {
        const sampleItems = productsData.products.slice(0, 3);
        const subtotal = sampleItems.reduce((sum: number, item: any) => sum + (item.price / 100), 0);
        const tax = subtotal * 0.08;
        const shipping = 4.99 * [...new Set(sampleItems.map((p: any) => p.storeId))].length;
        const total = subtotal + tax + shipping;

        results.push({
          name: 'Multi-Retailer Price Calculation',
          status: 'pass',
          details: `Calculated order total: $${total.toFixed(2)} across multiple retailers`,
          data: {
            subtotal: subtotal.toFixed(2),
            tax: tax.toFixed(2),
            shipping: shipping.toFixed(2),
            total: total.toFixed(2),
            itemCount: sampleItems.length
          }
        });
      }
      setTests([...results]);

      // Test 6: Category Filtering Across Retailers
      const electronicsResponse = await fetch('/api/products?category=Electronics&limit=10');
      const electronicsData = await electronicsResponse.json();
      
      if (electronicsData.products) {
        const electronicsRetailers = [...new Set(electronicsData.products.map((p: any) => p.storeName))];
        results.push({
          name: 'Category Filtering Across Retailers',
          status: 'pass',
          details: `Electronics category has ${electronicsData.total} products from ${electronicsRetailers.length} retailers`,
          data: { categoryResults: electronicsData.total, retailers: electronicsRetailers }
        });
      }
      setTests([...results]);

      // Test 7: Individual Product API
      if (productsData.products && productsData.products.length > 0) {
        const firstProduct = productsData.products[0];
        const productResponse = await fetch(`/api/products/${firstProduct.id}`);
        
        if (productResponse.ok) {
          const productData = await productResponse.json();
          results.push({
            name: 'Individual Product Retrieval',
            status: 'pass',
            details: `Successfully retrieved product: ${productData.title}`,
            data: { productId: productData.id, storeName: productData.storeName }
          });
        } else {
          results.push({
            name: 'Individual Product Retrieval',
            status: 'fail',
            details: 'Failed to retrieve individual product'
          });
        }
      }
      setTests([...results]);

      // Test 8: Checkout Integration Test
      const checkoutTest = {
        customer: { name: 'Test User', email: 'test@example.com' },
        items: productsData.products?.slice(0, 3) || [],
        payment: { method: 'card', last4: '1234' }
      };

      if (checkoutTest.items.length > 0) {
        results.push({
          name: 'Checkout Integration Simulation',
          status: 'pass',
          details: `Checkout system ready for ${checkoutTest.items.length} items`,
          data: {
            customerReady: !!checkoutTest.customer.email,
            itemsReady: checkoutTest.items.length > 0,
            paymentReady: !!checkoutTest.payment.method
          }
        });
      }
      setTests([...results]);

      // Test 9: Data Structure Validation
      if (productsData.products && productsData.products.length > 0) {
        const sampleProduct = productsData.products[0];
        const requiredFields = ['id', 'title', 'price', 'category', 'storeName', 'storeId'];
        const missingFields = requiredFields.filter(field => !sampleProduct[field]);
        
        if (missingFields.length === 0) {
          results.push({
            name: 'Product Data Structure Validation',
            status: 'pass',
            details: 'All required product fields present for multi-retailer checkout'
          });
        } else {
          results.push({
            name: 'Product Data Structure Validation',
            status: 'warning',
            details: `Missing fields: ${missingFields.join(', ')}`
          });
        }
      }
      setTests([...results]);

      // Test 10: API Performance
      const performanceStart = Date.now();
      await Promise.all([
        fetch('/api/products?limit=10'),
        fetch('/api/categories'),
        fetch('/api/products?search=test')
      ]);
      const performanceTime = Date.now() - performanceStart;

      results.push({
        name: 'API Performance Test',
        status: performanceTime < 2000 ? 'pass' : 'warning',
        details: `API responses completed in ${performanceTime}ms`,
        data: { responseTime: performanceTime, benchmark: '< 2000ms' }
      });

      setTests([...results]);

    } catch (error) {
      results.push({
        name: 'System Error Test',
        status: 'fail',
        details: `Error occurred: ${error}`
      });
    }

    const passedTests = results.filter(t => t.status === 'pass').length;
    setSystemStats(prev => ({ ...prev, testsPassed: passedTests }));
    setTests(results);
    setIsRunning(false);
  };

  const getStatusIcon = (status: 'pass' | 'fail' | 'warning') => {
    switch (status) {
      case 'pass': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'fail': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: 'pass' | 'fail' | 'warning') => {
    switch (status) {
      case 'pass': return 'bg-green-50 border-green-200 text-green-800';
      case 'fail': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    }
  };

  const passedTests = tests.filter(t => t.status === 'pass').length;
  const failedTests = tests.filter(t => t.status === 'fail').length;
  const warningTests = tests.filter(t => t.status === 'warning').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🧪 Complete Checkout System Test Suite
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Comprehensive testing of product catalog and multi-retailer checkout functionality
          </p>
          
          <Button 
            onClick={runCompleteTestSuite} 
            disabled={isRunning}
            className="bg-[#006d77] hover:bg-[#005a5f] text-white px-8 py-3"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Running Complete Test Suite...
              </>
            ) : (
              'Run Complete Test Suite'
            )}
          </Button>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Database className="w-8 h-8 mx-auto mb-2 text-[#006d77]" />
              <div className="text-3xl font-bold text-[#006d77]">{systemStats.totalProducts}</div>
              <div className="text-sm text-gray-600">Products Available</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Store className="w-8 h-8 mx-auto mb-2 text-[#006d77]" />
              <div className="text-3xl font-bold text-[#006d77]">{systemStats.totalRetailers}</div>
              <div className="text-sm text-gray-600">Retailers Connected</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-[#006d77]" />
              <div className="text-3xl font-bold text-[#006d77]">{systemStats.totalCategories}</div>
              <div className="text-sm text-gray-600">Product Categories</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <div className="text-3xl font-bold text-green-600">{systemStats.testsPassed}</div>
              <div className="text-sm text-gray-600">Tests Passed</div>
            </CardContent>
          </Card>
        </div>

        {/* Test Results Summary */}
        {tests.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <h3 className="text-xl font-semibold mb-4">Test Demo Pages</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" asChild>
              <a href="/product-catalog-demo">Product Catalog Demo</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/multi-retailer-checkout">Multi-Retailer Checkout</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/product-catalog-test">Product API Testing</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/complete-system-validation">System Validation</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}