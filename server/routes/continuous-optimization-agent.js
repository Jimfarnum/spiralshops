// SPIRAL Continuous Optimization Agent API Routes
import express from 'express';
import ContinuousOptimizationAgent from '../ai-agents/ContinuousOptimizationAgent.js';

const router = express.Router();
let optimizationAgent = null;

// Initialize the optimization agent
function getOptimizationAgent() {
  if (!optimizationAgent) {
    optimizationAgent = new ContinuousOptimizationAgent();
  }
  return optimizationAgent;
}

// Start continuous optimization
router.post('/start', async (req, res) => {
  try {
    const agent = getOptimizationAgent();
    await agent.startContinuousOptimization();
    
    res.json({
      success: true,
      message: 'SPIRAL Continuous Optimization Agent started',
      status: 'running'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Stop continuous optimization
router.post('/stop', async (req, res) => {
  try {
    const agent = getOptimizationAgent();
    await agent.stopContinuousOptimization();
    
    res.json({
      success: true,
      message: 'SPIRAL Continuous Optimization Agent stopped'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get optimization report
router.get('/report', async (req, res) => {
  try {
    const agent = getOptimizationAgent();
    const report = agent.getOptimizationReport();
    
    res.json({
      success: true,
      report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Run comprehensive analysis
router.post('/analyze', async (req, res) => {
  try {
    const agent = getOptimizationAgent();
    const analysis = await agent.runComprehensiveAnalysis();
    
    res.json({
      success: true,
      message: 'Comprehensive analysis completed',
      analysis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Generate performance report
router.get('/performance-report', async (req, res) => {
  try {
    const agent = getOptimizationAgent();
    const report = await agent.generatePerformanceReport();
    
    res.json({
      success: true,
      report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;