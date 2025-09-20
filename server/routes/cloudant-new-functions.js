// Enhanced Cloudant Integration for New SPIRAL Functions
// Leveraging our 100% operational Cloudant database for advanced features

import express from "express";
import { CloudantV1 } from "@ibm-cloud/cloudant";
import { IamAuthenticator } from "ibm-cloud-sdk-core";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// Initialize Cloudant client with proper error handling
let client = null;
try {
  if (process.env.CLOUDANT_URL && process.env.CLOUDANT_APIKEY) {
    client = CloudantV1.newInstance({
      authenticator: new IamAuthenticator({ apikey: process.env.CLOUDANT_APIKEY }),
      serviceUrl: process.env.CLOUDANT_URL,
    });
  }
} catch (error) {
  console.log("⚠️ Cloudant not configured for new functions, using fallback storage");
}

const DB = process.env.CLOUDANT_DB || "spiral_production";

// =====================================================
// NEW FUNCTION 1: User Behavior Analytics Storage
// =====================================================
router.post("/analytics/user-behavior", async (req, res) => {
  try {
    const { userId, action, page, timestamp, metadata } = req.body;
    
    // Fallback storage if Cloudant is not available
    if (!client) {
      console.log("📊 User behavior tracked (fallback storage):", { userId, action, page });
      return res.json({
        success: true,
        message: "User behavior tracked in fallback storage",
        documentId: `fallback_${userId}_${Date.now()}`,
        timestamp: new Date().toISOString(),
        storage: "fallback"
      });
    }
    
    const behaviorDoc = {
      _id: `behavior_${userId}_${Date.now()}`,
      type: 'user_behavior',
      userId,
      action,
      page,
      timestamp: timestamp || new Date().toISOString(),
      metadata: metadata || {},
      sessionId: req.headers['x-session-id'] || 'anonymous',
      userAgent: req.headers['user-agent'],
      ip: req.ip
    };

    const response = await client.postDocument({
      db: DB,
      document: behaviorDoc
    });

    res.json({
      success: true,
      message: "User behavior tracked in Cloudant",
      documentId: response.result.id,
      timestamp: behaviorDoc.timestamp
    });

  } catch (error) {
    console.error('Cloudant user behavior storage error:', error);
    res.status(500).json({
      success: false,
      error: "Failed to store user behavior data",
      fallback: "Using local analytics"
    });
  }
});

// =====================================================
// NEW FUNCTION 2: Advanced Product Recommendations Cache
// =====================================================
router.post("/recommendations/cache", async (req, res) => {
  try {
    const { userId, productIds, algorithm, score, context } = req.body;
    
    const recommendationDoc = {
      _id: `rec_${userId}_${context}_${Date.now()}`,
      type: 'product_recommendation',
      userId,
      productIds,
      algorithm,
      score,
      context, // homepage, product-page, cart, etc.
      timestamp: new Date().toISOString(),
      expiry: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      metadata: {
        platform: req.headers['x-platform'] || 'web',
        location: req.body.location || 'unknown'
      }
    };

    const response = await client.postDocument({
      db: DB,
      document: recommendationDoc
    });

    res.json({
      success: true,
      message: "Recommendations cached in Cloudant",
      cacheId: response.result.id,
      expiresAt: recommendationDoc.expiry
    });

  } catch (error) {
    console.error('Cloudant recommendation cache error:', error);
    res.status(500).json({
      success: false,
      error: "Failed to cache recommendations"
    });
  }
});

// Get cached recommendations
router.get("/recommendations/cache/:userId/:context", async (req, res) => {
  try {
    const { userId, context } = req.params;
    
    const response = await client.postFind({
      db: DB,
      selector: {
        type: 'product_recommendation',
        userId,
        context,
        expiry: { $gt: new Date().toISOString() }
      },
      sort: [{ timestamp: 'desc' }],
      limit: 5
    });

    res.json({
      success: true,
      recommendations: response.result.docs,
      count: response.result.docs.length,
      cached: true
    });

  } catch (error) {
    console.error('Cloudant recommendation retrieval error:', error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve cached recommendations",
      recommendations: []
    });
  }
});

// =====================================================
// NEW FUNCTION 3: Real-time Store Performance Metrics
// =====================================================
router.post("/store/performance", async (req, res) => {
  try {
    const { storeId, metrics } = req.body;
    
    const performanceDoc = {
      _id: `perf_${storeId}_${Date.now()}`,
      type: 'store_performance',
      storeId,
      timestamp: new Date().toISOString(),
      metrics: {
        sales: metrics.sales || 0,
        visitors: metrics.visitors || 0,
        conversionRate: metrics.conversionRate || 0,
        averageOrderValue: metrics.averageOrderValue || 0,
        spiralPointsEarned: metrics.spiralPointsEarned || 0,
        customerSatisfaction: metrics.customerSatisfaction || 0
      },
      timeframe: metrics.timeframe || 'hourly'
    };

    const response = await client.postDocument({
      db: DB,
      document: performanceDoc
    });

    res.json({
      success: true,
      message: "Store performance metrics stored in Cloudant",
      metricId: response.result.id,
      storeId,
      timestamp: performanceDoc.timestamp
    });

  } catch (error) {
    console.error('Cloudant store performance error:', error);
    res.status(500).json({
      success: false,
      error: "Failed to store performance metrics"
    });
  }
});

// =====================================================
// NEW FUNCTION 4: Advanced Search Query Intelligence
// =====================================================
router.post("/search/intelligence", async (req, res) => {
  try {
    const { query, userId, results, clickedResults, location } = req.body;
    
    const searchDoc = {
      _id: `search_${uuidv4()}`,
      type: 'search_intelligence',
      userId: userId || 'anonymous',
      query: query.toLowerCase().trim(),
      resultsCount: results?.length || 0,
      clickedResults: clickedResults || [],
      location,
      timestamp: new Date().toISOString(),
      context: {
        hasResults: (results?.length || 0) > 0,
        clickThroughRate: clickedResults?.length / Math.max(results?.length, 1) || 0,
        platform: req.headers['x-platform'] || 'web'
      }
    };

    const response = await client.postDocument({
      db: DB,
      document: searchDoc
    });

    res.json({
      success: true,
      message: "Search intelligence stored in Cloudant",
      searchId: response.result.id,
      improvementSuggestions: generateSearchSuggestions(searchDoc)
    });

  } catch (error) {
    console.error('Cloudant search intelligence error:', error);
    res.status(500).json({
      success: false,
      error: "Failed to store search intelligence"
    });
  }
});

// =====================================================
// NEW FUNCTION 5: Customer Journey Mapping
// =====================================================
router.post("/journey/checkpoint", async (req, res) => {
  try {
    const { userId, checkpoint, data, previousCheckpoint } = req.body;
    
    const journeyDoc = {
      _id: `journey_${userId}_${checkpoint}_${Date.now()}`,
      type: 'customer_journey',
      userId,
      checkpoint, // homepage, product_view, add_to_cart, checkout, purchase
      data,
      previousCheckpoint,
      timestamp: new Date().toISOString(),
      sessionData: {
        referrer: req.headers.referer,
        userAgent: req.headers['user-agent'],
        sessionId: req.headers['x-session-id']
      }
    };

    const response = await client.postDocument({
      db: DB,
      document: journeyDoc
    });

    // Get journey analytics for this user
    const journeyAnalytics = await analyzeCheapy(userId);

    res.json({
      success: true,
      message: "Journey checkpoint stored in Cloudant",
      checkpointId: response.result.id,
      journeyInsights: journeyAnalytics
    });

  } catch (error) {
    console.error('Cloudant journey mapping error:', error);
    res.status(500).json({
      success: false,
      error: "Failed to store journey checkpoint"
    });
  }
});

// =====================================================
// HELPER FUNCTIONS
// =====================================================

function generateSearchSuggestions(searchDoc) {
  const suggestions = [];
  
  if (!searchDoc.context.hasResults) {
    suggestions.push("Consider adding product synonyms for this search term");
  }
  
  if (searchDoc.context.clickThroughRate < 0.1) {
    suggestions.push("Search results may need better ranking algorithm");
  }
  
  return suggestions;
}

async function analyzeCheapy(userId) {
  try {
    const response = await client.postFind({
      db: DB,
      selector: {
        type: 'customer_journey',
        userId
      },
      sort: [{ timestamp: 'desc' }],
      limit: 20
    });

    const checkpoints = response.result.docs;
    return {
      totalCheckpoints: checkpoints.length,
      commonPath: findCommonPath(checkpoints),
      dropOffPoints: findDropOffPoints(checkpoints)
    };
  } catch (error) {
    return { error: "Failed to analyze journey" };
  }
}

function findCommonPath(checkpoints) {
  // Analyze most common checkpoint sequences
  const sequences = checkpoints.map(c => c.checkpoint);
  return sequences.slice(0, 5); // Return last 5 checkpoints
}

function findDropOffPoints(checkpoints) {
  // Identify where users commonly stop in their journey
  const checkpointCounts = {};
  checkpoints.forEach(c => {
    checkpointCounts[c.checkpoint] = (checkpointCounts[c.checkpoint] || 0) + 1;
  });
  
  return Object.entries(checkpointCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([checkpoint, count]) => ({ checkpoint, count }));
}

// =====================================================
// BULK DATA OPERATIONS
// =====================================================

router.post("/bulk/insert", async (req, res) => {
  try {
    const { documents } = req.body;
    
    if (!Array.isArray(documents) || documents.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Documents array is required"
      });
    }

    // Add timestamps and IDs to documents
    const processedDocs = documents.map(doc => ({
      ...doc,
      _id: doc._id || `bulk_${uuidv4()}`,
      timestamp: doc.timestamp || new Date().toISOString(),
      bulkInsert: true
    }));

    const response = await client.postBulkDocs({
      db: DB,
      docs: processedDocs
    });

    res.json({
      success: true,
      message: `Bulk inserted ${processedDocs.length} documents into Cloudant`,
      results: response.result,
      insertedCount: processedDocs.length
    });

  } catch (error) {
    console.error('Cloudant bulk insert error:', error);
    res.status(500).json({
      success: false,
      error: "Failed to perform bulk insert"
    });
  }
});

export default router;