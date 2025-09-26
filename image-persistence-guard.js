#!/usr/bin/env node
/**
 * SPIRAL Image Persistence Guard
 * Ensures product images are always available in deployment builds
 * Prevents the common deployment failure where images work in dev but not production
 */

import fs from 'fs';
import path from 'path';

const REQUIRED_IMAGES = [
    'Wireless_Bluetooth_Headphones_b3a5653e.png',
    'Smart_Phone_Case_7c312bb2.png', 
    'Laptop_Stand_Aluminum_f6a508a7.png',
    'LED_String_Lights_0ee3ac9e.png',
    'Ceramic_Plant_Pot_Set_05a974b5.png',
    'Organic_Cotton_T-Shirt_0e3aa578.png',
    'Running_Sneakers_Athletic_f36bb48b.png',
    'Leather_Wallet_RFID_7580bf82.png'
];

console.log('🛡️ SPIRAL Image Persistence Guard');
console.log('==================================');

// Create build images directory if it doesn't exist
const buildImagesDir = './dist/public/images';
const sourceImagesDir = './public/images';

if (!fs.existsSync(buildImagesDir)) {
    console.log('📁 Creating build images directory...');
    fs.mkdirSync(buildImagesDir, { recursive: true });
}

// Verify source images exist
console.log('🔍 Checking source images...');
let sourceCount = 0;
let missingSource = [];

for (const imageName of REQUIRED_IMAGES) {
    const sourcePath = path.join(sourceImagesDir, imageName);
    if (fs.existsSync(sourcePath)) {
        sourceCount++;
        console.log(`   ✅ ${imageName}`);
    } else {
        missingSource.push(imageName);
        console.log(`   ❌ MISSING: ${imageName}`);
    }
}

// Copy all images to build directory
console.log('\n📦 Ensuring images are in build directory...');
if (fs.existsSync(sourceImagesDir)) {
    const allFiles = fs.readdirSync(sourceImagesDir);
    let copiedCount = 0;
    
    for (const file of allFiles) {
        if (file.match(/\.(png|jpg|jpeg|gif|webp)$/i)) {
            const sourcePath = path.join(sourceImagesDir, file);
            const destPath = path.join(buildImagesDir, file);
            
            try {
                fs.copyFileSync(sourcePath, destPath);
                copiedCount++;
            } catch (error) {
                console.log(`   ❌ Failed to copy ${file}: ${error.message}`);
            }
        }
    }
    
    console.log(`✅ Copied ${copiedCount} images to build directory`);
} else {
    console.log('❌ Source images directory not found!');
}

// Verify deployment readiness
console.log('\n🔍 Verifying deployment readiness...');
let buildCount = 0;
let missingBuild = [];

for (const imageName of REQUIRED_IMAGES) {
    const buildPath = path.join(buildImagesDir, imageName);
    if (fs.existsSync(buildPath)) {
        buildCount++;
        
        // Check file size (basic corruption check)
        const stats = fs.statSync(buildPath);
        if (stats.size > 1000) { // Images should be > 1KB
            console.log(`   ✅ ${imageName} (${Math.round(stats.size/1024)}KB)`);
        } else {
            console.log(`   ⚠️  ${imageName} (${stats.size}B - possibly corrupted)`);
        }
    } else {
        missingBuild.push(imageName);
        console.log(`   ❌ MISSING FROM BUILD: ${imageName}`);
    }
}

// Final assessment
console.log('\n📊 DEPLOYMENT IMAGE READINESS REPORT');
console.log('====================================');

console.log(`📈 Required Images: ${REQUIRED_IMAGES.length}`);
console.log(`📁 In Source: ${sourceCount}/${REQUIRED_IMAGES.length}`);
console.log(`📦 In Build: ${buildCount}/${REQUIRED_IMAGES.length}`);

if (buildCount === REQUIRED_IMAGES.length) {
    console.log('\n🎉 ✅ ALL PRODUCT IMAGES READY FOR DEPLOYMENT!');
    console.log('✅ Images will display correctly in production');
    console.log('✅ No 404 image errors expected');
    process.exit(0);
} else {
    console.log('\n🚨 ❌ DEPLOYMENT WILL HAVE BROKEN IMAGES!');
    console.log(`❌ Missing ${missingBuild.length} critical product images`);
    console.log('❌ Users will see broken image placeholders');
    
    if (missingBuild.length > 0) {
        console.log('\n🔧 Missing images:');
        missingBuild.forEach(img => console.log(`   - ${img}`));
    }
    
    process.exit(1);
}