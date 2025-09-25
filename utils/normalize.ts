/**
 * normalizeProduct
 * ----------------
 * Ensures every product object returned by the API has consistent image fields.
 * - Always returns `image`, `imageUrl`, and `image_url`
 * - Rewrites legacy "/public-objects/" paths into "/images/"
 * - Falls back to "/images/default.png" if no image is provided
 */
export function normalizeProduct(p: any) {
  const baseImage =
    (p.image && p.image.replace("/public-objects/", "/images/")) ||
    "/images/default.png";

  return {
    id: p.id,
    name: p.name,
    price: p.price,
    image: baseImage,
    imageUrl: baseImage,
    image_url: baseImage,
  };
}