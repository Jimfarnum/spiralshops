import { CloudantService } from './cloudant.js';

interface ServiceRegistration {
  id: string;
  name: string;
  version: string;
  endpoint: string;
  healthCheck: string;
  status: 'active' | 'inactive' | 'maintenance';
  lastHeartbeat: Date;
  metadata: Record<string, any>;
}

interface RetailerRegistration {
  id: string;
  businessName: string;
  contactEmail: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  businessType: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  registrationDate: Date;
  documents: string[];
  spiralStoreId?: string;
}

export class ServiceRegistry {
  private cloudantService: CloudantService;
  private services: Map<string, ServiceRegistration> = new Map();

  constructor() {
    this.cloudantService = new CloudantService('spiral-service-registry');
  }

  async initialize(): Promise<void> {
    try {
      await this.cloudantService.createDatabase();
      console.log('✅ Service Registry initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Service Registry:', error);
      throw error;
    }
  }

  async registerService(service: Omit<ServiceRegistration, 'lastHeartbeat'>): Promise<void> {
    const registration: ServiceRegistration = {
      ...service,
      lastHeartbeat: new Date()
    };

    try {
      await this.cloudantService.insertDocument({
        _id: service.id,
        type: 'service',
        ...registration
      });
      
      this.services.set(service.id, registration);
      console.log(`✅ Service '${service.name}' registered successfully`);
    } catch (error) {
      console.error(`❌ Failed to register service '${service.name}':`, error);
      throw error;
    }
  }

  async updateServiceStatus(serviceId: string, status: ServiceRegistration['status']): Promise<void> {
    try {
      const service = this.services.get(serviceId);
      if (!service) {
        throw new Error(`Service '${serviceId}' not found`);
      }

      service.status = status;
      service.lastHeartbeat = new Date();

      await this.cloudantService.updateDocument(serviceId, {
        type: 'service',
        ...service
      });

      this.services.set(serviceId, service);
      console.log(`✅ Service '${serviceId}' status updated to '${status}'`);
    } catch (error) {
      console.error(`❌ Failed to update service status for '${serviceId}':`, error);
      throw error;
    }
  }

  async heartbeat(serviceId: string): Promise<void> {
    try {
      const service = this.services.get(serviceId);
      if (!service) {
        throw new Error(`Service '${serviceId}' not found`);
      }

      service.lastHeartbeat = new Date();
      await this.cloudantService.updateDocument(serviceId, {
        type: 'service',
        ...service
      });

      this.services.set(serviceId, service);
    } catch (error) {
      console.error(`❌ Heartbeat failed for service '${serviceId}':`, error);
      throw error;
    }
  }

  async getActiveServices(): Promise<ServiceRegistration[]> {
    try {
      const docs = await this.cloudantService.queryDocuments({
        type: 'service',
        status: 'active'
      });

      return docs.map(doc => ({
        id: doc._id,
        name: doc.name,
        version: doc.version,
        endpoint: doc.endpoint,
        healthCheck: doc.healthCheck,
        status: doc.status,
        lastHeartbeat: new Date(doc.lastHeartbeat),
        metadata: doc.metadata
      }));
    } catch (error) {
      console.error('❌ Failed to get active services:', error);
      return Array.from(this.services.values()).filter(s => s.status === 'active');
    }
  }

  async getAllServices(): Promise<ServiceRegistration[]> {
    try {
      const docs = await this.cloudantService.queryDocuments({
        type: 'service'
      });

      return docs.map(doc => ({
        id: doc._id,
        name: doc.name,
        version: doc.version,
        endpoint: doc.endpoint,
        healthCheck: doc.healthCheck,
        status: doc.status,
        lastHeartbeat: new Date(doc.lastHeartbeat),
        metadata: doc.metadata
      }));
    } catch (error) {
      console.error('❌ Failed to get all services:', error);
      return Array.from(this.services.values());
    }
  }
}

export class RetailerRegistry {
  private cloudantService: CloudantService;

  constructor() {
    this.cloudantService = new CloudantService('spiral-retailer-registry');
  }

  async initialize(): Promise<void> {
    try {
      await this.cloudantService.createDatabase();
      console.log('✅ Retailer Registry initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Retailer Registry:', error);
      throw error;
    }
  }

  async registerRetailer(retailer: Omit<RetailerRegistration, 'id' | 'registrationDate' | 'status'>): Promise<string> {
    const registration: RetailerRegistration = {
      ...retailer,
      id: `retailer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      registrationDate: new Date(),
      status: 'pending'
    };

    try {
      await this.cloudantService.insertDocument({
        _id: registration.id,
        type: 'retailer',
        ...registration
      });

      console.log(`✅ Retailer '${retailer.businessName}' registered successfully`);
      return registration.id;
    } catch (error) {
      console.error(`❌ Failed to register retailer '${retailer.businessName}':`, error);
      throw error;
    }
  }

  async updateRetailerStatus(retailerId: string, status: RetailerRegistration['status'], spiralStoreId?: string): Promise<void> {
    try {
      const retailer = await this.cloudantService.getDocument(retailerId);
      
      const updatedRetailer = {
        ...retailer,
        status,
        ...(spiralStoreId && { spiralStoreId }),
        lastUpdated: new Date()
      };

      await this.cloudantService.updateDocument(retailerId, updatedRetailer);
      console.log(`✅ Retailer '${retailerId}' status updated to '${status}'`);
    } catch (error) {
      console.error(`❌ Failed to update retailer status for '${retailerId}':`, error);
      throw error;
    }
  }

  async getRetailersByStatus(status: RetailerRegistration['status']): Promise<RetailerRegistration[]> {
    try {
      const docs = await this.cloudantService.queryDocuments({
        type: 'retailer',
        status
      });

      return docs.map(doc => ({
        id: doc._id,
        businessName: doc.businessName,
        contactEmail: doc.contactEmail,
        phone: doc.phone,
        address: doc.address,
        businessType: doc.businessType,
        status: doc.status,
        registrationDate: new Date(doc.registrationDate),
        documents: doc.documents,
        spiralStoreId: doc.spiralStoreId
      }));
    } catch (error) {
      console.error(`❌ Failed to get retailers with status '${status}':`, error);
      throw error;
    }
  }
}

let serviceRegistry: ServiceRegistry | null = null;
let retailerRegistry: RetailerRegistry | null = null;

export async function initializeRegistry(): Promise<void> {
  try {
    serviceRegistry = new ServiceRegistry();
    retailerRegistry = new RetailerRegistry();

    await serviceRegistry.initialize();
    await retailerRegistry.initialize();

    console.log('✅ Registry services initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize registry services:', error);
    throw error;
  }
}

export function getServiceRegistry(): ServiceRegistry {
  if (!serviceRegistry) {
    throw new Error('Service Registry not initialized');
  }
  return serviceRegistry;
}

export function getRetailerRegistry(): RetailerRegistry {
  if (!retailerRegistry) {
    throw new Error('Retailer Registry not initialized');
  }
  return retailerRegistry;
}