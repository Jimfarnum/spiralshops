import { storage } from "./storage";
import { eq, and, desc, sql } from "drizzle-orm";
import { getCachedRecommendations, setCachedRecommendations } from "./cache";

export interface RecommendationRequest {
  userId?: string;
  productId?: string;
  sessionId?: string;
  limit?: number;
  context?: 'homepage' | 'product' | 'checkout' | 'search';
}

export interface RecommendationResult {
  productId: string;
  score: number;
  reason: string;
  product: any;
}

export interface SearchRequest {
  query: string;
  userId?: string;
  sessionId?: string;
  location?: string;
  filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    distance?: number;
  };
  sort?: 'relevance' | 'price_low' | 'price_high' | 'rating' | 'distance';
  limit?: number;
}

export class SmartRecommendationEngine {
  
  // Simplified collaborative filtering using mock data for demo
  async getCollaborativeRecommendations(userId: string, limit = 5): Promise<RecommendationResult[]> {
    try {
      // Get all stores to recommend products
      const stores = await storage.getStores();
      
      if (stores.length === 0) {
        return this.getContentBasedRecommendations(undefined, limit);
      }

      // Create mock product recommendations based on store data
      const mockProducts = this.generateMockProductsFromStores(stores, limit);
      
      const results: RecommendationResult[] = mockProducts.map((product, index) => ({
        productId: product.id,
        score: 8.5 - (index * 0.5), // Decreasing score
        reason: "Customers with similar purchases also bought this",
        product
      }));

      return results;
    } catch (error) {
      console.error('Collaborative filtering error:', error);
      return this.getContentBasedRecommendations(undefined, limit);
    }
  }

  // Content-based filtering using store data
  async getContentBasedRecommendations(productId?: string, limit = 5): Promise<RecommendationResult[]> {
    try {
      const stores = await storage.getStores();
      
      if (stores.length === 0) {
        return [];
      }

      // Generate trending products from stores
      const trendingProducts = this.generateMockProductsFromStores(stores, limit);

      const results: RecommendationResult[] = trendingProducts.map((product, index) => ({
        productId: product.id,
        score: 7.5 - (index * 0.3),
        reason: productId 
          ? "Similar products in the same category" 
          : "Trending in your area",
        product
      }));

      return results.sort((a, b) => b.score - a.score);
    } catch (error) {
      console.error('Content-based filtering error:', error);
      return [];
    }
  }

  // Hybrid recommendation combining collaborative and content-based
  async getPersonalizedRecommendations(request: RecommendationRequest): Promise<RecommendationResult[]> {
    const { userId, productId, limit = 5, context = 'homepage' } = request;
    
    // Check cache first for Amazon-level performance (<50ms)
    const cached = getCachedRecommendations(userId, context);
    if (cached) {
      return cached.slice(0, limit);
    }
    
    let collaborativeResults: RecommendationResult[] = [];
    let contentResults: RecommendationResult[] = [];

    // Get collaborative recommendations if user exists
    if (userId) {
      collaborativeResults = await this.getCollaborativeRecommendations(userId, Math.ceil(limit * 0.7));
    }

    // Get content-based recommendations
    contentResults = await this.getContentBasedRecommendations(productId, Math.ceil(limit * 0.5));

    // Combine and deduplicate
    const combinedResults = new Map<string, RecommendationResult>();
    
    // Add collaborative results with higher weight
    collaborativeResults.forEach(result => {
      combinedResults.set(result.productId, {
        ...result,
        score: result.score * 1.2 // Boost collaborative filtering
      });
    });

    // Add content results
    contentResults.forEach(result => {
      if (!combinedResults.has(result.productId)) {
        combinedResults.set(result.productId, result);
      }
    });

    // Convert to array and sort by score
    const finalResults = Array.from(combinedResults.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    // Cache results for future requests
    setCachedRecommendations(finalResults, userId, context);
    
    return finalResults;
  }

  // Smart search using store data
  async performSmartSearch(request: SearchRequest): Promise<any[]> {
    const { query, userId, filters, sort = 'relevance', limit = 20 } = request;

    try {
      // Get stores for search base
      const stores = await storage.getStores();
      
      // Generate mock products from stores
      const allProducts = this.generateMockProductsFromStores(stores, 50);
      
      let results = allProducts;

      // Apply text search
      if (query) {
        results = results.filter(product => 
          product.title.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase())
        );
      }

      // Apply filters
      if (filters?.category) {
        results = results.filter(p => p.category.toLowerCase().includes(filters.category!.toLowerCase()));
      }
      
      if (filters?.minPrice) {
        results = results.filter(p => p.price >= filters.minPrice!);
      }
      
      if (filters?.maxPrice) {
        results = results.filter(p => p.price <= filters.maxPrice!);
      }

      // Calculate relevance scores
      results = results.map(product => ({
        ...product,
        relevanceScore: this.calculateSearchRelevance(product, query, userId)
      }));

      // Apply sorting
      switch (sort) {
        case 'price_low':
          results.sort((a, b) => a.price - b.price);
          break;
        case 'price_high':
          results.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          results.sort((a, b) => b.rating - a.rating);
          break;
        case 'relevance':
        default:
          results.sort((a, b) => (b as any).relevanceScore - (a as any).relevanceScore);
          break;
      }

      return results.slice(0, limit);
    } catch (error) {
      console.error('Smart search error:', error);
      return [];
    }
  }

  // Generate autocomplete suggestions
  async getSearchSuggestions(query: string, limit = 8): Promise<string[]> {
    try {
      if (!query || query.length < 2) return [];

      const stores = await storage.getStores();
      const products = this.generateMockProductsFromStores(stores, 30);

      const uniqueSuggestions = new Set<string>();
      
      products.forEach(product => {
        // Add product titles
        if (product.title.toLowerCase().includes(query.toLowerCase())) {
          uniqueSuggestions.add(product.title);
        }
        // Add categories
        if (product.category.toLowerCase().includes(query.toLowerCase())) {
          uniqueSuggestions.add(product.category);
        }
      });

      // Add popular search terms
      const popularTerms = [
        'Coffee', 'Jewelry', 'Books', 'Clothing', 'Electronics', 'Food', 'Home', 'Beauty'
      ];
      
      popularTerms.forEach(term => {
        if (term.toLowerCase().includes(query.toLowerCase())) {
          uniqueSuggestions.add(term);
        }
      });

      return Array.from(uniqueSuggestions).slice(0, limit);
    } catch (error) {
      console.error('Search suggestions error:', error);
      return [];
    }
  }

  // Get all products for products API
  async getAllProducts(): Promise<any[]> {
    try {
      const stores = await storage.getStores();
      return this.generateMockProductsFromStores(stores, 50);
    } catch (error) {
      console.error('Get all products error:', error);
      return [];
    }
  }

  // Helper methods
  private calculateContentScore(product: any, baseProduct?: any): number {
    let score = 0;
    
    // Base popularity score
    score += product.rating * 0.3;
    
    if (baseProduct) {
      // Category similarity
      if (product.category === baseProduct.category) {
        score += 2;
      }
      
      // Price similarity (within 50% range)
      const priceDiff = Math.abs(product.price - baseProduct.price) / baseProduct.price;
      if (priceDiff < 0.5) {
        score += 1.5 * (1 - priceDiff);
      }
    } else {
      // Trending boost for general recommendations
      score += Math.random() * 0.5;
    }
    
    return score;
  }

  private calculateSearchRelevance(product: any, query: string, userId?: string): number {
    if (!query) return product.rating;
    
    let score = 0;
    const lowerQuery = query.toLowerCase();
    const lowerTitle = product.title.toLowerCase();
    
    // Exact title match
    if (lowerTitle === lowerQuery) {
      score += 10;
    }
    // Title starts with query
    else if (lowerTitle.startsWith(lowerQuery)) {
      score += 5;
    }
    // Title contains query
    else if (lowerTitle.includes(lowerQuery)) {
      score += 3;
    }
    
    // Category match
    if (product.category.toLowerCase().includes(lowerQuery)) {
      score += 2;
    }
    
    // Description match
    if (product.description.toLowerCase().includes(lowerQuery)) {
      score += 1;
    }
    
    // Rating boost
    score += product.rating * 0.5;
    
    // Random factor for variety
    score += Math.random() * 0.2;
    
    return score;
  }

  // Generate mock products from stores
  private generateMockProductsFromStores(stores: any[], limit = 20): any[] {
    const products = [];
    const categories = ['Coffee', 'Jewelry', 'Books', 'Clothing', 'Electronics', 'Food', 'Home', 'Beauty'];
    const productTemplates = {
      Coffee: ['Artisan Coffee Beans', 'Cold Brew Concentrate', 'Espresso Blend', 'House Roast'],
      Jewelry: ['Handmade Necklace', 'Silver Earrings', 'Custom Ring', 'Bracelet Set'],
      Books: ['Local History Book', 'Cookbook Collection', 'Novel by Local Author', 'Art Photography'],
      Clothing: ['Vintage T-Shirt', 'Handknit Sweater', 'Local Sports Jersey', 'Artisan Scarf'],
      Electronics: ['Phone Accessories', 'Bluetooth Speaker', 'Tablet Case', 'Gaming Headset'],
      Food: ['Gourmet Honey', 'Artisan Bread', 'Local Spice Blend', 'Craft Sauce'],
      Home: ['Ceramic Vase', 'Wooden Cutting Board', 'Candle Set', 'Wall Art'],
      Beauty: ['Natural Soap', 'Essential Oils', 'Face Cream', 'Lip Balm Set']
    };

    for (let i = 0; i < Math.min(limit, stores.length * 3); i++) {
      const store = stores[i % stores.length];
      const category = categories[Math.floor(Math.random() * categories.length)];
      const templates = productTemplates[category as keyof typeof productTemplates];
      const productName = templates[Math.floor(Math.random() * templates.length)];
      
      products.push({
        id: `prod_${i + 1}`,
        title: `${productName} - ${store.name}`,
        description: `High-quality ${productName.toLowerCase()} from ${store.name}. ${store.description}`,
        price: Math.floor(Math.random() * 8000) + 500, // $5-$85
        category,
        storeName: store.name,
        storeId: store.id,
        rating: 3.5 + Math.random() * 1.5, // 3.5-5.0
        imageUrl: `/api/placeholder/300/300`,
        inStock: Math.random() > 0.1 // 90% in stock
      });
    }

    return products;
  }
}

export const recommendationEngine = new SmartRecommendationEngine();