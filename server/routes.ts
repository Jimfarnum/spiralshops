import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStoreSchema, insertRetailerSchema, insertUserSchema, insertSpiralTransactionSchema, insertOrderSchema, insertReviewSchema, insertGiftCardSchema } from "@shared/schema";
import { reviewsStorage } from "./reviewsStorage";
import { giftCardsStorage } from "./giftCardsStorage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Store routes
  app.get("/api/stores", async (req, res) => {
    try {
      const stores = await storage.getStores();
      res.json(stores);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stores" });
    }
  });

  app.get("/api/stores/search", async (req, res) => {
    try {
      const { zipCode } = req.query;
      if (!zipCode || typeof zipCode !== "string") {
        return res.status(400).json({ message: "ZIP code is required" });
      }
      
      const stores = await storage.getStoresByZipCode(zipCode);
      res.json(stores);
    } catch (error) {
      res.status(500).json({ message: "Failed to search stores" });
    }
  });

  app.get("/api/stores/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid store ID" });
      }
      
      const store = await storage.getStore(id);
      if (!store) {
        return res.status(404).json({ message: "Store not found" });
      }
      
      res.json(store);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch store" });
    }
  });

  app.post("/api/stores", async (req, res) => {
    try {
      const validatedData = insertStoreSchema.parse(req.body);
      const store = await storage.createStore(validatedData);
      res.status(201).json(store);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid store data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create store" });
    }
  });

  app.put("/api/stores/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid store ID" });
      }
      
      const validatedData = insertStoreSchema.partial().parse(req.body);
      const store = await storage.updateStore(id, validatedData);
      
      if (!store) {
        return res.status(404).json({ message: "Store not found" });
      }
      
      res.json(store);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid store data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update store" });
    }
  });

  app.delete("/api/stores/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid store ID" });
      }
      
      const deleted = await storage.deleteStore(id);
      if (!deleted) {
        return res.status(404).json({ message: "Store not found" });
      }
      
      res.json({ message: "Store deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete store" });
    }
  });

  // Retailer routes
  app.get("/api/retailers", async (req, res) => {
    try {
      const retailers = await storage.getRetailers();
      res.json(retailers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch retailers" });
    }
  });

  app.get("/api/retailers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid retailer ID" });
      }
      
      const retailer = await storage.getRetailer(id);
      if (!retailer) {
        return res.status(404).json({ message: "Retailer not found" });
      }
      
      res.json(retailer);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch retailer" });
    }
  });

  app.post("/api/retailers", async (req, res) => {
    try {
      const validatedData = insertRetailerSchema.parse(req.body);
      const retailer = await storage.createRetailer(validatedData);
      res.status(201).json(retailer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid retailer data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create retailer" });
    }
  });

  app.put("/api/retailers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid retailer ID" });
      }
      
      const validatedData = insertRetailerSchema.partial().parse(req.body);
      const retailer = await storage.updateRetailer(id, validatedData);
      
      if (!retailer) {
        return res.status(404).json({ message: "Retailer not found" });
      }
      
      res.json(retailer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid retailer data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update retailer" });
    }
  });

  app.delete("/api/retailers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid retailer ID" });
      }
      
      const deleted = await storage.deleteRetailer(id);
      if (!deleted) {
        return res.status(404).json({ message: "Retailer not found" });
      }
      
      res.json({ message: "Retailer deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete retailer" });
    }
  });

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validatedData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  // SPIRAL loyalty routes
  app.get("/api/users/:id/spirals/balance", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const balance = await storage.getUserSpiralBalance(userId);
      res.json({ balance });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch SPIRAL balance" });
    }
  });

  app.get("/api/users/:id/spirals/transactions", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const transactions = await storage.getSpiralTransactions(userId, limit);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch SPIRAL transactions" });
    }
  });

  app.post("/api/users/:id/spirals/transactions", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const transactionData = { ...req.body, userId };
      const validatedData = insertSpiralTransactionSchema.parse(transactionData);
      const transaction = await storage.addSpiralTransaction(validatedData);
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid transaction data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create SPIRAL transaction" });
    }
  });

  // Order routes
  app.post("/api/orders", async (req, res) => {
    try {
      const validatedData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(validatedData);
      
      // Calculate and add SPIRALs earned for this order
      if (order.userId) {
        const source = order.fulfillmentMethod === 'in-store-pickup' ? 'in_person_purchase' : 'online_purchase';
        const spiralsEarned = storage.calculateSpiralsEarned(parseFloat(order.total), source);
        
        if (spiralsEarned > 0) {
          await storage.addSpiralTransaction({
            userId: order.userId,
            type: 'earned',
            amount: spiralsEarned,
            source,
            description: `Earned from order ${order.orderNumber}`,
            orderId: order.orderNumber,
          });
        }
      }
      
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.get("/api/orders/:orderNumber", async (req, res) => {
    try {
      const { orderNumber } = req.params;
      const order = await storage.getOrder(orderNumber);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.get("/api/users/:id/orders", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const orders = await storage.getUserOrders(userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user orders" });
    }
  });

  // Review routes
  app.get("/api/reviews/:reviewType/:targetId", async (req, res) => {
    try {
      const { reviewType, targetId } = req.params;
      if (!['product', 'store'].includes(reviewType)) {
        return res.status(400).json({ message: "Invalid review type" });
      }
      
      const reviews = await reviewsStorage.getReviewsByTarget(reviewType, targetId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    try {
      const validatedData = insertReviewSchema.parse(req.body);
      const review = await reviewsStorage.createReview(validatedData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid review data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  app.post("/api/reviews/:reviewId/helpful", async (req, res) => {
    try {
      const reviewId = parseInt(req.params.reviewId);
      if (isNaN(reviewId)) {
        return res.status(400).json({ message: "Invalid review ID" });
      }
      
      const review = await reviewsStorage.updateReviewHelpfulVotes(reviewId);
      res.json(review);
    } catch (error) {
      res.status(500).json({ message: "Failed to update helpful votes" });
    }
  });

  // Gift card routes
  app.post("/api/gift-cards/purchase", async (req, res) => {
    try {
      const validatedData = insertGiftCardSchema.parse(req.body);
      const giftCard = await giftCardsStorage.createGiftCard(validatedData);
      res.status(201).json(giftCard);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid gift card data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to purchase gift card" });
    }
  });

  app.get("/api/gift-cards/my-cards", async (req, res) => {
    try {
      // Mock user ID for demo - would come from auth
      const userId = 1;
      const giftCards = await giftCardsStorage.getUserGiftCards(userId);
      res.json(giftCards);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch gift cards" });
    }
  });

  app.post("/api/gift-cards/redeem/:code", async (req, res) => {
    try {
      const { code } = req.params;
      const giftCard = await giftCardsStorage.getGiftCardByCode(code);
      
      if (!giftCard) {
        return res.status(404).json({ message: "Gift card not found" });
      }

      if (!giftCard.isActive || parseFloat(giftCard.currentBalance) <= 0) {
        return res.status(400).json({ message: "Gift card is invalid or has been fully used" });
      }

      // For demo, redeem full amount - in real app, would redeem specific amount
      const amount = parseFloat(giftCard.currentBalance);
      const updatedGiftCard = await giftCardsStorage.redeemGiftCard(code, amount);
      
      res.json({ message: "Gift card redeemed successfully", amount });
    } catch (error) {
      res.status(500).json({ message: "Failed to redeem gift card" });
    }
  });

  // Mock mall data endpoint
  app.get("/api/malls", async (req, res) => {
    try {
      // Mock mall data for demo
      const malls = [
        {
          id: 1,
          name: "Downtown Shopping Center",
          city: "New York",
          state: "NY",
          storeCount: 45
        },
        {
          id: 2,
          name: "Westfield Valley Fair",
          city: "San Francisco",
          state: "CA",
          storeCount: 78
        },
        {
          id: 3,
          name: "Mall of America",
          city: "Minneapolis",
          state: "MN",
          storeCount: 120
        }
      ];
      res.json(malls);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch malls" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
