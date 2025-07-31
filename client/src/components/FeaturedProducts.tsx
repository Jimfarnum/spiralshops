import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Star, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  store: string;
  rating: number;
  location: string;
  category: string;
}

export default function FeaturedProducts() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/featured"],
    queryFn: async () => {
      const response = await fetch("/api/products/featured");
      if (!response.ok) throw new Error("Failed to fetch featured products");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Featured Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border rounded-lg p-4">
              <Skeleton className="w-full h-32 mb-3" />
              <Skeleton className="h-4 mb-2" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Fallback to sample data if API fails
  const featuredProducts = products || [
    {
      id: 1,
      name: "Artisan Coffee Blend",
      price: 18.99,
      image: "/api/placeholder/200/200",
      store: "Local Roasters Co.",
      rating: 4.8,
      location: "Downtown",
      category: "Beverages"
    },
    {
      id: 2,
      name: "Handcrafted Leather Wallet",
      price: 45.00,
      image: "/api/placeholder/200/200", 
      store: "Heritage Leather Works",
      rating: 4.9,
      location: "Arts District",
      category: "Fashion"
    },
    {
      id: 3,
      name: "Organic Honey",
      price: 12.50,
      image: "/api/placeholder/200/200",
      store: "Meadow Valley Farm",
      rating: 4.7,
      location: "Farmers Market",
      category: "Food"
    },
    {
      id: 4,
      name: "Vintage Plant Pot",
      price: 28.00,
      image: "/api/placeholder/200/200",
      store: "Green Thumb Garden",
      rating: 4.6,
      location: "Garden District",
      category: "Home"
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">Featured Products</h3>
        <Link href="/products" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View All
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {featuredProducts.slice(0, 4).map((product) => (
          <Link key={product.id} href={`/product/${product.id}`}>
            <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-32 object-cover rounded-md mb-3"
              />
              <h4 className="font-semibold text-gray-800 mb-1 text-sm">{product.name}</h4>
              <p className="text-lg font-bold text-green-600 mb-1">${product.price}</p>
              <div className="flex items-center text-xs text-gray-600 mb-1">
                <Star className="w-3 h-3 text-yellow-400 mr-1" />
                <span>{product.rating}</span>
                <span className="mx-1">•</span>
                <span>{product.store}</span>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <MapPin className="w-3 h-3 mr-1" />
                <span>{product.location}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}