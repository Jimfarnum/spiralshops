import { stores, retailers, type Store, type Retailer, type InsertStore, type InsertRetailer } from "@shared/schema";

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
}

export const storage = new MemStorage();
