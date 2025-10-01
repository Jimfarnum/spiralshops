// ShopperAgent.js - Handles shopper queries and assistance

import { KnowledgeBaseAgent } from './SharedKnowledgeBase.js';

export class ShopperAgent extends KnowledgeBaseAgent {
  constructor() {
    super("Shopper Assistant", [
      "Product search",
      "Store recommendations", 
      "SPIRALS balance queries",
      "Order tracking",
      "Returns assistance"
    ]);
  }

  handleFallback(input) {
    const lower = input.toLowerCase();
    
    // Basic response logic
    if (lower.includes("spirals") || lower.includes("points")) {
      return "You earn 1 SPIRAL per $1 spent. Check your balance in the SPIRAL app or ask about specific rewards!";
    }
    
    if (lower.includes("return") || lower.includes("refund")) {
      return "Returns are easy with SPIRAL! You can return items to any participating local store or ship them back. Need help with a specific order?";
    }
    
    if (lower.includes("store") || lower.includes("shop")) {
      return "I can help you find local stores, check product availability, or recommend items. What are you looking for?";
    }
    
    if (lower.includes("order") || lower.includes("tracking")) {
      return "I can help track your order! Please provide your order number or email for assistance.";
    }
    
    // Default response with knowledge base integration
    return {
      type: "agent_response",
      agent: this.name,
      response: "Hi! I'm your SPIRAL shopping assistant. I can help with products, stores, SPIRALS rewards, orders, and returns. What can I help you with today?",
      confidence: 0.5
    };
  }

  handle(input) {
    return this.handleWithKnowledge(input, "shopper");
  }
  
  getStatus() {
    return {
      agent: this.name,
      status: "active",
      capabilities: this.capabilities
    };
  }
}