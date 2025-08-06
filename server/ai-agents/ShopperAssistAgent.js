// SPIRAL ShopperAssistAgent - AI-powered shopping assistance
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class ShopperAssistAgent {
  constructor() {
    this.name = 'ShopperAssistAgent';
    this.capabilities = [
      'Product discovery assistance',
      'Price comparison guidance',
      'Shopping recommendations',
      'Order tracking help',
      'Store location assistance'
    ];
  }

  async assistShopper(query, context = {}) {
    try {
      const systemPrompt = `You are SPIRAL's ShopperAssistAgent, helping customers with their shopping needs.
      
      Your capabilities:
      - Help find products across local stores
      - Compare prices and suggest alternatives  
      - Provide shopping recommendations
      - Assist with order tracking
      - Guide to nearby stores and mall locations
      
      Keep responses helpful, concise, and focused on local commerce.
      Always suggest visiting physical stores when possible.
      
      Context: ${JSON.stringify(context)}`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: query }
        ],
        max_tokens: 300,
        temperature: 0.7
      });

      return {
        success: true,
        response: completion.choices[0].message.content,
        agent: this.name,
        capabilities: this.capabilities
      };
    } catch (error) {
      console.error('ShopperAssistAgent error:', error);
      
      // Graceful fallback
      return {
        success: true,
        response: `I'm here to help with your shopping! I can assist with finding products, comparing prices, tracking orders, and locating nearby stores. What can I help you find today?`,
        agent: this.name,
        fallback: true,
        capabilities: this.capabilities
      };
    }
  }

  async findProducts(searchQuery, filters = {}) {
    try {
      const systemPrompt = `You are helping a shopper find products. Based on their search, suggest relevant products and shopping strategies.
      
      Search: "${searchQuery}"
      Filters: ${JSON.stringify(filters)}
      
      Provide helpful product suggestions and shopping tips.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Help me find: ${searchQuery}` }
        ],
        max_tokens: 250,
        temperature: 0.6
      });

      return {
        success: true,
        suggestions: completion.choices[0].message.content,
        searchQuery,
        agent: this.name
      };
    } catch (error) {
      return {
        success: true,
        suggestions: `I'll help you find "${searchQuery}". Check local electronics stores, department stores, or specialty shops. Consider comparing prices across multiple retailers for the best deal.`,
        searchQuery,
        agent: this.name,
        fallback: true
      };
    }
  }

  getCapabilities() {
    return {
      agent: this.name,
      capabilities: this.capabilities,
      description: 'AI-powered shopping assistance for SPIRAL customers'
    };
  }
}