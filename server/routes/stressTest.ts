import { Router } from "express";
import { performance } from 'perf_hooks';

const router = Router();

// Stress test configuration
interface StressTestConfig {
  concurrent: number;
  duration: number; // milliseconds
  endpoints: string[];
  rampUp: boolean;
}

// Performance metrics tracking
interface TestMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  maxResponseTime: number;
  minResponseTime: number;
  requestsPerSecond: number;
  errorRate: number;
  memoryUsage: NodeJS.MemoryUsage;
  cpuUsage: number;
}

// Critical system endpoints to stress test
const CRITICAL_ENDPOINTS = [
  '/api/products/featured',
  '/api/stores',
  '/api/recommend',
  '/api/mall-events',
  '/api/promotions',
  '/api/retailer/onboard',
  '/api/stripe/status/test',
  '/api/audit/health-check',
  '/api/audit-history/trending-summary',
  '/api/ai-ops/status',
  '/api/system-pre-launch-check',
  '/api/admin-reports/system-summary',
  '/api/legal/terms-status'
];

// Memory and CPU monitoring
function getCPUUsage(): Promise<number> {
  return new Promise((resolve) => {
    const startTime = process.hrtime();
    const startUsage = process.cpuUsage();
    
    setTimeout(() => {
      const elapTime = process.hrtime(startTime);
      const elapUsage = process.cpuUsage(startUsage);
      const elapTimeMS = elapTime[0] * 1000 + elapTime[1] / 1000000;
      const elapUserMS = elapUsage.user / 1000;
      const elapSystMS = elapUsage.system / 1000;
      const cpuPercent = Math.round(100 * (elapUserMS + elapSystMS) / elapTimeMS);
      resolve(cpuPercent);
    }, 100);
  });
}

// Single endpoint stress test
async function stressTestEndpoint(endpoint: string, concurrent: number, duration: number): Promise<any[]> {
  const results: any[] = [];
  const startTime = performance.now();
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? process.env.APP_URL || 'https://spiralshops.com'
    : 'http://localhost:5000';

  console.log(`[Stress Test] Testing ${endpoint} with ${concurrent} concurrent requests for ${duration}ms`);

  const makeRequest = async (): Promise<any> => {
    const requestStart = performance.now();
    try {
      const response = await fetch(`${baseUrl}${endpoint}`);
      const requestEnd = performance.now();
      const responseTime = requestEnd - requestStart;
      
      return {
        success: response.ok,
        status: response.status,
        responseTime,
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      const requestEnd = performance.now();
      return {
        success: false,
        error: error.message,
        responseTime: requestEnd - requestStart,
        timestamp: new Date().toISOString()
      };
    }
  };

  // Run concurrent requests until duration expires
  const promises: Promise<any>[] = [];
  const requestInterval = setInterval(() => {
    if (performance.now() - startTime < duration) {
      for (let i = 0; i < concurrent; i++) {
        promises.push(makeRequest());
      }
    }
  }, 100); // Send batch every 100ms

  // Wait for duration to complete
  await new Promise(resolve => setTimeout(resolve, duration));
  clearInterval(requestInterval);

  // Wait for all pending requests to complete
  const allResults = await Promise.all(promises);
  results.push(...allResults);

  return results;
}

// Calculate performance metrics
function calculateMetrics(results: any[]): TestMetrics {
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  const responseTimes = results.map(r => r.responseTime);
  
  const totalTime = results.length > 0 ? 
    (new Date(results[results.length - 1].timestamp).getTime() - 
     new Date(results[0].timestamp).getTime()) / 1000 : 1;

  return {
    totalRequests: results.length,
    successfulRequests: successful.length,
    failedRequests: failed.length,
    averageResponseTime: responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length || 0,
    maxResponseTime: Math.max(...responseTimes) || 0,
    minResponseTime: Math.min(...responseTimes) || 0,
    requestsPerSecond: results.length / totalTime,
    errorRate: (failed.length / results.length) * 100 || 0,
    memoryUsage: process.memoryUsage(),
    cpuUsage: 0 // Will be updated separately
  };
}

// Comprehensive system stress test
router.post("/run", async (req, res) => {
  try {
    const config: StressTestConfig = {
      concurrent: req.body.concurrent || 10,
      duration: req.body.duration || 30000, // 30 seconds default
      endpoints: Array.isArray(req.body.endpoints) ? req.body.endpoints : CRITICAL_ENDPOINTS,
      rampUp: req.body.rampUp || false
    };

    console.log(`[Stress Test] Starting comprehensive stress test with config:`, config);
    const testStartTime = performance.now();
    const initialMemory = process.memoryUsage();
    const initialCPU = await getCPUUsage();

    // Test all endpoints
    const endpointResults: Record<string, any> = {};
    
    for (const endpoint of config.endpoints) {
      try {
        const results = await stressTestEndpoint(endpoint, config.concurrent, config.duration);
        const metrics = calculateMetrics(results);
        metrics.cpuUsage = await getCPUUsage();
        
        endpointResults[endpoint] = {
          metrics,
          sampleErrors: results.filter(r => !r.success).slice(0, 5),
          status: metrics.errorRate < 10 ? "PASS" : metrics.errorRate < 25 ? "WARNING" : "FAIL"
        };
        
        console.log(`[Stress Test] ${endpoint}: ${metrics.totalRequests} requests, ${metrics.errorRate.toFixed(1)}% error rate, ${metrics.averageResponseTime.toFixed(1)}ms avg response`);
      } catch (error: any) {
        endpointResults[endpoint] = {
          status: "ERROR",
          error: error.message
        };
      }
    }

    const testEndTime = performance.now();
    const finalMemory = process.memoryUsage();
    const finalCPU = await getCPUUsage();

    // Calculate overall system health
    const totalRequests = Object.values(endpointResults).reduce((sum: number, result: any) => 
      sum + (result.metrics?.totalRequests || 0), 0);
    const totalErrors = Object.values(endpointResults).reduce((sum: number, result: any) => 
      sum + (result.metrics?.failedRequests || 0), 0);
    const overallErrorRate = (totalErrors / totalRequests) * 100 || 0;
    
    const passCount = Object.values(endpointResults).filter((r: any) => r.status === "PASS").length;
    const warningCount = Object.values(endpointResults).filter((r: any) => r.status === "WARNING").length;
    const failCount = Object.values(endpointResults).filter((r: any) => r.status === "FAIL").length;

    const overallHealth = failCount === 0 ? 
      (warningCount === 0 ? "EXCELLENT" : "GOOD") : 
      (passCount > failCount ? "DEGRADED" : "CRITICAL");

    // Memory pressure analysis
    const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;
    const memoryPressure = memoryIncrease > 50 * 1024 * 1024 ? "HIGH" : 
                          memoryIncrease > 20 * 1024 * 1024 ? "MEDIUM" : "LOW";

    const stressTestReport = {
      testId: `stress_test_${Date.now()}`,
      timestamp: new Date().toISOString(),
      config,
      duration: testEndTime - testStartTime,
      summary: {
        totalEndpoints: config.endpoints.length,
        totalRequests,
        overallErrorRate: overallErrorRate.toFixed(2),
        overallHealth,
        passed: passCount,
        warnings: warningCount,
        failed: failCount
      },
      systemHealth: {
        memoryUsage: {
          initial: initialMemory,
          final: finalMemory,
          increase: memoryIncrease,
          pressure: memoryPressure
        },
        cpuUsage: {
          initial: initialCPU,
          final: finalCPU,
          average: (initialCPU + finalCPU) / 2
        }
      },
      endpointResults,
      recommendations: generateRecommendations(endpointResults, overallErrorRate, memoryPressure)
    };

    console.log(`[Stress Test] Complete - ${overallHealth} health with ${overallErrorRate.toFixed(1)}% error rate`);

    res.json({
      ok: true,
      report: stressTestReport,
      message: `Stress test complete: ${overallHealth} system health`
    });

  } catch (error: any) {
    console.error("[Stress Test] Error:", error.message);
    res.status(500).json({
      ok: false,
      error: error.message,
      message: "Stress test failed to complete"
    });
  }
});

// Generate optimization recommendations
function generateRecommendations(results: Record<string, any>, errorRate: number, memoryPressure: string): string[] {
  const recommendations: string[] = [];

  if (errorRate > 10) {
    recommendations.push("High error rate detected - consider implementing rate limiting and circuit breakers");
  }

  if (memoryPressure === "HIGH") {
    recommendations.push("High memory pressure - implement memory cleanup and garbage collection optimization");
  }

  const slowEndpoints = Object.entries(results).filter(([_, result]: [string, any]) => 
    result.metrics?.averageResponseTime > 1000);
  
  if (slowEndpoints.length > 0) {
    recommendations.push(`Slow endpoints detected: ${slowEndpoints.map(([endpoint]) => endpoint).join(', ')} - consider caching and optimization`);
  }

  const failedEndpoints = Object.entries(results).filter(([_, result]: [string, any]) => 
    result.status === "FAIL");
    
  if (failedEndpoints.length > 0) {
    recommendations.push(`Critical failures in: ${failedEndpoints.map(([endpoint]) => endpoint).join(', ')} - immediate attention required`);
  }

  if (recommendations.length === 0) {
    recommendations.push("System performing well under stress - no immediate optimizations needed");
  }

  return recommendations;
}

// Quick health check stress test
router.get("/quick", async (req, res) => {
  try {
    const quickConfig = {
      concurrent: 5,
      duration: 10000, // 10 seconds
      endpoints: ['/api/audit/health-check', '/api/products/featured', '/api/stores'],
      rampUp: false
    };

    console.log("[Stress Test] Running quick stress test");
    const results = await stressTestEndpoint('/api/audit/health-check', 5, 10000);
    const metrics = calculateMetrics(results);
    metrics.cpuUsage = await getCPUUsage();

    const health = metrics.errorRate < 5 ? "HEALTHY" : metrics.errorRate < 15 ? "WARNING" : "CRITICAL";

    res.json({
      ok: true,
      health,
      metrics: {
        requests: metrics.totalRequests,
        errorRate: `${metrics.errorRate.toFixed(1)}%`,
        avgResponseTime: `${metrics.averageResponseTime.toFixed(1)}ms`,
        requestsPerSecond: metrics.requestsPerSecond.toFixed(1)
      },
      message: `Quick stress test complete - system ${health}`
    });

  } catch (error: any) {
    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
});

// Monitor system under load in real-time
router.get("/monitor", async (req, res) => {
  try {
    const duration = parseInt(req.query.duration as string) || 60000; // 1 minute default
    const metrics: any[] = [];
    const startTime = performance.now();
    
    console.log(`[Stress Test] Monitoring system performance for ${duration}ms`);

    // Monitor every 5 seconds
    const monitorInterval = setInterval(async () => {
      const currentTime = performance.now();
      if (currentTime - startTime >= duration) {
        clearInterval(monitorInterval);
        
        const averageMetrics = {
          avgCPU: metrics.reduce((sum, m) => sum + m.cpu, 0) / metrics.length,
          avgMemory: metrics.reduce((sum, m) => sum + m.memory.heapUsed, 0) / metrics.length,
          maxMemory: Math.max(...metrics.map(m => m.memory.heapUsed)),
          samples: metrics.length
        };

        res.json({
          ok: true,
          monitoring: {
            duration,
            samples: metrics.length,
            averageMetrics,
            timeline: metrics,
            status: averageMetrics.avgCPU < 70 && averageMetrics.avgMemory < 200 * 1024 * 1024 ? "STABLE" : "STRESSED"
          },
          message: "System monitoring complete"
        });
      }
    }, 5000);

    // Collect metrics every 5 seconds
    const collectMetrics = async () => {
      const cpu = await getCPUUsage();
      const memory = process.memoryUsage();
      
      metrics.push({
        timestamp: new Date().toISOString(),
        cpu,
        memory,
        uptime: process.uptime()
      });

      if (performance.now() - startTime < duration) {
        setTimeout(collectMetrics, 5000);
      }
    };

    collectMetrics();

  } catch (error: any) {
    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
});

export default router;