import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Gift, CreditCard, Mail, Calendar } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const giftCardSchema = z.object({
  senderName: z.string().min(1, "Sender name is required"),
  senderEmail: z.string().email().optional().or(z.literal("")),
  recipientEmail: z.string().email("Valid recipient email is required"),
  amount: z.number().min(5, "Minimum amount is $5").max(1000, "Maximum amount is $1000"),
  message: z.string().optional(),
  deliveryDate: z.string().optional(),
});

type GiftCardForm = z.infer<typeof giftCardSchema>;

export default function GiftCards() {
  const { toast } = useToast();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  
  const form = useForm<GiftCardForm>({
    resolver: zodResolver(giftCardSchema),
    defaultValues: {
      senderName: "",
      senderEmail: "",
      recipientEmail: "",
      amount: 25,
      message: "",
      deliveryDate: "",
    },
  });

  const purchaseMutation = useMutation({
    mutationFn: async (data: GiftCardForm) => {
      return await apiRequest("/api/gift-cards/purchase", "POST", data);
    },
    onSuccess: (response) => {
      toast({
        title: "Gift Card Purchased!",
        description: `Gift card ${response.giftCard.code} has been created and will be sent to ${response.giftCard.recipientEmail}`,
      });
      form.reset();
      setSelectedAmount(null);
      setCustomAmount("");
    },
    onError: (error: Error) => {
      toast({
        title: "Purchase Failed",
        description: error.message || "Failed to purchase gift card",
        variant: "destructive",
      });
    },
  });

  const presetAmounts = [10, 25, 50, 100];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
    form.setValue("amount", amount);
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      form.setValue("amount", numValue);
    }
  };

  const onSubmit = (data: GiftCardForm) => {
    purchaseMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Gift className="w-16 h-16 mx-auto mb-4 text-indigo-600" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">SPIRAL Gift Cards</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Give the gift of local shopping with SPIRAL Gift Cards. Perfect for any occasion, 
            redeemable at all participating stores and malls nationwide.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Purchase Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Purchase Gift Card
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Amount Selection */}
                  <div>
                    <FormLabel className="text-base font-semibold mb-4 block">Select Amount</FormLabel>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {presetAmounts.map((amount) => (
                        <Button
                          key={amount}
                          type="button"
                          variant={selectedAmount === amount ? "default" : "outline"}
                          onClick={() => handleAmountSelect(amount)}
                          className="text-lg py-6"
                        >
                          ${amount}
                        </Button>
                      ))}
                    </div>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="Custom amount ($5-$1000)"
                        value={customAmount}
                        onChange={(e) => handleCustomAmountChange(e.target.value)}
                        min={5}
                        max={1000}
                        className="pl-8"
                      />
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    </div>
                  </div>

                  {/* Sender Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Sender Information</h3>
                    <FormField
                      control={form.control}
                      name="senderName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Name *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter your name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="senderEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Email (Optional)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="your.email@example.com" type="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Recipient Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Recipient Information</h3>
                    <FormField
                      control={form.control}
                      name="recipientEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recipient Email *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="recipient@example.com" type="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Personal Message */}
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Personal Message (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Add a personal message to the gift card..."
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Delivery Date */}
                  <FormField
                    control={form.control}
                    name="deliveryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Date (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="date"
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full py-6 text-lg"
                    disabled={purchaseMutation.isPending}
                  >
                    {purchaseMutation.isPending ? "Processing..." : `Purchase Gift Card - $${form.watch("amount") || 0}`}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Gift Card Features */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gift Card Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Gift className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Multi-Retailer Redemption</h4>
                    <p className="text-sm text-gray-600">Use at any participating SPIRAL store or mall nationwide</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Digital Delivery</h4>
                    <p className="text-sm text-gray-600">Delivered instantly via email with unique redemption code</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">1 Year Expiration</h4>
                    <p className="text-sm text-gray-600">Valid for 12 months from purchase date</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Partial Redemption</h4>
                    <p className="text-sm text-gray-600">Use partial amounts and keep remaining balance for later</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center">1</div>
                  <span className="text-sm">Choose amount and recipient details</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center">2</div>
                  <span className="text-sm">Complete secure payment with Stripe</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center">3</div>
                  <span className="text-sm">Recipient receives email with gift card code</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center">4</div>
                  <span className="text-sm">Redeem at checkout on any SPIRAL purchase</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}