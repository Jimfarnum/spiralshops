# SPIRAL Legal Consent System - Usage Guide

## Overview
The SPIRAL Legal Consent System provides comprehensive legal compliance for Minnesota LLC requirements with support for E-SIGN/UETA, MCDPA, CCPA, and GDPR standards.

## Quick Start

### Basic Usage

```tsx
import { LegalConsentCheckbox } from '@/components/legal';

// For Retailer Registration
<LegalConsentCheckbox 
  role="retailer" 
  userId={userId}
  onConsentRecorded={(consentData) => {
    console.log("Consent recorded:", consentData);
    // Continue with onboarding
  }}
  required={true}
/>

// For Mall Operator Setup  
<LegalConsentCheckbox 
  role="mall" 
  userId={userId}
  onConsentRecorded={(consentData) => {
    // Enable mall management features
  }}
/>

// Compact version for quick signup
<LegalConsentCheckbox 
  role="shopper" 
  userId={userId}
  compact={true}
  onConsentRecorded={(consentData) => {
    // Complete account creation
  }}
/>
```

### Modal Integration

```tsx
import { LegalConsentModal } from '@/components/legal';

const [showModal, setShowModal] = useState(false);

<LegalConsentModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  role="retailer"
  userId={userId}
  blockingModal={true} // Prevents closing until consent given
  onConsentCompleted={() => {
    // Continue with protected workflow
  }}
/>
```

### Consent Management Hook

```tsx
import { useLegalConsent } from '@/hooks/useLegalConsent';

const consent = useLegalConsent({ 
  userId, 
  role: "retailer", 
  autoShow: true,    // Show modal automatically if needed
  blockingMode: true // Block access until consent given
});

// Check consent status
console.log(consent.consentRequired); // boolean
console.log(consent.consentGiven);    // boolean  
console.log(consent.canProceed);      // boolean

// Manual actions
consent.showConsentModal();
consent.giveConsent();
consent.checkExistingConsent();
```

## Component Props

### LegalConsentCheckbox

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `role` | `"retailer" \| "mall" \| "shopper" \| "admin"` | - | User role for consent |
| `userId` | `string` | - | Unique user identifier |
| `onConsentRecorded` | `(data: any) => void` | - | Callback when consent recorded |
| `required` | `boolean` | `false` | Whether consent is required |
| `compact` | `boolean` | `false` | Use compact layout |
| `className` | `string` | `""` | Additional CSS classes |

### LegalConsentModal

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | - | Modal visibility |
| `onClose` | `() => void` | - | Close callback |
| `role` | `"retailer" \| "mall" \| "shopper" \| "admin"` | - | User role |
| `userId` | `string` | - | User identifier |
| `onConsentCompleted` | `() => void` | - | Completion callback |
| `blockingModal` | `boolean` | `false` | Prevent closing without consent |
| `title` | `string` | - | Custom modal title |
| `description` | `string` | - | Custom description |

## API Endpoints

### Record Consent
```bash
POST /api/legal/consent
Content-Type: application/json

{
  "userId": "user123",
  "role": "retailer",
  "termsVersion": "tos_v1_2025-08-26",
  "privacyVersion": "privacy_v1_2025-08-26", 
  "refundsVersion": "refunds_v1_2025-08-26",
  "guaranteeVersion": "guarantee_v1_2025-08-26",
  "acceptedFrom": "web"
}
```

### Check Consent Status
```bash
POST /api/legal/consent/check
Content-Type: application/json

{
  "userId": "user123",
  "role": "retailer",
  "currentVersions": { "check": true }
}
```

### Get Legal Versions
```bash
GET /api/legal/versions

Response:
{
  "effectiveDate": "2025-08-26",
  "versions": {
    "termsVersion": "tos_v1_2025-08-26",
    "privacyVersion": "privacy_v1_2025-08-26",
    "refundsVersion": "refunds_v1_2025-08-26",
    "guaranteeVersion": "guarantee_v1_2025-08-26"
  }
}
```

## Integration Examples

### 1. Retailer Onboarding Flow

```tsx
function RetailerOnboarding({ userId }) {
  const [step, setStep] = useState(1);
  const [consentGiven, setConsentGiven] = useState(false);

  return (
    <div>
      {step === 1 && (
        <LegalConsentCheckbox 
          role="retailer" 
          userId={userId}
          required={true}
          onConsentRecorded={() => {
            setConsentGiven(true);
            setStep(2);
          }}
        />
      )}
      
      {step === 2 && consentGiven && (
        <div>Store setup form...</div>
      )}
    </div>
  );
}
```

### 2. Protected Route with Consent Check

```tsx
function ProtectedRetailerPage({ userId }) {
  const consent = useLegalConsent({ 
    userId, 
    role: "retailer", 
    autoShow: true,
    blockingMode: true
  });

  if (!consent.canProceed) {
    return <div>Please complete legal requirements...</div>;
  }

  return <RetailerDashboard />;
}
```

### 3. Mall Operator Setup

```tsx
function MallSetup({ userId }) {
  const [showConsent, setShowConsent] = useState(false);

  return (
    <div>
      <Button onClick={() => setShowConsent(true)}>
        Begin Mall Setup
      </Button>
      
      <LegalConsentModal
        isOpen={showConsent}
        onClose={() => setShowConsent(false)}
        role="mall"
        userId={userId}
        blockingModal={true}
        title="Mall Operator Legal Requirements"
        description="Review and agree to terms for managing a SPIRAL mall."
        onConsentCompleted={() => {
          // Enable mall features
          window.location.href = '/mall/dashboard';
        }}
      />
    </div>
  );
}
```

### 4. Website Consent Banner

```tsx
import { ConsentBanner } from '@/components/legal';

function App() {
  return (
    <div>
      <Header />
      <MainContent />
      <Footer />
      
      <ConsentBanner
        onAccept={() => {
          // Record general website consent
        }}
        onDismiss={() => {
          // Hide banner
        }}
      />
    </div>
  );
}
```

## Legal Documents

All legal documents are accessible via:
- `/legal/terms` - Terms of Service
- `/legal/privacy` - Privacy Policy  
- `/legal/refunds` - Refunds & Returns Policy
- `/legal/guarantee` - Buyer Guarantee

API access:
- `/api/legal/terms.html` - HTML format
- `/api/legal/privacy.md` - Markdown format
- Plus all other documents in both formats

## Compliance Features

### E-SIGN/UETA Compliance
- Electronic signature support via checkbox consent
- User acknowledgment of electronic agreement
- Audit trail with IP address and timestamp

### MCDPA/CCPA/GDPR Compliance  
- Clear consent collection and recording
- User rights information provided
- Data processing transparency

### Minnesota LLC Framework
- Complete legal document suite
- Retailer, mall operator, and shopper protections
- Platform liability limitations
- Dispute resolution procedures

## Best Practices

1. **Always record consent** before enabling protected features
2. **Use blocking modals** for critical onboarding flows  
3. **Check consent status** on app initialization
4. **Provide easy access** to legal documents
5. **Handle consent gracefully** with clear UI feedback
6. **Test all consent flows** in different user scenarios

## Database Schema

Consent records are stored with:
```typescript
{
  userId: string,
  role: "shopper" | "retailer" | "mall" | "admin",
  termsVersion: string,
  privacyVersion: string, 
  refundsVersion: string,
  guaranteeVersion: string,
  acceptedFrom: "web" | "ios" | "android",
  ipAddress: string,
  userAgent: string,
  consentedAt: Date
}
```

This creates a complete audit trail for legal compliance and user consent management.