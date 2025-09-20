export const retailerOnboardingQuestions = [
  {
    id: 'business_verification',
    title: 'Business Verification',
    description: 'Verify your business credentials and documentation',
    required: true,
    order: 1,
    fields: [
      {
        id: 'business_license',
        type: 'file',
        label: 'Business License',
        required: true,
        accepts: '.pdf,.jpg,.jpeg,.png',
        description: 'Upload a copy of your current business license'
      },
      {
        id: 'tax_id',
        type: 'text',
        label: 'Tax ID / EIN',
        required: true,
        pattern: '^\\d{2}-\\d{7}$',
        placeholder: 'XX-XXXXXXX',
        description: 'Your Federal Tax ID or Employer Identification Number'
      },
      {
        id: 'business_registration',
        type: 'file',
        label: 'Business Registration Certificate',
        required: true,
        accepts: '.pdf,.jpg,.jpeg,.png',
        description: 'State business registration or incorporation documents'
      },
      {
        id: 'operating_years',
        type: 'select',
        label: 'Years in Operation',
        required: true,
        options: [
          { value: 'less_than_1', label: 'Less than 1 year' },
          { value: '1_to_3', label: '1-3 years' },
          { value: '3_to_5', label: '3-5 years' },
          { value: '5_to_10', label: '5-10 years' },
          { value: 'more_than_10', label: 'More than 10 years' }
        ]
      }
    ]
  },
  {
    id: 'financial_background',
    title: 'Financial Background',
    description: 'Financial information and banking details',
    required: true,
    order: 2,
    fields: [
      {
        id: 'bank_account',
        type: 'text',
        label: 'Business Bank Account Number',
        required: true,
        encrypted: true,
        description: 'Account where SPIRAL payments will be deposited'
      },
      {
        id: 'routing_number',
        type: 'text',
        label: 'Bank Routing Number',
        required: true,
        pattern: '^\\d{9}$',
        description: '9-digit routing number for your business bank'
      },
      {
        id: 'monthly_revenue_range',
        type: 'select',
        label: 'Monthly Revenue Range',
        required: true,
        options: [
          { value: '0_5k', label: '$0 - $5,000' },
          { value: '5k_25k', label: '$5,000 - $25,000' },
          { value: '25k_50k', label: '$25,000 - $50,000' },
          { value: '50k_100k', label: '$50,000 - $100,000' },
          { value: '100k_plus', label: '$100,000+' }
        ]
      },
      {
        id: 'credit_check_consent',
        type: 'checkbox',
        label: 'I consent to a business credit check',
        required: true,
        description: 'SPIRAL may perform a soft credit check for verification purposes'
      }
    ]
  },
  {
    id: 'product_catalog',
    title: 'Product Catalog Setup',
    description: 'Information about your products and inventory',
    required: true,
    order: 3,
    fields: [
      {
        id: 'product_categories',
        type: 'multiselect',
        label: 'Product Categories',
        required: true,
        options: [
          { value: 'electronics', label: 'Electronics' },
          { value: 'clothing', label: 'Clothing & Fashion' },
          { value: 'home_garden', label: 'Home & Garden' },
          { value: 'sports', label: 'Sports & Recreation' },
          { value: 'books', label: 'Books & Media' },
          { value: 'health_beauty', label: 'Health & Beauty' },
          { value: 'food_beverage', label: 'Food & Beverage' },
          { value: 'automotive', label: 'Automotive' },
          { value: 'toys', label: 'Toys & Games' },
          { value: 'services', label: 'Professional Services' }
        ]
      },
      {
        id: 'inventory_size',
        type: 'select',
        label: 'Approximate Inventory Size',
        required: true,
        options: [
          { value: 'small', label: '1-50 items' },
          { value: 'medium', label: '51-500 items' },
          { value: 'large', label: '501-2000 items' },
          { value: 'enterprise', label: '2000+ items' }
        ]
      },
      {
        id: 'inventory_management_system',
        type: 'select',
        label: 'Current Inventory Management',
        required: false,
        options: [
          { value: 'none', label: 'No system (manual tracking)' },
          { value: 'excel', label: 'Excel/Spreadsheets' },
          { value: 'pos_system', label: 'POS System' },
          { value: 'erp_system', label: 'ERP System' },
          { value: 'other', label: 'Other software' }
        ]
      },
      {
        id: 'product_photos_quality',
        type: 'radio',
        label: 'Product Photography Quality',
        required: true,
        options: [
          { value: 'professional', label: 'Professional photography available' },
          { value: 'basic', label: 'Basic photos available' },
          { value: 'need_help', label: 'Need help with product photography' }
        ]
      }
    ]
  },
  {
    id: 'shipping_fulfillment',
    title: 'Shipping & Fulfillment',
    description: 'Delivery and shipping capabilities',
    required: true,
    order: 4,
    fields: [
      {
        id: 'shipping_methods',
        type: 'multiselect',
        label: 'Available Shipping Methods',
        required: true,
        options: [
          { value: 'local_delivery', label: 'Local Delivery' },
          { value: 'in_store_pickup', label: 'In-Store Pickup' },
          { value: 'usps', label: 'USPS' },
          { value: 'ups', label: 'UPS' },
          { value: 'fedex', label: 'FedEx' },
          { value: 'dhl', label: 'DHL' },
          { value: 'other', label: 'Other carriers' }
        ]
      },
      {
        id: 'delivery_radius',
        type: 'number',
        label: 'Local Delivery Radius (miles)',
        required: false,
        min: 0,
        max: 100,
        description: 'How far from your store do you deliver locally?'
      },
      {
        id: 'packaging_capability',
        type: 'radio',
        label: 'Packaging Capability',
        required: true,
        options: [
          { value: 'professional', label: 'Professional packaging materials and process' },
          { value: 'basic', label: 'Basic packaging available' },
          { value: 'need_help', label: 'Need help with packaging solutions' }
        ]
      },
      {
        id: 'fulfillment_time',
        type: 'select',
        label: 'Order Fulfillment Time',
        required: true,
        options: [
          { value: 'same_day', label: 'Same day' },
          { value: '1_day', label: '1 business day' },
          { value: '2_3_days', label: '2-3 business days' },
          { value: '4_7_days', label: '4-7 business days' },
          { value: 'custom', label: 'Varies by product' }
        ]
      }
    ]
  },
  {
    id: 'technology_integration',
    title: 'Technology Integration',
    description: 'Current systems and integration requirements',
    required: true,
    order: 5,
    fields: [
      {
        id: 'pos_system',
        type: 'select',
        label: 'Point of Sale (POS) System',
        required: false,
        options: [
          { value: 'none', label: 'No POS system' },
          { value: 'square', label: 'Square' },
          { value: 'shopify_pos', label: 'Shopify POS' },
          { value: 'clover', label: 'Clover' },
          { value: 'lightspeed', label: 'Lightspeed' },
          { value: 'toast', label: 'Toast' },
          { value: 'other', label: 'Other POS system' }
        ]
      },
      {
        id: 'ecommerce_platform',
        type: 'select',
        label: 'Current E-commerce Platform',
        required: false,
        options: [
          { value: 'none', label: 'No online store' },
          { value: 'shopify', label: 'Shopify' },
          { value: 'woocommerce', label: 'WooCommerce' },
          { value: 'bigcommerce', label: 'BigCommerce' },
          { value: 'magento', label: 'Magento' },
          { value: 'squarespace', label: 'Squarespace' },
          { value: 'other', label: 'Other platform' }
        ]
      },
      {
        id: 'integration_priority',
        type: 'multiselect',
        label: 'Integration Priorities',
        required: true,
        options: [
          { value: 'inventory_sync', label: 'Inventory synchronization' },
          { value: 'order_management', label: 'Order management' },
          { value: 'customer_data', label: 'Customer data sync' },
          { value: 'financial_reporting', label: 'Financial reporting' },
          { value: 'marketing_tools', label: 'Marketing tools' },
          { value: 'analytics', label: 'Analytics and insights' }
        ]
      },
      {
        id: 'technical_comfort',
        type: 'radio',
        label: 'Technical Comfort Level',
        required: true,
        options: [
          { value: 'beginner', label: 'Beginner - Need lots of support' },
          { value: 'intermediate', label: 'Intermediate - Some technical experience' },
          { value: 'advanced', label: 'Advanced - Very comfortable with technology' }
        ]
      }
    ]
  },
  {
    id: 'marketing_goals',
    title: 'Marketing & Growth Goals',
    description: 'Your marketing objectives and growth plans',
    required: true,
    order: 6,
    fields: [
      {
        id: 'primary_goals',
        type: 'multiselect',
        label: 'Primary Business Goals with SPIRAL',
        required: true,
        options: [
          { value: 'increase_sales', label: 'Increase sales revenue' },
          { value: 'reach_customers', label: 'Reach new customers' },
          { value: 'compete_online', label: 'Compete with online retailers' },
          { value: 'local_presence', label: 'Strengthen local market presence' },
          { value: 'brand_awareness', label: 'Build brand awareness' },
          { value: 'customer_loyalty', label: 'Improve customer loyalty' },
          { value: 'operational_efficiency', label: 'Improve operational efficiency' }
        ]
      },
      {
        id: 'target_customer_age',
        type: 'multiselect',
        label: 'Target Customer Age Groups',
        required: true,
        options: [
          { value: '18_24', label: '18-24 years' },
          { value: '25_34', label: '25-34 years' },
          { value: '35_44', label: '35-44 years' },
          { value: '45_54', label: '45-54 years' },
          { value: '55_plus', label: '55+ years' }
        ]
      },
      {
        id: 'marketing_budget',
        type: 'select',
        label: 'Monthly Marketing Budget',
        required: false,
        options: [
          { value: 'under_500', label: 'Under $500' },
          { value: '500_1500', label: '$500 - $1,500' },
          { value: '1500_5000', label: '$1,500 - $5,000' },
          { value: '5000_plus', label: '$5,000+' },
          { value: 'not_sure', label: 'Not sure yet' }
        ]
      },
      {
        id: 'social_media_presence',
        type: 'multiselect',
        label: 'Current Social Media Presence',
        required: false,
        options: [
          { value: 'facebook', label: 'Facebook' },
          { value: 'instagram', label: 'Instagram' },
          { value: 'twitter', label: 'Twitter/X' },
          { value: 'tiktok', label: 'TikTok' },
          { value: 'linkedin', label: 'LinkedIn' },
          { value: 'youtube', label: 'YouTube' },
          { value: 'none', label: 'No social media presence' }
        ]
      }
    ]
  },
  {
    id: 'compliance_training',
    title: 'Compliance & Training',
    description: 'Legal compliance and platform training requirements',
    required: true,
    order: 7,
    fields: [
      {
        id: 'business_insurance',
        type: 'radio',
        label: 'Business Insurance Coverage',
        required: true,
        options: [
          { value: 'full_coverage', label: 'Full business insurance including liability' },
          { value: 'basic_coverage', label: 'Basic business insurance' },
          { value: 'need_help', label: 'Need help obtaining insurance' }
        ]
      },
      {
        id: 'return_policy',
        type: 'textarea',
        label: 'Current Return/Refund Policy',
        required: true,
        maxLength: 500,
        description: 'Describe your current return and refund policy'
      },
      {
        id: 'customer_service_hours',
        type: 'text',
        label: 'Customer Service Hours',
        required: true,
        placeholder: 'e.g., Monday-Friday 9AM-6PM',
        description: 'When are you available to handle customer inquiries?'
      },
      {
        id: 'training_preference',
        type: 'radio',
        label: 'Training Preference',
        required: true,
        options: [
          { value: 'self_paced', label: 'Self-paced online training' },
          { value: 'live_session', label: 'Live training sessions' },
          { value: 'one_on_one', label: 'One-on-one training' },
          { value: 'mixed', label: 'Combination of methods' }
        ]
      },
      {
        id: 'gdpr_compliance',
        type: 'checkbox',
        label: 'I understand and agree to comply with data privacy regulations',
        required: true,
        description: 'Including GDPR, CCPA, and other applicable privacy laws'
      }
    ]
  },
  {
    id: 'final_review',
    title: 'Final Review & Agreement',
    description: 'Review your application and agree to terms',
    required: true,
    order: 8,
    fields: [
      {
        id: 'application_review',
        type: 'display',
        label: 'Application Summary',
        description: 'Please review all the information you have provided before submitting'
      },
      {
        id: 'spiral_terms',
        type: 'checkbox',
        label: 'I agree to the SPIRAL Platform Terms of Service',
        required: true,
        description: 'By checking this box, you agree to the terms and conditions'
      },
      {
        id: 'merchant_agreement',
        type: 'checkbox',
        label: 'I agree to the SPIRAL Merchant Agreement',
        required: true,
        description: 'Including payment processing terms and commission structure'
      },
      {
        id: 'privacy_policy',
        type: 'checkbox',
        label: 'I acknowledge the SPIRAL Privacy Policy',
        required: true,
        description: 'I understand how my data will be collected and used'
      },
      {
        id: 'communication_consent',
        type: 'checkbox',
        label: 'I consent to receive communications from SPIRAL',
        required: true,
        description: 'Including updates, promotions, and important platform notifications'
      },
      {
        id: 'signature',
        type: 'text',
        label: 'Electronic Signature',
        required: true,
        placeholder: 'Type your full legal name',
        description: 'This serves as your electronic signature for this application'
      }
    ]
  }
];

export const onboardingStepValidation = {
  business_verification: {
    required: ['business_license', 'tax_id', 'business_registration', 'operating_years'],
    validation: {
      tax_id: /^\d{2}-\d{7}$/
    }
  },
  financial_background: {
    required: ['bank_account', 'routing_number', 'monthly_revenue_range', 'credit_check_consent'],
    validation: {
      routing_number: /^\d{9}$/
    }
  },
  product_catalog: {
    required: ['product_categories', 'inventory_size', 'product_photos_quality']
  },
  shipping_fulfillment: {
    required: ['shipping_methods', 'packaging_capability', 'fulfillment_time']
  },
  technology_integration: {
    required: ['integration_priority', 'technical_comfort']
  },
  marketing_goals: {
    required: ['primary_goals', 'target_customer_age']
  },
  compliance_training: {
    required: ['business_insurance', 'return_policy', 'customer_service_hours', 'training_preference', 'gdpr_compliance']
  },
  final_review: {
    required: ['spiral_terms', 'merchant_agreement', 'privacy_policy', 'communication_consent', 'signature']
  }
};