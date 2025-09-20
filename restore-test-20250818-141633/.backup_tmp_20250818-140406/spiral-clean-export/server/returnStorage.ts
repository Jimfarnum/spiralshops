import { returnRequests, refundTransactions, users, orders, spiralTransactions, type ReturnRequest, type InsertReturnRequest, type RefundTransaction, type InsertRefundTransaction } from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc } from "drizzle-orm";

export interface IReturnStorage {
  // Return request operations
  createReturnRequest(data: InsertReturnRequest): Promise<ReturnRequest>;
  getReturnRequestById(id: string): Promise<ReturnRequest | undefined>;
  getReturnRequestsByUser(userId: string): Promise<ReturnRequest[]>;
  getAllReturnRequests(filters?: { status?: string; limit?: number }): Promise<ReturnRequest[]>;
  updateReturnRequestStatus(id: string, status: string, decisionNote?: string, adminUserId?: string): Promise<ReturnRequest | undefined>;
  
  // Refund transaction operations
  createRefundTransaction(data: InsertRefundTransaction): Promise<RefundTransaction>;
  getRefundTransactionsByReturnId(returnId: string): Promise<RefundTransaction[]>;
  updateRefundTransactionStatus(id: string, status: string, stripeRefundId?: string): Promise<RefundTransaction | undefined>;
  
  // Business logic operations
  canUserReturnProduct(userId: string, orderId: string, productId: string): Promise<boolean>;
  getEligibleOrdersForReturn(userId: string): Promise<any[]>;
  processRefund(returnId: string, method: 'stripe' | 'spiral_credit'): Promise<RefundTransaction>;
}

export class DatabaseReturnStorage implements IReturnStorage {
  async createReturnRequest(data: InsertReturnRequest): Promise<ReturnRequest> {
    // Check if user can return this product
    const canReturn = await this.canUserReturnProduct(data.userId, data.orderId, data.productId);
    if (!canReturn) {
      throw new Error("Product is not eligible for return");
    }

    // Auto-approve low-risk returns (under $100, within 30 days)
    const autoApprove = data.originalAmount < 10000; // $100 in cents
    const status = autoApprove ? 'approved' : 'pending';

    const [returnRequest] = await db
      .insert(returnRequests)
      .values({
        ...data,
        status,
        autoApproved: autoApprove,
        decisionAt: autoApprove ? new Date() : undefined
      })
      .returning();

    return returnRequest;
  }

  async getReturnRequestById(id: string): Promise<ReturnRequest | undefined> {
    const [returnRequest] = await db
      .select()
      .from(returnRequests)
      .where(eq(returnRequests.id, id));
    return returnRequest;
  }

  async getReturnRequestsByUser(userId: string): Promise<ReturnRequest[]> {
    return await db
      .select()
      .from(returnRequests)
      .where(eq(returnRequests.userId, parseInt(userId)))
      .orderBy(desc(returnRequests.submittedAt));
  }

  async getAllReturnRequests(filters?: { status?: string; limit?: number }): Promise<ReturnRequest[]> {
    let query = db
      .select()
      .from(returnRequests)
      .orderBy(desc(returnRequests.submittedAt));

    if (filters?.status) {
      query = query.where(eq(returnRequests.status, filters.status));
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    return await query;
  }

  async updateReturnRequestStatus(
    id: string, 
    status: string, 
    decisionNote?: string, 
    adminUserId?: string
  ): Promise<ReturnRequest | undefined> {
    const [updated] = await db
      .update(returnRequests)
      .set({
        status,
        decisionNote,
        adminUserId,
        decisionAt: new Date()
      })
      .where(eq(returnRequests.id, id))
      .returning();

    return updated;
  }

  async createRefundTransaction(data: InsertRefundTransaction): Promise<RefundTransaction> {
    const [transaction] = await db
      .insert(refundTransactions)
      .values(data)
      .returning();

    return transaction;
  }

  async getRefundTransactionsByReturnId(returnId: string): Promise<RefundTransaction[]> {
    return await db
      .select()
      .from(refundTransactions)
      .where(eq(refundTransactions.returnId, returnId))
      .orderBy(desc(refundTransactions.createdAt));
  }

  async updateRefundTransactionStatus(
    id: string, 
    status: string, 
    stripeRefundId?: string
  ): Promise<RefundTransaction | undefined> {
    const [updated] = await db
      .update(refundTransactions)
      .set({
        status,
        stripeRefundId,
        completedAt: status === 'completed' ? new Date() : undefined
      })
      .where(eq(refundTransactions.id, id))
      .returning();

    return updated;
  }

  async canUserReturnProduct(userId: string, orderId: string, productId: string): Promise<boolean> {
    // Check if order exists and belongs to user
    const [order] = await db
      .select()
      .from(orders)
      .where(and(
        eq(orders.id, parseInt(orderId)),
        eq(orders.userId, parseInt(userId))
      ));

    if (!order) return false;

    // Check if product hasn't already been returned
    const existingReturn = await db
      .select()
      .from(returnRequests)
      .where(and(
        eq(returnRequests.userId, userId),
        eq(returnRequests.orderId, orderId),
        eq(returnRequests.productId, productId)
      ));

    if (existingReturn.length > 0) return false;

    // Check if within return window (30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return order.createdAt! > thirtyDaysAgo;
  }

  async getEligibleOrdersForReturn(userId: string): Promise<any[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get recent orders for the user (using integer ID)
    const userOrders = await db
      .select()
      .from(orders)
      .where(and(
        eq(orders.userId, parseInt(userId)),
        eq(orders.status, 'completed')
      ))
      .orderBy(desc(orders.createdAt));

    // Filter for orders within return window and not already returned
    const eligibleOrders = [];
    for (const order of userOrders) {
      if (order.createdAt! > thirtyDaysAgo) {
        // Check if products in this order have been returned
        const returnedProducts = await db
          .select()
          .from(returnRequests)
          .where(eq(returnRequests.orderId, order.id));

        const returnedProductIds = returnedProducts.map(r => r.productId);
        
        // Mock order items - in real app, you'd have an order_items table
        const orderItems = [
          { id: `${order.id}-item-1`, name: 'Premium Widget', price: 2999, productId: 'prod-1' },
          { id: `${order.id}-item-2`, name: 'Deluxe Gadget', price: 4999, productId: 'prod-2' }
        ].filter(item => !returnedProductIds.includes(item.productId));

        if (orderItems.length > 0) {
          eligibleOrders.push({
            ...order,
            items: orderItems
          });
        }
      }
    }

    return eligibleOrders;
  }

  async processRefund(returnId: string, method: 'stripe' | 'spiral_credit'): Promise<RefundTransaction> {
    const returnRequest = await this.getReturnRequestById(returnId);
    if (!returnRequest) {
      throw new Error("Return request not found");
    }

    if (returnRequest.status !== 'approved') {
      throw new Error("Return request must be approved before refund");
    }

    // Create refund transaction
    const refundData: InsertRefundTransaction = {
      returnId,
      userId: returnRequest.userId,
      method,
      amount: returnRequest.originalAmount,
      spiralPointsAwarded: method === 'spiral_credit' ? Math.floor(returnRequest.originalAmount / 20) : undefined // 5 SPIRALs per $1
    };

    const transaction = await this.createRefundTransaction(refundData);

    try {
      if (method === 'stripe') {
        // In a real app, you'd integrate with Stripe here
        // const refund = await stripe.refunds.create({
        //   payment_intent: originalPaymentIntentId,
        //   amount: returnRequest.originalAmount
        // });
        
        // For demo, simulate successful Stripe refund
        await this.updateRefundTransactionStatus(
          transaction.id,
          'completed',
          `stripe_refund_demo_${Date.now()}`
        );
      } else if (method === 'spiral_credit') {
        // Award SPIRAL points
        const pointsToAward = Math.floor(returnRequest.originalAmount / 20); // 5 SPIRALs per $1
        
        // Add points to user's balance (using integer IDs)
        await db
          .insert(spiralTransactions)
          .values({
            userId: returnRequest.userId,
            orderId: returnRequest.orderId,
            pointsEarned: pointsToAward,
            transactionType: 'refund',
            description: `Refund for ${returnRequest.productName}`,
            source: 'return_refund'
          });

        await this.updateRefundTransactionStatus(transaction.id, 'completed');
      }

      // Update return request status to refunded
      await this.updateReturnRequestStatus(returnId, 'refunded');

    } catch (error) {
      // Mark transaction as failed
      await this.updateRefundTransactionStatus(transaction.id, 'failed');
      throw error;
    }

    return await this.getRefundTransactionsByReturnId(returnId).then(transactions => transactions[0]);
  }
}

export const returnStorage = new DatabaseReturnStorage();