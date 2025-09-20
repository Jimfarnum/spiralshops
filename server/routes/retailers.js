import { getCloudant } from "../lib/cloudant.js";
import crypto from "crypto";
import { z } from "zod";

const retailerApplicationSchema = z.object({
  business_name: z.string(),
  categories: z.array(z.string()),
  shipping_free_us: z.boolean().optional(),
  shipping_carriers: z.array(z.string()).optional(),
  bopis: z.boolean().optional(),
  pos_sync: z.boolean().optional(),
  gift_cards: z.boolean().optional(),
  returns: z.string().optional(),
  contact: z.object({
    name: z.string(),
    email: z.string().email()
  })
});

export async function applyRetailer(req, res) {
  try {
    // Fix categories if it's received as object with numeric keys (common issue with form data)
    if (req.body.categories && typeof req.body.categories === 'object' && !Array.isArray(req.body.categories)) {
      const categoryKeys = Object.keys(req.body.categories).sort((a, b) => parseInt(a) - parseInt(b));
      req.body.categories = categoryKeys.map(key => req.body.categories[key]);
    }
    
    const parsed = retailerApplicationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid application data",
        details: parsed.error 
      });
    }

    const db = getCloudant();
    const appId = crypto.randomUUID();
    const now = new Date().toISOString();

    const application = {
      _id: `retailer_app:${appId}`,
      type: "retailer_application",
      appId,
      status: "pending_review",
      submittedAt: now,
      updatedAt: now,
      ...parsed.data
    };

    await db.insert('retailer_applications', application);

    res.json({
      success: true,
      appId,
      status: "pending_review",
      message: `Application received for ${parsed.data.business_name}`,
      application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to submit retailer application",
      message: error.message
    });
  }
}

export async function listRetailerApplications(req, res) {
  try {
    const db = getCloudant();
    const result = await db.find('retailer_applications', { 
      selector: { type: "retailer_application" }, 
      limit: 100 
    });

    const applications = result.result?.docs || [];

    res.json({
      success: true,
      count: applications.length,
      applications: applications.map(app => ({
        appId: app.appId,
        business_name: app.business_name,
        categories: app.categories,
        status: app.status,
        submittedAt: app.submittedAt,
        contact: app.contact
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to list retailer applications",
      message: error.message
    });
  }
}