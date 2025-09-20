export type ScoreInput = {
  agent: string;
  taskId: string;
  role: "shopper" | "retailer" | "mall" | "vendor";
  // Raw measurements gathered at runtime:
  measurements: {
    latencyMs: number;              // total task latency
    ttfbMs?: number;                // time-to-first-token (LLM)
    tokensIn?: number;
    tokensOut?: number;
    cpuMs?: number;
    memMB?: number;
    error?: boolean;
    retries?: number;
    escalated?: boolean;            // needed human
  };
  // Human/auto graders (boolean or 0..1):
  rubric: {
    accuracy?: number;              // 0..1
    grounding?: number;             // 0..1
    reasoning?: number;             // 0..1
    actionable?: number;            // 0..1
    consistency?: number;           // 0..1
    safety?: number;                // 0..1

    reliability?: number;           // 0..1
    resourceDiscipline?: number;    // 0..1
    readiness?: number;             // 0..1

    handoff?: number;               // 0..1
    selection?: number;             // 0..1
    dedup?: number;                 // 0..1
    conflictResolution?: number;    // 0..1
    outcomeAlignment?: number;      // 0..1
  };
};

export type ScoreOutput = {
  taskId: string;
  agent: string;
  cognition: number;   // 0..100
  efficiency: number;  // 0..100
  teamwork: number;    // 0..100
  TER: number;         // 0..100
  stamp: string;
};

export const weights = {
  cognition: { accuracy:30, grounding:30, reasoning:25, actionable:20, consistency:15, safety:10 }, // scaled later
  efficiency: { latency:25, success:25, resource:20, reliability:20, readiness:10 },
  teamwork: { handoff:35, selection:25, dedup:15, conflict:15, alignment:10 },
  TER: { cognition:0.4, efficiency:0.35, teamwork:0.25 }
};

// Latency success curve (adjust thresholds to your SLOs)
export function latencyScore(ms: number): number {
  if (ms <= 600) return 1;
  if (ms >= 5000) return 0;
  return 1 - (ms - 600) / (5000 - 600);
}

// Reliability score from errors/retries/escalation
export function reliabilityScore({ error, retries = 0, escalated }: { error?: boolean; retries?: number; escalated?: boolean; }): number {
  let s = 1;
  if (error) s -= 0.5;
  if (retries > 0) s -= Math.min(0.3, retries * 0.1);
  if (escalated) s -= 0.3;
  return Math.max(0, s);
}

// Resource discipline from tokens + cpu/mem budgets (example budgets)
export function resourceScore({ tokensIn = 0, tokensOut = 0, cpuMs = 0, memMB = 0 }: { tokensIn?: number; tokensOut?: number; cpuMs?: number; memMB?: number; }): number {
  const tokenBudget = 8_000;  // adjust per agent
  const cpuBudget = 500;      // ms
  const memBudget = 1024;     // MB
  const tokenUse = (tokensIn + tokensOut) / tokenBudget;
  const cpuUse = cpuMs / cpuBudget;
  const memUse = memMB / memBudget;
  const penalty = Math.max(0, (tokenUse - 1)*0.5) + Math.max(0, (cpuUse - 1)*0.3) + Math.max(0, (memUse - 1)*0.2);
  return Math.max(0, 1 - penalty);
}