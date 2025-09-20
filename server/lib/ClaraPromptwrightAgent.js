// ClaraPromptwrightAgent.js
// Enhanced Clara with sophisticated knowledge base and agent coordination

import { KnowledgeBaseAgent, getSharedKnowledgeBase } from "./SharedKnowledgeBase.js";
import { ShopperAgent } from "./ShopperAgent.js";
import { RetailerOnboardAgent } from "./RetailerOnboardAgent.js";
import { MallIntegratorAgent } from "./MallIntegratorAgent.js";
import { VendorRelationsAgent } from "./VendorRelationsAgent.js";
import { AdminOpsAgent } from "./AdminOpsAgent.js";

export class ClaraPromptwrightAgent extends KnowledgeBaseAgent {
  constructor(db) {
    super("Clara Promptwright", [
      "Intelligent routing",
      "Knowledge base management", 
      "Agent coordination",
      "Pattern matching",
      "Admin traceability"
    ]);
    
    this.aliases = ["Clara", "As Clara", "Clara can you"];
    this.shopperAgent = new ShopperAgent();
    this.retailerAgent = new RetailerOnboardAgent();
    this.mallAgent = new MallIntegratorAgent();
    this.vendorAgent = new VendorRelationsAgent();
    this.adminAgent = new AdminOpsAgent();

    // Database handle (Cloudant or Firestore)
    this.db = db;
    
    // Enhanced knowledge base (replaces simple key-value system)
    this.enhancedKB = getSharedKnowledgeBase(db);
    
    console.log('✅ Clara enhanced with sophisticated knowledge base access');
  }

  shouldActivate(input) {
    const lower = input.toLowerCase();
    return this.aliases.some(alias => lower.startsWith(alias.toLowerCase())) || this.isVague(input);
  }

  isVague(input) {
    return input.split(" ").length < 4;
  }

  detectType(input) {
    const lower = input.toLowerCase();
    if (lower.includes("store") || lower.includes("return") || lower.includes("spirals")) return "shopper";
    if (lower.includes("join") || lower.includes("upload") || lower.includes("fees")) return "retailer";
    if (lower.includes("mall") || lower.includes("directory") || lower.includes("events")) return "mall";
    if (lower.includes("vendor") || lower.includes("logistics") || lower.includes("ads")) return "vendor";
    if (lower.includes("status") || lower.includes("report") || lower.includes("finance")) return "admin";
    return "agent";
  }

  getKnowledgeBaseReply(type, input) {
    // Use enhanced knowledge base with pattern matching
    const match = this.enhancedKB.findBestMatch(input, type);
    
    if (match && match.confidence >= 0.3) {
      return {
        answer: match.entry.answer,
        confidence: match.confidence,
        entry_id: match.entry.entry_id,
        matched_patterns: match.matched_patterns,
        source: "enhanced_kb"
      };
    }

    // If no match, suggest creating a new entry
    if (type && input.trim().length > 5) {
      this.suggestNewKBEntry(type, input);
    }
    
    return null;
  }

  // Suggest new knowledge base entry for admin review
  suggestNewKBEntry(category, query) {
    const suggestion = {
      category: category,
      topic: "auto_suggested",
      question_patterns: [query.toLowerCase()],
      answer: `Pending: Admin review needed for query "${query}"`,
      tags: ["auto_suggested", category],
      created_by: "Clara AI Suggestion",
      status: "pending"
    };

    this.enhancedKB.addEntry(suggestion);
    console.log(`💡 Clara suggested new KB entry for: "${query}" in category: ${category}`);
  }

  optimizeAndRoute(input, type) {
    let optimizedPrompt = "", keyImprovements = "", proTip = "", agentReply = "";

    switch (type) {
      case "shopper":
        optimizedPrompt = "Shopper request: clarify product, store, or loyalty benefit.";
        keyImprovements = "Turned vague shopper query into structured search.";
        proTip = "Offer both local + national options.";
        agentReply = this.shopperAgent.handle(input);
        break;
      case "retailer":
        optimizedPrompt = "Retailer request: clarify onboarding, uploads, or billing.";
        keyImprovements = "Reframed vague retailer question into onboarding/support.";
        proTip = "Emphasize exposure + national reach.";
        agentReply = this.retailerAgent.handle(input);
        break;
      case "mall":
        optimizedPrompt = "Mall request: clarify integration, directories, events, or SPIRAL Center.";
        keyImprovements = "Shaped vague mall query into integration task.";
        proTip = "Highlight traffic + perks.";
        agentReply = this.mallAgent.handle(input);
        break;
      case "vendor":
        optimizedPrompt = "Vendor request: clarify partnership, logistics, payments, or ads.";
        keyImprovements = "Converted vague vendor input into structured request.";
        proTip = "Frame as scalable partnership.";
        agentReply = this.vendorAgent.handle(input);
        break;
      case "admin":
        optimizedPrompt = "Admin request: clarify status, reporting, finance, or system checks.";
        keyImprovements = "Reframed shorthand into structured task.";
        proTip = "Summarize results with insights.";
        agentReply = this.adminAgent.handle(input);
        break;
      default:
        optimizedPrompt = "Agent-to-agent collaboration: clarify task handoff.";
        keyImprovements = "Polished handoff for next agent.";
        proTip = "Always define output.";
        agentReply = "Forwarded to next agent.";
    }

    return { optimizedPrompt, keyImprovements, proTip, agentReply };
  }

  logExchange(data) {
    if (!this.db) return;
    this.db.collection("clara_logs").add(data); // Firestore/Cloudant equivalent
  }

  handle(input, userType = "unknown") {
    const timestamp = new Date().toISOString();
    const type = this.detectType(input);

    // Enhanced Knowledge Base check with confidence scoring
    const kbResult = this.getKnowledgeBaseReply(type, input);
    let finalReply, confidence = 0;
    let optimizedPrompt = "", keyImprovements = "", proTip = "", agentUsed = "Enhanced Knowledge Base";

    if (kbResult && kbResult.confidence >= 0.3) {
      finalReply = kbResult.answer;
      confidence = kbResult.confidence;
      optimizedPrompt = "Resolved via Enhanced Knowledge Base";
      keyImprovements = `Matched patterns: ${kbResult.matched_patterns.join(', ')}`;
      proTip = `Confidence: ${Math.round(confidence * 100)}% - Entry ID: ${kbResult.entry_id}`;
    } else {
      // Route to specialized agent
      const routed = this.optimizeAndRoute(input, type);
      optimizedPrompt = routed.optimizedPrompt;
      keyImprovements = routed.keyImprovements;
      proTip = routed.proTip;
      finalReply = routed.agentReply;
      agentUsed = type + "Agent";
      confidence = 0.7; // Agent responses have moderate confidence
    }

    const exchange = {
      timestamp,
      user_type: userType,
      input,
      optimized_prompt: optimizedPrompt,
      agent_used: agentUsed,
      final_reply: finalReply,
      confidence: confidence,
      knowledge_base_used: kbResult ? true : false,
      entry_id: kbResult ? kbResult.entry_id : null
    };

    // Save traceable log with enhanced metadata
    this.logExchange(exchange);

    return exchange;
  }

  // Get Clara's enhanced status
  getClaraStatus() {
    const kbStats = this.enhancedKB.getAnalytics();
    return {
      agent: "Clara Promptwright",
      status: "active", 
      capabilities: this.capabilities,
      knowledge_base_stats: {
        total_entries: kbStats.total_entries,
        total_accesses: kbStats.total_accesses,
        categories: Object.keys(kbStats.categories)
      },
      routing_agents: ["shopper", "retailer", "mall", "vendor", "admin"]
    };
  }
}

// Example usage:
// const clara = new ClaraPromptwrightAgent(db);
// console.log(clara.handle("Clara, how do I earn SPIRALS?", "shopper"));