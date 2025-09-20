import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import LegalConsentCheckbox from "./LegalConsentCheckbox";
import { useConsentManager } from "@/hooks/useConsentManager";

interface LegalConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: "retailer" | "mall" | "shopper" | "admin";
  userId: string;
  onConsentCompleted?: () => void;
  title?: string;
  description?: string;
  blockingModal?: boolean; // Prevents closing until consent is given
}

export default function LegalConsentModal({
  isOpen,
  onClose,
  role,
  userId,
  onConsentCompleted,
  title,
  description,
  blockingModal = false
}: LegalConsentModalProps) {
  const [consentGiven, setConsentGiven] = useState(false);
  const { currentVersions } = useConsentManager({ userId, userRole: role });

  const handleConsentRecorded = (consentData: any) => {
    setConsentGiven(true);
    onConsentCompleted?.();
    
    // Auto-close after a brief delay if not blocking
    if (!blockingModal) {
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  const handleClose = () => {
    if (blockingModal && !consentGiven) {
      return; // Prevent closing if blocking and no consent given
    }
    onClose();
  };

  const getDefaultTitle = () => {
    switch (role) {
      case "retailer":
        return "Retailer Legal Agreement Required";
      case "mall":
        return "Mall Operator Legal Agreement Required";
      case "shopper":
        return "Legal Agreement Required";
      default:
        return "Legal Agreement Required";
    }
  };

  const getDefaultDescription = () => {
    switch (role) {
      case "retailer":
        return "To continue setting up your store on SPIRAL, please review and agree to our legal terms.";
      case "mall":
        return "To continue managing your mall on SPIRAL, please review and agree to our legal terms.";
      case "shopper":
        return "To create your account and start shopping, please review and agree to our terms.";
      default:
        return "Please review and agree to our legal terms to continue.";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {title || getDefaultTitle()}
            {!blockingModal && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {description && (
            <p className="text-gray-700 mb-6">
              {description || getDefaultDescription()}
            </p>
          )}

          <LegalConsentCheckbox
            role={role}
            userId={userId}
            onConsentRecorded={handleConsentRecorded}
            required={true}
            className="w-full"
          />

          {blockingModal && !consentGiven && (
            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded">
              <p className="text-sm text-orange-800">
                <strong>Required:</strong> You must agree to the legal terms to continue using SPIRAL.
              </p>
            </div>
          )}

          {consentGiven && (
            <div className="mt-4 text-center">
              <p className="text-green-700 font-medium">
                ✓ Thank you! Your consent has been recorded.
              </p>
              {!blockingModal && (
                <p className="text-sm text-gray-600 mt-1">
                  This dialog will close automatically...
                </p>
              )}
            </div>
          )}

          {blockingModal && consentGiven && (
            <div className="mt-4 text-center">
              <Button 
                onClick={onClose}
                className="bg-green-600 hover:bg-green-700"
              >
                Continue to SPIRAL
              </Button>
            </div>
          )}
        </div>

        {currentVersions && (
          <div className="text-xs text-gray-500 border-t pt-3">
            Legal documents effective as of {currentVersions.effectiveDate}. 
            Minnesota LLC compliance with E-SIGN/UETA, MCDPA, CCPA, and GDPR.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}