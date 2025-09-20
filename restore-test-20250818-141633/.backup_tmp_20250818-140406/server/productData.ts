// server/productData.ts
import { dataService } from './dataService.ts';

// Async function to initialize and load product data
async function initializeProductData() {
  await dataService.initialize();
  const productList = await dataService.getProductList();

  // Transform the product data to match expected format
  const productDB: any[] = [];
  let productIdCounter = 1;

  productList.forEach(category => {
    if (category.products && Array.isArray(category.products)) {
      category.products.forEach((product: any) => {
        productDB.push({
          id: productIdCounter++,
          name: product['Product Name'],
          price: product['Price ($)'],
          category: category.category
        });
      });
    }
  });

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
  }, {} as any);

  return { products: enhancedProductDB, categories };
}

// Export function to get products (lazy-loaded)
let cachedData: { products: any[], categories: any } | null = null;

export async function getProducts() {
  if (!cachedData) {
    cachedData = await initializeProductData();
  }
  return cachedData.products;
}

export async function getCategories() {
  if (!cachedData) {
    cachedData = await initializeProductData();
  }
  return cachedData.categories;
}

// Legacy exports for compatibility
export const initializeData = initializeProductData;