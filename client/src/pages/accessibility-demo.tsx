import { useEffect } from 'react';
import Header from "@/components/header";
import AccessibilityToggle from "@/components/accessibility-toggle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useAccessibilityStore, announceToScreenReader } from '@/lib/accessibility';
import { 
  Eye, 
  Hand, 
  Brain, 
  Volume2, 
  Zap, 
  CheckCircle,
  Star,
  ShoppingCart,
  Heart,
  Settings
} from 'lucide-react';
import { Link } from 'wouter';

export default function AccessibilityDemo() {
  const { applySettingsToDOM } = useAccessibilityStore();
  
  // Ensure settings are applied when component mounts
  useEffect(() => {
    applySettingsToDOM();
    announceToScreenReader('Accessibility demo page loaded. Use the accessibility toggle to test different modes.');
  }, [applySettingsToDOM]);
  
  const handleTestAction = (action: string) => {
    announceToScreenReader(`${action} button activated. This demonstrates visual feedback for screen reader users.`);
  };
  
  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-[var(--spiral-navy)] mb-2">
            Accessibility Features Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience SPIRAL's comprehensive accessibility features. Use the accessibility toggle in the header 
            to enable one-click accessibility mode and see the improvements.
          </p>
        </div>
        
        {/* Quick Access Panel */}
        <Card className="mb-8 border-[var(--spiral-coral)]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-[var(--spiral-coral)]" />
              Quick Accessibility Controls
            </CardTitle>
            <CardDescription>
              Toggle accessibility features and see immediate changes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <AccessibilityToggle compact={false} showLabel={true} />
              <Separator orientation="vertical" className="hidden sm:block h-8" />
              <Link href="/accessibility-settings">
                <Button variant="outline" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Detailed Settings
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid gap-8">
          {/* Interactive Elements Demo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hand className="h-5 w-5 text-[var(--spiral-coral)]" />
                Interactive Elements
              </CardTitle>
              <CardDescription>
                Test buttons, forms, and other interactive components
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Buttons */}
              <div>
                <h3 className="font-semibold text-[var(--spiral-navy)] mb-3">Button Variations</h3>
                <div className="flex flex-wrap gap-3">
                  <Button 
                    onClick={() => handleTestAction('Primary')}
                    className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleTestAction('Secondary')}
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Add to Wishlist
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleTestAction('Tertiary')}
                  >
                    <Star className="mr-2 h-4 w-4" />
                    Rate Product
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              {/* Form Elements */}
              <div>
                <h3 className="font-semibold text-[var(--spiral-navy)] mb-3">Form Controls</h3>
                <div className="grid gap-4 max-w-md">
                  <div>
                    <Label htmlFor="test-input">Product Search</Label>
                    <Input 
                      id="test-input"
                      placeholder="Search for products..."
                      aria-describedby="test-input-help"
                    />
                    <p id="test-input-help" className="text-sm text-gray-500 mt-1">
                      Enter keywords to find local products
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="test-textarea">Product Review</Label>
                    <Textarea 
                      id="test-textarea"
                      placeholder="Share your experience with this product..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Typography and Content Demo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-[var(--spiral-coral)]" />
                Typography & Visual Content
              </CardTitle>
              <CardDescription>
                See how text scaling and contrast changes affect readability
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-[var(--spiral-navy)] mb-2">
                    Featured Local Products
                  </h2>
                  <p className="text-lg text-gray-700 mb-4">
                    Discover amazing products from local businesses in your community. 
                    Support local entrepreneurs while finding unique items.
                  </p>
                  <p className="text-base text-gray-600">
                    With accessibility mode enabled, this text becomes larger and easier to read. 
                    High contrast mode also improves visibility for users with visual impairments.
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Electronics</Badge>
                  <Badge variant="secondary">Fashion</Badge>
                  <Badge variant="secondary">Home & Garden</Badge>
                  <Badge variant="secondary">Local Artisan</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Focus and Navigation Demo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-[var(--spiral-coral)]" />
                Focus & Navigation
              </CardTitle>
              <CardDescription>
                Test keyboard navigation and focus indicators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Use Tab to navigate through these elements. With accessibility mode enabled, 
                  focus indicators become more prominent and easier to see.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Product 1', 'Product 2', 'Product 3', 'Product 4'].map((product, index) => (
                    <button
                      key={index}
                      className="p-4 text-left border border-gray-200 rounded-lg hover:border-[var(--spiral-coral)] focus:outline-none focus:ring-2 focus:ring-[var(--spiral-coral)] transition-colors"
                      onClick={() => handleTestAction(`Select ${product}`)}
                    >
                      <div className="font-medium text-[var(--spiral-navy)]">{product}</div>
                      <div className="text-sm text-gray-500">$19.99</div>
                      <div className="flex items-center mt-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs text-gray-500 ml-1">4.8</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Audio/Visual Feedback Demo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5 text-[var(--spiral-coral)]" />
                Audio & Visual Feedback
              </CardTitle>
              <CardDescription>
                Experience alternative feedback methods for different accessibility needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  These actions provide both visual and screen reader feedback:
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button 
                    onClick={() => {
                      handleTestAction('Success notification');
                      // Visual feedback simulation
                      const button = document.activeElement as HTMLElement;
                      if (button) {
                        button.style.backgroundColor = 'green';
                        setTimeout(() => {
                          button.style.backgroundColor = '';
                        }, 1000);
                      }
                    }}
                    variant="outline"
                    className="border-green-500 text-green-600 hover:bg-green-50"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Success Action
                  </Button>
                  <Button 
                    onClick={() => {
                      announceToScreenReader('Item added to cart successfully. You now have 3 items in your cart.');
                    }}
                    variant="outline"
                    className="border-blue-500 text-blue-600 hover:bg-blue-50"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Screen Reader Test
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Accessibility Information */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold text-[var(--spiral-navy)]">
                  Keyboard Navigation Guide
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Tab:</strong> Move to next interactive element<br />
                    <strong>Shift + Tab:</strong> Move to previous element<br />
                    <strong>Enter/Space:</strong> Activate buttons and links
                  </div>
                  <div>
                    <strong>Escape:</strong> Close dialogs and menus<br />
                    <strong>Arrow keys:</strong> Navigate within menus<br />
                    <strong>Home/End:</strong> Jump to first/last item
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}