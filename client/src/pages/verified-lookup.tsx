import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Shield, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import VerifiedBadge from "@/components/VerifiedBadge";
import type { Store } from "@shared/schema";

export default function VerifiedLookupPage() {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!search.trim()) return;
    
    setIsSearching(true);
    try {
      const res = await fetch(`/api/lookup-store?name=${encodeURIComponent(search.trim())}`);
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Search error:", error);
      setResult({
        name: search,
        isVerified: false,
        tier: "Error",
        message: "Search failed. Please try again."
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const getVerificationStatus = (store: Store) => {
    if (store.isVerified) {
      switch (store.verificationTier) {
        case "national":
          return { status: "National Verified", color: "bg-purple-100 text-purple-800", icon: Shield };
        case "regional":
          return { status: "Regional Verified", color: "bg-yellow-100 text-yellow-800", icon: Shield };
        case "local":
          return { status: "Local Verified", color: "bg-green-100 text-green-800", icon: Shield };
        case "basic":
          return { status: "Basic Verified", color: "bg-blue-100 text-blue-800", icon: Shield };
        default:
          return { status: "Verified", color: "bg-green-100 text-green-800", icon: CheckCircle };
      }
    }
    return { status: "Not Verified", color: "bg-gray-100 text-gray-800", icon: XCircle };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            SPIRAL Verified Lookup
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Instantly verify if a local business is SPIRAL certified. Check verification status, trust level, and business credentials.
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Store Verification Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Enter store name (e.g., 'Downtown Coffee', 'Main Street Boutique')"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="text-lg py-3"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={!search.trim() || isSearching}
                className="px-8 py-3 bg-green-600 hover:bg-green-700"
              >
                <Search className="w-4 h-4 mr-2" />
                {isSearching ? "Searching..." : "Lookup"}
              </Button>
            </div>
            
            {isSearching && (
              <p className="text-sm text-gray-500 mt-2">Searching SPIRAL database...</p>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        {result && (
          <div className="space-y-6">
            {result.isVerified && !result.suggestions ? (
              <Card className={`border-2 ${result.isVerified ? 'border-green-200' : 'border-red-200'}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">{result.name}</CardTitle>
                    <VerifiedBadge 
                      isVerified={result.isVerified || false} 
                      tier={result.tier as "Unverified" | "Basic" | "Local" | "Regional" | "National" | null}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Business Information</h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Category:</span> {result.category || "N/A"}</p>
                        <p><span className="font-medium">Location:</span> {result.address || "N/A"}</p>
                        <p><span className="font-medium">Rating:</span> {result.rating ? `${result.rating}/5 stars` : "No ratings yet"}</p>
                        <p><span className="font-medium">Description:</span> {result.description || "No description available"}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Verification Status</h3>
                      <div className="space-y-3">
                        {result.isVerified ? (
                          <>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                              <Badge className="bg-green-100 text-green-800">
                                ✅ {result.name} is SPIRAL Verified ({result.tier})
                              </Badge>
                            </div>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                              <p className="text-sm text-green-800">
                                <strong>✅ This business is SPIRAL verified</strong><br />
                                This means they have completed our verification process including business registration, identity verification, and quality standards.
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-2">
                              <XCircle className="w-5 h-5 text-red-500" />
                              <Badge className="bg-red-100 text-red-800">
                                ❌ Not Verified
                              </Badge>
                            </div>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                              <p className="text-sm text-yellow-800">
                                <strong>⚠️ This business is not yet verified</strong><br />
                                {result.message || "They may still be legitimate, but have not completed SPIRAL's verification process."}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : result.suggestions && result.suggestions.length > 0 ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Similar stores found ({result.suggestions.length})
                </h3>
                <div className="grid gap-4">
                  {result.suggestions.map((store: any, index: number) => (
                      <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{store.name}</h4>
                              <p className="text-sm text-gray-600">{store.category} • {store.address}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge className={store.isVerified ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                                {store.isVerified ? `✅ Verified (${store.tier})` : "❌ Not Verified"}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            ) : (
              <Card className="border-2 border-red-200">
                <CardContent className="p-6 text-center">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No stores found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    We couldn't find any stores matching "{result.name}". This could mean:
                  </p>
                  <ul className="text-sm text-gray-500 text-left max-w-md mx-auto space-y-1">
                    <li>• The store name is spelled differently</li>
                    <li>• The business is not yet listed in SPIRAL</li>
                    <li>• The store operates under a different name</li>
                  </ul>
                  <Button
                    onClick={() => setResult(null)}
                    variant="outline"
                    className="mt-4"
                  >
                    Try Another Search
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Info Section */}
        <Card className="mt-12 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              About SPIRAL Verification
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-blue-800">
              <div>
                <h4 className="font-medium mb-2">What does verification mean?</h4>
                <p>
                  SPIRAL verified businesses have completed our comprehensive verification process, 
                  including business registration verification, identity confirmation, and quality standards review.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Verification levels:</h4>
                <ul className="space-y-1">
                  <li><strong>Basic:</strong> Identity and business registration verified</li>
                  <li><strong>Local:</strong> Local business credentials confirmed</li>
                  <li><strong>Regional:</strong> Multi-location business verification</li>
                  <li><strong>National:</strong> Large-scale enterprise verification</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
}