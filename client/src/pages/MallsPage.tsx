import { useState } from "react";
import { MapPin, Clock, Phone, ExternalLink, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/header";
import Footer from "@/components/footer";

interface Mall {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  website: string;
  hours: string;
  stores: number;
  rating: number;
  image: string;
  description: string;
  amenities: string[];
}

export default function MallsPage() {
  const [searchZip, setSearchZip] = useState("");

  // Mock mall data for demonstration
  const malls: Mall[] = [
    {
      id: 1,
      name: "Downtown Shopping Center",
      address: "123 Main Street",
      city: "Minneapolis",
      state: "MN",
      zipCode: "55401",
      phone: "(612) 555-0123",
      website: "https://downtownshopping.com",
      hours: "Mon-Sat 10AM-9PM, Sun 11AM-6PM",
      stores: 85,
      rating: 4.2,
      image: "/api/placeholder/400/250",
      description: "Premier shopping destination in downtown Minneapolis featuring major retailers and local boutiques.",
      amenities: ["Food Court", "Parking", "WiFi", "Family Restrooms"]
    },
    {
      id: 2,
      name: "Westside Mall",
      address: "456 Commerce Blvd",
      city: "Minneapolis",
      state: "MN", 
      zipCode: "55416",
      phone: "(612) 555-0456",
      website: "https://westsidemall.com",
      hours: "Mon-Sat 10AM-10PM, Sun 11AM-7PM",
      stores: 120,
      rating: 4.5,
      image: "/api/placeholder/400/250",
      description: "Large shopping center with department stores, specialty shops, and dining options.",
      amenities: ["Food Court", "Valet Parking", "WiFi", "Play Area", "Customer Service"]
    },
    {
      id: 3,
      name: "Eastgate Shopping Plaza",
      address: "789 Retail Way",
      city: "St. Paul", 
      state: "MN",
      zipCode: "55101",
      phone: "(651) 555-0789",
      website: "https://eastgateplaza.com",
      hours: "Mon-Sat 9AM-9PM, Sun 10AM-6PM",
      stores: 65,
      rating: 4.0,
      image: "/api/placeholder/400/250", 
      description: "Community shopping center serving the St. Paul area with local and national retailers.",
      amenities: ["Food Court", "Free Parking", "ATM", "Gift Wrapping"]
    }
  ];

  const filteredMalls = searchZip 
    ? malls.filter(mall => mall.zipCode.includes(searchZip) || mall.city.toLowerCase().includes(searchZip.toLowerCase()))
    : malls;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Shopping Malls</h1>
          <p className="text-gray-600 mb-6">Find shopping centers and malls in your area</p>
          
          {/* Search */}
          <div className="max-w-md">
            <Input
              type="text"
              placeholder="Enter ZIP code or city..."
              value={searchZip}
              onChange={(e) => setSearchZip(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Malls Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-4">
          <p className="text-gray-600">
            {filteredMalls.length} mall{filteredMalls.length !== 1 ? 's' : ''} found
            {searchZip && ` near "${searchZip}"`}
          </p>
        </div>

        {filteredMalls.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Malls Found</h3>
            <p className="text-gray-600 mb-4">
              No shopping centers found in that area. Try a different ZIP code or city.
            </p>
            <Button onClick={() => setSearchZip("")} variant="outline">
              Show All Malls
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMalls.map((mall) => (
              <div key={mall.id} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
                {/* Mall Image */}
                <div className="relative h-48">
                  <img
                    src={mall.image}
                    alt={mall.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/api/placeholder/400/250";
                    }}
                  />
                  <Badge className="absolute top-2 right-2 bg-white text-gray-700">
                    {mall.stores} stores
                  </Badge>
                </div>

                {/* Mall Details */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{mall.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{mall.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {mall.address}, {mall.city}, {mall.state} {mall.zipCode}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{mall.hours}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{mall.phone}</span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {mall.description}
                  </p>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {mall.amenities.slice(0, 3).map((amenity) => (
                      <Badge key={amenity} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                    {mall.amenities.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{mall.amenities.length - 3} more
                      </Badge>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => window.open(`/mall/${mall.id}`, '_blank')}
                    >
                      View Details
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => window.open(mall.website, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Website
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}