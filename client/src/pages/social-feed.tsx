import React, { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Gift, 
  Star, 
  TrendingUp, 
  Users, 
  ShoppingBag,
  MapPin,
  Clock
} from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import SocialSharingEngine from '@/components/social-sharing-engine';

interface SocialPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  type: 'purchase' | 'discovery' | 'review' | 'milestone';
  content: string;
  storeName?: string;
  productName?: string;
  mallName?: string;
  spiralEarnings?: number;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  location?: string;
  images?: string[];
}

interface TopUser {
  id: string;
  name: string;
  avatar: string;
  totalShares: number;
  spiralEarnings: number;
  badge: string;
}

const SocialFeed = () => {
  const [activeTab, setActiveTab] = useState('recent');

  // Mock social posts data
  const socialPosts: SocialPost[] = [
    {
      id: '1',
      userId: '1',
      userName: 'Sarah Chen',
      userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b742?w=100&h=100&fit=crop&crop=face',
      type: 'purchase',
      content: 'Just discovered the most amazing artisan coffee at Local Roasters! ☕️✨ Supporting local businesses has never been this rewarding. #SPIRALshops #ShopLocal',
      storeName: 'Local Roasters',
      productName: 'Artisan Coffee Blend',
      spiralEarnings: 25,
      likes: 47,
      comments: 12,
      shares: 8,
      timestamp: '2 hours ago',
      location: 'Downtown District',
      images: ['https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop']
    },
    {
      id: '2',
      userId: '2',
      userName: 'Mike Rodriguez',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      type: 'discovery',
      content: 'Found this incredible pottery studio through SPIRAL! 🏺 The handmade bowls are absolutely stunning. So glad to support local artisans. #LocalArt #SPIRALshops',
      storeName: 'Clay Studio',
      likes: 34,
      comments: 6,
      shares: 5,
      timestamp: '4 hours ago',
      location: 'Arts Quarter'
    },
    {
      id: '3',
      userId: '3',
      userName: 'Emily Watson',
      userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      type: 'milestone',
      content: 'Just hit 500 SPIRALs! 🎉 Love how easy it is to earn rewards while supporting my local community. Every purchase feels meaningful! #SPIRALrewards #LocalLove',
      spiralEarnings: 500,
      likes: 89,
      comments: 23,
      shares: 15,
      timestamp: '6 hours ago'
    },
    {
      id: '4',
      userId: '4',
      userName: 'David Kim',
      userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      type: 'review',
      content: 'Heritage Crafts has the most beautiful leather bags! 👜 The craftsmanship is incredible and the owner shared the story behind each piece. #LocalCrafts #SPIRALshops',
      storeName: 'Heritage Crafts',
      productName: 'Vintage Leather Bag',
      spiralEarnings: 15,
      likes: 52,
      comments: 9,
      shares: 7,
      timestamp: '8 hours ago',
      location: 'Vintage Row'
    },
    {
      id: '5',
      userId: '5',
      userName: 'Lisa Park',
      userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face',
      type: 'purchase',
      content: 'Fresh sourdough from Corner Bakery hits different! 🍞 Nothing beats supporting local bakers who put love into every loaf. #FreshBread #SPIRALshops',
      storeName: 'Corner Bakery',
      productName: 'Sourdough Bread',
      spiralEarnings: 12,
      likes: 41,
      comments: 14,
      shares: 6,
      timestamp: '12 hours ago',
      location: 'Baker Street'
    }
  ];

  // Mock top users data
  const topUsers: TopUser[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b742?w=100&h=100&fit=crop&crop=face',
      totalShares: 89,
      spiralEarnings: 1247,
      badge: 'SPIRAL Ambassador'
    },
    {
      id: '2',
      name: 'Mike Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      totalShares: 76,
      spiralEarnings: 983,
      badge: 'Local Explorer'
    },
    {
      id: '3',
      name: 'Emily Watson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      totalShares: 64,
      spiralEarnings: 845,
      badge: 'Community Champion'
    }
  ];

  const getPostIcon = (type: string) => {
    switch (type) {
      case 'purchase': return <ShoppingBag className="h-4 w-4 text-[var(--spiral-coral)]" />;
      case 'discovery': return <Star className="h-4 w-4 text-[var(--spiral-gold)]" />;
      case 'review': return <MessageCircle className="h-4 w-4 text-[var(--spiral-sage)]" />;
      case 'milestone': return <Gift className="h-4 w-4 text-[var(--spiral-navy)]" />;
      default: return <Heart className="h-4 w-4 text-[var(--spiral-coral)]" />;
    }
  };

  const getPostTypeLabel = (type: string) => {
    switch (type) {
      case 'purchase': return 'Made a purchase';
      case 'discovery': return 'Discovered a store';
      case 'review': return 'Left a review';
      case 'milestone': return 'Hit a milestone';
      default: return 'Shared an experience';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[var(--spiral-navy)] font-['Poppins']">
            SPIRAL Social Feed
          </h1>
          <p className="text-gray-600 mt-2 text-lg font-['Inter']">
            See what your community is discovering and sharing
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 rounded-xl">
                <TabsTrigger value="recent" className="rounded-lg">Recent Activity</TabsTrigger>
                <TabsTrigger value="trending" className="rounded-lg">Trending</TabsTrigger>
                <TabsTrigger value="following" className="rounded-lg">Following</TabsTrigger>
              </TabsList>

              <TabsContent value="recent" className="space-y-6">
                {socialPosts.map((post) => (
                  <Card key={post.id} className="shadow-lg border-0 hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      {/* Post Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={post.userAvatar} alt={post.userName} />
                          <AvatarFallback>{post.userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-[var(--spiral-navy)] font-['Inter']">
                              {post.userName}
                            </p>
                            <Badge variant="secondary" className="text-xs">
                              {getPostIcon(post.type)}
                              <span className="ml-1">{getPostTypeLabel(post.type)}</span>
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500 font-['Inter']">
                            <Clock className="h-3 w-3" />
                            <span>{post.timestamp}</span>
                            {post.location && (
                              <>
                                <span>•</span>
                                <MapPin className="h-3 w-3" />
                                <span>{post.location}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Post Content */}
                      <div className="mb-4">
                        <p className="text-gray-800 font-['Inter'] leading-relaxed">
                          {post.content}
                        </p>
                        
                        {/* Store/Product Info */}
                        {(post.storeName || post.productName) && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-2">
                              {post.storeName && (
                                <Badge className="bg-[var(--spiral-sage)] text-white">
                                  📍 {post.storeName}
                                </Badge>
                              )}
                              {post.productName && (
                                <Badge variant="outline" className="border-[var(--spiral-coral)] text-[var(--spiral-coral)]">
                                  🛍️ {post.productName}
                                </Badge>
                              )}
                              {post.spiralEarnings && (
                                <Badge className="bg-[var(--spiral-gold)] text-white">
                                  ✨ +{post.spiralEarnings} SPIRALs
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Post Images */}
                        {post.images && post.images.length > 0 && (
                          <div className="mt-4">
                            <img
                              src={post.images[0]}
                              alt="Post content"
                              className="w-full max-w-md rounded-xl object-cover"
                            />
                          </div>
                        )}
                      </div>

                      {/* Post Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-6">
                          <button className="flex items-center gap-2 text-gray-500 hover:text-[var(--spiral-coral)] transition-colors">
                            <Heart className="h-4 w-4" />
                            <span className="text-sm font-['Inter']">{post.likes}</span>
                          </button>
                          <button className="flex items-center gap-2 text-gray-500 hover:text-[var(--spiral-sage)] transition-colors">
                            <MessageCircle className="h-4 w-4" />
                            <span className="text-sm font-['Inter']">{post.comments}</span>
                          </button>
                          <button className="flex items-center gap-2 text-gray-500 hover:text-[var(--spiral-navy)] transition-colors">
                            <Share2 className="h-4 w-4" />
                            <span className="text-sm font-['Inter']">{post.shares}</span>
                          </button>
                        </div>
                        
                        <SocialSharingEngine
                          type="account"
                          title={`Check out this SPIRAL experience from ${post.userName}`}
                          description={post.content}
                          showEarningsPreview={true}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="trending" className="space-y-6">
                <Card className="shadow-lg border-0">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2 font-['Inter']">
                      Trending Content Coming Soon
                    </h3>
                    <p className="text-gray-500 font-['Inter']">
                      We're working on showing you the most popular SPIRAL experiences!
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="following" className="space-y-6">
                <Card className="shadow-lg border-0">
                  <CardContent className="p-6 text-center">
                    <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2 font-['Inter']">
                      Follow Your Friends
                    </h3>
                    <p className="text-gray-500 font-['Inter']">
                      Connect with friends to see their local discoveries and SPIRAL experiences!
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Sharers */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-[var(--spiral-navy)] font-['Poppins'] flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Top SPIRAL Sharers
                </CardTitle>
                <CardDescription className="font-['Inter']">
                  Community members spreading the local love
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {topUsers.map((user, index) => (
                  <div key={user.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-8 h-8 bg-[var(--spiral-coral)] rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold text-[var(--spiral-navy)] text-sm font-['Inter']">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-600 font-['Inter']">
                        {user.totalShares} shares • {user.spiralEarnings} SPIRALs
                      </p>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {user.badge}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Share Your Experience */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-[var(--spiral-coral)]/10 to-[var(--spiral-gold)]/10">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-[var(--spiral-coral)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--spiral-navy)] mb-2 font-['Poppins']">
                  Share Your Experience
                </h3>
                <p className="text-gray-600 text-sm mb-4 font-['Inter']">
                  Earn 5 SPIRALs for every share and help others discover local gems!
                </p>
                <SocialSharingEngine
                  type="account"
                  title="Join me on SPIRAL - discovering amazing local businesses!"
                  description="I'm loving my SPIRAL experience! Earning rewards while supporting local businesses in my community."
                  showEarningsPreview={true}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SocialFeed;