import type { Express } from "express";
import { storage } from "./storage";

// Smart Search Enhancement with Watson Discovery-style semantic search
export function registerSmartSearchRoutes(app: Express) {
  // Enhanced search endpoint with semantic relevance and typo tolerance
  app.get("/api/smart-search", async (req, res) => {
    try {
      const { q, category, location, fuzzy = 'true' } = req.query;
      
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ error: "Search query is required" });
      }

      const stores = await storage.getStores();
      const searchTerm = q.toLowerCase().trim();
      
      // Semantic search with typo tolerance
      const searchResults = stores.map(store => {
        let relevanceScore = 0;
        
        // Exact match boost
        if (store.name.toLowerCase().includes(searchTerm)) {
          relevanceScore += 10;
        }
        
        // Category match boost
        if (category && store.category.toLowerCase() === (category as string).toLowerCase()) {
          relevanceScore += 5;
        }
        
        // Description match
        if (store.description.toLowerCase().includes(searchTerm)) {
          relevanceScore += 3;
        }
        
        // Fuzzy matching for typos
        if (fuzzy === 'true') {
          const levenshteinDistance = calculateLevenshtein(searchTerm, store.name.toLowerCase());
          if (levenshteinDistance <= 2 && levenshteinDistance > 0) {
            relevanceScore += 2;
          }
        }
        
        // Location boost (ZIP code proximity)
        if (location && store.zipCode === location) {
          relevanceScore += 8;
        }
        
        // Rating boost
        relevanceScore += parseFloat(store.rating || '0') * 0.5;
        
        return {
          ...store,
          relevanceScore,
          searchContext: {
            matchType: getMatchType(store, searchTerm),
            proximity: location ? calculateProximity(store.zipCode, location as string) : null
          }
        };
      })
      .filter(store => store.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 20);

      // Query expansion suggestions
      const suggestions = generateQuerySuggestions(searchTerm, stores);
      
      res.json({
        query: q,
        results: searchResults,
        totalResults: searchResults.length,
        suggestions,
        searchMeta: {
          semantic: true,
          fuzzyMatching: fuzzy === 'true',
          locationBoosted: !!location,
          processingTime: Date.now()
        }
      });
      
    } catch (error) {
      console.error("Smart search error:", error);
      res.status(500).json({ error: "Search service unavailable" });
    }
  });

  // Search suggestions endpoint
  app.get("/api/search-suggestions", async (req, res) => {
    try {
      const { partial } = req.query;
      
      if (!partial || typeof partial !== 'string') {
        return res.json({ suggestions: [] });
      }

      const stores = await storage.getStores();
      const suggestions = new Set<string>();
      
      stores.forEach(store => {
        if (store.name.toLowerCase().includes((partial as string).toLowerCase())) {
          suggestions.add(store.name);
        }
        if (store.category.toLowerCase().includes((partial as string).toLowerCase())) {
          suggestions.add(store.category);
        }
      });

      res.json({
        suggestions: Array.from(suggestions).slice(0, 8)
      });
      
    } catch (error) {
      console.error("Search suggestions error:", error);
      res.status(500).json({ error: "Suggestions service unavailable" });
    }
  });
}

// Utility functions
function calculateLevenshtein(a: string, b: string): number {
  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
  
  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }
  
  return matrix[b.length][a.length];
}

function getMatchType(store: any, searchTerm: string): string {
  const name = store.name.toLowerCase();
  const description = store.description.toLowerCase();
  
  if (name === searchTerm) return 'exact';
  if (name.includes(searchTerm)) return 'name_partial';
  if (description.includes(searchTerm)) return 'description';
  return 'fuzzy';
}

function calculateProximity(zipCode1: string, zipCode2: string): number {
  // Simplified proximity calculation
  const zip1 = parseInt(zipCode1);
  const zip2 = parseInt(zipCode2);
  return Math.abs(zip1 - zip2);
}

function generateQuerySuggestions(searchTerm: string, stores: any[]): string[] {
  const suggestions = new Set<string>();
  
  // Category suggestions
  stores.forEach(store => {
    if (store.name.toLowerCase().includes(searchTerm)) {
      suggestions.add(`${searchTerm} in ${store.category}`);
    }
  });
  
  // Popular searches
  suggestions.add(`${searchTerm} near me`);
  suggestions.add(`best ${searchTerm}`);
  suggestions.add(`local ${searchTerm}`);
  
  return Array.from(suggestions).slice(0, 5);
}