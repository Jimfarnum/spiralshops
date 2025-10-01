import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../client/src/components/ui/card';
import { Badge } from '../../../client/src/components/ui/badge';
import { Button } from '../../../client/src/components/ui/button';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  Smartphone, 
  Award, 
  DollarSign,
  ArrowRight,
  CheckCircle,
  Target,
  Zap
} from 'lucide-react';

interface WhyJoinSpiralProps {
  onGetStarted?: () => void;
  className?: string;
}

export default function WhyJoinSpiral({ onGetStarted, className = '' }: WhyJoinSpiralProps) {
  const benefits = [
    {
      icon: <TrendingUp className="h-8 w-8 text-teal-600" />,
      title: 'Increase Revenue',
      description: 'Join a thriving marketplace with over 50,000+ active shoppers looking for local products and services.',
      stats: 'Average 35% revenue increase',
      highlight: true
    },
    {
      icon: <Users className="h-8 w-8 text-orange-600" />,
      title: 'Expand Customer Base',
      description: 'Reach new customers beyond your local area through our advanced discovery and recommendation engine.',
      stats: '2.5x more customer reach',
      highlight: false
    },
    {
      icon: <Smartphone className="h-8 w-8 text-blue-600" />,
      title: 'Mobile-First Platform',
      description: 'Your products will be featured on our mobile app used by thousands of shoppers daily.',
      stats: '78% mobile user base',
      highlight: false
    },
    {
      icon: <Award className="h-8 w-8 text-purple-600" />,
      title: 'SPIRAL Loyalty Program',
      description: 'Customers earn SPIRALs (loyalty points) when shopping with you, encouraging repeat purchases.',
      stats: '40% higher retention',
      highlight: true
    },
    {
      icon: <DollarSign className="h-8 w-8 text-green-600" />,
      title: 'Competitive Fees',
      description: 'Low transaction fees with no monthly subscription costs. You only pay when you sell.',
      stats: 'Starting at 2.9% + $0.30',
      highlight: false
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-600" />,
      title: 'AI-Powered Tools',
      description: 'Automated inventory management, smart pricing recommendations, and customer insights.',
      stats: 'Save 10+ hours/week',
      highlight: true
    }
  ];

  const features = [
    'Easy product listing and inventory management',
    'Integrated payment processing',
    'Real-time order notifications',
    'Customer review system',
    'Analytics and sales reporting',
    'Marketing and promotional tools',
    'Multi-channel selling (online + in-store)',
    'Dedicated merchant support'
  ];

  const successStories = [
    {
      name: 'Downtown Books & Coffee',
      location: 'Portland, OR',
      achievement: '150% online sales increase',
      quote: 'SPIRAL helped us reach customers we never could have found otherwise.'
    },
    {
      name: 'Artisan Jewelry Co.',
      location: 'Austin, TX',
      achievement: '300+ new customers',
      quote: 'The loyalty program brings customers back again and again.'
    },
    {
      name: 'Local Farm Fresh',
      location: 'Denver, CO',
      achievement: '$50K additional revenue',
      quote: 'Mobile ordering transformed our business during the pandemic.'
    }
  ];

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          Why Join <span className="text-teal-600">SPIRAL</span>?
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Transform your local business into a digital powerhouse. Join thousands of successful retailers 
          who are thriving on the SPIRAL marketplace.
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          <Badge variant="secondary" className="text-sm">
            <CheckCircle className="w-4 h-4 mr-1" />
            No Setup Fees
          </Badge>
          <Badge variant="secondary" className="text-sm">
            <CheckCircle className="w-4 h-4 mr-1" />
            Quick Approval
          </Badge>
          <Badge variant="secondary" className="text-sm">
            <CheckCircle className="w-4 h-4 mr-1" />
            Full Support
          </Badge>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {benefits.map((benefit, index) => (
          <Card 
            key={index} 
            className={`transition-all duration-300 hover:shadow-lg ${
              benefit.highlight ? 'ring-2 ring-teal-500 ring-opacity-20' : ''
            }`}
          >
            <CardHeader className="text-center">
              <div className="flex justify-center mb-3">
                {benefit.icon}
              </div>
              <CardTitle className="text-lg">{benefit.title}</CardTitle>
              {benefit.highlight && (
                <Badge className="w-fit mx-auto bg-teal-600">Most Popular</Badge>
              )}
            </CardHeader>
            <CardContent className="text-center space-y-3">
              <CardDescription className="text-sm">
                {benefit.description}
              </CardDescription>
              <div className="font-semibold text-teal-600 text-sm">
                {benefit.stats}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Features List */}
      <Card className="bg-gradient-to-br from-teal-50 to-blue-50">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Target className="h-6 w-6 text-teal-600" />
            Everything You Need to Succeed
          </CardTitle>
          <CardDescription>
            Our comprehensive platform provides all the tools to grow your business
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Success Stories */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Success Stories</h2>
          <p className="text-gray-600 mt-2">See how other local businesses are thriving with SPIRAL</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {successStories.map((story, index) => (
            <Card key={index} className="bg-white border-l-4 border-l-teal-500">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{story.name}</h3>
                    <p className="text-sm text-gray-500">{story.location}</p>
                  </div>
                  <div className="bg-teal-50 p-3 rounded">
                    <p className="font-medium text-teal-800">{story.achievement}</p>
                  </div>
                  <blockquote className="text-sm text-gray-600 italic">
                    "{story.quote}"
                  </blockquote>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-lg p-8 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
        <p className="text-xl mb-6 opacity-90">
          Join SPIRAL today and start reaching more customers tomorrow
        </p>
        <div className="space-y-4">
          <Button 
            size="lg" 
            className="bg-white text-teal-600 hover:bg-gray-100"
            onClick={onGetStarted}
          >
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <div className="text-sm opacity-80">
            Free to join • Quick approval • Dedicated support
          </div>
        </div>
      </div>

      {/* FAQ Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">How much does it cost?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              SPIRAL is free to join with no monthly fees. We only charge a small transaction fee 
              when you make a sale (starting at 2.9% + $0.30).
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">How quickly can I start selling?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Most merchants are approved and selling within 24-48 hours. Our streamlined 
              onboarding process gets you up and running fast.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}