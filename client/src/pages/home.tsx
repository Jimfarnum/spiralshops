import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import Footer from "@/components/footer";
import StoreCard from "@/components/store-card";
import ProductCard from "@/components/product-card";
import RetailerSignupForm from "@/components/retailer-signup-form";
import StoreProfile from "@/components/store-profile";
import type { Store } from "@shared/schema";

export default function Home() {
  const [searchZip, setSearchZip] = useState("");
  const [activeZip, setActiveZip] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const { data: stores, isLoading, error } = useQuery<Store[]>({
    queryKey: activeZip ? ["/api/stores/search", activeZip] : ["/api/stores"],
    queryFn: async () => {
      const url = activeZip ? `/api/stores/search?zipCode=${activeZip}` : "/api/stores";
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch stores");
      }
      return response.json();
    },
  });

  const handleZipSearch = () => {
    if (!searchZip.trim()) {
      toast({
        title: "Please enter a ZIP code",
        description: "Enter your ZIP code to find stores in your area.",
        variant: "destructive",
      });
      return;
    }
    
    if (!/^\d{5}$/.test(searchZip.trim())) {
      toast({
        title: "Invalid ZIP code",
        description: "Please enter a valid 5-digit ZIP code.",
        variant: "destructive",
      });
      return;
    }
    
    setActiveZip(searchZip.trim());
  };

  const handleLoadMore = () => {
    // This would typically load more stores with pagination
    toast({
      title: "Feature coming soon",
      description: "Load more functionality will be available soon.",
    });
  };

  const handleProductSearch = () => {
    if (searchQuery.trim()) {
      toast({
        title: "Searching products...",
        description: `Searching for "${searchQuery}"`,
      });
      // Future: Navigate to product search results
    } else {
      toast({
        title: "Enter a search term",
        description: "Please enter what you're looking for.",
      });
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'hsl(0, 0%, 99.6%)' }}>
      <Header />
      
      {/* Prominent Search Bar */}
      <section className="bg-white border-b border-gray-200 py-6 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="relative max-w-4xl mx-auto">
            <div className="flex items-center shadow-lg rounded-lg overflow-hidden">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, stores, or deals near you…"
                className="flex-1 h-14 pl-6 pr-4 text-lg border-0 focus:ring-0 focus:outline-none bg-white"
                onKeyPress={(e) => e.key === 'Enter' && handleProductSearch()}
              />
              <Button 
                onClick={handleProductSearch}
                className="h-14 px-8 bg-[hsl(183,100%,23%)] hover:bg-[hsl(183,60%,40%)] text-white border-0 rounded-none"
              >
                <Search className="h-5 w-5 mr-2" />
                <span className="hidden md:inline">Search</span>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[hsl(183,100%,23%)] to-[hsl(183,60%,40%)] text-white py-28 lg:py-36">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight font-['Poppins']">
              Shop Local,<br />
              <span className="text-teal-100 bg-gradient-to-r from-teal-100 to-white bg-clip-text text-transparent">
                Everything Local. Just for You.
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-teal-50 max-w-4xl mx-auto leading-relaxed font-['Inter']">
              Connect with your community's best local businesses and discover what makes your neighborhood special.
            </p>
            
            {/* Quick Mall Access */}
            <div className="mb-10">
              <Link href="/mall/downtown-plaza">
                <Button size="lg" className="bg-[hsl(32,98%,56%)] hover:bg-[hsl(32,98%,70%)] text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
                  Explore Downtown Plaza Mall
                </Button>
              </Link>
            </div>
            
            <div className="max-w-md mx-auto">
              <div className="flex">
                <Input
                  type="text"
                  placeholder="Enter your ZIP code"
                  value={searchZip}
                  onChange={(e) => setSearchZip(e.target.value)}
                  className="flex-1 text-gray-900 rounded-r-none"
                  onKeyPress={(e) => e.key === 'Enter' && handleZipSearch()}
                />
                <Button 
                  onClick={handleZipSearch}
                  className="bg-[hsl(32,98%,56%)] text-white hover:bg-[hsl(32,98%,70%)] rounded-l-none px-6 py-3 font-semibold"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Find Stores
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-['Poppins']">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-['Inter']">
              Discover amazing products from local businesses in your area
            </p>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-16">
            {/* Mock Product Cards */}
            {[
              { id: 1, name: "Artisan Coffee Blend", price: 24.99, image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300", store: "Local Roasters", category: "coffee" },
              { id: 2, name: "Handmade Ceramic Mug", price: 18.50, image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300", store: "Pottery Studio", category: "home" },
              { id: 3, name: "Organic Honey", price: 12.99, image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300", store: "Bee Farm Co.", category: "food" },
              { id: 4, name: "Vintage Leather Jacket", price: 89.99, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300", store: "Vintage Threads", category: "clothing" },
              { id: 5, name: "Plant-Based Soap", price: 8.75, image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300", store: "Natural Goods", category: "beauty" },
              { id: 6, name: "Wood Phone Stand", price: 15.99, image: "https://images.unsplash.com/photo-1586953209889-097d0faf7982?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300", store: "Craft Corner", category: "tech" },
              { id: 7, name: "Local Fruit Basket", price: 22.50, image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300", store: "Fresh Farm", category: "food" },
              { id: 8, name: "Knitted Scarf", price: 34.99, image: "https://images.unsplash.com/photo-1519810409259-73e5a5c00adf?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300", store: "Yarn Works", category: "clothing" }
            ].map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Store Discovery Section */}
      <section className="py-24 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-['Poppins']">
              {activeZip ? `Stores in ${activeZip}` : "Featured Local Stores"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-['Inter']">
              {activeZip 
                ? `Discover unique businesses in ZIP code ${activeZip}` 
                : "Discover unique businesses in your neighborhood and support local entrepreneurs."
              }
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-52 w-full rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">Failed to load stores. Please try again.</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          ) : !stores || stores.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">
                {activeZip 
                  ? `No stores found in ZIP code ${activeZip}. Try a different ZIP code.`
                  : "No stores available at the moment."
                }
              </p>
              {activeZip && (
                <Button onClick={() => { setActiveZip(""); setSearchZip(""); }}>
                  View All Stores
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {stores.map((store) => (
                  <StoreCard key={store.id} store={store} />
                ))}
              </div>

              {stores.length >= 6 && (
                <div className="text-center mt-16">
                  <Button 
                    onClick={handleLoadMore}
                    className="bg-[hsl(183,100%,23%)] hover:bg-[hsl(183,60%,40%)] text-white px-8 py-4 rounded-full font-semibold shadow-lg transition-all duration-300"
                  >
                    Load More Stores
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <RetailerSignupForm />
      <StoreProfile />
      <Footer />
    </div>
  );
}
