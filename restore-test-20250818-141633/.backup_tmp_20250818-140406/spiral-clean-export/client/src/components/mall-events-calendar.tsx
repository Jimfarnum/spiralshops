import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Star, 
  Filter,
  ChevronLeft,
  ChevronRight,
  Plus,
  Camera,
  Music,
  ShoppingBag,
  Coffee,
  Heart,
  Share2
} from 'lucide-react';

interface MallEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  mallId: string;
  mallName: string;
  category: 'Fashion' | 'Family' | 'Food' | 'Entertainment' | 'Shopping' | 'Wellness';
  spiralBonus: number;
  maxAttendees?: number;
  currentAttendees: number;
  requiresRSVP: boolean;
  imageUrl?: string;
  organizer: string;
  price?: number;
  featured: boolean;
  tags: string[];
}

const mockEvents: MallEvent[] = [
  {
    id: '1',
    title: 'Valley Fair Fashion Week',
    description: 'Discover the latest fashion trends with local designers and exclusive shopping experiences. Meet designers, see runway shows, and get styling tips from fashion experts.',
    date: '2025-02-15',
    time: '2:00 PM - 8:00 PM',
    location: 'Center Court',
    mallId: '1',
    mallName: 'Westfield Valley Fair',
    category: 'Fashion',
    spiralBonus: 25,
    maxAttendees: 200,
    currentAttendees: 147,
    requiresRSVP: true,
    organizer: 'Westfield Events',
    featured: true,
    tags: ['runway', 'designers', 'styling', 'exclusive'],
  },
  {
    id: '2',
    title: 'Family Fun Day',
    description: 'Face painting, balloon animals, and family-friendly activities throughout the mall. Perfect for kids and parents to enjoy together.',
    date: '2025-02-22',
    time: '12:00 PM - 6:00 PM',
    location: 'Food Court Area',
    mallId: '1',
    mallName: 'Westfield Valley Fair',
    category: 'Family',
    spiralBonus: 15,
    currentAttendees: 89,
    requiresRSVP: false,
    organizer: 'Family Entertainment',
    featured: false,
    tags: ['kids', 'activities', 'free', 'family'],
  },
  {
    id: '3',
    title: 'Coffee & Wellness Workshop',
    description: 'Learn about artisanal coffee brewing while exploring wellness practices. Includes tastings and meditation session.',
    date: '2025-02-18',
    time: '10:00 AM - 12:00 PM',
    location: 'Blue Bottle Coffee',
    mallId: '2',
    mallName: 'Stanford Shopping Center',
    category: 'Wellness',
    spiralBonus: 20,
    maxAttendees: 30,
    currentAttendees: 22,
    requiresRSVP: true,
    price: 25.00,
    organizer: 'Blue Bottle Coffee',
    featured: true,
    tags: ['coffee', 'wellness', 'meditation', 'workshop'],
  },
  {
    id: '4',
    title: 'Live Jazz Performance',
    description: 'Enjoy smooth jazz performances by local artists while shopping and dining. Perfect evening entertainment for the whole family.',
    date: '2025-02-20',
    time: '6:00 PM - 9:00 PM',
    location: 'Main Plaza',
    mallId: '3',
    mallName: 'Santana Row',
    category: 'Entertainment',
    spiralBonus: 10,
    currentAttendees: 156,
    requiresRSVP: false,
    organizer: 'Santana Row Events',
    featured: false,
    tags: ['music', 'jazz', 'live', 'evening'],
  },
  {
    id: '5',
    title: 'Valentine\'s Popup Market',
    description: 'Special Valentine\'s themed popup shops featuring local artisans, chocolatiers, and gift makers. Find the perfect romantic gift.',
    date: '2025-02-14',
    time: '11:00 AM - 7:00 PM',
    location: 'North Wing Corridor',
    mallId: '1',
    mallName: 'Westfield Valley Fair',
    category: 'Shopping',
    spiralBonus: 30,
    currentAttendees: 203,
    requiresRSVP: false,
    organizer: 'Local Artisan Collective',
    featured: true,
    tags: ['valentine', 'popup', 'artisan', 'gifts'],
  },
];

const categoryIcons = {
  Fashion: <ShoppingBag className="h-4 w-4" />,
  Family: <Users className="h-4 w-4" />,
  Food: <Coffee className="h-4 w-4" />,
  Entertainment: <Music className="h-4 w-4" />,
  Shopping: <ShoppingBag className="h-4 w-4" />,
  Wellness: <Heart className="h-4 w-4" />,
};

const categoryColors = {
  Fashion: 'bg-purple-100 text-purple-800',
  Family: 'bg-green-100 text-green-800',
  Food: 'bg-orange-100 text-orange-800',
  Entertainment: 'bg-blue-100 text-blue-800',
  Shopping: 'bg-pink-100 text-pink-800',
  Wellness: 'bg-teal-100 text-teal-800',
};

export default function MallEventsCalendar() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMall, setSelectedMall] = useState<string>('all');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [rsvpStatus, setRsvpStatus] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const handleRSVP = (eventId: string, eventTitle: string) => {
    setRsvpStatus(prev => ({ ...prev, [eventId]: true }));
    
    toast({
      title: "RSVP Confirmed!",
      description: `You're registered for "${eventTitle}". Check your email for details.`,
    });
  };

  const handleShare = (event: MallEvent) => {
    const shareText = `Join me at ${event.title} on ${new Date(event.date).toLocaleDateString()} at ${event.mallName}! ${event.spiralBonus} SPIRALs earned for attending. #SPIRALEvents #ShopLocal`;
    
    // Simulate sharing
    navigator.clipboard?.writeText(shareText);
    
    toast({
      title: "Event Shared!",
      description: "Event details copied to clipboard. Earn 5 SPIRALs for sharing!",
    });
  };

  const filteredEvents = mockEvents.filter(event => {
    const categoryMatch = selectedCategory === 'all' || event.category === selectedCategory;
    const mallMatch = selectedMall === 'all' || event.mallId === selectedMall;
    return categoryMatch && mallMatch;
  });

  const featuredEvents = filteredEvents.filter(event => event.featured);
  const upcomingEvents = filteredEvents.filter(event => !event.featured);

  const getEventStatus = (event: MallEvent) => {
    if (event.maxAttendees && event.currentAttendees >= event.maxAttendees) {
      return { status: 'sold-out', label: 'Sold Out', color: 'bg-red-100 text-red-800' };
    }
    if (event.maxAttendees && event.currentAttendees >= event.maxAttendees * 0.9) {
      return { status: 'filling-fast', label: 'Filling Fast', color: 'bg-yellow-100 text-yellow-800' };
    }
    return { status: 'available', label: 'Available', color: 'bg-green-100 text-green-800' };
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[var(--spiral-navy)] mb-3">Mall Events Calendar</h1>
        <p className="text-lg text-gray-600">Discover exciting events at SPIRAL partner malls and earn bonus rewards</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Filter Events:</span>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Fashion">Fashion</SelectItem>
                  <SelectItem value="Family">Family</SelectItem>
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Entertainment">Entertainment</SelectItem>
                  <SelectItem value="Shopping">Shopping</SelectItem>
                  <SelectItem value="Wellness">Wellness</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedMall} onValueChange={setSelectedMall}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Malls" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Malls</SelectItem>
                  <SelectItem value="1">Westfield Valley Fair</SelectItem>
                  <SelectItem value="2">Stanford Shopping Center</SelectItem>
                  <SelectItem value="3">Santana Row</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="featured">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="featured">Featured Events</TabsTrigger>
          <TabsTrigger value="all">All Upcoming Events</TabsTrigger>
        </TabsList>

        {/* Featured Events Tab */}
        <TabsContent value="featured" className="space-y-6">
          {featuredEvents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Featured Events</h3>
              <p className="text-gray-600">Check back soon for exciting featured events!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredEvents.map((event) => {
                const eventStatus = getEventStatus(event);
                const isRSVPed = rsvpStatus[event.id];
                
                return (
                  <Card key={event.id} className="hover:shadow-lg transition-shadow border-2 border-[var(--spiral-coral)]/20">
                    <CardContent className="p-0">
                      <div className="bg-gradient-to-r from-[var(--spiral-coral)]/10 to-[var(--spiral-gold)]/10 p-4 border-b">
                        <div className="flex items-start justify-between mb-3">
                          <Badge className="bg-[var(--spiral-coral)] text-white">Featured Event</Badge>
                          <Badge className={eventStatus.color}>{eventStatus.label}</Badge>
                        </div>
                        
                        <h3 className="text-xl font-bold text-[var(--spiral-navy)] mb-2">{event.title}</h3>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{event.time}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className={categoryColors[event.category]}>
                            {categoryIcons[event.category]}
                            <span className="ml-1">{event.category}</span>
                          </Badge>
                          <Badge className="bg-[var(--spiral-gold)] text-black">
                            +{event.spiralBonus} SPIRALs
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <p className="text-gray-700 mb-4">{event.description}</p>
                        
                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}, {event.mallName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>
                              {event.currentAttendees} attending
                              {event.maxAttendees && ` (${event.maxAttendees} max)`}
                            </span>
                          </div>
                          {event.price && (
                            <div className="flex items-center gap-2">
                              <Star className="h-4 w-4" />
                              <span>${event.price}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-4">
                          {event.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex gap-2">
                          {event.requiresRSVP ? (
                            <Button
                              onClick={() => handleRSVP(event.id, event.title)}
                              disabled={isRSVPed || eventStatus.status === 'sold-out'}
                              className={isRSVPed ? 'bg-green-600 hover:bg-green-700' : 'button-primary'}
                              size="sm"
                            >
                              {isRSVPed ? (
                                <>
                                  <Users className="h-4 w-4 mr-2" />
                                  RSVP Confirmed
                                </>
                              ) : eventStatus.status === 'sold-out' ? (
                                'Event Full'
                              ) : (
                                <>
                                  <Plus className="h-4 w-4 mr-2" />
                                  RSVP Now
                                </>
                              )}
                            </Button>
                          ) : (
                            <Button className="button-primary" size="sm">
                              <Calendar className="h-4 w-4 mr-2" />
                              Add to Calendar
                            </Button>
                          )}
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleShare(event)}
                          >
                            <Share2 className="h-4 w-4 mr-2" />
                            Share (+5 SPIRALs)
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* All Events Tab */}
        <TabsContent value="all" className="space-y-6">
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Events Found</h3>
              <p className="text-gray-600">Try adjusting your filters or check back later!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingEvents.map((event) => {
                const eventStatus = getEventStatus(event);
                const isRSVPed = rsvpStatus[event.id];
                
                return (
                  <Card key={event.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-lg font-semibold text-[var(--spiral-navy)]">{event.title}</h3>
                            <div className="flex gap-2">
                              <Badge className={categoryColors[event.category]}>
                                {categoryIcons[event.category]}
                                <span className="ml-1">{event.category}</span>
                              </Badge>
                              <Badge className="bg-[var(--spiral-gold)] text-black">
                                +{event.spiralBonus} SPIRALs
                              </Badge>
                            </div>
                          </div>
                          
                          <p className="text-gray-700 mb-3">{event.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(event.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{event.location}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                            <span className="font-medium">{event.mallName}</span>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{event.currentAttendees} attending</span>
                            </div>
                            {event.price && (
                              <span className="font-medium">${event.price}</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 min-w-0 lg:min-w-[200px]">
                          <Badge className={eventStatus.color} variant="outline">
                            {eventStatus.label}
                          </Badge>
                          
                          {event.requiresRSVP ? (
                            <Button
                              onClick={() => handleRSVP(event.id, event.title)}
                              disabled={isRSVPed || eventStatus.status === 'sold-out'}
                              className={isRSVPed ? 'bg-green-600 hover:bg-green-700' : ''}
                              size="sm"
                            >
                              {isRSVPed ? 'RSVP Confirmed' : eventStatus.status === 'sold-out' ? 'Event Full' : 'RSVP Now'}
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline">
                              <Calendar className="h-4 w-4 mr-2" />
                              Add to Calendar
                            </Button>
                          )}
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleShare(event)}
                          >
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}