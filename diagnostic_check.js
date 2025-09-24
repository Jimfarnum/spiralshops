#!/usr/bin/env node

// SPIRAL Image Diagnostics - Professional Version
// Replaces brittle shell script with proper Node.js diagnostics

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

console.log('🔎 SPIRAL Image System Diagnostics\n');

async function checkAPI(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    }).on('error', reject);
  });
}

async function checkImageURL(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.request(url, { method: 'HEAD' }, (res) => {
      resolve({
        status: res.statusCode,
        contentType: res.headers['content-type'],
        contentLength: res.headers['content-length']
      });
    });
    req.on('error', () => resolve({ status: 'ERROR', error: 'Network error' }));
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ status: 'TIMEOUT', error: 'Request timeout' });
    });
    req.end();
  });
}

async function main() {
  const baseURL = process.env.REPL_SLUG ? 
    `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co` : 
    'http://localhost:5000';
  
  console.log(`🌐 Testing API at: ${baseURL}`);
  
  // Step 1: Check API Products
  console.log('\n🔎 Step 1: Checking /api/products for image URLs...');
  try {
    const result = await checkAPI(`${baseURL}/api/products`);
    
    if (result.status === 200 && result.data.products) {
      const products = result.data.products.slice(0, 3);
      console.log(`✅ API responding with ${result.data.products.length} products`);
      
      products.forEach((product, i) => {
        console.log(`   Product ${i + 1}: ${product.name}`);
        console.log(`     image: ${product.image || 'MISSING'}`);
        console.log(`     imageUrl: ${product.imageUrl || 'MISSING'}`);
        console.log(`     image_url: ${product.image_url || 'MISSING'}`);
      });
      
      // Step 2: Test first image URL
      console.log('\n🔎 Step 2: Testing first image URL...');
      const firstProduct = products[0];
      const imageURL = firstProduct.image_url || firstProduct.imageUrl || firstProduct.image;
      
      if (imageURL && imageURL !== 'null') {
        const fullURL = imageURL.startsWith('http') ? imageURL : `${baseURL}${imageURL}`;
        console.log(`   Testing: ${fullURL}`);
        
        const imageCheck = await checkImageURL(fullURL);
        if (imageCheck.status === 200) {
          console.log(`   ✅ Image accessible (${imageCheck.contentType}, ${imageCheck.contentLength} bytes)`);
        } else {
          console.log(`   ❌ Image failed: ${imageCheck.status} ${imageCheck.error || ''}`);
        }
      } else {
        console.log('   ⚠️ No valid image URL found');
      }
    } else {
      console.log(`❌ API failed: ${result.status}`);
    }
  } catch (error) {
    console.log(`❌ API error: ${error.message}`);
  }
  
  // Step 3: Check static directories
  console.log('\n📂 Step 3: Checking static image directories...');
  const directories = ['static/images', 'public/images'];
  
  directories.forEach(dir => {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir).filter(f => f.match(/\.(png|jpg|jpeg|gif)$/i));
      console.log(`   ✅ ${dir}: ${files.length} images`);
      files.slice(0, 3).forEach(file => console.log(`     - ${file}`));
    } else {
      console.log(`   ⚠️ ${dir}: Not found`);
    }
  });
  
  // Step 4: Test static serving
  console.log('\n🌐 Step 4: Testing static image serving...');
  const testImages = ['/images/beta-1.png', '/images/default-product.png'];
  
  for (const imgPath of testImages) {
    const fullURL = `${baseURL}${imgPath}`;
    const result = await checkImageURL(fullURL);
    if (result.status === 200) {
      console.log(`   ✅ ${imgPath}: accessible`);
    } else {
      console.log(`   ❌ ${imgPath}: ${result.status} ${result.error || ''}`);
    }
  }
  
  console.log('\n🎯 Diagnostic complete!');
}

main().catch(console.error);