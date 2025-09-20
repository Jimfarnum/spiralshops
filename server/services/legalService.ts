import { cpostDoc } from '../utils/cloudantCore.js';

export interface ConsentInput {
  userId: string;
  termsVersion: string;
  privacyVersion: string;
  refundsVersion?: string;
  guaranteeVersion?: string;
  ipAddress?: string;
}

export async function recordConsent(input: ConsentInput){
  const doc = {
    _id: `consent_${input.userId}_${Date.now()}`,
    type: 'consent',
    ...input,
    consentedAt: new Date().toISOString()
  };
  await cpostDoc(doc);
  return { ok:true };
}