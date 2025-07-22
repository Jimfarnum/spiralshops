import { useParams } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
  CalendarPlus,
  Share2,
  ExternalLink,
  Star,
  ArrowLeft,
  CheckCircle,
  Building,
  Zap,
  User,
  AlertCircle
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

interface EventData {
  event: MallEventWithDetails;
}

export default function EventDetailPage() {
  const { id } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: eventData, isLoading } = useQuery<EventData>({
    queryKey: [`/api/events/${id}`],
    queryFn: async () => {
      const response = await fetch(`/api/events/${id}`, {
        headers: { 'user-id': '1' } // Mock auth
      });
      if (!response.ok) {
        throw new Error('Event not found');
      }
      return response.json();
    },
    enabled: !!id
  });

  const rsvpMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/events/${id}/rsvp`, {
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
    onSuccess: () => {
      toast({
        title: "RSVP Confirmed!",
        description: "You're all set for the event. Check your email for details.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/events/${id}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
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
    mutationFn: async () => {
      const response = await fetch(`/api/events/${id}/rsvp`, {
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
    onSuccess: () => {
      toast({
        title: "RSVP Cancelled",
        description: "Your RSVP has been cancelled successfully.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/events/${id}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
    },
    onError: (error: any) => {
      toast({
        title: "Cancellation Failed",
        description: error.message || "Unable to cancel RSVP",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--spiral-cream)]">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const event = eventData?.event;
  if (!event) {
    return (
      <div className="min-h-screen bg-[var(--spiral-cream)]">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Event not found</h3>
              <p className="text-gray-500 mb-6">
                The event you're looking for doesn't exist or has been removed.
              </p>
              <Link href="/events">
                <Button className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/80">
                  Browse All Events
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const startDate = new Date(event.startTime);
  const endDate = new Date(event.endTime);
  const isRsvped = event.userRsvpStatus === 'confirmed' || event.userRsvpStatus === 'attended';
  const spotsRemaining = event.maxRsvp - event.currentRsvp;
  const isAlmostFull = spotsRemaining <= 10;
  const isFull = spotsRemaining <= 0;

  const generateCalendarUrl = () => {
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}/${endDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(`${event.location}, ${event.mall.name}`)}`;
    return googleUrl;
  };

  const handleShare = (platform: string) => {
    const shareText = `Join me at "${event.title}" at ${event.mall.name}! 🎉 Earn ${event.rewardPoints} SPIRALs for attending. #MallEvents #SPIRAL`;
    const shareUrl = window.location.href;
    
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

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Back Navigation */}
          <Link href="/events">
            <Button variant="ghost" className="text-[var(--spiral-coral)]">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Button>
          </Link>

          {/* Hero Image */}
          {event.imageUrl && (
            <div className="relative">
              <img 
                src={event.imageUrl} 
                alt={event.title}
                className="w-full h-64 md:h-80 object-cover rounded-lg"
              />
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
                    You're Attending
                  </Badge>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Event Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">{event.title}</CardTitle>
                      <CardDescription className="flex items-center gap-4 text-base">
                        <div className="flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          {event.mall.name}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          {event.mall.rating}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {event.mall.location}
                        </div>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {event.description}
                  </p>
                </CardContent>
              </Card>

              {/* Event Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Event Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-[var(--spiral-coral)]" />
                        <div>
                          <div className="font-medium">Date</div>
                          <div className="text-sm text-gray-600">
                            {format(startDate, 'EEEE, MMMM d, yyyy')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-[var(--spiral-coral)]" />
                        <div>
                          <div className="font-medium">Time</div>
                          <div className="text-sm text-gray-600">
                            {format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-[var(--spiral-coral)]" />
                        <div>
                          <div className="font-medium">Location</div>
                          <div className="text-sm text-gray-600">
                            {event.location}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Zap className="h-5 w-5 text-[var(--spiral-gold)]" />
                        <div>
                          <div className="font-medium">SPIRAL Reward</div>
                          <div className="text-sm text-gray-600">
                            {event.rewardPoints} SPIRALs for attending
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Share Event */}
              <Card>
                <CardHeader>
                  <CardTitle>Share This Event</CardTitle>
                  <CardDescription>
                    Invite friends and family to join you at this community event
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => handleShare('facebook')}
                      className="flex-1"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Facebook
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleShare('twitter')}
                      className="flex-1"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Twitter
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => window.open(generateCalendarUrl(), '_blank')}
                      className="flex-1"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Add to Calendar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* RSVP Card */}
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="text-center">Event RSVP</CardTitle>
                  {isAlmostFull && !isFull && (
                    <div className="text-center">
                      <Badge variant="destructive" className="text-xs">
                        Only {spotsRemaining} spots left!
                      </Badge>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Attendance Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Attendance</span>
                      <span>{event.currentRsvp} / {event.maxRsvp}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          isAlmostFull ? 'bg-red-500' : 'bg-[var(--spiral-coral)]'
                        }`}
                        style={{ width: `${Math.min((event.currentRsvp / event.maxRsvp) * 100, 100)}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 text-center">
                      {Math.round((event.currentRsvp / event.maxRsvp) * 100)}% full
                    </div>
                  </div>

                  <Separator />

                  {/* RSVP Status */}
                  {isRsvped ? (
                    <div className="text-center space-y-3">
                      <div className="flex items-center justify-center gap-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">You're attending!</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Check your email for event details and reminders.
                      </p>
                      <Button
                        onClick={() => cancelRsvpMutation.mutate()}
                        disabled={cancelRsvpMutation.isPending}
                        variant="outline"
                        className="w-full"
                      >
                        Cancel RSVP
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center space-y-3">
                      <div className="text-2xl font-bold text-[var(--spiral-coral)]">
                        FREE
                      </div>
                      <p className="text-sm text-gray-600">
                        Join the community and earn {event.rewardPoints} SPIRALs
                      </p>
                      <Button
                        onClick={() => rsvpMutation.mutate()}
                        disabled={rsvpMutation.isPending || isFull}
                        className={`w-full ${
                          isFull 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/80'
                        }`}
                      >
                        {isFull ? (
                          <>
                            <Users className="mr-2 h-4 w-4" />
                            Event Full
                          </>
                        ) : (
                          <>
                            <CalendarPlus className="mr-2 h-4 w-4" />
                            RSVP Now
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  <Separator />

                  {/* Reward Info */}
                  <div className="bg-[var(--spiral-gold)]/10 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Gift className="h-4 w-4 text-[var(--spiral-gold)]" />
                      <span className="font-medium text-sm">SPIRAL Rewards</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Earn <strong>{event.rewardPoints} SPIRALs</strong> when you attend this event. 
                      Show up and get your reward!
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Mall Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">About {event.mall.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm">{event.mall.rating} out of 5 stars</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{event.mall.location}</span>
                  </div>
                  <Link href={`/malls/${event.mallId}`}>
                    <Button variant="outline" className="w-full mt-3">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Mall Directory
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}