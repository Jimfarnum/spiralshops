import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Share2, Twitter, Facebook, Link as LinkIcon, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SocialShareProps {
  context?: 'product' | 'order' | 'experience';
  productName?: string;
  orderNumber?: string;
  customMessage?: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ 
  context = 'experience',
  productName,
  orderNumber,
  customMessage 
}) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const getShareMessage = () => {
    if (customMessage) return customMessage;
    
    switch (context) {
      case 'product':
        return `Just discovered this amazing ${productName} from a local retailer on SPIRAL! Check out your community's hidden gems 🏪 #ShopLocal #SPIRALshops`;
      case 'order':
        return `Just completed my SPIRAL order ${orderNumber}! Supporting local retailers has never been easier 🛍️ #ShopLocal #SPIRALshops`;
      default:
        return `I just supported local retailers with SPIRAL — discover your community's hidden gems! #ShopLocal #SPIRALshops`;
    }
  };

  const shareMessage = getShareMessage();
  const spiralUrl = 'https://spiral.local'; // This would be the actual domain

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}&url=${encodeURIComponent(spiralUrl)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  };

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(spiralUrl)}&quote=${encodeURIComponent(shareMessage)}`;
    window.open(facebookUrl, '_blank', 'width=580,height=296');
  };

  const copyLink = async () => {
    const shareText = `${shareMessage}\n\n${spiralUrl}`;
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Share message copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please copy the link manually.",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-gradient-to-r from-[var(--spiral-sage)]/20 to-[var(--spiral-coral)]/20 border-[var(--spiral-sage)]/30 hover:from-[var(--spiral-sage)]/30 hover:to-[var(--spiral-coral)]/30">
          <Share2 className="h-4 w-4 mr-2" />
          Share Experience
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[var(--spiral-navy)] font-['Poppins']">Share Your SPIRAL Experience</DialogTitle>
          <DialogDescription className="font-['Inter']">
            Help spread the word about supporting local retailers!
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Preview Message */}
          <div className="bg-[var(--spiral-sage)]/10 rounded-lg p-4 border border-[var(--spiral-sage)]/20">
            <p className="text-sm text-[var(--spiral-navy)] font-['Inter']">
              {shareMessage}
            </p>
          </div>

          {/* Share Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={shareOnTwitter}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
            >
              <Twitter className="h-4 w-4 mr-2" />
              Share on X (Twitter)
            </Button>

            <Button 
              onClick={shareOnFacebook}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              <Facebook className="h-4 w-4 mr-2" />
              Share on Facebook
            </Button>

            <Button 
              onClick={copyLink}
              variant="outline"
              className="w-full rounded-lg"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Copy SPIRAL Link
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center font-['Inter']">
            Every share helps build stronger local communities! 🌟
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SocialShare;