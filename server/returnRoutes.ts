import type { Express } from "express";
import { returnStorage } from "./returnStorage";
import { insertReturnRequestSchema, insertRefundTransactionSchema } from "@shared/schema";
import { z } from "zod";

export function registerReturnRoutes(app: Express): void {
  
  // One-Click Return - Amazon-style instant return initiation
  app.post("/api/returns/one-click", async (req, res) => {
    try {
      const { userId, orderId, productId, reason = 'Not as expected' } = req.body;
      
      if (!userId || !orderId || !productId) {
        return res.status(400).json({
          success: false,
          error: "Missing required return information"
        });
      }

      // Mock order lookup - in real app, get from database
      const mockOrder = {
        id: orderId,
        userId,
        items: [{
          productId,
          name: 'Sample Product',
          price: 2999, // cents
          quantity: 1
        }],
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        status: 'delivered'
      };

      // Auto-approve returns for certain conditions (Amazon-style)
      const autoApprovalConditions = {
        orderAge: Date.now() - new Date(mockOrder.createdAt).getTime() < 30 * 24 * 60 * 60 * 1000, // Within 30 days
        orderValue: mockOrder.items[0].price < 5000, // Under $50
        customerTier: 'premium', // Premium customers get auto-approval
        returnReason: ['damaged', 'wrong_item', 'not_as_described'].includes(reason)
      };

      const shouldAutoApprove = autoApprovalConditions.orderAge && 
                               (autoApprovalConditions.orderValue || 
                                autoApprovalConditions.customerTier === 'premium' ||
                                autoApprovalConditions.returnReason);

      // Create return request
      const returnRequest = {
        id: `return_${Date.now()}`,
        userId,
        orderId,
        productId,
        productName: mockOrder.items[0].name,
        originalAmount: mockOrder.items[0].price,
        reason,
        refundType: 'original',
        status: shouldAutoApprove ? 'approved' : 'pending',
        autoApproved: shouldAutoApprove,
        submittedAt: new Date().toISOString(),
        decisionAt: shouldAutoApprove ? new Date().toISOString() : null,
        decisionNote: shouldAutoApprove ? 'Auto-approved based on order criteria' : null,
        estimatedRefundDate: shouldAutoApprove ? 
          new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() : // 3 days for auto-approved
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()   // 7 days for manual review
      };

      // If auto-approved, process refund immediately
      let refundTransaction = null;
      if (shouldAutoApprove) {
        refundTransaction = {
          id: `refund_${Date.now()}`,
          returnId: returnRequest.id,
          amount: returnRequest.originalAmount,
          method: 'stripe',
          status: 'processing',
          processedAt: new Date().toISOString()
        };
      }

      res.json({
        success: true,
        returnRequest,
        autoApproved: shouldAutoApprove,
        refundTransaction,
        message: shouldAutoApprove ? 
          'Return approved instantly! Refund will be processed within 3 business days.' :
          'Return request submitted. We\'ll review and respond within 24 hours.',
        processingTime: '< 30 seconds'
      });
      
    } catch (error: any) {
      console.error('❌ One-click return error:', error);
      res.status(500).json({
        success: false,
        error: "Error processing return: " + error.message
      });
    }
  });

  // Quick return reasons (Amazon-style preset options)
  app.get("/api/returns/quick-reasons", async (req, res) => {
    try {
      const quickReasons = [
        {
          id: 'damaged',
          title: 'Item arrived damaged',
          description: 'Product was damaged during shipping',
          autoApprove: true,
          refundType: 'original',
          icon: '📦'
        },
        {
          id: 'wrong_item',
          title: 'Wrong item received',
          description: 'This is not what I ordered',
          autoApprove: true,
          refundType: 'original',
          icon: '❌'
        },
        {
          id: 'not_as_described',
          title: 'Not as described',
          description: 'Item does not match the description',
          autoApprove: true,
          refundType: 'original',
          icon: '📝'
        },
        {
          id: 'defective',
          title: 'Defective/doesn\'t work',
          description: 'Product is defective or not functioning',
          autoApprove: true,
          refundType: 'original',
          icon: '⚠️'
        },
        {
          id: 'size_fit',
          title: 'Size/fit issues',
          description: 'Doesn\'t fit as expected',
          autoApprove: false,
          refundType: 'spiral_credit',
          icon: '📏'
        },
        {
          id: 'changed_mind',
          title: 'Changed my mind',
          description: 'No longer need this item',
          autoApprove: false,
          refundType: 'spiral_credit',
          icon: '💭'
        },
        {
          id: 'better_price',
          title: 'Found better price',
          description: 'Found the same item for less elsewhere',
          autoApprove: false,
          refundType: 'spiral_credit',
          icon: '💰'
        },
        {
          id: 'quality_concerns',
          title: 'Quality not as expected',
          description: 'Product quality is below expectations',
          autoApprove: false,
          refundType: 'spiral_credit',
          icon: '⭐'
        }
      ];
      
      res.json({
        success: true,
        reasons: quickReasons
      });
      
    } catch (error: any) {
      console.error('❌ Quick reasons error:', error);
      res.status(500).json({
        success: false,
        error: "Error loading return reasons: " + error.message
      });
    }
  });

  // Instant refund processing (for auto-approved returns)
  app.post("/api/returns/instant-refund", async (req, res) => {
    try {
      const { returnId, refundMethod = 'original' } = req.body;
      
      if (!returnId) {
        return res.status(400).json({
          success: false,
          error: "Return ID is required"
        });
      }

      // Mock refund processing
      const refundTransaction = {
        id: `refund_${Date.now()}`,
        returnId,
        amount: 2999, // Mock amount
        method: refundMethod,
        status: 'completed',
        processedAt: new Date().toISOString(),
        estimatedArrival: refundMethod === 'original' ? 
          new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() : // 3 days for original payment
          'Instant' // Immediate for SPIRAL credit
      };

      res.json({
        success: true,
        refundTransaction,
        message: refundMethod === 'original' ? 
          'Refund processed! You\'ll see the credit in 1-3 business days.' :
          'SPIRAL credit added to your account instantly!',
        processingTime: '< 5 seconds'
      });
      
    } catch (error: any) {
      console.error('❌ Instant refund error:', error);
      res.status(500).json({
        success: false,
        error: "Error processing instant refund: " + error.message
      });
    }
  });
  // Submit return request
  app.post("/api/returns/request", async (req, res) => {
    try {
      const data = insertReturnRequestSchema.parse(req.body);
      const returnRequest = await returnStorage.createReturnRequest(data);
      res.json(returnRequest);
    } catch (error) {
      console.error("Error creating return request:", error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to create return request" 
      });
    }
  });

  // Get user return history/status
  app.get("/api/returns/status", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const returns = await returnStorage.getReturnRequestsByUser(userId);
      res.json(returns);
    } catch (error) {
      console.error("Error fetching return status:", error);
      res.status(500).json({ message: "Failed to fetch return status" });
    }
  });

  // Get eligible orders for return
  app.get("/api/returns/eligible-orders", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const orders = await returnStorage.getEligibleOrdersForReturn(userId);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching eligible orders:", error);
      res.status(500).json({ message: "Failed to fetch eligible orders" });
    }
  });

  // Admin: Get all return requests with optional filters
  app.get("/api/returns/admin/all", async (req, res) => {
    try {
      const status = req.query.status as string | undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      
      const returns = await returnStorage.getAllReturnRequests({ status, limit });
      res.json(returns);
    } catch (error) {
      console.error("Error fetching return requests:", error);
      res.status(500).json({ message: "Failed to fetch return requests" });
    }
  });

  // Admin: Review (approve/reject) return request
  app.post("/api/returns/admin/review", async (req, res) => {
    try {
      const reviewSchema = z.object({
        returnId: z.string(),
        status: z.enum(['approved', 'rejected']),
        decisionNote: z.string().optional(),
        adminUserId: z.string()
      });

      const { returnId, status, decisionNote, adminUserId } = reviewSchema.parse(req.body);
      
      const updated = await returnStorage.updateReturnRequestStatus(
        returnId,
        status,
        decisionNote,
        adminUserId
      );

      if (!updated) {
        return res.status(404).json({ message: "Return request not found" });
      }

      res.json(updated);
    } catch (error) {
      console.error("Error reviewing return request:", error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to review return request" 
      });
    }
  });

  // Trigger refund (Stripe or SPIRAL Points)
  app.post("/api/returns/refund", async (req, res) => {
    try {
      const refundSchema = z.object({
        returnId: z.string(),
        method: z.enum(['stripe', 'spiral_credit'])
      });

      const { returnId, method } = refundSchema.parse(req.body);
      
      const transaction = await returnStorage.processRefund(returnId, method);
      res.json(transaction);
    } catch (error) {
      console.error("Error processing refund:", error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to process refund" 
      });
    }
  });

  // Get refund transactions for a return
  app.get("/api/returns/:returnId/refunds", async (req, res) => {
    try {
      const { returnId } = req.params;
      const transactions = await returnStorage.getRefundTransactionsByReturnId(returnId);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching refund transactions:", error);
      res.status(500).json({ message: "Failed to fetch refund transactions" });
    }
  });

  // Get specific return request details
  app.get("/api/returns/:returnId", async (req, res) => {
    try {
      const { returnId } = req.params;
      const returnRequest = await returnStorage.getReturnRequestById(returnId);
      
      if (!returnRequest) {
        return res.status(404).json({ message: "Return request not found" });
      }

      res.json(returnRequest);
    } catch (error) {
      console.error("Error fetching return request:", error);
      res.status(500).json({ message: "Failed to fetch return request" });
    }
  });
}