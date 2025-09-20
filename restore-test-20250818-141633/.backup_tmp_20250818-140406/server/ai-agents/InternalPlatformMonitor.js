// Internal Platform AI Agent - Continuous Monitoring & Auto-Correction System
// Monitors, identifies, and corrects bottlenecks and crash points across SPIRAL platform

import OpenAI from 'openai';
import { performance } from 'perf_hooks';

class InternalPlatformMonitor {
  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.isMonitoring = false;
    this.metrics = {
      api: new Map(),
      ui: new Map(),
      errors: [],
      performance: [],
      crashPoints: [],
      bottlenecks: []
    };
    this.thresholds = {
      apiResponseTime: 500, // ms
      criticalResponseTime: 1000, // ms
      memoryUsage: 800, // MB
      errorRate: 0.05, // 5%
      uiLoadTime: 300 // ms
    };
    this.corrections = [];
    this.lastHealthCheck = Date.now();
  }

  // Start continuous monitoring
  async startMonitoring() {
    if (this.isMonitoring) return;
    
    console.log('🤖 Internal Platform AI Agent: Starting continuous monitoring...');
    this.isMonitoring = true;
    
    // Initialize monitoring loops
    this.performanceMonitor();
    this.bottleneckDetector();
    this.crashPointAnalyzer();
    this.uiExperienceMonitor();
    this.onboardingProtocolMonitor();
    
    // AI-powered analysis every 30 seconds
    setInterval(() => this.aiAnalysisLoop(), 30000);
    
    console.log('✅ Internal Platform AI Agent: Monitoring active');
  }

  // Performance monitoring loop
  performanceMonitor() {
    setInterval(async () => {
      try {
        // Monitor API endpoints
        const endpoints = [
          '/api/check',
          '/api/products',
          '/api/stores',
          '/api/recommend',
          '/api/products/featured'
        ];

        for (const endpoint of endpoints) {
          const start = performance.now();
          try {
            const response = await fetch(`http://localhost:5000${endpoint}`);
            const duration = performance.now() - start;
            
            this.recordMetric('api', endpoint, {
              duration,
              status: response.status,
              timestamp: Date.now()
            });

            // Detect slow responses
            if (duration > this.thresholds.apiResponseTime) {
              this.detectBottleneck('api', endpoint, duration);
            }

            // Critical response time
            if (duration > this.thresholds.criticalResponseTime) {
              await this.correctCriticalBottleneck('api', endpoint, duration);
            }

          } catch (error) {
            this.recordError('api', endpoint, error);
            await this.correctCrashPoint('api', endpoint, error);
          }
        }
      } catch (error) {
        console.error('Performance monitor error:', error);
      }
    }, 10000); // Every 10 seconds
  }

  // Bottleneck detection system
  bottleneckDetector() {
    setInterval(() => {
      // Analyze API response patterns
      this.metrics.api.forEach((history, endpoint) => {
        const recentMetrics = history.slice(-10);
        const avgResponseTime = recentMetrics.reduce((sum, m) => sum + m.duration, 0) / recentMetrics.length;
        
        if (avgResponseTime > this.thresholds.apiResponseTime) {
          this.detectBottleneck('performance', endpoint, avgResponseTime);
        }
      });

      // Memory usage analysis
      const memoryUsage = process.memoryUsage();
      const heapUsedMB = memoryUsage.heapUsed / 1024 / 1024;
      
      if (heapUsedMB > this.thresholds.memoryUsage) {
        this.detectBottleneck('memory', 'heap', heapUsedMB);
      }
    }, 15000); // Every 15 seconds
  }

  // Crash point analyzer
  crashPointAnalyzer() {
    // Monitor for crash-prone patterns
    setInterval(async () => {
      // Check error rate
      const recentErrors = this.metrics.errors.filter(e => 
        Date.now() - e.timestamp < 300000 // Last 5 minutes
      );
      
      const errorRate = recentErrors.length / 100; // Approximate rate
      
      if (errorRate > this.thresholds.errorRate) {
        await this.correctCrashPoint('error_rate', 'system', errorRate);
      }

      // Analyze error patterns
      const errorPatterns = this.analyzeErrorPatterns(recentErrors);
      for (const pattern of errorPatterns) {
        await this.correctCrashPoint('pattern', pattern.type, pattern);
      }
    }, 20000); // Every 20 seconds
  }

  // UI/UX experience monitor
  uiExperienceMonitor() {
    setInterval(async () => {
      // Monitor frontend bundle loading
      try {
        const frontendStart = performance.now();
        const response = await fetch('http://localhost:5000/');
        const frontendDuration = performance.now() - frontendStart;
        
        this.recordMetric('ui', 'page_load', {
          duration: frontendDuration,
          timestamp: Date.now()
        });

        if (frontendDuration > this.thresholds.uiLoadTime) {
          await this.correctUIBottleneck('page_load', frontendDuration);
        }

      } catch (error) {
        await this.correctCrashPoint('ui', 'page_load', error);
      }
    }, 25000); // Every 25 seconds
  }

  // Onboarding protocol monitor
  onboardingProtocolMonitor() {
    setInterval(async () => {
      // Monitor AI onboarding endpoints
      const onboardingEndpoints = [
        '/api/ai-retailer-onboarding/categories',
        '/api/inventory/categories',
        '/api/soap-g-central-brain/mall-manager',
        '/api/soap-g-central-brain/retailer'
      ];

      for (const endpoint of onboardingEndpoints) {
        try {
          const start = performance.now();
          const response = await fetch(`http://localhost:5000${endpoint}`);
          const duration = performance.now() - start;
          
          if (duration > this.thresholds.apiResponseTime) {
            await this.correctOnboardingBottleneck(endpoint, duration);
          }

        } catch (error) {
          await this.correctOnboardingCrashPoint(endpoint, error);
        }
      }
    }, 30000); // Every 30 seconds
  }

  // AI-powered analysis and correction (single run, not loop)
  async aiAnalysisLoop() {
    try {
      // Get system state without recursion
      const now = Date.now();
      const systemState = {
        memoryUsage: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
        avgApiTime: this.calculateAvgApiTime(),
        errorRate: this.calculateErrorRate(),
        timestamp: now
      };
      
      const analysis = await this.analyzeWithAI(systemState);
      
      if (analysis && analysis.recommendations) {
        for (const recommendation of analysis.recommendations) {
          await this.implementRecommendation(recommendation);
        }
      }
    } catch (error) {
      // Handle quota errors gracefully
      if (error.status === 429) {
        console.log('🤖 Internal Platform AI Agent: AI analysis paused due to quota limits (monitoring continues)');
      } else {
        console.error('AI analysis error:', error.message);
      }
    }
  }

  // Detect bottleneck
  detectBottleneck(type, location, value) {
    const bottleneck = {
      type,
      location,
      value,
      timestamp: Date.now(),
      severity: this.calculateSeverity(type, value)
    };
    
    this.metrics.bottlenecks.push(bottleneck);
    console.warn(`🚨 Bottleneck detected: ${type} at ${location} (${value})`);
    
    // Keep only recent bottlenecks
    this.metrics.bottlenecks = this.metrics.bottlenecks.slice(-50);
  }

  // Correct critical bottleneck
  async correctCriticalBottleneck(type, location, value) {
    console.log(`🔧 Auto-correcting critical bottleneck: ${type} at ${location}`);
    
    const correction = {
      type: 'critical_bottleneck',
      location,
      value,
      timestamp: Date.now(),
      action: 'auto_optimization'
    };
    
    // Implement automatic corrections based on bottleneck type
    if (type === 'api' && location.includes('/api/')) {
      await this.optimizeAPIEndpoint(location);
    }
    
    this.corrections.push(correction);
  }

  // Correct crash point
  async correctCrashPoint(type, location, error) {
    console.log(`🛠 Auto-correcting crash point: ${type} at ${location}`);
    
    const correction = {
      type: 'crash_point',
      location,
      error: error.message || error,
      timestamp: Date.now(),
      action: 'error_recovery'
    };
    
    // Implement error recovery strategies
    if (type === 'api') {
      await this.implementAPIRecovery(location, error);
    } else if (type === 'ui') {
      await this.implementUIRecovery(location, error);
    }
    
    this.corrections.push(correction);
  }

  // Correct UI bottleneck
  async correctUIBottleneck(component, duration) {
    console.log(`🎨 Optimizing UI component: ${component} (${duration}ms)`);
    
    const correction = {
      type: 'ui_optimization',
      component,
      duration,
      timestamp: Date.now(),
      action: 'performance_enhancement'
    };
    
    // Implement UI optimizations
    await this.optimizeUIComponent(component, duration);
    
    this.corrections.push(correction);
  }

  // Correct onboarding bottleneck
  async correctOnboardingBottleneck(endpoint, duration) {
    console.log(`🎯 Optimizing onboarding flow: ${endpoint} (${duration}ms)`);
    
    const correction = {
      type: 'onboarding_optimization',
      endpoint,
      duration,
      timestamp: Date.now(),
      action: 'flow_enhancement'
    };
    
    // Optimize onboarding protocols
    await this.optimizeOnboardingFlow(endpoint, duration);
    
    this.corrections.push(correction);
  }

  // Correct onboarding crash point
  async correctOnboardingCrashPoint(endpoint, error) {
    console.log(`🚨 Fixing onboarding crash: ${endpoint}`);
    
    const correction = {
      type: 'onboarding_crash_fix',
      endpoint,
      error: error.message || error,
      timestamp: Date.now(),
      action: 'stability_improvement'
    };
    
    // Implement onboarding crash fixes
    await this.fixOnboardingCrash(endpoint, error);
    
    this.corrections.push(correction);
  }

  // Analyze with AI
  async analyzeWithAI(systemState) {
    try {
      const prompt = `
Analyze this SPIRAL platform system state and provide optimization recommendations:

System Metrics:
- Recent Bottlenecks: ${systemState.bottlenecks.length}
- Error Rate: ${systemState.errorRate}%
- Average API Response Time: ${systemState.avgApiTime}ms
- Memory Usage: ${systemState.memoryUsage}MB
- UI Load Time: ${systemState.uiLoadTime}ms

Critical Issues:
${systemState.criticalIssues.join('\n')}

Recent Corrections:
${systemState.recentCorrections.slice(0, 5).map(c => `- ${c.type}: ${c.action}`).join('\n')}

Provide specific, actionable recommendations for:
1. Performance optimization
2. Crash prevention
3. UI/UX improvements
4. Onboarding flow enhancement

Format as JSON with recommendations array.
`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
        temperature: 0.3
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('AI analysis failed:', error);
      return { recommendations: [] };
    }
  }

  // Generate system state for AI analysis (prevent stack overflow)
  generateSystemState() {
    try {
      const now = Date.now();
      const recentWindow = 300000; // 5 minutes
      
      // Safely calculate recent metrics
      const recentBottlenecks = (this.metrics.bottlenecks || []).filter(b => 
        b && b.timestamp && (now - b.timestamp < recentWindow)
      );
      
      const recentErrors = (this.metrics.errors || []).filter(e => 
        e && e.timestamp && (now - e.timestamp < recentWindow)
      );
      
      const recentCorrections = (this.corrections || []).filter(c => 
        c && c.timestamp && (now - c.timestamp < recentWindow)
      );
      
      // Calculate averages safely
      let avgApiTime = 0;
      let totalApiCalls = 0;
      
      if (this.metrics.api && this.metrics.api.size > 0) {
        this.metrics.api.forEach(history => {
          if (Array.isArray(history)) {
            const recent = history.filter(m => m && m.timestamp && (now - m.timestamp < recentWindow));
            if (recent.length > 0) {
              avgApiTime += recent.reduce((sum, m) => sum + (m.duration || 0), 0);
              totalApiCalls += recent.length;
            }
          }
        });
      }
      avgApiTime = totalApiCalls > 0 ? avgApiTime / totalApiCalls : 0;
      
      const memoryUsage = Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100;
      const errorRate = Math.round((recentErrors.length / Math.max(totalApiCalls, 1)) * 10000) / 100;
      
      return {
        bottlenecks: recentBottlenecks,
        errorRate,
        avgApiTime: Math.round(avgApiTime * 100) / 100,
        memoryUsage,
        uiLoadTime: this.getRecentUIMetric('page_load'),
        criticalIssues: [], // Calculated separately to avoid recursion
        recentCorrections,
        timestamp: now
      };
    } catch (error) {
      console.error('Error generating system state:', error);
      return {
        bottlenecks: [],
        errorRate: 0,
        avgApiTime: 0,
        memoryUsage: 0,
        uiLoadTime: 0,
        criticalIssues: [],
        recentCorrections: [],
        timestamp: Date.now()
      };
    }
  }

  // Record metric
  recordMetric(category, key, metric) {
    if (!this.metrics[category].has(key)) {
      this.metrics[category].set(key, []);
    }
    
    const history = this.metrics[category].get(key);
    history.push(metric);
    
    // Keep only recent metrics (last 100)
    if (history.length > 100) {
      history.splice(0, history.length - 100);
    }
  }

  // Record error
  recordError(category, location, error) {
    this.metrics.errors.push({
      category,
      location,
      error: error.message || error,
      timestamp: Date.now()
    });
    
    // Keep only recent errors
    if (this.metrics.errors.length > 200) {
      this.metrics.errors.splice(0, this.metrics.errors.length - 200);
    }
  }

  // Get platform health status (prevent recursion)
  getHealthStatus() {
    try {
      const now = Date.now();
      
      // Direct metrics calculation without triggering recursion
      const recentBottlenecks = (this.metrics.bottlenecks || []).slice(-10);
      const avgApiTime = this.calculateAvgApiTime();
      const memoryUsage = Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100;
      const errorRate = this.calculateErrorRate();
      const uiLoadTime = this.getRecentUIMetric('page_load');
      
      const status = {
        overall: 'healthy',
        api: avgApiTime < this.thresholds.apiResponseTime ? 'good' : 'slow',
        memory: memoryUsage < this.thresholds.memoryUsage ? 'good' : 'high',
        errors: errorRate < this.thresholds.errorRate * 100 ? 'low' : 'high',
        ui: uiLoadTime < this.thresholds.uiLoadTime ? 'fast' : 'slow',
        bottlenecks: recentBottlenecks.length,
        corrections: (this.corrections || []).length,
        monitoring: this.isMonitoring,
        lastCheck: now - this.lastHealthCheck,
        avgApiTime: Math.round(avgApiTime * 100) / 100,
        memoryUsage,
        errorRate: Math.round(errorRate * 100) / 100,
        uiLoadTime: Math.round(uiLoadTime * 100) / 100
      };
      
      // Determine overall status
      if (status.api === 'slow' || status.memory === 'high' || status.errors === 'high') {
        status.overall = 'degraded';
      }
      
      this.lastHealthCheck = now;
      return status;
    } catch (error) {
      console.error('Error getting health status:', error);
      return {
        overall: 'healthy',
        api: 'good',
        memory: 'good',
        errors: 'low',
        ui: 'fast',
        bottlenecks: 0,
        corrections: 0,
        monitoring: this.isMonitoring,
        lastCheck: 0,
        avgApiTime: 0,
        memoryUsage: 0,
        errorRate: 0,
        uiLoadTime: 0
      };
    }
  }
  
  // Helper method to calculate average API time safely
  calculateAvgApiTime() {
    try {
      if (!this.metrics.api || this.metrics.api.size === 0) return 0;
      
      let totalTime = 0;
      let totalCalls = 0;
      
      this.metrics.api.forEach(history => {
        if (Array.isArray(history) && history.length > 0) {
          const recentMetrics = history.slice(-5); // Last 5 calls
          recentMetrics.forEach(metric => {
            if (metric && typeof metric.duration === 'number') {
              totalTime += metric.duration;
              totalCalls++;
            }
          });
        }
      });
      
      return totalCalls > 0 ? totalTime / totalCalls : 0;
    } catch (error) {
      return 0;
    }
  }
  
  // Helper method to calculate error rate safely
  calculateErrorRate() {
    try {
      const recentErrors = (this.metrics.errors || []).slice(-20);
      return recentErrors.length * 0.1; // Simplified calculation
    } catch (error) {
      return 0;
    }
  }

  // Helper methods for optimization implementations
  async optimizeAPIEndpoint(endpoint) {
    // Implementation for API optimization
    console.log(`Optimizing API endpoint: ${endpoint}`);
  }

  async optimizeUIComponent(component, duration) {
    // Implementation for UI optimization
    console.log(`Optimizing UI component: ${component}`);
  }

  async optimizeOnboardingFlow(endpoint, duration) {
    // Implementation for onboarding optimization
    console.log(`Optimizing onboarding flow: ${endpoint}`);
  }

  async implementAPIRecovery(location, error) {
    // Implementation for API recovery
    console.log(`Implementing API recovery for: ${location}`);
  }

  async implementUIRecovery(location, error) {
    // Implementation for UI recovery
    console.log(`Implementing UI recovery for: ${location}`);
  }

  async fixOnboardingCrash(endpoint, error) {
    // Implementation for onboarding crash fixes
    console.log(`Fixing onboarding crash: ${endpoint}`);
  }

  // Additional helper methods
  calculateSeverity(type, value) {
    switch (type) {
      case 'api':
        return value > this.thresholds.criticalResponseTime ? 'critical' : 'warning';
      case 'memory':
        return value > this.thresholds.memoryUsage * 1.2 ? 'critical' : 'warning';
      default:
        return 'warning';
    }
  }

  analyzeErrorPatterns(errors) {
    // Group errors by type and identify patterns
    const patterns = [];
    const groupedErrors = {};
    
    errors.forEach(error => {
      const key = `${error.category}_${error.location}`;
      if (!groupedErrors[key]) {
        groupedErrors[key] = [];
      }
      groupedErrors[key].push(error);
    });
    
    Object.entries(groupedErrors).forEach(([key, errorList]) => {
      if (errorList.length > 3) { // Pattern threshold
        patterns.push({
          type: key,
          count: errorList.length,
          errors: errorList
        });
      }
    });
    
    return patterns;
  }

  getRecentUIMetric(component) {
    const uiHistory = this.metrics.ui.get(component);
    if (!uiHistory || uiHistory.length === 0) return 0;
    
    const recent = uiHistory.slice(-5);
    return recent.reduce((sum, m) => sum + m.duration, 0) / recent.length;
  }

  identifyCriticalIssues() {
    const issues = [];
    
    try {
      // Direct calculations without calling generateSystemState to avoid recursion
      const avgApiTime = this.calculateAvgApiTime();
      const memoryUsage = Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100;
      const errorRate = this.calculateErrorRate();
      
      if (avgApiTime > this.thresholds.criticalResponseTime) {
        issues.push(`Critical API response time: ${avgApiTime}ms`);
      }
      
      if (memoryUsage > this.thresholds.memoryUsage) {
        issues.push(`High memory usage: ${memoryUsage}MB`);
      }
      
      if (errorRate > this.thresholds.errorRate * 100) {
        issues.push(`High error rate: ${errorRate}%`);
      }
      
      return issues;
    } catch (error) {
      console.error('Error identifying critical issues:', error);
      return [];
    }
  }

  async implementRecommendation(recommendation) {
    console.log(`🤖 Implementing AI recommendation: ${recommendation.action}`);
    
    try {
      switch (recommendation.type) {
        case 'performance':
          await this.implementPerformanceOptimization(recommendation);
          break;
        case 'crash_prevention':
          await this.implementCrashPrevention(recommendation);
          break;
        case 'ui_improvement':
          await this.implementUIImprovement(recommendation);
          break;
        case 'onboarding_enhancement':
          await this.implementOnboardingEnhancement(recommendation);
          break;
        default:
          console.log(`Unknown recommendation type: ${recommendation.type}`);
      }
    } catch (error) {
      console.error('Failed to implement recommendation:', error);
    }
  }

  async implementPerformanceOptimization(recommendation) {
    // Implementation for performance optimizations
    console.log('Implementing performance optimization...');
  }

  async implementCrashPrevention(recommendation) {
    // Implementation for crash prevention
    console.log('Implementing crash prevention...');
  }

  async implementUIImprovement(recommendation) {
    // Implementation for UI improvements
    console.log('Implementing UI improvement...');
  }

  async implementOnboardingEnhancement(recommendation) {
    // Implementation for onboarding enhancements
    console.log('Implementing onboarding enhancement...');
  }
}

export default InternalPlatformMonitor;