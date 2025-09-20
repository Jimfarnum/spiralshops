import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar,
  Clock, 
  MapPin,
  Users,
  Star,
  Share2,
  Filter,
  Search
} from 'lucide-react';

interface MallEvent {
  id: string;
  title: string;
  description: string;
  eventType: 'sale' | 'music' | 'holiday' | 'promotion' | 'family';
  startDate: string;
  endDate: string;
  location: string;
  spiralBonus: number;
  maxAttendees?: number;
  currentAttendees: number;
  requiresRSVP: boolean;
  imageUrl: string;
  isActive: boolean;
}

interface EventRSVP {
  eventId: string;
  status: 'confirmed' | 'maybe' | 'cancelled';
  attendedAt?: string;
}

export default function MallEvents({ mallId }: { mallId: string }) {
  const { toast } = useToast();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [userRSVPs, setUserRSVPs] = useState<EventRSVP[]>([
    { eventId: '2', status: 'confirmed' }
  ]);

  const [mallEvents] = useState<MallEvent[]>([
    {
      id: '1',
      title: 'Double SPIRALS Saturday',
      description: 'Earn double SPIRAL points on all purchases this Saturday! Visit any participating store and watch your loyalty points multiply.',
      eventType: 'promotion',
      startDate: '2025-01-25T00:00:00Z',
      endDate: '2025-01-25T23:59:59Z',
      location: 'All Stores',
      spiralBonus: 0, // Uses multiplier instead
      currentAttendees: 0,
      requiresRSVP: false,
      imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop',
      isActive: true
    },
    {
      id: '2',
      title: 'Live Jazz Performance',
      description: 'Enjoy smooth jazz by the Heritage Trio in our beautiful central plaza. Free for all visitors with bonus SPIRALs for attendees!',
      eventType: 'music',
      startDate: '2025-01-26T19:00:00Z',
      endDate: '2025-01-26T21:00:00Z',
      location: 'Central Plaza',
      spiralBonus: 25,
      maxAttendees: 150,
      currentAttendees: 87,
      requiresRSVP: true,
      imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop',
      isActive: true
    },
    {
      id: '3',
      title: 'Winter Sale Weekend',
      description: 'Up to 50% off at participating stores! The biggest savings event of the season with extra SPIRAL bonuses.',
      eventType: 'sale',
      startDate: '2025-01-27T10:00:00Z',
      endDate: '2025-01-28T20:00:00Z',
      location: 'Participating Stores',
      spiralBonus: 15,
      currentAttendees: 0,
      requiresRSVP: false,
      imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop',
      isActive: true
    },
    {
      id: '4',
      title: 'Family Fun Day',
      description: 'Face painting, balloon animals, and activities for kids! Perfect family outing with special SPIRAL rewards.',
      eventType: 'family',
      startDate: '2025-02-01T11:00:00Z',
      endDate: '2025-02-01T16:00:00Z',
      location: 'Food Court Area',
      spiralBonus: 20,
      maxAttendees: 200,
      currentAttendees: 45,
      requiresRSVP: true,
      imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=200&fit=crop',
      isActive: true
    },
    {
      id: '5',
      title: 'Holiday Light Display',
      description: 'Beautiful winter light installation throughout the mall. Take photos and share for bonus SPIRALs!',
      eventType: 'holiday',
      startDate: '2025-01-24T17:00:00Z',
      endDate: '2025-02-14T22:00:00Z',
      location: 'Throughout Mall',
      spiralBonus: 10,
      currentAttendees: 0,
      requiresRSVP: false,
      imageUrl: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=400&h=200&fit=crop',
      isActive: true
    }
  ]);

  const filteredEvents = mallEvents.filter(event => {
    const matchesFilter = activeFilter === 'all' || event.eventType === activeFilter;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch && event.isActive;
  });

  const upcomingEvents = filteredEvents.filter(event => new Date(event.startDate) > new Date());
  const currentEvents = filteredEvents.filter(event => {
    const now = new Date();
    return new Date(event.startDate) <= now && new Date(event.endDate) >= now;
  });

  const handleRSVP = (eventId: string, status: 'confirmed' | 'maybe' | 'cancelled') => {
    const existingRSVP = userRSVPs.find(rsvp => rsvp.eventId === eventId);
    
    if (existingRSVP) {
      setUserRSVPs(prev => prev.map(rsvp => 
        rsvp.eventId === eventId ? { ...rsvp, status } : rsvp
      ));
    } else {
      setUserRSVPs(prev => [...prev, { eventId, status }]);
    }

    toast({
      title: status === 'confirmed' ? 'RSVP Confirmed!' : status === 'maybe' ? 'RSVP Updated' : 'RSVP Cancelled',
      description: status === 'confirmed' 
        ? 'You\'ll earn bonus SPIRALs for attending!' 
        : status === 'maybe'
        ? 'We\'ll send you a reminder before the event'
        : 'Your RSVP has been cancelled',
      duration: 3000,
    });
  };

  const getUserRSVPStatus = (eventId: string): string => {
    const rsvp = userRSVPs.find(r => r.eventId === eventId);
    return rsvp?.status || 'none';
  };

  const shareEvent = (event: MallEvent) => {
    const shareText = `Check out "${event.title}" at Heritage Square Mall! ${event.description.substring(0, 100)}... #SPIRALshops #LocalEvents`;
    
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText + ' ' + window.location.href);
      toast({
        title: 'Event link copied!',
        description: 'Share this event with friends and earn bonus SPIRALs',
        duration: 3000,
      });
    }
  };

  const getEventTypeColor = (type: string): string => {
    switch (type) {
      case 'sale': return 'bg-green-100 text-green-800';
      case 'music': return 'bg-purple-100 text-purple-800';
      case 'holiday': return 'bg-red-100 text-red-800';
      case 'promotion': return 'bg-orange-100 text-orange-800';
      case 'family': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--spiral-navy)]">Mall Events</h2>
          <p className="text-gray-600">Discover exciting events and earn bonus SPIRALs</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Event Type Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveFilter('all')}
          className={activeFilter === 'all' ? 'bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90' : ''}
        >
          <Filter className="h-4 w-4 mr-2" />
          All Events
        </Button>
        {['sale', 'music', 'holiday', 'promotion', 'family'].map(type => (
          <Button
            key={type}
            variant={activeFilter === type ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter(type)}
            className={activeFilter === type ? 'bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90' : ''}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        ))}
      </div>

      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="current">Current Events ({currentEvents.length})</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Events ({upcomingEvents.length})</TabsTrigger>
        </TabsList>

        {/* Current Events */}
        <TabsContent value="current" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {currentEvents.map(event => (
              <Card key={event.id} className="overflow-hidden">
                <div className="relative">
                  <img 
                    src={event.imageUrl} 
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className={`absolute top-3 left-3 ${getEventTypeColor(event.eventType)}`}>
                    {event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}
                  </Badge>
                  {event.spiralBonus > 0 && (
                    <Badge className="absolute top-3 right-3 bg-[var(--spiral-coral)] text-white">
                      +{event.spiralBonus} SPIRALs
                    </Badge>
                  )}
                </div>
                
                <CardHeader>
                  <CardTitle className="text-[var(--spiral-navy)]">{event.title}</CardTitle>
                  <CardDescription>{event.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(event.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  {event.endDate !== event.startDate && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>Until {formatDate(event.endDate)}</span>
                    </div>
                  )}

                  {event.requiresRSVP && event.maxAttendees && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{event.currentAttendees} / {event.maxAttendees} attending</span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {event.requiresRSVP ? (
                      <div className="flex gap-2 flex-1">
                        <Button
                          onClick={() => handleRSVP(event.id, 'confirmed')}
                          className={`flex-1 ${getUserRSVPStatus(event.id) === 'confirmed' 
                            ? 'bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90' 
                            : ''}`}
                          variant={getUserRSVPStatus(event.id) === 'confirmed' ? 'default' : 'outline'}
                          size="sm"
                        >
                          {getUserRSVPStatus(event.id) === 'confirmed' ? 'Attending' : 'RSVP'}
                        </Button>
                        {getUserRSVPStatus(event.id) === 'confirmed' && (
                          <Button
                            onClick={() => handleRSVP(event.id, 'cancelled')}
                            variant="outline"
                            size="sm"
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    ) : (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        No RSVP Required
                      </Badge>
                    )}
                    
                    <Button
                      onClick={() => shareEvent(event)}
                      variant="outline"
                      size="sm"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {currentEvents.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Current Events</h3>
                <p className="text-gray-500">Check out our upcoming events or try adjusting your filters.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Upcoming Events */}
        <TabsContent value="upcoming" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {upcomingEvents.map(event => (
              <Card key={event.id} className="overflow-hidden">
                <div className="relative">
                  <img 
                    src={event.imageUrl} 
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className={`absolute top-3 left-3 ${getEventTypeColor(event.eventType)}`}>
                    {event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}
                  </Badge>
                  {event.spiralBonus > 0 && (
                    <Badge className="absolute top-3 right-3 bg-[var(--spiral-coral)] text-white">
                      +{event.spiralBonus} SPIRALs
                    </Badge>
                  )}
                </div>
                
                <CardHeader>
                  <CardTitle className="text-[var(--spiral-navy)]">{event.title}</CardTitle>
                  <CardDescription>{event.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(event.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  {event.requiresRSVP && event.maxAttendees && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{event.currentAttendees} / {event.maxAttendees} planning to attend</span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {event.requiresRSVP ? (
                      <div className="flex gap-2 flex-1">
                        <Button
                          onClick={() => handleRSVP(event.id, 'confirmed')}
                          className={`flex-1 ${getUserRSVPStatus(event.id) === 'confirmed' 
                            ? 'bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90' 
                            : ''}`}
                          variant={getUserRSVPStatus(event.id) === 'confirmed' ? 'default' : 'outline'}
                          size="sm"
                        >
                          {getUserRSVPStatus(event.id) === 'confirmed' ? 'Will Attend' : 'RSVP'}
                        </Button>
                        <Button
                          onClick={() => handleRSVP(event.id, 'maybe')}
                          variant={getUserRSVPStatus(event.id) === 'maybe' ? 'default' : 'outline'}
                          size="sm"
                        >
                          Maybe
                        </Button>
                      </div>
                    ) : (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        No RSVP Required
                      </Badge>
                    )}
                    
                    <Button
                      onClick={() => shareEvent(event)}
                      variant="outline"
                      size="sm"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {upcomingEvents.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Upcoming Events</h3>
                <p className="text-gray-500">New events are added regularly. Check back soon!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}