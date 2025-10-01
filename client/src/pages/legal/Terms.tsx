import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, ExternalLink } from "lucide-react";
import { Link } from "wouter";

export default function Terms() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/legal/terms.html")
      .then(res => res.text())
      .then(setContent)
      .finally(() => setLoading(false));
  }, []);

  const downloadMarkdown = () => {
    window.open("/api/legal/terms.md", "_blank");
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
              <p className="text-gray-600">SPIRAL LLC - Minnesota Limited Liability Company</p>
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
              Legal Terms and Conditions
              <ExternalLink className="h-4 w-4 ml-2 text-gray-500" />
            </CardTitle>
            <CardDescription>
              These terms govern your use of SPIRAL's marketplace platform and services.
              By using our services, you agree to these terms.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading terms...</p>
              </div>
            ) : (
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}
          </CardContent>
        </Card>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Electronic Signature Notice</h3>
          <p className="text-blue-800 text-sm">
            These terms constitute a legally binding agreement. By creating an account or using our services, 
            you provide your electronic signature under the U.S. E-SIGN Act and Minnesota UETA.
          </p>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Questions about our terms? Contact us at{" "}
            <a href="mailto:support@spiralshops.com" className="text-blue-600 underline">
              support@spiralshops.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}