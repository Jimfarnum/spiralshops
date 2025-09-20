export function investorAuth(req, res, next){
  const token = process.env.INVESTOR_TOKEN || process.env.ADMIN_TOKEN || "";
  if (!token) return res.status(500).json({ error:"investor_token_not_set", hint:"Set INVESTOR_TOKEN (or ADMIN_TOKEN) env var" });
  const h = req.headers["x-investor-token"] || req.headers["x-admin-token"];
  const q = (req.query && (req.query.investor_token || req.query.admin_token)) || null;
  if (h === token || q === token) return next();
  return res.status(401).json({ error:"unauthorized", how:"Send X-Investor-Token header or ?investor_token=..." });
}