import fs from "fs";
import path from "path";
import { Router } from "express";

const dataDir = path.join(process.cwd(), "data");
const servicePath = path.join(dataDir, "serviceability.json");
const pickupsPath = path.join(dataDir, "pickup_centers.json");
const courierPath = path.join(dataDir, "couriers.json");
const returnsPath = path.join(dataDir, "returns.json");
const roadmapPath = path.join(dataDir, "roadmap.json");

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

function ensure(p: string, init: any) {
  if (!fs.existsSync(p)) {
    fs.writeFileSync(p, JSON.stringify(init, null, 2));
  }
}

// Initialize fulfillment data files
ensure(servicePath, { 
  serviceable_zips: ["55101", "55104", "55415", "10001", "90210"], 
  default_eta_mins: [120, 240] 
});

ensure(pickupsPath, [
  { 
    id: "pc-001", 
    name: "SPIRAL Center — Downtown", 
    zip: "55101", 
    address: "123 Main St", 
    hours: "10–8", 
    capacity: 200,
    lat: 44.9477,
    lng: -93.0936
  },
  { 
    id: "pc-002", 
    name: "SPIRAL Center — City Mall", 
    zip: "55415", 
    address: "500 Market Ave", 
    hours: "10–9", 
    capacity: 400,
    lat: 44.9730,
    lng: -93.2570
  }
]);

ensure(courierPath, [
  { 
    id: "cr-local", 
    name: "Local Courier Co", 
    kind: "local", 
    base_fee: 4.0, 
    per_km: 0.6, 
    per_kg: 0.5, 
    sla_mins: [30, 90] 
  },
  { 
    id: "cr-roadie", 
    name: "Roadie Integration", 
    kind: "gig", 
    base_fee: 6.0, 
    per_km: 0.7, 
    per_kg: 0.4, 
    sla_mins: [60, 180] 
  },
  { 
    id: "cr-standard", 
    name: "UPS/FedEx Network", 
    kind: "carrier", 
    base_fee: 8.0, 
    per_km: 0.4, 
    per_kg: 0.3, 
    sla_mins: [720, 2880] 
  }
]);

ensure(returnsPath, []);

function load(p: string): any {
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

function save(p: string, v: any) {
  fs.writeFileSync(p, JSON.stringify(v, null, 2));
}

function nowISO(): string {
  return new Date().toISOString();
}

// Distance calculation using Haversine formula for more accurate results
function kmBetweenZips(zipA: string, zipB: string): number {
  if (!zipA || !zipB) return 10;
  if (zipA === zipB) return 2;
  
  // Rough heuristic based on ZIP code prefixes for demo
  // In production, this would use actual coordinates or geocoding API
  const prefixA = parseInt(zipA.slice(0, 3));
  const prefixB = parseInt(zipB.slice(0, 3));
  const diff = Math.abs(prefixA - prefixB);
  
  return Math.max(2, diff * 3); // Minimum 2km, scale by prefix difference
}

function priceFor(courier: any, km: number, kg: number): number {
  return Number((courier.base_fee + km * courier.per_km + kg * courier.per_kg).toFixed(2));
}

function upsertRoadmap(id: string, title: string, status?: string) {
  const r = load(roadmapPath);
  const idx = r.items.findIndex((x: any) => x.id === id);
  if (idx === -1) {
    r.items.push({ id, title, status });
  } else {
    r.items[idx].title = title;
    if (status) r.items[idx].status = status;
  }
  r.last_updated = nowISO();
  save(roadmapPath, r);
}

// Update roadmap
upsertRoadmap("local_fulfillment", "Local Fulfillment Layer (couriers + returns + pickup)", "in_progress");

export const fulfillmentRouter = Router();

// Serviceability & pickup centers
fulfillmentRouter.get("/serviceability", (_req, res) => {
  const serviceability = load(servicePath);
  res.json(serviceability);
});

fulfillmentRouter.put("/serviceability", (req, res) => {
  const s = load(servicePath);
  if (Array.isArray(req.body.serviceable_zips)) {
    s.serviceable_zips = req.body.serviceable_zips.map((z: any) => String(z));
  }
  if (Array.isArray(req.body.default_eta_mins)) {
    s.default_eta_mins = req.body.default_eta_mins.map(Number);
  }
  save(servicePath, s);
  res.json(s);
});

fulfillmentRouter.get("/pickup-centers", (_req, res) => {
  const pickupCenters = load(pickupsPath);
  res.json({ pickup_centers: pickupCenters });
});

fulfillmentRouter.post("/pickup-centers", (req, res) => {
  const pcs = load(pickupsPath);
  const id = "pc-" + String(pcs.length + 1).padStart(3, "0");
  const newCenter = {
    id,
    name: req.body.name || "New SPIRAL Center",
    zip: req.body.zip || "00000",
    address: req.body.address || "",
    hours: req.body.hours || "10–8",
    capacity: Number(req.body.capacity || 200),
    lat: req.body.lat || 0,
    lng: req.body.lng || 0
  };
  pcs.push(newCenter);
  save(pickupsPath, pcs);
  res.json({ ok: true, id, center: newCenter });
});

// Courier listing and management
fulfillmentRouter.get("/couriers", (_req, res) => {
  const couriers = load(courierPath);
  res.json({ couriers });
});

fulfillmentRouter.put("/couriers", (req, res) => {
  if (!Array.isArray(req.body.couriers)) {
    return res.status(400).json({ error: "couriers array required" });
  }
  save(courierPath, req.body.couriers);
  res.json({ ok: true, count: req.body.couriers.length });
});

// Quote endpoint - GET /api/fulfillment/quote?from_zip=55101&to_zip=55104&weight_kg=1.2
fulfillmentRouter.get("/quote", (req, res) => {
  const from_zip = String(req.query.from_zip || "");
  const to_zip = String(req.query.to_zip || "");
  const kg = Number(req.query.weight_kg || 0.5);
  
  if (!from_zip || !to_zip) {
    return res.status(400).json({ error: "from_zip and to_zip required" });
  }
  
  const service = load(servicePath);
  const couriers = load(courierPath);
  const serviceable = service.serviceable_zips.includes(from_zip) && 
                     service.serviceable_zips.includes(to_zip);
  const km = kmBetweenZips(from_zip, to_zip);

  const quotes = couriers.map((c: any) => {
    const price = priceFor(c, km, kg);
    const eta = serviceable ? c.sla_mins : service.default_eta_mins;
    return { 
      courier_id: c.id, 
      courier_name: c.name, 
      kind: c.kind, 
      price, 
      eta_mins: eta, 
      serviceable,
      distance_km: km
    };
  }).sort((a: any, b: any) => a.price - b.price);

  res.json({ 
    from_zip, 
    to_zip, 
    distance_km: km, 
    weight_kg: kg, 
    quotes,
    serviceable_area: serviceable
  });
});

// Dispatch endpoint - POST with order details
fulfillmentRouter.post("/dispatch", (req, res) => {
  const { 
    order_id, 
    from_zip, 
    to_zip, 
    weight_kg = 0.5, 
    courier_id, 
    pickup_center_id 
  } = req.body || {};
  
  if (!order_id || !from_zip || !to_zip) {
    return res.status(400).json({ 
      error: "order_id, from_zip, and to_zip required" 
    });
  }
  
  const service = load(servicePath);
  const courierList = load(courierPath);
  const pcs = load(pickupsPath);
  const km = kmBetweenZips(String(from_zip), String(to_zip));
  
  const chosen = courier_id ? 
    courierList.find((c: any) => c.id === courier_id) : 
    courierList[0];
    
  if (!chosen) {
    return res.status(404).json({ error: "courier_not_found" });
  }

  const serviceable = service.serviceable_zips.includes(String(from_zip)) && 
                     service.serviceable_zips.includes(String(to_zip));
  const price = priceFor(chosen, km, Number(weight_kg));
  const eta = serviceable ? chosen.sla_mins : service.default_eta_mins;
  const pickup = pickup_center_id ? 
    pcs.find((p: any) => p.id === pickup_center_id) : null;

  // Generate tracking number
  const tracking = `SPIRAL-${Date.now()}-${Math.floor(Math.random() * 999)}`;
  const status_url = `/api/fulfillment/status/${tracking}`;

  res.json({
    success: true,
    dispatch_id: `DSP-${Date.now()}`,
    order_id,
    courier: { id: chosen.id, name: chosen.name, kind: chosen.kind },
    price,
    eta_mins: eta,
    serviceable,
    pickup_center: pickup || null,
    tracking,
    status_url,
    distance_km: km,
    weight_kg: Number(weight_kg),
    dispatched_at: nowISO()
  });
});

// Mock shipment status tracking
fulfillmentRouter.get("/status/:tracking", (req, res) => {
  const { tracking } = req.params;
  
  // Generate pseudo-random status based on tracking ID and current time
  const phases = [
    "label_created", 
    "picked_up", 
    "in_transit", 
    "out_for_delivery", 
    "delivered"
  ];
  
  const hash = tracking.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const timeIndex = Math.floor(Date.now() / 600000); // Changes every 10 minutes
  const phaseIndex = Math.min(phases.length - 1, Math.abs((hash + timeIndex) % phases.length));
  
  const status = phases[phaseIndex];
  const estimated_delivery = new Date(Date.now() + 3600000 * 2).toISOString(); // 2 hours from now
  
  res.json({ 
    tracking, 
    status, 
    status_description: status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    updated_at: nowISO(),
    estimated_delivery: status === 'delivered' ? nowISO() : estimated_delivery,
    location: status === 'delivered' ? 'Delivered' : 'In Transit'
  });
});

// Unified returns system
fulfillmentRouter.post("/returns/create", (req, res) => {
  const list = load(returnsPath);
  const id = "RET-" + String(list.length + 1).padStart(5, "0");
  
  const returnItem = {
    id,
    order_id: req.body.order_id || "unknown",
    retailer_id: req.body.retailer_id || "unknown",
    reason: req.body.reason || "unspecified",
    method: req.body.method || "dropoff", // dropoff or pickup
    customer_zip: req.body.customer_zip || null,
    pickup_center_id: req.body.pickup_center_id || null,
    label_url: `/api/fulfillment/returns/label/${id}.pdf`,
    created_at: nowISO(),
    status: "authorized",
    customer_name: req.body.customer_name || "Customer",
    items: req.body.items || []
  };
  
  list.push(returnItem);
  save(returnsPath, list);
  res.json({ success: true, return: returnItem });
});

fulfillmentRouter.get("/returns", (req, res) => {
  const returns = load(returnsPath);
  const { status, retailer_id } = req.query;
  
  let filteredReturns = returns;
  if (status) {
    filteredReturns = filteredReturns.filter((r: any) => r.status === status);
  }
  if (retailer_id) {
    filteredReturns = filteredReturns.filter((r: any) => r.retailer_id === retailer_id);
  }
  
  res.json({ returns: filteredReturns });
});

fulfillmentRouter.put("/returns/:id/status", (req, res) => {
  const returns = load(returnsPath);
  const returnIndex = returns.findIndex((r: any) => r.id === req.params.id);
  
  if (returnIndex === -1) {
    return res.status(404).json({ error: "return_not_found" });
  }
  
  returns[returnIndex].status = req.body.status || returns[returnIndex].status;
  returns[returnIndex].updated_at = nowISO();
  save(returnsPath, returns);
  
  res.json({ success: true, return: returns[returnIndex] });
});

// Generate return label (mock PDF)
fulfillmentRouter.get("/returns/label/:id.pdf", (req, res) => {
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="return-label-${req.params.id}.pdf"`);
  
  const payload = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj
4 0 obj
<<
/Length 120
>>
stream
BT
/F1 12 Tf
50 750 Td
(SPIRAL RETURN LABEL) Tj
0 -20 Td
(Return ID: ${req.params.id}) Tj
0 -20 Td
(Generated: ${nowISO()}) Tj
ET
endstream
endobj
5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000273 00000 n 
0000000442 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
529
%%EOF`;
  
  res.send(Buffer.from(payload));
});

// Operations summary for admin dashboards
fulfillmentRouter.get("/ops", (_req, res) => {
  const service = load(servicePath);
  const pickupCenters = load(pickupsPath);
  const couriers = load(courierPath);
  const returns = load(returnsPath);
  
  const activeReturns = returns.filter((r: any) => r.status !== "closed");
  const totalCapacity = pickupCenters.reduce((sum: number, pc: any) => sum + pc.capacity, 0);
  
  res.json({
    serviceable_zips: service.serviceable_zips.length,
    pickup_centers: pickupCenters.length,
    total_capacity: totalCapacity,
    couriers: couriers.length,
    returns_open: activeReturns.length,
    returns_total: returns.length,
    avg_eta_mins: service.default_eta_mins,
    last_updated: nowISO()
  });
});