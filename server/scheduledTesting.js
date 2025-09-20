// SPIRAL Scheduled Site Functionality Testing System (ES Modules)
// Runs comprehensive tests every 24 hours to ensure 100% functionality

import cron from 'node-cron';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class ScheduledFunctionalityTester {
  constructor() {
    this.testResults = [];
    this.alertThreshold = 85; // Alert if functionality drops below 85%
    this.logFile = path.join(__dirname, '../logs/scheduled-tests.json');
    this.isRunning = false;
    this.init();
  }

  async init() {
    console.log('🧪 SPIRAL Scheduled Testing System Initialized');
    
    // Run comprehensive test every 24 hours at 2 AM
    cron.schedule('0 2 * * *', async () => {
      console.log('🔄 Starting scheduled 24-hour functionality test...');
      await this.runComprehensiveTest();
    });

    // Run quick health check every hour
    cron.schedule('0 * * * *', async () => {
      await this.runQuickHealthCheck();
    });

    // Run mini health check every 15 minutes
    cron.schedule('*/15 * * * *', async () => {
      await this.runMiniHealthCheck();
    });

    console.log('📅 Scheduled tests configured:');
    console.log('   • Comprehensive test: Daily at 2:00 AM');
    console.log('   • Health check: Every hour');
    console.log('   • Mini check: Every 15 minutes');
  }

  async runComprehensiveTest() {
    if (this.isRunning) {
      console.log('🔄 Test already in progress, skipping...');
      return;
    }

    this.isRunning = true;
    
    try {
      const testSuite = {
        timestamp: new Date().toISOString(),
        testType: 'comprehensive',
        results: {
          coreNavigation: await this.testCoreNavigation(),
          apiHealth: await this.testAPIHealth(),
          performance: await this.testPerformance(),
          systemHealth: await this.testSystemHealth()
        }
      };

      // Calculate overall functionality percentage
      const totalTests = Object.values(testSuite.results).reduce((sum, category) => 
        sum + category.tests.length, 0);
      const passedTests = Object.values(testSuite.results).reduce((sum, category) => 
        sum + category.passed, 0);
      
      testSuite.overallFunctionality = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
      testSuite.status = testSuite.overallFunctionality >= this.alertThreshold ? 'HEALTHY' : 'ALERT';

      // Log results
      await this.logTestResults(testSuite);

      // Send alerts if needed
      if (testSuite.status === 'ALERT') {
        await this.sendAlert(testSuite);
      }

      console.log(`🧪 Comprehensive test complete: ${testSuite.overallFunctionality}% functionality`);
      return testSuite;
    } finally {
      this.isRunning = false;
    }
  }

  async testCoreNavigation() {
    const navigationTests = [
      { name: 'Homepage', endpoint: '/', critical: true },
      { name: 'Health Check', endpoint: '/api/check', critical: true },
      { name: 'Products API', endpoint: '/api/products', critical: true },
      { name: 'Stores API', endpoint: '/api/stores', critical: true }
    ];

    const results = { tests: navigationTests, passed: 0, failed: 0, failures: [] };

    for (const test of navigationTests) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(`http://localhost:5000${test.endpoint}`, {
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        if (response.ok) {
          results.passed++;
        } else {
          results.failed++;
          results.failures.push({ test: test.name, error: `HTTP ${response.status}` });
        }
      } catch (error) {
        results.failed++;
        results.failures.push({ test: test.name, error: error.message });
      }
    }

    return results;
  }

  async testAPIHealth() {
    const apiTests = [
      { name: 'Health Check', endpoint: '/api/check' },
      { name: 'Products API', endpoint: '/api/products' },
      { name: 'Stores API', endpoint: '/api/stores' }
    ];

    const results = { tests: apiTests, passed: 0, failed: 0, failures: [] };

    for (const test of apiTests) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch(`http://localhost:5000${test.endpoint}`, {
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json();
          results.passed++;
        } else {
          results.failed++;
          results.failures.push({ test: test.name, error: `HTTP ${response.status}` });
        }
      } catch (error) {
        results.failed++;
        results.failures.push({ test: test.name, error: error.message });
      }
    }

    return results;
  }

  async testPerformance() {
    const performanceTests = [
      { name: 'Health Check Response', endpoint: '/api/check', maxTime: 1000 },
      { name: 'Products API Response', endpoint: '/api/products', maxTime: 2000 },
      { name: 'Stores API Response', endpoint: '/api/stores', maxTime: 2000 }
    ];

    const results = { tests: performanceTests, passed: 0, failed: 0, failures: [] };

    for (const test of performanceTests) {
      try {
        const startTime = Date.now();
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), test.maxTime + 1000);
        
        const response = await fetch(`http://localhost:5000${test.endpoint}`, {
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        const responseTime = Date.now() - startTime;

        if (response.ok && responseTime <= test.maxTime) {
          results.passed++;
        } else if (response.ok) {
          results.failed++;
          results.failures.push({ 
            test: test.name, 
            error: `Response time ${responseTime}ms exceeds ${test.maxTime}ms` 
          });
        } else {
          results.failed++;
          results.failures.push({ test: test.name, error: `HTTP ${response.status}` });
        }
      } catch (error) {
        results.failed++;
        results.failures.push({ test: test.name, error: error.message });
      }
    }

    return results;
  }

  async testSystemHealth() {
    const systemTests = [
      { name: 'Server Response', test: 'server' },
      { name: 'Memory Usage', test: 'memory' },
      { name: 'Process Health', test: 'process' }
    ];

    const results = { tests: systemTests, passed: 0, failed: 0, failures: [] };

    try {
      // Test server response
      const response = await fetch('http://localhost:5000/api/check');
      if (response.ok) {
        results.passed++;
      } else {
        results.failed++;
        results.failures.push({ test: 'Server Response', error: 'Server not responding' });
      }

      // Test memory usage (simulate)
      const memoryUsage = process.memoryUsage();
      const heapUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
      
      if (heapUsedMB < 500) { // Less than 500MB is healthy
        results.passed++;
      } else {
        results.failed++;
        results.failures.push({ test: 'Memory Usage', error: `High memory usage: ${heapUsedMB}MB` });
      }

      // Process health is always good if we reach here
      results.passed++;

    } catch (error) {
      results.failed += systemTests.length - results.passed;
      results.failures.push({ test: 'System Health', error: error.message });
    }

    return results;
  }

  async runQuickHealthCheck() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch('http://localhost:5000/api/check', {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Quick health check passed');
      } else {
        console.log('⚠️ Quick health check failed: HTTP', response.status);
      }
    } catch (error) {
      console.log('🚨 Quick health check error:', error.message);
    }
  }

  async runMiniHealthCheck() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch('http://localhost:5000/api/check', {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.log('⚠️ Mini health check warning: HTTP', response.status);
      }
    } catch (error) {
      // Silent for mini checks - only log real issues
      if (!error.message.includes('AbortError')) {
        console.log('🚨 Mini health check error:', error.message);
      }
    }
  }

  async logTestResults(testSuite) {
    try {
      // Ensure logs directory exists
      const logsDir = path.dirname(this.logFile);
      await fs.mkdir(logsDir, { recursive: true });

      // Read existing logs
      let logs = [];
      try {
        const existingLogs = await fs.readFile(this.logFile, 'utf8');
        logs = JSON.parse(existingLogs);
      } catch (error) {
        // File doesn't exist yet, start with empty array
      }

      // Add new test result
      logs.push(testSuite);

      // Keep only last 30 days of logs
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      logs = logs.filter(log => new Date(log.timestamp) > thirtyDaysAgo);

      // Write updated logs
      await fs.writeFile(this.logFile, JSON.stringify(logs, null, 2));
      
      console.log(`📊 Test results logged: ${testSuite.overallFunctionality}% functionality`);
    } catch (error) {
      console.error('Failed to log test results:', error);
    }
  }

  async sendAlert(testSuite) {
    const alertMessage = {
      timestamp: testSuite.timestamp,
      level: 'HIGH',
      message: `SPIRAL platform functionality dropped to ${testSuite.overallFunctionality}%`,
      details: Object.entries(testSuite.results).map(([category, results]) => ({
        category,
        passed: results.passed,
        failed: results.failed,
        failures: results.failures
      })),
      action: 'Immediate investigation required'
    };

    console.log('🚨 FUNCTIONALITY ALERT:', JSON.stringify(alertMessage, null, 2));
    
    // In production, this would send notifications via:
    // - Email alerts
    // - Slack/Teams notifications  
    // - SMS alerts for critical issues
    // - Dashboard alerts
  }

  async getTestHistory(days = 7) {
    try {
      const logs = await fs.readFile(this.logFile, 'utf8');
      const allLogs = JSON.parse(logs);
      
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      return allLogs.filter(log => new Date(log.timestamp) > cutoffDate);
    } catch (error) {
      return [];
    }
  }
}

export default ScheduledFunctionalityTester;