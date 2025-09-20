import React, { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Mail, 
  Send, 
  Calendar, 
  Percent, 
  Users, 
  BarChart3, 
  Gift, 
  Star,
  Clock,
  Target,
  Megaphone,
  Image,
  ExternalLink,
  Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/header';
import Footer from '@/components/footer';

interface Campaign {
  id: string;
  title: string;
  type: 'email' | 'social' | 'coupon';
  status: 'draft' | 'scheduled' | 'sent';
  audience: string;
  sent: number;
  opened: number;
  created: string;
}

interface EmailTemplate {
  title: string;
  image: string;
  content: string;
  ctaText: string;
  ctaLink: string;
}

interface CouponCode {
  code: string;
  discount: number;
  startDate: string;
  endDate: string;
  spiralBoost: boolean;
  uses: number;
  maxUses: number;
}

const MarketingCenter = () => {
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('campaigns');
  const [showEmailBuilder, setShowEmailBuilder] = useState(false);
  const [showCouponGenerator, setShowCouponGenerator] = useState(false);
  const [showSchedulePost, setShowSchedulePost] = useState(false);

  // Mock campaigns data
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      title: 'Holiday Special Coffee Blend',
      type: 'email',
      status: 'sent',
      audience: 'All Users',
      sent: 127,
      opened: 89,
      created: '2024-01-15'
    },
    {
      id: '2',
      title: '20% Off Winter Collection',
      type: 'coupon',
      status: 'scheduled',
      audience: 'Store Followers',
      sent: 0,
      opened: 0,
      created: '2024-01-18'
    }
  ]);

  const [emailTemplate, setEmailTemplate] = useState<EmailTemplate>({
    title: '',
    image: '',
    content: '',
    ctaText: '',
    ctaLink: ''
  });

  const [couponData, setCouponData] = useState<Partial<CouponCode>>({
    code: '',
    discount: 10,
    startDate: '',
    endDate: '',
    spiralBoost: false,
    maxUses: 100
  });

  const [socialPost, setSocialPost] = useState({
    content: '',
    platform: 'twitter',
    scheduleDate: '',
    scheduleTime: '',
    image: ''
  });

  const handleCreateEmail = () => {
    if (!emailTemplate.title || !emailTemplate.content) {
      toast({
        title: "Missing information",
        description: "Please fill in title and content.",
        variant: "destructive",
      });
      return;
    }

    const newCampaign: Campaign = {
      id: (campaigns.length + 1).toString(),
      title: emailTemplate.title,
      type: 'email',
      status: 'draft',
      audience: 'All Users',
      sent: 0,
      opened: 0,
      created: new Date().toISOString().split('T')[0]
    };

    setCampaigns(prev => [...prev, newCampaign]);
    setEmailTemplate({ title: '', image: '', content: '', ctaText: '', ctaLink: '' });
    setShowEmailBuilder(false);

    toast({
      title: "Email campaign created!",
      description: "Your campaign has been saved as a draft.",
    });
  };

  const handleGenerateCoupon = () => {
    if (!couponData.discount || !couponData.startDate || !couponData.endDate) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const generatedCode = `SPIRAL${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    const newCampaign: Campaign = {
      id: (campaigns.length + 1).toString(),
      title: `${couponData.discount}% Off Coupon - ${generatedCode}`,
      type: 'coupon',
      status: 'draft',
      audience: 'All Users',
      sent: 0,
      opened: 0,
      created: new Date().toISOString().split('T')[0]
    };

    setCampaigns(prev => [...prev, newCampaign]);
    setCouponData({ code: '', discount: 10, startDate: '', endDate: '', spiralBoost: false, maxUses: 100 });
    setShowCouponGenerator(false);

    toast({
      title: "Coupon generated!",
      description: `Coupon code ${generatedCode} has been created.`,
    });
  };

  const handleSchedulePost = () => {
    if (!socialPost.content || !socialPost.scheduleDate) {
      toast({
        title: "Missing information",
        description: "Please fill in content and schedule date.",
        variant: "destructive",
      });
      return;
    }

    const newCampaign: Campaign = {
      id: (campaigns.length + 1).toString(),
      title: `${socialPost.platform} Post - ${socialPost.content.substring(0, 30)}...`,
      type: 'social',
      status: 'scheduled',
      audience: 'Social Followers',
      sent: 0,
      opened: 0,
      created: new Date().toISOString().split('T')[0]
    };

    setCampaigns(prev => [...prev, newCampaign]);
    setSocialPost({ content: '', platform: 'twitter', scheduleDate: '', scheduleTime: '', image: '' });
    setShowSchedulePost(false);

    toast({
      title: "Post scheduled!",
      description: "Your social media post has been scheduled.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-500';
      case 'scheduled': return 'bg-blue-500';
      case 'draft': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'social': return <Megaphone className="h-4 w-4" />;
      case 'coupon': return <Percent className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[var(--spiral-navy)] font-['Poppins']">
            Marketing Center
          </h1>
          <p className="text-gray-600 mt-2 text-lg font-['Inter']">
            Create and manage your marketing campaigns
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Dialog open={showEmailBuilder} onOpenChange={setShowEmailBuilder}>
            <DialogTrigger asChild>
              <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-[var(--spiral-coral)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-8 w-8 text-[var(--spiral-coral)]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--spiral-navy)] mb-2 font-['Poppins']">
                    Email Campaign
                  </h3>
                  <p className="text-gray-600 text-sm font-['Inter']">
                    Create targeted email campaigns for your customers
                  </p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-[var(--spiral-navy)] font-['Poppins']">
                  Create Email Campaign
                </DialogTitle>
                <DialogDescription className="font-['Inter']">
                  Design a professional email campaign for your customers
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email-title" className="text-sm font-medium text-gray-700 font-['Inter']">
                    Campaign Title *
                  </Label>
                  <Input
                    id="email-title"
                    value={emailTemplate.title}
                    onChange={(e) => setEmailTemplate(prev => ({ ...prev, title: e.target.value }))}
                    className="mt-1 rounded-lg"
                    placeholder="Enter campaign title"
                  />
                </div>

                <div>
                  <Label htmlFor="email-image" className="text-sm font-medium text-gray-700 font-['Inter']">
                    Header Image URL
                  </Label>
                  <Input
                    id="email-image"
                    value={emailTemplate.image}
                    onChange={(e) => setEmailTemplate(prev => ({ ...prev, image: e.target.value }))}
                    className="mt-1 rounded-lg"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <Label htmlFor="email-content" className="text-sm font-medium text-gray-700 font-['Inter']">
                    Email Content *
                  </Label>
                  <Textarea
                    id="email-content"
                    value={emailTemplate.content}
                    onChange={(e) => setEmailTemplate(prev => ({ ...prev, content: e.target.value }))}
                    className="mt-1 rounded-lg"
                    placeholder="Write your email content..."
                    rows={5}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cta-text" className="text-sm font-medium text-gray-700 font-['Inter']">
                      Call to Action Text
                    </Label>
                    <Input
                      id="cta-text"
                      value={emailTemplate.ctaText}
                      onChange={(e) => setEmailTemplate(prev => ({ ...prev, ctaText: e.target.value }))}
                      className="mt-1 rounded-lg"
                      placeholder="Shop Now"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cta-link" className="text-sm font-medium text-gray-700 font-['Inter']">
                      Call to Action Link
                    </Label>
                    <Input
                      id="cta-link"
                      value={emailTemplate.ctaLink}
                      onChange={(e) => setEmailTemplate(prev => ({ ...prev, ctaLink: e.target.value }))}
                      className="mt-1 rounded-lg"
                      placeholder="/products"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowEmailBuilder(false)} className="rounded-lg">
                    Cancel
                  </Button>
                  <Button onClick={handleCreateEmail} className="bg-[var(--spiral-navy)] hover:bg-[var(--spiral-coral)] text-white rounded-lg">
                    Create Campaign
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showCouponGenerator} onOpenChange={setShowCouponGenerator}>
            <DialogTrigger asChild>
              <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-[var(--spiral-gold)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Percent className="h-8 w-8 text-[var(--spiral-gold)]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--spiral-navy)] mb-2 font-['Poppins']">
                    Coupon Generator
                  </h3>
                  <p className="text-gray-600 text-sm font-['Inter']">
                    Generate discount codes and SPIRAL bonuses
                  </p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle className="text-[var(--spiral-navy)] font-['Poppins']">
                  Generate Coupon Code
                </DialogTitle>
                <DialogDescription className="font-['Inter']">
                  Create discount codes with SPIRAL point bonuses
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="discount" className="text-sm font-medium text-gray-700 font-['Inter']">
                    Discount Percentage *
                  </Label>
                  <Input
                    id="discount"
                    type="number"
                    value={couponData.discount || ''}
                    onChange={(e) => setCouponData(prev => ({ ...prev, discount: parseInt(e.target.value) }))}
                    className="mt-1 rounded-lg"
                    placeholder="10"
                    min="1"
                    max="100"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start-date" className="text-sm font-medium text-gray-700 font-['Inter']">
                      Start Date *
                    </Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={couponData.startDate}
                      onChange={(e) => setCouponData(prev => ({ ...prev, startDate: e.target.value }))}
                      className="mt-1 rounded-lg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="end-date" className="text-sm font-medium text-gray-700 font-['Inter']">
                      End Date *
                    </Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={couponData.endDate}
                      onChange={(e) => setCouponData(prev => ({ ...prev, endDate: e.target.value }))}
                      className="mt-1 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="max-uses" className="text-sm font-medium text-gray-700 font-['Inter']">
                    Maximum Uses
                  </Label>
                  <Input
                    id="max-uses"
                    type="number"
                    value={couponData.maxUses || ''}
                    onChange={(e) => setCouponData(prev => ({ ...prev, maxUses: parseInt(e.target.value) }))}
                    className="mt-1 rounded-lg"
                    placeholder="100"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="spiral-boost"
                    checked={couponData.spiralBoost}
                    onCheckedChange={(checked) => setCouponData(prev => ({ ...prev, spiralBoost: checked }))}
                  />
                  <Label htmlFor="spiral-boost" className="text-sm font-medium text-gray-700 font-['Inter']">
                    Include SPIRAL Point Boost (Double points on purchase)
                  </Label>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowCouponGenerator(false)} className="rounded-lg">
                    Cancel
                  </Button>
                  <Button onClick={handleGenerateCoupon} className="bg-[var(--spiral-navy)] hover:bg-[var(--spiral-coral)] text-white rounded-lg">
                    Generate Coupon
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showSchedulePost} onOpenChange={setShowSchedulePost}>
            <DialogTrigger asChild>
              <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-[var(--spiral-sage)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-8 w-8 text-[var(--spiral-sage)]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--spiral-navy)] mb-2 font-['Poppins']">
                    Schedule Post
                  </h3>
                  <p className="text-gray-600 text-sm font-['Inter']">
                    Schedule posts for X and Facebook
                  </p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle className="text-[var(--spiral-navy)] font-['Poppins']">
                  Schedule Social Media Post
                </DialogTitle>
                <DialogDescription className="font-['Inter']">
                  Create and schedule posts for your social media channels
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="platform" className="text-sm font-medium text-gray-700 font-['Inter']">
                    Platform
                  </Label>
                  <Select value={socialPost.platform} onValueChange={(value) => setSocialPost(prev => ({ ...prev, platform: value }))}>
                    <SelectTrigger className="mt-1 rounded-lg">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twitter">X (Twitter)</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="post-content" className="text-sm font-medium text-gray-700 font-['Inter']">
                    Post Content *
                  </Label>
                  <Textarea
                    id="post-content"
                    value={socialPost.content}
                    onChange={(e) => setSocialPost(prev => ({ ...prev, content: e.target.value }))}
                    className="mt-1 rounded-lg"
                    placeholder="Write your post content..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="schedule-date" className="text-sm font-medium text-gray-700 font-['Inter']">
                      Schedule Date *
                    </Label>
                    <Input
                      id="schedule-date"
                      type="date"
                      value={socialPost.scheduleDate}
                      onChange={(e) => setSocialPost(prev => ({ ...prev, scheduleDate: e.target.value }))}
                      className="mt-1 rounded-lg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="schedule-time" className="text-sm font-medium text-gray-700 font-['Inter']">
                      Schedule Time
                    </Label>
                    <Input
                      id="schedule-time"
                      type="time"
                      value={socialPost.scheduleTime}
                      onChange={(e) => setSocialPost(prev => ({ ...prev, scheduleTime: e.target.value }))}
                      className="mt-1 rounded-lg"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowSchedulePost(false)} className="rounded-lg">
                    Cancel
                  </Button>
                  <Button onClick={handleSchedulePost} className="bg-[var(--spiral-navy)] hover:bg-[var(--spiral-coral)] text-white rounded-lg">
                    Schedule Post
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Marketing Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 rounded-xl">
            <TabsTrigger value="campaigns" className="rounded-lg">Campaigns</TabsTrigger>
            <TabsTrigger value="templates" className="rounded-lg">Templates</TabsTrigger>
            <TabsTrigger value="coupons" className="rounded-lg">Coupons</TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-lg">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-[var(--spiral-navy)] font-['Poppins'] flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Campaign History
                </CardTitle>
                <CardDescription className="font-['Inter']">
                  View and manage all your marketing campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="border rounded-xl p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(campaign.type)}
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(campaign.status)}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[var(--spiral-navy)] font-['Inter']">
                          {campaign.title}
                        </h3>
                        <p className="text-sm text-gray-600 font-['Inter']">
                          {campaign.audience} • Created {campaign.created}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {campaign.status}
                    </Badge>
                  </div>
                  
                  {campaign.sent > 0 && (
                    <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                      <div className="text-center">
                        <p className="text-lg font-semibold text-[var(--spiral-navy)] font-['Poppins']">
                          {campaign.sent}
                        </p>
                        <p className="text-xs text-gray-600 font-['Inter']">Sent</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-[var(--spiral-coral)] font-['Poppins']">
                          {campaign.opened}
                        </p>
                        <p className="text-xs text-gray-600 font-['Inter']">Opened</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-[var(--spiral-sage)] font-['Poppins']">
                          {campaign.sent > 0 ? Math.round((campaign.opened / campaign.sent) * 100) : 0}%
                        </p>
                        <p className="text-xs text-gray-600 font-['Inter']">Open Rate</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-[var(--spiral-navy)] font-['Poppins']">Email Templates</CardTitle>
                <CardDescription>Pre-designed templates for your email campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="bg-gradient-to-br from-blue-100 to-blue-200 h-32 rounded mb-3 flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">Welcome Template</span>
                    </div>
                    <h3 className="font-semibold mb-2">New Customer Welcome</h3>
                    <p className="text-sm text-gray-600 mb-3">Perfect for onboarding new customers</p>
                    <Button size="sm" className="w-full">Use Template</Button>
                  </div>
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="bg-gradient-to-br from-green-100 to-green-200 h-32 rounded mb-3 flex items-center justify-center">
                      <span className="text-green-600 font-semibold">Sale Template</span>
                    </div>
                    <h3 className="font-semibold mb-2">Seasonal Sale</h3>
                    <p className="text-sm text-gray-600 mb-3">Promote special offers and discounts</p>
                    <Button size="sm" className="w-full">Use Template</Button>
                  </div>
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="bg-gradient-to-br from-purple-100 to-purple-200 h-32 rounded mb-3 flex items-center justify-center">
                      <span className="text-purple-600 font-semibold">Newsletter</span>
                    </div>
                    <h3 className="font-semibold mb-2">Monthly Newsletter</h3>
                    <p className="text-sm text-gray-600 mb-3">Keep customers updated with news</p>
                    <Button size="sm" className="w-full">Use Template</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="coupons">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-[var(--spiral-navy)] font-['Poppins']">Active Coupons</CardTitle>
                <CardDescription>Manage your discount codes and promotional offers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">WELCOME20</h4>
                      <p className="text-sm text-gray-600">20% off for new customers</p>
                      <p className="text-xs text-gray-500">Expires: Dec 31, 2024</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">45 uses</p>
                      <p className="text-sm text-gray-600">of 100 limit</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">SPIRAL10</h4>
                      <p className="text-sm text-gray-600">$10 off orders over $50</p>
                      <p className="text-xs text-gray-500">Expires: Jan 15, 2025</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-blue-600">12 uses</p>
                      <p className="text-sm text-gray-600">of unlimited</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-[var(--spiral-navy)] font-['Poppins']">Marketing Analytics</CardTitle>
                <CardDescription>Track performance of your marketing efforts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-600">1,247</p>
                    <p className="text-sm text-gray-600">Total Emails Sent</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-600">34.5%</p>
                    <p className="text-sm text-gray-600">Open Rate</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-purple-600">8.2%</p>
                    <p className="text-sm text-gray-600">Click Rate</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-orange-600">156</p>
                    <p className="text-sm text-gray-600">Coupon Uses</p>
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-4">Campaign Performance</h4>
                  <p className="text-gray-600 text-center py-8">Analytics chart would go here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default MarketingCenter;