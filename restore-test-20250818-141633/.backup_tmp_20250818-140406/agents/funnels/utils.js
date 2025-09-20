import fs from "fs";
import path from "path";

export function ensureDirs(...dirs){ dirs.forEach(d=>fs.mkdirSync(d,{recursive:true})); }
export function ts(){ return new Date().toISOString(); }
export function safeWriteJSON(p, obj){ fs.writeFileSync(p, JSON.stringify(obj,null,2)); }
export function slug(s){ return String(s||"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"").slice(0,60); }
export async function wait(ms){ return new Promise(r=>setTimeout(r,ms)); }
export async function loadYAML(file){
  const txt = fs.readFileSync(file,"utf8");
  // ultra-light yaml (we already use real YAML elsewhere, but keep this isolated)
  const YAML = (await import("yaml")).default;
  return YAML.parse(txt);
}