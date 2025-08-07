import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Info, Upload } from 'lucide-react';
import ImageSearchUpload from '../components/ImageSearchUpload';
import AdvancedImageSearchDemo from '../components/AdvancedImageSearchDemo';

export default function AdvancedImageSearchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Camera className="h-12 w-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Advanced AI Image Search
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Revolutionary visual product discovery powered by Google Cloud Vision API, 
            IBM Cloudant database, and intelligent location services.
          </p>
        </div>

        {/* Tabs for Upload and Demo */}
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload & Search
            </TabsTrigger>
            <TabsTrigger value="demo" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              Technology Demo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <ImageSearchUpload />
          </TabsContent>

          <TabsContent value="demo">
            <AdvancedImageSearchDemo />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}