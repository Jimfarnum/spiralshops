import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface LegalVersions {
  effectiveDate: string;
  versions: {
    termsVersion: string;
    privacyVersion: string;
    refundsVersion: string;
    guaranteeVersion: string;
  };
}

interface ConsentStatus {
  isRequired: boolean;
  currentVersions: LegalVersions | null;
  loading: boolean;
  error: string | null;
}

interface ConsentManagerOptions {
  userId?: string;
  userRole?: "shopper" | "retailer" | "mall" | "admin";
  skipCheck?: boolean;
}

export function useConsentManager(options: ConsentManagerOptions = {}) {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>({
    isRequired: false,
    currentVersions: null,
    loading: true,
    error: null,
  });
  const { toast } = useToast();

  const checkConsentStatus = async () => {
    if (options.skipCheck) {
      setConsentStatus(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      setConsentStatus(prev => ({ ...prev, loading: true, error: null }));

      // Fetch current legal versions
      const versionsResponse = await fetch("/api/legal/versions");
      if (!versionsResponse.ok) {
        throw new Error("Failed to fetch legal versions");
      }
      const versions: LegalVersions = await versionsResponse.json();

      setConsentStatus({
        isRequired: false, // For now, consent is not strictly required for browsing
        currentVersions: versions,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error checking consent status:", error);
      setConsentStatus({
        isRequired: false,
        currentVersions: null,
        loading: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  const recordConsent = async (userId: string, role: string) => {
    if (!consentStatus.currentVersions) {
      throw new Error("Legal versions not loaded");
    }

    try {
      const response = await fetch("/api/legal/consent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          role,
          termsVersion: consentStatus.currentVersions.versions.termsVersion,
          privacyVersion: consentStatus.currentVersions.versions.privacyVersion,
          refundsVersion: consentStatus.currentVersions.versions.refundsVersion,
          guaranteeVersion: consentStatus.currentVersions.versions.guaranteeVersion,
          acceptedFrom: "web"
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to record consent");
      }

      const result = await response.json();
      
      toast({
        title: "Consent Recorded",
        description: "Your legal consent has been successfully recorded.",
      });

      // Update consent status to not required after successful recording
      setConsentStatus(prev => ({ ...prev, isRequired: false }));

      return result;
    } catch (error) {
      console.error("Error recording consent:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to record consent",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    checkConsentStatus();
  }, [options.userId, options.userRole]);

  return {
    ...consentStatus,
    recordConsent,
    checkConsentStatus,
  };
}