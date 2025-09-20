import type { Express, Request, Response } from "express";

let TER_SNAPSHOT = {
  ok: true,
  window: "24h",
  ter: 0.87,
  totalTasks: 230,
  succeeded: 200,
  failed: 30,
  ts: Date.now(),
};

export function updateTER(data: Partial<typeof TER_SNAPSHOT>) {
  TER_SNAPSHOT = { ...TER_SNAPSHOT, ...data, ts: Date.now() };
}

export function mountMetrics(app: Express) {
  app.get("/api/metrics/ter", (_req: Request, res: Response) => {
    res.type("application/json").json(TER_SNAPSHOT);
  });
}