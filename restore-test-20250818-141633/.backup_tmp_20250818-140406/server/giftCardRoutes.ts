import type { Express } from "express";
import { z } from "zod";
import { giftCardsStorage } from "./giftCardsStorage";
import { insertGiftCardSchema } from "@shared/schema";

export function registerGiftCardRoutes(app: Express) {
  // Purchase gift card
  app.post("/api/gift-cards/purchase", async (req, res) => {
    try {
      const { senderName, senderEmail, recipientEmail, amount, message, deliveryDate } = req.body;
      
      if (!senderName || !recipientEmail || !amount) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      if (amount < 5 || amount > 1000) {
        return res.status(400).json({ message: "Amount must be between $5 and $1000" });
      }
      
      // Generate unique code
      const code = `SPRL-${Math.random().toString(36).substr(2, 4).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      
      const giftCardData = {
        code,
        senderName,
        senderEmail: senderEmail || null,
        recipientEmail,
        amount: amount.toString(),
        balance: amount.toString(),
        message: message || null,
        status: "active" as const,
        deliveryDate: deliveryDate ? new Date(deliveryDate) : new Date(),
        expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      };
      
      const giftCard = await giftCardsStorage.createGiftCard(giftCardData);
      
      // Send response with created gift card
      res.status(201).json({
        message: "Gift card purchased successfully",
        giftCard: {
          id: giftCard.id,
          code: giftCard.code,
          recipientEmail: giftCard.recipientEmail,
          amount: giftCard.amount,
          balance: giftCard.balance,
          status: giftCard.status,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid gift card data", 
          errors: error.errors 
        });
      }
      console.error("Gift card purchase error:", error);
      res.status(500).json({ message: "Failed to purchase gift card" });
    }
  });

  // Get user's gift cards
  app.get("/api/gift-cards/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const received = await giftCardsStorage.getUserReceivedGiftCards(userId);
      const purchased = await giftCardsStorage.getUserPurchasedGiftCards(userId);
      
      res.json({ received, purchased });
    } catch (error) {
      console.error("Fetch user gift cards error:", error);
      res.status(500).json({ message: "Failed to fetch gift cards" });
    }
  });

  // Redeem gift card
  app.post("/api/gift-cards/redeem", async (req, res) => {
    try {
      const { code, amount, orderId, userId } = req.body;
      
      if (!code || !amount) {
        return res.status(400).json({ message: "Gift card code and amount are required" });
      }

      const giftCard = await giftCardsStorage.getGiftCardByCode(code);
      
      if (!giftCard) {
        return res.status(404).json({ message: "Gift card not found" });
      }

      if (giftCard.status !== 'active') {
        return res.status(400).json({ message: "Gift card is not active" });
      }

      // Convert balance to number for comparison
      const currentBalance = typeof giftCard.balance === 'string' ? parseFloat(giftCard.balance) : giftCard.balance;
      const redemptionAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

      if (currentBalance < redemptionAmount) {
        return res.status(400).json({ 
          message: "Insufficient gift card balance",
          availableBalance: currentBalance,
          requestedAmount: redemptionAmount
        });
      }

      const redemption = await giftCardsStorage.redeemGiftCard(
        giftCard.id, 
        userId || null, 
        redemptionAmount, 
        orderId
      );
      
      const newBalance = currentBalance - redemptionAmount;
      
      res.json({ 
        message: "Gift card redeemed successfully", 
        amountUsed: redemptionAmount,
        remainingBalance: newBalance,
        redemption 
      });
    } catch (error) {
      console.error("Gift card redemption error:", error);
      res.status(500).json({ 
        message: "Failed to redeem gift card",
        error: error.message 
      });
    }
  });

  // Validate gift card
  app.get("/api/gift-cards/validate/:code", async (req, res) => {
    try {
      const { code } = req.params;
      const giftCard = await giftCardsStorage.getGiftCardByCode(code);
      
      if (!giftCard) {
        return res.status(404).json({ message: "Gift card not found" });
      }

      const isValid = giftCard.status === 'active' && parseFloat(giftCard.balance) > 0;
      
      res.json({
        valid: isValid,
        balance: parseFloat(giftCard.balance),
        status: giftCard.status,
        expirationDate: giftCard.expirationDate,
      });
    } catch (error) {
      console.error("Gift card validation error:", error);
      res.status(500).json({ message: "Failed to validate gift card" });
    }
  });

  // Admin routes
  app.get("/api/admin/gift-cards", async (req, res) => {
    try {
      const giftCards = await giftCardsStorage.getAllGiftCards();
      res.json({ giftCards });
    } catch (error) {
      console.error("Admin fetch gift cards error:", error);
      res.status(500).json({ message: "Failed to fetch gift cards" });
    }
  });

  app.post("/api/admin/gift-cards/create", async (req, res) => {
    try {
      const validatedData = insertGiftCardSchema.parse(req.body);
      const giftCard = await giftCardsStorage.createGiftCard(validatedData);
      
      res.status(201).json({
        message: "Gift card created successfully",
        giftCard,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid gift card data", 
          errors: error.errors 
        });
      }
      console.error("Admin create gift card error:", error);
      res.status(500).json({ message: "Failed to create gift card" });
    }
  });

  app.patch("/api/admin/gift-cards/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid gift card ID" });
      }

      if (!['active', 'cancelled', 'expired'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const giftCard = await giftCardsStorage.updateGiftCardStatus(id, status);
      
      if (!giftCard) {
        return res.status(404).json({ message: "Gift card not found" });
      }

      res.json({
        message: "Gift card status updated successfully",
        giftCard,
      });
    } catch (error) {
      console.error("Admin update gift card status error:", error);
      res.status(500).json({ message: "Failed to update gift card status" });
    }
  });
}