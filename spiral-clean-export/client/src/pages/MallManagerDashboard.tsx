import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import QRCodeGenerator from '@/components/QRCodeGenerator'
import MallQrCampaignTemplates from '@/components/MallQrCampaignTemplates'
import SpiralQRGenerator from '@/components/SpiralQRGenerator'
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Calendar, 
  MapPin, 
  Zap,
  Brain,
  Activity,
  DollarSign,
  ShoppingBag,
  Eye,
  Star,
  BarChart3,
  Settings,
  QrCode
} from 'lucide-react'

interface EventData {
  id: string;
  title: string;
  date: string;
  attendees: number;
  status: 'planned' | 'active' | 'completed';
}

interface TrafficInsight {
  period: string;
  visitors: number;
  trend: 'up' | 'down' | 'stable';
  percentage: number;
}

export default function MallManagerDashboard() {
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState<EventData[]>([])
  const [trafficData, setTrafficData] = useState<TrafficInsight[]>([])
  const [loading, setLoading] = useState(true)
  const [aiEnabled, setAiEnabled] = useState(false)

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setEvents([
        {
          id: 'event1',
          title: 'Holiday Shopping Expo',
          date: '2025-08-20',
          attendees: 350,
          status: 'planned'
        },
        {
          id: 'event2',
          title: 'Local Artisan Market',
          date: '2025-08-15',
          attendees: 120,
          status: 'active'
        },
        {
          id: 'event3',
          title: 'Back to School Fair',
          date: '2025-08-10',
          attendees: 280,
          status: 'completed'
        }
      ])

      setTrafficData([
        { period: 'Today', visitors: 1240, trend: 'up', percentage: 12 },
        { period: 'This Week', visitors: 8450, trend: 'up', percentage: 8 },
        { period: 'This Month', visitors: 32100, trend: 'down', percentage: 3 }
      ])

      setLoading(false)
    }, 1000)
  }, [])

  const handleEnableAI = () => {
    setAiEnabled(true)
    // TODO: Integrate with SOAP G Central Brain for AI assistance
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Building2 className="w-8 h-8 text-blue-600" />
              Mall Manager Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Comprehensive mall operations and AI-powered insights
            </p>
          </div>
          
          {!aiEnabled && (
            <Button 
              onClick={handleEnableAI}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Brain className="w-4 h-4 mr-2" />
              Enable AI Assistant
            </Button>
          )}
          
          {aiEnabled && (
            <Badge variant="secondary" className="bg-green-100 text-green-800 px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              AI Assistant Active
            </Badge>
          )}
        </div>

        {/* AI Features Notice */}
        {aiEnabled && (
          <Card className="mb-6 border-blue-200 bg-blue-50/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-blue-700">
                <Brain className="w-5 h-5" />
                <p className="font-medium">AI Assistant Integration Active</p>
              </div>
              <p className="text-sm text-blue-600 mt-1">
                Connected to SOAP G Central Brain for real-time insights, predictive analytics, 
                and automated coordination with Shopper Engagement and Social Media agents.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Daily Visitors</p>
                  <p className="text-2xl font-bold">1,240</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12% from yesterday
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Events</p>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-xs text-blue-600 mt-1">2 upcoming, 1 live</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenue Today</p>
                  <p className="text-2xl font-bold">$12,450</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +8% from last week
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
                  <p className="text-2xl font-bold">87%</p>
                  <p className="text-xs text-yellow-600 mt-1">3 units available</p>
                </div>
                <Building2 className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="events">Events & Invites</TabsTrigger>
            <TabsTrigger value="retailers">Retailer Coordination</TabsTrigger>
            <TabsTrigger value="qr-marketing">QR Marketing</TabsTrigger>
            <TabsTrigger value="traffic">Traffic Insights</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Upcoming Events & Group Invites
                </CardTitle>
                <CardDescription>
                  Manage mall events and coordinate with Invite to Shop activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.map(event => (
                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${
                          event.status === 'active' ? 'bg-green-500' :
                          event.status === 'planned' ? 'bg-blue-500' : 'bg-gray-500'
                        }`}></div>
                        <div>
                          <h3 className="font-medium">{event.title}</h3>
                          <p className="text-sm text-gray-600">{event.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">
                          {event.attendees} attendees
                        </Badge>
                        <Badge variant={
                          event.status === 'active' ? 'default' :
                          event.status === 'planned' ? 'secondary' : 'outline'
                        }>
                          {event.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {aiEnabled && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">AI Recommendations</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Consider hosting a "Local Business Discovery Day" to boost traffic</li>
                      <li>• Holiday Shopping Expo could benefit from early bird promotions</li>
                      <li>• Coordinate with Social Media AI for event promotion campaigns</li>
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="retailers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Retailer Coordination Hub
                </CardTitle>
                <CardDescription>
                  Manage tenant relationships and promotional opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Active Promotions</h3>
                    <div className="space-y-2">
                      <div className="p-3 border rounded flex justify-between items-center">
                        <span className="text-sm">Summer Sale - Fashion Zone</span>
                        <Badge variant="secondary">15% off</Badge>
                      </div>
                      <div className="p-3 border rounded flex justify-between items-center">
                        <span className="text-sm">Electronics Clearance</span>
                        <Badge variant="secondary">Up to 30% off</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Lease Renewals</h3>
                    <div className="space-y-2">
                      <div className="p-3 border rounded flex justify-between items-center">
                        <span className="text-sm">TechHub Electronics</span>
                        <Badge variant="outline">Due: Sept 2025</Badge>
                      </div>
                      <div className="p-3 border rounded flex justify-between items-center">
                        <span className="text-sm">City Fashion</span>
                        <Badge variant="outline">Due: Oct 2025</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="qr-marketing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="w-5 h-5" />
                  QR Code Marketing Hub
                </CardTitle>
                <CardDescription>
                  Create and track QR code campaigns for events, promotions, and mall activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Template-Based QR Generator */}
                  <MallQrCampaignTemplates 
                    ownerType="mall"
                    ownerId="mall-manager-001"
                  />
                  
                  {/* Divider */}
                  <div className="border-t border-purple-200 pt-6">
                    <h3 className="text-lg font-semibold text-purple-900 mb-4">Advanced QR Generator</h3>
                    <SpiralQRGenerator 
                      onQRGenerated={(qrData) => {
                        console.log('Advanced QR Generated:', qrData);
                      }}
                    />
                  </div>

                  {/* Divider */}
                  <div className="border-t border-purple-200 pt-6">
                    <h3 className="text-lg font-semibold text-purple-900 mb-4">Simple QR Generator</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <QRCodeGenerator 
                        retailerId="mall-manager-001"
                        defaultCampaign="Mall Event"
                        onGenerated={(qrData) => {
                          console.log('QR Generated:', qrData);
                        }}
                      />
                      
                      <div className="space-y-4">
                        <h4 className="font-medium text-purple-900">Custom Campaign Ideas</h4>
                        <div className="space-y-3">
                          <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                            <h5 className="font-medium text-purple-800 mb-1">Event Check-ins</h5>
                            <p className="text-sm text-purple-600">
                              Generate QR codes for mall events to track attendance and engagement
                            </p>
                          </div>
                          
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <h5 className="font-medium text-blue-800 mb-1">Directory Navigation</h5>
                            <p className="text-sm text-blue-600">
                              Place QR codes around the mall for instant store directory access
                            </p>
                          </div>
                          
                          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <h5 className="font-medium text-green-800 mb-1">Custom Promotions</h5>
                            <p className="text-sm text-green-600">
                              Create unique QR codes for one-off campaigns and special events
                            </p>
                          </div>
                        </div>
                        
                        {aiEnabled && (
                          <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg border border-purple-200">
                            <h5 className="font-medium text-purple-900 mb-2">AI Campaign Suggestions</h5>
                            <ul className="text-sm text-purple-700 space-y-1">
                              <li>• Generate QR codes with personalized landing pages for different customer segments</li>
                              <li>• Coordinate with Social Media AI for optimized campaign timing and targeting</li>
                              <li>• Auto-analyze scan patterns to recommend optimal QR placement locations</li>
                              <li>• Integrate with Shopper Engagement AI for follow-up messaging campaigns</li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="traffic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Traffic & Visitor Analytics
                </CardTitle>
                <CardDescription>
                  Real-time insights into mall traffic patterns and visitor behavior
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {trafficData.map((data, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{data.period}</span>
                        <div className={`flex items-center gap-1 text-sm ${
                          data.trend === 'up' ? 'text-green-600' :
                          data.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          <TrendingUp className={`w-3 h-3 ${
                            data.trend === 'down' ? 'rotate-180' : ''
                          }`} />
                          {data.percentage}%
                        </div>
                      </div>
                      <p className="text-xl font-bold">{data.visitors.toLocaleString()}</p>
                      <p className="text-xs text-gray-600">visitors</p>
                    </div>
                  ))}
                </div>
                
                {aiEnabled && (
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-2">AI Traffic Predictions</h4>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• Expected 15% increase in weekend traffic due to upcoming events</li>
                      <li>• Back-to-school season typically drives 25% more family visits</li>
                      <li>• Recommend extending operating hours during peak periods</li>
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Performance Analytics
                </CardTitle>
                <CardDescription>
                  Comprehensive performance metrics and business intelligence
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded">
                    <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">4.7</p>
                    <p className="text-xs text-gray-600">Average Rating</p>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <MapPin className="w-6 h-6 text-red-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">45</p>
                    <p className="text-xs text-gray-600">Active Stores</p>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <DollarSign className="w-6 h-6 text-green-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">$180K</p>
                    <p className="text-xs text-gray-600">Monthly Revenue</p>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">2.1K</p>
                    <p className="text-xs text-gray-600">Daily Avg. Visitors</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="operations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Operations Management
                </CardTitle>
                <CardDescription>
                  Daily operations, maintenance, and facility management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded">
                    <h4 className="font-medium mb-2">Facility Status</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>HVAC System</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Security</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span>Elevator 2</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Parking</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded">
                    <h4 className="font-medium mb-2">Upcoming Maintenance</h4>
                    <ul className="text-sm space-y-1">
                      <li>• HVAC filter replacement - August 15</li>
                      <li>• Elevator inspection - August 18</li>
                      <li>• Security system update - August 22</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}