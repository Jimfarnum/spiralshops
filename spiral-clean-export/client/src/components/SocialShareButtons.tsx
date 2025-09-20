// Social Media Share Buttons with Pixel Tracking
import React from 'react';
import { Button } from '@/components/ui/button';
import { Facebook, Twitter, Instagram, Share2 } from 'lucide-react';
import { SocialPixelManager } from '@/utils/socialPixels';

interface SocialShareButtonsProps {
  url?: string;
  title?: string;
  description?: string;
  contentType?: string;
  contentId?: string;
  className?: string;
}

export function SocialShareButtons({
  url = window.location.href,
  title = 'SPIRAL – The Local Shopping Platform',
  description = 'Shop real local stores across the U.S. from one platform',
  contentType = 'website',
  contentId,
  className = ''
}: SocialShareButtonsProps) {
  
  const shareToFacebook = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`;
    SocialPixelManager.trackSocialShare('facebook', contentType, contentId);
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const shareToTwitter = () => {
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}&via=spiralshops`;
    SocialPixelManager.trackSocialShare('twitter', contentType, contentId);
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const shareToTruthSocial = () => {
    const shareUrl = `https://truthsocial.com/share?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
    SocialPixelManager.trackSocialShare('truth_social', contentType, contentId);
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const shareToTikTok = () => {
    // TikTok doesn't have direct URL sharing, so we copy to clipboard
    navigator.clipboard.writeText(`${title} - ${url}`);
    SocialPixelManager.trackSocialShare('tiktok', contentType, contentId);
    alert('Link copied! Share it on TikTok');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    SocialPixelManager.trackSocialShare('clipboard', contentType, contentId);
    alert('Link copied to clipboard!');
  };

  return (
    <div className={`flex gap-2 items-center ${className}`}>
      <span className="text-sm text-gray-600 mr-2">Share:</span>
      
      <Button
        variant="outline"
        size="sm"
        onClick={shareToFacebook}
        className="flex items-center gap-1 hover:bg-blue-50"
      >
        <Facebook className="w-4 h-4 text-blue-600" />
        <span className="hidden sm:inline">Facebook</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={shareToTwitter}
        className="flex items-center gap-1 hover:bg-sky-50"
      >
        <Twitter className="w-4 h-4 text-sky-500" />
        <span className="hidden sm:inline">X</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={shareToTruthSocial}
        className="flex items-center gap-1 hover:bg-red-50"
      >
        <Share2 className="w-4 h-4 text-red-600" />
        <span className="hidden sm:inline">Truth Social</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={shareToTikTok}
        className="flex items-center gap-1 hover:bg-pink-50"
      >
        <Instagram className="w-4 h-4 text-pink-600" />
        <span className="hidden sm:inline">TikTok</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={copyToClipboard}
        className="flex items-center gap-1"
      >
        <Share2 className="w-4 h-4" />
        <span className="hidden sm:inline">Copy</span>
      </Button>
    </div>
  );
}

// Specific share buttons for different content types
export function ProductShareButtons({ 
  productId, 
  productName, 
  productUrl 
}: { 
  productId: string; 
  productName: string; 
  productUrl: string; 
}) {
  return (
    <SocialShareButtons
      url={productUrl}
      title={`Check out ${productName} on SPIRAL`}
      description={`Shop ${productName} from local stores on SPIRAL`}
      contentType="product"
      contentId={productId}
      className="mt-4"
    />
  );
}

export function StoreShareButtons({ 
  storeId, 
  storeName, 
  storeUrl 
}: { 
  storeId: string; 
  storeName: string; 
  storeUrl: string; 
}) {
  return (
    <SocialShareButtons
      url={storeUrl}
      title={`Shop at ${storeName} on SPIRAL`}
      description={`Discover products from ${storeName} and other local stores`}
      contentType="store"
      contentId={storeId}
      className="mt-4"
    />
  );
}