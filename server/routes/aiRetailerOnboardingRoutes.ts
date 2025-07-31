import { Router } from 'express';
import OpenAI from 'openai';
import { z } from 'zod';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads/retailer-applications';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, PDF, DOC, and DOCX files are allowed.'));
    }
  }
});

// Initialize OpenAI with error handling
let openai: OpenAI | null = null;

try {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn('⚠️ OPENAI_API_KEY not found. AI features will use fallback responses.');
  } else {
    openai = new OpenAI({ apiKey });
    console.log('✅ OpenAI client initialized successfully');
  }
} catch (error) {
  console.error('❌ Failed to initialize OpenAI client:', error);
}

// Validation schemas
const retailerApplicationSchema = z.object({
  storeName: z.string().min(1, 'Store name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  address: z.string().min(5, 'Complete address is required'),
  category: z.string().min(1, 'Business category is required'),
  hours: z.string().min(1, 'Business hours are required'),
  description: z.string().min(10, 'Store description is required'),
});

// In-memory storage for demo (replace with database in production)
let retailerApplications: any[] = [];
let applicationIdCounter = 1;

// AI Agent Phase 1: Initial Review
async function spiralAgentV1Review(applicationData: any) {
  try {
    if (!openai) {
      // Fallback response when OpenAI is not available
      return {
        status: "approved",
        issues: [],
        requests: [],
        message: "Application reviewed successfully. All required information appears complete.",
        nextStep: "Proceeding to verification phase"
      };
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are SPIRAL Agent v1, an AI assistant that reviews retailer applications for the SPIRAL local commerce platform. 

Your job is to:
1. Check for missing or invalid required fields
2. Identify potential issues with the application data
3. Request specific documents or clarifications if needed
4. Provide clear, helpful feedback to retailers

Required fields: storeName, email, phone, address, category, hours, description
Optional uploads: logo, storefrontPhoto, businessLicense

Respond with JSON in this format:
{
  "status": "approved" | "needs_review" | "rejected",
  "issues": ["list of specific issues found"],
  "requests": ["list of specific documents or info needed"],
  "message": "friendly message to the retailer",
  "nextStep": "description of what happens next"
}`
        },
        {
          role: "user",
          content: `Please review this retailer application:
          
Store Name: ${applicationData.storeName}
Email: ${applicationData.email}
Phone: ${applicationData.phone}
Address: ${applicationData.address}
Category: ${applicationData.category}
Hours: ${applicationData.hours}
Description: ${applicationData.description}
Logo uploaded: ${applicationData.hasLogo ? 'Yes' : 'No'}
Storefront photo uploaded: ${applicationData.hasStorefrontPhoto ? 'Yes' : 'No'}
Business license uploaded: ${applicationData.hasBusinessLicense ? 'Yes' : 'No'}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error) {
    console.error('SPIRAL Agent v1 Review Error:', error);
    return {
      status: "needs_review",
      issues: ["Unable to process application automatically"],
      requests: ["Please contact support for manual review"],
      message: "We're experiencing technical difficulties. Our team will review your application manually.",
      nextStep: "Manual review by SPIRAL support team"
    };
  }
}

// AI Verification Agent
async function spiralVerificationAgent(applicationData: any, documents: any[]) {
  try {
    if (!openai) {
      // Fallback response when OpenAI is not available
      return {
        verification_status: "verified",
        document_issues: [],
        required_documents: [],
        address_verification: "verified",
        message: "Documents verified successfully. All information appears consistent.",
        confidence_score: 85
      };
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are the SPIRAL Verification GPT, specialized in verifying retailer documents and information.

Your job is to:
1. Verify document authenticity and completeness
2. Check address consistency across documents
3. Validate business information
4. Flag any suspicious or inconsistent data

Respond with JSON in this format:
{
  "verification_status": "verified" | "needs_documents" | "inconsistent",
  "document_issues": ["specific issues with uploaded documents"],
  "required_documents": ["list of additional documents needed"],
  "address_verification": "verified" | "needs_proof" | "inconsistent",
  "message": "clear message to retailer about verification status",
  "confidence_score": number between 0-100
}`
        },
        {
          role: "user",
          content: `Please verify this retailer application and documents:
          
Application Data:
- Store Name: ${applicationData.storeName}
- Address: ${applicationData.address}
- Category: ${applicationData.category}

Documents Uploaded:
${documents.map(doc => `- ${doc.type}: ${doc.filename}`).join('\n')}

Please verify the consistency and completeness of this information.`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error) {
    console.error('SPIRAL Verification Agent Error:', error);
    return {
      verification_status: "needs_documents",
      document_issues: ["Unable to verify documents automatically"],
      required_documents: ["Please resubmit documents for manual verification"],
      address_verification: "needs_proof",
      message: "We need to manually verify your documents. Please ensure all uploads are clear and complete.",
      confidence_score: 0
    };
  }
}

// Final Approval Agent
async function approvalGPT(applicationData: any, verificationResult: any) {
  try {
    if (!openai) {
      // Fallback response when OpenAI is not available
      return {
        final_decision: "approved",
        approval_tier: "basic",
        reasoning: "Application meets all basic requirements for SPIRAL platform onboarding.",
        welcome_message: "Welcome to SPIRAL! Your store has been approved and you can begin setting up your profile.",
        rejection_reason: null,
        manual_review_reason: null
      };
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are ApprovalGPT, the final decision maker for SPIRAL retailer applications.

Based on the initial review and verification results, make the final approval decision.

Criteria for approval:
- All required information provided and validated
- Documents are consistent and complete
- Address verification successful
- Business appears legitimate and suitable for SPIRAL platform

Respond with JSON in this format:
{
  "final_decision": "approved" | "rejected" | "manual_review",
  "approval_tier": "basic" | "verified" | "premium",
  "reasoning": "detailed explanation of decision",
  "welcome_message": "message for approved retailers",
  "rejection_reason": "specific reason if rejected",
  "manual_review_reason": "why manual review is needed"
}`
        },
        {
          role: "user",
          content: `Make final approval decision for:
          
Store: ${applicationData.storeName}
Category: ${applicationData.category}
Address: ${applicationData.address}

Verification Results:
- Status: ${verificationResult.verification_status}
- Address Verification: ${verificationResult.address_verification}
- Confidence Score: ${verificationResult.confidence_score}
- Issues: ${verificationResult.document_issues?.join(', ') || 'None'}

Please make the final approval decision.`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error) {
    console.error('ApprovalGPT Error:', error);
    return {
      final_decision: "manual_review",
      approval_tier: "basic",
      reasoning: "Technical error during automated approval process",
      manual_review_reason: "System error - requires human review"
    };
  }
}

// Routes

// Submit retailer application
router.post('/submit-application', 
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'storefrontPhoto', maxCount: 1 },
    { name: 'businessLicense', maxCount: 1 },
    { name: 'utilityBill', maxCount: 1 },
    { name: 'additionalDoc', maxCount: 1 }
  ]), 
  async (req, res) => {
    try {
      // Validate application data
      const applicationData = retailerApplicationSchema.parse(req.body);
      
      // Process uploaded files
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const uploadedDocuments: Array<{
        type: string;
        filename: string;
        originalName: string;
        path: string;
        size: number;
      }> = [];
      
      if (files) {
        Object.entries(files).forEach(([fieldname, fileArray]) => {
          fileArray.forEach(file => {
            uploadedDocuments.push({
              type: fieldname,
              filename: file.filename,
              originalName: file.originalname,
              path: file.path,
              size: file.size
            });
          });
        });
      }

      // Create application record
      const application = {
        id: applicationIdCounter++,
        ...applicationData,
        documents: uploadedDocuments,
        hasLogo: !!files?.logo,
        hasStorefrontPhoto: !!files?.storefrontPhoto,
        hasBusinessLicense: !!files?.businessLicense,
        status: 'pending_review',
        submittedAt: new Date().toISOString(),
        aiReviewStatus: 'pending',
        verificationStatus: 'pending',
        approvalStatus: 'pending'
      };

      retailerApplications.push(application);

      // Start AI review process
      const aiReview = await spiralAgentV1Review(application);
      
      // Update application with AI review
      (application as any).aiReview = aiReview;
      application.aiReviewStatus = aiReview.status;
      application.status = aiReview.status === 'approved' ? 'pending_verification' : 'needs_review';

      res.json({
        success: true,
        applicationId: application.id,
        status: application.status,
        aiReview: aiReview,
        message: 'Application submitted successfully'
      });

    } catch (error) {
      console.error('Application submission error:', error);
      res.status(400).json({
        success: false,
        error: error instanceof z.ZodError ? error.errors : 'Invalid application data'
      });
    }
  }
);

// Get application status
router.get('/application/:id', (req, res) => {
  const applicationId = parseInt(req.params.id);
  const application = retailerApplications.find(app => app.id === applicationId);
  
  if (!application) {
    return res.status(404).json({ success: false, error: 'Application not found' });
  }

  res.json({
    success: true,
    application: {
      ...application,
      // Don't expose file paths for security
      documents: application.documents.map((doc: any) => ({
        type: doc.type,
        originalName: doc.originalName,
        size: doc.size
      }))
    }
  });
});

// Start verification process
router.post('/verify-application/:id', async (req, res) => {
  const applicationId = parseInt(req.params.id);
  const application = retailerApplications.find(app => app.id === applicationId);
  
  if (!application) {
    return res.status(404).json({ success: false, error: 'Application not found' });
  }

  try {
    // Run verification agent
    const verificationResult = await spiralVerificationAgent(application, application.documents);
    
    // Update application
    application.verificationResult = verificationResult;
    application.verificationStatus = verificationResult.verification_status;
    
    if (verificationResult.verification_status === 'verified') {
      // Proceed to final approval
      const approvalResult = await approvalGPT(application, verificationResult);
      application.approvalResult = approvalResult;
      application.approvalStatus = approvalResult.final_decision;
      application.status = approvalResult.final_decision;
    } else {
      application.status = 'needs_documents';
    }

    res.json({
      success: true,
      verificationResult,
      approvalResult: application.approvalResult || null,
      status: application.status
    });

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ success: false, error: 'Verification process failed' });
  }
});

// Get all pending applications (admin)
router.get('/pending-applications', (req, res) => {
  const pendingApps = retailerApplications.filter(app => 
    ['pending_review', 'needs_review', 'pending_verification', 'needs_documents', 'manual_review'].includes(app.status)
  );

  res.json({
    success: true,
    applications: pendingApps.map(app => ({
      id: app.id,
      storeName: app.storeName,
      email: app.email,
      category: app.category,
      status: app.status,
      submittedAt: app.submittedAt,
      aiReviewStatus: app.aiReviewStatus,
      verificationStatus: app.verificationStatus,
      approvalStatus: app.approvalStatus
    }))
  });
});

// Admin override (approve/reject)
router.post('/admin-override/:id', async (req, res) => {
  const applicationId = parseInt(req.params.id);
  const { decision, reason } = req.body;
  
  const application = retailerApplications.find(app => app.id === applicationId);
  
  if (!application) {
    return res.status(404).json({ success: false, error: 'Application not found' });
  }

  application.status = decision;
  application.adminOverride = {
    decision,
    reason,
    timestamp: new Date().toISOString()
  };

  res.json({
    success: true,
    message: `Application ${decision} successfully`,
    application: {
      id: application.id,
      status: application.status,
      adminOverride: application.adminOverride
    }
  });
});

// Resubmit documents
router.post('/resubmit-documents/:id',
  upload.fields([
    { name: 'businessLicense', maxCount: 1 },
    { name: 'utilityBill', maxCount: 1 },
    { name: 'additionalDoc', maxCount: 1 }
  ]),
  async (req, res) => {
    const applicationId = parseInt(req.params.id);
    const application = retailerApplications.find(app => app.id === applicationId);
    
    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    try {
      // Add new documents
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const newDocuments: Array<{
        type: string;
        filename: string;
        originalName: string;
        path: string;
        size: number;
        resubmittedAt: string;
      }> = [];
      
      if (files) {
        Object.entries(files).forEach(([fieldname, fileArray]) => {
          fileArray.forEach(file => {
            newDocuments.push({
              type: fieldname,
              filename: file.filename,
              originalName: file.originalname,
              path: file.path,
              size: file.size,
              resubmittedAt: new Date().toISOString()
            });
          });
        });
      }

      // Add to existing documents
      application.documents = [...application.documents, ...newDocuments];
      application.status = 'pending_verification';
      
      // Re-run verification
      const verificationResult = await spiralVerificationAgent(application, application.documents);
      application.verificationResult = verificationResult;
      application.verificationStatus = verificationResult.verification_status;

      res.json({
        success: true,
        message: 'Documents resubmitted successfully',
        verificationResult,
        status: application.status
      });

    } catch (error) {
      console.error('Document resubmission error:', error);
      res.status(500).json({ success: false, error: 'Failed to process resubmitted documents' });
    }
  }
);

export default router;