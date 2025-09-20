import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Package, CheckCircle, XCircle, AlertCircle, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Product {
  _id: string;
  title: string;
  price: number;
  category: string;
  store: string;
  description?: string;
  image?: string;
}

interface CategoryTestResult {
  category: string;
  expectedCount: number;
  actualCount: number;
  passed: boolean;
  products: Product[];
}

interface SearchTestResult {
  query: string;
  expectedResults: number;
  actualResults: number;
  passed: boolean;
  products: Product[];
}

const EXPECTED_CATEGORIES = [
  'Electronics',
  'Home & Garden', 
  'Clothing & Accessories',
  'Books & Media',
  'Health & Beauty',
  'Sports & Outdoors'
];

const SEARCH_TEST_CASES = [
  { query: 'headphones', category: 'Electronics', minResults: 1 },
  { query: 'phone', category: 'Electronics', minResults: 1 },
  { query: 'laptop', category: 'Electronics', minResults: 1 },
  { query: 'plant', category: 'Home & Garden', minResults: 1 },
  { query: 'cutting board', category: 'Home & Garden', minResults: 1 },
  { query: 'shirt', category: 'Clothing & Accessories', minResults: 1 },
  { query: 'wallet', category: 'Clothing & Accessories', minResults: 1 },
  { query: 'book', category: 'Books & Media', minResults: 1 },
  { query: 'moisturizer', category: 'Health & Beauty', minResults: 1 },
  { query: 'bottle', category: 'Sports & Outdoors', minResults: 1 }
];

export default function ProductCategoryTest() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryResults, setCategoryResults] = useState<CategoryTestResult[]>([]);
  const [searchResults, setSearchResults] = useState<SearchTestResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      
      if (data.products) {
        setProducts(data.products);
        setFilteredProducts(data.products);
        console.log('Loaded products:', data.products);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      toast({
        title: "Error Loading Products",
        description: "Could not fetch product data",
        variant: "destructive"
      });
    }
  };

  const runCategoryTests = async () => {
    setLoading(true);
    const results: CategoryTestResult[] = [];

    for (const category of EXPECTED_CATEGORIES) {
      try {
        const response = await fetch(`/api/products?category=${encodeURIComponent(category)}`);
        const data = await response.json();
        
        const categoryProducts = data.products || [];
        const expectedCount = getCategoryExpectedCount(category);
        
        results.push({
          category,
          expectedCount,
          actualCount: categoryProducts.length,
          passed: categoryProducts.length >= expectedCount,
          products: categoryProducts.slice(0, 3) // Show first 3 for preview
        });
      } catch (error) {
        results.push({
          category,
          expectedCount: 0,
          actualCount: 0,
          passed: false,
          products: []
        });
      }
    }

    setCategoryResults(results);
    setLoading(false);

    const passedTests = results.filter(r => r.passed).length;
    toast({
      title: "Category Tests Complete",
      description: `${passedTests}/${results.length} categories passed validation`,
      variant: passedTests === results.length ? "default" : "destructive"
    });
  };

  const runSearchTests = async () => {
    setLoading(true);
    const results: SearchTestResult[] = [];

    for (const testCase of SEARCH_TEST_CASES) {
      try {
        const response = await fetch(`/api/products?search=${encodeURIComponent(testCase.query)}`);
        const data = await response.json();
        
        const searchProducts = data.products || [];
        
        results.push({
          query: testCase.query,
          expectedResults: testCase.minResults,
          actualResults: searchProducts.length,
          passed: searchProducts.length >= testCase.minResults,
          products: searchProducts.slice(0, 3) // Show first 3 for preview
        });
      } catch (error) {
        results.push({
          query: testCase.query,
          expectedResults: testCase.minResults,
          actualResults: 0,
          passed: false,
          products: []
        });
      }
    }

    setSearchResults(results);
    setLoading(false);

    const passedTests = results.filter(r => r.passed).length;
    toast({
      title: "Search Tests Complete",
      description: `${passedTests}/${results.length} search queries passed validation`,
      variant: passedTests === results.length ? "default" : "destructive"
    });
  };

  const getCategoryExpectedCount = (category: string): number => {
    // Based on the sample data, each category should have at least 5 products
    return 5;
  };

  const handleLiveSearch = async () => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
      return;
    }

    try {
      const response = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setFilteredProducts(data.products || []);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleCategoryFilter = async () => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
      return;
    }

    try {
      const response = await fetch(`/api/products?category=${encodeURIComponent(selectedCategory)}`);
      const data = await response.json();
      setFilteredProducts(data.products || []);
    } catch (error) {
      console.error('Filter error:', error);
    }
  };

  useEffect(() => {
    handleLiveSearch();
  }, [searchQuery]);

  useEffect(() => {
    handleCategoryFilter();
  }, [selectedCategory]);

  const getUniqueCategories = (): string[] => {
    const categories = [...new Set(products.map(p => p.category))];
    return categories.sort();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Package className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Product Category & Search Testing</h1>
          </div>
          <p className="text-xl text-gray-600 mb-4">
            Comprehensive testing suite for product categorization and search functionality
          </p>
          <Badge variant="outline" className="text-sm bg-blue-50 text-blue-800 border-blue-200">
            Total Products Loaded: {products.length}
          </Badge>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Category Tests</TabsTrigger>
            <TabsTrigger value="search">Search Tests</TabsTrigger>
            <TabsTrigger value="live">Live Testing</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Product Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">{products.length}</div>
                      <div className="text-sm text-gray-600">Total Products</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-semibold text-green-600">{getUniqueCategories().length}</div>
                      <div className="text-sm text-gray-600">Categories Found</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Categories Available</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {getUniqueCategories().map((category) => (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-sm">{category}</span>
                        <Badge variant="secondary" size="sm">
                          {products.filter(p => p.category === category).length}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Test Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={runCategoryTests}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? 'Testing...' : 'Run Category Tests'}
                  </Button>
                  <Button 
                    onClick={runSearchTests}
                    disabled={loading}
                    className="w-full"
                    variant="outline"
                  >
                    {loading ? 'Testing...' : 'Run Search Tests'}
                  </Button>
                  <Button 
                    onClick={loadProducts}
                    variant="secondary"
                    className="w-full"
                  >
                    Reload Products
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Category Validation Results</h2>
              <Button onClick={runCategoryTests} disabled={loading}>
                {loading ? 'Testing...' : 'Run Category Tests'}
              </Button>
            </div>

            {categoryResults.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryResults.map((result) => (
                  <Card key={result.category} className={result.passed ? 'border-green-200' : 'border-red-200'}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="text-lg">{result.category}</span>
                        {result.passed ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Expected: {result.expectedCount}+</span>
                          <span>Found: {result.actualCount}</span>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">Sample Products:</div>
                          {result.products.slice(0, 2).map((product, idx) => (
                            <div key={idx} className="text-xs text-gray-600 truncate">
                              • {product.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="search" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Search Functionality Results</h2>
              <Button onClick={runSearchTests} disabled={loading}>
                {loading ? 'Testing...' : 'Run Search Tests'}
              </Button>
            </div>

            {searchResults.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchResults.map((result) => (
                  <Card key={result.query} className={result.passed ? 'border-green-200' : 'border-red-200'}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="text-lg">"{result.query}"</span>
                        {result.passed ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Expected: {result.expectedResults}+</span>
                          <span>Found: {result.actualResults}</span>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">Matching Products:</div>
                          {result.products.slice(0, 2).map((product, idx) => (
                            <div key={idx} className="text-xs text-gray-600 truncate">
                              • {product.title} ({product.category})
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="live" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Live Product Search & Filter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <div className="flex-1">
                    <Label htmlFor="search">Search Products</Label>
                    <Input
                      id="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by product name, description..."
                      className="mt-1"
                    />
                  </div>
                  <div className="w-64">
                    <Label htmlFor="category">Filter by Category</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {getUniqueCategories().map((category) => (
                          <SelectItem key={category} value={category}>
                            {category} ({products.filter(p => p.category === category).length})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">
                      {filteredProducts.length} products found
                    </Badge>
                    {searchQuery && (
                      <Badge variant="secondary">
                        Search: "{searchQuery}"
                      </Badge>
                    )}
                    {selectedCategory !== 'all' && (
                      <Badge variant="secondary">
                        Category: {selectedCategory}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <Card key={product._id} className="border-gray-200">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="font-medium text-sm truncate">{product.title}</div>
                          <div className="flex justify-between items-center">
                            <Badge variant="outline" className="text-xs">
                              {product.category}
                            </Badge>
                            <span className="font-bold text-green-600">${product.price}</span>
                          </div>
                          <div className="text-xs text-gray-500">{product.store}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <div className="text-lg font-medium">No products found</div>
                    <div className="text-sm">Try adjusting your search or filter criteria</div>
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