import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Calendar, 
  MapPin, 
  Clock, 
  Check, 
  X, 
  Plus, 
  Eye,
  Gift,
  Star
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface Trip {
  tripId: string;
  hostName: string;
  date: string;
  location: string;
  status: string;
  responseCount?: number;
  acceptedCount?: number;
  userResponse?: string;
  invitees?: string[];
  responses?: any[];
}

export default function MyTrips() {
  const [hostedTrips, setHostedTrips] = useState<Trip[]>([]);
  const [guestTrips, setGuestTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadUserTrips();
  }, []);

  const loadUserTrips = async () => {
    try {
      // In real app, get userId from auth
      const response = await fetch("/api/invite/user-trips/user123");
      if (response.ok) {
        const data = await response.json();
        setHostedTrips(data.hostedTrips || []);
        setGuestTrips(data.guestTrips || []);
      } else {
        throw new Error("Failed to load trips");
      }
    } catch (error) {
      console.error("Load trips error:", error);
      toast({
        title: "Error",
        description: "Failed to load your trips",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (trip: Trip) => {
    if (trip.userResponse) {
      // Guest trip
      switch (trip.userResponse) {
        case 'accept':
          return <Badge className="bg-green-100 text-green-800">Accepted</Badge>;
        case 'decline':
          return <Badge className="bg-red-100 text-red-800">Declined</Badge>;
        case 'maybe':
          return <Badge className="bg-yellow-100 text-yellow-800">Maybe</Badge>;
        default:
          return <Badge variant="outline">Pending</Badge>;
      }
    } else {
      // Hosted trip
      const isPast = new Date(trip.date) < new Date();
      if (isPast) {
        return <Badge variant="secondary">Completed</Badge>;
      }
      return <Badge className="bg-blue-100 text-blue-800">Active</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p>Loading your trips...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Shopping Trips</h1>
            <p className="text-gray-600">Manage your hosted trips and respond to invitations</p>
          </div>
          <Button onClick={() => window.location.href = "/invite-to-shop"}>
            <Plus className="w-4 h-4 mr-2" />
            Plan New Trip
          </Button>
        </div>

        <Tabs defaultValue="hosted" className="space-y-6">
          <TabsList>
            <TabsTrigger value="hosted">
              Trips I'm Hosting ({hostedTrips.length})
            </TabsTrigger>
            <TabsTrigger value="invited">
              Trips I'm Invited To ({guestTrips.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hosted" className="space-y-6">
            {hostedTrips.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Hosted Trips Yet</h3>
                  <p className="text-gray-600 mb-4">
                    Start planning your first shopping trip with friends!
                  </p>
                  <Button onClick={() => window.location.href = "/invite-to-shop"}>
                    <Plus className="w-4 h-4 mr-2" />
                    Plan Your First Trip
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hostedTrips.map((trip) => (
                  <Card key={trip.tripId} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{trip.location}</CardTitle>
                        {getStatusBadge(trip)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {formatDate(trip.date)}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-center p-2 bg-blue-50 rounded">
                          <p className="font-semibold text-blue-800">{trip.invitees?.length || 0}</p>
                          <p className="text-blue-600">Invited</p>
                        </div>
                        <div className="text-center p-2 bg-green-50 rounded">
                          <p className="font-semibold text-green-800">{trip.acceptedCount || 0}</p>
                          <p className="text-green-600">Accepted</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {trip.responses?.slice(0, 3).map((response, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            {response.response === 'accept' ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : response.response === 'decline' ? (
                              <X className="w-4 h-4 text-red-600" />
                            ) : (
                              <Clock className="w-4 h-4 text-yellow-600" />
                            )}
                            <span className="truncate">{response.guestName}</span>
                          </div>
                        ))}
                        {(trip.responses?.length || 0) > 3 && (
                          <p className="text-xs text-gray-500">
                            +{(trip.responses?.length || 0) - 3} more responses
                          </p>
                        )}
                      </div>

                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => window.location.href = `/trip/${trip.tripId}`}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="invited" className="space-y-6">
            {guestTrips.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Invitations</h3>
                  <p className="text-gray-600">
                    You haven't received any shopping trip invitations yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guestTrips.map((trip) => (
                  <Card key={trip.tripId} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{trip.location}</CardTitle>
                        {getStatusBadge(trip)}
                      </div>
                      <p className="text-sm text-gray-600">Hosted by {trip.hostName}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {formatDate(trip.date)}
                      </div>

                      {trip.userResponse === 'accept' && (
                        <div className="bg-green-50 p-3 rounded-lg">
                          <h4 className="font-medium text-green-800 mb-1 flex items-center gap-2">
                            <Star className="w-4 h-4" />
                            Your Benefits
                          </h4>
                          <div className="text-sm text-green-700 space-y-1">
                            <p>• +25 Welcome SPIRALs</p>
                            <p>• 10% off first purchase</p>
                            <p>• Double SPIRALs on all purchases</p>
                          </div>
                        </div>
                      )}

                      {trip.userResponse === 'pending' && (
                        <div className="bg-yellow-50 p-3 rounded-lg">
                          <p className="text-sm text-yellow-800">
                            ⏰ Response needed - special deals are waiting!
                          </p>
                        </div>
                      )}

                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => window.location.href = `/invite/${trip.tripId}`}
                      >
                        {trip.userResponse === 'pending' ? 'Respond to Invite' : 'View Details'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Quick Stats */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Your Social Shopping Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">{hostedTrips.length}</p>
                <p className="text-sm text-gray-600">Trips Hosted</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {hostedTrips.reduce((sum, trip) => sum + (trip.acceptedCount || 0), 0)}
                </p>
                <p className="text-sm text-gray-600">Friends Joined</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">{guestTrips.length}</p>
                <p className="text-sm text-gray-600">Invites Received</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">
                  {guestTrips.filter(trip => trip.userResponse === 'accept').length}
                </p>
                <p className="text-sm text-gray-600">Trips Joined</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}