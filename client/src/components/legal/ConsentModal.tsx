import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface ConsentModalProps {
  open: boolean;
  onConsentGiven: () => void;
  userId: string;
  userRole: "shopper" | "retailer" | "mall" | "admin";
}

interface LegalVersions {
  effectiveDate: string;
  versions: {
    termsVersion: string;
    privacyVersion: string;
    refundsVersion: string;
    guaranteeVersion: string;
  };
}

export default function ConsentModal({ open, onConsentGiven, userId, userRole }: ConsentModalProps) {
  const [legalVersions, setLegalVersions] = useState<LegalVersions | null>(null);
  const [termsContent, setTermsContent] = useState("");
  const [privacyContent, setPrivacyContent] = useState("");
  const [consents, setConsents] = useState({
    terms: false,
    privacy: false,
    refunds: false,
    guarantee: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      // Fetch legal versions and content
      fetch("/api/legal/versions")
        .then(res => res.json())
        .then(setLegalVersions)
        .catch(console.error);

      fetch("/api/legal/terms.html")
        .then(res => res.text())
        .then(setTermsContent)
        .catch(console.error);

      fetch("/api/legal/privacy.html")
        .then(res => res.text())
        .then(setPrivacyContent)
        .catch(console.error);
    }
  }, [open]);

  const handleConsentChange = (type: keyof typeof consents, checked: boolean) => {
    setConsents(prev => ({ ...prev, [type]: checked }));
  };

  const allConsentsGiven = Object.values(consents).every(Boolean);

  const handleSubmit = async () => {
    if (!allConsentsGiven || !legalVersions) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/legal/consent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          role: userRole,
          termsVersion: legalVersions.versions.termsVersion,
          privacyVersion: legalVersions.versions.privacyVersion,
          refundsVersion: legalVersions.versions.refundsVersion,
          guaranteeVersion: legalVersions.versions.guaranteeVersion,
          acceptedFrom: "web"
        }),
      });

      if (response.ok) {
        toast({
          title: "Consent Recorded",
          description: "Your consent has been successfully recorded.",
        });
        onConsentGiven();
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to record consent",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record consent",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Legal Terms & Consent</DialogTitle>
          <DialogDescription>
            Please review and accept our legal terms to continue using SPIRAL.
            {legalVersions && (
              <span className="block mt-1 text-sm text-gray-600">
                Effective Date: {legalVersions.effectiveDate}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Terms of Service</h3>
              <ScrollArea className="h-32 w-full border rounded p-2">
                <div 
                  className="text-sm"
                  dangerouslySetInnerHTML={{ __html: termsContent }}
                />
              </ScrollArea>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id="terms"
                  checked={consents.terms}
                  onCheckedChange={(checked) => handleConsentChange('terms', checked as boolean)}
                />
                <label htmlFor="terms" className="text-sm">
                  I agree to the Terms of Service
                </label>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Privacy Policy</h3>
              <ScrollArea className="h-32 w-full border rounded p-2">
                <div 
                  className="text-sm"
                  dangerouslySetInnerHTML={{ __html: privacyContent }}
                />
              </ScrollArea>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id="privacy"
                  checked={consents.privacy}
                  onCheckedChange={(checked) => handleConsentChange('privacy', checked as boolean)}
                />
                <label htmlFor="privacy" className="text-sm">
                  I agree to the Privacy Policy
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Refunds & Returns</h3>
              <ScrollArea className="h-32 w-full border rounded p-2">
                <div className="text-sm">
                  <p><strong>Window:</strong> Default 30 days from delivery</p>
                  <p><strong>Process:</strong> Initiate from Order History</p>
                  <p><strong>Timing:</strong> 7-10 business days for refund</p>
                  <p><strong>Escalation:</strong> File Buyer Guarantee claim if unresolved</p>
                </div>
              </ScrollArea>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id="refunds"
                  checked={consents.refunds}
                  onCheckedChange={(checked) => handleConsentChange('refunds', checked as boolean)}
                />
                <label htmlFor="refunds" className="text-sm">
                  I understand the Refunds & Returns policy
                </label>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Buyer Guarantee</h3>
              <ScrollArea className="h-32 w-full border rounded p-2">
                <div className="text-sm">
                  <p><strong>Covered:</strong> Not received, wrong/damaged items, retailer refund failures</p>
                  <p><strong>File Claim:</strong> Within 30 days with evidence</p>
                  <p><strong>Remedies:</strong> Refund, replacement, or SPIRALS credit</p>
                  <p><strong>Protection:</strong> Platform-level buyer protection</p>
                </div>
              </ScrollArea>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id="guarantee"
                  checked={consents.guarantee}
                  onCheckedChange={(checked) => handleConsentChange('guarantee', checked as boolean)}
                />
                <label htmlFor="guarantee" className="text-sm">
                  I understand the Buyer Guarantee
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            onClick={handleSubmit}
            disabled={!allConsentsGiven || isSubmitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? "Recording Consent..." : "Accept All Terms"}
          </Button>
        </div>

        <div className="text-xs text-gray-500 mt-4">
          <p>
            <strong>Electronic Signature Notice:</strong> By checking the boxes and clicking "Accept All Terms," 
            you are providing your electronic signature under the U.S. E-SIGN Act and Minnesota UETA. 
            This constitutes your agreement to be bound by these terms.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}