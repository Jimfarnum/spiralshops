import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';
import { 
  Calendar, 
  MapPin, 
  Users,
  Clock,
  Gift,
  Search,
  Filter,
  CalendarPlus,
  Share2,
  ExternalLink,
  Star,
  TrendingUp,
  Zap,
  User,
  CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';

interface MallEventWithDetails {
  id: number;
  mallId: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  imageUrl: string | null;
  eventType: string;
  location: string;
  maxRsvp: number;
  currentRsvp: number;
  rewardPoints: number;
  isApproved: boolean;
  isPublished: boolean;
  createdAt: string;
  mall: {
    name: string;
    location: string;
    rating: number;
  };
  userRsvpStatus?: string | null;
}

interface EventsData {
  events: MallEventWithDetails[];
  total: number;
}

export default function EventsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [filters, setFilters] = useState({
    eventType: '',
    mallId: '',
    location: '',
    sort: 'date',
    search: ''
  });

  const { data: eventsData, isLoading } = useQuery<EventsData>({
    queryKey: ['/api/events', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.eventType) params.append('eventType', filters.eventType);
      if (filters.mallId) params.append('mallId', filters.mallId);
      if (filters.location) params.append('location', filters.location);
      if (filters.sort) params.append('sort', filters.sort);
      if (filters.search) params.append('search', filters.search);
      
      const response = await fetch(`/api/events?${params.toString()}`);
      return response.json();
    }
  });

  const rsvpMutation = useMutation({
    mutationFn: async (eventId: number) => {
      const response = await fetch(`/api/events/${eventId}/rsvp`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'user-id': '1' // Mock auth
        },
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to RSVP');
      }
      return response.json();
    },
    onSuccess: (data, eventId) => {
      toast({
        title: "RSVP Confirmed!",
        description: "You're all set for the event. Check your email for details.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      queryClient.invalidateQueries({ queryKey: [`/api/events/${eventId}`] });
    },
    onError: (error: any) => {
      toast({
        title: "RSVP Failed",
        description: error.message || "Unable to RSVP to this event",
        variant: "destructive",
      });
    },
  });

  const cancelRsvpMutation = useMutation({
    mutationFn: async (eventId: number) => {
      const response = await fetch(`/api/events/${eventId}/rsvp`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'user-id': '1' // Mock auth
        },
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to cancel RSVP');
      }
      return response.json();
    },
    onSuccess: (data, eventId) => {
      toast({
        title: "RSVP Cancelled",
        description: "Your RSVP has been cancelled successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      queryClient.invalidateQueries({ queryKey: [`/api/events/${eventId}`] });
    },
    onError: (error: any) => {
      toast({
        title: "Cancellation Failed",
        description: error.message || "Unable to cancel RSVP",
        variant: "destructive",
      });
    },
  });

  const handleRsvp = (event: MallEventWithDetails) => {
    if (event.userRsvpStatus === 'confirmed' || event.userRsvpStatus === 'attended') {
      cancelRsvpMutation.mutate(event.id);
    } else {
      rsvpMutation.mutate(event.id);
    }
  };

  const generateCalendarUrl = (event: MallEventWithDetails) => {
    const startDate = new Date(event.startTime);
    const endDate = new Date(event.endTime);
    
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}/${endDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(`${event.location}, ${event.mall.name}`)}`;
    
    return googleUrl;
  };

  const handleShare = (event: MallEventWithDetails, platform: string) => {
    const shareText = `Join me at "${event.title}" at ${event.mall.name}! 🎉 Earn ${event.rewardPoints} SPIRALs for attending. #MallEvents #SPIRAL`;
    const shareUrl = `${window.location.origin}/events/${event.id}`;
    
    let url = '';
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
    }
    
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  const events = eventsData?.events || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--spiral-cream)]">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Calendar className="h-8 w-8 text-[var(--spiral-coral)]" />
              <h1 className="text-4xl font-bold text-[var(--spiral-navy)]">
                Mall Events & Activities
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover exciting events at local shopping centers. RSVP to activities, 
              earn SPIRAL rewards, and connect with your community.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {events.length} Upcoming Events
              </div>
              <div className="flex items-center gap-1">
                <Gift className="h-4 w-4" />
                Earn 10-25 SPIRALs per Event
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                Community Activities
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search events..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-10"
                  />
                </div>
                <Select value={filters.eventType} onValueChange={(value) => setFilters(prev => ({ ...prev, eventType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Event Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Fashion">Fashion</SelectItem>
                    <SelectItem value="Kids">Kids & Family</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Food">Food & Beverage</SelectItem>
                    <SelectItem value="Music">Music & Arts</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filters.location} onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="Downtown">Downtown District</SelectItem>
                    <SelectItem value="Suburbs">Suburbs</SelectItem>
                    <SelectItem value="West End">West End</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filters.sort} onValueChange={(value) => setFilters(prev => ({ ...prev, sort: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Soonest First</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="rewards">Highest Rewards</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => setFilters({ eventType: '', mallId: '', location: '', sort: 'date', search: '' })}
                  variant="outline"
                  className="w-full"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Events Grid */}
          {events.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {events.map((event) => {
                const startDate = new Date(event.startTime);
                const endDate = new Date(event.endTime);
                const isRsvped = event.userRsvpStatus === 'confirmed' || event.userRsvpStatus === 'attended';
                const spotsRemaining = event.maxRsvp - event.currentRsvp;
                const isAlmostFull = spotsRemaining <= 10;
                
                return (
                  <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      {event.imageUrl && (
                        <img 
                          src={event.imageUrl} 
                          alt={event.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="absolute top-4 left-4 flex gap-2">
                        <Badge className="bg-[var(--spiral-coral)] text-white">
                          <Gift className="h-3 w-3 mr-1" />
                          {event.rewardPoints} SPIRALs
                        </Badge>
                        <Badge variant="outline" className="bg-white/90">
                          {event.eventType}
                        </Badge>
                      </div>
                      {isRsvped && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-green-600 text-white">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            RSVP'd
                          </Badge>
                        </div>
                      )}
                    </div>

                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{event.title}</CardTitle>
                          <CardDescription className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {event.mall.name}
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                              {event.mall.rating}
                            </div>
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p className="text-gray-700 leading-relaxed">
                        {event.description.length > 150 
                          ? `${event.description.substring(0, 150)}...` 
                          : event.description
                        }
                      </p>

                      {/* Event Details */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          {format(startDate, 'EEEE, MMMM d, yyyy')}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          {format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="h-4 w-4" />
                          {event.currentRsvp} / {event.maxRsvp} attending
                          {isAlmostFull && (
                            <Badge variant="destructive" className="text-xs">
                              Only {spotsRemaining} spots left!
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>RSVP Progress</span>
                          <span>{Math.round((event.currentRsvp / event.maxRsvp) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all ${
                              isAlmostFull ? 'bg-red-500' : 'bg-[var(--spiral-coral)]'
                            }`}
                            style={{ width: `${Math.min((event.currentRsvp / event.maxRsvp) * 100, 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4 border-t">
                        <Button
                          onClick={() => handleRsvp(event)}
                          disabled={rsvpMutation.isPending || cancelRsvpMutation.isPending || (!isRsvped && spotsRemaining <= 0)}
                          className={`flex-1 ${isRsvped 
                            ? 'bg-gray-600 hover:bg-gray-700' 
                            : 'bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/80'
                          }`}
                        >
                          {isRsvped ? (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Cancel RSVP
                            </>
                          ) : spotsRemaining <= 0 ? (
                            <>
                              <Users className="mr-2 h-4 w-4" />
                              Event Full
                            </>
                          ) : (
                            <>
                              <CalendarPlus className="mr-2 h-4 w-4" />
                              RSVP Free
                            </>
                          )}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(generateCalendarUrl(event), '_blank')}
                        >
                          <Calendar className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShare(event, 'facebook')}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Event Page Link */}
                      <Link href={`/events/${event.id}`}>
                        <Button variant="ghost" className="w-full text-[var(--spiral-coral)]">
                          View Full Details
                          <ExternalLink className="ml-2 h-3 w-3" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No events found</h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your filters to see more upcoming events
                </p>
                <Button
                  onClick={() => setFilters({ eventType: '', mallId: '', location: '', sort: 'date', search: '' })}
                  className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/80"
                >
                  Show All Events
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Call to Action */}
          {events.length > 0 && (
            <Card className="border-[var(--spiral-coral)]/20 bg-[var(--spiral-coral)]/5">
              <CardContent className="text-center py-8">
                <h3 className="text-xl font-bold text-[var(--spiral-navy)] mb-2">
                  Don't Miss Out on Community Events!
                </h3>
                <p className="text-gray-600 mb-4">
                  RSVP to events, attend activities, and earn SPIRAL rewards while connecting with your local community.
                </p>
                <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Zap className="h-4 w-4 text-[var(--spiral-gold)]" />
                    Earn SPIRALs for Attending
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-blue-600" />
                    Meet Local Community
                  </div>
                  <div className="flex items-center gap-1">
                    <Gift className="h-4 w-4 text-green-600" />
                    Free to Join
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}