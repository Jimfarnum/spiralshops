// server/dataService.ts
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DataService {
  private productList: any[] = [];
  private initialized = false;

  private async loadDataFromFile(): Promise<any[]> {
    const possiblePaths = [
      // Development path
      path.join(__dirname, '../data/spiral_sample_products.json'),
      // Production paths
      path.join(__dirname, '../client/public/spiral_sample_products.json'),
      path.join(__dirname, './data/spiral_sample_products.json'),
      path.join(__dirname, 'data/spiral_sample_products.json'),
      // Fallback for built distribution
      path.join(process.cwd(), 'data/spiral_sample_products.json'),
      path.join(process.cwd(), 'client/public/spiral_sample_products.json'),
    ];

    for (const filePath of possiblePaths) {
      try {
        if (fs.existsSync(filePath)) {
          const rawData = fs.readFileSync(filePath, 'utf8');
          const data = JSON.parse(rawData);
          console.log(`✅ Loaded product data from: ${filePath}`);
          return data;
        }
      } catch (error) {
        console.warn(`⚠️  Failed to load from ${filePath}:`, (error as Error).message);
      }
    }

    // If all file loading fails, return default data structure
    console.warn('⚠️  Could not load product data from any location, using fallback data');
    return this.getFallbackData();
  }

  private getFallbackData(): any[] {
    return [
      {
        "category": "Electronics",
        "products": [
          {"Product Name": "Wireless Bluetooth Headphones - Premium Sound", "Price ($)": 79.99},
          {"Product Name": "Smart Phone Case - Protective & Stylish", "Price ($)": 24.99},
          {"Product Name": "Laptop Stand - Ergonomic Aluminum Design", "Price ($)": 45.00}
        ]
      },
      {
        "category": "Home & Garden",
        "products": [
          {"Product Name": "LED String Lights - Outdoor Waterproof", "Price ($)": 19.99},
          {"Product Name": "Ceramic Plant Pot Set - Modern Design", "Price ($)": 34.99},
          {"Product Name": "Bamboo Cutting Board - Large Kitchen Essential", "Price ($)": 28.50}
        ]
      }
    ];
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      this.productList = await this.loadDataFromFile();
      this.initialized = true;
      console.log(`✅ DataService initialized with ${this.productList.length} categories`);
    } catch (error) {
      console.error('❌ Failed to initialize DataService:', error);
      this.productList = this.getFallbackData();
      this.initialized = true;
    }
  }

  async getProductList(): Promise<any[]> {
    if (!this.initialized) {
      await this.initialize();
    }
    return this.productList;
  }

  async getProductsCount(): Promise<number> {
    const products = await this.getProductList();
    return products.reduce((total, category) => total + (category.products?.length || 0), 0);
  }
}

// Export singleton instance
export const dataService = new DataService();