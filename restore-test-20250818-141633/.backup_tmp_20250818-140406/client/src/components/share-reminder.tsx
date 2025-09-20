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
    <div className="fixed bottom-4 right-4 z-40 max-w-xs">
      <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
        <CardContent className="p-3 relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="absolute top-1 right-1 h-5 w-5 p-0 hover:bg-gray-100 rounded-full"
          >
            <X className="h-3 w-3" />
          </Button>
          
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-[#1DA1F2] rounded-full flex items-center justify-center">
              <Twitter className="h-3 w-3 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-[var(--spiral-navy)] font-['Poppins']">
                Share on X
              </h3>
              <p className="text-xs text-gray-500 font-['Inter']">
                +5 SPIRALs
              </p>
            </div>
          </div>
          
          <div onClick={handleShared}>
            <SocialSharingEngine
              type="account"
              title="Join me on SPIRAL - supporting local businesses!"
              description="Discovering amazing local businesses and earning rewards with SPIRAL! Every purchase supports real people in our community. 🛍️✨ #SPIRALshops #ShopLocal"
              showEarningsPreview={false}
            />
          </div>
          

        </CardContent>
      </Card>
    </div>
  );
};

export default ShareReminder;