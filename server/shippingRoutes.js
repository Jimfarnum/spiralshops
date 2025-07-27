// Advanced shipping calculation system
export const calculateShippingOptions = (product, address, date = new Date()) => {
  const isLocal = address.city === 'Minneapolis' || address.city === 'St. Paul';
  const currentHour = date.getHours();
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  
  const options = [];
  
  // Same Day Delivery (local only, order before 2 PM on weekdays)
  if (isLocal && currentHour < 14 && !isWeekend && product.availabilityOptions.sameDay) {
    options.push({
      id: 'same-day',
      name: 'Same Day Delivery',
      price: 15.99,
      estimatedDelivery: 'Today by 8 PM',
      cutoffTime: '2:00 PM',
      features: ['Fastest available', 'Local delivery only'],
      available: true
    });
  }
  
  // Next Day Delivery
  if (product.availabilityOptions.nextDay) {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    
    options.push({
      id: 'next-day',
      name: 'Next Day Delivery',
      price: 9.99,
      estimatedDelivery: `Tomorrow (${nextDay.toLocaleDateString()})`,
      cutoffTime: '5:00 PM',
      features: ['Guaranteed delivery', 'Tracking included'],
      available: true
    });
  }
  
  // Standard Shipping
  if (product.availabilityOptions.standard) {
    const deliveryStart = new Date(date);
    deliveryStart.setDate(deliveryStart.getDate() + 3);
    const deliveryEnd = new Date(date);
    deliveryEnd.setDate(deliveryEnd.getDate() + 5);
    
    options.push({
      id: 'standard',
      name: 'Standard Shipping',
      price: 4.99,
      estimatedDelivery: `${deliveryStart.toLocaleDateString()} - ${deliveryEnd.toLocaleDateString()}`,
      cutoffTime: 'No cutoff',
      features: ['Most economical', 'Reliable service'],
      available: true
    });
  }
  
  // Store Pickup
  if (product.availabilityOptions.pickup) {
    options.push({
      id: 'pickup',
      name: 'Store Pickup',
      price: 0,
      estimatedDelivery: 'Ready in 2 hours',
      cutoffTime: 'Store hours',
      features: ['Free option', 'No shipping fees'],
      available: true,
      pickupLocation: {
        storeName: product.storeName,
        address: '123 Store St, Minneapolis, MN 55401',
        hours: 'Mon-Sat 9AM-9PM, Sun 10AM-7PM'
      }
    });
  }
  
  return options;
};

export const validateDeliveryAddress = (address) => {
  const requiredFields = ['name', 'address', 'city', 'state', 'zip'];
  const missing = requiredFields.filter(field => !address[field]);
  
  if (missing.length > 0) {
    return {
      valid: false,
      errors: missing.map(field => `${field} is required`)
    };
  }
  
  // ZIP code validation (basic)
  const zipRegex = /^\d{5}(-\d{4})?$/;
  if (!zipRegex.test(address.zip)) {
    return {
      valid: false,
      errors: ['Invalid ZIP code format']
    };
  }
  
  return { valid: true, errors: [] };
};

export const calculateDeliveryDate = (shippingOption, orderDate = new Date()) => {
  const deliveryDate = new Date(orderDate);
  
  switch (shippingOption.id) {
    case 'same-day':
      return deliveryDate; // Same day
    case 'next-day':
      deliveryDate.setDate(deliveryDate.getDate() + 1);
      return deliveryDate;
    case 'standard':
      deliveryDate.setDate(deliveryDate.getDate() + 3); // Minimum for standard
      return deliveryDate;
    case 'pickup':
      deliveryDate.setHours(deliveryDate.getHours() + 2); // Ready in 2 hours
      return deliveryDate;
    default:
      deliveryDate.setDate(deliveryDate.getDate() + 5);
      return deliveryDate;
  }
};