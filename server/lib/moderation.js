export const BLOCKED_CATEGORIES = [
  "cannabis","thc","marijuana","weed","firearm","gun","ammo",
  "adult","porn","explicit","human parts","animal parts",
  "ivory","endangered","counterfeit","illegal"
];

export function complianceCheck(text) {
  const t = (text || "").toLowerCase();
  for (const term of BLOCKED_CATEGORIES) {
    if (t.includes(term)) return { ok: false, reason: `Restricted: ${term}` };
  }
  return { ok: true };
}