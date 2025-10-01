import { Router } from 'express';

// existing handlers we built earlier
import { onboardingQuestions } from './routes/onboarding.js';
import { quoteShipping } from './routes/shipping.js';
import { getDiscountTier } from './routes/discounts.js';
import { applyDiscountsHandler } from './routes/discounts_apply.js';
import { createOrder, getOrderById, listOrdersByRetailer } from './routes/orders.js';
import { createShipment, listShipmentsByOrder, trackShipment } from './routes/shipments.js';
import { applyRetailer, listRetailerApplications as listRetailerApps, approveRetailer } from './routes/retailers.js';
import { applyMall, listMallApplications as listMallApps, approveMall } from './routes/malls.js';
import { upsertPartnership, getPartnership, listPartnerships, listPartnershipsByType } from './routes/partnerships.js';
import { AgentRegistry } from './lib/registry.js';

const registry = new AgentRegistry();
export const spiralRouter = Router();

// public-ish
spiralRouter.get('/retailers/onboarding/questions', (_req, res) => res.json(onboardingQuestions));
spiralRouter.post('/shipping/quote', async (req, res) => {
  const q = await quoteShipping(req.body);
  res.json(q);
});
spiralRouter.get('/discounts/tier', (req, res) => {
  const volume = Number(req.query.volume || 0);
  res.json(getDiscountTier(volume));
});
spiralRouter.post('/discounts/apply', applyDiscountsHandler);

// orders & shipments
spiralRouter.post('/orders', createOrder);
spiralRouter.get('/orders/:id', getOrderById);
spiralRouter.get('/retailers/:retailerId/orders', listOrdersByRetailer);
spiralRouter.post('/shipments', createShipment);
spiralRouter.get('/shipments/by-order/:orderId', listShipmentsByOrder);
spiralRouter.post('/shipments/track', trackShipment);

// onboarding apps
spiralRouter.post('/retailers/apply', applyRetailer);
spiralRouter.get('/retailers/apps', listRetailerApps);
spiralRouter.post('/retailers/apps/:id/approve', approveRetailer);

spiralRouter.post('/malls/apply', applyMall);
spiralRouter.get('/malls/apps', listMallApps);
spiralRouter.post('/malls/apps/:id/approve', approveMall);

// partnerships
spiralRouter.post('/partnerships/upsert', upsertPartnership);
spiralRouter.get('/partnerships/get', getPartnership);
spiralRouter.get('/partnerships/list', listPartnerships);
spiralRouter.get('/partnerships/list/:type', listPartnershipsByType);

// agents
spiralRouter.get('/agents', (_req, res) => res.json(registry.list()));
spiralRouter.post('/agents/run', async (req, res) => {
  const name = String(req.body?.name || '');
  const result = await registry.run(name, req.body?.params || {});
  res.json(result);
});

export default spiralRouter;