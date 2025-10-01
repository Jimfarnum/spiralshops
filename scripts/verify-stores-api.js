import fetch from "node-fetch";

(async () => {
  try {
    const res = await fetch("http://localhost:5000/api/stores");
    const json = await res.json();
    if (json.status === "ok") {
      console.log(`✅ Stores API verified: ${json.count} stores returned`);
    } else {
      console.error("❌ Stores API returned error payload", json);
      process.exit(1);
    }
  } catch (e) {
    console.error("❌ Stores API verification failed:", e.message);
    process.exit(1);
  }
})();