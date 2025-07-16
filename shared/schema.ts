import { pgTable, text, serial, integer, boolean, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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

export type InsertStore = z.infer<typeof insertStoreSchema>;
export type Store = typeof stores.$inferSelect;
export type InsertRetailer = z.infer<typeof insertRetailerSchema>;
export type Retailer = typeof retailers.$inferSelect;
