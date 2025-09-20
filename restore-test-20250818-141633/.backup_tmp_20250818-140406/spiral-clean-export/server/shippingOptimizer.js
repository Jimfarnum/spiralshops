// Advanced Shipping Optimization Engine for SPIRAL Platform

// Mock database for shipping carriers and services
const SHIPPING_CARRIERS = [
  {
    id: 1,
    name: "United States Postal Service",
    code: "USPS",
    isActive: true,
    supportsSameDay: false,
    supportsNextDay: true,
    supportsInternational: true,
    costMultiplier: 0.85, // Generally cheapest
    reliabilityScore: 0.92
  },
  {
    id: 2,
    name: "United Parcel Service",
    code: "UPS",
    isActive: true,
    supportsSameDay: true,
    supportsNextDay: true,
    supportsInternational: true,
    costMultiplier: 1.15,
    reliabilityScore: 0.96
  },
  {
    id: 3,
    name: "FedEx Corporation",
    code: "FEDEX",
    isActive: true,
    supportsSameDay: true,
    supportsNextDay: true,
    supportsInternational: true,
    costMultiplier: 1.25,
    reliabilityScore: 0.97
  },
  {
    id: 4,
    name: "DHL Express",
    code: "DHL",
    isActive: true,
    supportsSameDay: false,
    supportsNextDay: true,
    supportsInternational: true,
    costMultiplier: 1.35,
    reliabilityScore: 0.94
  },
  {
    id: 5,
    name: "Amazon Logistics",
    code: "AMZL",
    isActive: true,
    supportsSameDay: true,
    supportsNextDay: true,
    supportsInternational: false,
    costMultiplier: 0.95,
    reliabilityScore: 0.89
  }
];

const SHIPPING_SERVICES = [
  // USPS Services
  { carrierId: 1, serviceName: "USPS Ground Advantage", serviceCode: "USPS_GA", estimatedDays: 3, baseCost: 8.50 },
  { carrierId: 1, serviceName: "USPS Priority Mail", serviceCode: "USPS_PM", estimatedDays: 2, baseCost: 12.90 },
  { carrierId: 1, serviceName: "USPS Priority Mail Express", serviceCode: "USPS_PME", estimatedDays: 1, baseCost: 24.70 },
  
  // UPS Services
  { carrierId: 2, serviceName: "UPS Ground", serviceCode: "UPS_GND", estimatedDays: 4, baseCost: 9.25 },
  { carrierId: 2, serviceName: "UPS 3 Day Select", serviceCode: "UPS_3DS", estimatedDays: 3, baseCost: 15.50 },
  { carrierId: 2, serviceName: "UPS 2nd Day Air", serviceCode: "UPS_2DA", estimatedDays: 2, baseCost: 22.75 },
  { carrierId: 2, serviceName: "UPS Next Day Air", serviceCode: "UPS_NDA", estimatedDays: 1, baseCost: 35.20 },
  { carrierId: 2, serviceName: "UPS Same Day", serviceCode: "UPS_SD", estimatedDays: 0, baseCost: 89.99 },
  
  // FedEx Services
  { carrierId: 3, serviceName: "FedEx Ground", serviceCode: "FEDEX_GND", estimatedDays: 4, baseCost: 10.15 },
  { carrierId: 3, serviceName: "FedEx Express Saver", serviceCode: "FEDEX_ES", estimatedDays: 3, baseCost: 16.25 },
  { carrierId: 3, serviceName: "FedEx 2Day", serviceCode: "FEDEX_2D", estimatedDays: 2, baseCost: 24.50 },
  { carrierId: 3, serviceName: "FedEx Overnight", serviceCode: "FEDEX_ON", estimatedDays: 1, baseCost: 38.75 },
  { carrierId: 3, serviceName: "FedEx SameDay", serviceCode: "FEDEX_SD", estimatedDays: 0, baseCost: 95.00 },
  
  // DHL Services
  { carrierId: 4, serviceName: "DHL Express Worldwide", serviceCode: "DHL_EW", estimatedDays: 2, baseCost: 42.50 },
  { carrierId: 4, serviceName: "DHL Express 12:00", serviceCode: "DHL_E12", estimatedDays: 1, baseCost: 65.00 },
  
  // Amazon Logistics
  { carrierId: 5, serviceName: "Amazon Standard", serviceCode: "AMZL_STD", estimatedDays: 3, baseCost: 7.99 },
  { carrierId: 5, serviceName: "Amazon One-Day", serviceCode: "AMZL_1D", estimatedDays: 1, baseCost: 18.99 },
  { carrierId: 5, serviceName: "Amazon Same-Day", serviceCode: "AMZL_SD", estimatedDays: 0, baseCost: 12.99 }
];

// Free shipping offers database - from sellers and manufacturers
const FREE_SHIPPING_OFFERS = [
  {
    id: 1,
    offeredBy: "seller", // Retailer/Seller offers
    entityId: 1,
    entityName: "Twin Cities Tech Hub",
    offerType: "minimum_order",
    minimumOrderValue: 75.00,
    eligibleZipCodes: ["55401", "55402", "55403", "55404"], // Minneapolis area
    shippingMethods: ["USPS_GA", "UPS_GND"],
    isActive: true,
    terms: "Seller offers free standard shipping on orders $75+ within Minneapolis"
  },
  {
    id: 2,
    offeredBy: "manufacturer",
    entityId: 101,
    entityName: "Samsung Electronics",
    offerType: "product_specific",
    minimumOrderValue: 0,
    applicableProducts: ["electronics", "phones", "tablets"],
    eligibleZipCodes: "nationwide",
    shippingMethods: ["USPS_PM", "UPS_GND", "FEDEX_GND"],
    isActive: true,
    terms: "Manufacturer offers free shipping on all Samsung electronics nationwide"
  },
  {
    id: 3,
    offeredBy: "manufacturer",
    entityId: 102,
    entityName: "Apple Inc.",
    offerType: "product_specific",
    minimumOrderValue: 0,
    applicableProducts: ["electronics", "phones", "tablets", "computers"],
    eligibleZipCodes: "nationwide",
    shippingMethods: ["USPS_PM", "UPS_2DA", "FEDEX_ON"],
    isActive: true,
    terms: "Manufacturer offers free expedited shipping on all Apple products"
  },
  {
    id: 4,
    offeredBy: "seller",
    entityId: 2,
    entityName: "Mississippi River Coffee",
    offerType: "minimum_order",
    minimumOrderValue: 35.00,
    eligibleZipCodes: ["55101", "55102", "55103", "55104"], // St. Paul area
    shippingMethods: ["USPS_PM"],
    isActive: true,
    terms: "Seller offers free Priority Mail shipping on coffee orders $35+ in St. Paul"
  },
  {
    id: 5,
    offeredBy: "manufacturer",
    entityId: 103,
    entityName: "Nike Corporation",
    offerType: "minimum_order",
    minimumOrderValue: 50.00,
    eligibleZipCodes: "nationwide",
    shippingMethods: ["UPS_GND", "FEDEX_GND"],
    isActive: true,
    terms: "Manufacturer offers free ground shipping on Nike orders $50+ nationwide"
  },
  {
    id: 6,
    offeredBy: "seller",
    entityId: 3,
    entityName: "North Loop Fashion Co.",
    offerType: "promotional",
    minimumOrderValue: 40.00,
    eligibleZipCodes: "nationwide",
    shippingMethods: ["USPS_GA", "UPS_GND"],
    isActive: true,
    terms: "Seller promotional: Free shipping on fashion orders $40+ - limited time"
  }
];

export class ShippingOptimizer {
  
  /**
   * Find the most cost-effective shipping option
   */
  static findOptimalShipping(params) {
    const {
      originZip,
      destinationZip,
      weight = 1.0,
      dimensions = { length: 12, width: 9, height: 3 },
      orderValue = 0,
      products = [],
      retailerId = null,
      urgency = 'standard', // 'same_day', 'next_day', 'standard', 'economy'
      criteria = 'cost_effective' // 'fastest', 'cost_effective', 'most_reliable'
    } = params;

    const distance = this.calculateDistance(originZip, destinationZip);
    const isLocal = distance <= 50; // miles
    
    let availableServices = this.getAvailableServices(urgency, isLocal);
    
    // Apply free shipping offers first
    const freeShippingOffer = this.checkFreeShippingEligibility({
      orderValue,
      products,
      retailerId,
      destinationZip,
      originZip
    });
    
    // Calculate costs for each service
    const shippingOptions = availableServices.map(service => {
      const carrier = SHIPPING_CARRIERS.find(c => c.id === service.carrierId);
      const baseCost = this.calculateShippingCost(service, weight, distance, dimensions);
      const adjustedCost = baseCost * (carrier?.costMultiplier || 1.0);
      
      // Apply free shipping if eligible
      let finalCost = adjustedCost;
      let freeShippingApplied = false;
      let freeShippingSource = null;
      
      if (freeShippingOffer && freeShippingOffer.shippingMethods.includes(service.serviceCode)) {
        finalCost = 0;
        freeShippingApplied = true;
        freeShippingSource = `${freeShippingOffer.offeredBy}: ${freeShippingOffer.entityName}`;
      }
      
      return {
        carrierId: service.carrierId,
        carrierName: carrier?.name,
        carrierCode: carrier?.code,
        serviceId: service.serviceCode,
        serviceName: service.serviceName,
        estimatedDays: service.estimatedDays,
        originalCost: adjustedCost,
        finalCost: finalCost,
        freeShippingApplied: freeShippingApplied,
        freeShippingSource: freeShippingSource,
        reliabilityScore: carrier?.reliabilityScore || 0.9,
        features: this.getServiceFeatures(service, carrier),
        deliveryDate: this.calculateDeliveryDate(service.estimatedDays),
        savings: freeShippingApplied ? adjustedCost : 0
      };
    });
    
    // Sort options based on criteria
    const sortedOptions = this.sortShippingOptions(shippingOptions, criteria);
    
    return {
      recommendedOption: sortedOptions[0],
      allOptions: sortedOptions,
      freeShippingOffer: freeShippingOffer,
      analysis: {
        totalOptionsEvaluated: sortedOptions.length,
        averageCost: sortedOptions.reduce((sum, opt) => sum + opt.finalCost, 0) / sortedOptions.length,
        potentialSavings: freeShippingOffer ? sortedOptions[0]?.savings || 0 : 0,
        criteria: criteria,
        distance: distance,
        isLocal: isLocal
      }
    };
  }
  
  /**
   * Check if order qualifies for free shipping
   */
  static checkFreeShippingEligibility(params) {
    const { orderValue, products, retailerId, destinationZip, originZip } = params;
    
    for (const offer of FREE_SHIPPING_OFFERS) {
      if (!offer.isActive) continue;
      
      // Check geographic eligibility
      if (offer.eligibleZipCodes !== "nationwide" && 
          !offer.eligibleZipCodes.includes(destinationZip)) {
        continue;
      }
      
      // Check minimum order value
      if (offer.minimumOrderValue && orderValue < offer.minimumOrderValue) {
        continue;
      }
      
      // Check seller-specific offers
      if (offer.offeredBy === "seller" && offer.entityId !== retailerId) {
        continue;
      }
      
      // Check product-specific offers
      if (offer.offerType === "product_specific" && offer.applicableProducts) {
        const hasEligibleProduct = products.some(product => 
          offer.applicableProducts.includes(product.category?.toLowerCase())
        );
        if (!hasEligibleProduct) continue;
      }
      
      return offer; // Return first matching offer
    }
    
    return null;
  }
  
  /**
   * Get available shipping services based on urgency
   */
  static getAvailableServices(urgency, isLocal) {
    return SHIPPING_SERVICES.filter(service => {
      switch (urgency) {
        case 'same_day':
          return service.estimatedDays === 0 && isLocal;
        case 'next_day':
          return service.estimatedDays <= 1;
        case 'standard':
          return service.estimatedDays <= 4;
        case 'economy':
          return service.estimatedDays >= 3;
        default:
          return true;
      }
    });
  }
  
  /**
   * Calculate shipping cost based on service, weight, distance
   */
  static calculateShippingCost(service, weight, distance, dimensions) {
    let cost = service.baseCost;
    
    // Add weight-based pricing
    if (weight > 1) {
      cost += (weight - 1) * 2.50;
    }
    
    // Add distance multiplier for ground services
    if (service.serviceCode.includes('GND') || service.serviceCode.includes('GA')) {
      if (distance > 500) cost *= 1.3;
      else if (distance > 100) cost *= 1.1;
    }
    
    // Add dimensional weight pricing for large packages
    const dimWeight = (dimensions.length * dimensions.width * dimensions.height) / 166;
    if (dimWeight > weight) {
      cost += (dimWeight - weight) * 1.75;
    }
    
    // Add fuel surcharge (simulated)
    cost *= 1.08;
    
    return Math.round(cost * 100) / 100; // Round to cents
  }
  
  /**
   * Sort shipping options based on criteria
   */
  static sortShippingOptions(options, criteria) {
    switch (criteria) {
      case 'fastest':
        return options.sort((a, b) => a.estimatedDays - b.estimatedDays);
      case 'most_reliable':
        return options.sort((a, b) => b.reliabilityScore - a.reliabilityScore);
      case 'cost_effective':
      default:
        return options.sort((a, b) => {
          // Free shipping always wins
          if (a.freeShippingApplied && !b.freeShippingApplied) return -1;
          if (!a.freeShippingApplied && b.freeShippingApplied) return 1;
          
          // Then by cost
          if (a.finalCost !== b.finalCost) return a.finalCost - b.finalCost;
          
          // Then by speed if costs are equal
          return a.estimatedDays - b.estimatedDays;
        });
    }
  }
  
  /**
   * Get service features
   */
  static getServiceFeatures(service, carrier) {
    const features = ['Tracking included'];
    
    if (service.estimatedDays === 0) features.push('Same-day delivery');
    if (service.estimatedDays === 1) features.push('Next-day delivery');
    if (carrier?.reliabilityScore > 0.95) features.push('Highly reliable');
    if (service.serviceCode.includes('PM') || service.serviceCode.includes('Express')) {
      features.push('Priority handling');
    }
    if (service.baseCost > 30) features.push('Signature required');
    
    return features;
  }
  
  /**
   * Calculate delivery date
   */
  static calculateDeliveryDate(estimatedDays) {
    const deliveryDate = new Date();
    
    if (estimatedDays === 0) {
      // Same day - by 6 PM
      deliveryDate.setHours(18, 0, 0, 0);
    } else {
      // Add business days
      let daysToAdd = estimatedDays;
      while (daysToAdd > 0) {
        deliveryDate.setDate(deliveryDate.getDate() + 1);
        const dayOfWeek = deliveryDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Skip weekends
          daysToAdd--;
        }
      }
    }
    
    return deliveryDate.toISOString();
  }
  
  /**
   * Calculate distance between ZIP codes (simplified)
   */
  static calculateDistance(zip1, zip2) {
    // Simplified distance calculation - in real implementation would use ZIP code coordinates
    const zipDiff = Math.abs(parseInt(zip1) - parseInt(zip2));
    
    if (zipDiff <= 10) return 25; // Local delivery
    if (zipDiff <= 100) return 150; // Regional
    if (zipDiff <= 1000) return 500; // Cross-state
    return 1000; // Cross-country
  }
  
  /**
   * Get shipping performance metrics
   */
  static getShippingMetrics(carrierId, route) {
    // Mock performance data - in production would come from actual tracking
    const carrier = SHIPPING_CARRIERS.find(c => c.id === carrierId);
    
    return {
      carrierId: carrierId,
      carrierName: carrier?.name,
      route: route,
      averageCost: Math.random() * 20 + 10,
      averageDeliveryDays: Math.random() * 2 + 2,
      onTimePercentage: carrier?.reliabilityScore * 100 || 90,
      damageRate: Math.random() * 0.01,
      totalShipments: Math.floor(Math.random() * 1000) + 100,
      lastUpdated: new Date().toISOString()
    };
  }
  
  /**
   * Bulk analyze shipping for multiple orders
   */
  static analyzeMultipleOrders(orders) {
    const results = orders.map(order => {
      const analysis = this.findOptimalShipping(order);
      return {
        orderId: order.orderId,
        ...analysis
      };
    });
    
    const totalSavings = results.reduce((sum, r) => sum + (r.analysis.potentialSavings || 0), 0);
    const averageDeliveryDays = results.reduce((sum, r) => sum + r.recommendedOption.estimatedDays, 0) / results.length;
    
    return {
      orders: results,
      summary: {
        totalOrders: results.length,
        totalSavings: totalSavings,
        averageDeliveryDays: averageDeliveryDays,
        freeShippingApplied: results.filter(r => r.recommendedOption.freeShippingApplied).length
      }
    };
  }
}

export { SHIPPING_CARRIERS, SHIPPING_SERVICES, FREE_SHIPPING_OFFERS };