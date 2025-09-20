#!/usr/bin/env node

/**
 * SPIRAL Memory Monitor
 * Real-time memory usage monitoring and alerts
 */

import { execSync } from 'child_process';

console.log('🔍 SPIRAL Memory Monitor - Starting...');

class MemoryMonitor {
  constructor() {
    this.isMonitoring = false;
    this.alertThreshold = 80; // Alert at 80% memory usage
    this.checkInterval = 5000; // Check every 5 seconds
  }

  getCurrentMemoryUsage() {
    const usage = process.memoryUsage();
    
    try {
      const systemMem = execSync('free | grep Mem', { encoding: 'utf8' });
      const memData = systemMem.trim().split(/\s+/);
      const total = parseInt(memData[1]);
      const used = parseInt(memData[2]);
      const systemUsagePercent = Math.round((used / total) * 100);
      
      return {
        node: {
          rss: Math.round(usage.rss / 1024 / 1024),
          heapUsed: Math.round(usage.heapUsed / 1024 / 1024),
          heapTotal: Math.round(usage.heapTotal / 1024 / 1024),
          external: Math.round(usage.external / 1024 / 1024)
        },
        system: {
          total: Math.round(total / 1024 / 1024),
          used: Math.round(used / 1024 / 1024),
          usagePercent: systemUsagePercent
        }
      };
    } catch (error) {
      return {
        node: {
          rss: Math.round(usage.rss / 1024 / 1024),
          heapUsed: Math.round(usage.heapUsed / 1024 / 1024),
          heapTotal: Math.round(usage.heapTotal / 1024 / 1024),
          external: Math.round(usage.external / 1024 / 1024)
        },
        system: null
      };
    }
  }

  checkMemoryHealth() {
    const mem = this.getCurrentMemoryUsage();
    const timestamp = new Date().toLocaleTimeString();
    
    console.log(`[${timestamp}] Node: ${mem.node.heapUsed}MB heap, ${mem.node.rss}MB RSS`);
    
    if (mem.system) {
      console.log(`[${timestamp}] System: ${mem.system.used}MB / ${mem.system.total}MB (${mem.system.usagePercent}%)`);
      
      if (mem.system.usagePercent > this.alertThreshold) {
        console.log(`🚨 [${timestamp}] HIGH MEMORY USAGE: ${mem.system.usagePercent}%`);
        this.triggerMemoryOptimization();
      }
    }
    
    // Alert if Node.js heap is over 1GB
    if (mem.node.heapUsed > 1024) {
      console.log(`⚠️ [${timestamp}] Node.js heap usage high: ${mem.node.heapUsed}MB`);
    }
    
    return mem;
  }

  triggerMemoryOptimization() {
    console.log('🔧 Triggering emergency memory optimization...');
    
    if (global.gc) {
      global.gc();
      console.log('✅ Forced garbage collection');
    }
    
    // Additional optimization could be triggered here
  }

  start() {
    console.log(`📊 Memory monitoring started (checking every ${this.checkInterval/1000}s)`);
    console.log(`🚨 Alert threshold: ${this.alertThreshold}% system memory`);
    
    this.isMonitoring = true;
    
    const monitorLoop = () => {
      if (!this.isMonitoring) return;
      
      try {
        this.checkMemoryHealth();
      } catch (error) {
        console.error(`❌ Monitor error: ${error.message}`);
      }
      
      setTimeout(monitorLoop, this.checkInterval);
    };
    
    monitorLoop();
  }

  stop() {
    this.isMonitoring = false;
    console.log('🛑 Memory monitoring stopped');
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n📊 Memory monitoring session ended');
  process.exit(0);
});

// Start monitoring if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const monitor = new MemoryMonitor();
  monitor.start();
}

export { MemoryMonitor };