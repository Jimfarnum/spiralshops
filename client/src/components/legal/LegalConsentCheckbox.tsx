import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, ExternalLink, CheckCircle } from "lucide-react";
import { useConsentManager } from "@/hooks/useConsentManager";
import { useToast } from "@/hooks/use-toast";

interface LegalConsentCheckboxProps {
  role: "retailer" | "mall" | "shopper" | "admin";
  userId: string;
  onConsentRecorded?: (consentData: any) => void;
  required?: boolean;
  compact?: boolean;
  className?: string;
}

export default function LegalConsentCheckbox({ 
  role, 
  userId, 
  onConsentRecorded, 
  required = false,
  compact = false,
  className = "" 
}: LegalConsentCheckboxProps) {
  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConsentRecorded, setIsConsentRecorded] = useState(false);
  const { currentVersions, recordConsent } = useConsentManager({ userId, userRole: role });
  const { toast } = useToast();

  const handleConsentChange = (checked: boolean) => {
    setIsChecked(checked);
  };

  const handleRecordConsent = async () => {
    if (!isChecked) {
      toast({
        title: "Consent Required",
        description: "Please check the consent box to proceed.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const consentData = await recordConsent(userId, role);
      setIsConsentRecorded(true);
      onConsentRecorded?.(consentData);
    } catch (error) {
      console.error("Failed to record consent:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleSpecificText = () => {
    switch (role) {
      case "retailer":
        return {
          title: "Retailer Agreement",
          description: "I agree to the merchant terms, privacy policy, and platform requirements for selling on SPIRAL.",
          benefits: ["Access to SPIRAL marketplace", "Payment processing", "Inventory management tools", "Customer analytics"]
        };
      case "mall":
        return {
          title: "Mall Operator Agreement", 
          description: "I agree to the mall operator terms, privacy policy, and platform requirements for managing a SPIRAL mall.",
          benefits: ["Mall management dashboard", "Tenant coordination tools", "Event management", "Revenue sharing"]
        };
      case "shopper":
        return {
          title: "Shopper Agreement",
          description: "I agree to the terms of service, privacy policy, and buyer guarantee.",
          benefits: ["SPIRAL rewards program", "Buyer protection", "Local shopping network", "Exclusive promotions"]
        };
      default:
        return {
          title: "Platform Agreement",
          description: "I agree to the platform terms, privacy policy, and user guidelines.",
          benefits: ["Platform access", "User support", "Privacy protection", "Legal compliance"]
        };
    }
  };

  const roleInfo = getRoleSpecificText();

  if (isConsentRecorded) {
    return (
      <Card className={`border-green-200 bg-green-50 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-900">Consent Recorded</h3>
              <p className="text-sm text-green-700">
                Your legal consent has been successfully recorded on {new Date().toLocaleDateString()}.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    return (
      <div className={`flex items-start space-x-3 ${className}`}>
        <Checkbox 
          id={`consent-${role}-${userId}`}
          checked={isChecked}
          onCheckedChange={handleConsentChange}
          className="mt-1"
        />
        <div className="flex-1">
          <label 
            htmlFor={`consent-${role}-${userId}`}
            className="text-sm text-gray-700 cursor-pointer"
          >
            {roleInfo.description} View our{" "}
            <a href="/legal/terms" target="_blank" className="text-blue-600 underline">
              Terms
            </a>,{" "}
            <a href="/legal/privacy" target="_blank" className="text-blue-600 underline">
              Privacy Policy
            </a>, and{" "}
            <a href="/legal/refunds" target="_blank" className="text-blue-600 underline">
              Refunds Policy
            </a>.
          </label>
          {isChecked && (
            <Button 
              size="sm" 
              onClick={handleRecordConsent}
              disabled={isSubmitting}
              className="mt-2 bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? "Recording..." : "Confirm Consent"}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className={`border-blue-200 bg-blue-50 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Shield className="h-8 w-8 text-blue-600 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              {roleInfo.title}
            </h3>
            
            <div className="mb-4">
              <h4 className="font-medium text-blue-800 mb-2">Legal Documents:</h4>
              <div className="flex flex-wrap gap-3 mb-4">
                <a 
                  href="/legal/terms" 
                  target="_blank"
                  className="flex items-center text-sm text-blue-700 hover:text-blue-900 underline"
                >
                  Terms of Service <ExternalLink className="h-3 w-3 ml-1" />
                </a>
                <a 
                  href="/legal/privacy" 
                  target="_blank"
                  className="flex items-center text-sm text-blue-700 hover:text-blue-900 underline"
                >
                  Privacy Policy <ExternalLink className="h-3 w-3 ml-1" />
                </a>
                <a 
                  href="/legal/refunds" 
                  target="_blank"
                  className="flex items-center text-sm text-blue-700 hover:text-blue-900 underline"
                >
                  Refunds Policy <ExternalLink className="h-3 w-3 ml-1" />
                </a>
                <a 
                  href="/legal/guarantee" 
                  target="_blank"
                  className="flex items-center text-sm text-blue-700 hover:text-blue-900 underline"
                >
                  Buyer Guarantee <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-blue-800 mb-2">What you get:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                {roleInfo.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-3 w-3 text-blue-600 mr-2" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-start space-x-3 mb-4">
              <Checkbox 
                id={`consent-${role}-${userId}`}
                checked={isChecked}
                onCheckedChange={handleConsentChange}
                className="mt-1"
                required={required}
              />
              <label 
                htmlFor={`consent-${role}-${userId}`}
                className="text-sm text-blue-800 cursor-pointer leading-relaxed"
              >
                {roleInfo.description} I understand that this constitutes my electronic signature 
                under the U.S. E-SIGN Act and Minnesota UETA.
                {required && <span className="text-red-600 ml-1">*</span>}
              </label>
            </div>

            {currentVersions && (
              <div className="text-xs text-blue-600 mb-4 bg-white p-2 rounded border">
                <strong>Legal Version Info:</strong> Effective {currentVersions.effectiveDate}
              </div>
            )}

            <Button 
              onClick={handleRecordConsent}
              disabled={!isChecked || isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isSubmitting ? "Recording Consent..." : "I Agree - Record My Consent"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}