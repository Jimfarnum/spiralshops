// SPIRAL ProductEntryAgent - AI-powered inventory management
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class ProductEntryAgent {
  constructor() {
    this.systemPrompt = `You are the SPIRAL ProductEntryAgent, an AI assistant specializing in helping retailers manage their inventory on the SPIRAL platform.

Your expertise includes:
- Product categorization using SPIRAL's 18 major categories and 144+ subcategories
- Pricing strategy and competitive analysis
- Product description optimization for search
- Image requirements and quality standards
- Inventory tracking and stock alerts
- Bulk upload assistance (CSV formatting)

SPIRAL Product Categories:
Electronics, Fashion, Home & Garden, Health & Beauty, Sports & Outdoors, Automotive, Books & Media, Toys & Games, Food & Beverages, Jewelry & Accessories, Pet Supplies, Office Supplies, Tools & Hardware, Art & Crafts, Baby & Kids, Musical Instruments, Collectibles, Services

Key Features:
- AI-powered product tagging
- Automatic competitive pricing suggestions
- SEO-optimized descriptions
- Multi-image upload with quality checks
- Inventory alerts and reorder points
- Integration with existing POS systems

Communication Style:
- Clear, actionable guidance
- Suggest specific improvements
- Explain the "why" behind recommendations
- Provide examples and templates
- Celebrate successful uploads

Always respond in JSON format with:
{
  "message": "your helpful guidance",
  "suggestions": ["specific improvements"],
  "category": "suggested category",
  "subcategory": "suggested subcategory",
  "priceRange": {"min": 0, "max": 0},
  "seoTips": ["optimization suggestions"],
  "nextAction": "what to do next",
  "confidence": 0.8
}`;
  }

  async analyzeProduct(productData) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: this.systemPrompt },
          { 
            role: "user", 
            content: `Please analyze this product and provide categorization and optimization suggestions:

Product Data:
${JSON.stringify(productData, null, 2)}

Help optimize this listing for better discoverability and sales.`
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1000
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('ProductEntryAgent error:', error);
      return {
        message: "I'm here to help optimize your product listing!",
        suggestions: ["Add a clear product title", "Include detailed description", "Set competitive pricing"],
        category: "General",
        confidence: 0.5
      };
    }
  }

  async optimizeDescription(rawDescription, productCategory) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert copywriter specializing in e-commerce product descriptions. Create engaging, SEO-optimized descriptions that convert browsers into buyers."
          },
          {
            role: "user",
            content: `Optimize this product description for SPIRAL marketplace:

Category: ${productCategory}
Raw Description: "${rawDescription}"

Make it:
- SEO-friendly with relevant keywords
- Compelling and benefit-focused
- Easy to scan with bullet points
- Include local shopping appeal
- Keep under 200 words

Respond with just the optimized description.`
          }
        ],
        max_tokens: 300
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Description optimization error:', error);
      return rawDescription;
    }
  }

  async validateCSV(csvData) {
    const requiredFields = ['name', 'price', 'category', 'description'];
    const issues = [];
    const suggestions = [];

    csvData.forEach((row, index) => {
      const rowNumber = index + 1;
      
      // Check required fields
      requiredFields.forEach(field => {
        if (!row[field] || row[field].toString().trim() === '') {
          issues.push(`Row ${rowNumber}: Missing ${field}`);
        }
      });

      // Validate price
      if (row.price && (isNaN(row.price) || parseFloat(row.price) <= 0)) {
        issues.push(`Row ${rowNumber}: Invalid price "${row.price}"`);
      }

      // Check description length
      if (row.description && row.description.length < 20) {
        suggestions.push(`Row ${rowNumber}: Description too short, consider adding more details`);
      }
    });

    return {
      isValid: issues.length === 0,
      issues,
      suggestions,
      totalRows: csvData.length,
      validRows: csvData.length - issues.length
    };
  }

  getCSVTemplate() {
    return {
      headers: [
        'name',
        'description',
        'price',
        'category',
        'subcategory',
        'sku',
        'stock_quantity',
        'weight',
        'dimensions',
        'image_url1',
        'image_url2',
        'image_url3',
        'tags'
      ],
      example: {
        name: 'Wireless Bluetooth Headphones',
        description: 'Premium over-ear headphones with noise cancellation and 30-hour battery life',
        price: '149.99',
        category: 'Electronics',
        subcategory: 'Audio',
        sku: 'WBH-001',
        stock_quantity: '25',
        weight: '0.75',
        dimensions: '8x7x3',
        image_url1: 'https://example.com/image1.jpg',
        image_url2: 'https://example.com/image2.jpg',
        image_url3: 'https://example.com/image3.jpg',
        tags: 'bluetooth,wireless,headphones,audio'
      }
    };
  }
}