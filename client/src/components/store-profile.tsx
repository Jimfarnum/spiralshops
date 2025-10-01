import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Star, Clock, Gift, Leaf, Navigation, Share2 } from "lucide-react";

export default function StoreProfile() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Store Profile Example
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See how your business will look on SPIRAL with our professional store profiles.
          </p>
        </div>

        <Card className="overflow-hidden shadow-lg">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400" 
              alt="Modern retail storefront with large windows" 
              className="w-full h-64 object-cover"
            />
            <div className="absolute top-4 right-4">
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                <div className="inline-block w-2 h-2 bg-white rounded-full mr-1"></div>
                Open Now
              </span>
            </div>
          </div>

          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
              <div className="lg:w-2/3">
                <div className="flex items-center mb-4">
                  <h1 className="text-3xl font-bold text-gray-900 mr-4">The Modern Store</h1>
                  <div className="flex items-center">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">4.8 (234 reviews)</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-6">
                  A contemporary retail space featuring curated home goods, artisanal products, and unique finds. 
                  We pride ourselves on supporting local artisans and offering high-quality, sustainable products.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Store Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        <span>123 Design Street, Creative District</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        <span>(555) 123-4567</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        <span>info@themodernstore.com</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Hours</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Monday - Friday</span>
                        <span>9:00 AM - 7:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Saturday</span>
                        <span>10:00 AM - 6:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sunday</span>
                        <span>12:00 PM - 5:00 PM</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Current Perks & Offers</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-spiral-blue bg-opacity-10 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Gift className="h-4 w-4 text-spiral-blue mr-2" />
                        <span className="font-medium text-spiral-blue">New Customer Special</span>
                      </div>
                      <p className="text-sm text-gray-600">15% off your first purchase</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Leaf className="h-4 w-4 text-green-600 mr-2" />
                        <span className="font-medium text-green-600">Eco-Friendly Discount</span>
                      </div>
                      <p className="text-sm text-gray-600">10% off sustainable products</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:w-1/3 lg:ml-8 mt-8 lg:mt-0">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button className="w-full bg-spiral-blue text-white hover:bg-spiral-blue-dark">
                      <Navigation className="h-4 w-4 mr-2" />
                      Get Directions
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Store
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Store
                    </Button>
                  </div>
                </div>

                <div className="mt-6 bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-2" />
                      <span className="text-gray-600">New 5-star review</span>
                    </div>
                    <div className="flex items-center">
                      <Gift className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-gray-600">Added new perk offer</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">Updated store hours</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
