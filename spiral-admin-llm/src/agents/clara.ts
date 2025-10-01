// src/agents/clara.ts
import { LLMClient } from "../llm.js";

export async function claraAdminInsights(data: {
  storeId: string;
  funnel: { searches: number; carts: number; checkouts: number };
  topQueries: [string, number][];
}): Promise<string> {
  const { storeId, funnel, topQueries } = data;
  const llm = new LLMClient();

  const system = `
You are Clara Promptwright, the Admin LLM of SPIRAL.
Your mission is clear:
- Always center the user: shopper, retailer, or mall.
- Be concise, actionable, and non-technical.
- Tone: helpful advisor, not corporate.
`;

  const prompt = `
Generate a weekly report for Retailer ${storeId}.

Data:
- Funnel: Searches=${funnel.searches}, Carts=${funnel.carts}, Checkouts=${funnel.checkouts}
- Top Queries: ${topQueries.map(([q,c]) => `${q} (${c})`).join(", ")}

Rules:
- 4–5 bullet points max.
- Include ONE "Missed Opportunity" based on popular queries not fulfilled.
- Include ONE "Try This Next Week" suggestion (promo, size coverage, pickup option).
- Do not mention SPIRAL itself; make it about THEM.
`;

  const response = await llm.generateInsights(`${system}\n\n${prompt}`);
  return response.content;
}

export async function claraMallInsights(data: {
  mallId: string;
  traffic: { weeklyVisitors: number; averageSession: number };
  topCategories: [string, number][];
  tenantPerformance: { high: string[]; low: string[] };
}): Promise<string> {
  const { mallId, traffic, topCategories, tenantPerformance } = data;
  const llm = new LLMClient();

  const system = `
You are Clara Promptwright, the Admin LLM of SPIRAL.
Focus on mall management insights that drive foot traffic and tenant success.
Be strategic, practical, and focused on community building.
`;

  const prompt = `
Generate a weekly mall management report for Mall ${mallId}.

Data:
- Traffic: ${traffic.weeklyVisitors} weekly visitors, ${traffic.averageSession} min average session
- Top Categories: ${topCategories.map(([c,v]) => `${c} (${v} views)`).join(", ")}
- High Performers: ${tenantPerformance.high.join(", ")}
- Need Support: ${tenantPerformance.low.join(", ")}

Rules:
- 4–5 bullet points max.
- Include ONE "Cross-Tenant Opportunity" to boost underperforming categories.
- Include ONE "Event/Experience Suggestion" based on popular categories.
- Focus on tenant success and visitor experience.
`;

  const response = await llm.generateInsights(`${system}\n\n${prompt}`);
  return response.content;
}

export async function claraShopperInsights(data: {
  shopperId: string;
  behavior: { searchFrequency: number; cartAbandonmentRate: number };
  preferences: [string, number][];
  nearbyStores: string[];
}): Promise<string> {
  const { shopperId, behavior, preferences, nearbyStores } = data;
  const llm = new LLMClient();

  const system = `
You are Clara Promptwright, the Admin LLM of SPIRAL.
Generate personalized shopping insights that help shoppers find what they want faster.
Be friendly, helpful, and focused on saving time and money.
`;

  const prompt = `
Generate personalized shopping insights for Shopper ${shopperId}.

Data:
- Behavior: ${behavior.searchFrequency} searches/week, ${behavior.cartAbandonmentRate}% cart abandonment
- Top Interests: ${preferences.map(([p,s]) => `${p} (${s} searches)`).join(", ")}
- Nearby Stores: ${nearbyStores.join(", ")}

Rules:
- 3–4 bullet points max.
- Include ONE "Time-Saver Tip" based on their search patterns.
- Include ONE "Local Discovery" highlighting a nearby store with their interests.
- Focus on convenience and value.
`;

  const response = await llm.generateInsights(`${system}\n\n${prompt}`);
  return response.content;
}