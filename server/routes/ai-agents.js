// SPIRAL AI Agents API Routes
import express from 'express';
import { RetailerOnboardAgent } from '../ai-agents/RetailerOnboardAgent.js';
import { ProductEntryAgent } from '../ai-agents/ProductEntryAgent.js';
import { ShopperAssistAgent } from '../ai-agents/ShopperAssistAgent.js';
import { WishlistAgent } from '../ai-agents/WishlistAgent.js';
import { ImageSearchAgent } from '../ai-agents/ImageSearchAgent.js';
import { MallDirectoryAgent } from '../ai-agents/MallDirectoryAgent.js';
import { AdminAuditAgent } from '../ai-agents/AdminAuditAgent.js';
import { SpiralAIOpsSupervisor } from '../ai-agents/SpiralAIOpsSupervisor.js';

const router = express.Router();

// Initialize AI Agents
const retailerAgent = new RetailerOnboardAgent();
const productAgent = new ProductEntryAgent();
const shopperAssistAgent = new ShopperAssistAgent();
const wishlistAgent = new WishlistAgent();
const imageSearchAgent = new ImageSearchAgent();
const mallDirectoryAgent = new MallDirectoryAgent();
const adminAuditAgent = new AdminAuditAgent();

// Initialize AI Ops Supervisor and register all agents
const aiOpsSupervisor = new SpiralAIOpsSupervisor();
aiOpsSupervisor.registerAgent(retailerAgent);
aiOpsSupervisor.registerAgent(productAgent);
aiOpsSupervisor.registerAgent(shopperAssistAgent);
aiOpsSupervisor.registerAgent(wishlistAgent);
aiOpsSupervisor.registerAgent(imageSearchAgent);
aiOpsSupervisor.registerAgent(mallDirectoryAgent);
aiOpsSupervisor.registerAgent(adminAuditAgent);

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

// Shopper Assist Agent Routes
router.post('/shopper-assist/chat', async (req, res) => {
  try {
    const { query, context } = req.body;
    const response = await shopperAssistAgent.assistShopper(query, context);
    res.json({ success: true, data: response, agent: 'ShopperAssistAgent' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Shopper assistance failed' });
  }
});

router.post('/shopper-assist/find-products', async (req, res) => {
  try {
    const { searchQuery, filters } = req.body;
    const response = await shopperAssistAgent.findProducts(searchQuery, filters);
    res.json({ success: true, data: response, agent: 'ShopperAssistAgent' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Product search failed' });
  }
});

// Wishlist Agent Routes
router.post('/wishlist/organize', async (req, res) => {
  try {
    const { items, preferences } = req.body;
    const response = await wishlistAgent.organizeWishlist(items, preferences);
    res.json({ success: true, data: response, agent: 'WishlistAgent' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Wishlist organization failed' });
  }
});

router.post('/wishlist/predict-prices', async (req, res) => {
  try {
    const { items } = req.body;
    const response = await wishlistAgent.predictPriceDrops(items);
    res.json({ success: true, data: response, agent: 'WishlistAgent' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Price prediction failed' });
  }
});

router.post('/wishlist/gift-suggestions', async (req, res) => {
  try {
    const { recipientProfile, occasion, budget } = req.body;
    const response = await wishlistAgent.suggestGifts(recipientProfile, occasion, budget);
    res.json({ success: true, data: response, agent: 'WishlistAgent' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Gift suggestion failed' });
  }
});

// Image Search Agent Routes
router.post('/image-search/analyze', async (req, res) => {
  try {
    const { imageBase64, searchContext } = req.body;
    const response = await imageSearchAgent.analyzeImage(imageBase64, searchContext);
    res.json({ success: true, data: response, agent: 'ImageSearchAgent' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Image analysis failed' });
  }
});

router.post('/image-search/find-similar', async (req, res) => {
  try {
    const { productDescription, stylePreferences } = req.body;
    const response = await imageSearchAgent.findSimilarProducts(productDescription, stylePreferences);
    res.json({ success: true, data: response, agent: 'ImageSearchAgent' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Similar product search failed' });
  }
});

// Mall Directory Agent Routes
router.post('/mall-directory/plan-route', async (req, res) => {
  try {
    const { stores, preferences } = req.body;
    const response = await mallDirectoryAgent.planShoppingRoute(stores, preferences);
    res.json({ success: true, data: response, agent: 'MallDirectoryAgent' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Route planning failed' });
  }
});

router.post('/mall-directory/discover-stores', async (req, res) => {
  try {
    const { interests, mallInfo } = req.body;
    const response = await mallDirectoryAgent.discoverStores(interests, mallInfo);
    res.json({ success: true, data: response, agent: 'MallDirectoryAgent' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Store discovery failed' });
  }
});

router.post('/mall-directory/find-events', async (req, res) => {
  try {
    const { mallId, dateRange } = req.body;
    const response = await mallDirectoryAgent.findCurrentEvents(mallId, dateRange);
    res.json({ success: true, data: response, agent: 'MallDirectoryAgent' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Event discovery failed' });
  }
});

// Admin Audit Agent Routes  
router.post('/admin-audit/performance', async (req, res) => {
  try {
    const { metrics, timeframe } = req.body;
    const response = await adminAuditAgent.analyzeSystemPerformance(metrics, timeframe);
    res.json({ success: true, data: response, agent: 'AdminAuditAgent' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Performance analysis failed' });
  }
});

router.post('/admin-audit/user-insights', async (req, res) => {
  try {
    const { userData, behaviorPatterns } = req.body;
    const response = await adminAuditAgent.generateUserInsights(userData, behaviorPatterns);
    res.json({ success: true, data: response, agent: 'AdminAuditAgent' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'User insights generation failed' });
  }
});

router.post('/admin-audit/optimize-revenue', async (req, res) => {
  try {
    const { salesData, marketTrends } = req.body;
    const response = await adminAuditAgent.optimizeRevenue(salesData, marketTrends);
    res.json({ success: true, data: response, agent: 'AdminAuditAgent' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Revenue optimization failed' });
  }
});

// AI Ops Supervisor Routes
router.post('/ai-ops/coordinate', async (req, res) => {
  try {
    const { task, context } = req.body;
    const response = await aiOpsSupervisor.coordinateAgents(task, context);
    res.json({ success: true, data: response, supervisor: 'SpiralAIOpsSupervisor' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'AI coordination failed' });
  }
});

router.get('/ai-ops/agents', async (req, res) => {
  try {
    const response = aiOpsSupervisor.getRegisteredAgents();
    res.json({ success: true, data: response, supervisor: 'SpiralAIOpsSupervisor' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get agents' });
  }
});

router.post('/ai-ops/insights', async (req, res) => {
  try {
    const { metrics, timeframe } = req.body;
    const response = await aiOpsSupervisor.generatePlatformInsights(metrics, timeframe);
    res.json({ success: true, data: response, supervisor: 'SpiralAIOpsSupervisor' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Platform insights generation failed' });
  }
});

// Agent capabilities endpoint
router.get('/capabilities', async (req, res) => {
  try {
    const capabilities = {
      supervisor: aiOpsSupervisor.getCapabilities(),
      agents: {
        retailerOnboard: retailerAgent.getCapabilities(),
        productEntry: productAgent.getCapabilities(),
        shopperAssist: shopperAssistAgent.getCapabilities(),
        wishlist: wishlistAgent.getCapabilities(),
        imageSearch: imageSearchAgent.getCapabilities(),
        mallDirectory: mallDirectoryAgent.getCapabilities(),
        adminAudit: adminAuditAgent.getCapabilities()
      }
    };
    
    res.json({
      success: true,
      data: capabilities,
      totalAgents: Object.keys(capabilities.agents).length,
      platform: 'SPIRAL AI Ops System'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get capabilities' });
  }
});

export default router;