import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyzeItem, renderDigest, createTicketsLocally, generateReport } from './rd_analyzer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * SPIRAL AI R&D Agent - Main Agent
 * Continuously monitors tech sources and makes implementation decisions
 */

class SpiralRDAgent {
  constructor() {
    this.sources = {
      'ai-platforms': [
        'https://openai.com/blog',
        'https://www.anthropic.com/news',
        'https://ai.googleblog.com',
        'https://mistral.ai/news'
      ],
      'retail-tech': [
        'https://shopify.engineering',
        'https://www.amazon.science/blog',
        'https://medium.com/walmartglobaltech'
      ],
      'payments': [
        'https://stripe.com/blog',
        'https://www.adyen.com/blog',
        'https://developer.visa.com/blog'
      ],
      'venture': [
        'https://a16z.com/posts',
        'https://www.sequoiacap.com/article'
      ]
    };
    
    this.collected = [];
    this.analyzed = [];
  }

  async fetchFromSources() {
    console.log('🔍 SPIRAL R&D Agent: Fetching from tech sources...');
    
    // Simulate tech item collection (in production, this would use RSS/API feeds)
    const simulatedItems = [
      {
        title: "Apple Pay Later Integration for Local Commerce",
        url: "https://developer.apple.com/pay-later",
        source: "Apple Developer",
        topic: "payments",
        text: "Apple Pay Later provides consumers with a way to split purchases into four payments over six weeks, with no interest and no fees. For local commerce platforms, this reduces friction at checkout and increases conversion rates by offering flexible payment options. Integration requires minimal changes to existing Apple Pay implementations and can significantly boost average order values for local retailers."
      },
      {
        title: "Shopify Local Inventory Sync API Enhancement",
        url: "https://shopify.dev/api/admin-rest/2024-01/resources/inventory-level",
        source: "Shopify Engineering",
        topic: "retail-tech",
        text: "New real-time inventory synchronization capabilities allow local stores to maintain accurate stock levels across multiple platforms. The enhanced API supports location-based inventory tracking, enabling features like 'available for pickup' indicators and cross-retailer inventory sharing. This is particularly valuable for mall-based businesses that need to coordinate inventory across multiple storefronts."
      },
      {
        title: "Stripe Terminal for In-Store Payments",
        url: "https://stripe.com/terminal",
        source: "Stripe",
        topic: "payments",
        text: "Stripe Terminal enables unified online and in-store payments through programmable card readers. For local commerce platforms, this creates seamless omnichannel experiences where customers can start purchases online and complete them in-store, or vice versa. The SDK supports loyalty program integration and can handle complex scenarios like split payments across multiple retailers in a mall setting."
      }
    ];

    this.collected = simulatedItems;
    console.log(`📦 Collected ${this.collected.length} items for analysis`);
  }

  async analyzeItems() {
    console.log('🧠 SPIRAL R&D Agent: Analyzing items for implementation decisions...');
    
    this.analyzed = [];
    
    for (const item of this.collected) {
      try {
        console.log(`   Analyzing: ${item.title}`);
        const analysis = await analyzeItem({
          title: item.title,
          url: item.url,
          source: item.source,
          topic: item.topic,
          text: item.text
        });
        
        // Ensure analysis has proper structure
        if (analysis && typeof analysis === 'object') {
          this.analyzed.push(analysis);
          console.log(`   Decision: ${analysis.decision || 'UNDEFINED'} (relevance: ${analysis.scores?.relevance_0_5 || 'N/A'}/5)`);
        } else {
          console.log(`   Analysis failed for: ${item.title} - invalid response structure`);
        }
      } catch (error) {
        console.error(`   Error analyzing ${item.title}:`, error);
      }
    }
    
    console.log(`✅ Analysis complete: ${this.analyzed.length} items processed`);
  }

  generateReports() {
    console.log('📊 SPIRAL R&D Agent: Generating reports and tickets...');
    
    // Generate comprehensive reports
    const reportDir = generateReport(this.analyzed);
    
    // Create implementation tickets
    const ticketCount = createTicketsLocally(this.analyzed);
    console.log(`🎫 Created ${ticketCount} INITIATE tickets`);
    
    // Generate digest for leadership
    const digest = renderDigest(this.analyzed);
    console.log('\n' + digest);
    
    return {
      reportDir,
      ticketCount,
      digest,
      summary: {
        total: this.analyzed.length,
        initiate: this.analyzed.filter(i => i.decision === "INITIATE").length,
        watch: this.analyzed.filter(i => i.decision === "WATCH").length,
        discard: this.analyzed.filter(i => i.decision === "DISCARD").length
      }
    };
  }

  async run() {
    console.log('🚀 SPIRAL AI R&D Agent Starting...\n');
    
    try {
      await this.fetchFromSources();
      await this.analyzeItems();
      const results = this.generateReports();
      
      console.log('\n📈 SPIRAL R&D Agent Summary:');
      console.log(`   Total Items: ${results.summary.total}`);
      console.log(`   Ready to Implement: ${results.summary.initiate}`);
      console.log(`   Watching: ${results.summary.watch}`);
      console.log(`   Discarded: ${results.summary.discard}`);
      console.log(`   Tickets Created: ${results.ticketCount}`);
      
      return results;
    } catch (error) {
      console.error('❌ SPIRAL R&D Agent failed:', error);
      throw error;
    }
  }
}

export default SpiralRDAgent;

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const agent = new SpiralRDAgent();
  agent.run().catch(console.error);
}