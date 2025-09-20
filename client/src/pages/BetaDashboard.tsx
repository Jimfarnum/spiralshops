import React, { useState, useEffect } from "react";

interface BetaKPI {
  label: string;
  value: string | number;
  icon: string;
  trend?: string;
}

interface DashboardData {
  orders: number;
  salesTotal: number;
  spiralsEarned: number;
  spiralsRedeemed: number;
  platformFees: number;
  inviteAccepted: number;
  sharesOnX: number;
  activeRetailers: number;
  pickupRate: number;
}

export default function BetaDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showResetModal, setShowResetModal] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      setIsLoading(true);
      const response = await fetch("/api/beta/dashboard");
      if (response.ok) {
        const result = await response.json();
        setData(result.data);
      } else {
        console.error("Failed to fetch dashboard data");
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleReset() {
    if (isResetting) return;
    
    setIsResetting(true);
    try {
      const response = await fetch("/api/beta/dashboard/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      
      if (response.ok) {
        await fetchDashboardData(); // Refresh data
        setShowResetModal(false);
        alert("✅ Beta dashboard reset successfully!");
      } else {
        alert("❌ Reset failed. Please try again.");
      }
    } catch (error) {
      console.error("Reset error:", error);
      alert("❌ Reset error. Please try again.");
    } finally {
      setIsResetting(false);
    }
  }

  const kpis: BetaKPI[] = data ? [
    { label: "Orders", value: data.orders.toLocaleString(), icon: "📦", trend: "+12%" },
    { label: "Sales Total", value: `$${data.salesTotal.toLocaleString()}`, icon: "💰", trend: "+18%" },
    { label: "SPIRALs Earned", value: data.spiralsEarned.toLocaleString(), icon: "🌟", trend: "+25%" },
    { label: "SPIRALs Redeemed", value: data.spiralsRedeemed.toLocaleString(), icon: "✨", trend: "+15%" },
    { label: "Platform Fees", value: `$${data.platformFees.toLocaleString()}`, icon: "🏦", trend: "+20%" },
    { label: "Invites Accepted", value: data.inviteAccepted.toLocaleString(), icon: "🤝", trend: "+30%" },
    { label: "Shares on X", value: data.sharesOnX.toLocaleString(), icon: "🐦", trend: "+45%" },
    { label: "Active Retailers", value: data.activeRetailers.toLocaleString(), icon: "🏪", trend: "+8%" },
    { label: "Pickup Rate", value: `${data.pickupRate}%`, icon: "📍", trend: "+5%" }
  ] : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center" data-testid="loading">
          <div className="text-4xl mb-4">🧪</div>
          <div className="text-xl font-semibold text-[#007B8A]">Loading Beta Dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Disclaimer Banner */}
      <div className="sticky top-0 z-50 bg-yellow-100 border-b-2 border-yellow-400 px-4 py-2" data-testid="disclaimer-banner">
        <div className="max-w-screen-xl mx-auto text-center">
          <span className="font-medium text-yellow-800">
            🧪 <strong>BETA TEST MODE</strong> - All data is simulated for demonstration purposes only
          </span>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto p-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#007B8A] mb-2" data-testid="dashboard-title">
              SPIRAL Beta Dashboard
            </h1>
            <p className="text-gray-600">Real-time metrics for investor presentations</p>
          </div>
          
          <button
            onClick={() => setShowResetModal(true)}
            className="tap mt-4 sm:mt-0 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            data-testid="button-reset"
          >
            🔄 Reset Demo Data
          </button>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {kpis.map((kpi, index) => (
            <div 
              key={kpi.label} 
              className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-shadow"
              data-testid={`kpi-${kpi.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{kpi.icon}</span>
                {kpi.trend && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                    {kpi.trend}
                  </span>
                )}
              </div>
              <div className="text-2xl font-bold text-[#007B8A] mb-1" data-testid={`value-${kpi.label.toLowerCase().replace(/\s+/g, '-')}`}>
                {kpi.value}
              </div>
              <div className="text-sm text-gray-600">{kpi.label}</div>
            </div>
          ))}
        </div>

        {/* Key Insights */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-[#007B8A] mb-4">💡 Key Beta Insights</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-medium mb-2">🎯 Strong Performance Areas:</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Social sharing driving 45% growth in X engagement</li>
                <li>• Invite system achieving 30% acceptance rate</li>
                <li>• SPIRAL loyalty program showing high engagement</li>
                <li>• Multi-retailer checkout working seamlessly</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">📊 Platform Economics:</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Platform fee revenue: ${data?.platformFees.toLocaleString() || "0"}</li>
                <li>• Average order value trending up 18%</li>
                <li>• Pickup options driving local engagement</li>
                <li>• Cross-retailer discovery increasing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" data-testid="reset-modal">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">⚠️</div>
              <h3 className="text-lg font-semibold">Reset Beta Dashboard?</h3>
              <p className="text-sm text-gray-600 mt-2">This will clear all demo metrics and reset to initial values.</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetModal(false)}
                className="tap flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors"
                data-testid="button-cancel-reset"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                disabled={isResetting}
                className="tap flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
                data-testid="button-confirm-reset"
              >
                {isResetting ? "Resetting..." : "Reset"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}