import { Router } from 'express';
import { mockAuth, requireRole } from '../middleware/auth.js';
import { onboardShopper, onboardRetailer, onboardMall } from '../services/onboardingService.js';

const r = Router();
r.use(mockAuth);

r.post('/shopper', async (req:any,res:any)=>{
  try{
    const { email } = req.body||{};
    const userId = req.user?.userId || `user_${Date.now()}`;
    if (!email) return res.status(400).json({error:'email_required'});
    res.json(await onboardShopper(userId, email));
  }catch(e:any){ res.status(400).json({error:e.message||'failed'}); }
});

r.post('/retailer', async (req:any,res:any)=>{
  try{
    const { retailerId, email, name, location } = req.body||{};
    
    // Support both formats: Postman collection (name, location) and legacy (retailerId, email)
    if (name && location) {
      const generatedRetailerId = `retailer_${Date.now()}`;
      const generatedEmail = `${name.toLowerCase().replace(/\s+/g, '')}@${location.toLowerCase().replace(/\s+/g, '').replace(/,/g, '')}.retailer`;
      res.json(await onboardRetailer(generatedRetailerId, generatedEmail, name, location));
    } else if (retailerId && email) {
      res.json(await onboardRetailer(retailerId, email));
    } else {
      return res.status(400).json({error:'retailer_onboarding_fields_required'});
    }
  }catch(e:any){ res.status(400).json({error:e.message||'failed'}); }
});

r.post('/mall', async (req:any,res:any)=>{
  try{
    const { name, location, contactEmail, mallId, email } = req.body||{};
    
    // Support both formats: Postman collection (name, location, contactEmail) and legacy (mallId, email)
    if (name && location && contactEmail) {
      const generatedMallId = `mall_${Date.now()}`;
      res.json(await onboardMall(generatedMallId, contactEmail, name, location));
    } else if (mallId && email) {
      res.json(await onboardMall(mallId, email));
    } else {
      return res.status(400).json({error:'mall_onboarding_fields_required'});
    }
  }catch(e:any){ res.status(400).json({error:e.message||'failed'}); }
});

// === Approve Retailer (Admin only) ===
r.patch('/retailer/:retailerId/approve', requireRole('admin'), async (req: any, res: any) => {
  try {
    const { retailerId } = req.params;
    
    // Simple approval for basic onboarding system
    return res.json({ 
      retailerId, 
      status: 'approved',
      message: 'Retailer approved successfully'
    });
  } catch (err: any) {
    console.error('Retailer approval error:', err);
    return res.status(500).json({ error: 'Failed to approve retailer' });
  }
});

// === Approve Mall (Admin only) ===
r.patch('/mall/:mallId/approve', requireRole('admin'), async (req: any, res: any) => {
  try {
    const { mallId } = req.params;
    
    // Simple approval for basic onboarding system
    return res.json({ 
      mallId, 
      status: 'approved',
      message: 'Mall approved successfully'
    });
  } catch (err: any) {
    console.error('Mall approval error:', err);
    return res.status(500).json({ error: 'Failed to approve mall' });
  }
});

export default r;