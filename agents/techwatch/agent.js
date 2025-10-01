/* TechWatch Agent: fetch -> extract -> analyze -> score -> report (MD+JSON)
 * ENV (Secrets):
 *  OPENAI_API_KEY (recommended) | OPENAI_MODEL (default gpt-4o-mini)
 *  SLACK_WEBHOOK_URL (optional) | TECHWATCH_TO_EMAILS / SENDGRID_API_KEY (optional)
 *  TECHWATCH_DAEMON=true for cron; or pass --daemon
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";
import Parser from "rss-parser";
import YAML from "yaml";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

const parser = new Parser();
const ROOT = path.join(process.cwd(), "agents", "techwatch");
const DATA_DIR = path.join(ROOT, "data");
const REPORTS_DIR = path.join(ROOT, "reports");
const DB_FILE = path.join(DATA_DIR, "seen.json");
const SOURCES_YML = path.join(ROOT, "sources.yml");

const have = (k) => !!process.env[k] && String(process.env[k]).trim().length > 0;

function ensureDirs() { fs.mkdirSync(DATA_DIR, { recursive: true }); fs.mkdirSync(REPORTS_DIR, { recursive: true }); }
function sha(s) { return crypto.createHash("sha256").update(s).digest("hex"); }
function loadDB() { try { return JSON.parse(fs.readFileSync(DB_FILE, "utf8")); } catch { return {}; } }
function saveDB(db) { fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2)); }
function loadSources() { return YAML.parse(fs.readFileSync(SOURCES_YML, "utf8")); }

async function safeFetch(url) {
  try { const r = await fetch(url, { headers: { "user-agent": "SPIRAL-TechWatch/1.0" } }); if (!r.ok) throw new Error(r.status); return await r.text(); }
  catch (e) { console.warn("Fetch failed:", url, e.message); return null; }
}
async function fetchFeed(src) {
  try { if (src.type === "rss" || src.type === "atom") return await parser.parseURL(src.url); return null; }
  catch (e) { console.warn("Feed parse failed:", src.name, e.message); return null; }
}
async function extractReadable(url) {
  const html = await safeFetch(url); if (!html) return null;
  try { const dom = new JSDOM(html, { url }); const reader = new Readability(dom.window.document); const art = reader.parse(); if (!art) return null;
    const text = (art.textContent || "").trim(); return { title: art.title || "", text, byline: art.byline || "", length: text.length }; }
  catch (e) { console.warn("Readability failed:", url, e.message); return null; }
}
function keywordHeuristic(text) {
  const s = (text || "").toLowerCase(); let score = 0;
  ["retail","shop","mall","loyalty","checkout","fulfillment","inventory","pos"].forEach(k => { if (s.includes(k)) score += 1; });
  ["ai","model","agents","gpt","ml","transformer"].forEach(k => { if (s.includes(k)) score += 1.5; });
  return Math.min(5, Math.round(score));
}
async function analyzeLLM(item) {
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const prompt = `
Return strict JSON with keys: title,url,source,topic,summary,key_points (array),
scores:{relevance_0_5,impact_now_0_5,impact_12mo_0_5,effort_low_med_high,legal_risk_low_med_high},
recommendations (array), next_actions (array), decision, rationale.
TEXT:
${item.readable?.text?.slice(0,12000) || item.contentSnippet || ""}
META:
title="${item.title}" url="${item.link}" source="${item.sourceName}" topic="${item.topic}"`;
  if (!have("OPENAI_API_KEY")) {
    const rel = keywordHeuristic(item.readable?.text || item.contentSnippet || "");
    return {
      title: item.title, url: item.link, source: item.sourceName, topic: item.topic,
      summary: (item.readable?.text || "").slice(0, 400),
      key_points: [],
      scores: { relevance_0_5: rel, impact_now_0_5: Math.max(1, rel-1), impact_12mo_0_5: Math.max(2, rel), effort_low_med_high: rel>=4?"med":"low", legal_risk_low_med_high: "low" },
      recommendations: ["Review for applicability to SPIRAL."],
      next_actions: [{ title: "Assign DRI to evaluate integration", owner_role: "CTO", eta_days: 7 }],
      decision: rel>=4 ? "INITIATE" : (rel>=3 ? "WATCH" : "DISCARD"),
      rationale: "Heuristic scoring without LLM."
    };
  }
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "content-type": "application/json", "authorization": `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({ model, temperature: 0.2, messages: [
        { role: "system", content: "You are SPIRAL's AI R&D lead. Be pragmatic and implementation-minded." },
        { role: "user", content: prompt }
      ]})
    });
    const json = await res.json();
    const content = json.choices?.[0]?.message?.content?.trim() || "{}";
    const parsed = JSON.parse(content);
    
    // Ensure decision field exists and is valid
    if (!parsed.decision || !['INITIATE', 'WATCH', 'DISCARD'].includes(parsed.decision)) {
      parsed.decision = 'WATCH';
    }
    
    return parsed;
  } catch (e) {
    console.warn("LLM analyze failed:", e.message);
    return {
      title: item.title, url: item.link, source: item.sourceName, topic: item.topic,
      summary: item.contentSnippet || "", key_points: [],
      scores: { relevance_0_5: 3, impact_now_0_5: 2, impact_12mo_0_5: 3, effort_low_med_high: "med", legal_risk_low_med_high: "low" },
      recommendations: ["Manual review"], next_actions: [],
      decision: "WATCH", rationale: "LLM error; placed on watch."
    };
  }
}
function pickTop(items, n=10) {
  return [...items].sort((a,b)=>((b.scores?.relevance_0_5||0)+(b.scores?.impact_now_0_5||0)+(b.scores?.impact_12mo_0_5||0))-
                                 ((a.scores?.relevance_0_5||0)+(a.scores?.impact_now_0_5||0)+(a.scores?.impact_12mo_0_5||0))).slice(0,n);
}
function mdEscape(s){return String(s||"").replace(/\|/g,"\\|");}
function buildReportMD(dateISO, analyzed){
  const top = pickTop(analyzed, 10);
  let md = `# SPIRAL Technology Watch — ${dateISO}\n\nItems analyzed: ${analyzed.length}\n\n## Top Recommendations\n`;
  top.forEach((it,i)=>{ 
    md += `\n### ${i+1}. ${it.title}\n**Source**: ${it.source} • **Topic**: ${it.topic} • **Decision**: ${it.decision}\n\n${it.summary}\n\n**Key Points:**\n${(it.key_points||[]).map(p=>`- ${p}`).join('\n')}\n\n**Recommendations:**\n${(it.recommendations||[]).map(r=>`- ${r}`).join('\n')}\n\n**Scores:** Relevance ${it.scores?.relevance_0_5}/5, Impact Now ${it.scores?.impact_now_0_5}/5, Impact 12mo ${it.scores?.impact_12mo_0_5}/5, Effort ${it.scores?.effort_low_med_high}, Legal Risk ${it.scores?.legal_risk_low_med_high}\n\n[Read More](${it.url})\n\n---\n`;
  });
  
  const decisions = analyzed.reduce((acc,it)=>{ acc[it.decision] = (acc[it.decision]||0)+1; return acc; }, {});
  md += `\n## Summary\n\n| Decision | Count |\n|----------|-------|\n`;
  Object.entries(decisions).forEach(([decision, count])=>{ md += `| ${decision} | ${count} |\n`; });
  
  return md;
}

async function main() {
  console.log("🚀 SPIRAL TechWatch Agent Starting...");
  ensureDirs();
  
  const dateISO = new Date().toISOString().split('T')[0];
  const reportDir = path.join(REPORTS_DIR, dateISO);
  fs.mkdirSync(reportDir, { recursive: true });
  
  const sources = loadSources();
  const seenDB = loadDB();
  const newItems = [];
  
  console.log("🔍 SPIRAL TechWatch: Fetching from sources...");
  for (const [topic, srcList] of Object.entries(sources.sources)) {
    for (const src of srcList) {
      console.log(`  Fetching ${src.name}...`);
      const feed = await fetchFeed(src);
      if (!feed) continue;
      
      for (const item of feed.items) {
        const itemId = sha(item.link || item.guid || item.title);
        if (seenDB[itemId]) continue;
        
        const enriched = {
          ...item,
          sourceName: src.name,
          topic,
          itemId,
          fetchedAt: new Date().toISOString()
        };
        
        // Extract full text if possible
        if (item.link) {
          console.log(`    Extracting readable content from ${item.link.slice(0,50)}...`);
          enriched.readable = await extractReadable(item.link);
        }
        
        newItems.push(enriched);
        seenDB[itemId] = { seen: true, date: dateISO };
      }
    }
  }
  
  console.log(`📦 Collected ${newItems.length} new items for analysis`);
  
  if (newItems.length === 0) {
    console.log("✅ No new items to analyze");
    return;
  }
  
  console.log("🧠 SPIRAL TechWatch: Analyzing items for implementation decisions...");
  const analyzed = [];
  for (const item of newItems.slice(0, 20)) { // Limit to avoid rate limits
    console.log(`   Analyzing: ${item.title?.slice(0,60)}...`);
    const analysis = await analyzeLLM(item);
    analyzed.push(analysis);
    console.log(`   Decision: ${analysis.decision} (relevance: ${analysis.scores?.relevance_0_5}/5)`);
  }
  
  console.log("✅ Analysis complete");
  
  // Generate reports
  console.log("📊 SPIRAL TechWatch: Generating reports...");
  
  const reportMD = buildReportMD(dateISO, analyzed);
  const reportJSON = {
    generated: new Date().toISOString(),
    date: dateISO,
    platform: "SPIRAL Local Commerce Platform",
    total_items: analyzed.length,
    decisions: analyzed.reduce((acc,it)=>{ 
      const decision = (it.decision || 'WATCH').toLowerCase(); 
      acc[decision] = (acc[decision]||0)+1; 
      return acc; 
    }, {}),
    items: analyzed
  };
  
  fs.writeFileSync(path.join(reportDir, "report.md"), reportMD);
  fs.writeFileSync(path.join(reportDir, "report.json"), JSON.stringify(reportJSON, null, 2));
  
  console.log(`📊 SPIRAL TechWatch Report generated: ${reportDir}`);
  
  // Create implementation tickets for INITIATE items
  const initiateItems = analyzed.filter(it => it.decision === "INITIATE");
  if (initiateItems.length > 0) {
    const ticketsDir = path.join(ROOT, "tickets");
    fs.mkdirSync(ticketsDir, { recursive: true });
    
    for (const item of initiateItems) {
      const ticketMD = `# Implementation Ticket: ${item.title}

## Overview
**Source**: ${item.source}
**Topic**: ${item.topic}
**Decision**: ${item.decision}
**URL**: ${item.url}

## Analysis
${item.summary}

## Key Points
${(item.key_points||[]).map(p=>`- ${p}`).join('\n')}

## Recommendations
${(item.recommendations||[]).map(r=>`- ${r}`).join('\n')}

## Next Actions
${(item.next_actions||[]).map(a=>`- **${a.title}** (${a.owner_role}, ${a.eta_days} days)`).join('\n')}

## Scoring
- **Relevance**: ${item.scores?.relevance_0_5}/5
- **Impact Now**: ${item.scores?.impact_now_0_5}/5
- **Impact 12mo**: ${item.scores?.impact_12mo_0_5}/5
- **Effort**: ${item.scores?.effort_low_med_high}
- **Legal Risk**: ${item.scores?.legal_risk_low_med_high}

## Rationale
${item.rationale}

---
*Generated by SPIRAL AI R&D Agent - ${new Date().toISOString()}*
`;
      
      const ticketFile = path.join(ticketsDir, `${dateISO}-${item.itemId?.slice(0,8) || Date.now()}.md`);
      fs.writeFileSync(ticketFile, ticketMD);
    }
    
    console.log(`🎫 Created ${initiateItems.length} INITIATE tickets`);
  }
  
  // Save seen database
  saveDB(seenDB);
  
  // Summary
  const decisions = analyzed.reduce((acc,it)=>{ 
    const decision = it.decision || 'WATCH'; 
    acc[decision] = (acc[decision]||0)+1; 
    return acc; 
  }, {});
  console.log("📈 SPIRAL TechWatch Summary:");
  console.log(`   Total Items: ${analyzed.length}`);
  console.log(`   Ready to Implement: ${decisions.INITIATE || 0}`);
  console.log(`   Watching: ${decisions.WATCH || 0}`);
  console.log(`   Discarded: ${decisions.DISCARD || 0}`);
  console.log(`   Tickets Created: ${initiateItems.length}`);
  
  return {
    total: analyzed.length,
    decisions,
    initiateCount: initiateItems.length,
    reportPath: reportDir
  };
}

// Daemon mode with cron
if (process.argv.includes("--daemon") || process.env.TECHWATCH_DAEMON === "true") {
  const cron = await import("node-cron");
  console.log("🔄 SPIRAL TechWatch Agent running in daemon mode");
  // Run every 6 hours
  cron.schedule("0 */6 * * *", main);
  console.log("⏰ Scheduled to run every 6 hours");
} else {
  // Single run
  main().then(result => {
    console.log("✅ SPIRAL TechWatch Agent completed successfully");
    if (result) {
      console.log(`📊 Results: ${result.total} analyzed, ${result.initiateCount} tickets created`);
    }
    process.exit(0);
  }).catch(error => {
    console.error("❌ SPIRAL TechWatch Agent failed:", error);
    process.exit(1);
  });
}

export { main, analyzeLLM, pickTop };