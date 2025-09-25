/**
 * SPIRAL Unified Product Normalization
 * Single source of truth for all product API responses
 */

export function normalizeProduct(p: any) {
  const imageUrl = p.image || p.imageUrl || "/images/default.png";
  
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    category: p.category,
    description: p.description,
    image: imageUrl,           // Original field
    imageUrl: imageUrl,        // camelCase compatibility
    image_url: imageUrl        // snake_case compatibility for external scripts
  };
}