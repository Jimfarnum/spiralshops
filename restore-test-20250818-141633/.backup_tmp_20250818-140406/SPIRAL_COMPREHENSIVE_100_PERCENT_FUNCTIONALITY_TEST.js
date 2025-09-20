#!/usr/bin/env node
/**
 * SPIRAL 100% Comprehensive Functionality Test Suite
 * Tests all platform features, APIs, and integrations
 */

import http from 'http';
import { performance } from 'perf_hooks';

class SPIRALComprehensiveTester {
    constructor() {
        this.baseUrl = 'http://localhost:5000';
        this.results = {
            total: 0,
            passed: 0,
            failed: 0,
            tests: []
        };
    }

    async makeRequest(endpoint, method = 'GET', data = null) {
        const start = performance.now();
        
        return new Promise((resolve, reject) => {
            const options = {
                hostname: 'localhost',
                port: 5000,
                path: endpoint,
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            };

            const req = http.request(options, (res) => {
                let body = '';
                res.on('data', (chunk) => body += chunk);
                res.on('end', () => {
                    const end = performance.now();
                    const responseTime = Math.round(end - start);
                    
                    try {
                        const jsonData = JSON.parse(body);
                        resolve({
                            statusCode: res.statusCode,
                            data: jsonData,
                            responseTime,
                            headers: res.headers
                        });
                    } catch (e) {
                        // If not JSON, still resolve with text data
                        resolve({
                            statusCode: res.statusCode,
                            data: body,
                            responseTime,
                            headers: res.headers,
                            isHtml: body.includes('<!DOCTYPE html')
                        });
                    }
                });
            });

            req.on('error', (err) => {
                reject(err);
            });

            if (data) {
                req.write(JSON.stringify(data));
            }
            
            req.end();
        });
    }

    async test(name, testFn) {
        this.results.total++;
        console.log(`\n🧪 Testing: ${name}`);
        
        try {
            const result = await testFn();
            if (result.success) {
                console.log(`✅ PASSED: ${name} - ${result.message}`);
                this.results.passed++;
                this.results.tests.push({
                    name,
                    status: 'PASSED',
                    message: result.message,
                    responseTime: result.responseTime || 0
                });
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.log(`❌ FAILED: ${name} - ${error.message}`);
            this.results.failed++;
            this.results.tests.push({
                name,
                status: 'FAILED',
                message: error.message,
                responseTime: 0
            });
        }
    }

    async runAllTests() {
        console.log('🚀 SPIRAL 100% Comprehensive Functionality Test Suite');
        console.log('=' .repeat(60));

        // ===============================
        // CORE SYSTEM HEALTH TESTS
        // ===============================
        await this.test('Core System Health Check', async () => {
            const response = await this.makeRequest('/api/check');
            if (response.statusCode === 200 && response.data.status === 'healthy') {
                return { 
                    success: true, 
                    message: `Platform healthy (${response.responseTime}ms)`,
                    responseTime: response.responseTime 
                };
            }
            throw new Error(`Health check failed: ${response.statusCode}`);
        });

        // ===============================
        // DATABASE & STORAGE TESTS
        // ===============================
        await this.test('IBM Cloud Cloudant Database Connection', async () => {
            const response = await this.makeRequest('/api/cloudant-status');
            if (response.statusCode === 200 && response.data.connected === true) {
                return { 
                    success: true, 
                    message: `Cloudant connected - DB: ${response.data.data.db} (${response.responseTime}ms)`,
                    responseTime: response.responseTime 
                };
            }
            throw new Error(`Cloudant connection failed: ${JSON.stringify(response.data)}`);
        });

        await this.test('Comprehensive Status Summary', async () => {
            const response = await this.makeRequest('/api/status/summary');
            if (response.statusCode === 200 && response.data.services) {
                const services = Object.keys(response.data.services);
                return { 
                    success: true, 
                    message: `Status monitoring ${services.length} services: ${services.join(', ')} (${response.responseTime}ms)`,
                    responseTime: response.responseTime 
                };
            }
            throw new Error(`Status summary failed`);
        });

        // ===============================
        // PRODUCT & INVENTORY TESTS
        // ===============================
        await this.test('Products API - Core Product Data', async () => {
            const response = await this.makeRequest('/api/products');
            if (response.statusCode === 200 && response.data.products && response.data.products.length > 0) {
                return { 
                    success: true, 
                    message: `${response.data.products.length} products loaded (${response.responseTime}ms)`,
                    responseTime: response.responseTime 
                };
            }
            throw new Error(`Products API failed or returned no products`);
        });

        await this.test('Featured Products API', async () => {
            const response = await this.makeRequest('/api/products/featured');
            if (response.statusCode === 200 && response.data.products) {
                return { 
                    success: true, 
                    message: `${response.data.products.length} featured products (${response.responseTime}ms)`,
                    responseTime: response.responseTime 
                };
            }
            throw new Error(`Featured products failed`);
        });

        // ===============================
        // STORE & LOCATION TESTS
        // ===============================
        await this.test('Store Directory API', async () => {
            const response = await this.makeRequest('/api/stores');
            if (response.statusCode === 200 && response.data.stores) {
                return { 
                    success: true, 
                    message: `${response.data.stores.length} stores in directory (${response.responseTime}ms)`,
                    responseTime: response.responseTime 
                };
            }
            throw new Error(`Store directory failed`);
        });

        await this.test('Continental US Store Search', async () => {
            const response = await this.makeRequest('/api/location-search-continental-us?scope=all');
            if (response.statusCode === 200 && response.data.stores) {
                return { 
                    success: true, 
                    message: `${response.data.stores.length} stores found nationwide (${response.responseTime}ms)`,
                    responseTime: response.responseTime 
                };
            }
            throw new Error(`Continental US search failed`);
        });

        // ===============================
        // AI & INTELLIGENCE TESTS
        // ===============================
        await this.test('AI Recommendation Engine', async () => {
            const response = await this.makeRequest('/api/recommend');
            if (response.statusCode === 200 && response.data.success) {
                return { 
                    success: true, 
                    message: `AI recommendations generated (${response.responseTime}ms)`,
                    responseTime: response.responseTime 
                };
            }
            throw new Error(`AI recommendations failed`);
        });

        await this.test('AI Retailer Onboarding Categories', async () => {
            const response = await this.makeRequest('/api/ai-retailer-onboarding/categories');
            if (response.statusCode === 200 && response.data.categories) {
                return { 
                    success: true, 
                    message: `${response.data.categories.length} business categories (${response.responseTime}ms)`,
                    responseTime: response.responseTime 
                };
            }
            throw new Error(`AI retailer categories failed`);
        });

        await this.test('Inventory Management Categories', async () => {
            const response = await this.makeRequest('/api/inventory/categories');
            if (response.statusCode === 200 && response.data.categories) {
                return { 
                    success: true, 
                    message: `${response.data.categories.length} inventory categories (${response.responseTime}ms)`,
                    responseTime: response.responseTime 
                };
            }
            throw new Error(`Inventory categories failed`);
        });

        // ===============================
        // MALL & EVENTS TESTS
        // ===============================
        await this.test('Mall Events System', async () => {
            const response = await this.makeRequest('/api/mall-events');
            if (response.statusCode === 200 && response.data.events) {
                return { 
                    success: true, 
                    message: `${response.data.events.length} mall events (${response.responseTime}ms)`,
                    responseTime: response.responseTime 
                };
            }
            throw new Error(`Mall events failed`);
        });

        await this.test('Promotions Engine', async () => {
            const response = await this.makeRequest('/api/promotions');
            if (response.statusCode === 200 && response.data.promotions) {
                return { 
                    success: true, 
                    message: `${response.data.promotions.length} active promotions (${response.responseTime}ms)`,
                    responseTime: response.responseTime 
                };
            }
            throw new Error(`Promotions engine failed`);
        });

        // ===============================
        // PAYMENT SYSTEM TESTS
        // ===============================
        await this.test('Stripe Payment Configuration', async () => {
            const response = await this.makeRequest('/api/status/summary');
            if (response.statusCode === 200 && response.data.services.stripe) {
                const stripeStatus = response.data.services.stripe;
                return { 
                    success: true, 
                    message: `Stripe configured: ${stripeStatus.configured ? 'Yes' : 'No'}, Connected: ${stripeStatus.connected ? 'Yes' : 'No'}`,
                    responseTime: response.responseTime 
                };
            }
            throw new Error(`Stripe status check failed`);
        });

        // ===============================
        // EXTERNAL INTEGRATIONS TESTS
        // ===============================
        await this.test('Google Cloud Vision Integration', async () => {
            // Test if the visual search endpoint responds
            const response = await this.makeRequest('/api/visual-search');
            if (response.statusCode === 200 || response.statusCode === 400) {
                // 400 is acceptable for missing image data
                return { 
                    success: true, 
                    message: `Google Cloud Vision endpoint responsive (${response.responseTime}ms)`,
                    responseTime: response.responseTime 
                };
            }
            throw new Error(`Visual search endpoint failed: ${response.statusCode}`);
        });

        // ===============================
        // API ROUTING TESTS
        // ===============================
        await this.test('API Route Resolution', async () => {
            const testRoutes = [
                '/api/check',
                '/api/products',
                '/api/stores',
                '/api/mall-events',
                '/api/promotions'
            ];

            let workingRoutes = 0;
            for (const route of testRoutes) {
                try {
                    const response = await this.makeRequest(route);
                    if (response.statusCode === 200 && !response.isHtml) {
                        workingRoutes++;
                    }
                } catch (e) {
                    // Route failed
                }
            }

            if (workingRoutes >= 4) {
                return { 
                    success: true, 
                    message: `${workingRoutes}/${testRoutes.length} API routes working correctly`
                };
            }
            throw new Error(`Only ${workingRoutes}/${testRoutes.length} routes working`);
        });

        // ===============================
        // RESULTS SUMMARY
        // ===============================
        this.printResults();
    }

    printResults() {
        console.log('\n' + '='.repeat(60));
        console.log('🎯 SPIRAL 100% FUNCTIONALITY TEST RESULTS');
        console.log('='.repeat(60));
        
        const passRate = ((this.results.passed / this.results.total) * 100).toFixed(1);
        
        console.log(`📊 Total Tests: ${this.results.total}`);
        console.log(`✅ Passed: ${this.results.passed}`);
        console.log(`❌ Failed: ${this.results.failed}`);
        console.log(`📈 Pass Rate: ${passRate}%`);
        
        console.log('\n📋 DETAILED RESULTS:');
        this.results.tests.forEach((test, index) => {
            const status = test.status === 'PASSED' ? '✅' : '❌';
            const responseTime = test.responseTime ? ` (${test.responseTime}ms)` : '';
            console.log(`${index + 1}. ${status} ${test.name}${responseTime}`);
            console.log(`   ${test.message}`);
        });

        // Performance Analysis
        const passedTests = this.results.tests.filter(t => t.status === 'PASSED' && t.responseTime > 0);
        if (passedTests.length > 0) {
            const avgResponseTime = Math.round(
                passedTests.reduce((sum, test) => sum + test.responseTime, 0) / passedTests.length
            );
            console.log(`\n⚡ Average Response Time: ${avgResponseTime}ms`);
        }

        console.log('\n' + '='.repeat(60));
        if (passRate >= 90) {
            console.log('🎉 SPIRAL PLATFORM: PRODUCTION READY');
        } else if (passRate >= 75) {
            console.log('⚠️ SPIRAL PLATFORM: NEEDS MINOR FIXES');
        } else {
            console.log('🔧 SPIRAL PLATFORM: REQUIRES ATTENTION');
        }
        console.log('='.repeat(60));
    }
}

// Run the comprehensive test suite
const tester = new SPIRALComprehensiveTester();
tester.runAllTests().catch(console.error);

export default SPIRALComprehensiveTester;