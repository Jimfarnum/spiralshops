import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Package, RefreshCw, CheckCircle2, XCircle, Clock, Gift, CreditCard, Users, DollarSign, TrendingUp, AlertCircle, Star } from "lucide-react";
import { Link } from "wouter";

export default function Feature11Demo() {
  const [activeTab, setActiveTab] = useState('overview');
  const [demoData, setDemoData] = useState({
    totalReturns: 156,
    pendingReturns: 23,
    approvedReturns: 98,
    rejectedReturns: 12,
    refundedReturns: 89,
    totalRefundAmount: 24650,
    avgProcessingTime: '1.5 days',
    customerSatisfaction: 94
  });

  const recentReturnRequests = [
    {
      id: 'RR001',
      productName: 'Organic Coffee Beans - Dark Roast',
      customerName: 'Sarah Johnson',
      amount: 2499,
      reason: 'Wrong size ordered - needed medium roast instead',
      status: 'approved',
      refundType: 'spiral_credit',
      submittedAt: '2025-01-22',
      autoApproved: true
    },
    {
      id: 'RR002', 
      productName: 'Handmade Ceramic Mug',
      customerName: 'Mike Chen',
      amount: 1899,
      reason: 'Arrived with small chip on the handle',
      status: 'pending',
      refundType: 'original',
      submittedAt: '2025-01-22',
      autoApproved: false
    },
    {
      id: 'RR003',
      productName: 'Local Honey - Wildflower Blend',
      customerName: 'Emily Davis',
      amount: 1299,
      reason: 'Not as described - expected clover honey',
      status: 'rejected',
      refundType: 'original',
      submittedAt: '2025-01-21',
      autoApproved: false,
      adminNote: 'Product description was accurate. Offering 10% discount for next purchase.'
    },
    {
      id: 'RR004',
      productName: 'Artisan Sourdough Bread',
      customerName: 'David Wilson',
      amount: 899,
      reason: 'Delivered stale - past best by date',
      status: 'refunded',
      refundType: 'spiral_credit',
      submittedAt: '2025-01-20',
      autoApproved: true,
      spiralBonus: 180
    }
  ];

  const refundMethods = [
    {
      name: 'Original Payment Method',
      icon: CreditCard,
      percentage: 65,
      avgTime: '2-5 business days',
      description: 'Stripe integration for seamless refunds'
    },
    {
      name: 'SPIRAL Credit',
      icon: Gift,
      percentage: 35,
      avgTime: 'Instant',
      description: '+20% bonus value for store credit'
    }
  ];

  const systemFeatures = [
    {
      title: 'Auto-Approval Logic',
      description: 'Returns under $100 within 30 days auto-approve for faster processing',
      icon: CheckCircle2,
      status: 'active'
    },
    {
      title: 'Stripe Integration',
      description: 'Direct refunds to original payment methods via Stripe API',
      icon: CreditCard,
      status: 'active'
    },
    {
      title: 'SPIRAL Credit Bonus',
      description: 'Customers choosing store credit get 20% bonus value',
      icon: Gift,
      status: 'active'
    },
    {
      title: 'Admin Dashboard',
      description: 'Comprehensive review and management interface for staff',
      icon: Users,
      status: 'active'
    },
    {
      title: 'Customer Portal',
      description: 'Self-service return requests with order history integration',
      icon: Package,
      status: 'active'
    },
    {
      title: 'Analytics Tracking',
      description: 'Return pattern analysis and customer satisfaction metrics',
      icon: TrendingUp,
      status: 'active'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    refunded: 'bg-blue-100 text-blue-800'
  };

  const statusIcons = {
    pending: Clock,
    approved: CheckCircle2,
    rejected: XCircle,
    refunded: Gift
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Features
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Feature 11: Return & Refund System
                </h1>
                <p className="text-gray-600 mt-1">
                  Complete return management with Stripe integration and SPIRAL credit support
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="px-3 py-1">
                <CheckCircle2 className="h-4 w-4 mr-1 text-green-600" />
                COMPLETE & TESTED
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">System Overview</TabsTrigger>
            <TabsTrigger value="requests">Return Requests</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="live-demo">Live Demo</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Package className="h-8 w-8 mx-auto mb-3 text-[#006d77]" />
                  <p className="text-3xl font-bold text-gray-900">{demoData.totalReturns}</p>
                  <p className="text-sm text-gray-600">Total Returns</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Clock className="h-8 w-8 mx-auto mb-3 text-yellow-600" />
                  <p className="text-3xl font-bold text-gray-900">{demoData.pendingReturns}</p>
                  <p className="text-sm text-gray-600">Pending Review</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <DollarSign className="h-8 w-8 mx-auto mb-3 text-green-600" />
                  <p className="text-3xl font-bold text-gray-900">{formatCurrency(demoData.totalRefundAmount * 100)}</p>
                  <p className="text-sm text-gray-600">Total Refunded</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Star className="h-8 w-8 mx-auto mb-3 text-purple-600" />
                  <p className="text-3xl font-bold text-gray-900">{demoData.customerSatisfaction}%</p>
                  <p className="text-sm text-gray-600">Satisfaction Rate</p>
                </CardContent>
              </Card>
            </div>

            {/* System Architecture */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5 text-[#006d77]" />
                    Return Process Flow
                  </CardTitle>
                  <CardDescription>
                    Automated workflow from request to refund completion
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-sm font-semibold">1</div>
                      <div>
                        <p className="font-medium">Customer Request</p>
                        <p className="text-sm text-gray-600">Self-service portal with order history</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-800 flex items-center justify-center text-sm font-semibold">2</div>
                      <div>
                        <p className="font-medium">Auto-Review</p>
                        <p className="text-sm text-gray-600">Returns under $100 auto-approve</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-sm font-semibold">3</div>
                      <div>
                        <p className="font-medium">Admin Review</p>
                        <p className="text-sm text-gray-600">Manual review for high-value items</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center text-sm font-semibold">4</div>
                      <div>
                        <p className="font-medium">Refund Processing</p>
                        <p className="text-sm text-gray-600">Stripe or SPIRAL credit (+20% bonus)</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-[#006d77]" />
                    Refund Method Distribution
                  </CardTitle>
                  <CardDescription>
                    Customer preferences and processing times
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {refundMethods.map((method, index) => {
                    const Icon = method.icon;
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-[#006d77]" />
                            <span className="font-medium">{method.name}</span>
                          </div>
                          <span className="font-semibold">{method.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-[#006d77] h-2 rounded-full" 
                            style={{ width: `${method.percentage}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>{method.description}</span>
                          <span>Avg: {method.avgTime}</span>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Recent Return Requests</h2>
                <p className="text-gray-600">Latest customer return and refund requests</p>
              </div>
            </div>

            <div className="grid gap-4">
              {recentReturnRequests.map((request, index) => {
                const StatusIcon = statusIcons[request.status as keyof typeof statusIcons];
                return (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="font-semibold text-lg">{request.productName}</h3>
                            <Badge className={statusColors[request.status as keyof typeof statusColors]}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </Badge>
                            {request.autoApproved && (
                              <Badge variant="secondary">Auto-Approved</Badge>
                            )}
                            {request.spiralBonus && (
                              <Badge className="bg-orange-100 text-orange-800">
                                +{request.spiralBonus} SPIRALs
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Request ID</p>
                              <p className="font-medium font-mono">{request.id}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Customer</p>
                              <p className="font-medium">{request.customerName}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Amount</p>
                              <p className="font-medium text-green-600">{formatCurrency(request.amount)}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Refund Method</p>
                              <p className="font-medium">
                                {request.refundType === 'original' ? 'Original Payment' : 'SPIRAL Credit'}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-gray-600 text-sm font-medium">Return Reason:</p>
                            <p className="text-sm bg-gray-50 p-3 rounded border-l-4 border-gray-300">
                              {request.reason}
                            </p>
                          </div>

                          {request.adminNote && (
                            <div className="space-y-2">
                              <p className="text-gray-600 text-sm font-medium">Admin Response:</p>
                              <p className="text-sm bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                                {request.adminNote}
                              </p>
                            </div>
                          )}

                          <div className="text-xs text-gray-500">
                            Submitted: {formatDate(request.submittedAt)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Processing Efficiency</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">{demoData.avgProcessingTime}</p>
                    <p className="text-sm text-gray-600">Average Processing Time</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Auto-Approved</span>
                      <span className="font-semibold">Instant</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Manual Review</span>
                      <span className="font-semibold">2-3 days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Stripe Refund</span>
                      <span className="font-semibold">3-5 days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Status Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm">Approved</span>
                      </div>
                      <span className="font-semibold">{demoData.approvedReturns}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <span className="text-sm">Pending</span>
                      </div>
                      <span className="font-semibold">{demoData.pendingReturns}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm">Refunded</span>
                      </div>
                      <span className="font-semibold">{demoData.refundedReturns}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-sm">Rejected</span>
                      </div>
                      <span className="font-semibold">{demoData.rejectedReturns}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Customer Impact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-purple-600">{demoData.customerSatisfaction}%</p>
                    <p className="text-sm text-gray-600">Satisfaction Rating</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>SPIRAL Credit Bonus</span>
                      <span className="font-semibold text-orange-600">+20% Value</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Auto-Approval Rate</span>
                      <span className="font-semibold text-green-600">78%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Return Rate</span>
                      <span className="font-semibold">2.3%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {systemFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-lg bg-[#006d77]/10 flex items-center justify-center">
                            <Icon className="h-6 w-6 text-[#006d77]" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{feature.title}</h3>
                            <Badge 
                              className={feature.status === 'active' ? 
                                'bg-green-100 text-green-800' : 
                                'bg-yellow-100 text-yellow-800'}
                            >
                              {feature.status === 'active' ? '✓ Active' : '⏳ Planned'}
                            </Badge>
                          </div>
                          <p className="text-gray-600">{feature.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="live-demo" className="space-y-6">
            <div className="text-center space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Experience the Return System</h2>
                <p className="text-gray-600">Try the complete return and refund workflow</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-8 text-center space-y-4">
                    <Package className="h-12 w-12 mx-auto text-[#006d77]" />
                    <h3 className="text-xl font-semibold">Customer Portal</h3>
                    <p className="text-gray-600">Request returns, track status, and manage refunds</p>
                    <Link href="/orders/returns">
                      <Button className="w-full bg-[#006d77] hover:bg-[#004d55] text-white">
                        Try Customer Portal
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-8 text-center space-y-4">
                    <Users className="h-12 w-12 mx-auto text-[#006d77]" />
                    <h3 className="text-xl font-semibold">Admin Dashboard</h3>
                    <p className="text-gray-600">Review requests, process refunds, and manage returns</p>
                    <Link href="/admin/returns">
                      <Button className="w-full bg-[#006d77] hover:bg-[#004d55] text-white">
                        Try Admin Dashboard
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 max-w-4xl mx-auto">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="space-y-2">
                    <h4 className="font-semibold text-blue-900">Demo Features Included:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Complete return request workflow with order history integration</li>
                      <li>• Admin review and approval system with decision tracking</li>
                      <li>• Dual refund methods: Stripe payment refunds + SPIRAL credit bonus</li>
                      <li>• Auto-approval logic for low-risk returns under $100</li>
                      <li>• Real-time status tracking and customer notifications</li>
                      <li>• Comprehensive analytics and performance metrics</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}