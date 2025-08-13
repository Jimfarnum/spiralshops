import fs from "fs";
import path from "path";
import { Router } from "express";

const dataDir = path.join(process.cwd(), "data");
const eventsPath = path.join(dataDir, "analytics_events.json");
const customersPath = path.join(dataDir, "customers.json");
const experimentsPath = path.join(dataDir, "experiments.json");
const retailersPath = path.join(dataDir, "retailers.json");
const roadmapPath = path.join(dataDir, "roadmap.json");

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

function ensureFile(p: string, initial: any) {
  if (!fs.existsSync(p)) {
    fs.writeFileSync(p, JSON.stringify(initial, null, 2));
  }
}

// Initialize data files
ensureFile(eventsPath, []);
ensureFile(customersPath, []);
ensureFile(experimentsPath, []);
ensureFile(roadmapPath, { 
  phase: "Phase 1 — Competitive Gap Closing", 
  items: [], 
  last_updated: "" 
});
ensureFile(retailersPath, [
  {"id":"ret-001","name":"Main Street Outfitters","zip":"55101","lat":44.9477,"lng":-93.0936},
  {"id":"ret-002","name":"City Mall Electronics","zip":"55415","lat":44.9730,"lng":-93.2570}
]);

function loadJSON(p: string): any {
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

function saveJSON(p: string, obj: any) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2));
}

function dayKey(ts: string): string {
  const d = new Date(ts);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,"0")}-${String(d.getUTCDate()).padStart(2,"0")}`;
}

function within(ts: string, from?: string, to?: string): boolean {
  const t = +new Date(ts);
  return (!from || t >= +new Date(from)) && (!to || t <= +new Date(to));
}

function upsertRoadmap(id: string, title: string, status?: string) {
  const r = loadJSON(roadmapPath);
  const idx = r.items.findIndex((x: any) => x.id === id);
  if (idx === -1) {
    r.items.push({ id, title, status });
  } else {
    r.items[idx].title = title;
    if (status) r.items[idx].status = status;
  }
  r.last_updated = new Date().toISOString();
  saveJSON(roadmapPath, r);
}

// Update roadmap
upsertRoadmap("analytics_hub", "Retailer Analytics & Intelligence Hub (MVP)", "in_progress");

export const analyticsRouter = Router();

// Ingest single event (order or item)
analyticsRouter.post("/event", (req, res) => {
  const e = req.body || {};
  if (!e.type || !e.ts) {
    return res.status(400).json({error: "type_and_ts_required"});
  }
  
  const events = loadJSON(eventsPath);
  e._id = `${e.type}-${events.length + 1}`;
  events.push(e);
  saveJSON(eventsPath, events);

  // Update customers for order events
  if (e.type === "order" && e.customer_id) {
    const cs = loadJSON(customersPath);
    const idx = cs.findIndex((c: any) => c.customer_id === e.customer_id);
    if (idx === -1) {
      cs.push({ 
        customer_id: e.customer_id, 
        first_seen: e.ts, 
        last_seen: e.ts, 
        zip: e.zip || null, 
        tags: [] 
      });
    } else {
      cs[idx].last_seen = e.ts;
      if (e.zip) cs[idx].zip = e.zip;
    }
    saveJSON(customersPath, cs);
  }
  
  res.json({ok: true, id: e._id});
});

// Bulk ingest
analyticsRouter.post("/bulk", (req, res) => {
  const { events = [] } = req.body || {};
  if (!Array.isArray(events)) {
    return res.status(400).json({error: "events_array_required"});
  }
  
  const all = loadJSON(eventsPath);
  const customers = loadJSON(customersPath);
  
  for (const e of events) {
    if (!e.type || !e.ts) continue;
    e._id = `${e.type}-${all.length + 1}`;
    all.push(e);
    
    if (e.type === "order" && e.customer_id) {
      const idx = customers.findIndex((c: any) => c.customer_id === e.customer_id);
      if (idx === -1) {
        customers.push({ 
          customer_id: e.customer_id, 
          first_seen: e.ts, 
          last_seen: e.ts, 
          zip: e.zip || null, 
          tags: [] 
        });
      } else {
        customers[idx].last_seen = e.ts;
        if (e.zip) customers[idx].zip = e.zip;
      }
    }
  }
  
  saveJSON(eventsPath, all);
  saveJSON(customersPath, customers);
  res.json({ok: true, count: events.length});
});

// KPI summary for a retailer (or all)
analyticsRouter.get("/kpis", (req, res) => {
  const { retailer_id, from, to } = req.query as any;
  const events = loadJSON(eventsPath);
  const orders = events.filter((e: any) => 
    e.type === "order" && 
    (!retailer_id || e.retailer_id === retailer_id) && 
    within(e.ts, from, to)
  );
  const items = events.filter((e: any) => 
    e.type === "item" && 
    (!retailer_id || e.retailer_id === retailer_id) && 
    within(e.ts, from, to)
  );

  const revenue = orders.reduce((s: number, e: any) => s + Number(e.total || 0), 0);
  const cost = orders.reduce((s: number, e: any) => s + Number(e.cost_total || 0), 0);
  const gross = revenue - cost;
  const margin = revenue > 0 ? (gross / revenue) : 0;

  const orderIds = new Set(orders.map((o: any) => o.order_id));
  const ordersCount = orderIds.size;
  const aov = ordersCount ? revenue / ordersCount : 0;

  // Customer analytics
  const customers = Array.from(new Set(orders.map((o: any) => o.customer_id).filter(Boolean)));
  const byCustomer: {[key: string]: number} = {};
  for (const o of orders) {
    if (!o.customer_id) continue;
    byCustomer[o.customer_id] = (byCustomer[o.customer_id] || 0) + 1;
  }
  const repeatCustomers = Object.values(byCustomer).filter(n => n >= 2).length;
  const repeatRate = customers.length ? repeatCustomers / customers.length : 0;

  // Top products
  const bySku: {[key: string]: any} = {};
  for (const it of items) {
    const key = it.sku || "unknown";
    if (!bySku[key]) {
      bySku[key] = { sku: key, title: it.title || key, qty: 0, revenue: 0 };
    }
    bySku[key].qty += Number(it.qty || 0);
    bySku[key].revenue += Number(it.price || 0) * Number(it.qty || 0);
  }
  const topProducts = Object.values(bySku)
    .sort((a: any, b: any) => b.revenue - a.revenue)
    .slice(0, 10);

  // CLV approximation
  const avgOrdersPerCustomer = customers.length ? ordersCount / customers.length : 0;
  const clvApprox = aov * avgOrdersPerCustomer;

  res.json({
    retailer_id: retailer_id || "all",
    range: { from: from || null, to: to || null },
    kpis: {
      revenue: Number(revenue.toFixed(2)),
      orders: ordersCount,
      aov: Number(aov.toFixed(2)),
      gross_margin_pct: Number((margin * 100).toFixed(2)),
      customers: customers.length,
      repeat_rate_pct: Number((repeatRate * 100).toFixed(2)),
      clv_approx: Number(clvApprox.toFixed(2))
    },
    top_products: topProducts
  });
});

// Timeseries (daily/weekly/monthly)
analyticsRouter.get("/timeseries", (req, res) => {
  const { retailer_id, from, to, interval = "daily" } = req.query as any;
  const orders = loadJSON(eventsPath).filter((e: any) => 
    e.type === "order" && 
    (!retailer_id || e.retailer_id === retailer_id) && 
    within(e.ts, from, to)
  );
  
  const buckets: {[key: string]: any} = {};
  for (const o of orders) {
    const d = new Date(o.ts);
    let k: string;
    
    if (interval === "monthly") {
      k = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    } else if (interval === "weekly") {
      const startOfYear = new Date(d.getUTCFullYear(), 0, 1);
      const dayOfYear = Math.floor((d.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
      const weekNumber = Math.ceil((dayOfYear + startOfYear.getUTCDay() + 1) / 7);
      k = `${d.getUTCFullYear()}-W${String(weekNumber).padStart(2, "0")}`;
    } else {
      k = dayKey(o.ts);
    }
    
    if (!buckets[k]) buckets[k] = { revenue: 0, orders: 0 };
    buckets[k].revenue += Number(o.total || 0);
    buckets[k].orders += 1;
  }
  
  const series = Object.entries(buckets)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]: [string, any]) => ({
      bucket: k,
      revenue: Number(v.revenue.toFixed(2)),
      orders: v.orders
    }));
  
  res.json({ interval, series });
});

// Zip trends (revenue by zip)
analyticsRouter.get("/zip-trends", (req, res) => {
  const { from, to } = req.query as any;
  const orders = loadJSON(eventsPath).filter((e: any) => 
    e.type === "order" && within(e.ts, from, to)
  );
  
  const zipData: {[key: string]: any} = {};
  for (const o of orders) {
    const key = o.zip || "unknown";
    if (!zipData[key]) zipData[key] = { zip: key, revenue: 0, orders: 0 };
    zipData[key].revenue += Number(o.total || 0);
    zipData[key].orders += 1;
  }
  
  const trends = Object.values(zipData)
    .sort((a: any, b: any) => b.revenue - a.revenue)
    .map((z: any) => ({
      ...z,
      revenue: Number(z.revenue.toFixed(2))
    }));
  
  res.json({ trends });
});

// A/B experiment management
analyticsRouter.get("/experiments", (req, res) => {
  const experiments = loadJSON(experimentsPath);
  res.json({ experiments });
});

analyticsRouter.post("/experiments", (req, res) => {
  const { name, variants = ["A", "B"] } = req.body || {};
  if (!name) return res.status(400).json({error: "name_required"});
  
  const experiments = loadJSON(experimentsPath);
  const newExp = {
    id: `exp-${experiments.length + 1}`,
    name,
    variants,
    created_at: new Date().toISOString()
  };
  experiments.push(newExp);
  saveJSON(experimentsPath, experiments);
  
  res.json({ ok: true, experiment: newExp });
});

// Retailer management
analyticsRouter.get("/retailers", (req, res) => {
  const retailers = loadJSON(retailersPath);
  res.json({ retailers });
});

analyticsRouter.post("/retailers", (req, res) => {
  const { name, zip, lat, lng } = req.body || {};
  if (!name) return res.status(400).json({error: "name_required"});
  
  const retailers = loadJSON(retailersPath);
  const newRetailer = {
    id: `ret-${String(retailers.length + 1).padStart(3, "0")}`,
    name,
    zip: zip || null,
    lat: lat || null,
    lng: lng || null
  };
  retailers.push(newRetailer);
  saveJSON(retailersPath, retailers);
  
  res.json({ ok: true, retailer: newRetailer });
});

// Roadmap endpoint
analyticsRouter.get("/roadmap", (req, res) => {
  const roadmap = loadJSON(roadmapPath);
  res.json(roadmap);
});