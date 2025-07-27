import { pgTable, varchar, decimal, integer, boolean, timestamp, text, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Shipping Carriers Table
export const shippingCarriers = pgTable("shipping_carriers", {
  id: integer("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  code: varchar("code", { length: 20 }).notNull().unique(), // USPS, UPS, FEDEX, DHL
  apiEndpoint: varchar("api_endpoint", { length: 255 }),
  apiKey: varchar("api_key", { length: 255 }),
  isActive: boolean("is_active").default(true),
  supportsSameDay: boolean("supports_same_day").default(false),
  supportsNextDay: boolean("supports_next_day").default(true),
  supportsInternational: boolean("supports_international").default(false),
  trackingUrlTemplate: varchar("tracking_url_template", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Shipping Services Table (carrier-specific services)
export const shippingServices = pgTable("shipping_services", {
  id: integer("id").primaryKey(),
  carrierId: integer("carrier_id").references(() => shippingCarriers.id),
  serviceName: varchar("service_name", { length: 100 }).notNull(),
  serviceCode: varchar("service_code", { length: 50 }).notNull(),
  estimatedDays: integer("estimated_days").notNull(),
  maxDays: integer("max_days"),
  description: text("description"),
  features: jsonb("features"), // JSON array of features
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

// Shipping Rates Table (dynamic pricing)
export const shippingRates = pgTable("shipping_rates", {
  id: integer("id").primaryKey(),
  serviceId: integer("service_id").references(() => shippingServices.id),
  originZip: varchar("origin_zip", { length: 10 }).notNull(),
  destinationZip: varchar("destination_zip", { length: 10 }).notNull(),
  weightMin: decimal("weight_min", { precision: 10, scale: 2 }).default("0.00"),
  weightMax: decimal("weight_max", { precision: 10, scale: 2 }).notNull(),
  baseCost: decimal("base_cost", { precision: 10, scale: 2 }).notNull(),
  perPoundCost: decimal("per_pound_cost", { precision: 10, scale: 2 }).default("0.00"),
  fuelSurcharge: decimal("fuel_surcharge", { precision: 5, scale: 4 }).default("0.0000"),
  isActive: boolean("is_active").default(true),
  effectiveDate: timestamp("effective_date").defaultNow(),
  expirationDate: timestamp("expiration_date")
});

// Free Shipping Offers Table
export const freeShippingOffers = pgTable("free_shipping_offers", {
  id: integer("id").primaryKey(),
  offeredBy: varchar("offered_by", { length: 50 }).notNull(), // 'retailer', 'manufacturer', 'spiral'
  entityId: integer("entity_id").notNull(), // retailer_id, manufacturer_id, etc.
  entityName: varchar("entity_name", { length: 255 }).notNull(),
  offerType: varchar("offer_type", { length: 50 }).notNull(), // 'minimum_order', 'product_specific', 'promotional'
  minimumOrderValue: decimal("minimum_order_value", { precision: 10, scale: 2 }),
  applicableProducts: jsonb("applicable_products"), // Array of product IDs or categories
  eligibleZipCodes: jsonb("eligible_zip_codes"), // Array of ZIP codes or 'nationwide'
  maxWeight: decimal("max_weight", { precision: 10, scale: 2 }),
  shippingMethods: jsonb("shipping_methods"), // Array of eligible shipping methods
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").default(true),
  terms: text("terms"),
  createdAt: timestamp("created_at").defaultNow()
});

// Shipping Cost Analysis Table (for optimization)
export const shippingCostAnalysis = pgTable("shipping_cost_analysis", {
  id: integer("id").primaryKey(),
  orderId: integer("order_id"),
  productId: integer("product_id").notNull(),
  originZip: varchar("origin_zip", { length: 10 }).notNull(),
  destinationZip: varchar("destination_zip", { length: 10 }).notNull(),
  weight: decimal("weight", { precision: 10, scale: 2 }).notNull(),
  dimensions: jsonb("dimensions"), // {length, width, height}
  optionsEvaluated: integer("options_evaluated").default(0),
  bestCarrierId: integer("best_carrier_id").references(() => shippingCarriers.id),
  bestServiceId: integer("best_service_id").references(() => shippingServices.id),
  bestCost: decimal("best_cost", { precision: 10, scale: 2 }),
  bestEstimatedDays: integer("best_estimated_days"),
  freeShippingApplied: boolean("free_shipping_applied").default(false),
  freeShippingSource: varchar("free_shipping_source", { length: 100 }),
  savingsAmount: decimal("savings_amount", { precision: 10, scale: 2 }).default("0.00"),
  analysisDate: timestamp("analysis_date").defaultNow(),
  criteria: varchar("criteria", { length: 50 }).default("cost_effective"), // 'fastest', 'cost_effective', 'most_reliable'
});

// Shipping Performance Metrics Table
export const shippingMetrics = pgTable("shipping_metrics", {
  id: integer("id").primaryKey(),
  carrierId: integer("carrier_id").references(() => shippingCarriers.id),
  serviceId: integer("service_id").references(() => shippingServices.id),
  route: varchar("route", { length: 50 }), // "55401-55102" zip to zip
  averageCost: decimal("average_cost", { precision: 10, scale: 2 }),
  averageDeliveryDays: decimal("average_delivery_days", { precision: 5, scale: 2 }),
  onTimePercentage: decimal("on_time_percentage", { precision: 5, scale: 2 }),
  damageRate: decimal("damage_rate", { precision: 5, scale: 4 }).default("0.0000"),
  totalShipments: integer("total_shipments").default(0),
  lastUpdated: timestamp("last_updated").defaultNow(),
  monthYear: varchar("month_year", { length: 7 }) // "2025-01" format
});

// Relations
export const shippingCarriersRelations = relations(shippingCarriers, ({ many }) => ({
  services: many(shippingServices),
  metrics: many(shippingMetrics),
  analyses: many(shippingCostAnalysis)
}));

export const shippingServicesRelations = relations(shippingServices, ({ one, many }) => ({
  carrier: one(shippingCarriers, {
    fields: [shippingServices.carrierId],
    references: [shippingCarriers.id]
  }),
  rates: many(shippingRates),
  metrics: many(shippingMetrics),
  analyses: many(shippingCostAnalysis)
}));

export const shippingRatesRelations = relations(shippingRates, ({ one }) => ({
  service: one(shippingServices, {
    fields: [shippingRates.serviceId],
    references: [shippingServices.id]
  })
}));

export const shippingCostAnalysisRelations = relations(shippingCostAnalysis, ({ one }) => ({
  bestCarrier: one(shippingCarriers, {
    fields: [shippingCostAnalysis.bestCarrierId],
    references: [shippingCarriers.id]
  }),
  bestService: one(shippingServices, {
    fields: [shippingCostAnalysis.bestServiceId],
    references: [shippingServices.id]
  })
}));

export const shippingMetricsRelations = relations(shippingMetrics, ({ one }) => ({
  carrier: one(shippingCarriers, {
    fields: [shippingMetrics.carrierId],
    references: [shippingCarriers.id]
  }),
  service: one(shippingServices, {
    fields: [shippingMetrics.serviceId],
    references: [shippingServices.id]
  })
}));

// TypeScript Types
export type ShippingCarrier = typeof shippingCarriers.$inferSelect;
export type InsertShippingCarrier = typeof shippingCarriers.$inferInsert;
export type ShippingService = typeof shippingServices.$inferSelect;
export type InsertShippingService = typeof shippingServices.$inferInsert;
export type ShippingRate = typeof shippingRates.$inferSelect;
export type InsertShippingRate = typeof shippingRates.$inferInsert;
export type FreeShippingOffer = typeof freeShippingOffers.$inferSelect;
export type InsertFreeShippingOffer = typeof freeShippingOffers.$inferInsert;
export type ShippingCostAnalysis = typeof shippingCostAnalysis.$inferSelect;
export type InsertShippingCostAnalysis = typeof shippingCostAnalysis.$inferInsert;
export type ShippingMetrics = typeof shippingMetrics.$inferSelect;
export type InsertShippingMetrics = typeof shippingMetrics.$inferInsert;