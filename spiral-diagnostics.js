import fetch from "node-fetch";

const BASE_URL = process.env.BASE_URL || "https://27d4f357-044c-4271-84d2-b2bf67be7115-00-18jv7lspv4am.janeway.replit.dev";

// Endpoints to test
const endpoints = [
  { name: "Products", url: `${BASE_URL}/api/products` },
  { name: "Discover", url: `${BASE_URL}/api/discover` },
  { name: "Plans", url: `${BASE_URL}/api/plans` },
];

async function checkEndpoint({ name, url }) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.log(`❌ ${name} FAILED: ${res.status} ${res.statusText}`);
      return;
    }
    const data = await res.json();
    console.log(`✅ ${name} responded with ${data.length || "?"} items`);

    // Special focus: products & discover should have images
    if (name === "Products" || name === "Discover") {
      data.forEach((item, idx) => {
        if (!item.image) {
          console.log(`   ⚠️  Item ${idx + 1} missing image field`);
        } else if (!item.image.startsWith("http")) {
          console.log(`   ❌ Item ${idx + 1} has invalid image: ${item.image}`);
        } else {
          console.log(`   ✅ Item ${idx + 1} image OK: ${item.image}`);
        }
      });
    }

    // Plans should have Stripe price IDs
    if (name === "Plans") {
      data.forEach((plan) => {
        if (!plan.id || !plan.id.startsWith("price_")) {
          console.log(`   ❌ Plan "${plan.name}" has bad/missing Price ID: ${plan.id}`);
        } else {
          console.log(`   ✅ Plan "${plan.name}" Price ID OK: ${plan.id}`);
        }
      });
    }
  } catch (err) {
    console.error(`💥 Error testing ${name}:`, err.message);
  }
}

async function runDiagnostics() {
  console.log("🔎 Running SPIRAL Platform Diagnostics...");
  for (const ep of endpoints) {
    await checkEndpoint(ep);
  }
  console.log("✅ Diagnostics finished.");
}

runDiagnostics();