// agents.js - Enhanced SPIRAL AI Agent Registry
// Clara Promptwright as primary switchboard + knowledge base enhanced agents

import { ClaraPromptwrightAgent } from './ClaraPromptwrightAgent.js';
import { ShopperAgent } from './ShopperAgent.js';
import { RetailerOnboardAgent } from './RetailerOnboardAgent.js';
import { MallIntegratorAgent } from './MallIntegratorAgent.js';
import { VendorRelationsAgent } from './VendorRelationsAgent.js';
import { AdminOpsAgent } from './AdminOpsAgent.js';
import { getSharedKnowledgeBase } from './SharedKnowledgeBase.js';

// Enhanced SPIRAL Agent Registry with Knowledge Base
export class SpiralAgentRegistry {
  constructor(db) {
    this.db = db;
    
    // Initialize shared knowledge base first
    this.knowledgeBase = getSharedKnowledgeBase(db);
    
    // Clara as primary switchboard agent (now enhanced)
    this.clara = new ClaraPromptwrightAgent(db);
    
    // Specialized agents (now with knowledge base access)
    this.agents = {
      shopper: new ShopperAgent(),
      retailer: new RetailerOnboardAgent(),
      mall: new MallIntegratorAgent(),
      vendor: new VendorRelationsAgent(),
      admin: new AdminOpsAgent()
    };
    
    console.log('✅ Enhanced Clara Promptwright Agent registered as primary switchboard');
    console.log('✅ SPIRAL Agent Registry initialized with 6 knowledge base-enhanced agents');
    console.log(`✅ Shared Knowledge Base: ${this.knowledgeBase.entries.size} structured entries ready`);
  }

  // Primary entry point - Clara handles all requests
  handle(input, userType = "unknown", agentPreference = null) {
    // If user specifically requests an agent, route directly
    if (agentPreference && this.agents[agentPreference]) {
      return this.agents[agentPreference].handle(input);
    }
    
    // Otherwise, Clara handles routing
    return this.clara.handle(input, userType);
  }

  // Get enhanced agent status with knowledge base stats
  getStatus() {
    const kbStats = this.knowledgeBase.getAnalytics();
    return {
      primaryAgent: "Clara Promptwright (Enhanced)",
      totalAgents: Object.keys(this.agents).length + 1,
      availableAgents: ["clara", ...Object.keys(this.agents)],
      knowledgeBase: {
        total_entries: kbStats.total_entries,
        total_accesses: kbStats.total_accesses,
        categories: Object.keys(kbStats.categories),
        popular_entries: kbStats.popular_entries.slice(0, 3).map(e => ({
          id: e.entry_id,
          topic: e.topic,
          accesses: e.usage_metrics.times_accessed
        }))
      },
      enhancement_status: "All agents have knowledge base access"
    };
  }

  // Expand Clara's knowledge base
  addKnowledgeEntry(category, key, value) {
    if (!this.clara.knowledgeBase[category]) {
      this.clara.knowledgeBase[category] = {};
    }
    this.clara.knowledgeBase[category][key] = value;
    console.log(`✅ Added knowledge entry: ${category}.${key}`);
  }
}

// Initialize registry (exported for use in routes)
export function initializeAgentRegistry(db) {
  return new SpiralAgentRegistry(db);
}

// Default export for easy imports
export default SpiralAgentRegistry;