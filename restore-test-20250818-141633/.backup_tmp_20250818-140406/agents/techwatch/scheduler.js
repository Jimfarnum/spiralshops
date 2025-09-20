import fs from "fs";
import path from "path";

const STATE = path.join(process.cwd(), "agents","techwatch","state.json");
const INTERVAL_DAYS = Number(process.env.FUNNEL_RUN_INTERVAL_DAYS || 14);

function readState(){ try{ return JSON.parse(fs.readFileSync(STATE,"utf8")); } catch { return {}; } }
function writeState(s){ fs.writeFileSync(STATE, JSON.stringify(s,null,2)); }

function daysSince(iso){
  if (!iso) return Number.POSITIVE_INFINITY;
  const then = new Date(iso).getTime();
  const now  = Date.now();
  return (now - then) / (1000*60*60*24);
}

async function run(cmd){
  console.log(`[Scheduler] Running: ${cmd}`);
  const { execa } = await import("execa"); // light proc runner
  try { await execa("bash", ["-lc", cmd], { stdio: "inherit" }); }
  catch (e) { console.error(`[Scheduler] ${cmd} failed`, e?.shortMessage || e?.message); }
}

async function main(){
  const st = readState();
  // Always refresh TechWatch (news/AI/R&D) daily; avoid cron complexity here
  await run("npm run techwatch:scan");

  // 14-day guard for funnels
  const last = st.last_funnel_run_at;
  const delta = daysSince(last);
  if (delta >= INTERVAL_DAYS - 0.25) { // small buffer
    await run("npm run techwatch:funnels");
    st.last_funnel_run_at = new Date().toISOString();
    writeState(st);
  } else {
    console.log(`[Scheduler] Funnels not due. Days since last: ${delta.toFixed(1)}/${INTERVAL_DAYS}`);
  }
}
main().catch(e=>{ console.error(e); process.exit(1); });