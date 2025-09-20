import { Router, Request, Response } from "express";
import { asyncHandler } from "../middleware/globalResponseFormatter.js";
import { v4 as uuidv4 } from "uuid";
import * as cron from "node-cron";

const router = Router();

// Enhanced campaign state management
// In production, this would be stored in database/Cloudant
let campaignState = {
  active: null as any,
  scheduled: [] as any[],
  adminUnlocked: false
};

// Enhanced campaign scheduling
router.post("/schedule", asyncHandler(async (req: Request, res: Response) => {
  const { launchDate, packs, message, title } = req.body;
  
  const campaign = {
    id: uuidv4(),
    title: title || "SPIRAL National Campaign",
    launchDate: new Date(launchDate),
    packs: packs || ["TikTok Video Pack", "Instagram Graphics Bundle", "Facebook & X Posts", "QR Flyers & Posters", "Email Templates"],
    message: message || "🚀 New SPIRAL campaign materials are ready!",
    status: "scheduled",
    createdAt: new Date(),
    early: [] as string[],
    optOut: [] as any[]
  };
  
  campaignState.scheduled.push(campaign);
  campaignState.active = campaign;
  
  console.log(`[CAMPAIGN SCHEDULER] Campaign "${campaign.title}" scheduled for ${campaign.launchDate.toISOString()}`);
  
  res.json({ 
    success: true, 
    campaign: {
      id: campaign.id,
      title: campaign.title,
      launchDate: campaign.launchDate,
      status: campaign.status
    }
  });
}));

// Get campaign status for specific retailer
router.get("/status/:retailerId?", asyncHandler(async (req: Request, res: Response) => {
  const { retailerId } = req.params;
  const campaign = campaignState.active;
  
  if (!campaign) {
    return res.json({ 
      success: true,
      active: false,
      unlocked: campaignState.adminUnlocked,
      lastUpdated: new Date().toISOString()
    });
  }
  
  const now = new Date();
  const launch = new Date(campaign.launchDate);
  const countdown = Math.max(0, launch.getTime() - now.getTime());
  const isLive = campaign.status === "live" || now >= launch;
  
  const isOptedOut = retailerId ? campaign.optOut.some((opt: any) => opt.retailerId === retailerId) : false;
  const isEarlyAdopter = retailerId ? campaign.early.includes(retailerId) : false;
  
  res.json({ 
    success: true,
    active: true,
    campaignId: campaign.id,
    title: campaign.title,
    status: isLive ? "live" : campaign.status,
    countdown,
    countdownMinutes: Math.floor(countdown / 1000 / 60),
    countdownHours: Math.floor(countdown / 1000 / 60 / 60),
    unlocked: isLive || campaignState.adminUnlocked,
    optedOut: isOptedOut,
    earlyAdopter: isEarlyAdopter,
    launchDate: campaign.launchDate,
    message: campaign.message,
    lastUpdated: new Date().toISOString()
  });
}));

// Preview campaign for early adopters
router.get("/preview/:retailerId", asyncHandler(async (req: Request, res: Response) => {
  const { retailerId } = req.params;
  const campaign = campaignState.active;
  
  if (!campaign || campaign.status === "live") {
    return res.status(404).json({ 
      success: false,
      error: "No preview available. Campaign may be live or not scheduled." 
    });
  }
  
  // Log early adopter access
  if (!campaign.early.includes(retailerId)) {
    campaign.early.push(retailerId);
    console.log(`[CAMPAIGN PREVIEW] Early adopter access: ${retailerId} for campaign ${campaign.id}`);
    
    // SOAP G Log
    await logCampaignAction(campaign.id, retailerId, "preview_access");
  }
  
  const previewAssets = campaign.packs.map((pack: string) => ({
    name: pack,
    preview: `/assets/campaigns/preview/${pack.toLowerCase().replace(/\s+/g, '-')}-preview.jpg`,
    description: `Preview of ${pack}`
  }));
  
  res.json({
    success: true,
    previewAssets,
    campaignTitle: campaign.title,
    message: "🎉 You're getting early access to campaign materials!"
  });
}));

// Opt-out from campaign
router.post("/opt-out/:retailerId", asyncHandler(async (req: Request, res: Response) => {
  const { retailerId } = req.params;
  const { reason } = req.body;
  const campaign = campaignState.active;
  
  if (!campaign) {
    return res.status(404).json({ 
      success: false,
      error: "No active campaign to opt out from." 
    });
  }
  
  // Check if already opted out
  const existingOptOut = campaign.optOut.find((opt: any) => opt.retailerId === retailerId);
  if (existingOptOut) {
    return res.json({
      success: true,
      message: "You have already opted out of this campaign.",
      alreadyOptedOut: true
    });
  }
  
  // Add to opt-out list
  campaign.optOut.push({
    retailerId,
    reason: reason || "Not specified",
    timestamp: new Date().toISOString()
  });
  
  console.log(`[CAMPAIGN OPT-OUT] Retailer ${retailerId} opted out: ${reason}`);
  
  // SOAP G Log
  await logCampaignAction(campaign.id, retailerId, "opt_out", { reason });
  
  res.json({
    success: true,
    message: "You have successfully opted out of this campaign.",
    optOutConfirmed: true
  });
}));

// Get list of available campaigns (enhanced with status checking)
router.get("/list", asyncHandler(async (req: Request, res: Response) => {
  const campaign = campaignState.active;
  const now = new Date();
  
  // Check if campaign should be live based on schedule
  const shouldBeLive = campaign && now >= new Date(campaign.launchDate);
  const isUnlocked = shouldBeLive || campaignState.adminUnlocked;
  
  if (!isUnlocked) {
    return res.status(403).json({ 
      success: false,
      error: "Campaigns are currently locked. Contact SPIRAL Admin.",
      unlocked: false,
      scheduled: campaign ? true : false,
      launchDate: campaign?.launchDate
    });
  }

  const campaigns = [
    {
      name: "TikTok Video Pack",
      download: "/assets/campaigns/tiktok-pack.zip",
      description: "Short-form video templates and trending audio clips"
    },
    {
      name: "Instagram Graphics Bundle",
      download: "/assets/campaigns/instagram-pack.zip",
      description: "Stories, posts, and reels graphics with SPIRAL branding"
    },
    {
      name: "Facebook & X Posts",
      download: "/assets/campaigns/fb-x-pack.zip",
      description: "Social media posts optimized for Facebook and X (Twitter)"
    },
    {
      name: "QR Flyers & Posters",
      download: "/assets/campaigns/qr-flyers.zip",
      description: "Print-ready materials with QR codes for in-store promotion"
    },
    {
      name: "Email Templates",
      download: "/assets/campaigns/email-templates.zip",
      description: "Professional email marketing templates for customer outreach"
    }
  ];

  res.json({
    success: true,
    campaigns,
    total: campaigns.length
  });
}));

// ADMIN CONTROLS - Enhanced with scheduling capabilities

// Manual unlock campaigns for all retailers (immediate launch)
router.post("/admin/unlock", asyncHandler(async (req: Request, res: Response) => {
  campaignState.adminUnlocked = true;
  
  // If there's an active campaign, mark it as live
  if (campaignState.active) {
    campaignState.active.status = "live";
    console.log(`[CAMPAIGN ADMIN] Campaign "${campaignState.active.title}" manually activated`);
    
    // Trigger notifications (would integrate with actual email/push services)
    await sendCampaignNotifications(campaignState.active);
  }
  
  console.log(`[CAMPAIGN ADMIN] Campaigns unlocked at ${new Date().toISOString()}`);
  
  res.json({ 
    success: true, 
    message: "🚀 Social campaigns unlocked for all retailers nationwide!",
    unlocked: true,
    campaignActivated: campaignState.active ? true : false,
    timestamp: new Date().toISOString()
  });
}));

// Lock campaigns
router.post("/admin/lock", asyncHandler(async (req: Request, res: Response) => {
  campaignState.adminUnlocked = false;
  
  console.log(`[CAMPAIGN ADMIN] Campaigns locked at ${new Date().toISOString()}`);
  
  res.json({ 
    success: true, 
    message: "🔒 Social campaigns locked. Retailers will see locked state.",
    unlocked: false,
    timestamp: new Date().toISOString()
  });
}));

// Get comprehensive admin status
router.get("/admin/status", asyncHandler(async (req: Request, res: Response) => {
  const campaign = campaignState.active;
  
  res.json({
    success: true,
    status: {
      unlocked: campaignState.adminUnlocked,
      activeCampaign: campaign ? {
        id: campaign.id,
        title: campaign.title,
        status: campaign.status,
        launchDate: campaign.launchDate,
        earlyAdopters: campaign.early.length,
        optOuts: campaign.optOut.length,
        createdAt: campaign.createdAt
      } : null,
      scheduledCampaigns: campaignState.scheduled.length,
      lastModified: new Date().toISOString(),
      totalCampaignPacks: 5
    }
  });
}));

// Campaign analytics for SOAP G integration
router.get("/analytics/:campaignId?", asyncHandler(async (req: Request, res: Response) => {
  const { campaignId } = req.params;
  const campaign = campaignId ? 
    campaignState.scheduled.find(c => c.id === campaignId) || campaignState.active :
    campaignState.active;
  
  if (!campaign) {
    return res.status(404).json({
      success: false,
      error: "Campaign not found"
    });
  }
  
  res.json({
    success: true,
    analytics: {
      campaignId: campaign.id,
      title: campaign.title,
      status: campaign.status,
      totalEarlyAdopters: campaign.early.length,
      totalOptOuts: campaign.optOut.length,
      optOutReasons: campaign.optOut.reduce((acc: any, opt: any) => {
        acc[opt.reason] = (acc[opt.reason] || 0) + 1;
        return acc;
      }, {}),
      earlyAdopterList: campaign.early,
      launchDate: campaign.launchDate,
      createdAt: campaign.createdAt
    }
  });
}));

// Helper functions
async function logCampaignAction(campaignId: string, retailerId: string, action: string, metadata?: any) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    campaignId,
    retailerId,
    action,
    metadata
  };
  
  console.log(`[SOAP G CAMPAIGN LOG]`, logEntry);
  
  // In production, this would save to Cloudant/database
  return logEntry;
}

async function sendCampaignNotifications(campaign: any) {
  console.log(`[CAMPAIGN NOTIFICATIONS] Sending notifications for campaign: ${campaign.title}`);
  
  // Email simulation
  console.log(`📧 Email: Campaign "${campaign.title}" is now LIVE! Download & Post Now`);
  
  // Push notification simulation  
  console.log(`📱 Push: SPIRAL Campaign LIVE - Download & Post Now`);
  
  // SOAP G logging
  await logCampaignAction(campaign.id, "system", "notifications_sent");
  
  return true;
}

// CRON Job for automatic campaign activation
cron.schedule("*/1 * * * *", async () => {
  try {
    const now = new Date();
    
    // Check scheduled campaigns
    for (const campaign of campaignState.scheduled) {
      if (campaign.status === "scheduled" && new Date(campaign.launchDate) <= now) {
        campaign.status = "live";
        campaignState.adminUnlocked = true;
        
        console.log(`[CRON AUTO-LAUNCH] Campaign "${campaign.title}" automatically activated`);
        
        // Send notifications
        await sendCampaignNotifications(campaign);
        
        // SOAP G logging
        await logCampaignAction(campaign.id, "system", "auto_activated");
      }
    }
  } catch (error) {
    console.error("[CRON ERROR] Failed to process scheduled campaigns:", error);
  }
});

console.log("✅ SPIRAL Campaign CRON scheduler initialized (checks every minute)");

export default router;