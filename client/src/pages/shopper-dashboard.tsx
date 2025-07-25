import { useEffect, useState } from "react";

interface Store {
  id: number;
  name: string;
  zipCode: string;
  isVerified: boolean;
  verificationTier?: string;
}

export default function ShopperDashboard() {
  const [stores, setStores] = useState<Store[]>([]);
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [zipFilter, setZipFilter] = useState('');
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);

  useEffect(() => {
    fetch('/api/stores')
      .then(res => res.json())
      .then(data => {
        setStores(data);
        setFilteredStores(data);
      });
  }, []);

  useEffect(() => {
    let filtered = stores;
    if (searchTerm) {
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (zipFilter) {
      filtered = filtered.filter(s => s.zipCode.startsWith(zipFilter));
    }
    if (showVerifiedOnly) {
      filtered = filtered.filter(s => s.isVerified);
    }
    setFilteredStores(filtered);
  }, [searchTerm, zipFilter, showVerifiedOnly, stores]);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Shop Verified Local Stores</h1>
      
      <div className="flex flex-col gap-3 mb-6">
        <input
          className="border rounded px-3 py-2"
          type="text"
          placeholder="Search by store name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          className="border rounded px-3 py-2"
          type="text"
          placeholder="Filter by ZIP code..."
          value={zipFilter}
          onChange={(e) => setZipFilter(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showVerifiedOnly}
            onChange={(e) => setShowVerifiedOnly(e.target.checked)}
          />
          <label className="text-sm font-medium">Show Only Verified Businesses ✅</label>
        </div>
      </div>

      <ul className="space-y-2">
        {filteredStores.map(store => (
          <li key={store.id} className="border-b py-2 flex justify-between items-center">
            <div>
              <span className="font-medium">{store.name}</span>
              <span className="text-gray-500 text-sm ml-2">{store.zipCode}</span>
            </div>
            {store.isVerified && <span className="text-green-600">✅ Verified</span>}
          </li>
        ))}
        {filteredStores.length === 0 && (
          <li className="text-gray-500 text-center py-4">No stores found matching your filters</li>
        )}
      </ul>
    </div>
  );
}