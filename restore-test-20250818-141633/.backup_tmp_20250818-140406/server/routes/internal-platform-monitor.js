// Internal Platform Monitor API Routes
// Provides endpoints for monitoring and controlling the Internal Platform AI Agent

import express from 'express';
import InternalPlatformMonitor from '../ai-agents/InternalPlatformMonitor.js';

const router = express.Router();

// Create global monitor instance
let platformMonitor = null;

// Initialize monitor
const initializeMonitor = () => {
  if (!platformMonitor) {
    platformMonitor = new InternalPlatformMonitor();
    platformMonitor.startMonitoring();
  }
  return platformMonitor;
};

// Start monitoring
router.post('/start', async (req, res) => {
  try {
    const monitor = initializeMonitor();
    
    res.json({
      success: true,
      message: 'Internal Platform AI Agent monitoring started',
      status: 'active',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to start platform monitor:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start monitoring',
      details: error.message
    });
  }
});

// Get health status
router.get('/health', async (req, res) => {
  try {
    const monitor = initializeMonitor();
    const healthStatus = monitor.getHealthStatus();
    
    res.json({
      success: true,
      health: healthStatus,
      agent: 'Internal Platform AI Agent',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to get health status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get health status',
      details: error.message
    });
  }
});

// Get metrics
router.get('/metrics', async (req, res) => {
  try {
    const monitor = initializeMonitor();
    const metrics = {
      api: Object.fromEntries(monitor.metrics.api),
      ui: Object.fromEntries(monitor.metrics.ui),
      errors: monitor.metrics.errors.slice(-20), // Last 20 errors
      bottlenecks: monitor.metrics.bottlenecks.slice(-20), // Last 20 bottlenecks
      corrections: monitor.corrections.slice(-20) // Last 20 corrections
    };
    
    res.json({
      success: true,
      metrics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to get metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get metrics',
      details: error.message
    });
  }
});

// Get bottlenecks analysis
router.get('/bottlenecks', async (req, res) => {
  try {
    const monitor = initializeMonitor();
    const { timeframe = '1h' } = req.query;
    
    // Calculate timeframe in milliseconds
    const timeframes = {
      '5m': 5 * 60 * 1000,
      '15m': 15 * 60 * 1000,
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000
    };
    
    const timeframeMs = timeframes[timeframe] || timeframes['1h'];
    const cutoff = Date.now() - timeframeMs;
    
    const recentBottlenecks = monitor.metrics.bottlenecks.filter(b => 
      b.timestamp > cutoff
    );
    
    // Analyze bottleneck patterns
    const analysis = {
      total: recentBottlenecks.length,
      byType: {},
      byLocation: {},
      severity: { critical: 0, warning: 0 },
      trends: []
    };
    
    recentBottlenecks.forEach(bottleneck => {
      // By type
      analysis.byType[bottleneck.type] = (analysis.byType[bottleneck.type] || 0) + 1;
      
      // By location
      analysis.byLocation[bottleneck.location] = (analysis.byLocation[bottleneck.location] || 0) + 1;
      
      // By severity
      analysis.severity[bottleneck.severity] = (analysis.severity[bottleneck.severity] || 0) + 1;
    });
    
    res.json({
      success: true,
      timeframe,
      analysis,
      bottlenecks: recentBottlenecks,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to get bottlenecks analysis:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze bottlenecks',
      details: error.message
    });
  }
});

// Get corrections history
router.get('/corrections', async (req, res) => {
  try {
    const monitor = initializeMonitor();
    const { limit = 50 } = req.query;
    
    const recentCorrections = monitor.corrections
      .slice(-parseInt(limit))
      .reverse(); // Most recent first
    
    // Analyze correction effectiveness
    const analysis = {
      total: monitor.corrections.length,
      recent: recentCorrections.length,
      byType: {},
      byAction: {},
      success_rate: 0.95 // Placeholder - would be calculated based on actual metrics
    };
    
    recentCorrections.forEach(correction => {
      analysis.byType[correction.type] = (analysis.byType[correction.type] || 0) + 1;
      analysis.byAction[correction.action] = (analysis.byAction[correction.action] || 0) + 1;
    });
    
    res.json({
      success: true,
      analysis,
      corrections: recentCorrections,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to get corrections:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get corrections',
      details: error.message
    });
  }
});

// Trigger immediate analysis
router.post('/analyze', async (req, res) => {
  try {
    const monitor = initializeMonitor();
    
    // Force immediate AI analysis
    const systemState = monitor.generateSystemState();
    const analysis = await monitor.analyzeWithAI(systemState);
    
    res.json({
      success: true,
      analysis,
      systemState,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to trigger analysis:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to trigger analysis',
      details: error.message
    });
  }
});

// Get monitoring dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    const monitor = initializeMonitor();
    const healthStatus = monitor.getHealthStatus();
    
    // Get recent metrics for dashboard
    const dashboardData = {
      health: healthStatus,
      recentBottlenecks: monitor.metrics.bottlenecks.slice(-10),
      recentCorrections: monitor.corrections.slice(-10),
      recentErrors: monitor.metrics.errors.slice(-10),
      systemOverview: {
        monitoringActive: monitor.isMonitoring,
        totalCorrections: monitor.corrections.length,
        totalBottlenecks: monitor.metrics.bottlenecks.length,
        uptime: Date.now() - monitor.lastHealthCheck
      }
    };
    
    res.json({
      success: true,
      dashboard: dashboardData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to get dashboard data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get dashboard data',
      details: error.message
    });
  }
});

// Manual correction trigger
router.post('/correct/:type/:location', async (req, res) => {
  try {
    const monitor = initializeMonitor();
    const { type, location } = req.params;
    const { action = 'manual_correction' } = req.body;
    
    // Trigger manual correction
    switch (type) {
      case 'bottleneck':
        await monitor.correctCriticalBottleneck('manual', location, 'manual_trigger');
        break;
      case 'crash':
        await monitor.correctCrashPoint('manual', location, 'manual_trigger');
        break;
      case 'ui':
        await monitor.correctUIBottleneck(location, 'manual_trigger');
        break;
      case 'onboarding':
        await monitor.correctOnboardingBottleneck(location, 'manual_trigger');
        break;
      default:
        throw new Error(`Unknown correction type: ${type}`);
    }
    
    res.json({
      success: true,
      message: `Manual correction triggered for ${type} at ${location}`,
      type,
      location,
      action,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to trigger manual correction:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to trigger manual correction',
      details: error.message
    });
  }
});

// Configuration endpoints
router.get('/config', async (req, res) => {
  try {
    const monitor = initializeMonitor();
    
    res.json({
      success: true,
      config: {
        thresholds: monitor.thresholds,
        monitoring: monitor.isMonitoring
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get configuration',
      details: error.message
    });
  }
});

router.put('/config', async (req, res) => {
  try {
    const monitor = initializeMonitor();
    const { thresholds } = req.body;
    
    if (thresholds) {
      Object.assign(monitor.thresholds, thresholds);
    }
    
    res.json({
      success: true,
      message: 'Configuration updated',
      config: {
        thresholds: monitor.thresholds,
        monitoring: monitor.isMonitoring
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update configuration',
      details: error.message
    });
  }
});

export default router;