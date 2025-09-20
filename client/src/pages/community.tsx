import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Users, Heart, Star, MapPin, Calendar, Share2 } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useToast } from "@/hooks/use-toast";

export default function Community() {
  const [newPost, setNewPost] = useState("");
  const { toast } = useToast();

  const communityFeatures = [
    {
      icon: MessageSquare,
      title: "Local Shopping Stories",
      description: "Share your discoveries, reviews, and shopping experiences with nearby shoppers",
      action: "Share Story"
    },
    {
      icon: Users,
      title: "Shopping Groups",
      description: "Join or create local shopping groups for coordinated trips and group discounts",
      action: "Join Group"
    },
    {
      icon: Heart,
      title: "Favorite Store Lists",
      description: "Create and share lists of your favorite local businesses with friends",
      action: "Create List"
    },
    {
      icon: Star,
      title: "Review Network",
      description: "Help other shoppers discover great local products and services",
      action: "Write Review"
    }
  ];

  const recentActivity = [
    {
      user: "Sarah M.",
      action: "reviewed Peterson's Coffee Shop",
      rating: 5,
      comment: "Best local coffee in town! Their homemade pastries are incredible.",
      time: "2 hours ago",
      location: "Downtown Mall"
    },
    {
      user: "Mike D.", 
      action: "shared a shopping find",
      item: "Handcrafted leather wallet",
      store: "Morrison's Leather Goods",
      comment: "Found this amazing local craftsman. Quality is outstanding!",
      time: "5 hours ago",
      location: "Heritage District"
    },
    {
      user: "Lisa K.",
      action: "created shopping group",
      group: "Weekend Antique Hunters",
      members: 8,
      comment: "Looking for fellow antique enthusiasts for Saturday trips!",
      time: "1 day ago",
      location: "Riverside Mall"
    }
  ];

  const handlePostShare = () => {
    if (!newPost.trim()) {
      toast({
        title: "Post Required",
        description: "Please write something to share with the community.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Post Shared!",
      description: "Your story has been shared with the local shopping community.",
    });
    setNewPost("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-orange-100 p-4 rounded-full">
              <Users className="h-12 w-12 text-orange-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Build Community
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Share experiences and connect with fellow local shopping enthusiasts. 
            Discover hidden gems, share your favorite finds, and build lasting connections 
            with people who love supporting local businesses.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
              <MessageSquare className="h-4 w-4 mr-2" />
              Share Your Story
            </Button>
            <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50">
              <Users className="h-4 w-4 mr-2" />
              Find Shopping Groups
            </Button>
          </div>
        </div>

        {/* Community Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {communityFeatures.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <feature.icon className="h-6 w-6 text-orange-600 mr-3" />
                <h3 className="font-semibold text-gray-900">{feature.title}</h3>
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                {feature.description}
              </p>
              <Button size="sm" variant="outline" className="w-full">
                {feature.action}
              </Button>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Share New Post */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Share with Community
              </h2>
              <Textarea
                placeholder="Share a local shopping discovery, review, or experience..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="mb-4"
                rows={4}
              />
              <div className="flex gap-2 mb-4">
                <Button size="sm" variant="outline">
                  <MapPin className="h-4 w-4 mr-1" />
                  Add Location
                </Button>
                <Button size="sm" variant="outline">
                  <Star className="h-4 w-4 mr-1" />
                  Rate Store
                </Button>
              </div>
              <Button onClick={handlePostShare} className="w-full bg-orange-600 hover:bg-orange-700">
                <Share2 className="h-4 w-4 mr-2" />
                Share Post
              </Button>
            </Card>
          </div>

          {/* Recent Community Activity */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Recent Community Activity
            </h2>
            
            <div className="space-y-6">
              {recentActivity.map((activity, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3">
                          {activity.user.charAt(0)}
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">{activity.user}</span>
                          <span className="text-gray-600 ml-2">{activity.action}</span>
                        </div>
                      </div>

                      {activity.rating && (
                        <div className="flex items-center mb-2">
                          {[...Array(activity.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      )}

                      {activity.item && (
                        <div className="mb-2">
                          <span className="font-medium text-gray-900">{activity.item}</span>
                          <span className="text-gray-600 ml-2">at {activity.store}</span>
                        </div>
                      )}

                      {activity.group && (
                        <div className="mb-2">
                          <span className="font-medium text-gray-900">"{activity.group}"</span>
                          <span className="text-gray-600 ml-2">({activity.members} members)</span>
                        </div>
                      )}

                      <p className="text-gray-700 mb-3">{activity.comment}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {activity.location}
                        </div>
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12 py-12 bg-white rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Connect with Local Shoppers?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join thousands of local shopping enthusiasts who share discoveries, 
            support small businesses, and build stronger communities together.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/signup">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                Join Community
              </Button>
            </Link>
            <Link href="/stores">
              <Button variant="outline">
                Explore Local Stores
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}