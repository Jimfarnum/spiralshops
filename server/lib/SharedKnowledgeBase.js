// SharedKnowledgeBase.js - Shared knowledge base instance for all AI agents

import { EnhancedKnowledgeBase } from './EnhancedKnowledgeBase.js';

// Create shared instance
let sharedKnowledgeBase = null;

export function getSharedKnowledgeBase(db = null) {
  if (!sharedKnowledgeBase) {
    sharedKnowledgeBase = new EnhancedKnowledgeBase(db);
    console.log('✅ Shared Knowledge Base instance created');
  }
  return sharedKnowledgeBase;
}

// Base class for AI agents with knowledge base access
export class KnowledgeBaseAgent {
  constructor(agentName, capabilities = []) {
    this.name = agentName;
    this.capabilities = capabilities;
    this.knowledgeBase = getSharedKnowledgeBase();
  }

  // Search knowledge base with agent-specific logic
  searchKnowledge(query, category = null) {
    // Try to find exact match first
    const match = this.knowledgeBase.findBestMatch(query, category);
    
    if (match && match.confidence >= 0.3) {
      return {
        source: "knowledge_base",
        confidence: match.confidence,
        answer: match.entry.answer,
        entry_id: match.entry.entry_id,
        matched_patterns: match.matched_patterns,
        category: match.entry.category
      };
    }

    return null;
  }

  // Enhanced handle method that checks knowledge base first
  handleWithKnowledge(input, category = null) {
    // Check knowledge base first
    const knowledgeResult = this.searchKnowledge(input, category);
    
    if (knowledgeResult) {
      return {
        type: "knowledge_base_response",
        agent: this.name,
        response: knowledgeResult.answer,
        confidence: knowledgeResult.confidence,
        metadata: {
          entry_id: knowledgeResult.entry_id,
          matched_patterns: knowledgeResult.matched_patterns,
          category: knowledgeResult.category
        }
      };
    }

    // Fall back to agent-specific logic
    return this.handleFallback(input);
  }

  // Override this in each agent for agent-specific responses
  handleFallback(input) {
    return {
      type: "agent_response",
      agent: this.name,
      response: `I'm the ${this.name} agent. I can help with: ${this.capabilities.join(', ')}. What specifically would you like to know?`,
      confidence: 0.5
    };
  }

  // Add new knowledge to shared base
  contributeKnowledge(category, topic, patterns, answer, tags = []) {
    const entry = this.knowledgeBase.addEntry({
      category: category,
      topic: topic,
      question_patterns: patterns,
      answer: answer,
      tags: tags,
      created_by: this.name,
      status: "pending" // Requires admin approval
    });

    console.log(`✅ ${this.name} contributed knowledge: ${entry.entry_id}`);
    return entry;
  }

  // Get agent-specific analytics
  getAgentAnalytics() {
    const analytics = this.knowledgeBase.getAnalytics();
    
    // Filter for entries created by this agent
    const agentEntries = Array.from(this.knowledgeBase.entries.values())
      .filter(entry => entry.created_by === this.name);

    return {
      agent: this.name,
      total_contributions: agentEntries.length,
      agent_entries: agentEntries,
      overall_stats: analytics
    };
  }

  getStatus() {
    return {
      agent: this.name,
      status: "active",
      capabilities: this.capabilities,
      knowledge_base_access: true,
      total_kb_entries: this.knowledgeBase.entries.size
    };
  }
}