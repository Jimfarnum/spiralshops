import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Phone, Mail, Star, Clock, Gift, Leaf, Navigation, Share2, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import VerifiedBadge from "@/components/VerifiedBadge";
import type { Store } from "@shared/schema";

export default function Store() {
  const [, params] = useRoute("/store/:id");
  const storeId = params?.id ? parseInt(params.id) : null;

  const { data: store, isLoading, error } = useQuery<Store>({
    queryKey: ["/api/stores", storeId],
    queryFn: async () => {
      if (!storeId) throw new Error("Store ID is required");
      const response = await fetch(`/api/stores/${storeId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch store");
      }
      return response.json();
    },
    enabled: !!storeId,
  });

  if (!storeId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <p className="text-red-600 mb-4">Invalid store ID</p>
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-8">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-64 w-full rounded-lg mb-8" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <p className="text-red-600 mb-4">Store not found</p>
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Stores
            </Button>
          </Link>
        </div>

        <Card className="overflow-hidden shadow-lg">
          <div className="relative">
            <img 
              src={store.imageUrl || "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400"} 
              alt={store.name}
              className="w-full h-64 object-cover"
            />
            <div className="absolute top-4 right-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                store.isOpen 
                  ? 'bg-green-500 text-white' 
                  : 'bg-red-500 text-white'
              }`}>
                <div className="inline-block w-2 h-2 bg-white rounded-full mr-1"></div>
                {store.isOpen ? "Open Now" : "Closed"}
              </span>
            </div>
          </div>

          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
              <div className="lg:w-2/3">
                <div className="flex items-center mb-4">
                  <h1 className="text-3xl font-bold text-gray-900 mr-4">{store.name}</h1>
                  <div className="flex items-center">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {store.rating} ({store.reviewCount} reviews)
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <VerifiedBadge 
                    isVerified={store.isVerified || false} 
                    tier={store.verificationTier as "Unverified" | "Basic" | "Local" | "Regional" | "National" | null}
                  />
                </div>

                <p className="text-gray-600 mb-6">{store.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Store Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        <span>{store.address}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        <span>{store.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        <span>{store.email}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Hours</h3>
                    <div className="text-sm text-gray-600">
                      {store.hours || "Hours not available"}
                    </div>
                  </div>
                </div>

                {store.perks && store.perks.length > 0 && (
                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Current Perks & Offers</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {store.perks.map((perk, index) => (
                        <div key={index} className="bg-spiral-blue bg-opacity-10 p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <Gift className="h-4 w-4 text-spiral-blue mr-2" />
                            <span className="font-medium text-spiral-blue">Special Offer</span>
                          </div>
                          <p className="text-sm text-gray-600">{perk}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="lg:w-1/3 lg:ml-8 mt-8 lg:mt-0">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-spiral-blue text-white hover:bg-spiral-blue-dark"
                      onClick={() => window.open(`https://maps.google.com?q=${encodeURIComponent(store.address)}`, '_blank')}
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Get Directions
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => window.open(`tel:${store.phone}`, '_self')}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call Store
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigator.share?.({ 
                        title: store.name, 
                        text: store.description,
                        url: window.location.href 
                      })}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Store
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100"
                    >
                      Follow Store
                    </Button>
                  </div>
                </div>

                <div className="mt-6 bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-4">Store Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center">
                      <span className="text-gray-600 capitalize">Category: {store.category}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600">ZIP Code: {store.zipCode}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600">
                        Status: {store.isOpen ? "Open" : "Closed"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
}
