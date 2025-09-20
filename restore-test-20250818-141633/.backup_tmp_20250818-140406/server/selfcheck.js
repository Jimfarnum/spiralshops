export async function runSelfCheck(base, token) {
  const results = [];
  const headersAdmin = token ? { "X-Admin-Token": token } : {};
  let pass = true;

  async function t(name, fn) {
    const item = { name, pass: false, detail: null };
    try { 
      item.detail = await fn(); 
      item.pass = true; 
    }
    catch (e) { 
      item.detail = String(e?.message || e); 
      item.pass = false; 
    }
    results.push(item); 
    if (!item.pass) pass = false;
  }

  // 1) Health heartbeat
  await t("Health heartbeat", async () => {
    const r = await fetch(base + "/api/health");
    const j = await r.json();
    if (!j.success) throw new Error("health check failed");
    return { status: j.data.status, uptime: j.data.uptime };
  });

  // 2) Operations Summary
  await t("Operations summary", async () => {
    const r = await fetch(base + "/api/admin/ops-summary", { headers: headersAdmin });
    const j = await r.json();
    if (!j.success) throw new Error("ops summary failed");
    return { 
      retailers: j.data.retailers, 
      skus: j.data.skus, 
      serviceable_zips: j.data.serviceable_zips,
      pickup_centers: j.data.pickup_centers
    };
  });

  // 3) Admin gate (unauthorized)
  await t("Admin auth blocks unauthorized", async () => {
    const r = await fetch(base + "/api/admin/ops-summary");
    if (r.status !== 401) throw new Error("expected 401, got " + r.status);
    return { status: r.status, blocked: true };
  });

  // 4) Product API availability
  await t("Products API responding", async () => {
    const r = await fetch(base + "/api/products");
    const j = await r.json();
    if (!Array.isArray(j.products)) throw new Error("products not array");
    return { count: j.products.length, first_product: j.products[0]?.name };
  });

  // 5) Stores API with location data
  await t("Stores API with locations", async () => {
    const r = await fetch(base + "/api/stores");
    const j = await r.json();
    if (!j.success || !Array.isArray(j.data.stores)) throw new Error("stores API failed");
    const withLocation = j.data.stores.filter(s => s.latitude && s.longitude);
    return { total_stores: j.data.stores.length, with_location: withLocation.length };
  });

  // 6) Continental US search functionality
  await t("Continental US search working", async () => {
    const r = await fetch(base + "/api/location-search-continental-us?scope=all&category=");
    const j = await r.json();
    if (!j.success || !Array.isArray(j.stores)) throw new Error("continental search failed");
    return { found_stores: j.stores.length, query_time: j.query_time };
  });

  // 7) AI recommendation system
  await t("AI recommendations responding", async () => {
    const r = await fetch(base + "/api/recommend");
    const j = await r.json();
    if (!j.success || !Array.isArray(j.data.recommendations)) throw new Error("AI recommendations failed");
    return { recommendations_count: j.data.recommendations.length };
  });

  // 8) Featured products endpoint
  await t("Featured products available", async () => {
    const r = await fetch(base + "/api/products/featured");
    const j = await r.json();
    if (!j.success || !Array.isArray(j.products)) throw new Error("featured products failed");
    return { featured_count: j.products.length };
  });

  // 9) Mall events system
  await t("Mall events system active", async () => {
    const r = await fetch(base + "/api/mall-events");
    const j = await r.json();
    if (!j.success || !Array.isArray(j.events)) throw new Error("mall events failed");
    return { events_count: j.events.length };
  });

  // 10) Promotions system
  await t("Promotions system working", async () => {
    const r = await fetch(base + "/api/promotions");
    const j = await r.json();
    if (!j.success || !Array.isArray(j.promotions)) throw new Error("promotions failed");
    return { promotions_count: j.promotions.length };
  });

  return { pass, results, generated_at: new Date().toISOString(), test_count: results.length };
}