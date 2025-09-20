import { getDb } from "./cloudant-core.js";

export type ShopperDoc = {
  _id: string;              // "shopper:<id>"
  type: "shopper";
  email?: string;
  stripeCustomerId?: string;
  createdAt: string;
  updatedAt: string;
};

export async function getShopper(shopperId: string) {
  const db = await getDb();
  try { return await db.get<ShopperDoc>(`shopper:${shopperId}`); } catch { return null; }
}

export async function upsertShopper(shopperId: string, patch: Partial<ShopperDoc>) {
  const db = await getDb();
  const id = `shopper:${shopperId}`;
  let existing: any = null;
  try { existing = await db.get(id); } catch {}
  const now = new Date().toISOString();
  const doc: any = {
    _id: id,
    type: "shopper",
    email: patch.email ?? existing?.email,
    stripeCustomerId: patch.stripeCustomerId ?? existing?.stripeCustomerId,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now
  };
  if (existing?._rev) doc._rev = existing._rev;
  const res = await db.insert(doc);
  doc._rev = res.rev;
  return doc as ShopperDoc;
}