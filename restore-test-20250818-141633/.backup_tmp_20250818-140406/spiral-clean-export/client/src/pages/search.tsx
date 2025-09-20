import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  ShoppingCart, 
  ArrowLeft,
  SlidersHorizontal,
  Grid3X3,
  List
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useCartStore } from "@/lib/cartStore";
import SEOHead from "@/components/SEOHead";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  store: string;
  rating: number;
  reviewCount: number;
  distance?: string;
  inStock: boolean;
}

interface Store {
  id: number;
  name: string;
  category: string;
  address: string;
  distance: string;
  rating: number;
  reviewCount: number;
  isOpen: boolean;
  phone?: string;
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("products");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [, navigate] = useLocation();
  const addToCart = useCartStore(state => state.addItem);

  // Get search query from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    if (query) {
      setSearchQuery(query);
    }
  }, []);

  // Search products
  const { data: searchResults = [], isLoading: isSearching } = useQuery({
    queryKey: ['/api/search/products', searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      
      try {
        const response = await fetch(`/api/search/products?q=${encodeURIComponent(searchQuery)}`);
        if (!response.ok) {
          // Return demo search results if API not available
          return [
            {
              id: 1,
              name: "Wireless Bluetooth Headphones",
              price: 79.99,
              originalPrice: 99.99,
              image: "/api/placeholder/300/300",
              category: "Electronics",
              store: "Tech Haven",
              rating: 4.5,
              reviewCount: 128,
              distance: "0.3 mi",
              inStock: true
            },
            {
              id: 2,
              name: "Smart Fitness Watch",
              price: 199.99,
              image: "/api/placeholder/300/300",
              category: "Electronics",
              store: "Digital Depot",
              rating: 4.7,
              reviewCount: 89,
              distance: "0.5 mi",
              inStock: true
            },
            {
              id: 3,
              name: "Organic Coffee Beans",
              price: 12.99,
              image: "/api/placeholder/300/300",
              category: "Food & Beverage",
              store: "Local Roasters",
              rating: 4.8,
              reviewCount: 156,
              distance: "0.2 mi",
              inStock: true
            }
          ];
        }
        return response.json();
      } catch {
        return [];
      }
    },
    enabled: !!searchQuery.trim()
  });

  // Search stores
  const { data: storeResults = [] } = useQuery({
    queryKey: ['/api/search/stores', searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      
      try {
        const response = await fetch(`/api/search/stores?q=${encodeURIComponent(searchQuery)}`);
        if (!response.ok) {
          // Return demo store results if API not available
          return [
            {
              id: 1,
              name: "Tech Haven",
              category: "Electronics",
              address: "123 Main St, Downtown",
              distance: "0.3 mi",
              rating: 4.5,
              reviewCount: 67,
              isOpen: true,
              phone: "(555) 123-4567"
            },
            {
              id: 2,
              name: "Local Roasters",
              category: "Food & Beverage",
              address: "456 Coffee Ave",
              distance: "0.2 mi",
              rating: 4.8,
              reviewCount: 234,
              isOpen: true,
              phone: "(555) 987-6543"
            }
          ];
        }
        return response.json();
      } catch {
        return [];
      }
    },
    enabled: !!searchQuery.trim()
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const url = new URL(window.location.href);
      url.searchParams.set('q', searchQuery.trim());
      window.history.pushState({}, '', url.toString());
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      store: product.store,
      storeId: 1
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <>
      <SEOHead 
        title={searchQuery ? `Search Results for "${searchQuery}" - SPIRAL` : "Search - SPIRAL"}
        description={searchQuery ? `Find products and stores for "${searchQuery}" on SPIRAL` : "Search for products and local stores on SPIRAL"}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[var(--spiral-navy)]">
                Search SPIRAL
              </h1>
              <p className="text-sm text-gray-600">
                Find products and stores near you
              </p>
            </div>
          </div>

          {/* Search Form */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <form onSubmit={handleSearch} className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search for products, stores, or categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit" className="bg-[var(--spiral-navy)] hover:bg-[var(--spiral-navy)]/90">
                  Search
                </Button>
                <Button type="button" variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Search Results */}
          {searchQuery && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex items-center justify-between mb-4">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="products" className="flex items-center gap-2">
                    Products ({searchResults.length})
                  </TabsTrigger>
                  <TabsTrigger value="stores" className="flex items-center gap-2">
                    Stores ({storeResults.length})
                  </TabsTrigger>
                </TabsList>
                
                {activeTab === "products" && (
                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Products Tab */}
              <TabsContent value="products">
                {isSearching ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--spiral-navy)] mx-auto"></div>
                    <p className="text-gray-600 mt-2">Searching products...</p>
                  </div>
                ) : searchResults.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {searchQuery ? `No products found for "${searchQuery}"` : "Start your search"}
                      </h3>
                      <p className="text-gray-600">
                        {searchQuery ? "Try different keywords or browse our categories" : "Enter a search term to find products"}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className={viewMode === "grid" 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
                    : "space-y-4"
                  }>
                    {searchResults.map((product: Product) => (
                      <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className={viewMode === "grid" ? "" : "flex"}>
                          <div className={viewMode === "grid" ? "aspect-square" : "w-32 h-32 flex-shrink-0"}>
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <CardContent className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-gray-900 line-clamp-2">
                                {product.name}
                              </h3>
                              {!product.inStock && (
                                <Badge variant="destructive">Out of Stock</Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                              <MapPin className="h-3 w-3" />
                              <span>{product.store}</span>
                              {product.distance && (
                                <>
                                  <span>•</span>
                                  <span>{product.distance}</span>
                                </>
                              )}
                            </div>

                            <div className="flex items-center gap-1 mb-3">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{product.rating}</span>
                              <span className="text-sm text-gray-500">({product.reviewCount})</span>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-[var(--spiral-coral)]">
                                  {formatPrice(product.price)}
                                </span>
                                {product.originalPrice && (
                                  <span className="text-sm text-gray-500 line-through">
                                    {formatPrice(product.originalPrice)}
                                  </span>
                                )}
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleAddToCart(product)}
                                disabled={!product.inStock}
                                className="bg-[var(--spiral-navy)] hover:bg-[var(--spiral-navy)]/90"
                              >
                                <ShoppingCart className="h-4 w-4 mr-1" />
                                Add
                              </Button>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Stores Tab */}
              <TabsContent value="stores">
                {storeResults.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {searchQuery ? `No stores found for "${searchQuery}"` : "Start your search"}
                      </h3>
                      <p className="text-gray-600">
                        {searchQuery ? "Try different keywords or browse our store directory" : "Enter a search term to find stores"}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {storeResults.map((store: Store) => (
                      <Card key={store.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-gray-900">{store.name}</h3>
                              <p className="text-sm text-gray-600">{store.category}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={store.isOpen ? "default" : "secondary"}>
                                {store.isOpen ? "Open" : "Closed"}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <MapPin className="h-4 w-4" />
                            <span>{store.address}</span>
                            <span>•</span>
                            <span>{store.distance}</span>
                          </div>

                          <div className="flex items-center gap-1 mb-3">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{store.rating}</span>
                            <span className="text-sm text-gray-500">({store.reviewCount} reviews)</span>
                          </div>

                          <div className="flex gap-2">
                            <Link to={`/stores/${store.id}`}>
                              <Button variant="outline" size="sm">
                                View Store
                              </Button>
                            </Link>
                            {store.phone && (
                              <Button variant="outline" size="sm">
                                Call
                              </Button>
                            )}
                            <Button variant="outline" size="sm">
                              Directions
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </>
  );
}