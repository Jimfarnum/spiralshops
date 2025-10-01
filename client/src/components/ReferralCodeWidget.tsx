import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Users, Copy, Share2, Gift } from 'lucide-react';
import { Link } from 'wouter';

interface ReferralCodeWidgetProps {
  referralCode?: string;
  compact?: boolean;
  className?: string;
}

export default function ReferralCodeWidget({ 
  referralCode = 'SPIRAL2025', 
  compact = false,
  className = ''
}: ReferralCodeWidgetProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: "Referral Code Copied",
      description: "Share it with friends to earn rewards together!",
    });
  };

  const shareReferralLink = () => {
    const link = `${window.location.origin}/signup?ref=${referralCode}`;
    if (navigator.share) {
      navigator.share({
        title: 'Join SPIRAL with my referral code!',
        text: `Sign up for SPIRAL and we'll both earn rewards! Use my referral code: ${referralCode}`,
        url: link
      });
    }
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-2 p-3 bg-gradient-to-r from-purple-50 to-teal-50 rounded-lg border ${className}`}>
        <Users className="w-4 h-4 text-purple-500" />
        <span className="text-sm font-medium">Your code: {referralCode}</span>
        <Button size="sm" variant="outline" onClick={copyReferralCode}>
          <Copy className="w-3 h-3" />
        </Button>
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="w-5 h-5 text-purple-500" />
          Refer Friends & Earn
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 bg-gradient-to-r from-purple-50 to-teal-50 rounded-lg border-2 border-dashed border-purple-200">
          <p className="text-xs text-gray-600 mb-1">Your referral code:</p>
          <p className="text-lg font-bold text-purple-600 font-mono">{referralCode}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 bg-blue-50 rounded text-center">
            <Gift className="w-4 h-4 text-blue-600 mx-auto mb-1" />
            <p className="font-medium text-blue-800">Friend Signs Up</p>
            <p className="text-blue-700">50 + 25 SPIRALs</p>
          </div>
          <div className="p-2 bg-green-50 rounded text-center">
            <Gift className="w-4 h-4 text-green-600 mx-auto mb-1" />
            <p className="font-medium text-green-800">First Purchase</p>
            <p className="text-green-700">50 + 50 SPIRALs</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={copyReferralCode}
            className="flex-1"
          >
            <Copy className="w-3 h-3 mr-1" />
            {copied ? 'Copied!' : 'Copy'}
          </Button>
          <Button
            size="sm"
            onClick={shareReferralLink}
            className="flex-1"
          >
            <Share2 className="w-3 h-3 mr-1" />
            Share
          </Button>
        </div>

        <Link href="/referrals">
          <Button variant="ghost" size="sm" className="w-full text-xs">
            View Full Referral Dashboard
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}