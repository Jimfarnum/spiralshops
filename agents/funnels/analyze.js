import fs from "fs";
import path from "path";
import { slug, ensureDirs, safeWriteJSON } from "./utils.js";

const ROOT = path.join(process.cwd(), "agents");
const OUT_BASE = path.join(ROOT, "techwatch","reports");
const FUNNEL_OUT = path.join(ROOT, "funnels","out"); // from run.js

function llmUnavailable(){
  return !process.env.OPENAI_API_KEY || (process.env.OPENAI_API_KEY||"").trim()==="";
}
async function callLLM(prompt){
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method:"POST",
    headers:{ "content-type":"application/json", authorization:`Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        { role:"system", content:"You are a cross-functional growth strategist for SPIRAL. Be pragmatic, structured, and implementation-focused." },
        { role:"user", content: prompt }
      ]
    })
  });
  const json = await res.json();
  const txt = json?.choices?.[0]?.message?.content || "{}";
  try { return JSON.parse(txt); } catch { return { error: "parse_error", raw: txt }; }
}

function buildPrompt({ domain, capture }){
  const capExcerpt = JSON.stringify(capture).slice(0, 12000);
  return `
Return STRICT JSON with keys:
{
 "competitor": "...",
 "domain": "...",
 "funnel_map": { "stages": [ {"name":"...","evidence":["..."]} ] },
 "copy_decoder": { "tone":"...", "headline_hooks":["..."], "cta_patterns":["..."], "framing_devices":["..."], "why_it_converts":"..." },
 "offer_xray": { "pricing":"...", "bonuses":["..."], "urgency_triggers":["..."], "guarantees":["..."], "payment_options":["..."], "positioning":"..." },
 "traffic_sources": { "likely":["paid search","seo","influencers","retargeting"], "audiences":["..."], "targeting_ideas":["..."] },
 "email_blueprint": { "timing":"...", "value_to_pitch_ratio":"...", "subject_line_style":["..."], "storytelling":"...", "cta_patterns":["..."] },
 "leak_finder": { "weak_points":["..."], "fixes_for_spiral":["..."] },
 "differentiation_map": { "overlap":["..."], "unique_angles_for_spiral":["..."], "usps":["..."] },
 "recommendations": [ {"title":"...","owner_role":"Marketing|Product|UX|Engineering","eta_days":14,"impact":"high|med|low"} ],
 "decision": "INITIATE|WATCH|DISCARD",
 "rationale": "why this matters for SPIRAL conversion & onboarding"
}
TEXT (CAPTURE SNIPPET):
${capExcerpt}

META:
competitor="${domain}" mission="Analyze → Create → Implement"
Guide: prefer concrete, testable ideas for SPIRAL onboarding & funnel.
`;
}

export async function analyzeOne({ domain }) {
  const capFile = path.join(FUNNEL_OUT, slug(domain), `capture_${slug(domain)}.json`);
  if (!fs.existsSync(capFile)) throw new Error(`Missing capture for ${domain}`);
  const capture = JSON.parse(fs.readFileSync(capFile,"utf8"));

  if (llmUnavailable()){
    // Conservative heuristic output
    const report = {
      competitor: domain, domain,
      funnel_map: { stages: capture.records.map(r=>({ name: r.stage, evidence:[r.title, r.url].filter(Boolean) })) },
      copy_decoder: { tone:"informational", headline_hooks:[], cta_patterns:capture.persuasion.ctas||[], framing_devices:[], why_it_converts:"Heuristic" },
      offer_xray: { pricing:"Mixed", bonuses:[], urgency_triggers:capture.persuasion.banners||[], guarantees:[], payment_options:[], positioning:"General retailer" },
      traffic_sources: { likely:["seo","retargeting"], audiences:["broad retail"], targeting_ideas:["Local pickup focus"] },
      email_blueprint: { timing:"unknown", value_to_pitch_ratio:"n/a", subject_line_style:[], storytelling:"n/a", cta_patterns:[] },
      leak_finder: { weak_points:["complexity at checkout"], fixes_for_spiral:["1-click wallets; simplified pickup flow"] },
      differentiation_map: { overlap:["assortment"], unique_angles_for_spiral:["local mall pickup","unified multi-merchant cart"], usps:["fast local pickup","mall perks"] },
      recommendations: [{ title:"Enable 1-click wallets with pickup default", owner_role:"Engineering", eta_days:10, impact:"high" }],
      decision: "INITIATE",
      rationale: "Likely conversion uplift via friction reduction."
    };
    return report;
  }

  const prompt = buildPrompt({ domain, capture });
  return await callLLM(prompt);
}

export async function writeIntoTechWatch(report){
  const dateISO = new Date().toISOString().split("T")[0];
  const outDir = path.join(OUT_BASE, dateISO, "funnels");
  ensureDirs(outDir);
  const fp = path.join(outDir, `funnel_${slug(report.domain)}.json`);
  safeWriteJSON(fp, report);

  // Also append to main report.json if exists
  const main = path.join(OUT_BASE, dateISO, "report.json");
  if (fs.existsSync(main)) {
    try {
      const arr = JSON.parse(fs.readFileSync(main,"utf8"));
      arr.push({
        title: `Funnel Insights: ${report.domain}`,
        url: `funnel://${report.domain}`,
        source: "Competitive Funnels",
        topic: "funnel-intel",
        summary: report.rationale || "Funnel analysis",
        key_points: report.recommendations?.map(r=>r.title).slice(0,3) || [],
        scores: { relevance_0_5: 5, impact_now_0_5: 4, impact_12mo_0_5: 4, effort_low_med_high: "med", legal_risk_low_med_high: "low" },
        recommendations: report.recommendations || [],
        next_actions: report.recommendations || [],
        decision: report.decision || "WATCH",
        rationale: report.rationale || ""
      });
      fs.writeFileSync(main, JSON.stringify(arr,null,2));
    } catch { /* ignore */ }
  }
}