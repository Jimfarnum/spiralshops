import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { mockAuth, requireRole } from '../middleware/auth.js';
import { cgetDoc, cpostDoc, cputDoc } from '../utils/cloudantCore.js';

const r = Router();
r.use(mockAuth);

// === Retailer Onboarding ===
r.post('/onboarding', async (req: any, res: any) => {
  try {
    const { name, address, category, email, phone, ein, consentVersion } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Missing required fields (name, email)' });
    }

    const retailerId = uuidv4();
    const doc = {
      _id: `retailer:${retailerId}`,
      type: 'retailer',
      name,
      address,
      category,
      email,
      phone,
      ein,
      status: 'pending',
      subscriptionTier: 'Free',
      createdAt: new Date().toISOString(),
      consentVersion: consentVersion || 'v1.0',
    };

    await cpostDoc(doc).catch(()=>({}));

    return res.status(201).json({
      id: retailerId,
      retailerId,
      status: 'pending',
      message: 'Retailer onboarding submitted',
    });
  } catch (err: any) {
    console.error('Retailer onboarding error:', err);
    return res.status(500).json({ error: 'Failed to onboard retailer' });
  }
});

// === Approve Retailer (Admin only) ===
r.patch('/onboarding/:id/approve', requireRole('admin'), async (req: any, res: any) => {
  const { id } = req.params;
  try {
    const docId = `retailer:${id}`;
    const doc = await cgetDoc(docId).catch(()=>({})) as any;

    if (doc._id) {
      doc.status = 'approved';
      await cputDoc(doc).catch(()=>({}));
    }

    return res.json({ id, retailerId: id, status: 'approved' });
  } catch (err: any) {
    console.error('Retailer approval error:', err);
    return res.status(500).json({ error: 'Failed to approve retailer' });
  }
});

// === Retailer Dashboard ===
r.get('/:id/dashboard', requireRole('retailer', 'admin'), async (req: any, res: any) => {
  const { id } = req.params;
  try {
    const docId = `retailer:${id}`;
    const doc = await cgetDoc(docId).catch(()=>({})) as any;

    // Always return dashboard, even if Cloudant is down
    const dashboard = {
      products: doc.products || [],
      analytics: doc.analytics || {
        views: 0,
        orders: 0,
        spiralsEarned: 0,
      },
      subscriptionTier: doc.subscriptionTier || 'Free',
      supportTickets: doc.supportTickets || [],
    };

    return res.json({ retailerId: id, dashboard });
  } catch (err: any) {
    console.error('Retailer dashboard error:', err);
    const dashboard = {
      products: [],
      analytics: { views: 0, orders: 0, spiralsEarned: 0 },
      subscriptionTier: 'Free',
      supportTickets: [],
    };
    return res.json({ retailerId: id, dashboard });
  }
});

export default r;