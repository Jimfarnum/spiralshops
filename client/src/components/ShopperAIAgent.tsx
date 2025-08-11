import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { 
  ShoppingBag, Heart, MapPin, Zap, Brain, Search, 
  Gift, Percent, Bell, Camera, MessageCircle, 
  Star, Trophy, Compass, Clock, Wallet
} from 'lucide-react'

interface ShopperAIAgentProps {
  shopperId?: string;
}

export default function ShopperAIAgent({ shopperId = "shopper-001" }: ShopperAIAgentProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [aiActive, setAiActive] = useState(false)
  const [budget, setBudget] = useState([500])
  const [location, setLocation] = useState('Minneapolis, MN')
  const [shopperData, setShopperData] = useState({
    spiralBalance: 0,
    wishlistItems: 0,
    recentPurchases: 0,
    loyaltyLevel: 'Gold',
    savedAmount: 0
  })

  // AI Service Options for Shoppers
  const aiServiceOptions = [
    // Smart Shopping
    { id: 'find-deals', label: 'Find the best deals and discounts for items I want', category: 'Smart Shopping', benefit: 'Save 20-40%' },
    { id: 'price-monitoring', label: 'Monitor prices and alert me when items go on sale', category: 'Smart Shopping', benefit: 'Never miss sales' },
    { id: 'budget-management', label: 'Help me stick to my shopping budget', category: 'Smart Shopping', benefit: 'Budget control' },
    { id: 'bulk-opportunities', label: 'Find bulk buying opportunities to save money', category: 'Smart Shopping', benefit: 'Bulk savings' },
    { id: 'coupon-stacking', label: 'Stack coupons and promotions for maximum savings', category: 'Smart Shopping', benefit: 'Extra savings' },

    // Product Discovery
    { id: 'visual-search', label: 'Find products by taking photos or describing what I want', category: 'Product Discovery', benefit: 'Easy finding' },
    { id: 'personalized-recommendations', label: 'Get personalized product recommendations', category: 'Product Discovery', benefit: 'Perfect matches' },
    { id: 'trend-alerts', label: 'Alert me about trending products in my interests', category: 'Product Discovery', benefit: 'Stay trendy' },
    { id: 'alternative-suggestions', label: 'Suggest similar but cheaper alternatives', category: 'Product Discovery', benefit: 'Save money' },
    { id: 'gift-finder', label: 'Help me find perfect gifts for friends and family', category: 'Product Discovery', benefit: 'Great gifts' },

    // Shopping Optimization
    { id: 'route-planning', label: 'Plan efficient shopping routes to save time', category: 'Shopping Optimization', benefit: 'Save time' },
    { id: 'store-availability', label: 'Check product availability before I go shopping', category: 'Shopping Optimization', benefit: 'No wasted trips' },
    { id: 'pickup-scheduling', label: 'Schedule pickup times that work with my schedule', category: 'Shopping Optimization', benefit: 'Convenience' },
    { id: 'delivery-optimization', label: 'Optimize delivery times and costs', category: 'Shopping Optimization', benefit: 'Best delivery' },
    { id: 'queue-management', label: 'Help me avoid long lines and busy times', category: 'Shopping Optimization', benefit: 'Skip crowds' },

    // Loyalty & Rewards
    { id: 'spiral-optimization', label: 'Maximize my SPIRAL rewards and redemptions', category: 'Loyalty & Rewards', benefit: 'More rewards' },
    { id: 'cashback-tracking', label: 'Track all my cashback and rewards across platforms', category: 'Loyalty & Rewards', benefit: 'Track earnings' },
    { id: 'loyalty-stacking', label: 'Stack multiple loyalty programs for better rewards', category: 'Loyalty & Rewards', benefit: 'Multiple rewards' },
    { id: 'reward-reminders', label: 'Remind me to use expiring rewards and points', category: 'Loyalty & Rewards', benefit: 'No waste' },

    // Communication & Support
    { id: 'customer-service', label: 'Handle customer service issues and returns for me', category: 'Communication & Support', benefit: 'No hassle' },
    { id: 'order-tracking', label: 'Track all my orders and notify me of updates', category: 'Communication & Support', benefit: 'Stay informed' },
    { id: 'review-management', label: 'Help me write reviews and rate my purchases', category: 'Communication & Support', benefit: 'Easy reviews' },
    { id: 'social-sharing', label: 'Share my great finds with friends for referral bonuses', category: 'Communication & Support', benefit: 'Earn bonuses' }
  ]

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    )
  }

  const activateAI = async () => {
    setAiActive(true)
    // Send selected services to AI agent
    try {
      await fetch('/api/shopper-ai-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shopperId,
          services: selectedServices,
          budget: budget[0],
          location,
          preferences: {
            loyaltyLevel: shopperData.loyaltyLevel,
            priorityServices: selectedServices.slice(0, 5)
          },
          timestamp: Date.now()
        })
      })
    } catch (error) {
      console.error('Failed to activate shopper AI:', error)
    }
  }

  useEffect(() => {
    // Load shopper data
    setShopperData({
      spiralBalance: 127.50,
      wishlistItems: 23,
      recentPurchases: 8,
      loyaltyLevel: 'Gold',
      savedAmount: 2840
    })
  }, [])

  const getBenefitColor = (benefit: string) => {
    if (benefit.includes('Save') || benefit.includes('savings')) return 'bg-green-100 text-green-800 border-green-300'
    if (benefit.includes('Easy') || benefit.includes('convenience')) return 'bg-blue-100 text-blue-800 border-blue-300'
    if (benefit.includes('rewards') || benefit.includes('bonus')) return 'bg-purple-100 text-purple-800 border-purple-300'
    return 'bg-orange-100 text-orange-800 border-orange-300'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Personal Shopping AI</h1>
            <p className="text-gray-600">Smart shopping assistant for {location}</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="text-purple-700 border-purple-300">
              <Star className="w-4 h-4 mr-1" />
              {shopperData.loyaltyLevel} Member
            </Badge>
            <Button 
              onClick={activateAI}
              disabled={selectedServices.length === 0}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Brain className="w-4 h-4 mr-2" />
              Activate AI Shopping Assistant ({selectedServices.length})
            </Button>
          </div>
        </div>

        {/* Shopping Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">SPIRAL Balance</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${shopperData.spiralBalance}</div>
              <p className="text-xs text-muted-foreground">Available rewards</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wishlist Items</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{shopperData.wishlistItems}</div>
              <p className="text-xs text-muted-foreground">Items watching</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Purchases</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{shopperData.recentPurchases}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Saved</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${shopperData.savedAmount}</div>
              <p className="text-xs text-muted-foreground">With SPIRAL</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loyalty Level</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{shopperData.loyaltyLevel}</div>
              <p className="text-xs text-muted-foreground">Premium benefits</p>
            </CardContent>
          </Card>
        </div>

        {/* Shopping Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Shopping Preferences</CardTitle>
            <CardDescription>Help AI understand your shopping style</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Monthly Budget</label>
                <div className="px-3">
                  <Slider
                    value={budget}
                    onValueChange={setBudget}
                    max={2000}
                    min={100}
                    step={50}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>$100</span>
                    <span className="font-medium">${budget[0]}</span>
                    <span>$2000</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Primary Location</label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Your city, state"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Shopping Priority</label>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Best Deals</Button>
                  <Button variant="outline" size="sm">Speed</Button>
                  <Button variant="outline" size="sm">Quality</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="ai-services" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="ai-services">AI Services</TabsTrigger>
            <TabsTrigger value="quick-help">Quick Help</TabsTrigger>
            <TabsTrigger value="savings-tracker">Savings Tracker</TabsTrigger>
            <TabsTrigger value="shopping-benefits">Shopping Benefits</TabsTrigger>
          </TabsList>

          {/* AI Services Tab */}
          <TabsContent value="ai-services" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-purple-600" />
                  Personal Shopping AI Services
                </CardTitle>
                <CardDescription>
                  Select the shopping tasks you'd like AI help with. Your personal shopping assistant will work 
                  behind the scenes to save you time and money on every purchase.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {Object.entries(
                    aiServiceOptions.reduce((acc, service) => {
                      if (!acc[service.category]) acc[service.category] = []
                      acc[service.category].push(service)
                      return acc
                    }, {} as Record<string, typeof aiServiceOptions>)
                  ).map(([category, services]) => (
                    <div key={category} className="space-y-3">
                      <h3 className="font-semibold text-gray-800 border-b pb-2 flex items-center">
                        {category === 'Smart Shopping' && <Percent className="w-4 h-4 mr-2" />}
                        {category === 'Product Discovery' && <Search className="w-4 h-4 mr-2" />}
                        {category === 'Shopping Optimization' && <Compass className="w-4 h-4 mr-2" />}
                        {category === 'Loyalty & Rewards' && <Gift className="w-4 h-4 mr-2" />}
                        {category === 'Communication & Support' && <MessageCircle className="w-4 h-4 mr-2" />}
                        {category}
                      </h3>
                      <div className="space-y-2">
                        {services.map((service) => (
                          <div key={service.id} className="flex items-start space-x-2 p-3 hover:bg-gray-50 rounded-lg border">
                            <Checkbox
                              id={service.id}
                              checked={selectedServices.includes(service.id)}
                              onCheckedChange={() => handleServiceToggle(service.id)}
                              className="mt-0.5"
                            />
                            <div className="flex-1">
                              <label
                                htmlFor={service.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                              >
                                {service.label}
                              </label>
                              <Badge 
                                className={`ml-2 text-xs ${getBenefitColor(service.benefit)}`}
                                variant="outline"
                              >
                                {service.benefit}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {selectedServices.length > 0 && (
                  <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-900 mb-2">
                      Selected AI Services ({selectedServices.length})
                    </h4>
                    <p className="text-sm text-purple-700 mb-3">
                      Your AI shopping assistant will start working on these services immediately. 
                      You'll receive personalized shopping insights and alerts within minutes.
                    </p>
                    <div className="flex space-x-3">
                      <Button 
                        onClick={activateAI}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Brain className="w-4 h-4 mr-2" />
                        Start AI Assistant
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setSelectedServices([])}
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>
                )}

                {aiActive && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center text-green-800 mb-3">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                      Your AI Shopping Assistant is now active...
                    </div>
                    <div className="space-y-2 text-sm text-green-700">
                      <div>✓ Analyzing your shopping preferences and history</div>
                      <div>⏳ Setting up personalized deal alerts</div>
                      <div>⏳ Optimizing your wishlist for savings opportunities</div>
                      <div>⏳ Preparing smart shopping recommendations</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quick Help Tab */}
          <TabsContent value="quick-help" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Instant Shopping Help</CardTitle>
                  <CardDescription>Get immediate AI assistance with these common tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => {
                      setSelectedServices(['visual-search'])
                      activateAI()
                    }}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Find products from photos I take
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => {
                      setSelectedServices(['find-deals'])
                      activateAI()
                    }}
                  >
                    <Percent className="w-4 h-4 mr-2" />
                    Find best deals on my wishlist
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => {
                      setSelectedServices(['route-planning'])
                      activateAI()
                    }}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Plan my shopping trip route
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => {
                      setSelectedServices(['gift-finder'])
                      activateAI()
                    }}
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    Help me find the perfect gift
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Smart Alerts</CardTitle>
                  <CardDescription>AI-powered notifications for better shopping</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { title: 'Price drop alert: Winter Jacket (30% off)', time: '2 min ago', type: 'deal' },
                    { title: 'Back in stock: Nike Air Max in your size', time: '15 min ago', type: 'availability' },
                    { title: 'Budget alert: 75% of monthly budget used', time: '1 hour ago', type: 'budget' },
                    { title: 'SPIRAL rewards expiring in 3 days', time: '2 hours ago', type: 'rewards' }
                  ].map((alert, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                      <Bell className="w-4 h-4 mt-0.5 text-purple-600" />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{alert.title}</h4>
                        <p className="text-xs text-gray-600">{alert.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Savings Tracker Tab */}
          <TabsContent value="savings-tracker" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Savings with SPIRAL AI</CardTitle>
                <CardDescription>Track how much you're saving with intelligent shopping assistance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">$2,840</div>
                    <p className="text-sm text-green-700">Total Saved</p>
                    <p className="text-xs text-gray-600">Since joining SPIRAL</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">$320</div>
                    <p className="text-sm text-blue-700">This Month</p>
                    <p className="text-xs text-gray-600">AI-found savings</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">$127.50</div>
                    <p className="text-sm text-purple-700">SPIRAL Rewards</p>
                    <p className="text-xs text-gray-600">Available balance</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">18 hrs</div>
                    <p className="text-sm text-orange-700">Time Saved</p>
                    <p className="text-xs text-gray-600">This month</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Recent AI Savings</h3>
                  {[
                    { item: 'Winter Boots', originalPrice: 159, paidPrice: 89, saved: 70, method: 'Price match + coupon stack' },
                    { item: 'Coffee Maker', originalPrice: 245, paidPrice: 180, saved: 65, method: 'Bulk discount + rewards' },
                    { item: 'Phone Case', originalPrice: 29, paidPrice: 12, saved: 17, method: 'Alternative brand suggestion' },
                    { item: 'Workout Gear', originalPrice: 120, paidPrice: 85, saved: 35, method: 'Seasonal promotion alert' }
                  ].map((saving, index) => (
                    <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{saving.item}</h4>
                        <p className="text-sm text-gray-600">{saving.method}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">${saving.saved} saved</div>
                        <p className="text-sm text-gray-600">
                          <span className="line-through">${saving.originalPrice}</span> → ${saving.paidPrice}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shopping Benefits Tab */}
          <TabsContent value="shopping-benefits" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Why SPIRAL Shopping AI Changes Everything</CardTitle>
                <CardDescription>See how intelligent shopping assistance revolutionizes your experience</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Before SPIRAL AI</h3>
                    <div className="space-y-3">
                      {[
                        { issue: 'Missed 70% of available deals', impact: 'Overpaid $200+ monthly' },
                        { issue: 'Spent 8 hours weekly comparing prices', impact: 'Wasted time researching' },
                        { issue: 'Forgot to use rewards and coupons', impact: 'Lost $50+ in savings monthly' },
                        { issue: 'Bought impulse purchases', impact: 'Budget overruns 40% of time' },
                        { issue: 'No coordination between stores', impact: 'Made unnecessary trips' }
                      ].map((before, index) => (
                        <div key={index} className="p-3 bg-red-50 rounded-lg border border-red-200">
                          <h4 className="text-sm font-medium text-red-900">{before.issue}</h4>
                          <p className="text-xs text-red-700">{before.impact}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">With SPIRAL AI</h3>
                    <div className="space-y-3">
                      {[
                        { benefit: 'Automatically finds 95% of available deals', impact: 'Saves $320+ monthly' },
                        { benefit: 'AI handles all price comparisons', impact: 'Saves 6+ hours weekly' },
                        { benefit: 'Never miss rewards or coupons again', impact: 'Maximizes all savings' },
                        { benefit: 'Smart budget alerts and suggestions', impact: 'Stays on budget 90% of time' },
                        { benefit: 'Optimized multi-store shopping routes', impact: 'Efficient single trips' }
                      ].map((after, index) => (
                        <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
                          <h4 className="text-sm font-medium text-green-900">{after.benefit}</h4>
                          <p className="text-xs text-green-700">{after.impact}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <h3 className="font-semibold text-purple-900 mb-4 text-center">Your Shopping Success Story</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div>
                      <div className="text-3xl font-bold text-purple-600">$2,840</div>
                      <p className="text-sm text-purple-700">Total Saved</p>
                      <p className="text-xs text-gray-600">In 6 months</p>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-purple-600">47%</div>
                      <p className="text-sm text-purple-700">Average Savings</p>
                      <p className="text-xs text-gray-600">Per purchase</p>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-purple-600">24hrs</div>
                      <p className="text-sm text-purple-700">Time Saved</p>
                      <p className="text-xs text-gray-600">Every month</p>
                    </div>
                  </div>
                  <p className="text-center text-sm text-purple-700 mt-4">
                    "SPIRAL AI has completely transformed how I shop. I save money, time, and never miss a great deal!"
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}