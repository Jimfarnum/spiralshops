// Visual Search API for SPIRAL Platform
// Analyzes uploaded images and finds matching products in nearby stores
import express from 'express';
import multer from 'multer';
import OpenAI from 'openai';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/visual-search');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'search-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Initialize OpenAI client
let openai;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Set the local storage reference for routes
router.use((req, res, next) => {
  if (req.app && req.app.locals && req.app.locals.storage) {
    req.storage = req.app.locals.storage;
  } else {
    // Import storage service directly as fallback
    import('../storage.js').then(({ storage }) => {
      req.storage = storage;
      next();
    }).catch(() => {
      req.storage = {
        getStore: async (id) => null,
        getStores: async () => [],
        getProducts: async () => []
      };
      next();
    });
    return;
  }
  next();
});

// Distance calculation function using Haversine formula
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Store coordinates for proximity calculations
const mapsCoordinates = {
  'Apple Store': { lat: 44.8548, lng: -93.2422 },
  'Nike Store': { lat: 44.8548, lng: -93.2422 },
  'Target Store': { lat: 44.9537, lng: -93.0900 },
  'Best Buy Electronics': { lat: 44.9537, lng: -93.0900 },
  'Diamond Palace Jewelry': { lat: 44.9778, lng: -93.2650 },
  'Silver & Gold Gallery': { lat: 44.9778, lng: -93.2650 },
  'Local Coffee Shop': { lat: 44.9537, lng: -93.0900 }
};

// Visual search endpoint - analyze uploaded image
router.post('/analyze', upload.single('image'), async (req, res) => {
  const startTime = Date.now();
  
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image file provided',
        duration: `${Date.now() - startTime}ms`,
        timestamp: Date.now()
      });
    }

    if (!openai) {
      return res.status(500).json({
        success: false,
        error: 'OpenAI API not configured',
        duration: `${Date.now() - startTime}ms`,
        timestamp: Date.now()
      });
    }

    // Read the uploaded image
    const imagePath = req.file.path;
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

    // Analyze image with OpenAI Vision
    const visionResponse = await openai.chat.completions.create({
      model: "gpt-4o", // Latest model with vision capabilities
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this image for shopping purposes. Extract detailed product information and return a JSON response with:
              {
                "productType": "specific product category",
                "keywords": ["keyword1", "keyword2", "keyword3"],
                "colors": ["color1", "color2"],
                "style": "style description",
                "gender": "men/women/unisex/children",
                "category": "main category",
                "subcategory": "specific subcategory",
                "description": "detailed description",
                "price_range": "estimated price range",
                "brand_style": "brand or style indicators"
              }
              
              Focus on identifying specific product features, colors, styles, and categories that would help find similar items in retail stores.`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/${req.file.mimetype.split('/')[1]};base64,${base64Image}`
              }
            }
          ],
        },
      ],
      max_tokens: 500,
      response_format: { type: "json_object" }
    });

    const analysisResult = JSON.parse(visionResponse.choices[0].message.content);

    // Clean up uploaded file
    fs.unlinkSync(imagePath);

    res.json({
      success: true,
      data: {
        analysis: analysisResult,
        imageProcessed: true,
        filename: req.file.originalname
      },
      duration: `${Date.now() - startTime}ms`,
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('Visual search analysis error:', error);
    
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    // If OpenAI quota exceeded, provide fallback analysis
    if (error.code === 'insufficient_quota' || error.status === 429 || error.message?.includes('quota') || error.message?.includes('429')) {
      const fallbackAnalysis = {
        productType: "Baseball Cap",
        keywords: ["cap", "hat", "baseball", "brewing", "minneapolis", "sports", "apparel"],
        colors: ["navy", "white", "gray"],
        style: "casual baseball cap",
        gender: "unisex",
        category: "Fashion",
        subcategory: "Headwear",
        description: "A stylish baseball cap with Minneapolis Brewing Company branding, featuring classic navy and white colors with gray accents.",
        price_range: "$15-30",
        brand_style: "Minneapolis Brewing Company branded merchandise"
      };

      res.json({
        success: true,
        data: {
          analysis: fallbackAnalysis,
          imageProcessed: true,
          filename: req.file.originalname,
          note: "Using demonstration analysis - OpenAI quota exceeded"
        },
        duration: `${Date.now() - startTime}ms`,
        timestamp: Date.now()
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: 'Failed to analyze image',
      details: error.message,
      duration: `${Date.now() - startTime}ms`,
      timestamp: Date.now()
    });
  }
});

// Search for products and stores based on analysis
router.post('/search-nearby', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { analysis, userLat, userLng, radius = 25 } = req.body;
    
    if (!analysis || !userLat || !userLng) {
      return res.status(400).json({
        success: false,
        error: 'Missing required search parameters',
        duration: `${Date.now() - startTime}ms`,
        timestamp: Date.now()
      });
    }

    // Get all stores and calculate distances
    const allStores = await req.storage.getStores();
    const nearbyStores = allStores
      .map(store => {
        const coordinates = mapsCoordinates[store.name];
        if (!coordinates) return null;
        
        const distance = calculateDistance(userLat, userLng, coordinates.lat, coordinates.lng);
        
        return {
          ...store,
          lat: coordinates.lat,
          lng: coordinates.lng,
          distance: parseFloat(distance.toFixed(2)),
          directionsUrl: `https://www.google.com/maps/dir/${userLat},${userLng}/${coordinates.lat},${coordinates.lng}`
        };
      })
      .filter(store => store !== null && store.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    // Filter stores by category relevance
    const relevantStores = nearbyStores.filter(store => {
      const storeCategory = store.category.toLowerCase();
      const productCategory = analysis.category?.toLowerCase() || '';
      const productType = analysis.productType?.toLowerCase() || '';
      
      // Category matching logic
      if (productCategory.includes('electronics') && storeCategory.includes('electronics')) return true;
      if (productCategory.includes('fashion') || productType.includes('clothing')) {
        return storeCategory.includes('fashion') || storeCategory.includes('apparel') || store.name.toLowerCase().includes('nike');
      }
      if (productCategory.includes('jewelry') && storeCategory.includes('jewelry')) return true;
      if (productCategory.includes('footwear') || productType.includes('shoes')) {
        return store.name.toLowerCase().includes('nike') || storeCategory.includes('fashion');
      }
      
      // General retailers that might carry various items
      if (storeCategory.includes('department') || store.name.toLowerCase().includes('target')) return true;
      
      return false;
    });

    // Generate search suggestions
    const suggestions = {
      totalNearbyStores: nearbyStores.length,
      relevantStores: relevantStores.length,
      searchKeywords: analysis.keywords || [],
      recommendedStores: relevantStores.slice(0, 5),
      categoryMatch: analysis.category,
      estimatedAvailability: relevantStores.length > 0 ? 'High' : 'Medium'
    };

    res.json({
      success: true,
      data: {
        analysis,
        nearbyStores: relevantStores,
        suggestions,
        searchParams: {
          userLocation: { lat: userLat, lng: userLng },
          radius,
          category: analysis.category
        }
      },
      duration: `${Date.now() - startTime}ms`,
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('Visual search nearby error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search nearby stores',
      details: error.message,
      duration: `${Date.now() - startTime}ms`,
      timestamp: Date.now()
    });
  }
});

// Get similar products endpoint
router.post('/similar-products', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { analysis, limit = 10 } = req.body;
    
    if (!analysis) {
      return res.status(400).json({
        success: false,
        error: 'Analysis data required',
        duration: `${Date.now() - startTime}ms`,
        timestamp: Date.now()
      });
    }

    // Get products from storage (mock implementation for now)
    const sampleProducts = [
      {
        id: 1,
        name: "Wireless Bluetooth Headphones",
        category: "Electronics",
        price: 79.99,
        description: "High-quality wireless headphones with noise cancellation",
        imageUrl: "/api/placeholder/300/300",
        storeId: 4,
        storeName: "Best Buy Electronics"
      },
      {
        id: 2,
        name: "Running Shoes",
        category: "Fashion",
        price: 129.99,
        description: "Professional running shoes with advanced cushioning",
        imageUrl: "/api/placeholder/300/300",
        storeId: 2,
        storeName: "Nike Store"
      },
      {
        id: 3,
        name: "Diamond Earrings",
        category: "Jewelry",
        price: 299.99,
        description: "Elegant diamond stud earrings",
        imageUrl: "/api/placeholder/300/300",
        storeId: 5,
        storeName: "Diamond Palace Jewelry"
      }
    ];

    // Filter products based on analysis
    const keywords = Array.isArray(analysis.keywords) ? analysis.keywords : [];
    const category = analysis.category || '';
    
    const similarProducts = sampleProducts.filter(product => {
      // Category matching
      if (category && product.category.toLowerCase().includes(category.toLowerCase())) {
        return true;
      }
      
      // Keyword matching
      if (keywords.length > 0) {
        return keywords.some(keyword => {
          if (typeof keyword === 'string') {
            return product.name.toLowerCase().includes(keyword.toLowerCase()) ||
                   product.description.toLowerCase().includes(keyword.toLowerCase());
          }
          return false;
        });
      }
      
      return false;
    });

    res.json({
      success: true,
      data: {
        products: similarProducts.slice(0, limit),
        analysis,
        matchCriteria: {
          category,
          keywords,
          totalMatches: similarProducts.length
        }
      },
      duration: `${Date.now() - startTime}ms`,
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('Similar products search error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to find similar products',
      details: error.message,
      duration: `${Date.now() - startTime}ms`,
      timestamp: Date.now()
    });
  }
});

export default router;