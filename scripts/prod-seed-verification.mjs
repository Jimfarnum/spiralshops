#!/usr/bin/env node

// SPIRAL Production Database Seeding & Verification Script
// Handles Cloudant production data setup and verification

import fs from 'fs';

console.log('🗄️ SPIRAL Production Database Setup');
console.log('===================================');

console.log('\n📊 Seeding Data Verification:');

// Verify retailer seed data
if (fs.existsSync('seed/retailers.csv')) {
  const retailers = fs.readFileSync('seed/retailers.csv', 'utf8').split('\n').filter(line => line.trim());
  console.log(`✅ Retailers CSV: ${retailers.length - 1} retailers ready for seeding`);
} else {
  console.log('❌ Retailers CSV not found');
}

// Verify product seed data  
if (fs.existsSync('seed/products.csv')) {
  const products = fs.readFileSync('seed/products.csv', 'utf8').split('\n').filter(line => line.trim());
  console.log(`✅ Products CSV: ${products.length - 1} products ready for seeding`);
} else {
  console.log('❌ Products CSV not found');
}

console.log('\n🔗 Production Database Commands:');
console.log('1. Point to production Cloudant instance:');
console.log('   CLOUDANT_URL=https://your-prod-service.cloudantnosqldb.appdomain.cloud');
console.log('   CLOUDANT_APIKEY=your-production-apikey');
console.log('');
console.log('2. Seed production database:');
console.log('   npm run seed');
console.log('');
console.log('3. Reset demo data:'); 
console.log('   npm run demo:reset');
console.log('');
console.log('4. Verify production data:');
console.log('   curl https://spiralshops.com/api/stores');
console.log('   curl https://spiralshops.com/api/products');

console.log('\n📈 Expected Production Counts:');
console.log('   - Retailers: ~50 Twin Cities metro businesses');
console.log('   - Products: ~100+ items across all categories');  
console.log('   - Geographic Coverage: Minnesota focus with realistic coordinates');