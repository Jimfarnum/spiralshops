import { reviews, type Review, type InsertReview } from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IReviewsStorage {
  getReviewsByTarget(reviewType: string, targetId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  updateReviewHelpfulVotes(reviewId: number): Promise<Review>;
  getAverageRating(reviewType: string, targetId: string): Promise<number>;
}

export class DatabaseReviewsStorage implements IReviewsStorage {
  async getReviewsByTarget(reviewType: string, targetId: string): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(and(eq(reviews.reviewType, reviewType), eq(reviews.targetId, targetId)))
      .orderBy(desc(reviews.createdAt));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db
      .insert(reviews)
      .values(review)
      .returning();
    return newReview;
  }

  async updateReviewHelpfulVotes(reviewId: number): Promise<Review> {
    const [updatedReview] = await db
      .update(reviews)
      .set({
        helpfulVotes: reviews.helpfulVotes + 1
      })
      .where(eq(reviews.id, reviewId))
      .returning();
    return updatedReview;
  }

  async getAverageRating(reviewType: string, targetId: string): Promise<number> {
    const reviewList = await this.getReviewsByTarget(reviewType, targetId);
    if (reviewList.length === 0) return 0;
    
    const sum = reviewList.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviewList.length;
  }
}

export const reviewsStorage = new DatabaseReviewsStorage();