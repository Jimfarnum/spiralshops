import { useState, useEffect } from "react";
import { useConsentManager } from "./useConsentManager";

interface UseLegalConsentOptions {
  userId: string;
  role: "retailer" | "mall" | "shopper" | "admin";
  autoShow?: boolean;
  blockingMode?: boolean;
}

interface LegalConsentState {
  showModal: boolean;
  consentRequired: boolean;
  consentGiven: boolean;
  loading: boolean;
}

export function useLegalConsent(options: UseLegalConsentOptions) {
  const { userId, role, autoShow = false, blockingMode = false } = options;
  
  const [state, setState] = useState<LegalConsentState>({
    showModal: false,
    consentRequired: false,
    consentGiven: false,
    loading: true,
  });

  const { currentVersions, recordConsent, checkConsentStatus } = useConsentManager({
    userId,
    userRole: role,
  });

  // Check if user has already given consent for current versions
  const checkExistingConsent = async () => {
    if (!currentVersions || !userId) return;

    setState(prev => ({ ...prev, loading: true }));

    try {
      // Check if user has consent record for current versions
      const response = await fetch(`/api/legal/consent/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          role,
          currentVersions: currentVersions.versions,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const hasValidConsent = data.hasConsent;

        setState(prev => ({
          ...prev,
          consentRequired: !hasValidConsent,
          consentGiven: hasValidConsent,
          showModal: autoShow && !hasValidConsent,
          loading: false,
        }));
      } else {
        // If check fails, assume consent is required
        setState(prev => ({
          ...prev,
          consentRequired: true,
          consentGiven: false,
          showModal: autoShow,
          loading: false,
        }));
      }
    } catch (error) {
      console.error('Error checking consent status:', error);
      setState(prev => ({
        ...prev,
        consentRequired: true,
        consentGiven: false,
        showModal: autoShow,
        loading: false,
      }));
    }
  };

  // Show consent modal
  const showConsentModal = () => {
    setState(prev => ({ ...prev, showModal: true }));
  };

  // Hide consent modal
  const hideConsentModal = () => {
    if (blockingMode && !state.consentGiven) {
      return; // Prevent hiding in blocking mode without consent
    }
    setState(prev => ({ ...prev, showModal: false }));
  };

  // Handle consent completion
  const handleConsentCompleted = () => {
    setState(prev => ({
      ...prev,
      consentRequired: false,
      consentGiven: true,
      showModal: blockingMode ? true : false, // Keep modal open in blocking mode for user to close
    }));
  };

  // Record consent manually
  const giveConsent = async () => {
    try {
      await recordConsent(userId, role);
      handleConsentCompleted();
      return true;
    } catch (error) {
      console.error('Failed to record consent:', error);
      return false;
    }
  };

  // Initialize consent check when versions are available
  useEffect(() => {
    if (currentVersions && userId) {
      checkExistingConsent();
    }
  }, [currentVersions, userId, role]);

  return {
    // State
    ...state,
    currentVersions,

    // Actions
    showConsentModal,
    hideConsentModal,
    handleConsentCompleted,
    giveConsent,
    checkExistingConsent,

    // Utilities
    isConsentModalVisible: state.showModal,
    needsConsent: state.consentRequired && !state.consentGiven,
    canProceed: state.consentGiven || !state.consentRequired,
  };
}

// Utility function to check if consent is needed
export function isConsentRequired(userId: string, role: string): Promise<boolean> {
  return fetch('/api/legal/consent/check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, role, currentVersions: { check: true } }),
  })
  .then(res => res.json())
  .then(data => !data.hasConsent)
  .catch(() => true); // Assume consent required on error
}