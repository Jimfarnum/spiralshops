import express from 'express';
import OpenAI from 'openai';
import fs from 'fs';
import csv from 'csv-parser';

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const router = express.Router();

// Generate images for all products in CSV
router.post('/auto-generate-product-images', async (req, res) => {
  try {
    console.log('🎨 Starting automated product image generation...');
    
    // Read the CSV file
    const products = [];
    const csvPath = 'SPIRAL_Product_Images_Template.csv';
    
    await new Promise((resolve, reject) => {
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (row) => products.push(row))
        .on('end', resolve)
        .on('error', reject);
    });

    console.log(`📊 Found ${products.length} products to generate images for`);
    
    const results = [];
    
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
        
        // Store result
        results.push({
          productId: product.Product_ID,
          productName: product.Product_Name,
          storeName: product.Store_Name,
          sku: product.SKU_Barcode,
          imageUrl: imageUrl,
          status: 'success'
        });
        
        console.log(`✅ Generated image for ${product.Product_Name}: ${imageUrl}`);
        
        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
        
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
    
    // Generate updated CSV with image URLs
    const updatedCsvContent = generateUpdatedCSV(products, results);
    fs.writeFileSync('SPIRAL_Product_Images_COMPLETED.csv', updatedCsvContent);
    
    const successCount = results.filter(r => r.status === 'success').length;
    console.log(`🎉 Image generation complete! ${successCount}/${products.length} images generated successfully`);
    
    res.json({
      success: true,
      message: `Generated ${successCount} product images successfully`,
      results: results,
      downloadUrl: '/api/download/completed-product-images'
    });
    
  } catch (error) {
    console.error('❌ Image generation failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Helper function to generate updated CSV
function generateUpdatedCSV(products, results) {
  const header = 'Product_ID,Store_Name,Store_Location,Store_Category,Product_Name,Price,Category,SKU_Barcode,Image_URL,Alt_Image_URL,Local_Business_Notes\n';
  
  const rows = products.map(product => {
    const result = results.find(r => r.productId === product.Product_ID);
    const imageUrl = result && result.status === 'success' ? result.imageUrl : '[GENERATION FAILED]';
    
    return `${product.Product_ID},"${product.Store_Name}","${product.Store_Location}","${product.Store_Category}","${product.Product_Name}",${product.Price},"${product.Category}","${product.SKU_Barcode}","${imageUrl}","${product.Alt_Image_URL || ''}","${product.Local_Business_Notes}"`;
  }).join('\n');
  
  return header + rows;
}

// Download completed CSV with generated image URLs
router.get('/download/completed-product-images', (req, res) => {
  const csvPath = 'SPIRAL_Product_Images_COMPLETED.csv';
  if (fs.existsSync(csvPath)) {
    res.download(csvPath, 'SPIRAL_Product_Images_COMPLETED.csv');
  } else {
    res.status(404).json({ error: 'Completed images file not found. Please generate images first.' });
  }
});

// Preview function - generate just one image to test
router.post('/preview-image/:productId', async (req, res) => {
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
      return res.status(404).json({ error: 'Product not found' });
    }
    
    console.log(`🎨 Generating preview image for: ${product.Product_Name}`);
    
    const prompt = `Professional high-quality product photography of ${product.Product_Name} for ${product.Store_Name}, a ${product.Store_Category} in ${product.Store_Location}. Clean white background, studio lighting, commercial product shot, e-commerce style. The product should look premium and appealing for online shopping. No text or logos in the image.`;
    
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
    });
    
    res.json({
      success: true,
      product: product,
      imageUrl: imageResponse.data[0].url,
      prompt: prompt
    });
    
  } catch (error) {
    console.error('❌ Preview generation failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;