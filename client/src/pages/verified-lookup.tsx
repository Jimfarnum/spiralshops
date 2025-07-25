import { useState } from "react";

export default function VerifiedLookupPage() {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState<any>(null);

  const handleSearch = async () => {
    const res = await fetch(`/api/lookup-store?name=${search}`);
    const data = await res.json();
    setResult(data);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-xl font-semibold mb-4">SPIRAL Verified Lookup</h1>
      <input
        type="text"
        placeholder="Enter store name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border px-3 py-2 rounded mb-2"
      />
      <button
        onClick={handleSearch}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded"
      >
        Lookup
      </button>

      {result && (
        <div className="mt-4 text-sm">
          {result.isVerified ? (
            <>
              ✅ <strong>{result.name}</strong> is SPIRAL Verified (
              {result.tier})
            </>
          ) : (
            <>❌ Not Verified</>
          )}
        </div>
      )}
    </div>
  );
}