// SPIRAL Site Testing Agent API Routes
import express from 'express';
import SiteTestingAgent from '../ai-agents/SiteTestingAgent.js';

const router = express.Router();
let testingAgent = null;

// Initialize the testing agent
function getTestingAgent() {
  if (!testingAgent) {
    testingAgent = new SiteTestingAgent();
  }
  return testingAgent;
}

// Start comprehensive site testing
router.post('/start', async (req, res) => {
  try {
    const agent = getTestingAgent();
    
    if (agent.isRunning) {
      return res.status(400).json({
        success: false,
        message: 'Testing agent is already running'
      });
    }

    // Start testing in background
    setTimeout(async () => {
      await agent.startComprehensiveTesting();
    }, 100);

    res.json({
      success: true,
      message: 'SPIRAL Site Testing Agent started',
      status: 'running',
      journeys: agent.userJourneys
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Stop testing
router.post('/stop', (req, res) => {
  try {
    const agent = getTestingAgent();
    agent.stop();
    
    res.json({
      success: true,
      message: 'SPIRAL Site Testing Agent stopped'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get current status
router.get('/status', (req, res) => {
  try {
    const agent = getTestingAgent();
    const status = agent.getStatus();
    
    res.json({
      success: true,
      status
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get latest test results
router.get('/results', (req, res) => {
  try {
    const agent = getTestingAgent();
    
    res.json({
      success: true,
      results: agent.testResults,
      isRunning: agent.isRunning
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Start quick test (single journey)
router.post('/quick-test/:journey', async (req, res) => {
  try {
    const { journey } = req.params;
    const agent = getTestingAgent();
    
    if (!agent.userJourneys.includes(journey)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid journey type',
        available: agent.userJourneys
      });
    }

    await agent.runUserJourney(journey);
    
    res.json({
      success: true,
      message: `Quick test completed for ${journey}`,
      result: agent.testResults[agent.testResults.length - 1]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;