import express from "express";
import { getCloudant } from "../lib/cloudant.js";

const router = express.Router();
const cloudant = getCloudant();

// 1. Tag all existing records as test (one-time use before launch)
router.post("/kpi/tag-test-data", async (req, res) => {
  try {
    console.log("🏷️ [KPI Reset] Starting test data tagging process...");
    
    // Get all KPI documents from the database
    const result = await cloudant.find("spiral_kpi_metrics", {
      selector: {},
      limit: 1000
    });
    
    if (!result.result?.docs || result.result.docs.length === 0) {
      console.log("⚠️ [KPI Reset] No KPI documents found to tag");
      return res.json({ 
        ok: true, 
        message: "No KPI documents found to tag",
        tagged: 0
      });
    }
    
    let taggedCount = 0;
    const updates = [];
    
    for (const doc of result.result.docs) {
      // Only tag documents that don't already have a mode set
      if (!doc.mode) {
        const updatedDoc = { 
          ...doc, 
          mode: "test", 
          taggedAt: new Date().toISOString()
        };
        updates.push(updatedDoc);
        taggedCount++;
      }
    }
    
    // Bulk update documents if there are any to update
    if (updates.length > 0) {
      for (const doc of updates) {
        await cloudant.insert("spiral_kpi_metrics", doc);
      }
      console.log(`✅ [KPI Reset] Tagged ${taggedCount} documents as test data`);
    } else {
      console.log("ℹ️ [KPI Reset] All documents already have mode tags");
    }
    
    res.json({ 
      ok: true, 
      message: `All untagged docs marked as test (${taggedCount} documents tagged)`,
      tagged: taggedCount,
      total: result.result.docs.length
    });
  } catch (err: any) {
    console.error("❌ [KPI Reset] Failed to tag test data:", err);
    res.status(500).json({ 
      ok: false, 
      error: err.message 
    });
  }
});

// 2. Reset all test data (Admin-only, use on Launch Day)
router.post("/kpi/reset", async (req, res) => {
  try {
    console.log("🚨 [KPI Reset] Starting test data deletion process...");
    
    // Find all documents with mode: "test"
    const result = await cloudant.find("spiral_kpi_metrics", {
      selector: { mode: "test" },
      limit: 1000
    });
    
    if (!result.result?.docs || result.result.docs.length === 0) {
      console.log("ℹ️ [KPI Reset] No test data found to delete");
      return res.json({
        ok: true,
        deleted: 0,
        message: "No test data found to delete. Platform already clean!"
      });
    }
    
    const testDocs = result.result.docs;
    let deletedCount = 0;
    
    // Delete each test document
    for (const doc of testDocs) {
      try {
        await cloudant.delete("spiral_kpi_metrics", doc._id, doc._rev);
        deletedCount++;
      } catch (deleteErr) {
        console.error(`⚠️ [KPI Reset] Failed to delete document ${doc._id}:`, deleteErr);
      }
    }
    
    // Log to SOAP-G system
    console.log(`🧠 [SOAP-G] KPI Reset executed. ${deletedCount} test data records cleared.`);
    console.log(`✅ [KPI Reset] Successfully deleted ${deletedCount} test documents`);
    
    res.json({
      ok: true,
      deleted: deletedCount,
      total: testDocs.length,
      message: `All test data wiped successfully (${deletedCount} records). Platform ready for launch!`
    });
  } catch (err: any) {
    console.error("❌ [KPI Reset] Failed to reset test data:", err);
    res.status(500).json({ 
      ok: false, 
      error: err.message 
    });
  }
});

// 3. Filter queries so test data never shows in dashboards
router.post("/kpi/query", async (req, res) => {
  const { selector = {}, limit = 25 } = req.body;
  
  try {
    console.log("📊 [KPI Reset] Executing filtered KPI query (production only)");
    
    // Force filter: exclude test data, only return production or untagged data
    const filteredSelector = { 
      ...selector, 
      $or: [
        { mode: "production" },
        { mode: { $exists: false } } // Include untagged data for backward compatibility
      ]
    };
    
    const result = await cloudant.find("spiral_kpi_metrics", {
      selector: filteredSelector,
      limit: limit
    });
    
    const docs = result.result?.docs || [];
    console.log(`✅ [KPI Reset] Filtered query returned ${docs.length} production records`);
    
    res.json({
      ok: true,
      count: docs.length,
      docs: docs.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
      mode: "production-only"
    });
  } catch (err: any) {
    console.error("❌ [KPI Reset] Failed to execute filtered query:", err);
    res.status(500).json({ 
      ok: false, 
      error: err.message 
    });
  }
});

// 4. Get reset system status
router.get("/kpi/reset/status", async (req, res) => {
  try {
    console.log("📊 [KPI Reset] Checking reset system status");
    
    // Get counts of test vs production data
    const [testResult, prodResult, untaggedResult] = await Promise.all([
      cloudant.find("spiral_kpi_metrics", { selector: { mode: "test" }, limit: 1000 }),
      cloudant.find("spiral_kpi_metrics", { selector: { mode: "production" }, limit: 1000 }),
      cloudant.find("spiral_kpi_metrics", { selector: { mode: { $exists: false } }, limit: 1000 })
    ]);
    
    const status = {
      testRecords: testResult.result?.docs?.length || 0,
      productionRecords: prodResult.result?.docs?.length || 0,
      untaggedRecords: untaggedResult.result?.docs?.length || 0,
      totalRecords: (testResult.result?.docs?.length || 0) + 
                   (prodResult.result?.docs?.length || 0) + 
                   (untaggedResult.result?.docs?.length || 0),
      isLaunchReady: (testResult.result?.docs?.length || 0) === 0,
      lastChecked: new Date().toISOString()
    };
    
    console.log(`✅ [KPI Reset] Status check complete:`, status);
    
    res.json({
      ok: true,
      status
    });
  } catch (err: any) {
    console.error("❌ [KPI Reset] Failed to get status:", err);
    res.status(500).json({ 
      ok: false, 
      error: err.message 
    });
  }
});

// 5. Mark new data as production (for launch day onwards)
router.post("/kpi/mark-production/:type/:id", async (req, res) => {
  const { type, id } = req.params;
  const validTypes = ["shopper", "retailer", "mall", "city"];
  
  if (!validTypes.includes(type)) {
    return res.status(400).json({
      ok: false,
      error: "Invalid KPI type"
    });
  }
  
  try {
    const docId = `${type}_kpi::${id}`;
    console.log(`🏷️ [KPI Reset] Marking ${docId} as production data`);
    
    // Find the document
    const result = await cloudant.find("spiral_kpi_metrics", {
      selector: { _id: docId },
      limit: 1
    });
    
    if (!result.result?.docs?.length) {
      return res.status(404).json({
        ok: false,
        error: "KPI document not found"
      });
    }
    
    const doc = result.result.docs[0];
    const updatedDoc = {
      ...doc,
      mode: "production",
      markedProductionAt: new Date().toISOString()
    };
    
    await cloudant.insert("spiral_kpi_metrics", updatedDoc);
    console.log(`✅ [KPI Reset] Successfully marked ${docId} as production`);
    
    res.json({
      ok: true,
      id: docId,
      message: "KPI marked as production data"
    });
  } catch (err: any) {
    console.error(`❌ [KPI Reset] Failed to mark ${type}:${id} as production:`, err);
    res.status(500).json({ 
      ok: false, 
      error: err.message 
    });
  }
});

console.log("🚨 SPIRAL KPI Reset System initialized");
console.log("🚀 Available endpoints:");
console.log("   POST /api/kpi/tag-test-data - Tag all existing data as test");
console.log("   POST /api/kpi/reset - Delete all test data (LAUNCH DAY)");
console.log("   POST /api/kpi/query - Query production data only");
console.log("   GET /api/kpi/reset/status - Check reset system status");
console.log("   POST /api/kpi/mark-production/:type/:id - Mark specific KPI as production");

export default router;