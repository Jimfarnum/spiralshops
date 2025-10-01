import React from "react";

export default function LegalLinks() {
  return (
    <div className="text-xs text-gray-600 space-x-3">
      <a className="underline hover:text-blue-600" href="/legal/terms" target="_blank" rel="noreferrer">Terms of Service</a>
      <a className="underline hover:text-blue-600" href="/legal/privacy" target="_blank" rel="noreferrer">Privacy Policy</a>
      <a className="underline hover:text-blue-600" href="/legal/refunds" target="_blank" rel="noreferrer">Refunds & Returns</a>
      <a className="underline hover:text-blue-600" href="/legal/guarantee" target="_blank" rel="noreferrer">Buyer Guarantee</a>
    </div>
  );
}