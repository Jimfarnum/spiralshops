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
import RetailerSignupForm from "@/components/retailer-signup-form";
import StoreProfile from "@/components/store-profile";
import type { Store } from "@shared/schema";

export default function Home() {
  const [searchZip, setSearchZip] = useState("");
  const [activeZip, setActiveZip] = useState("");
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

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'hsl(35, 25%, 96%)' }}>
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-500 to-teal-600 text-white py-24 lg:py-32">
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
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
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
                  className="bg-orange-500 text-white hover:bg-orange-600 rounded-l-none px-6 py-3 font-semibold"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Find Stores
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Store Discovery Section */}
      <section className="py-20 bg-white">
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
                    className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-full font-semibold shadow-lg transition-all duration-300"
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
