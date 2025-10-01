import { ScoreInput, ScoreOutput, weights, latencyScore, reliabilityScore, resourceScore } from "./rubric.js";

// In-memory storage for development
const scoreStore: ScoreOutput[] = [];

export function scoreCognition(r: ScoreInput["rubric"]): number {
  const {
    accuracy=0, grounding=0, reasoning=0, actionable=0, consistency=0, safety=0
  } = r;
  const w = weights.cognition;
  const total = w.accuracy + w.grounding + w.reasoning + w.actionable + w.consistency + w.safety;
  const raw =
    accuracy*w.accuracy + grounding*w.grounding + reasoning*w.reasoning +
    actionable*w.actionable + consistency*w.consistency + safety*w.safety;
  return Math.round((raw / total) * 100);
}

export function scoreEfficiency(m: ScoreInput["measurements"], r: ScoreInput["rubric"]): number {
  const w = weights.efficiency;
  const sLatency = latencyScore(m.latencyMs);
  const sSuccess = (m.error || m.escalated) ? 0 : 1; // simple success flag
  const sResource = resourceScore(m);
  const sReliability = reliabilityScore(m);
  const sReadiness = r.readiness ?? 0.8; // default until you wire health checks

  const total = w.latency + w.success + w.resource + w.reliability + w.readiness;
  const raw =
    sLatency*w.latency + sSuccess*w.success + sResource*w.resource +
    sReliability*w.reliability + sReadiness*w.readiness;
  return Math.round((raw / total) * 100);
}

export function scoreTeamwork(r: ScoreInput["rubric"]): number {
  const { handoff=0, selection=0, dedup=0, conflictResolution=0, outcomeAlignment=0 } = r;
  const w = weights.teamwork;
  const total = w.handoff + w.selection + w.dedup + w.conflict + w.alignment;
  const raw =
    handoff*w.handoff + selection*w.selection + dedup*w.dedup + conflictResolution*w.conflict + outcomeAlignment*w.alignment;
  return Math.round((raw / total) * 100);
}

export function computeTER(inp: ScoreInput): ScoreOutput {
  const cognition = scoreCognition(inp.rubric);
  const efficiency = scoreEfficiency(inp.measurements, inp.rubric);
  const teamwork = scoreTeamwork(inp.rubric);
  const TER = Math.round( (weights.TER.cognition*cognition) + (weights.TER.efficiency*efficiency) + (weights.TER.teamwork*teamwork) );
  return { taskId: inp.taskId, agent: inp.agent, cognition, efficiency, teamwork, TER, stamp: new Date().toISOString() };
}

export async function persistScore(s: ScoreOutput) {
  scoreStore.push(s);
  // Optional: persist to database
  // await cloudant.postDocument({ db: process.env.CLOUDANT_DB_INSIGHTS!, document: { type: "agent_score", ...s } });
}

export async function getScores(): Promise<ScoreOutput[]> {
  return scoreStore;
}