import express from 'express';
import { z } from 'zod';

const router = express.Router();

// Beta retailer application schema
const betaApplicationSchema = z.object({
  businessName: z.string().min(2, 'Business name is required'),
  ownerName: z.string().min(2, 'Owner name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  businessType: z.enum(['Electronics', 'Fashion', 'Food', 'Health', 'Home']),
  annualRevenue: z.enum(['Under $50K', '$50K-$100K', '$100K-$500K', 'Over $500K']),
  location: z.object({
    city: z.string(),
    state: z.string(),
    zipCode: z.string()
  }),
  experience: z.object({
    yearsInBusiness: z.number().min(1),
    currentOnlinePresence: z.boolean(),
    techComfortLevel: z.enum(['Beginner', 'Intermediate', 'Advanced'])
  }),
  commitment: z.object({
    availableForTesting: z.boolean(),
    timeCommitment: z.enum(['5-10 hours', '10-20 hours', '20+ hours']),
    feedbackWillingness: z.boolean()
  }),
  motivation: z.string().min(50, 'Please explain why you want to join the beta program')
});

// Beta testing metrics schema
const betaMetricsSchema = z.object({
  retailerId: z.string(),
  sessionDate: z.string(),
  tasksCompleted: z.array(z.string()),
  timeSpent: z.number(),
  issuesEncountered: z.array(z.object({
    description: z.string(),
    severity: z.enum(['Low', 'Medium', 'High', 'Critical']),
    resolved: z.boolean()
  })),
  satisfactionRating: z.number().min(1).max(5),
  feedback: z.string(),
  recommendationLikelihood: z.number().min(1).max(10)
});

// Submit beta application
router.post('/apply', async (req, res) => {
  try {
    const application = betaApplicationSchema.parse(req.body);
    
    // Calculate application score based on criteria
    const score = calculateApplicationScore(application);
    
    // Store application in database (in production, use actual database)
    const applicationId = `beta_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Send confirmation email (in production, use actual email service)
    console.log(`[BETA PROGRAM] New application received:
      Business: ${application.businessName}
      Owner: ${application.ownerName}
      Email: ${application.email}
      Type: ${application.businessType}
      Location: ${application.location.city}, ${application.location.state}
      Score: ${score}/100
      Application ID: ${applicationId}
    `);
    
    res.json({
      success: true,
      applicationId,
      score,
      message: 'Application received! We will review and contact you within 24 hours.',
      nextSteps: [
        'Application review by beta program team',
        'Background check and business verification',
        'Selection notification within 24-48 hours',
        'Onboarding call scheduling for selected retailers'
      ]
    });
    
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Invalid application data'
    });
  }
});

// Get beta program information
router.get('/program-info', (req, res) => {
  res.json({
    success: true,
    program: {
      name: 'SPIRAL Beta Testing Program',
      duration: '14 days',
      participants: '20 retailers',
      benefits: [
        '6 months free premium features',
        'Priority customer support',
        'Marketing collaboration opportunities',
        '50% discount on transaction fees',
        'Beta founder recognition status'
      ],
      requirements: [
        'Commit to 2-week testing period',
        'Provide detailed feedback',
        'Complete core platform tasks',
        'Participate in interviews and surveys'
      ],
      timeline: {
        'Days 1-3': 'Retailer recruitment and selection',
        'Days 4-7': 'Platform onboarding and setup',
        'Days 8-10': 'Core feature testing',
        'Days 11-14': 'Advanced feature validation'
      },
      support: {
        email: 'beta-support@spiralmalls.com',
        phone: '1-800-SPIRAL-1',
        hours: '9 AM - 6 PM EST',
        responseTime: '24 hours maximum'
      }
    }
  });
});

// Submit beta testing metrics
router.post('/metrics', async (req, res) => {
  try {
    const metrics = betaMetricsSchema.parse(req.body);
    
    // Store metrics (in production, use actual database)
    console.log(`[BETA METRICS] Session data recorded:
      Retailer: ${metrics.retailerId}
      Date: ${metrics.sessionDate}
      Tasks: ${metrics.tasksCompleted.length} completed
      Time: ${metrics.timeSpent} minutes
      Issues: ${metrics.issuesEncountered.length} encountered
      Satisfaction: ${metrics.satisfactionRating}/5 stars
      Recommendation: ${metrics.recommendationLikelihood}/10
    `);
    
    res.json({
      success: true,
      message: 'Beta testing metrics recorded successfully',
      summary: {
        tasksCompleted: metrics.tasksCompleted.length,
        timeSpent: metrics.timeSpent,
        satisfactionRating: metrics.satisfactionRating,
        issuesCount: metrics.issuesEncountered.length
      }
    });
    
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Invalid metrics data'
    });
  }
});

// Get beta testing dashboard
router.get('/dashboard', (req, res) => {
  // In production, fetch real data from database
  const mockDashboard = {
    success: true,
    overview: {
      totalApplications: 47,
      selectedRetailers: 20,
      completedOnboarding: 18,
      activeTesters: 16,
      averageSatisfaction: 4.3,
      totalTransactions: 127
    },
    retailerProgress: [
      { id: 'ret_001', name: 'Tech Corner Electronics', progress: 85, satisfaction: 4.5 },
      { id: 'ret_002', name: 'Bloom Fashion Boutique', progress: 92, satisfaction: 4.8 },
      { id: 'ret_003', name: 'Fresh Market Cafe', progress: 78, satisfaction: 4.2 },
      { id: 'ret_004', name: 'Wellness Natural Health', progress: 88, satisfaction: 4.6 },
      { id: 'ret_005', name: 'Home Style Furnishings', progress: 95, satisfaction: 4.9 }
    ],
    recentFeedback: [
      {
        retailer: 'Tech Corner Electronics',
        rating: 5,
        comment: 'The AI recommendations are incredibly accurate. Already seeing 20% more sales.',
        date: '2025-08-07'
      },
      {
        retailer: 'Bloom Fashion Boutique',
        rating: 4,
        comment: 'Love the mobile interface! Customers can shop while walking by the store.',
        date: '2025-08-07'
      }
    ],
    issues: [
      {
        description: 'Inventory sync occasionally delays',
        severity: 'Medium',
        affectedRetailers: 3,
        status: 'In Progress'
      },
      {
        description: 'Mobile checkout flow needs simplification',
        severity: 'Low',
        affectedRetailers: 2,
        status: 'Resolved'
      }
    ]
  };
  
  res.json(mockDashboard);
});

// Get beta success stories
router.get('/success-stories', (req, res) => {
  const successStories = [
    {
      id: 'story_001',
      retailer: {
        name: 'Downtown Electronics Hub',
        owner: 'Maria Rodriguez',
        location: 'Austin, TX',
        type: 'Electronics'
      },
      metrics: {
        salesIncrease: '35%',
        newCustomers: 47,
        averageOrderValue: '$89.50',
        customerSatisfaction: 4.7
      },
      testimonial: "SPIRAL transformed how customers discover our store. The AI recommendations are spot-on, and the local community features brought in customers I never would have reached otherwise.",
      beforeAfter: {
        before: 'Struggling with foot traffic, limited online presence',
        after: 'Thriving local business with integrated online/offline experience'
      }
    },
    {
      id: 'story_002',
      retailer: {
        name: 'Artisan Coffee & Books',
        owner: 'James Chen',
        location: 'Portland, OR',
        type: 'Food & Books'
      },
      metrics: {
        salesIncrease: '28%',
        newCustomers: 63,
        averageOrderValue: '$24.75',
        customerSatisfaction: 4.8
      },
      testimonial: "The community aspect is incredible. Customers organize group visits through the app, and our loyalty program integration has tripled repeat purchases.",
      beforeAfter: {
        before: 'Seasonal revenue fluctuations, limited customer retention',
        after: 'Steady growth with strong community engagement and loyalty'
      }
    }
  ];
  
  res.json({
    success: true,
    stories: successStories,
    summary: {
      averageSalesIncrease: '31.5%',
      totalNewCustomers: 110,
      averageCustomerSatisfaction: 4.75,
      commonBenefits: [
        'Increased foot traffic through local discovery',
        'Higher customer engagement with loyalty features',
        'Improved online/offline integration',
        'Better understanding of customer preferences via AI insights'
      ]
    }
  });
});

// Calculate application score based on various criteria
function calculateApplicationScore(application: any): number {
  let score = 0;
  
  // Business type diversity (20 points)
  score += 20;
  
  // Experience points (25 points)
  const years = application.experience.yearsInBusiness;
  if (years >= 5) score += 25;
  else if (years >= 2) score += 15;
  else score += 10;
  
  // Tech comfort (20 points)
  switch (application.experience.techComfortLevel) {
    case 'Advanced': score += 20; break;
    case 'Intermediate': score += 15; break;
    case 'Beginner': score += 10; break;
  }
  
  // Commitment level (25 points)
  if (application.commitment.availableForTesting) score += 10;
  if (application.commitment.feedbackWillingness) score += 10;
  switch (application.commitment.timeCommitment) {
    case '20+ hours': score += 5; break;
    case '10-20 hours': score += 3; break;
    case '5-10 hours': score += 1; break;
  }
  
  // Motivation quality (10 points)
  const motivationLength = application.motivation.length;
  if (motivationLength > 200) score += 10;
  else if (motivationLength > 100) score += 7;
  else score += 5;
  
  return Math.min(score, 100);
}

export default router;