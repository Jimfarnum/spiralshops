import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Shield } from "lucide-react";
import LegalLinks from "./LegalLinks";

interface ConsentBannerProps {
  onAccept?: () => void;
  onDismiss?: () => void;
  visible?: boolean;
}

export default function ConsentBanner({ onAccept, onDismiss, visible = true }: ConsentBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (!visible || isDismissed) return null;

  const handleAccept = () => {
    onAccept?.();
    setIsDismissed(true);
  };

  const handleDismiss = () => {
    onDismiss?.();
    setIsDismissed(true);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 sm:left-6 sm:right-6 lg:left-auto lg:right-6 lg:max-w-md">
      <Card className="border-blue-200 bg-blue-50 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 text-sm mb-2">
                  Privacy & Legal Notice
                </h3>
                <p className="text-xs text-blue-800 mb-3">
                  We use cookies and collect data to enhance your experience. 
                  By continuing, you agree to our legal terms.
                </p>
                <div className="mb-3">
                  <LegalLinks />
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={handleAccept}
                    className="bg-blue-600 hover:bg-blue-700 text-xs"
                  >
                    Accept
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleDismiss}
                    className="border-blue-300 text-blue-700 text-xs"
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-blue-600 hover:text-blue-800 ml-2"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}