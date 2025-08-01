import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, MapPin, Phone, Globe, Clock, Heart, Share2, CheckCircle, Award, Users } from 'lucide-react';

interface RetailerProfile {
  id: string;
  name: string;
  description: string;
  category: string;
  address: string;
  phone: string;
  website: string;
  hours: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  verificationLevel: number;
  spiralPartner: boolean;
  images: string[];
  products: any[];
  reviews: any[];
  followers: number;
  isFollowing: boolean;
}

export default function RetailerProfilePage() {
  const [location] = useLocation();
  const storeSlug = location.split('/')[2];
  const [store, setStore] = useState<RetailerProfile | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    // Fetch store data from API
    fetch(`/api/stores/${storeSlug}`)
      .then(res => res.json())
      .then(data => setStore(data))
      .catch(() => {
        // Fallback to mock data if API fails
        setStore({
    id: storeSlug || '1',
    name: "Bella's Boutique",
    description: "A charming local boutique specializing in women's fashion, accessories, and unique gifts. Family-owned for over 15 years.",
    category: "Fashion & Apparel",
    address: "123 Main Street, Downtown Plaza, Springfield, IL 62701",
    phone: "(555) 123-4567",
    website: "www.bellasboutique.com",
    hours: "Mon-Sat: 10AM-8PM, Sun: 12PM-6PM",
    rating: 4.8,
    reviewCount: 127,
    isVerified: true,
    verificationLevel: 4,
    spiralPartner: true,
    images: [
      "https://via.placeholder.com/600x400/e3f2fd/1565c0?text=Store+Front",
      "https://via.placeholder.com/600x400/f3e5f5/7b1fa2?text=Interior",
      "https://via.placeholder.com/600x400/e8f5e8/2e7d32?text=Products"
    ],
    products: [],
    reviews: [
      {
        id: 1,
        user: "Sarah M.",
        rating: 5,
        comment: "Amazing selection and friendly staff! Found the perfect dress here.",
        date: "2 days ago"
      },
      {
        id: 2,
        user: "Jennifer K.",
        rating: 5,
        comment: "Love supporting this local business. Great quality and unique pieces.",
        date: "1 week ago"
      }
    ],
    followers: 245,
    isFollowing: false
        });
      });
  }, [storeSlug]);

  const renderProductGrid = () => {
    const sampleProducts = [
      {
        id: 1,
        name: "Summer Floral Dress",
        price: 89.99,
        image: "https://via.placeholder.com/300x300/f8bbd9/4a4a4a?text=Dress",
        category: "Dresses"
      },
      {
        id: 2,
        name: "Designer Handbag",
        price: 129.99,
        image: "https://via.placeholder.com/300x300/c8e6c9/4a4a4a?text=Handbag",
        category: "Accessories"
      },
      {
        id: 3,
        name: "Gold Jewelry Set",
        price: 199.99,
        image: "https://via.placeholder.com/300x300/fff3e0/4a4a4a?text=Jewelry",
        category: "Jewelry"
      },
      {
        id: 4,
        name: "Casual Blouse",
        price: 49.99,
        image: "https://via.placeholder.com/300x300/e1f5fe/4a4a4a?text=Blouse",
        category: "Tops"
      }
    ];

    return (
      <div className="grid md:grid-cols-2 gap-4">
        {sampleProducts.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
            <img 
              src={product.image} 
              alt={product.name} 
              className="h-32 object-cover w-full mb-2 rounded-md"
            />
            <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
            <p className="text-xl font-bold text-teal-600">${product.price}</p>
            <p className="text-sm text-gray-500 mb-3">{product.category}</p>
            <div className="flex gap-2">
              <button className="flex-1 bg-teal-600 text-white px-3 py-2 rounded-md text-sm hover:bg-teal-700">
                Add to Cart
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                ♡
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (!store) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading store information...</p>
        </div>
      </div>
    );
  }

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleShare = () => {
    navigator.share?.({
      title: retailerData.name,
      text: retailerData.description,
      url: window.location.href
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const getVerificationBadge = (level: number) => {
    const badges = [
      { level: 1, label: "Basic", color: "bg-gray-500" },
      { level: 2, label: "Verified", color: "bg-blue-500" },
      { level: 3, label: "Premium", color: "bg-purple-500" },
      { level: 4, label: "Elite", color: "bg-gold-500" },
      { level: 5, label: "Champion", color: "bg-green-500" }
    ];
    
    const badge = badges.find(b => b.level === level) || badges[0];
    return (
      <Badge className={`${badge.color} text-white`}>
        <CheckCircle className="w-3 h-3 mr-1" />
        {badge.label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative">
        <div className="h-64 bg-gradient-to-r from-teal-500 to-blue-600">
          <img
            src={store.images[0]}
            alt={store.name}
            className="w-full h-full object-cover opacity-80"
          />
        </div>
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Store Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{store.name}</h1>
                  {store.isVerified && getVerificationBadge(store.verificationLevel)}
                  {store.spiralPartner && (
                    <Badge className="bg-teal-600 text-white">
                      <Award className="w-3 h-3 mr-1" />
                      SPIRAL Partner
                    </Badge>
                  )}
                </div>
                <p className="text-lg opacity-90 mb-2">{store.category}</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    {renderStars(store.rating)}
                    <span className="ml-1">{store.rating} ({store.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {store.followers} followers
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={handleFollow}
                  variant={isFollowing ? "secondary" : "default"}
                  className="bg-white text-gray-900 hover:bg-gray-100"
                >
                  <Heart className={`w-4 h-4 mr-2 ${isFollowing ? 'fill-red-500 text-red-500' : ''}`} />
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="photos">Photos</TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About This Store</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">{store.description}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Store Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <p className="font-medium">Address</p>
                        <p className="text-gray-600">{store.address}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <p className="text-gray-600">{store.phone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Globe className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <p className="font-medium">Website</p>
                        <a href={`https://${store.website}`} className="text-teal-600 hover:underline">
                          {store.website}
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <p className="font-medium">Hours</p>
                        <p className="text-gray-600">{store.hours}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="products">
                <Card>
                  <CardHeader>
                    <CardTitle>Featured Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {renderProductGrid()}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews" className="space-y-4">
                {store.reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.user}</span>
                          <div className="flex">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="photos">
                <div className="grid md:grid-cols-2 gap-4">
                  {store.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${store.name} ${index + 1}`}
                      className="rounded-lg w-full h-48 object-cover"
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-teal-600 hover:bg-teal-700">
                  Visit Store Page
                </Button>
                <Button variant="outline" className="w-full">
                  View Products
                </Button>
                <Button variant="outline" className="w-full">
                  Get Directions
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SPIRAL Rewards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="bg-teal-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-teal-600 mb-1">
                      10 SPIRALs
                    </div>
                    <p className="text-sm text-gray-600">per $100 spent in-store</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-xl font-bold text-blue-600 mb-1">
                      5 SPIRALs
                    </div>
                    <p className="text-sm text-gray-600">per $100 spent online</p>
                  </div>
                  <div className="text-xs text-gray-500 mt-3">
                    SPIRAL Partner Store - Earn bonus rewards on every purchase!
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}