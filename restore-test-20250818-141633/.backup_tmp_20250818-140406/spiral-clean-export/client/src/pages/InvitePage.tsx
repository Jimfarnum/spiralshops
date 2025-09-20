import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Gift, Heart, Zap, ShoppingBag, User, Clock, Check } from 'lucide-react';
import { Link } from 'wouter';

interface InviteData {
  id: string;
  hostUserId: string;
  hostName: string;
  guestEmail: string;
  productId?: string;
  productName?: string;
  productPrice?: number;
  productImage?: string;
  retailerName?: string;
  accepted: boolean;
  personalMessage?: string;
  sharedPerks: {
    spiralsBonus: number;
    sameDayDiscount: number;
    earlyAccess: boolean;
    freeShipping: boolean;
  };
  expiresAt: string;
  createdAt: string;
}

export default function InvitePage() {
  const [location, navigate] = useLocation();
  const [invite, setInvite] = useState<InviteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const { toast } = useToast();

  // Extract invite ID from URL
  const inviteId = location.split('/invite/')[1];

  useEffect(() => {
    if (inviteId) {
      fetchInvite();
    }
  }, [inviteId]);

  const fetchInvite = async () => {
    try {
      const response = await fetch(`/api/invite/${inviteId}`);
      const data = await response.json();
      
      if (data.success) {
        setInvite(data.invite);
        setAccepted(data.invite.accepted);
      } else {
        toast({
          title: "Invite Not Found",
          description: "This invite link may be expired or invalid.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Loading Error",
        description: "Could not load invite details.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const acceptInvite = async () => {
    setAccepting(true);
    
    try {
      const response = await fetch(`/api/invite/${inviteId}/accept`, {
        method: 'POST'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAccepted(true);
        toast({
          title: "Invite Accepted!",
          description: "You're all set to start shopping with exclusive perks.",
        });
      } else {
        throw new Error(data.error || 'Failed to accept invite');
      }
    } catch (error) {
      toast({
        title: "Accept Failed",
        description: "Could not accept invite. Please try again.",
        variant: "destructive"
      });
    } finally {
      setAccepting(false);
    }
  };

  const isExpired = invite ? new Date(invite.expiresAt) < new Date() : false;

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      </div>
    );
  }

  if (!invite) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <Card>
          <CardContent className="p-12 text-center">
            <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Invite Not Found</h3>
            <p className="text-gray-500 mb-4">This invite link may be expired or invalid.</p>
            <Link href="/">
              <Button>Explore SPIRAL</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-gradient-to-r from-orange-100 to-teal-100 rounded-full flex items-center justify-center mx-auto">
          <Gift className="w-10 h-10 text-orange-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-teal-600 mb-2">
            You've Been Invited to Shop!
          </h1>
          <p className="text-gray-600">
            <strong>{invite.hostName}</strong> has invited you to discover amazing deals on SPIRAL
          </p>
        </div>
      </div>

      {/* Personal Message */}
      {invite.personalMessage && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-teal-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Message from {invite.hostName}:</p>
                <p className="text-gray-900 italic">"{invite.personalMessage}"</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Product Context */}
      {invite.productId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Featured Product
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              {invite.productImage && (
                <img
                  src={invite.productImage}
                  alt={invite.productName}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h4 className="font-semibold text-lg">{invite.productName}</h4>
                {invite.retailerName && (
                  <p className="text-sm text-gray-600">{invite.retailerName}</p>
                )}
                {invite.productPrice && (
                  <p className="text-xl font-bold text-teal-600 mt-1">
                    ${invite.productPrice}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Shared Perks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Exclusive Perks for Both of You
          </CardTitle>
          <CardDescription>
            These amazing benefits activate when you both shop today
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Gift className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="font-medium">SPIRALS Bonus</p>
                <p className="text-sm text-gray-600">+{invite.sharedPerks.spiralsBonus} points each</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Zap className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Same-Day Discount</p>
                <p className="text-sm text-gray-600">{invite.sharedPerks.sameDayDiscount}% off your order</p>
              </div>
            </div>

            {invite.sharedPerks.freeShipping && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Free Shipping</p>
                  <p className="text-sm text-gray-600">No delivery fees today</p>
                </div>
              </div>
            )}

            {invite.sharedPerks.earlyAccess && (
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Early Access</p>
                  <p className="text-sm text-gray-600">Shop exclusive deals first</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Expiration Notice */}
      {!isExpired && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-orange-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">
                Offer expires: {new Date(invite.expiresAt).toLocaleDateString()} at {new Date(invite.expiresAt).toLocaleTimeString()}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <Card>
        <CardContent className="p-6">
          {isExpired ? (
            <div className="text-center space-y-4">
              <p className="text-gray-600">This invite has expired, but you can still explore SPIRAL!</p>
              <Link href="/products">
                <Button className="w-full">Browse Products</Button>
              </Link>
            </div>
          ) : accepted ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-green-600 font-medium">Invite accepted! Start shopping to unlock your perks.</p>
              <div className="grid md:grid-cols-2 gap-3">
                {invite.productId ? (
                  <Link href={`/product/${invite.productId}`}>
                    <Button className="w-full">
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Shop This Product
                    </Button>
                  </Link>
                ) : null}
                <Link href="/products">
                  <Button variant="outline" className="w-full">
                    Browse All Products
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Button
                onClick={acceptInvite}
                disabled={accepting}
                className="w-full h-12 text-lg"
                size="lg"
              >
                {accepting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Accepting Invite...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Accept Invite & Start Shopping
                  </div>
                )}
              </Button>
              
              <div className="text-center">
                <Link href="/products">
                  <Button variant="ghost" className="text-gray-600">
                    Just browse products instead
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}