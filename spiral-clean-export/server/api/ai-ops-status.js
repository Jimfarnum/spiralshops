// AI Ops GPT Status and Monitoring API
import express from 'express';

const router = express.Router();

// Get AI Ops system status
router.get('/ai-ops/status', (req, res) => {
  try {
    if (global.getAIOpsStatus) {
      const status = global.getAIOpsStatus();
      res.json({
        success: true,
        status,
        systemActive: true
      });
    } else {
      res.json({
        success: false,
        message: "AI Ops system not initialized",
        systemActive: false
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving AI Ops status",
      error: error.message
    });
  }
});

// Get AI Ops logs
router.get('/ai-ops/logs', (req, res) => {
  try {
    if (global.getAIOpsLogs) {
      const logs = global.getAIOpsLogs();
      res.json({
        success: true,
        logs,
        totalLogs: logs.length
      });
    } else {
      res.json({
        success: false,
        message: "AI Ops system not initialized",
        logs: []
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving AI Ops logs",
      error: error.message
    });
  }
});

// Run manual AI Ops test cycle
router.post('/ai-ops/run-tests', async (req, res) => {
  try {
    if (global.runAIOpsTests) {
      const results = await global.runAIOpsTests();
      res.json({
        success: true,
        message: "AI Ops test cycle completed",
        results,
        totalTests: results.length
      });
    } else {
      res.json({
        success: false,
        message: "AI Ops system not initialized"
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error running AI Ops tests",
      error: error.message
    });
  }
});

// Get AI Ops agent performance summary
router.get('/ai-ops/performance', (req, res) => {
  try {
    if (global.getAIOpsLogs) {
      const logs = global.getAIOpsLogs();
      
      // Calculate performance metrics
      const agentStats = {};
      const recentLogs = logs.slice(-20); // Last 20 test results
      
      recentLogs.forEach(log => {
        if (!agentStats[log.agent]) {
          agentStats[log.agent] = {
            totalTests: 0,
            passedTests: 0,
            failedTests: 0,
            averageDuration: 0,
            totalDuration: 0,
            lastStatus: null,
            lastTestTime: null
          };
        }
        
        const stats = agentStats[log.agent];
        stats.totalTests++;
        stats.lastStatus = log.status;
        stats.lastTestTime = log.timestamp;
        
        if (log.status === 'OK') {
          stats.passedTests++;
        } else {
          stats.failedTests++;
        }
        
        if (log.duration) {
          stats.totalDuration += log.duration;
          stats.averageDuration = Math.round(stats.totalDuration / stats.totalTests);
        }
      });
      
      // Calculate success rates
      Object.keys(agentStats).forEach(agent => {
        const stats = agentStats[agent];
        stats.successRate = stats.totalTests > 0 ? 
          Math.round((stats.passedTests / stats.totalTests) * 100) : 0;
      });
      
      res.json({
        success: true,
        performance: agentStats,
        totalLogs: logs.length,
        recentLogsAnalyzed: recentLogs.length
      });
    } else {
      res.json({
        success: false,
        message: "AI Ops system not initialized"
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error calculating AI Ops performance",
      error: error.message
    });
  }
});

export default router;