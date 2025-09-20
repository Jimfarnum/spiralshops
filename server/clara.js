import { randomUUID } from "crypto";

// 1) Allowed agent handles (keep in sync with UI)
const AGENT_HANDLES = new Set([
  "clara","elias","sophia-ledger","adrian",
  "harbor","librarian","sentry","heartbeat","scout","conveyor","herald",
  "pathfinder","anvil","integrationsim","checkoutsim",
  "aegis","sherlock","maestro","compass",
]);

// 2) Very small in-memory queue (swap for Redis/SQS later)
/**
 * @typedef {Object} Ticket
 * @property {string} id
 * @property {import('./types.js').ClaraMessage} msg
 * @property {'queued'|'processing'|'done'|'error'} status
 * @property {any} [result]
 * @property {string} [error]
 * @property {number} createdAt
 * @property {number} updatedAt
 */

/** @type {Map<string, Ticket>} */
const QUEUE = new Map();

// 3) Basic agent dispatch table (stubs → real calls)
/** @type {Record<string, (msg: import('./types.js').ClaraMessage) => Promise<any>>} */
const handlers = {
  // leadership
  clara: async (m) => ({ note: "Clara acknowledged", subject: m.subject }),
  elias: async (m) => ({ started: true, playbook: m.payload?.playbook ?? "OnboardMall" }),
  "sophia-ledger": async (m) => ({ reportQueued: true }),
  adrian: async (m) => ({ scenario: "rollout", malls: m.payload?.malls || [] }),

  // task agents
  harbor: async (m) => {
    // example: trigger mall import by URL
    // return await importMallStores(m.payload.directoryUrl, m.mallId!)
    return { importQueued: true, mallId: m.mallId };
  },
  librarian: async (m) => ({ classified: true }),
  sentry: async (m) => ({ checked: m.payload?.url }),
  heartbeat: async (m) => ({ monitor: "enabled" }),
  scout: async (m) => ({ diff: "scheduled" }),
  conveyor: async (m) => ({ sync: "started" }),
  herald: async (m) => ({ outreach: "sent" }),

  // sims
  pathfinder: async (m) => ({ sims: ["search","browse","pdp"] }),
  anvil: async (m) => ({ loadTest: "queued" }),
  integrationsim: async (m) => ({ cms: m.payload?.cms || "wordpress" }),
  checkoutsim: async (m) => ({ checkoutSim: "ok" }),

  // security & intelligence
  aegis: async (m) => ({ guard: "active" }),
  sherlock: async (m) => ({ fraudWatch: "on" }),
  maestro: async (m) => ({ rerank: "A/B" }),
  compass: async (m) => ({ recs: "seeded" }),
};

// 4) Validation helper
/**
 * @param {any} msg
 * @returns {asserts msg is import('./types.js').ClaraMessage}
 */
function validate(msg) {
  if (!msg || typeof msg !== "object") throw new Error("Invalid payload");
  if (!msg.to || typeof msg.to !== "string") throw new Error("Missing 'to'");
  if (!AGENT_HANDLES.has(msg.to)) throw new Error(`Unknown agent '${msg.to}'`);
  if (!msg.subject) throw new Error("Missing 'subject'");
}

// 5) Mount HTTP routes
/**
 * @param {import('express').Express} app
 */
export function mountClara(app) {
  // Rate limiting and admin guard for Clara routes
  const claraRequests = new Map();
  
  app.use("/api/clara", (req, res, next) => {
    // Rate limiting for burst handling (100 requests per 15 minutes)
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutes
    const maxRequests = 100;
    const clientId = req.ip;
    
    if (!claraRequests.has(clientId)) {
      claraRequests.set(clientId, []);
    }
    
    const requests = claraRequests.get(clientId);
    // Remove old requests outside window
    const recent = requests.filter(time => now - time < windowMs);
    
    if (recent.length >= maxRequests) {
      return res.status(429).json({ 
        ok: false, 
        error: "Clara rate limit exceeded. Try again later." 
      });
    }
    
    recent.push(now);
    claraRequests.set(clientId, recent);
    
    // Optional admin guard - check X-SPIRAL-ADMIN header
    const adminToken = process.env.SUPERADMIN_TOKEN;
    if (adminToken && req.headers['x-spiral-admin'] !== adminToken) {
      return res.status(403).json({ ok: false, error: "Admin access required" });
    }
    
    next();
  });

  // route task to an agent
  app.post("/api/clara/route", async (req, res) => {
    try {
      const msg = req.body;
      validate(msg);

      const id = randomUUID();
      const now = Date.now();
      /** @type {Ticket} */
      const ticket = {
        id,
        msg,
        status: "queued",
        createdAt: now,
        updatedAt: now,
      };
      QUEUE.set(id, ticket);

      // process immediately (sync); swap to worker for async if needed
      ticket.status = "processing"; 
      ticket.updatedAt = Date.now();
      const handler = handlers[msg.to];
      const result = await handler(msg);
      ticket.status = "done"; 
      ticket.result = result; 
      ticket.updatedAt = Date.now();

      /** @type {import('./types.js').ClaraAck} */
      const ack = { ok: true, ticketId: id, routedTo: msg.to };
      res.type("application/json").json(ack);
    } catch (e) {
      res.status(400).type("application/json").json({ ok: false, error: e?.message || "Bad Request" });
    }
  });

  // inspect ticket status (simple admin)
  app.get("/api/clara/ticket/:id", (req, res) => {
    const t = QUEUE.get(req.params.id);
    if (!t) return res.status(404).type("application/json").json({ ok: false, error: "Not found" });
    res.type("application/json").json({ ok: true, ticket: t });
  });

  // list known agents (for UI dropdowns)
  app.get("/api/clara/agents", (_req, res) => {
    res.type("application/json").json({ ok: true, agents: Array.from(AGENT_HANDLES.values()) });
  });
}