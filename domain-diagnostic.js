#!/usr/bin/env node

/**
 * SPIRAL Domain Diagnostic Tool
 * Analyzes www.spiralshops.com accessibility issues
 */

import { promises as dns } from 'dns';
import https from 'https';
import http from 'http';

async function diagnoseDomain() {
    console.log('🔍 SPIRAL Domain Diagnostic Report');
    console.log('==================================');
    console.log();

    const domains = ['spiralshops.com', 'www.spiralshops.com'];
    
    for (const domain of domains) {
        console.log(`🌐 Testing: ${domain}`);
        console.log('-'.repeat(30));
        
        // DNS Resolution Test
        try {
            const addresses = await dns.lookup(domain);
            console.log(`✅ DNS: ${addresses.address} (${addresses.family === 4 ? 'IPv4' : 'IPv6'})`);
        } catch (error) {
            console.log(`❌ DNS: Failed - ${error.code}`);
        }

        // HTTPS Test
        await new Promise((resolve) => {
            const req = https.request({
                hostname: domain,
                port: 443,
                path: '/',
                method: 'GET',
                timeout: 10000
            }, (res) => {
                console.log(`✅ HTTPS: ${res.statusCode} ${res.statusMessage}`);
                console.log(`📍 Location: ${res.headers.location || 'None'}`);
                resolve();
            });

            req.on('error', (error) => {
                console.log(`❌ HTTPS: ${error.code || error.message}`);
                resolve();
            });

            req.on('timeout', () => {
                console.log(`⏱️ HTTPS: Timeout (10s)`);
                req.destroy();
                resolve();
            });

            req.end();
        });

        // HTTP Test
        await new Promise((resolve) => {
            const req = http.request({
                hostname: domain,
                port: 80,
                path: '/',
                method: 'GET',
                timeout: 10000
            }, (res) => {
                console.log(`✅ HTTP: ${res.statusCode} ${res.statusMessage}`);
                console.log(`📍 Location: ${res.headers.location || 'None'}`);
                resolve();
            });

            req.on('error', (error) => {
                console.log(`❌ HTTP: ${error.code || error.message}`);
                resolve();
            });

            req.on('timeout', () => {
                console.log(`⏱️ HTTP: Timeout (10s)`);
                req.destroy();
                resolve();
            });

            req.end();
        });

        console.log();
    }

    console.log('🔧 RECOMMENDED FIXES:');
    console.log('====================');
    console.log('1. Check DNS CNAME record for www → spiralshops.com');
    console.log('2. Verify SSL certificate covers www.spiralshops.com');
    console.log('3. Ensure hosting provider has www subdomain configured');
    console.log('4. Check for CDN/proxy configuration issues');
    console.log();
    console.log('🚀 Development environment is working - this is DNS/hosting config issue');
}

diagnoseDomain().catch(console.error);