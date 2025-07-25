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
      id: "1",
      name: "Unverified Local Shop",
      description: "New business that hasn't completed verification yet",
      category: "Retail",
      address: "321 Side St, Small Town",
      isVerified: false,
      verificationTier: "Unverified",
      rating: 3.8,
      reviewCount: 12
    },
    {
      id: "2",
      name: "Basic Verified Store",
      description: "Small business with basic identity verification completed",
      category: "Boutique",
      address: "456 Oak Ave, Downtown",
      isVerified: true,
      verificationTier: "Basic",
      rating: 4.1,
      reviewCount: 34
    },
    {
      id: "3",
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
      id: "4",
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
      id: "5",
      name: "National Tech Solutions",
      description: "Leading technology retailer with nationwide presence",
      category: "Technology",
      address: "789 Corporate Ave, Metro City",
      isVerified: true,
      verificationTier: "National",
      rating: 4.2,
      reviewCount: 5247
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            SPIRAL 5-Tier Verification System
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive verification system helps customers identify trusted businesses with clear, 
            color-coded badges that indicate the store's verification level, business scope, and trustworthiness.
          </p>
        </div>

        {/* Verification Tiers Explanation */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
          <Card className="border-l-4 border-l-gray-400">
            <CardHeader className="pb-3">
              <CardTitle className="text-gray-700 text-sm">
                Unverified Store
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="mb-2">
                <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                  ❌ No Verification
                </span>
              </div>
              <p className="text-xs text-gray-600">
                New businesses that haven't completed verification. Limited trust indicators.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-gray-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-gray-700 text-sm flex items-center gap-2">
                <VerifiedBadge isVerified={true} tier="Basic" />
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <h4 className="font-semibold mb-1 text-sm">Basic Verification</h4>
              <p className="text-xs text-gray-600">
                Identity verified with basic business registration documents.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-green-700 text-sm flex items-center gap-2">
                <VerifiedBadge isVerified={true} tier="Local" />
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <h4 className="font-semibold mb-1 text-sm">Local Verification</h4>
              <p className="text-xs text-gray-600">
                Community-focused businesses with verified local presence and permits.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-yellow-700 text-sm flex items-center gap-2">
                <VerifiedBadge isVerified={true} tier="Regional" />
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <h4 className="font-semibold mb-1 text-sm">Regional Verification</h4>
              <p className="text-xs text-gray-600">
                Multi-location businesses with verified regional operations and standards.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-blue-700 text-sm flex items-center gap-2">
                <VerifiedBadge isVerified={true} tier="National" />
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <h4 className="font-semibold mb-1 text-sm">National Verification</h4>
              <p className="text-xs text-gray-600">
                Nationwide retailers with corporate structure and national service capabilities.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Demo Store Cards */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Example Store Listings</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {demoStores.map((store) => (
              <RetailerCard key={store.id} store={store as Store} />
            ))}
          </div>
        </div>

        {/* Badge Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Complete Verification Badge System</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium">Unverified Store:</span>
                  <p className="text-xs text-gray-500">No badge displayed - requires verification</p>
                </div>
                <span className="text-gray-500 text-sm">❌ No Badge</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium">Basic Verified:</span>
                  <p className="text-xs text-gray-500">Identity and basic business registration</p>
                </div>
                <VerifiedBadge isVerified={true} tier="Basic" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium">Local Business:</span>
                  <p className="text-xs text-gray-500">Community presence and local permits</p>
                </div>
                <VerifiedBadge isVerified={true} tier="Local" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium">Regional Chain:</span>
                  <p className="text-xs text-gray-500">Multi-location with regional operations</p>
                </div>
                <VerifiedBadge isVerified={true} tier="Regional" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium">National Brand:</span>
                  <p className="text-xs text-gray-500">Nationwide presence and corporate structure</p>
                </div>
                <VerifiedBadge isVerified={true} tier="National" />
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