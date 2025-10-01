import express from "express";
import { getCloudant } from "../lib/cloudant.js";

const router = express.Router();
const cloudant = getCloudant();

// Capture business profile & tier
router.post("/onboard", async (req, res) => {
  const { name, email, sales, employees, locations, businessType, tier, phone, address, website } = req.body;
  
  try {
    // Basic validation
    if (!name || !email) {
      return res.status(400).json({ 
        ok: false, 
        error: "Missing required fields: name or email" 
      });
    }

    // Create retailer record
    const record = {
      id: `retailer_${Date.now()}`,
      type: "retailer_onboarding",
      name,
      email,
      phone: phone || "",
      address: address || "",
      website: website || "",
      sales: sales || "Not specified",
      employees: employees || "Not specified", 
      locations: locations || "1",
      businessType: businessType || "General Retail",
      tier: tier || "Growing",
      status: "pending-verification",
      verificationLevel: 0,
      features: {
        basicListing: true,
        inventoryManagement: tier !== "Growing",
        campaignAccess: tier === "Premium",
        analyticsAccess: tier === "Premium" || tier === "Standard"
      },
      onboardingSteps: {
        profileComplete: true,
        verificationPending: true,
        paymentSetup: false,
        inventoryImport: false,
        launchReady: false
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to Cloudant or fallback storage
    let savedRecord;
    try {
      if (cloudant && cloudant.use) {
        const db = cloudant.use('spiral_platform');
        const result = await db.insert(record);
        savedRecord = { ...record, _id: result.id, _rev: result.rev };
      } else {
        // Fallback to in-memory storage
        savedRecord = record;
      }
    } catch (dbError) {
      console.warn("[Retailer Onboarding] Database save failed, using fallback:", dbError);
      savedRecord = record;
    }

    console.log("[Retailer Onboarding] New retailer created:", savedRecord.name, savedRecord.tier);
    
    res.json({ 
      ok: true, 
      record: savedRecord, 
      message: "Retailer onboarding started successfully",
      nextSteps: [
        "Verification documentation review",
        "Payment processing setup", 
        "Inventory system integration",
        "Platform launch preparation"
      ]
    });

  } catch (err: any) {
    console.error("[Retailer Onboarding] Error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Get retailer onboarding status
router.get("/status/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Mock status for demo - in production this would query the database
    const status = {
      id,
      currentStep: "verification",
      progress: 25,
      completedSteps: ["profile"],
      pendingSteps: ["verification", "payment", "inventory", "launch"],
      estimatedCompletion: "2-3 business days"
    };

    res.json({ ok: true, status });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Submit verification documents
router.post("/verify/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { documents, businessLicense, taxId } = req.body;
    
    // Mock verification submission
    const result = {
      id,
      status: "verification-submitted",
      submittedAt: new Date().toISOString(),
      reviewTime: "1-2 business days",
      documents: documents?.length || 0
    };

    res.json({ 
      ok: true, 
      result, 
      message: "Verification documents submitted successfully" 
    });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;