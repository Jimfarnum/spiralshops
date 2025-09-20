import { useState, useEffect } from 'react';
import { useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { 
  MapPin, 
  Clock, 
  Phone, 
  Navigation, 
  Calendar, 
  Gift, 
  Star, 
  Users, 
  ShoppingBag,
  Heart,
  Share2,
  Search
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';

interface Mall {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  hours: string;
  website: string;
  storeCount: number;
  type: 'shopping_center' | 'outlet' | 'lifestyle' | 'strip_mall';
  rating: number;
  reviewCount: number;
  features: string[];
  amenities: string[];
  spiralCenter: {
    location: string;
    hours: string;
    services: string[];
  };
  events: Array<{
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    description: string;
    spiralBonus: number;
    category: string;
  }>;
  perks: Array<{
    id: string;
    title: string;
    description: string;
    spiralCost: number;
    validUntil: string;
    category: string;
  }>;
  stores: Array<{
    id: string;
    name: string;
    category: string;
    location: string;
    rating: number;
    spiralPartner: boolean;
  }>;
}

const mockMallData: Record<string, Mall> = {
  'westfield-valley-fair': {
    id: 'westfield-valley-fair',
    name: 'Westfield Valley Fair',
    description: 'Silicon Valley\'s premier shopping destination featuring over 240 stores, restaurants, and entertainment options.',
    address: '2855 Stevens Creek Blvd',
    city: 'Santa Clara',
    state: 'CA',
    zipCode: '95050',
    phone: '(408) 248-4451',
    hours: 'Mon-Sat 10AM-9PM, Sun 11AM-7PM',
    website: 'westfield.com/valleyfair',
    storeCount: 240,
    type: 'shopping_center',
    rating: 4.2,
    reviewCount: 8467,
    features: ['SPIRAL Center', 'Food Court', 'Valet Parking', 'Family Lounge', 'Tesla Supercharger'],
    amenities: ['Free WiFi', 'Charging Stations', 'ATM', 'Restrooms', 'Nursing Room', 'Lost & Found'],
    spiralCenter: {
      location: 'Level 1, near Macy\'s',
      hours: 'Mon-Sat 10AM-8PM, Sun 11AM-6PM',
      services: ['SPIRAL Redemption', 'Gift Card Exchange', 'Customer Service', 'Package Pickup']
    },
    events: [
      {
        id: 'fashion-week',
        title: 'Valley Fair Fashion Week',
        date: '2025-02-15',
        time: '2:00 PM - 8:00 PM',
        location: 'Center Court',
        description: 'Discover the latest fashion trends with local designers and exclusive shopping experiences.',
        spiralBonus: 25,
        category: 'Fashion'
      },
      {
        id: 'family-fun-day',
        title: 'Family Fun Day',
        date: '2025-02-22',
        time: '12:00 PM - 6:00 PM',
        location: 'Food Court Area',
        description: 'Face painting, balloon animals, and family-friendly activities throughout the mall.',
        spiralBonus: 15,
        category: 'Family'
      }
    ],
    perks: [
      {
        id: 'valet-parking',
        title: 'Free Valet Parking',
        description: 'Complimentary valet parking service during weekdays',
        spiralCost: 50,
        validUntil: '2025-03-31',
        category: 'Parking'
      },
      {
        id: 'food-court-discount',
        title: '20% Off Food Court',
        description: 'Get 20% off any food court purchase over $15',
        spiralCost: 30,
        validUntil: '2025-02-28',
        category: 'Dining'
      }
    ],
    stores: [
      { id: '1', name: 'Apple Store', category: 'Electronics', location: 'Level 1', rating: 4.8, spiralPartner: true },
      { id: '2', name: 'Nordstrom', category: 'Department Store', location: 'Level 1-2', rating: 4.5, spiralPartner: true },
      { id: '3', name: 'Zara', category: 'Fashion', location: 'Level 1', rating: 4.3, spiralPartner: false },
      { id: '4', name: 'Cheesecake Factory', category: 'Restaurant', location: 'Level 2', rating: 4.4, spiralPartner: true },
    ]
  }
};

export default function MallTemplate() {
  const params = useParams();
  const mallId = params.id || 'westfield-valley-fair';
  const [mall, setMall] = useState<Mall | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [favorited, setFavorited] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API call to fetch mall data
    const mallData = mockMallData[mallId];
    if (mallData) {
      setMall(mallData);
    } else {
      // Handle mall not found
      toast({
        title: "Mall Not Found",
        description: "The requested mall could not be found.",
        variant: "destructive",
      });
    }
  }, [mallId, toast]);

  const handleFavorite = () => {
    setFavorited(!favorited);
    toast({
      title: favorited ? "Removed from Favorites" : "Added to Favorites",
      description: favorited ? "Mall removed from your favorites" : "Mall added to your favorites",
    });
  };

  const handleShare = () => {
    toast({
      title: "Share Mall",
      description: "Sharing functionality will be available soon!",
    });
  };

  const handleEventRSVP = (eventId: string) => {
    toast({
      title: "RSVP Confirmed",
      description: "You'll receive a confirmation email with event details.",
    });
  };

  const handlePerkRedeem = (perkId: string, spiralCost: number) => {
    toast({
      title: "Perk Redeemed",
      description: `${spiralCost} SPIRALs used for this perk.`,
    });
  };

  if (!mall) {
    return (
      <div className="min-h-screen bg-[var(--spiral-cream)]">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading mall information...</h1>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const getMallTypeColor = (type: string) => {
    switch (type) {
      case 'shopping_center': return 'bg-blue-100 text-blue-800';
      case 'outlet': return 'bg-green-100 text-green-800';
      case 'lifestyle': return 'bg-purple-100 text-purple-800';
      case 'strip_mall': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Badge className={getMallTypeColor(mall.type)}>
                  {mall.type.replace('_', ' ')}
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="font-medium">{mall.rating}</span>
                  <span className="text-gray-500">({mall.reviewCount} reviews)</span>
                </div>
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold text-[var(--spiral-navy)] mb-3">
                {mall.name}
              </h1>
              
              <p className="text-lg text-gray-600 mb-4 max-w-3xl">
                {mall.description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{mall.address}, {mall.city}, {mall.state} {mall.zipCode}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{mall.hours}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{mall.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>{mall.storeCount} stores</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
              <Button className="button-primary">
                <Navigation className="h-4 w-4 mr-2" />
                Get Directions
              </Button>
              <Button variant="outline" onClick={handleFavorite}>
                <Heart className={`h-4 w-4 mr-2 ${favorited ? 'fill-current text-red-500' : ''}`} />
                {favorited ? 'Favorited' : 'Add to Favorites'}
              </Button>
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share Mall
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="stores">Stores</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="perks">Perks</TabsTrigger>
              <TabsTrigger value="spiral-center">SPIRAL Center</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Mall Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {mall.features.map((feature) => (
                        <Badge key={feature} variant="outline" className="justify-center">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Amenities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {mall.amenities.map((amenity) => (
                        <div key={amenity} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-[var(--spiral-coral)] rounded-full"></div>
                          <span className="text-sm">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <ShoppingBag className="h-8 w-8 text-[var(--spiral-coral)] mx-auto mb-2" />
                    <div className="text-2xl font-bold text-[var(--spiral-navy)]">{mall.storeCount}</div>
                    <div className="text-sm text-gray-600">Total Stores</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-[var(--spiral-navy)]">{mall.rating}</div>
                    <div className="text-sm text-gray-600">Average Rating</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Calendar className="h-8 w-8 text-[var(--spiral-sage)] mx-auto mb-2" />
                    <div className="text-2xl font-bold text-[var(--spiral-navy)]">{mall.events.length}</div>
                    <div className="text-sm text-gray-600">Upcoming Events</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Gift className="h-8 w-8 text-[var(--spiral-gold)] mx-auto mb-2" />
                    <div className="text-2xl font-bold text-[var(--spiral-navy)]">{mall.perks.length}</div>
                    <div className="text-sm text-gray-600">Active Perks</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Stores Tab */}
            <TabsContent value="stores" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[var(--spiral-navy)]">Store Directory</h2>
                <Button variant="outline">
                  <Search className="h-4 w-4 mr-2" />
                  Filter Stores
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mall.stores.map((store) => (
                  <Link key={store.id} href={`/mall/${mall.id}/store/${store.id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold">{store.name}</h3>
                          {store.spiralPartner && (
                            <Badge className="bg-[var(--spiral-coral)] text-white">
                              SPIRAL Partner
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{store.category}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-sm">{store.rating}</span>
                          </div>
                          <span className="text-sm text-gray-500">{store.location}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </TabsContent>
            
            {/* Events Tab */}
            <TabsContent value="events" className="space-y-6">
              <h2 className="text-2xl font-bold text-[var(--spiral-navy)]">Upcoming Events</h2>
              
              <div className="space-y-4">
                {mall.events.map((event) => (
                  <Card key={event.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-[var(--spiral-navy)]">{event.title}</h3>
                            <Badge className="bg-[var(--spiral-gold)] text-black">
                              +{event.spiralBonus} SPIRALs
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{event.location}</span>
                            </div>
                          </div>
                          <p className="text-gray-700">{event.description}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button onClick={() => handleEventRSVP(event.id)}>
                            RSVP for Event
                          </Button>
                          <Button variant="outline" size="sm">
                            <Calendar className="h-4 w-4 mr-2" />
                            Add to Calendar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            {/* Perks Tab */}
            <TabsContent value="perks" className="space-y-6">
              <h2 className="text-2xl font-bold text-[var(--spiral-navy)]">SPIRAL Perks & Rewards</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mall.perks.map((perk) => (
                  <Card key={perk.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-[var(--spiral-navy)]">{perk.title}</h3>
                        <Badge variant="outline">{perk.category}</Badge>
                      </div>
                      <p className="text-gray-700 mb-4">{perk.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          Valid until {new Date(perk.validUntil).toLocaleDateString()}
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => handlePerkRedeem(perk.id, perk.spiralCost)}
                          className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/80"
                        >
                          Redeem {perk.spiralCost} SPIRALs
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            {/* SPIRAL Center Tab */}
            <TabsContent value="spiral-center" className="space-y-6">
              <h2 className="text-2xl font-bold text-[var(--spiral-navy)]">SPIRAL Center</h2>
              
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Location & Hours</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-[var(--spiral-coral)]" />
                          <span>{mall.spiralCenter.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-[var(--spiral-coral)]" />
                          <span>{mall.spiralCenter.hours}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Services Available</h3>
                      <div className="space-y-2">
                        {mall.spiralCenter.services.map((service) => (
                          <div key={service} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-[var(--spiral-coral)] rounded-full"></div>
                            <span>{service}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button className="button-primary">
                        <Navigation className="h-4 w-4 mr-2" />
                        Get Directions to SPIRAL Center
                      </Button>
                      <Button variant="outline">
                        <Phone className="h-4 w-4 mr-2" />
                        Contact SPIRAL Center
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}