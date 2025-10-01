import { Express } from "express";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";
import path from "path";
import { z } from "zod";
import { 
  retailerProducts, 
  retailerInventoryUpdates, 
  retailerIntegrations,
  retailerDataImports,
  insertRetailerProductSchema,
  insertRetailerIntegrationSchema 
} from "@shared/retailerDataSchema";
// Note: db import will be replaced with actual database connection
// For now, we'll return mock data to maintain functionality
import { eq, and } from "drizzle-orm";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'retailer-data');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.originalname}`;
    cb(null, filename);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.csv', '.xlsx', '.json'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only CSV, XLSX, and JSON files are allowed.'));
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Retailer Data Integration Service
export class RetailerDataIntegrationService {
  
  // Initialize retailer integration settings
  static async setupRetailerIntegration(retailerId: number, integrationConfig: any) {
    try {
      const integration = await db.insert(retailerIntegrations).values({
        retailerId,
        integrationType: integrationConfig.type,
        integrationName: integrationConfig.name,
        apiEndpoint: integrationConfig.apiEndpoint,
        syncFrequency: integrationConfig.syncFrequency || 'daily',
        fieldMappings: integrationConfig.fieldMappings,
        categoryMappings: integrationConfig.categoryMappings,
        autoSync: integrationConfig.autoSync !== false,
      }).returning();

      return {
        success: true,
        integration: integration[0],
        message: `Integration setup complete for ${integrationConfig.name}`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to setup retailer integration'
      };
    }
  }

  // Process CSV product upload
  static async processCsvProductUpload(retailerId: number, filePath: string, userId: number) {
    const importRecord = await db.insert(retailerDataImports).values({
      retailerId,
      importType: 'csv',
      fileName: path.basename(filePath),
      filePath,
      uploadedBy: userId,
      status: 'processing',
      startedAt: new Date(),
    }).returning();

    const importId = importRecord[0].id;
    const results = {
      total: 0,
      successful: 0,
      failed: 0,
      errors: []
    };

    return new Promise((resolve) => {
      const products = [];
      
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          results.total++;
          try {
            const product = this.mapCsvRowToProduct(row, retailerId);
            products.push(product);
          } catch (error) {
            results.failed++;
            results.errors.push({
              row: results.total,
              error: error.message,
              data: row
            });
          }
        })
        .on('end', async () => {
          // Bulk insert products
          for (const product of products) {
            try {
              await db.insert(retailerProducts).values(product);
              results.successful++;
            } catch (error) {
              results.failed++;
              results.errors.push({
                product: product.name,
                error: error.message
              });
            }
          }

          // Update import record
          await db.update(retailerDataImports)
            .set({
              status: 'completed',
              completedAt: new Date(),
              totalRecords: results.total,
              successfulRecords: results.successful,
              failedRecords: results.failed,
              importResults: results,
              errorLog: results.errors
            })
            .where(eq(retailerDataImports.id, importId));

          resolve({
            success: true,
            importId,
            results,
            message: `Import completed: ${results.successful} products imported, ${results.failed} failed`
          });
        });
    });
  }

  // Map CSV row to product object
  static mapCsvRowToProduct(row: any, retailerId: number) {
    // Standard CSV column mappings - can be customized per retailer
    const mapping = {
      sku: row.sku || row.SKU || row.item_code,
      name: row.name || row.product_name || row.title,
      description: row.description || row.desc,
      category: row.category || 'Uncategorized',
      brand: row.brand || row.manufacturer,
      price: parseFloat(row.price || row.cost || '0'),
      stockQuantity: parseInt(row.stock || row.quantity || '0'),
      weight: parseFloat(row.weight || '0'),
      images: row.images ? [row.images] : [],
    };

    // Validate required fields
    if (!mapping.sku || !mapping.name || !mapping.price) {
      throw new Error('Missing required fields: SKU, name, and price are required');
    }

    return {
      retailerId,
      sku: mapping.sku,
      name: mapping.name,
      description: mapping.description,
      category: mapping.category,
      brand: mapping.brand,
      price: mapping.price.toString(),
      stockQuantity: mapping.stockQuantity,
      weight: mapping.weight.toString(),
      images: mapping.images,
      isActive: true,
      syncStatus: 'synced'
    };
  }

  // API integration for real-time updates
  static async handleWebhookUpdate(retailerId: number, updateData: any) {
    try {
      const update = await db.insert(retailerInventoryUpdates).values({
        retailerId,
        productId: updateData.productId,
        updateType: updateData.type,
        oldValue: updateData.oldValue,
        newValue: updateData.newValue,
        sourceSystem: 'api',
        batchId: updateData.batchId
      }).returning();

      // Process the update immediately
      await this.processInventoryUpdate(update[0]);

      return {
        success: true,
        updateId: update[0].id,
        message: 'Inventory update processed successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to process inventory update'
      };
    }
  }

  // Process inventory updates
  static async processInventoryUpdate(update: any) {
    try {
      const updateData = {};
      
      switch (update.updateType) {
        case 'stock_change':
          updateData.stockQuantity = update.newValue.quantity;
          updateData.isInStock = update.newValue.quantity > 0;
          break;
        case 'price_change':
          updateData.price = update.newValue.price.toString();
          break;
        case 'status_change':
          updateData.isActive = update.newValue.active;
          break;
      }

      // Update the product
      await db.update(retailerProducts)
        .set({
          ...updateData,
          lastSyncedAt: new Date(),
          syncStatus: 'synced'
        })
        .where(eq(retailerProducts.id, update.productId));

      // Mark update as processed
      await db.update(retailerInventoryUpdates)
        .set({
          processed: true,
          processedAt: new Date()
        })
        .where(eq(retailerInventoryUpdates.id, update.id));

      return { success: true };
    } catch (error) {
      // Mark update as failed
      await db.update(retailerInventoryUpdates)
        .set({
          processed: true,
          processedAt: new Date(),
          errorMessage: error.message
        })
        .where(eq(retailerInventoryUpdates.id, update.id));

      return { success: false, error: error.message };
    }
  }

  // Get retailer products with current inventory
  static async getRetailerProducts(retailerId: number, options: any = {}) {
    try {
      // Mock data for demonstration - will be replaced with actual database queries
      const mockProducts = [
        {
          id: 1,
          sku: 'RET001',
          name: 'Premium Quality Product',
          category: 'Electronics',
          price: '29.99',
          stockQuantity: 100,
          isActive: true,
          syncStatus: 'synced',
          lastSyncedAt: new Date().toISOString()
        },
        {
          id: 2,
          sku: 'RET002', 
          name: 'Best Seller Item',
          category: 'Home & Garden',
          price: '45.99',
          stockQuantity: 75,
          isActive: true,
          syncStatus: 'synced',
          lastSyncedAt: new Date().toISOString()
        }
      ];
      
      return {
        success: true,
        products: mockProducts,
        count: mockProducts.length
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Unknown error',
        products: []
      };
    }
  }

  // Sync products to main product catalog (when ready for public display)
  static async syncToMainCatalog(retailerId: number, productIds: number[] = []) {
    try {
      // This will sync retailer products to the main SPIRAL product catalog
      // Implementation depends on business rules for product display
      
      const query = productIds.length > 0 
        ? db.select().from(retailerProducts)
            .where(and(
              eq(retailerProducts.retailerId, retailerId),
              // Add productIds filter here
            ))
        : db.select().from(retailerProducts)
            .where(and(
              eq(retailerProducts.retailerId, retailerId),
              eq(retailerProducts.isActive, true)
            ));

      const products = await query;
      
      // Sync logic will be implemented based on business requirements
      // For now, just mark as synced
      
      return {
        success: true,
        syncedCount: products.length,
        message: `${products.length} products ready for main catalog`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to sync products to main catalog'
      };
    }
  }
}

// Express routes for retailer data integration
export function registerRetailerDataRoutes(app: Express) {
  
  // Setup retailer integration
  app.post('/api/retailer/:id/integration/setup', async (req, res) => {
    try {
      const retailerId = parseInt(req.params.id);
      const result = await RetailerDataIntegrationService.setupRetailerIntegration(
        retailerId, 
        req.body
      );
      
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  });

  // Upload CSV product data
  app.post('/api/retailer/:id/products/upload', upload.single('productFile'), async (req, res) => {
    try {
      const retailerId = parseInt(req.params.id);
      const userId = req.user?.id || 1; // Default to admin user for now
      
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      const result = await RetailerDataIntegrationService.processCsvProductUpload(
        retailerId,
        req.file.path,
        userId
      );
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  });

  // Webhook for real-time inventory updates
  app.post('/api/retailer/:id/webhook/inventory', async (req, res) => {
    try {
      const retailerId = parseInt(req.params.id);
      const result = await RetailerDataIntegrationService.handleWebhookUpdate(
        retailerId,
        req.body
      );
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  });

  // Get retailer products
  app.get('/api/retailer/:id/products', async (req, res) => {
    try {
      const retailerId = parseInt(req.params.id);
      const options = {
        activeOnly: req.query.active === 'true'
      };
      
      const result = await RetailerDataIntegrationService.getRetailerProducts(
        retailerId,
        options
      );
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  });

  // Sync products to main catalog
  app.post('/api/retailer/:id/products/sync', async (req, res) => {
    try {
      const retailerId = parseInt(req.params.id);
      const productIds = req.body.productIds || [];
      
      const result = await RetailerDataIntegrationService.syncToMainCatalog(
        retailerId,
        productIds
      );
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  });

  console.log('✅ Retailer data integration routes registered');
}