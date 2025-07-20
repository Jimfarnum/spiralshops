import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertRetailerSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Users, TrendingUp, Smartphone, Star } from "lucide-react";
import type { InsertRetailer } from "@shared/schema";

export default function RetailerSignupForm() {
  const { toast } = useToast();
  const [zipCode, setZipCode] = useState("");
  
  const form = useForm<InsertRetailer>({
    resolver: zodResolver(insertRetailerSchema),
    defaultValues: {
      businessName: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      category: "",
      description: "",
      zipCode: "",
    },
  });

  const createRetailerMutation = useMutation({
    mutationFn: async (data: InsertRetailer) => {
      const response = await apiRequest("POST", "/api/retailers", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your retailer application has been submitted successfully.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit your application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertRetailer) => {
    // Extract ZIP code from address
    const zipMatch = data.address.match(/\b\d{5}\b/);
    const extractedZip = zipMatch ? zipMatch[0] : "";
    
    createRetailerMutation.mutate({
      ...data,
      zipCode: extractedZip,
    });
  };

  return (
    <section className="py-16 bg-gray-50" id="retailer-signup">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Join SPIRAL as a Retailer
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with local customers and grow your business with our modern platform designed for local retailers.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 lg:p-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Get Started Today</h3>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your business name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="First name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="(555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main Street, City, State 12345" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="clothing">Clothing & Fashion</SelectItem>
                            <SelectItem value="food">Food & Beverage</SelectItem>
                            <SelectItem value="home">Home & Garden</SelectItem>
                            <SelectItem value="health">Health & Beauty</SelectItem>
                            <SelectItem value="electronics">Electronics</SelectItem>
                            <SelectItem value="books">Books & Media</SelectItem>
                            <SelectItem value="jewelry">Jewelry & Accessories</SelectItem>
                            <SelectItem value="sports">Sports & Recreation</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell customers about your business..." 
                            rows={4} 
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full bg-spiral-blue text-white hover:bg-spiral-blue-dark"
                    disabled={createRetailerMutation.isPending}
                  >
                    {createRetailerMutation.isPending ? "Submitting..." : "Join SPIRAL"}
                  </Button>
                </form>
              </Form>
            </div>

            <div className="bg-gradient-to-br from-spiral-blue-light to-spiral-blue p-8 lg:p-12 text-white">
              <h3 className="text-2xl font-bold mb-6">Why Choose SPIRAL?</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-white bg-opacity-20 rounded-full p-2 mr-4 mt-1">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Local Community Focus</h4>
                    <p className="text-blue-100">Connect with customers in your neighborhood who want to support local businesses.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-white bg-opacity-20 rounded-full p-2 mr-4 mt-1">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Grow Your Business</h4>
                    <p className="text-blue-100">Increase visibility and reach new customers with our modern platform.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-white bg-opacity-20 rounded-full p-2 mr-4 mt-1">
                    <Smartphone className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Easy to Use</h4>
                    <p className="text-blue-100">Manage your store profile and connect with customers through our intuitive interface.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-white bg-opacity-20 rounded-full p-2 mr-4 mt-1">
                    <Star className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Perks & Rewards</h4>
                    <p className="text-blue-100">Offer exclusive perks to loyal customers and build lasting relationships.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
