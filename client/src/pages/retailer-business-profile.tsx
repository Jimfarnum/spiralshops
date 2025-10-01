import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Store, TrendingUp, MapPin, Users, Calendar, CheckCircle } from "lucide-react";

interface BusinessProfileData {
  salesVolume: string;
  locations: string;
  yearsInBusiness: string;
  employees: string;
  businessType: string;
}

export default function RetailerBusinessProfile() {
  const [formData, setFormData] = useState<BusinessProfileData>({
    salesVolume: "",
    locations: "",
    yearsInBusiness: "",
    employees: "",
    businessType: ""
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (field: keyof BusinessProfileData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/retailer-business-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        toast({
          title: "Profile Submitted Successfully!",
          description: "Thank you for sharing your business information with SPIRAL."
        });
      } else {
        throw new Error(data.error || "Failed to submit profile");
      }
    } catch (error) {
      console.error("Profile submission error:", error);
      toast({
        title: "Submission Failed",
        description: "Please try again or contact support if the problem continues.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-green-600">
              ✅ Thanks for sharing!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-lg text-gray-700 dark:text-gray-300">
              SPIRAL uses this info to make sure you get the right support,
              exposure, and opportunities for <strong>your</strong> business journey.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                🎯 <strong>Next Steps:</strong> Our team will analyze your business profile to 
                provide personalized recommendations, campaign opportunities, and growth strategies 
                tailored specifically to your business size and type.
              </p>
            </div>
            <Button 
              onClick={() => window.location.href = "/retailer-dashboard"}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Go to Retailer Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Store className="h-8 w-8 text-blue-600" />
            <CardTitle className="text-3xl font-bold text-center">
              Retailer Business Profile
            </CardTitle>
          </div>
          <p className="text-center text-gray-600 dark:text-gray-400">
            Help SPIRAL understand your business to provide better support and opportunities
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Annual Sales Volume */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <label className="text-lg font-semibold">Annual Sales Volume</label>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                We ask about sales ranges so SPIRAL can connect you with the right
                tools and campaigns. Some stores grow fast, others thrive by staying
                small — both are valuable.
              </p>
              <Select 
                value={formData.salesVolume} 
                onValueChange={(value) => handleChange("salesVolume", value)}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your annual sales range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="<500k">Less than $500k</SelectItem>
                  <SelectItem value="500k-2M">$500k–$2M</SelectItem>
                  <SelectItem value="2M-10M">$2M–$10M</SelectItem>
                  <SelectItem value="10M+">$10M+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Number of Locations */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <label className="text-lg font-semibold">Number of Locations</label>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                SPIRAL supports everyone from single-location independents to
                regional chains. Your footprint helps us match you with the right
                campaigns and rewards.
              </p>
              <Select 
                value={formData.locations} 
                onValueChange={(value) => handleChange("locations", value)}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select number of locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 (single store)</SelectItem>
                  <SelectItem value="2-10">2–10</SelectItem>
                  <SelectItem value="10-50">10–50</SelectItem>
                  <SelectItem value="50+">50+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Years in Business */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                <label className="text-lg font-semibold">Years in Business</label>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Whether you're new, established, or a community anchor — SPIRAL
                celebrates every stage.
              </p>
              <Select 
                value={formData.yearsInBusiness} 
                onValueChange={(value) => handleChange("yearsInBusiness", value)}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select years in business" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="<3">Less than 3</SelectItem>
                  <SelectItem value="3-10">3–10</SelectItem>
                  <SelectItem value="10+">10+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Employees */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-orange-600" />
                <label className="text-lg font-semibold">Number of Employees</label>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                This helps us tailor the right tools and provide fair recognition in
                leaderboards.
              </p>
              <Select 
                value={formData.employees} 
                onValueChange={(value) => handleChange("employees", value)}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select number of employees" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-5">1–5</SelectItem>
                  <SelectItem value="6-20">6–20</SelectItem>
                  <SelectItem value="21-100">21–100</SelectItem>
                  <SelectItem value="100+">100+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Business Type */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Store className="h-5 w-5 text-teal-600" />
                <label className="text-lg font-semibold">Business Type</label>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Some retailers thrive as standalones, others in malls. Knowing your
                type helps SPIRAL promote you properly.
              </p>
              <Select 
                value={formData.businessType} 
                onValueChange={(value) => handleChange("businessType", value)}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standalone">Standalone Store</SelectItem>
                  <SelectItem value="mall">Mall Tenant</SelectItem>
                  <SelectItem value="strip">Strip Center Retailer</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-6">
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Submitting Profile...
                  </div>
                ) : (
                  "Complete Business Profile"
                )}
              </Button>
            </div>

            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                🔒 Your business information is confidential and used only to improve your SPIRAL experience.
                We never share your data with third parties without your explicit consent.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}