import type { Express } from "express";
import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing required OpenAI API key: OPENAI_API_KEY');
}

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export function registerAIInventoryRoutes(app: Express) {
  
  // Generate optimized product description
  app.post("/api/ai/generate-description", async (req, res) => {
    try {
      const { productName, existingDescription, category, brand } = req.body;

      if (!productName) {
        return res.status(400).json({ 
          success: false, 
          error: "Product name is required" 
        });
      }

      const prompt = `Create a compelling, sales-focused product description for an e-commerce listing.

Product: ${productName}
Brand: ${brand || 'Not specified'}
Category: ${category || 'Not specified'}
Current description: ${existingDescription || 'None provided'}

Requirements:
- 2-3 sentences highlighting key features and benefits
- Focus on customer value and what makes this product special
- Use persuasive language that encourages purchase
- Optimize for both search engines and human readers
- Keep it concise but informative

Return only the optimized description text without any formatting or quotes.`;

      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
        temperature: 0.7
      });

      const description = response.choices[0].message.content?.trim();

      if (!description) {
        return res.status(500).json({ 
          success: false, 
          error: "Failed to generate description" 
        });
      }

      res.json({
        success: true,
        description: description
      });

    } catch (error: any) {
      console.error('AI Description Generation Error:', error);
      res.status(500).json({ 
        success: false, 
        error: "AI service temporarily unavailable" 
      });
    }
  });

  // Optimize product pricing
  app.post("/api/ai/optimize-price", async (req, res) => {
    try {
      const { productName, description, category, currentPrice, cost } = req.body;

      if (!productName) {
        return res.status(400).json({ 
          success: false, 
          error: "Product name is required" 
        });
      }

      const prompt = `Analyze this product and suggest optimal pricing for a local retail marketplace.

Product: ${productName}
Description: ${description || 'Not provided'}
Category: ${category || 'Not specified'}
Current Price: ${currentPrice ? `$${currentPrice}` : 'Not set'}
Cost: ${cost ? `$${cost}` : 'Not provided'}

Consider:
- Local retail pricing strategies
- Competitive positioning for small businesses
- Healthy profit margins (typically 40-60% for retail)
- Customer psychology and price points
- Market positioning (premium, mid-range, budget)

Respond in JSON format with:
{
  "suggestedPrice": "29.99",
  "reasoning": "Brief explanation of pricing strategy and rationale"
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 300,
        temperature: 0.3
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');

      if (!result.suggestedPrice) {
        return res.status(500).json({ 
          success: false, 
          error: "Failed to generate pricing recommendation" 
        });
      }

      res.json({
        success: true,
        suggestedPrice: result.suggestedPrice,
        reasoning: result.reasoning || "AI-optimized pricing based on market analysis"
      });

    } catch (error: any) {
      console.error('AI Price Optimization Error:', error);
      res.status(500).json({ 
        success: false, 
        error: "AI service temporarily unavailable" 
      });
    }
  });

  // Suggest categories and tags
  app.post("/api/ai/suggest-categories", async (req, res) => {
    try {
      const { productName, description, brand } = req.body;

      if (!productName) {
        return res.status(400).json({ 
          success: false, 
          error: "Product name is required" 
        });
      }

      const categories = {
        "Electronics": ["Smartphones", "Computers", "Gaming", "Audio", "Cameras", "Smart Home", "Accessories"],
        "Clothing": ["Men's Apparel", "Women's Apparel", "Kids' Clothing", "Shoes", "Accessories", "Activewear"],
        "Home & Garden": ["Furniture", "Decor", "Kitchen", "Bathroom", "Garden", "Tools", "Storage"],
        "Health & Beauty": ["Skincare", "Makeup", "Hair Care", "Wellness", "Supplements", "Personal Care"],
        "Sports & Recreation": ["Fitness Equipment", "Outdoor Gear", "Sports Apparel", "Games", "Bikes"],
        "Books & Media": ["Books", "Movies", "Music", "Games", "Educational", "Magazines"],
        "Food & Beverage": ["Snacks", "Beverages", "Organic", "Gourmet", "Local Specialties"],
        "Automotive": ["Parts", "Accessories", "Tools", "Care Products", "Electronics"]
      };

      const prompt = `Analyze this product and suggest the best category, subcategory, and search tags.

Product: ${productName}
Description: ${description || 'Not provided'}
Brand: ${brand || 'Not specified'}

Available categories and subcategories:
${Object.entries(categories).map(([cat, subs]) => `${cat}: ${subs.join(', ')}`).join('\n')}

Respond in JSON format with:
{
  "category": "exact category name from the list above",
  "subcategory": "exact subcategory name from the corresponding list",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}

Tags should be relevant search terms customers would use to find this product.`;

      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 300,
        temperature: 0.3
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');

      if (!result.category) {
        return res.status(500).json({ 
          success: false, 
          error: "Failed to generate category suggestions" 
        });
      }

      res.json({
        success: true,
        category: result.category,
        subcategory: result.subcategory,
        tags: result.tags || []
      });

    } catch (error: any) {
      console.error('AI Category Suggestion Error:', error);
      res.status(500).json({ 
        success: false, 
        error: "AI service temporarily unavailable" 
      });
    }
  });

  // Optimize SEO fields
  app.post("/api/ai/optimize-seo", async (req, res) => {
    try {
      const { productName, description, category, brand, price } = req.body;

      if (!productName) {
        return res.status(400).json({ 
          success: false, 
          error: "Product name is required" 
        });
      }

      const prompt = `Create SEO-optimized content for this product listing.

Product: ${productName}
Description: ${description || 'Not provided'}
Category: ${category || 'Not specified'}
Brand: ${brand || 'Not specified'}
Price: ${price ? `$${price}` : 'Not specified'}

Create:
1. SEO Title (50-60 characters): Include product name, key feature, and brand
2. Meta Description (150-160 characters): Compelling description that encourages clicks
3. Keywords: 8-10 relevant search terms customers would use

Respond in JSON format with:
{
  "seoTitle": "optimized title under 60 characters",
  "seoDescription": "compelling meta description under 160 characters", 
  "keywords": "keyword1, keyword2, keyword3, keyword4, keyword5"
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 400,
        temperature: 0.3
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');

      if (!result.seoTitle) {
        return res.status(500).json({ 
          success: false, 
          error: "Failed to generate SEO content" 
        });
      }

      res.json({
        success: true,
        seoTitle: result.seoTitle,
        seoDescription: result.seoDescription,
        keywords: result.keywords
      });

    } catch (error: any) {
      console.error('AI SEO Optimization Error:', error);
      res.status(500).json({ 
        success: false, 
        error: "AI service temporarily unavailable" 
      });
    }
  });

  console.log("✅ AI Inventory Assistant routes loaded successfully");
}