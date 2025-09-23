// =============================================================================
// SECURE AI IMAGE GENERATION ROUTER - Protected with Auth & Rate Limiting
// =============================================================================

import express from 'express';
import OpenAI from 'openai';
import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';
import fetch from 'node-fetch';
import { ObjectStorageService } from '../objectStorage.js';
import { 
  aiEndpointLimiter, 
  previewLimiter, 
  requireAdminAuth, 
  costProtection, 
  aiOperationLogger 
} from '../middleware/security.js';
import { validateInput, csvDataSchema, productImageSchema, sanitizeTextInputs, setAISecurityHeaders } from '../middleware/inputValidation.js';
import { aiAuditLogger, securityAlertMiddleware } from '../middleware/auditLogging.js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const router = express.Router();

// Initialize object storage service
const objectStorageService = new ObjectStorageService();

// Helper function to download and store image to object storage
async function downloadAndStoreImage(imageUrl: string, fileName: string): Promise<string> {
  try {
    console.log(`📥 Downloading image to object storage: ${fileName}`);
    
    // Download image from OpenAI
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.statusText}`);
    }
    
    const imageArrayBuffer = await imageResponse.arrayBuffer();
    const imageBuffer = Buffer.from(imageArrayBuffer);
    
    // Upload to public object storage
    const storedPath = await objectStorageService.uploadFileToPublic(fileName, imageBuffer, 'image/png');
    
    console.log(`✅ Image stored in object storage: ${storedPath}`);
    return storedPath;
    
  } catch (error) {
    console.error(`❌ Failed to store image: ${error.message}`);
    throw error;
  }
}

// 🔒 FULLY SECURED: Generate images for all products in CSV
router.post('/auto-generate-product-images', 
  setAISecurityHeaders,
  securityAlertMiddleware,
  sanitizeTextInputs,
  validateInput(csvDataSchema),
  requireAdminAuth,
  aiEndpointLimiter,
  costProtection,
  aiOperationLogger('auto-generate-product-images'),
  aiAuditLogger('auto-generate-product-images', 2.50), // High-cost operation
  async (req, res) => {
    try {
      console.log('🎨 Starting SECURED automated product image generation...');
      
      // Read the CSV file
      const products = [];
      const csvPath = 'SPIRAL_Product_Images_Template.csv';
      
      if (!fs.existsSync(csvPath)) {
        return res.status(404).json({
          success: false,
          error: 'CSV template file not found',
          message: 'Please upload SPIRAL_Product_Images_Template.csv first'
        });
      }
      
      await new Promise((resolve, reject) => {
        fs.createReadStream(csvPath)
          .pipe(csv())
          .on('data', (row) => products.push(row))
          .on('end', resolve)
          .on('error', reject);
      });

      console.log(`📊 Found ${products.length} products to generate images for`);
      
      const results = [];
      let successCount = 0;
      
      // Generate images for each product
      for (const product of products) {
        try {
          console.log(`🎨 Generating image for: ${product.Product_Name} at ${product.Store_Name}`);
          
          // Create professional product photography prompt
          const prompt = `Professional high-quality product photography of ${product.Product_Name} for ${product.Store_Name}, a ${product.Store_Category} in ${product.Store_Location}. Clean white background, studio lighting, commercial product shot, e-commerce style. The product should look premium and appealing for online shopping. No text or logos in the image.`;
          
          // Generate image using DALL-E 3
          const imageResponse = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: "1024x1024",
            quality: "hd",
          });
          
          const imageUrl = imageResponse.data[0].url;
          
          // Store image in object storage instead of local filesystem
          const fileName = `product-${product.Product_ID}-${Date.now()}.png`;
          const storedImagePath = await downloadAndStoreImage(imageUrl!, fileName);
          
          // Store result
          results.push({
            productId: product.Product_ID,
            productName: product.Product_Name,
            storeName: product.Store_Name,
            sku: product.SKU_Barcode,
            imageUrl: storedImagePath, // Use object storage path
            originalUrl: imageUrl,
            status: 'success'
          });
          
          successCount++;
          console.log(`✅ Generated and stored image for ${product.Product_Name}: ${storedImagePath}`);
          
          // Delay to avoid rate limits and reduce API cost
          await new Promise(resolve => setTimeout(resolve, 2000));
          
        } catch (error) {
          console.error(`❌ Failed to generate image for ${product.Product_Name}:`, error.message);
          results.push({
            productId: product.Product_ID,
            productName: product.Product_Name,
            storeName: product.Store_Name,
            status: 'error',
            error: error.message
          });
        }
      }
      
      // Generate updated CSV with object storage URLs
      const updatedCsvContent = generateUpdatedCSV(products, results);
      fs.writeFileSync('SPIRAL_Product_Images_COMPLETED.csv', updatedCsvContent);
      
      console.log(`🎉 SECURED image generation complete! ${successCount}/${products.length} images generated successfully`);
      
      res.json({
        success: true,
        message: `Generated ${successCount} product images successfully with object storage`,
        results: results,
        downloadUrl: '/api/images/download/completed-product-images',
        objectStorageEnabled: true
      });
      
    } catch (error) {
      console.error('❌ SECURED image generation failed:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// 🔒 PROTECTED: Preview function - generate just one image to test
router.post('/preview-image/:productId', 
  requireAdminAuth,
  previewLimiter,
  costProtection,
  aiOperationLogger('preview-image'),
  async (req, res) => {
    try {
      const productId = req.params.productId;
      
      // Read product from CSV
      const products = [];
      await new Promise((resolve, reject) => {
        fs.createReadStream('SPIRAL_Product_Images_Template.csv')
          .pipe(csv())
          .on('data', (row) => products.push(row))
          .on('end', resolve)
          .on('error', reject);
      });
      
      const product = products.find(p => p.Product_ID === productId);
      if (!product) {
        return res.status(404).json({ 
          success: false,
          error: 'Product not found' 
        });
      }
      
      console.log(`🎨 Generating SECURED preview image for: ${product.Product_Name}`);
      
      const prompt = `Professional high-quality product photography of ${product.Product_Name} for ${product.Store_Name}, a ${product.Store_Category} in ${product.Store_Location}. Clean white background, studio lighting, commercial product shot, e-commerce style. The product should look premium and appealing for online shopping. No text or logos in the image.`;
      
      const imageResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "hd",
      });
      
      const originalImageUrl = imageResponse.data[0].url;
      
      // Store preview image in object storage
      const fileName = `preview-${productId}-${Date.now()}.png`;
      const storedImagePath = await downloadAndStoreImage(originalImageUrl!, fileName);
      
      res.json({
        success: true,
        product: product,
        imageUrl: storedImagePath, // Object storage path
        originalUrl: originalImageUrl, // OpenAI URL (temporary)
        prompt: prompt,
        securityEnabled: true,
        objectStorageEnabled: true
      });
      
    } catch (error) {
      console.error('❌ SECURED preview generation failed:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Helper function to generate updated CSV with object storage URLs
function generateUpdatedCSV(products: any[], results: any[]) {
  const header = 'Product_ID,Store_Name,Store_Location,Store_Category,Product_Name,Price,Category,SKU_Barcode,Image_URL,Alt_Image_URL,Local_Business_Notes\n';
  
  const rows = products.map(product => {
    const result = results.find(r => r.productId === product.Product_ID);
    const imageUrl = result && result.status === 'success' ? result.imageUrl : '[GENERATION FAILED]';
    
    return `${product.Product_ID},"${product.Store_Name}","${product.Store_Location}","${product.Store_Category}","${product.Product_Name}",${product.Price},"${product.Category}","${product.SKU_Barcode}","${imageUrl}","${product.Alt_Image_URL || ''}","${product.Local_Business_Notes}"`;
  }).join('\n');
  
  return header + rows;
}

// 🔒 PROTECTED: Download completed CSV with generated image URLs
router.get('/download/completed-product-images', 
  requireAdminAuth,
  aiOperationLogger('download-completed-csv'),
  (req, res) => {
    const csvPath = 'SPIRAL_Product_Images_COMPLETED.csv';
    if (fs.existsSync(csvPath)) {
      res.download(csvPath, 'SPIRAL_Product_Images_COMPLETED.csv');
    } else {
      res.status(404).json({ 
        error: 'Completed images file not found', 
        message: 'Please generate images first using the secured endpoint' 
      });
    }
  }
);

// 🔒 PROTECTED: Health check for AI services
router.get('/health',
  requireAdminAuth,
  (req, res) => {
    res.json({
      service: 'AI Image Generation',
      status: 'operational',
      security: 'enabled',
      objectStorage: 'enabled',
      openaiConfigured: !!process.env.OPENAI_API_KEY,
      timestamp: new Date().toISOString()
    });
  }
);

export default router;