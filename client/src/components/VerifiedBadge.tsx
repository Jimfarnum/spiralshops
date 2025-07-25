import React from "react";

type BadgeProps = {
  isVerified: boolean;
  tier: "Local" | "Regional" | "National" | null;
};

const VerifiedBadge: React.FC<BadgeProps> = ({ isVerified, tier }) => {
  if (!isVerified || !tier) return null;

  const badgeColor = {
    Local: "bg-green-100 text-green-700",
    Regional: "bg-yellow-100 text-yellow-700",
    National: "bg-blue-100 text-blue-700",
  }[tier];

  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${badgeColor}`}
    >
      ✅ Verified {tier} Store
    </span>
  );
};

export default VerifiedBadge;