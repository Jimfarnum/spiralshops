import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FollowRetailerButton from "@/components/FollowRetailerButton";
import { Search, Store, MapPin, Calendar, Heart } from "lucide-react";
import { Link } from "wouter";

interface FollowedRetailer {
  id: number;
  followedAt: string;
  retailer: {
    id: number;
    businessName: string;
    email: string;
    category: string;
    description: string;
    address: string;
    zipCode: string;
    approved: boolean;
  };
}

export default function Following() {
  const [followedRetailers, setFollowedRetailers] = useState<FollowedRetailer[]>([]);
  const [filteredRetailers, setFilteredRetailers] = useState<FollowedRetailer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  
  const userId = 1; // Demo user ID

  useEffect(() => {
    fetchFollowedRetailers();
  }, []);

  useEffect(() => {
    filterRetailers();
  }, [followedRetailers, searchQuery, selectedCategory]);

  const fetchFollowedRetailers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/following/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setFollowedRetailers(data.follows || []);
      }
    } catch (error) {
      console.error("Error fetching followed retailers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterRetailers = () => {
    let filtered = followedRetailers;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(follow =>
        follow.retailer.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        follow.retailer.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        follow.retailer.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(follow =>
        follow.retailer.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredRetailers(filtered);
  };

  const categories = ["all", ...Array.from(new Set(followedRetailers.map(f => f.retailer.category)))];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--spiral-cream)] p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--spiral-navy)] mx-auto mb-4"></div>
          <p className="text-[var(--spiral-navy)]">Loading your followed stores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[var(--spiral-navy)] mb-2 flex items-center justify-center gap-3">
            <Heart className="w-8 h-8 text-red-500" />
            Stores You Follow
          </h1>
          <p className="section-description text-lg">
            Stay connected with your favorite local retailers and get the latest updates
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search followed stores..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--spiral-navy)]"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            Following {filteredRetailers.length} of {followedRetailers.length} stores
          </div>
        </div>

        {/* Followed Retailers Grid */}
        {filteredRetailers.length === 0 ? (
          <div className="text-center py-12">
            <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {followedRetailers.length === 0 ? "No Followed Stores Yet" : "No Stores Match Your Search"}
            </h3>
            <p className="text-gray-500 mb-6">
              {followedRetailers.length === 0 
                ? "Start following local retailers to see their updates and special offers here."
                : "Try adjusting your search terms or category filter."
              }
            </p>
            {followedRetailers.length === 0 && (
              <Link href="/products">
                <Button className="bg-[var(--spiral-navy)] hover:bg-[var(--spiral-coral)]">
                  Discover Stores
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRetailers.map((follow) => (
              <Card key={follow.id} className="bg-white shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-[var(--spiral-navy)] mb-2">
                        {follow.retailer.businessName}
                      </CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {follow.retailer.category}
                        </Badge>
                        {follow.retailer.approved && (
                          <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                    <FollowRetailerButton
                      retailerId={follow.retailer.id}
                      retailerName={follow.retailer.businessName}
                      userId={userId}
                      size="sm"
                    />
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-gray-600">
                      <p>{follow.retailer.address}</p>
                      <p>ZIP: {follow.retailer.zipCode}</p>
                    </div>
                  </div>

                  {follow.retailer.description && (
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {follow.retailer.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      Following since {new Date(follow.followedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => window.location.href = `/store/${follow.retailer.id}`}
                    >
                      <Store className="w-3 h-3 mr-1" />
                      Visit Store
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => window.location.href = `mailto:${follow.retailer.email}`}
                    >
                      Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold text-[var(--spiral-navy)] mb-4">
            Discover More Local Businesses
          </h3>
          <div className="flex justify-center gap-4">
            <Link href="/products">
              <Button variant="outline" className="border-[var(--spiral-navy)] text-[var(--spiral-navy)]">
                Browse Products
              </Button>
            </Link>
            <Link href="/malls">
              <Button variant="outline" className="border-[var(--spiral-coral)] text-[var(--spiral-coral)]">
                Explore Malls
              </Button>
            </Link>
            <Link href="/shopper-dashboard">
              <Button className="bg-[var(--spiral-navy)] hover:bg-[var(--spiral-coral)]">
                My Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}