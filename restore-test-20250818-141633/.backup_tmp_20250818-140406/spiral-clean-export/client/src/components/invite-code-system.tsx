import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Copy, Users, Gift, Trophy, Check, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InviteCodeSystemProps {
  userId?: number;
  userInviteCode?: string;
  totalReferrals?: number;
  referralEarnings?: number;
}

const InviteCodeSystem: React.FC<InviteCodeSystemProps> = ({
  userId = 1,
  userInviteCode,
  totalReferrals = 0,
  referralEarnings = 0
}) => {
  const [inviteCode, setInviteCode] = useState<string>('');
  const [enteredCode, setEnteredCode] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isRedeemingCode, setIsRedeemingCode] = useState(false);
  const { toast } = useToast();

  // Generate unique invite code for user
  useEffect(() => {
    if (userInviteCode) {
      setInviteCode(userInviteCode);
    } else {
      // Generate a unique, non-guessable but shareable code
      const generateCode = () => {
        const prefix = 'spiral';
        const randomPart = Math.random().toString(36).substring(2, 8);
        const suffix = userId.toString().padStart(3, '0');
        return `${prefix}${randomPart}${suffix}`;
      };
      setInviteCode(generateCode());
    }
  }, [userId, userInviteCode]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      toast({
        title: "Invite code copied!",
        description: "Share this code with friends to earn SPIRALs when they sign up and shop.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please manually copy the code: " + inviteCode,
        variant: "destructive",
      });
    }
  };

  const handleRedeemCode = async () => {
    if (!enteredCode.trim()) {
      toast({
        title: "Please enter a code",
        description: "Enter your friend's invite code to earn bonus SPIRALs.",
        variant: "destructive",
      });
      return;
    }

    setIsRedeemingCode(true);
    
    // Simulate API call to redeem invite code
    setTimeout(() => {
      if (enteredCode.toLowerCase().includes('spiral')) {
        toast({
          title: "Code redeemed! 🎉",
          description: "You earned 20 SPIRALs! Start shopping to earn even more rewards.",
        });
        setEnteredCode('');
      } else {
        toast({
          title: "Invalid code",
          description: "Please check the code and try again.",
          variant: "destructive",
        });
      }
      setIsRedeemingCode(false);
    }, 1500);
  };

  const shareInviteCode = () => {
    const message = `Join me on SPIRAL and support local businesses! Use my invite code "${inviteCode}" to get 20 bonus SPIRALs when you sign up. Every purchase helps our community grow! 🛍️✨ #SPIRALshops #ShopLocal`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Join SPIRAL with my invite code!',
        text: message,
        url: window.location.origin
      });
    } else {
      // Fallback to X (Twitter) sharing
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(window.location.origin)}`;
      window.open(twitterUrl, '_blank');
    }
  };

  const getTierBadge = () => {
    if (totalReferrals >= 50) return { name: 'SPIRAL Legend', color: 'bg-purple-100 text-purple-800', icon: '👑' };
    if (totalReferrals >= 25) return { name: 'Community Champion', color: 'bg-gold-100 text-yellow-800', icon: '🏆' };
    if (totalReferrals >= 10) return { name: 'Local Ambassador', color: 'bg-blue-100 text-blue-800', icon: '🌟' };
    if (totalReferrals >= 5) return { name: 'Friend Magnet', color: 'bg-green-100 text-green-800', icon: '🎯' };
    if (totalReferrals >= 1) return { name: 'Community Builder', color: 'bg-orange-100 text-orange-800', icon: '🚀' };
    return { name: 'New Member', color: 'bg-gray-100 text-gray-600', icon: '👋' };
  };

  const tier = getTierBadge();

  return (
    <div className="space-y-6">
      {/* Your Invite Code */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-[var(--spiral-navy)] font-['Poppins'] flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Your Invite Code
          </CardTitle>
          <CardDescription className="font-['Inter']">
            Share your unique code and earn SPIRALs when friends join and shop!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gradient-to-r from-[var(--spiral-coral)]/10 to-[var(--spiral-gold)]/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="font-mono text-2xl font-bold text-[var(--spiral-navy)]">
                {inviteCode}
              </div>
              <Button
                onClick={handleCopyCode}
                variant="outline"
                size="sm"
                className="rounded-xl"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="font-bold text-[var(--spiral-coral)] text-lg">+20</div>
                <div className="text-gray-600">SPIRALs for signup</div>
              </div>
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="font-bold text-[var(--spiral-gold)] text-lg">+50</div>
                <div className="text-gray-600">SPIRALs for first purchase</div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={shareInviteCode}
              className="flex-1 bg-[var(--spiral-navy)] hover:bg-[var(--spiral-coral)] text-white rounded-xl"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Code
            </Button>
            <Button 
              onClick={handleCopyCode}
              variant="outline"
              className="rounded-xl"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Code
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Redeem Invite Code */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-[var(--spiral-navy)] font-['Poppins'] flex items-center gap-2">
            <Users className="h-5 w-5" />
            Have an Invite Code?
          </CardTitle>
          <CardDescription className="font-['Inter']">
            Enter a friend's code to get 20 bonus SPIRALs instantly!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={enteredCode}
              onChange={(e) => setEnteredCode(e.target.value)}
              placeholder="Enter invite code..."
              className="rounded-xl"
              disabled={isRedeemingCode}
            />
            <Button
              onClick={handleRedeemCode}
              disabled={isRedeemingCode || !enteredCode.trim()}
              className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-gold)] text-white rounded-xl px-6"
            >
              {isRedeemingCode ? 'Redeeming...' : 'Redeem'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Referral Stats */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-[var(--spiral-navy)] font-['Poppins'] flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Your Referral Stats
          </CardTitle>
          <CardDescription className="font-['Inter']">
            Track your impact on the SPIRAL community
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold font-['Inter']">Community Status</span>
            <Badge className={tier.color}>
              {tier.icon} {tier.name}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-[var(--spiral-navy)] mb-1 font-['Poppins']">
                {totalReferrals}
              </div>
              <div className="text-sm text-gray-600 font-['Inter']">Friends Referred</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-[var(--spiral-coral)] mb-1 font-['Poppins']">
                {referralEarnings}
              </div>
              <div className="text-sm text-gray-600 font-['Inter']">SPIRALs Earned</div>
            </div>
          </div>

          {/* Progress to Next Tier */}
          {totalReferrals < 50 && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-['Inter']">Progress to next tier</span>
                <span className="font-['Inter']">
                  {totalReferrals}/
                  {totalReferrals < 1 ? 1 : totalReferrals < 5 ? 5 : totalReferrals < 10 ? 10 : totalReferrals < 25 ? 25 : 50}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-[var(--spiral-coral)] h-2 rounded-full transition-all duration-300" 
                  style={{ 
                    width: `${Math.min(100, (totalReferrals / (totalReferrals < 1 ? 1 : totalReferrals < 5 ? 5 : totalReferrals < 10 ? 10 : totalReferrals < 25 ? 25 : 50)) * 100)}%` 
                  }}
                ></div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 rounded-xl p-4 mt-4">
            <h4 className="font-semibold text-[var(--spiral-navy)] mb-2 font-['Poppins']">How It Works</h4>
            <ul className="text-sm space-y-1 font-['Inter']">
              <li>• Share your unique invite code with friends</li>
              <li>• They get 20 SPIRALs when they sign up</li>
              <li>• You get 50 SPIRALs when they make their first purchase</li>
              <li>• Build your community status with more referrals!</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InviteCodeSystem;