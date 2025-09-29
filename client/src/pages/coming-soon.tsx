import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Gift, Truck } from 'lucide-react';
import { Link } from 'wouter';

const ComingSoonPage = ({ title, description, icon: Icon }: {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}) => (
  <div className="min-h-screen bg-gray-50 py-12">
    <div className="max-w-2xl mx-auto px-4">
      <Link href="/">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </Link>
      
      <Card className="text-center">
        <CardHeader className="pb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <Icon className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl mb-2">{title}</CardTitle>
          <p className="text-gray-600">{description}</p>
        </CardHeader>
        <CardContent>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">
              🚧 This feature is coming soon! We're working hard to bring you the best local shopping experience.
            </p>
          </div>
          <Link href="/">
            <Button>
              Explore Available Features
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  </div>
);

export const ExploreSPIRALsPage = () => (
  <ComingSoonPage
    title="Explore SPIRALs"
    description="Discover all the ways to earn and redeem SPIRAL points in your local community"
    icon={Star}
  />
);

export const RedeemSPIRALsPage = () => (
  <ComingSoonPage
    title="Redeem SPIRALs"
    description="Use your SPIRAL points for exclusive rewards and discounts at local businesses"
    icon={Gift}
  />
);

export const LoyaltyProgramPage = () => (
  <ComingSoonPage
    title="Loyalty Program"
    description="Join our comprehensive loyalty program and earn rewards with every purchase"
    icon={Star}
  />
);

export const DeliveryOptionsPage = () => (
  <ComingSoonPage
    title="Delivery Options"
    description="Flexible delivery and pickup options for your local shopping needs"
    icon={Truck}
  />
);

// Default export for router lazy loading
const ComingSoon = () => (
  <ComingSoonPage
    title="Coming Soon"
    description="Exciting new features are on the way! Stay tuned for updates."
    icon={Star}
  />
);

export default ComingSoon;