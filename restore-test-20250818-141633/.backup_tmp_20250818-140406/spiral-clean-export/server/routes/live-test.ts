import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Live test data for mobile image search
const mockStores = [
  {
    id: 1,
    name: "TechHub Electronics",
    distance: "0.3",
    directions: "https://maps.google.com/directions?q=TechHub+Electronics",
    category: "electronics",
    products: ["smartphones", "laptops", "headphones", "tablets"]
  },
  {
    id: 2,
    name: "Style Central",
    distance: "0.7",
    directions: "https://maps.google.com/directions?q=Style+Central",
    category: "clothing",
    products: ["shirts", "dresses", "jeans", "shoes", "accessories"]
  },
  {
    id: 3,
    name: "Home & Garden Plus",
    distance: "1.2",
    directions: "https://maps.google.com/directions?q=Home+Garden+Plus",
    category: "home",
    products: ["furniture", "decor", "kitchenware", "gardening"]
  }
];

// Live test route for mobile image search
router.post('/live-test/mobile-image-search', upload.single('image'), async (req, res) => {
  try {
    const { location } = req.body;
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({
        success: false,
        error: 'No image file provided'
      });
    }

    if (!location) {
      return res.status(400).json({
        success: false,
        error: 'Location data required'
      });
    }

    const locationData = JSON.parse(location);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock AI analysis result
    const analysisResult = {
      detectedObjects: ['product', 'item'],
      confidence: 0.87,
      category: 'electronics', // Default for demo
      colors: ['black', 'silver'],
      brand: 'unknown'
    };

    // Filter stores based on detected category
    const relevantStores = mockStores.filter(store => 
      store.category === analysisResult.category || 
      store.products.some(product => 
        analysisResult.detectedObjects.some(obj => 
          product.toLowerCase().includes(obj.toLowerCase())
        )
      )
    );

    // Sort by distance and limit results
    const results = relevantStores
      .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
      .slice(0, 3)
      .map(store => ({
        name: store.name,
        distance: store.distance,
        directions: store.directions,
        matchConfidence: Math.random() * 0.3 + 0.7 // 70-100%
      }));

    res.json({
      success: true,
      data: results,
      analysis: analysisResult,
      processingTime: '2.1s',
      location: {
        latitude: locationData.latitude,
        longitude: locationData.longitude
      }
    });

  } catch (error) {
    console.error('Live test error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during live test'
    });
  }
});

// Live test status endpoint
router.get('/live-test/status', (req, res) => {
  res.json({
    success: true,
    message: 'Live test endpoints operational',
    features: [
      'Mobile Image Search',
      'AI Analysis Simulation',
      'Location-based Results',
      'Real-time Processing'
    ],
    endpoints: {
      mobileImageSearch: '/api/live-test/mobile-image-search',
      status: '/api/live-test/status'
    }
  });
});

// Live test demo data
router.get('/live-test/demo-data', (req, res) => {
  res.json({
    success: true,
    demoStores: mockStores,
    sampleCategories: ['electronics', 'clothing', 'home', 'books', 'toys'],
    testInstructions: [
      'Upload any image to test the mobile image search',
      'Location permission required for distance calculations',
      'Results will show nearest matching stores',
      'Tap "Get Directions" to open maps'
    ]
  });
});

// Live performance test
router.get('/live-test/performance', (req, res) => {
  const startTime = Date.now();
  
  // Simulate various operations
  const operations = {
    databaseQuery: Math.random() * 50 + 10,
    aiProcessing: Math.random() * 200 + 100,
    locationLookup: Math.random() * 30 + 5,
    imageAnalysis: Math.random() * 300 + 200
  };

  const totalTime = Object.values(operations).reduce((sum, time) => sum + time, 0);
  const endTime = Date.now();

  res.json({
    success: true,
    timestamp: new Date().toISOString(),
    performance: {
      requestTime: endTime - startTime,
      simulatedOperations: operations,
      totalSimulatedTime: Math.round(totalTime),
      recommendation: totalTime < 500 ? 'Excellent' : totalTime < 1000 ? 'Good' : 'Needs optimization'
    },
    systemHealth: {
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime(),
      nodeVersion: process.version
    }
  });
});

export default router;