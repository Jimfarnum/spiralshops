import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Upload, Store, FileText, Phone, Mail, MapPin, Globe } from "lucide-react";

const verificationSchema = z.object({
  storeName: z.string().min(2, "Store name must be at least 2 characters"),
  address: z.string().min(10, "Please provide a complete address"),
  phoneNumber: z.string().min(10, "Please provide a valid phone number"),
  email: z.string().email("Please provide a valid email address"),
  description: z.string().min(20, "Please provide a description of at least 20 characters"),
  category: z.string().min(1, "Please select a category"),
  website: z.string().url("Please provide a valid website URL").optional().or(z.literal("")),
});

type VerificationForm = z.infer<typeof verificationSchema>;

const categories = [
  "Restaurant & Food",
  "Retail & Shopping",
  "Health & Beauty",
  "Services",
  "Entertainment",
  "Automotive",
  "Home & Garden",
  "Sports & Recreation",
  "Professional Services",
  "Other",
];

export default function VerifyStore() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [storeId, setStoreId] = useState<number | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<VerificationForm>({
    resolver: zodResolver(verificationSchema),
  });

  const category = watch("category");

  const verificationMutation = useMutation({
    mutationFn: async (data: VerificationForm & { document?: File }) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'document' && value) {
          formData.append(key, value.toString());
        }
      });
      
      if (selectedFile) {
        formData.append('document', selectedFile);
      }

      const response = await fetch('/api/verify-store', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Verification submission failed');
      }

      return response.json();
    },
    onSuccess: (data) => {
      setSubmitSuccess(true);
      setStoreId(data.storeId);
      toast({
        title: "Verification Submitted!",
        description: "Your store verification has been submitted successfully. We'll review it within 2-5 business days.",
        variant: "default",
      });
      reset();
      setSelectedFile(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit verification. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: VerificationForm) => {
    verificationMutation.mutate({ ...data, document: selectedFile || undefined });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please select an image, PDF, or document file.",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-800">Verification Submitted!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Thank you for submitting your store verification. We've received your application and supporting documents.
              </p>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">What happens next?</h3>
                <ul className="text-sm text-blue-700 space-y-1 text-left">
                  <li>• Our team will review your application within 2-5 business days</li>
                  <li>• We'll verify your business documents and information</li>
                  <li>• You'll receive an email notification about the status</li>
                  <li>• Once approved, your store will be live on SPIRAL</li>
                </ul>
              </div>

              {storeId && (
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <strong>Reference ID:</strong> STORE-{storeId}
                </div>
              )}

              <div className="flex gap-4 justify-center pt-4">
                <Button onClick={() => window.location.href = '/'}>
                  Return to Home
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSubmitSuccess(false);
                    setStoreId(null);
                  }}
                >
                  Submit Another Store
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Store className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Verify Your Store</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join SPIRAL's network of verified local businesses. Submit your store information 
            and verification documents to get started.
          </p>
        </div>

        {/* Verification Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Store Verification Application
            </CardTitle>
            <p className="text-gray-600">
              Please provide accurate information about your business. All fields marked with * are required.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Store className="w-5 h-5" />
                  Basic Information
                </h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="storeName">Store Name *</Label>
                    <Input
                      id="storeName"
                      {...register("storeName")}
                      placeholder="Your Business Name"
                    />
                    {errors.storeName && (
                      <p className="text-sm text-red-600 mt-1">{errors.storeName.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select onValueChange={(value) => setValue("category", value)} value={category}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select business category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Business Description *</Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Describe your business, what you sell, and what makes you unique..."
                    rows={4}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Contact Information
                </h3>
                
                <div>
                  <Label htmlFor="address" className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    Business Address *
                  </Label>
                  <Input
                    id="address"
                    {...register("address")}
                    placeholder="123 Main Street, City, State, ZIP Code"
                  />
                  {errors.address && (
                    <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>
                  )}
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="phoneNumber" className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      Phone Number *
                    </Label>
                    <Input
                      id="phoneNumber"
                      {...register("phoneNumber")}
                      placeholder="(555) 123-4567"
                    />
                    {errors.phoneNumber && (
                      <p className="text-sm text-red-600 mt-1">{errors.phoneNumber.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email" className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="business@example.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="website" className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    Website (Optional)
                  </Label>
                  <Input
                    id="website"
                    {...register("website")}
                    placeholder="https://yourwebsite.com"
                  />
                  {errors.website && (
                    <p className="text-sm text-red-600 mt-1">{errors.website.message}</p>
                  )}
                </div>
              </div>

              {/* Document Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Verification Document
                </h3>
                
                <div>
                  <Label htmlFor="document">
                    Business License or Registration Document (Optional but recommended)
                  </Label>
                  <Input
                    id="document"
                    type="file"
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                    className="mt-2"
                  />
                  {selectedFile && (
                    <p className="text-sm text-green-600 mt-1">
                      Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    Accepted formats: JPG, PNG, PDF, DOC, DOCX (Max 5MB)
                  </p>
                </div>
              </div>

              {/* Information Notice */}
              <Alert>
                <AlertDescription>
                  <strong>Verification Process:</strong> Our team manually reviews each application to ensure 
                  quality and authenticity. Verification typically takes 2-5 business days. You'll receive 
                  an email notification once your store is approved and live on SPIRAL.
                </AlertDescription>
              </Alert>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={verificationMutation.isPending}
              >
                {verificationMutation.isPending ? "Submitting..." : "Submit for Verification"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}