import { Request, Response, Router } from 'express';
import { WatsonXAI } from '@ibm-cloud/watsonx-ai';

const router = Router();

// Initialize WatsonX.ai service
let watsonxAIService: WatsonXAI | null = null;

const initWatsonX = () => {
  if (watsonxAIService) return watsonxAIService;

  try {
    watsonxAIService = WatsonXAI.newInstance({
      version: '2024-05-31',
      serviceUrl: process.env.WATSONX_AI_URL || 'https://us-south.ml.cloud.ibm.com'
    });
    return watsonxAIService;
  } catch (error) {
    console.error('Failed to initialize WatsonX.ai:', error);
    return null;
  }
};

// Text generation endpoint for SPIRAL AI features
router.post('/generate-text', async (req: Request, res: Response) => {
  try {
    const service = initWatsonX();
    if (!service) {
      return res.status(500).json({
        success: false,
        error: 'WatsonX.ai service not available'
      });
    }

    const { 
      input, 
      modelId = 'ibm/granite-13b-chat-v2', 
      maxTokens = 150,
      temperature = 0.7 
    } = req.body;

    if (!input) {
      return res.status(400).json({
        success: false,
        error: 'Input text is required'
      });
    }

    const params = {
      input: input,
      modelId: modelId,
      projectId: process.env.WATSONX_PROJECT_ID,
      parameters: {
        max_new_tokens: maxTokens,
        temperature: temperature,
        top_p: 1,
        top_k: 50
      }
    };

    const response = await service.generateText(params);
    
    res.json({
      success: true,
      generated_text: response.result.results[0].generated_text,
      token_count: response.result.results[0].generated_token_count,
      model_id: modelId
    });
    
  } catch (error: any) {
    console.error('WatsonX.ai generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Text generation failed'
    });
  }
});

// Enhanced product descriptions using WatsonX.ai
router.post('/enhance-product', async (req: Request, res: Response) => {
  try {
    const service = initWatsonX();
    if (!service) {
      return res.status(500).json({
        success: false,
        error: 'WatsonX.ai service not available'
      });
    }

    const { productName, category, features } = req.body;

    if (!productName) {
      return res.status(400).json({
        success: false,
        error: 'Product name is required'
      });
    }

    const prompt = `Create an engaging product description for "${productName}" in the ${category} category. 
Features: ${features || 'Premium quality'}
Write a compelling description that highlights benefits and appeals to customers shopping on SPIRAL marketplace:`;

    const params = {
      input: prompt,
      modelId: 'ibm/granite-13b-chat-v2',
      projectId: process.env.WATSONX_PROJECT_ID,
      parameters: {
        max_new_tokens: 200,
        temperature: 0.8,
        top_p: 0.9
      }
    };

    const response = await service.generateText(params);
    
    res.json({
      success: true,
      product_name: productName,
      enhanced_description: response.result.results[0].generated_text,
      original_features: features
    });
    
  } catch (error: any) {
    console.error('WatsonX.ai product enhancement error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Product enhancement failed'
    });
  }
});

// Smart search suggestions using WatsonX.ai
router.post('/smart-search', async (req: Request, res: Response) => {
  try {
    const service = initWatsonX();
    if (!service) {
      return res.status(500).json({
        success: false,
        error: 'WatsonX.ai service not available'
      });
    }

    const { query, context = 'retail' } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    const prompt = `Based on the search query "${query}" in a ${context} context, suggest 5 related search terms that would be helpful for shoppers on SPIRAL marketplace. Format as a comma-separated list:`;

    const params = {
      input: prompt,
      modelId: 'ibm/granite-13b-chat-v2',
      projectId: process.env.WATSONX_PROJECT_ID,
      parameters: {
        max_new_tokens: 100,
        temperature: 0.6
      }
    };

    const response = await service.generateText(params);
    
    const suggestions = response.result.results[0].generated_text
      .split(',')
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0)
      .slice(0, 5);
    
    res.json({
      success: true,
      original_query: query,
      suggestions: suggestions,
      context: context
    });
    
  } catch (error: any) {
    console.error('WatsonX.ai smart search error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Smart search failed'
    });
  }
});

// WatsonX.ai health check
router.get('/health', async (req: Request, res: Response) => {
  try {
    const service = initWatsonX();
    const isAvailable = service !== null;
    
    res.json({
      success: true,
      service: 'watsonx-ai',
      available: isAvailable,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
    
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;