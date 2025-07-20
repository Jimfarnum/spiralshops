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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-spiral-blue-light to-spiral-blue text-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Shop Local,<br />
              <span className="text-spiral-blue-light">Everything for You is Local Now.</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Connect with your community's best local businesses and discover what makes your neighborhood special.
            </p>
            
            {/* Quick Mall Access */}
            <div className="mb-8">
              <Link href="/mall/downtown-plaza">
                <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
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
                  className="bg-white text-spiral-blue hover:bg-gray-50 rounded-l-none"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Find Stores
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Store Discovery Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {activeZip ? `Stores in ${activeZip}` : "Featured Local Stores"}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {activeZip 
                ? `Discover unique businesses in ZIP code ${activeZip}` 
                : "Discover unique businesses in your neighborhood and support local entrepreneurs."
              }
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-48 w-full rounded-lg" />
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {stores.map((store) => (
                  <StoreCard key={store.id} store={store} />
                ))}
              </div>

              {stores.length >= 6 && (
                <div className="text-center mt-12">
                  <Button 
                    onClick={handleLoadMore}
                    className="bg-spiral-blue text-white hover:bg-spiral-blue-dark"
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
