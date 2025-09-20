import { getDb } from "./cloudant-core.js";

export type OrderDoc = {
  _id: string;                       // "order:pi_<payment_intent_id>"
  type: "order";
  shopperId: string;
  amountReceived: number;            // cents
  currency: string;
  paymentIntentId: string;
  createdAt: string;
};

export async function getOrderByPI(paymentIntentId: string) {
  const db = await getDb();
  const id = `order:${paymentIntentId}`;
  try { return await db.get<OrderDoc>(id); } catch { return null; }
}

export async function createOrderOnce(data: Omit<OrderDoc,"_id"|"createdAt">) {
  const db = await getDb();
  const id = `order:${data.paymentIntentId}`;
  try { await db.get(id); return null; } catch {}
  const doc: OrderDoc = {
    _id: id,
    type: "order",
    shopperId: data.shopperId,
    amountReceived: data.amountReceived,
    currency: data.currency,
    paymentIntentId: data.paymentIntentId,
    createdAt: new Date().toISOString()
  };
  await db.insert(doc);
  return doc;
}