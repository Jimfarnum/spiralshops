import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";

const CONFIG = JSON.parse(fs.readFileSync("./scripts/nav_audit.config.json", "utf8"));

const ts = new Date().toISOString().replace(/[:.]/g, "-");
const outDir = "docs/reports";
const shotsDir = "screenshots";
const mdPath = `${outDir}/nav_audit_${ts}.md`;
const csvPath = `${outDir}/nav_audit_${ts}.csv`;

// Ensure directories exist
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
if (!fs.existsSync(shotsDir)) fs.mkdirSync(shotsDir, { recursive: true });

function normalize(s){ return (s||"").toLowerCase(); }

async function checkOne(page, baseUrl, item, formFactor) {
  const url = new URL(item.path, baseUrl).toString();
  const result = {
    baseUrl, label: item.label, path: item.path, formFactor,
    url, status: "", loadOk: false, expectationOk: false,
    title: "", finalUrl: "", error: "", screenshot: ""
  };

  let lastResponse = null;
  page.removeAllListeners("response");
  page.on("response", (res) => { if (res.url() === url) lastResponse = res; });

  try {
    console.log(`Testing ${formFactor}: ${item.label} -> ${item.path}`);
    
    const resp = await page.goto(url, { waitUntil: "domcontentloaded", timeout: CONFIG.timeoutMs });
    const code = resp ? resp.status() : 0;
    result.status = String(code);
    result.finalUrl = page.url();

    // Accept redirect chains (e.g., auth)
    if (CONFIG.allowRedirects && code >= 300 && code <= 399) {
      // Wait a bit for redirects to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Treat any non-error main frame load as okay up to max OK status
    result.loadOk = code > 0 && code <= CONFIG.httpOkStatusMax;

    // Page content expectations (any of the words)
    const content = normalize(await page.content());
    const title = await page.title();
    result.title = title;

    const expected = (item.expect || []).map(normalize);
    result.expectationOk = expected.length === 0
      ? true
      : expected.some(e => content.includes(e));

    // If either failed, capture screenshot
    if (!(result.loadOk && result.expectationOk)) {
      const shotName = `fail_${item.label.replace(/\s+/g,"-")}_${formFactor}_${ts}.png`;
      const shotPath = path.join(shotsDir, shotName);
      await page.screenshot({ path: shotPath, fullPage: true });
      result.screenshot = shotPath;
      console.log(`❌ Failed: ${item.label} (${result.loadOk ? 'Content' : 'Load'} issue)`);
    } else {
      console.log(`✅ Passed: ${item.label}`);
    }
  } catch (e) {
    result.error = (e && e.message) ? e.message : String(e);
    const shotName = `error_${item.label.replace(/\s+/g,"-")}_${formFactor}_${ts}.png`;
    const shotPath = path.join(shotsDir, shotName);
    try { 
      await page.screenshot({ path: shotPath, fullPage: true }); 
      result.screenshot = shotPath;
    } catch {}
    console.log(`💥 Error: ${item.label} - ${result.error}`);
  }
  return result;
}

async function runFormFactor(browser, baseUrl, items, formFactor, viewport) {
  console.log(`\n🔍 Testing ${formFactor.toUpperCase()} (${viewport.width}x${viewport.height})`);
  
  const page = await browser.newPage();
  await page.setViewport(viewport);
  
  if (viewport.isMobile) {
    await page.setUserAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1");
  }

  const results = [];
  for (const item of items) {
    // Small delay to avoid rate limits
    await new Promise(r => setTimeout(r, 200));
    results.push(await checkOne(page, baseUrl, item, formFactor));
  }
  await page.close();
  return results;
}

function writeReports(all) {
  // CSV
  const headers = ["baseUrl","label","path","formFactor","url","status","loadOk","expectationOk","title","finalUrl","error","screenshot"];
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
  const md = [
    `# SPIRAL Navigation Audit Report`,
    `**Timestamp:** ${ts}`,
    `**Platform:** SPIRAL Local Commerce Platform`,
    ``,
    `## Summary`,
    `- Total tests: ${all.length}`,
    `- Passed: ${all.filter(r => r.loadOk && r.expectationOk).length}`,
    `- Failed: ${all.filter(r => !(r.loadOk && r.expectationOk)).length}`,
    ``,
    `## Detailed Results`,
    ``,
    `| Site | Navigation | Path | View | HTTP | Load | Content | Title | Notes | Screenshot |`,
    `|------|-----------|------|------|------|------|---------|-------|-------|------------|`
  ];
  
  for (const r of all) {
    const okLoad = r.loadOk ? "✅" : "❌";
    const okExp  = r.expectationOk ? "✅" : "❌";
    const note = r.error ? `**Error:** ${r.error}` : (r.title ? r.title.substring(0, 50) : "");
    const shot = r.screenshot ? `[Screenshot](${r.screenshot})` : "";
    md.push(`| ${r.baseUrl} | ${r.label} | ${r.path} | ${r.formFactor} | ${r.status} | ${okLoad} | ${okExp} | ${note} | ${shot} |`);
  }
  
  // Add failure analysis
  const failures = all.filter(r => !(r.loadOk && r.expectationOk));
  if (failures.length > 0) {
    md.push(``, `## Failure Analysis`, ``);
    failures.forEach(f => {
      md.push(`### ${f.label} (${f.formFactor})`);
      md.push(`- **Path:** ${f.path}`);
      md.push(`- **Status:** ${f.status}`);
      md.push(`- **Load OK:** ${f.loadOk ? 'Yes' : 'No'}`);
      md.push(`- **Content OK:** ${f.expectationOk ? 'Yes' : 'No'}`);
      if (f.error) md.push(`- **Error:** ${f.error}`);
      if (f.screenshot) md.push(`- **Screenshot:** ${f.screenshot}`);
      md.push(``);
    });
  }
  
  fs.writeFileSync(mdPath, md.join("\n"));
}

(async () => {
  console.log("🚀 Starting SPIRAL Navigation Audit...");
  console.log(`📊 Testing ${CONFIG.navItems.length} navigation items across ${CONFIG.baseUrls.length} base URL(s)`);

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox","--disable-setuid-sandbox"]
  });

  const allResults = [];
  for (const baseUrl of CONFIG.baseUrls) {
    console.log(`\n🌐 Testing Base URL: ${baseUrl}`);
    
    // Desktop
    const desk = await runFormFactor(browser, baseUrl, CONFIG.navItems, "desktop", CONFIG.desktopViewport);
    allResults.push(...desk);
    
    // Mobile
    const mob = await runFormFactor(browser, baseUrl, CONFIG.navItems, "mobile", CONFIG.mobileViewport);
    allResults.push(...mob);
  }

  await browser.close();
  writeReports(allResults);

  console.log("\n✅ Navigation audit complete!");
  console.log(`📄 Markdown report: ${mdPath}`);
  console.log(`📊 CSV report: ${csvPath}`);
  
  const fails = allResults.filter(r => !(r.loadOk && r.expectationOk)).length;
  const passes = allResults.filter(r => r.loadOk && r.expectationOk).length;
  
  console.log(`\n📈 Results: ${passes}/${allResults.length} tests passed`);
  
  if (fails > 0) {
    console.log(`⚠️  ${fails} item(s) need attention. Check screenshots/ and the detailed report.`);
    process.exitCode = 1; // Non-zero to surface failures in CI
  } else {
    console.log("🎉 All navigation tests passed!");
  }
})();