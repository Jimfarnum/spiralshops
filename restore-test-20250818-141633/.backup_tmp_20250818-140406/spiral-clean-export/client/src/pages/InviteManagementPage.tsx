import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Users, Gift, Mail, Check, Clock, Copy, Share2, TrendingUp } from 'lucide-react';
import InviteToShopModal from '@/components/InviteToShopModal';

interface SentInvite {
  id: string;
  guestEmail: string;
  productName?: string;
  accepted: boolean;
  spiralsEarned: number;
  createdAt: string;
}

interface InviteStats {
  totalSent: number;
  totalAccepted: number;
  totalSpiralsEarned: number;
  acceptanceRate: number;
}

export default function InviteManagementPage() {
  const [sentInvites, setSentInvites] = useState<SentInvite[]>([]);
  const [stats, setStats] = useState<InviteStats>({
    totalSent: 0,
    totalAccepted: 0,
    totalSpiralsEarned: 0,
    acceptanceRate: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSentInvites();
  }, []);

  const fetchSentInvites = async () => {
    try {
      const response = await fetch('/api/invites/sent');
      const data = await response.json();
      
      if (data.success) {
        setSentInvites(data.invites);
        setStats({
          totalSent: data.totalSent,
          totalAccepted: data.totalAccepted,
          totalSpiralsEarned: data.totalSpiralsEarned,
          acceptanceRate: data.totalSent > 0 ? (data.totalAccepted / data.totalSent) * 100 : 0
        });
      }
    } catch (error) {
      toast({
        title: "Loading Error",
        description: "Could not load your invite history.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyInviteLink = (inviteId: string) => {
    const link = `${window.location.origin}/invite/${inviteId}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link Copied",
      description: "Invite link copied to clipboard.",
    });
  };

  const shareInvite = (inviteId: string, productName?: string) => {
    const link = `${window.location.origin}/invite/${inviteId}`;
    if (navigator.share) {
      navigator.share({
        title: `Shop ${productName || 'on SPIRAL'} with me!`,
        text: `I found something amazing and we can both get exclusive perks!`,
        url: link
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-teal-600 flex items-center gap-2">
            <Users className="w-8 h-8" />
            Invite Management
          </h1>
          <p className="text-gray-600 mt-2">Track your invites and earn rewards together</p>
        </div>
        <InviteToShopModal 
          trigger={
            <Button className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Send New Invite
            </Button>
          }
        />
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Invites Sent</p>
                <p className="text-2xl font-bold">{stats.totalSent}</p>
              </div>
              <Mail className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Accepted</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalAccepted}</p>
              </div>
              <Check className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">SPIRALs Earned</p>
                <p className="text-2xl font-bold text-orange-600">{stats.totalSpiralsEarned}</p>
              </div>
              <Gift className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Acceptance Rate</p>
                <p className="text-2xl font-bold text-purple-600">{stats.acceptanceRate.toFixed(1)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invite History */}
      <Card>
        <CardHeader>
          <CardTitle>Your Invite History</CardTitle>
          <CardDescription>
            Track the status of your sent invitations and earned rewards
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sentInvites.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No invites sent yet</h3>
              <p className="text-gray-500 mb-4">Start inviting friends to shop and earn rewards together!</p>
              <InviteToShopModal 
                trigger={
                  <Button>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Your First Invite
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="space-y-4">
              {sentInvites.map((invite) => (
                <div key={invite.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                          <Mail className="w-5 h-5 text-teal-600" />
                        </div>
                        <div>
                          <p className="font-medium">{invite.guestEmail}</p>
                          {invite.productName && (
                            <p className="text-sm text-gray-600">{invite.productName}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Sent: {new Date(invite.createdAt).toLocaleDateString()}</span>
                        {invite.accepted ? (
                          <Badge className="bg-green-100 text-green-800">
                            <Check className="w-3 h-3 mr-1" />
                            Accepted
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Clock className="w-3 h-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                        {invite.spiralsEarned > 0 && (
                          <Badge className="bg-orange-100 text-orange-800">
                            +{invite.spiralsEarned} SPIRALs
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyInviteLink(invite.id)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => shareInvite(invite.id, invite.productName)}
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-orange-500" />
            How Invite Rewards Work
          </CardTitle>
          <CardDescription>
            Maximize your earnings by inviting friends to discover SPIRAL
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">1. Send Invite</h4>
              <p className="text-sm text-gray-600">Share products or general invites with friends via email or link</p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">2. Friend Accepts</h4>
              <p className="text-sm text-gray-600">They accept your invite and shop with exclusive perks</p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Gift className="w-6 h-6 text-orange-600" />
              </div>
              <h4 className="font-semibold mb-2">3. Both Earn Rewards</h4>
              <p className="text-sm text-gray-600">You both receive SPIRALs and special discounts</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}