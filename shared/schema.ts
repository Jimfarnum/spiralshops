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

// Additional type exports
export type InviteCode = typeof inviteCodes.$inferSelect;
export type InsertInviteCode = z.infer<typeof insertInviteCodeSchema>;
export type LeaderboardEntry = typeof leaderboardEntries.$inferSelect;
export type InsertLeaderboardEntry = z.infer<typeof insertLeaderboardEntrySchema>;
