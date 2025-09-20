import OpenAI from 'openai';
import { Router } from 'express';
import multer from 'multer';
import { promises as fs } from 'fs';
import path from 'path';

const router = Router();

// Configure multer for image uploads
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
    }
  }
});

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Sample product data for matching (in production, this would come from database)
const sampleProducts: Array<{
  id: number;
  name: string;
  category: string;
  price: number;
  store: string;
  lat: number;
  lng: number;
  distance?: number;
}> = [
  { id: 1, name: 'Wireless Headphones', category: 'Electronics', price: 99.99, store: 'Tech Haven', lat: 40.7128, lng: -74.0060 },
  { id: 2, name: 'Running Shoes', category: 'Sports', price: 129.99, store: 'SportZone', lat: 40.7589, lng: -73.9851 },
  { id: 3, name: 'Coffee Maker', category: 'Home & Kitchen', price: 79.99, store: 'Home Essentials', lat: 40.7505, lng: -73.9934 },
  { id: 4, name: 'Leather Jacket', category: 'Fashion', price: 199.99, store: 'Style Central', lat: 40.7282, lng: -73.7949 },
  { id: 5, name: 'Smartphone', category: 'Electronics', price: 699.99, store: 'Tech Haven', lat: 40.7128, lng: -74.0060 },
  { id: 6, name: 'Yoga Mat', category: 'Sports', price: 29.99, store: 'FitLife', lat: 40.7614, lng: -73.9776 }
];

// Haversine formula to calculate distance between two points
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Image search by upload
router.post('/search-by-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image file provided'
      });
    }

    // Read uploaded image
    const imagePath = req.file.path;
    const imageBuffer = await fs.readFile(imagePath);
    const base64Image = imageBuffer.toString('base64');

    // Analyze image with OpenAI Vision
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this image and identify the main product or item. Respond with a JSON object containing: productType, category, color, brand (if visible), and keywords for shopping. Be specific and detailed."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 500
    });

    const analysis = JSON.parse(response.choices[0].message.content || '{}');
    
    // Extract user location from request body
    const userLocation = req.body.location ? JSON.parse(req.body.location) : null;

    // Match products based on analysis
    const keywords = [
      analysis.productType?.toLowerCase(),
      analysis.category?.toLowerCase(),
      analysis.color?.toLowerCase(),
      analysis.brand?.toLowerCase(),
      ...(analysis.keywords || [])
    ].filter(Boolean);

    const matchedProducts = sampleProducts.filter(product => {
      const productText = `${product.name} ${product.category}`.toLowerCase();
      return keywords.some(keyword => productText.includes(keyword));
    }).map(product => {
      let distance = null;
      if (userLocation && userLocation.lat && userLocation.lng) {
        distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          product.lat,
          product.lng
        );
      }
      return {
        ...product,
        distance: distance ? Math.round(distance * 100) / 100 : null,
        matchScore: keywords.filter(keyword => 
          `${product.name} ${product.category}`.toLowerCase().includes(keyword)
        ).length
      };
    });

    // Sort by match score and distance
    matchedProducts.sort((a, b) => {
      if (a.matchScore !== b.matchScore) return b.matchScore - a.matchScore;
      if (a.distance !== null && b.distance !== null) return a.distance - b.distance;
      return 0;
    });

    // Clean up uploaded file
    await fs.unlink(imagePath);

    res.json({
      success: true,
      data: {
        analysis,
        matches: matchedProducts.slice(0, 10), // Return top 10 matches
        totalMatches: matchedProducts.length
      }
    });

  } catch (error) {
    console.error('Image search error:', error);
    
    // Clean up file if it exists
    if (req.file?.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (cleanupError) {
        console.error('File cleanup error:', cleanupError);
      }
    }

    res.status(500).json({
      success: false,
      error: 'Failed to process image search'
    });
  }
});

// AI Shopping Assistant endpoint
router.post('/shopping-assistant', async (req, res) => {
  try {
    const { query, userLocation, preferences } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Query is required'
      });
    }

    // Use OpenAI to understand the shopping intent
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a helpful shopping assistant for SPIRAL, a local commerce platform. Analyze the user's shopping query and provide product recommendations with categories, keywords, and shopping advice. Respond in JSON format with: intent, categories, keywords, recommendations, and tips."
        },
        {
          role: "user",
          content: `User query: "${query}". User preferences: ${JSON.stringify(preferences || {})}`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 800
    });

    const aiResponse = JSON.parse(response.choices[0].message.content || '{}');

    // Find matching products based on AI analysis
    const keywords = aiResponse.keywords || [];
    const categories = aiResponse.categories || [];

    const matchedProducts = sampleProducts.filter(product => {
      const productText = `${product.name} ${product.category}`.toLowerCase();
      const categoryMatch = categories.some((cat: string) => 
        product.category.toLowerCase().includes(cat.toLowerCase())
      );
      const keywordMatch = keywords.some((keyword: string) => 
        productText.includes(keyword.toLowerCase())
      );
      return categoryMatch || keywordMatch;
    }).map(product => {
      let distance = null;
      if (userLocation && userLocation.lat && userLocation.lng) {
        distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          product.lat,
          product.lng
        );
      }
      return {
        ...product,
        distance: distance ? Math.round(distance * 100) / 100 : null
      };
    });

    // Sort by distance if location is available
    if (userLocation) {
      matchedProducts.sort((a, b) => {
        if (a.distance !== null && b.distance !== null) return a.distance - b.distance;
        return 0;
      });
    }

    res.json({
      success: true,
      data: {
        aiResponse,
        matches: matchedProducts,
        totalMatches: matchedProducts.length
      }
    });

  } catch (error) {
    console.error('Shopping assistant error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process shopping assistant request'
    });
  }
});

// Product recommendation endpoint
router.get('/recommendations', async (req, res) => {
  try {
    const { category, userLocation, limit = 5 } = req.query;

    let products = [...sampleProducts];

    // Filter by category if provided
    if (category && category !== 'all') {
      products = products.filter(product => 
        product.category.toLowerCase() === (category as string).toLowerCase()
      );
    }

    // Add distance if user location is provided
    if (userLocation) {
      const location = JSON.parse(userLocation as string);
      products = products.map(product => ({
        ...product,
        distance: calculateDistance(
          location.lat,
          location.lng,
          product.lat,
          product.lng
        )
      }));
      
      // Sort by distance
      products.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    res.json({
      success: true,
      data: {
        recommendations: products.slice(0, parseInt(limit as string)),
        totalProducts: products.length
      }
    });

  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get recommendations'
    });
  }
});

export default router;