import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
  const storeId = location.split('/')[2] || '1';
  const [isFollowing, setIsFollowing] = useState(false);
  
  // Mock data - would be replaced with actual API call
  const retailerData: RetailerProfile = {
    id: storeId,
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
  };

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
            src={retailerData.images[0]}
            alt={retailerData.name}
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
                  <h1 className="text-3xl font-bold">{retailerData.name}</h1>
                  {retailerData.isVerified && getVerificationBadge(retailerData.verificationLevel)}
                  {retailerData.spiralPartner && (
                    <Badge className="bg-teal-600 text-white">
                      <Award className="w-3 h-3 mr-1" />
                      SPIRAL Partner
                    </Badge>
                  )}
                </div>
                <p className="text-lg opacity-90 mb-2">{retailerData.category}</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    {renderStars(retailerData.rating)}
                    <span className="ml-1">{retailerData.rating} ({retailerData.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {retailerData.followers} followers
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
                    <p className="text-gray-600 leading-relaxed">{retailerData.description}</p>
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
                        <p className="text-gray-600">{retailerData.address}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <p className="text-gray-600">{retailerData.phone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Globe className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <p className="font-medium">Website</p>
                        <a href={`https://${retailerData.website}`} className="text-teal-600 hover:underline">
                          {retailerData.website}
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <p className="font-medium">Hours</p>
                        <p className="text-gray-600">{retailerData.hours}</p>
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
                    <p className="text-gray-500">Product catalog coming soon...</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews" className="space-y-4">
                {retailerData.reviews.map((review) => (
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
                  {retailerData.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${retailerData.name} ${index + 1}`}
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
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-600 mb-2">
                    10 SPIRALs
                  </div>
                  <p className="text-sm text-gray-600">per $100 spent in-store</p>
                  <div className="text-xl font-bold text-blue-600 mb-2 mt-3">
                    5 SPIRALs
                  </div>
                  <p className="text-sm text-gray-600">per $100 spent online</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}