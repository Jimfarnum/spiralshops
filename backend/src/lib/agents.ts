type AgentResult = { ok: boolean; name: string; details?: any };

export interface Agent {
  name: string;
  run(params?: any): Promise<AgentResult>;
}

class ShopperUXAgent implements Agent {
  name = 'shopperUX';
  async run() { return { ok: true, name: this.name, details: 'Optimized shopper funnel.' }; }
}
class RetailerOnboardingAgent implements Agent {
  name = 'retailerOnboarding';
  async run() { return { ok: true, name: this.name, details: 'Processed retailer application.' }; }
}
class MallCommunityAgent implements Agent {
  name = 'mallCommunity';
  async run() { return { ok: true, name: this.name, details: 'Synced mall perks & events.' }; }
}
class ShoppingLogisticsAgent implements Agent {
  name = 'shoppingLogistics';
  async run() { return { ok: true, name: this.name, details: 'Negotiated carriers & tracked shipments.' }; }
}
class MarketingSocialAgent implements Agent {
  name = 'marketingSocial';
  async run() { return { ok: true, name: this.name, details: 'Posted campaign updates.' }; }
}
class SecurityComplianceAgent implements Agent {
  name = 'securityCompliance';
  async run() { return { ok: true, name: this.name, details: 'Ran daily security checks.' }; }
}
class PartnershipsPricingAgent implements Agent {
  name = 'partnershipsPricing';
  async run() { return { ok: true, name: this.name, details: 'Updated progressive discount tiers.' }; }
}

export class AgentRegistry {
  private agents: Agent[] = [
    new ShopperUXAgent(),
    new RetailerOnboardingAgent(),
    new MallCommunityAgent(),
    new ShoppingLogisticsAgent(),
    new MarketingSocialAgent(),
    new SecurityComplianceAgent(),
    new PartnershipsPricingAgent(),
  ];
  list() { return this.agents.map(a => a.name); }
  async run(name: string, params?: any) {
    const a = this.agents.find(x => x.name === name);
    if (!a) return { ok: false, name, details: 'Agent not found' };
    return a.run(params);
  }
}