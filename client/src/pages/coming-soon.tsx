import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { ArrowLeft, Sparkles } from 'lucide-react';

interface ComingSoonPageProps {
  title: string;
  subtitle: string;
  buttonText?: string;
  buttonLink?: string;
}

export function ComingSoonPage({ 
  title, 
  subtitle, 
  buttonText = "Back to Home", 
  buttonLink = "/" 
}: ComingSoonPageProps) {
  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <div className="bg-white rounded-3xl shadow-lg p-12 max-w-md w-full">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[var(--spiral-navy)] to-[var(--spiral-coral)] rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-[var(--spiral-navy)] mb-4 font-['Poppins']">
            {title}
          </h1>
          
          <p className="text-lg text-gray-600 mb-8 leading-relaxed font-['Inter']">
            {subtitle}
          </p>
          
          <div className="space-y-4">
            <Link href={buttonLink}>
              <Button 
                size="lg" 
                className="w-full bg-[var(--spiral-navy)] hover:bg-[var(--spiral-sage)] text-white h-12 text-lg font-semibold rounded-2xl transition-all duration-300"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                {buttonText}
              </Button>
            </Link>
            
            <Link href="/products">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full border-[var(--spiral-navy)] text-[var(--spiral-navy)] hover:bg-[var(--spiral-navy)] hover:text-white h-12 text-lg rounded-2xl transition-all duration-300"
              >
                Explore Products
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

// Specific page components
export function ExploreSPIRALsPage() {
  return (
    <ComingSoonPage
      title="Explore SPIRALs"
      subtitle="Discover unique local experiences and hidden gems in your neighborhood. This exciting feature is launching soon!"
    />
  );
}

export function RedeemSPIRALsPage() {
  return (
    <ComingSoonPage
      title="Redeem SPIRALs"
      subtitle="Use your SPIRAL points to unlock exclusive perks and local experiences. Stay tuned for amazing rewards!"
    />
  );
}

export function LoyaltyProgramPage() {
  return (
    <ComingSoonPage
      title="SPIRAL Rewards"
      subtitle="Join our loyalty program to earn points with every purchase and unlock exclusive benefits from local businesses."
    />
  );
}

export function DeliveryOptionsPage() {
  return (
    <ComingSoonPage
      title="Delivery Options"
      subtitle="Choose from multiple fulfillment methods including same-day delivery, in-store pickup, and ship-to-store options."
    />
  );
}