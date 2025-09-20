#!/usr/bin/env ts-node

/**
 * SPIRAL Image Health Check Script
 * Validates all product images across the platform
 */

import fetch from "node-fetch";
import { writeFileSync } from "fs";
import { join } from "path";

interface Product {
  id: string | number;
  name: string;
  image_url?: string;
  store?: string;
}

interface ImageCheckResult {
  id: string | number;
  name: string;
  url: string;
  status: 'valid' | 'broken' | 'missing' | 'placeholder';
  httpStatus?: number;
  error?: string;
  responseTime?: number;
}

class ImageHealthChecker {
  private apiBase: string;
  private results: ImageCheckResult[] = [];
  
  constructor(apiBase = "http://localhost:5000") {
    this.apiBase = apiBase;
  }

  async checkAllImages(): Promise<void> {
    console.log("🔍 SPIRAL Image Health Check Starting...\n");
    
    try {
      // Check multiple endpoints for products
      const endpoints = [
        "/api/products/featured",
        "/api/products",
        "/api/products/all"
      ];

      let allProducts: Product[] = [];
      
      for (const endpoint of endpoints) {
        try {
          const products = await this.fetchProducts(endpoint);
          if (products.length > 0) {
            allProducts = products;
            console.log(`✅ Found ${products.length} products from ${endpoint}`);
            break;
          }
        } catch (error) {
          console.log(`⚠️  ${endpoint} not available`);
        }
      }

      if (allProducts.length === 0) {
        console.log("❌ No products found from any endpoint");
        return;
      }

      // Check each product's images
      console.log(`\n🔎 Checking ${allProducts.length} product images...\n`);
      
      for (const [index, product] of allProducts.entries()) {
        const result = await this.checkProductImage(product, index + 1);
        this.results.push(result);
        this.displayResult(result, index + 1);
      }

      // Generate reports
      this.generateReports();
      this.displaySummary();
      
    } catch (error) {
      console.error("💥 Image check failed:", error);
      process.exit(1);
    }
  }

  private async fetchProducts(endpoint: string): Promise<Product[]> {
    const url = `${this.apiBase}${endpoint}`;
    const response = await fetch(url, { timeout: 10000 });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    // Handle different response formats
    if (Array.isArray(data)) {
      return data;
    } else if (data.products && Array.isArray(data.products)) {
      return data.products;
    } else if (data.success && Array.isArray(data.data)) {
      return data.data;
    }
    
    return [];
  }

  private async checkProductImage(product: Product, index: number): Promise<ImageCheckResult> {
    const imageUrl = product.image_url || "";
    
    const result: ImageCheckResult = {
      id: product.id,
      name: product.name,
      url: imageUrl,
      status: 'missing'
    };

    if (!imageUrl) {
      result.status = 'missing';
      return result;
    }

    if (imageUrl.includes('placeholder') || imageUrl.includes('via.placeholder')) {
      result.status = 'placeholder';
      return result;
    }

    try {
      const startTime = Date.now();
      const response = await fetch(imageUrl, { 
        method: 'HEAD',
        timeout: 10000,
        headers: {
          'User-Agent': 'SPIRAL-Health-Check/1.0'
        }
      });
      
      const responseTime = Date.now() - startTime;
      result.responseTime = responseTime;
      result.httpStatus = response.status;

      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.startsWith('image/')) {
          result.status = 'valid';
        } else {
          result.status = 'broken';
          result.error = `Not an image: ${contentType}`;
        }
      } else {
        result.status = 'broken';
        result.error = `HTTP ${response.status}`;
      }
    } catch (error) {
      result.status = 'broken';
      result.error = error instanceof Error ? error.message : String(error);
    }

    return result;
  }

  private displayResult(result: ImageCheckResult, index: number): void {
    const statusEmoji = {
      valid: '✅',
      placeholder: '📷',
      broken: '❌',
      missing: '⚠️'
    };

    const emoji = statusEmoji[result.status];
    const timing = result.responseTime ? ` (${result.responseTime}ms)` : '';
    
    console.log(`${emoji} #${index} ${result.name}`);
    console.log(`   URL: ${result.url || '(none)'}`);
    
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
    
    if (result.httpStatus) {
      console.log(`   Status: HTTP ${result.httpStatus}${timing}`);
    }
    
    console.log();
  }

  private generateReports(): void {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // JSON Report
    const jsonReport = {
      timestamp: new Date().toISOString(),
      summary: this.generateSummary(),
      results: this.results
    };
    
    writeFileSync(
      join(process.cwd(), `image-health-${timestamp}.json`),
      JSON.stringify(jsonReport, null, 2)
    );

    // CSV Report
    const csvContent = [
      'id,name,url,status,http_status,response_time,error',
      ...this.results.map(r => [
        r.id,
        `"${r.name.replace(/"/g, '""')}"`,
        `"${r.url}"`,
        r.status,
        r.httpStatus || '',
        r.responseTime || '',
        `"${(r.error || '').replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');
    
    writeFileSync(
      join(process.cwd(), `image-health-${timestamp}.csv`),
      csvContent
    );

    console.log(`📊 Reports saved:`);
    console.log(`   • image-health-${timestamp}.json`);
    console.log(`   • image-health-${timestamp}.csv`);
  }

  private generateSummary() {
    const summary = {
      total: this.results.length,
      valid: this.results.filter(r => r.status === 'valid').length,
      placeholder: this.results.filter(r => r.status === 'placeholder').length,
      broken: this.results.filter(r => r.status === 'broken').length,
      missing: this.results.filter(r => r.status === 'missing').length,
      success_rate: 0
    };

    summary.success_rate = summary.total > 0 
      ? Math.round(((summary.valid + summary.placeholder) / summary.total) * 100)
      : 0;

    return summary;
  }

  private displaySummary(): void {
    const summary = this.generateSummary();
    
    console.log("\n" + "=".repeat(50));
    console.log("📊 SPIRAL Image Health Summary");
    console.log("=".repeat(50));
    console.log(`Total Products:     ${summary.total}`);
    console.log(`✅ Valid Images:     ${summary.valid}`);
    console.log(`📷 Placeholders:     ${summary.placeholder}`);
    console.log(`❌ Broken Images:    ${summary.broken}`);
    console.log(`⚠️  Missing URLs:     ${summary.missing}`);
    console.log(`📈 Success Rate:     ${summary.success_rate}%`);
    console.log("=".repeat(50));

    if (summary.broken + summary.missing > 0) {
      console.log("\n⚡ Action Required:");
      console.log("   1. Review the generated reports for specific issues");
      console.log("   2. Upload missing product images");
      console.log("   3. Fix broken image URLs");
      console.log("   4. Re-run this check to verify fixes");
      
      process.exit(1);
    } else {
      console.log("\n🎉 All product images are healthy!");
      process.exit(0);
    }
  }
}

// Run the checker
const checker = new ImageHealthChecker(
  process.env.API_BASE || "http://localhost:5000"
);

checker.checkAllImages().catch(error => {
  console.error("💥 Check failed:", error);
  process.exit(1);
});