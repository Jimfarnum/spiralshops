import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Calendar, 
  MapPin, 
  Users,
  Clock,
  Gift,
  Plus,
  CheckCircle,
  X,
  AlertTriangle,
  Settings,
  Eye,
  Download,
  UserCheck,
  Zap
} from 'lucide-react';
// Using native Date API instead of date-fns
const formatDateDate = (date: string | Date, formatDateType: string = 'short') => {
  const d = new Date(date);
  if (formatDateType === 'PPp') return d.toLocaleString();
  if (formatDateType === 'PP') return d.toLocaleDateString();
  return d.toLocaleDateString();
};

const eventFormSchema = z.object({
  mallId: z.string().min(1, 'Mall is required'),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  imageUrl: z.string().url().optional().or(z.literal('')),
  eventType: z.string().min(1, 'Event type is required'),
  location: z.string().min(1, 'Location is required'),
  maxRsvp: z.number().min(1, 'Max RSVP must be at least 1').max(500, 'Max RSVP cannot exceed 500'),
  rewardPoints: z.number().min(5, 'Reward points must be at least 5').max(50, 'Reward points cannot exceed 50'),
});

type EventFormData = z.infer<typeof eventFormSchema>;

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
}

interface EventRsvpWithUser {
  id: number;
  eventId: number;
  userId: string;
  status: string;
  rsvpedAt: string;
  attendedAt: string | null;
  rewardClaimed: boolean;
  user: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
  };
}

export default function AdminEventsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      mallId: '',
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      imageUrl: '',
      eventType: '',
      location: '',
      maxRsvp: 100,
      rewardPoints: 15,
    },
  });

  // Fetch pending events
  const { data: pendingEvents, isLoading: loadingPending } = useQuery({
    queryKey: ['/api/admin/events/pending'],
    queryFn: async () => {
      const response = await fetch('/api/admin/events/pending');
      return response.json();
    }
  });

  // Fetch RSVPs for selected event
  const { data: eventRsvps } = useQuery({
    queryKey: [`/api/admin/events/${selectedEventId}/rsvps`],
    queryFn: async () => {
      const response = await fetch(`/api/admin/events/${selectedEventId}/rsvps`);
      return response.json();
    },
    enabled: !!selectedEventId
  });

  // Create event mutation
  const createEventMutation = useMutation({
    mutationFn: async (data: EventFormData) => {
      const response = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create event');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Event Created",
        description: "Event created successfully and is awaiting approval.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/admin/events/pending'] });
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create event",
        variant: "destructive",
      });
    },
  });

  // Moderate event mutation
  const moderateEventMutation = useMutation({
    mutationFn: async ({ eventId, action, published }: { eventId: number; action: string; published?: boolean }) => {
      const response = await fetch(`/api/admin/events/${eventId}/moderate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, published }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to moderate event');
      }
      return response.json();
    },
    onSuccess: (data, variables) => {
      toast({
        title: "Event Updated",
        description: `Event ${variables.action}d successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/events/pending'] });
    },
    onError: (error: any) => {
      toast({
        title: "Moderation Failed",
        description: error.message || "Failed to moderate event",
        variant: "destructive",
      });
    },
  });

  // Mark attendance mutation
  const markAttendanceMutation = useMutation({
    mutationFn: async ({ eventId, userId }: { eventId: number; userId: string }) => {
      const response = await fetch(`/api/admin/events/${eventId}/attendance/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to mark attendance');
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Attendance Confirmed",
        description: `${data.spiralsAwarded} SPIRALs awarded for attendance!`,
      });
      queryClient.invalidateQueries({ queryKey: [`/api/admin/events/${selectedEventId}/rsvps`] });
    },
    onError: (error: any) => {
      toast({
        title: "Attendance Failed",
        description: error.message || "Failed to mark attendance",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EventFormData) => {
    createEventMutation.mutate(data);
  };

  const handleModerate = (eventId: number, action: 'approve' | 'reject', published = false) => {
    moderateEventMutation.mutate({ eventId, action, published });
  };

  const events = pendingEvents?.events || [];
  const rsvps = eventRsvps?.rsvps || [];

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Settings className="h-8 w-8 text-[var(--spiral-coral)]" />
              <h1 className="text-4xl font-bold text-[var(--spiral-navy)]">
                Mall Events Administration
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Create, manage, and moderate mall events. Track RSVPs and award SPIRAL points to attendees.
            </p>
          </div>

          <Tabs defaultValue="pending" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pending">Pending Events</TabsTrigger>
              <TabsTrigger value="create">Create Event</TabsTrigger>
              <TabsTrigger value="rsvps">Manage RSVPs</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Pending Events */}
            <TabsContent value="pending" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Events Awaiting Approval</CardTitle>
                  <CardDescription>
                    Review and approve/reject submitted events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingPending ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="animate-pulse h-24 bg-gray-200 rounded-lg"></div>
                      ))}
                    </div>
                  ) : events.length > 0 ? (
                    <div className="space-y-4">
                      {events.map((event: MallEventWithDetails) => (
                        <Card key={event.id} className="border-yellow-200 bg-yellow-50">
                          <CardContent className="p-4">
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
                              <div className="lg:col-span-2">
                                <h4 className="font-semibold text-lg">{event.title}</h4>
                                <p className="text-sm text-gray-600 mb-2">
                                  {event.description.substring(0, 100)}...
                                </p>
                                <div className="flex flex-wrap gap-2 text-xs">
                                  <Badge variant="outline">{event.eventType}</Badge>
                                  <Badge variant="outline">{event.location}</Badge>
                                  <Badge className="bg-[var(--spiral-gold)]/20 text-[var(--spiral-gold)]">
                                    {event.rewardPoints} SPIRALs
                                  </Badge>
                                </div>
                              </div>
                              
                              <div className="space-y-1 text-sm">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {formatDate(new Date(event.startTime), 'MMM d, yyyy')}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatDate(new Date(event.startTime), 'h:mm a')}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  Max {event.maxRsvp} attendees
                                </div>
                              </div>
                              
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleModerate(event.id, 'approve', true)}
                                  disabled={moderateEventMutation.isPending}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve & Publish
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleModerate(event.id, 'reject')}
                                  disabled={moderateEventMutation.isPending}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">All caught up!</h3>
                      <p className="text-gray-500">No events pending approval</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Create Event */}
            <TabsContent value="create" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Mall Event</CardTitle>
                  <CardDescription>
                    Add a new community event to attract shoppers and build engagement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Event Title</FormLabel>
                              <FormControl>
                                <Input placeholder="Holiday Fashion Show & Styling Workshop" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="eventType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Event Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select event type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Fashion">Fashion</SelectItem>
                                  <SelectItem value="Kids">Kids & Family</SelectItem>
                                  <SelectItem value="Technology">Technology</SelectItem>
                                  <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                                  <SelectItem value="Music & Arts">Music & Arts</SelectItem>
                                  <SelectItem value="Health & Wellness">Health & Wellness</SelectItem>
                                  <SelectItem value="Seasonal">Seasonal Event</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="mallId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mall Location</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select mall" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1">Downtown Shopping Center</SelectItem>
                                  <SelectItem value="2">Family Plaza Mall</SelectItem>
                                  <SelectItem value="3">Westside Marketplace</SelectItem>
                                  <SelectItem value="4">Tech District Mall</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Specific Location</FormLabel>
                              <FormControl>
                                <Input placeholder="Main Plaza, Food Court, Community Center" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="startTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Date & Time</FormLabel>
                              <FormControl>
                                <Input type="datetime-local" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="endTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>End Date & Time</FormLabel>
                              <FormControl>
                                <Input type="datetime-local" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="maxRsvp"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Maximum Attendees</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min="1" 
                                  max="500"
                                  {...field} 
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="rewardPoints"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>SPIRAL Reward Points</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min="5" 
                                  max="50"
                                  {...field} 
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Event Image URL (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com/event-image.jpg" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Event Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe the event in detail, including what attendees can expect, any special offers, and why they should attend..."
                                rows={4}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        disabled={createEventMutation.isPending}
                        className="w-full bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/80"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Event (Pending Approval)
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Manage RSVPs */}
            <TabsContent value="rsvps" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Event RSVP Management</CardTitle>
                  <CardDescription>
                    View attendee lists and mark attendance to award SPIRAL points
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Select onValueChange={(value) => setSelectedEventId(Number(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an event to manage" />
                      </SelectTrigger>
                      <SelectContent>
                        {events.filter((event: MallEventWithDetails) => event.isApproved).map((event: MallEventWithDetails) => (
                          <SelectItem key={event.id} value={event.id.toString()}>
                            {event.title} - {formatDate(new Date(event.startTime), 'MMM d, yyyy')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {selectedEventId && rsvps.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold">
                            Attendee List ({rsvps.length} RSVPs)
                          </h4>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Export CSV
                          </Button>
                        </div>

                        <div className="space-y-2">
                          {rsvps.map((rsvp: EventRsvpWithUser) => (
                            <Card key={rsvp.id} className="border">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${
                                      rsvp.status === 'attended' ? 'bg-green-500' : 
                                      rsvp.status === 'confirmed' ? 'bg-blue-500' : 
                                      'bg-gray-400'
                                    }`} />
                                    <div>
                                      <div className="font-medium">
                                        {rsvp.user.firstName} {rsvp.user.lastName}
                                      </div>
                                      <div className="text-sm text-gray-600">
                                        {rsvp.user.email}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-3">
                                    <Badge variant={
                                      rsvp.status === 'attended' ? 'default' :
                                      rsvp.status === 'confirmed' ? 'secondary' :
                                      'outline'
                                    }>
                                      {rsvp.status}
                                    </Badge>
                                    
                                    {rsvp.status === 'confirmed' && (
                                      <Button
                                        size="sm"
                                        onClick={() => markAttendanceMutation.mutate({
                                          eventId: selectedEventId,
                                          userId: rsvp.userId
                                        })}
                                        disabled={markAttendanceMutation.isPending}
                                        className="bg-green-600 hover:bg-green-700"
                                      >
                                        <UserCheck className="h-4 w-4 mr-1" />
                                        Mark Attended
                                      </Button>
                                    )}
                                    
                                    {rsvp.status === 'attended' && rsvp.rewardClaimed && (
                                      <Badge className="bg-[var(--spiral-gold)]/20 text-[var(--spiral-gold)]">
                                        <Zap className="h-3 w-3 mr-1" />
                                        SPIRALs Awarded
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedEventId && rsvps.length === 0 && (
                      <div className="text-center py-8">
                        <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">No RSVPs yet</h3>
                        <p className="text-gray-500">
                          RSVPs will appear here once people start signing up
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-[var(--spiral-navy)] mb-2">
                      {events.length}
                    </div>
                    <div className="text-sm text-gray-600">Total Events Created</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-[var(--spiral-coral)] mb-2">
                      {events.filter((e: MallEventWithDetails) => e.isApproved).length}
                    </div>
                    <div className="text-sm text-gray-600">Approved Events</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-[var(--spiral-gold)] mb-2">
                      {events.reduce((sum: number, e: MallEventWithDetails) => sum + e.currentRsvp, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Total RSVPs</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
}