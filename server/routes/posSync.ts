import { Router } from "express";
import { syncSquareInventory } from "../integrations/pos/square.js";
import { syncLightspeedInventory } from "../integrations/pos/lightspeed.js";

const router = Router();
const mustAuthRetailer = (req:any,res:any,next:any)=> (req.user?.role==="retailer"||req.user?.role==="admin")? next():res.status(403).json({error:"Forbidden"});

router.post("/square/:retailerId", mustAuthRetailer, async (req,res)=>{
  const out = await syncSquareInventory(req.params.retailerId);
  res.json(out);
});

router.post("/lightspeed/:retailerId", mustAuthRetailer, async (req,res)=>{
  const out = await syncLightspeedInventory(req.params.retailerId);
  res.json(out);
});

export default router;