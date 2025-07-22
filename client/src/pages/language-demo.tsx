import Header from "@/components/header";
import Footer from "@/components/footer";
import LanguageSelector from "@/components/language-selector";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Users, TrendingUp } from 'lucide-react';

export default function LanguageDemo() {
  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[var(--spiral-navy)] mb-4">
              Multi-Language Support Demo
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Experience SPIRAL in your preferred language. Our platform supports multiple languages 
              with auto-detection and seamless switching capabilities.
            </p>
          </div>

          {/* Language Selector */}
          <Card>
            <CardHeader>
              <CardTitle>Choose Your Language</CardTitle>
              <CardDescription>
                Select your preferred language for the entire SPIRAL platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LanguageSelector showProgress={true} />
            </CardContent>
          </Card>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="h-8 w-8 text-[var(--spiral-coral)]" />
                  <h3 className="text-lg font-semibold text-[var(--spiral-navy)]">
                    Auto-Detection
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Automatically detects your browser language and sets the appropriate locale 
                  for a personalized experience from your first visit.
                </p>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="h-8 w-8 text-[var(--spiral-coral)]" />
                  <h3 className="text-lg font-semibold text-[var(--spiral-navy)]">
                    Comprehensive Coverage
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Full translation coverage across all platform features including navigation, 
                  product descriptions, checkout flow, and customer support.
                </p>
                <Badge className="bg-blue-100 text-blue-800">95% Complete</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="h-8 w-8 text-[var(--spiral-coral)]" />
                  <h3 className="text-lg font-semibold text-[var(--spiral-navy)]">
                    Continuous Improvement
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Regular updates and improvements to translations based on user feedback 
                  and cultural adaptation for local markets.
                </p>
                <Badge className="bg-purple-100 text-purple-800">Expanding</Badge>
              </CardContent>
            </Card>
          </div>

          {/* Supported Languages */}
          <Card>
            <CardHeader>
              <CardTitle>Currently Supported Languages</CardTitle>
              <CardDescription>
                We're continuously expanding our language support to serve more communities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-[var(--spiral-navy)] mb-3">Fully Supported</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🇺🇸</span>
                        <span className="font-medium">English</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">100%</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🇪🇸</span>
                        <span className="font-medium">Español</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">95%</Badge>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-[var(--spiral-navy)] mb-3">Coming Soon</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🇫🇷</span>
                        <span className="font-medium">Français</span>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">85%</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🇩🇪</span>
                        <span className="font-medium">Deutsch</span>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">80%</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🇧🇷</span>
                        <span className="font-medium">Português</span>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">75%</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Implementation Features */}
          <Card>
            <CardHeader>
              <CardTitle>Technical Implementation</CardTitle>
              <CardDescription>
                Advanced internationalization features for seamless user experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-[var(--spiral-navy)] mb-2">
                    Locale Detection
                  </h4>
                  <p className="text-sm text-gray-600">
                    Browser-based automatic language detection
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-[var(--spiral-navy)] mb-2">
                    Persistent Settings
                  </h4>
                  <p className="text-sm text-gray-600">
                    Language preference saved across sessions
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-[var(--spiral-navy)] mb-2">
                    Real-time Switching
                  </h4>
                  <p className="text-sm text-gray-600">
                    Instant language changes without page reload
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-[var(--spiral-navy)] mb-2">
                    Cultural Adaptation
                  </h4>
                  <p className="text-sm text-gray-600">
                    Currency, dates, and cultural preferences
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}