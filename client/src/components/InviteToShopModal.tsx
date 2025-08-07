import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Users, Gift, Zap, Mail, Copy, Share2, Heart } from 'lucide-react';

interface InviteToShopModalProps {
  productId?: string;
  productName?: string;
  productPrice?: number;
  retailerName?: string;
  trigger?: React.ReactNode;
}

export default function InviteToShopModal({ 
  productId, 
  productName = "this amazing product",
  productPrice,
  retailerName,
  trigger 
}: InviteToShopModalProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [personalMessage, setPersonalMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [step, setStep] = useState<'compose' | 'sent'>('compose');
  const { toast } = useToast();

  const sharedPerks = {
    spiralsBonus: 25,
    sameDayDiscount: 15,
    earlyAccess: true,
    freeShipping: true
  };

  const sendInvite = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your friend's email address.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          productId,
          personalMessage: personalMessage || `Check out ${productName} on SPIRAL! We'll both get exclusive perks when you shop today.`
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setInviteLink(data.inviteLink);
        setStep('sent');
        toast({
          title: "Invite Sent!",
          description: "Your friend will receive an email with exclusive shopping perks.",
        });
      } else {
        throw new Error(data.error || 'Failed to send invite');
      }
    } catch (error) {
      toast({
        title: "Send Failed",
        description: "Could not send invite. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast({
      title: "Link Copied",
      description: "Invite link copied to clipboard.",
    });
  };

  const shareViaOther = () => {
    if (navigator.share) {
      navigator.share({
        title: `Shop ${productName} with me on SPIRAL!`,
        text: `I found this amazing product and we can both get exclusive perks if you shop today!`,
        url: inviteLink
      });
    }
  };

  const resetModal = () => {
    setStep('compose');
    setEmail('');
    setPersonalMessage('');
    setInviteLink('');
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) {
        setTimeout(resetModal, 300);
      }
    }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Invite Friend
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-orange-500" />
            {step === 'compose' ? 'Invite a Friend to Shop' : 'Invite Sent Successfully!'}
          </DialogTitle>
          <DialogDescription>
            {step === 'compose' 
              ? 'Share exclusive perks and earn rewards together'
              : 'Your friend will receive an email with their special shopping link'
            }
          </DialogDescription>
        </DialogHeader>

        {step === 'compose' ? (
          <div className="space-y-6">
            {/* Shared Perks Preview */}
            <div className="bg-gradient-to-r from-orange-50 to-teal-50 p-4 rounded-lg border">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                Shared Perks for Both of You
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <Badge className="bg-orange-100 text-orange-800">
                    +{sharedPerks.spiralsBonus} SPIRALs
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge className="bg-green-100 text-green-800">
                    {sharedPerks.sameDayDiscount}% Off
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge className="bg-purple-100 text-purple-800">
                    Early Access
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge className="bg-blue-100 text-blue-800">
                    Free Shipping
                  </Badge>
                </div>
              </div>
            </div>

            {/* Product Context */}
            {productName && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Inviting friend to shop:</p>
                <p className="font-medium">{productName}</p>
                {productPrice && <p className="text-sm text-teal-600">${productPrice}</p>}
                {retailerName && <p className="text-sm text-gray-500">{retailerName}</p>}
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Friend's Email Address</label>
              <Input
                type="email"
                placeholder="friend@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Personal Message */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Personal Message (Optional)</label>
              <Textarea
                placeholder={`Hey! I found this amazing ${productName} and thought you'd love it. We'll both get exclusive perks if you shop today - let's save together!`}
                value={personalMessage}
                onChange={(e) => setPersonalMessage(e.target.value)}
                rows={3}
                className="w-full"
              />
            </div>

            {/* Send Button */}
            <Button 
              onClick={sendInvite} 
              disabled={loading || !email}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Sending Invite...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Send Shopping Invite
                </div>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Success Message */}
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-gray-600">
                Your invite has been sent to <strong>{email}</strong> with exclusive perks worth over $50!
              </p>
            </div>

            {/* Invite Link Sharing */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Share Link Directly</label>
              <div className="flex gap-2">
                <Input
                  value={inviteLink}
                  readOnly
                  className="flex-1 bg-gray-50"
                />
                <Button variant="outline" onClick={copyInviteLink}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Additional Sharing Options */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={shareViaOther} className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button onClick={() => setOpen(false)}>
                Done
              </Button>
            </div>

            {/* Perk Reminder */}
            <div className="bg-orange-50 p-3 rounded-lg border">
              <p className="text-sm text-orange-800 font-medium">
                You'll both earn {sharedPerks.spiralsBonus} SPIRALs when your friend shops today!
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}