import React from "react";
import LargeRetailerOptIn from "@/components/LargeRetailerOptIn";

export default function LargeRetailerSettingsPage() {
  // Mock user ID - in a real app this would come from auth context
  const userId = "demo-user-001";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--spiral-navy)] mb-4">
            Retailer Preferences
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Customize your shopping experience by choosing whether to include 
            offers from large retailers alongside local businesses.
          </p>
        </div>

        {/* Large Retailer Opt-In Component */}
        <LargeRetailerOptIn 
          userId={userId}
          onToggle={(optedIn) => {
            console.log("Large retailer opt-in toggled:", optedIn);
          }}
        />

        {/* Additional Information */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-[var(--spiral-navy)] mb-6 text-center">
            How This Affects Your SPIRAL Experience
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Local-First Benefits */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-green-700 mb-3">
                🏪 Local-First Mode Benefits
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong>Higher SPIRAL Earnings:</strong> Earn 10 SPIRALs per $100 on in-person purchases (vs 5 online)
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong>Community Impact:</strong> Keep money in your local economy and support neighbors
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong>Personal Relationships:</strong> Build connections with business owners who remember you
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong>Unique Products:</strong> Discover items you can't find at large retailers
                  </div>
                </div>
              </div>
            </div>

            {/* Mixed Mode Benefits */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-blue-700 mb-3">
                🌐 Mixed Mode Benefits
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong>Broader Selection:</strong> Access to millions more products from major retailers
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong>Price Comparison:</strong> Compare local prices with national retailers for better deals
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong>Convenience Options:</strong> Same-day delivery and next-day shipping when needed
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong>Best of Both:</strong> Local businesses still get priority placement and bonus SPIRALs
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SPIRAL Earning Comparison */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h4 className="text-lg font-semibold text-[var(--spiral-navy)] mb-4 text-center">
              SPIRAL Earning Rates (Regardless of Your Choice)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-green-100 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-700">10</div>
                <div className="text-sm text-green-600">SPIRALs per $100</div>
                <div className="text-xs text-green-600 mt-1">In-Person Local Purchase</div>
              </div>
              <div className="bg-blue-100 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-700">5</div>
                <div className="text-sm text-blue-600">SPIRALs per $100</div>
                <div className="text-xs text-blue-600 mt-1">Online Local Purchase</div>
              </div>
              <div className="bg-orange-100 p-4 rounded-lg">
                <div className="text-2xl font-bold text-orange-700">2</div>
                <div className="text-sm text-orange-600">SPIRALs per $100</div>
                <div className="text-xs text-orange-600 mt-1">Large Retailer Purchase</div>
              </div>
            </div>
            <p className="text-xs text-gray-600 text-center mt-4">
              Note: Local businesses always earn more SPIRALs to encourage community support
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}