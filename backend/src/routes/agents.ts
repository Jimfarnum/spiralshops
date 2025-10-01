import express from 'express';
import { AgentRegistry } from '../lib/agents.js';

const router = express.Router();
const agentRegistry = new AgentRegistry();

// GET /api/agents - List all available agents
router.get('/', (req, res) => {
  try {
    const agents = agentRegistry.list();
    res.json({
      success: true,
      data: {
        agents,
        total: agents.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to list agents'
    });
  }
});

// POST /api/agents/:name/run - Execute a specific agent
router.post('/:name/run', async (req, res) => {
  try {
    const { name } = req.params;
    const params = req.body;
    
    const result = await agentRegistry.run(name, params);
    
    if (result.ok) {
      res.json({
        success: true,
        data: result
      });
    } else {
      res.status(404).json({
        success: false,
        error: result.details || 'Agent execution failed',
        agent: name
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to execute agent',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/agents/run-all - Execute all agents
router.post('/run-all', async (req, res) => {
  try {
    const agents = agentRegistry.list();
    const results = [];
    
    for (const agentName of agents) {
      try {
        const result = await agentRegistry.run(agentName, req.body);
        results.push(result);
      } catch (error) {
        results.push({
          ok: false,
          name: agentName,
          details: error instanceof Error ? error.message : 'Execution failed'
        });
      }
    }
    
    const successful = results.filter(r => r.ok).length;
    const failed = results.filter(r => !r.ok).length;
    
    res.json({
      success: true,
      data: {
        results,
        summary: {
          total: results.length,
          successful,
          failed
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to execute agents',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/agents/:name/status - Get agent status/info
router.get('/:name/status', (req, res) => {
  try {
    const { name } = req.params;
    const agents = agentRegistry.list();
    
    if (!agents.includes(name)) {
      return res.status(404).json({
        success: false,
        error: 'Agent not found',
        agent: name
      });
    }
    
    res.json({
      success: true,
      data: {
        name,
        status: 'available',
        lastRun: null, // Could be enhanced to track execution history
        capabilities: getAgentCapabilities(name)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get agent status'
    });
  }
});

function getAgentCapabilities(agentName: string): string[] {
  const capabilities: Record<string, string[]> = {
    shopperUX: ['funnel_optimization', 'user_experience', 'conversion_tracking'],
    retailerOnboarding: ['application_processing', 'verification', 'setup_assistance'],
    mallCommunity: ['event_management', 'perk_distribution', 'community_engagement'],
    shoppingLogistics: ['carrier_management', 'shipment_tracking', 'delivery_optimization'],
    marketingSocial: ['campaign_management', 'social_media', 'content_distribution'],
    securityCompliance: ['security_monitoring', 'compliance_checking', 'risk_assessment'],
    partnershipsPricing: ['pricing_optimization', 'discount_management', 'partnership_coordination']
  };
  
  return capabilities[agentName] || [];
}

export default router;