import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useToast } from '@/hooks/use-toast';
import { Link, useLocation } from 'wouter';
import { 
  Store, 
  ArrowLeft,
  CheckCircle,
  Building,
  Mail,
  Phone,
  Globe,
  MapPin,
  User,
  Lock,
  FileText,
  Hash
} from 'lucide-react';

const retailerSignupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  contactName: z.string().min(2, 'Contact name must be at least 2 characters'),
  phone: z.string().optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  zipCode: z.string().min(5, 'ZIP code must be at least 5 characters'),
  bio: z.string().optional(),
  taxId: z.string().optional(),
  preferredMallId: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RetailerSignupData = z.infer<typeof retailerSignupSchema>;

export default function RetailerSignupPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [malls, setMalls] = useState<any[]>([]);

  const form = useForm<RetailerSignupData>({
    resolver: zodResolver(retailerSignupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      businessName: '',
      contactName: '',
      phone: '',
      website: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      bio: '',
      taxId: '',
      preferredMallId: '',
    },
  });

  // Load malls on component mount
  useEffect(() => {
    fetch('/api/retailers/malls')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMalls(data.malls);
        }
      })
      .catch(console.error);
  }, []);

  const onSubmit = async (data: RetailerSignupData) => {
    setIsLoading(true);
    try {
      const { confirmPassword, ...submitData } = data;
      
      const response = await fetch('/api/retailers/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();

      if (response.ok) {
        // Store token
        localStorage.setItem('retailerToken', result.token);
        localStorage.setItem('retailerData', JSON.stringify(result.retailer));
        
        toast({
          title: "Account Created Successfully!",
          description: "Welcome to SPIRAL. Let's complete your profile setup.",
        });

        setLocation('/retailers/dashboard');
      } else {
        toast({
          title: "Signup Failed",
          description: result.error || "Failed to create account",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Please check your connection and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Store className="h-8 w-8 text-[var(--spiral-coral)]" />
              <h1 className="text-4xl font-bold text-[var(--spiral-navy)]">
                Join SPIRAL as a Retailer
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Connect with local shoppers and grow your business with our community-focused platform. 
              Get started today and reach customers in your area.
            </p>
            
            {/* Back Navigation */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <Link href="/">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Link href="/retailers/login">
                <Button variant="ghost">
                  Already have an account? Sign In
                </Button>
              </Link>
            </div>
          </div>

          {/* Benefits Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4 text-center">
                <Building className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-green-800">Local Discovery</h3>
                <p className="text-sm text-green-700">
                  Connect with shoppers in your community through our location-based platform
                </p>
              </CardContent>
            </Card>
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4 text-center">
                <CheckCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-blue-800">Easy Management</h3>
                <p className="text-sm text-blue-700">
                  Simple dashboard to manage products, orders, and customer interactions
                </p>
              </CardContent>
            </Card>
            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="p-4 text-center">
                <Store className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-purple-800">SPIRAL Rewards</h3>
                <p className="text-sm text-purple-700">
                  Participate in our loyalty program to encourage repeat customers
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Signup Form */}
          <Card>
            <CardHeader>
              <CardTitle>Create Your Retailer Account</CardTitle>
              <CardDescription>
                Fill out the form below to get started. All fields marked with * are required.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Account Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[var(--spiral-navy)] flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Account Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              Email Address *
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="business@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="contactName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              Contact Name *
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="John Smith" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Lock className="h-4 w-4" />
                              Password *
                            </FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Minimum 8 characters" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Lock className="h-4 w-4" />
                              Confirm Password *
                            </FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Repeat password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Business Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[var(--spiral-navy)] flex items-center gap-2">
                      <Building className="h-5 w-5" />
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
                              <Input placeholder="Acme Electronics Store" {...field} />
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
                            <FormLabel className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              Phone Number
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="(555) 123-4567" {...field} />
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
                            <FormLabel className="flex items-center gap-2">
                              <Globe className="h-4 w-4" />
                              Website
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="https://www.yourstore.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="taxId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Hash className="h-4 w-4" />
                              Tax ID (Optional)
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="12-3456789" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Location Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[var(--spiral-navy)] flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Location Information
                    </h3>
                    
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address *</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main Street, Suite 100" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City *</FormLabel>
                            <FormControl>
                              <Input placeholder="Minneapolis" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State *</FormLabel>
                            <FormControl>
                              <Input placeholder="MN" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ZIP Code *</FormLabel>
                            <FormControl>
                              <Input placeholder="55401" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Optional Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[var(--spiral-navy)] flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Additional Information (Optional)
                    </h3>
                    
                    <FormField
                      control={form.control}
                      name="preferredMallId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Mall Location</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a mall (optional)" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {malls.map((mall) => (
                                <SelectItem key={mall.id} value={mall.id.toString()}>
                                  {mall.name} - {mall.city}, {mall.state}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us about your business, what you sell, and what makes you unique..."
                              rows={4}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Terms and Submit */}
                  <div className="space-y-4">
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        By creating an account, you agree to SPIRAL's Terms of Service and Privacy Policy. 
                        Your account will be reviewed and approved within 24-48 hours.
                      </AlertDescription>
                    </Alert>

                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/80 text-lg py-6"
                    >
                      {isLoading ? (
                        <>Creating Account...</>
                      ) : (
                        <>
                          <Store className="h-5 w-5 mr-2" />
                          Create Retailer Account
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}