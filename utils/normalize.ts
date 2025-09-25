export function normalizeProduct(p: any) {
  const DEFAULT = "/images/default.png";

  function resolve(raw?: string | null) {
    if (!raw) return DEFAULT;
    if (raw.startsWith("http")) return raw;
    // Fix: Prevent double /images/ prefix
    if (raw.startsWith("/images/")) return raw;
    // normalize legacy prefixes to /images/
    const cleaned = raw.replace(/^\/?(public-objects|static|public)?\/?/, "");
    return `/images/${cleaned}`;
  }

  const img = resolve(p.image || p.imageUrl || p.image_url);

  return {
    ...p,
    image: img,
    imageUrl: img,
    image_url: img,
  };
}
