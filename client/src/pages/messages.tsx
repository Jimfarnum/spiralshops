import React from "react";
import RetailerMessaging from "@/components/RetailerMessaging";

export default function MessagesPage() {
  // Mock user data - in a real app this would come from auth context
  const currentUserId = "demo-user-001";
  const currentUserType = "user" as const;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--spiral-navy)] mb-4">
            Messages
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Chat directly with local retailers, ask questions about products, 
            and get personalized customer service.
          </p>
        </div>

        {/* Messaging Interface */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <RetailerMessaging 
            currentUserId={currentUserId}
            currentUserType={currentUserType}
          />
        </div>

        {/* Help Section */}
        <div className="mt-8 max-w-3xl mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              Messaging Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <h4 className="font-medium mb-1">📝 Be Specific</h4>
                <p>Include product details, sizes, or specific questions to get the most helpful responses.</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">⏰ Response Times</h4>
                <p>Most retailers respond within a few hours during business hours.</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">🤝 Be Courteous</h4>
                <p>Remember you're talking to real business owners who appreciate polite communication.</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">📞 Complex Questions</h4>
                <p>For complex orders or issues, don't hesitate to ask for a phone call.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}