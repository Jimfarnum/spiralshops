// Clara AI Agent API Routes
import express from 'express';
import { initializeAgentRegistry } from '../lib/agents.js';

const router = express.Router();

// Initialize agent registry (will use in-memory storage for now)
const agentRegistry = initializeAgentRegistry(null);

// Clara AI endpoint
router.post('/clara', async (req, res) => {
  try {
    const { input, userType = "unknown", agentPreference = null } = req.body;
    
    if (!input) {
      return res.status(400).json({ 
        success: false, 
        error: "Input is required" 
      });
    }

    const response = agentRegistry.handle(input, userType, agentPreference);
    
    res.json({ 
      success: true, 
      data: response,
      meta: {
        agentStatus: agentRegistry.getStatus(),
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Clara AI error:', error);
    res.status(500).json({ 
      success: false, 
      error: "Internal server error" 
    });
  }
});

// Agent status endpoint
router.get('/clara/status', (req, res) => {
  try {
    const status = agentRegistry.getStatus();
    res.json({ 
      success: true, 
      data: status 
    });
  } catch (error) {
    console.error('Clara status error:', error);
    res.status(500).json({ 
      success: false, 
      error: "Internal server error" 
    });
  }
});

// Knowledge base management
router.post('/clara/knowledge', (req, res) => {
  try {
    const { category, key, value } = req.body;
    
    if (!category || !key || !value) {
      return res.status(400).json({ 
        success: false, 
        error: "Category, key, and value are required" 
      });
    }

    agentRegistry.addKnowledgeEntry(category, key, value);
    
    res.json({ 
      success: true, 
      message: `Knowledge entry added: ${category}.${key}` 
    });
  } catch (error) {
    console.error('Knowledge base error:', error);
    res.status(500).json({ 
      success: false, 
      error: "Internal server error" 
    });
  }
});

export default router;