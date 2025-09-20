import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { 
  Bell, 
  RotateCcw, 
  Package, 
  Globe, 
  Zap, 
  CheckCircle,
  ArrowRight,
  Star
} from 'lucide-react';

export default function Phase11Demo() {
  const phase11Features = [
    {
      id: 'notifications',
      title: 'Email & SMS Notifications',
      description: 'Comprehensive notification center with email, SMS, and push notifications for orders, inventory, and SPIRAL rewards.',
      route: '/notifications',
      icon: Bell,
      status: 'complete',
      highlights: [
        'Real-time order status updates',
        'Low inventory alerts',
        'SPIRAL points notifications',
        'Customizable notification preferences'
      ]
    },
    {
      id: 'returns',
      title: 'Returns & Refunds Flow',
      description: 'Complete returns management system with easy return requests, tracking, and multiple refund options.',
      route: '/returns',
      icon: RotateCcw,
      status: 'complete',
      highlights: [
        '30-day return policy',
        'Free return shipping',
        'Multiple refund methods',
        'Return status tracking'
      ]
    },
    {
      id: 'tracking',
      title: 'Shipping ETA & Tracking',
      description: 'Advanced package tracking with real-time updates, delivery estimates, and carrier integration.',
      route: '/tracking',
      icon: Package,
      status: 'complete',
      highlights: [
        'Real-time tracking updates',
        'Delivery time estimates',
        'Multiple carrier support',
        'Package timeline view'
      ]
    },
    {
      id: 'language',
      title: 'Multi-Language Support',
      description: 'Full internationalization with English/Spanish support, auto-detection, and cultural adaptation.',
      route: '/language-demo',
      icon: Globe,
      status: 'complete',
      highlights: [
        'Auto-language detection',
        '95% Spanish translation',
        'Cultural adaptation',
        'Persistent preferences'
      ]
    },
    {
      id: 'performance',
      title: 'Performance Optimization',
      description: 'Advanced performance monitoring with Lighthouse audits, real-time metrics, and optimization insights.',
      route: '/performance-optimization-demo',
      icon: Zap,
      status: 'complete',
      highlights: [
        'Real-time performance metrics',
        'Lighthouse audit integration',
        'Optimization recommendations',
        'Mobile performance tracking'
      ]
    }
  ];

  const completedFeatures = phase11Features.filter(f => f.status === 'complete').length;
  const completionPercentage = Math.round((completedFeatures / phase11Features.length) * 100);

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[var(--spiral-navy)] mb-4">
              SPIRAL Phase 11 Implementation
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
              Advanced customer experience features including notifications, returns management, 
              shipping tracking, multi-language support, and performance optimization.
            </p>
            
            {/* Progress Summary */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">
                <CheckCircle className="mr-2 h-5 w-5" />
                {completionPercentage}% Complete
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 text-lg px-4 py-2">
                <Star className="mr-2 h-5 w-5" />
                {completedFeatures}/{phase11Features.length} Features Ready
              </Badge>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {phase11Features.map((feature) => {
              const IconComponent = feature.icon;
              
              return (
                <Card key={feature.id} className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <IconComponent className="h-8 w-8 text-[var(--spiral-coral)]" />
                      <Badge className={
                        feature.status === 'complete' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }>
                        {feature.status === 'complete' ? 'Ready' : 'In Progress'}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      <h4 className="font-medium text-[var(--spiral-navy)]">Key Features:</h4>
                      <ul className="space-y-1">
                        {feature.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Link href={feature.route}>
                      <Button className="w-full bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90">
                        Explore Feature
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Implementation Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Phase 11 Implementation Summary</CardTitle>
              <CardDescription>
                Complete implementation of advanced customer experience features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[var(--spiral-coral)] mb-2">5</div>
                  <div className="text-sm text-gray-600">Major Features</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[var(--spiral-coral)] mb-2">15+</div>
                  <div className="text-sm text-gray-600">New Components</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[var(--spiral-coral)] mb-2">95%</div>
                  <div className="text-sm text-gray-600">Multi-Language</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[var(--spiral-coral)] mb-2">A+</div>
                  <div className="text-sm text-gray-600">Performance Score</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Navigation */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Access</CardTitle>
              <CardDescription>
                Direct links to all Phase 11 features and demonstrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {phase11Features.map((feature) => (
                  <Link key={feature.id} href={feature.route}>
                    <Button variant="outline" className="w-full h-auto p-3 text-xs">
                      <feature.icon className="h-4 w-4 mb-1" />
                      {feature.title.split(' ')[0]}
                    </Button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}