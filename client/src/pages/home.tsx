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
import { mockProducts, categories } from "@/data/mockProducts";
import OnboardingModal from "@/components/onboarding-modal";

export default function Home() {
  const [searchZip, setSearchZip] = useState("");
  const [activeZip, setActiveZip] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { toast } = useToast();

  // Show onboarding for new users
  useState(() => {
    const hasSeenOnboarding = localStorage.getItem('spiral-onboarding-seen');
    if (!hasSeenOnboarding) {
      setTimeout(() => setShowOnboarding(true), 2000);
    }
  });

  const handleOnboardingClose = () => {
    setShowOnboarding(false);
    localStorage.setItem('spiral-onboarding-seen', 'true');
  };

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
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-[var(--spiral-navy)] mb-6">
            Everything Local. Just for You.
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover amazing local businesses, earn rewards, and build your community with SPIRAL.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              className="bg-[var(--spiral-navy)] hover:bg-[var(--spiral-navy)]/90 text-white px-8 py-4 text-lg rounded-lg"
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            >
              Start Shopping Local
            </Button>
            <Button 
              variant="outline" 
              className="border-[var(--spiral-coral)] text-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)] hover:text-white px-8 py-4 text-lg rounded-lg"
            >
              Explore Stores
            </Button>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center shadow-lg rounded-lg overflow-hidden bg-white border border-gray-200">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, stores, or deals near you…"
                className="flex-1 h-12 pl-6 pr-4 text-base border-0 focus:ring-0 focus:outline-none bg-white"
                onKeyPress={(e) => e.key === 'Enter' && handleProductSearch()}
              />
              <Button 
                onClick={handleProductSearch}
                className="h-12 px-6 bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90 text-white border-0 rounded-none"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Tiles Section */}
      <section className="py-20 bg-[var(--spiral-cream)]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--spiral-navy)] mb-4">
              Your Local Shopping Hub
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to discover, shop, and connect with your local community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Shop Local Stores */}
            <Link href="/products" className="group">
              <div className="bg-gradient-to-br from-[var(--spiral-navy)] to-[var(--spiral-coral)] p-8 rounded-xl text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
                <div className="text-5xl mb-4">🛍️</div>
                <h3 className="text-2xl font-bold mb-3 font-['Poppins']">Shop Local</h3>
                <p className="text-white/90 font-['Inter']">Browse products from neighborhood businesses and support your local community</p>
              </div>
            </Link>

            {/* Explore SPIRALs */}
            <Link href="/explore-spirals" className="group">
              <div className="bg-gradient-to-br from-[var(--spiral-coral)] to-[var(--spiral-gold)] p-8 rounded-xl text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
                <div className="text-5xl mb-4">🌟</div>
                <h3 className="text-2xl font-bold mb-3 font-['Poppins']">Explore SPIRALs</h3>
                <p className="text-white/90 font-['Inter']">Discover unique local experiences and hidden gems in your neighborhood</p>
              </div>
            </Link>

            {/* Retailer Sign-Up */}
            <Link href="/retailer-login" className="group">
              <div className="bg-gradient-to-br from-[var(--spiral-sage)] to-[var(--spiral-navy)] p-8 rounded-xl text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
                <div className="text-5xl mb-4">🏪</div>
                <h3 className="text-2xl font-bold mb-3 font-['Poppins']">Join as Retailer</h3>
                <p className="text-white/90 font-['Inter']">List your business and connect with local customers in your area</p>
              </div>
            </Link>

            {/* Discover New Finds */}
            <Link href="/products?category=featured" className="group">
              <div className="bg-gradient-to-br from-[var(--spiral-gold)] to-[var(--spiral-coral)] p-8 rounded-xl text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
                <div className="text-5xl mb-4">💎</div>
                <h3 className="text-2xl font-bold mb-3 font-['Poppins']">Discover Finds</h3>
                <p className="text-white/90 font-['Inter']">Explore curated collections and trending products from local stores</p>
              </div>
            </Link>

            {/* Loyalty Program */}
            <Link href="/redeem-spirals" className="group">
              <div className="bg-gradient-to-br from-[var(--spiral-coral)] to-[var(--spiral-sage)] p-8 rounded-xl text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
                <div className="text-5xl mb-4">🎁</div>
                <h3 className="text-2xl font-bold mb-3 font-['Poppins']">Redeem SPIRALs</h3>
                <p className="text-white/90 font-['Inter']">Use your SPIRAL points to unlock exclusive perks and local experiences</p>
              </div>
            </Link>

            {/* Delivery Options */}
            <Link href="/delivery-options" className="group">
              <div className="bg-gradient-to-br from-[var(--spiral-navy)] to-[var(--spiral-gold)] p-8 rounded-xl text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
                <div className="text-5xl mb-4">🚚</div>
                <h3 className="text-2xl font-bold mb-3 font-['Poppins']">Delivery Options</h3>
                <p className="text-white/90 font-['Inter']">Choose from same-day delivery, in-store pickup, and ship-to-store options</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--spiral-navy)] mb-4">Shop by Category</h2>
            <p className="text-lg text-gray-600">Discover local products across all categories</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
            {categories.map((category) => (
              <Link 
                key={category.name} 
                href={`/products?category=${category.name.toLowerCase().replace(' ', '-')}`}
                className="group"
              >
                <div className="flex flex-col items-center p-6 rounded-full bg-gradient-to-br hover:scale-105 transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform`}>
                    <span>{category.icon}</span>
                  </div>
                  <span className="text-sm font-medium text-[var(--spiral-navy)] text-center group-hover:text-[var(--spiral-coral)] transition-colors">
                    {category.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-[var(--spiral-cream)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--spiral-navy)] mb-4">Featured Local Finds</h2>
            <p className="text-lg text-gray-600">Discover amazing products from local businesses near you</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {mockProducts.slice(0, 8).map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs px-2 py-1 bg-[var(--spiral-coral)]/10 text-[var(--spiral-coral)] rounded-full font-medium">
                      {product.category}
                    </span>
                    <div className="flex items-center text-yellow-400">
                      {"★".repeat(Math.floor(product.rating))}
                      <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-[var(--spiral-navy)] mb-1 group-hover:text-[var(--spiral-coral)] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{product.store}</p>
                  <p className="text-xs text-gray-500 mb-3">{product.location}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-bold text-[var(--spiral-navy)]">${product.price}</span>
                    <div className="flex items-center text-[var(--spiral-coral)]">
                      <span className="text-xs font-medium">+{product.spiralsEarned} SPIRALs</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {product.fulfillment.map((method) => (
                      <span key={method} className="text-xs px-2 py-1 bg-[var(--spiral-sage)]/20 text-[var(--spiral-sage)] rounded">
                        {method}
                      </span>
                    ))}
                  </div>
                  
                  <Button className="w-full bg-[var(--spiral-navy)] hover:bg-[var(--spiral-navy)]/90 text-white">
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link href="/products">
              <Button variant="outline" className="border-[var(--spiral-coral)] text-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)] hover:text-white px-8 py-3">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Three-Column Value Props */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Earn SPIRALs */}
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-[var(--spiral-coral)] to-[var(--spiral-gold)] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg">
                <span className="text-3xl">⭐</span>
              </div>
              <h3 className="text-2xl font-bold text-[var(--spiral-navy)] mb-4">Earn SPIRALs</h3>
              <p className="text-gray-600 leading-relaxed">
                Collect reward points with every purchase from local businesses. The more you shop local, the more you earn.
              </p>
            </div>

            {/* Find Stores */}
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-[var(--spiral-sage)] to-[var(--spiral-navy)] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg">
                <span className="text-3xl">🏪</span>
              </div>
              <h3 className="text-2xl font-bold text-[var(--spiral-navy)] mb-4">Find Stores</h3>
              <p className="text-gray-600 leading-relaxed">
                Discover amazing local businesses in your neighborhood. From cafes to boutiques, find everything nearby.
              </p>
            </div>

            {/* Local Perks */}
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-[var(--spiral-navy)] to-[var(--spiral-coral)] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg">
                <span className="text-3xl">🎁</span>
              </div>
              <h3 className="text-2xl font-bold text-[var(--spiral-navy)] mb-4">Local Perks</h3>
              <p className="text-gray-600 leading-relaxed">
                Unlock exclusive deals, early access to sales, and special experiences available only to SPIRAL members.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SPIRAL Loyalty Program Preview */}
      <section className="py-20 bg-[var(--spiral-cream)]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center">
            <div className="text-6xl mb-6">💫</div>
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--spiral-navy)] mb-8">
              Introducing SPIRAL Rewards
            </h2>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-12">
              Earn SPIRALs when you shop in-store or online with SPIRAL. Redeem SPIRALs for exclusive perks, discounts, and mall rewards.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-[var(--spiral-coral)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🛒</span>
                </div>
                <h3 className="text-xl font-bold text-[var(--spiral-navy)] mb-2">Shop & Earn</h3>
                <p className="text-gray-600">Collect SPIRALs with every purchase</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-[var(--spiral-gold)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎁</span>
                </div>
                <h3 className="text-xl font-bold text-[var(--spiral-navy)] mb-2">Unlock Rewards</h3>
                <p className="text-gray-600">Redeem for discounts and exclusive offers</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-[var(--spiral-sage)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⭐</span>
                </div>
                <h3 className="text-xl font-bold text-[var(--spiral-navy)] mb-2">VIP Perks</h3>
                <p className="text-gray-600">Early access to sales and special events</p>
              </div>
            </div>
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
      
      <OnboardingModal 
        isOpen={showOnboarding} 
        onClose={handleOnboardingClose} 
      />
    </div>
  );
}
