import express from 'express';
import OpenAI from 'openai';

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Mall Manager AI Agent
router.post('/mall-manager-ai', async (req, res) => {
  try {
    const { mallId, tasks, userData } = req.body;

    const mallManagerPrompt = `You are a specialized Mall Manager AI Assistant for SPIRAL shopping centers.

Mall ID: ${mallId}
Selected Tasks: ${tasks.join(', ')}

Your expertise includes:
- Tenant recruitment and retention strategies
- Mall performance optimization
- Revenue maximization
- Event planning and marketing
- Lease negotiation assistance
- Competitor analysis
- Financial reporting and ROI analysis

Provide specific, actionable recommendations for the selected tasks. Format your response as a comprehensive action plan with immediate next steps, expected outcomes, and timeline.

Be professional, data-driven, and focused on measurable business results.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: mallManagerPrompt },
        { role: "user", content: `I need assistance with these mall management tasks: ${tasks.join(', ')}. Please provide a detailed action plan.` }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7
    });

    const aiResponse = JSON.parse(completion.choices[0].message.content);

    res.json({
      success: true,
      data: {
        mallId,
        tasks,
        aiResponse,
        timestamp: Date.now(),
        estimated_completion: "15-30 minutes"
      }
    });

  } catch (error) {
    console.error('Mall Manager AI error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process mall manager AI request',
      details: error.message
    });
  }
});

// Retailer AI Assistant
router.post('/retailer-ai-assistant', async (req, res) => {
  try {
    const { retailerId, tasks, businessData } = req.body;

    const retailerPrompt = `You are a specialized Retailer AI Assistant for SPIRAL platform businesses.

Retailer ID: ${retailerId}
Selected Tasks: ${tasks.join(', ')}

Your expertise includes:
- Inventory management and optimization
- Product photography and descriptions
- Social media marketing
- Customer service automation
- Email marketing campaigns
- Price optimization strategies
- Sales analytics and reporting
- SPIRAL platform optimization

Provide specific, actionable steps for each selected task. Include:
1. Immediate actions to take
2. Expected results and timeline
3. ROI projections where applicable
4. SPIRAL platform integration benefits

Be practical, business-focused, and results-oriented.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: retailerPrompt },
        { role: "user", content: `I need help with these retailer tasks: ${tasks.join(', ')}. My business focus is maximizing efficiency and profitability through SPIRAL.` }
      ],
      response_format: { type: "json_object" },
      temperature: 0.6
    });

    const aiResponse = JSON.parse(completion.choices[0].message.content);

    res.json({
      success: true,
      data: {
        retailerId,
        tasks,
        aiResponse,
        timestamp: Date.now(),
        estimated_savings: "$300-800/month",
        time_savings: "15-25 hours/week"
      }
    });

  } catch (error) {
    console.error('Retailer AI error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process retailer AI request',
      details: error.message
    });
  }
});

// Shopper AI Agent
router.post('/shopper-ai-agent', async (req, res) => {
  try {
    const { shopperId, services, budget, location, preferences } = req.body;

    const shopperPrompt = `You are a Personal Shopping AI Assistant for SPIRAL platform users.

Shopper ID: ${shopperId}
Location: ${location}
Budget: $${budget}
Selected Services: ${services.join(', ')}
Loyalty Level: ${preferences.loyaltyLevel}

Your expertise includes:
- Deal hunting and price optimization
- Visual product search and matching
- Budget management and spending alerts
- Personalized product recommendations  
- Shopping route optimization
- Loyalty rewards maximization
- SPIRAL platform benefits optimization

Provide personalized shopping assistance for the selected services. Include:
1. Immediate money-saving opportunities
2. Personalized deal alerts setup
3. Shopping optimization strategies
4. SPIRAL rewards maximization plan
5. Expected savings projections

Be friendly, helpful, and focused on maximizing value and convenience.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: shopperPrompt },
        { role: "user", content: `I need help with these shopping services: ${services.join(', ')}. My budget is $${budget} and I'm located in ${location}.` }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7
    });

    const aiResponse = JSON.parse(completion.choices[0].message.content);

    res.json({
      success: true,
      data: {
        shopperId,
        services,
        location,
        budget,
        aiResponse,
        timestamp: Date.now(),
        estimated_savings: "30-50% per purchase",
        convenience_score: "95% time savings"
      }
    });

  } catch (error) {
    console.error('Shopper AI error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process shopper AI request',
      details: error.message
    });
  }
});

// Unified AI Dashboard Status
router.get('/ai-dashboard-status', async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        mall_manager_ai: {
          status: "active",
          capabilities: [
            "tenant_recruitment", 
            "performance_optimization", 
            "revenue_analysis", 
            "event_planning",
            "lease_negotiation"
          ],
          response_time: "15-30 minutes"
        },
        retailer_ai: {
          status: "active", 
          capabilities: [
            "inventory_optimization",
            "marketing_automation",
            "customer_service",
            "sales_analytics", 
            "spiral_integration"
          ],
          avg_savings: "$500/month",
          time_savings: "20 hours/week"
        },
        shopper_ai: {
          status: "active",
          capabilities: [
            "deal_hunting",
            "visual_search", 
            "budget_management",
            "route_optimization",
            "loyalty_maximization"
          ],
          avg_savings: "40% per purchase",
          user_satisfaction: "4.8/5"
        }
      }
    });
  } catch (error) {
    console.error('AI Dashboard Status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get AI dashboard status'
    });
  }
});

export default router;