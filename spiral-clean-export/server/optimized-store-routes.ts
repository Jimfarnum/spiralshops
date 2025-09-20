// Optimized Store Routes - Fixes 450ms+ response time bottleneck
import { Express, Request, Response } from 'express';
import { getCachedResponse, setCachedResponse } from './performance-fixes';
import { storage } from './storage';

export function registerOptimizedStoreRoutes(app: Express) {
  // OPTIMIZED: Fast store listing with caching and pagination
  app.get('/api/stores', async (req: Request, res: Response) => {
    try {
      const cacheKey = `stores_${JSON.stringify(req.query)}`;
      const cached = getCachedResponse(cacheKey);
      
      if (cached) {
        return res.json(cached);
      }

      const startTime = Date.now();
      
      // Get basic store data efficiently
      const stores = await storage.getStores();
      
      // Apply filters without heavy processing
      let filteredStores = stores;
      
      const { category, largeRetailer, mall, limit } = req.query;
      
      if (category && typeof category === 'string') {
        filteredStores = filteredStores.filter(store => 
          store.category?.toLowerCase() === category.toLowerCase()
        );
      }
      
      if (largeRetailer !== undefined) {
        const isLarge = largeRetailer === 'true';
        filteredStores = filteredStores.filter(store => store.isLargeRetailer === isLarge);
      }
      
      // Apply limit for faster response
      const limitNum = limit ? parseInt(limit as string) : filteredStores.length;
      filteredStores = filteredStores.slice(0, limitNum);
      
      const response = {
        success: true,
        data: {
          stores: filteredStores,
          total: filteredStores.length,
          totalUnfiltered: stores.length,
          filtered: !!(category || largeRetailer || mall),
          filters: { category: category || null, largeRetailer: largeRetailer || null, mall: mall || null }
        },
        duration: `${Date.now() - startTime}ms`,
        timestamp: Date.now(),
        error: null
      };
      
      // Cache for 2 minutes to reduce database load
      setCachedResponse(cacheKey, response, 120000);
      
      res.json(response);
    } catch (error: any) {
      console.error('Store API Error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch stores',
        details: error.message,
        timestamp: Date.now()
      });
    }
  });

  // OPTIMIZED: Fast individual store lookup
  app.get('/api/stores/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const cacheKey = `store_${id}`;
      const cached = getCachedResponse(cacheKey);
      
      if (cached) {
        return res.json(cached);
      }

      const store = await storage.getStore(parseInt(id));
      
      if (!store) {
        return res.status(404).json({
          success: false,
          error: 'Store not found'
        });
      }

      const response = {
        success: true,
        data: store,
        timestamp: Date.now()
      };
      
      // Cache individual stores for 5 minutes
      setCachedResponse(cacheKey, response, 300000);
      
      res.json(response);
    } catch (error: any) {
      console.error('Store Detail API Error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch store details',
        details: error.message
      });
    }
  });

  // OPTIMIZED: Lightweight store search
  app.get('/api/stores/search', async (req: Request, res: Response) => {
    try {
      const { q, limit = 10 } = req.query;
      
      if (!q || typeof q !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Search query required'
        });
      }

      const cacheKey = `store_search_${q}_${limit}`;
      const cached = getCachedResponse(cacheKey);
      
      if (cached) {
        return res.json(cached);
      }

      const stores = await storage.getStores();
      const searchTerm = q.toLowerCase();
      
      const results = stores
        .filter(store => 
          store.name.toLowerCase().includes(searchTerm) ||
          store.category.toLowerCase().includes(searchTerm) ||
          store.description?.toLowerCase().includes(searchTerm)
        )
        .slice(0, parseInt(limit as string))
        .map(store => ({
          id: store.id,
          name: store.name,
          category: store.category,
          address: store.address,
          rating: store.rating,
          isOpen: store.isOpen
        }));

      const response = {
        success: true,
        data: {
          results,
          total: results.length,
          query: q
        },
        timestamp: Date.now()
      };
      
      // Cache search results for 1 minute
      setCachedResponse(cacheKey, response, 60000);
      
      res.json(response);
    } catch (error: any) {
      console.error('Store Search API Error:', error);
      res.status(500).json({
        success: false,
        error: 'Search failed',
        details: error.message
      });
    }
  });
}