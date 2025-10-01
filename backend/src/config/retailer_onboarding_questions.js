export const retailerOnboardingQuestions = {
  questions: [
    {
      id: 'business_info',
      title: 'Business Information',
      fields: [
        { name: 'business_name', type: 'text', required: true, label: 'Business Name' },
        { name: 'ein', type: 'text', required: true, label: 'EIN/Tax ID' },
        { name: 'business_type', type: 'select', required: true, label: 'Business Type',
          options: ['retail', 'restaurant', 'service', 'manufacturing', 'other'] },
        { name: 'years_in_business', type: 'number', required: true, label: 'Years in Business' }
      ]
    },
    {
      id: 'contact_details',
      title: 'Contact Information',
      fields: [
        { name: 'contact_name', type: 'text', required: true, label: 'Primary Contact Name' },
        { name: 'email', type: 'email', required: true, label: 'Business Email' },
        { name: 'phone', type: 'tel', required: true, label: 'Business Phone' }
      ]
    },
    {
      id: 'location_info',
      title: 'Location Details',
      fields: [
        { name: 'address', type: 'address', required: true, label: 'Business Address' },
        { name: 'has_physical_location', type: 'boolean', required: true, label: 'Do you have a physical storefront?' },
        { name: 'operating_hours', type: 'hours', required: true, label: 'Operating Hours' }
      ]
    },
    {
      id: 'business_profile',
      title: 'Business Profile',
      fields: [
        { name: 'categories', type: 'multiselect', required: true, label: 'Product Categories',
          options: ['apparel', 'electronics', 'home_garden', 'food_beverage', 'health_beauty', 'automotive', 'sports_outdoors'] },
        { name: 'monthly_revenue', type: 'select', required: true, label: 'Monthly Revenue Range',
          options: ['0-10k', '10k-50k', '50k-100k', '100k+'] },
        { name: 'employee_count', type: 'number', required: true, label: 'Number of Employees' }
      ]
    },
    {
      id: 'spiral_integration',
      title: 'SPIRAL Integration',
      fields: [
        { name: 'shipping_free_us', type: 'boolean', required: true, label: 'Can you offer free shipping within the US?' },
        { name: 'current_ecommerce', type: 'text', required: false, label: 'Current E-commerce Platform (if any)' },
        { name: 'social_media', type: 'object', required: false, label: 'Social Media Accounts' },
        { name: 'spiral_goals', type: 'multiselect', required: true, label: 'Goals with SPIRAL',
          options: ['increase_sales', 'reach_new_customers', 'improve_online_presence', 'streamline_operations'] }
      ]
    }
  ],
  categories: [
    'apparel', 'electronics', 'home_garden', 'food_beverage', 'health_beauty', 'automotive', 'sports_outdoors', 'books_media', 'toys_games', 'jewelry_accessories'
  ],
  shippingOptions: {
    shipping_free_us: 'Free shipping within US',
    shipping_paid_us: 'Paid shipping within US',
    shipping_international: 'International shipping available'
  },
  businessTypes: [
    'retail', 'restaurant', 'service', 'manufacturing', 'wholesale', 'franchise', 'other'
  ]
};