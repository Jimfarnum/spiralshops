import React from "react";

type BadgeProps = {
  isVerified: boolean;
  tier: "Unverified" | "Basic" | "Local" | "Regional" | "National" | null;
};

const VerifiedBadge: React.FC<BadgeProps> = ({ isVerified, tier }) => {
  // Show badge for all verification levels except completely unverified
  if (!tier || tier === "Unverified") return null;

  const badgeConfig = {
    Basic: {
      color: "bg-gray-100 text-gray-700 border border-gray-300",
      icon: "🆔",
      text: "Basic Verified"
    },
    Local: {
      color: "bg-green-100 text-green-700 border border-green-300",
      icon: "🏪",
      text: "Local Verified"
    },
    Regional: {
      color: "bg-yellow-100 text-yellow-700 border border-yellow-300",
      icon: "🏢",
      text: "Regional Verified"
    },
    National: {
      color: "bg-blue-100 text-blue-700 border border-blue-300",
      icon: "🏛️",
      text: "National Verified"
    }
  }[tier];

  if (!badgeConfig) return null;

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${badgeConfig.color}`}
    >
      <span>{badgeConfig.icon}</span>
      <span>{badgeConfig.text}</span>
    </span>
  );
};

export default VerifiedBadge;