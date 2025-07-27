// dataLoader.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// OPTIONAL: Set to true to upload to Cloudant
const UPLOAD_TO_CLOUDANT = false;

// === CONFIG: Cloudant Credentials ===
const CLOUDANT_API_KEY = process.env.CLOUDANT_API_KEY;
const CLOUDANT_URL = process.env.CLOUDANT_URL; // e.g., https://your-account.cloudant.com
const DB_NAME = 'spiral-products';

// === STEP 1: Load JSON Product File ===
const filePath = path.join(__dirname, './data/spiral_sample_products.json');
const rawData = fs.readFileSync(filePath, 'utf8');
const productList = JSON.parse(rawData);

// === STEP 2: Initialize In-Memory Mock Database ===

// Realistic store names based on location, products, and business type
const storesByCategory = {
  'Electronics': [
    'Twin Cities Tech Hub',
    'Minneapolis Electronics Center', 
    'Lakewood Digital Store',
    'Uptown Gadget Gallery',
    'Highland Tech Solutions',
    'Northeast Electronics Co.',
    'St. Paul Tech Repair',
    'Como Park Computing'
  ],
  'Clothing': [
    'North Loop Fashion Co.',
    'Stillwater Style Boutique',
    'Grand Avenue Threads',
    'Minnehaha Wardrobe',
    'Como Park Clothing',
    'Edina Fashion House',
    'Linden Hills Apparel',
    'Crocus Hill Couture'
  ],
  'Food & Beverage': [
    'Mississippi River Coffee',
    'Lyndale Avenue Roasters',
    'Northeast Minneapolis Café',
    'St. Paul Brew House',
    'Lake Harriet Coffee Co.',
    'Uptown Bean Counter',
    'Highland Park Roastery',
    'Como Neighborhood Café'
  ],
  'Beauty': [
    'Edina Beauty Collective',
    'Bloomington Skincare Studio',
    'Roseville Cosmetics Corner',
    'Plymouth Beauty Boutique',
    'Woodbury Wellness & Beauty',
    'Grand Avenue Glamour',
    'Minnetonka Beauty Bar',
    'St. Anthony Skincare'
  ],
  'Home': [
    'Cedar Riverside Home Goods',
    'Falcon Heights Furniture',
    'Burnsville Home Essentials',
    'Apple Valley Living Store',
    'Minnetonka Home Design',
    'Highland Park Interiors',
    'Como Park Home & Garden',
    'Linden Hills Living'
  ],
  'Books': [
    'University Avenue Books',
    'Linden Hills Literary',
    'St. Anthony Main Bookstore',
    'Crocus Hill Reading Corner',
    'Prospect Park Books & More',
    'Grand Avenue Books',
    'Highland Park Library Store',
    'Como Reading Nook'
  ],
  'Sports': [
    'Lake Calhoun Outfitters',
    'Minnetonka Athletic Gear',
    'St. Louis Park Sports',
    'Richfield Recreation Store',
    'Eden Prairie Active Wear',
    'Uptown Athletic Co.',
    'Northeast Sports Zone',
    'Highland Fitness Gear'
  ],
  'Jewelry': [
    'Downtown Minneapolis Jewelers',
    'Excelsior Fine Jewelry',
    'Wayzata Gem Gallery',
    'Chanhassen Jewelry Studio',
    'White Bear Lake Diamonds',
    'Grand Avenue Gems',
    'Highland Precious Metals',
    'Como Lake Jewelry'
  ],
  'Coffee': [
    'Mississippi River Coffee',
    'Lyndale Avenue Roasters',
    'Northeast Minneapolis Café',
    'St. Paul Brew House',
    'Lake Harriet Coffee Co.',
    'Uptown Bean Counter',
    'Highland Park Roastery',
    'Como Neighborhood Café'
  ]
};

// Generate unique store ID assignments to ensure variety
const storeAssignments = new Map();
let nextStoreId = 1;

const getStoreInfo = (category) => {
  const storeOptions = storesByCategory[category] || storesByCategory['Home'];
  const randomStore = storeOptions[Math.floor(Math.random() * storeOptions.length)];
  
  if (!storeAssignments.has(randomStore)) {
    storeAssignments.set(randomStore, nextStoreId++);
  }
  
  return {
    storeName: randomStore,
    storeId: storeAssignments.get(randomStore)
  };
};

let productDB = [];

productList.forEach(({ category, products }) => {
  products.forEach(product => {
    const storeInfo = getStoreInfo(category);
    const newProduct = {
      _id: `prod_${Date.now()}_${Math.floor(Math.random() * 100000)}`,
      id: productDB.length + 1,
      category,
      title: product["Product Name"],
      name: product["Product Name"], // Keep both for compatibility
      price: Math.round(product["Price ($)"] * 100), // Convert to cents
      storeName: storeInfo.storeName,
      storeId: storeInfo.storeId,
      description: `High-quality ${product["Product Name"].toLowerCase()} available at ${storeInfo.storeName}.`,
      inStock: Math.random() > 0.15, // 85% in stock
      stockLevel: Math.floor(Math.random() * 50) + 5,
      ratings: {
        average: parseFloat((Math.random() * 2 + 3).toFixed(1)), // 3.0-5.0 rating
        count: Math.floor(Math.random() * 150) + 10
      },
      spiralPoints: Math.floor(product["Price ($)"] * 0.05), // 5% of price in SPIRAL points
      tags: [category.toLowerCase(), 'local', 'verified'],
      verified: Math.random() > 0.2, // 80% verified
      imageUrl: `/api/placeholder/300/300?text=${encodeURIComponent(product["Product Name"])}`,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      type: 'product'
    };
    productDB.push(newProduct);
  });
});

console.log(`✅ Loaded ${productDB.length} products into mock DB from ${storeAssignments.size} different stores.`);

// === STEP 3: Optional Upload to IBM Cloudant ===
async function uploadToCloudant(products) {
  try {
    // Note: axios removed for simplicity - would use fetch API in production
    console.log(`☁️ Would upload ${products.length} products to Cloudant.`);
    console.log("🧾 Sample product:", products[0]);
  } catch (err) {
    console.error("❌ Cloudant upload failed:", err.message);
  }
}

// Run upload if flag is true
if (UPLOAD_TO_CLOUDANT) {
  uploadToCloudant(productDB);
}

export { productDB }; // Optional export if needed elsewhere