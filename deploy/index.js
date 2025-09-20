// server/index.ts
import express from "express";
import morgan from "morgan";
import compression from "compression";

// server/security.js
function applySecurity(app2) {
  app2.set("trust proxy", true);
  app2.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("X-SPIRAL-Environment", process.env.NODE_ENV || "development");
    const allowedOrigins = process.env.CORS_ALLOWLIST?.split(",") || ["*"];
    const origin = req.headers.origin;
    if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin || "*");
    }
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Admin-Token, X-SPIRAL-ADMIN");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
    next();
  });
}

// server/tenant.js
var MALL_CONFIGS = {
  "rosedale-mn": {
    mallId: "rosedale-mn",
    name: "Rosedale Center",
    theme: "rosedale",
    allowedHosts: [
      "rosedalecenter.com",
      "www.rosedalecenter.com",
      "rosedale.spiralmalls.com"
    ],
    branding: {
      primaryColor: "#2563eb",
      logoUrl: "/assets/rosedale-logo.png"
    }
  },
  "southdale-mn": {
    mallId: "southdale-mn",
    name: "Southdale Center",
    theme: "southdale",
    allowedHosts: [
      "southdale.com",
      "www.southdale.com",
      "southdale.spiralmalls.com"
    ],
    branding: {
      primaryColor: "#059669",
      logoUrl: "/assets/southdale-logo.png"
    }
  },
  "ridgedale-mn": {
    mallId: "ridgedale-mn",
    name: "Ridgedale Center",
    theme: "ridgedale",
    allowedHosts: [
      "ridgedale.com",
      "www.ridgedale.com",
      "ridgedale.spiralmalls.com"
    ],
    branding: {
      primaryColor: "#dc2626",
      logoUrl: "/assets/ridgedale-logo.png"
    }
  }
};
var DEFAULT_MALL = {
  mallId: "spiral-demo",
  name: "SPIRAL Demo Mall",
  theme: "default",
  allowedHosts: ["localhost", "127.0.0.1", "*.replit.dev", "*.vercel.app"],
  branding: {
    primaryColor: "#0f172a",
    logoUrl: "/assets/spiral-logo.png"
  }
};
function getMallFromHost(host) {
  if (!host) return DEFAULT_MALL;
  const cleanHost = host.replace(/:\d+$/, "").replace(/^https?:\/\//, "");
  for (const config of Object.values(MALL_CONFIGS)) {
    if (config.allowedHosts.some((allowed) => {
      if (allowed.includes("*")) {
        const pattern = allowed.replace(/\*/g, ".*");
        return new RegExp(`^${pattern}$`).test(cleanHost);
      }
      return cleanHost === allowed;
    })) {
      return config;
    }
  }
  return DEFAULT_MALL;
}
function tenantMiddleware(req, res, next) {
  const mall = getMallFromHost(req.get("host"));
  req.mall = mall;
  res.locals.mall = mall;
  next();
}

// server/spiralApi.js
var SpiralApi = class {
  static async products(mallId, query = {}) {
    const products = [
      { id: 1, name: "Wireless Bluetooth Headphones", price: 89.99, category: "Electronics", mallId },
      { id: 2, name: "Smart Fitness Watch", price: 299.99, category: "Electronics", mallId },
      { id: 3, name: "Organic Coffee Beans", price: 24.99, category: "Food & Beverage", mallId },
      { id: 4, name: "Designer Handbag", price: 149.99, category: "Fashion", mallId },
      { id: 5, name: "Artisan Chocolate", price: 19.99, category: "Food & Beverage", mallId }
    ];
    let filtered = products;
    if (query.category) {
      filtered = products.filter((p) => p.category.toLowerCase().includes(query.category.toLowerCase()));
    }
    if (query.search) {
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(query.search.toLowerCase()));
    }
    return { success: true, products: filtered };
  }
  static async stores(mallId, query = {}) {
    const stores = [
      { id: 1, name: "Downtown Electronics", category: "Electronics", location: "Minneapolis, MN", mallId },
      { id: 2, name: "Fresh Market Co", category: "Food & Beverage", location: "Minneapolis, MN", mallId },
      { id: 3, name: "Fashion Forward", category: "Fashion", location: "Minneapolis, MN", mallId },
      { id: 4, name: "Artisan Goods", category: "Handmade", location: "Minneapolis, MN", mallId }
    ];
    let filtered = stores;
    if (query.category) {
      filtered = stores.filter((s) => s.category.toLowerCase().includes(query.category.toLowerCase()));
    }
    return { success: true, stores: filtered };
  }
  static async search(mallId, searchTerm) {
    const products = await this.products(mallId, { search: searchTerm });
    const stores = await this.stores(mallId, { search: searchTerm });
    return {
      success: true,
      results: {
        products: products.products || [],
        stores: stores.stores || [],
        query: searchTerm
      }
    };
  }
};

// server/clara.js
import { randomUUID } from "crypto";
var AGENT_HANDLES = /* @__PURE__ */ new Set([
  "clara",
  "elias",
  "sophia-ledger",
  "adrian",
  "harbor",
  "librarian",
  "sentry",
  "heartbeat",
  "scout",
  "conveyor",
  "herald",
  "pathfinder",
  "anvil",
  "integrationsim",
  "checkoutsim",
  "aegis",
  "sherlock",
  "maestro",
  "compass"
]);
var QUEUE = /* @__PURE__ */ new Map();
var handlers = {
  // leadership
  clara: async (m) => ({ note: "Clara acknowledged", subject: m.subject }),
  elias: async (m) => ({ started: true, playbook: m.payload?.playbook ?? "OnboardMall" }),
  "sophia-ledger": async (m) => ({ reportQueued: true }),
  adrian: async (m) => ({ scenario: "rollout", malls: m.payload?.malls || [] }),
  // task agents
  harbor: async (m) => {
    return { importQueued: true, mallId: m.mallId };
  },
  librarian: async (m) => ({ classified: true }),
  sentry: async (m) => ({ checked: m.payload?.url }),
  heartbeat: async (m) => ({ monitor: "enabled" }),
  scout: async (m) => ({ diff: "scheduled" }),
  conveyor: async (m) => ({ sync: "started" }),
  herald: async (m) => ({ outreach: "sent" }),
  // sims
  pathfinder: async (m) => ({ sims: ["search", "browse", "pdp"] }),
  anvil: async (m) => ({ loadTest: "queued" }),
  integrationsim: async (m) => ({ cms: m.payload?.cms || "wordpress" }),
  checkoutsim: async (m) => ({ checkoutSim: "ok" }),
  // security & intelligence
  aegis: async (m) => ({ guard: "active" }),
  sherlock: async (m) => ({ fraudWatch: "on" }),
  maestro: async (m) => ({ rerank: "A/B" }),
  compass: async (m) => ({ recs: "seeded" })
};
function validate(msg) {
  if (!msg || typeof msg !== "object") throw new Error("Invalid payload");
  if (!msg.to || typeof msg.to !== "string") throw new Error("Missing 'to'");
  if (!AGENT_HANDLES.has(msg.to)) throw new Error(`Unknown agent '${msg.to}'`);
  if (!msg.subject) throw new Error("Missing 'subject'");
}
function mountClara(app2) {
  const claraRequests = /* @__PURE__ */ new Map();
  app2.use("/api/clara", (req, res, next) => {
    const now = Date.now();
    const windowMs = 15 * 60 * 1e3;
    const maxRequests = 100;
    const clientId = req.ip;
    if (!claraRequests.has(clientId)) {
      claraRequests.set(clientId, []);
    }
    const requests = claraRequests.get(clientId);
    const recent = requests.filter((time) => now - time < windowMs);
    if (recent.length >= maxRequests) {
      return res.status(429).json({
        ok: false,
        error: "Clara rate limit exceeded. Try again later."
      });
    }
    recent.push(now);
    claraRequests.set(clientId, recent);
    const adminToken = process.env.SUPERADMIN_TOKEN;
    if (adminToken && req.headers["x-spiral-admin"] !== adminToken) {
      return res.status(403).json({ ok: false, error: "Admin access required" });
    }
    next();
  });
  app2.post("/api/clara/route", async (req, res) => {
    try {
      const msg = req.body;
      validate(msg);
      const id = randomUUID();
      const now = Date.now();
      const ticket = {
        id,
        msg,
        status: "queued",
        createdAt: now,
        updatedAt: now
      };
      QUEUE.set(id, ticket);
      ticket.status = "processing";
      ticket.updatedAt = Date.now();
      const handler = handlers[msg.to];
      const result = await handler(msg);
      ticket.status = "done";
      ticket.result = result;
      ticket.updatedAt = Date.now();
      const ack = { ok: true, ticketId: id, routedTo: msg.to };
      res.type("application/json").json(ack);
    } catch (e) {
      res.status(400).type("application/json").json({ ok: false, error: e?.message || "Bad Request" });
    }
  });
  app2.get("/api/clara/ticket/:id", (req, res) => {
    const t = QUEUE.get(req.params.id);
    if (!t) return res.status(404).type("application/json").json({ ok: false, error: "Not found" });
    res.type("application/json").json({ ok: true, ticket: t });
  });
  app2.get("/api/clara/agents", (_req, res) => {
    res.type("application/json").json({ ok: true, agents: Array.from(AGENT_HANDLES.values()) });
  });
}

// server/metrics.js
var TER_SNAPSHOT = {
  ok: true,
  window: "24h",
  ter: 0.87,
  // Task Execution Rate
  totalTasks: 230,
  succeeded: 200,
  failed: 30,
  averageLatency: 42,
  systemHealth: "excellent",
  ts: Date.now()
};
function mountMetrics(app2) {
  app2.get("/api/metrics/ter", (_req, res) => {
    res.type("application/json").json(TER_SNAPSHOT);
  });
  app2.get("/api/metrics/health", (_req, res) => {
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

// server/config.js
var cfg = {
  port: process.env.PORT || 5e3,
  env: process.env.NODE_ENV || "development",
  mallId: process.env.DEFAULT_MALL_ID || "demo",
  memCache: 30
  // seconds
};
function loadMallTheme(mallId) {
  const themes = {
    "rosedale-mn": { primaryColor: "#2563eb", name: "Rosedale Center" },
    "southdale-mn": { primaryColor: "#059669", name: "Southdale Center" },
    "ridgedale-mn": { primaryColor: "#dc2626", name: "Ridgedale Center" },
    "demo": { primaryColor: "#007B8A", name: "SPIRAL Demo" }
  };
  return themes[mallId] || themes.demo;
}

// server/index.ts
var app = express();
app.set("trust proxy", true);
app.use((req, res, next) => {
  const xfProto = req.headers["x-forwarded-proto"];
  if (req.secure || xfProto === "https") return next();
  return res.redirect(308, `https://${req.headers.host}${req.originalUrl}`);
});
var CANON = process.env.CANONICAL_HOST;
app.use((req, res, next) => {
  if (!CANON) return next();
  const host = (req.headers.host || "").toLowerCase();
  if (host !== CANON) return res.redirect(308, `https://${CANON}${req.originalUrl}`);
  next();
});
applySecurity(app);
app.use(morgan("tiny"));
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(tenantMiddleware);
app.get(
  "/healthz",
  (_req, res) => res.type("application/json").status(200).json({
    ok: true,
    service: "spiral-mall-integration",
    env: cfg.env,
    ts: Date.now()
  })
);
app.get(
  "/api/health",
  (req, res) => res.type("application/json").json({ ok: true, mall: req.mallId || cfg.mallId, ts: Date.now() })
);
app.get(
  "/api/theme",
  (req, res) => res.type("application/json").json(loadMallTheme(req.mallId || cfg.mallId))
);
app.get("/api/products", async (req, res, next) => {
  try {
    res.type("application/json").json(await SpiralApi.products(req.mallId, req.query));
  } catch (e) {
    next(e);
  }
});
app.get("/api/stores", async (req, res, next) => {
  try {
    res.type("application/json").json(await SpiralApi.stores(req.mallId, req.query));
  } catch (e) {
    next(e);
  }
});
app.get("/api/search", async (req, res, next) => {
  try {
    const q = String(req.query.q || "");
    res.type("application/json").json(await SpiralApi.search(req.mallId, q));
  } catch (e) {
    next(e);
  }
});
mountClara(app);
mountMetrics(app);
app.use("/static", express.static("dist", { fallthrough: false, immutable: true, maxAge: "30d" }));
app.use("/avatars", express.static("public/avatars", { fallthrough: true, maxAge: "30d" }));
app.get(/^(?!\/api\/|\/healthz|\/static\/|\/avatars\/).+/, (_req, res) => {
  res.status(404).send("Not Found");
});
app.use((err, req, res, _next) => {
  const wantsJson = req.path.startsWith("/api") || req.path === "/healthz";
  const status = Number(err?.status || 500);
  const payload = { ok: false, error: String(err?.message || err || "Internal Error") };
  if (wantsJson) return res.status(status).type("application/json").json(payload);
  res.status(status).send(payload.error);
});
app.listen(cfg.port, () => console.log(`Mall Integration on :${cfg.port}`));
