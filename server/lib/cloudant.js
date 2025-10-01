import { CloudantV1 } from "@ibm-cloud/cloudant";
import { IamAuthenticator } from "ibm-cloud-sdk-core";

const cloudant = CloudantV1.newInstance({
  authenticator: new IamAuthenticator({ apikey: process.env.CLOUDANT_APIKEY }),
  serviceUrl: process.env.CLOUDANT_URL
});

export const DB = {
  name: process.env.CLOUDANT_DBNAME || "spiral_retailers",
  client: cloudant
};

// Ensure DB exists (call this on boot)
export async function ensureDb() {
  try {
    const { result } = await DB.client.getAllDbs();
    if (!result.includes(DB.name)) {
      await DB.client.putDatabase({ db: DB.name });
      console.log(`✅ Cloudant database '${DB.name}' created successfully`);
    } else {
      console.log(`✅ Cloudant database '${DB.name}' already exists`);
    }
  } catch (error) {
    console.error("❌ Cloudant database setup failed:", error);
    throw error;
  }
}

// Legacy getCloudant function for backward compatibility with existing shipment tracking
const collections = new Map();

export function getCloudant() {
  return {
    async insert(collectionName, doc) {
      if (!collections.has(collectionName)) {
        collections.set(collectionName, new Map());
      }
      const collection = collections.get(collectionName);
      collection.set(doc._id, doc);
      return { ok: true, id: doc._id, rev: '1-mock' };
    },
    
    async find(collectionName, query) {
      if (!collections.has(collectionName)) {
        return { result: { docs: [] } };
      }
      
      const collection = collections.get(collectionName);
      let docs = Array.from(collection.values());
      
      // Apply selector filtering
      if (query.selector) {
        docs = docs.filter(doc => {
          for (const [key, value] of Object.entries(query.selector)) {
            if (doc[key] !== value) {
              return false;
            }
          }
          return true;
        });
      }
      
      // Apply skip
      if (query.skip) {
        docs = docs.slice(query.skip);
      }
      
      // Apply limit
      if (query.limit) {
        docs = docs.slice(0, query.limit);
      }
      
      return { result: { docs } };
    },
    
    async get(docId) {
      // Find document across all collections
      for (const collection of collections.values()) {
        if (collection.has(docId)) {
          return collection.get(docId);
        }
      }
      throw new Error(`Document not found: ${docId}`);
    },
    
    async getInfo(dbName) {
      const collection = collections.get(dbName);
      return {
        db_name: dbName,
        doc_count: collection ? collection.size : 0,
        update_seq: Date.now(),
        disk_size: collection ? collection.size * 1024 : 0
      };
    },
    
    // Mock index creation for development
    async createIndex(dbName, indexDef) {
      console.log(`📊 [Cloudant Mock] Index created for ${dbName}:`, indexDef.name);
      return { ok: true, id: indexDef.name, name: indexDef.name };
    },
    
    // Get collection stats
    getCollectionStats() {
      const stats = {};
      for (const [name, collection] of collections.entries()) {
        stats[name] = {
          documents: collection.size,
          collections: collections.size
        };
      }
      return stats;
    }
  };
}