// RetailerOnboardAgent.js - Handles retailer onboarding and support

import { KnowledgeBaseAgent } from './SharedKnowledgeBase.js';

export class RetailerOnboardAgent extends KnowledgeBaseAgent {
  constructor() {
    super("Retailer Onboarding", [
      "Store registration",
      "Inventory upload assistance",
      "Fee structure explanation",
      "Verification process",
      "Payment setup"
    ]);
  }

  handleFallback(input) {
    const lower = input.toLowerCase();
    
    if (lower.includes("fee") || lower.includes("cost") || lower.includes("price")) {
      return "SPIRAL charges 5% per transaction. Silver/Gold tiers unlock analytics, promotions, and priority placement. Ready to get started?";
    }
    
    if (lower.includes("upload") || lower.includes("inventory") || lower.includes("products")) {
      return "Upload your inventory via CSV/XLSX files or add products individually. Need help formatting your product data?";
    }
    
    if (lower.includes("verify") || lower.includes("approval") || lower.includes("review")) {
      return "Store verification typically takes 24-48 hours. We review store details, business credentials, and initial inventory.";
    }
    
    if (lower.includes("payment") || lower.includes("stripe") || lower.includes("payout")) {
      return "We use Stripe Connect for secure payments and payouts. You'll receive payments minus the 5% SPIRAL fee.";
    }
    
    if (lower.includes("join") || lower.includes("register") || lower.includes("sign up")) {
      return "Welcome to SPIRAL! To join: 1) Register your store, 2) Upload inventory, 3) Complete verification. Shall we start?";
    }
    
    return {
      type: "agent_response",
      agent: this.name,
      response: "Hi! I help retailers join SPIRAL. I can assist with registration, inventory uploads, fees, verification, and payments. How can I help?",
      confidence: 0.5
    };
  }

  handle(input) {
    return this.handleWithKnowledge(input, "retailer");
  }
  
  getStatus() {
    return {
      agent: this.name,
      status: "active",
      capabilities: this.capabilities
    };
  }
}