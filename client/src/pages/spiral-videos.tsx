import React, { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, ThumbsUp, MessageCircle, Share2, ArrowLeft, Video, Users, MapPin, Store } from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import SocialSharingEngine from '@/components/social-sharing-engine';

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  embedUrl: string;
  category: 'shop-stories' | 'local-legends' | 'mall-tours' | 'spiral-tips';
  duration: string;
  views: number;
  likes: number;
  comments: number;
}

const SpiralVideos = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const videos: Video[] = [
    {
      id: '1',
      title: 'Small Business Success: Local Coffee Roaster\'s Journey',
      description: 'Meet Sarah from Downtown Roasters - how SPIRAL helped her connect with the community and grow her business.',
      thumbnail: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=225&fit=crop',
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'shop-stories',
      duration: '4:32',
      views: 1250,
      likes: 89,
      comments: 23
    },
    {
      id: '2',
      title: 'Local Legend: The Bookstore That Started It All',
      description: 'Discover the 50-year history of Miller\'s Books and how they\'ve adapted to serve the digital community.',
      thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=225&fit=crop',
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'local-legends',
      duration: '6:15',
      views: 2180,
      likes: 156,
      comments: 45
    },
    {
      id: '3',
      title: 'Virtual Mall Tour: Riverside Shopping Center',
      description: 'Take a virtual walk through our featured mall and discover hidden gems you never knew existed.',
      thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=225&fit=crop',
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'mall-tours',
      duration: '8:45',
      views: 3420,
      likes: 234,
      comments: 67
    },
    {
      id: '4',
      title: 'Maximizing Your SPIRALs: Pro Tips & Tricks',
      description: 'Learn insider strategies to earn more SPIRALs and support even more local businesses.',
      thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=225&fit=crop',
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'spiral-tips',
      duration: '3:28',
      views: 1876,
      likes: 142,
      comments: 38
    },
    {
      id: '5',
      title: 'Community Impact: How Local Shopping Changes Lives',
      description: 'Real stories from business owners and customers about the impact of shopping local.',
      thumbnail: 'https://images.unsplash.com/photo-1556742400-b04bbe5c7e37?w=400&h=225&fit=crop',
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'shop-stories',
      duration: '5:22',
      views: 987,
      likes: 78,
      comments: 19
    },
    {
      id: '6',
      title: 'Behind the Scenes: How SPIRAL Connects Communities',
      description: 'Go behind the scenes to see how SPIRAL technology brings local businesses and customers together.',
      thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=225&fit=crop',
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'spiral-tips',
      duration: '7:12',
      views: 1654,
      likes: 119,
      comments: 31
    }
  ];

  const categories = [
    { id: 'all', name: 'All Videos', icon: Video, count: videos.length },
    { id: 'shop-stories', name: 'Shop Stories', icon: Store, count: videos.filter(v => v.category === 'shop-stories').length },
    { id: 'local-legends', name: 'Local Legends', icon: Users, count: videos.filter(v => v.category === 'local-legends').length },
    { id: 'mall-tours', name: 'Mall Tours', icon: MapPin, count: videos.filter(v => v.category === 'mall-tours').length },
    { id: 'spiral-tips', name: 'SPIRAL Tips', icon: Play, count: videos.filter(v => v.category === 'spiral-tips').length }
  ];

  const filteredVideos = selectedCategory === 'all' 
    ? videos 
    : videos.filter(video => video.category === selectedCategory);

  const getCategoryBadgeColor = (category: string) => {
    const colors = {
      'shop-stories': 'bg-[var(--spiral-coral)]/20 text-[var(--spiral-coral)]',
      'local-legends': 'bg-[var(--spiral-gold)]/20 text-[var(--spiral-navy)]',
      'mall-tours': 'bg-[var(--spiral-sage)]/20 text-[var(--spiral-navy)]',
      'spiral-tips': 'bg-[var(--spiral-navy)]/20 text-[var(--spiral-navy)]'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-600';
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--spiral-navy)] mb-4 font-['Poppins']">
            🎥 SPIRAL Video Hub
          </h1>
          <p className="text-gray-600 text-lg font-['Inter'] max-w-2xl">
            Discover inspiring stories from local businesses, community impact, and tips to maximize your SPIRAL experience.
          </p>
        </div>

        {/* Category Navigation */}
        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`h-auto p-4 flex flex-col items-center gap-2 rounded-xl ${
                  selectedCategory === category.id 
                    ? 'bg-[var(--spiral-navy)] text-white' 
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                <category.icon className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-semibold text-sm font-['Poppins']">{category.name}</div>
                  <div className="text-xs opacity-75">({category.count})</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredVideos.map((video) => (
            <Card key={video.id} className="overflow-hidden shadow-lg border-0 hover:shadow-xl transition-all duration-300">
              <div className="relative">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                     onClick={() => setSelectedVideo(video)}>
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                    <Play className="h-8 w-8 text-[var(--spiral-navy)] ml-1" />
                  </div>
                </div>
                <div className="absolute top-3 left-3">
                  <Badge className={getCategoryBadgeColor(video.category)}>
                    {video.category.replace('-', ' ')}
                  </Badge>
                </div>
                <div className="absolute bottom-3 right-3 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-[var(--spiral-navy)] mb-2 font-['Poppins'] line-clamp-2">
                  {video.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 font-['Inter'] line-clamp-2">
                  {video.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Play className="h-3 w-3" />
                      {formatNumber(video.views)}
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      {formatNumber(video.likes)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      {video.comments}
                    </span>
                  </div>
                  <SocialSharingEngine
                    type="account"
                    title={`Check out this video: ${video.title}`}
                    description={`${video.description} Watch on SPIRAL Video Hub! 🎥✨ #SPIRALshops #LocalBusiness`}
                    showEarningsPreview={false}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Video Player Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-[var(--spiral-navy)] font-['Poppins']">
                    {selectedVideo.title}
                  </h2>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedVideo(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </Button>
                </div>
                <div className="aspect-video mb-4">
                  <iframe
                    src={selectedVideo.embedUrl}
                    title={selectedVideo.title}
                    className="w-full h-full rounded-lg"
                    allowFullScreen
                  />
                </div>
                <p className="text-gray-600 mb-4 font-['Inter']">
                  {selectedVideo.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span className="flex items-center gap-2">
                      <Play className="h-4 w-4" />
                      {formatNumber(selectedVideo.views)} views
                    </span>
                    <span className="flex items-center gap-2">
                      <ThumbsUp className="h-4 w-4" />
                      {formatNumber(selectedVideo.likes)} likes
                    </span>
                    <span className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      {selectedVideo.comments} comments
                    </span>
                  </div>
                  <SocialSharingEngine
                    type="account"
                    title={`Check out this video: ${selectedVideo.title}`}
                    description={`${selectedVideo.description} Watch on SPIRAL Video Hub! 🎥✨ #SPIRALshops #LocalBusiness`}
                    showEarningsPreview={true}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-[var(--spiral-navy)]/10 to-[var(--spiral-coral)]/10 border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-[var(--spiral-navy)] mb-4 font-['Poppins']">
              Share Your Local Business Story
            </h2>
            <p className="text-gray-600 mb-6 font-['Inter'] max-w-2xl mx-auto">
              Have an inspiring story about your local business or shopping experience? We'd love to feature you in our video hub!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-[var(--spiral-navy)] hover:bg-[var(--spiral-coral)] text-white rounded-xl">
                Submit Your Story
              </Button>
              <SocialSharingEngine
                type="account"
                title="Check out the SPIRAL Video Hub!"
                description="Amazing stories from local businesses and community members. Supporting local has never been more inspiring! 🎥✨ #SPIRALshops #LocalBusiness #CommunityStories"
                showEarningsPreview={true}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default SpiralVideos;