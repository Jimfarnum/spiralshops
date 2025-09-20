import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * SPIRAL AI R&D Agent - Core Analyzer
 * Mission: Continuously find tech that matters to SPIRAL, score it, produce actionable briefs, and initiate implementation tasks.
 */

async function callLLM(payload) {
  const body = {
    model: process.env.OPENAI_MODEL || "gpt-4o",
    messages: [
      { 
        role: "system", 
        content: "You are SPIRAL's AI R&D lead. Your job: analyze tech updates for a local-first, multi-retailer platform (malls, brick-and-mortar, unified multi-merchant cart). Be pragmatic, investor-ready, and implementation-minded. Focus on items that increase conversion/pickup usage, reduce cost/ops, strengthen local/mall differentiation, or de-risk security/compliance."
      },
      { role: "user", content: payload.prompt }
    ],
    temperature: 0.2
  };

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { 
        "content-type": "application/json", 
        authorization: `Bearer ${process.env.OPENAI_API_KEY}` 
      },
      body: JSON.stringify(body)
    });
    
    const json = await res.json();
    const content = json.choices?.[0]?.message?.content || "{}";
    
    // Clean JSON response
    let cleanContent = content.replace(/```json|```/g, '').trim();
    
    // Try to extract JSON if it's wrapped in text
    const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanContent = jsonMatch[0];
    }
    
    return JSON.parse(cleanContent);
  } catch (error) {
    console.error('LLM call failed:', error);
    throw error;
  }
}

export async function analyzeItem({ title, url, source, topic, text }) {
  const schema = `Return strict JSON with keys: title,url,source,topic,summary,key_points,scores:{relevance_0_5,impact_now_0_5,impact_12mo_0_5,effort_low_med_high,legal_risk_low_med_high},recommendations,next_actions:[{title,owner_role,eta_days}],decision,rationale.

Business rules: Favor items that (a) increase conversion or pickup usage, (b) reduce cost/ops, (c) strengthen local/mall differentiation, or (d) de-risk security/compliance.

Decision gates:
- INITIATE if: relevance ≥ 4 AND (impact_now ≥ 3 OR impact_12mo ≥ 4) AND legal_risk = low AND effort ∈ {low, med}
- WATCH if: relevance ≥ 3 AND (impact_12mo ≥ 3) but effort = high or uncertainty is high
- DISCARD if: relevance ≤ 2 OR legal_risk ≠ low OR duplicate`;

  const prompt = `Read the TEXT and META. ${schema}

TEXT:
${(text || "").slice(0, 12000)}

META:
title="${title}"
url="${url}"
source="${source}"
topic="${topic}"`;

  try {
    const result = await callLLM({ prompt });
    
    // Validate and ensure complete structure
    const validatedResult = {
      title: result?.title || title || "Unknown Item",
      url: result?.url || url || "",
      source: result?.source || source || "Unknown",
      topic: result?.topic || topic || "general",
      summary: result?.summary || (text || "").slice(0, 150),
      key_points: Array.isArray(result?.key_points) ? result.key_points : ["Analysis completed"],
      scores: {
        relevance_0_5: Number(result?.scores?.relevance_0_5) || 3,
        impact_now_0_5: Number(result?.scores?.impact_now_0_5) || 2,
        impact_12mo_0_5: Number(result?.scores?.impact_12mo_0_5) || 3,
        effort_low_med_high: result?.scores?.effort_low_med_high || "med",
        legal_risk_low_med_high: result?.scores?.legal_risk_low_med_high || "low"
      },
      recommendations: Array.isArray(result?.recommendations) ? result.recommendations : ["Review implementation"],
      next_actions: Array.isArray(result?.next_actions) ? result.next_actions : [{
        title: "Evaluate implementation",
        owner_role: "Tech Lead", 
        eta_days: 7
      }],
      decision: result?.decision || "WATCH",
      rationale: result?.rationale || "Standard analysis completed"
    };
    
    return validatedResult;
    
  } catch (e) {
    console.error('Analysis failed, using fallback:', e);
    // Comprehensive fallback structure
    return {
      title: title || "Unknown Item",
      url: url || "",
      source: source || "Unknown",
      topic: topic || "general",
      summary: (text || "Analysis failed").slice(0, 150),
      key_points: ["Manual review required due to analysis error"],
      scores: { 
        relevance_0_5: 3, 
        impact_now_0_5: 2, 
        impact_12mo_0_5: 3, 
        effort_low_med_high: "med", 
        legal_risk_low_med_high: "low" 
      },
      recommendations: ["Manual review required", "Re-analyze with updated prompts"],
      next_actions: [{
        title: "Manual review and re-analysis",
        owner_role: "Tech Lead",
        eta_days: 2
      }],
      decision: "WATCH",
      rationale: "LLM analysis error; placed on watch list for manual review. Error: " + (e.message || "Unknown error")
    };
  }
}

export function renderDigest(items) {
  const top = items
    .filter(item => item && item.scores) // Filter out invalid items
    .sort((a, b) => {
      const scoreA = (a.scores?.relevance_0_5 || 0) + (a.scores?.impact_now_0_5 || 0) + (a.scores?.impact_12mo_0_5 || 0);
      const scoreB = (b.scores?.relevance_0_5 || 0) + (b.scores?.impact_now_0_5 || 0) + (b.scores?.impact_12mo_0_5 || 0);
      return scoreB - scoreA;
    })
    .slice(0, 5);

  const lines = top.map((it, i) => {
    const nextActions = (it.next_actions || []).map(a => a?.title || "Unknown action").join("; ") || "—";
    return `${i + 1}. ${it.title || "Unknown"} — ${it.source || "Unknown"}\nDecision: ${it.decision || "PENDING"}\nNext: ${nextActions}\n${it.url || "No URL"}`;
  });

  return `*SPIRAL R&D Digest (Top 5)*\n\n${lines.join("\n\n")}`;
}

export function createTicketsLocally(items) {
  const dir = path.join(process.cwd(), "agents", "techwatch", "tickets");
  fs.mkdirSync(dir, { recursive: true });
  
  const validItems = items.filter(item => item && typeof item === 'object' && item.decision);
  const initiated = validItems.filter(i => i.decision === "INITIATE");
  
  initiated.forEach((it, idx) => {
    const body = [
      `# [INITIATE] ${it.title}`,
      ``,
      `## Why`,
      `${it.rationale || "Improves revenue/ops or de-risks compliance."}`,
      ``,
      `## Scope`,
      ...(it.recommendations || []).map(r => `- ${r}`),
      ``,
      `## Acceptance Criteria`,
      `- KPI impact measurable (conversion/pickup/operational costs)`,
      `- Security & privacy checks pass`,
      `- A/B testing framework implemented`,
      `- Mobile responsiveness verified`,
      ``,
      `## Implementation Details`,
      `**Priority**: ${it.scores.impact_now_0_5 >= 4 ? 'High' : 'Medium'}`,
      `**Effort**: ${it.scores.effort_low_med_high}`,
      `**Risk**: ${it.scores.legal_risk_low_med_high}`,
      ``,
      `## Next Actions`,
      ...(it.next_actions || []).map(a => `- ${a.title} (${a.owner_role}, ${a.eta_days} days)`),
      ``,
      `## Key Points`,
      ...(it.key_points || []).map(p => `- ${p}`),
      ``,
      `## Source`,
      `${it.source} — ${it.url}`,
      ``,
      `## Generated`,
      `${new Date().toISOString()}`
    ].join("\n");
    
    const filename = `ticket_${Date.now()}_${idx + 1}.md`;
    fs.writeFileSync(path.join(dir, filename), body);
  });
  
  return initiated.length;
}

export function generateReport(items) {
  const timestamp = new Date().toISOString().split('T')[0];
  const reportDir = path.join(process.cwd(), "agents", "techwatch", "reports", timestamp);
  
  fs.mkdirSync(reportDir, { recursive: true });
  
  // Filter valid items
  const validItems = items.filter(item => item && typeof item === 'object' && item.decision);
  
  // JSON Report
  const jsonReport = {
    generated: new Date().toISOString(),
    platform: "SPIRAL Local Commerce Platform",
    total_items: validItems.length,
    decisions: {
      initiate: validItems.filter(i => i.decision === "INITIATE").length,
      watch: validItems.filter(i => i.decision === "WATCH").length,
      discard: validItems.filter(i => i.decision === "DISCARD").length
    },
    items: validItems
  };
  
  fs.writeFileSync(path.join(reportDir, "report.json"), JSON.stringify(jsonReport, null, 2));
  
  // Markdown Report
  const markdownReport = generateMarkdownReport(validItems);
  fs.writeFileSync(path.join(reportDir, "report.md"), markdownReport);
  
  // Next Actions Report
  const nextActionsReport = generateNextActionsReport(validItems);
  fs.writeFileSync(path.join(reportDir, "next-actions.md"), nextActionsReport);
  
  console.log(`📊 SPIRAL R&D Report generated: ${reportDir}`);
  return reportDir;
}

function generateMarkdownReport(items) {
  const initiated = items.filter(i => i.decision === "INITIATE");
  const watched = items.filter(i => i.decision === "WATCH");
  const discarded = items.filter(i => i.decision === "DISCARD");
  
  return `# SPIRAL AI R&D Weekly Digest

**Generated**: ${new Date().toISOString()}
**Platform**: SPIRAL Local Commerce Platform

## Executive Summary

- **Total Items Analyzed**: ${items.length}
- **Ready for Implementation**: ${initiated.length}
- **Watching for Development**: ${watched.length}
- **Discarded**: ${discarded.length}

## Implementation Ready (INITIATE)

${initiated.map((item, i) => `
### ${i + 1}. ${item.title}

**Source**: ${item.source}
**URL**: ${item.url}

**Summary**: ${item.summary}

**Scores**: 
- Relevance: ${item.scores.relevance_0_5}/5
- Immediate Impact: ${item.scores.impact_now_0_5}/5
- 12-Month Impact: ${item.scores.impact_12mo_0_5}/5
- Effort: ${item.scores.effort_low_med_high}
- Legal Risk: ${item.scores.legal_risk_low_med_high}

**Key Points**:
${(item.key_points || []).map(p => `- ${p}`).join('\n')}

**Recommendations**:
${(item.recommendations || []).map(r => `- ${r}`).join('\n')}

**Next Actions**:
${(item.next_actions || []).map(a => `- ${a.title} (${a.owner_role}, ${a.eta_days} days)`).join('\n')}

**Rationale**: ${item.rationale}

---
`).join('')}

## Watch List

${watched.map((item, i) => `
### ${i + 1}. ${item.title}

**Source**: ${item.source}
**Summary**: ${item.summary}
**Rationale**: ${item.rationale}

`).join('')}

## Investment Perspective

The SPIRAL platform continues to identify and evaluate emerging technologies that strengthen our competitive position in local commerce. This systematic approach ensures we:

1. **Stay Ahead**: Proactive technology adoption vs reactive responses
2. **Measure Impact**: Every initiative tied to specific KPIs and ROI
3. **Manage Risk**: Systematic evaluation of legal and technical risks
4. **Execute Efficiently**: Clear ownership and timelines for implementation

**Recommendation**: Proceed with ${initiated.length} high-impact implementations while monitoring ${watched.length} emerging opportunities.
`;
}

function generateNextActionsReport(items) {
  const allActions = items
    .filter(i => i.decision === "INITIATE")
    .flatMap(item => (item.next_actions || []).map(action => ({
      ...action,
      item_title: item.title,
      item_source: item.source
    })));
  
  const actionsByRole = allActions.reduce((acc, action) => {
    const role = action.owner_role || 'Unassigned';
    if (!acc[role]) acc[role] = [];
    acc[role].push(action);
    return acc;
  }, {});
  
  let report = `# SPIRAL R&D Next Actions\n\n**Generated**: ${new Date().toISOString()}\n\n`;
  
  Object.entries(actionsByRole).forEach(([role, actions]) => {
    report += `## ${role}\n\n`;
    actions.forEach((action, i) => {
      report += `${i + 1}. **${action.title}** (${action.eta_days} days)\n`;
      report += `   - From: ${action.item_title}\n`;
      report += `   - Source: ${action.item_source}\n\n`;
    });
  });
  
  return report;
}