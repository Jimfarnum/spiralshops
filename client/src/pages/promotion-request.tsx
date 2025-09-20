import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { useToast } from '../hooks/use-toast';
import { Calendar, DollarSign, Target, TrendingUp, AlertCircle } from 'lucide-react';

interface PromotionRequestForm {
  requesterType: string;
  requesterName: string;
  contactEmail: string;
  desired: {
    multiplier: number;
    startsAt: string;
    endsAt: string;
  };
  target: {
    categories: string[];
    storeIds: string[];
    mallIds: string[];
  };
  expectedGMV: number;
  sponsorCoveragePct: number;
  description: string;
}

export default function PromotionRequestPage() {
  const [form, setForm] = useState<PromotionRequestForm>({
    requesterType: '',
    requesterName: '',
    contactEmail: '',
    desired: {
      multiplier: 5,
      startsAt: '',
      endsAt: ''
    },
    target: {
      categories: [],
      storeIds: [],
      mallIds: []
    },
    expectedGMV: 0,
    sponsorCoveragePct: 0,
    description: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [requestStatus, setRequestStatus] = useState<any>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/partners/promotions/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        setRequestStatus(data.request);
        toast({
          title: 'Request Submitted Successfully',
          description: 'Your promotion request has been submitted for SPIRAL review.',
        });
      } else {
        throw new Error(data.error || 'Failed to submit request');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      toast({
        title: 'Submission Failed',
        description: 'Failed to submit promotion request. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-800">Request Submitted Successfully!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Your promotion request has been submitted to SPIRAL for review. 
                  We'll analyze your proposal using our AI valuation system.
                </p>
                <Badge className="bg-blue-100 text-blue-800">
                  Request ID: #{requestStatus?.id}
                </Badge>
              </div>

              {requestStatus?.valuation && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-3">AI Valuation Results</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-blue-600">Valuation Score</p>
                      <p className="font-semibold text-blue-800">{requestStatus.valuation.score}/100</p>
                    </div>
                    <div>
                      <p className="text-blue-600">Risk Assessment</p>
                      <Badge className={`${
                        requestStatus.valuation.risk === 'low' ? 'bg-green-100 text-green-800' :
                        requestStatus.valuation.risk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {requestStatus.valuation.risk.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-blue-700 bg-blue-100 p-2 rounded">
                    <p><strong>AI Analysis:</strong> {requestStatus.valuation.recommendations}</p>
                  </div>
                </div>
              )}

              <div className="text-center space-y-4">
                <div className="text-sm text-gray-600">
                  <p>📧 Check your email for updates on the review process</p>
                  <p>⏱️ Typical review time: 3-5 business days</p>
                  <p>📞 Questions? Contact our partnerships team</p>
                </div>
                <Button onClick={() => window.location.href = '/'} className="w-full">
                  Return to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Request a SPIRALS Promotion</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Partner with SPIRAL to create promotional campaigns that drive customer engagement and sales. 
            Our AI system will evaluate your proposal and provide instant feedback.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-6 w-6 text-blue-600 mr-2" />
              Promotion Request Form
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Requester Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Organization Type *</label>
                  <Select
                    value={form.requesterType}
                    onValueChange={(value) => setForm({...form, requesterType: value})}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select organization type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mall">Shopping Mall</SelectItem>
                      <SelectItem value="retailer">Retailer</SelectItem>
                      <SelectItem value="card_issuer">Credit Card Issuer</SelectItem>
                      <SelectItem value="other">Other Partner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Organization Name *</label>
                  <Input
                    value={form.requesterName}
                    onChange={(e) => setForm({...form, requesterName: e.target.value})}
                    placeholder="Your organization name"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Contact Email *</label>
                  <Input
                    type="email"
                    value={form.contactEmail}
                    onChange={(e) => setForm({...form, contactEmail: e.target.value})}
                    placeholder="partnerships@example.com"
                    required
                  />
                </div>
              </div>

              {/* Promotion Parameters */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                  Desired Promotion Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">SPIRALS Multiplier *</label>
                    <Select
                      value={form.desired.multiplier.toString()}
                      onValueChange={(value) => setForm({
                        ...form,
                        desired: {...form.desired, multiplier: parseInt(value)}
                      })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2x SPIRALS</SelectItem>
                        <SelectItem value="3">3x SPIRALS</SelectItem>
                        <SelectItem value="4">4x SPIRALS</SelectItem>
                        <SelectItem value="5">5x SPIRALS (Recommended)</SelectItem>
                        <SelectItem value="6">6x SPIRALS</SelectItem>
                        <SelectItem value="7">7x SPIRALS</SelectItem>
                        <SelectItem value="8">8x SPIRALS</SelectItem>
                        <SelectItem value="9">9x SPIRALS</SelectItem>
                        <SelectItem value="10">10x SPIRALS (Max)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Start Date *</label>
                    <Input
                      type="date"
                      value={form.desired.startsAt}
                      onChange={(e) => setForm({
                        ...form,
                        desired: {...form.desired, startsAt: e.target.value}
                      })}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">End Date *</label>
                    <Input
                      type="date"
                      value={form.desired.endsAt}
                      onChange={(e) => setForm({
                        ...form,
                        desired: {...form.desired, endsAt: e.target.value}
                      })}
                      min={form.desired.startsAt || new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Business Metrics */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                  Business Impact
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Expected GMV ($)</label>
                    <Input
                      type="number"
                      value={form.expectedGMV}
                      onChange={(e) => setForm({...form, expectedGMV: parseInt(e.target.value) || 0})}
                      placeholder="100000"
                      min="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">Total sales volume you expect during the promotion</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Sponsor Coverage (%)</label>
                    <Input
                      type="number"
                      value={form.sponsorCoveragePct}
                      onChange={(e) => setForm({...form, sponsorCoveragePct: parseInt(e.target.value) || 0})}
                      placeholder="25"
                      min="0"
                      max="100"
                    />
                    <p className="text-xs text-gray-500 mt-1">% of promotion cost your organization will fund</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="border-t pt-6">
                <label className="block text-sm font-medium mb-1">Campaign Description</label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                  placeholder="Describe your promotional campaign goals, target audience, and expected outcomes..."
                  rows={4}
                />
              </div>

              {/* Important Notice */}
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-blue-800 mb-1">AI-Powered Review Process</p>
                    <p className="text-blue-700">
                      Your request will be automatically evaluated using our AI valuation system that considers 
                      business impact, platform costs, targeting efficiency, and risk factors. 
                      SPIRAL maintains full approval authority for all promotional campaigns.
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={submitting || !form.requesterType || !form.requesterName || !form.contactEmail}
                className="w-full"
                size="lg"
              >
                {submitting ? 'Submitting Request...' : 'Submit Promotion Request'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}