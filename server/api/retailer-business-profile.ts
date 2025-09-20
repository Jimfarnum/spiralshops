import { Router, Request, Response } from "express";
import { asyncHandler } from "../middleware/globalResponseFormatter.js";
import { z } from "zod";

const router = Router();

// Business profile schema for validation
const businessProfileSchema = z.object({
  salesVolume: z.enum(["<500k", "500k-2M", "2M-10M", "10M+"], {
    required_error: "Sales volume is required"
  }),
  locations: z.enum(["1", "2-10", "10-50", "50+"], {
    required_error: "Number of locations is required"
  }),
  yearsInBusiness: z.enum(["<3", "3-10", "10+"], {
    required_error: "Years in business is required"
  }),
  employees: z.enum(["1-5", "6-20", "21-100", "100+"], {
    required_error: "Number of employees is required"
  }),
  businessType: z.enum(["standalone", "mall", "strip", "other"], {
    required_error: "Business type is required"
  })
});

// In-memory storage for demo (in production, this would be saved to database)
const businessProfiles: Array<{
  id: string;
  data: z.infer<typeof businessProfileSchema>;
  submittedAt: string;
}> = [];

// Submit business profile
router.post("/retailer-business-profile", asyncHandler(async (req: Request, res: Response) => {
  try {
    // Validate the incoming data
    const validatedData = businessProfileSchema.parse(req.body);
    
    // Generate a unique ID for this submission
    const profileId = `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store the profile data
    const profile = {
      id: profileId,
      data: validatedData,
      submittedAt: new Date().toISOString()
    };
    
    businessProfiles.push(profile);
    
    // Log the submission for SOAP G analytics
    console.log(`[RETAILER BUSINESS PROFILE] New submission:`, {
      profileId,
      salesVolume: validatedData.salesVolume,
      locations: validatedData.locations,
      yearsInBusiness: validatedData.yearsInBusiness,
      employees: validatedData.employees,
      businessType: validatedData.businessType,
      timestamp: profile.submittedAt
    });
    
    // Generate business insights based on the profile
    const insights = generateBusinessInsights(validatedData);
    
    res.json({
      success: true,
      data: {
        profileId,
        submittedAt: profile.submittedAt,
        insights
      },
      message: "Business profile submitted successfully"
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: "Invalid form data",
        details: error.errors.map(err => ({
          field: err.path.join("."),
          message: err.message
        }))
      });
    }
    
    console.error("Business profile submission error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to submit business profile"
    });
  }
}));

// Get business profile analytics (admin endpoint)
router.get("/retailer-business-profile/analytics", asyncHandler(async (req: Request, res: Response) => {
  const analytics = {
    totalSubmissions: businessProfiles.length,
    submissionsByDate: getSubmissionsByDate(),
    salesVolumeDistribution: getDistribution("salesVolume"),
    locationDistribution: getDistribution("locations"),
    businessTypeDistribution: getDistribution("businessType"),
    yearsInBusinessDistribution: getDistribution("yearsInBusiness"),
    employeeDistribution: getDistribution("employees")
  };
  
  res.json({
    success: true,
    data: analytics
  });
}));

// Helper function to generate business insights
function generateBusinessInsights(profile: z.infer<typeof businessProfileSchema>) {
  const insights = [];
  
  // Sales volume insights
  if (profile.salesVolume === "<500k") {
    insights.push({
      type: "growth",
      title: "Growth Opportunity",
      description: "Perfect for SPIRAL's small business accelerator programs and micro-campaigns."
    });
  } else if (profile.salesVolume === "10M+") {
    insights.push({
      type: "enterprise",
      title: "Enterprise Features",
      description: "You qualify for SPIRAL's enterprise-level tools and multi-location campaign management."
    });
  }
  
  // Location insights
  if (profile.locations === "1") {
    insights.push({
      type: "local",
      title: "Local Focus",
      description: "Single-location businesses excel with hyper-local SPIRAL campaigns and community engagement."
    });
  } else if (parseInt(profile.locations.split("-")[0]) > 10) {
    insights.push({
      type: "multi-location",
      title: "Multi-Location Management",
      description: "Access SPIRAL's advanced analytics and cross-location campaign coordination tools."
    });
  }
  
  // Business type insights
  if (profile.businessType === "mall") {
    insights.push({
      type: "mall",
      title: "Mall Integration",
      description: "Leverage SPIRAL's mall-wide promotions and cross-retailer collaboration opportunities."
    });
  }
  
  // Experience insights
  if (profile.yearsInBusiness === "10+") {
    insights.push({
      type: "established",
      title: "Established Business",
      description: "Your experience makes you an ideal candidate for SPIRAL's mentor program and advanced features."
    });
  }
  
  return insights;
}

// Helper function to get submissions by date
function getSubmissionsByDate() {
  const dateGroups: Record<string, number> = {};
  
  businessProfiles.forEach(profile => {
    const date = new Date(profile.submittedAt).toDateString();
    dateGroups[date] = (dateGroups[date] || 0) + 1;
  });
  
  return dateGroups;
}

// Helper function to get distribution of a field
function getDistribution(field: keyof z.infer<typeof businessProfileSchema>) {
  const distribution: Record<string, number> = {};
  
  businessProfiles.forEach(profile => {
    const value = profile.data[field];
    distribution[value] = (distribution[value] || 0) + 1;
  });
  
  return distribution;
}

export default router;