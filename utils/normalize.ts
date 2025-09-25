export function normalizeProduct(p: any) {
  const DEFAULT_IMG = "/images/default.png";

  function resolveImage(raw?: string | null): string {
    if (!raw) return DEFAULT_IMG;
    if (raw.startsWith("http")) return raw;
    // normalize legacy paths to /images
    const cleaned = raw.replace(/^\/?(public-objects|static|public)?\/?/, "");
    return `/images/${cleaned}`;
  }

  const img = resolveImage(p.image || p.imageUrl || p.image_url);

  return {
    ...p,
    image: img,
    imageUrl: img,
    image_url: img,
  };
}