import React from "react";
import LocalPickupScheduler from "@/components/LocalPickupScheduler";

export default function PickupSchedulerPage() {
  // Mock retailer ID - in a real app this would come from route params
  const retailerId = 1;
  const orderId = 123;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--spiral-navy)] mb-4">
            Schedule Local Pickup
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose a convenient time to pick up your order directly from the store.
            Fast, easy, and no shipping fees!
          </p>
        </div>

        {/* Pickup Scheduler Component */}
        <div className="max-w-2xl mx-auto">
          <LocalPickupScheduler 
            retailerId={retailerId}
            orderId={orderId}
            onScheduled={(pickup) => {
              console.log("Pickup scheduled:", pickup);
            }}
          />
        </div>

        {/* Info Section */}
        <div className="mt-12 max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-[var(--spiral-navy)] mb-4">
              Why Choose Local Pickup?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold text-xl">$0</span>
                </div>
                <h3 className="font-semibold mb-2">No Shipping Fees</h3>
                <p className="text-sm text-gray-600">Save money by picking up your order in-store</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">⚡</span>
                </div>
                <h3 className="font-semibold mb-2">Faster Access</h3>
                <p className="text-sm text-gray-600">Get your items sooner than standard shipping</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 font-bold">🤝</span>
                </div>
                <h3 className="font-semibold mb-2">Personal Service</h3>
                <p className="text-sm text-gray-600">Meet the business owners and get personalized help</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}