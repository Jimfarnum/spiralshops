import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Users, Zap, Star, TrendingUp } from 'lucide-react';

export default function BetaProgram() {
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    businessType: '',
    annualRevenue: '',
    city: '',
    state: '',
    zipCode: '',
    yearsInBusiness: '',
    currentOnlinePresence: false,
    techComfortLevel: '',
    availableForTesting: false,
    timeCommitment: '',
    feedbackWillingness: false,
    motivation: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const applicationData = {
      businessName: formData.businessName,
      ownerName: formData.ownerName,
      email: formData.email,
      phone: formData.phone,
      businessType: formData.businessType,
      annualRevenue: formData.annualRevenue,
      location: {
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode
      },
      experience: {
        yearsInBusiness: parseInt(formData.yearsInBusiness),
        currentOnlinePresence: formData.currentOnlinePresence,
        techComfortLevel: formData.techComfortLevel
      },
      commitment: {
        availableForTesting: formData.availableForTesting,
        timeCommitment: formData.timeCommitment,
        feedbackWillingness: formData.feedbackWillingness
      },
      motivation: formData.motivation
    };

    try {
      const response = await fetch('/api/beta/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });

      const result = await response.json();
      
      if (result.success) {
        setApplicationId(result.applicationId);
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-800">Application Submitted!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-700">
                Thank you for applying to the SPIRAL Beta Testing Program. Your application has been received and assigned ID:
              </p>
              <Badge variant="outline" className="text-lg px-4 py-2 font-mono">
                {applicationId}
              </Badge>
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold text-gray-800 mb-2">What happens next?</h3>
                <ul className="text-left space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    Application review within 24-48 hours
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    Selection notification via email
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-500" />
                    Onboarding call scheduling for selected retailers
                  </li>
                </ul>
              </div>
              <Button onClick={() => window.location.href = '/'} className="mt-6">
                Return to Homepage
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            SPIRAL Beta Testing Program
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join 20 select retailers to help us perfect the platform that's saving Main Street. 
            Get exclusive early access and shape the future of local commerce.
          </p>
        </div>

        {/* Benefits Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <Star className="w-8 h-8 text-blue-600 mb-2" />
              <CardTitle className="text-lg">Premium Features</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 text-sm">
                6 months of advanced analytics, AI insights, and priority support completely free.
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <TrendingUp className="w-8 h-8 text-green-600 mb-2" />
              <CardTitle className="text-lg">Early Success</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 text-sm">
                Beta founder recognition, marketing collaboration, and 50% reduced fees.
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <Users className="w-8 h-8 text-purple-600 mb-2" />
              <CardTitle className="text-lg">Shape the Future</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 text-sm">
                Direct input on platform development and advisory board invitation.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Application Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Beta Program Application</CardTitle>
            <p className="text-gray-600">
              Help us select the perfect mix of retailers for our beta testing program.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Business Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                    placeholder="Your Amazing Store"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="ownerName">Owner Name *</Label>
                  <Input
                    id="ownerName"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                    placeholder="Your Full Name"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="you@yourbusiness.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessType">Business Category *</Label>
                  <Select value={formData.businessType} onValueChange={(value) => setFormData({...formData, businessType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Fashion">Fashion</SelectItem>
                      <SelectItem value="Food">Food & Dining</SelectItem>
                      <SelectItem value="Health">Health & Beauty</SelectItem>
                      <SelectItem value="Home">Home & Lifestyle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="annualRevenue">Annual Revenue *</Label>
                  <Select value={formData.annualRevenue} onValueChange={(value) => setFormData({...formData, annualRevenue: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Under $50K">Under $50K</SelectItem>
                      <SelectItem value="$50K-$100K">$50K-$100K</SelectItem>
                      <SelectItem value="$100K-$500K">$100K-$500K</SelectItem>
                      <SelectItem value="Over $500K">Over $500K</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Location */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    placeholder="Your City"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    placeholder="CA"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code *</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                    placeholder="12345"
                    required
                  />
                </div>
              </div>

              {/* Experience */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="yearsInBusiness">Years in Business *</Label>
                  <Input
                    id="yearsInBusiness"
                    type="number"
                    value={formData.yearsInBusiness}
                    onChange={(e) => setFormData({...formData, yearsInBusiness: e.target.value})}
                    placeholder="5"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="techComfortLevel">Tech Comfort Level *</Label>
                  <Select value={formData.techComfortLevel} onValueChange={(value) => setFormData({...formData, techComfortLevel: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Commitment */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="currentOnlinePresence"
                    checked={formData.currentOnlinePresence}
                    onCheckedChange={(checked) => setFormData({...formData, currentOnlinePresence: !!checked})}
                  />
                  <Label htmlFor="currentOnlinePresence">I currently have an online presence (website, social media, etc.)</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="availableForTesting"
                    checked={formData.availableForTesting}
                    onCheckedChange={(checked) => setFormData({...formData, availableForTesting: !!checked})}
                  />
                  <Label htmlFor="availableForTesting">I am available for 2 weeks of beta testing *</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="feedbackWillingness"
                    checked={formData.feedbackWillingness}
                    onCheckedChange={(checked) => setFormData({...formData, feedbackWillingness: !!checked})}
                  />
                  <Label htmlFor="feedbackWillingness">I am willing to provide detailed feedback *</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="timeCommitment">Time Commitment *</Label>
                <Select value={formData.timeCommitment} onValueChange={(value) => setFormData({...formData, timeCommitment: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time commitment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5-10 hours">5-10 hours over 2 weeks</SelectItem>
                    <SelectItem value="10-20 hours">10-20 hours over 2 weeks</SelectItem>
                    <SelectItem value="20+ hours">20+ hours over 2 weeks</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="motivation">Why do you want to join the SPIRAL beta program? *</Label>
                <Textarea
                  id="motivation"
                  value={formData.motivation}
                  onChange={(e) => setFormData({...formData, motivation: e.target.value})}
                  placeholder="Tell us about your business goals, challenges with current systems, and how you think SPIRAL could help your business grow..."
                  rows={4}
                  required
                />
              </div>

              <Button type="submit" className="w-full text-lg py-6">
                Submit Beta Application
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}