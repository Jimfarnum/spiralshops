// SPIRAL InviteToShopAgent - AI-powered invite orchestration
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class InviteToShopAgent {
  constructor() {
    this.systemPrompt = `You are the SPIRAL InviteToShopAgent, specializing in creating personalized, engaging shopping invitations that coordinate multiple AI agents.

Your role is to:
- Create personalized shopping plans based on preferences and location
- Generate compelling social media content for invites
- Coordinate with Mall Manager for special offers and timing
- Optimize group shopping experiences for maximum enjoyment and savings

Key Features to Leverage:
- SPIRAL rewards system (earning points for group activities)
- Local business discovery and support
- Exclusive group shopping perks
- Social sharing rewards and viral mechanics
- Real-time coordination between friends

Response Format (JSON):
{
  "shoppingPlan": {
    "recommendedStores": ["store1", "store2"],
    "timeline": "suggested shopping schedule",
    "groupActivities": ["activity suggestions"],
    "budgetOptimization": "cost-saving strategies"
  },
  "socialContent": {
    "platform": "optimized for specific platform",
    "message": "engaging invite message",
    "hashtags": ["relevant", "hashtags"],
    "callToAction": "compelling CTA"
  },
  "mallCoordination": {
    "specialOffers": ["available group discounts"],
    "timing": "optimal visit times",
    "parkingInfo": "convenience details",
    "meetupSpots": "suggested locations"
  },
  "aiInsights": {
    "groupDynamics": "personality-based suggestions",
    "successPrediction": "likelihood of successful group trip",
    "alternatives": "backup plans if needed"
  }
}`;
  }

  async processInviteRequest(inviteData) {
    try {
      const { shopperId, friends, platform, location, preferences, budget } = inviteData;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          { role: "system", content: this.systemPrompt },
          { 
            role: "user", 
            content: `Create an AI-enhanced shopping invite with the following details:

Shopper ID: ${shopperId}
Friends: ${JSON.stringify(friends)}
Platform: ${platform}
Location: ${location}
Preferences: ${JSON.stringify(preferences)}
Budget Range: ${budget || 'flexible'}

Please create a comprehensive invite plan that coordinates shopping, social sharing, and group activities for maximum enjoyment and SPIRAL rewards.`
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1200
      });

      const aiResult = JSON.parse(response.choices[0].message.content);

      // Add metadata and coordination info
      return {
        ...aiResult,
        aiProcessed: true,
        processingTimestamp: new Date().toISOString(),
        agentVersion: "1.0",
        coordinationSuccess: true
      };

    } catch (error) {
      console.error('InviteToShopAgent processing error:', error);
      
      // Fallback response if AI fails
      return {
        shoppingPlan: {
          recommendedStores: ["Popular Local Stores", "Featured Retailers"],
          timeline: "Flexible 2-3 hour shopping experience",
          groupActivities: ["Store exploration", "Lunch break", "Photo sharing"],
          budgetOptimization: "Look for group discounts and SPIRAL rewards"
        },
        socialContent: {
          platform: platform || "general",
          message: `Join me for an amazing shopping adventure at ${location}! Let's discover local treasures and earn SPIRAL rewards together! 🛍️✨`,
          hashtags: ["#SPIRALshops", "#ShopLocal", "#FriendsTime"],
          callToAction: "Who's ready to shop local and earn rewards?"
        },
        mallCoordination: {
          specialOffers: ["Group shopping perks available"],
          timing: "Weekday afternoons or weekend mornings recommended",
          parkingInfo: "Multiple parking options available",
          meetupSpots: ["Main entrance", "Food court", "Information desk"]
        },
        aiInsights: {
          groupDynamics: "Plan for diverse shopping interests",
          successPrediction: "High likelihood with proper coordination",
          alternatives: "Virtual shopping session as backup"
        },
        aiProcessed: false,
        error: "AI processing failed, using fallback response",
        processingTimestamp: new Date().toISOString()
      };
    }
  }

  async optimizeForPlatform(content, platform) {
    try {
      const platformPrompt = `Optimize this shopping invite content for ${platform}:

${JSON.stringify(content)}

Make it platform-appropriate in terms of:
- Character limits and formatting
- Hashtag usage and trends
- Visual elements and calls-to-action
- Engagement optimization

Return the optimized content in the same JSON structure.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          { role: "system", content: this.systemPrompt },
          { role: "user", content: platformPrompt }
        ],
        response_format: { type: "json_object" },
        max_tokens: 800
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Platform optimization error:', error);
      return content; // Return original content if optimization fails
    }
  }
}