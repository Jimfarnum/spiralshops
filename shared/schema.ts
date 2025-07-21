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
  source: text("source").notNull(), // 'online_purchase', 'in_person_purchase', 'sharing', 'referral'
  description: text("description").notNull(),
  orderId: text("order_id"), // optional reference to order
  storeId: integer("store_id").references(() => stores.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Orders table for purchase tracking
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  userId: integer("user_id").references(() => users.id),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  fulfillmentMethod: text("fulfillment_method").notNull(), // 'ship-to-me', 'in-store-pickup', 'ship-to-mall'
  status: text("status").default('pending'), // 'pending', 'confirmed', 'shipped', 'delivered', 'completed'
  spiralsEarned: integer("spirals_earned").default(0),
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

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
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

// Reviews table for products and stores
export const reviews = pgTable("reviews", {
  id: text("id").primaryKey().notNull(),
  userId: integer("user_id").notNull().references(() => users.id),
  targetType: text("target_type").notNull(), // 'product' or 'store'
  targetId: text("target_id").notNull(), // product_id or store_id
  rating: integer("rating").notNull(), // 1-5 stars
  title: text("title").notNull(),
  content: text("content").notNull(),
  isVerifiedPurchase: boolean("is_verified_purchase").default(false),
  helpfulCount: integer("helpful_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

// Relations for reviews
export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
}));


