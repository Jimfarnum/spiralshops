// Simplified SpiralApi for deployment bundle
export class SpiralApi {
  static async products(mallId, query = {}) {
    // Beta product data with new additions
    const products = [
      { id: 1, name: "Wireless Bluetooth Headphones", price: 89.99, category: "Electronics", mallId },
      { id: 2, name: "Smart Fitness Watch", price: 299.99, category: "Electronics", mallId },
      { id: 3, name: "Organic Coffee Beans", price: 24.99, category: "Food & Beverage", mallId },
      { id: 4, name: "Designer Handbag", price: 149.99, category: "Fashion", mallId },
      { id: 5, name: "Artisan Chocolate", price: 12.99, category: "Food & Beverage", mallId },
      { id: 101, name: "Beta Denim Jacket", price: 49.99, category: "Fashion", mallId },
      { id: 102, name: "Beta Hiking Boots", price: 99.99, category: "Footwear", mallId },
      { id: 103, name: "Beta Coffee Mug", price: 14.99, category: "Home & Kitchen", mallId }
    ];
    
    let filtered = products;
    if (query.category) {
      filtered = products.filter(p => p.category.toLowerCase().includes(query.category.toLowerCase()));
    }
    if (query.search) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(query.search.toLowerCase()));
    }
    
    return { success: true, products: filtered };
  }
  
  static async stores(mallId, query = {}) {
    const stores = [
      { id: 1, name: "Downtown Electronics", category: "Electronics", location: "Minneapolis, MN", mallId },
      { id: 2, name: "Fresh Market Co", category: "Food & Beverage", location: "Minneapolis, MN", mallId },
      { id: 3, name: "Fashion Forward", category: "Fashion", location: "Minneapolis, MN", mallId },
      { id: 4, name: "Artisan Goods", category: "Handmade", location: "Minneapolis, MN", mallId }
    ];
    
    let filtered = stores;
    if (query.category) {
      filtered = stores.filter(s => s.category.toLowerCase().includes(query.category.toLowerCase()));
    }
    
    return { success: true, stores: filtered };
  }
  
  static async search(mallId, searchTerm) {
    const products = await this.products(mallId, { search: searchTerm });
    const stores = await this.stores(mallId, { search: searchTerm });
    
    return {
      success: true,
      results: {
        products: products.products || [],
        stores: stores.stores || [],
        query: searchTerm
      }
    };
  }
}