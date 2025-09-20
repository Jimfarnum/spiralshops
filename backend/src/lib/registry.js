export class AgentRegistry {
  constructor() {
    this.agents = new Map();
    this.initializeDefaultAgents();
  }

  initializeDefaultAgents() {
    const defaultAgents = [
      {
        name: 'ShopperAssistant',
        description: 'Helps shoppers find products and navigate the platform',
        capabilities: ['product_search', 'recommendations', 'navigation_help']
      },
      {
        name: 'RetailerOnboarding',
        description: 'Assists retailers with platform onboarding',
        capabilities: ['application_review', 'setup_guidance', 'training']
      },
      {
        name: 'InventoryOptimizer',
        description: 'Optimizes inventory management for retailers',
        capabilities: ['stock_analysis', 'demand_forecasting', 'reorder_suggestions']
      },
      {
        name: 'CustomerSupport',
        description: 'Provides customer support and issue resolution',
        capabilities: ['issue_resolution', 'faq_assistance', 'escalation_handling']
      }
    ];

    defaultAgents.forEach(agent => {
      this.agents.set(agent.name, {
        ...agent,
        status: 'active',
        lastRun: null,
        totalRuns: 0
      });
    });
  }

  list() {
    return Array.from(this.agents.entries()).map(([name, config]) => ({
      name,
      ...config
    }));
  }

  async run(agentName, params = {}) {
    const agent = this.agents.get(agentName);
    
    if (!agent) {
      throw new Error(`Agent '${agentName}' not found`);
    }

    // Mock agent execution
    const result = {
      agent: agentName,
      executedAt: new Date().toISOString(),
      params,
      result: this.mockAgentExecution(agentName, params),
      status: 'success'
    };

    // Update agent stats
    agent.lastRun = result.executedAt;
    agent.totalRuns++;
    this.agents.set(agentName, agent);

    return result;
  }

  mockAgentExecution(agentName, params) {
    switch (agentName) {
      case 'ShopperAssistant':
        return {
          action: 'product_recommendation',
          recommendations: [
            { id: 1, name: 'Wireless Bluetooth Speaker', relevance: 0.95 },
            { id: 2, name: 'Smart Home Hub', relevance: 0.87 }
          ]
        };
      
      case 'RetailerOnboarding':
        return {
          action: 'onboarding_step',
          nextSteps: ['Complete business verification', 'Upload product catalog', 'Configure shipping']
        };
      
      case 'InventoryOptimizer':
        return {
          action: 'inventory_analysis',
          recommendations: ['Restock items with low inventory', 'Adjust pricing for slow-moving items']
        };
      
      case 'CustomerSupport':
        return {
          action: 'support_response',
          response: 'I can help you with that issue. Let me check your account details.'
        };
      
      default:
        return {
          action: 'generic_response',
          message: `Agent ${agentName} executed successfully`
        };
    }
  }

  register(name, config) {
    this.agents.set(name, {
      ...config,
      status: 'active',
      lastRun: null,
      totalRuns: 0
    });
  }

  unregister(name) {
    return this.agents.delete(name);
  }
}