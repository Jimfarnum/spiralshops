import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle,
  ArrowLeft,
  HelpCircle,
  User,
  CreditCard,
  Package,
  Settings,
  FileText,
  ExternalLink
} from "lucide-react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import SEOHead from "@/components/SEOHead";

interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  description: string;
}

interface ContactForm {
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
  priority: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  const variants = {
    open: 'destructive',
    in_progress: 'default',
    resolved: 'secondary'
  } as const;
  
  return (
    <Badge variant={variants[status as keyof typeof variants] || 'default'}>
      {status.replace('_', ' ')}
    </Badge>
  );
};

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState("contact");
  const [contactForm, setContactForm] = useState<ContactForm>({
    name: '',
    email: '',
    category: '',
    subject: '',
    message: '',
    priority: 'medium'
  });

  // Fetch support tickets
  const { data: tickets = [] } = useQuery({
    queryKey: ['/api/support/tickets'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/support/tickets');
        if (!response.ok) {
          // Return demo data if API not available
          return [
            {
              id: '1',
              subject: 'Issue with order payment',
              category: 'payment',
              status: 'in_progress',
              priority: 'high',
              createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
              updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
              description: 'Having trouble completing payment for order #12345'
            },
            {
              id: '2',
              subject: 'Question about SPIRAL rewards',
              category: 'loyalty',
              status: 'resolved',
              priority: 'low',
              createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
              updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
              description: 'How do I redeem my SPIRAL points?'
            }
          ];
        }
        return response.json();
      } catch {
        return [];
      }
    }
  });

  // Submit contact form
  const submitContactMutation = useMutation({
    mutationFn: (formData: ContactForm) => 
      apiRequest('POST', '/api/support/contact', formData),
    onSuccess: () => {
      setContactForm({
        name: '',
        email: '',
        category: '',
        subject: '',
        message: '',
        priority: 'medium'
      });
    }
  });

  const handleSubmitContact = () => {
    submitContactMutation.mutate(contactForm);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const faqItems = [
    {
      id: 'account',
      question: 'How do I create a SPIRAL account?',
      answer: 'You can create an account by clicking the "Sign Up" button in the top right corner. Provide your email, create a password, and verify your email address to get started.'
    },
    {
      id: 'spirals',
      question: 'How do SPIRAL rewards work?',
      answer: 'You earn 1 SPIRAL for every $5 spent at local businesses. SPIRALs can be redeemed for discounts, special offers, or exclusive perks at participating stores.'
    },
    {
      id: 'shipping',
      question: 'What are the shipping options?',
      answer: 'We offer multiple delivery options: Ship to Me (standard shipping), In-Store Pickup (free), and Ship to SPIRAL Center (convenient pickup locations).'
    },
    {
      id: 'returns',
      question: 'What is the return policy?',
      answer: 'Most items can be returned within 30 days of purchase. Digital items and personalized products may have different return policies. Check with individual retailers for specific policies.'
    },
    {
      id: 'payment',
      question: 'What payment methods are accepted?',
      answer: 'We accept all major credit cards, debit cards, PayPal, Apple Pay, Google Pay, and SPIRAL Wallet. Some stores may offer additional payment options.'
    },
    {
      id: 'stores',
      question: 'How do I find stores near me?',
      answer: 'Use the "Near Me" feature in the main navigation or enable location services. You can also search by zip code or city to find local businesses in your area.'
    }
  ];

  return (
    <>
      <SEOHead 
        title="Support & Help Center - SPIRAL"
        description="Get help with your SPIRAL account, orders, and questions"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[var(--spiral-navy)]">
                Support & Help Center
              </h1>
              <p className="text-sm text-gray-600">
                We're here to help with any questions or issues
              </p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="contact" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Contact
              </TabsTrigger>
              <TabsTrigger value="faq" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                FAQ
              </TabsTrigger>
              <TabsTrigger value="tickets" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                My Tickets
              </TabsTrigger>
              <TabsTrigger value="resources" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Resources
              </TabsTrigger>
            </TabsList>

            {/* Contact Tab */}
            <TabsContent value="contact" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Contact Form */}
                <Card>
                  <CardHeader>
                    <CardTitle>Send us a message</CardTitle>
                    <CardDescription>
                      Fill out the form below and we'll get back to you within 24 hours
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select 
                        value={contactForm.category} 
                        onValueChange={(value) => setContactForm({ ...contactForm, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="account">Account & Profile</SelectItem>
                          <SelectItem value="orders">Orders & Shipping</SelectItem>
                          <SelectItem value="payment">Payment & Billing</SelectItem>
                          <SelectItem value="loyalty">SPIRAL Rewards</SelectItem>
                          <SelectItem value="technical">Technical Issues</SelectItem>
                          <SelectItem value="store">Store/Retailer Questions</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        placeholder="Brief description of your issue"
                      />
                    </div>

                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select 
                        value={contactForm.priority} 
                        onValueChange={(value) => setContactForm({ ...contactForm, priority: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low - General question</SelectItem>
                          <SelectItem value="medium">Medium - Non-urgent issue</SelectItem>
                          <SelectItem value="high">High - Urgent issue</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        placeholder="Please provide details about your question or issue..."
                        rows={4}
                      />
                    </div>

                    <Button 
                      className="w-full bg-[var(--spiral-navy)] hover:bg-[var(--spiral-navy)]/90"
                      onClick={handleSubmitContact}
                      disabled={submitContactMutation.isPending}
                    >
                      {submitContactMutation.isPending ? 'Sending...' : 'Send Message'}
                    </Button>

                    {submitContactMutation.isSuccess && (
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600 mx-auto mb-1" />
                        <p className="text-sm text-green-800">
                          Message sent successfully! We'll respond within 24 hours.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Contact Options */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Phone className="h-5 w-5" />
                        Phone Support
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-semibold text-[var(--spiral-navy)] mb-2">
                        1-800-SPIRAL-1
                      </p>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Monday - Friday: 8 AM - 8 PM EST
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Saturday - Sunday: 10 AM - 6 PM EST
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Email Support
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-semibold text-[var(--spiral-navy)] mb-2">
                        support@spiralshops.com
                      </p>
                      <p className="text-sm text-gray-600">
                        We typically respond within 24 hours
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        Live Chat
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3">
                        Chat with our support team in real-time
                      </p>
                      <Button variant="outline" className="w-full">
                        Start Live Chat
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* FAQ Tab */}
            <TabsContent value="faq" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                  <CardDescription>
                    Find quick answers to common questions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {faqItems.map((item) => (
                      <AccordionItem key={item.id} value={item.id}>
                        <AccordionTrigger className="text-left">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            {/* My Tickets Tab */}
            <TabsContent value="tickets" className="space-y-4">
              {tickets.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No support tickets yet
                    </h3>
                    <p className="text-gray-600">
                      When you contact support, your tickets will appear here
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {tickets.map((ticket: SupportTicket) => (
                    <Card key={ticket.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {ticket.subject}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Ticket #{ticket.id} • {ticket.category}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <StatusBadge status={ticket.status} />
                            <Badge variant={ticket.priority === 'high' ? 'destructive' : 'outline'}>
                              {ticket.priority}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {ticket.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Created: {formatDate(ticket.createdAt)}</span>
                          <span>Updated: {formatDate(ticket.updatedAt)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Resources Tab */}
            <TabsContent value="resources" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Account & Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Link href="/profile-settings">
                      <Button variant="ghost" className="w-full justify-start">
                        Profile Settings
                      </Button>
                    </Link>
                    <Link href="/privacy">
                      <Button variant="ghost" className="w-full justify-start">
                        Privacy Policy
                      </Button>
                    </Link>
                    <Link href="/terms">
                      <Button variant="ghost" className="w-full justify-start">
                        Terms of Service
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Orders & Shipping
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Link href="/orders">
                      <Button variant="ghost" className="w-full justify-start">
                        Order History
                      </Button>
                    </Link>
                    <Link href="/tracking">
                      <Button variant="ghost" className="w-full justify-start">
                        Track Package
                      </Button>
                    </Link>
                    <Link href="/returns">
                      <Button variant="ghost" className="w-full justify-start">
                        Returns & Refunds
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment & Billing
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Link href="/payment-methods">
                      <Button variant="ghost" className="w-full justify-start">
                        Payment Methods
                      </Button>
                    </Link>
                    <Link href="/wallet">
                      <Button variant="ghost" className="w-full justify-start">
                        SPIRAL Wallet
                      </Button>
                    </Link>
                    <Link href="/gift-cards">
                      <Button variant="ghost" className="w-full justify-start">
                        Gift Cards
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Platform Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Link href="/notifications">
                      <Button variant="ghost" className="w-full justify-start">
                        Notifications
                      </Button>
                    </Link>
                    <Link href="/accessibility-settings">
                      <Button variant="ghost" className="w-full justify-start">
                        Accessibility
                      </Button>
                    </Link>
                    <Link href="/language-demo">
                      <Button variant="ghost" className="w-full justify-start">
                        Language Settings
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}