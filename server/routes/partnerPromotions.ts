import express from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { db } from '../db';
import { promotionRequests } from '../../shared/schema';
import { evaluatePromotionRequest } from '../utils/promotionValuation';

const router = express.Router();

// Rate limiting for partner requests
const requestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 requests per windowMs
  message: { error: 'Too many promotion requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation schema for promotion requests
const promotionRequestSchema = z.object({
  requesterType: z.enum(['mall', 'retailer', 'card_issuer', 'other']),
  requesterName: z.string().min(2, 'Requester name must be at least 2 characters'),
  requesterId: z.string().optional(),
  contactEmail: z.string().email('Valid email address required'),
  
  desired: z.object({
    multiplier: z.number().int().min(2).max(10),
    startsAt: z.string().datetime(),
    endsAt: z.string().datetime()
  }),
  
  target: z.object({
    categories: z.array(z.string()).optional(),
    storeIds: z.array(z.string()).optional(),
    mallIds: z.array(z.string()).optional()
  }).optional(),
  
  expectedGMV: z.number().nonnegative().default(0),
  sponsorCoveragePct: z.number().min(0).max(100).default(0),
  description: z.string().optional()
});

type PromotionRequestInput = z.infer<typeof promotionRequestSchema>;

// Submit a new promotion request
router.post('/request', requestLimiter, async (req, res) => {
  try {
    const validation = promotionRequestSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request format',
        details: validation.error.flatten()
      });
    }

    const data = validation.data;
    
    // Validate date range
    const startsAt = new Date(data.desired.startsAt);
    const endsAt = new Date(data.desired.endsAt);
    
    if (startsAt >= endsAt) {
      return res.status(400).json({
        success: false,
        error: 'End date must be after start date'
      });
    }
    
    if (startsAt < new Date()) {
      return res.status(400).json({
        success: false,
        error: 'Start date must be in the future'
      });
    }

    // Run AI valuation
    const valuationData = {
      desiredMultiplier: data.desired.multiplier,
      desiredStartsAt: startsAt,
      desiredEndsAt: endsAt,
      expectedGMV: data.expectedGMV,
      sponsorCoveragePct: data.sponsorCoveragePct,
      targetCategories: data.target?.categories,
      targetStoreIds: data.target?.storeIds,
      targetMallIds: data.target?.mallIds
    };
    
    const valuation = evaluatePromotionRequest(valuationData);

    // Insert the request into database
    const [createdRequest] = await db.insert(promotionRequests).values({
      requesterType: data.requesterType,
      requesterName: data.requesterName,
      requesterId: data.requesterId,
      contactEmail: data.contactEmail,
      desiredMultiplier: data.desired.multiplier.toString(),
      desiredStartsAt: startsAt,
      desiredEndsAt: endsAt,
      targetCategories: data.target?.categories || [],
      targetStoreIds: data.target?.storeIds || [],
      targetMallIds: data.target?.mallIds || [],
      expectedGMV: data.expectedGMV.toString(),
      sponsorCoveragePct: data.sponsorCoveragePct.toString(),
      description: data.description,
      valuationScore: valuation.score.toString(),
      valuationRisk: valuation.risk,
      effectiveCostPct: valuation.effectiveCostPct.toString(),
      recommendedMultiplier: valuation.recommendedMultiplier.toString(),
      recommendedDurationDays: valuation.recommendedDurationDays,
      valuationNotes: valuation.notes
    }).returning();

    res.json({
      success: true,
      message: 'Promotion request submitted successfully',
      request: {
        id: createdRequest.id,
        status: createdRequest.status,
        valuation: {
          score: valuation.score,
          risk: valuation.risk,
          effectiveCostPct: valuation.effectiveCostPct,
          recommendations: valuation.notes
        }
      }
    });

  } catch (error) {
    console.error('Error submitting promotion request:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get request status (partners can check their submissions)
router.get('/request/:id/status', async (req, res) => {
  try {
    const requestId = parseInt(req.params.id);
    
    if (isNaN(requestId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request ID'
      });
    }

    const request = await db.query.promotionRequests.findFirst({
      where: (promotionRequests, { eq }) => eq(promotionRequests.id, requestId)
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Request not found'
      });
    }

    // Return public information only
    res.json({
      success: true,
      request: {
        id: request.id,
        status: request.status,
        submittedAt: request.createdAt,
        decidedAt: request.decidedAt,
        reason: request.decisionReason
      }
    });

  } catch (error) {
    console.error('Error retrieving request status:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;