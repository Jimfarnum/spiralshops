import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";
import { ensureDirs, ts, safeWriteJSON, slug, wait } from "./utils.js";

export async function captureFunnel({ domain, mode, outDir }) {
  ensureDirs(outDir, path.join(outDir,"shots"));
  const browser = await puppeteer.launch({
    headless: process.env.FUNNEL_HEADLESS !== "false",
    args: ["--no-sandbox","--disable-setuid-sandbox","--disable-dev-shm-usage"]
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 900 });

  const records = [];
  async function record(stage, note){
    const fn = `${stage}_${Date.now()}.png`;
    const fp = path.join(outDir,"shots", fn);
    await page.screenshot({ path: fp, fullPage: true });
    const url = page.url();
    const title = await page.title().catch(()=> "");
    records.push({ ts: ts(), stage, note, url, title, shot: `shots/${fn}` });
  }

  // Helpers
  async function gotoSafe(url){
    try { await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 }); }
    catch { /* ignore */ }
    await wait(1200);
  }

  // Basic exploration (homepage → search → product → cart → checkout)
  const base = `https://${domain}`;
  await gotoSafe(base);
  await record("home", "Landed on homepage");

  // Search for a simple term that exists on all: "gift card"
  // (low-risk product page that exposes standard PDP/checkout flows)
  try {
    // generic search selectors (fall back heuristics)
    const searchSel = ['input[type="search"]','input[name="q"]','input[name="search"]','input[id*="search"]'];
    let found = false;
    for (const sel of searchSel) {
      const el = await page.$(sel);
      if (el) { await el.click({ clickCount: 3 }).catch(()=>{});
        await page.type(sel, "gift card", { delay: 20 });
        await page.keyboard.press("Enter"); found = true; break; }
    }
    if (found) {
      await page.waitForTimeout(2000);
      await record("search", "Search results page (heuristic)");
    }
  } catch { /* ignore */ }

  // Click first product-like link
  try {
    const firstLink = await page.$('a[href*="/gp/"], a[href*="/p/"], a[href*="/ip/"], a[href*="/products/"], a[href*="/product/"]');
    if (firstLink) {
      await firstLink.click(); await page.waitForTimeout(2000);
      await record("pdp", "Product detail page (heuristic)");
    }
  } catch {}

  // Add to cart (if button present)
  try {
    const addSel = ['button[name="add"], button[id*="add"], button[aria-label*="Add to cart"], button:has-text("Add to cart")'];
    for (const sel of addSel) {
      const btn = await page.$(sel);
      if (btn) { await btn.click(); await page.waitForTimeout(1500); await record("add_to_cart","Clicked Add to cart"); break; }
    }
  } catch {}

  // View cart / mini-cart
  try {
    const cartSel = ['a[href*="cart"]','button[aria-label*="cart"]','a:has-text("Cart")'];
    for (const sel of cartSel) {
      const el = await page.$(sel);
      if (el) { await el.click(); await page.waitForTimeout(2000); await record("cart","Cart or mini-cart"); break; }
    }
  } catch {}

  // Try proceed to checkout (stop before payment)
  try {
    const checkoutSel = ['a[href*="checkout"]','button[name*="checkout"]','button:has-text("Checkout")'];
    for (const sel of checkoutSel) {
      const el = await page.$(sel);
      if (el) { await el.click(); await page.waitForTimeout(2500); await record("checkout_pre_auth","Reached pre-auth checkout"); break; }
    }
  } catch {}

  // Capture common persuasion elements (popups, banners)
  const persuasion = await page.evaluate(()=>{
    const textOf = (el)=> (el?.innerText||"").trim();
    const q = (s)=> Array.from(document.querySelectorAll(s));
    const banners = q('[role="alert"], .banner, .promo, .announcement').map(e=>textOf(e)).filter(Boolean);
    const popups  = q('[role="dialog"], .modal, .popup').map(e=>textOf(e)).filter(Boolean);
    const ctas    = q('button, a').map(e=>textOf(e)).filter(t=>t && t.length<70 && /add|buy|start|join|try|get|learn|shop|subscribe/i.test(t));
    return { banners, popups, ctas: Array.from(new Set(ctas)).slice(0,25) };
  }).catch(()=>({banners:[],popups:[],ctas:[]}));

  await record("end","End of capture session (non-invasive)");
  const out = { domain, mode, started_at: records[0]?.ts, finished_at: ts(), records, persuasion };
  safeWriteJSON(path.join(outDir, `capture_${slug(domain)}.json`), out);

  await browser.close();
  return out;
}