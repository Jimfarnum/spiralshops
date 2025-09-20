import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Clock, Calendar, User, Phone, FileText, CheckCircle } from "lucide-react";

interface PickupWindow {
  id: number;
  retailerId: number;
  startTime: string;
  endTime: string;
  capacity: number;
  booked: number;
  dayOfWeek: number;
  isActive: boolean;
}

interface LocalPickupSchedulerProps {
  retailerId: number;
  orderId?: number;
  onScheduled?: (pickup: any) => void;
}

export default function LocalPickupScheduler({ 
  retailerId, 
  orderId, 
  onScheduled 
}: LocalPickupSchedulerProps) {
  const [availableWindows, setAvailableWindows] = useState<PickupWindow[]>([]);
  const [selectedWindow, setSelectedWindow] = useState<string>("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledPickup, setScheduledPickup] = useState<any>(null);
  const { toast } = useToast();

  const userId = "demo-user-001";

  useEffect(() => {
    fetchAvailableWindows();
  }, [retailerId]);

  const fetchAvailableWindows = async () => {
    try {
      const response = await fetch(`/api/pickups/windows/${retailerId}`);
      if (response.ok) {
        const data = await response.json();
        setAvailableWindows(data.windows || []);
      }
    } catch (error) {
      console.error("Error fetching pickup windows:", error);
      toast({
        title: "Error",
        description: "Failed to load available pickup times",
        variant: "destructive"
      });
    }
  };

  const schedulePickup = async () => {
    if (!selectedWindow || !customerName || !customerPhone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/pickups/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          orderId,
          windowId: parseInt(selectedWindow),
          customerName,
          customerPhone,
          specialInstructions
        })
      });

      if (response.ok) {
        const data = await response.json();
        setScheduledPickup(data.pickup);
        setIsScheduled(true);
        
        toast({
          title: "Pickup Scheduled!",
          description: "Your pickup time has been confirmed",
        });

        if (onScheduled) {
          onScheduled(data.pickup);
        }
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to schedule pickup");
      }
    } catch (error) {
      console.error("Error scheduling pickup:", error);
      toast({
        title: "Scheduling Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeSlot = (window: PickupWindow) => {
    const start = new Date(`2024-01-01T${window.startTime}`);
    const end = new Date(`2024-01-01T${window.endTime}`);
    const available = window.capacity - window.booked;
    
    return `${start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} (${available} slots available)`;
  };

  const getDayName = (dayOfWeek: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayOfWeek];
  };

  if (isScheduled && scheduledPickup) {
    return (
      <Card className="bg-white shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-xl text-green-700">
            Pickup Scheduled Successfully!
          </CardTitle>
          <CardDescription>
            Your order is ready for pickup at the scheduled time
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Customer:</strong> {scheduledPickup.customerName}
              </div>
              <div>
                <strong>Phone:</strong> {scheduledPickup.customerPhone}
              </div>
              <div>
                <strong>Status:</strong> 
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {scheduledPickup.status}
                </span>
              </div>
              <div>
                <strong>Scheduled:</strong> {new Date(scheduledPickup.scheduledAt).toLocaleDateString()}
              </div>
            </div>
            
            {scheduledPickup.specialInstructions && (
              <div className="mt-3 pt-3 border-t border-green-200">
                <strong>Special Instructions:</strong>
                <p className="text-gray-700 mt-1">{scheduledPickup.specialInstructions}</p>
              </div>
            )}
          </div>

          <div className="text-center pt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsScheduled(false)}
              className="mr-2"
            >
              Schedule Another Pickup
            </Button>
            <Button 
              onClick={() => window.location.href = '/orders'}
              className="bg-[var(--spiral-navy)] hover:bg-[var(--spiral-coral)]"
            >
              View My Orders
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[var(--spiral-navy)]" />
          Schedule Local Pickup
        </CardTitle>
        <CardDescription>
          Choose a convenient time to pick up your order in-store
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Available Time Slots */}
        <div>
          <Label htmlFor="time-slot" className="text-base font-semibold mb-2 block">
            <Clock className="w-4 h-4 inline mr-2" />
            Select Pickup Time
          </Label>
          <Select value={selectedWindow} onValueChange={setSelectedWindow}>
            <SelectTrigger>
              <SelectValue placeholder="Choose an available time slot" />
            </SelectTrigger>
            <SelectContent>
              {availableWindows.length === 0 ? (
                <SelectItem value="none" disabled>No pickup slots available</SelectItem>
              ) : (
                availableWindows.map((window) => (
                  <SelectItem 
                    key={window.id} 
                    value={window.id.toString()}
                    disabled={window.booked >= window.capacity}
                  >
                    {getDayName(window.dayOfWeek)} - {formatTimeSlot(window)}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Customer Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="customer-name" className="text-base font-semibold mb-2 block">
              <User className="w-4 h-4 inline mr-2" />
              Full Name *
            </Label>
            <Input
              id="customer-name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="customer-phone" className="text-base font-semibold mb-2 block">
              <Phone className="w-4 h-4 inline mr-2" />
              Phone Number *
            </Label>
            <Input
              id="customer-phone"
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="(555) 123-4567"
              required
            />
          </div>
        </div>

        {/* Special Instructions */}
        <div>
          <Label htmlFor="special-instructions" className="text-base font-semibold mb-2 block">
            <FileText className="w-4 h-4 inline mr-2" />
            Special Instructions (Optional)
          </Label>
          <Textarea
            id="special-instructions"
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="Any special pickup instructions or notes..."
            rows={3}
          />
        </div>

        {/* Schedule Button */}
        <div className="pt-4 border-t">
          <Button
            onClick={schedulePickup}
            disabled={isLoading || !selectedWindow || !customerName || !customerPhone}
            className="w-full bg-[var(--spiral-navy)] hover:bg-[var(--spiral-coral)] text-white"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Scheduling...
              </>
            ) : (
              "Schedule Pickup"
            )}
          </Button>
        </div>

        {/* Info Text */}
        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          <strong>Pickup Information:</strong>
          <ul className="mt-2 space-y-1 text-xs">
            <li>• Please bring a valid ID and your order confirmation</li>
            <li>• Arrive during your scheduled time window</li>
            <li>• Contact the store if you need to reschedule</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}