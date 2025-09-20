import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Store,
  CheckCircle,
  Clock,
  Star,
  TrendingUp,
  Users,
  MapPin,
  Upload,
  Globe,
  Mail,
  Phone
} from 'lucide-react';

const applicationSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  contactName: z.string().min(2, 'Contact name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  businessType: z.string().min(1, 'Please select a business type'),
  address: z.string().min(10, 'Please provide a complete address'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  logoUrl: z.string().url('Invalid logo URL').optional().or(z.literal(''))
});

type ApplicationForm = z.infer<typeof applicationSchema>;

export default function RetailerOnboarding() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  const form = useForm<ApplicationForm>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      businessName: '',
      contactName: '',
      email: '',
      phone: '',
      businessType: '',
      address: '',
      description: '',
      website: '',
      logoUrl: ''
    }
  });

  const businessTypes = [
    'Clothing & Fashion',
    'Electronics & Technology',
    'Food & Beverage', 
    'Home & Garden',
    'Health & Beauty',
    'Sports & Recreation',
    'Books & Media',
    'Jewelry & Accessories',
    'Toys & Games',
    'Arts & Crafts',
    'Automotive',
    'Professional Services',
    'Other'
  ];

  const benefits = [
    {
      icon: <Users className="h-6 w-6 text-[var(--spiral-coral)]" />,
      title: 'Reach Local Customers',
      description: 'Connect with shoppers in your community who value local businesses'
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-[var(--spiral-coral)]" />,
      title: 'Boost Sales',
      description: 'Increase visibility and sales through our mall-integrated platform'
    },
    {
      icon: <Star className="h-6 w-6 text-[var(--spiral-coral)]" />,
      title: 'SPIRAL Rewards Integration',
      description: 'Customers earn loyalty points for shopping with you'
    },
    {
      icon: <MapPin className="h-6 w-6 text-[var(--spiral-coral)]" />,
      title: 'Multi-Mall Presence',
      description: 'List your products across multiple mall locations'
    }
  ];

  const onSubmit = async (data: ApplicationForm) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Retailer application submitted:', data);
      setApplicationSubmitted(true);
      
      toast({
        title: 'Application Submitted!',
        description: 'We\'ll review your application and get back to you within 2-3 business days.',
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: 'Submission Failed',
        description: 'There was an error submitting your application. Please try again.',
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (applicationSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="text-center py-12">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-[var(--spiral-navy)] mb-4">
              Application Submitted!
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Thank you for your interest in joining the SPIRAL community. We've received your application and will review it carefully.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-[var(--spiral-navy)] mb-4">What happens next?</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[var(--spiral-coral)] text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <span>We'll review your application within 2-3 business days</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[var(--spiral-coral)] text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <span>You'll receive an email with approval status and next steps</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[var(--spiral-coral)] text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <span>If approved, we'll help you set up your retailer dashboard</span>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => window.location.href = '/'}
              className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90"
            >
              Return to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[var(--spiral-navy)] mb-4">
          Join the SPIRAL Community
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Connect with local customers and grow your business through our innovative platform
        </p>
        
        <div className="flex justify-center gap-6 mb-8">
          <Badge className="bg-[var(--spiral-coral)] text-white px-4 py-2 text-base">
            <Store className="h-4 w-4 mr-2" />
            1,200+ Local Retailers
          </Badge>
          <Badge className="bg-[var(--spiral-sage)] text-white px-4 py-2 text-base">
            <Users className="h-4 w-4 mr-2" />
            50,000+ Active Shoppers
          </Badge>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {benefits.map((benefit, index) => (
          <Card key={index} className="text-center">
            <CardContent className="p-6">
              <div className="mb-4">{benefit.icon}</div>
              <h3 className="font-semibold text-[var(--spiral-navy)] mb-2">
                {benefit.title}
              </h3>
              <p className="text-sm text-gray-600">
                {benefit.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Application Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-[var(--spiral-navy)]">
            Retailer Application
          </CardTitle>
          <CardDescription>
            Tell us about your business and we'll help you get started on SPIRAL
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Business Information */}
              <div>
                <h3 className="text-lg font-semibold text-[var(--spiral-navy)] mb-4">
                  Business Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Business Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="businessType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select business type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {businessTypes.map(type => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-[var(--spiral-navy)] mb-4">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="contactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input placeholder="your@email.com" className="pl-10" {...field} />
                          </div>
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
                        <FormLabel>Phone Number *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input placeholder="(555) 123-4567" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website (Optional)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input placeholder="https://yourwebsite.com" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Business Details */}
              <div>
                <h3 className="text-lg font-semibold text-[var(--spiral-navy)] mb-4">
                  Business Details
                </h3>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Business Address *</FormLabel>
                      <FormControl>
                        <Input placeholder="Full business address including city, state, and ZIP" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Business Description *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us about your business, products, and what makes you unique..."
                          className="min-h-[120px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Minimum 50 characters. This will help customers understand what you offer.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="logoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Logo URL (Optional)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input placeholder="https://yourlogo.com/logo.png" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Upload your logo to a service like Imgur or your website and paste the URL here
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submission */}
              <div className="border-t pt-6">
                <div className="flex items-center gap-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90 px-8"
                  >
                    {isSubmitting ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </Button>
                  
                  <div className="text-sm text-gray-600">
                    <p>By submitting, you agree to our terms of service.</p>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-[var(--spiral-navy)] mb-2">
                How long does the approval process take?
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                We typically review applications within 2-3 business days. You'll receive an email notification with the decision.
              </p>
              
              <h4 className="font-semibold text-[var(--spiral-navy)] mb-2">
                What are the fees to join SPIRAL?
              </h4>
              <p className="text-sm text-gray-600">
                There are no upfront fees to join SPIRAL. We only charge a small commission on sales made through our platform.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-[var(--spiral-navy)] mb-2">
                Can I manage multiple locations?
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Yes! Our platform supports businesses with multiple locations. You can manage all your stores from one dashboard.
              </p>
              
              <h4 className="font-semibold text-[var(--spiral-navy)] mb-2">
                Do I need technical skills to use the platform?
              </h4>
              <p className="text-sm text-gray-600">
                Not at all! Our platform is designed to be user-friendly. We also provide training and support to help you get started.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}