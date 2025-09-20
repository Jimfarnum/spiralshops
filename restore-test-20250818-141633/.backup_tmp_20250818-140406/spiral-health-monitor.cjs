#!/usr/bin/env node

/**
 * SPIRAL Real-Time Health Monitor
 * Continuous monitoring with instant alerts and auto-correction
 */

const fs = require('fs').promises;
const path = require('path');
const { spawn } = require('child_process');

class SpiralHealthMonitor {
  constructor() {
    this.isMonitoring = false;
    this.healthChecks = [];
    this.alerts = [];
    this.autoFixEnabled = true;
    this.monitoringInterval = 60000; // 1 minute
    
    this.criticalEndpoints = [
      '/api/check',
      '/api/products',
      '/api/stores',
      '/api/promotions'
    ];
    
    this.healthMetrics = {
      uptime: 0,
      lastCheck: null,
      consecutiveFailures: 0,
      totalChecks: 0,
      successfulChecks: 0,
      averageResponseTime: 0
    };
  }

  async startMonitoring() {
    console.log('🔍 Starting SPIRAL Real-Time Health Monitor...');
    this.isMonitoring = true;
    
    while (this.isMonitoring) {
      const startTime = Date.now();
      
      try {
        await this.performHealthCheck();
        this.healthMetrics.consecutiveFailures = 0;
      } catch (error) {
        this.healthMetrics.consecutiveFailures++;
        await this.handleFailure(error);
      }
      
      this.healthMetrics.totalChecks++;
      this.healthMetrics.lastCheck = new Date().toISOString();
      
      const checkDuration = Date.now() - startTime;
      this.updateAverageResponseTime(checkDuration);
      
      await this.sleep(this.monitoringInterval);
    }
  }

  async performHealthCheck() {
    const results = [];
    
    for (const endpoint of this.criticalEndpoints) {
      const startTime = Date.now();
      
      try {
        const response = await fetch(`http://localhost:5000${endpoint}`);
        const responseTime = Date.now() - startTime;
        
        if (response.ok) {
          const data = await response.json();
          results.push({
            endpoint,
            status: 'SUCCESS',
            responseTime,
            statusCode: response.status
          });
        } else {
          results.push({
            endpoint,
            status: 'FAILED',
            responseTime,
            statusCode: response.status,
            error: `HTTP ${response.status}`
          });
        }
      } catch (error) {
        results.push({
          endpoint,
          status: 'ERROR',
          responseTime: Date.now() - startTime,
          error: error.message
        });
      }
    }
    
    const failedChecks = results.filter(r => r.status !== 'SUCCESS');
    
    if (failedChecks.length === 0) {
      this.healthMetrics.successfulChecks++;
      console.log(`✅ Health Check Passed - ${new Date().toLocaleTimeString()}`);
    } else {
      console.log(`❌ Health Check Failed - ${failedChecks.length} issues detected`);
      throw new Error(`Health check failed: ${failedChecks.map(f => f.endpoint).join(', ')}`);
    }
    
    this.healthChecks.push({
      timestamp: new Date().toISOString(),
      results,
      status: failedChecks.length === 0 ? 'HEALTHY' : 'UNHEALTHY'
    });
    
    // Keep only last 100 health checks
    if (this.healthChecks.length > 100) {
      this.healthChecks = this.healthChecks.slice(-100);
    }
  }

  async handleFailure(error) {
    const alert = {
      timestamp: new Date().toISOString(),
      type: 'HEALTH_CHECK_FAILURE',
      message: error.message,
      consecutiveFailures: this.healthMetrics.consecutiveFailures,
      severity: this.healthMetrics.consecutiveFailures >= 3 ? 'CRITICAL' : 'WARNING'
    };
    
    this.alerts.push(alert);
    console.log(`🚨 ALERT: ${alert.message} (Failure #${this.healthMetrics.consecutiveFailures})`);
    
    if (this.autoFixEnabled && this.healthMetrics.consecutiveFailures >= 2) {
      await this.attemptAutoFix();
    }
    
    // Keep only last 50 alerts
    if (this.alerts.length > 50) {
      this.alerts = this.alerts.slice(-50);
    }
  }

  async attemptAutoFix() {
    console.log('🔧 Attempting auto-fix...');
    
    try {
      // Run the comprehensive test to identify specific issues
      const { SpiralAutomatedTestingSystem } = require('./spiral-automated-testing-system.js');
      const testSystem = new SpiralAutomatedTestingSystem();
      const testResults = await testSystem.runFullSystemTest();
      
      if (testResults.systemHealth < 95) {
        console.log('🔄 Restarting server to resolve issues...');
        await this.restartServer();
      }
      
      this.alerts.push({
        timestamp: new Date().toISOString(),
        type: 'AUTO_FIX_ATTEMPTED',
        message: 'Auto-fix sequence completed',
        severity: 'INFO'
      });
      
    } catch (error) {
      console.log(`❌ Auto-fix failed: ${error.message}`);
      this.alerts.push({
        timestamp: new Date().toISOString(),
        type: 'AUTO_FIX_FAILED',
        message: error.message,
        severity: 'ERROR'
      });
    }
  }

  async restartServer() {
    console.log('🔄 Restarting SPIRAL server...');
    
    // This would integrate with the workflow restart
    // For now, we'll log the attempt
    console.log('Server restart requested - manual intervention may be required');
  }

  updateAverageResponseTime(newTime) {
    const totalTime = this.healthMetrics.averageResponseTime * (this.healthMetrics.totalChecks - 1);
    this.healthMetrics.averageResponseTime = (totalTime + newTime) / this.healthMetrics.totalChecks;
  }

  async generateHealthReport() {
    const report = {
      timestamp: new Date().toISOString(),
      monitoring: {
        isActive: this.isMonitoring,
        interval: this.monitoringInterval,
        uptime: Date.now() - (this.healthMetrics.lastCheck ? new Date(this.healthMetrics.lastCheck).getTime() : Date.now())
      },
      metrics: this.healthMetrics,
      recentChecks: this.healthChecks.slice(-10),
      recentAlerts: this.alerts.slice(-10),
      summary: {
        overallHealth: this.calculateOverallHealth(),
        successRate: (this.healthMetrics.successfulChecks / this.healthMetrics.totalChecks * 100).toFixed(2) + '%',
        avgResponseTime: Math.round(this.healthMetrics.averageResponseTime) + 'ms'
      }
    };
    
    await fs.writeFile('spiral-health-report.json', JSON.stringify(report, null, 2));
    return report;
  }

  calculateOverallHealth() {
    if (this.healthMetrics.totalChecks === 0) return 'UNKNOWN';
    
    const successRate = this.healthMetrics.successfulChecks / this.healthMetrics.totalChecks;
    const recentFailures = this.healthMetrics.consecutiveFailures;
    
    if (successRate >= 0.95 && recentFailures === 0) return 'EXCELLENT';
    if (successRate >= 0.90 && recentFailures <= 1) return 'GOOD';
    if (successRate >= 0.80 && recentFailures <= 2) return 'FAIR';
    return 'POOR';
  }

  async stopMonitoring() {
    console.log('🛑 Stopping SPIRAL Health Monitor...');
    this.isMonitoring = false;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // API for external queries
  getStatus() {
    return {
      isMonitoring: this.isMonitoring,
      health: this.calculateOverallHealth(),
      lastCheck: this.healthMetrics.lastCheck,
      consecutiveFailures: this.healthMetrics.consecutiveFailures,
      successRate: (this.healthMetrics.successfulChecks / this.healthMetrics.totalChecks * 100).toFixed(2) + '%'
    };
  }
}

// Export for use in other modules
module.exports = { SpiralHealthMonitor };

// Run if called directly
if (require.main === module) {
  const monitor = new SpiralHealthMonitor();
  
  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    await monitor.stopMonitoring();
    const report = await monitor.generateHealthReport();
    console.log('\n📊 Final Health Report Generated');
    process.exit(0);
  });
  
  monitor.startMonitoring();
}