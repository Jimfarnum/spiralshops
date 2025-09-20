import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Shield, AlertCircle, CheckCircle } from "lucide-react";
import { Link } from "wouter";

export default function Guarantee() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/legal/guarantee.html")
      .then(res => res.text())
      .then(setContent)
      .finally(() => setLoading(false));
  }, []);

  const downloadMarkdown = () => {
    window.open("/api/legal/guarantee.md", "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">SPIRAL Buyer Guarantee</h1>
              <p className="text-gray-600">Platform-level buyer protection for peace of mind</p>
            </div>
            <Button onClick={downloadMarkdown} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <Shield className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <h3 className="font-semibold text-green-900">You're Protected</h3>
              <p className="text-green-800 text-sm">
                Every purchase on SPIRAL is covered by our Buyer Guarantee for added security.
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-blue-600" />
              Buyer Guarantee Details
            </CardTitle>
            <CardDescription>
              When retailer resolution fails, our platform-level guarantee provides additional protection.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading guarantee details...</p>
              </div>
            ) : (
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                What's Covered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  Items not received after expected delivery
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  Wrong, damaged, or defective items
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  Items materially not as described
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  Retailer fails to provide refund for valid return
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
                Not Covered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li className="flex items-start">
                  <AlertCircle className="h-4 w-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                  Buyer's remorse or change of mind
                </li>
                <li className="flex items-start">
                  <AlertCircle className="h-4 w-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                  Wear and tear after delivery
                </li>
                <li className="flex items-start">
                  <AlertCircle className="h-4 w-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                  Properly described non-returnable items
                </li>
                <li className="flex items-start">
                  <AlertCircle className="h-4 w-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                  Off-platform transactions or fraud
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">How to File a Claim</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-semibold">1</span>
                </div>
                <h4 className="font-semibold mb-1">Contact Retailer First</h4>
                <p className="text-sm text-gray-600">Try to resolve the issue directly with the retailer</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-semibold">2</span>
                </div>
                <h4 className="font-semibold mb-1">File Your Claim</h4>
                <p className="text-sm text-gray-600">Submit a claim within 30 days with evidence</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-semibold">3</span>
                </div>
                <h4 className="font-semibold mb-1">We Investigate</h4>
                <p className="text-sm text-gray-600">Our team reviews and provides appropriate remedy</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Need to file a guarantee claim? Contact us at{" "}
            <a href="mailto:guarantee@spiralshops.com" className="text-blue-600 underline">
              guarantee@spiralshops.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}