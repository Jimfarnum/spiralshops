#!/usr/bin/env node
// SPIRAL Feature #8 - Admin Token Generator
import { randomBytes } from 'crypto';

function generateAdminToken() {
  return randomBytes(32).toString('hex');
}

// If run directly, generate and display a token
if (import.meta.url === new URL(process.argv[1], 'file://').href) {
  const token = generateAdminToken();
  console.log('\n🔐 SPIRAL Admin Token Generator');
  console.log('===============================');
  console.log('\nGenerated Admin Token:');
  console.log(`ADMIN_TOKEN=${token}`);
  console.log('\n⚠️  Keep this token secure! Add it to your environment variables.');
  console.log('Usage: Set ADMIN_TOKEN environment variable and use X-Admin-Token header or ?admin_token= query parameter');
  console.log('\nExample API call:');
  console.log(`curl -H "X-Admin-Token: ${token}" https://your-domain.com/api/admin/ops-summary`);
}

export { generateAdminToken };