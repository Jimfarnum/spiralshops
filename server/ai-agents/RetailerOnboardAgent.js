// SPIRAL RetailerOnboardAgent - AI-powered retailer onboarding
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class RetailerOnboardAgent {
  constructor() {
    this.systemPrompt = `You are the SPIRAL RetailerOnboardAgent, a friendly AI assistant specializing in helping local retailers join the SPIRAL platform.

Your role is to:
- Guide retailers through the 5-step onboarding process
- Help them choose the right verification tier (Bronze, Silver, Gold, Platinum)
- Assist with business information collection
- Explain benefits and features clearly
- Handle questions about pricing, verification, and platform capabilities

SPIRAL Verification Tiers:
- Bronze ($29/month): Basic listing, standard support
- Silver ($59/month): Enhanced visibility, priority support, basic analytics
- Gold ($99/month): Premium features, advanced analytics, marketing tools
- Platinum ($199/month): Full white-glove service, dedicated support, custom features

Key Features to Highlight:
- Zero transaction fees for first 3 months
- AI-powered inventory management
- Multi-mall presence capability
- Integrated payment processing with Stripe Connect
- Mobile-optimized retailer dashboard
- Customer loyalty program integration

Communication Style:
- Friendly, professional, and encouraging
- Use simple language (avoid technical jargon)
- Be patient and thorough
- Celebrate small wins during onboarding
- Provide specific next steps

Always respond in JSON format with:
{
  "message": "your helpful response",
  "nextStep": "specific action for retailer",
  "suggestedTier": "Bronze|Silver|Gold|Platinum" (if applicable),
  "requiresData": ["field1", "field2"] (if data collection needed),
  "confidence": 0.8,
  "escalate": false
}`;
  }

  async processOnboardingQuery(query, context = {}) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: this.systemPrompt },
          { 
            role: "user", 
            content: `Retailer Query: "${query}"
            
Context:
- Current Step: ${context.step || 1}
- Business Type: ${context.businessType || 'unknown'}
- Previous Responses: ${JSON.stringify(context.history || [])}
- Collected Data: ${JSON.stringify(context.collectedData || {})}

Please provide guidance for this retailer's onboarding journey.`
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1000
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('RetailerOnboardAgent error:', error);
      return {
        message: "I'm here to help you get started on SPIRAL! Could you tell me a bit about your business?",
        nextStep: "Please share your business name and what type of products you sell.",
        confidence: 0.9,
        escalate: false
      };
    }
  }

  async validateBusinessData(businessData) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: this.systemPrompt },
          { 
            role: "user", 
            content: `Please validate this business data and suggest improvements:
            
${JSON.stringify(businessData, null, 2)}

Check for:
- Missing required fields
- Data quality issues
- Suggested tier based on business size/type
- Potential verification challenges

Respond in JSON format with validation results.`
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 800
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Validation error:', error);
      return {
        isValid: false,
        issues: ["Unable to validate at this time"],
        suggestions: ["Please review your information and try again"]
      };
    }
  }

  async suggestTier(businessProfile) {
    const { revenue, employees, locations, productCount, techSavvy } = businessProfile;
    
    let score = 0;
    
    // Revenue scoring
    if (revenue > 1000000) score += 4;
    else if (revenue > 500000) score += 3;
    else if (revenue > 100000) score += 2;
    else score += 1;
    
    // Employee scoring
    if (employees > 20) score += 3;
    else if (employees > 5) score += 2;
    else score += 1;
    
    // Location scoring
    if (locations > 3) score += 2;
    else if (locations > 1) score += 1;
    
    // Product count scoring
    if (productCount > 1000) score += 2;
    else if (productCount > 100) score += 1;
    
    // Tech savviness
    if (techSavvy === 'high') score += 1;
    
    if (score >= 10) return 'Platinum';
    if (score >= 7) return 'Gold';
    if (score >= 4) return 'Silver';
    return 'Bronze';
  }
}