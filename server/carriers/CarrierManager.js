import { USPSAdapter } from './USPSAdapter.js';
import { FedExAdapter } from './FedExAdapter.js';
import { UPSAdapter } from './UPSAdapter.js';

export class CarrierManager {
  constructor() {
    this.adapters = [
      new USPSAdapter(),
      new FedExAdapter(),
      new UPSAdapter()
    ];
  }
  
  async getQuotes(params) {
    const quotes = [];
    
    for (const adapter of this.adapters) {
      try {
        const quote = await adapter.quote(params);
        if (quote) {
          quotes.push(quote);
        }
      } catch (error) {
        console.warn(`${adapter.name} quote failed:`, error.message);
      }
    }
    
    // Sort by cost (cheapest first)
    return quotes.sort((a, b) => a.cost - b.cost);
  }
  
  async getBestQuote(params) {
    const quotes = await this.getQuotes(params);
    return quotes[0] || null; // Return cheapest option
  }
  
  async getQuotesByCarrier(params, carrierName) {
    const adapter = this.adapters.find(a => a.name.toLowerCase() === carrierName.toLowerCase());
    if (!adapter) {
      throw new Error(`Carrier ${carrierName} not supported`);
    }
    
    return await adapter.quote(params);
  }
}