import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, Brain, Database, MapPin, Camera, CheckCircle, Zap } from 'lucide-react';

export default function AdvancedImageSearchDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  
  const demoSteps = [
    {
      title: "Google Cloud Vision API Analysis",
      description: "Advanced AI analyzes uploaded images using Google's machine learning",
      icon: <Brain className="h-6 w-6" />,
      features: ["Object Detection", "Label Recognition", "Confidence Scoring", "Multi-format Support"]
    },
    {
      title: "IBM Cloudant Database Matching",
      description: "Semantic search through local product database for matching items",
      icon: <Database className="h-6 w-6" />,
      features: ["NoSQL Product Database", "Semantic Similarity", "Real-time Queries", "Advanced Filtering"]
    },
    {
      title: "Location-Based Results", 
      description: "GPS-powered distance calculations and local store recommendations",
      icon: <MapPin className="h-6 w-6" />,
      features: ["GPS Integration", "Mile/Meter Calculations", "Proximity Sorting", "Navigation Links"]
    },
    {
      title: "Enhanced User Experience",
      description: "Modern responsive interface with real-time feedback and progress tracking",
      icon: <Eye className="h-6 w-6" />,
      features: ["Real-time Progress", "Mobile Responsive", "Error Handling", "Batch Processing"]
    }
  ];

  const techStack = [
    { name: "Google Cloud Vision API", status: "active", description: "Advanced image analysis and object detection" },
    { name: "IBM Cloudant Database", status: "integrated", description: "NoSQL database for product matching" },
    { name: "Geolib Distance Calculation", status: "active", description: "Precise location-based filtering" },
    { name: "React TypeScript Frontend", status: "optimized", description: "Modern responsive user interface" },
    { name: "Express.js API Routes", status: "operational", description: "High-performance backend endpoints" }
  ];

  const exampleResults = [
    {
      product: "Wireless Bluetooth Headphones",
      confidence: 92,
      distance: "0.8 mi",
      store: "Downtown Electronics",
      price: "$89.99",
      rating: 4.5
    },
    {
      product: "Smartphone with Advanced Camera",
      confidence: 87,
      distance: "1.2 mi", 
      store: "Tech Central",
      price: "$599.99",
      rating: 4.6
    },
    {
      product: "Laptop Computer",
      confidence: 83,
      distance: "2.1 mi",
      store: "Computer World",
      price: "$899.99",
      rating: 4.4
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Eye className="h-12 w-12 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Advanced AI Image Search
          </h1>
        </div>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Revolutionary visual product discovery powered by Google Cloud Vision API, IBM Cloudant database, 
          and intelligent location services for the SPIRAL platform.
        </p>
        <div className="flex items-center justify-center gap-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            100% Operational
          </Badge>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Zap className="h-3 w-3 mr-1" />
            Production Ready
          </Badge>
        </div>
      </div>

      {/* Feature Walkthrough */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            How Advanced Image Search Works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {demoSteps.map((step, index) => (
              <Card key={index} className={`border-2 transition-all cursor-pointer ${
                currentStep === index ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 hover:border-gray-300'
              }`} onClick={() => setCurrentStep(index)}>
                <CardContent className="p-4 text-center space-y-3">
                  <div className="mx-auto w-fit text-blue-600">
                    {step.icon}
                  </div>
                  <h3 className="font-semibold text-sm">{step.title}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {step.description}
                  </p>
                  <div className="space-y-1">
                    {step.features.map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs mx-1">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Technical Stack Status */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Integration Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {techStack.map((tech, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{tech.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{tech.description}</p>
                </div>
                <Badge variant="secondary" className={
                  tech.status === 'active' ? 'bg-green-100 text-green-800' :
                  tech.status === 'integrated' ? 'bg-blue-100 text-blue-800' :
                  tech.status === 'optimized' ? 'bg-purple-100 text-purple-800' :
                  'bg-yellow-100 text-yellow-800'
                }>
                  {tech.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Example Results Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Example Search Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert className="border-blue-200 bg-blue-50">
              <Camera className="h-4 w-4" />
              <AlertDescription>
                <strong>Demo Scenario:</strong> User uploads image of electronics → AI detects "smartphone", "technology", "device" → 
                System matches local products → Results sorted by distance
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {exampleResults.map((result, index) => (
                <Card key={index} className="border hover:shadow-md transition-shadow">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-sm">{result.product}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {result.confidence}% match
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Store:</span>
                        <span>{result.store}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Distance:</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {result.distance}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-semibold text-green-600">{result.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rating:</span>
                        <span>⭐ {result.rating}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <div className="text-center space-y-4">
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
          <Camera className="h-4 w-4 mr-2" />
          Try Advanced Image Search
        </Button>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Experience the future of visual product discovery for local commerce
        </p>
      </div>
    </div>
  );
}