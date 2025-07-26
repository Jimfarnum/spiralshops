import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Calendar, 
  MapPin, 
  Gift, 
  Check, 
  X, 
  Clock,
  Star,
  Heart,
  ShoppingBag
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRoute } from "wouter";

export default function InviteResponse() {
  const [match, params] = useRoute("/invite/:tripId");
  const [tripData, setTripData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [response, setResponse] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseResult, setResponseResult] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (params?.tripId) {
      loadTripData(params.tripId);
    }
  }, [params?.tripId]);

  const loadTripData = async (tripId: string) => {
    try {
      const response = await fetch(`/api/invite/trip/${tripId}`);
      if (response.ok) {
        const data = await response.json();
        setTripData(data);
      } else {
        toast({
          title: "Trip Not Found",
          description: "This shopping trip invitation may have expired or been cancelled.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to load trip data:", error);
      toast({
        title: "Error",
        description: "Failed to load trip details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!response || !guestEmail) {
      toast({
        title: "Missing Information",
        description: "Please provide your email and response",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const submitResponse = await fetch(`/api/invite/respond-invite/${params?.tripId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guestName: guestName || "Guest",
          guestEmail,
          response,
          message,
        }),
      });

      const result = await submitResponse.json();

      if (submitResponse.ok) {
        setResponseResult(result);
        toast({
          title: "Response Sent!",
          description: `You have ${response === 'accept' ? 'accepted' : response === 'decline' ? 'declined' : 'marked as maybe for'} the shopping invitation`,
        });
      } else {
        throw new Error(result.message || "Failed to submit response");
      }
    } catch (error: any) {
      console.error("Response error:", error);
      toast({
        title: "Response Failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p>Loading invitation details...</p>
        </div>
      </div>
    );
  }

  if (!tripData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <X className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Invitation Not Found</h1>
          <p className="text-gray-600">This shopping trip invitation may have expired or been cancelled.</p>
        </div>
      </div>
    );
  }

  if (responseResult) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className={`border-green-200 bg-green-50 ${response === 'decline' ? 'border-gray-200 bg-gray-50' : ''}`}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${response === 'decline' ? 'text-gray-800' : 'text-green-800'}`}>
                {response === 'accept' ? <Check className="w-5 h-5" /> : 
                 response === 'decline' ? <X className="w-5 h-5" /> : 
                 <Clock className="w-5 h-5" />}
                Response Recorded!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Your Response:</p>
                  <p className="capitalize">{responseResult.responseStatus}</p>
                </div>
                <div>
                  <p className="font-medium">Trip Date:</p>
                  <p>{responseResult.tripDetails.date}</p>
                </div>
                <div>
                  <p className="font-medium">Location:</p>
                  <p>{responseResult.tripDetails.location}</p>
                </div>
                <div>
                  <p className="font-medium">Host:</p>
                  <p>{responseResult.tripDetails.hostName}</p>
                </div>
              </div>

              {responseResult.guestBenefits && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Gift className="w-4 h-4" />
                    Your Special Benefits:
                  </h4>
                  <div className="space-y-2">
                    <div className="bg-white p-3 rounded-lg border">
                      <p className="font-medium">Welcome Bonus</p>
                      <p className="text-sm text-gray-600">+{responseResult.guestBenefits.spiralBonus} SPIRALs</p>
                    </div>
                    {responseResult.guestBenefits.sharedDeals?.map((deal: any, index: number) => (
                      <div key={index} className="bg-white p-3 rounded-lg border">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{deal.title}</p>
                            <p className="text-sm text-gray-600">{deal.description}</p>
                          </div>
                          <Badge variant="secondary">{deal.code}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Valid until: {responseResult.guestBenefits.validUntil}
                  </p>
                </div>
              )}

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm">
                  <strong>Trip Status:</strong> {responseResult.totalAccepted} accepted • {responseResult.totalResponded} total responses
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Trip Invitation Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              You're Invited to Shop!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium">Hosted by</p>
                  <p className="text-sm text-gray-600">{tripData.hostName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium">Date</p>
                  <p className="text-sm text-gray-600">{tripData.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 md:col-span-2">
                <MapPin className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-sm text-gray-600">{tripData.location}</p>
                </div>
              </div>
            </div>

            {tripData.upcomingBenefits && (
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Group Benefits Available:
                </h4>
                <div className="text-sm space-y-1">
                  <p>• {tripData.upcomingBenefits.bonusMultiplier}x SPIRAL multiplier</p>
                  <p>• Estimated savings: {tripData.upcomingBenefits.totalSavingsEstimate}</p>
                  <p>• {tripData.upcomingBenefits.exclusiveAccess.join(", ")}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Response Form */}
        <Card>
          <CardHeader>
            <CardTitle>Your Response</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Guest Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="guestName">Your Name</Label>
                  <Input
                    id="guestName"
                    placeholder="Enter your name"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guestEmail">Your Email *</Label>
                  <Input
                    id="guestEmail"
                    type="email"
                    placeholder="Enter your email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Response Options */}
              <div className="space-y-2">
                <Label>Will you join this shopping trip?</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Button
                    type="button"
                    variant={response === 'accept' ? 'default' : 'outline'}
                    onClick={() => setResponse('accept')}
                    className="flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Yes, I'll join!
                  </Button>
                  <Button
                    type="button"
                    variant={response === 'maybe' ? 'default' : 'outline'}
                    onClick={() => setResponse('maybe')}
                    className="flex items-center gap-2"
                  >
                    <Clock className="w-4 h-4" />
                    Maybe
                  </Button>
                  <Button
                    type="button"
                    variant={response === 'decline' ? 'default' : 'outline'}
                    onClick={() => setResponse('decline')}
                    className="flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Can't make it
                  </Button>
                </div>
              </div>

              {/* Optional Message */}
              <div className="space-y-2">
                <Label htmlFor="message">Message to Host (Optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Add a personal message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Benefits Preview */}
              {response === 'accept' && (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="pt-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Heart className="w-4 h-4 text-red-500" />
                      What You'll Get:
                    </h4>
                    <div className="text-sm space-y-1">
                      <p>• +25 Welcome SPIRALs just for joining</p>
                      <p>• 10% off your first purchase today</p>
                      <p>• Double SPIRALs on all purchases</p>
                      <p>• Free gift wrapping on any item</p>
                      <p>• Priority checkout access</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={!response || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                    Sending Response...
                  </>
                ) : (
                  `Send ${response ? response.charAt(0).toUpperCase() + response.slice(1) : 'Response'}`
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Trip Status */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Trip Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
              <div>
                <p className="font-bold text-lg">{tripData.summary.totalInvited}</p>
                <p className="text-gray-600">Invited</p>
              </div>
              <div>
                <p className="font-bold text-lg text-green-600">{tripData.summary.accepted}</p>
                <p className="text-gray-600">Accepted</p>
              </div>
              <div>
                <p className="font-bold text-lg text-red-600">{tripData.summary.declined}</p>
                <p className="text-gray-600">Declined</p>
              </div>
              <div>
                <p className="font-bold text-lg text-yellow-600">{tripData.summary.pending}</p>
                <p className="text-gray-600">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}