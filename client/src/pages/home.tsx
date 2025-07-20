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
            <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight font-['Poppins']">
              SPIRAL
            </h1>
            <p className="text-2xl md:text-3xl mb-12 leading-relaxed font-['Inter'] max-w-4xl mx-auto text-white/90">
              Everything Local. Just for you.
            </p>
            
            <div className="max-w-lg mx-auto">
              <div className="flex rounded-full overflow-hidden shadow-lg">
                <Input
                  type="text"
                  placeholder="Enter your ZIP code to get started"
                  value={searchZip}
                  onChange={(e) => setSearchZip(e.target.value)}
                  className="flex-1 text-gray-900 border-0 rounded-none h-14 text-lg"
                  onKeyPress={(e) => e.key === 'Enter' && handleZipSearch()}
                />
                <Button 
                  onClick={handleZipSearch}
                  className="bg-[hsl(32,98%,56%)] text-white hover:bg-[hsl(32,98%,70%)] border-0 rounded-none px-8 h-14 font-semibold"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Explore
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Tiles Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-['Poppins']">
              Your Local Shopping Hub
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-['Inter']">
              Everything you need to discover, shop, and connect with your local community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Shop Local Stores */}
            <Link href="/stores" className="group">
              <div className="bg-gradient-to-br from-[hsl(183,100%,23%)] to-[hsl(183,60%,40%)] p-8 rounded-2xl text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
                <div className="text-5xl mb-4">🛍️</div>
                <h3 className="text-2xl font-bold mb-3 font-['Poppins']">Shop Local Stores</h3>
                <p className="text-white/90 font-['Inter']">Browse amazing products from neighborhood businesses</p>
              </div>
            </Link>

            {/* Explore Malls */}
            <Link href="/mall" className="group">
              <div className="bg-gradient-to-br from-[hsl(32,98%,56%)] to-[hsl(32,98%,70%)] p-8 rounded-2xl text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
                <div className="text-5xl mb-4">🏬</div>
                <h3 className="text-2xl font-bold mb-3 font-['Poppins']">Explore Malls Near You</h3>
                <p className="text-white/90 font-['Inter']">Discover shopping centers and their featured stores</p>
              </div>
            </Link>

            {/* Retailer Sign-Up */}
            <Link href="/signup" className="group">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-8 rounded-2xl text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
                <div className="text-5xl mb-4">🧑‍💼</div>
                <h3 className="text-2xl font-bold mb-3 font-['Poppins']">Retailer Sign-Up</h3>
                <p className="text-white/90 font-['Inter']">Join SPIRAL and showcase your business to locals</p>
              </div>
            </Link>

            {/* Discover New Finds */}
            <Link href="/discover" className="group">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-8 rounded-2xl text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
                <div className="text-5xl mb-4">🧭</div>
                <h3 className="text-2xl font-bold mb-3 font-['Poppins']">Discover New Local Finds</h3>
                <p className="text-white/90 font-['Inter']">Explore trending products and hidden gems nearby</p>
              </div>
            </Link>

            {/* Loyalty Program */}
            <div className="bg-gradient-to-br from-rose-500 to-rose-600 p-8 rounded-2xl text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
              <div className="text-5xl mb-4">💳</div>
              <h3 className="text-2xl font-bold mb-3 font-['Poppins']">Earn Spirals: Loyalty Program</h3>
              <p className="text-white/90 font-['Inter']">Collect points and unlock exclusive rewards</p>
            </div>

            {/* Delivery Options */}
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-8 rounded-2xl text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="text-2xl font-bold mb-3 font-['Poppins']">Delivery & Pickup Options</h3>
              <p className="text-white/90 font-['Inter']">Flexible fulfillment options for every lifestyle</p>
            </div>
          </div>
        </div>
      </section>

      {/* SPIRAL Loyalty Program Preview */}
      <section className="py-20 bg-gradient-to-r from-rose-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center">
            <div className="text-6xl mb-6">💫</div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 font-['Poppins']">
              Introducing SPIRAL Rewards
            </h2>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-['Inter'] mb-12">
              Earn Spirals when you shop in-store or online with SPIRAL. Redeem Spirals for exclusive perks, discounts, and mall rewards.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🛒</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 font-['Poppins']">Shop & Earn</h3>
                <p className="text-gray-600 font-['Inter']">Collect Spirals with every purchase</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎁</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 font-['Poppins']">Unlock Rewards</h3>
                <p className="text-gray-600 font-['Inter']">Redeem for discounts and exclusive offers</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⭐</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 font-['Poppins']">VIP Perks</h3>
                <p className="text-gray-600 font-['Inter']">Early access to sales and special events</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logistics Options Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-['Poppins']">
              Flexible Fulfillment Options
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-['Inter']">
              Choose the delivery method that works best for your lifestyle
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-[hsl(183,100%,23%)] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl text-white">🏪</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 font-['Poppins']">In-Store Pickup</h3>
              <p className="text-gray-600 font-['Inter']">Order online, collect in-store at your convenience</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-[hsl(32,98%,56%)] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl text-white">📦</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 font-['Poppins']">Standard Shipping</h3>
              <p className="text-gray-600 font-['Inter']">Reliable delivery to your doorstep in 3-5 days</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl text-white">🏬</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 font-['Poppins']">Ship-to-Store</h3>
              <p className="text-gray-600 font-['Inter']">Free shipping to your nearest participating location</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl text-white">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 font-['Poppins']">Same-Day Delivery</h3>
              <p className="text-gray-600 font-['Inter']">Local express delivery when available in your area</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-['Poppins']">
              Featured Local Finds
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-['Inter']">
              Discover amazing products from your neighborhood businesses
            </p>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 mb-16">
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
          
          <div className="text-center">
            <Link href="/products">
              <Button 
                size="lg" 
                className="bg-[hsl(183,100%,23%)] hover:bg-[hsl(183,60%,40%)] text-white px-10 py-4 text-lg font-semibold rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                View All Local Finds
                <span className="ml-2">→</span>
              </Button>
            </Link>
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
