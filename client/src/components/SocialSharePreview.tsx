import { useState } from 'react';
import { Share2, Facebook, Twitter, LinkIcon, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SocialSharePreviewProps {
  title: string;
  description: string;
  image: string;
  url: string;
  type: 'product' | 'store' | 'mall' | 'general';
  price?: string;
  storeName?: string;
  location?: string;
  spiralReward?: number;
}

export function SocialSharePreview({
  title,
  description,
  image,
  url,
  type,
  price,
  storeName,
  location,
  spiralReward = 5
}: SocialSharePreviewProps) {
  const [copied, setCopied] = useState(false);

  const generateShareText = (platform: 'facebook' | 'twitter' | 'general') => {
    const baseText = {
      product: `🛍️ Found this amazing ${title}${storeName ? ` at ${storeName}` : ''}${location ? ` in ${location}` : ''}! ${price ? `Only $${price}` : ''} #SPIRALshops #ShopLocal`,
      store: `🏪 Check out ${title}${location ? ` in ${location}` : ''}! Supporting local businesses with SPIRAL rewards 🎯 #LocalBusiness #SPIRALshops`,
      mall: `🏬 Discovered ${title}${location ? ` in ${location}` : ''}! So many local stores to explore 🛍️ #ShoppingMall #SPIRALshops #LocalShopping`,
      general: `🌟 Loving SPIRAL - Everything Local. Just for You! 🛍️ Earning rewards while supporting local businesses 🎯 #SPIRALshops #ShopLocal`
    };

    const platformSpecific = {
      facebook: `${baseText[type]} 

💰 Earn ${spiralReward} SPIRAL points for sharing!
🔗 Join the local shopping revolution: ${url}`,
      twitter: `${baseText[type]} 

💰 +${spiralReward} SPIRAL points for sharing!
🔗 ${url}`,
      general: baseText[type]
    };

    return platformSpecific[platform];
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${generateShareText('general')}\n\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareToFacebook = () => {
    const text = encodeURIComponent(generateShareText('facebook'));
    const shareUrl = encodeURIComponent(url);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${text}`, '_blank');
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(generateShareText('twitter'));
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-4">
      {/* Share Preview Card */}
      <Card className="max-w-md">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Share2 className="h-4 w-4 text-blue-600" />
            <CardTitle className="text-sm">Share Preview</CardTitle>
            <Badge variant="secondary" className="text-xs">
              +{spiralReward} SPIRALS
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Preview Image */}
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/api/placeholder/400/200';
              }}
            />
          </div>
          
          {/* Preview Content */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm line-clamp-2">{title}</h3>
            <p className="text-gray-600 text-xs line-clamp-3">{description}</p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>spiralshops.com</span>
              {price && (
                <>
                  <span>•</span>
                  <span className="text-green-600 font-medium">${price}</span>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Share Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={shareToFacebook}
          className="flex items-center gap-2"
        >
          <Facebook className="h-4 w-4 text-blue-600" />
          Facebook
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={shareToTwitter}
          className="flex items-center gap-2"
        >
          <Twitter className="h-4 w-4 text-blue-400" />
          Twitter
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={copyToClipboard}
          className="flex items-center gap-2"
        >
          <LinkIcon className="h-4 w-4" />
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </div>

      {/* Generated Share Text Preview */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Share Message
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm whitespace-pre-line">
              {generateShareText('general')}
            </p>
            <div className="mt-2 pt-2 border-t border-gray-200">
              <p className="text-xs text-blue-600 break-all">{url}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral Tracking Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Share2 className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm text-blue-900">Earn SPIRAL Rewards</h4>
              <p className="text-xs text-blue-700 mt-1">
                Get {spiralReward} SPIRAL points for each share, plus bonus points when friends make purchases through your link!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Quick Share Button Component
export function QuickShareButton({
  title,
  description,
  url,
  type = 'general',
  className = ""
}: {
  title: string;
  description: string;
  url: string;
  type?: 'product' | 'store' | 'mall' | 'general';
  className?: string;
}) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowPreview(!showPreview)}
        className={`flex items-center gap-2 ${className}`}
      >
        <Share2 className="h-4 w-4" />
        Share
        <Badge variant="secondary" className="text-xs ml-1">+5</Badge>
      </Button>
      
      {showPreview && (
        <div className="absolute top-full left-0 z-50 mt-2 p-4 bg-white border rounded-lg shadow-lg min-w-80">
          <SocialSharePreview
            title={title}
            description={description}
            image="/api/placeholder/400/200"
            url={url}
            type={type}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview(false)}
            className="mt-3 w-full"
          >
            Close
          </Button>
        </div>
      )}
    </div>
  );
}