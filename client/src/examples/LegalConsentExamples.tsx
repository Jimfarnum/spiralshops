import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LegalConsentCheckbox from "@/components/legal/LegalConsentCheckbox";
import LegalConsentModal from "@/components/legal/LegalConsentModal";
import ConsentBanner from "@/components/legal/ConsentBanner";
import { useLegalConsent } from "@/hooks/useLegalConsent";

// Example 1: Basic Consent Checkbox for Retailer Signup
export function RetailerSignupConsent({ userId }: { userId: string }) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Complete Your Retailer Registration</h3>
      
      <LegalConsentCheckbox 
        role="retailer" 
        userId={userId}
        onConsentRecorded={(consentData) => {
          console.log("Retailer consent recorded:", consentData);
          // Proceed with retailer onboarding
        }}
        required={true}
      />
    </div>
  );
}

// Example 2: Mall Operator Consent Modal
export function MallOperatorOnboarding({ userId }: { userId: string }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Mall Operator Setup</h3>
      
      <Button onClick={() => setShowModal(true)}>
        Review Legal Requirements
      </Button>
      
      <LegalConsentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        role="mall"
        userId={userId}
        blockingModal={true}
        onConsentCompleted={() => {
          console.log("Mall operator consent completed");
          // Enable mall management features
        }}
      />
    </div>
  );
}

// Example 3: Compact Consent for Quick Signup
export function QuickSignupConsent({ userId }: { userId: string }) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Quick Account Setup</h3>
      
      <LegalConsentCheckbox 
        role="shopper" 
        userId={userId}
        compact={true}
        onConsentRecorded={(consentData) => {
          console.log("Shopper consent recorded:", consentData);
          // Complete account creation
        }}
      />
    </div>
  );
}

// Example 4: Using the Consent Hook
export function AdvancedConsentManagement({ userId }: { userId: string }) {
  const consent = useLegalConsent({ 
    userId, 
    role: "retailer", 
    autoShow: false,
    blockingMode: false 
  });

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Advanced Consent Management</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Consent Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1">
              <div>Required: {consent.consentRequired ? "Yes" : "No"}</div>
              <div>Given: {consent.consentGiven ? "Yes" : "No"}</div>
              <div>Can Proceed: {consent.canProceed ? "Yes" : "No"}</div>
              <div>Loading: {consent.loading ? "Yes" : "No"}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={consent.showConsentModal}
              disabled={consent.loading}
            >
              Show Consent Modal
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={consent.checkExistingConsent}
              disabled={consent.loading}
            >
              Recheck Status
            </Button>
            <Button 
              size="sm"
              onClick={consent.giveConsent}
              disabled={consent.loading || consent.consentGiven}
            >
              Give Consent
            </Button>
          </CardContent>
        </Card>
      </div>

      <LegalConsentModal
        isOpen={consent.showModal}
        onClose={consent.hideConsentModal}
        role="retailer"
        userId={userId}
        onConsentCompleted={consent.handleConsentCompleted}
      />
    </div>
  );
}

// Example 5: Consent Banner for Website
export function WebsiteConsentBanner() {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <ConsentBanner
      visible={showBanner}
      onAccept={() => {
        console.log("User accepted website consent");
        setShowBanner(false);
      }}
      onDismiss={() => {
        console.log("User dismissed consent banner");
        setShowBanner(false);
      }}
    />
  );
}

// Example 6: Integration with Existing Forms
export function RetailerOnboardingForm({ userId }: { userId: string }) {
  const [step, setStep] = useState(1);
  const [consentGiven, setConsentGiven] = useState(false);

  const handleConsentRecorded = (consentData: any) => {
    console.log("Consent recorded:", consentData);
    setConsentGiven(true);
    setStep(2); // Move to next step
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
        }`}>1</div>
        <span className={step >= 1 ? 'text-blue-600 font-semibold' : 'text-gray-500'}>
          Legal Agreement
        </span>
        
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'
        }`}>2</div>
        <span className={step >= 2 ? 'text-blue-600 font-semibold' : 'text-gray-500'}>
          Store Setup
        </span>
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Legal Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <LegalConsentCheckbox 
              role="retailer" 
              userId={userId}
              onConsentRecorded={handleConsentRecorded}
              required={true}
            />
          </CardContent>
        </Card>
      )}

      {step === 2 && consentGiven && (
        <Card>
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-600 mb-4">✓ Legal consent recorded successfully</p>
            <p>Now you can continue with your store setup...</p>
            {/* Store setup form would go here */}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Main examples component
export default function LegalConsentExamples() {
  const exampleUserId = "user_example_123";

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">SPIRAL Legal Consent Examples</h1>
        <p className="text-gray-600">Comprehensive examples of legal consent components</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Retailer Signup Consent</CardTitle>
          </CardHeader>
          <CardContent>
            <RetailerSignupConsent userId={exampleUserId} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Shopper Consent</CardTitle>
          </CardHeader>
          <CardContent>
            <QuickSignupConsent userId={exampleUserId} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mall Operator Modal</CardTitle>
          </CardHeader>
          <CardContent>
            <MallOperatorOnboarding userId={exampleUserId} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Advanced Consent Hook</CardTitle>
          </CardHeader>
          <CardContent>
            <AdvancedConsentManagement userId={exampleUserId} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Integrated Onboarding Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <RetailerOnboardingForm userId={exampleUserId} />
        </CardContent>
      </Card>

      <WebsiteConsentBanner />
    </div>
  );
}