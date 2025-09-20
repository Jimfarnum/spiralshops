import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import Footer from "@/components/footer";

import StoreCard from "@/components/store-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, MapPin, Shield } from "lucide-react";
import type { Store } from "@shared/schema";

const DiscoverStores = () => {
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [zipCode, setZipCode] = useState("");

  // Fetch stores data
  const { data: stores = [], isLoading, error } = useQuery<Store[]>({
    queryKey: ["/api/stores"],
  });

  // Filter and sort stores
  const filteredStores = useMemo(() => {
    let filtered = stores;

    // Apply verification filter
    if (showVerifiedOnly) {
      filtered = filtered.filter(store => store.isVerified);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(store => 
        store.name.toLowerCase().includes(query) ||
        store.description?.toLowerCase().includes(query) ||
        store.category?.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(store => 
        store.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "rating":
        filtered = filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "name":
        filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "verified":
        filtered = filtered.sort((a, b) => {
          if (a.isVerified === b.isVerified) return 0;
          return a.isVerified ? -1 : 1;
        });
        break;
      default:
        break;
    }

    return filtered;
  }, [stores, showVerifiedOnly, searchQuery, selectedCategory, sortBy]);

  const categories = ["all", "Food & Beverage", "Retail", "Services", "Electronics", "Health & Beauty", "Fashion", "Home & Garden"];

  const verifiedCount = stores.filter(store => store.isVerified).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Local Stores
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find verified local businesses in your area. Shop with confidence knowing these stores have been verified for quality and authenticity.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid gap-4 md:grid-cols-12 items-end">
            {/* Search Input */}
            <div className="md:col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Stores</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by name, category, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="verified">Verified First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* ZIP Code */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Enter ZIP..."
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Clear Filters */}
            <div className="md:col-span-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSortBy("rating");
                  setZipCode("");
                  setShowVerifiedOnly(false);
                }}
                className="w-full"
              >
                Clear All
              </Button>
            </div>
          </div>

          {/* Verification Filter */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
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
                    <Shield className="w-4 h-4 text-green-600" />
                    Show only SPIRAL Verified Stores
                  </label>
                </div>
                {showVerifiedOnly && (
                  <Badge className="bg-green-100 text-green-800">
                    Verified Only
                  </Badge>
                )}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">{filteredStores.length}</span> stores found
                {showVerifiedOnly && (
                  <span className="text-green-600 ml-2">
                    ({verifiedCount} total verified)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        {(searchQuery || selectedCategory !== "all" || showVerifiedOnly) && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {searchQuery && (
                <Badge variant="outline">
                  Search: "{searchQuery}"
                </Badge>
              )}
              {selectedCategory !== "all" && (
                <Badge variant="outline">
                  Category: {selectedCategory}
                </Badge>
              )}
              {showVerifiedOnly && (
                <Badge className="bg-green-100 text-green-800">
                  <Shield className="w-3 h-3 mr-1" />
                  Verified Only
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Store Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
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
        ) : filteredStores.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No stores found</h3>
            <p className="text-gray-600 mb-4">
              {showVerifiedOnly 
                ? "No verified stores match your search criteria. Try adjusting your filters."
                : "No stores match your search criteria. Try adjusting your filters."
              }
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setShowVerifiedOnly(false);
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        )}

        {/* Trust Information */}
        {!showVerifiedOnly && verifiedCount > 0 && (
          <div className="mt-12 bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <Shield className="w-6 h-6 text-green-600 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-green-900 mb-2">Shop with Confidence</h3>
                <p className="text-green-700 mb-3">
                  <span className="font-medium">{verifiedCount}</span> of these stores are SPIRAL verified, 
                  meaning they've completed our comprehensive verification process including business registration, 
                  identity verification, and quality standards.
                </p>
                <Button
                  onClick={() => setShowVerifiedOnly(true)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Show Only Verified Stores
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default DiscoverStores;