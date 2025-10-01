import React, { useEffect, useState } from "react";
import ProductCard, { Product } from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

const FeaturedProductsWithHealing: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products/featured");
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!mounted) return;
        
        // Handle different API response formats
        const productList = data.products || data || [];
        
        if (Array.isArray(productList)) {
          setProducts(productList);
          setError(null);
        } else {
          console.warn("Unexpected API response format:", data);
          setProducts([]);
        }
      } catch (err) {
        if (!mounted) return;
        
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error("Failed to load featured products:", errorMessage);
        setError(errorMessage);
        
        // Fallback to sample data to maintain user experience
        setProducts([
          {
            id: "sample-1",
            name: "Local Artisan Coffee",
            price: 18.99,
            image_url: "/api/placeholder/300/200",
            store: "Downtown Roasters",
            rating: 4.8,
            category: "Beverages"
          },
          {
            id: "sample-2", 
            name: "Handcrafted Leather Wallet",
            price: 45.00,
            image_url: "/api/placeholder/300/200",
            store: "Heritage Crafts",
            rating: 4.9,
            category: "Fashion"
          }
        ]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProducts();
    
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Featured Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-4">
              <Skeleton className="w-full h-48 mb-3" />
              <Skeleton className="h-4 mb-2" />
              <Skeleton className="h-6 w-24 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Featured Products</h3>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">
            Unable to load featured products at the moment.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-[var(--spiral-teal)] hover:bg-[var(--spiral-teal)]/90 text-white px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">Featured Products</h3>
        <span className="text-sm text-gray-500">
          {products.length} product{products.length !== 1 ? 's' : ''}
        </span>
      </div>
      
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
          <p className="text-sm text-yellow-800">
            ⚠️ Some products may not be current due to API issues. Showing cached results.
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default FeaturedProductsWithHealing;