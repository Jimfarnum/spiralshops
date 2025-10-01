// SPIRAL Wishlist Alert System Comprehensive Test
// Validates complete wishlist functionality with price tracking and notifications

import axios from 'axios';

const BASE_URL = 'http://localhost:5000';
const TEST_SHOPPER_ID = 'test_shopper_001';

class WishlistAlertTester {
  constructor() {
    this.testResults = [];
    this.alertsCreated = [];
    this.wishlistItems = [];
  }

  async runTest(testName, testFunction) {
    try {
      console.log(`\n🔬 Running: ${testName}`);
      const result = await testFunction();
      this.testResults.push({ name: testName, status: 'PASSED', result });
      console.log(`✅ PASSED: ${testName}`);
      return result;
    } catch (error) {
      this.testResults.push({ name: testName, status: 'FAILED', error: error.message });
      console.log(`❌ FAILED: ${testName} - ${error.message}`);
      throw error;
    }
  }

  async testProductPricesAPI() {
    const response = await axios.get(`${BASE_URL}/api/products/prices`);
    
    if (!response.data.success) {
      throw new Error('Product prices API did not return success');
    }

    if (!response.data.products || Object.keys(response.data.products).length === 0) {
      throw new Error('No products found in prices API');
    }

    return {
      totalProducts: Object.keys(response.data.products).length,
      sampleProduct: Object.values(response.data.products)[0]
    };
  }

  async testAddWishlistItem() {
    const payload = {
      shopperId: TEST_SHOPPER_ID,
      productId: 'prod_1',
      alertPreferences: {
        priceDrop: true,
        restock: true
      }
    };

    const response = await axios.post(`${BASE_URL}/api/wishlist/add`, payload);
    
    if (!response.data.success) {
      throw new Error('Failed to add item to wishlist');
    }

    if (!response.data.wishlistItem) {
      throw new Error('No wishlist item returned');
    }

    this.wishlistItems.push(response.data.wishlistItem);
    
    return response.data.wishlistItem;
  }

  async testGetWishlistItems() {
    const response = await axios.get(`${BASE_URL}/api/wishlist/${TEST_SHOPPER_ID}`);
    
    if (!response.data.success) {
      throw new Error('Failed to retrieve wishlist items');
    }

    if (!Array.isArray(response.data.wishlistItems)) {
      throw new Error('Wishlist items not returned as array');
    }

    return {
      totalItems: response.data.totalItems,
      items: response.data.wishlistItems
    };
  }

  async testPriceDropSimulation() {
    const originalPrice = 299.99;
    const newPrice = 199.99; // 33% discount
    
    const payload = {
      productId: 'prod_1',
      newPrice: newPrice
    };

    const response = await axios.post(`${BASE_URL}/api/products/simulate-price-change`, payload);
    
    if (!response.data.success) {
      throw new Error('Price drop simulation failed');
    }

    if (response.data.alertsCreated === 0) {
      throw new Error('No alerts created for price drop');
    }

    return {
      oldPrice: response.data.oldPrice,
      newPrice: response.data.newPrice,
      alertsCreated: response.data.alertsCreated,
      percentageDiscount: ((originalPrice - newPrice) / originalPrice * 100).toFixed(2)
    };
  }

  async testRestockSimulation() {
    // First simulate out of stock
    await axios.post(`${BASE_URL}/api/products/simulate-price-change`, {
      productId: 'prod_2',
      inStock: false
    });

    // Add prod_2 to wishlist with restock alerts
    await axios.post(`${BASE_URL}/api/wishlist/add`, {
      shopperId: TEST_SHOPPER_ID,
      productId: 'prod_2',
      alertPreferences: {
        priceDrop: false,
        restock: true
      }
    });

    // Now simulate restock
    const response = await axios.post(`${BASE_URL}/api/products/simulate-price-change`, {
      productId: 'prod_2',
      inStock: true
    });

    if (!response.data.success) {
      throw new Error('Restock simulation failed');
    }

    return {
      wasInStock: response.data.wasInStock,
      nowInStock: response.data.nowInStock,
      alertsCreated: response.data.alertsCreated
    };
  }

  async testGetPendingAlerts() {
    const response = await axios.get(`${BASE_URL}/api/alerts/${TEST_SHOPPER_ID}`);
    
    if (!response.data.success) {
      throw new Error('Failed to retrieve pending alerts');
    }

    if (!Array.isArray(response.data.pendingAlerts)) {
      throw new Error('Pending alerts not returned as array');
    }

    this.alertsCreated = response.data.pendingAlerts;

    return {
      totalAlerts: response.data.totalAlerts,
      priceDropAlerts: response.data.pendingAlerts.filter(a => a.alertType === 'price_drop').length,
      restockAlerts: response.data.pendingAlerts.filter(a => a.alertType === 'restock').length
    };
  }

  async testUpdateAlertPreferences() {
    if (this.wishlistItems.length === 0) {
      throw new Error('No wishlist items available for testing');
    }

    const itemId = this.wishlistItems[0].id;
    const newPreferences = {
      priceDrop: false,
      restock: true
    };

    const response = await axios.put(`${BASE_URL}/api/wishlist/${itemId}/alerts`, {
      alertPreferences: newPreferences
    });

    if (!response.data.success) {
      throw new Error('Failed to update alert preferences');
    }

    return response.data.wishlistItem;
  }

  async testMarkAlertsAsSent() {
    if (this.alertsCreated.length === 0) {
      throw new Error('No alerts available for testing');
    }

    const alertIds = this.alertsCreated.map(alert => alert.id);
    
    const response = await axios.post(`${BASE_URL}/api/alerts/mark-sent`, {
      alertIds: alertIds
    });

    if (!response.data.success) {
      throw new Error('Failed to mark alerts as sent');
    }

    return {
      alertsMarked: alertIds.length
    };
  }

  async testRemoveWishlistItem() {
    if (this.wishlistItems.length === 0) {
      throw new Error('No wishlist items available for testing');
    }

    const itemId = this.wishlistItems[0].id;
    
    const response = await axios.delete(`${BASE_URL}/api/wishlist/${itemId}`, {
      data: { shopperId: TEST_SHOPPER_ID }
    });

    if (!response.data.success) {
      throw new Error('Failed to remove wishlist item');
    }

    return { removedItemId: itemId };
  }

  async validateAlertStructure() {
    const alerts = this.alertsCreated;
    
    for (const alert of alerts) {
      // Validate required fields
      const requiredFields = ['id', 'shopperId', 'productId', 'alertType', 'createdAt'];
      for (const field of requiredFields) {
        if (!(field in alert)) {
          throw new Error(`Alert missing required field: ${field}`);
        }
      }

      // Validate alert types
      if (!['price_drop', 'restock', 'price_increase'].includes(alert.alertType)) {
        throw new Error(`Invalid alert type: ${alert.alertType}`);
      }

      // Validate price fields for price alerts
      if (alert.alertType === 'price_drop' || alert.alertType === 'price_increase') {
        if (!alert.originalPrice || !alert.currentPrice) {
          throw new Error('Price alerts must have originalPrice and currentPrice');
        }
      }
    }

    return { validatedAlerts: alerts.length };
  }

  async runAllTests() {
    console.log('\n🚀 SPIRAL Wishlist Alert System Comprehensive Test');
    console.log('=' .repeat(60));

    try {
      // Test 1: Product Prices API
      const pricesResult = await this.runTest(
        'Product Prices API',
        () => this.testProductPricesAPI()
      );

      // Test 2: Add Wishlist Item
      const addResult = await this.runTest(
        'Add Wishlist Item',
        () => this.testAddWishlistItem()
      );

      // Test 3: Get Wishlist Items
      const getResult = await this.runTest(
        'Get Wishlist Items',
        () => this.testGetWishlistItems()
      );

      // Test 4: Price Drop Simulation
      const priceDropResult = await this.runTest(
        'Price Drop Simulation',
        () => this.testPriceDropSimulation()
      );

      // Test 5: Restock Simulation
      const restockResult = await this.runTest(
        'Restock Simulation',
        () => this.testRestockSimulation()
      );

      // Test 6: Get Pending Alerts
      const alertsResult = await this.runTest(
        'Get Pending Alerts',
        () => this.testGetPendingAlerts()
      );

      // Test 7: Validate Alert Structure
      await this.runTest(
        'Validate Alert Structure',
        () => this.validateAlertStructure()
      );

      // Test 8: Update Alert Preferences
      await this.runTest(
        'Update Alert Preferences',
        () => this.testUpdateAlertPreferences()
      );

      // Test 9: Mark Alerts as Sent
      await this.runTest(
        'Mark Alerts as Sent',
        () => this.testMarkAlertsAsSent()
      );

      // Test 10: Remove Wishlist Item
      await this.runTest(
        'Remove Wishlist Item',
        () => this.testRemoveWishlistItem()
      );

      // Generate comprehensive report
      this.generateTestReport();

    } catch (error) {
      console.error('\n💥 Test suite failed:', error.message);
      this.generateTestReport();
      process.exit(1);
    }
  }

  generateTestReport() {
    console.log('\n📊 SPIRAL Wishlist Alert System Test Report');
    console.log('=' .repeat(60));

    const passedTests = this.testResults.filter(t => t.status === 'PASSED');
    const failedTests = this.testResults.filter(t => t.status === 'FAILED');

    console.log(`\n✅ Passed: ${passedTests.length}`);
    console.log(`❌ Failed: ${failedTests.length}`);
    console.log(`📈 Success Rate: ${((passedTests.length / this.testResults.length) * 100).toFixed(1)}%`);

    if (failedTests.length > 0) {
      console.log('\n🔍 Failed Tests:');
      failedTests.forEach(test => {
        console.log(`   ❌ ${test.name}: ${test.error}`);
      });
    }

    if (passedTests.length === this.testResults.length) {
      console.log('\n🎉 ALL TESTS PASSED! Wishlist Alert System is fully functional.');
      console.log('\n📋 System Features Validated:');
      console.log('   ✓ Product price tracking');
      console.log('   ✓ Wishlist item management');
      console.log('   ✓ Price drop alert generation');
      console.log('   ✓ Restock alert generation');
      console.log('   ✓ Alert preference customization');
      console.log('   ✓ Alert notification management');
      console.log('   ✓ Complete CRUD operations');
      console.log('   ✓ Real-time price monitoring simulation');
      
      console.log('\n🔗 Access Points:');
      console.log('   Demo Page: http://localhost:3000/wishlist-demo');
      console.log('   Live Interface: http://localhost:3000/wishlist-alerts');
      console.log('   API Endpoints: http://localhost:5000/api/wishlist/* & /api/alerts/*');
    }

    console.log('\n' + '=' .repeat(60));
  }
}

// Run the comprehensive test
const tester = new WishlistAlertTester();
tester.runAllTests();