import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LocalPickupScheduler from "@/components/LocalPickupScheduler";
import RetailerMessaging from "@/components/RetailerMessaging";
import MallMapViewer from "@/components/MallMapViewer";
import LargeRetailerOptIn from "@/components/LargeRetailerOptIn";
import RetailerAboutSection from "@/components/RetailerAboutSection";
import { 
  Calendar, 
  MessageCircle, 
  Map, 
  Building2, 
  Store, 
  CheckCircle, 
  ArrowRight,
  Users,
  Clock,
  Navigation
} from "lucide-react";

export default function Feature17Demo() {
  const demoUserId = "demo-user-001";
  const demoRetailerId = 1;
  const demoMallId = 1;

  const features = [
    {
      id: 1,
      title: "Local Pickup Scheduling",
      description: "Schedule convenient pickup times directly with retailers",
      icon: Calendar,
      component: "LocalPickupScheduler",
      status: "Complete",
      benefits: ["No shipping fees", "Faster access", "Personal service"]
    },
    {
      id: 2,
      title: "Retailer Messaging System",
      description: "Direct communication between customers and retailers",
      icon: MessageCircle,
      component: "RetailerMessaging",
      status: "Complete",
      benefits: ["Real-time chat", "Order support", "Product questions"]
    },
    {
      id: 3,
      title: "Interactive Mall Maps",
      description: "Navigate malls with interactive store locator maps",
      icon: Map,
      component: "MallMapViewer",
      status: "Complete",
      benefits: ["Visual navigation", "Store details", "Smart directions"]
    },
    {
      id: 4,
      title: "Enhanced Retailer Profiles",
      description: "Comprehensive retailer information and contact details",
      icon: Store,
      component: "RetailerAboutSection",
      status: "Complete",
      benefits: ["Business hours", "Contact info", "Specialties"]
    },
    {
      id: 5,
      title: "Large Retailer Opt-In",
      description: "User preference system for including major retailers",
      icon: Building2,
      component: "LargeRetailerOptIn",
      status: "Complete",
      benefits: ["User choice", "Local priority", "Mixed shopping"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="bg-[var(--spiral-navy)] text-white mb-4">
            Feature 17: Unified Enhancement Bundle
          </Badge>
          <h1 className="text-4xl font-bold text-[var(--spiral-navy)] mb-4">
            Complete Enhancement Package
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A comprehensive suite of features designed to enhance the shopping experience 
            with local pickup scheduling, retailer communication, interactive mall navigation, 
            enhanced profiles, and user preference management.
          </p>
        </div>

        {/* Feature Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature) => (
            <Card key={feature.id} className="bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <feature.icon className="w-8 h-8 text-[var(--spiral-navy)]" />
                  <Badge 
                    variant={feature.status === "Complete" ? "default" : "secondary"}
                    className={feature.status === "Complete" ? "bg-green-500" : ""}
                  >
                    {feature.status}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2 mb-4">
                  {feature.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full border-[var(--spiral-navy)] text-[var(--spiral-navy)] hover:bg-[var(--spiral-navy)] hover:text-white"
                  onClick={() => {
                    const element = document.getElementById(feature.component);
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Try Demo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Live Demos */}
        <div className="space-y-16">
          {/* Local Pickup Scheduling Demo */}
          <section id="LocalPickupScheduler" className="scroll-mt-8">
            <div className="text-center mb-8">
              <Badge className="bg-green-500 text-white mb-4">
                <Calendar className="w-4 h-4 mr-2" />
                Local Pickup Scheduling
              </Badge>
              <h2 className="text-2xl font-bold text-[var(--spiral-navy)] mb-4">
                Schedule Your Pickup Time
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Choose convenient pickup windows directly with retailers. No shipping fees, 
                faster access to your items, and personal customer service.
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              <LocalPickupScheduler 
                retailerId={demoRetailerId}
                orderId={123}
                onScheduled={(pickup) => console.log("Pickup scheduled:", pickup)}
              />
            </div>
          </section>

          {/* Retailer Messaging Demo */}
          <section id="RetailerMessaging" className="scroll-mt-8">
            <div className="text-center mb-8">
              <Badge className="bg-blue-500 text-white mb-4">
                <MessageCircle className="w-4 h-4 mr-2" />
                Retailer Messaging System
              </Badge>
              <h2 className="text-2xl font-bold text-[var(--spiral-navy)] mb-4">
                Chat With Retailers
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Direct communication channel between customers and retailers for 
                product questions, order support, and personalized assistance.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg">
              <RetailerMessaging 
                currentUserId={demoUserId}
                currentUserType="user"
                retailerId="retailer-001"
              />
            </div>
          </section>

          {/* Mall Map Demo */}
          <section id="MallMapViewer" className="scroll-mt-8">
            <div className="text-center mb-8">
              <Badge className="bg-purple-500 text-white mb-4">
                <Map className="w-4 h-4 mr-2" />
                Interactive Mall Maps
              </Badge>
              <h2 className="text-2xl font-bold text-[var(--spiral-navy)] mb-4">
                Navigate With Interactive Maps
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Visual mall navigation with clickable store markers, detailed information, 
                and smart directions to help you find exactly what you're looking for.
              </p>
            </div>
            <MallMapViewer mallId={demoMallId} />
          </section>

          {/* Retailer About Section Demo */}
          <section id="RetailerAboutSection" className="scroll-mt-8">
            <div className="text-center mb-8">
              <Badge className="bg-orange-500 text-white mb-4">
                <Store className="w-4 h-4 mr-2" />
                Enhanced Retailer Profiles
              </Badge>
              <h2 className="text-2xl font-bold text-[var(--spiral-navy)] mb-4">
                Comprehensive Business Information
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Detailed retailer profiles with business hours, contact information, 
                specialties, and social media links to build customer relationships.
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <RetailerAboutSection 
                retailerId={demoRetailerId}
                isOwner={true}
              />
            </div>
          </section>

          {/* Large Retailer Opt-In Demo */}
          <section id="LargeRetailerOptIn" className="scroll-mt-8">
            <div className="text-center mb-8">
              <Badge className="bg-indigo-500 text-white mb-4">
                <Building2 className="w-4 h-4 mr-2" />
                Large Retailer Preferences
              </Badge>
              <h2 className="text-2xl font-bold text-[var(--spiral-navy)] mb-4">
                Customize Your Shopping Experience
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Choose whether to include major retailers alongside local businesses, 
                with local stores always getting priority and bonus SPIRAL rewards.
              </p>
            </div>
            <div className="max-w-5xl mx-auto">
              <LargeRetailerOptIn 
                userId={demoUserId}
                onToggle={(optedIn) => console.log("Large retailer opt-in:", optedIn)}
              />
            </div>
          </section>
        </div>

        {/* Feature Summary */}
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[var(--spiral-navy)] mb-4">
              Feature 17: Implementation Complete
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              All five components of the Unified Enhancement Bundle are now fully implemented 
              and integrated into the SPIRAL platform, providing comprehensive tools for 
              enhanced customer-retailer interactions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-[var(--spiral-navy)]">Enhanced Communication</h3>
              <p className="text-sm text-gray-600">Direct messaging and scheduling tools</p>
            </div>
            
            <div className="space-y-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Navigation className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-[var(--spiral-navy)]">Smart Navigation</h3>
              <p className="text-sm text-gray-600">Interactive maps and store discovery</p>
            </div>
            
            <div className="space-y-2">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-[var(--spiral-navy)]">Flexible Options</h3>
              <p className="text-sm text-gray-600">Pickup scheduling and retailer preferences</p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Button 
              onClick={() => window.location.href = '/'}
              className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-navy)] text-white px-8 py-3"
            >
              Return to Homepage
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}