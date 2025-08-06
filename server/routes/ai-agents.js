// SPIRAL AI Agents API Routes
import express from 'express';
import { RetailerOnboardAgent } from '../ai-agents/RetailerOnboardAgent.js';
import { ProductEntryAgent } from '../ai-agents/ProductEntryAgent.js';

const router = express.Router();

// Initialize AI Agents
const retailerAgent = new RetailerOnboardAgent();
const productAgent = new ProductEntryAgent();

// Retailer Onboarding Agent Routes
router.post('/retailer-onboard/chat', async (req, res) => {
  try {
    const { query, context } = req.body;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Query is required'
      });
    }

    const response = await retailerAgent.processOnboardingQuery(query, context);
    
    res.json({
      success: true,
      data: response,
      timestamp: new Date().toISOString(),
      agent: 'RetailerOnboardAgent'
    });
  } catch (error) {
    console.error('Retailer onboard chat error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process onboarding query',
      details: error.message
    });
  }
});

router.post('/retailer-onboard/validate', async (req, res) => {
  try {
    const { businessData } = req.body;
    
    if (!businessData) {
      return res.status(400).json({
        success: false,
        error: 'Business data is required'
      });
    }

    const validation = await retailerAgent.validateBusinessData(businessData);
    
    res.json({
      success: true,
      data: validation,
      timestamp: new Date().toISOString(),
      agent: 'RetailerOnboardAgent'
    });
  } catch (error) {
    console.error('Business validation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate business data',
      details: error.message
    });
  }
});

router.post('/retailer-onboard/suggest-tier', async (req, res) => {
  try {
    const { businessProfile } = req.body;
    
    if (!businessProfile) {
      return res.status(400).json({
        success: false,
        error: 'Business profile is required'
      });
    }

    const suggestedTier = await retailerAgent.suggestTier(businessProfile);
    
    res.json({
      success: true,
      data: {
        suggestedTier,
        reasoning: `Based on your business profile, ${suggestedTier} tier provides the best value for your needs.`
      },
      timestamp: new Date().toISOString(),
      agent: 'RetailerOnboardAgent'
    });
  } catch (error) {
    console.error('Tier suggestion error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to suggest tier',
      details: error.message
    });
  }
});

// Product Entry Agent Routes
router.post('/product-entry/analyze', async (req, res) => {
  try {
    const { productData } = req.body;
    
    if (!productData) {
      return res.status(400).json({
        success: false,
        error: 'Product data is required'
      });
    }

    const analysis = await productAgent.analyzeProduct(productData);
    
    res.json({
      success: true,
      data: analysis,
      timestamp: new Date().toISOString(),
      agent: 'ProductEntryAgent'
    });
  } catch (error) {
    console.error('Product analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze product',
      details: error.message
    });
  }
});

router.post('/product-entry/optimize-description', async (req, res) => {
  try {
    const { description, category } = req.body;
    
    if (!description) {
      return res.status(400).json({
        success: false,
        error: 'Description is required'
      });
    }

    const optimized = await productAgent.optimizeDescription(description, category);
    
    res.json({
      success: true,
      data: {
        original: description,
        optimized,
        improvement: 'SEO-optimized and benefit-focused description'
      },
      timestamp: new Date().toISOString(),
      agent: 'ProductEntryAgent'
    });
  } catch (error) {
    console.error('Description optimization error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to optimize description',
      details: error.message
    });
  }
});

router.post('/product-entry/validate-csv', async (req, res) => {
  try {
    const { csvData } = req.body;
    
    if (!csvData || !Array.isArray(csvData)) {
      return res.status(400).json({
        success: false,
        error: 'CSV data array is required'
      });
    }

    const validation = productAgent.validateCSV(csvData);
    
    res.json({
      success: true,
      data: validation,
      timestamp: new Date().toISOString(),
      agent: 'ProductEntryAgent'
    });
  } catch (error) {
    console.error('CSV validation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate CSV',
      details: error.message
    });
  }
});

router.get('/product-entry/csv-template', (req, res) => {
  try {
    const template = productAgent.getCSVTemplate();
    
    res.json({
      success: true,
      data: template,
      timestamp: new Date().toISOString(),
      agent: 'ProductEntryAgent'
    });
  } catch (error) {
    console.error('CSV template error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get CSV template',
      details: error.message
    });
  }
});

// AI Agent Health Check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      agents: [
        'RetailerOnboardAgent',
        'ProductEntryAgent'
      ],
      capabilities: [
        'Retailer onboarding assistance',
        'Business data validation',
        'Tier recommendations',
        'Product analysis and optimization',
        'CSV validation and templates'
      ]
    },
    timestamp: new Date().toISOString()
  });
});

export default router;