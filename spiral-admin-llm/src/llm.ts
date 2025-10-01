import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

interface LLMResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Universal LLM interface supporting multiple providers
export class LLMClient {
  private provider: string;

  constructor() {
    this.provider = process.env.LLM_PROVIDER || "openai";
  }

  async generateInsights(prompt: string): Promise<LLMResponse> {
    switch (this.provider) {
      case "openai":
        return this.callOpenAI(prompt);
      case "watsonx":
        return this.callWatsonX(prompt);
      case "local":
        return this.callLocalLLM(prompt);
      default:
        throw new Error(`Unsupported LLM provider: ${this.provider}`);
    }
  }

  private async callOpenAI(prompt: string): Promise<LLMResponse> {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are the SPIRAL Admin LLM. Generate actionable business insights for retailers based on shopping data. Be concise, specific, and focus on revenue opportunities."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json() as any;
    return {
      content: data.choices[0].message.content,
      usage: data.usage
    };
  }

  private async callWatsonX(prompt: string): Promise<LLMResponse> {
    const response = await fetch(`https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${await this.getWatsonXToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: prompt,
        parameters: {
          decoding_method: "greedy",
          max_new_tokens: 1000,
          temperature: 0.7
        },
        model_id: "ibm/granite-13b-chat-v2",
        project_id: process.env.WATSONX_PROJECT_ID
      })
    });

    if (!response.ok) {
      throw new Error(`WatsonX API error: ${response.statusText}`);
    }

    const data = await response.json() as any;
    return {
      content: data.results[0].generated_text,
      usage: {
        prompt_tokens: data.results[0].input_token_count || 0,
        completion_tokens: data.results[0].generated_token_count || 0,
        total_tokens: (data.results[0].input_token_count || 0) + (data.results[0].generated_token_count || 0)
      }
    };
  }

  private async getWatsonXToken(): Promise<string> {
    const response = await fetch("https://iam.cloud.ibm.com/identity/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=urn:iam:oauth:grant-type:apikey&apikey=${process.env.WATSONX_API_KEY}`
    });

    if (!response.ok) {
      throw new Error("Failed to get WatsonX token");
    }

    const data = await response.json() as any;
    return data.access_token;
  }

  private async callLocalLLM(prompt: string): Promise<LLMResponse> {
    const response = await fetch(process.env.LOCAL_LLM_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`Local LLM API error: ${response.statusText}`);
    }

    const data = await response.json() as any;
    return {
      content: data.generated_text || data.response || data.content,
      usage: {
        prompt_tokens: data.prompt_tokens || 0,
        completion_tokens: data.completion_tokens || 0,
        total_tokens: data.total_tokens || 0
      }
    };
  }
}

// Helper function to create retail insights prompt
export function createRetailInsightPrompt(events: any[]): string {
  const eventSummary = events.reduce((acc, event) => {
    acc[event.type] = (acc[event.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const searches = events
    .filter(e => e.type === "search")
    .map(e => e.payload.query)
    .filter(Boolean);

  const products = events
    .filter(e => e.type === "product_view")
    .map(e => e.payload.productName)
    .filter(Boolean);

  return `
Analyze this week's SPIRAL shopping data for actionable retail insights:

**Activity Summary:**
${Object.entries(eventSummary).map(([type, count]) => `- ${type}: ${count} events`).join('\n')}

**Top Search Queries:**
${searches.slice(0, 10).map((q, i) => `${i + 1}. "${q}"`).join('\n')}

**Most Viewed Products:**
${products.slice(0, 10).map((p, i) => `${i + 1}. ${p}`).join('\n')}

Please provide:
1. **Revenue Opportunities:** What products/categories are in demand but might be undersold?
2. **Search Gap Analysis:** What are customers searching for that we might not have?
3. **Inventory Recommendations:** What should be stocked more/less based on views vs purchases?
4. **Customer Behavior Insights:** Any notable shopping patterns?
5. **Action Items:** 3 specific things the retailer should do this week.

Keep insights practical and revenue-focused.
`;
}