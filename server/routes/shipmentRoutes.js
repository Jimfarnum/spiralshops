import { z } from "zod";
import { getCloudant } from "../lib/cloudant.js";
import crypto from "crypto";

const createSchema = z.object({
  orderId: z.string(),
  carrier: z.string(),        // e.g., USPS, UPS, Hybrid
  service: z.string().optional(),
  tracking: z.string().optional(),
  labelUrl: z.string().optional(),
  cost: z.number().nonnegative().optional(),
  estDays: z.number().int().optional()
});

export async function createShipment(req, res) {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);

  const db = getCloudant();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const shp = {
    _id: `shipment:${id}`,
    type: "shipment",
    status: "label_created",    // label_created | in_transit | out_for_delivery | delivered | exception
    createdAt: now,
    updatedAt: now,
    ...parsed.data
  };
  await db.insert('shipments', shp);
  res.json({ ok: true, id, shipment: shp });
}

export async function listShipmentsByOrder(req, res) {
  const orderId = String(req.params.orderId);
  const db = getCloudant();
  const result = await db.find('shipments', { selector: { orderId }, limit: 100 });
  res.json(result.result?.docs || []);
}

// Simple track stub (replace with carrier tracking APIs later)
export async function trackShipment(req, res) {
  const tracking = String(req.body?.tracking || "");
  if (!tracking) return res.status(400).json({ error: "tracking required" });
  // Fake progress based on last char code
  const step = tracking.charCodeAt(tracking.length - 1) % 4;
  const status = ["in_transit","out_for_delivery","delivered","exception"][step];
  res.json({ tracking, status });
}