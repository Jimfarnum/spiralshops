import express from 'express';
import { z } from 'zod';
import { retailerOnboardingQuestions, validateAnswer, OnboardingSubmission } from '../lib/retailerOnboardingConfig.js';

const router = express.Router();

// Validation schema for dynamic answers
const AnswerSchema = z.object({
  questionId: z.string(),
  value: z.union([z.string(), z.array(z.string()), z.boolean()]),
  timestamp: z.string().datetime().optional()
});

const SubmissionSchema = z.object({
  retailerId: z.string(),
  answers: z.array(AnswerSchema),
  status: z.enum(['draft', 'submitted', 'under_review', 'approved', 'rejected']).default('draft')
});

// Mock storage for dynamic onboarding submissions
const submissions = new Map<string, OnboardingSubmission>();

// POST /api/onboarding/dynamic/submit - Submit answers to the new questionnaire
router.post('/submit', (req, res) => {
  try {
    const validatedData = SubmissionSchema.parse(req.body);
    const { retailerId, answers, status } = validatedData;
    
    // Validate each answer against the question configuration
    const validationErrors: string[] = [];
    
    for (const answer of answers) {
      const validation = validateAnswer(answer.questionId, answer.value);
      if (!validation.valid) {
        validationErrors.push(`${answer.questionId}: ${validation.error}`);
      }
    }
    
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validationErrors
      });
    }
    
    // Check for required questions
    const requiredQuestions = retailerOnboardingQuestions.questions
      .filter(q => q.required)
      .map(q => q.id);
    
    const answeredQuestions = answers.map(a => a.questionId);
    const missingRequired = requiredQuestions.filter(qId => !answeredQuestions.includes(qId));
    
    if (missingRequired.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing required questions',
        details: missingRequired
      });
    }
    
    // Create submission
    const submission: OnboardingSubmission = {
      retailerId,
      answers: answers.map(a => ({
        ...a,
        timestamp: a.timestamp || new Date().toISOString()
      })),
      submittedAt: new Date().toISOString(),
      version: retailerOnboardingQuestions.version,
      status
    };
    
    const submissionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    submissions.set(submissionId, submission);
    
    res.status(201).json({
      success: true,
      data: {
        submissionId,
        status: submission.status,
        answersCount: submission.answers.length,
        submittedAt: submission.submittedAt
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
      error: 'Failed to submit onboarding answers'
    });
  }
});

// GET /api/onboarding/dynamic/submission/:id - Get submission details
router.get('/submission/:id', (req, res) => {
  try {
    const { id } = req.params;
    const submission = submissions.get(id);
    
    if (!submission) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found'
      });
    }
    
    res.json({
      success: true,
      data: submission
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch submission'
    });
  }
});

// GET /api/onboarding/dynamic/retailer/:retailerId - Get all submissions for a retailer
router.get('/retailer/:retailerId', (req, res) => {
  try {
    const { retailerId } = req.params;
    
    const retailerSubmissions = Array.from(submissions.values())
      .filter(sub => sub.retailerId === retailerId)
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    
    res.json({
      success: true,
      data: {
        retailerId,
        submissions: retailerSubmissions,
        total: retailerSubmissions.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch retailer submissions'
    });
  }
});

// PUT /api/onboarding/dynamic/submission/:id/status - Update submission status
router.put('/submission/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status, reviewNotes } = req.body;
    
    const submission = submissions.get(id);
    if (!submission) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found'
      });
    }
    
    const validStatuses = ['draft', 'submitted', 'under_review', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status'
      });
    }
    
    submission.status = status;
    if (reviewNotes) {
      (submission as any).reviewNotes = reviewNotes;
    }
    
    submissions.set(id, submission);
    
    res.json({
      success: true,
      data: {
        submissionId: id,
        status: submission.status,
        updatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update submission status'
    });
  }
});

export default router;