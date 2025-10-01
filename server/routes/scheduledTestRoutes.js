// API routes for scheduled testing system
const express = require('express');
const router = express.Router();

let scheduledTester = null;

// Initialize scheduled tester
const initScheduledTester = (tester) => {
  scheduledTester = tester;
};

// Get test history
router.get('/test-history', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const history = await scheduledTester.getTestHistory(days);
    
    res.json({
      success: true,
      data: {
        history,
        summary: {
          totalTests: history.length,
          averageFunctionality: history.length > 0 ? 
            Math.round(history.reduce((sum, test) => sum + test.overallFunctionality, 0) / history.length) : 0,
          healthyTests: history.filter(test => test.status === 'HEALTHY').length,
          alertTests: history.filter(test => test.status === 'ALERT').length
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve test history',
      message: error.message
    });
  }
});

// Trigger manual test
router.post('/run-test', async (req, res) => {
  try {
    if (!scheduledTester) {
      return res.status(500).json({
        success: false,
        error: 'Scheduled tester not initialized'
      });
    }

    const testResults = await scheduledTester.runComprehensiveTest();
    
    res.json({
      success: true,
      data: testResults,
      message: `Test completed: ${testResults.overallFunctionality}% functionality`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to run manual test',
      message: error.message
    });
  }
});

// Get current test status
router.get('/status', async (req, res) => {
  try {
    const history = await scheduledTester.getTestHistory(1);
    const latestTest = history[0];
    
    if (!latestTest) {
      return res.json({
        success: true,
        data: {
          status: 'NO_DATA',
          message: 'No recent test data available',
          nextScheduledTest: 'Within 24 hours'
        }
      });
    }

    const testAge = Date.now() - new Date(latestTest.timestamp).getTime();
    const hoursOld = Math.round(testAge / (1000 * 60 * 60));
    
    res.json({
      success: true,
      data: {
        latestTest: {
          timestamp: latestTest.timestamp,
          functionality: latestTest.overallFunctionality,
          status: latestTest.status,
          hoursOld
        },
        schedule: {
          comprehensive: 'Daily at 2:00 AM',
          quickCheck: 'Hourly',
          lastRun: latestTest.timestamp
        },
        thresholds: {
          alertBelow: '85%',
          healthyAbove: '90%'
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get test status',
      message: error.message
    });
  }
});

// Update alert threshold
router.post('/alert-threshold', async (req, res) => {
  try {
    const { threshold } = req.body;
    
    if (!threshold || threshold < 0 || threshold > 100) {
      return res.status(400).json({
        success: false,
        error: 'Invalid threshold. Must be between 0 and 100'
      });
    }

    if (scheduledTester) {
      scheduledTester.alertThreshold = threshold;
    }
    
    res.json({
      success: true,
      message: `Alert threshold updated to ${threshold}%`,
      data: { threshold }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update alert threshold',
      message: error.message
    });
  }
});

module.exports = { router, initScheduledTester };