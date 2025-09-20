import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Share2, Gift } from 'lucide-react';

interface SocialRewardsNavigationProps {
  className?: string;
  showBadge?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
}

const SocialRewardsNavigation: React.FC<SocialRewardsNavigationProps> = ({ 
  className = '',
  showBadge = true,
  variant = 'default'
}) => {
  return (
    <Link to="/social-rewards">
      <Button 
        variant={variant}
        className={`relative ${className}`}
      >
        <Share2 className="w-4 h-4 mr-2" />
        Social Rewards
        {showBadge && (
          <Badge className="ml-2 bg-yellow-500 text-white">
            <Trophy className="w-3 h-3 mr-1" />
            NEW
          </Badge>
        )}
      </Button>
    </Link>
  );
};

export default SocialRewardsNavigation;