import { giftCards, type GiftCard, type InsertGiftCard } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IGiftCardsStorage {
  createGiftCard(giftCard: InsertGiftCard): Promise<GiftCard>;
  getGiftCardByCode(code: string): Promise<GiftCard | undefined>;
  getUserGiftCards(userId: number): Promise<GiftCard[]>;
  redeemGiftCard(code: string, amount: number): Promise<GiftCard>;
  updateGiftCardBalance(code: string, newBalance: number): Promise<GiftCard>;
}

export class DatabaseGiftCardsStorage implements IGiftCardsStorage {
  async createGiftCard(giftCard: InsertGiftCard): Promise<GiftCard> {
    const [newGiftCard] = await db
      .insert(giftCards)
      .values({
        ...giftCard,
        code: this.generateGiftCardCode(),
      })
      .returning();
    return newGiftCard;
  }

  async getGiftCardByCode(code: string): Promise<GiftCard | undefined> {
    const [giftCard] = await db
      .select()
      .from(giftCards)
      .where(eq(giftCards.code, code));
    return giftCard;
  }

  async getUserGiftCards(userId: number): Promise<GiftCard[]> {
    return await db
      .select()
      .from(giftCards)
      .where(eq(giftCards.purchasedByUserId, userId));
  }

  async redeemGiftCard(code: string, amount: number): Promise<GiftCard> {
    const giftCard = await this.getGiftCardByCode(code);
    if (!giftCard) {
      throw new Error("Gift card not found");
    }
    
    const newBalance = (parseFloat(giftCard.currentBalance) - amount).toFixed(2);
    
    const [updatedGiftCard] = await db
      .update(giftCards)
      .set({
        currentBalance: newBalance,
        redeemedAt: new Date(),
      })
      .where(eq(giftCards.code, code))
      .returning();
    return updatedGiftCard;
  }

  async updateGiftCardBalance(code: string, newBalance: number): Promise<GiftCard> {
    const [updatedGiftCard] = await db
      .update(giftCards)
      .set({
        currentBalance: newBalance.toFixed(2),
      })
      .where(eq(giftCards.code, code))
      .returning();
    return updatedGiftCard;
  }

  private generateGiftCardCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'SPIRAL-';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
      if (i === 3) result += '-';
    }
    return result;
  }
}

export const giftCardsStorage = new DatabaseGiftCardsStorage();