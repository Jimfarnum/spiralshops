import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Share2, 
  Copy, 
  ExternalLink, 
  Gift, 
  Facebook,
  Twitter,
  Instagram,
  Star,
  Heart
} from 'lucide-react';

interface SocialSharingEngineProps {
  type: 'product' | 'store' | 'checkout' | 'mall' | 'account';
  title: string;
  description?: string;
  url?: string;
  storeName?: string;
  productName?: string;
  mallName?: string;
  spiralEarnings?: number;
  showEarningsPreview?: boolean;
}

const SocialSharingEngine: React.FC<SocialSharingEngineProps> = ({
  type,
  title,
  description,
  url,
  storeName,
  productName,
  mallName,
  spiralEarnings,
  showEarningsPreview = true
}) => {
  const { toast } = useToast();
  const [showDialog, setShowDialog] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate sharing templates based on type
  const generateShareMessage = (platform: 'facebook' | 'twitter' | 'instagram') => {
    const baseUrl = url || window.location.href;
    let message = '';
    
    switch (type) {
      case 'product':
        message = platform === 'twitter' 
          ? `Just discovered ${productName} at ${storeName} on SPIRAL! 🛍️✨ Supporting local businesses has never been this rewarding. #SPIRALshops #ShopLocal #LocalBusiness`
          : `I just found an amazing product on SPIRAL! ${productName} from ${storeName} - supporting local businesses and earning rewards! 🛍️✨ Check it out:`;
        break;
      case 'store':
        message = platform === 'twitter'
          ? `Amazing local finds at ${storeName}! 🏪✨ Shopping local with SPIRAL and earning rewards for supporting my community. #SPIRALshops #LocalBusiness #ShopLocal`
          : `Check out this incredible local store I found on SPIRAL: ${storeName}! Supporting local businesses and earning rewards while I shop. 🏪✨`;
        break;
      case 'checkout':
        message = platform === 'twitter'
          ? `Just completed a purchase on SPIRAL and earned ${spiralEarnings || 0} points! 🎉 Supporting local businesses feels so good. #SPIRALshops #ShopLocal #LocalRewards`
          : `I just shopped local with SPIRAL and earned ${spiralEarnings || 0} reward points! 🎉 There's something special about supporting neighborhood businesses. Join me:`;
        break;
      case 'mall':
        message = platform === 'twitter'
          ? `Exploring ${mallName} through SPIRAL! 🏬✨ So many local businesses to discover and support. #SPIRALshops #LocalMall #ShopLocal`
          : `Having a great time exploring ${mallName} on SPIRAL! 🏬 So many amazing local businesses to discover and support. Check it out:`;
        break;
      case 'account':
        message = platform === 'twitter'
          ? `Loving my SPIRAL experience! 🌟 Earning rewards while supporting local businesses in my community. Join me! #SPIRALshops #ShopLocal #LocalRewards`
          : `I'm loving my SPIRAL experience! 🌟 Earning rewards while supporting local businesses in my community. It feels great to shop with purpose!`;
        break;
      default:
        message = platform === 'twitter'
          ? `Discovering amazing local businesses with SPIRAL! 🛍️✨ #SPIRALshops #ShopLocal #LocalBusiness`
          : `Just discovered SPIRAL - an amazing way to find and support local businesses while earning rewards! 🛍️✨`;
    }
    
    return platform === 'instagram' ? message : `${message} ${baseUrl}`;
  };

  const handleShare = async (platform: 'facebook' | 'twitter' | 'instagram') => {
    const message = generateShareMessage(platform);
    const shareUrl = url || window.location.href;
    
    let shareLink = '';
    
    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(message)}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
        break;
      case 'instagram':
        // For Instagram, we'll copy the message and open Instagram
        await navigator.clipboard.writeText(message);
        toast({
          title: "Message copied!",
          description: "Opening Instagram app - paste your message there!",
        });
        window.open('https://www.instagram.com/', '_blank');
        
        // Simulate earning SPIRALs for sharing
        if (showEarningsPreview) {
          setTimeout(() => {
            toast({
              title: "🎉 You earned 5 SPIRALs!",
              description: "Thanks for sharing your SPIRAL experience!",
            });
          }, 1000);
        }
        setShowDialog(false);
        return;
    }
    
    // Open share window
    window.open(shareLink, '_blank', 'width=600,height=400');
    
    // Simulate earning SPIRALs for sharing
    if (showEarningsPreview) {
      setTimeout(() => {
        toast({
          title: "🎉 You earned 5 SPIRALs!",
          description: "Thanks for sharing your SPIRAL experience!",
        });
      }, 1000);
    }
    
    setShowDialog(false);
  };

  const handleCopyLink = async () => {
    const shareUrl = url || window.location.href;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast({
      title: "Link copied!",
      description: "Share this link anywhere you'd like!",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  const getShareButtonText = () => {
    switch (type) {
      case 'product': return 'Share Product';
      case 'store': return 'Share Store';
      case 'checkout': return 'Share Your Purchase';
      case 'mall': return 'Share Mall';
      case 'account': return 'Share Your SPIRAL';
      default: return 'Share';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'product': return <Star className="h-4 w-4" />;
      case 'store': return <Heart className="h-4 w-4" />;
      case 'checkout': return <Gift className="h-4 w-4" />;
      default: return <Share2 className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="border-[var(--spiral-coral)] text-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)] hover:text-white rounded-xl"
        >
          {getIcon()}
          <span className="ml-2">{getShareButtonText()}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[var(--spiral-navy)] font-['Poppins'] flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Your SPIRAL Experience
          </DialogTitle>
          <DialogDescription className="font-['Inter']">
            Share this {type} with your friends and earn 5 SPIRALs for each share!
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {showEarningsPreview && (
            <Card className="bg-gradient-to-r from-[var(--spiral-coral)]/10 to-[var(--spiral-gold)]/10 border-[var(--spiral-coral)]/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[var(--spiral-coral)] rounded-full flex items-center justify-center">
                    <Gift className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--spiral-navy)] font-['Inter']">
                      Earn 5 SPIRALs per share!
                    </p>
                    <p className="text-sm text-gray-600 font-['Inter']">
                      Help spread the word about local businesses
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-3">
            <h4 className="font-semibold text-[var(--spiral-navy)] font-['Poppins']">
              Choose Platform
            </h4>
            
            {/* Facebook Share */}
            <Button
              onClick={() => handleShare('facebook')}
              className="w-full justify-start bg-[#1877F2] hover:bg-[#166FE5] text-white rounded-xl"
            >
              <Facebook className="h-5 w-5 mr-3" />
              Share on Facebook
            </Button>
            
            {/* Twitter Share */}
            <Button
              onClick={() => handleShare('twitter')}
              className="w-full justify-start bg-[#1DA1F2] hover:bg-[#1A8CD8] text-white rounded-xl"
            >
              <Twitter className="h-5 w-5 mr-3" />
              Share on X (Twitter)
            </Button>
            
            {/* Instagram Share */}
            <Button
              onClick={() => handleShare('instagram')}
              className="w-full justify-start bg-gradient-to-r from-[#E4405F] to-[#F56040] hover:from-[#D73653] hover:to-[#E55439] text-white rounded-xl"
            >
              <Instagram className="h-5 w-5 mr-3" />
              Share on Instagram
            </Button>
            
            {/* Copy Link */}
            <Button
              onClick={handleCopyLink}
              variant="outline"
              className="w-full justify-start border-[var(--spiral-sage)] text-[var(--spiral-sage)] hover:bg-[var(--spiral-sage)] hover:text-white rounded-xl"
            >
              <Copy className="h-5 w-5 mr-3" />
              {copied ? 'Link Copied!' : 'Copy Link'}
            </Button>
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-xs text-gray-500 text-center font-['Inter']">
              By sharing, you help support local businesses and earn SPIRALs! 🌟
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SocialSharingEngine;