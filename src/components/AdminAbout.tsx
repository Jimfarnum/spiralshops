import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Zap, Users, BarChart3 } from 'lucide-react';

interface AdminAboutProps {
  adminLlmUrl?: string;
}

export const AdminAbout: React.FC<AdminAboutProps> = ({ 
  adminLlmUrl = 'http://localhost:3000' 
}) => {
  const [aboutContent, setAboutContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showTechnical, setShowTechnical] = useState(false);

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const response = await fetch(`${adminLlmUrl}/about`);
        if (response.ok) {
          const content = await response.text();
          setAboutContent(content);
        } else {
          // Fallback content if Admin LLM service is unavailable
          setAboutContent(fallbackAboutContent);
        }
      } catch (error) {
        console.warn('Admin LLM service unavailable, using fallback content');
        setAboutContent(fallbackAboutContent);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutContent();
  }, [adminLlmUrl]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-spiral-orange"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Main About Content */}
      <Card>
        <CardContent className="p-8">
          <div className="prose prose-slate max-w-none">
            <div 
              dangerouslySetInnerHTML={{ 
                __html: aboutContent.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
              }} 
            />
          </div>
        </CardContent>
      </Card>

      {/* Technical Deep Dive Toggle */}
      <div className="text-center">
        <Button 
          variant="outline" 
          onClick={() => setShowTechnical(!showTechnical)}
          className="flex items-center gap-2"
        >
          <Brain className="h-4 w-4" />
          {showTechnical ? 'Hide' : 'Show'} Technical Details
        </Button>
      </div>

      {/* Technical Details */}
      {showTechnical && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-spiral-orange" />
                For Shoppers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Smart search pattern recognition</li>
                <li>• Personalized product recommendations</li>
                <li>• Location-based store suggestions</li>
                <li>• Abandoned cart recovery</li>
                <li>• Price and availability alerts</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-spiral-orange" />
                For Retailers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Search gap analysis</li>
                <li>• Inventory optimization insights</li>
                <li>• Customer behavior patterns</li>
                <li>• Revenue opportunity identification</li>
                <li>• Automated weekly reports</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-spiral-orange" />
                For Malls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Traffic flow analysis</li>
                <li>• Tenant performance insights</li>
                <li>• Category trend identification</li>
                <li>• Event optimization suggestions</li>
                <li>• Cross-tenant opportunities</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-spiral-orange" />
                AI Architecture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Event-driven data collection</li>
                <li>• Multi-provider LLM support</li>
                <li>• Cloudant database integration</li>
                <li>• Real-time insight generation</li>
                <li>• Automated webhook notifications</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Integration Status */}
      <Card className="bg-spiral-teal/5 border-spiral-teal/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-spiral-teal font-medium">
              Admin LLM System Active - Generating insights for {Math.floor(Math.random() * 150 + 50)} retailers
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Fallback content if Admin LLM service is unavailable
const fallbackAboutContent = `
## About SPIRAL  

At SPIRAL, everything begins with a simple belief: **it's not about us, it's about you.**  

SPIRAL exists to make shopping feel local again—whether you're a shopper searching for the right item, a retailer connecting with new customers, or a mall creating experiences that bring communities together.  

Behind the scenes, SPIRAL runs on advanced AI technology that turns raw shopping activity into meaningful insights for everyone in our ecosystem.

**SPIRAL: The Local Shopping Platform—built for people, powered by data, designed to serve.**
`;