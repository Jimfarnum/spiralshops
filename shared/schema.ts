import { pgTable, text, varchar, serial, integer, boolean, decimal, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const stores = pgTable("stores", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  zipCode: text("zip_code").notNull(),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("0.0"),
  reviewCount: integer("review_count").default(0),
  isOpen: boolean("is_open").default(true),
  hours: text("hours"),
  imageUrl: text("image_url"),
  perks: text("perks").array(),
});

export const retailers = pgTable("retailers", {
  id: serial("id").primaryKey(),
  businessName: text("business_name").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  zipCode: text("zip_code").notNull(),
  approved: boolean("approved").default(false),
});

export const insertStoreSchema = createInsertSchema(stores).omit({
  id: true,
  rating: true,
  reviewCount: true,
});

export const insertRetailerSchema = createInsertSchema(retailers).omit({
  id: true,
  approved: true,
});

// Users table for authentication and loyalty tracking
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  spiralBalance: integer("spiral_balance").default(0),
  totalEarned: integer("total_earned").default(0),
  totalRedeemed: integer("total_redeemed").default(0),
  inviteCode: text("invite_code").unique(),
  referredBy: text("referred_by"),
  totalReferrals: integer("total_referrals").default(0),
  referralEarnings: integer("referral_earnings").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// SPIRAL transactions for tracking earning and redemption
export const spiralTransactions = pgTable("spiral_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // 'earned' or 'redeemed'
  amount: integer("amount").notNull(),
  source: text("source").notNull(), // 'online_purchase', 'in_person_purchase', 'sharing', 'referral', 'event', 'bonus'
  description: text("description").notNull(),
  orderId: text("order_id"), // optional reference to order
  storeId: integer("store_id").references(() => stores.id),
  mallId: text("mall_id"), // for mall-specific bonuses
  eventId: integer("event_id"), // for event-based bonuses
  multiplier: decimal("multiplier", { precision: 3, scale: 2 }).default("1.00"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Orders table for purchase tracking with split fulfillment support
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  userId: integer("user_id").references(() => users.id),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: text("status").default('pending'), // 'pending', 'confirmed', 'shipped', 'delivered', 'completed'
  spiralsEarned: integer("spirals_earned").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Order items table for individual products in orders with separate fulfillment
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id),
  productId: text("product_id").notNull(),
  productName: text("product_name").notNull(),
  productPrice: decimal("product_price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull(),
  storeId: integer("store_id").references(() => stores.id),
  storeName: text("store_name").notNull(),
  fulfillmentMethod: text("fulfillment_method").notNull(), // 'ship-to-me', 'in-store-pickup', 'ship-to-mall'
  fulfillmentStatus: text("fulfillment_status").default('processing'), // 'processing', 'ready', 'shipped', 'delivered', 'picked-up'
  estimatedDelivery: text("estimated_delivery"), // e.g., "Ready today for pickup", "Ships in 2 days"
  trackingNumber: text("tracking_number"),
  mallId: integer("mall_id"),
  mallName: text("mall_name"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Fulfillment groups table for optimized shipping logic
export const fulfillmentGroups = pgTable("fulfillment_groups", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id),
  fulfillmentMethod: text("fulfillment_method").notNull(),
  storeId: integer("store_id").references(() => stores.id),
  mallId: integer("mall_id"),
  groupTotal: decimal("group_total", { precision: 10, scale: 2 }).notNull(),
  shippingCost: decimal("shipping_cost", { precision: 10, scale: 2 }).default("0.00"),
  estimatedDelivery: text("estimated_delivery").notNull(),
  status: text("status").default('processing'),
  trackingNumber: text("tracking_number"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User Follows table for retailer favorites/follow system
export const userFollows = pgTable("user_follows", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  retailerId: integer("retailer_id").notNull().references(() => retailers.id, { onDelete: "cascade" }),
  followedAt: timestamp("followed_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  spiralTransactions: many(spiralTransactions),
  orders: many(orders),
  follows: many(userFollows),
}));

export const spiralTransactionsRelations = relations(spiralTransactions, ({ one }) => ({
  user: one(users, {
    fields: [spiralTransactions.userId],
    references: [users.id],
  }),
  store: one(stores, {
    fields: [spiralTransactions.storeId],
    references: [stores.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  orderItems: many(orderItems),
  fulfillmentGroups: many(fulfillmentGroups),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  store: one(stores, {
    fields: [orderItems.storeId],
    references: [stores.id],
  }),
}));

export const fulfillmentGroupsRelations = relations(fulfillmentGroups, ({ one }) => ({
  order: one(orders, {
    fields: [fulfillmentGroups.orderId],
    references: [orders.id],
  }),
  store: one(stores, {
    fields: [fulfillmentGroups.storeId],
    references: [stores.id],
  }),
}));

export const userFollowsRelations = relations(userFollows, ({ one }) => ({
  user: one(users, {
    fields: [userFollows.userId],
    references: [users.id],
  }),
  retailer: one(retailers, {
    fields: [userFollows.retailerId],
    references: [retailers.id],
  }),
}));

export const retailersRelations = relations(retailers, ({ many }) => ({
  followers: many(userFollows),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  spiralBalance: true,
  totalEarned: true,
  totalRedeemed: true,
  createdAt: true,
});

export const insertSpiralTransactionSchema = createInsertSchema(spiralTransactions).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
  createdAt: true,
});

export const insertFulfillmentGroupSchema = createInsertSchema(fulfillmentGroups).omit({
  id: true,
  createdAt: true,
});

export const insertUserFollowSchema = createInsertSchema(userFollows).omit({
  id: true,
  followedAt: true,
});

export type InsertStore = z.infer<typeof insertStoreSchema>;
export type Store = typeof stores.$inferSelect;
export type InsertRetailer = z.infer<typeof insertRetailerSchema>;
export type Retailer = typeof retailers.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertSpiralTransaction = z.infer<typeof insertSpiralTransactionSchema>;
export type SpiralTransaction = typeof spiralTransactions.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type FulfillmentGroup = typeof fulfillmentGroups.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;
export type InsertFulfillmentGroup = typeof fulfillmentGroups.$inferInsert;
export type InsertUserFollow = z.infer<typeof insertUserFollowSchema>;
export type UserFollow = typeof userFollows.$inferSelect;

// Invite codes table for friend referral system
export const inviteCodes = pgTable("invite_codes", {
  id: serial("id").primaryKey(),
  code: text("code").unique().notNull(),
  creatorUserId: integer("creator_user_id").notNull().references(() => users.id),
  usedByUserId: integer("used_by_user_id").references(() => users.id),
  spiralsAwarded: integer("spirals_awarded").default(20),
  maxUses: integer("max_uses").default(1),
  currentUses: integer("current_uses").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  usedAt: timestamp("used_at"),
});

// Leaderboard tracking table
export const leaderboardEntries = pgTable("leaderboard_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  category: text("category").notNull(), // 'total_spirals', 'monthly_spirals', 'referrals', 'purchases'
  score: integer("score").notNull(),
  rank: integer("rank"),
  period: text("period").notNull(), // 'all_time', '2025-01', etc.
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations for new tables
export const inviteCodesRelations = relations(inviteCodes, ({ one }) => ({
  creator: one(users, {
    fields: [inviteCodes.creatorUserId],
    references: [users.id],
  }),
  usedBy: one(users, {
    fields: [inviteCodes.usedByUserId],
    references: [users.id],
  }),
}));

export const leaderboardEntriesRelations = relations(leaderboardEntries, ({ one }) => ({
  user: one(users, {
    fields: [leaderboardEntries.userId],
    references: [users.id],
  }),
}));

// Insert schemas for new tables
export const insertInviteCodeSchema = createInsertSchema(inviteCodes);
export const insertLeaderboardEntrySchema = createInsertSchema(leaderboardEntries);

// Malls table for mall directory and pages
export const malls = pgTable("malls", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  phone: text("phone").notNull(),
  website: text("website"),
  hours: text("hours").notNull(),
  storeCount: integer("store_count").default(0),
  type: text("type").notNull(), // 'shopping_center', 'outlet', 'lifestyle', 'strip_mall'
  rating: decimal("rating", { precision: 2, scale: 1 }).default("0.0"),
  reviewCount: integer("review_count").default(0),
  features: text("features").array(),
  amenities: text("amenities").array(),
  spiralCenterLocation: text("spiral_center_location"),
  spiralCenterHours: text("spiral_center_hours"),
  spiralCenterServices: text("spiral_center_services").array(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Gift cards table removed - using Feature 9 implementation later in file

// Feature 7: Retailer Self-Onboarding System

// Enhanced retailers table for self-onboarding
export const retailerAccounts = pgTable("retailer_accounts", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  businessName: text("business_name").notNull(),
  contactName: text("contact_name").notNull(),
  phone: text("phone"),
  website: text("website"),
  logoUrl: text("logo_url"),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  bio: text("bio"),
  socialLinks: text("social_links").array(),
  taxId: text("tax_id"),
  preferredMallId: integer("preferred_mall_id").references(() => malls.id),
  isApproved: boolean("is_approved").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Retailer onboarding status tracking
export const onboardingStatus = pgTable("onboarding_status", {
  id: serial("id").primaryKey(),
  retailerId: integer("retailer_id").notNull().references(() => retailerAccounts.id),
  step: text("step").notNull(), // 'signup', 'profile', 'inventory', 'approved'
  status: text("status").default("pending").notNull(), // 'pending', 'in_progress', 'completed', 'rejected'
  notes: text("notes"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Retailer products for inventory management
export const retailerProducts = pgTable("retailer_products", {
  id: serial("id").primaryKey(),
  retailerId: integer("retailer_id").notNull().references(() => retailerAccounts.id),
  title: text("title").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(),
  subcategory: text("subcategory"),
  brand: text("brand"),
  sku: text("sku"),
  stock: integer("stock").default(0).notNull(),
  imageUrl: text("image_url"),
  imageUrls: text("image_urls").array(),
  weight: decimal("weight", { precision: 8, scale: 2 }),
  dimensions: text("dimensions"),
  tags: text("tags").array(),
  isActive: boolean("is_active").default(true).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  salePrice: decimal("sale_price", { precision: 10, scale: 2 }),
  saleStartDate: timestamp("sale_start_date"),
  saleEndDate: timestamp("sale_end_date"),
  spiralBonus: integer("spiral_bonus").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Product upload batches for CSV imports
export const productUploadBatches = pgTable("product_upload_batches", {
  id: serial("id").primaryKey(),
  retailerId: integer("retailer_id").notNull().references(() => retailerAccounts.id),
  filename: text("filename").notNull(),
  totalRows: integer("total_rows").notNull(),
  successRows: integer("success_rows").default(0).notNull(),
  errorRows: integer("error_rows").default(0).notNull(),
  status: text("status").default("processing").notNull(), // 'processing', 'completed', 'failed'
  errors: text("errors").array(),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Relations
export const retailerAccountsRelations = relations(retailerAccounts, ({ one, many }) => ({
  preferredMall: one(malls, {
    fields: [retailerAccounts.preferredMallId],
    references: [malls.id],
  }),
  onboardingStatuses: many(onboardingStatus),
  products: many(retailerProducts),
  uploadBatches: many(productUploadBatches),
}));

export const onboardingStatusRelations = relations(onboardingStatus, ({ one }) => ({
  retailer: one(retailerAccounts, {
    fields: [onboardingStatus.retailerId],
    references: [retailerAccounts.id],
  }),
}));

export const retailerProductsRelations = relations(retailerProducts, ({ one }) => ({
  retailer: one(retailerAccounts, {
    fields: [retailerProducts.retailerId],
    references: [retailerAccounts.id],
  }),
}));

export const productUploadBatchesRelations = relations(productUploadBatches, ({ one }) => ({
  retailer: one(retailerAccounts, {
    fields: [productUploadBatches.retailerId],
    references: [retailerAccounts.id],
  }),
}));

// Insert schemas
export const insertRetailerAccountSchema = createInsertSchema(retailerAccounts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLoginAt: true,
});

export const insertOnboardingStatusSchema = createInsertSchema(onboardingStatus).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertRetailerProductSchema = createInsertSchema(retailerProducts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProductUploadBatchSchema = createInsertSchema(productUploadBatches).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

// Types
export type RetailerAccount = typeof retailerAccounts.$inferSelect;
export type InsertRetailerAccount = typeof retailerAccounts.$inferInsert;
export type OnboardingStatus = typeof onboardingStatus.$inferSelect;
export type InsertOnboardingStatus = typeof onboardingStatus.$inferInsert;
export type RetailerProduct = typeof retailerProducts.$inferSelect;
export type InsertRetailerProduct = typeof retailerProducts.$inferInsert;
export type ProductUploadBatch = typeof productUploadBatches.$inferSelect;
export type InsertProductUploadBatch = typeof productUploadBatches.$inferInsert;

// Wishlist tracking for back-in-stock and price alerts
export const wishlistTrackers = pgTable("wishlist_trackers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  productId: integer("product_id").notNull(), // References products or retailer_products
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }).notNull(),
  alertType: text("alert_type").notNull(), // 'stock', 'price', 'both'
  lastAlertedAt: timestamp("last_alerted_at"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User notification preferences
export const userNotificationPreferences = pgTable("user_notification_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull().unique(),
  emailEnabled: boolean("email_enabled").default(true),
  smsEnabled: boolean("sms_enabled").default(false),
  browserEnabled: boolean("browser_enabled").default(true),
  alertFrequency: text("alert_frequency").default("immediate"), // 'immediate', 'daily', 'weekly'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Notification history for tracking sent alerts
export const notificationHistory = pgTable("notification_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  productId: integer("product_id").notNull(),
  notificationType: text("notification_type").notNull(), // 'back_in_stock', 'price_drop'
  deliveryMethod: text("delivery_method").notNull(), // 'email', 'sms', 'browser'
  status: text("status").default("sent"), // 'sent', 'failed', 'pending'
  metadata: text("metadata"), // JSON for additional data
  sentAt: timestamp("sent_at").defaultNow(),
});

// Insert schemas for wishlist alert system
export const insertWishlistTrackerSchema = createInsertSchema(wishlistTrackers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserNotificationPreferencesSchema = createInsertSchema(userNotificationPreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNotificationHistorySchema = createInsertSchema(notificationHistory).omit({
  id: true,
  sentAt: true,
});

// Wishlist alert system types
export type InsertWishlistTracker = typeof wishlistTrackers.$inferInsert;
export type WishlistTracker = typeof wishlistTrackers.$inferSelect;
export type InsertUserNotificationPreferences = typeof userNotificationPreferences.$inferInsert;
export type UserNotificationPreferences = typeof userNotificationPreferences.$inferSelect;
export type InsertNotificationHistory = typeof notificationHistory.$inferInsert;
export type NotificationHistory = typeof notificationHistory.$inferSelect;





// Analytics tables for Feature 10
export const retailerAnalyticsSnapshots = pgTable("retailer_analytics_snapshots", {
  id: serial("id").primaryKey(),
  retailerId: integer("retailer_id").references(() => stores.id).notNull(),
  sales: decimal("sales", { precision: 12, scale: 2 }).notNull(),
  orders: integer("orders").notNull(),
  avgOrderValue: decimal("avg_order_value", { precision: 10, scale: 2 }).notNull(),
  repeatCustomers: integer("repeat_customers").notNull(),
  timeframe: varchar("timeframe", { length: 50 }).notNull(), // "today", "7d", "30d", "custom"
  createdAt: timestamp("created_at").defaultNow(),
});

export const mallAnalytics = pgTable("mall_analytics", {
  id: serial("id").primaryKey(),
  mallId: integer("mall_id").references(() => malls.id).notNull(),
  totalRevenue: decimal("total_revenue", { precision: 12, scale: 2 }).notNull(),
  storeMetrics: text("store_metrics").notNull(), // JSON string of store performance data
  loyaltySummary: text("loyalty_summary").notNull(), // JSON string of loyalty program metrics
  footTraffic: text("foot_traffic").notNull(), // JSON string of traffic patterns by hour/day
  timestamp: timestamp("timestamp").defaultNow(),
});

export const liveOrdersActivity = pgTable("live_orders_activity", {
  id: serial("id").primaryKey(),
  orderId: varchar("order_id").notNull(),
  retailerId: integer("retailer_id").references(() => stores.id).notNull(),
  mallId: integer("mall_id").references(() => malls.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  itemCount: integer("item_count").notNull(),
  customerName: varchar("customer_name"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Analytics insert schemas
export const insertRetailerAnalyticsSnapshotSchema = createInsertSchema(retailerAnalyticsSnapshots).omit({
  id: true,
  createdAt: true,
});

export const insertMallAnalyticsSchema = createInsertSchema(mallAnalytics).omit({
  id: true,
  timestamp: true,
});

export const insertLiveOrdersActivitySchema = createInsertSchema(liveOrdersActivity).omit({
  id: true,
  timestamp: true,
});

// Analytics types
export type RetailerAnalyticsSnapshot = typeof retailerAnalyticsSnapshots.$inferSelect;
export type InsertRetailerAnalyticsSnapshot = z.infer<typeof insertRetailerAnalyticsSnapshotSchema>;
export type MallAnalytics = typeof mallAnalytics.$inferSelect;
export type InsertMallAnalytics = z.infer<typeof insertMallAnalyticsSchema>;
export type LiveOrdersActivity = typeof liveOrdersActivity.$inferSelect;
export type InsertLiveOrdersActivity = z.infer<typeof insertLiveOrdersActivitySchema>;

// Cart items table for multi-retailer cart
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  productId: text("product_id").notNull(), // reference to product from store system
  storeId: integer("store_id").notNull().references(() => stores.id),
  mallId: integer("mall_id").references(() => malls.id),
  productName: text("product_name").notNull(),
  productPrice: decimal("product_price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull().default(1),
  fulfillmentMethod: text("fulfillment_method").notNull(), // 'ship-to-me', 'in-store-pickup', 'ship-to-mall'
  addedAt: timestamp("added_at").defaultNow(),
});

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, {
    fields: [cartItems.userId],
    references: [users.id],
  }),
  store: one(stores, {
    fields: [cartItems.storeId],
    references: [stores.id],
  }),
  mall: one(malls, {
    fields: [cartItems.mallId],
    references: [malls.id],
  }),
}));

// Insert schemas for cart items
export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  addedAt: true,
});

// Product and Store Reviews table
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  reviewType: text("review_type").notNull(), // 'product' or 'store'
  targetId: text("target_id").notNull(), // productId for products, storeId for stores
  storeId: integer("store_id").references(() => stores.id),
  storeName: text("store_name"),
  productName: text("product_name"),
  rating: integer("rating").notNull(), // 1-5 stars
  reviewText: text("review_text").notNull(),
  reviewerName: text("reviewer_name").notNull(),
  isVerifiedPurchase: boolean("is_verified_purchase").default(false),
  helpfulVotes: integer("helpful_votes").default(0),
  isReported: boolean("is_reported").default(false),
  orderId: text("order_id"), // Links to order for verification
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations for reviews
export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  store: one(stores, {
    fields: [reviews.storeId],
    references: [stores.id],
  }),
}));

// Insert schema for reviews
export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  helpfulVotes: true,
  isReported: true,
  createdAt: true,
});

// Additional type exports
export type InviteCode = typeof inviteCodes.$inferSelect;
export type InsertInviteCode = z.infer<typeof insertInviteCodeSchema>;
export type LeaderboardEntry = typeof leaderboardEntries.$inferSelect;
export type InsertLeaderboardEntry = z.infer<typeof insertLeaderboardEntrySchema>;

// User Loyalty tracking table for loyalty dashboard
export const userLoyalty = pgTable("user_loyalty", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  totalEarned: integer("total_earned").default(0).notNull(),
  currentBalance: integer("current_balance").default(0).notNull(),
  pendingPoints: integer("pending_points").default(0).notNull(),
  tier: text("tier").default("Bronze").notNull(),
  referralCode: text("referral_code").unique().notNull(),
  referralCount: integer("referral_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Loyalty transactions table for detailed transaction history
export const loyaltyTransactions = pgTable("loyalty_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  orderId: text("order_id"),
  type: text("type").notNull(), // 'earned' or 'redeemed'
  points: integer("points").notNull(),
  description: text("description").notNull(),
  status: text("status").default("completed").notNull(), // 'completed', 'pending', 'processing'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UserLoyalty = typeof userLoyalty.$inferSelect;
export type InsertUserLoyalty = typeof userLoyalty.$inferInsert;
export type LoyaltyTransaction = typeof loyaltyTransactions.$inferSelect;
export type InsertLoyaltyTransaction = typeof loyaltyTransactions.$inferInsert;

// Order tracking table for shipping tracker
export const orderTracking = pgTable("order_tracking", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id),
  orderNumber: text("order_number").notNull(),
  carrier: text("carrier").notNull(), // 'FedEx', 'UPS', 'USPS', 'DHL'
  trackingNumber: text("tracking_number").notNull(),
  status: text("status").default("label_created").notNull(), // 'label_created', 'in_transit', 'out_for_delivery', 'delivered', 'exception'
  lastUpdate: timestamp("last_update").defaultNow(),
  eta: timestamp("eta"),
  lastLocation: text("last_location"),
  deliveryAddress: text("delivery_address"),
  estimatedDeliveryDate: text("estimated_delivery_date"),
  actualDeliveryDate: timestamp("actual_delivery_date"),
  trackingEvents: text("tracking_events"), // JSON string of tracking events
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type OrderTracking = typeof orderTracking.$inferSelect;
export type InsertOrderTracking = typeof orderTracking.$inferInsert;

// Retailer loyalty settings table
export const retailerLoyaltySettings = pgTable("retailer_loyalty_settings", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id").notNull().references(() => stores.id),
  pointsPerDollar: decimal("points_per_dollar", { precision: 4, scale: 2 }).default("0.10").notNull(), // e.g., 0.10 = 1 SPIRAL per $10
  minimumPurchase: decimal("minimum_purchase", { precision: 8, scale: 2 }).default("0.00"),
  bonusMultiplier: decimal("bonus_multiplier", { precision: 3, scale: 2 }).default("1.00"), // e.g., 1.50 for 50% bonus
  tierThresholds: text("tier_thresholds"), // JSON: {"bronze": 0, "silver": 100, "gold": 500, "platinum": 1000}
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Retailer-specific loyalty history for each user
export const retailerLoyaltyHistory = pgTable("retailer_loyalty_history", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  storeId: integer("store_id").notNull().references(() => stores.id),
  orderId: integer("order_id").references(() => orders.id),
  pointsEarned: integer("points_earned").default(0).notNull(),
  pointsRedeemed: integer("points_redeemed").default(0).notNull(),
  transactionType: text("transaction_type").notNull(), // 'earned', 'redeemed', 'bonus', 'expired'
  description: text("description"),
  currentTier: text("current_tier").default("bronze"), // 'bronze', 'silver', 'gold', 'platinum'
  totalLifetimePoints: integer("total_lifetime_points").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Mall perk campaigns
export const mallPerkCampaigns = pgTable("mall_perk_campaigns", {
  id: serial("id").primaryKey(),
  mallId: integer("mall_id").notNull().references(() => malls.id),
  title: text("title").notNull(),
  description: text("description"),
  perkType: text("perk_type").notNull(), // 'bonus_points', 'discount', 'gift', 'access'
  bonusPoints: integer("bonus_points").default(0), // Extra SPIRALs for completing perk
  discountPercent: decimal("discount_percent", { precision: 5, scale: 2 }).default("0.00"),
  requiredStores: integer("required_stores").default(2), // Number of different stores to shop at
  minimumSpend: decimal("minimum_spend", { precision: 8, scale: 2 }).default("0.00"),
  validFrom: timestamp("valid_from").notNull(),
  validUntil: timestamp("valid_until").notNull(),
  maxRedemptions: integer("max_redemptions").default(100),
  currentRedemptions: integer("current_redemptions").default(0),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User progress on mall perks
export const userMallPerks = pgTable("user_mall_perks", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  campaignId: integer("campaign_id").notNull().references(() => mallPerkCampaigns.id),
  mallId: integer("mall_id").notNull().references(() => malls.id),
  storesVisited: text("stores_visited"), // JSON array of store IDs visited
  totalSpent: decimal("total_spent", { precision: 8, scale: 2 }).default("0.00"),
  progress: integer("progress").default(0), // Number of stores shopped at
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
  rewardClaimed: boolean("reward_claimed").default(false),
  claimedAt: timestamp("claimed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type RetailerLoyaltySettings = typeof retailerLoyaltySettings.$inferSelect;
export type InsertRetailerLoyaltySettings = typeof retailerLoyaltySettings.$inferInsert;
export type RetailerLoyaltyHistory = typeof retailerLoyaltyHistory.$inferSelect;
export type InsertRetailerLoyaltyHistory = typeof retailerLoyaltyHistory.$inferInsert;
export type MallPerkCampaign = typeof mallPerkCampaigns.$inferSelect;
export type InsertMallPerkCampaign = typeof mallPerkCampaigns.$inferInsert;
export type UserMallPerk = typeof userMallPerks.$inferSelect;
export type InsertUserMallPerk = typeof userMallPerks.$inferInsert;

// Product reviews table
export const productReviews = pgTable("product_reviews", {
  id: serial("id").primaryKey(),
  productId: text("product_id").notNull(),
  userId: text("user_id").notNull().references(() => users.id),
  orderId: integer("order_id").references(() => orders.id),
  rating: integer("rating").notNull(), // 1-5 stars
  title: text("title"),
  comment: text("comment"),
  photoUrl: text("photo_url"),
  isVerifiedPurchase: boolean("is_verified_purchase").default(false).notNull(),
  isApproved: boolean("is_approved").default(true).notNull(),
  helpfulCount: integer("helpful_count").default(0).notNull(),
  reportCount: integer("report_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Review flags/reports table
export const reviewFlags = pgTable("review_flags", {
  id: serial("id").primaryKey(),
  reviewId: integer("review_id").notNull().references(() => productReviews.id),
  reportedById: text("reported_by_id").notNull().references(() => users.id),
  reason: text("reason").notNull(), // 'spam', 'inappropriate', 'fake', 'other'
  description: text("description"),
  status: text("status").default("pending").notNull(), // 'pending', 'reviewed', 'dismissed'
  createdAt: timestamp("created_at").defaultNow(),
});

// User product purchases tracking for verification
export const userProductPurchases = pgTable("user_product_purchases", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  productId: text("product_id").notNull(),
  orderId: integer("order_id").notNull().references(() => orders.id),
  purchaseDate: timestamp("purchase_date").defaultNow(),
  verified: boolean("verified").default(true).notNull(),
});

// Review helpfulness votes
export const reviewHelpfulness = pgTable("review_helpfulness", {
  id: serial("id").primaryKey(),
  reviewId: integer("review_id").notNull().references(() => productReviews.id),
  userId: text("user_id").notNull().references(() => users.id),
  isHelpful: boolean("is_helpful").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type ProductReview = typeof productReviews.$inferSelect;
export type InsertProductReview = typeof productReviews.$inferInsert;
export type ReviewFlag = typeof reviewFlags.$inferSelect;
export type InsertReviewFlag = typeof reviewFlags.$inferInsert;
export type UserProductPurchase = typeof userProductPurchases.$inferSelect;
export type InsertUserProductPurchase = typeof userProductPurchases.$inferInsert;
export type ReviewHelpfulness = typeof reviewHelpfulness.$inferSelect;
export type InsertReviewHelpfulness = typeof reviewHelpfulness.$inferInsert;

// Retailer testimonials table
export const retailerTestimonials = pgTable("retailer_testimonials", {
  id: serial("id").primaryKey(),
  storeId: text("store_id").notNull(),
  title: text("title").notNull(),
  story: text("story").notNull(),
  imageUrl: text("image_url"),
  videoUrl: text("video_url"),
  isApproved: boolean("is_approved").default(false).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  likesCount: integer("likes_count").default(0).notNull(),
  sharesCount: integer("shares_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Testimonial likes table
export const testimonialLikes = pgTable("testimonial_likes", {
  id: serial("id").primaryKey(),
  testimonialId: integer("testimonial_id").notNull().references(() => retailerTestimonials.id),
  userId: text("user_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Testimonial comments table
export const testimonialComments = pgTable("testimonial_comments", {
  id: serial("id").primaryKey(),
  testimonialId: integer("testimonial_id").notNull().references(() => retailerTestimonials.id),
  userId: text("user_id").notNull().references(() => users.id),
  comment: text("comment").notNull(),
  isApproved: boolean("is_approved").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type RetailerTestimonial = typeof retailerTestimonials.$inferSelect;
export type InsertRetailerTestimonial = typeof retailerTestimonials.$inferInsert;
export type TestimonialLike = typeof testimonialLikes.$inferSelect;
export type InsertTestimonialLike = typeof testimonialLikes.$inferInsert;
export type TestimonialComment = typeof testimonialComments.$inferSelect;
export type InsertTestimonialComment = typeof testimonialComments.$inferInsert;

// Mall events table
export const mallEvents = pgTable("mall_events", {
  id: serial("id").primaryKey(),
  mallId: text("mall_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  imageUrl: text("image_url"),
  eventType: text("event_type").notNull(), // Kids, Fashion, Tech, Food, Music, etc.
  location: text("location").notNull(), // Food Court, Main Plaza, etc.
  maxRsvp: integer("max_rsvp").default(100).notNull(),
  currentRsvp: integer("current_rsvp").default(0).notNull(),
  rewardPoints: integer("reward_points").default(10).notNull(),
  isApproved: boolean("is_approved").default(false).notNull(),
  isPublished: boolean("is_published").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Event RSVPs table
export const eventRsvps = pgTable("event_rsvps", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull().references(() => mallEvents.id),
  userId: text("user_id").notNull().references(() => users.id),
  status: text("status").notNull().default("pending"), // pending, confirmed, cancelled, attended
  rsvpedAt: timestamp("rsvped_at").defaultNow(),
  attendedAt: timestamp("attended_at"),
  rewardClaimed: boolean("reward_claimed").default(false).notNull(),
});

export type MallEvent = typeof mallEvents.$inferSelect;
export type InsertMallEvent = typeof mallEvents.$inferInsert;
export type EventRsvp = typeof eventRsvps.$inferSelect;
export type InsertEventRsvp = typeof eventRsvps.$inferInsert;
export type Mall = typeof malls.$inferSelect;
export type InsertMall = typeof malls.$inferInsert;
// Old types removed - using new Feature 6 implementation below
export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

// P1 Feature Tables
export const mallPerks = pgTable("mall_perks", {
  id: serial("id").primaryKey(),
  mallId: integer("mall_id").notNull().references(() => malls.id),
  perkType: text("perk_type").notNull(), // 'spiral_multiplier', 'free_pickup', 'discount'
  title: text("title").notNull(),
  description: text("description"),
  multiplier: decimal("multiplier", { precision: 3, scale: 2 }),
  discountPercent: integer("discount_percent"),
  dayOfWeek: integer("day_of_week"), // 0-6 for Sunday-Saturday
  startTime: text("start_time"), // HH:MM:SS
  endTime: text("end_time"), // HH:MM:SS
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const retailerApplications = pgTable("retailer_applications", {
  id: serial("id").primaryKey(),
  businessName: text("business_name").notNull(),
  contactName: text("contact_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  businessType: text("business_type"),
  address: text("address"),
  description: text("description"),
  logoUrl: text("logo_url"),
  website: text("website"),
  status: text("status").default("pending"), // 'pending', 'approved', 'rejected'
  approvedBy: integer("approved_by").references(() => users.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const wishlistNotifications = pgTable("wishlist_notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  productId: text("product_id").notNull(),
  notificationType: text("notification_type").notNull(), // 'back_in_stock', 'price_drop'
  isEnabled: boolean("is_enabled").default(true),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  targetPrice: decimal("target_price", { precision: 10, scale: 2 }),
  lastNotifiedAt: timestamp("last_notified_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userNotifications = pgTable("user_notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // 'wishlist_alert', 'spiral_bonus', 'event_reminder'
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  actionUrl: text("action_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// P1 Relations
export const mallPerksRelations = relations(mallPerks, ({ one }) => ({
  mall: one(malls, {
    fields: [mallPerks.mallId],
    references: [malls.id],
  }),
}));

export const retailerApplicationsRelations = relations(retailerApplications, ({ one }) => ({
  approvedBy: one(users, {
    fields: [retailerApplications.approvedBy],
    references: [users.id],
  }),
}));

export const wishlistNotificationsRelations = relations(wishlistNotifications, ({ one }) => ({
  user: one(users, {
    fields: [wishlistNotifications.userId],
    references: [users.id],
  }),
}));

export const userNotificationsRelations = relations(userNotifications, ({ one }) => ({
  user: one(users, {
    fields: [userNotifications.userId],
    references: [users.id],
  }),
}));

// P1 Insert schemas
export const insertMallPerkSchema = createInsertSchema(mallPerks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRetailerApplicationSchema = createInsertSchema(retailerApplications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWishlistNotificationSchema = createInsertSchema(wishlistNotifications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserNotificationSchema = createInsertSchema(userNotifications).omit({
  id: true,
  createdAt: true,
});

// P1 Type exports
export type MallPerk = typeof mallPerks.$inferSelect;
export type InsertMallPerk = z.infer<typeof insertMallPerkSchema>;
export type RetailerApplication = typeof retailerApplications.$inferSelect;
export type InsertRetailerApplication = z.infer<typeof insertRetailerApplicationSchema>;
export type WishlistNotification = typeof wishlistNotifications.$inferSelect;
export type InsertWishlistNotification = z.infer<typeof insertWishlistNotificationSchema>;
export type UserNotification = typeof userNotifications.$inferSelect;
export type InsertUserNotification = z.infer<typeof insertUserNotificationSchema>;

// Return & Refund System Tables
export const returnRequests = pgTable("return_requests", {
  id: text("id").primaryKey().$default(() => crypto.randomUUID()),
  userId: integer("user_id").references(() => users.id).notNull(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  productId: text("product_id").notNull(),
  productName: text("product_name").notNull(),
  originalAmount: integer("original_amount").notNull(), // in cents
  reason: text("reason").notNull(),
  refundType: text("refund_type").notNull(), // 'original', 'spiral_credit'
  status: text("status").notNull().default("pending"), // 'pending', 'approved', 'rejected', 'refunded'
  imageUrl: text("image_url"),
  submittedAt: timestamp("submitted_at").defaultNow(),
  decisionAt: timestamp("decision_at"),
  decisionNote: text("decision_note"),
  autoApproved: boolean("auto_approved").default(false),
  adminUserId: integer("admin_user_id").references(() => users.id),
});

export const refundTransactions = pgTable("refund_transactions", {
  id: text("id").primaryKey().$default(() => crypto.randomUUID()),
  returnId: text("return_id").references(() => returnRequests.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  method: text("method").notNull(), // 'stripe', 'spiral_credit'
  amount: integer("amount").notNull(), // in cents
  spiralPointsAwarded: integer("spiral_points_awarded"),
  status: text("status").notNull().default("processing"), // 'processing', 'completed', 'failed'
  stripeRefundId: text("stripe_refund_id"),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const returnRequestRelations = relations(returnRequests, ({ one }) => ({
  user: one(users, {
    fields: [returnRequests.userId],
    references: [users.id]
  }),
  order: one(orders, {
    fields: [returnRequests.orderId],
    references: [orders.id]
  }),
  adminUser: one(users, {
    fields: [returnRequests.adminUserId],
    references: [users.id]
  })
}));

export const refundTransactionRelations = relations(refundTransactions, ({ one }) => ({
  returnRequest: one(returnRequests, {
    fields: [refundTransactions.returnId],
    references: [returnRequests.id]
  }),
  user: one(users, {
    fields: [refundTransactions.userId],
    references: [users.id]
  })
}));

// Return & Refund Insert schemas
export const insertReturnRequestSchema = createInsertSchema(returnRequests).omit({
  id: true,
  submittedAt: true,
  decisionAt: true,
  autoApproved: true,
});

export const insertRefundTransactionSchema = createInsertSchema(refundTransactions).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

// Return & Refund Type exports
export type ReturnRequest = typeof returnRequests.$inferSelect;
export type InsertReturnRequest = z.infer<typeof insertReturnRequestSchema>;
export type RefundTransaction = typeof refundTransactions.$inferSelect;
export type InsertRefundTransaction = z.infer<typeof insertRefundTransactionSchema>;

// Feature 13: Enhanced Wishlist Alert System with Push/Email/SMS Notifications

// Enhanced wishlist alerts table
export const wishlistAlerts = pgTable("wishlist_alerts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  productId: integer("product_id").notNull(),
  productName: text("product_name").notNull(),
  currentPrice: integer("current_price"), // Price in cents
  targetPrice: integer("target_price"), // Alert when price drops below this
  isActive: boolean("is_active").default(true),
  alertType: text("alert_type").notNull(), // stock, price, promo
  notificationMethods: text("notification_methods").array().default(['email']), // email, sms, push
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Enhanced notification preferences table
export const notificationPreferences = pgTable("notification_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  email: text("email"),
  phone: text("phone"),
  pushToken: text("push_token"),
  enableEmail: boolean("enable_email").default(true),
  enableSms: boolean("enable_sms").default(false),
  enablePush: boolean("enable_push").default(true),
  globalOptOut: boolean("global_opt_out").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Enhanced notification log table
export const notificationLog = pgTable("notification_log", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  alertId: integer("alert_id").references(() => wishlistAlerts.id),
  notificationType: text("notification_type").notNull(), // email, sms, push
  subject: text("subject"),
  message: text("message").notNull(),
  status: text("status").default('pending'), // pending, sent, failed
  sentAt: timestamp("sent_at"),
  failureReason: text("failure_reason"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Enhanced wishlist alerts schema for Feature 13
export const insertWishlistAlertSchema = createInsertSchema(wishlistAlerts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNotificationPreferencesSchema = createInsertSchema(notificationPreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNotificationLogSchema = createInsertSchema(notificationLog).omit({
  id: true,
  createdAt: true,
});

// Enhanced wishlist alert relations
export const wishlistAlertsRelations = relations(wishlistAlerts, ({ one, many }) => ({
  user: one(users, {
    fields: [wishlistAlerts.userId],
    references: [users.id],
  }),
  notifications: many(notificationLog),
}));

export const notificationPreferencesRelations = relations(notificationPreferences, ({ one }) => ({
  user: one(users, {
    fields: [notificationPreferences.userId],
    references: [users.id],
  }),
}));

export const notificationLogRelations = relations(notificationLog, ({ one }) => ({
  user: one(users, {
    fields: [notificationLog.userId],
    references: [users.id],
  }),
  alert: one(wishlistAlerts, {
    fields: [notificationLog.alertId],
    references: [wishlistAlerts.id],
  }),
}));

// Enhanced wishlist alert types for Feature 13
export type WishlistAlert = typeof wishlistAlerts.$inferSelect;
export type InsertWishlistAlert = typeof wishlistAlerts.$inferInsert;
export type NotificationPreferences = typeof notificationPreferences.$inferSelect;
export type InsertNotificationPreferences = typeof notificationPreferences.$inferInsert;
export type NotificationLog = typeof notificationLog.$inferSelect;
export type InsertNotificationLog = typeof notificationLog.$inferInsert;

// Feature 14: SPIRAL Gift Card Wallet + Mall Credits System

// Gift Cards table
export const giftCards = pgTable("gift_cards", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  issuerId: integer("issuer_id"), // retailer or mall that issued it
  issuerType: text("issuer_type").notNull(), // 'retailer', 'mall', 'spiral'
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  remainingBalance: decimal("remaining_balance", { precision: 10, scale: 2 }).notNull(),
  isActive: boolean("is_active").default(true),
  expiresAt: timestamp("expires_at"),
  usageLimit: integer("usage_limit").default(1), // how many times it can be used
  usageCount: integer("usage_count").default(0),
  applicableStores: text("applicable_stores").array(), // store IDs where it can be used
  applicableMalls: text("applicable_malls").array(), // mall IDs where it can be used
  title: text("title").notNull(),
  description: text("description"),
  terms: text("terms"),
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: integer("created_by"), // admin or retailer who created it
});

// User Wallets table
export const userWallets = pgTable("user_wallets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  giftCardId: integer("gift_card_id").notNull().references(() => giftCards.id),
  addedAt: timestamp("added_at").defaultNow(),
  isRedeemed: boolean("is_redeemed").default(false),
  redeemedAt: timestamp("redeemed_at"),
  redeemedAmount: decimal("redeemed_amount", { precision: 10, scale: 2 }),
});

// Mall Credits table
export const mallCredits = pgTable("mall_credits", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  mallId: text("mall_id").notNull(),
  mallName: text("mall_name").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  remainingBalance: decimal("remaining_balance", { precision: 10, scale: 2 }).notNull(),
  source: text("source").notNull(), // 'promotion', 'loyalty_bonus', 'event', 'referral'
  description: text("description"),
  isActive: boolean("is_active").default(true),
  expiresAt: timestamp("expires_at"),
  applicableStores: text("applicable_stores").array(), // specific stores in the mall
  earnedAt: timestamp("earned_at").defaultNow(),
  usedAt: timestamp("used_at"),
  usedAmount: decimal("used_amount", { precision: 10, scale: 2 }),
});

// Wallet Transactions table
export const walletTransactions = pgTable("wallet_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  transactionType: text("transaction_type").notNull(), // 'gift_card_redeem', 'mall_credit_earn', 'mall_credit_redeem'
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  giftCardId: integer("gift_card_id").references(() => giftCards.id),
  mallCreditId: integer("mall_credit_id").references(() => mallCredits.id),
  orderId: text("order_id"), // reference to order if used during checkout
  description: text("description").notNull(),
  metadata: jsonb("metadata"), // additional transaction details
  transactionDate: timestamp("transaction_date").defaultNow(),
});

// Wallet system insert schemas
export const insertGiftCardSchema = createInsertSchema(giftCards).omit({
  id: true,
  createdAt: true,
  usageCount: true,
  remainingBalance: true,
});

export const insertUserWalletSchema = createInsertSchema(userWallets).omit({
  id: true,
  addedAt: true,
});

export const insertMallCreditSchema = createInsertSchema(mallCredits).omit({
  id: true,
  earnedAt: true,
  usedAt: true,
  usedAmount: true,
});

export const insertWalletTransactionSchema = createInsertSchema(walletTransactions).omit({
  id: true,
  transactionDate: true,
});

// Wallet system type exports
export type InsertGiftCard = z.infer<typeof insertGiftCardSchema>;
export type GiftCard = typeof giftCards.$inferSelect;
export type InsertUserWallet = z.infer<typeof insertUserWalletSchema>;
export type UserWallet = typeof userWallets.$inferSelect;
export type InsertMallCredit = z.infer<typeof insertMallCreditSchema>;
export type MallCredit = typeof mallCredits.$inferSelect;
export type InsertWalletTransaction = z.infer<typeof insertWalletTransactionSchema>;
export type WalletTransaction = typeof walletTransactions.$inferSelect;

// Feature 15: Invite Leaderboard + Viral Sharing Engine
export const userReferrals = pgTable("user_referrals", {
  id: varchar("id").primaryKey(),
  referrerId: varchar("referrer_id").notNull(),
  referredUserId: varchar("referred_user_id"),
  referralCode: varchar("referral_code").notNull().unique(),
  status: varchar("status").notNull().default("pending"), // pending, completed, rewarded
  spiralsEarned: integer("spirals_earned").notNull().default(0),
  firstPurchaseBonus: boolean("first_purchase_bonus").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const inviteLeaderboard = pgTable("invite_leaderboard", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").notNull().unique(),
  totalInvites: integer("total_invites").notNull().default(0),
  successfulInvites: integer("successful_invites").notNull().default(0),
  totalSpiralEarned: integer("total_spiral_earned").notNull().default(0),
  currentRank: integer("current_rank"),
  badges: text("badges").array().default([]),
  isPublic: boolean("is_public").notNull().default(true),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const referralRewards = pgTable("referral_rewards", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  referralId: varchar("referral_id").notNull(),
  rewardType: varchar("reward_type").notNull(), // signup, first_purchase, milestone
  spiralAmount: integer("spiral_amount").notNull(),
  description: varchar("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Feature 15 insert schemas
export const insertUserReferralSchema = createInsertSchema(userReferrals).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertInviteLeaderboardSchema = createInsertSchema(inviteLeaderboard).omit({
  id: true,
  updatedAt: true,
});

export const insertReferralRewardSchema = createInsertSchema(referralRewards).omit({
  id: true,
  createdAt: true,
});

// Feature 15 types
export type UserReferral = typeof userReferrals.$inferSelect;
export type InsertUserReferral = z.infer<typeof insertUserReferralSchema>;
export type InviteLeaderboard = typeof inviteLeaderboard.$inferSelect;
export type InsertInviteLeaderboard = z.infer<typeof insertInviteLeaderboardSchema>;
export type ReferralReward = typeof referralRewards.$inferSelect;
export type InsertReferralReward = z.infer<typeof insertReferralRewardSchema>;

// SPIRAL Wallet for tracking user balances and transaction history
export const spiralWallets = pgTable("spiral_wallets", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  balance: integer("balance").default(0), // SPIRALs available
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// SPIRAL Wallet transaction history
export const spiralWalletHistory = pgTable("spiral_wallet_history", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  date: timestamp("date").defaultNow(),
  type: text("type").notNull(), // "earn" | "spend"
  source: text("source").notNull(), // "purchase" | "referral" | "share" | "in_person_bonus" | "reward_redeem"
  amount: integer("amount").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// SPIRAL Wallet schemas
export const insertSpiralWalletSchema = createInsertSchema(spiralWallets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSpiralWalletTransactionSchema = createInsertSchema(spiralWalletHistory).omit({
  id: true,
  date: true,
  createdAt: true,
});

// SPIRAL Wallet types
export type SpiralWallet = typeof spiralWallets.$inferSelect;
export type InsertSpiralWallet = z.infer<typeof insertSpiralWalletSchema>;
export type SpiralWalletTransaction = typeof spiralWalletHistory.$inferSelect;
export type InsertSpiralWalletTransaction = z.infer<typeof insertSpiralWalletTransactionSchema>;

