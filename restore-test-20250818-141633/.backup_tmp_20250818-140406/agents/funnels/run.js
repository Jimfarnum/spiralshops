import fs from "fs";
import path from "path";
import { loadYAML, ensureDirs, slug } from "./utils.js";
import { captureFunnel } from "./capture.js";
import { analyzeOne, writeIntoTechWatch } from "./analyze.js";

const ROOT = path.join(process.cwd(), "agents");
const CFG = path.join(ROOT, "funnels", "targets.yml");
const OUT_BASE = path.join(ROOT, "funnels", "out");

async function main(){
  const cfg = await loadYAML(CFG);
  const targets = cfg.competitors || [];
  for (const t of targets) {
    const outDir = path.join(OUT_BASE, slug(t.domain));
    ensureDirs(outDir);
    console.log(`[Funnels] Capturing: ${t.domain} (${t.mode})`);
    const cap = await captureFunnel({ domain: t.domain, mode: t.mode, outDir });
    console.log(`[Funnels] Analyzing: ${t.domain}`);
    const report = await analyzeOne({ domain: t.domain });
    await writeIntoTechWatch(report);
    console.log(`[Funnels] Done: ${t.domain}`);
  }
  console.log("[Funnels] All targets processed.");
}
main().catch(e=>{ console.error(e); process.exit(1); });