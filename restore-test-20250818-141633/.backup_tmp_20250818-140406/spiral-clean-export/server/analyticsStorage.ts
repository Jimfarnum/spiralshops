import { db } from "./db";
import { 
  retailerAnalyticsSnapshots, 
  mallAnalytics, 
  liveOrdersActivity,
  orders,
  orderItems,
  users,
  stores,
  malls
} from "../shared/schema";
import { eq, and, gte, lte, desc, count, sum, avg } from "drizzle-orm";
import type { 
  RetailerAnalyticsSnapshot, 
  InsertRetailerAnalyticsSnapshot,
  MallAnalytics,
  InsertMallAnalytics,
  LiveOrdersActivity,
  InsertLiveOrdersActivity
} from "../shared/schema";

interface AnalyticsStorage {
  // Retailer Analytics
  createRetailerSnapshot(data: InsertRetailerAnalyticsSnapshot): Promise<RetailerAnalyticsSnapshot>;
  getRetailerAnalytics(retailerId: number, timeframe?: string): Promise<RetailerAnalyticsSnapshot[]>;
  calculateRetailerMetrics(retailerId: number, timeframe: string): Promise<any>;
  
  // Mall Analytics
  createMallAnalytics(data: InsertMallAnalytics): Promise<MallAnalytics>;
  getMallAnalytics(mallId: number, timeframe?: string): Promise<MallAnalytics[]>;
  calculateMallMetrics(mallId: number): Promise<any>;
  
  // Live Orders Activity
  addLiveOrder(data: InsertLiveOrdersActivity): Promise<LiveOrdersActivity>;
  getLiveOrders(mallId?: number, limit?: number): Promise<LiveOrdersActivity[]>;
  getRecentActivity(hours?: number): Promise<LiveOrdersActivity[]>;
  
  // Real-time Dashboard Data
  getRetailerDashboardData(retailerId: number, timeframe: string): Promise<any>;
  getMallDashboardData(mallId: number): Promise<any>;
  getSystemAlerts(): Promise<any[]>;
}

class DatabaseAnalyticsStorage implements AnalyticsStorage {
  async createRetailerSnapshot(data: InsertRetailerAnalyticsSnapshot): Promise<RetailerAnalyticsSnapshot> {
    try {
      const [snapshot] = await db.insert(retailerAnalyticsSnapshots).values({
        ...data,
        sales: data.sales.toString(),
        avgOrderValue: data.avgOrderValue.toString(),
      }).returning();
      
      return {
        ...snapshot,
        sales: parseFloat(snapshot.sales),
        avgOrderValue: parseFloat(snapshot.avgOrderValue),
      } as any;
    } catch (error) {
      console.error("Error creating retailer snapshot:", error);
      throw new Error("Failed to create retailer snapshot");
    }
  }

  async getRetailerAnalytics(retailerId: number, timeframe?: string): Promise<RetailerAnalyticsSnapshot[]> {
    try {
      let query = db.select().from(retailerAnalyticsSnapshots)
        .where(eq(retailerAnalyticsSnapshots.retailerId, retailerId))
        .orderBy(desc(retailerAnalyticsSnapshots.createdAt));

      if (timeframe) {
        query = query.where(
          and(
            eq(retailerAnalyticsSnapshots.retailerId, retailerId),
            eq(retailerAnalyticsSnapshots.timeframe, timeframe)
          )
        );
      }

      const snapshots = await query.execute();
      return snapshots.map(snapshot => ({
        ...snapshot,
        sales: parseFloat(snapshot.sales),
        avgOrderValue: parseFloat(snapshot.avgOrderValue),
      })) as any;
    } catch (error) {
      console.error("Error fetching retailer analytics:", error);
      throw new Error("Failed to fetch retailer analytics");
    }
  }

  async calculateRetailerMetrics(retailerId: number, timeframe: string): Promise<any> {
    try {
      // Calculate date range based on timeframe
      const now = new Date();
      let startDate = new Date();
      
      switch (timeframe) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case '7d':
          startDate.setDate(now.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(now.getDate() - 30);
          break;
        default:
          startDate.setDate(now.getDate() - 30);
      }

      // Mock calculations for demonstration - in production would query real order data
      const mockMetrics = {
        totalSales: Math.floor(Math.random() * 50000) + 10000,
        totalOrders: Math.floor(Math.random() * 200) + 50,
        avgOrderValue: 0,
        repeatCustomers: Math.floor(Math.random() * 50) + 10,
        topProducts: [
          { name: "Premium Widget", sales: 1250, units: 15 },
          { name: "Deluxe Gadget", sales: 980, units: 12 },
          { name: "Standard Tool", sales: 750, units: 20 }
        ],
        salesByDay: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(now.getTime() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          sales: Math.floor(Math.random() * 2000) + 500
        })),
        categoryBreakdown: [
          { category: "Electronics", percentage: 45, amount: 15000 },
          { category: "Clothing", percentage: 30, amount: 10000 },
          { category: "Home & Garden", percentage: 25, amount: 8000 }
        ]
      };

      mockMetrics.avgOrderValue = mockMetrics.totalSales / mockMetrics.totalOrders;
      return mockMetrics;
    } catch (error) {
      console.error("Error calculating retailer metrics:", error);
      throw new Error("Failed to calculate retailer metrics");
    }
  }

  async createMallAnalytics(data: InsertMallAnalytics): Promise<MallAnalytics> {
    try {
      const [analytics] = await db.insert(mallAnalytics).values({
        ...data,
        totalRevenue: data.totalRevenue.toString(),
        storeMetrics: JSON.stringify(data.storeMetrics),
        loyaltySummary: JSON.stringify(data.loyaltySummary),
        footTraffic: JSON.stringify(data.footTraffic),
      }).returning();
      
      return {
        ...analytics,
        totalRevenue: parseFloat(analytics.totalRevenue),
        storeMetrics: JSON.parse(analytics.storeMetrics),
        loyaltySummary: JSON.parse(analytics.loyaltySummary),
        footTraffic: JSON.parse(analytics.footTraffic),
      } as any;
    } catch (error) {
      console.error("Error creating mall analytics:", error);
      throw new Error("Failed to create mall analytics");
    }
  }

  async getMallAnalytics(mallId: number, timeframe?: string): Promise<MallAnalytics[]> {
    try {
      const analytics = await db.select().from(mallAnalytics)
        .where(eq(mallAnalytics.mallId, mallId))
        .orderBy(desc(mallAnalytics.timestamp))
        .execute();

      return analytics.map(record => ({
        ...record,
        totalRevenue: parseFloat(record.totalRevenue),
        storeMetrics: JSON.parse(record.storeMetrics),
        loyaltySummary: JSON.parse(record.loyaltySummary),
        footTraffic: JSON.parse(record.footTraffic),
      })) as any;
    } catch (error) {
      console.error("Error fetching mall analytics:", error);
      throw new Error("Failed to fetch mall analytics");
    }
  }

  async calculateMallMetrics(mallId: number): Promise<any> {
    try {
      // Mock mall-wide metrics for demonstration
      const mockMallMetrics = {
        totalRevenue: Math.floor(Math.random() * 500000) + 100000,
        totalStores: Math.floor(Math.random() * 50) + 20,
        totalOrders: Math.floor(Math.random() * 1000) + 300,
        avgOrderValue: 0,
        topStores: [
          { name: "TechWorld Electronics", revenue: 45000, orders: 180, growth: 15.2 },
          { name: "Fashion Forward", revenue: 38000, orders: 220, growth: 12.8 },
          { name: "Home Essentials", revenue: 32000, orders: 150, growth: 8.5 },
          { name: "Sports Central", revenue: 28000, orders: 130, growth: 22.1 },
          { name: "Beauty Boutique", revenue: 25000, orders: 200, growth: 18.7 }
        ],
        revenueByCategory: [
          { category: "Electronics", revenue: 125000, percentage: 35 },
          { category: "Fashion", revenue: 100000, percentage: 28 },
          { category: "Home & Garden", revenue: 75000, percentage: 21 },
          { category: "Sports", revenue: 50000, percentage: 14 },
          { category: "Beauty", revenue: 25000, percentage: 7 }
        ],
        footTrafficByHour: Array.from({ length: 24 }, (_, hour) => ({
          hour,
          visitors: Math.floor(Math.random() * 200) + 50
        })),
        loyaltyMetrics: {
          totalMembers: 15420,
          pointsIssued: 1250000,
          pointsRedeemed: 850000,
          topEarners: [
            { name: "Sarah Johnson", points: 15800, tier: "Platinum" },
            { name: "Mike Chen", points: 12450, tier: "Gold" },
            { name: "Lisa Brown", points: 9820, tier: "Silver" }
          ]
        }
      };

      mockMallMetrics.avgOrderValue = mockMallMetrics.totalRevenue / mockMallMetrics.totalOrders;
      return mockMallMetrics;
    } catch (error) {
      console.error("Error calculating mall metrics:", error);
      throw new Error("Failed to calculate mall metrics");
    }
  }

  async addLiveOrder(data: InsertLiveOrdersActivity): Promise<LiveOrdersActivity> {
    try {
      const [order] = await db.insert(liveOrdersActivity).values({
        ...data,
        amount: data.amount.toString(),
      }).returning();
      
      return {
        ...order,
        amount: parseFloat(order.amount),
      } as any;
    } catch (error) {
      console.error("Error adding live order:", error);
      throw new Error("Failed to add live order");
    }
  }

  async getLiveOrders(mallId?: number, limit: number = 20): Promise<LiveOrdersActivity[]> {
    try {
      let query = db.select().from(liveOrdersActivity)
        .orderBy(desc(liveOrdersActivity.timestamp))
        .limit(limit);

      if (mallId) {
        query = db.select().from(liveOrdersActivity)
          .where(eq(liveOrdersActivity.mallId, mallId))
          .orderBy(desc(liveOrdersActivity.timestamp))
          .limit(limit);
      }

      const orders = await query.execute();
      return orders.map(order => ({
        ...order,
        amount: parseFloat(order.amount),
      })) as any;
    } catch (error) {
      console.error("Error fetching live orders:", error);
      throw new Error("Failed to fetch live orders");
    }
  }

  async getRecentActivity(hours: number = 24): Promise<LiveOrdersActivity[]> {
    try {
      const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
      
      const orders = await db.select().from(liveOrdersActivity)
        .where(gte(liveOrdersActivity.timestamp, cutoffTime))
        .orderBy(desc(liveOrdersActivity.timestamp))
        .execute();

      return orders.map(order => ({
        ...order,
        amount: parseFloat(order.amount),
      })) as any;
    } catch (error) {
      console.error("Error fetching recent activity:", error);
      throw new Error("Failed to fetch recent activity");
    }
  }

  async getRetailerDashboardData(retailerId: number, timeframe: string): Promise<any> {
    try {
      const metrics = await this.calculateRetailerMetrics(retailerId, timeframe);
      const recentActivity = await this.getRecentActivity(24);
      const retailerActivity = recentActivity.filter(order => order.retailerId === retailerId);

      return {
        ...metrics,
        recentOrders: retailerActivity.slice(0, 10),
        alerts: [
          { 
            type: "info", 
            message: "You have 3 products with low stock", 
            priority: "medium",
            timestamp: new Date().toISOString()
          },
          { 
            type: "success", 
            message: "Sales are up 15% from last week", 
            priority: "low",
            timestamp: new Date().toISOString()
          }
        ]
      };
    } catch (error) {
      console.error("Error fetching retailer dashboard data:", error);
      throw new Error("Failed to fetch retailer dashboard data");
    }
  }

  async getMallDashboardData(mallId: number): Promise<any> {
    try {
      const metrics = await this.calculateMallMetrics(mallId);
      const liveOrders = await this.getLiveOrders(mallId, 20);

      return {
        ...metrics,
        liveOrders,
        systemAlerts: [
          {
            type: "warning",
            message: "High traffic detected in North Wing",
            priority: "high",
            timestamp: new Date().toISOString()
          },
          {
            type: "info",
            message: "5 new stores joined this month",
            priority: "low",
            timestamp: new Date().toISOString()
          }
        ]
      };
    } catch (error) {
      console.error("Error fetching mall dashboard data:", error);
      throw new Error("Failed to fetch mall dashboard data");
    }
  }

  async getSystemAlerts(): Promise<any[]> {
    try {
      // Mock system alerts for demonstration
      return [
        {
          id: 1,
          type: "inventory",
          message: "Low stock alert: 15 products below threshold",
          priority: "high",
          timestamp: new Date().toISOString(),
          affectedStores: 8
        },
        {
          id: 2,
          type: "sales",
          message: "Sales surge: 25% increase in last hour",
          priority: "medium",
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          affectedStores: 12
        },
        {
          id: 3,
          type: "system",
          message: "Performance optimization completed",
          priority: "low",
          timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
          affectedStores: 0
        }
      ];
    } catch (error) {
      console.error("Error fetching system alerts:", error);
      throw new Error("Failed to fetch system alerts");
    }
  }
}

export const analyticsStorage = new DatabaseAnalyticsStorage();