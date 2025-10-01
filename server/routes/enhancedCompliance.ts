// ======================================================
// Enhanced Compliance Router - PostgreSQL Backed
// ======================================================

import express from "express";
import { db } from "../db";
import { users } from "../../shared/schema";
import { eq, desc, and } from "drizzle-orm";
import { z } from "zod";

const router = express.Router();

// Validation schemas
const consentSchema = z.object({
  userId: z.number().int().positive(),
  consentType: z.enum(['terms', 'marketing', 'age_check', 'privacy']),
  version: z.string(),
  status: z.enum(['accepted', 'withdrawn'])
});

const deleteRequestSchema = z.object({
  userId: z.number().int().positive()
});

const auditLogSchema = z.object({
  service: z.string().min(1),
  action: z.string().min(1),
  details: z.any().optional(),
  userId: z.number().int().positive().optional()
});

// ======================
// Record Consent
// ======================
router.post("/consent", async (req, res) => {
  try {
    const validatedData = consentSchema.parse(req.body);
    
    const [consent] = await db
      .insert(consentLogs)
      .values({
        userId: validatedData.userId,
        consentType: validatedData.consentType,
        version: validatedData.version,
        status: validatedData.status
      })
      .returning();

    // Log the consent action for audit trail
    await db
      .insert(auditLogs)
      .values({
        service: 'compliance',
        action: 'consent_recorded',
        details: {
          consentType: validatedData.consentType,
          version: validatedData.version,
          status: validatedData.status
        },
        userId: validatedData.userId
      });

    res.json({ ok: true, consent });
  } catch (err) {
    console.error("Error recording consent:", err);
    
    if (err instanceof z.ZodError) {
      return res.status(400).json({ 
        ok: false, 
        error: "Invalid consent data", 
        details: err.errors 
      });
    }
    
    res.status(500).json({ ok: false, error: "Failed to record consent" });
  }
});

// ======================
// Get User Consent History
// ======================
router.get("/consent/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    const consents = await db
      .select()
      .from(consentLogs)
      .where(eq(consentLogs.userId, parseInt(userId)))
      .orderBy(desc(consentLogs.timestamp));

    res.json({ ok: true, userId, consents });
  } catch (err) {
    console.error("Error fetching consent history:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch consent history" });
  }
});

// ======================
// Request Data Deletion (GDPR)
// ======================
router.post("/delete-request", async (req, res) => {
  try {
    const validatedData = deleteRequestSchema.parse(req.body);
    
    // Check if user exists
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, validatedData.userId));

    if (!user) {
      return res.status(404).json({ ok: false, error: "User not found" });
    }

    // Create deletion request
    const [deleteRequest] = await db
      .insert(dataDeleteionRequests)
      .values({
        userId: validatedData.userId,
        status: 'pending'
      })
      .returning();

    // Log the deletion request for audit trail
    await db
      .insert(auditLogs)
      .values({
        service: 'compliance',
        action: 'deletion_requested',
        details: {
          requestId: deleteRequest.id,
          userEmail: user.email
        },
        userId: validatedData.userId
      });

    res.json({ ok: true, deleteRequest });
  } catch (err) {
    console.error("Error creating deletion request:", err);
    
    if (err instanceof z.ZodError) {
      return res.status(400).json({ 
        ok: false, 
        error: "Invalid deletion request data", 
        details: err.errors 
      });
    }
    
    res.status(500).json({ ok: false, error: "Failed to create deletion request" });
  }
});

// ======================
// Get Deletion Requests (Admin)
// ======================
router.get("/delete-requests", async (req, res) => {
  try {
    const requests = await db
      .select({
        id: dataDeleteionRequests.id,
        userId: dataDeleteionRequests.userId,
        status: dataDeleteionRequests.status,
        requestedAt: dataDeleteionRequests.requestedAt,
        completedAt: dataDeleteionRequests.completedAt,
        userEmail: users.email
      })
      .from(dataDeleteionRequests)
      .leftJoin(users, eq(dataDeleteionRequests.userId, users.id))
      .orderBy(desc(dataDeleteionRequests.requestedAt));

    res.json({ ok: true, deleteRequests: requests });
  } catch (err) {
    console.error("Error fetching deletion requests:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch deletion requests" });
  }
});

// ======================
// Complete Deletion Request (Admin)
// ======================
router.patch("/delete-requests/:requestId/complete", async (req, res) => {
  try {
    const { requestId } = req.params;
    
    const [updatedRequest] = await db
      .update(dataDeleteionRequests)
      .set({ 
        status: 'completed',
        completedAt: new Date()
      })
      .where(eq(dataDeleteionRequests.id, parseInt(requestId)))
      .returning();

    if (!updatedRequest) {
      return res.status(404).json({ ok: false, error: "Deletion request not found" });
    }

    // Log the completion for audit trail
    await db
      .insert(auditLogs)
      .values({
        service: 'compliance',
        action: 'deletion_completed',
        details: {
          requestId: updatedRequest.id,
          userId: updatedRequest.userId
        }
      });

    res.json({ ok: true, deleteRequest: updatedRequest });
  } catch (err) {
    console.error("Error completing deletion request:", err);
    res.status(500).json({ ok: false, error: "Failed to complete deletion request" });
  }
});

// ======================
// Create Audit Log
// ======================
router.post("/audit", async (req, res) => {
  try {
    const validatedData = auditLogSchema.parse(req.body);
    
    const [auditLog] = await db
      .insert(auditLogs)
      .values(validatedData)
      .returning();

    res.json({ ok: true, auditLog });
  } catch (err) {
    console.error("Error creating audit log:", err);
    
    if (err instanceof z.ZodError) {
      return res.status(400).json({ 
        ok: false, 
        error: "Invalid audit log data", 
        details: err.errors 
      });
    }
    
    res.status(500).json({ ok: false, error: "Failed to create audit log" });
  }
});

// ======================
// Get Audit Logs
// ======================
router.get("/audit", async (req, res) => {
  try {
    const { service, action, userId, limit = 100 } = req.query;
    
    let query = db.select().from(auditLogs);
    
    // Apply filters if provided
    const conditions = [];
    if (service) conditions.push(eq(auditLogs.service, service as string));
    if (action) conditions.push(eq(auditLogs.action, action as string));
    if (userId) conditions.push(eq(auditLogs.userId, parseInt(userId as string)));
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    const logs = await query
      .orderBy(desc(auditLogs.timestamp))
      .limit(parseInt(limit as string));

    res.json({ ok: true, auditLogs: logs });
  } catch (err) {
    console.error("Error fetching audit logs:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch audit logs" });
  }
});

// ======================
// Compliance Dashboard
// ======================
router.get("/dashboard", async (req, res) => {
  try {
    // Get consent statistics
    const consentStats = await db
      .select({
        consentType: consentLogs.consentType,
        status: consentLogs.status
      })
      .from(consentLogs);

    // Get deletion request statistics
    const deletionStats = await db
      .select({
        status: dataDeleteionRequests.status
      })
      .from(dataDeleteionRequests);

    // Get recent audit activity
    const recentAudits = await db
      .select()
      .from(auditLogs)
      .orderBy(desc(auditLogs.timestamp))
      .limit(10);

    // Process statistics
    const consentSummary = consentStats.reduce((acc, log) => {
      const key = `${log.consentType}_${log.status}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const deletionSummary = deletionStats.reduce((acc, req) => {
      acc[req.status || 'unknown'] = (acc[req.status || 'unknown'] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dashboard = {
      consent: {
        totalRecords: consentStats.length,
        breakdown: consentSummary
      },
      deletion: {
        totalRequests: deletionStats.length,
        breakdown: deletionSummary
      },
      audit: {
        recentActivity: recentAudits,
        totalLogs: recentAudits.length
      }
    };

    res.json({ ok: true, dashboard });
  } catch (err) {
    console.error("Error fetching compliance dashboard:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch compliance dashboard" });
  }
});

export default router;