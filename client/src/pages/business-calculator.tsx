import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingUp, DollarSign, Target, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import Header from '@/components/header';
import Footer from '@/components/footer';

interface SalesCalculationResult {
  monthly_sales: number;
  sales_fee: number;
  ad_fee: number;
  total_cost: number;
  retailer_net: number;
  profit_margin: number;
}

interface ProjectionResult {
  projections: Array<{
    month: number;
    projected_sales: number;
    sales_fee: number;
    net_earnings: number;
  }>;
  summary: {
    total_projected_sales: number;
    total_fees: number;
    total_net: number;
  };
}

export default function BusinessCalculator() {
  const [monthlySales, setMonthlySales] = useState('');
  const [adClicks, setAdClicks] = useState('');
  const [costPerClick, setCostPerClick] = useState('');
  const [currentSales, setCurrentSales] = useState('');
  const [growthRate, setGrowthRate] = useState('');
  const [projectionMonths, setProjectionMonths] = useState('6');
  const [calculationResult, setCalculationResult] = useState<SalesCalculationResult | null>(null);
  const [projectionResult, setProjectionResult] = useState<ProjectionResult | null>(null);
  const { toast } = useToast();

  const calculateFeesMutation = useMutation({
    mutationFn: async (data: { monthly_sales: number; ad_clicks: number; cost_per_click: number }) => {
      return apiRequest('/api/business/calculate-fees', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
    },
    onSuccess: (result: SalesCalculationResult) => {
      setCalculationResult(result);
      toast({
        title: "Calculation Complete",
        description: `Your net earnings would be $${result.retailer_net.toFixed(2)}`,
      });
    },
    onError: () => {
      toast({
        title: "Calculation Failed",
        description: "Please check your input values and try again.",
        variant: "destructive"
      });
    }
  });

  const calculateProjectionsMutation = useMutation({
    mutationFn: async (data: { current_monthly_sales: number; projected_growth_rate: number; months: number }) => {
      return apiRequest('/api/business/projections', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
    },
    onSuccess: (result: ProjectionResult) => {
      setProjectionResult(result);
      toast({
        title: "Projections Complete",
        description: `Projected total net earnings: $${result.summary.total_net.toFixed(2)}`,
      });
    },
    onError: () => {
      toast({
        title: "Projection Failed",
        description: "Please check your input values and try again.",
        variant: "destructive"
      });
    }
  });

  const handleCalculate = () => {
    const sales = parseFloat(monthlySales);
    const clicks = parseInt(adClicks);
    const cpc = parseFloat(costPerClick);

    if (isNaN(sales) || isNaN(clicks) || isNaN(cpc) || sales < 0 || clicks < 0 || cpc < 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid positive numbers for all fields.",
        variant: "destructive"
      });
      return;
    }

    calculateFeesMutation.mutate({
      monthly_sales: sales,
      ad_clicks: clicks,
      cost_per_click: cpc
    });
  };

  const handleProjections = () => {
    const sales = parseFloat(currentSales);
    const growth = parseFloat(growthRate);
    const months = parseInt(projectionMonths);

    if (isNaN(sales) || isNaN(growth) || isNaN(months) || sales < 0 || growth < 0 || months < 1) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid positive numbers for all fields.",
        variant: "destructive"
      });
      return;
    }

    calculateProjectionsMutation.mutate({
      current_monthly_sales: sales,
      projected_growth_rate: growth,
      months: months
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Calculator className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">SPIRAL Business Calculator</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Calculate your potential earnings, fees, and business projections on the SPIRAL platform
          </p>
        </div>

        <Tabs defaultValue="calculator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Fee Calculator
            </TabsTrigger>
            <TabsTrigger value="projections" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Growth Projections
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Input Your Business Data
                  </CardTitle>
                  <CardDescription>
                    Enter your monthly sales and advertising costs to calculate fees
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="monthly-sales">Monthly Sales ($)</Label>
                    <Input
                      id="monthly-sales"
                      type="number"
                      placeholder="5000"
                      value={monthlySales}
                      onChange={(e) => setMonthlySales(e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ad-clicks">Monthly Ad Clicks</Label>
                    <Input
                      id="ad-clicks"
                      type="number"
                      placeholder="500"
                      value={adClicks}
                      onChange={(e) => setAdClicks(e.target.value)}
                      min="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cost-per-click">Cost Per Click ($)</Label>
                    <Input
                      id="cost-per-click"
                      type="number"
                      placeholder="0.50"
                      value={costPerClick}
                      onChange={(e) => setCostPerClick(e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <Button 
                    onClick={handleCalculate} 
                    className="w-full"
                    disabled={calculateFeesMutation.isPending}
                  >
                    {calculateFeesMutation.isPending ? 'Calculating...' : 'Calculate Fees'}
                  </Button>
                </CardContent>
              </Card>

              {calculationResult && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Your Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-600">Monthly Sales</p>
                        <p className="text-2xl font-bold text-blue-600">
                          ${calculationResult.monthly_sales.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <p className="text-sm text-gray-600">Total Costs</p>
                        <p className="text-2xl font-bold text-red-600">
                          ${calculationResult.total_cost.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Transaction Fee (5%)</span>
                        <span>${calculationResult.sales_fee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Advertising Fee</span>
                        <span>${calculationResult.ad_fee.toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-bold text-lg">
                        <span>Your Net Earnings</span>
                        <span className="text-green-600">${calculationResult.retailer_net.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Profit Margin</span>
                        <Badge variant="secondary">{calculationResult.profit_margin.toFixed(1)}%</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="projections" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Growth Planning
                  </CardTitle>
                  <CardDescription>
                    Project your future earnings based on growth expectations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="current-sales">Current Monthly Sales ($)</Label>
                    <Input
                      id="current-sales"
                      type="number"
                      placeholder="3000"
                      value={currentSales}
                      onChange={(e) => setCurrentSales(e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <Label htmlFor="growth-rate">Expected Growth Rate (%)</Label>
                    <Input
                      id="growth-rate"
                      type="number"
                      placeholder="15"
                      value={growthRate}
                      onChange={(e) => setGrowthRate(e.target.value)}
                      min="0"
                      max="500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="projection-months">Projection Period (Months)</Label>
                    <Input
                      id="projection-months"
                      type="number"
                      placeholder="6"
                      value={projectionMonths}
                      onChange={(e) => setProjectionMonths(e.target.value)}
                      min="1"
                      max="12"
                    />
                  </div>
                  <Button 
                    onClick={handleProjections} 
                    className="w-full"
                    disabled={calculateProjectionsMutation.isPending}
                  >
                    {calculateProjectionsMutation.isPending ? 'Calculating...' : 'Generate Projections'}
                  </Button>
                </CardContent>
              </Card>

              {projectionResult && (
                <Card>
                  <CardHeader>
                    <CardTitle>Projection Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-600">Total Sales</p>
                        <p className="text-lg font-bold text-blue-600">
                          ${projectionResult.summary.total_projected_sales.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <p className="text-sm text-gray-600">Total Fees</p>
                        <p className="text-lg font-bold text-red-600">
                          ${projectionResult.summary.total_fees.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-600">Net Earnings</p>
                        <p className="text-lg font-bold text-green-600">
                          ${projectionResult.summary.total_net.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      <h4 className="font-semibold mb-2">Monthly Breakdown</h4>
                      {projectionResult.projections.map((projection, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="font-medium">Month {projection.month}</span>
                          <div className="flex gap-4 text-sm">
                            <span>Sales: ${projection.projected_sales.toFixed(2)}</span>
                            <span>Net: ${projection.net_earnings.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Why Choose SPIRAL?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calculator className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Transparent Pricing</h3>
                <p className="text-sm text-gray-600">Simple 5% transaction fee with no hidden costs or monthly charges</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Growth Tools</h3>
                <p className="text-sm text-gray-600">Analytics, social sharing, and loyalty programs to boost your sales</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Local Focus</h3>
                <p className="text-sm text-gray-600">Connect with your local community and compete with national chains</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}