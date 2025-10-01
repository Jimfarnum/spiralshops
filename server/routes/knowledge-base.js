// Knowledge Base Management API Routes with Security & Analytics
import express from 'express';
import { getSharedKnowledgeBase } from '../lib/SharedKnowledgeBase.js';

const router = express.Router();

// Token authentication middleware for KB routes
const KB_TOKEN = process.env.KB_TOKEN || "spiral_kb_dev_token";
const authenticateKB = (req, res, next) => {
  // Allow health checks without auth
  if (req.path === '/health') return next();
  
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ") || authHeader.slice(7) !== KB_TOKEN) {
    return res.status(401).json({ 
      success: false, 
      error: "Unauthorized - Valid KB token required" 
    });
  }
  next();
};

// Apply authentication to all routes except health
router.use(authenticateKB);

// Get shared knowledge base instance
const knowledgeBase = getSharedKnowledgeBase();

// Health check endpoint (no auth required)
router.get('/health', (req, res) => {
  try {
    const analytics = knowledgeBase.getAnalytics();
    res.json({ 
      ok: true, 
      entries: analytics.total_entries,
      total_accesses: analytics.total_accesses,
      categories: Object.keys(analytics.categories)
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: "Service unavailable" });
  }
});

// Get all knowledge base entries
router.get('/entries', (req, res) => {
  try {
    const { category, status, limit = 50, offset = 0 } = req.query;
    
    let entries = Array.from(knowledgeBase.entries.values());
    
    // Apply filters
    if (category) {
      entries = entries.filter(entry => entry.category === category);
    }
    
    if (status) {
      entries = entries.filter(entry => entry.status === status);
    }
    
    // Sort by last updated (newest first)
    entries.sort((a, b) => new Date(b.last_updated) - new Date(a.last_updated));
    
    // Apply pagination
    const total = entries.length;
    entries = entries.slice(offset, offset + parseInt(limit));
    
    res.json({
      success: true,
      data: {
        entries,
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          has_more: offset + parseInt(limit) < total
        }
      }
    });
  } catch (error) {
    console.error('KB entries error:', error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Get specific knowledge base entry
router.get('/entries/:entryId', (req, res) => {
  try {
    const { entryId } = req.params;
    const entry = knowledgeBase.getEntry(entryId);
    
    if (!entry) {
      return res.status(404).json({ success: false, error: "Entry not found" });
    }
    
    const analytics = knowledgeBase.getAnalytics(entryId);
    
    res.json({
      success: true,
      data: {
        entry,
        analytics: analytics.analytics
      }
    });
  } catch (error) {
    console.error('KB entry error:', error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Add new knowledge base entry
router.post('/entries', (req, res) => {
  try {
    const entryData = req.body;
    
    // Validate required fields
    if (!entryData.category || !entryData.answer || !entryData.question_patterns) {
      return res.status(400).json({
        success: false,
        error: "Category, answer, and question_patterns are required"
      });
    }
    
    const entry = knowledgeBase.addEntry(entryData);
    
    res.json({
      success: true,
      data: entry,
      message: "Knowledge base entry created successfully"
    });
  } catch (error) {
    console.error('KB add entry error:', error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Update knowledge base entry
router.put('/entries/:entryId', (req, res) => {
  try {
    const { entryId } = req.params;
    const updates = req.body;
    
    const updatedEntry = knowledgeBase.updateEntry(entryId, updates);
    
    if (!updatedEntry) {
      return res.status(404).json({ success: false, error: "Entry not found" });
    }
    
    res.json({
      success: true,
      data: updatedEntry,
      message: "Knowledge base entry updated successfully"
    });
  } catch (error) {
    console.error('KB update entry error:', error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Search knowledge base entries
router.get('/search', (req, res) => {
  try {
    const { q: query, category, limit = 20 } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        error: "Query parameter 'q' is required"
      });
    }
    
    // Search entries
    const results = knowledgeBase.searchEntries(query, { limit: parseInt(limit) });
    
    // Filter by category if specified
    const filteredResults = category 
      ? results.filter(entry => entry.category === category)
      : results;
    
    res.json({
      success: true,
      data: {
        query,
        results: filteredResults,
        total_found: filteredResults.length
      }
    });
  } catch (error) {
    console.error('KB search error:', error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Test pattern matching
router.post('/test-match', (req, res) => {
  try {
    const { input, category } = req.body;
    
    if (!input) {
      return res.status(400).json({
        success: false,
        error: "Input is required"
      });
    }
    
    const match = knowledgeBase.findBestMatch(input, category);
    
    res.json({
      success: true,
      data: {
        input,
        category,
        match: match ? {
          entry_id: match.entry.entry_id,
          answer: match.entry.answer,
          confidence: match.confidence,
          matched_patterns: match.matched_patterns,
          category: match.entry.category
        } : null,
        suggestions: match ? [] : ["Consider adding this as a new knowledge base entry"]
      }
    });
  } catch (error) {
    console.error('KB test match error:', error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Get knowledge base analytics
router.get('/analytics', (req, res) => {
  try {
    const analytics = knowledgeBase.getAnalytics();
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('KB analytics error:', error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Approve pending entry
router.post('/entries/:entryId/approve', (req, res) => {
  try {
    const { entryId } = req.params;
    const { approved_by = "Admin" } = req.body;
    
    const updatedEntry = knowledgeBase.updateEntry(entryId, {
      status: "approved",
      approved_by: approved_by
    });
    
    if (!updatedEntry) {
      return res.status(404).json({ success: false, error: "Entry not found" });
    }
    
    res.json({
      success: true,
      data: updatedEntry,
      message: "Knowledge base entry approved successfully"
    });
  } catch (error) {
    console.error('KB approve error:', error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Export knowledge base
router.get('/export', (req, res) => {
  try {
    const exportData = knowledgeBase.exportKnowledgeBase();
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="spiral-knowledge-base.json"');
    res.json(exportData);
  } catch (error) {
    console.error('KB export error:', error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Import knowledge base
router.post('/import', (req, res) => {
  try {
    const importData = req.body;
    
    if (!importData.entries) {
      return res.status(400).json({
        success: false,
        error: "Import data must contain 'entries' array"
      });
    }
    
    knowledgeBase.importKnowledgeBase(importData);
    
    res.json({
      success: true,
      message: `Successfully imported ${importData.entries.length} knowledge base entries`
    });
  } catch (error) {
    console.error('KB import error:', error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Hit tracking endpoint for usage analytics
router.post('/entries/:entryId/hit', (req, res) => {
  try {
    const { entryId } = req.params;
    const { query = "direct_access" } = req.body;
    
    const entry = knowledgeBase.getEntry(entryId);
    if (!entry) {
      return res.status(404).json({ success: false, error: "Entry not found" });
    }
    
    // Update usage metrics
    knowledgeBase.updateUsageMetrics(entryId, query);
    
    res.json({
      success: true,
      data: {
        entry_id: entryId,
        new_access_count: entry.usage_metrics.times_accessed + 1,
        last_accessed: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('KB hit tracking error:', error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Streamlined pending entries endpoint for admin dashboard
router.get('/pending', (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    let pendingEntries = Array.from(knowledgeBase.entries.values())
      .filter(entry => entry.status === 'pending')
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    const total = pendingEntries.length;
    pendingEntries = pendingEntries.slice(offset, offset + parseInt(limit));
    
    res.json({
      success: true,
      data: {
        pending: pendingEntries,
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          has_more: offset + parseInt(limit) < total
        }
      }
    });
  } catch (error) {
    console.error('KB pending entries error:', error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Fast search endpoint (optimized for Clara/agents)
router.get('/search-fast', (req, res) => {
  try {
    const { q = "", category = "", approved_only = "true" } = req.query;
    
    if (!q.trim()) {
      return res.json({ success: true, results: [] });
    }
    
    // Quick search with basic scoring
    let results = Array.from(knowledgeBase.entries.values());
    
    // Filter by status if requested
    if (approved_only === "true") {
      results = results.filter(entry => entry.status === 'approved');
    }
    
    // Filter by category if specified
    if (category) {
      results = results.filter(entry => entry.category === category);
    }
    
    // Simple text matching and scoring
    const queryLower = q.toLowerCase();
    results = results
      .map(entry => {
        let score = 0;
        
        // Check patterns (highest priority)
        for (const pattern of entry.question_patterns) {
          if (pattern.toLowerCase().includes(queryLower)) score += 10;
        }
        
        // Check answer text
        if (entry.answer.toLowerCase().includes(queryLower)) score += 5;
        
        // Check tags
        for (const tag of entry.tags) {
          if (tag.toLowerCase().includes(queryLower)) score += 3;
        }
        
        return { entry, score };
      })
      .filter(result => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10) // Limit for fast response
      .map(result => ({
        ...result.entry,
        _match_score: result.score
      }));
    
    res.json({
      success: true,
      results,
      query: q,
      category: category || null,
      total_found: results.length
    });
  } catch (error) {
    console.error('KB fast search error:', error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

export default router;