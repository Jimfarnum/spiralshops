import React from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import LocalStoreVerificationDisplay from "@/components/LocalStoreVerificationDisplay";

const TrustedLocalStores = () => {
  // Mock verified local stores for demonstration
  const mockVerifiedStores = [
    {
      id: "1",
      name: "Main Street Coffee Co.",
      description: "Family-owned coffee roaster serving fresh, locally-sourced coffee since 2008. Community favorite with award-winning espresso blends.",
      category: "Food & Beverage",
      address: "123 Main Street, Downtown",
      phone: "(555) 123-4567",
      isVerified: true,
      verificationTier: "Local" as const,
      rating: 4.8,
      reviewCount: 234,
      verifiedSince: "2022",
      businessLicense: "FB-2023-001",
      localPermits: true
    },
    {
      id: "2",
      name: "Artisan Bakery & Deli",
      description: "Fresh-baked breads, pastries, and gourmet sandwiches made daily. Local ingredients sourced from area farms.",
      category: "Food & Beverage",
      address: "456 Oak Avenue, Historic District",
      phone: "(555) 234-5678",
      isVerified: true,
      verificationTier: "Local" as const,
      rating: 4.6,
      reviewCount: 189,
      verifiedSince: "2023",
      businessLicense: "FB-2023-002",
      localPermits: true
    },
    {
      id: "3",
      name: "Green Valley Hardware",
      description: "Full-service hardware store with everything for home improvement, gardening, and repairs. Expert advice from longtime locals.",
      category: "Home & Garden",
      address: "789 Valley Road, Green Valley",
      phone: "(555) 345-6789",
      isVerified: true,
      verificationTier: "Local" as const,
      rating: 4.7,
      reviewCount: 156,
      verifiedSince: "2021",
      businessLicense: "HW-2023-001",
      localPermits: true
    },
    {
      id: "4",
      name: "Downtown Boutique",
      description: "Curated collection of women's clothing, accessories, and local artisan jewelry. Supporting local designers and makers.",
      category: "Fashion & Retail",
      address: "321 Center Street, Downtown",
      phone: "(555) 456-7890",
      isVerified: true,
      verificationTier: "Basic" as const,
      rating: 4.4,
      reviewCount: 98,
      verifiedSince: "2024",
      businessLicense: "RT-2024-001",
      localPermits: false
    },
    {
      id: "5",
      name: "Regional Electronics Plus",
      description: "Electronics retailer with 8 locations across the tri-state area. Authorized dealer for major brands with local service.",
      category: "Electronics",
      address: "555 Commerce Boulevard, Tech District",
      phone: "(555) 567-8901",
      isVerified: true,
      verificationTier: "Regional" as const,
      rating: 4.3,
      reviewCount: 445,
      verifiedSince: "2020",
      businessLicense: "EL-2020-001",
      localPermits: true
    },
    {
      id: "6",
      name: "National Office Supply Co.",
      description: "Nationwide office supply chain with local warehouse and same-day delivery. Business solutions for companies of all sizes.",
      category: "Office & Business",
      address: "777 Industrial Drive, Business Park",
      phone: "(555) 678-9012",
      isVerified: true,
      verificationTier: "National" as const,
      rating: 4.1,
      reviewCount: 1203,
      verifiedSince: "2019",
      businessLicense: "OS-2019-001",
      localPermits: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Trusted Local Stores
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Shop with confidence at verified local businesses. Every store displayed has completed our comprehensive verification process to ensure legitimacy and quality.
          </p>
        </div>

        {/* Local Store Verification Display */}
        <LocalStoreVerificationDisplay stores={mockVerifiedStores} />

        {/* Why Verification Matters */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🛡️</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Verified Identity</h3>
            <p className="text-gray-600">
              Every business owner's identity is verified through government-issued documentation and business registration.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📍</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Physical Location</h3>
            <p className="text-gray-600">
              We confirm physical business addresses and validate that stores operate from legitimate commercial locations.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📜</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Legal Compliance</h3>
            <p className="text-gray-600">
              Business licenses, permits, and regulatory compliance are verified to ensure stores operate legally.
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TrustedLocalStores;