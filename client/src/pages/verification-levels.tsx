import React from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import VerifiedBadge from "@/components/VerifiedBadge";

const VerificationLevels = () => {
  const verificationLevels = [
    {
      tier: "Unverified",
      name: "Unverified Business",
      icon: "❌",
      color: "bg-gray-100 text-gray-800",
      requirements: [
        "No verification completed",
        "Limited platform features",
        "No trust indicators displayed"
      ],
      benefits: [
        "Basic store listing",
        "Customer can find location",
        "Limited engagement tools"
      ],
      trustLevel: "Unknown",
      badge: null
    },
    {
      tier: "Basic",
      name: "Basic Verification",
      icon: "🆔",
      color: "bg-gray-200 text-gray-800",
      requirements: [
        "Business registration document",
        "Owner identity verification",
        "Valid contact information"
      ],
      benefits: [
        "Basic trust badge",
        "Customer messaging enabled",
        "Review system access"
      ],
      trustLevel: "Low",
      badge: <VerifiedBadge isVerified={true} tier="Basic" />
    },
    {
      tier: "Local",
      name: "Local Business Verification",
      icon: "🏪",
      color: "bg-green-200 text-green-800",
      requirements: [
        "Local business license",
        "Physical address verification",
        "Local permit documentation"
      ],
      benefits: [
        "Local priority in search",
        "Community trust badge",
        "Enhanced listing features"
      ],
      trustLevel: "Medium",
      badge: <VerifiedBadge isVerified={true} tier="Local" />
    },
    {
      tier: "Regional",
      name: "Regional Business Verification",
      icon: "🏢",
      color: "bg-yellow-200 text-yellow-800",
      requirements: [
        "Multi-location verification",
        "Regional business registration",
        "Chain operation documentation"
      ],
      benefits: [
        "Regional search priority",
        "Multi-store management",
        "Enhanced analytics access"
      ],
      trustLevel: "High",
      badge: <VerifiedBadge isVerified={true} tier="Regional" />
    },
    {
      tier: "National",
      name: "National Brand Verification",
      icon: "🏛️",
      color: "bg-blue-200 text-blue-800",
      requirements: [
        "National corporate registration",
        "Nationwide operation proof",
        "Corporate structure verification"
      ],
      benefits: [
        "National visibility",
        "Premium listing features",
        "Advanced business tools"
      ],
      trustLevel: "Very High",
      badge: <VerifiedBadge isVerified={true} tier="National" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Complete Verification Level Guide
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Understanding SPIRAL's 5-tier verification system helps businesses choose the right level 
            for their operations and helps customers make informed shopping decisions.
          </p>
        </div>

        {/* Verification Levels Grid */}
        <div className="grid gap-6 mb-12">
          {verificationLevels.map((level, index) => (
            <Card key={level.tier} className="border-l-4 border-l-gray-400">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{level.icon}</span>
                    <div>
                      <CardTitle className="text-xl">{level.name}</CardTitle>
                      <p className="text-sm text-gray-600">Tier {index + 1} of 5</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {level.badge}
                    <Badge className={level.color}>
                      Trust: {level.trustLevel}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-900">Requirements:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {level.requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-900">Benefits:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {level.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">✓</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Verification Process */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Verification Process Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl mb-2">📝</div>
                <h4 className="font-semibold mb-1">1. Application</h4>
                <p className="text-sm text-gray-600">Submit verification request with required documents</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl mb-2">🔍</div>
                <h4 className="font-semibold mb-1">2. Review</h4>
                <p className="text-sm text-gray-600">Admin team reviews documents and business information</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl mb-2">✅</div>
                <h4 className="font-semibold mb-1">3. Approval</h4>
                <p className="text-sm text-gray-600">Verification tier assigned based on business scope</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl mb-2">🎯</div>
                <h4 className="font-semibold mb-1">4. Benefits</h4>
                <p className="text-sm text-gray-600">Enhanced features and customer trust unlocked</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="text-center">
          <CardContent className="py-8">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Verified?</h3>
            <p className="text-gray-600 mb-6">
              Start your verification journey today and unlock enhanced features for your business.
            </p>
            <div className="flex gap-4 justify-center">
              <a 
                href="/verify-store"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Verification
              </a>
              <a 
                href="/verification-demo"
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                View Demo
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default VerificationLevels;