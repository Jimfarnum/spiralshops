import express from "express";
import QRCode from "qrcode";
import { CloudantV1 } from "@ibm-cloud/cloudant";
import { v4 as uuidv4 } from "uuid";
import soapGReport from "../utils/soapGReport.js";

const router = express.Router();

// Initialize Cloudant with fallback
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
  console.log("⚠️ Cloudant not configured for templates, using fallback storage");
}

const CLOUDANT_DB = process.env.CLOUDANT_DB || "spiral_qr";

// Fallback storage for demo purposes
let fallbackStorage = {
  qr_templates: [],
  template_campaigns: []
};

// SPIRAL SVG Logo for Template QR Codes
const SPIRAL_TEMPLATE_SVG = `
<svg width="80" height="80" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="templateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#10B981;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
    </linearGradient>
  </defs>
  <circle cx="100" cy="100" r="95" stroke="url(#templateGrad)" stroke-width="8" fill="white"/>
  <text x="50%" y="45%" text-anchor="middle" dy=".3em" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="url(#templateGrad)">SPIRAL</text>
  <text x="50%" y="65%" text-anchor="middle" dy=".3em" font-family="Arial, sans-serif" font-size="11" font-weight="normal" fill="#6B7280">Template</text>
</svg>
`.trim();

// Template Catalog - proven retail marketing campaigns
const QR_CAMPAIGN_TEMPLATES = [
  {
    id: "mall-wide-sale",
    name: "Mall-Wide Sale Weekend",
    description: "Drive foot traffic with multi-store discounts this weekend.",
    suggestedIncentive: "Earn 2× SPIRALs + 10% off at participating stores",
    defaultLandingPath: "/welcome?utm_source=qr&utm_campaign=mall_wide_sale",
    suggestedCopy: "This weekend only — support local, save big. Scan to see deals at verified stores and earn 2× SPIRALs.",
    suggestedHashtags: ["#MainStreetRevival", "#EarnSPIRALs", "#ShopLocal"],
    category: "promotional",
    estimatedReach: "High",
    duration: "2-3 days"
  },
  {
    id: "grand-opening",
    name: "Grand Opening",
    description: "Launch a new store with a splash and measurable reach.",
    suggestedIncentive: "First 100 shoppers get bonus SPIRALs + welcome gift",
    defaultLandingPath: "/welcome?utm_source=qr&utm_campaign=grand_opening",
    suggestedCopy: "We're open! Scan to claim your welcome reward and discover opening-day offers.",
    suggestedHashtags: ["#NewInTown", "#LocalLove", "#EarnSPIRALs"],
    category: "event",
    estimatedReach: "Medium",
    duration: "1-2 weeks"
  },
  {
    id: "flash-deal",
    name: "Flash Deal (24h)",
    description: "Time-boxed urgency to clear stock and spike visits.",
    suggestedIncentive: "Limited time: 15% off + SPIRAL bonus today only",
    defaultLandingPath: "/welcome?utm_source=qr&utm_campaign=flash_deal_24h",
    suggestedCopy: "24-hour local deal—scan now to unlock today's rewards and store-only pricing.",
    suggestedHashtags: ["#TodayOnly", "#LocalDeals", "#EarnSPIRALs"],
    category: "promotional",
    estimatedReach: "Medium",
    duration: "1 day"
  },
  {
    id: "seasonal-festival",
    name: "Seasonal Festival",
    description: "Tie into seasonal events with family-friendly traffic.",
    suggestedIncentive: "Kids-eat-free partner promo + double SPIRAL weekends",
    defaultLandingPath: "/welcome?utm_source=qr&utm_campaign=seasonal_festival",
    suggestedCopy: "Celebrate the season with local favorites. Scan for events, treats, and bonus SPIRALs.",
    suggestedHashtags: ["#Seasonal", "#FamilyTime", "#ShopLocal"],
    category: "event",
    estimatedReach: "High",
    duration: "1-2 weeks"
  },
  {
    id: "verified-spotlight",
    name: "Verified Retailer Spotlight",
    description: "Highlight trusted, SPIRAL-verified stores in one campaign.",
    suggestedIncentive: "Extra SPIRALs at verified stores this week",
    defaultLandingPath: "/welcome?utm_source=qr&utm_campaign=verified_spotlight",
    suggestedCopy: "Trust your Main Street. Scan to explore SPIRAL-verified stores and earn extra SPIRALs.",
    suggestedHashtags: ["#VerifiedLocal", "#EarnSPIRALs", "#MainStreetRevival"],
    category: "trust-building",
    estimatedReach: "Medium",
    duration: "1 week"
  },
  {
    id: "holiday-shopping",
    name: "Holiday Shopping Guide",
    description: "Curated local gift guide with bonus rewards for early shoppers.",
    suggestedIncentive: "Holiday bonus: Extra SPIRALs on gifts + free gift wrapping",
    defaultLandingPath: "/welcome?utm_source=qr&utm_campaign=holiday_shopping",
    suggestedCopy: "Find perfect local gifts this holiday season. Scan for curated collections and bonus rewards.",
    suggestedHashtags: ["#HolidayLocal", "#GiftGuide", "#EarnSPIRALs"],
    category: "seasonal",
    estimatedReach: "High",
    duration: "4-6 weeks"
  },
  {
    id: "loyalty-vip",
    name: "VIP Member Exclusive",
    description: "Reward loyal customers with exclusive early access and perks.",
    suggestedIncentive: "VIP only: 20% off + triple SPIRALs + exclusive products",
    defaultLandingPath: "/welcome?utm_source=qr&utm_campaign=vip_exclusive",
    suggestedCopy: "Your loyalty pays off. Scan for VIP-only deals and triple SPIRAL rewards.",
    suggestedHashtags: ["#VIPExclusive", "#LoyaltyRewards", "#EarnSPIRALs"],
    category: "loyalty",
    estimatedReach: "Low",
    duration: "3-5 days"
  },
  {
    id: "community-partnership",
    name: "Community Partnership",
    description: "Partner with local organizations for community-focused campaigns.",
    suggestedIncentive: "Support local causes: Purchase donates to community + bonus SPIRALs",
    defaultLandingPath: "/welcome?utm_source=qr&utm_campaign=community_partnership",
    suggestedCopy: "Shop local, give back. Every purchase supports community programs and earns bonus SPIRALs.",
    suggestedHashtags: ["#CommunityFirst", "#GiveBack", "#ShopLocal"],
    category: "community",
    estimatedReach: "Medium",
    duration: "2-4 weeks"
  }
];

// GET: List all campaign templates
router.get("/templates", async (req, res) => {
  try {
    const { category } = req.query;
    
    let filteredTemplates = QR_CAMPAIGN_TEMPLATES;
    if (category) {
      filteredTemplates = QR_CAMPAIGN_TEMPLATES.filter(t => t.category === category);
    }
    
    res.json({ 
      success: true,
      templates: filteredTemplates,
      categories: [...new Set(QR_CAMPAIGN_TEMPLATES.map(t => t.category))],
      totalTemplates: QR_CAMPAIGN_TEMPLATES.length
    });
  } catch (error) {
    console.error("Templates fetch error:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch campaign templates" 
    });
  }
});

// GET: Get specific template details
router.get("/templates/:templateId", async (req, res) => {
  try {
    const { templateId } = req.params;
    const template = QR_CAMPAIGN_TEMPLATES.find(t => t.id === templateId);
    
    if (!template) {
      return res.status(404).json({
        success: false,
        error: "Template not found"
      });
    }
    
    res.json({
      success: true,
      template
    });
  } catch (error) {
    console.error("Template detail fetch error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch template details"
    });
  }
});

// POST: Create campaign from template
router.post("/create-from-template", async (req, res) => {
  try {
    const {
      templateId,
      ownerType = "mall",
      ownerId,
      campaignName,
      landingPathOverride,
      customIncentive,
      customCopy,
      customHashtags,
      metadata = {},
    } = req.body;

    // Validate template exists
    const template = QR_CAMPAIGN_TEMPLATES.find(t => t.id === templateId);
    if (!template) {
      return res.status(400).json({ 
        success: false,
        error: "Unknown template ID" 
      });
    }

    // Validate required fields
    if (!ownerType || !ownerId) {
      return res.status(400).json({ 
        success: false,
        error: "ownerType and ownerId are required" 
      });
    }

    // Build campaign data
    const finalCampaignName = campaignName || template.name;
    const landingPath = landingPathOverride || template.defaultLandingPath;
    const incentive = customIncentive || template.suggestedIncentive;
    const copy = customCopy || template.suggestedCopy;
    const hashtags = customHashtags || template.suggestedHashtags;
    
    // Create QR link with tracking parameters
    const baseUrl = process.env.REPLIT_DEV_DOMAIN || 'https://spiralshops.com';
    const qrLink = `${baseUrl}${landingPath}&cid=${encodeURIComponent(finalCampaignName)}&owner=${ownerType}:${ownerId}&template=${templateId}`;

    // Generate high-quality QR code with template branding
    const qrOptions = {
      errorCorrectionLevel: "H",
      width: 400,
      margin: 2,
      color: { dark: "#1a202c", light: "#ffffff" }
    };

    // Generate as SVG for logo embedding
    let qrSVG = await QRCode.toString(qrLink, { 
      ...qrOptions, 
      type: 'svg' 
    });

    // Embed SPIRAL template logo
    const logoBase64 = Buffer.from(SPIRAL_TEMPLATE_SVG).toString('base64');
    const logoSize = qrOptions.width * 0.22; // Slightly smaller for templates
    const logoX = (qrOptions.width - logoSize) / 2;
    const logoY = (qrOptions.width - logoSize) / 2;
    
    qrSVG = qrSVG.replace(
      '</svg>',
      `<rect x="${logoX - 8}" y="${logoY - 8}" width="${logoSize + 16}" height="${logoSize + 16}" fill="white" fill-opacity="0.95" rx="6"/>
       <image x="${logoX}" y="${logoY}" width="${logoSize}" height="${logoSize}" href="data:image/svg+xml;base64,${logoBase64}"/>
       </svg>`
    );

    // Convert to base64 data URL
    const qrImage = `data:image/svg+xml;base64,${Buffer.from(qrSVG).toString('base64')}`;

    const createdAt = new Date().toISOString();
    const campaignId = uuidv4();
    
    // Campaign document for storage
    const campaignDoc = {
      type: "qr_template_campaign",
      id: campaignId,
      templateId,
      templateName: template.name,
      templateCategory: template.category,
      ownerType,
      ownerId,
      campaignName: finalCampaignName,
      incentive,
      copy,
      hashtags,
      landingPath,
      qrLink,
      qrImage,
      metadata: {
        ...metadata,
        estimatedReach: template.estimatedReach,
        duration: template.duration,
        createdVia: 'template'
      },
      createdAt,
      status: 'active'
    };

    // Save to storage (Cloudant or fallback)
    if (cloudant) {
      try {
        await cloudant.postDocument({
          db: CLOUDANT_DB,
          document: campaignDoc,
        });
      } catch (cloudantError) {
        console.log("Cloudant template save failed, using fallback:", cloudantError.message);
        fallbackStorage.template_campaigns.push(campaignDoc);
      }
    } else {
      fallbackStorage.template_campaigns.push(campaignDoc);
    }

    // Report to SOAP G for cross-agent coordination
    await soapGReport({
      agent: "MarketingAI",
      action: "QR_TEMPLATE_CAMPAIGN_CREATED",
      data: {
        campaignId,
        templateId,
        templateName: template.name,
        ownerType,
        ownerId,
        campaignName: finalCampaignName,
        qrLink,
        estimatedReach: template.estimatedReach,
        createdAt,
      },
    });

    res.json({
      success: true,
      campaignId,
      qrLink,
      qrImage,
      template: {
        id: template.id,
        name: template.name,
        description: template.description,
        category: template.category,
        estimatedReach: template.estimatedReach,
        duration: template.duration
      },
      campaign: {
        name: finalCampaignName,
        incentive,
        copy,
        hashtags
      },
      message: "Campaign QR code created successfully from template"
    });
  } catch (error) {
    console.error("Template campaign creation error:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to create campaign from template",
      details: error.message 
    });
  }
});

// GET: List campaigns created from templates
router.get("/template-campaigns", async (req, res) => {
  try {
    const { ownerType, ownerId, templateId } = req.query;
    let campaigns = [];

    if (cloudant) {
      try {
        let selector = { type: "qr_template_campaign" };
        
        if (ownerType) selector.ownerType = ownerType;
        if (ownerId) selector.ownerId = ownerId;
        if (templateId) selector.templateId = templateId;

        const result = await cloudant.postFind({
          db: CLOUDANT_DB,
          selector,
          limit: 100,
          sort: [{ createdAt: "desc" }]
        });

        campaigns = result.result.docs;
      } catch (cloudantError) {
        console.log("Cloudant template campaigns fetch failed, using fallback:", cloudantError.message);
        campaigns = fallbackStorage.template_campaigns;
      }
    } else {
      campaigns = fallbackStorage.template_campaigns;
    }

    // Apply client-side filtering for fallback storage
    if (campaigns === fallbackStorage.template_campaigns) {
      if (ownerType) campaigns = campaigns.filter(c => c.ownerType === ownerType);
      if (ownerId) campaigns = campaigns.filter(c => c.ownerId === ownerId);
      if (templateId) campaigns = campaigns.filter(c => c.templateId === templateId);
    }

    res.json({
      success: true,
      campaigns: campaigns.map(c => ({
        id: c.id,
        templateId: c.templateId,
        templateName: c.templateName,
        campaignName: c.campaignName,
        ownerType: c.ownerType,
        ownerId: c.ownerId,
        createdAt: c.createdAt,
        status: c.status,
        qrLink: c.qrLink,
        metadata: c.metadata
      }))
    });
  } catch (error) {
    console.error("Template campaigns fetch error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch template campaigns"
    });
  }
});

export default router;