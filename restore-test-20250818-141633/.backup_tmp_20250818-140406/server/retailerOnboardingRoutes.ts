import type { Express } from "express";
import multer from "multer";
import { z } from "zod";

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || 
        file.mimetype === 'application/vnd.ms-excel' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      cb(null, true);
    } else {
      cb(new Error('Only CSV and Excel files are allowed'));
    }
  }
});

// Enhanced Retailer Auto-Onboarding with CSV import and API integrations
export function registerRetailerOnboardingRoutes(app: Express) {
  
  // CSV Product Import endpoint
  app.post("/api/retailer/import-csv", upload.single('csvFile'), async (req, res) => {
    try {
      const { retailerId } = req.body;
      
      if (!req.file) {
        return res.status(400).json({ error: "CSV file is required" });
      }

      // Mock CSV processing
      const importResult = {
        success: true,
        importId: `import_${Date.now()}`,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        processingStatus: "completed",
        results: {
          totalRows: 156,
          successfulImports: 142,
          errors: 14,
          warnings: 8
        },
        importedProducts: [
          {
            sku: "PROD-001",
            name: "Wireless Bluetooth Headphones",
            price: 79.99,
            category: "Electronics",
            status: "imported"
          },
          {
            sku: "PROD-002", 
            name: "Organic Coffee Beans",
            price: 24.99,
            category: "Food & Beverage",
            status: "imported"
          }
        ],
        errors: [
          {
            row: 15,
            sku: "PROD-015",
            error: "Invalid price format",
            value: "invalid_price"
          },
          {
            row: 23,
            sku: "PROD-023",
            error: "Missing required field: category",
            value: ""
          }
        ],
        processingTime: "2.3 seconds",
        nextSteps: [
          "Review error reports",
          "Fix data validation issues",
          "Re-import failed products"
        ]
      };

      res.json(importResult);
      
    } catch (error) {
      console.error("CSV import error:", error);
      res.status(500).json({ error: "Import processing failed" });
    }
  });

  // Shopify integration setup
  app.post("/api/retailer/connect-shopify", async (req, res) => {
    try {
      const { retailerId, shopifyStoreUrl, accessToken } = req.body;
      
      if (!retailerId || !shopifyStoreUrl) {
        return res.status(400).json({ error: "Store URL and retailer ID required" });
      }

      // Mock Shopify connection
      const connectionResult = {
        success: true,
        connectionId: `shopify_${Date.now()}`,
        storeUrl: shopifyStoreUrl,
        connectionStatus: "active",
        syncSettings: {
          autoSync: true,
          syncFrequency: "daily",
          syncProducts: true,
          syncInventory: true,
          syncOrders: false
        },
        shopInfo: {
          storeName: "Demo Store",
          productCount: 245,
          lastSync: new Date().toISOString(),
          syncStatus: "up_to_date"
        },
        availableActions: [
          "sync_products",
          "sync_inventory", 
          "setup_webhooks",
          "configure_sync_schedule"
        ]
      };

      res.json(connectionResult);
      
    } catch (error) {
      console.error("Shopify connection error:", error);
      res.status(500).json({ error: "Shopify connection failed" });
    }
  });

  // Square POS integration
  app.post("/api/retailer/connect-square", async (req, res) => {
    try {
      const { retailerId, squareApplicationId, accessToken } = req.body;
      
      if (!retailerId || !squareApplicationId) {
        return res.status(400).json({ error: "Square application ID and retailer ID required" });
      }

      // Mock Square connection
      const connectionResult = {
        success: true,
        connectionId: `square_${Date.now()}`,
        applicationId: squareApplicationId,
        connectionStatus: "active",
        locations: [
          {
            id: "loc_001",
            name: "Main Store Location",
            address: "123 Main St, City, State 12345",
            status: "active"
          }
        ],
        syncCapabilities: {
          inventory: true,
          sales: true,
          customers: true,
          products: true
        },
        lastSync: new Date().toISOString(),
        syncStats: {
          productssynced: 89,
          inventoryUpdates: 156,
          salesRecords: 423
        }
      };

      res.json(connectionResult);
      
    } catch (error) {
      console.error("Square connection error:", error);
      res.status(500).json({ error: "Square connection failed" });
    }
  });

  // Get onboarding progress
  app.get("/api/retailer/:retailerId/onboarding-progress", async (req, res) => {
    try {
      const { retailerId } = req.params;
      
      const progress = {
        retailerId,
        overallProgress: 75,
        steps: [
          {
            id: "business_info",
            name: "Business Information",
            status: "completed",
            completedAt: "2025-01-20T10:00:00Z"
          },
          {
            id: "verification",
            name: "Business Verification",
            status: "completed", 
            completedAt: "2025-01-21T14:30:00Z"
          },
          {
            id: "products_setup",
            name: "Product Catalog Setup",
            status: "in_progress",
            progress: 60,
            nextAction: "Import products via CSV or connect POS system"
          },
          {
            id: "payment_setup",
            name: "Payment & Banking Setup",
            status: "pending",
            requirements: ["Bank account verification", "Tax information"]
          },
          {
            id: "go_live",
            name: "Go Live",
            status: "pending",
            requirements: ["Complete all previous steps", "Store approval"]
          }
        ],
        integrations: {
          shopify: { connected: false, available: true },
          square: { connected: true, lastSync: "2025-01-25T08:00:00Z" },
          csv_import: { available: true, lastImport: "2025-01-24T16:45:00Z" }
        },
        nextSteps: [
          "Complete product catalog setup",
          "Configure payment processing",
          "Submit for final review"
        ],
        supportContact: {
          email: "onboarding@spiral.com",
          phone: "1-800-SPIRAL-1",
          liveChatAvailable: true
        }
      };

      res.json(progress);
      
    } catch (error) {
      console.error("Onboarding progress error:", error);
      res.status(500).json({ error: "Failed to retrieve onboarding progress" });
    }
  });

  // Bulk product template download
  app.get("/api/retailer/csv-template", (req, res) => {
    try {
      // CSV template headers
      const csvTemplate = `SKU,Product Name,Description,Price,Category,Inventory Count,Image URL,Brand,Weight,Dimensions,Tags
PROD-001,Sample Product,Product description here,29.99,Electronics,100,https://example.com/image.jpg,BrandName,1.5 lbs,10x8x2 inches,"tag1,tag2,tag3"
PROD-002,Another Product,Another description,15.50,Home & Garden,50,https://example.com/image2.jpg,BrandName,0.8 lbs,6x4x1 inches,"home,garden"`;

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="spiral_product_template.csv"');
      res.send(csvTemplate);
      
    } catch (error) {
      console.error("Template download error:", error);
      res.status(500).json({ error: "Failed to generate template" });
    }
  });

  // Sync status and management
  app.get("/api/retailer/:retailerId/sync-status", async (req, res) => {
    try {
      const { retailerId } = req.params;
      
      const syncStatus = {
        retailerId,
        integrations: [
          {
            type: "shopify",
            status: "active",
            lastSync: "2025-01-25T12:00:00Z",
            nextSync: "2025-01-26T12:00:00Z",
            syncFrequency: "daily",
            errors: 0,
            warnings: 2,
            recordsSynced: 245
          },
          {
            type: "square",
            status: "active", 
            lastSync: "2025-01-25T08:30:00Z",
            nextSync: "2025-01-25T20:30:00Z",
            syncFrequency: "every_4_hours",
            errors: 1,
            warnings: 0,
            recordsSynced: 89
          },
          {
            type: "csv_import",
            status: "manual",
            lastImport: "2025-01-24T16:45:00Z",
            importCount: 3,
            totalRecordsImported: 456
          }
        ],
        overallHealth: "good",
        recommendations: [
          "Review Shopify sync warnings",
          "Schedule CSV import for new products",
          "Consider enabling real-time inventory sync"
        ]
      };

      res.json(syncStatus);
      
    } catch (error) {
      console.error("Sync status error:", error);
      res.status(500).json({ error: "Failed to retrieve sync status" });
    }
  });

  // Trigger manual sync
  app.post("/api/retailer/:retailerId/trigger-sync", async (req, res) => {
    try {
      const { retailerId } = req.params;
      const { integrationType } = req.body;
      
      if (!integrationType) {
        return res.status(400).json({ error: "Integration type is required" });
      }

      // Mock sync trigger
      const syncResult = {
        success: true,
        syncId: `sync_${Date.now()}`,
        integrationType,
        status: "started",
        estimatedDuration: "5-10 minutes",
        trackingUrl: `/api/retailer/${retailerId}/sync-status/${`sync_${Date.now()}`}`,
        message: `Manual ${integrationType} sync initiated successfully`
      };

      res.json(syncResult);
      
    } catch (error) {
      console.error("Manual sync error:", error);
      res.status(500).json({ error: "Failed to trigger sync" });
    }
  });
}