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
let productDB = [];

productList.forEach(({ category, products }) => {
  products.forEach(product => {
    const newProduct = {
      _id: `prod_${Date.now()}_${Math.floor(Math.random() * 100000)}`,
      category,
      name: product["Product Name"],
      price: product["Price ($)"],
      createdAt: new Date().toISOString(),
      type: 'product'
    };
    productDB.push(newProduct);
  });
});

console.log(`✅ Loaded ${productDB.length} products into mock DB.`);

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