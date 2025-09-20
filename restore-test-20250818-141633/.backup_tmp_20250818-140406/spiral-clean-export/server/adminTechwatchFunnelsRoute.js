import express from "express";
import fs from "fs";
import path from "path";
import { guard } from "./adminAuth.js";

const router = express.Router();
router.use(guard);

const BASE = path.join(process.cwd(),"agents","techwatch","reports");

router.get("/techwatch/funnels/latest", (req,res)=>{
  try{
    const days = fs.readdirSync(BASE).filter(d=>/^\d{4}-\d{2}-\d{2}$/.test(d)).sort();
    if (!days.length) return res.json({ ok:true, items:[] });
    const dir = path.join(BASE, days[days.length-1], "funnels");
    if (!fs.existsSync(dir)) return res.json({ ok:true, items:[] });
    const files = fs.readdirSync(dir).filter(f=>f.endsWith(".json"));
    const items = files.map(f=>JSON.parse(fs.readFileSync(path.join(dir,f),"utf8")));
    res.json({ ok:true, items });
  } catch(e){
    console.error(e); res.status(500).json({ ok:false, error:e.message });
  }
});

router.post("/techwatch/funnels/run-now", async (req,res)=>{
  try{
    const { execa } = await import("execa");
    await execa("bash",["-lc","npm run techwatch:funnels"],{stdio:"inherit"});
    res.json({ ok:true });
  } catch(e){
    console.error(e); res.status(500).json({ ok:false, error:e.message });
  }
});

export default router;