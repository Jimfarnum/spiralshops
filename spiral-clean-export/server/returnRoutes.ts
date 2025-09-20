import type { Express } from "express";
import { returnStorage } from "./returnStorage";
import { insertReturnRequestSchema, insertRefundTransactionSchema } from "@shared/schema";
import { z } from "zod";

export function registerReturnRoutes(app: Express): void {
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