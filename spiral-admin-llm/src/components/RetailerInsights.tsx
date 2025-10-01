import { useEffect, useState } from "react";

export function RetailerInsights({ storeId }: { storeId: string }) {
  const [insight, setInsight] = useState<string>("Loading insights...");

  useEffect(() => {
    fetch(`/admin/insights/${storeId}`)
      .then(res => res.json())
      .then(data => setInsight(data.insights || "No insights yet."))
      .catch(() => setInsight("Error fetching insights."));
  }, [storeId]);

  return (
    <div className="bg-white shadow-md rounded-xl p-4">
      <h2 className="font-bold text-lg mb-2">Weekly Insights</h2>
      <p className="whitespace-pre-line">{insight}</p>
    </div>
  );
}

export function MallInsights({ mallId }: { mallId: string }) {
  const [insight, setInsight] = useState<string>("Loading mall insights...");

  useEffect(() => {
    fetch(`/admin/mall-insights/${mallId}`)
      .then(res => res.json())
      .then(data => setInsight(data.insights || "No mall insights yet."))
      .catch(() => setInsight("Error fetching mall insights."));
  }, [mallId]);

  return (
    <div className="bg-white shadow-md rounded-xl p-4">
      <h2 className="font-bold text-lg mb-2">Mall Management Insights</h2>
      <p className="whitespace-pre-line">{insight}</p>
    </div>
  );
}

export function ShopperInsights({ shopperId }: { shopperId: string }) {
  const [insight, setInsight] = useState<string>("Loading your insights...");

  useEffect(() => {
    fetch(`/admin/shopper-insights/${shopperId}`)
      .then(res => res.json())
      .then(data => setInsight(data.insights || "No personalized insights yet."))
      .catch(() => setInsight("Error fetching insights."));
  }, [shopperId]);

  return (
    <div className="bg-white shadow-md rounded-xl p-4">
      <h2 className="font-bold text-lg mb-2">Your Shopping Insights</h2>
      <p className="whitespace-pre-line">{insight}</p>
    </div>
  );
}