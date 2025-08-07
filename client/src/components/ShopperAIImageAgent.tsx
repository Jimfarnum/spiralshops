import React, { useState, useEffect } from 'react';
import { Camera, Upload, MapPin, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { mobileConfig } from '../styles/mobile-config';

interface AIGuidanceStep {
  id: number;
  title: string;
  description: string;
  action?: string;
  completed: boolean;
}

export default function ShopperAIImageAgent() {
  const [file, setFile] = useState<File | null>(null);
  const [location, setLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiGuidance, setAiGuidance] = useState<string>('');
  const [isMobile, setIsMobile] = useState(false);

  const guidanceSteps: AIGuidanceStep[] = [
    { id: 1, title: 'Welcome to AI Image Search', description: 'I\'ll help you find products at local stores using just a photo!', completed: false },
    { id: 2, title: 'Enable Location Access', description: 'Allow location access so I can find stores near you', action: 'getLocation', completed: false },
    { id: 3, title: 'Upload Your Image', description: 'Drag and drop or tap to select a photo of what you\'re looking for', action: 'uploadImage', completed: false },
    { id: 4, title: 'AI Analysis in Progress', description: 'I\'m analyzing your image and searching local inventory...', completed: false },
    { id: 5, title: 'Results Found!', description: 'Here are local stores that have similar products', completed: false }
  ];

  useEffect(() => {
    setIsMobile(window.matchMedia(mobileConfig.breakpoints.mobile).matches);
    
    // Start AI guidance
    setAiGuidance("Hi! I'm your ShopperAI assistant. I'll guide you through finding products at local stores using AI image recognition. Let's start by enabling location access!");
    setCurrentStep(1);
  }, []);

  const getLocation = async () => {
    setIsProcessing(true);
    setAiGuidance("Getting your location to find nearby stores...");
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000
        });
      });
      
      const { latitude, longitude } = position.coords;
      setLocation({ latitude, longitude });
      setCurrentStep(2);
      setAiGuidance(`Great! I found your location. Now please upload an image of the product you're looking for. I can analyze photos of clothing, electronics, home goods, and more!`);
      
      // Mark step as completed
      guidanceSteps[1].completed = true;
    } catch (error) {
      setAiGuidance("I need location access to find stores near you. Please enable location permissions and try again.");
    }
    setIsProcessing(false);
  };

  const handleImageUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setCurrentStep(3);
    setAiGuidance(`Perfect! I can see you've uploaded "${uploadedFile.name}". Now I'll analyze this image and search for similar products at local stores. This usually takes 10-15 seconds.`);
    
    guidanceSteps[2].completed = true;
    await processImageSearch(uploadedFile);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      await handleImageUpload(droppedFile);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      await handleImageUpload(selectedFile);
    }
  };

  const processImageSearch = async (imageFile: File) => {
    if (!location) {
      setAiGuidance("I need your location first. Please enable location access.");
      return;
    }

    setIsProcessing(true);
    setCurrentStep(4);
    setAiGuidance("🔍 Analyzing your image with AI... I'm identifying products, colors, brands, and searching local store inventories.");

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('location', JSON.stringify(location));

    try {
      const response = await fetch('/api/live-test/mobile-image-search', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (data.success && data.data.length > 0) {
        setResults(data.data);
        setCurrentStep(5);
        setAiGuidance(`Excellent! I found ${data.data.length} local stores with similar products. The closest match is at ${data.data[0].name}, just ${data.data[0].distance} miles away!`);
        guidanceSteps[4].completed = true;
      } else {
        setAiGuidance("I couldn't find exact matches nearby, but I can help you search in a wider area or try a different image. Would you like to upload another photo?");
      }
    } catch (error) {
      setAiGuidance("Sorry, I encountered an issue analyzing your image. Please try uploading a different photo or check your internet connection.");
    }
    
    setIsProcessing(false);
  };

  const containerClass = isMobile ? mobileConfig.styles.container : 'max-w-2xl mx-auto px-4';
  const dropZoneClass = isMobile ? 
    `${mobileConfig.styles.imageUpload.dropZone} mobile-drop-zone` : 
    'border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors';

  return (
    <div className={`${containerClass} py-6`}>
      {/* AI Guidance Panel */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="bg-blue-600 rounded-full p-2 mt-1">
            <Camera className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-1">ShopperAI Assistant</h3>
            <p className="text-blue-800 text-sm leading-relaxed">{aiGuidance}</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Progress:</h4>
        <div className="space-y-2">
          {guidanceSteps.slice(0, Math.max(2, currentStep + 1)).map((step, index) => (
            <div key={step.id} className={`flex items-center gap-3 p-2 rounded ${index <= currentStep ? 'bg-green-50' : 'bg-gray-50'}`}>
              {step.completed ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : index === currentStep && isProcessing ? (
                <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
              ) : (
                <div className={`h-5 w-5 rounded-full border-2 ${index <= currentStep ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`} />
              )}
              <span className={`text-sm ${index <= currentStep ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Location Button */}
      {currentStep >= 1 && !location && (
        <button
          onClick={getLocation}
          disabled={isProcessing}
          className={`w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold mb-4 flex items-center justify-center gap-2 ${isProcessing ? 'opacity-50' : 'hover:bg-blue-700'} ${isMobile ? 'mobile-button' : ''}`}
        >
          <MapPin className="h-5 w-5" />
          {isProcessing ? 'Getting Location...' : 'Enable Location Access'}
        </button>
      )}

      {/* Image Upload Area */}
      {currentStep >= 2 && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className={dropZoneClass}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload"
          />
          
          {file ? (
            <div className={isMobile ? mobileConfig.styles.imageUpload.selectedFile : 'p-4 bg-green-50 rounded border'}>
              <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-green-800 font-medium">Selected: {file.name}</p>
              <p className="text-green-600 text-sm mt-1">Ready to search!</p>
            </div>
          ) : (
            <label htmlFor="image-upload" className="cursor-pointer block">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                {isMobile ? 'Tap to select an image' : 'Drag and drop an image here, or click to select'}
              </p>
              <p className="text-sm text-gray-500">
                Supports JPG, PNG, WEBP formats
              </p>
            </label>
          )}
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className={`mt-6 ${isMobile ? 'mobile-results' : ''}`}>
          <h3 className="text-lg font-semibold mb-4">🎯 Local Stores Found:</h3>
          <div className={isMobile ? mobileConfig.styles.results.list : 'space-y-4'}>
            {results.map((item, idx) => (
              <div key={idx} className={isMobile ? `${mobileConfig.styles.results.item} mobile-result-item` : 'bg-white p-4 rounded-lg shadow border'}>
                <div className={isMobile ? mobileConfig.styles.results.storeName : 'font-bold text-lg text-gray-900'}>
                  {item.name}
                </div>
                <div className={isMobile ? mobileConfig.styles.results.distance : 'text-blue-600 font-medium'}>
                  📍 {item.distance} miles away
                </div>
                <a
                  href={item.directions}
                  target="_blank"
                  rel="noreferrer"
                  className={isMobile ? mobileConfig.styles.results.directions : 'inline-block mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'}
                >
                  Get Directions →
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}