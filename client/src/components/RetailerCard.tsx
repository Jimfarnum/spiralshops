import React from "react";
import VerifiedBadge from "@/components/VerifiedBadge";
import type { Store } from "@shared/schema";

interface RetailerCardProps {
  store: Store;
}

const RetailerCard: React.FC<RetailerCardProps> = ({ store }) => {
  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">{store.name}</h2>
        <VerifiedBadge 
          isVerified={store.isVerified || false} 
          tier={store.verificationTier as "Unverified" | "Basic" | "Local" | "Regional" | "National" | null} 
        />
      </div>
      <p className="text-sm text-gray-600 mb-3">{store.description}</p>
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>{store.category}</span>
        <span>{store.address}</span>
      </div>
      
      {store.rating && (
        <div className="mt-2 flex items-center">
          <span className="text-yellow-400">★</span>
          <span className="ml-1 text-sm font-medium">{store.rating}</span>
          <span className="ml-1 text-sm text-gray-500">({store.reviewCount} reviews)</span>
        </div>
      )}
    </div>
  );
};

export default RetailerCard;