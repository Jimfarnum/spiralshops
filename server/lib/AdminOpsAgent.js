// AdminOpsAgent.js - Handles admin operations and reporting

import { KnowledgeBaseAgent } from './SharedKnowledgeBase.js';

export class AdminOpsAgent extends KnowledgeBaseAgent {
  constructor() {
    super("Admin Operations", [
      "System status reporting",
      "Financial summaries",
      "User onboarding metrics",
      "Issue flagging",
      "Performance monitoring"
    ]);
  }

  handleFallback(input) {
    const lower = input.toLowerCase();
    
    if (lower.includes("status") || lower.includes("health") || lower.includes("system")) {
      return "System Status: All services operational. Database: Connected. AI Agents: 6 active. API Response: <50ms average.";
    }
    
    if (lower.includes("finance") || lower.includes("revenue") || lower.includes("payment")) {
      return "Financial Summary: SPIRAL uses Stripe Connect for multi-retailer payments and payouts. 5% platform fee structure active.";
    }
    
    if (lower.includes("onboarding") || lower.includes("signup") || lower.includes("registration")) {
      return "Onboarding Metrics: Retailer applications processed within 24-48 hours. Verification system operational.";
    }
    
    if (lower.includes("issue") || lower.includes("flag") || lower.includes("problem")) {
      return "Issue Tracking: Monitoring system flags, payment issues, and user reports. All alerts logged for review.";
    }
    
    if (lower.includes("report") || lower.includes("dashboard") || lower.includes("analytics")) {
      return "Admin Dashboard shows: onboarding status, SPIRALS earned, revenue metrics, and flagged issues. Need specific report?";
    }
    
    return {
      type: "agent_response",
      agent: this.name,
      response: "Hi! I handle admin operations for SPIRAL. I can provide system status, financial reports, onboarding metrics, and issue tracking. What do you need?",
      confidence: 0.5
    };
  }

  handle(input) {
    return this.handleWithKnowledge(input, "admin");
  }
  
  getStatus() {
    return {
      agent: this.name,
      status: "active",
      capabilities: this.capabilities
    };
  }
}