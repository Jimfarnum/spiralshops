import { useEffect, useState } from "react";

type Store = {
  id: number;
  name: string;
  isVerified: boolean;
  verificationTier?: string;
};

export default function ShopperDashboard() {
  const [stores, setStores] = useState<Store[]>([]);
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [filterVerified, setFilterVerified] = useState(false);

  useEffect(() => {
    fetch("/api/stores")
      .then(res => res.json())
      .then(data => {
        setStores(data);
        setFilteredStores(data);
      });
  }, []);

  useEffect(() => {
    if (filterVerified) {
      setFilteredStores(stores.filter(store => store.isVerified));
    } else {
      setFilteredStores(stores);
    }
  }, [filterVerified, stores]);

  const handleToggle = () => setFilterVerified(prev => !prev);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Nearby Stores</h1>
      <div className="flex items-center space-x-2 mb-4">
        <input type="checkbox" checked={filterVerified} onChange={handleToggle} />
        <label className="text-sm font-medium">Show Only Verified Businesses ✅</label>
      </div>
      <ul>
        {filteredStores.map(store => (
          <li key={store.id} className="border-b py-2 flex justify-between">
            <span>{store.name}</span>
            {store.isVerified && <span className="text-green-600">✅ Verified</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}