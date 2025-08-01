import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import Footer from "@/components/footer";
import MallDirectoryDropdown from "@/components/mall-directory-dropdown";
import SpiralStoryModal from "@/components/spiral-story-modal";
import LiveChatWidget from "@/components/live-chat-widget";
import StoreCard from "@/components/store-card";
import ProductCard from "@/components/product-card";
import RetailerSignupForm from "@/components/retailer-signup-form";
import StoreProfile from "@/components/store-profile";
import SearchWithSuggestions from "@/components/search-with-suggestions";
import QuickActions from "@/components/quick-actions";
import LoadingSkeleton from "@/components/loading-skeleton";
import ErrorBoundary from "@/components/error-boundary";
import PerformanceMonitor from "@/components/performance-monitor";
import OfflineIndicator from "@/components/offline-indicator";
import PWAInstallPrompt from "@/components/pwa-install-prompt";
import AccessibilityMenu from "@/components/accessibility-menu";
import type { Store } from "@shared/schema";
import { mockProducts, categories } from "@/data/mockProducts";
import OnboardingModal from "@/components/onboarding-modal";
import AIRecommendations from "@/components/ai-recommendations";
import SmartSearchBar from "@/components/smart-search-bar";
import HeroSection from "@/components/HeroSection";
import RetailerCategoryMenu from "@/components/RetailerCategoryMenu";
import EnhancedFeaturedProducts from "@/components/EnhancedFeaturedProducts";
import MallEvents from "@/components/MallEvents";
import LocalPromotions from "@/components/LocalPromotions";

export default function Home() {
  const [spiralStoryModalOpen, setSpiralStoryModalOpen] = useState(false);
  const [searchZip, setSearchZip] = useState("");
  const [activeZip, setActiveZip] = useState("");
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Show onboarding for new users
  useState(() => {
    const hasSeenOnboarding = localStorage.getItem('spiralOnboardingComplete');
    if (!hasSeenOnboarding) {
      // Redirect to onboarding using navigate
      navigate('/onboarding');
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
    // Implement load more stores functionality
    const currentStoreCount = stores?.length || 0;
    const newOffset = Math.floor(currentStoreCount / 10) * 10 + 10;
    
    // This would refetch with pagination in a real implementation
    toast({
      title: "Loading more stores...",
      description: `Loading stores ${currentStoreCount + 1}-${currentStoreCount + 10}`,
    });
    
    // Simulate loading more stores after a delay
    setTimeout(() => {
      toast({
        title: "More stores loaded",
        description: "Additional local stores are now displayed.",
      });
    }, 1500);
  };

  const handleProductSearch = () => {
    if (searchQuery.trim()) {
      // Navigate to search results page with query parameter  
      navigate(`/search?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      toast({
        title: "Enter a search term",
        description: "Please enter what you're looking for.",
        variant: "destructive",
      });
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[var(--spiral-cream)]">
        <Header />
      
      {/* Hero Section with Main Street Revival Messaging */}
      <HeroSection />

      {/* Press Release Section */}
      <section id="press-release" className="bg-gray-100 px-6 py-12 rounded-2xl shadow-lg text-center max-w-5xl mx-auto my-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">SPIRAL: The Local Shopping Platform</h2>
        <p className="text-lg text-gray-600 mb-6">
          SPIRAL connects shoppers with real local stores across the U.S., rewarding every purchase that supports a real place, real jobs, and real communities.
        </p>
        <p className="text-md text-gray-700 italic mb-4">
          Our mission is simple: empower small retailers, reinvigorate malls, and make local shopping easier and more rewarding than ever.
        </p>
        <a href="/about-spiral" className="inline-block px-6 py-3 bg-black text-white rounded-xl shadow hover:bg-gray-900">
          Learn More About SPIRAL
        </a>
      </section>

      {/* Grid Layout Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 py-8">
        <div className="col-span-1">
          <RetailerCategoryMenu />
        </div>
        <div className="col-span-2">
          <EnhancedFeaturedProducts />
          <MallEvents />
          <LocalPromotions />
        </div>
      </div>

      {/* Feature Tiles Section */}
      <section className="py-20 bg-[var(--spiral-cream)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--spiral-navy)] mb-4">
              Your Local Shopping Hub
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to discover, shop, and connect with your local community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
            {/* Trusted Local Stores */}
            <Link href="/trusted-local-stores" className="group">
              <div className="max-w-[300px] mx-auto md:mx-0 py-4 px-4 rounded-xl shadow-md bg-gradient-to-br from-green-600 to-green-400 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
                <div className="flex items-center gap-4 text-left">
                  <div className="text-3xl">🛡️</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1 font-['Poppins']">Trusted Local</h3>
                    <p className="text-sm text-white/90 font-['Inter']">Verified businesses you can trust</p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Explore SPIRALs */}
            <Link href="/explore-spirals" className="group">
              <div className="max-w-[300px] mx-auto md:mx-0 py-4 px-4 rounded-xl shadow-md bg-gradient-to-br from-[var(--spiral-coral)] to-[var(--spiral-gold)] text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
                <div className="flex items-center gap-4 text-left">
                  <div className="text-3xl">🌟</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1 font-['Poppins']">Explore SPIRALs</h3>
                    <p className="text-sm text-white/90 font-['Inter']">Discover unique local experiences and gems</p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Verify Store */}
            <Link href="/verified-lookup" className="group">
              <div className="max-w-[300px] mx-auto md:mx-0 py-4 px-4 rounded-xl shadow-md bg-gradient-to-br from-[var(--spiral-sage)] to-[var(--spiral-navy)] text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
                <div className="flex items-center gap-4 text-left">
                  <div className="text-3xl">🔍</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1 font-['Poppins']">Verify Store</h3>
                    <p className="text-sm text-white/90 font-['Inter']">Check if a business is SPIRAL verified</p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Discover New Finds */}
            <Link href="/products?category=featured" className="group">
              <div className="max-w-[300px] mx-auto md:mx-0 py-4 px-4 rounded-xl shadow-md bg-gradient-to-br from-[var(--spiral-gold)] to-[var(--spiral-coral)] text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
                <div className="flex items-center gap-4 text-left">
                  <div className="text-3xl">💎</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1 font-['Poppins']">Discover Finds</h3>
                    <p className="text-sm text-white/90 font-['Inter']">Explore curated collections and trends</p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Loyalty Program */}
            <Link href="/redeem-spirals" className="group">
              <div className="max-w-[300px] mx-auto md:mx-0 py-4 px-4 rounded-xl shadow-md bg-gradient-to-br from-[var(--spiral-coral)] to-[var(--spiral-sage)] text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
                <div className="flex items-center gap-4 text-left">
                  <div className="text-3xl">🎁</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1 font-['Poppins']">Redeem SPIRALs</h3>
                    <p className="text-sm text-white/90 font-['Inter']">Use points for exclusive perks and experiences</p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Delivery Options */}
            <Link href="/delivery-options" className="group">
              <div className="max-w-[300px] mx-auto md:mx-0 py-4 px-4 rounded-xl shadow-md bg-gradient-to-br from-[var(--spiral-navy)] to-[var(--spiral-gold)] text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
                <div className="flex items-center gap-4 text-left">
                  <div className="text-3xl">🚚</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1 font-['Poppins']">Delivery Options</h3>
                    <p className="text-sm text-white/90 font-['Inter']">Same-day delivery, pickup, and ship-to-store</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Actions & Mall Directory Section */}
      <section className="section-modern bg-gradient-to-br from-[var(--spiral-cream)] to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <QuickActions />
            </div>
            
            {/* Mall Directory */}
            <div className="lg:col-span-2">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-[var(--spiral-navy)] mb-4">Find Your Local Mall</h2>
                <p className="text-lg text-gray-600">Discover shopping centers and stores near you</p>
              </div>
              <MallDirectoryDropdown className="max-w-2xl mx-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="section-modern bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[var(--spiral-navy)] mb-6">Shop by Category</h2>
            <p className="text-xl text-gray-600">Discover local products across all categories</p>
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

      {/* AI Smart Recommendations */}
      <section className="section-modern bg-[var(--spiral-cream)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AIRecommendations
            context="homepage"
            title="AI-Powered Recommendations for You"
            limit={5}
            showReason={true}
            className="mb-16"
          />
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-modern bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[var(--spiral-navy)] mb-6">Featured Local Finds</h2>
            <p className="text-xl text-gray-600">Discover amazing products from local businesses near you</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {mockProducts.slice(0, 8).map((product) => (
              <div key={product.id} className="card-product group">
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs px-3 py-1 bg-[var(--spiral-coral)]/10 text-[var(--spiral-coral)] rounded-full font-medium">
                      {product.category}
                    </span>
                    <div className="flex items-center text-yellow-400">
                      {"★".repeat(Math.floor(product.rating))}
                      <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--spiral-navy)] mb-2 group-hover:text-[var(--spiral-coral)] transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm font-medium text-gray-700 mb-1">{product.store}</p>
                  <p className="text-xs text-gray-500 mb-4">{product.location}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-[var(--spiral-navy)]">${product.price}</span>
                    <div className="flex items-center text-[var(--spiral-coral)] bg-[var(--spiral-coral)]/10 px-2 py-1 rounded-full">
                      <span className="text-xs font-semibold">+{product.spiralsEarned} SPIRALs</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {product.fulfillment.map((method) => (
                      <span key={method} className="text-xs px-2 py-1 bg-[var(--spiral-sage)]/15 text-[var(--spiral-sage)] rounded-md font-medium">
                        {method}
                      </span>
                    ))}
                  </div>
                  
                  <Button className="w-full button-primary">
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link href="/products">
              <Button className="button-secondary px-8 py-4 text-lg">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Malls Section */}
      <section className="section-modern bg-[var(--spiral-cream)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[var(--spiral-navy)] mb-6">Featured Malls</h2>
            <p className="text-xl text-gray-600">Discover local shopping destinations with the best stores and experiences</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
              {
                name: "Downtown Plaza",
                location: "Downtown District",
                stores: 45,
                image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
                featured: "Fashion & Electronics",
                href: "/mall/downtown-plaza"
              },
              {
                name: "Riverside Shopping Center",
                location: "Riverside Area",
                stores: 32,
                image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
                featured: "Home & Lifestyle",
                href: "/mall/riverside-center"
              },
              {
                name: "Heritage Square Mall",
                location: "Historic Quarter",
                stores: 28,
                image: "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
                featured: "Local Artisans & Food",
                href: "/mall/heritage-square"
              }
            ].map((mall, index) => (
              <Link key={index} href={mall.href} className="group">
                <div className="card-modern overflow-hidden">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={mall.image} 
                      alt={mall.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[var(--spiral-navy)] mb-2 group-hover:text-[var(--spiral-coral)] transition-colors">
                      {mall.name}
                    </h3>
                    <p className="text-gray-600 mb-2">{mall.location}</p>
                    <p className="text-sm text-[var(--spiral-coral)] font-medium mb-3">{mall.stores} stores • {mall.featured}</p>
                    <Button className="w-full button-secondary">
                      Explore Mall
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center">
            <Link href="/mall-directory">
              <Button className="button-secondary px-8 py-4 text-lg">
                View All Malls
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Local Picks Section */}
      <section className="section-modern bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[var(--spiral-navy)] mb-6">Local Picks</h2>
            <p className="text-xl text-gray-600">Handpicked favorites from your neighborhood stores</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                name: "Artisan Coffee Roast",
                price: 28.99,
                image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
                store: "Local Roasters Co.",
                category: "Featured",
                spiralsEarned: 15,
                badge: "Staff Pick"
              },
              {
                name: "Handwoven Scarf",
                price: 42.50,
                image: "https://images.unsplash.com/photo-1519810409259-73e5a5c00adf?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
                store: "Artisan Threads",
                category: "Featured",
                spiralsEarned: 20,
                badge: "Local Favorite"
              },
              {
                name: "Organic Honey Set",
                price: 18.99,
                image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
                store: "Valley Bee Farm",
                category: "Featured",
                spiralsEarned: 10,
                badge: "Best Value"
              },
              {
                name: "Ceramic Plant Pot",
                price: 24.99,
                image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
                store: "Garden Studio",
                category: "Featured",
                spiralsEarned: 12,
                badge: "Trending"
              }
            ].map((product, index) => (
              <div key={index} className="card-product group">
                <div className="aspect-square overflow-hidden relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-xs px-3 py-1 bg-[var(--spiral-gold)] text-white rounded-full font-medium">
                      {product.badge}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-[var(--spiral-navy)] mb-2 group-hover:text-[var(--spiral-coral)] transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm font-medium text-gray-700 mb-4">{product.store}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-[var(--spiral-navy)]">${product.price}</span>
                    <div className="flex items-center text-[var(--spiral-coral)] bg-[var(--spiral-coral)]/10 px-2 py-1 rounded-full">
                      <span className="text-xs font-semibold">+{product.spiralsEarned} SPIRALs</span>
                    </div>
                  </div>
                  
                  <Button className="w-full button-primary">
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link href="/products?category=featured">
              <Button className="button-secondary px-8 py-4 text-lg">
                View All Local Picks
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* SPIRAL Stories Section */}
      <section className="section-modern bg-[var(--spiral-cream)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[var(--spiral-navy)] mb-6">SPIRAL Stories</h2>
            <p className="text-xl text-gray-600">Real experiences from our community of local shoppers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
              {
                name: "Sarah M.",
                location: "Downtown",
                story: "Found the most amazing handmade jewelry at Artisan Corner. The owner even customized a piece for my anniversary!",
                image: "https://images.unsplash.com/photo-1494790108755-2616b612b1e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
                badge: "SPIRAL Spotlight",
                spiralsEarned: 45,
                store: "Artisan Corner"
              },
              {
                name: "Mike R.",
                location: "Riverside",
                story: "The coffee at Local Roasters is incredible! Plus I love earning SPIRALs while supporting my neighborhood cafe.",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
                badge: "Trending Story",
                spiralsEarned: 32,
                store: "Local Roasters Co."
              },
              {
                name: "Emma L.",
                location: "Heritage Quarter",
                story: "Heritage Market has the freshest produce! Shopping local has never felt so rewarding with SPIRAL points.",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
                badge: "Community Favorite",
                spiralsEarned: 28,
                store: "Heritage Market"
              }
            ].map((story, index) => (
              <div key={index} className="card-modern group">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={story.image} 
                      alt={story.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-[var(--spiral-navy)]">{story.name}</h3>
                      <p className="text-sm text-gray-500">{story.location}</p>
                    </div>
                    <div className="ml-auto">
                      <span className="text-xs px-2 py-1 bg-[var(--spiral-gold)] text-white rounded-full font-medium">
                        {story.badge}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4 italic">"{story.story}"</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[var(--spiral-coral)]">{story.store}</span>
                    <div className="flex items-center text-[var(--spiral-coral)] bg-[var(--spiral-coral)]/10 px-2 py-1 rounded-full">
                      <span className="text-xs font-semibold">+{story.spiralsEarned} SPIRALs</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Button className="button-primary px-8 py-4 text-lg" onClick={() => setSpiralStoryModalOpen(true)}>
              Share My SPIRAL Story
            </Button>
          </div>
        </div>
      </section>

      {/* Retailer Testimonials Section */}
      <section className="section-modern bg-[var(--spiral-cream)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[var(--spiral-navy)] mb-6">What Local Retailers Say</h2>
            <p className="text-xl text-gray-600">Hear from business owners who've joined the SPIRAL community</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                quote: "SPIRAL has brought so many new customers to our store. The community engagement is incredible, and we love seeing families discover our handmade products.",
                name: "Maria Rodriguez",
                title: "Owner",
                business: "Artisan Corner",
                location: "Downtown District",
                logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
                spiralsBusiness: "2,450 SPIRALs given to customers"
              },
              {
                quote: "The SPIRAL loyalty program helps us compete with big chains while keeping our neighborhood charm. Our regular customers love earning points!",
                name: "David Chen",
                title: "Co-founder",
                business: "Local Roasters Co.",
                location: "Riverside Area",
                logo: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
                spiralsBusiness: "1,890 SPIRALs given to customers"
              }
            ].map((testimonial, index) => (
              <div key={index} className="card-modern bg-white">
                <div className="p-8">
                  <div className="text-4xl text-[var(--spiral-coral)] mb-4">"</div>
                  <p className="text-lg text-gray-700 mb-6 italic">{testimonial.quote}</p>
                  
                  <div className="flex items-center gap-4">
                    <img 
                      src={testimonial.logo} 
                      alt={testimonial.business}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-[var(--spiral-navy)]">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.title}, {testimonial.business}</p>
                      <p className="text-xs text-gray-500">{testimonial.location}</p>
                      <p className="text-xs text-[var(--spiral-coral)] font-medium mt-1">{testimonial.spiralsBusiness}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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

          {/* Verification Filter */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <input
                  id="verifiedToggle"
                  type="checkbox"
                  checked={showVerifiedOnly}
                  onChange={() => setShowVerifiedOnly(!showVerifiedOnly)}
                  className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                />
                <label htmlFor="verifiedToggle" className="ml-2 text-sm font-medium text-gray-700 flex items-center gap-2">
                  <span>🛡️</span>
                  Show only SPIRAL Verified Stores
                </label>
              </div>
              {showVerifiedOnly && (
                <div className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  Showing verified businesses only
                </div>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {stores && stores.length > 0 && (
                <>
                  {showVerifiedOnly 
                    ? `${stores.filter(store => store.isVerified).length} verified stores`
                    : `${stores.length} total stores`
                  }
                </>
              )}
            </div>
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
                {(showVerifiedOnly ? stores.filter(store => store.isVerified) : stores).map((store) => (
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
      
      {/* Modals */}
      <SpiralStoryModal 
        isOpen={spiralStoryModalOpen} 
        onClose={() => setSpiralStoryModalOpen(false)} 
      />
      
        {/* Live Chat Widget */}
        <LiveChatWidget />
        
        {/* Performance & Offline Indicators */}
        <PerformanceMonitor />
        <OfflineIndicator />
        <PWAInstallPrompt />
        <AccessibilityMenu />
      </div>
    </ErrorBoundary>
  );
}
