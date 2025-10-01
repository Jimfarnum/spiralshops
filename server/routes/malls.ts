import { Router } from 'express';
import { mockAuth } from '../middleware/auth.js';
import { listMalls, listMallStores, listMallEvents, getMallDashboard } from '../services/mallService.js';

const r = Router();
r.use(mockAuth);

r.get('/', async (_req,res)=>{ 
  try{ res.json(await listMalls()); }
  catch(e:any){ res.status(400).json({error:e.message||'failed'}); }
});

r.get('/:mallId/stores', async (req,res)=>{
  try{ res.json(await listMallStores(req.params.mallId)); }
  catch(e:any){ res.status(400).json({error:e.message||'failed'}); }
});

r.get('/:mallId/events', async (req,res)=>{
  try{ res.json(await listMallEvents(req.params.mallId)); }
  catch(e:any){ res.status(400).json({error:e.message||'failed'}); }
});

// Mall Dashboard endpoint: /api/malls/:mallId/dashboard?role=mall
r.get('/:mallId/dashboard', async (req,res)=>{
  try{ 
    const { mallId } = req.params;
    res.json(await getMallDashboard(mallId)); 
  }
  catch(e:any){ res.status(400).json({error:e.message||'failed'}); }
});

export default r;