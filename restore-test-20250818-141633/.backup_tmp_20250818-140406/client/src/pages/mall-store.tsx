import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Clock, MapPin, Phone, Star, ShoppingCart, Heart, Share2 } from "lucide-react";
import { useCartStore } from "@/lib/cartStore";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import ReviewsSection from "@/components/reviews-section";

interface Store {
  id: string;
  name: string;
  category: string;
  description: string;
  hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  phone: string;
  location: string;
  mallLocation: string;
  rating: number;
  reviewCount: number;
  isSpiral: boolean;
  products: Array<{
    id: string;
    name: string;
    price: number;
    image: string;
    inStock: boolean;
    description: string;
  }>;
  offers: Array<{
    id: string;
    title: string;
    description: string;
    validUntil: string;
  }>;
}

export default function MallStorePage() {
  const [, params] = useRoute("/mall/:mallId/store/:storeId");
  const { mallId, storeId } = params || {};
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'about' | 'offers' | 'reviews'>('products');
  const { addItem } = useCartStore();
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockStore: Store = {
        id: storeId || "1",
        name: "Fashion Central",
        category: "Clothing & Accessories",
        description: "Premium fashion retailer offering the latest trends in men's and women's clothing, accessories, and footwear.",
        hours: {
          monday: "10:00 AM - 9:00 PM",
          tuesday: "10:00 AM - 9:00 PM",
          wednesday: "10:00 AM - 9:00 PM",
          thursday: "10:00 AM - 9:00 PM",
          friday: "10:00 AM - 10:00 PM",
          saturday: "10:00 AM - 10:00 PM",
          sunday: "11:00 AM - 8:00 PM"
        },
        phone: "(555) 123-4567",
        location: "Level 2, Suite 245",
        mallLocation: mallId === "westfield-valley" ? "Westfield Valley Fair" : "Oakridge Mall",
        rating: 4.5,
        reviewCount: 127,
        isSpiral: true,
        products: [
          {
            id: "1",
            name: "Designer Jacket",
            price: 149.99,
            image: "/api/placeholder/300/300",
            inStock: true,
            description: "Premium quality jacket with modern design"
          },
          {
            id: "2",
            name: "Classic Jeans",
            price: 89.99,
            image: "/api/placeholder/300/300",
            inStock: true,
            description: "Comfortable classic fit jeans"
          },
          {
            id: "3",
            name: "Sneakers",
            price: 129.99,
            image: "/api/placeholder/300/300",
            inStock: false,
            description: "Trendy athletic sneakers"
          }
        ],
        offers: [
          {
            id: "1",
            title: "20% Off New Arrivals",
            description: "Get 20% off all new arrival items this week",
            validUntil: "2025-01-31"
          },
          {
            id: "2",
            title: "Buy 2 Get 1 Free",
            description: "Mix and match on selected accessories",
            validUntil: "2025-02-15"
          }
        ]
      };
      setStore(mockStore);
      setLoading(false);
    }, 500);
  }, [mallId, storeId]);

  const handleAddToCart = (product: any) => {
    addItem({
      id: parseInt(product.id),
      name: product.name,
      price: product.price,
      image: product.image,
      category: store?.category || "",
      store: store?.name || "",
      mallId: mallId || "",
      mallName: store?.mallLocation || ""
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Store page link copied to clipboard.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--spiral-cream)]">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--spiral-navy)] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading store details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-[var(--spiral-cream)]">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Store Not Found</h2>
            <p className="text-gray-600">The requested store could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Store Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-[var(--spiral-navy)]">{store.name}</h1>
                {store.isSpiral && (
                  <Badge className="bg-[var(--spiral-coral)] text-white">SPIRAL Partner</Badge>
                )}
              </div>
              <p className="text-lg text-gray-600 mb-2">{store.category}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{store.location} • {store.mallLocation}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  <span>{store.phone}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{store.rating} ({store.reviewCount} reviews)</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-1" />
                Follow
              </Button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'products', label: 'Products', count: store.products.length },
                { id: 'about', label: 'About & Hours' },
                { id: 'offers', label: 'Current Offers', count: store.offers.length },
                { id: 'reviews', label: 'Reviews', count: 15 }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'products' | 'about' | 'offers' | 'reviews')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-[var(--spiral-coral)] text-[var(--spiral-coral)]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                  {tab.count && (
                    <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {store.products.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="aspect-square bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-[var(--spiral-navy)]">
                      ${product.price}
                    </span>
                    <Button
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock}
                      size="sm"
                      className={product.inStock ? 'bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90' : ''}
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Store Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(store.hours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between py-1">
                    <span className="capitalize font-medium">{day}</span>
                    <span className="text-gray-600">{hours}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>About {store.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">{store.description}</p>
                <Separator className="my-4" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Location:</span>
                    <span className="text-gray-600">{store.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Phone:</span>
                    <span className="text-gray-600">{store.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Category:</span>
                    <span className="text-gray-600">{store.category}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'offers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {store.offers.map((offer) => (
              <Card key={offer.id} className="border-l-4 border-l-[var(--spiral-coral)]">
                <CardHeader>
                  <CardTitle className="text-[var(--spiral-navy)]">{offer.title}</CardTitle>
                  <CardDescription>Valid until {new Date(offer.validUntil).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{offer.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <ReviewsSection
            targetType="store"
            targetId={store.id}
            targetName={store.name}
            overallRating={store.rating}
            totalReviews={store.reviewCount}
          />
        )}
      </div>
    </div>
  );
}