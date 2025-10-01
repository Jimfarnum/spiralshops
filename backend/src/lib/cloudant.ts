import { CloudantV1 } from '@ibm-cloud/cloudant';

let cloudantClient: CloudantV1 | null = null;

export async function initializeCloudant(): Promise<CloudantV1 | null> {
  if (cloudantClient) {
    return cloudantClient;
  }

  try {
    const cloudantUrl = process.env.CLOUDANT_URL;
    const cloudantApiKey = process.env.CLOUDANT_IAM_API_KEY;

    if (!cloudantUrl || !cloudantApiKey) {
      console.warn('⚠️ Cloudant credentials not found, running with fallback storage');
      return null; // Return null instead of throwing error
    }

    cloudantClient = CloudantV1.newInstance({
      url: cloudantUrl,
    });

    // Test connection
    await cloudantClient.getAllDbs();
    console.log('✅ Cloudant connection established');
    
    return cloudantClient;
  } catch (error) {
    console.warn('⚠️ Cloudant unavailable, using fallback storage:', error.message);
    return null; // Return null instead of throwing error
  }
}

export function getCloudantClient(): CloudantV1 | null {
  return cloudantClient;
}

// Database operations
export class CloudantService {
  private client: CloudantV1 | null;
  private dbName: string;

  constructor(dbName: string) {
    this.client = cloudantClient;
    this.dbName = dbName;
  }

  async createDatabase(): Promise<void> {
    if (!this.client) {
      console.log(`⚠️ Cloudant not available, skipping database creation for '${this.dbName}'`);
      return;
    }
    try {
      await this.client.putDatabase({ db: this.dbName });
      console.log(`✅ Database '${this.dbName}' created or already exists`);
    } catch (error: any) {
      if (error.status !== 412) { // 412 = database already exists
        throw error;
      }
    }
  }

  async insertDocument(document: any): Promise<any> {
    try {
      const response = await this.client.postDocument({
        db: this.dbName,
        document
      });
      return response.result;
    } catch (error) {
      console.error(`Error inserting document into ${this.dbName}:`, error);
      throw error;
    }
  }

  async getDocument(docId: string): Promise<any> {
    try {
      const response = await this.client.getDocument({
        db: this.dbName,
        docId
      });
      return response.result;
    } catch (error) {
      console.error(`Error getting document ${docId} from ${this.dbName}:`, error);
      throw error;
    }
  }

  async queryDocuments(selector: any): Promise<any[]> {
    try {
      const response = await this.client.postFind({
        db: this.dbName,
        selector
      });
      return response.result.docs || [];
    } catch (error) {
      console.error(`Error querying documents from ${this.dbName}:`, error);
      throw error;
    }
  }

  async updateDocument(docId: string, document: any): Promise<any> {
    try {
      // Get current revision
      const currentDoc = await this.getDocument(docId);
      const updatedDoc = {
        ...document,
        _id: docId,
        _rev: currentDoc._rev
      };

      const response = await this.client.postDocument({
        db: this.dbName,
        document: updatedDoc
      });
      return response.result;
    } catch (error) {
      console.error(`Error updating document ${docId} in ${this.dbName}:`, error);
      throw error;
    }
  }

  async deleteDocument(docId: string): Promise<void> {
    try {
      const currentDoc = await this.getDocument(docId);
      await this.client.deleteDocument({
        db: this.dbName,
        docId,
        rev: currentDoc._rev
      });
    } catch (error) {
      console.error(`Error deleting document ${docId} from ${this.dbName}:`, error);
      throw error;
    }
  }
}