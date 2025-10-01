import React from "react";
import { useRoute } from "wouter";
import MallMapViewer from "@/components/MallMapViewer";

export default function MallMapPage() {
  const [, params] = useRoute("/mall/:id/map");
  const mallId = params?.id ? parseInt(params.id) : 1;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--spiral-navy)] mb-4">
            Interactive Mall Map
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Navigate the mall with our interactive map. Click on store markers 
            to view details, hours, and get directions.
          </p>
        </div>

        {/* Mall Map Component */}
        <MallMapViewer mallId={mallId} />

        {/* Additional Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 font-bold text-xl">🗺️</span>
            </div>
            <h3 className="text-lg font-semibold text-[var(--spiral-navy)] mb-2">
              Interactive Navigation
            </h3>
            <p className="text-gray-600 text-sm">
              Click and explore store locations with detailed information and real-time availability
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 font-bold text-xl">📍</span>
            </div>
            <h3 className="text-lg font-semibold text-[var(--spiral-navy)] mb-2">
              Store Details
            </h3>
            <p className="text-gray-600 text-sm">
              View store hours, contact information, ratings, and available services
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-600 font-bold text-xl">🧭</span>
            </div>
            <h3 className="text-lg font-semibold text-[var(--spiral-navy)] mb-2">
              Smart Directions
            </h3>
            <p className="text-gray-600 text-sm">
              Get turn-by-turn directions within the mall and integration with GPS navigation
            </p>
          </div>
        </div>

        {/* Navigation Tips */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-amber-900 mb-3">
            💡 Navigation Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-amber-800">
            <div>
              <strong>• Click Store Markers:</strong> Get detailed information about each store
            </div>
            <div>
              <strong>• Use Categories:</strong> Filter stores by category using the legend
            </div>
            <div>
              <strong>• Zoom & Pan:</strong> Use touch gestures or mouse controls to navigate
            </div>
            <div>
              <strong>• Get Directions:</strong> Click "Get Directions" for turn-by-turn navigation
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}