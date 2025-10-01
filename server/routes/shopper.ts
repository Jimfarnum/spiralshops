import { Router } from 'express';
import { mockAuth, requireRole } from '../middleware/auth.js';
import { getShopperProfile, getShopperOrders } from '../services/shopperService.js';
import { getSpiralsBalance } from '../services/spiralsService.js';

const r = Router();
r.use(mockAuth);

r.get('/profile', requireRole('shopper','admin'), async (req:any,res:any)=>{
  try{
    const userId = req.user.userId;
    const data = await getShopperProfile(userId);
    res.json(data);
  }catch(e:any){ res.status(400).json({error:e.message||'failed'}); }
});

r.get('/orders', requireRole('shopper','admin'), async (req:any,res:any)=>{
  try{
    const userId = req.user.userId;
    const data = await getShopperOrders(userId, Number(req.query.limit||50));
    res.json(data);
  }catch(e:any){ res.status(400).json({error:e.message||'failed'}); }
});

// SPIRALS balance with query parameter: /api/shopper/spirals/balance?shopperId=xxx
r.get('/spirals/balance', async (req:any,res:any)=>{
  try{
    const userId = req.query.shopperId || req.user?.userId;
    if (!userId) return res.status(400).json({error:'shopperId_required'});
    const data = await getSpiralsBalance(userId);
    res.json(data);
  }catch(e:any){ res.status(400).json({error:e.message||'failed'}); }
});

// SPIRALS balance with path parameter: /api/shopper/:shopperId/spirals/balance
r.get('/:shopperId/spirals/balance', async (req:any,res:any)=>{
  try{
    const userId = req.params.shopperId;
    if (!userId) return res.status(400).json({error:'shopperId_required'});
    const data = await getSpiralsBalance(userId);
    res.json(data);
  }catch(e:any){ res.status(400).json({error:e.message||'failed'}); }
});

export default r;