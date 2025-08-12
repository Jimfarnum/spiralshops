import express from "express";
import QRCode from "qrcode";
import { CloudantV1 } from "@ibm-cloud/cloudant";
import soapGReport from "../utils/soapGReport.js";

const router = express.Router();

// Initialize Cloudant
let cloudant = null;
try {
  if (process.env.CLOUDANT_URL && process.env.CLOUDANT_APIKEY) {
    cloudant = CloudantV1.newInstance({
      authenticator: new CloudantV1.IamAuthenticator({ 
        apikey: process.env.CLOUDANT_APIKEY 
      }),
      serviceUrl: process.env.CLOUDANT_URL,
    });
  }
} catch (error) {
  console.log("⚠️ Cloudant not configured, using fallback storage");
}

const CLOUDANT_DB = process.env.CLOUDANT_DB || "spiral_qr";

// Fallback storage for demo purposes
let fallbackStorage = {
  qr_generated: [],
  qr_scanned: []
};

// Generate QR Code
router.post("/generate-qr", async (req, res) => {
  try {
    const { retailerId, campaignName, shopperId } = req.body;
    const qrData = {
      retailerId,
      campaignName,
      shopperId: shopperId || 'guest',
      createdAt: new Date().toISOString(),
      id: `qr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    const qrLink = `${process.env.REPLIT_DEV_DOMAIN || 'https://spiralshops.com'}/invite?retailer=${retailerId}&campaign=${encodeURIComponent(campaignName)}&ref=qr`;

    const qrImage = await QRCode.toDataURL(qrLink, {
      width: 300,
      margin: 2,
      color: {
        dark: '#1a202c',
        light: '#ffffff'
      }
    });

    const document = {
      type: "qr_generated",
      ...qrData,
      qrLink,
      qrImage,
    };

    // Save QR creation event
    if (cloudant) {
      try {
        await cloudant.postDocument({
          db: CLOUDANT_DB,
          document,
        });
      } catch (cloudantError) {
        console.log("Cloudant save failed, using fallback:", cloudantError.message);
        fallbackStorage.qr_generated.push(document);
      }
    } else {
      fallbackStorage.qr_generated.push(document);
    }

    // Notify SOAP G
    await soapGReport({
      agent: "MarketingAI",
      action: "QR_GENERATED",
      data: qrData,
    });

    res.json({ 
      success: true, 
      qrImage, 
      qrLink, 
      qrId: qrData.id,
      message: "QR code generated successfully"
    });
  } catch (err) {
    console.error("QR generation error:", err);
    res.status(500).json({ 
      success: false,
      error: "Failed to generate QR code",
      details: err.message 
    });
  }
});

// Handle QR Scan
router.get("/scan", async (req, res) => {
  try {
    const { retailer, campaign, ref } = req.query;

    const scanData = {
      type: "qr_scan",
      retailerId: retailer,
      campaignName: campaign,
      referrer: ref || 'direct',
      scannedAt: new Date().toISOString(),
      userAgent: req.get('User-Agent') || 'unknown',
      ip: req.ip || req.connection.remoteAddress,
      id: `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    // Log scan event
    if (cloudant) {
      try {
        await cloudant.postDocument({
          db: CLOUDANT_DB,
          document: scanData,
        });
      } catch (cloudantError) {
        console.log("Cloudant scan log failed, using fallback:", cloudantError.message);
        fallbackStorage.qr_scanned.push(scanData);
      }
    } else {
      fallbackStorage.qr_scanned.push(scanData);
    }

    // Notify SOAP G
    await soapGReport({
      agent: "MarketingAI",
      action: "QR_SCANNED",
      data: { retailer, campaign, ref },
    });

    // Redirect to SPIRAL landing page with campaign context
    const redirectUrl = `${process.env.REPLIT_DEV_DOMAIN || '/'}?utm_source=qr&utm_campaign=${encodeURIComponent(campaign || 'default')}&retailer=${retailer}`;
    res.redirect(redirectUrl);
  } catch (err) {
    console.error("QR scan log error:", err);
    // Always redirect even if logging fails
    res.redirect(process.env.REPLIT_DEV_DOMAIN || '/');
  }
});

// Admin: Get QR Analytics
router.get("/admin/qr-analytics", async (req, res) => {
  try {
    let scans = [];
    let generated = [];

    if (cloudant) {
      try {
        const scanResults = await cloudant.postFind({
          db: CLOUDANT_DB,
          selector: { type: "qr_scan" },
          limit: 1000,
          sort: [{ scannedAt: "desc" }]
        });

        const generatedResults = await cloudant.postFind({
          db: CLOUDANT_DB,
          selector: { type: "qr_generated" },
          limit: 1000,
          sort: [{ createdAt: "desc" }]
        });

        scans = scanResults.result.docs;
        generated = generatedResults.result.docs;
      } catch (cloudantError) {
        console.log("Cloudant analytics failed, using fallback:", cloudantError.message);
        scans = fallbackStorage.qr_scanned;
        generated = fallbackStorage.qr_generated;
      }
    } else {
      scans = fallbackStorage.qr_scanned;
      generated = fallbackStorage.qr_generated;
    }

    // Calculate additional analytics
    const today = new Date().toISOString().split('T')[0];
    const todayScans = scans.filter(scan => scan.scannedAt?.startsWith(today)).length;
    const todayGenerated = generated.filter(qr => qr.createdAt?.startsWith(today)).length;

    // Campaign performance
    const campaignStats = {};
    scans.forEach(scan => {
      const campaign = scan.campaignName || 'Unknown';
      if (!campaignStats[campaign]) {
        campaignStats[campaign] = { scans: 0, generated: 0 };
      }
      campaignStats[campaign].scans++;
    });

    generated.forEach(qr => {
      const campaign = qr.campaignName || 'Unknown';
      if (!campaignStats[campaign]) {
        campaignStats[campaign] = { scans: 0, generated: 0 };
      }
      campaignStats[campaign].generated++;
    });

    res.json({
      success: true,
      totalScans: scans.length,
      totalGenerated: generated.length,
      todayScans,
      todayGenerated,
      campaignStats,
      recentScans: scans.slice(0, 10),
      recentGenerated: generated.slice(0, 10),
      scanRate: generated.length > 0 ? ((scans.length / generated.length) * 100).toFixed(1) : 0,
      storageType: cloudant ? 'cloudant' : 'fallback'
    });
  } catch (err) {
    console.error("QR analytics error:", err);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch QR analytics",
      details: err.message 
    });
  }
});

// Get QR performance for specific retailer
router.get("/retailer/:retailerId/analytics", async (req, res) => {
  try {
    const { retailerId } = req.params;
    let scans = [];
    let generated = [];

    if (cloudant) {
      try {
        const scanResults = await cloudant.postFind({
          db: CLOUDANT_DB,
          selector: { 
            type: "qr_scan",
            retailerId: retailerId
          },
          limit: 500
        });

        const generatedResults = await cloudant.postFind({
          db: CLOUDANT_DB,
          selector: { 
            type: "qr_generated",
            retailerId: retailerId
          },
          limit: 500
        });

        scans = scanResults.result.docs;
        generated = generatedResults.result.docs;
      } catch (cloudantError) {
        scans = fallbackStorage.qr_scanned.filter(scan => scan.retailerId === retailerId);
        generated = fallbackStorage.qr_generated.filter(qr => qr.retailerId === retailerId);
      }
    } else {
      scans = fallbackStorage.qr_scanned.filter(scan => scan.retailerId === retailerId);
      generated = fallbackStorage.qr_generated.filter(qr => qr.retailerId === retailerId);
    }

    res.json({
      success: true,
      retailerId,
      totalScans: scans.length,
      totalGenerated: generated.length,
      scans,
      generated,
      scanRate: generated.length > 0 ? ((scans.length / generated.length) * 100).toFixed(1) : 0
    });
  } catch (err) {
    console.error("Retailer QR analytics error:", err);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch retailer QR analytics" 
    });
  }
});

export default router;