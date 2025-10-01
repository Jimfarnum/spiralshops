export const PlanBadge: React.FC<{plan: "free"|"silver"|"gold"}> = ({ plan }) => {
  const color = plan === "gold" ? "bg-yellow-200 text-yellow-900"
             : plan === "silver" ? "bg-gray-200 text-gray-800"
             : "bg-green-200 text-green-800";
  return <span className={`px-2 py-1 rounded text-xs font-semibold ${color}`}>{plan.toUpperCase()}</span>;
};