import { pgTable, text, varchar, serial, integer, boolean, decimal, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Retailer Product Management Schema
export const retailerProducts = pgTable("retailer_products", {
  id: serial("id").primaryKey(),
  retailerId: integer("retailer_id").notNull(), // Links to stores.id
  
  // Product Information
  sku: text("sku").notNull(), // Retailer's internal SKU
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  subcategory: text("subcategory"),
  brand: text("brand"),
  
  // Pricing
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  compareAtPrice: decimal("compare_at_price", { precision: 10, scale: 2 }), // MSRP/original price
  costPrice: decimal("cost_price", { precision: 10, scale: 2 }), // Retailer's cost (private)
  
  // Inventory Management
  stockQuantity: integer("stock_quantity").default(0),
  lowStockThreshold: integer("low_stock_threshold").default(5),
  isInStock: boolean("is_in_stock").default(true),
  isActive: boolean("is_active").default(true), // Product listing active/inactive
  
  // Product Details
  weight: decimal("weight", { precision: 8, scale: 2 }), // in pounds
  dimensions: jsonb("dimensions"), // {length, width, height}
  images: text("images").array(), // Array of image URLs
  tags: text("tags").array(), // Product tags for search
  
  // SEO & Marketing
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  slug: text("slug"), // URL-friendly product identifier
  
  // Retailer Integration
  externalId: text("external_id"), // Retailer's system product ID
  lastSyncedAt: timestamp("last_synced_at"),
  syncStatus: text("sync_status").default("pending"), // pending, synced, error
  syncErrors: jsonb("sync_errors"),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Retailer Inventory Updates (for real-time sync)
export const retailerInventoryUpdates = pgTable("retailer_inventory_updates", {
  id: serial("id").primaryKey(),
  retailerId: integer("retailer_id").notNull(),
  productId: integer("product_id").notNull(), // retailer_products.id
  
  // Update Information
  updateType: text("update_type").notNull(), // 'stock_change', 'price_change', 'product_update', 'status_change'
  oldValue: jsonb("old_value"),
  newValue: jsonb("new_value"),
  
  // Integration Details
  sourceSystem: text("source_system"), // 'pos', 'inventory_system', 'manual', 'api'
  batchId: text("batch_id"), // For bulk updates
  
  // Processing
  processed: boolean("processed").default(false),
  processedAt: timestamp("processed_at"),
  errorMessage: text("error_message"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Retailer Integration Settings
export const retailerIntegrations = pgTable("retailer_integrations", {
  id: serial("id").primaryKey(),
  retailerId: integer("retailer_id").notNull(),
  
  // Integration Type
  integrationType: text("integration_type").notNull(), // 'api', 'csv_upload', 'pos_sync', 'manual'
  integrationName: text("integration_name"), // 'Shopify', 'Square', 'Clover', etc.
  
  // API Configuration
  apiEndpoint: text("api_endpoint"),
  apiKey: text("api_key"), // Encrypted
  webhookUrl: text("webhook_url"),
  syncFrequency: text("sync_frequency").default("hourly"), // 'real_time', 'hourly', 'daily', 'manual'
  
  // Data Mapping
  fieldMappings: jsonb("field_mappings"), // Maps retailer fields to SPIRAL fields
  categoryMappings: jsonb("category_mappings"), // Maps retailer categories to SPIRAL categories
  
  // Sync Status
  isActive: boolean("is_active").default(true),
  lastSyncAt: timestamp("last_sync_at"),
  nextSyncAt: timestamp("next_sync_at"),
  syncStatus: text("sync_status").default("pending"), // 'pending', 'syncing', 'completed', 'error'
  syncErrors: jsonb("sync_errors"),
  
  // Configuration
  autoSync: boolean("auto_sync").default(true),
  notifyOnErrors: boolean("notify_on_errors").default(true),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Product Categories (standardized for all retailers)
export const productCategories = pgTable("product_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  parentId: integer("parent_id"), // For subcategories
  level: integer("level").default(0), // 0 = main category, 1 = subcategory, etc.
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  
  // SEO
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Retailer Data Import Logs
export const retailerDataImports = pgTable("retailer_data_imports", {
  id: serial("id").primaryKey(),
  retailerId: integer("retailer_id").notNull(),
  
  // Import Details
  importType: text("import_type").notNull(), // 'csv', 'api', 'manual'
  fileName: text("file_name"),
  filePath: text("file_path"),
  
  // Processing Stats
  totalRecords: integer("total_records").default(0),
  processedRecords: integer("processed_records").default(0),
  successfulRecords: integer("successful_records").default(0),
  failedRecords: integer("failed_records").default(0),
  
  // Status
  status: text("status").default("pending"), // 'pending', 'processing', 'completed', 'failed'
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  
  // Results
  importResults: jsonb("import_results"),
  errorLog: jsonb("error_log"),
  
  // User
  uploadedBy: integer("uploaded_by"), // user_id
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const retailerProductsRelations = relations(retailerProducts, ({ one, many }) => ({
  retailer: one(stores, {
    fields: [retailerProducts.retailerId],
    references: [stores.id]
  }),
  inventoryUpdates: many(retailerInventoryUpdates),
}));

export const retailerIntegrationsRelations = relations(retailerIntegrations, ({ one }) => ({
  retailer: one(stores, {
    fields: [retailerIntegrations.retailerId],
    references: [stores.id]
  }),
}));

// Zod Schemas for API validation
export const insertRetailerProductSchema = createInsertSchema(retailerProducts).omit(['id', 'createdAt', 'updatedAt']);

export const insertRetailerIntegrationSchema = createInsertSchema(retailerIntegrations).omit(['id', 'createdAt', 'updatedAt']);

export const insertProductCategorySchema = createInsertSchema(productCategories).omit(['id', 'createdAt', 'updatedAt']);

// Type exports
export type RetailerProduct = typeof retailerProducts.$inferSelect;
export type InsertRetailerProduct = z.infer<typeof insertRetailerProductSchema>;
export type RetailerIntegration = typeof retailerIntegrations.$inferSelect;
export type InsertRetailerIntegration = z.infer<typeof insertRetailerIntegrationSchema>;
export type ProductCategory = typeof productCategories.$inferSelect;
export type InsertProductCategory = z.infer<typeof insertProductCategorySchema>;

// Import the stores table reference
import { stores } from "./schema";