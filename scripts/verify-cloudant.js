(async function () {
  try {
    const url = process.env.CLOUDANT_URL || "";
    const apikey = process.env.CLOUDANT_APIKEY || "";
    const out = (k,v) => console.log(`${k}: ${v}`);

    console.log("=== Cloudant Verification ===");
    out("CLOUDANT_URL", url ? "[SET]" : "[MISSING]");
    out("CLOUDANT_APIKEY", apikey ? "[SET]" : "[MISSING]");

    if (!url) { console.log("❌ CLOUDANT_URL not set"); process.exit(2); }
    if (!/^https:\/\//i.test(url)) { console.log("❌ CLOUDANT_URL must start with https://"); process.exit(2); }

    // Parse origin (works whether URL includes creds or not)
    const u = new URL(url);
    const origin = `${u.protocol}//${u.host}`;
    console.log("→ Origin:", origin);

    // 1) Reachability (/_up does NOT require auth)
    const upRes = await fetch(`${origin}/_up`).catch(()=>null);
    if (!upRes) { console.log("❌ Could not reach Cloudant origin"); process.exit(2); }
    console.log("/_up:", upRes.status, upRes.ok ? "OK" : "NOT OK");

    if (!upRes.ok) {
      console.log("❌ Cloudant origin reachable but not OK; check account/region");
      process.exit(2);
    }

    // 2) If URL has inline creds, try an authenticated call to _all_dbs
    let hasInlineCreds = !!(u.username && u.password);
    if (hasInlineCreds) {
      const res = await fetch(`${origin}/_all_dbs`, {
        headers: { "Authorization": "Basic " + Buffer.from(`${u.username}:${u.password}`).toString("base64") }
      }).catch(()=>null);
      if (res && res.ok) {
        console.log("🔐 Auth OK via inline credentials (/ _all_dbs)");
      } else {
        console.log("⚠️ Inline creds present but _all_dbs not OK (may be IAM key setup instead)—this is not fatal if app uses IAM.");
      }
    } else {
      if (apikey) {
        console.log("🔑 Using IAM API key (app code must handle IAM auth).");
      } else {
        console.log("⚠️ No inline creds and no API key — app may fail when DB is used.");
      }
    }

    console.log("✅ CLOUDANT_URL format & reachability look good.");
  } catch (e) {
    console.error("❌ Cloudant verifier error:", e?.message || e);
    process.exit(2);
  }
})();
