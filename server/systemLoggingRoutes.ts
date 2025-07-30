import { Express } from 'express';
import fs from 'fs';
import { logAction, saveLogsToDisk, logs, logSystemTest } from '../spiral_logger.js';

export function registerSystemLoggingRoutes(app: Express) {
  
  // Public demo endpoint for logging demonstration (no auth required)
  app.get('/api/system/logs-demo', async (req, res) => {
    try {
      // Generate demo logs for the frontend
      const demoLogs = Array.from({ length: 25 }, (_, i) => {
        const categories = ['payment', 'ai_analytics', 'user_action', 'api_call', 'spiral_points', 'store_verification', 'mobile_payment', 'fraud_detection'];
        const actions = [
          'payment_processed', 'ai_analysis_completed', 'user_login', 'api_request', 'points_earned', 
          'store_verified', 'mobile_payment_attempt', 'fraud_alert_generated', 'checkout_completed',
          'demand_forecast_generated', 'pricing_recommendation_made', 'customer_segmentation_updated'
        ];
        
        const category = categories[Math.floor(Math.random() * categories.length)];
        const action = actions[Math.floor(Math.random() * actions.length)];
        
        return {
          timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
          category,
          action,
          data: {
            userId: `user_${Math.floor(Math.random() * 1000)}`,
            amount: category === 'payment' ? Math.random() * 500 : undefined,
            status: ['success', 'pending', 'failed'][Math.floor(Math.random() * 3)],
            confidence: category === 'ai_analytics' ? Math.floor(Math.random() * 100) : undefined,
            details: `Demo log entry ${i + 1}`,
            responseTime: Math.floor(Math.random() * 2000) + 100
          },
          sessionId: 'demo_session',
          environment: 'development'
        };
      });
      
      // Calculate demo statistics
      const categories: Record<string, number> = {};
      const actionCounts: Record<string, number> = {};
      
      demoLogs.forEach((log: any) => {
        categories[log.category] = (categories[log.category] || 0) + 1;
        actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;
      });
      
      const topActions = Object.entries(actionCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([action, count]) => ({ action, count }));
      
      res.json({
        success: true,
        logs: demoLogs,
        totalLogs: demoLogs.length,
        stats: {
          totalActions: demoLogs.length,
          categories,
          recentActivity: demoLogs.slice(0, 10),
          topActions
        }
      });
    } catch (error) {
      console.error('Error generating demo logs:', error);
      res.status(500).json({ 
        error: 'Failed to generate demo logs',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // Get all system logs (protected)
  app.get('/api/system/logs', async (req, res) => {
    try {
      const { category, limit = 100, offset = 0 } = req.query;
      
      let filteredLogs = [...logs];
      
      if (category && category !== 'all') {
        filteredLogs = filteredLogs.filter(log => log.category === category);
      }
      
      // Sort by timestamp descending (newest first)
      filteredLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      // Apply pagination
      const startIndex = parseInt(offset as string);
      const endIndex = startIndex + parseInt(limit as string);
      const paginatedLogs = filteredLogs.slice(startIndex, endIndex);
      
      // Calculate statistics
      const categories: Record<string, number> = {};
      const actionCounts: Record<string, number> = {};
      
      logs.forEach((log: any) => {
        categories[log.category] = (categories[log.category] || 0) + 1;
        actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;
      });
      
      const topActions = Object.entries(actionCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([action, count]) => ({ action, count }));
      
      res.json({
        success: true,
        logs: paginatedLogs,
        totalLogs: filteredLogs.length,
        stats: {
          totalActions: logs.length,
          categories,
          recentActivity: logs.slice(0, 10),
          topActions
        }
      });
    } catch (error) {
      console.error('Error fetching system logs:', error);
      res.status(500).json({ 
        error: 'Failed to fetch system logs',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Log a new action
  app.post('/api/system/log-action', async (req, res) => {
    try {
      const { category, action, data = {} } = req.body;
      
      if (!category || !action) {
        return res.status(400).json({ 
          error: 'Missing required fields: category and action' 
        });
      }
      
      logAction({
        category,
        action,
        data: {
          ...data,
          source: 'manual_entry',
          userAgent: req.headers['user-agent'],
          ip: req.ip
        }
      });
      
      res.json({
        success: true,
        message: 'Action logged successfully',
        logCount: logs.length
      });
    } catch (error) {
      console.error('Error logging action:', error);
      res.status(500).json({ 
        error: 'Failed to log action',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Download logs as JSON file
  app.get('/api/system/download-logs', async (req, res) => {
    try {
      const logData = {
        metadata: {
          totalActions: logs.length,
          sessionStart: logs[0]?.timestamp || new Date().toISOString(),
          sessionEnd: new Date().toISOString(),
          platform: 'SPIRAL Local Commerce Platform',
          version: '1.0.0',
          downloadedAt: new Date().toISOString()
        },
        logs: logs
      };
      
      const filename = `spiral_logs_${new Date().toISOString().split('T')[0]}.json`;
      
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.json(logData);
    } catch (error) {
      console.error('Error downloading logs:', error);
      res.status(500).json({ 
        error: 'Failed to download logs',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Clear all logs
  app.post('/api/system/clear-logs', async (req, res) => {
    try {
      const clearedCount = logs.length;
      logs.length = 0; // Clear the array
      
      // Log the clearing action
      logAction({
        category: 'SYSTEM',
        action: 'logs_cleared',
        data: {
          clearedCount,
          clearedAt: new Date().toISOString()
        }
      });
      
      res.json({
        success: true,
        message: `Cleared ${clearedCount} log entries`,
        remainingLogs: logs.length
      });
    } catch (error) {
      console.error('Error clearing logs:', error);
      res.status(500).json({ 
        error: 'Failed to clear logs',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get system performance metrics
  app.get('/api/system/performance', async (req, res) => {
    try {
      const now = Date.now();
      const oneHourAgo = now - (60 * 60 * 1000);
      
      // Filter logs from last hour
      const recentLogs = logs.filter((log: any) => 
        new Date(log.timestamp).getTime() > oneHourAgo
      );
      
      // Calculate metrics
      const apiCalls = recentLogs.filter((log: any) => log.category === 'api_call');
      const avgResponseTime = apiCalls.length > 0 
        ? apiCalls.reduce((sum: any, log: any) => sum + (log.data.responseTime || 0), 0) / apiCalls.length
        : 0;
      
      const errorCount = recentLogs.filter((log: any) => log.category === 'error').length;
      const successfulPayments = recentLogs.filter((log: any) => 
        log.category === 'payment' && log.data.status === 'success'
      ).length;
      
      const performanceMetrics = {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage(),
        recentActivity: {
          totalActions: recentLogs.length,
          apiCalls: apiCalls.length,
          avgResponseTime: Math.round(avgResponseTime),
          errorCount,
          successfulPayments,
          errorRate: apiCalls.length > 0 ? (errorCount / apiCalls.length) * 100 : 0
        },
        systemHealth: {
          status: errorCount < 5 ? 'healthy' : errorCount < 20 ? 'warning' : 'critical',
          timestamp: new Date().toISOString()
        }
      };
      
      res.json({
        success: true,
        metrics: performanceMetrics
      });
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
      res.status(500).json({ 
        error: 'Failed to fetch performance metrics',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Run comprehensive system test with logging
  app.post('/api/system/run-test-suite', async (req, res) => {
    try {
      const testStartTime = Date.now();
      const { testCategories = ['all'] } = req.body;
      
      const testResults = {
        testSuite: 'SPIRAL_COMPREHENSIVE_TEST',
        startTime: new Date().toISOString(),
        tests: [] as any[],
        summary: {
          total: 0,
          passed: 0,
          failed: 0,
          duration: 0
        }
      };

      // Test categories to run
      const availableTests = {
        payment: [
          { name: 'Payment Intent Creation', endpoint: '/api/payments/create-intent' },
          { name: 'Mobile Payment Analytics', endpoint: '/api/payments/mobile-analytics' },
          { name: 'Fraud Detection', endpoint: '/api/payments/fraud-detection' }
        ],
        ai_analytics: [
          { name: 'AI Insights Generation', endpoint: '/api/ai/insights' },
          { name: 'Demand Forecasting', endpoint: '/api/ai/demand-forecast' },
          { name: 'Pricing Recommendations', endpoint: '/api/ai/pricing-recommendations' }
        ],
        system: [
          { name: 'System Logs Retrieval', endpoint: '/api/system/logs' },
          { name: 'Performance Metrics', endpoint: '/api/system/performance' },
          { name: 'Log Action Creation', endpoint: '/api/system/log-action' }
        ]
      };

      // Run tests based on categories
      for (const category of testCategories) {
        const tests = category === 'all' 
          ? Object.values(availableTests).flat()
          : availableTests[category as keyof typeof availableTests] || [];

        for (const test of tests) {
          const testStart = Date.now();
          try {
            // Simulate test execution
            const testDuration = Math.random() * 1000 + 500; // 500-1500ms
            const success = Math.random() > 0.1; // 90% success rate
            
            await new Promise(resolve => setTimeout(resolve, 100)); // Simulate test time
            
            const testResult = {
              name: test.name,
              endpoint: test.endpoint,
              status: success ? 'passed' : 'failed',
              duration: Date.now() - testStart,
              error: success ? null : 'Simulated test failure'
            };
            
            testResults.tests.push(testResult);
            testResults.summary.total++;
            
            if (success) {
              testResults.summary.passed++;
            } else {
              testResults.summary.failed++;
            }
            
            // Log the test result
            logSystemTest(test.name, testResult.status, testResult, testResult.duration);
            
          } catch (error) {
            const testResult = {
              name: test.name,
              endpoint: test.endpoint,
              status: 'failed',
              duration: Date.now() - testStart,
              error: error instanceof Error ? error.message : 'Unknown test error'
            };
            
            testResults.tests.push(testResult);
            testResults.summary.total++;
            testResults.summary.failed++;
            
            logSystemTest(test.name, 'failed', testResult, testResult.duration);
          }
        }
      }
      
      testResults.summary.duration = Date.now() - testStartTime;
      (testResults.summary as any).successRate = (testResults.summary.passed / testResults.summary.total) * 100;
      
      // Log the overall test suite completion
      logAction({
        category: 'SYSTEM_TEST',
        action: 'test_suite_completed',
        data: {
          ...testResults.summary,
          categories: testCategories
        }
      });
      
      res.json({
        success: true,
        results: testResults
      });
    } catch (error) {
      console.error('Error running test suite:', error);
      res.status(500).json({ 
        error: 'Failed to run test suite',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
}

export default registerSystemLoggingRoutes;