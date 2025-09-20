import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Package, Upload, Sparkles, Check, Plus, X, DollarSign, Tag, Camera } from 'lucide-react';

interface Message {
  role: 'agent' | 'user';
  content: string;
  timestamp: Date;
}

interface Product {
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  inventory: number;
  sku: string;
  tags: string[];
}

const categories = [
  { id: 'electronics', name: 'Electronics', subcategories: ['Smartphones', 'Laptops', 'Audio', 'Gaming'] },
  { id: 'clothing', name: 'Clothing & Fashion', subcategories: ['Men\'s Clothing', 'Women\'s Clothing', 'Shoes', 'Accessories'] },
  { id: 'home', name: 'Home & Garden', subcategories: ['Furniture', 'Decor', 'Kitchen', 'Garden'] },
  { id: 'health', name: 'Health & Beauty', subcategories: ['Skincare', 'Makeup', 'Supplements', 'Personal Care'] },
  { id: 'sports', name: 'Sports & Outdoors', subcategories: ['Fitness', 'Outdoor Gear', 'Team Sports', 'Water Sports'] },
  { id: 'books', name: 'Books & Media', subcategories: ['Fiction', 'Non-Fiction', 'Comics', 'Educational'] }
];

export default function ProductEntryAgent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
    tags: []
  });
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const steps = [
    { id: 1, title: 'Welcome', icon: Sparkles },
    { id: 2, title: 'Product Info', icon: Package },
    { id: 3, title: 'Categories', icon: Tag },
    { id: 4, title: 'Pricing', icon: DollarSign },
    { id: 5, title: 'Review', icon: Check }
  ];

  useEffect(() => {
    addAgentMessage(
      `✨ Welcome to the ProductEntryAgent!\n\n` +
      `I'm here to help you add products to your SPIRAL store with AI-powered assistance.\n\n` +
      `I can help you:\n` +
      `• Create detailed product descriptions\n` +
      `• Suggest optimal categories and tags\n` +
      `• Recommend competitive pricing\n` +
      `• Optimize for local search\n\n` +
      `Ready to add your first product? Let's start with the basics!`
    );
  }, []);

  const addAgentMessage = (content: string) => {
    setMessages(prev => [...prev, {
      role: 'agent',
      content,
      timestamp: new Date()
    }]);
  };

  const handleStartProductEntry = () => {
    addAgentMessage(
      `Great! Let's create your first product listing.\n\n` +
      `📦 Step 1: Product Information\n\n` +
      `Please provide the basic details about your product. I'll help you optimize the description for maximum visibility on SPIRAL.`
    );
    setCurrentStep(2);
  };

  const handleProductInfoSubmit = () => {
    if (!currentProduct.name || !currentProduct.description) {
      toast({
        title: "Missing Information",
        description: "Please provide product name and description.",
        variant: "destructive"
      });
      return;
    }

    addAgentMessage(
      `Perfect! "${currentProduct.name}" sounds great.\n\n` +
      `🏷️ Step 2: Categories & Tags\n\n` +
      `Now let's categorize your product for better discoverability. Choose the most relevant category and I'll suggest subcategories and tags.`
    );
    setCurrentStep(3);
  };

  const handleCategorySubmit = () => {
    if (!currentProduct.category || !currentProduct.subcategory) {
      toast({
        title: "Missing Category",
        description: "Please select both category and subcategory.",
        variant: "destructive"
      });
      return;
    }

    addAgentMessage(
      `Excellent categorization! ${currentProduct.category} → ${currentProduct.subcategory}\n\n` +
      `💰 Step 3: Pricing Strategy\n\n` +
      `Let's set a competitive price. Based on your category, I recommend researching local competitors and pricing competitively for the SPIRAL marketplace.`
    );
    setCurrentStep(4);
  };

  const handlePricingSubmit = () => {
    if (!currentProduct.price || !currentProduct.inventory) {
      toast({
        title: "Missing Pricing Info",
        description: "Please provide price and inventory count.",
        variant: "destructive"
      });
      return;
    }

    addAgentMessage(
      `Great pricing strategy! $${currentProduct.price} with ${currentProduct.inventory} units in stock.\n\n` +
      `✅ Step 4: Review & Publish\n\n` +
      `Your product is ready for SPIRAL! Review the details below and publish to make it available to local shoppers.`
    );
    setCurrentStep(5);
  };

  const handleAddTag = () => {
    if (newTag.trim() && currentProduct.tags && !currentProduct.tags.includes(newTag.trim())) {
      setCurrentProduct(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setCurrentProduct(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handlePublishProduct = async () => {
    setLoading(true);
    try {
      // Generate SKU if not provided
      const sku = currentProduct.sku || `SKU-${Date.now()}`;
      
      const productData = {
        ...currentProduct,
        sku,
        price: Number(currentProduct.price),
        inventory: Number(currentProduct.inventory)
      } as Product;

      setProducts(prev => [...prev, productData]);
      
      addAgentMessage(
        `🎉 Product published successfully!\n\n` +
        `"${productData.name}" is now live on SPIRAL and available to local shoppers.\n\n` +
        `Product Details:\n` +
        `• SKU: ${sku}\n` +
        `• Category: ${productData.category} → ${productData.subcategory}\n` +
        `• Price: $${productData.price}\n` +
        `• Inventory: ${productData.inventory} units\n\n` +
        `Would you like to add another product or view your store dashboard?`
      );

      // Reset for next product
      setCurrentProduct({ tags: [] });
      setCurrentStep(1);

      toast({
        title: "Product Added Successfully",
        description: `${productData.name} is now available on SPIRAL`,
      });
    } catch (error) {
      toast({
        title: "Error Adding Product",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const progressPercentage = (currentStep / steps.length) * 100;
  const selectedCategory = categories.find(cat => cat.id === currentProduct.category);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-teal-600">ProductEntryAgent</h1>
        <p className="text-gray-600 mt-2">AI-powered product management for your SPIRAL store</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* AI Agent Chat */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              AI Product Assistant
            </CardTitle>
            <CardDescription>
              Get personalized help with product listing and optimization
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-gray-500">{currentStep} of {steps.length}</span>
              </div>
              <Progress value={progressPercentage} className="mb-4" />
              <div className="flex justify-between">
                {steps.map((step) => {
                  const Icon = step.icon;
                  const isCompleted = currentStep > step.id;
                  const isCurrent = currentStep === step.id;
                  
                  return (
                    <div key={step.id} className="flex flex-col items-center">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center mb-1
                        ${isCompleted ? 'bg-teal-500 text-white' : 
                          isCurrent ? 'bg-teal-100 text-teal-600 border-2 border-teal-500' : 
                          'bg-gray-100 text-gray-400'}
                      `}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-xs text-center ${isCurrent ? 'font-medium' : ''}`}>
                        {step.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chat Messages */}
            <div className="space-y-4 h-96 overflow-y-auto">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-teal-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="mt-4 space-y-2">
              {currentStep === 1 && (
                <Button onClick={handleStartProductEntry} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Product
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Product Entry Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-teal-500" />
              Product Details
            </CardTitle>
            <CardDescription>
              Enter your product information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentStep >= 2 && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Product Name *</label>
                  <Input
                    placeholder="Enter product name"
                    value={currentProduct.name || ''}
                    onChange={(e) => setCurrentProduct(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description *</label>
                  <Textarea
                    placeholder="Describe your product in detail"
                    value={currentProduct.description || ''}
                    onChange={(e) => setCurrentProduct(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">SKU (Optional)</label>
                  <Input
                    placeholder="Product SKU (auto-generated if empty)"
                    value={currentProduct.sku || ''}
                    onChange={(e) => setCurrentProduct(prev => ({ ...prev, sku: e.target.value }))}
                  />
                </div>

                {currentStep === 2 && (
                  <Button onClick={handleProductInfoSubmit} className="w-full">
                    Continue to Categories
                  </Button>
                )}
              </>
            )}

            {currentStep >= 3 && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category *</label>
                  <Select
                    value={currentProduct.category || ''}
                    onValueChange={(value) => setCurrentProduct(prev => ({ ...prev, category: value, subcategory: '' }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedCategory && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Subcategory *</label>
                    <Select
                      value={currentProduct.subcategory || ''}
                      onValueChange={(value) => setCurrentProduct(prev => ({ ...prev, subcategory: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedCategory.subcategories.map((subcategory) => (
                          <SelectItem key={subcategory} value={subcategory}>
                            {subcategory}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tags</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    />
                    <Button onClick={handleAddTag} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentProduct.tags?.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => handleRemoveTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                {currentStep === 3 && (
                  <Button onClick={handleCategorySubmit} className="w-full">
                    Continue to Pricing
                  </Button>
                )}
              </>
            )}

            {currentStep >= 4 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Price ($) *</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={currentProduct.price || ''}
                      onChange={(e) => setCurrentProduct(prev => ({ ...prev, price: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Inventory *</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={currentProduct.inventory || ''}
                      onChange={(e) => setCurrentProduct(prev => ({ ...prev, inventory: Number(e.target.value) }))}
                    />
                  </div>
                </div>

                {currentStep === 4 && (
                  <Button onClick={handlePricingSubmit} className="w-full">
                    Review Product
                  </Button>
                )}
              </>
            )}

            {currentStep === 5 && (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">Product Summary</h3>
                  <div className="space-y-1 text-sm text-green-700">
                    <p><strong>Name:</strong> {currentProduct.name}</p>
                    <p><strong>Category:</strong> {currentProduct.category} → {currentProduct.subcategory}</p>
                    <p><strong>Price:</strong> ${currentProduct.price}</p>
                    <p><strong>Inventory:</strong> {currentProduct.inventory} units</p>
                    {currentProduct.tags && currentProduct.tags.length > 0 && (
                      <p><strong>Tags:</strong> {currentProduct.tags.join(', ')}</p>
                    )}
                  </div>
                </div>

                <Button 
                  onClick={handlePublishProduct} 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Publish to SPIRAL
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Products List */}
      {products.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Products ({products.length})</CardTitle>
            <CardDescription>
              Products successfully added to your SPIRAL store
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product, index) => (
                <Card key={index} className="border-green-200">
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{product.category} → {product.subcategory}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-green-600">${product.price}</span>
                      <Badge variant="secondary">{product.inventory} in stock</Badge>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {product.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}