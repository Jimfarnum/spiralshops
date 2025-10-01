import express from "express";
import { getCloudant } from "../lib/cloudant.js";

const router = express.Router();
const cloudant = getCloudant();

// Default feature set for all malls
const defaultFeatures = {
  onboarding: true,
  verification: true,
  events: true,
  qrCampaigns: true,
  analytics: true,
  aiAssistant: true,
  loyaltyProgram: true,
  socialSharing: true,
  mobilePay: true,
  deliveryTracking: true
};

// Get mall features
router.get("/mall/:mallId/features", async (req, res) => {
  const { mallId } = req.params;
  
  try {
    console.log(`🏪 [Mall Features] Fetching features for mall: ${mallId}`);
    
    const result = await cloudant.find("spiral_mall_features", {
      selector: { mallId: mallId },
      limit: 1
    });
    
    let features = defaultFeatures;
    if (result.result?.docs?.length > 0) {
      features = { ...defaultFeatures, ...result.result.docs[0].features };
    }
    
    console.log(`✅ [Mall Features] Retrieved features for mall ${mallId}:`, features);
    res.json({ ok: true, features, mallId });
  } catch (err: any) {
    console.error(`❌ [Mall Features] Failed to fetch features for mall ${mallId}:`, err);
    // Return default features if database error occurs
    res.json({ ok: true, features: defaultFeatures, mallId, fallback: true });
  }
});

// Update mall features
router.post("/mall/:mallId/features", async (req, res) => {
  const { mallId } = req.params;
  const { features } = req.body;
  
  if (!features || typeof features !== 'object') {
    return res.status(400).json({ 
      ok: false, 
      error: "Invalid features object" 
    });
  }
  
  try {
    console.log(`🏪 [Mall Features] Updating features for mall: ${mallId}`);
    
    // Find existing document
    const existing = await cloudant.find("spiral_mall_features", {
      selector: { mallId: mallId },
      limit: 1
    });
    
    const updatedFeatures = { ...defaultFeatures, ...features };
    
    let mallDoc;
    if (existing.result?.docs?.length > 0) {
      // Update existing document
      mallDoc = existing.result.docs[0];
      mallDoc.features = updatedFeatures;
      mallDoc.lastUpdated = new Date().toISOString();
    } else {
      // Create new document
      mallDoc = {
        _id: `mall_features_${mallId}_${Date.now()}`,
        mallId: mallId,
        features: updatedFeatures,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
    }
    
    const result = await cloudant.insert("spiral_mall_features", mallDoc);
    
    console.log(`✅ [Mall Features] Updated features for mall ${mallId}:`, updatedFeatures);
    res.json({ 
      ok: true, 
      result, 
      features: updatedFeatures,
      mallId 
    });
  } catch (err: any) {
    console.error(`❌ [Mall Features] Failed to update features for mall ${mallId}:`, err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Get all malls with their feature status (admin endpoint)
router.get("/malls/features/summary", async (req, res) => {
  try {
    console.log(`🏪 [Mall Features] Fetching features summary for all malls`);
    
    const result = await cloudant.find("spiral_mall_features", {
      selector: {},
      limit: 100
    });
    
    const summary = result.result?.docs?.map(doc => ({
      mallId: doc.mallId,
      features: doc.features,
      lastUpdated: doc.lastUpdated,
      activeFeatures: Object.values(doc.features || {}).filter(Boolean).length,
      totalFeatures: Object.keys(defaultFeatures).length
    })) || [];
    
    console.log(`✅ [Mall Features] Retrieved summary for ${summary.length} malls`);
    res.json({ 
      ok: true, 
      summary,
      defaultFeatures,
      totalMalls: summary.length
    });
  } catch (err: any) {
    console.error(`❌ [Mall Features] Failed to fetch features summary:`, err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Reset mall features to defaults
router.post("/mall/:mallId/features/reset", async (req, res) => {
  const { mallId } = req.params;
  
  try {
    console.log(`🏪 [Mall Features] Resetting features to defaults for mall: ${mallId}`);
    
    const mallDoc = {
      _id: `mall_features_${mallId}_${Date.now()}_reset`,
      mallId: mallId,
      features: defaultFeatures,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      resetToDefaults: true
    };
    
    const result = await cloudant.insert("spiral_mall_features", mallDoc);
    
    console.log(`✅ [Mall Features] Reset features for mall ${mallId} to defaults`);
    res.json({ 
      ok: true, 
      result, 
      features: defaultFeatures,
      mallId,
      message: "Features reset to defaults"
    });
  } catch (err: any) {
    console.error(`❌ [Mall Features] Failed to reset features for mall ${mallId}:`, err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

console.log("🏪 SPIRAL Mall Features Management routes initialized");
console.log("🚀 Available endpoints: /mall/:mallId/features, /malls/features/summary, /mall/:mallId/features/reset");

export default router;