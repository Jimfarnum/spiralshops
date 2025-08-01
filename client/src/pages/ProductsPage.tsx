import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/header";
import Footer from "@/components/footer";
import MobileProductCard from "@/components/MobileProductCard";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: string;
  discount?: number;
  image: string;
  store: string;
  rating: number;
  location: string;
  category: string;
  description: string;
  featured: boolean;
}

interface ProductsResponse {
  success: boolean;
  products: Product[];
  total: number;
}

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: productsResponse, isLoading, error } = useQuery<ProductsResponse>({
    queryKey: ["/api/products/featured"],
    queryFn: async () => {
      const response = await fetch("/api/products/featured");
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    },
  });

  const products = productsResponse?.products || [];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...Array.from(new Set(products.map(p => p.category)))];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Products</h1>
          
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
              
              <div className="hidden sm:flex border border-gray-300 rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <p className="text-gray-600">
            {filteredProducts.length} products found
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white border rounded-xl p-4">
                <Skeleton className="w-full h-40 mb-4" />
                <Skeleton className="h-5 mb-2" />
                <Skeleton className="h-4 w-2/3 mb-2" />
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-900 mb-2">Error Loading Products</h3>
            <p className="text-gray-600 mb-4">We couldn't load the products. Please try again.</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery 
                ? `No products match "${searchQuery}". Try a different search term.`
                : "No products available in this category."
              }
            </p>
            {searchQuery && (
              <Button onClick={() => setSearchQuery("")} variant="outline">
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <div className={`grid gap-4 sm:gap-6 ${
            viewMode === "grid" 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1"
          }`}>
            {filteredProducts.map((product) => (
              <MobileProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}