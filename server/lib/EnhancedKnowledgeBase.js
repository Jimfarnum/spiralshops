// EnhancedKnowledgeBase.js - Sophisticated knowledge base with pattern matching and analytics

export class EnhancedKnowledgeBase {
  constructor(db = null) {
    this.db = db;
    this.entries = new Map();
    this.analytics = new Map();
    
    // Initialize with sample structured entries
    this.initializeBaseEntries();
  }

  initializeBaseEntries() {
    const baseEntries = [
      {
        entry_id: "kb_0001",
        category: "shopper", 
        topic: "spirals",
        question_patterns: [
          "how do i earn points",
          "what are spirals", 
          "do i get rewards",
          "earn spirals",
          "loyalty points",
          "reward system"
        ],
        answer: "Shoppers earn 1 SPIRAL per $1 spent. SPIRALS can be redeemed for discounts, perks, and mall events.",
        status: "approved",
        source: "Admin Approval v1.0",
        created_at: new Date().toISOString(),
        last_updated: new Date().toISOString(),
        created_by: "ClaraPromptwrightAgent",
        approved_by: "AdminOpsAgent",
        version: 1,
        tags: ["loyalty", "rewards", "shopper"],
        usage_metrics: {
          times_accessed: 0,
          last_accessed: null
        }
      },
      {
        entry_id: "kb_0002",
        category: "retailer",
        topic: "fees",
        question_patterns: [
          "what are your fees",
          "how much does it cost",
          "pricing structure",
          "commission rate",
          "cost to join"
        ],
        answer: "SPIRAL charges 5% per transaction. Silver/Gold tiers unlock analytics, promotions, and priority placement.",
        status: "approved",
        source: "Admin Approval v1.0",
        created_at: new Date().toISOString(),
        last_updated: new Date().toISOString(),
        created_by: "ClaraPromptwrightAgent",
        approved_by: "AdminOpsAgent",
        version: 1,
        tags: ["pricing", "fees", "retailer"],
        usage_metrics: {
          times_accessed: 0,
          last_accessed: null
        }
      },
      {
        entry_id: "kb_0003",
        category: "retailer",
        topic: "onboarding",
        question_patterns: [
          "how to join",
          "sign up process",
          "become a retailer",
          "get started",
          "registration"
        ],
        answer: "Retailers apply with store details, upload inventory (CSV/XLSX), and provide verification. Approval: 24–48 hours.",
        status: "approved",
        source: "Admin Approval v1.0",
        created_at: new Date().toISOString(),
        last_updated: new Date().toISOString(),
        created_by: "ClaraPromptwrightAgent",
        approved_by: "AdminOpsAgent",
        version: 1,
        tags: ["onboarding", "registration", "retailer"],
        usage_metrics: {
          times_accessed: 0,
          last_accessed: null
        }
      },
      {
        entry_id: "kb_0004",
        category: "mall",
        topic: "integration",
        question_patterns: [
          "mall partnership",
          "directory sync",
          "mall integration",
          "spiral centers"
        ],
        answer: "Malls sync directories, host events, and launch SPIRAL Centers for customer pickup and convenience.",
        status: "approved",
        source: "Admin Approval v1.0",
        created_at: new Date().toISOString(),
        last_updated: new Date().toISOString(),
        created_by: "ClaraPromptwrightAgent",
        approved_by: "AdminOpsAgent",
        version: 1,
        tags: ["mall", "integration", "partnership"],
        usage_metrics: {
          times_accessed: 0,
          last_accessed: null
        }
      }
    ];

    // Load entries into the knowledge base
    baseEntries.forEach(entry => {
      this.entries.set(entry.entry_id, entry);
    });

    console.log(`✅ Enhanced Knowledge Base initialized with ${baseEntries.length} structured entries`);
  }

  // Pattern-based question matching with scoring
  findBestMatch(input, category = null) {
    const inputLower = input.toLowerCase();
    let bestMatch = null;
    let bestScore = 0;

    for (const [entryId, entry] of this.entries) {
      // Skip if category filter is applied and doesn't match
      if (category && entry.category !== category) continue;
      
      // Skip if entry is not approved
      if (entry.status !== 'approved') continue;

      // Calculate pattern match score
      let score = 0;
      for (const pattern of entry.question_patterns) {
        const patternLower = pattern.toLowerCase();
        
        // Exact phrase match (highest score)
        if (inputLower.includes(patternLower)) {
          score += 10;
        }
        
        // Word-by-word matching
        const inputWords = inputLower.split(/\s+/);
        const patternWords = patternLower.split(/\s+/);
        
        const matchingWords = patternWords.filter(word => 
          inputWords.some(inputWord => inputWord.includes(word) || word.includes(inputWord))
        );
        
        score += (matchingWords.length / patternWords.length) * 5;
      }

      // Bonus for tag matches
      entry.tags.forEach(tag => {
        if (inputLower.includes(tag.toLowerCase())) {
          score += 2;
        }
      });

      if (score > bestScore) {
        bestScore = score;
        bestMatch = entry;
      }
    }

    // Update analytics if match found
    if (bestMatch && bestScore >= 3) { // Minimum confidence threshold
      this.updateUsageMetrics(bestMatch.entry_id, input);
      return {
        entry: bestMatch,
        confidence: Math.min(bestScore / 10, 1.0), // Normalize to 0-1
        matched_patterns: this.getMatchedPatterns(input, bestMatch)
      };
    }

    return null;
  }

  // Get which patterns matched for transparency
  getMatchedPatterns(input, entry) {
    const inputLower = input.toLowerCase();
    return entry.question_patterns.filter(pattern => 
      inputLower.includes(pattern.toLowerCase())
    );
  }

  // Update usage analytics (enhanced with hit tracking)
  updateUsageMetrics(entryId, query) {
    const entry = this.entries.get(entryId);
    if (entry) {
      entry.usage_metrics.times_accessed++;
      entry.usage_metrics.last_accessed = new Date().toISOString();
      
      // Track popular queries
      if (!this.analytics.has(entryId)) {
        this.analytics.set(entryId, {
          popular_queries: new Map(),
          access_history: [],
          hourly_hits: new Map(),
          daily_hits: new Map()
        });
      }
      
      const entryAnalytics = this.analytics.get(entryId);
      
      // Track query popularity
      const queryCount = entryAnalytics.popular_queries.get(query) || 0;
      entryAnalytics.popular_queries.set(query, queryCount + 1);
      
      // Track access history
      entryAnalytics.access_history.push({
        timestamp: new Date().toISOString(),
        query: query,
        source: "api_hit"
      });

      // Track hourly and daily hits for analytics
      const now = new Date();
      const hourKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}`;
      const dayKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
      
      entryAnalytics.hourly_hits.set(hourKey, (entryAnalytics.hourly_hits.get(hourKey) || 0) + 1);
      entryAnalytics.daily_hits.set(dayKey, (entryAnalytics.daily_hits.get(dayKey) || 0) + 1);

      // Keep only last 100 access records
      if (entryAnalytics.access_history.length > 100) {
        entryAnalytics.access_history = entryAnalytics.access_history.slice(-100);
      }
      
      // Keep only last 24 hours of hourly data
      const hourKeys = Array.from(entryAnalytics.hourly_hits.keys());
      if (hourKeys.length > 24) {
        hourKeys.slice(0, -24).forEach(key => entryAnalytics.hourly_hits.delete(key));
      }
      
      // Keep only last 30 days of daily data  
      const dayKeys = Array.from(entryAnalytics.daily_hits.keys());
      if (dayKeys.length > 30) {
        dayKeys.slice(0, -30).forEach(key => entryAnalytics.daily_hits.delete(key));
      }
    }
    
    return entry;
  }

  // Add new knowledge base entry
  addEntry(entryData) {
    const entry = {
      entry_id: entryData.entry_id || `kb_${Date.now()}`,
      category: entryData.category,
      topic: entryData.topic,
      question_patterns: entryData.question_patterns || [],
      answer: entryData.answer,
      status: entryData.status || "pending",
      source: entryData.source || "User Submission",
      created_at: new Date().toISOString(),
      last_updated: new Date().toISOString(),
      created_by: entryData.created_by || "System",
      approved_by: entryData.approved_by || null,
      version: 1,
      tags: entryData.tags || [],
      usage_metrics: {
        times_accessed: 0,
        last_accessed: null
      }
    };

    this.entries.set(entry.entry_id, entry);
    console.log(`✅ Added knowledge base entry: ${entry.entry_id}`);
    return entry;
  }

  // Update existing entry
  updateEntry(entryId, updates) {
    const entry = this.entries.get(entryId);
    if (!entry) return null;

    const updatedEntry = {
      ...entry,
      ...updates,
      last_updated: new Date().toISOString(),
      version: entry.version + 1
    };

    this.entries.set(entryId, updatedEntry);
    return updatedEntry;
  }

  // Get entry by ID
  getEntry(entryId) {
    return this.entries.get(entryId);
  }

  // Get all entries by category
  getEntriesByCategory(category) {
    const entries = [];
    for (const [id, entry] of this.entries) {
      if (entry.category === category) {
        entries.push(entry);
      }
    }
    return entries;
  }

  // Get analytics data
  getAnalytics(entryId = null) {
    if (entryId) {
      return {
        entry: this.entries.get(entryId),
        analytics: this.analytics.get(entryId)
      };
    }

    // Return overall analytics
    const totalEntries = this.entries.size;
    const totalAccesses = Array.from(this.entries.values())
      .reduce((sum, entry) => sum + entry.usage_metrics.times_accessed, 0);
    
    const popularEntries = Array.from(this.entries.values())
      .sort((a, b) => b.usage_metrics.times_accessed - a.usage_metrics.times_accessed)
      .slice(0, 10);

    return {
      total_entries: totalEntries,
      total_accesses: totalAccesses,
      popular_entries: popularEntries,
      categories: this.getCategoryStats()
    };
  }

  // Get category statistics
  getCategoryStats() {
    const stats = {};
    for (const [id, entry] of this.entries) {
      if (!stats[entry.category]) {
        stats[entry.category] = { count: 0, accesses: 0 };
      }
      stats[entry.category].count++;
      stats[entry.category].accesses += entry.usage_metrics.times_accessed;
    }
    return stats;
  }

  // Search entries by text
  searchEntries(searchText, options = {}) {
    const results = [];
    const searchLower = searchText.toLowerCase();

    for (const [id, entry] of this.entries) {
      let relevance = 0;

      // Search in answer text
      if (entry.answer.toLowerCase().includes(searchLower)) {
        relevance += 5;
      }

      // Search in patterns
      for (const pattern of entry.question_patterns) {
        if (pattern.toLowerCase().includes(searchLower)) {
          relevance += 3;
        }
      }

      // Search in tags
      for (const tag of entry.tags) {
        if (tag.toLowerCase().includes(searchLower)) {
          relevance += 2;
        }
      }

      if (relevance > 0) {
        results.push({ entry, relevance });
      }
    }

    return results
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, options.limit || 50)
      .map(r => r.entry);
  }

  // Export knowledge base
  exportKnowledgeBase() {
    return {
      entries: Array.from(this.entries.values()),
      analytics: Object.fromEntries(this.analytics),
      exported_at: new Date().toISOString(),
      version: "1.0"
    };
  }

  // Import knowledge base
  importKnowledgeBase(data) {
    if (data.entries) {
      this.entries.clear();
      data.entries.forEach(entry => {
        this.entries.set(entry.entry_id, entry);
      });
    }

    if (data.analytics) {
      this.analytics.clear();
      Object.entries(data.analytics).forEach(([key, value]) => {
        this.analytics.set(key, value);
      });
    }

    console.log(`✅ Imported ${this.entries.size} knowledge base entries`);
  }
}