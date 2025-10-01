import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Upload, 
  DollarSign, 
  Package, 
  Tag,
  Image as ImageIcon,
  Trash2,
  AlertCircle,
  Check,
  FileText,
  Zap,
  TrendingUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProductData {
  name: string;
  description: string;
  price: string;
  compareAtPrice: string;
  cost: string;
  sku: string;
  barcode: string;
  category: string;
  subcategory: string;
  brand: string;
  quantity: string;
  lowStockAlert: string;
  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  tags: string[];
  images: File[];
  imageUrls: string[];
  isActive: boolean;
  isFeatured: boolean;
  seoTitle: string;
  seoDescription: string;
  metaKeywords: string;
}

const PRODUCT_CATEGORIES = {
  "Electronics": ["Smartphones", "Computers", "Gaming", "Audio", "Cameras", "Smart Home", "Accessories"],
  "Clothing": ["Men's Apparel", "Women's Apparel", "Kids' Clothing", "Shoes", "Accessories", "Activewear"],
  "Home & Garden": ["Furniture", "Decor", "Kitchen", "Bathroom", "Garden", "Tools", "Storage"],
  "Health & Beauty": ["Skincare", "Makeup", "Hair Care", "Wellness", "Supplements", "Personal Care"],
  "Sports & Recreation": ["Fitness Equipment", "Outdoor Gear", "Sports Apparel", "Games", "Bikes"],
  "Books & Media": ["Books", "Movies", "Music", "Games", "Educational", "Magazines"],
  "Food & Beverage": ["Snacks", "Beverages", "Organic", "Gourmet", "Local Specialties"],
  "Automotive": ["Parts", "Accessories", "Tools", "Care Products", "Electronics"]
};

export default function RetailerInventoryForm() {
  const [activeTab, setActiveTab] = useState("single");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [product, setProduct] = useState<ProductData>({
    name: "",
    description: "",
    price: "",
    compareAtPrice: "",
    cost: "",
    sku: "",
    barcode: "",
    category: "",
    subcategory: "",
    brand: "",
    quantity: "",
    lowStockAlert: "10",
    weight: "",
    dimensions: { length: "", width: "", height: "" },
    tags: [],
    images: [],
    imageUrls: [],
    isActive: true,
    isFeatured: false,
    seoTitle: "",
    seoDescription: "",
    metaKeywords: ""
  });
  const [bulkProducts, setBulkProducts] = useState<string>("");
  const [dragActive, setDragActive] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleInputChange = (field: keyof ProductData, value: any) => {
    setProduct({ ...product, [field]: value });
  };

  const handleDimensionChange = (dimension: keyof ProductData['dimensions'], value: string) => {
    setProduct({
      ...product,
      dimensions: { ...product.dimensions, [dimension]: value }
    });
  };

  const handleTagAdd = (tagInput: string) => {
    if (tagInput.trim() && !product.tags.includes(tagInput.trim())) {
      setProduct({ ...product, tags: [...product.tags, tagInput.trim()] });
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setProduct({ ...product, tags: product.tags.filter(tag => tag !== tagToRemove) });
  };

  const handleImageUpload = (files: FileList | null) => {
    if (files) {
      const newImages = Array.from(files);
      const totalImages = product.images.length + newImages.length;
      
      if (totalImages > 10) {
        toast({
          title: "Too Many Images",
          description: "Maximum 10 images allowed per product",
          variant: "destructive"
        });
        return;
      }

      // Create preview URLs
      const newUrls = newImages.map(file => URL.createObjectURL(file));
      
      setProduct({
        ...product,
        images: [...product.images, ...newImages],
        imageUrls: [...product.imageUrls, ...newUrls]
      });
    }
  };

  const handleImageRemove = (index: number) => {
    const newImages = product.images.filter((_, i) => i !== index);
    const newUrls = product.imageUrls.filter((_, i) => i !== index);
    
    // Revoke the URL to free memory
    URL.revokeObjectURL(product.imageUrls[index]);
    
    setProduct({
      ...product,
      images: newImages,
      imageUrls: newUrls
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  const validateProduct = () => {
    if (!product.name.trim()) {
      toast({ title: "Product name is required", variant: "destructive" });
      return false;
    }
    if (!product.price || parseFloat(product.price) <= 0) {
      toast({ title: "Valid price is required", variant: "destructive" });
      return false;
    }
    if (!product.category) {
      toast({ title: "Category is required", variant: "destructive" });
      return false;
    }
    if (!product.quantity || parseInt(product.quantity) < 0) {
      toast({ title: "Valid quantity is required", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleSingleProductSubmit = async () => {
    if (!validateProduct()) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      // Append product data
      Object.entries(product).forEach(([key, value]) => {
        if (key === 'images') return; // Handle separately
        if (key === 'dimensions') {
          formData.append(key, JSON.stringify(value));
        } else if (key === 'tags') {
          formData.append(key, JSON.stringify(value));
        } else if (key === 'imageUrls') {
          return; // Skip preview URLs
        } else {
          formData.append(key, String(value));
        }
      });

      // Append images
      product.images.forEach((image, index) => {
        formData.append(`image_${index}`, image);
      });

      const response = await fetch("/api/products/add", {
        method: "POST",
        body: formData
      });

      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Product Added Successfully!",
          description: `${product.name} has been added to your inventory.`,
        });
        
        // Reset form
        setProduct({
          name: "", description: "", price: "", compareAtPrice: "", cost: "",
          sku: "", barcode: "", category: "", subcategory: "", brand: "",
          quantity: "", lowStockAlert: "10", weight: "",
          dimensions: { length: "", width: "", height: "" },
          tags: [], images: [], imageUrls: [], isActive: true, isFeatured: false,
          seoTitle: "", seoDescription: "", metaKeywords: ""
        });
      } else {
        toast({
          title: "Failed to Add Product",
          description: result.error || "Something went wrong",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive"
      });
    }
    setIsSubmitting(false);
  };

  const handleBulkImport = async () => {
    if (!bulkProducts.trim()) {
      toast({ title: "Please provide CSV data", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/products/bulk-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csvData: bulkProducts })
      });

      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Bulk Import Successful!",
          description: `${result.imported} products imported successfully.`,
        });
        setBulkProducts("");
      } else {
        toast({
          title: "Bulk Import Failed",
          description: result.error || "Something went wrong",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Failed to import products. Please try again.",
        variant: "destructive"
      });
    }
    setIsSubmitting(false);
  };

  const calculateMargin = () => {
    const price = parseFloat(product.price) || 0;
    const cost = parseFloat(product.cost) || 0;
    if (price && cost) {
      return (((price - cost) / price) * 100).toFixed(1);
    }
    return "0";
  };

  const generateSKU = () => {
    const prefix = product.category.substring(0, 3).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    setProduct({ ...product, sku: `${prefix}-${random}` });
  };

  // AI Assistant Functions
  const generateProductDescription = async () => {
    if (!product.name) {
      toast({ title: "Product name required", description: "Please enter a product name first", variant: "destructive" });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/ai/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: product.name,
          existingDescription: product.description,
          category: product.category,
          brand: product.brand
        })
      });

      const result = await response.json();
      if (result.success) {
        setAiSuggestions(prev => ({ ...prev, description: result.description }));
        toast({
          title: "AI Description Generated!",
          description: "Review and apply the optimized product description.",
        });
      } else {
        toast({
          title: "AI Generation Failed",
          description: result.error || "Failed to generate description",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Failed to connect to AI service. Please try again.",
        variant: "destructive"
      });
    }
    setIsSubmitting(false);
  };

  const optimizePrice = async () => {
    if (!product.name) {
      toast({ title: "Product name required", description: "Please enter a product name first", variant: "destructive" });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/ai/optimize-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: product.name,
          description: product.description,
          category: product.category,
          currentPrice: product.price,
          cost: product.cost
        })
      });

      const result = await response.json();
      if (result.success) {
        setAiSuggestions(prev => ({ 
          ...prev, 
          price: result.suggestedPrice,
          priceReasoning: result.reasoning
        }));
        toast({
          title: "Price Optimization Complete!",
          description: "AI has analyzed market data and suggests optimal pricing.",
        });
      } else {
        toast({
          title: "Price Optimization Failed",
          description: result.error || "Failed to optimize price",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Failed to connect to AI service. Please try again.",
        variant: "destructive"
      });
    }
    setIsSubmitting(false);
  };

  const suggestCategories = async () => {
    if (!product.name) {
      toast({ title: "Product name required", description: "Please enter a product name first", variant: "destructive" });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/ai/suggest-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: product.name,
          description: product.description,
          brand: product.brand
        })
      });

      const result = await response.json();
      if (result.success) {
        setAiSuggestions(prev => ({ 
          ...prev, 
          category: result.category,
          subcategory: result.subcategory,
          tags: result.tags
        }));
        toast({
          title: "Smart Categories Suggested!",
          description: "AI has analyzed your product and suggested optimal categories and tags.",
        });
      } else {
        toast({
          title: "Category Suggestion Failed",
          description: result.error || "Failed to suggest categories",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Failed to connect to AI service. Please try again.",
        variant: "destructive"
      });
    }
    setIsSubmitting(false);
  };

  const optimizeSEO = async () => {
    if (!product.name) {
      toast({ title: "Product name required", description: "Please enter a product name first", variant: "destructive" });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/ai/optimize-seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: product.name,
          description: product.description,
          category: product.category,
          brand: product.brand,
          price: product.price
        })
      });

      const result = await response.json();
      if (result.success) {
        setAiSuggestions(prev => ({ 
          ...prev, 
          seo: {
            title: result.seoTitle,
            description: result.seoDescription,
            keywords: result.keywords
          }
        }));
        toast({
          title: "SEO Optimization Complete!",
          description: "AI has created search-optimized titles, descriptions and keywords.",
        });
      } else {
        toast({
          title: "SEO Optimization Failed",
          description: result.error || "Failed to optimize SEO",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Failed to connect to AI service. Please try again.",
        variant: "destructive"
      });
    }
    setIsSubmitting(false);
  };

  const applySEOSuggestions = (seoData: any) => {
    setProduct({
      ...product,
      seoTitle: seoData.title,
      seoDescription: seoData.description,
      metaKeywords: seoData.keywords
    });
    toast({
      title: "SEO Settings Applied!",
      description: "SEO fields have been updated with AI recommendations.",
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center">
                <Package className="h-6 w-6 mr-2 text-blue-600" />
                Inventory Management
              </CardTitle>
              <CardDescription>
                Add and manage your store's product inventory
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-sm">
              SPIRAL Retailer Portal
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="single" className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Single Product
              </TabsTrigger>
              <TabsTrigger value="bulk" className="flex items-center">
                <Upload className="h-4 w-4 mr-2" />
                Bulk Import
              </TabsTrigger>
              <TabsTrigger value="ai" className="flex items-center">
                <Zap className="h-4 w-4 mr-2" />
                AI Assistant
              </TabsTrigger>
            </TabsList>

            {/* Single Product Tab */}
            <TabsContent value="single" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Basic Information */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg">Product Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name">Product Name *</Label>
                      <Input
                        id="name"
                        placeholder="e.g., iPhone 15 Pro Max 256GB"
                        value={product.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Detailed product description..."
                        value={product.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="brand">Brand</Label>
                        <Input
                          id="brand"
                          placeholder="e.g., Apple"
                          value={product.brand}
                          onChange={(e) => handleInputChange('brand', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="sku">SKU</Label>
                        <div className="flex">
                          <Input
                            id="sku"
                            placeholder="Product SKU"
                            value={product.sku}
                            onChange={(e) => handleInputChange('sku', e.target.value)}
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={generateSKU}
                            className="ml-2"
                          >
                            Generate
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="barcode">Barcode (UPC/EAN)</Label>
                      <Input
                        id="barcode"
                        placeholder="123456789012"
                        value={product.barcode}
                        onChange={(e) => handleInputChange('barcode', e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Product Images */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Product Images</CardTitle>
                    <CardDescription>Up to 10 images</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                        dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-sm text-gray-600 mb-2">
                        Drag images here or click to upload
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Choose Files
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e.target.files)}
                        className="hidden"
                      />
                    </div>

                    {product.imageUrls.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        {product.imageUrls.map((url, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={url}
                              alt={`Product ${index + 1}`}
                              className="w-full h-20 object-cover rounded"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleImageRemove(index)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Pricing & Inventory */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <DollarSign className="h-5 w-5 mr-2" />
                      Pricing & Inventory
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">Selling Price * ($)</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          placeholder="99.99"
                          value={product.price}
                          onChange={(e) => handleInputChange('price', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="compareAtPrice">Compare at Price ($)</Label>
                        <Input
                          id="compareAtPrice"
                          type="number"
                          step="0.01"
                          placeholder="129.99"
                          value={product.compareAtPrice}
                          onChange={(e) => handleInputChange('compareAtPrice', e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="cost">Cost per Unit ($)</Label>
                      <Input
                        id="cost"
                        type="number"
                        step="0.01"
                        placeholder="75.00"
                        value={product.cost}
                        onChange={(e) => handleInputChange('cost', e.target.value)}
                      />
                      {product.price && product.cost && (
                        <p className="text-sm text-green-600 mt-1">
                          Margin: {calculateMargin()}%
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="quantity">Quantity in Stock *</Label>
                        <Input
                          id="quantity"
                          type="number"
                          placeholder="100"
                          value={product.quantity}
                          onChange={(e) => handleInputChange('quantity', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lowStockAlert">Low Stock Alert</Label>
                        <Input
                          id="lowStockAlert"
                          type="number"
                          placeholder="10"
                          value={product.lowStockAlert}
                          onChange={(e) => handleInputChange('lowStockAlert', e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Categories & Tags */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Tag className="h-5 w-5 mr-2" />
                      Categories & Tags
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(PRODUCT_CATEGORIES).map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {product.category && (
                      <div>
                        <Label htmlFor="subcategory">Subcategory</Label>
                        <Select onValueChange={(value) => handleInputChange('subcategory', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select subcategory" />
                          </SelectTrigger>
                          <SelectContent>
                            {PRODUCT_CATEGORIES[product.category as keyof typeof PRODUCT_CATEGORIES]?.map(subcat => (
                              <SelectItem key={subcat} value={subcat}>{subcat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="tags">Product Tags</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {product.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="cursor-pointer">
                            {tag}
                            <button
                              onClick={() => handleTagRemove(tag)}
                              className="ml-1 text-xs"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <Input
                        placeholder="Add tags (press Enter)"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleTagAdd(e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isActive"
                        checked={product.isActive}
                        onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                      />
                      <Label htmlFor="isActive">Product Active</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isFeatured"
                        checked={product.isFeatured}
                        onCheckedChange={(checked) => handleInputChange('isFeatured', checked)}
                      />
                      <Label htmlFor="isFeatured">Featured Product</Label>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Physical Properties */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Shipping & Physical Properties</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="weight">Weight (lbs)</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        placeholder="2.5"
                        value={product.weight}
                        onChange={(e) => handleInputChange('weight', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="length">Length (in)</Label>
                      <Input
                        id="length"
                        type="number"
                        step="0.1"
                        placeholder="10"
                        value={product.dimensions.length}
                        onChange={(e) => handleDimensionChange('length', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="width">Width (in)</Label>
                      <Input
                        id="width"
                        type="number"
                        step="0.1"
                        placeholder="5"
                        value={product.dimensions.width}
                        onChange={(e) => handleDimensionChange('width', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="height">Height (in)</Label>
                      <Input
                        id="height"
                        type="number"
                        step="0.1"
                        placeholder="3"
                        value={product.dimensions.height}
                        onChange={(e) => handleDimensionChange('height', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SEO Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">SEO & Marketing</CardTitle>
                  <CardDescription>Optimize for search engines and social media</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="seoTitle">SEO Title</Label>
                    <Input
                      id="seoTitle"
                      placeholder="Optimized title for search engines"
                      value={product.seoTitle}
                      onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="seoDescription">SEO Description</Label>
                    <Textarea
                      id="seoDescription"
                      placeholder="Brief description for search results"
                      value={product.seoDescription}
                      onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="metaKeywords">Keywords</Label>
                    <Input
                      id="metaKeywords"
                      placeholder="keyword1, keyword2, keyword3"
                      value={product.metaKeywords}
                      onChange={(e) => handleInputChange('metaKeywords', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button
                  onClick={handleSingleProductSubmit}
                  disabled={isSubmitting}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? (
                    <>Adding Product...</>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Add Product to Inventory
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            {/* Bulk Import Tab */}
            <TabsContent value="bulk" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Bulk Product Import
                  </CardTitle>
                  <CardDescription>
                    Import multiple products using CSV format. Download template below.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">CSV Format Requirements:</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Your CSV must include these columns in order:
                    </p>
                    <code className="text-xs bg-white p-2 rounded block">
                      name,description,price,cost,sku,barcode,category,subcategory,brand,quantity,weight
                    </code>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Upload className="h-4 w-4 mr-2" />
                      Download CSV Template
                    </Button>
                  </div>

                  <div>
                    <Label htmlFor="bulkData">CSV Data</Label>
                    <Textarea
                      id="bulkData"
                      placeholder="Paste your CSV data here or upload a file..."
                      value={bulkProducts}
                      onChange={(e) => setBulkProducts(e.target.value)}
                      rows={12}
                      className="font-mono text-sm"
                    />
                  </div>

                  <div className="flex items-center space-x-2 p-3 bg-yellow-50 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <p className="text-sm text-yellow-800">
                      Review your data carefully. Bulk imports cannot be easily undone.
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleBulkImport}
                      disabled={isSubmitting || !bulkProducts.trim()}
                      size="lg"
                    >
                      {isSubmitting ? (
                        <>Processing Import...</>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Import Products
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* AI Assistant Tab */}
            <TabsContent value="ai" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Zap className="h-5 w-5 mr-2" />
                    AI Product Assistant
                  </CardTitle>
                  <CardDescription>
                    Get AI-powered help to optimize your product listings and increase sales
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Quick Product Input for AI */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">🤖 Tell AI about your product</h4>
                    <div className="space-y-3">
                      <Input
                        placeholder="Product name (e.g., iPhone 15 Pro Max)"
                        value={product.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                      />
                      <Textarea
                        placeholder="Basic description or keywords..."
                        value={product.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>

                  {/* AI Tools Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Description Generator */}
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <Button 
                          variant="ghost" 
                          className="h-auto p-0 flex flex-col w-full"
                          onClick={() => generateProductDescription()}
                          disabled={isSubmitting || !product.name}
                        >
                          <FileText className="h-8 w-8 mb-2 text-green-600" />
                          <span className="font-semibold">Generate Description</span>
                          <span className="text-sm text-gray-500 text-center">
                            Create compelling product descriptions that sell
                          </span>
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Price Optimizer */}
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <Button 
                          variant="ghost" 
                          className="h-auto p-0 flex flex-col w-full"
                          onClick={() => optimizePrice()}
                          disabled={isSubmitting || !product.name}
                        >
                          <TrendingUp className="h-8 w-8 mb-2 text-blue-600" />
                          <span className="font-semibold">Price Optimization</span>
                          <span className="text-sm text-gray-500 text-center">
                            Get competitive pricing recommendations
                          </span>
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Category Suggestions */}
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <Button 
                          variant="ghost" 
                          className="h-auto p-0 flex flex-col w-full"
                          onClick={() => suggestCategories()}
                          disabled={isSubmitting || !product.name}
                        >
                          <Tag className="h-8 w-8 mb-2 text-purple-600" />
                          <span className="font-semibold">Smart Categories</span>
                          <span className="text-sm text-gray-500 text-center">
                            Auto-suggest categories and tags
                          </span>
                        </Button>
                      </CardContent>
                    </Card>

                    {/* SEO Optimizer */}
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <Button 
                          variant="ghost" 
                          className="h-auto p-0 flex flex-col w-full"
                          onClick={() => optimizeSEO()}
                          disabled={isSubmitting || !product.name}
                        >
                          <Zap className="h-8 w-8 mb-2 text-orange-600" />
                          <span className="font-semibold">SEO Optimizer</span>
                          <span className="text-sm text-gray-500 text-center">
                            Optimize for search engines
                          </span>
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  {/* AI Suggestions Display */}
                  {aiSuggestions && (
                    <Card className="bg-gradient-to-r from-green-50 to-blue-50">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                          <Check className="h-5 w-5 mr-2 text-green-600" />
                          AI Recommendations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {aiSuggestions.description && (
                            <div>
                              <Label className="font-semibold">Optimized Description:</Label>
                              <div className="bg-white p-3 rounded border mt-1">
                                <p className="text-sm">{aiSuggestions.description}</p>
                                <Button 
                                  size="sm" 
                                  className="mt-2"
                                  onClick={() => handleInputChange('description', aiSuggestions.description)}
                                >
                                  Apply Description
                                </Button>
                              </div>
                            </div>
                          )}
                          
                          {aiSuggestions.price && (
                            <div>
                              <Label className="font-semibold">Suggested Price:</Label>
                              <div className="bg-white p-3 rounded border mt-1">
                                <p className="text-lg font-bold text-green-600">${aiSuggestions.price}</p>
                                <p className="text-sm text-gray-600">{aiSuggestions.priceReasoning}</p>
                                <Button 
                                  size="sm" 
                                  className="mt-2"
                                  onClick={() => handleInputChange('price', aiSuggestions.price)}
                                >
                                  Apply Price
                                </Button>
                              </div>
                            </div>
                          )}
                          
                          {aiSuggestions.category && (
                            <div>
                              <Label className="font-semibold">Recommended Category:</Label>
                              <div className="bg-white p-3 rounded border mt-1">
                                <p className="font-medium">{aiSuggestions.category}</p>
                                {aiSuggestions.tags && (
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {aiSuggestions.tags.map(tag => (
                                      <Badge key={tag} variant="outline">{tag}</Badge>
                                    ))}
                                  </div>
                                )}
                                <div className="flex gap-2 mt-2">
                                  <Button 
                                    size="sm"
                                    onClick={() => handleInputChange('category', aiSuggestions.category)}
                                  >
                                    Apply Category
                                  </Button>
                                  {aiSuggestions.tags && (
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => handleInputChange('tags', aiSuggestions.tags)}
                                    >
                                      Apply Tags
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {aiSuggestions.seo && (
                            <div>
                              <Label className="font-semibold">SEO Optimization:</Label>
                              <div className="bg-white p-3 rounded border mt-1 space-y-2">
                                <div>
                                  <Label className="text-sm font-medium">Title:</Label>
                                  <p className="text-sm">{aiSuggestions.seo.title}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Meta Description:</Label>
                                  <p className="text-sm">{aiSuggestions.seo.description}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Keywords:</Label>
                                  <p className="text-sm">{aiSuggestions.seo.keywords}</p>
                                </div>
                                <Button 
                                  size="sm"
                                  onClick={() => applySEOSuggestions(aiSuggestions.seo)}
                                >
                                  Apply SEO Settings
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* AI Status */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">🧠 AI Assistant Ready</h4>
                        <p className="text-sm text-gray-600">
                          Powered by GPT-4 to help optimize your product listings for maximum sales.
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        AI Active
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}