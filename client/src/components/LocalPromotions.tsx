import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Tag, Clock, Star, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Promotion {
  id: number;
  title: string;
  store: string;
  discount: string;
  description: string;
  validUntil: string;
  category: string;
  location: string;
  rating: number;
  image: string;
}

export default function LocalPromotions() {
  const { data: promotions, isLoading } = useQuery<Promotion[]>({
    queryKey: ["/api/promotions"],
    queryFn: async () => {
      const response = await fetch("/api/promotions");
      if (!response.ok) throw new Error("Failed to fetch promotions");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Local Deals & Promotions</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-4">
              <Skeleton className="h-4 mb-2" />
              <Skeleton className="h-3 w-2/3 mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Fallback to sample data if API fails
  const localPromotions = promotions || [
    {
      id: 1,
      title: "20% Off Winter Collection",
      store: "Bella's Boutique",
      discount: "20% OFF",
      description: "Save on stylish winter wear and accessories. Perfect for the season!",
      validUntil: "2025-02-28",
      category: "Fashion",
      location: "Fashion District",
      rating: 4.7,
      image: "/api/placeholder/300/150"
    },
    {
      id: 2,
      title: "Buy 2 Get 1 Free Coffee",
      store: "Morning Brew Cafe",
      discount: "BOGO",
      description: "Start your day right with our premium coffee blends and fresh pastries",
      validUntil: "2025-02-20",
      category: "Food & Beverage",
      location: "Downtown",
      rating: 4.9,
      image: "/api/placeholder/300/150"
    },
    {
      id: 3,
      title: "Free Delivery on Orders $25+",
      store: "Garden Fresh Market",
      discount: "FREE DELIVERY",
      description: "Fresh local produce delivered to your door with qualifying orders",
      validUntil: "2025-02-25",
      category: "Grocery",
      location: "Market Square",
      rating: 4.6,
      image: "/api/placeholder/300/150"
    },
    {
      id: 4,
      title: "30% Off Home Decor",
      store: "Cozy Corner Furnishings",
      discount: "30% OFF",
      description: "Transform your space with locally-made furniture and decor pieces",
      validUntil: "2025-03-05",
      category: "Home & Garden",
      location: "Arts District",
      rating: 4.8,
      image: "/api/placeholder/300/150"
    }
  ];

  const getDiscountColor = (discount: string) => {
    if (discount.includes('%')) return 'bg-red-500';
    if (discount.includes('BOGO') || discount.includes('FREE')) return 'bg-green-500';
    return 'bg-blue-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">Local Deals & Promotions</h3>
        <Link href="/promotions" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View All Deals
        </Link>
      </div>
      <div className="space-y-4">
        {localPromotions.slice(0, 4).map((promo) => (
          <Link key={promo.id} href={`/store/${promo.store.toLowerCase().replace(/\s+/g, '-')}`}>
            <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer relative">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 text-sm mb-1">{promo.title}</h4>
                  <p className="text-sm text-gray-600 font-medium">{promo.store}</p>
                </div>
                <div className={`${getDiscountColor(promo.discount)} text-white text-xs px-2 py-1 rounded-full font-bold`}>
                  {promo.discount}
                </div>
              </div>
              
              <p className="text-xs text-gray-500 mb-3 line-clamp-2">{promo.description}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-600">
                <div className="flex items-center">
                  <Star className="w-3 h-3 text-yellow-400 mr-1" />
                  <span>{promo.rating}</span>
                  <MapPin className="w-3 h-3 ml-3 mr-1" />
                  <span>{promo.location}</span>
                </div>
                
                <div className="flex items-center text-orange-600">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>Until {new Date(promo.validUntil).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="absolute top-2 left-2">
                <Tag className="w-4 h-4 text-red-500" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}