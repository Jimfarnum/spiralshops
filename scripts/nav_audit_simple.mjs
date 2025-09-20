import fs from "fs";
import path from "path";

const CONFIG = JSON.parse(fs.readFileSync("./scripts/nav_audit.config.json", "utf8"));

const ts = new Date().toISOString().replace(/[:.]/g, "-");
const outDir = "docs/reports";
const mdPath = `${outDir}/nav_audit_simple_${ts}.md`;
const csvPath = `${outDir}/nav_audit_simple_${ts}.csv`;

// Ensure directories exist
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function normalize(s){ return (s||"").toLowerCase(); }

async function testUrl(baseUrl, item) {
  const url = new URL(item.path, baseUrl).toString();
  const result = {
    baseUrl, 
    label: item.label, 
    path: item.path,
    url, 
    status: "", 
    loadOk: false, 
    expectationOk: false,
    title: "", 
    finalUrl: "", 
    error: "",
    responseTime: 0
  };

  try {
    console.log(`Testing: ${item.label} -> ${item.path}`);
    
    const startTime = Date.now();
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'SPIRAL Navigation Audit Bot',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      redirect: 'follow'
    });
    
    result.responseTime = Date.now() - startTime;
    result.status = String(response.status);
    result.finalUrl = response.url;
    result.loadOk = response.status >= 200 && response.status <= CONFIG.httpOkStatusMax;

    if (result.loadOk) {
      const content = await response.text();
      const contentLower = normalize(content);
      
      // Extract title from HTML
      const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/i);
      result.title = titleMatch ? titleMatch[1].trim() : "";

      // Check content expectations
      const expected = (item.expect || []).map(normalize);
      result.expectationOk = expected.length === 0
        ? true
        : expected.some(e => contentLower.includes(e));

      if (result.expectationOk) {
        console.log(`✅ Passed: ${item.label} (${result.status}) - ${result.responseTime}ms`);
      } else {
        console.log(`❌ Content Failed: ${item.label} (${result.status}) - Expected: ${expected.join(', ')}`);
      }
    } else {
      console.log(`❌ Load Failed: ${item.label} (${result.status})`);
    }
  } catch (e) {
    result.error = (e && e.message) ? e.message : String(e);
    console.log(`💥 Error: ${item.label} - ${result.error}`);
  }

  return result;
}

function writeReports(all) {
  // CSV
  const headers = ["baseUrl","label","path","url","status","loadOk","expectationOk","title","finalUrl","error","responseTime"];
  const rows = [headers.join(",")];
  for (const r of all) {
    const vals = headers.map(h => {
      const v = r[h] ?? "";
      const w = String(v).replace(/"/g,'""');
      return `"${w}"`;
    });
    rows.push(vals.join(","));
  }
  fs.writeFileSync(csvPath, rows.join("\n"));

  // Markdown
  const totalTests = all.length;
  const passed = all.filter(r => r.loadOk && r.expectationOk).length;
  const failed = totalTests - passed;
  const avgResponseTime = Math.round(all.reduce((sum, r) => sum + r.responseTime, 0) / totalTests);

  const md = [
    `# SPIRAL Navigation Audit Report (Simple)`,
    `**Timestamp:** ${ts}`,
    `**Platform:** SPIRAL Local Commerce Platform`,
    ``,
    `## Summary`,
    `- Total tests: ${totalTests}`,
    `- ✅ Passed: ${passed}`,
    `- ❌ Failed: ${failed}`,
    `- Average response time: ${avgResponseTime}ms`,
    `- Success rate: ${Math.round((passed/totalTests)*100)}%`,
    ``,
    `## Detailed Results`,
    ``,
    `| Navigation | Path | Status | Load | Content | Response Time | Title | Notes |`,
    `|-----------|------|--------|------|---------|---------------|-------|-------|`
  ];
  
  for (const r of all) {
    const okLoad = r.loadOk ? "✅" : "❌";
    const okExp  = r.expectationOk ? "✅" : "❌";
    const note = r.error ? `**Error:** ${r.error}` : "";
    const title = r.title ? r.title.substring(0, 40) + (r.title.length > 40 ? "..." : "") : "";
    md.push(`| ${r.label} | ${r.path} | ${r.status} | ${okLoad} | ${okExp} | ${r.responseTime}ms | ${title} | ${note} |`);
  }
  
  // Add failure analysis
  const failures = all.filter(r => !(r.loadOk && r.expectationOk));
  if (failures.length > 0) {
    md.push(``, `## Failure Analysis`, ``);
    failures.forEach(f => {
      md.push(`### ❌ ${f.label}`);
      md.push(`- **Path:** ${f.path}`);
      md.push(`- **Status:** ${f.status}`);
      md.push(`- **Load OK:** ${f.loadOk ? 'Yes' : 'No'}`);
      md.push(`- **Content OK:** ${f.expectationOk ? 'Yes' : 'No'}`);
      md.push(`- **Response Time:** ${f.responseTime}ms`);
      if (f.error) md.push(`- **Error:** ${f.error}`);
      if (f.title) md.push(`- **Page Title:** ${f.title}`);
      md.push(``);
    });
  }

  // Add performance analysis
  md.push(`## Performance Analysis`, ``);
  const sortedByTime = [...all].sort((a, b) => b.responseTime - a.responseTime);
  md.push(`### Slowest Endpoints`, ``);
  sortedByTime.slice(0, 5).forEach((r, i) => {
    md.push(`${i + 1}. **${r.label}** - ${r.responseTime}ms (${r.path})`);
  });
  
  md.push(``, `### Fastest Endpoints`, ``);
  sortedByTime.slice(-5).reverse().forEach((r, i) => {
    md.push(`${i + 1}. **${r.label}** - ${r.responseTime}ms (${r.path})`);
  });
  
  fs.writeFileSync(mdPath, md.join("\n"));
}

(async () => {
  console.log("🚀 Starting SPIRAL Navigation Audit (Simple)...");
  console.log(`📊 Testing ${CONFIG.navItems.length} navigation items across ${CONFIG.baseUrls.length} base URL(s)`);

  const allResults = [];
  for (const baseUrl of CONFIG.baseUrls) {
    console.log(`\n🌐 Testing Base URL: ${baseUrl}`);
    
    for (const item of CONFIG.navItems) {
      // Small delay to avoid overwhelming the server
      await new Promise(r => setTimeout(r, 100));
      const result = await testUrl(baseUrl, item);
      allResults.push(result);
    }
  }

  writeReports(allResults);

  console.log("\n✅ Navigation audit complete!");
  console.log(`📄 Markdown report: ${mdPath}`);
  console.log(`📊 CSV report: ${csvPath}`);
  
  const fails = allResults.filter(r => !(r.loadOk && r.expectationOk)).length;
  const passes = allResults.filter(r => r.loadOk && r.expectationOk).length;
  
  console.log(`\n📈 Final Results: ${passes}/${allResults.length} tests passed`);
  
  if (fails > 0) {
    console.log(`⚠️  ${fails} item(s) need attention. Check the detailed report.`);
    process.exitCode = 1;
  } else {
    console.log("🎉 All navigation tests passed!");
  }
})();