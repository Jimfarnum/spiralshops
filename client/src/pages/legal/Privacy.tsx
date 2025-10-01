import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Shield } from "lucide-react";
import { Link } from "wouter";

export default function Privacy() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/legal/privacy.html")
      .then(res => res.text())
      .then(setContent)
      .finally(() => setLoading(false));
  }, []);

  const downloadMarkdown = () => {
    window.open("/api/legal/privacy.md", "_blank");
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
              <p className="text-gray-600">How SPIRAL protects and uses your information</p>
              <div className="flex gap-2 mt-3">
                <Badge variant="secondary">MCDPA Compliant</Badge>
                <Badge variant="secondary">CCPA/CPRA</Badge>
                <Badge variant="secondary">GDPR</Badge>
              </div>
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
              <Shield className="h-5 w-5 mr-2 text-green-600" />
              Privacy Policy & Data Protection
            </CardTitle>
            <CardDescription>
              We are committed to protecting your privacy and complying with applicable data protection laws,
              including the Minnesota Consumer Data Privacy Act (MCDPA), CCPA, and GDPR.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading privacy policy...</p>
              </div>
            ) : (
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Rights</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1">
                <li>• Access your personal data</li>
                <li>• Correct inaccurate information</li>
                <li>• Delete your data</li>
                <li>• Data portability</li>
                <li>• Opt-out of targeted ads</li>
                <li>• Challenge automated decisions</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Data Protection</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1">
                <li>• We don't sell your personal data</li>
                <li>• Explicit consent for sensitive data</li>
                <li>• Secure data processing</li>
                <li>• Limited data retention</li>
                <li>• COPPA compliance</li>
                <li>• Regular security audits</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Privacy questions or data requests? Contact us at{" "}
            <a href="mailto:privacy@spiralshops.com" className="text-blue-600 underline">
              privacy@spiralshops.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}