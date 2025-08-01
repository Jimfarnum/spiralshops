import { useEffect, useState } from 'react';
import { useParams } from 'wouter';

interface StoreData {
  name: string;
  address: string;
  hours: string;
  description: string;
}

interface Product {
  image: string;
  name: string;
  price: number;
}

export default function RetailerProfilePage() {
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const params = useParams();
  const storeSlug = params.storeSlug;

  useEffect(() => {
    if (!storeSlug) return;
    
    fetch(`/api/stores/profile/${storeSlug}`)
      .then(res => res.json())
      .then(data => {
        setStoreData(data.store);
        setProducts(data.products);
      })
      .catch(error => {
        console.error('Failed to fetch store data:', error);
        // Fallback store data for demo
        setStoreData({
          name: "Sample Store",
          address: "123 Main St",
          hours: "9AM - 9PM",
          description: "A great local store"
        });
        setProducts([
          {
            image: "https://via.placeholder.com/300x200",
            name: "Sample Product",
            price: 29.99
          }
        ]);
      });
  }, [storeSlug]);

  if (!storeData) return <div className="text-center p-6">Loading store...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{storeData.name}</h1>
      <p className="text-gray-600">{storeData.address} — {storeData.hours}</p>
      <p className="mt-1 text-green-600 font-medium">SPIRALS Accepted ✓</p>
      <p className="mt-2 italic">{storeData.description}</p>

      <h2 className="mt-6 text-2xl font-semibold">Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-4">
        {products.map((product, i) => (
          <div key={i} className="border p-4 rounded-xl shadow-sm bg-white">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover mb-2 rounded-md"
            />
            <h3 className="text-lg font-bold">{product.name}</h3>
            <p className="text-sm text-gray-600">${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}