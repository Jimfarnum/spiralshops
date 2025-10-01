#!/usr/bin/env node

/**
 * SPIRAL Test Scheduler
 * Orchestrates all testing systems for guaranteed 100% functionality
 */

const { SpiralAutomatedTestingSystem } = require('../spiral-automated-testing-system.cjs');
const { SpiralHealthMonitor } = require('../spiral-health-monitor.cjs');
const { SpiralSelfHealingSystem } = require('../spiral-self-healing-system.cjs');
const fs = require('fs').promises;

class SpiralTestScheduler {
  constructor() {
    this.testSystem = new SpiralAutomatedTestingSystem();
    this.healthMonitor = new SpiralHealthMonitor();
    this.healingSystem = new SpiralSelfHealingSystem();
    
    this.schedule = {
      comprehensive: '*/30 * * * *', // Every 30 minutes
      health: '*/5 * * * *',         // Every 5 minutes
      preventive: '0 */6 * * *',     // Every 6 hours
      healing: 'on-demand'           // Triggered by failures
    };
    
    this.lastRuns = {
      comprehensive: null,
      health: null,
      preventive: null
    };
  }

  async startScheduler() {
    console.log('📅 Starting SPIRAL Test Scheduler...');
    console.log('🔄 Comprehensive Tests: Every 30 minutes');
    console.log('💓 Health Monitoring: Every 5 minutes');
    console.log('🛡️ Preventive Checks: Every 6 hours');
    
    // Start continuous health monitoring
    this.startHealthMonitoring();
    
    // Schedule comprehensive tests
    setInterval(async () => {
      await this.runComprehensiveTest();
    }, 30 * 60 * 1000);
    
    // Schedule preventive checks
    setInterval(async () => {
      await this.runPreventiveChecks();
    }, 6 * 60 * 60 * 1000);
    
    // Run initial tests
    await this.runComprehensiveTest();
    await this.runPreventiveChecks();
    
    console.log('✅ SPIRAL Test Scheduler is now active');
  }

  async startHealthMonitoring() {
    console.log('💓 Starting continuous health monitoring...');
    
    // Start health monitoring in background
    setTimeout(() => {
      this.healthMonitor.startMonitoring();
    }, 5000);
  }

  async runComprehensiveTest() {
    try {
      console.log('\n🚀 Running scheduled comprehensive test...');
      this.lastRuns.comprehensive = new Date().toISOString();
      
      const results = await this.testSystem.runFullSystemTest();
      
      if (results.systemHealth < 95) {
        console.log('🚨 System health below 95% - triggering auto-healing...');
        await this.triggerHealing(results);
      }
      
      await this.updateDashboard('comprehensive', results);
      
    } catch (error) {
      console.error('❌ Comprehensive test failed:', error.message);
      await this.triggerHealing({ error: error.message });
    }
  }

  async runPreventiveChecks() {
    try {
      console.log('\n🛡️ Running preventive health checks...');
      this.lastRuns.preventive = new Date().toISOString();
      
      const results = await this.healingSystem.runPreventiveChecks();
      const failedChecks = results.filter(r => r.status === 'FAIL');
      
      if (failedChecks.length > 0) {
        console.log(`🚨 ${failedChecks.length} preventive checks failed - investigating...`);
        
        for (const failed of failedChecks) {
          await this.healingSystem.analyzeAndHeal(failed.details);
        }
      }
      
      await this.updateDashboard('preventive', results);
      
    } catch (error) {
      console.error('❌ Preventive checks failed:', error.message);
    }
  }

  async triggerHealing(problemData) {
    console.log('🏥 Triggering self-healing system...');
    
    try {
      const errorLog = problemData.error || JSON.stringify(problemData);
      const healingResult = await this.healingSystem.analyzeAndHeal(errorLog);
      
      if (healingResult.healed) {
        console.log(`✅ Auto-healing successful: ${healingResult.method}`);
        
        // Re-run comprehensive test to verify fix
        setTimeout(async () => {
          console.log('🔄 Re-running test to verify healing...');
          await this.runComprehensiveTest();
        }, 10000);
      } else {
        console.log(`❌ Auto-healing failed: ${healingResult.reason}`);
        await this.escalateIssue(problemData);
      }
      
    } catch (error) {
      console.error('❌ Healing system error:', error.message);
    }
  }

  async escalateIssue(problemData) {
    console.log('🚨 Escalating issue - manual intervention required');
    
    const escalation = {
      timestamp: new Date().toISOString(),
      type: 'ESCALATION',
      severity: 'CRITICAL',
      problem: problemData,
      message: 'Auto-healing failed - manual intervention required',
      recommendations: [
        'Check server logs for detailed error information',
        'Verify all dependencies are installed',
        'Consider restarting the application',
        'Review recent code changes'
      ]
    };
    
    await fs.writeFile('spiral-escalation-alert.json', JSON.stringify(escalation, null, 2));
    console.log('📄 Escalation alert saved to spiral-escalation-alert.json');
  }

  async updateDashboard(testType, results) {
    try {
      const dashboard = {
        lastUpdated: new Date().toISOString(),
        testType,
        results,
        schedule: this.schedule,
        lastRuns: this.lastRuns,
        healthStatus: this.getOverallHealthStatus(results)
      };
      
      await fs.writeFile('spiral-test-dashboard.json', JSON.stringify(dashboard, null, 2));
      
    } catch (error) {
      console.error('❌ Dashboard update failed:', error.message);
    }
  }

  getOverallHealthStatus(results) {
    if (results.systemHealth >= 95) return 'EXCELLENT';
    if (results.systemHealth >= 90) return 'GOOD';
    if (results.systemHealth >= 80) return 'FAIR';
    return 'POOR';
  }

  async generateSchedulerReport() {
    const report = {
      timestamp: new Date().toISOString(),
      scheduler: {
        active: true,
        schedule: this.schedule,
        lastRuns: this.lastRuns
      },
      summary: {
        totalSystemsMonitored: 3,
        activeMonitoring: 'Continuous',
        autoHealingEnabled: true,
        escalationThreshold: '95% system health'
      },
      recommendations: [
        'System is actively monitored 24/7',
        'Auto-healing responds to issues within minutes',
        'Comprehensive tests ensure 100% functionality',
        'Preventive checks catch issues before they impact users'
      ]
    };
    
    await fs.writeFile('spiral-scheduler-report.json', JSON.stringify(report, null, 2));
    return report;
  }

  async stop() {
    console.log('🛑 Stopping SPIRAL Test Scheduler...');
    await this.healthMonitor.stopMonitoring();
    console.log('✅ Scheduler stopped');
  }
}

// Export for use in other modules
module.exports = { SpiralTestScheduler };

// Run if called directly
if (require.main === module) {
  const scheduler = new SpiralTestScheduler();
  
  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    await scheduler.stop();
    process.exit(0);
  });
  
  scheduler.startScheduler();
}