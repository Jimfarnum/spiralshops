import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Users, Gift } from "lucide-react";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to SPIRAL!",
      content: (
        <div className="text-center">
          <div className="text-6xl mb-4">🌟</div>
          <h3 className="text-xl font-semibold text-[var(--spiral-navy)] mb-3">
            Everything Local. Just for You.
          </h3>
          <p className="text-gray-600 mb-6">
            Join thousands of shoppers supporting local businesses while earning amazing rewards.
          </p>
        </div>
      )
    },
    {
      title: "Earn SPIRALs Every Purchase",
      content: (
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[var(--spiral-coral)] to-[var(--spiral-gold)] rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-[var(--spiral-navy)] mb-3">
            Earn Rewards on Every Purchase
          </h3>
          <p className="text-gray-600 mb-4">
            Get 5 SPIRALs per $100 spent online, 10 SPIRALs per $100 in-store
          </p>
          <div className="bg-[var(--spiral-cream)] rounded-lg p-4">
            <p className="text-sm text-[var(--spiral-navy)] font-medium">
              💰 Double Value: SPIRALs earned online are worth 2x when redeemed in physical stores!
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Share & Earn More",
      content: (
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[var(--spiral-sage)] to-[var(--spiral-coral)] rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-[var(--spiral-navy)] mb-3">
            Grow Your Community
          </h3>
          <div className="space-y-3 text-gray-600">
            <p>📱 Share experiences: +5 SPIRALs per social post</p>
            <p>👥 Invite friends: +20 SPIRALs when they sign up</p>
            <p>🛍️ First purchase bonus: +50 SPIRALs for referrals</p>
          </div>
        </div>
      )
    },
    {
      title: "Flexible Pickup Options",
      content: (
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[var(--spiral-navy)] to-[var(--spiral-gold)] rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-[var(--spiral-navy)] mb-3">
            Choose Your Fulfillment
          </h3>
          <div className="space-y-2 text-gray-600">
            <p>🏪 <strong>In-Store Pickup:</strong> Ready today, earn double SPIRALs</p>
            <p>🚚 <strong>Ship to Me:</strong> Standard delivery to your door</p>
            <p>🏬 <strong>Ship to Mall:</strong> Convenient SPIRAL Center pickup</p>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-[var(--spiral-navy)]">
            {steps[currentStep].title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-6">
          {steps[currentStep].content}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex space-x-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep 
                    ? 'bg-[var(--spiral-coral)]' 
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                className="border-gray-300 text-gray-600"
              >
                Back
              </Button>
            )}
            <Button 
              onClick={handleNext}
              className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90 text-white"
            >
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}