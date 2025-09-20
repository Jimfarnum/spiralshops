import { stores, retailers, users, spiralTransactions, orders, type Store, type Retailer, type InsertStore, type InsertRetailer, type User, type InsertUser, type SpiralTransaction, type InsertSpiralTransaction, type Order, type InsertOrder } from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  // Store operations
  getStores(): Promise<Store[]>;
  getStoresByZipCode(zipCode: string): Promise<Store[]>;
  getStore(id: number): Promise<Store | undefined>;
  createStore(store: InsertStore): Promise<Store>;
  updateStore(id: number, store: Partial<InsertStore>): Promise<Store | undefined>;
  deleteStore(id: number): Promise<boolean>;
  
  // Retailer operations
  getRetailers(): Promise<Retailer[]>;
  getRetailer(id: number): Promise<Retailer | undefined>;
  createRetailer(retailer: InsertRetailer): Promise<Retailer>;
  updateRetailer(id: number, retailer: Partial<InsertRetailer>): Promise<Retailer | undefined>;
  deleteRetailer(id: number): Promise<boolean>;

  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;

  // SPIRAL loyalty operations
  getUserSpiralBalance(userId: number): Promise<number>;
  addSpiralTransaction(transaction: InsertSpiralTransaction): Promise<SpiralTransaction>;
  getSpiralTransactions(userId: number, limit?: number): Promise<SpiralTransaction[]>;
  calculateSpiralsEarned(amount: number, source: 'online_purchase' | 'in_person_purchase'): number;

  // Order operations
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(orderNumber: string): Promise<Order | undefined>;
  getUserOrders(userId: number): Promise<Order[]>;

  // Additional API methods
  getUsers(): Promise<User[]>;
  getWishlist(userId: number): Promise<any[]>;
  getSocialShares(): Promise<any[]>;
  getInviteCodes(userId: string): Promise<any[]>;
  getAnalyticsDashboard(): Promise<any>;
  getAllTransactions(): Promise<any[]>;
}

export class DatabaseStorage implements IStorage {
  async getStores(): Promise<Store[]> {
    return await db.select().from(stores);
  }

  async getStoresByZipCode(zipCode: string): Promise<Store[]> {
    return await db.select().from(stores).where(eq(stores.zipCode, zipCode));
  }

  async getStore(id: number): Promise<Store | undefined> {
    const [store] = await db.select().from(stores).where(eq(stores.id, id));
    return store || undefined;
  }

  async createStore(insertStore: InsertStore): Promise<Store> {
    const [store] = await db.insert(stores).values(insertStore).returning();
    return store;
  }

  async updateStore(id: number, updateData: Partial<InsertStore>): Promise<Store | undefined> {
    const [store] = await db.update(stores).set(updateData).where(eq(stores.id, id)).returning();
    return store || undefined;
  }

  async deleteStore(id: number): Promise<boolean> {
    const result = await db.delete(stores).where(eq(stores.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getRetailers(): Promise<Retailer[]> {
    return await db.select().from(retailers);
  }

  async getRetailer(id: number): Promise<Retailer | undefined> {
    const [retailer] = await db.select().from(retailers).where(eq(retailers.id, id));
    return retailer || undefined;
  }

  async createRetailer(insertRetailer: InsertRetailer): Promise<Retailer> {
    const [retailer] = await db.insert(retailers).values(insertRetailer).returning();
    return retailer;
  }

  async updateRetailer(id: number, updateData: Partial<InsertRetailer>): Promise<Retailer | undefined> {
    const [retailer] = await db.update(retailers).set(updateData).where(eq(retailers.id, id)).returning();
    return retailer || undefined;
  }

  async deleteRetailer(id: number): Promise<boolean> {
    const result = await db.delete(retailers).where(eq(retailers.id, id));
    return (result.rowCount || 0) > 0;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return user || undefined;
  }

  // SPIRAL loyalty operations
  async getUserSpiralBalance(userId: number): Promise<number> {
    const [user] = await db.select({ balance: users.spiralBalance }).from(users).where(eq(users.id, userId));
    return user?.balance || 0;
  }

  async addSpiralTransaction(transaction: InsertSpiralTransaction): Promise<SpiralTransaction> {
    const [spiralTransaction] = await db.insert(spiralTransactions).values(transaction).returning();
    
    // Update user's SPIRAL balance
    if (transaction.type === 'earned') {
      await db.update(users)
        .set({ 
          spiralBalance: sql`spiral_balance + ${transaction.amount}`,
          totalEarned: sql`total_earned + ${transaction.amount}`
        })
        .where(eq(users.id, transaction.userId));
    } else if (transaction.type === 'redeemed') {
      await db.update(users)
        .set({ 
          spiralBalance: sql`spiral_balance - ${transaction.amount}`,
          totalRedeemed: sql`total_redeemed + ${transaction.amount}`
        })
        .where(eq(users.id, transaction.userId));
    }
    
    return spiralTransaction;
  }

  async getSpiralTransactions(userId: number, limit: number = 50): Promise<SpiralTransaction[]> {
    return await db.select()
      .from(spiralTransactions)
      .where(eq(spiralTransactions.userId, userId))
      .orderBy(desc(spiralTransactions.createdAt))
      .limit(limit);
  }

  calculateSpiralsEarned(amount: number, source: 'online_purchase' | 'in_person_purchase'): number {
    // 5 SPIRALS for every $100 spent online
    // 10 SPIRALS for every $100 spent in person
    const rate = source === 'online_purchase' ? 5 : 10;
    return Math.floor((amount / 100) * rate);
  }

  // Order operations
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db.insert(orders).values(insertOrder).returning();
    return order;
  }

  async getOrder(orderNumber: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber));
    return order || undefined;
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return await db.select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
  }

  // Additional API method implementations
  async getUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getWishlist(userId: number): Promise<any[]> {
    // Mock wishlist data for demo
    return [
      { id: 1, productId: "prod_1", productName: "Silver Earrings", addedAt: new Date().toISOString() },
      { id: 2, productId: "prod_2", productName: "Coffee Mug", addedAt: new Date().toISOString() }
    ];
  }

  async getSocialShares(): Promise<any[]> {
    // Mock social shares data
    return [
      { id: 1, platform: "facebook", shares: 250, clicks: 125 },
      { id: 2, platform: "twitter", shares: 180, clicks: 95 }
    ];
  }

  async getInviteCodes(userId: string): Promise<any[]> {
    // Mock invite codes data
    return [
      { id: 1, code: "SPIRAL123", uses: 5, spiralsEarned: 50 },
      { id: 2, code: "REFER456", uses: 2, spiralsEarned: 20 }
    ];
  }

  async getAnalyticsDashboard(): Promise<any> {
    // Mock analytics dashboard data
    return {
      totalUsers: 1245,
      totalOrders: 987,
      totalRevenue: 125000,
      spiralsCirculated: 45000,
      topCategories: ["Electronics", "Food & Beverage", "Clothing"]
    };
  }

  async getAllTransactions(): Promise<any[]> {
    return await db.select().from(spiralTransactions).orderBy(desc(spiralTransactions.createdAt));
  }
}

export class MemStorage implements IStorage {
  private stores: Map<number, Store>;
  private retailers: Map<number, Retailer>;
  private currentStoreId: number;
  private currentRetailerId: number;

  constructor() {
    this.stores = new Map();
    this.retailers = new Map();
    this.currentStoreId = 1;
    this.currentRetailerId = 1;
    
    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleStores: Store[] = [
      {
        id: 1,
        name: "Vintage Threads",
        description: "Curated vintage clothing and accessories",
        category: "clothing",
        address: "123 Main St, Downtown",
        phone: "(555) 123-4567",
        email: "info@vintagethreads.com",
        zipCode: "12345",
        rating: "4.8",
        reviewCount: 124,
        isOpen: true,
        isVerified: true,
        verificationStatus: "approved",
        verificationTier: "tier_1",
        verificationDocumentPath: null,
        submittedAt: new Date(),
        reviewedAt: null,
        rejectionReason: null,
        website: null,
        isLargeRetailer: false,
        hours: "Mon-Fri: 9AM-7PM, Sat: 10AM-6PM, Sun: 12PM-5PM",
        imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        perks: ["15% off first purchase", "Free alterations"],
      },
      {
        id: 2,
        name: "Brew & Bean",
        description: "Artisanal coffee and fresh pastries",
        category: "food",
        address: "456 Oak Ave, Arts District",
        phone: "(555) 234-5678",
        email: "hello@brewandbean.com",
        zipCode: "12345",
        rating: "4.9",
        reviewCount: 89,
        isOpen: true,
        hours: "Mon-Fri: 6AM-8PM, Sat-Sun: 7AM-9PM",
        imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        perks: ["Free WiFi", "Loyalty program"],
        isVerified: true,
        verificationStatus: "approved",
        verificationTier: "tier_1",
        verificationDocumentPath: null,
        submittedAt: new Date(),
        reviewedAt: null,
        rejectionReason: null,
        website: null,
        isLargeRetailer: false,
      },
      {
        id: 3,
        name: "Page Turner Books",
        description: "Independent bookstore with rare finds",
        category: "books",
        address: "789 Elm St, University District",
        phone: "(555) 345-6789",
        email: "books@pageturner.com",
        zipCode: "12345",
        rating: "4.7",
        reviewCount: 156,
        isOpen: true,
        hours: "Mon-Thu: 10AM-8PM, Fri-Sat: 10AM-9PM, Sun: 11AM-6PM",
        imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        perks: ["Book club discounts", "Special orders"],
        isVerified: true,
        verificationStatus: "approved",
        verificationTier: "tier_1",
        verificationDocumentPath: null,
        submittedAt: new Date(),
        reviewedAt: null,
        rejectionReason: null,
        website: null,
        isLargeRetailer: false,
      },
      {
        id: 4,
        name: "Green Thumb Nursery",
        description: "Plants, pots, and gardening supplies",
        category: "home",
        address: "321 Garden Way, Suburbs",
        phone: "(555) 456-7890",
        email: "grow@greenthumb.com",
        zipCode: "12346",
        rating: "4.6",
        reviewCount: 203,
        isOpen: true,
        hours: "Mon-Sat: 8AM-7PM, Sun: 9AM-6PM",
        imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        perks: ["Plant care workshops", "Seasonal discounts"],
        isVerified: true,
        verificationStatus: "approved",
        verificationTier: "tier_1",
        verificationDocumentPath: null,
        submittedAt: new Date(),
        reviewedAt: null,
        rejectionReason: null,
        website: null,
        isLargeRetailer: false,
      },
      {
        id: 5,
        name: "Sweet Delights Bakery",
        description: "Fresh baked goods and custom cakes",
        category: "food",
        address: "654 Bakery Lane, Old Town",
        phone: "(555) 567-8901",
        email: "orders@sweetdelights.com",
        zipCode: "12345",
        rating: "4.8",
        reviewCount: 178,
        isOpen: true,
        hours: "Tue-Sat: 6AM-6PM, Sun: 7AM-3PM, Mon: Closed",
        imageUrl: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        perks: ["Birthday cake discounts", "Fresh daily specials"],
        isVerified: true,
        verificationStatus: "approved",
        verificationTier: "tier_1",
        verificationDocumentPath: null,
        submittedAt: new Date(),
        reviewedAt: null,
        rejectionReason: null,
        website: null,
        isLargeRetailer: false,
      },
      {
        id: 6,
        name: "Sparkling Gems",
        description: "Handcrafted jewelry and accessories",
        category: "jewelry",
        address: "987 Jewelry Row, Shopping District",
        phone: "(555) 678-9012",
        email: "shine@sparklinggems.com",
        zipCode: "12345",
        rating: "4.9",
        reviewCount: 92,
        isOpen: true,
        hours: "Mon-Sat: 10AM-7PM, Sun: 12PM-5PM",
        imageUrl: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        perks: ["Custom designs", "Free cleaning service"],
        isVerified: true,
        verificationStatus: "approved",
        verificationTier: "tier_1",
        verificationDocumentPath: null,
        submittedAt: new Date(),
        reviewedAt: null,
        rejectionReason: null,
        website: null,
        isLargeRetailer: false,
      },
    ];

    sampleStores.forEach(store => {
      this.stores.set(store.id, store);
      this.currentStoreId = Math.max(this.currentStoreId, store.id + 1);
    });
  }

  async getStores(): Promise<Store[]> {
    return Array.from(this.stores.values());
  }

  async getStoresByZipCode(zipCode: string): Promise<Store[]> {
    return Array.from(this.stores.values()).filter(store => store.zipCode === zipCode);
  }

  async getStore(id: number): Promise<Store | undefined> {
    return this.stores.get(id);
  }

  async createStore(insertStore: InsertStore): Promise<Store> {
    const id = this.currentStoreId++;
    const store: Store = {
      ...insertStore,
      id,
      rating: "0.0",
      reviewCount: 0,
      isOpen: true,
      hours: insertStore.hours || "Mon-Fri: 9AM-5PM",
      perks: insertStore.perks || [],
      imageUrl: insertStore.imageUrl || null,
      isVerified: false,
      verificationStatus: "pending",
      verificationTier: "Unverified",
      verificationDocumentPath: null,
      submittedAt: new Date(),
      reviewedAt: null,
      rejectionReason: null,
      website: null,
      isLargeRetailer: false,
    };
    this.stores.set(id, store);
    return store;
  }

  async updateStore(id: number, updateData: Partial<InsertStore>): Promise<Store | undefined> {
    const store = this.stores.get(id);
    if (!store) return undefined;
    
    const updatedStore = { ...store, ...updateData };
    this.stores.set(id, updatedStore);
    return updatedStore;
  }

  async deleteStore(id: number): Promise<boolean> {
    return this.stores.delete(id);
  }

  async getRetailers(): Promise<Retailer[]> {
    return Array.from(this.retailers.values());
  }

  async getRetailer(id: number): Promise<Retailer | undefined> {
    return this.retailers.get(id);
  }

  async createRetailer(insertRetailer: InsertRetailer): Promise<Retailer> {
    const id = this.currentRetailerId++;
    const retailer: Retailer = {
      ...insertRetailer,
      id,
      approved: false,
      description: insertRetailer.description || null,
      plan: insertRetailer.plan || "free",
      mallName: insertRetailer.mallName || null,
      stripeAccountId: insertRetailer.stripeAccountId || null,
      onboardingStatus: insertRetailer.onboardingStatus || "pending",
      latitude: insertRetailer.latitude || null,
      longitude: insertRetailer.longitude || null,
      allowPartnerFulfillment: insertRetailer.allowPartnerFulfillment ?? true,
      fulfillmentRadius: insertRetailer.fulfillmentRadius || 25,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.retailers.set(id, retailer);
    return retailer;
  }

  async updateRetailer(id: number, updateData: Partial<InsertRetailer>): Promise<Retailer | undefined> {
    const retailer = this.retailers.get(id);
    if (!retailer) return undefined;
    
    const updatedRetailer = { ...retailer, ...updateData };
    this.retailers.set(id, updatedRetailer);
    return updatedRetailer;
  }

  async deleteRetailer(id: number): Promise<boolean> {
    return this.retailers.delete(id);
  }

  // User operations (mock implementations for MemStorage)
  async getUser(id: number): Promise<User | undefined> {
    // Mock implementation - in production this would use the database
    return undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    // Mock implementation - in production this would use the database
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Mock implementation - in production this would use the database
    throw new Error("User creation not implemented in MemStorage");
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    // Mock implementation
    return undefined;
  }

  async getUserSpiralBalance(userId: number): Promise<number> {
    return 0;
  }

  async addSpiralTransaction(transaction: InsertSpiralTransaction): Promise<SpiralTransaction> {
    throw new Error("SPIRAL transactions not implemented in MemStorage");
  }

  async getSpiralTransactions(userId: number, limit?: number): Promise<SpiralTransaction[]> {
    return [];
  }

  calculateSpiralsEarned(amount: number, source: 'online_purchase' | 'in_person_purchase'): number {
    const rate = source === 'online_purchase' ? 5 : 10;
    return Math.floor((amount / 100) * rate);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    throw new Error("Order creation not implemented in MemStorage");
  }

  async getOrder(orderNumber: string): Promise<Order | undefined> {
    return undefined;
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return [];
  }

  // Additional API methods required by IStorage interface
  async getUsers(): Promise<User[]> {
    // Mock implementation - return empty array
    return [];
  }

  async getWishlist(userId: number): Promise<any[]> {
    // Mock wishlist data
    return [];
  }

  async getSocialShares(): Promise<any[]> {
    // Mock social shares data
    return [];
  }

  async getInviteCodes(userId: string): Promise<any[]> {
    // Mock invite codes data
    return [];
  }

  async getAnalyticsDashboard(): Promise<any> {
    // Mock analytics dashboard data
    return {
      totalUsers: 0,
      totalOrders: 0,
      totalRevenue: 0,
      spiralsCirculated: 0,
      topCategories: []
    };
  }

  async getAllTransactions(): Promise<any[]> {
    // Mock transactions data
    return [];
  }
}

// Use DatabaseStorage for production with PostgreSQL
export const storage = process.env.DATABASE_URL ? new DatabaseStorage() : new MemStorage();
