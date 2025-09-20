// SPIRAL Retailer Application Management System
// Handles retailer onboarding applications with AI-powered approval workflow

const express = require('express');
const router = express.Router();

// Mock database for demonstration
// In production, this would use your actual database
let retailerApplications = [];
let applicationIdCounter = 1000;

// Submit retailer application
router.post('/apply', async (req, res) => {
  try {
    const applicationData = req.body;
    
    // Generate application ID
    const applicationId = `APP-${applicationIdCounter++}`;
    
    // Create application record
    const application = {
      id: applicationId,
      ...applicationData,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      reviewedAt: null,
      approvedAt: null,
      notes: [],
      verificationStatus: {
        businessLicense: applicationData.businessLicense ? 'uploaded' : 'pending',
        taxId: applicationData.taxId ? 'provided' : 'pending',
        insurance: applicationData.insuranceCertificate ? 'uploaded' : 'not_required',
        addressVerification: 'pending',
        phoneVerification: 'pending'
      }
    };
    
    // Store application
    retailerApplications.push(application);
    
    // Simulate AI-powered initial screening
    const aiScore = calculateApplicationScore(application);
    application.aiScore = aiScore;
    
    // Auto-approve high-scoring applications
    if (aiScore >= 85) {
      application.status = 'approved';
      application.approvedAt = new Date().toISOString();
      application.notes.push({
        type: 'system',
        message: 'Auto-approved based on high AI confidence score',
        timestamp: new Date().toISOString()
      });
    } else if (aiScore < 60) {
      application.status = 'needs_review';
      application.notes.push({
        type: 'system',
        message: 'Flagged for manual review - requires additional verification',
        timestamp: new Date().toISOString()
      });
    }
    
    res.json({
      success: true,
      applicationId: applicationId,
      status: application.status,
      estimatedReviewTime: application.status === 'approved' ? 'immediate' : '2-3 business days',
      nextSteps: getNextSteps(application.status),
      aiScore: aiScore
    });
    
  } catch (error) {
    console.error('Error submitting retailer application:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit application'
    });
  }
});

// Get application status
router.get('/status/:applicationId', (req, res) => {
  try {
    const { applicationId } = req.params;
    const application = retailerApplications.find(app => app.id === applicationId);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }
    
    res.json({
      success: true,
      application: {
        id: application.id,
        status: application.status,
        submittedAt: application.submittedAt,
        reviewedAt: application.reviewedAt,
        approvedAt: application.approvedAt,
        businessName: application.businessName,
        verificationStatus: application.verificationStatus,
        notes: application.notes,
        nextSteps: getNextSteps(application.status)
      }
    });
    
  } catch (error) {
    console.error('Error getting application status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get application status'
    });
  }
});

// List all applications (admin only)
router.get('/admin/list', (req, res) => {
  try {
    const { status, category, sortBy = 'submittedAt' } = req.query;
    
    let filteredApplications = [...retailerApplications];
    
    // Filter by status
    if (status && status !== 'all') {
      filteredApplications = filteredApplications.filter(app => app.status === status);
    }
    
    // Filter by category
    if (category && category !== 'all') {
      filteredApplications = filteredApplications.filter(app => app.businessCategory === category);
    }
    
    // Sort applications
    filteredApplications.sort((a, b) => {
      if (sortBy === 'submittedAt') {
        return new Date(b.submittedAt) - new Date(a.submittedAt);
      } else if (sortBy === 'aiScore') {
        return (b.aiScore || 0) - (a.aiScore || 0);
      } else if (sortBy === 'businessName') {
        return a.businessName.localeCompare(b.businessName);
      }
      return 0;
    });
    
    // Return summary data
    const summaryData = filteredApplications.map(app => ({
      id: app.id,
      businessName: app.businessName,
      businessCategory: app.businessCategory,
      ownerName: app.ownerName,
      status: app.status,
      submittedAt: app.submittedAt,
      aiScore: app.aiScore,
      city: app.city,
      state: app.state
    }));
    
    res.json({
      success: true,
      applications: summaryData,
      total: filteredApplications.length,
      statistics: getApplicationStatistics()
    });
    
  } catch (error) {
    console.error('Error listing applications:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to list applications'
    });
  }
});

// Update application status (admin only)
router.patch('/admin/:applicationId/status', (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, notes } = req.body;
    
    const application = retailerApplications.find(app => app.id === applicationId);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }
    
    // Update status
    application.status = status;
    application.reviewedAt = new Date().toISOString();
    
    if (status === 'approved') {
      application.approvedAt = new Date().toISOString();
    }
    
    // Add notes
    if (notes) {
      application.notes.push({
        type: 'admin',
        message: notes,
        timestamp: new Date().toISOString()
      });
    }
    
    res.json({
      success: true,
      application: {
        id: application.id,
        status: application.status,
        reviewedAt: application.reviewedAt,
        nextSteps: getNextSteps(application.status)
      }
    });
    
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update application status'
    });
  }
});

// AI-powered application scoring
function calculateApplicationScore(application) {
  let score = 0;
  
  // Business information completeness (30 points)
  if (application.businessName) score += 5;
  if (application.businessType) score += 5;
  if (application.businessCategory) score += 5;
  if (application.businessDescription && application.businessDescription.length > 50) score += 10;
  if (application.yearsInBusiness && parseInt(application.yearsInBusiness) > 0) score += 5;
  
  // Contact and location (25 points)
  if (application.email && application.email.includes('@')) score += 5;
  if (application.phone) score += 5;
  if (application.website) score += 5;
  if (application.streetAddress && application.city && application.state && application.zipCode) score += 10;
  
  // Verification documents (25 points)
  if (application.taxId) score += 10;
  if (application.businessLicense) score += 10;
  if (application.insuranceCertificate) score += 5;
  
  // SPIRAL integration readiness (20 points)
  if (application.acceptsSPIRALRewards) score += 5;
  if (application.offersPickup) score += 5;
  if (application.socialMediaPresence && application.socialMediaPresence.length > 0) score += 5;
  if (application.monthlyRevenue) score += 5;
  
  // Business maturity bonus
  const yearsInBusiness = parseInt(application.yearsInBusiness) || 0;
  if (yearsInBusiness >= 5) score += 5;
  if (yearsInBusiness >= 10) score += 5;
  
  // Penalize missing critical information
  if (!application.agreesToTerms || !application.agreesToFees) score -= 20;
  
  return Math.min(100, Math.max(0, score));
}

// Get next steps based on application status
function getNextSteps(status) {
  switch (status) {
    case 'approved':
      return [
        'Check your email for retailer dashboard access',
        'Complete your store profile setup',
        'Upload your first products',
        'Set up SPIRAL rewards and pickup options'
      ];
    case 'pending':
      return [
        'Application under review',
        'We may contact you for additional information',
        'Review typically takes 2-3 business days'
      ];
    case 'needs_review':
      return [
        'Additional verification required',
        'Check your email for specific requirements',
        'Upload any missing documents',
        'Contact support if you need assistance'
      ];
    case 'rejected':
      return [
        'Application was not approved',
        'Review rejection reasons in your email',
        'You may reapply after addressing concerns',
        'Contact support for clarification'
      ];
    default:
      return ['Unknown status'];
  }
}

// Get application statistics
function getApplicationStatistics() {
  const total = retailerApplications.length;
  const pending = retailerApplications.filter(app => app.status === 'pending').length;
  const approved = retailerApplications.filter(app => app.status === 'approved').length;
  const needsReview = retailerApplications.filter(app => app.status === 'needs_review').length;
  const rejected = retailerApplications.filter(app => app.status === 'rejected').length;
  
  return {
    total,
    pending,
    approved,
    needsReview,
    rejected,
    approvalRate: total > 0 ? Math.round((approved / total) * 100) : 0
  };
}

module.exports = router;