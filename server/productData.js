// server/productData.js
import { productDB } from '../dataLoader.js';

// Enhanced product data with additional fields for SPIRAL platform
const enhancedProductDB = productDB.map((product, index) => ({
  ...product,
  id: index + 1,
  storeId: Math.floor(Math.random() * 5) + 1, // Random store assignment
  description: `High-quality ${product.name.toLowerCase()} available at local SPIRAL verified stores.`,
  inStock: Math.random() > 0.1, // 90% in stock
  stockLevel: Math.floor(Math.random() * 50) + 10,
  ratings: {
    average: parseFloat((Math.random() * 2 + 3).toFixed(1)), // 3.0-5.0 rating
    count: Math.floor(Math.random() * 100) + 5
  },
  spiralPoints: Math.floor(product.price * 0.05), // 5% of price in SPIRAL points
  tags: [product.category.toLowerCase(), 'local', 'verified'],
  verified: true,
  imageUrl: `/api/placeholder/300/300?text=${encodeURIComponent(product.name)}`,
  lastUpdated: new Date().toISOString()
}));

// Categories with counts
const categories = enhancedProductDB.reduce((acc, product) => {
  if (!acc[product.category]) {
    acc[product.category] = { name: product.category, count: 0, products: [] };
  }
  acc[product.category].count++;
  acc[product.category].products.push(product);
  return acc;
}, {});

export { enhancedProductDB as products, categories };