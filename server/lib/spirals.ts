import { getDb } from "./cloudant-core.js";

export type SpiralsLedgerDoc = {
  _id: string;                   // "spirals:<shopperId>"
  type: "spirals";
  shopperId: string;
  balance: number;               // total SPIRALS
  entries: Array<{              // append-only mini-ledger
    ts: string;
    points: number;
    reason: string;
    ref?: string;                // e.g., payment_intent id
  }>;
  createdAt: string;
  updatedAt: string;
};

export async function awardSpirals(shopperId: string, points: number, reason: string, ref?: string) {
  const db = await getDb();
  const id = `spirals:${shopperId}`;
  let doc: any;
  try { doc = await db.get(id); } catch {
    doc = { _id:id, type:"spirals", shopperId, balance:0, entries:[], createdAt:new Date().toISOString() };
  }
  doc.entries.push({ ts:new Date().toISOString(), points, reason, ref });
  doc.balance = (doc.balance || 0) + points;
  doc.updatedAt = new Date().toISOString();
  const res = await db.insert(doc);
  doc._rev = res.rev;
  return doc as SpiralsLedgerDoc;
}