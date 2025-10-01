import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Building2, MapPin, Award, TrendingUp, Users, ShoppingBag, Heart, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useToast } from "@/hooks/use-toast";

export default function LocalFirst() {
  const [zipCode, setZipCode] = useState("");
  const { toast } = useToast();

  const localImpactStats = [
    {
      icon: Building2,
      number: "15,000+",
      label: "Local Businesses Supported",
      description: "Independent retailers across America"
    },
    {
      icon: TrendingUp,
      number: "$2.8M+",
      label: "Revenue Kept Local",
      description: "Money staying in communities"
    },
    {
      icon: Users,
      number: "45,000+",
      label: "Local Jobs Supported",
      description: "Employment created and sustained"
    },
    {
      icon: Heart,
      number: "92%",
      label: "Customer Satisfaction",
      description: "Shoppers love local experiences"
    }
  ];

  const whyLocalFirst = [
    {
      icon: Award,
      title: "Quality & Craftsmanship",
      description: "Local businesses often provide higher quality products with personal attention to detail and craftsmanship you won't find elsewhere.",
      benefit: "Unique, well-made products"
    },
    {
      icon: Users,
      title: "Community Investment",
      description: "Local business owners live in your community. They sponsor local teams, support charities, and reinvest profits locally.",
      benefit: "Stronger neighborhoods"
    },
    {
      icon: TrendingUp,
      title: "Economic Multiplier",
      description: "Every dollar spent locally generates $3.70 in local economic activity compared to just $1.40 for chain stores.",
      benefit: "More local prosperity"
    },
    {
      icon: MapPin,
      title: "Environmental Impact",
      description: "Shopping locally reduces transportation, packaging, and carbon footprint while supporting sustainable business practices.",
      benefit: "Greener communities"
    }
  ];

  const successStories = [
    {
      business: "Peterson's Hardware",
      owner: "Jim Peterson",
      story: "After 30 years in business, Jim thought he'd have to close. SPIRAL helped him reach new customers and increase sales by 40%.",
      location: "Cedar Falls, IA",
      category: "Hardware & Tools",
      growth: "+40% sales"
    },
    {
      business: "Maya's Artisan Bakery", 
      owner: "Maya Rodriguez",
      story: "Maya's traditional Mexican pastries now reach customers across the tri-county area through SPIRAL's platform.",
      location: "Austin, TX",
      category: "Bakery & Café",
      growth: "+150% reach"
    },
    {
      business: "Riverside Books",
      owner: "Eleanor Chen",
      story: "This independent bookstore found new life by connecting with readers who value curated selections and personal service.",
      location: "Portland, OR",
      category: "Books & Stationery",
      growth: "+65% revenue"
    }
  ];

  const handleZipSearch = () => {
    if (!zipCode.trim()) {
      toast({
        title: "ZIP Code Required",
        description: "Please enter your ZIP code to find local businesses.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Searching Local Businesses",
      description: `Finding amazing local stores in ${zipCode}...`,
    });

    // Navigate to stores with zip filter
    window.location.href = `/stores?zip=${zipCode}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-4 rounded-full">
              <Building2 className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Local First
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Supporting brick-and-mortar businesses in communities across America. 
            When you shop local, you're not just buying products – you're investing 
            in your neighbors, your community, and your local economy.
          </p>
          
          <div className="max-w-md mx-auto mb-8">
            <div className="flex gap-2">
              <Input 
                placeholder="Enter your ZIP code"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleZipSearch} className="bg-blue-600 hover:bg-blue-700">
                <MapPin className="h-4 w-4 mr-2" />
                Find Local
              </Button>
            </div>
          </div>
        </div>

        {/* Impact Statistics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {localImpactStats.map((stat, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
              <stat.icon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stat.number}
              </div>
              <div className="font-semibold text-gray-800 mb-2">
                {stat.label}
              </div>
              <p className="text-sm text-gray-600">
                {stat.description}
              </p>
            </Card>
          ))}
        </div>

        {/* Why Local First Matters */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Why Local First Matters
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {whyLocalFirst.map((reason, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4 flex-shrink-0">
                    <reason.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {reason.title}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      {reason.description}
                    </p>
                    <div className="flex items-center text-blue-600 font-medium">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {reason.benefit}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Success Stories */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Local Success Stories
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {story.business}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPin className="h-3 w-3 mr-1" />
                    {story.location}
                  </div>
                  <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full inline-block mb-3">
                    {story.category}
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 italic">
                  "{story.story}"
                </p>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    - {story.owner}
                  </span>
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                    {story.growth}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* How You Can Help */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
            How You Can Support Local Business
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <ShoppingBag className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Shop Local</h3>
              <p className="text-gray-600 text-sm">Choose local businesses for your everyday needs</p>
            </div>
            <div className="text-center">
              <Heart className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Spread the Word</h3>
              <p className="text-gray-600 text-sm">Share your favorite local finds with friends</p>
            </div>
            <div className="text-center">
              <Award className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Leave Reviews</h3>
              <p className="text-gray-600 text-sm">Help other shoppers discover great local businesses</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center py-12 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Shop Local?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover amazing local businesses in your area and make a positive impact 
            on your community with every purchase.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/stores">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                <Building2 className="h-5 w-5 mr-2" />
                Explore Local Stores
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Join SPIRAL
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}