import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, RotateCcw } from "lucide-react";
import { Link } from "wouter";

export default function Refunds() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/legal/refunds.html")
      .then(res => res.text())
      .then(setContent)
      .finally(() => setLoading(false));
  }, []);

  const downloadMarkdown = () => {
    window.open("/api/legal/refunds.md", "_blank");
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Refunds & Returns</h1>
              <p className="text-gray-600">Your guide to returns, refunds, and buyer protection</p>
            </div>
            <Button onClick={downloadMarkdown} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <RotateCcw className="h-5 w-5 mr-2 text-blue-600" />
              Refunds & Returns Policy
            </CardTitle>
            <CardDescription>
              Understand how returns work on SPIRAL, including retailer policies and platform protections.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading refunds policy...</p>
              </div>
            ) : (
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Return Window</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Default 30 days from delivery or pickup date. Items must be in original condition.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Refund Process</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Initiate returns from Order History. Typical refund processing takes 7-10 business days.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Buyer Guarantee</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Platform-level protection when retailer resolution fails. File claims within 30 days.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-900 mb-2">Need Help with a Return?</h3>
          <p className="text-yellow-800 text-sm mb-3">
            If you're having trouble with a return or refund, our Buyer Guarantee can help.
          </p>
          <Link href="/legal/guarantee">
            <Button size="sm" variant="outline" className="border-yellow-300">
              View Buyer Guarantee →
            </Button>
          </Link>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Questions about returns? Contact us at{" "}
            <a href="mailto:support@spiralshops.com" className="text-blue-600 underline">
              support@spiralshops.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}