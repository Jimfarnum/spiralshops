import { useState } from "react";

interface FeeCalculation {
  tier: number;
  description: string;
  transactionFee: string;
  adFees: string;
  listingFee: string;
  storeCount: string;
  revenue: string;
}

const FEE_TIERS: FeeCalculation[] = [
  {
    tier: 1,
    description: "10–49 stores or $10M–$50M/year",
    transactionFee: "5%",
    adFees: "$500–$2,000/mo",
    listingFee: "$0",
    storeCount: "10-49",
    revenue: "$10M-$50M"
  },
  {
    tier: 2,
    description: "50–199 stores or $50M–$500M/year", 
    transactionFee: "6%",
    adFees: "$2,000–$5,000/mo",
    listingFee: "Custom",
    storeCount: "50-199",
    revenue: "$50M-$500M"
  },
  {
    tier: 3,
    description: "200+ stores or $500M+",
    transactionFee: "7%",
    adFees: "$5,000+/mo",
    listingFee: "Custom",
    storeCount: "200+",
    revenue: "$500M+"
  }
];

export default function FeeExplorer() {
  const [storeCount, setStoreCount] = useState<number>(1);
  const [annualRevenue, setAnnualRevenue] = useState<number>(1000000);
  const [monthlySales, setMonthlySales] = useState<number>(50000);

  const calculateTier = (stores: number, revenue: number): number => {
    if (stores >= 200 || revenue >= 500000000) return 3;
    if (stores >= 50 || revenue >= 50000000) return 2;
    if (stores >= 10 || revenue >= 10000000) return 1;
    return 0; // Local business
  };

  const currentTier = calculateTier(storeCount, annualRevenue);
  const isLargeRetailer = currentTier > 0;

  const calculateMonthlyFees = (sales: number, tier: number): number => {
    const rates = [0, 0.05, 0.06, 0.07];
    return sales * rates[tier];
  };

  const monthlyTransactionFees = calculateMonthlyFees(monthlySales, currentTier);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">SPIRAL Fee Explorer Calculator</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Business Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Number of Store Locations</label>
              <input
                type="number"
                min="1"
                value={storeCount}
                onChange={(e) => setStoreCount(Number(e.target.value))}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter store count"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Annual Revenue ($)</label>
              <input
                type="number"
                min="0"
                value={annualRevenue}
                onChange={(e) => setAnnualRevenue(Number(e.target.value))}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter annual revenue"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Estimated Monthly Sales ($)</label>
              <input
                type="number"
                min="0"
                value={monthlySales}
                onChange={(e) => setMonthlySales(Number(e.target.value))}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter monthly sales"
              />
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Your Classification</h2>
          
          {isLargeRetailer ? (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🏢</span>
                <span className="text-lg font-semibold text-blue-700">Large Retailer - Tier {currentTier}</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">{FEE_TIERS[currentTier - 1].description}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Transaction Fee:</span>
                  <span className="text-blue-700">{FEE_TIERS[currentTier - 1].transactionFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Monthly Transaction Fees:</span>
                  <span className="text-blue-700">${monthlyTransactionFees.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Ad Fees:</span>
                  <span className="text-blue-700">{FEE_TIERS[currentTier - 1].adFees}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Listing Fee:</span>
                  <span className="text-blue-700">{FEE_TIERS[currentTier - 1].listingFee}</span>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🏪</span>
                <span className="text-lg font-semibold text-green-700">Local Business</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">Standard local business rates apply</p>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Transaction Fee:</span>
                  <span className="text-green-700">3%</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Monthly Transaction Fees:</span>
                  <span className="text-green-700">${(monthlySales * 0.03).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Ad Fees:</span>
                  <span className="text-green-700">$50–$500/mo</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Listing Fee:</span>
                  <span className="text-green-700">Free</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden">
        <h2 className="text-xl font-semibold p-4 bg-gray-50 border-b">Large Retailer Fee Structure</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-3 font-medium">Tier</th>
                <th className="text-left p-3 font-medium">Description</th>
                <th className="text-left p-3 font-medium">Transaction Fee</th>
                <th className="text-left p-3 font-medium">Ad Fees</th>
                <th className="text-left p-3 font-medium">Listing Fee</th>
              </tr>
            </thead>
            <tbody>
              {FEE_TIERS.map((tier, index) => (
                <tr 
                  key={tier.tier} 
                  className={`border-b hover:bg-gray-50 ${currentTier === tier.tier ? 'bg-blue-50 border-blue-200' : ''}`}
                >
                  <td className="p-3 font-medium">Tier {tier.tier}</td>
                  <td className="p-3">{tier.description}</td>
                  <td className="p-3 font-semibold text-blue-600">{tier.transactionFee}</td>
                  <td className="p-3">{tier.adFees}</td>
                  <td className="p-3">{tier.listingFee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-semibold text-yellow-800 mb-2">Large Retailer Benefits</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Chain-level brand page support</li>
          <li>• SPIRAL Wallet reward multiplier access</li>
          <li>• National store discovery with ZIP filtering</li>
          <li>• Premium ad targeting capabilities</li>
          <li>• Priority customer support</li>
          <li>• Custom listing and integration options</li>
        </ul>
      </div>
    </div>
  );
}