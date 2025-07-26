import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Users, 
  Calendar as CalendarIcon, 
  MapPin, 
  Gift, 
  Plus, 
  X,
  Send,
  Heart,
  Star,
  ShoppingBag,
  Clock
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function InviteToShop() {
  const [date, setDate] = useState<Date>();
  const [location, setLocation] = useState("");
  const [invitees, setInvitees] = useState([""]);
  const [personalMessage, setPersonalMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inviteResult, setInviteResult] = useState<any>(null);
  const { toast } = useToast();

  const addInvitee = () => {
    if (invitees.length < 2) {
      setInvitees([...invitees, ""]);
    }
  };

  const removeInvitee = (index: number) => {
    if (invitees.length > 1) {
      setInvitees(invitees.filter((_, i) => i !== index));
    }
  };

  const updateInvitee = (index: number, email: string) => {
    const newInvitees = [...invitees];
    newInvitees[index] = email;
    setInvitees(newInvitees);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !location || !invitees.some(email => email.trim())) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/invite/invite-trip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "user_123", // In real app, get from auth
          shopperName: "SPIRAL Shopper", // In real app, get from user profile
          date: format(date, "yyyy-MM-dd"),
          location,
          invitees: invitees.filter(email => email.trim()),
          personalMessage,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setInviteResult(result);
        toast({
          title: "Invites Sent!",
          description: `Successfully sent ${result.invitesSent?.length || 0} invitations`,
        });
      } else {
        throw new Error(result.message || "Failed to send invites");
      }
    } catch (error: any) {
      console.error("Invite error:", error);
      toast({
        title: "Invite Failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (inviteResult) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Gift className="w-5 h-5" />
                Shopping Trip Invites Sent!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Trip Date:</p>
                  <p>{inviteResult.tripDetails.date}</p>
                </div>
                <div>
                  <p className="font-medium">Location:</p>
                  <p>{inviteResult.tripDetails.location}</p>
                </div>
                <div>
                  <p className="font-medium">Invites Sent:</p>
                  <p>{inviteResult.invitesSent?.length || 0}</p>
                </div>
                <div>
                  <p className="font-medium">Trip ID:</p>
                  <p className="font-mono text-xs">{inviteResult.tripId}</p>
                </div>
              </div>

              {inviteResult.specialDeals && (
                <div>
                  <h4 className="font-medium mb-2">Your Special Deals:</h4>
                  <div className="space-y-2">
                    {inviteResult.specialDeals.map((deal: any, index: number) => (
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
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setInviteResult(null);
                    setDate(undefined);
                    setLocation("");
                    setInvitees([""]);
                    setPersonalMessage("");
                  }}
                  variant="outline"
                >
                  Plan Another Trip
                </Button>
                <Button onClick={() => window.location.href = `/trip/${inviteResult.tripId}`}>
                  View Trip Status
                </Button>
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
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Invite Friends to Shop</h1>
          <p className="text-gray-600 mb-6">
            Plan a shopping trip and invite up to 2 friends. Everyone gets special deals when they join!
          </p>
          <div className="flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Social Shopping</span>
            </div>
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-green-600" />
              <span>Exclusive Deals</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-600" />
              <span>Bonus SPIRALs</span>
            </div>
          </div>
        </div>

        {/* Invite Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Plan Your Shopping Trip
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date Selection */}
              <div className="space-y-2">
                <Label>Shopping Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Shopping Location *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="location"
                    placeholder="Mall name, store, or area"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Invitees */}
              <div className="space-y-2">
                <Label>Invite Friends (up to 2)</Label>
                <div className="space-y-3">
                  {invitees.map((email, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        type="email"
                        placeholder={`Friend ${index + 1} email address`}
                        value={email}
                        onChange={(e) => updateInvitee(index, e.target.value)}
                        className="flex-1"
                      />
                      {invitees.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeInvitee(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  
                  {invitees.length < 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addInvitee}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Another Friend
                    </Button>
                  )}
                </div>
              </div>

              {/* Personal Message */}
              <div className="space-y-2">
                <Label htmlFor="message">Personal Message (Optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Add a personal note to your invitation..."
                  value={personalMessage}
                  onChange={(e) => setPersonalMessage(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Benefits Preview */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Gift className="w-4 h-4" />
                    What Everyone Gets:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span>You: Extra SPIRALs for hosting</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-500" />
                      <span>Friends: Welcome bonus + deals</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>Everyone: Exclusive group discounts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-500" />
                      <span>All: Priority checkout access</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                    Sending Invites...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Invitations
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-medium mb-2">1. Plan Your Trip</h4>
                <p className="text-gray-600">Choose date, location, and invite friends</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Send className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-medium mb-2">2. Friends Respond</h4>
                <p className="text-gray-600">They get email invites with special deals</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Gift className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-medium mb-2">3. Shop & Save</h4>
                <p className="text-gray-600">Everyone enjoys exclusive group benefits</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}