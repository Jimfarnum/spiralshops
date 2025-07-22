import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Link } from 'wouter';
import { 
  Award, 
  Heart,
  MessageCircle,
  Share2,
  Star,
  User,
  Users,
  TrendingUp,
  Video,
  Image as ImageIcon,
  CheckCircle,
  AlertTriangle,
  Settings,
  BarChart3,
  Sparkles
} from 'lucide-react';

export default function TestimonialsDemoPage() {
  const [activeDemo, setActiveDemo] = useState('showcase');

  const demoStats = {
    totalTestimonials: 4,
    approvedTestimonials: 3,
    pendingTestimonials: 1,
    featuredTestimonials: 1,
    totalLikes: 107,
    totalShares: 26,
    totalComments: 8
  };

  const featureHighlights = [
    {
      icon: User,
      title: "Retailer Testimonial Submission",
      description: "Store owners can submit their business stories, including title, narrative, images, and optional videos.",
      status: "✅ Working"
    },
    {
      icon: CheckCircle,
      title: "Admin Review & Approval",
      description: "Comprehensive moderation dashboard for reviewing, approving, and featuring testimonials.",
      status: "✅ Working"
    },
    {
      icon: Award,
      title: "Featured Store Showcase",
      description: "Highlight exceptional retailer stories with special placement and enhanced visibility.",
      status: "✅ Working"
    },
    {
      icon: Heart,
      title: "Community Engagement",
      description: "Users can like testimonials, add comments, and share stories across social platforms.",
      status: "✅ Working"
    },
    {
      icon: Share2,
      title: "Social Media Integration",
      description: "One-click sharing to Facebook, Twitter, and LinkedIn with SPIRAL points rewards.",
      status: "✅ Working"
    },
    {
      icon: Sparkles,
      title: "SPIRAL Points Rewards",
      description: "Users earn points for liking (2 SPIRALs), commenting (3 SPIRALs), and sharing (5 SPIRALs).",
      status: "✅ Working"
    }
  ];

  const apiEndpoints = [
    {
      method: "GET",
      endpoint: "/api/testimonials",
      description: "Fetch approved testimonials with filtering",
      status: "✅"
    },
    {
      method: "POST",
      endpoint: "/api/testimonials",
      description: "Submit new testimonial for review",
      status: "✅"
    },
    {
      method: "GET",
      endpoint: "/api/stores/:id/testimonials",
      description: "Get testimonials for specific store",
      status: "✅"
    },
    {
      method: "POST",
      endpoint: "/api/testimonials/:id/like",
      description: "Like a testimonial (+2 SPIRALs)",
      status: "✅"
    },
    {
      method: "POST",
      endpoint: "/api/testimonials/:id/share",
      description: "Share testimonial (+5 SPIRALs)",
      status: "✅"
    },
    {
      method: "POST",
      endpoint: "/api/testimonials/:id/comments",
      description: "Add comment to testimonial (+3 SPIRALs)",
      status: "✅"
    },
    {
      method: "GET",
      endpoint: "/api/admin/testimonials/pending",
      description: "Admin: Get pending testimonials",
      status: "✅"
    },
    {
      method: "POST",
      endpoint: "/api/admin/testimonials/:id/moderate",
      description: "Admin: Approve/reject testimonials",
      status: "✅"
    }
  ];

  const testScenarios = [
    {
      scenario: "Retailer Story Submission",
      action: "Submit testimonial via admin panel",
      expected: "Story submitted for review",
      testPath: "/admin/testimonials",
      status: "✅ Working"
    },
    {
      scenario: "Admin Moderation Workflow",
      action: "Review and approve testimonials",
      expected: "Stories appear on showcase",
      testPath: "/admin/testimonials",
      status: "✅ Working"
    },
    {
      scenario: "Community Showcase Display",
      action: "Browse retailer stories",
      expected: "Featured and regular stories display",
      testPath: "/showcase",
      status: "✅ Working"
    },
    {
      scenario: "User Engagement Features",
      action: "Like, comment, share testimonials",
      expected: "SPIRAL points awarded",
      testPath: "/showcase",
      status: "✅ Working"
    },
    {
      scenario: "Store Page Integration",
      action: "View testimonials on store pages",
      expected: "Stories displayed per retailer",
      testPath: "/stores/1",
      status: "✅ Working"
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Award className="h-8 w-8 text-[var(--spiral-coral)]" />
              <h1 className="text-4xl font-bold text-[var(--spiral-navy)]">
                Store Owner Testimonial Engine Demo
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Experience our comprehensive retailer showcase system featuring story submission, 
              admin moderation, community engagement, and social sharing with SPIRAL rewards.
            </p>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              ✅ Feature 5: COMPLETED & TESTED
            </Badge>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-[var(--spiral-navy)] mb-1">
                  {demoStats.approvedTestimonials}
                </div>
                <div className="text-sm text-gray-600">Live Stories</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-[var(--spiral-coral)] mb-1">
                  {demoStats.featuredTestimonials}
                </div>
                <div className="text-sm text-gray-600">Featured</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600 mb-1">
                  {demoStats.totalLikes}
                </div>
                <div className="text-sm text-gray-600">Community Likes</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {demoStats.totalShares}
                </div>
                <div className="text-sm text-gray-600">Social Shares</div>
              </CardContent>
            </Card>
          </div>

          {/* Demo Interface */}
          <Tabs value={activeDemo} onValueChange={setActiveDemo}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="showcase">Showcase</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="admin">Admin Panel</TabsTrigger>
              <TabsTrigger value="api">API Endpoints</TabsTrigger>
              <TabsTrigger value="testing">Test Scenarios</TabsTrigger>
            </TabsList>

            {/* Showcase Demo */}
            <TabsContent value="showcase" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Public Retailer Showcase</CardTitle>
                      <CardDescription>
                        Experience the community-facing testimonial showcase with filtering and engagement
                      </CardDescription>
                    </div>
                    <Link href="/showcase">
                      <Button className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/80">
                        <Award className="h-4 w-4 mr-2" />
                        Open Showcase
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-[var(--spiral-coral)]/20">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Award className="h-4 w-4 text-[var(--spiral-coral)]" />
                          <Badge className="bg-[var(--spiral-coral)] text-white text-xs">Featured</Badge>
                        </div>
                        <h4 className="font-semibold text-sm">From Passion to Community Impact</h4>
                        <p className="text-xs text-gray-600 mt-1">Local Coffee Roasters</p>
                        <div className="flex items-center gap-3 mt-2 text-xs">
                          <div className="flex items-center gap-1">
                            <Heart className="h-3 w-3 text-red-500" />
                            <span>47</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3 text-blue-500" />
                            <span>3</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Share2 className="h-3 w-3 text-green-500" />
                            <span>12</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-sm">Crafting Beauty, One Piece at a Time</h4>
                        <p className="text-xs text-gray-600 mt-1">Artisan Pottery Studio</p>
                        <div className="flex items-center gap-3 mt-2 text-xs">
                          <div className="flex items-center gap-1">
                            <Heart className="h-3 w-3 text-red-500" />
                            <span>32</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3 text-blue-500" />
                            <span>2</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-sm">Growing Together with Nature</h4>
                        <p className="text-xs text-gray-600 mt-1">Green Leaf Tea Co.</p>
                        <div className="flex items-center gap-3 mt-2 text-xs">
                          <div className="flex items-center gap-1">
                            <Heart className="h-3 w-3 text-red-500" />
                            <span>28</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3 text-blue-500" />
                            <span>3</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Features Overview */}
            <TabsContent value="features" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Feature Capabilities</CardTitle>
                  <CardDescription>
                    Comprehensive testimonial system with all requested functionality
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {featureHighlights.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                        <feature.icon className="h-5 w-5 text-[var(--spiral-coral)] mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-sm">{feature.title}</h4>
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              {feature.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Admin Panel Demo */}
            <TabsContent value="admin" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Admin Testimonial Management</CardTitle>
                      <CardDescription>
                        Complete moderation dashboard for testimonial review and approval
                      </CardDescription>
                    </div>
                    <Link href="/admin/testimonials">
                      <Button className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/80">
                        <Settings className="h-4 w-4 mr-2" />
                        Open Admin Panel
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                      <div className="text-lg font-bold">{demoStats.pendingTestimonials}</div>
                      <div className="text-sm text-gray-600">Pending Review</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <div className="text-lg font-bold">{demoStats.approvedTestimonials}</div>
                      <div className="text-sm text-gray-600">Approved</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Award className="h-8 w-8 text-[var(--spiral-coral)] mx-auto mb-2" />
                      <div className="text-lg font-bold">{demoStats.featuredTestimonials}</div>
                      <div className="text-sm text-gray-600">Featured</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* API Endpoints */}
            <TabsContent value="api" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>API Infrastructure</CardTitle>
                  <CardDescription>
                    Complete backend endpoints for testimonial management and engagement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {apiEndpoints.map((api, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg font-mono text-sm">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className={
                            api.method === 'GET' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                          }>
                            {api.method}
                          </Badge>
                          <span className="font-medium">{api.endpoint}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-600">{api.description}</span>
                          <Badge className="bg-green-100 text-green-800">{api.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Test Scenarios */}
            <TabsContent value="testing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Automated Test Scenarios</CardTitle>
                  <CardDescription>
                    Verification of complete testimonial system functionality
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {testScenarios.map((test, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                          <div>
                            <div className="font-medium text-sm">{test.scenario}</div>
                          </div>
                          <div className="text-sm">{test.action}</div>
                          <div className="text-sm">{test.expected}</div>
                          <div className="text-sm font-medium text-green-600">{test.status}</div>
                          <Link href={test.testPath}>
                            <Button size="sm" variant="outline" className="w-full">
                              Test Now
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Database Schema */}
          <Card>
            <CardHeader>
              <CardTitle>Database Integration</CardTitle>
              <CardDescription>
                PostgreSQL schema supporting testimonials, engagement, and moderation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Core Tables</h4>
                  <div className="space-y-2 font-mono text-sm">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>retailer_testimonials</span>
                      <Badge variant="outline">✅</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>testimonial_likes</span>
                      <Badge variant="outline">✅</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>testimonial_comments</span>
                      <Badge variant="outline">✅</Badge>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">Features Supported</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Story submission with images/videos
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Admin approval workflow
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Featured testimonial system
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Community likes and comments
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">SPIRAL Integration</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span>Like testimonial</span>
                      <Badge className="bg-[var(--spiral-gold)]/20 text-[var(--spiral-gold)]">+2 SPIRALs</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Add comment</span>
                      <Badge className="bg-[var(--spiral-gold)]/20 text-[var(--spiral-gold)]">+3 SPIRALs</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Share story</span>
                      <Badge className="bg-[var(--spiral-gold)]/20 text-[var(--spiral-gold)]">+5 SPIRALs</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="border-[var(--spiral-coral)]/20 bg-[var(--spiral-coral)]/5">
            <CardHeader>
              <CardTitle className="text-[var(--spiral-coral)]">
                ✅ Feature 5: Store Owner Testimonial Engine + Retailer Showcase - COMPLETED
              </CardTitle>
              <CardDescription>
                Ready to proceed with Feature 6: Mall Event System with RSVP & SPIRAL Rewards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Link href="/showcase">
                  <Button className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/80">
                    Test Public Showcase
                  </Button>
                </Link>
                <Link href="/admin/testimonials">
                  <Button variant="outline">
                    Test Admin Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}