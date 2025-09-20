export async function getFlags() {
  try { const r = await fetch("/api/flags"); return await r.json(); } catch { return {}; }
}