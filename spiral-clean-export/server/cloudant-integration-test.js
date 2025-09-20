// SPIRAL Cloudant Integration Test & Connection Manager
// This will test and establish IBM Cloud production database connection

const { CloudantV1 } = require('@ibm-cloud/cloudant');
const { IamAuthenticator } = require('ibm-cloud-sdk-core');

class SpiralCloudantManager {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.dbName = process.env.CLOUDANT_DB || 'spiral_production';
  }

  // Initialize Cloudant connection
  async initialize() {
    try {
      console.log('🔗 Initializing SPIRAL Cloudant Connection...');
      
      // Check for required environment variables
      const requiredVars = ['CLOUDANT_URL', 'CLOUDANT_APIKEY'];
      const missing = requiredVars.filter(key => !process.env[key]);
      
      if (missing.length > 0) {
        console.log('❌ Missing Cloudant credentials:', missing);
        console.log('Please add these secrets in Replit:');
        missing.forEach(key => console.log(`  - ${key}`));
        return false;
      }

      // Initialize authenticator
      const authenticator = new IamAuthenticator({
        apikey: process.env.CLOUDANT_APIKEY,
      });

      // Create Cloudant client
      this.client = CloudantV1.newInstance({
        authenticator: authenticator,
      });

      this.client.setServiceUrl(process.env.CLOUDANT_URL);

      // Test connection
      const info = await this.client.getServerInformation();
      console.log('✅ Cloudant connection successful!');
      console.log('   Version:', info.result.version);
      console.log('   Vendor:', info.result.vendor.name);
      
      this.isConnected = true;
      return true;

    } catch (error) {
      console.error('❌ Cloudant connection failed:', error.message);
      this.isConnected = false;
      return false;
    }
  }

  // Test database operations
  async testDatabaseOperations() {
    if (!this.isConnected) {
      console.log('❌ Not connected to Cloudant');
      return false;
    }

    try {
      console.log('🧪 Testing SPIRAL database operations...');

      // Check if database exists
      let dbExists = false;
      try {
        await this.client.getDatabaseInformation({ db: this.dbName });
        dbExists = true;
        console.log(`✅ Database '${this.dbName}' exists`);
      } catch (error) {
        if (error.status === 404) {
          console.log(`📝 Database '${this.dbName}' does not exist, creating...`);
          await this.client.putDatabase({ db: this.dbName });
          console.log(`✅ Created database '${this.dbName}'`);
        } else {
          throw error;
        }
      }

      // Test document operations
      const testDoc = {
        _id: 'spiral_test_' + Date.now(),
        type: 'integration_test',
        platform: 'SPIRAL',
        timestamp: new Date().toISOString(),
        status: 'testing_cloudant_connection'
      };

      // Create test document
      const createResult = await this.client.postDocument({
        db: this.dbName,
        document: testDoc
      });
      console.log('✅ Test document created:', createResult.result.id);

      // Read test document
      const readResult = await this.client.getDocument({
        db: this.dbName,
        docId: createResult.result.id
      });
      console.log('✅ Test document retrieved:', readResult.result.type);

      // Delete test document
      await this.client.deleteDocument({
        db: this.dbName,
        docId: createResult.result.id,
        rev: createResult.result.rev
      });
      console.log('✅ Test document deleted');

      console.log('🎉 All database operations successful!');
      return true;

    } catch (error) {
      console.error('❌ Database operations failed:', error.message);
      return false;
    }
  }

  // Setup SPIRAL production schema
  async setupSpiralSchema() {
    if (!this.isConnected) {
      console.log('❌ Not connected to Cloudant');
      return false;
    }

    try {
      console.log('🏗️ Setting up SPIRAL production schema...');

      // Create indexes for common queries
      const indexes = [
        {
          index: { fields: ['type'] },
          name: 'type-index',
          type: 'json'
        },
        {
          index: { fields: ['store_id'] },
          name: 'store-index',
          type: 'json'
        },
        {
          index: { fields: ['user_id'] },
          name: 'user-index',
          type: 'json'
        },
        {
          index: { fields: ['created_at'] },
          name: 'timestamp-index',
          type: 'json'
        }
      ];

      for (const index of indexes) {
        try {
          await this.client.postIndex({
            db: this.dbName,
            index: index.index,
            name: index.name,
            type: index.type
          });
          console.log(`✅ Created index: ${index.name}`);
        } catch (error) {
          if (error.status === 409) {
            console.log(`ℹ️ Index ${index.name} already exists`);
          } else {
            throw error;
          }
        }
      }

      console.log('✅ SPIRAL schema setup complete!');
      return true;

    } catch (error) {
      console.error('❌ Schema setup failed:', error.message);
      return false;
    }
  }

  // Get connection status
  getStatus() {
    return {
      connected: this.isConnected,
      database: this.dbName,
      url: process.env.CLOUDANT_URL || 'Not configured',
      timestamp: new Date().toISOString()
    };
  }
}

// Export for use in routes
module.exports = SpiralCloudantManager;

// Test runner function
async function runCloudantIntegrationTest() {
  console.log('\n🚀 SPIRAL Cloudant Integration Test');
  console.log('=====================================');

  const manager = new SpiralCloudantManager();
  
  // Test connection
  const connected = await manager.initialize();
  if (!connected) {
    console.log('\n❌ Cloudant integration test FAILED');
    console.log('Please add the Cloudant secrets to Replit and restart SPIRAL');
    return false;
  }

  // Test operations
  const operationsOk = await manager.testDatabaseOperations();
  if (!operationsOk) {
    console.log('\n❌ Database operations test FAILED');
    return false;
  }

  // Setup schema
  const schemaOk = await manager.setupSpiralSchema();
  if (!schemaOk) {
    console.log('\n❌ Schema setup FAILED');
    return false;
  }

  console.log('\n🎉 SPIRAL Cloudant Integration SUCCESS!');
  console.log('Your IBM Cloud database is ready for production');
  console.log('=====================================\n');
  
  return true;
}

// Auto-run test if credentials are available
if (process.env.CLOUDANT_URL && process.env.CLOUDANT_APIKEY) {
  runCloudantIntegrationTest();
} else {
  console.log('\n⏳ Waiting for Cloudant credentials...');
  console.log('Add these secrets to Replit to enable IBM Cloud integration:');
  console.log('- CLOUDANT_URL');
  console.log('- CLOUDANT_APIKEY'); 
  console.log('- CLOUDANT_HOST');
  console.log('- CLOUDANT_USERNAME');
  console.log('- CLOUDANT_DB');
  console.log('- IBM_CLOUDANT_URL');
  console.log('- IBM_CLOUDANT_API_KEY\n');
}