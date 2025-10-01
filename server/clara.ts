import express, { Router, Request, Response } from "express";
import { randomUUID } from "crypto";
import type { Express } from "express";
import type { ClaraMessage, ClaraAck } from "./types.js";

const AGENT_HANDLES = new Set([
  "clara","elias","sophia-ledger","adrian",
  "harbor","librarian","sentry","heartbeat","scout","conveyor","herald",
  "pathfinder","anvil","integrationsim","checkoutsim",
  "aegis","sherlock","maestro","compass",
]);

type Ticket = {
  id: string;
  msg: ClaraMessage;
  status: "queued"|"processing"|"done"|"error";
  result?: any;
  error?: string;
  createdAt: number;
  updatedAt: number;
};
const QUEUE = new Map<string, Ticket>();

type AgentHandler = (msg: ClaraMessage) => Promise<any>;
const handlers: Record<string, AgentHandler> = {
  clara: async (m)=> ({ note: "Clara acknowledged", subject: m.subject }),
  elias: async (m)=> ({ started: true, playbook: m.payload?.playbook ?? "OnboardMall" }),
  "sophia-ledger": async (m)=> ({ reportQueued: true }),
  adrian: async (m)=> ({ scenario: "rollout", malls: m.payload?.malls || [] }),
  harbor: async (m)=> ({ importQueued: true, mallId: m.mallId }),
  librarian: async (m)=> ({ classified: true }),
  sentry: async (m)=> ({ checked: m.payload?.url }),
  heartbeat: async (m)=> ({ monitor: "enabled" }),
  scout: async (m)=> ({ diff: "scheduled" }),
  conveyor: async (m)=> ({ sync: "started" }),
  herald: async (m)=> ({ outreach: "sent" }),
  pathfinder: async (m)=> ({ sims: ["search","browse","pdp"] }),
  anvil: async (m)=> ({ loadTest: "queued" }),
  integrationsim: async (m)=> ({ cms: m.payload?.cms || "wordpress" }),
  checkoutsim: async (m)=> ({ checkoutSim: "ok" }),
  aegis: async (m)=> ({ guard: "active" }),
  sherlock: async (m)=> ({ fraudWatch: "on" }),
  maestro: async (m)=> ({ rerank: "A/B" }),
  compass: async (m)=> ({ recs: "seeded" }),
};

function validate(msg: any): asserts msg is ClaraMessage {
  if (!msg || typeof msg !== "object") throw new Error("Invalid payload");
  if (!msg.to || typeof msg.to !== "string") throw new Error("Missing 'to'");
  if (!AGENT_HANDLES.has(msg.to)) throw new Error(`Unknown agent '${msg.to}'`);
  if (!msg.subject) throw new Error("Missing 'subject'");
}

export function mountClara(app: Express) {
  const router = Router();
  router.use(express.json({ limit: "512kb" }));

  // Optional admin auth
  if (process.env.SUPERADMIN_TOKEN) {
    router.use((req, res, next) => {
      const token = req.header("X-SPIRAL-ADMIN");
      if (token !== process.env.SUPERADMIN_TOKEN)
        return res.status(401).type("application/json").json({ ok: false, error: "Unauthorized" });
      next();
    });
  }

  router.post("/route", async (req: Request, res: Response) => {
    try {
      const msg = req.body;
      validate(msg);

      const id = randomUUID();
      const now = Date.now();
      const ticket: Ticket = { id, msg, status: "queued", createdAt: now, updatedAt: now };
      QUEUE.set(id, ticket);

      ticket.status = "processing"; ticket.updatedAt = Date.now();
      const result = await handlers[msg.to](msg);
      ticket.status = "done"; ticket.result = result; ticket.updatedAt = Date.now();

      const ack: ClaraAck = { ok: true, ticketId: id, routedTo: msg.to };
      res.type("application/json").json(ack);
    } catch (e: any) {
      res.status(400).type("application/json").json({ ok: false, error: e?.message || "Bad Request" });
    }
  });

  router.get("/ticket/:id", (req, res) => {
    const t = QUEUE.get(req.params.id);
    if (!t) return res.status(404).type("application/json").json({ ok: false, error: "Not found" });
    res.type("application/json").json({ ok: true, ticket: t });
  });

  router.get("/agents", (_req, res) => {
    res.type("application/json").json({ ok: true, agents: Array.from(AGENT_HANDLES.values()) });
  });

  app.use("/api/clara", router);
}