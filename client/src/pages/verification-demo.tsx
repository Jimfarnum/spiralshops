import React from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import VerifiedBadge from "@/components/VerifiedBadge";
import RetailerCard from "@/components/RetailerCard";
import type { Store } from "@shared/schema";

const VerificationDemo = () => {
  // Mock stores for demonstration
  const demoStores: Partial<Store>[] = [
    {
      id: 1,
      name: "Local Coffee Roasters",
      description: "Family-owned coffee shop serving the community for 15 years",
      category: "Food & Beverage",
      address: "123 Main St, Hometown",
      isVerified: true,
      verificationTier: "Local",
      rating: 4.8,
      reviewCount: 127
    },
    {
      id: 2,
      name: "Regional Electronics Hub",
      description: "Electronics retailer with 12 locations across the state",
      category: "Electronics",
      address: "456 Commerce Blvd, State City",
      isVerified: true,
      verificationTier: "Regional",
      rating: 4.5,
      reviewCount: 892
    },
    {
      id: 3,
      name: "National Tech Solutions",
      description: "Leading technology retailer with nationwide presence",
      category: "Technology",
      address: "789 Corporate Ave, Metro City",
      isVerified: true,
      verificationTier: "National",
      rating: 4.2,
      reviewCount: 5247
    },
    {
      id: 4,
      name: "Unverified Local Shop",
      description: "Local business that hasn't completed verification yet",
      category: "Retail",
      address: "321 Side St, Small Town",
      isVerified: false,
      verificationTier: null,
      rating: 4.0,
      reviewCount: 23
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            SPIRAL Three-Tier Verification System
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our verification system helps customers identify trusted businesses with clear, 
            color-coded badges that indicate the store's verification level and reach.
          </p>
        </div>

        {/* Verification Tiers Explanation */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="text-green-700 flex items-center gap-2">
                <VerifiedBadge isVerified={true} tier="Local" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold mb-2">Local Store Verification</h3>
              <p className="text-sm text-gray-600">
                Community-focused businesses serving their local area. 
                These stores have been verified for business registration and local presence.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader>
              <CardTitle className="text-yellow-700 flex items-center gap-2">
                <VerifiedBadge isVerified={true} tier="Regional" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold mb-2">Regional Store Verification</h3>
              <p className="text-sm text-gray-600">
                Multi-location businesses operating across regions or states. 
                Verified for expanded operations and consistent service standards.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="text-blue-700 flex items-center gap-2">
                <VerifiedBadge isVerified={true} tier="National" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold mb-2">National Store Verification</h3>
              <p className="text-sm text-gray-600">
                Nationwide retailers with established brand presence. 
                Verified for corporate structure and national service capabilities.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Demo Store Cards */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Example Store Listings</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {demoStores.map((store) => (
              <RetailerCard key={store.id} store={store as Store} />
            ))}
          </div>
        </div>

        {/* Badge Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Verification Badge Examples</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Local Business:</span>
                <VerifiedBadge isVerified={true} tier="Local" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Regional Chain:</span>
                <VerifiedBadge isVerified={true} tier="Regional" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">National Brand:</span>
                <VerifiedBadge isVerified={true} tier="National" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Unverified Store:</span>
                <span className="text-gray-500 text-sm">No verification badge displayed</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default VerificationDemo;