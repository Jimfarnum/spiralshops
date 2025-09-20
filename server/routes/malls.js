import express from "express";
import { getCloudant } from "../lib/cloudant.js";
import crypto from "crypto";
import { z } from "zod";

const router = express.Router();

const mallApplicationSchema = z.object({
  mall_name: z.string(),
  city: z.string(),
  state: z.string(),
  contact: z.object({
    name: z.string(),
    email: z.string().email()
  }),
  wants_spiral_center: z.boolean().optional(),
  square_footage: z.number().optional(),
  anchor_stores: z.array(z.string()).optional(),
  parking_spaces: z.number().optional()
});

// POST /api/malls/apply
router.post('/apply', async (req, res) => {
  try {
    const parsed = mallApplicationSchema.safeParse(req.body);
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
      _id: `mall_app:${appId}`,
      type: "mall_application",
      appId,
      status: "pending_review",
      submittedAt: now,
      updatedAt: now,
      ...parsed.data
    };

    await db.insert('mall_applications', application);

    res.json({
      success: true,
      appId,
      status: "pending_review",
      message: `Application received for ${parsed.data.mall_name}`,
      application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to submit mall application",
      message: error.message
    });
  }
});

// GET /api/malls/applications
router.get('/applications', async (req, res) => {
  try {
    const db = getCloudant();
    const result = await db.find('mall_applications', { 
      selector: { type: "mall_application" }, 
      limit: 100 
    });

    const applications = result.result?.docs || [];

    res.json({
      success: true,
      count: applications.length,
      applications: applications.map(app => ({
        appId: app.appId,
        mall_name: app.mall_name,
        city: app.city,
        state: app.state,
        status: app.status,
        submittedAt: app.submittedAt,
        contact: app.contact,
        wants_spiral_center: app.wants_spiral_center
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to list mall applications",
      message: error.message
    });
  }
});

export default router;