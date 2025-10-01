export type AgentEvent =
  | { kind: "task_start"; taskId: string; agent: string; role: string; ts: string; meta?: any }
  | { kind: "task_end"; taskId: string; agent: string; role: string; ts: string; measurements: any; meta?: any }
  | { kind: "handoff"; taskId: string; from: string; to: string; ts: string; contextSize?: number; meta?: any };

// In-memory storage for development (replace with Cloudant in production)
const eventStore: AgentEvent[] = [];

export async function logEvent(e: AgentEvent) {
  eventStore.push(e);
  // Optional: persist to database
  // await cloudant.postDocument({ db: process.env.CLOUDANT_DB_INSIGHTS!, document: { type: "agent_event", ...e } });
}

export async function getEvents(taskId: string) {
  return eventStore.filter(e => e.taskId === taskId);
}