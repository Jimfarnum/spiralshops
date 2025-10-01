import express from 'express';
import { z } from 'zod';
import { getRetailerRegistry } from '../lib/registry.js';
import { retailerOnboardingQuestions, categoryOptions, carrierOptions, validateAnswer, OnboardingSubmission } from '../lib/retailerOnboardingConfig.js';

const router = express.Router();

// Validation schemas
const RetailerApplicationSchema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  contactEmail: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(2, 'State is required'),
    zipCode: z.string().min(5, 'Valid ZIP code is required')
  }),
  businessType: z.enum(['retail', 'restaurant', 'service', 'manufacturing', 'other']),
  businessDescription: z.string().min(10, 'Business description is required'),
  website: z.string().url().optional().or(z.literal('')),
  socialMedia: z.object({
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    twitter: z.string().optional()
  }).optional(),
  operatingHours: z.object({
    monday: z.string(),
    tuesday: z.string(),
    wednesday: z.string(),
    thursday: z.string(),
    friday: z.string(),
    saturday: z.string(),
    sunday: z.string()
  }),
  employeeCount: z.number().min(1),
  monthlyRevenue: z.enum(['0-10k', '10k-50k', '50k-100k', '100k-500k', '500k+']),
  hasOnlinePresence: z.boolean(),
  currentPaymentMethods: z.array(z.string()),
  spiralInterest: z.object({
    primaryGoals: z.array(z.string()),
    expectedBenefits: z.array(z.string()),
    concerns: z.array(z.string()).optional()
  }),
  documents: z.array(z.string()).optional(),
  agreedToTerms: z.boolean().refine(val => val === true, 'Must agree to terms')
});

const OnboardingStepSchema = z.object({
  applicationId: z.string(),
  stepId: z.string(),
  responses: z.record(z.any()),
  completed: z.boolean().default(false)
});

const OnboardingAnswerSchema = z.object({
  questionId: z.string(),
  value: z.union([z.string(), z.array(z.string()), z.boolean()]),
  timestamp: z.string().datetime().optional()
});

// Mock data - replace with actual database
const applications = new Map();
const onboardingSteps = new Map();

// GET /api/onboarding/questions
router.get('/questions', (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        ...retailerOnboardingQuestions,
        options: {
          categories: categoryOptions,
          carriers: carrierOptions
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch onboarding questions'
    });
  }
});

// POST /api/onboarding/apply
router.post('/apply', async (req, res) => {
  try {
    const validatedData = RetailerApplicationSchema.parse(req.body);
    
    // Check if email already exists
    const existingApplications = Array.from(applications.values());
    const existingApplication = existingApplications.find(
      app => app.contactEmail === validatedData.contactEmail
    );
    
    if (existingApplication) {
      return res.status(400).json({
        success: false,
        error: 'An application with this email already exists'
      });
    }
    
    // Create application
    const applicationId = `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const application = {
      id: applicationId,
      ...validatedData,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      reviewedAt: null,
      approvedAt: null,
      onboardingProgress: {
        currentStep: 'business_verification',
        completedSteps: [],
        totalSteps: retailerOnboardingQuestions.questions.length
      }
    };
    
    applications.set(applicationId, application);
    
    // Register with retailer registry
    try {
      const retailerRegistry = getRetailerRegistry();
      await retailerRegistry.registerRetailer({
        businessName: validatedData.businessName,
        contactEmail: validatedData.contactEmail,
        phone: validatedData.phone,
        address: validatedData.address,
        businessType: validatedData.businessType,
        documents: validatedData.documents || []
      });
    } catch (error) {
      console.warn('Failed to register with retailer registry:', error);
      // Continue with application even if registry fails
    }
    
    res.status(201).json({
      success: true,
      data: {
        applicationId,
        status: application.status,
        nextSteps: [
          'Business verification documents review',
          'Financial background check',
          'SPIRAL platform training',
          'Store setup and integration',
          'Go-live approval'
        ]
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to submit application'
    });
  }
});

// GET /api/onboarding/application/:id
router.get('/application/:id', (req, res) => {
  try {
    const { id } = req.params;
    const application = applications.get(id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }
    
    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch application'
    });
  }
});

// POST /api/onboarding/step
router.post('/step', (req, res) => {
  try {
    const validatedData = OnboardingStepSchema.parse(req.body);
    const { applicationId, stepId, responses, completed } = validatedData;
    
    // Verify application exists
    const application = applications.get(applicationId);
    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }
    
    // Save step progress
    const stepKey = `${applicationId}_${stepId}`;
    const stepData = {
      applicationId,
      stepId,
      responses,
      completed,
      submittedAt: new Date().toISOString()
    };
    
    onboardingSteps.set(stepKey, stepData);
    
    // Update application progress
    if (completed && !application.onboardingProgress.completedSteps.includes(stepId)) {
      application.onboardingProgress.completedSteps.push(stepId);
      
      // Determine next step
      const currentStepIndex = retailerOnboardingQuestions.questions.findIndex(q => q.id === stepId);
      if (currentStepIndex < retailerOnboardingQuestions.questions.length - 1) {
        application.onboardingProgress.currentStep = retailerOnboardingQuestions.questions[currentStepIndex + 1].id;
      } else {
        application.onboardingProgress.currentStep = 'completed';
        application.status = 'onboarding_complete';
      }
    }
    
    applications.set(applicationId, application);
    
    res.json({
      success: true,
      data: {
        stepCompleted: completed,
        progress: application.onboardingProgress,
        nextStep: application.onboardingProgress.currentStep
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to save onboarding step'
    });
  }
});

// GET /api/onboarding/progress/:applicationId
router.get('/progress/:applicationId', (req, res) => {
  try {
    const { applicationId } = req.params;
    const application = applications.get(applicationId);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }
    
    // Get all completed steps
    const completedSteps = [];
    for (const [key, stepData] of onboardingSteps.entries()) {
      if (stepData.applicationId === applicationId && stepData.completed) {
        completedSteps.push({
          stepId: stepData.stepId,
          submittedAt: stepData.submittedAt,
          responses: stepData.responses
        });
      }
    }
    
    res.json({
      success: true,
      data: {
        applicationId,
        status: application.status,
        progress: application.onboardingProgress,
        completedSteps,
        totalSteps: retailerOnboardingQuestions.questions.length,
        completionPercentage: Math.round(
          (application.onboardingProgress.completedSteps.length / retailerOnboardingQuestions.questions.length) * 100
        )
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch onboarding progress'
    });
  }
});

// PUT /api/onboarding/application/:id/status
router.put('/application/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    const application = applications.get(id);
    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }
    
    const validStatuses = ['submitted', 'under_review', 'approved', 'rejected', 'onboarding_complete', 'active'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status'
      });
    }
    
    application.status = status;
    application.reviewedAt = new Date().toISOString();
    
    if (status === 'approved') {
      application.approvedAt = new Date().toISOString();
      application.onboardingProgress.currentStep = 'business_verification';
    }
    
    if (notes) {
      application.reviewNotes = notes;
    }
    
    applications.set(id, application);
    
    // Update retailer registry status
    try {
      const retailerRegistry = getRetailerRegistry();
      const registryStatus = status === 'approved' ? 'approved' : 
                           status === 'rejected' ? 'rejected' : 'pending';
      await retailerRegistry.updateRetailerStatus(id, registryStatus);
    } catch (error) {
      console.warn('Failed to update retailer registry status:', error);
    }
    
    res.json({
      success: true,
      data: {
        applicationId: id,
        status: application.status,
        reviewedAt: application.reviewedAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update application status'
    });
  }
});

// GET /api/onboarding/applications
router.get('/applications', (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let allApplications = Array.from(applications.values());
    
    // Filter by status if provided
    if (status) {
      allApplications = allApplications.filter(app => app.status === status);
    }
    
    // Sort by submission date (newest first)
    allApplications.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    
    // Pagination
    const offset = (Number(page) - 1) * Number(limit);
    const paginatedApplications = allApplications.slice(offset, offset + Number(limit));
    
    res.json({
      success: true,
      data: {
        applications: paginatedApplications,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: allApplications.length,
          pages: Math.ceil(allApplications.length / Number(limit))
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch applications'
    });
  }
});

// GET /api/onboarding/analytics
router.get('/analytics', (req, res) => {
  try {
    const allApplications = Array.from(applications.values());
    
    const analytics = {
      totalApplications: allApplications.length,
      statusBreakdown: {
        submitted: allApplications.filter(app => app.status === 'submitted').length,
        under_review: allApplications.filter(app => app.status === 'under_review').length,
        approved: allApplications.filter(app => app.status === 'approved').length,
        rejected: allApplications.filter(app => app.status === 'rejected').length,
        onboarding_complete: allApplications.filter(app => app.status === 'onboarding_complete').length,
        active: allApplications.filter(app => app.status === 'active').length
      },
      businessTypeBreakdown: allApplications.reduce((acc, app) => {
        acc[app.businessType] = (acc[app.businessType] || 0) + 1;
        return acc;
      }, {}),
      averageOnboardingTime: calculateAverageOnboardingTime(allApplications),
      recentApplications: allApplications
        .filter(app => {
          const submitted = new Date(app.submittedAt);
          const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          return submitted >= sevenDaysAgo;
        }).length
    };
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch onboarding analytics'
    });
  }
});

function calculateAverageOnboardingTime(applications: any[]): number {
  const completedApps = applications.filter(app => 
    app.status === 'active' && app.approvedAt && app.submittedAt
  );
  
  if (completedApps.length === 0) return 0;
  
  const totalTime = completedApps.reduce((sum, app) => {
    const submitted = new Date(app.submittedAt).getTime();
    const approved = new Date(app.approvedAt).getTime();
    return sum + (approved - submitted);
  }, 0);
  
  // Return average time in days
  return Math.round((totalTime / completedApps.length) / (24 * 60 * 60 * 1000));
}

export default router;