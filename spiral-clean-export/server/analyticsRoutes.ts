import type { Express } from "express";
import { analyticsStorage } from "./analyticsStorage";
import { z } from "zod";

export function registerAnalyticsRoutes(app: Express) {
  // Retailer Analytics Routes
  
  // Get retailer dashboard data
  app.get("/api/retailer/:id/analytics", async (req, res) => {
    try {
      const retailerId = parseInt(req.params.id);
      const timeframe = req.query.timeframe as string || "30d";
      
      if (isNaN(retailerId)) {
        return res.status(400).json({ message: "Invalid retailer ID" });
      }

      const dashboardData = await analyticsStorage.getRetailerDashboardData(retailerId, timeframe);
      res.json(dashboardData);
    } catch (error) {
      console.error("Retailer analytics error:", error);
      res.status(500).json({ message: "Failed to fetch retailer analytics" });
    }
  });

  // Get retailer analytics snapshots
  app.get("/api/retailer/:id/analytics/snapshots", async (req, res) => {
    try {
      const retailerId = parseInt(req.params.id);
      const timeframe = req.query.timeframe as string;
      
      if (isNaN(retailerId)) {
        return res.status(400).json({ message: "Invalid retailer ID" });
      }

      const snapshots = await analyticsStorage.getRetailerAnalytics(retailerId, timeframe);
      res.json({ snapshots });
    } catch (error) {
      console.error("Retailer snapshots error:", error);
      res.status(500).json({ message: "Failed to fetch retailer snapshots" });
    }
  });

  // Create retailer analytics snapshot
  app.post("/api/retailer/:id/analytics/snapshot", async (req, res) => {
    try {
      const retailerId = parseInt(req.params.id);
      const { sales, orders, avgOrderValue, repeatCustomers, timeframe } = req.body;
      
      if (isNaN(retailerId)) {
        return res.status(400).json({ message: "Invalid retailer ID" });
      }

      const snapshotData = {
        retailerId,
        sales: parseFloat(sales),
        orders: parseInt(orders),
        avgOrderValue: parseFloat(avgOrderValue),
        repeatCustomers: parseInt(repeatCustomers),
        timeframe: timeframe || "30d"
      };

      const snapshot = await analyticsStorage.createRetailerSnapshot(snapshotData);
      res.status(201).json({ snapshot });
    } catch (error) {
      console.error("Create snapshot error:", error);
      res.status(500).json({ message: "Failed to create analytics snapshot" });
    }
  });

  // Mall Analytics Routes
  
  // Get mall dashboard data
  app.get("/api/mall/:id/analytics", async (req, res) => {
    try {
      const mallId = parseInt(req.params.id);
      
      if (isNaN(mallId)) {
        return res.status(400).json({ message: "Invalid mall ID" });
      }

      const dashboardData = await analyticsStorage.getMallDashboardData(mallId);
      res.json(dashboardData);
    } catch (error) {
      console.error("Mall analytics error:", error);
      res.status(500).json({ message: "Failed to fetch mall analytics" });
    }
  });

  // Get mall analytics history
  app.get("/api/mall/:id/analytics/history", async (req, res) => {
    try {
      const mallId = parseInt(req.params.id);
      const timeframe = req.query.timeframe as string;
      
      if (isNaN(mallId)) {
        return res.status(400).json({ message: "Invalid mall ID" });
      }

      const analytics = await analyticsStorage.getMallAnalytics(mallId, timeframe);
      res.json({ analytics });
    } catch (error) {
      console.error("Mall analytics history error:", error);
      res.status(500).json({ message: "Failed to fetch mall analytics history" });
    }
  });

  // Live Orders Activity Routes
  
  // Get live orders feed
  app.get("/api/live-orders", async (req, res) => {
    try {
      const mallId = req.query.mallId ? parseInt(req.query.mallId as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      
      const liveOrders = await analyticsStorage.getLiveOrders(mallId, limit);
      res.json({ liveOrders });
    } catch (error) {
      console.error("Live orders error:", error);
      res.status(500).json({ message: "Failed to fetch live orders" });
    }
  });

  // Add live order activity
  app.post("/api/live-orders", async (req, res) => {
    try {
      const { orderId, retailerId, mallId, amount, itemCount, customerName } = req.body;
      
      if (!orderId || !retailerId || !amount || !itemCount) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const orderData = {
        orderId,
        retailerId: parseInt(retailerId),
        mallId: mallId ? parseInt(mallId) : null,
        amount: parseFloat(amount),
        itemCount: parseInt(itemCount),
        customerName: customerName || null
      };

      const liveOrder = await analyticsStorage.addLiveOrder(orderData);
      res.status(201).json({ liveOrder });
    } catch (error) {
      console.error("Add live order error:", error);
      res.status(500).json({ message: "Failed to add live order" });
    }
  });

  // Get recent activity
  app.get("/api/analytics/activity", async (req, res) => {
    try {
      const hours = req.query.hours ? parseInt(req.query.hours as string) : 24;
      const activity = await analyticsStorage.getRecentActivity(hours);
      res.json({ activity });
    } catch (error) {
      console.error("Recent activity error:", error);
      res.status(500).json({ message: "Failed to fetch recent activity" });
    }
  });

  // System Alerts Routes
  
  // Get system alerts
  app.get("/api/analytics/alerts", async (req, res) => {
    try {
      const alerts = await analyticsStorage.getSystemAlerts();
      res.json({ alerts });
    } catch (error) {
      console.error("System alerts error:", error);
      res.status(500).json({ message: "Failed to fetch system alerts" });
    }
  });

  // Analytics Export Routes
  
  // Export retailer analytics to CSV
  app.get("/api/retailer/:id/analytics/export", async (req, res) => {
    try {
      const retailerId = parseInt(req.params.id);
      const timeframe = req.query.timeframe as string || "30d";
      
      if (isNaN(retailerId)) {
        return res.status(400).json({ message: "Invalid retailer ID" });
      }

      const analytics = await analyticsStorage.getRetailerAnalytics(retailerId, timeframe);
      
      // Generate CSV content
      const csvHeaders = "Date,Sales,Orders,Avg Order Value,Repeat Customers,Timeframe\n";
      const csvData = analytics.map(record => 
        `${record.createdAt},${record.sales},${record.orders},${record.avgOrderValue},${record.repeatCustomers},${record.timeframe}`
      ).join("\n");
      
      const csvContent = csvHeaders + csvData;
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="retailer-${retailerId}-analytics-${timeframe}.csv"`);
      res.send(csvContent);
    } catch (error) {
      console.error("Export analytics error:", error);
      res.status(500).json({ message: "Failed to export analytics" });
    }
  });

  // Export mall analytics to CSV
  app.get("/api/mall/:id/analytics/export", async (req, res) => {
    try {
      const mallId = parseInt(req.params.id);
      
      if (isNaN(mallId)) {
        return res.status(400).json({ message: "Invalid mall ID" });
      }

      const analytics = await analyticsStorage.getMallAnalytics(mallId);
      
      // Generate CSV content
      const csvHeaders = "Date,Total Revenue,Store Count,Loyalty Members\n";
      const csvData = analytics.map(record => {
        const storeMetrics = JSON.parse(record.storeMetrics as any);
        const loyaltySummary = JSON.parse(record.loyaltySummary as any);
        return `${record.timestamp},${record.totalRevenue},${storeMetrics.length || 0},${loyaltySummary.totalMembers || 0}`;
      }).join("\n");
      
      const csvContent = csvHeaders + csvData;
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="mall-${mallId}-analytics.csv"`);
      res.send(csvContent);
    } catch (error) {
      console.error("Export mall analytics error:", error);
      res.status(500).json({ message: "Failed to export mall analytics" });
    }
  });

  // Health check for analytics services
  app.get("/api/analytics/health", async (req, res) => {
    try {
      const alerts = await analyticsStorage.getSystemAlerts();
      res.json({ 
        status: "healthy", 
        timestamp: new Date().toISOString(),
        alertCount: alerts.length 
      });
    } catch (error) {
      console.error("Analytics health check error:", error);
      res.status(500).json({ 
        status: "unhealthy", 
        timestamp: new Date().toISOString(),
        error: error.message 
      });
    }
  });
}