#!/usr/bin/env node
/**
 * Migration script to upload Beta product images to Replit Object Storage
 * This fixes the production deployment issue where workspace images aren't accessible
 */

import fs from "fs";
import path from "path";
import { ObjectStorageService } from "./objectStorage.js";

const BETA_IMAGES = [
  { file: "beta-101.png", name: "Beta Denim Jacket" },
  { file: "beta-102.png", name: "Beta Hiking Boots" },
  { file: "beta-103.png", name: "Beta Coffee Mug" }
];

async function migrateBetaImages() {
  console.log("🔄 Starting Beta images migration to Object Storage...");
  
  const objectStorage = new ObjectStorageService();
  const staticImagesDir = path.join(process.cwd(), "static/images");
  
  for (const betaImage of BETA_IMAGES) {
    try {
      const imagePath = path.join(staticImagesDir, betaImage.file);
      
      if (!fs.existsSync(imagePath)) {
        console.log(`⚠️  Image not found: ${betaImage.file}, skipping...`);
        continue;
      }
      
      console.log(`📤 Uploading ${betaImage.file} (${betaImage.name})...`);
      
      const imageBuffer = fs.readFileSync(imagePath);
      const objectPath = await objectStorage.uploadFileToPublic(betaImage.file, imageBuffer, 'image/png');
      
      console.log(`✅ Successfully uploaded ${betaImage.file} to ${objectPath}`);
      
    } catch (error) {
      console.error(`❌ Failed to upload ${betaImage.file}:`, error);
    }
  }
  
  console.log("🎯 Beta images migration completed!");
  console.log("📍 Images are now available at: /public-objects/beta-{id}.png");
}

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateBetaImages().catch(console.error);
}

export { migrateBetaImages };