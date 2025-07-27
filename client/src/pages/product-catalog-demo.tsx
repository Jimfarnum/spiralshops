import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, ShoppingCart, Star, Package, Tag } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  inStock: boolean;
  stockLevel: number;
  ratings: {
    average: number;
    count: number;
  };
  spiralPoints: number;
  tags: string[];
  verified: boolean;
  imageUrl: string;
}

interface Category {
  name: string;
  count: number;
}

export default function ProductCatalogDemo() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const limit = 12;

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['/api/products', { 
      search: searchTerm, 
      category: selectedCategory, 
      limit, 
      offset: currentPage * limit 
    }],
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['/api/categories'],
  });

  const products = productsData?.products || [];
  const categories = categoriesData?.categories || [];
  const totalProducts = productsData?.total || 0;
  const hasMore = productsData?.pagination?.hasMore || false;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🌀 SPIRAL Product Catalog
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Discover Local Products with Authentic Data
          </p>
          <Badge variant="outline" className="text-sm bg-green-50 text-green-800 border-green-200">
            ✅ {totalProducts} Products Loaded Successfully
          </Badge>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="flex gap-2">
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" className="bg-[#006d77] hover:bg-[#005a5f] text-white">
                  Search
                </Button>
              </div>
            </form>
            
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories ({totalProducts})</SelectItem>
                {categories.map((category: Category) => (
                  <SelectItem key={category.name} value={category.name}>
                    {category.name} ({category.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Product Grid */}
        {productsLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#006d77]" />
            <span className="ml-2 text-gray-600">Loading products...</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {products.map((product: Product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-2">
                    <div className="aspect-square bg-gray-100 rounded-md mb-3 flex items-center justify-center">
                      <Package className="w-12 h-12 text-gray-400" />
                    </div>
                    <CardTitle className="text-lg font-semibold line-clamp-2">
                      {product.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-[#006d77]">
                          ${product.price.toFixed(2)}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          <Tag className="w-3 h-3 mr-1" />
                          {product.category}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 ml-1">
                            {product.ratings.average} ({product.ratings.count})
                          </span>
                        </div>
                        {product.verified && (
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                            ✓ Verified
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium text-[#ff9f1c]">
                            +{product.spiralPoints} SPIRALs
                          </span>
                        </div>
                        <div className="text-sm">
                          {product.inStock ? (
                            <Badge variant="outline" className="text-green-700 bg-green-50">
                              ✓ In Stock ({product.stockLevel})
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-red-700 bg-red-50">
                              Out of Stock
                            </Badge>
                          )}
                        </div>
                      </div>

                      <Button 
                        className="w-full bg-[#006d77] hover:bg-[#005a5f] text-white"
                        disabled={!product.inStock}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-4">
              {currentPage > 0 && (
                <Button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  variant="outline"
                >
                  Previous Page
                </Button>
              )}
              
              <span className="px-4 py-2 text-gray-600 flex items-center">
                Page {currentPage + 1}
              </span>
              
              {hasMore && (
                <Button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  variant="outline"
                >
                  Next Page
                </Button>
              )}
            </div>
          </>
        )}

        {/* Statistics */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-xl font-semibold mb-4">Catalog Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#006d77]">{totalProducts}</div>
              <div className="text-gray-600">Total Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#006d77]">{categories.length}</div>
              <div className="text-gray-600">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#006d77]">
                {products.filter((p: Product) => p.inStock).length}
              </div>
              <div className="text-gray-600">In Stock</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}