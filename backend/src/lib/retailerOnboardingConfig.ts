export const retailerOnboardingQuestions = {
  version: "2025-08-23",
  questions: [
    { id: "business_name",  text: "What is your store's legal business name?", type: "text",        required: true  },
    { id: "categories",     text: "Which product categories do you sell?",     type: "multiselect", required: true  },
    { id: "shipping_free_us", text: "Do you offer free shipping in the U.S.?", type: "boolean",     required: false },
    { id: "shipping_carriers", text: "Which carriers do you currently use (UPS, FedEx, USPS, regional)?", type: "multiselect", required: false },
    { id: "bopis",          text: "Can you support Buy Online, Pickup In-Store (BOPIS) or curbside?", type: "boolean", required: false },
    { id: "pos_sync",       text: "Do you need POS sync (in-store + online)?", type: "boolean",     required: false },
    { id: "gift_cards",     text: "Do you want cross-channel gift cards (online & in-store)?", type: "boolean", required: false },
    { id: "returns",        text: "What is your return policy (days, conditions)?", type: "text",   required: false }
  ]
};

export const categoryOptions = [
  "Electronics", "Clothing & Fashion", "Home & Garden", "Sports & Outdoors",
  "Health & Beauty", "Books & Media", "Toys & Games", "Food & Beverages",
  "Automotive", "Jewelry & Accessories", "Arts & Crafts", "Baby & Kids",
  "Pet Supplies", "Office Supplies", "Music Instruments", "Tools & Hardware"
];

export const carrierOptions = [
  "UPS", "FedEx", "USPS", "DHL", "OnTrac", "Regional Carriers", "Other"
];

export interface OnboardingAnswer {
  questionId: string;
  value: string | string[] | boolean;
  timestamp: string;
}

export interface OnboardingSubmission {
  retailerId: string;
  answers: OnboardingAnswer[];
  submittedAt: string;
  version: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
}

export function validateAnswer(questionId: string, value: any): { valid: boolean; error?: string } {
  const question = retailerOnboardingQuestions.questions.find(q => q.id === questionId);
  
  if (!question) {
    return { valid: false, error: 'Question not found' };
  }
  
  if (question.required && (value === null || value === undefined || value === '')) {
    return { valid: false, error: 'This field is required' };
  }
  
  switch (question.type) {
    case 'text':
      if (typeof value !== 'string') {
        return { valid: false, error: 'Must be text' };
      }
      break;
      
    case 'boolean':
      if (typeof value !== 'boolean') {
        return { valid: false, error: 'Must be true or false' };
      }
      break;
      
    case 'multiselect':
      if (!Array.isArray(value)) {
        return { valid: false, error: 'Must be an array of selections' };
      }
      break;
  }
  
  return { valid: true };
}