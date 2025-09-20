import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import VerifiedBadge from "@/components/VerifiedBadge";
import { Shield, CheckCircle, Star, MapPin, Clock, Phone } from "lucide-react";

interface Store {
  id: string;
  name: string;
  description: string;
  category: string;
  address: string;
  phone: string;
  isVerified: boolean;
  verificationTier: "Unverified" | "Basic" | "Local" | "Regional" | "National";
  rating: number;
  reviewCount: number;
  verifiedSince?: string;
  businessLicense?: string;
  localPermits?: boolean;
}

interface LocalStoreVerificationDisplayProps {
  stores: Store[];
}

const LocalStoreVerificationDisplay: React.FC<LocalStoreVerificationDisplayProps> = ({ stores }) => {
  const getVerificationIcon = (tier: string) => {
    switch (tier) {
      case "Local": return "🏪";
      case "Regional": return "🏢";
      case "National": return "🏛️";
      case "Basic": return "🆔";
      default: return "❓";
    }
  };

  const getTrustLevel = (tier: string) => {
    switch (tier) {
      case "National": return { level: "Very High", color: "bg-blue-100 text-blue-800" };
      case "Regional": return { level: "High", color: "bg-yellow-100 text-yellow-800" };
      case "Local": return { level: "Medium", color: "bg-green-100 text-green-800" };
      case "Basic": return { level: "Low", color: "bg-gray-100 text-gray-800" };
      default: return { level: "Unknown", color: "bg-red-100 text-red-800" };
    }
  };

  const verifiedStores = stores.filter(store => store.isVerified && store.verificationTier !== "Unverified");
  const localStores = verifiedStores.filter(store => store.verificationTier === "Local");

  return (
    <div className="space-y-6">
      {/* Trust Banner */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Shield className="w-12 h-12 text-green-600" />
            <div>
              <h3 className="text-xl font-bold text-green-900">Verified Local Businesses</h3>
              <p className="text-green-700">
                All displayed stores have completed our verification process. Shop with confidence knowing these are legitimate, trusted local businesses.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{verifiedStores.length}</div>
            <div className="text-sm text-gray-600">Verified Stores</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{localStores.length}</div>
            <div className="text-sm text-gray-600">Local Verified</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {verifiedStores.filter(s => s.verificationTier === "Regional").length}
            </div>
            <div className="text-sm text-gray-600">Regional Chains</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {verifiedStores.filter(s => s.verificationTier === "National").length}
            </div>
            <div className="text-sm text-gray-600">National Brands</div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Local Stores */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <CheckCircle className="w-6 h-6 text-green-600" />
          Trusted Local Stores
        </h2>
        <div className="grid gap-4">
          {verifiedStores.map((store) => {
            const trustLevel = getTrustLevel(store.verificationTier);
            return (
              <Card key={store.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{store.name}</h3>
                        <VerifiedBadge 
                          isVerified={store.isVerified} 
                          tier={store.verificationTier}
                        />
                      </div>
                      <p className="text-gray-600 mb-3">{store.description}</p>
                      
                      {/* Trust Indicators */}
                      <div className="flex flex-wrap gap-3 mb-3">
                        <Badge className={trustLevel.color}>
                          <Shield className="w-3 h-3 mr-1" />
                          Trust: {trustLevel.level}
                        </Badge>
                        <Badge variant="outline">
                          <span className="mr-1">{getVerificationIcon(store.verificationTier)}</span>
                          {store.verificationTier} Verified
                        </Badge>
                        {store.verifiedSince && (
                          <Badge variant="outline">
                            <Clock className="w-3 h-3 mr-1" />
                            Since {store.verifiedSince}
                          </Badge>
                        )}
                      </div>

                      {/* Business Details */}
                      <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {store.address}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {store.phone}
                        </div>
                        {store.businessLicense && (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Business License: {store.businessLicense}
                          </div>
                        )}
                        {store.localPermits && (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Local Permits Verified
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-semibold">{store.rating}</span>
                        <span className="text-gray-500">({store.reviewCount})</span>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        {store.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Verification Details */}
                  {store.verificationTier === "Local" && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-green-600" />
                        <span className="font-semibold text-green-900">Local Verification Includes:</span>
                      </div>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>✓ Business registration verified</li>
                        <li>✓ Physical address confirmed</li>
                        <li>✓ Local permits validated</li>
                        <li>✓ Owner identity verified</li>
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Verification Promise */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6 text-center">
          <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-blue-900 mb-2">Our Verification Promise</h3>
          <p className="text-blue-700 max-w-2xl mx-auto">
            Every verified store on SPIRAL has undergone rigorous identity and business validation. 
            We verify business licenses, permits, and physical locations to ensure you're shopping with legitimate, trusted local businesses.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocalStoreVerificationDisplay;