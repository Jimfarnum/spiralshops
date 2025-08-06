// SPIRAL ImageSearchAgent - AI-powered visual product discovery
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class ImageSearchAgent {
  constructor() {
    this.name = 'ImageSearchAgent';
    this.capabilities = [
      'Visual product identification',
      'Style matching and alternatives',
      'Color and pattern analysis',
      'Brand recognition assistance',
      'Local availability checking'
    ];
  }

  async analyzeImage(imageBase64, searchContext = {}) {
    try {
      const systemPrompt = `You are SPIRAL's ImageSearchAgent, helping customers find products through visual search.
      
      Analyze the uploaded image and provide:
      - Product identification and description
      - Style category and characteristics
      - Suggested search terms for finding similar items
      - Recommendations for local stores that might carry similar products
      
      Context: ${JSON.stringify(searchContext)}`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: [
              {
                type: "text",
                text: "Help me find this product or similar items in local stores"
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        max_tokens: 400,
        temperature: 0.6
      });

      return {
        success: true,
        analysis: completion.choices[0].message.content,
        agent: this.name,
        imageProcessed: true
      };
    } catch (error) {
      console.error('ImageSearchAgent error:', error);
      
      return {
        success: true,
        analysis: `I can help you find products through visual search! Upload an image and I'll:\n\n• Identify the product type and style\n• Suggest search terms to find similar items\n• Recommend local stores that might carry it\n• Find alternatives in your price range\n\nTry uploading a clear photo of the item you're looking for.`,
        agent: this.name,
        fallback: true
      };
    }
  }

  async findSimilarProducts(productDescription, stylePreferences = {}) {
    try {
      const systemPrompt = `You are helping find similar products based on a visual description.
      
      Product: ${productDescription}
      Style preferences: ${JSON.stringify(stylePreferences)}
      
      Suggest similar items and where to find them locally.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Find similar products to: ${productDescription}` }
        ],
        max_tokens: 300,
        temperature: 0.7
      });

      return {
        success: true,
        similarProducts: completion.choices[0].message.content,
        originalDescription: productDescription,
        agent: this.name
      };
    } catch (error) {
      return {
        success: true,
        similarProducts: `To find similar products:\n\n• Check local department stores and specialty shops\n• Look for items with similar colors, patterns, or materials\n• Consider different brands with similar styling\n• Ask store associates for recommendations\n• Browse online catalogs for inspiration, then shop locally`,
        originalDescription: productDescription,
        agent: this.name,
        fallback: true
      };
    }
  }

  async extractSearchTerms(imageAnalysis) {
    try {
      const systemPrompt = `Extract the best search terms from this image analysis to help customers find products:
      
      Analysis: ${imageAnalysis}
      
      Provide 5-10 specific search terms that would help find this product.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "What search terms would help find this product?" }
        ],
        max_tokens: 150,
        temperature: 0.5
      });

      return {
        success: true,
        searchTerms: completion.choices[0].message.content,
        agent: this.name
      };
    } catch (error) {
      return {
        success: true,
        searchTerms: "product name, brand, color, style, material, category, size, type",
        agent: this.name,
        fallback: true
      };
    }
  }

  getCapabilities() {
    return {
      agent: this.name,
      capabilities: this.capabilities,
      description: 'AI-powered visual product discovery and search'
    };
  }
}