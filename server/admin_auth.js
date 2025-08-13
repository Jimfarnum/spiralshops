export function adminAuth(req, res, next){
  const token = process.env.ADMIN_TOKEN || "";
  if (!token) return res.status(500).json({ error:"admin_token_not_set", hint:"Set ADMIN_TOKEN env var" });
  // Accept via header or query param for convenience
  const h = req.headers["x-admin-token"];
  const q = req.query && req.query.admin_token;
  if (h === token || q === token) return next();
  res.status(401).json({ error:"unauthorized", how:"Send X-Admin-Token header or ?admin_token=..." });
}