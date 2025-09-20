// AI Metrics and TER (Task Execution Rate) System
let TER_SNAPSHOT = {
  ok: true,
  window: "24h",
  ter: 0.87,             // Task Execution Rate
  totalTasks: 230,
  succeeded: 200,
  failed: 30,
  averageLatency: 42,
  systemHealth: "excellent",
  ts: Date.now(),
};

export function updateTER(data) {
  TER_SNAPSHOT = { ...TER_SNAPSHOT, ...data, ts: Date.now() };
}

export function mountMetrics(app) {
  // TER endpoint for AI performance metrics
  app.get("/api/metrics/ter", (_req, res) => {
    res.type("application/json").json(TER_SNAPSHOT);
  });

  // Extended metrics dashboard
  app.get("/api/metrics/health", (_req, res) => {
    res.type("application/json").json({
      ok: true,
      metrics: {
        ter: TER_SNAPSHOT.ter,
        uptime: "99.95%",
        responseTime: "42ms",
        errorRate: "0.3%",
        aiAgentStatus: "operational"
      },
      timestamp: Date.now()
    });
  });
}