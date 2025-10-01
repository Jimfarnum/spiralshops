/**
 * IBM Cloudant Database Integration Utility
 * Provides connection and data access methods for Cloudant NoSQL database
 */

// Mock Cloudant client for development (replace with actual IBM Cloudant SDK when credentials available)
class CloudantClient {
  constructor() {
    this.connected = false;
    this.mockData = {
      products: [
        {
          _id: "product_1",
          name: "Wireless Bluetooth Headphones",
          category: "Electronics",
          price: 89.99,
          lat: 40.7505,
          lng: -73.9934,
          store: "Downtown Electronics",
          description: "Premium wireless headphones with noise cancellation",
          tags: ["audio", "wireless", "bluetooth", "headphones"],
          inStock: true,
          rating: 4.5,
          reviews: 234
        },
        {
          _id: "product_2", 
          name: "Running Shoes",
          category: "Sports",
          price: 120.00,
          lat: 40.7289,
          lng: -74.0033,
          store: "Athletic Gear Pro",
          description: "Professional running shoes for athletes",
          tags: ["shoes", "running", "sports", "athletic"],
          inStock: true,
          rating: 4.7,
          reviews: 156
        },
        {
          _id: "product_3",
          name: "Coffee Maker",
          category: "Appliances", 
          price: 199.99,
          lat: 40.6892,
          lng: -73.9900,
          store: "Home Essentials",
          description: "Automatic coffee maker with programmable settings",
          tags: ["coffee", "appliance", "kitchen", "automatic"],
          inStock: true,
          rating: 4.3,
          reviews: 89
        },
        {
          _id: "product_4",
          name: "Smartphone",
          category: "Electronics",
          price: 599.99,
          lat: 40.7505,
          lng: -73.9934,
          store: "Downtown Electronics",
          description: "Latest smartphone with advanced camera features",
          tags: ["phone", "smartphone", "mobile", "electronics"],
          inStock: true,
          rating: 4.6,
          reviews: 312
        },
        {
          _id: "product_5",
          name: "Yoga Mat",
          category: "Sports",
          price: 45.00,
          lat: 40.7289,
          lng: -74.0033,
          store: "Athletic Gear Pro", 
          description: "Non-slip yoga mat for exercise and meditation",
          tags: ["yoga", "mat", "exercise", "fitness"],
          inStock: true,
          rating: 4.4,
          reviews: 78
        }
      ],
      stores: [
        {
          _id: "store_1",
          name: "Downtown Electronics",
          category: "Electronics",
          lat: 40.7505,
          lng: -73.9934,
          address: "123 Main St, New York, NY 10001",
          phone: "(555) 123-4567",
          verified: true,
          rating: 4.5
        },
        {
          _id: "store_2",
          name: "Athletic Gear Pro",
          category: "Sports",
          lat: 40.7289,
          lng: -74.0033,
          address: "456 Broadway, New York, NY 10013",
          phone: "(555) 234-5678",
          verified: true,
          rating: 4.7
        },
        {
          _id: "store_3",
          name: "Home Essentials",
          category: "Home & Garden",
          lat: 40.6892,
          lng: -73.9900,
          address: "789 Court St, Brooklyn, NY 11201",
          phone: "(555) 345-6789",
          verified: true,
          rating: 4.3
        }
      ]
    };
    
    console.log('✅ Cloudant client initialized (mock mode)');
  }

  async connect() {
    // Mock connection - replace with actual Cloudant connection
    this.connected = true;
    return Promise.resolve(true);
  }

  async get(collection) {
    if (!this.connected) {
      await this.connect();
    }
    
    return Promise.resolve(this.mockData[collection] || []);
  }

  async findByLabel(collection, labels) {
    const data = await this.get(collection);
    
    return data.filter(item => {
      if (!item.tags) return false;
      
      return labels.some(label => 
        item.tags.some(tag => tag.toLowerCase().includes(label.toLowerCase())) ||
        item.name.toLowerCase().includes(label.toLowerCase()) ||
        item.category.toLowerCase().includes(label.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(label.toLowerCase()))
      );
    });
  }

  async findByLocation(collection, lat, lng, radiusKm = 25) {
    const data = await this.get(collection);
    
    return data.filter(item => {
      if (!item.lat || !item.lng) return false;
      
      // Simple distance calculation (replace with more accurate formula if needed)
      const distance = Math.sqrt(
        Math.pow(item.lat - lat, 2) + Math.pow(item.lng - lng, 2)
      ) * 111; // Rough km conversion
      
      return distance <= radiusKm;
    });
  }

  async create(collection, document) {
    if (!this.mockData[collection]) {
      this.mockData[collection] = [];
    }
    
    const newDoc = {
      ...document,
      _id: `${collection}_${Date.now()}`,
      _rev: '1-' + Math.random().toString(36).substr(2, 9)
    };
    
    this.mockData[collection].push(newDoc);
    return Promise.resolve(newDoc);
  }

  async update(collection, id, updates) {
    const data = this.mockData[collection] || [];
    const index = data.findIndex(item => item._id === id);
    
    if (index === -1) {
      throw new Error('Document not found');
    }
    
    this.mockData[collection][index] = {
      ...this.mockData[collection][index],
      ...updates,
      _rev: '2-' + Math.random().toString(36).substr(2, 9)
    };
    
    return Promise.resolve(this.mockData[collection][index]);
  }

  async delete(collection, id) {
    const data = this.mockData[collection] || [];
    const index = data.findIndex(item => item._id === id);
    
    if (index === -1) {
      throw new Error('Document not found');
    }
    
    const deleted = this.mockData[collection].splice(index, 1)[0];
    return Promise.resolve(deleted);
  }

  async query(collection, queryFunction) {
    const data = await this.get(collection);
    return data.filter(queryFunction);
  }

  getStatus() {
    return {
      connected: this.connected,
      mode: 'mock',
      collections: Object.keys(this.mockData),
      totalDocuments: Object.values(this.mockData).reduce((sum, arr) => sum + arr.length, 0)
    };
  }
}

// Export singleton instance
const cloudant = new CloudantClient();
export default cloudant;