import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Gift, Star, ArrowRight, Home } from "lucide-react";

export default function PaymentSuccess() {
  const [, setLocation] = useLocation();
  const [orderNumber] = useState(`SPIRAL-${Date.now()}`);
  const [spiralPoints] = useState(25); // Example points earned

  useEffect(() => {
    // Update SPIRAL balance in localStorage
    const currentBalance = parseInt(localStorage.getItem("spiralBalance") || "0");
    localStorage.setItem("spiralBalance", (currentBalance + spiralPoints).toString());
  }, [spiralPoints]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Success Message */}
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardContent className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-green-800 mb-2">Payment Successful!</h1>
            <p className="text-green-700 mb-4">
              Thank you for supporting local businesses through SPIRAL
            </p>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Order #{orderNumber}
            </Badge>
          </CardContent>
        </Card>

        {/* SPIRAL Points Earned */}
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-blue-600" />
              SPIRAL Points Earned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">+{spiralPoints}</div>
              <p className="text-gray-700 mb-4">
                You earned {spiralPoints} SPIRALs for supporting local businesses!
              </p>
              <div className="bg-white p-4 rounded-lg border">
                <div className="text-sm text-gray-600 mb-2">Your SPIRAL Balance</div>
                <div className="text-2xl font-bold text-blue-600">
                  {parseInt(localStorage.getItem("spiralBalance") || "0")} SPIRALs
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Confirmation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-semibold text-gray-600">Order Number</div>
                <div className="font-mono">{orderNumber}</div>
              </div>
              <div>
                <div className="font-semibold text-gray-600">Payment Status</div>
                <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
              </div>
              <div>
                <div className="font-semibold text-gray-600">Delivery</div>
                <div>2-5 business days</div>
              </div>
              <div>
                <div className="font-semibold text-gray-600">Tracking</div>
                <div className="text-blue-600 cursor-pointer hover:underline">
                  Will be sent via email
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Gift className="w-4 h-4" />
                What's Next?
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Order confirmation email sent
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  SPIRAL points added to your account
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                  Items being prepared for shipping
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                  Tracking information will be provided
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Main Street Impact */}
        <Card className="mb-6 border-amber-200 bg-amber-50">
          <CardContent className="text-center py-6">
            <h3 className="text-lg font-bold text-amber-800 mb-2">
              🏪 You're Helping Revive Main Street!
            </h3>
            <p className="text-amber-700 text-sm mb-4">
              Your purchase directly supports local businesses and strengthens your community.
              Every SPIRAL transaction helps keep local commerce thriving.
            </p>
            <div className="flex justify-center gap-4 text-xs text-amber-600">
              <div>✓ Local jobs supported</div>
              <div>✓ Community strengthened</div>
              <div>✓ Main Street revived</div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={() => setLocation("/shopper-dashboard")}
            className="flex-1 flex items-center gap-2"
          >
            <Star className="w-4 h-4" />
            View Your SPIRALs
          </Button>
          <Button 
            variant="outline"
            onClick={() => setLocation("/")}
            className="flex-1 flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Continue Shopping
          </Button>
        </div>

        {/* Social Sharing Prompt */}
        <Card className="mt-6 border-purple-200 bg-purple-50">
          <CardContent className="text-center py-4">
            <h4 className="font-semibold text-purple-800 mb-2">
              Share Your Local Shopping Success!
            </h4>
            <p className="text-sm text-purple-700 mb-4">
              Tell your friends about supporting local businesses and earn bonus SPIRALs
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setLocation("/social-feed")}
              className="border-purple-300 text-purple-700 hover:bg-purple-100"
            >
              Share & Earn +5 SPIRALs
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}