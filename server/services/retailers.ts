type Plan = "free" | "silver" | "gold";
export interface Retailer {
  id: string;
  email?: string;
  name?: string;
  stripeCustomerId?: string | null;
  plan: Plan;
  planSince?: string;
  entitlements?: string[];
}

const memory = new Map<string, Retailer>();

// Optional: wire to Cloudant if available
const HAS_CLOUDANT = !!(process.env.CLOUDANT_URL && process.env.CLOUDANT_APIKEY && process.env.CLOUDANT_DBNAME);

// Very light Cloudant client (only if configured)
async function cloudantGet(id: string): Promise<Retailer | null> {
  if (!HAS_CLOUDANT) return null;
  try {
    const auth = Buffer.from(`apikey:${process.env.CLOUDANT_APIKEY}`).toString("base64");
    const res = await fetch(`${process.env.CLOUDANT_URL}/${process.env.CLOUDANT_DBNAME}/${encodeURIComponent(id)}`, {
      headers: { Authorization: `Basic ${auth}` },
    });
    if (!res.ok) return null;
    const doc = await res.json();
    return doc as Retailer;
  } catch { return null; }
}

async function cloudantPut(ret: Retailer): Promise<void> {
  if (!HAS_CLOUDANT) return;
  try {
    const auth = Buffer.from(`apikey:${process.env.CLOUDANT_APIKEY}`).toString("base64");
    // fetch current rev if exists
    let _rev: string | undefined;
    const head = await fetch(`${process.env.CLOUDANT_URL}/${process.env.CLOUDANT_DBNAME}/${encodeURIComponent(ret.id)}`, {
      headers: { Authorization: `Basic ${auth}` },
    });
    if (head.ok) {
      const cur = await head.json();
      _rev = cur._rev;
    }
    const body = JSON.stringify({ ...ret, _id: ret.id, _rev });
    await fetch(`${process.env.CLOUDANT_URL}/${process.env.CLOUDANT_DBNAME}/${encodeURIComponent(ret.id)}`, {
      method: "PUT",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
      body
    });
  } catch {/* ignore */}
}

export async function getRetailerById(id: string): Promise<Retailer | null> {
  if (HAS_CLOUDANT) {
    const doc = await cloudantGet(id);
    if (doc) return doc;
  }
  return memory.get(id) ?? null;
}

export async function ensureRetailer(id: string, seed?: Partial<Retailer>): Promise<Retailer> {
  const existing = await getRetailerById(id);
  if (existing) return existing;
  const created: Retailer = {
    id,
    name: seed?.name || `Retailer ${id}`,
    email: seed?.email,
    stripeCustomerId: seed?.stripeCustomerId ?? null,
    plan: "free",
    planSince: new Date().toISOString(),
    entitlements: [],
  };
  memory.set(id, created);
  await cloudantPut(created);
  return created;
}

export async function setRetailerPlan(id: string, plan: Plan, stripeCustomerId?: string | null) {
  const r = (await getRetailerById(id)) ?? (await ensureRetailer(id));
  r.plan = plan;
  r.planSince = new Date().toISOString();
  if (stripeCustomerId !== undefined) r.stripeCustomerId = stripeCustomerId;
  await cloudantPut(r);
  memory.set(id, r);
  return r;
}

export async function setStripeCustomer(id: string, stripeCustomerId: string) {
  const r = (await getRetailerById(id)) ?? (await ensureRetailer(id));
  r.stripeCustomerId = stripeCustomerId;
  await cloudantPut(r);
  memory.set(id, r);
  return r;
}