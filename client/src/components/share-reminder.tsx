import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Twitter, Gift } from 'lucide-react';
import SocialSharingEngine from '@/components/social-sharing-engine';

const ShareReminder: React.FC = () => {
  const [showReminder, setShowReminder] = useState(false);

  useEffect(() => {
    // Show reminder after user has been on site for 30 seconds
    const timer = setTimeout(() => {
      const hasSharedBefore = localStorage.getItem('spiral-has-shared');
      if (!hasSharedBefore) {
        setShowReminder(true);
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setShowReminder(false);
    localStorage.setItem('spiral-reminder-dismissed', 'true');
  };

  const handleShared = () => {
    setShowReminder(false);
    localStorage.setItem('spiral-has-shared', 'true');
  };

  if (!showReminder) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="shadow-2xl border-0 bg-gradient-to-r from-[#1DA1F2]/10 to-[var(--spiral-coral)]/10 backdrop-blur-sm">
        <CardContent className="p-6 relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-gray-100 rounded-full"
          >
            <X className="h-3 w-3" />
          </Button>
          
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#1DA1F2] rounded-full flex items-center justify-center">
              <Twitter className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--spiral-navy)] font-['Poppins']">
                Share on X
              </h3>
              <p className="text-xs text-gray-600 font-['Inter']">
                Earn 5 SPIRALs instantly!
              </p>
            </div>
          </div>
          
          <p className="text-sm text-gray-700 mb-4 font-['Inter']">
            Love shopping local? Share your SPIRAL experience on X and inspire others to support their community businesses!
          </p>
          
          <div onClick={handleShared}>
            <SocialSharingEngine
              type="account"
              title="Join me on SPIRAL - supporting local businesses!"
              description="Discovering amazing local businesses and earning rewards with SPIRAL! Every purchase supports real people in our community. 🛍️✨ #SPIRALshops #ShopLocal"
              showEarningsPreview={false}
            />
          </div>
          
          <div className="flex items-center gap-2 mt-3 text-xs text-gray-500 font-['Inter']">
            <Gift className="h-3 w-3" />
            <span>Instant reward • One-time reminder</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShareReminder;