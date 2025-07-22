import { db } from "./db";
import { giftCards, giftCardRedemptions, users } from "../shared/schema";
import { eq, and, gte } from "drizzle-orm";
import type { GiftCard, InsertGiftCard, GiftCardRedemption, InsertGiftCardRedemption } from "../shared/schema";

interface GiftCardsStorage {
  createGiftCard(data: Omit<InsertGiftCard, 'id' | 'createdAt'>): Promise<GiftCard>;
  getGiftCardById(id: number): Promise<GiftCard | null>;
  getGiftCardByCode(code: string): Promise<GiftCard | null>;
  getAllGiftCards(): Promise<GiftCard[]>;
  getGiftCardsByRecipientUserId(userId: number): Promise<GiftCard[]>;
  updateGiftCard(id: number, updates: Partial<GiftCard>): Promise<void>;
  createRedemption(data: Omit<InsertGiftCardRedemption, 'id' | 'redeemedAt'>): Promise<GiftCardRedemption>;
  redeemGiftCard(giftCardId: number, userId: number | null, amount: number, orderId?: string): Promise<any>;
  getUserReceivedGiftCards(userId: number): Promise<GiftCard[]>;
  getUserPurchasedGiftCards(userId: number): Promise<GiftCard[]>;
  updateGiftCardStatus(id: number, status: string): Promise<GiftCard | null>;
}

class DatabaseGiftCardsStorage implements GiftCardsStorage {
  async createGiftCard(data: Omit<InsertGiftCard, 'id' | 'createdAt'>): Promise<GiftCard> {
    try {
      const [giftCard] = await db.insert(giftCards).values({
        ...data,
        amount: data.amount.toString(),
        balance: data.balance.toString(),
      }).returning();
      
      return {
        ...giftCard,
        amount: parseFloat(giftCard.amount),
        balance: parseFloat(giftCard.balance),
      };
    } catch (error) {
      console.error("Error creating gift card:", error);
      throw new Error("Failed to create gift card");
    }
  }

  async getGiftCardById(id: number): Promise<GiftCard | null> {
    try {
      const [giftCard] = await db.select().from(giftCards).where(eq(giftCards.id, id));
      
      if (!giftCard) return null;
      
      return {
        ...giftCard,
        amount: parseFloat(giftCard.amount),
        balance: parseFloat(giftCard.balance),
      };
    } catch (error) {
      console.error("Error fetching gift card by ID:", error);
      throw new Error("Failed to fetch gift card");
    }
  }

  async getGiftCardByCode(code: string): Promise<GiftCard | null> {
    try {
      const [giftCard] = await db.select().from(giftCards).where(eq(giftCards.code, code.toUpperCase()));
      
      if (!giftCard) return null;
      
      return {
        ...giftCard,
        amount: parseFloat(giftCard.amount),
        balance: parseFloat(giftCard.balance),
      };
    } catch (error) {
      console.error("Error fetching gift card by code:", error);
      throw new Error("Failed to fetch gift card");
    }
  }

  async getAllGiftCards(): Promise<GiftCard[]> {
    try {
      const cards = await db.select().from(giftCards).orderBy(giftCards.createdAt);
      
      return cards.map(card => ({
        ...card,
        amount: parseFloat(card.amount),
        balance: parseFloat(card.balance),
      }));
    } catch (error) {
      console.error("Error fetching all gift cards:", error);
      throw new Error("Failed to fetch gift cards");
    }
  }

  async getGiftCardsByRecipientUserId(userId: number): Promise<GiftCard[]> {
    try {
      const cards = await db.select()
        .from(giftCards)
        .where(eq(giftCards.recipientUserId, userId))
        .orderBy(giftCards.createdAt);
      
      return cards.map(card => ({
        ...card,
        amount: parseFloat(card.amount),
        balance: parseFloat(card.balance),
      }));
    } catch (error) {
      console.error("Error fetching gift cards by recipient:", error);
      throw new Error("Failed to fetch gift cards");
    }
  }

  async updateGiftCard(id: number, updates: Partial<GiftCard>): Promise<void> {
    try {
      const updateData: any = { ...updates };
      
      // Convert numbers to strings for decimal fields
      if (updateData.amount !== undefined) {
        updateData.amount = updateData.amount.toString();
      }
      if (updateData.balance !== undefined) {
        updateData.balance = updateData.balance.toString();
      }
      
      await db.update(giftCards).set(updateData).where(eq(giftCards.id, id));
    } catch (error) {
      console.error("Error updating gift card:", error);
      throw new Error("Failed to update gift card");
    }
  }

  async createRedemption(data: Omit<InsertGiftCardRedemption, 'id' | 'redeemedAt'>): Promise<GiftCardRedemption> {
    try {
      const [redemption] = await db.insert(giftCardRedemptions).values({
        ...data,
        amountUsed: data.amountUsed.toString(),
      }).returning();
      
      return {
        ...redemption,
        amountUsed: parseFloat(redemption.amountUsed),
      };
    } catch (error) {
      console.error("Error creating redemption:", error);
      throw new Error("Failed to create redemption");
    }
  }

  async redeemGiftCard(giftCardId: number, userId: number | null, amount: number, orderId?: string): Promise<any> {
    try {
      // Get current gift card
      const [giftCard] = await db.select().from(giftCards).where(eq(giftCards.id, giftCardId));
      
      if (!giftCard) {
        throw new Error("Gift card not found");
      }
      
      const currentBalance = parseFloat(giftCard.balance);
      if (currentBalance < amount) {
        throw new Error("Insufficient balance");
      }
      
      const newBalance = currentBalance - amount;
      const newStatus = newBalance === 0 ? "redeemed" : "active";
      
      // Update gift card balance and status
      await this.updateGiftCard(giftCardId, {
        balance: newBalance,
        status: newStatus,
        redeemedAt: newBalance === 0 ? new Date() : undefined
      });
      
      // Create redemption record
      const redemption = await this.createRedemption({
        giftCardId,
        userId,
        orderId: orderId || null,
        amountUsed: amount,
      });
      
      return redemption;
    } catch (error) {
      console.error("Error redeeming gift card:", error);
      throw new Error("Failed to redeem gift card");
    }
  }

  async getUserReceivedGiftCards(userId: number): Promise<GiftCard[]> {
    return this.getGiftCardsByRecipientUserId(userId);
  }

  async getUserPurchasedGiftCards(userId: number): Promise<GiftCard[]> {
    // For now, return empty array since we don't track purchaser in current schema
    return [];
  }

  async updateGiftCardStatus(id: number, status: string): Promise<GiftCard | null> {
    try {
      await this.updateGiftCard(id, { status });
      return this.getGiftCardById(id);
    } catch (error) {
      console.error("Error updating gift card status:", error);
      return null;
    }
  }
}

export const giftCardsStorage = new DatabaseGiftCardsStorage();