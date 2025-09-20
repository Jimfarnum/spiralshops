import dotenv from "dotenv";
import { cloudant, initCloudant } from "../cloudant.js";
import { LLMClient, createRetailInsightPrompt } from "../llm.js";
import { SpiralEvent } from "../schemas.js";
import { claraAdminInsights, claraMallInsights } from "../agents/clara.js";

dotenv.config();

async function generateWeeklyInsights() {
  console.log("🧠 Starting weekly insights generation...");
  
  await initCloudant();
  const llm = new LLMClient();
  
  // Get events from the past 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  try {
    // Fetch all events from the past week
    const eventsResult = await cloudant.postFind({
      db: process.env.CLOUDANT_DB!,
      selector: {
        ts: {
          $gte: sevenDaysAgo.toISOString()
        }
      },
      limit: 10000
    });

    const events = eventsResult.result?.docs as SpiralEvent[];
    
    if (!events || events.length === 0) {
      console.log("⚠️ No events found for the past week");
      return;
    }

    console.log(`📊 Processing ${events.length} events from the past week`);
    
    // Group events by store
    const eventsByStore = events.reduce((acc, event) => {
      const storeId = event.storeId || "unknown";
      if (!acc[storeId]) acc[storeId] = [];
      acc[storeId].push(event);
      return acc;
    }, {} as Record<string, SpiralEvent[]>);

    // Generate insights for each store
    for (const [storeId, storeEvents] of Object.entries(eventsByStore)) {
      if (storeId === "unknown" || storeEvents.length < 5) {
        console.log(`⏭️ Skipping ${storeId} - insufficient data (${storeEvents.length} events)`);
        continue;
      }

      console.log(`🔍 Generating Clara insights for store ${storeId} (${storeEvents.length} events)`);
      
      try {
        // Extract data for Clara
        const funnel = {
          searches: storeEvents.filter(e => e.type === "search").length,
          carts: storeEvents.filter(e => e.type === "cart_event").length,
          checkouts: storeEvents.filter(e => e.type === "checkout").length
        };
        
        const queryMap = new Map<string, number>();
        storeEvents
          .filter(e => e.type === "search" && e.payload.query)
          .forEach(e => {
            const query = e.payload.query;
            queryMap.set(query, (queryMap.get(query) || 0) + 1);
          });
        
        const topQueries: [string, number][] = Array.from(queryMap.entries())
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5);
        
        // Use Clara for insights generation
        const insights = await claraAdminInsights({
          storeId,
          funnel,
          topQueries
        });
        
        // Store insights in Cloudant
        const insightDoc = {
          storeId,
          ts: new Date().toISOString(),
          period: "weekly",
          eventCount: storeEvents.length,
          insights,
          funnel,
          topQueries,
          generatedBy: "clara-promptwright"
        };

        await cloudant.postDocument({
          db: process.env.CLOUDANT_DB_INSIGHTS!,
          document: insightDoc
        });

        console.log(`✅ Generated insights for store ${storeId}`);
        
        // Optional: Send webhook notifications
        await sendWebhookNotifications(storeId, insightDoc);
        
      } catch (error) {
        console.error(`❌ Failed to generate insights for store ${storeId}:`, error);
      }

      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log("🎉 Weekly insights generation completed!");
    
  } catch (error) {
    console.error("❌ Error during insights generation:", error);
  }
}

async function sendWebhookNotifications(storeId: string, insights: any) {
  if (!process.env.RETAILER_WEBHOOK) return;
  
  try {
    const response = await fetch(process.env.RETAILER_WEBHOOK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "weekly_insights",
        storeId,
        timestamp: insights.ts,
        summary: insights.insights.substring(0, 500) + "...",
        fullInsightsUrl: `${process.env.BASE_URL}/admin/insights/${storeId}`
      })
    });

    if (response.ok) {
      console.log(`📡 Webhook notification sent for store ${storeId}`);
    } else {
      console.warn(`⚠️ Webhook failed for store ${storeId}: ${response.statusText}`);
    }
  } catch (error) {
    console.warn(`⚠️ Webhook error for store ${storeId}:`, error);
  }
}

// Run insights generation
if (import.meta.url === `file://${process.argv[1]}`) {
  generateWeeklyInsights()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Fatal error:", error);
      process.exit(1);
    });
}