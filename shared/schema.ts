import { pgTable, text, serial, integer, boolean, decimal, timestamp, uuid } from "drizzle-orm/pg-core";
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

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  spiralTransactions: many(spiralTransactions),
  orders: many(orders),
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

// Gift cards table
export const giftCards = pgTable("gift_cards", {
  id: serial("id").primaryKey(),
  code: text("code").unique().notNull(),
  purchasedByUserId: integer("purchased_by_user_id").references(() => users.id),
  recipientEmail: text("recipient_email"),
  recipientName: text("recipient_name"),
  originalAmount: decimal("original_amount", { precision: 10, scale: 2 }).notNull(),
  currentBalance: decimal("current_balance", { precision: 10, scale: 2 }).notNull(),
  mallId: integer("mall_id").references(() => malls.id), // null means all malls
  storeId: integer("store_id").references(() => stores.id), // null means all stores in mall
  personalMessage: text("personal_message"),
  isActive: boolean("is_active").default(true),
  expiresAt: timestamp("expires_at"),
  purchasedAt: timestamp("purchased_at").defaultNow(),
  redeemedAt: timestamp("redeemed_at"),
});

// Mall events table
export const mallEvents = pgTable("mall_events", {
  id: serial("id").primaryKey(),
  mallId: integer("mall_id").notNull().references(() => malls.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  eventDate: timestamp("event_date").notNull(),
  eventTime: text("event_time").notNull(),
  location: text("location").notNull(),
  category: text("category").notNull(), // 'Fashion', 'Family', 'Food', 'Entertainment', 'Shopping'
  spiralBonus: integer("spiral_bonus").default(0),
  maxAttendees: integer("max_attendees"),
  currentAttendees: integer("current_attendees").default(0),
  requiresRSVP: boolean("requires_rsvp").default(false),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Event RSVPs table
export const eventRSVPs = pgTable("event_rsvps", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull().references(() => mallEvents.id),
  userId: integer("user_id").notNull().references(() => users.id),
  rsvpStatus: text("rsvp_status").default('attending'), // 'attending', 'maybe', 'not_attending'
  createdAt: timestamp("created_at").defaultNow(),
});

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

// Relations for new tables
export const mallsRelations = relations(malls, ({ many }) => ({
  events: many(mallEvents),
  giftCards: many(giftCards),
  cartItems: many(cartItems),
}));

export const giftCardsRelations = relations(giftCards, ({ one }) => ({
  purchasedBy: one(users, {
    fields: [giftCards.purchasedByUserId],
    references: [users.id],
  }),
  mall: one(malls, {
    fields: [giftCards.mallId],
    references: [malls.id],
  }),
  store: one(stores, {
    fields: [giftCards.storeId],
    references: [stores.id],
  }),
}));

export const mallEventsRelations = relations(mallEvents, ({ one, many }) => ({
  mall: one(malls, {
    fields: [mallEvents.mallId],
    references: [malls.id],
  }),
  rsvps: many(eventRSVPs),
}));

export const eventRSVPsRelations = relations(eventRSVPs, ({ one }) => ({
  event: one(mallEvents, {
    fields: [eventRSVPs.eventId],
    references: [mallEvents.id],
  }),
  user: one(users, {
    fields: [eventRSVPs.userId],
    references: [users.id],
  }),
}));

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

// Insert schemas for new tables
export const insertMallSchema = createInsertSchema(malls).omit({
  id: true,
  createdAt: true,
});

export const insertGiftCardSchema = createInsertSchema(giftCards).omit({
  id: true,
  purchasedAt: true,
  redeemedAt: true,
});

export const insertMallEventSchema = createInsertSchema(mallEvents).omit({
  id: true,
  createdAt: true,
});

export const insertEventRSVPSchema = createInsertSchema(eventRSVPs).omit({
  id: true,
  createdAt: true,
});

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
export type Mall = typeof malls.$inferSelect;
export type InsertMall = z.infer<typeof insertMallSchema>;
export type GiftCard = typeof giftCards.$inferSelect;
export type InsertGiftCard = z.infer<typeof insertGiftCardSchema>;
export type MallEvent = typeof mallEvents.$inferSelect;
export type InsertMallEvent = z.infer<typeof insertMallEventSchema>;
export type EventRSVP = typeof eventRSVPs.$inferSelect;
export type InsertEventRSVP = z.infer<typeof insertEventRSVPSchema>;
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


