import { z } from "zod";

export const EventSchema = z.object({
  type: z.enum(["page_view","search","cart_event","checkout","product_view"]),
  sessionId: z.string(),
  userId: z.string().optional().nullable(),
  mallId: z.string().optional(),
  storeId: z.string().optional(),
  payload: z.record(z.any()).default({}),
  ts: z.string().datetime()
});

export type SpiralEvent = z.infer<typeof EventSchema>;