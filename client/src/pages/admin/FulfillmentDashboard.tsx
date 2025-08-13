import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  Truck, Package, MapPin, Clock, 
  RotateCcw, Calculator, Users, Building,
  CheckCircle, AlertCircle, Package2
} from "lucide-react";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface FulfillmentOps {
  serviceable_zips: number;
  pickup_centers: number;
  total_capacity: number;
  couriers: number;
  returns_open: number;
  returns_total: number;
  avg_eta_mins: number[];
  last_updated: string;
}

interface PickupCenter {
  id: string;
  name: string;
  zip: string;
  address: string;
  hours: string;
  capacity: number;
  lat?: number;
  lng?: number;
}

interface Courier {
  id: string;
  name: string;
  kind: string;
  base_fee: number;
  per_km: number;
  per_kg: number;
  sla_mins: number[];
}

interface Quote {
  courier_id: string;
  courier_name: string;
  kind: string;
  price: number;
  eta_mins: number[];
  serviceable: boolean;
  distance_km: number;
}

export default function FulfillmentDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [quoteForm, setQuoteForm] = useState({
    from_zip: "",
    to_zip: "",
    weight_kg: 1.0
  });
  const [newCenter, setNewCenter] = useState({
    name: "",
    zip: "",
    address: "",
    hours: "10–8",
    capacity: 200
  });

  // Fetch fulfillment operations summary
  const { data: opsData, refetch: refetchOps } = useQuery<FulfillmentOps>({
    queryKey: ['/api/fulfillment/ops'],
    queryFn: async () => {
      const response = await fetch('/api/fulfillment/ops');
      return response.json();
    }
  });

  // Fetch pickup centers
  const { data: pickupData, refetch: refetchPickup } = useQuery({
    queryKey: ['/api/fulfillment/pickup-centers'],
    queryFn: async () => {
      const response = await fetch('/api/fulfillment/pickup-centers');
      return response.json();
    }
  });

  // Fetch couriers
  const { data: couriersData, refetch: refetchCouriers } = useQuery({
    queryKey: ['/api/fulfillment/couriers'],
    queryFn: async () => {
      const response = await fetch('/api/fulfillment/couriers');
      return response.json();
    }
  });

  // Fetch returns
  const { data: returnsData, refetch: refetchReturns } = useQuery({
    queryKey: ['/api/fulfillment/returns'],
    queryFn: async () => {
      const response = await fetch('/api/fulfillment/returns');
      return response.json();
    }
  });

  // Get shipping quote
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [quoteLoading, setQuoteLoading] = useState(false);

  const getShippingQuote = async () => {
    if (!quoteForm.from_zip || !quoteForm.to_zip) return;
    
    setQuoteLoading(true);
    try {
      const params = new URLSearchParams({
        from_zip: quoteForm.from_zip,
        to_zip: quoteForm.to_zip,
        weight_kg: quoteForm.weight_kg.toString()
      });
      const response = await fetch(`/api/fulfillment/quote?${params}`);
      const data = await response.json();
      setQuotes(data.quotes || []);
    } catch (error) {
      console.error('Quote error:', error);
    } finally {
      setQuoteLoading(false);
    }
  };

  const addPickupCenter = async () => {
    if (!newCenter.name || !newCenter.zip) return;
    
    try {
      const response = await fetch('/api/fulfillment/pickup-centers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCenter)
      });
      
      if (response.ok) {
        setNewCenter({ name: "", zip: "", address: "", hours: "10–8", capacity: 200 });
        refetchPickup();
        refetchOps();
      }
    } catch (error) {
      console.error('Add center error:', error);
    }
  };

  const ops = opsData;
  const pickupCenters = pickupData?.pickup_centers || [];
  const couriers = couriersData?.couriers || [];
  const returns = returnsData?.returns || [];

  // Data for charts
  const courierTypeData = couriers.reduce((acc: any, courier: Courier) => {
    acc[courier.kind] = (acc[courier.kind] || 0) + 1;
    return acc;
  }, {});

  const courierChartData = Object.entries(courierTypeData).map(([kind, count]) => ({
    kind: kind.charAt(0).toUpperCase() + kind.slice(1),
    count
  }));

  const returnsStatusData = returns.reduce((acc: any, ret: any) => {
    acc[ret.status] = (acc[ret.status] || 0) + 1;
    return acc;
  }, {});

  const returnsChartData = Object.entries(returnsStatusData).map(([status, count]) => ({
    status: status.charAt(0).toUpperCase() + status.slice(1),
    count
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Fulfillment Dashboard</h1>
              <p className="text-gray-600 mt-1">Local Commerce Logistics Hub</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => {
                refetchOps();
                refetchPickup();
                refetchCouriers();
                refetchReturns();
              }} className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Refresh All
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        {ops && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Serviceable Areas</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{ops.serviceable_zips}</div>
                <p className="text-xs text-muted-foreground">ZIP codes covered</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pickup Centers</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{ops.pickup_centers}</div>
                <p className="text-xs text-muted-foreground">{ops.total_capacity} total capacity</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Courier Partners</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{ops.couriers}</div>
                <p className="text-xs text-muted-foreground">Active integrations</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Returns</CardTitle>
                <RotateCcw className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{ops.returns_open}</div>
                <p className="text-xs text-muted-foreground">of {ops.returns_total} total</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="quote">Quote Tool</TabsTrigger>
            <TabsTrigger value="centers">Centers</TabsTrigger>
            <TabsTrigger value="couriers">Couriers</TabsTrigger>
            <TabsTrigger value="returns">Returns</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Courier Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={courierChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                          label={({kind, count}) => `${kind}: ${count}`}
                        >
                          {courierChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Returns Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={returnsChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="status" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="quote" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Shipping Quote Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>From ZIP Code</Label>
                    <Input
                      placeholder="55101"
                      value={quoteForm.from_zip}
                      onChange={(e) => setQuoteForm(prev => ({ ...prev, from_zip: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>To ZIP Code</Label>
                    <Input
                      placeholder="55415"
                      value={quoteForm.to_zip}
                      onChange={(e) => setQuoteForm(prev => ({ ...prev, to_zip: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Weight (kg)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={quoteForm.weight_kg}
                      onChange={(e) => setQuoteForm(prev => ({ ...prev, weight_kg: parseFloat(e.target.value) || 1.0 }))}
                    />
                  </div>
                </div>
                <Button onClick={getShippingQuote} disabled={quoteLoading}>
                  {quoteLoading ? 'Getting Quotes...' : 'Get Shipping Quotes'}
                </Button>

                {quotes.length > 0 && (
                  <div className="space-y-3 mt-6">
                    <h4 className="font-medium">Available Options:</h4>
                    {quotes.map((quote, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h5 className="font-medium">{quote.courier_name}</h5>
                            <p className="text-sm text-gray-600 capitalize">{quote.kind} delivery</p>
                            <p className="text-xs text-gray-500">
                              {quote.distance_km}km • ETA: {quote.eta_mins[0]}-{quote.eta_mins[1]} mins
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">${quote.price}</div>
                            <Badge variant={quote.serviceable ? "default" : "secondary"}>
                              {quote.serviceable ? "Same-Day" : "Standard"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="centers" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Pickup Center</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Center Name</Label>
                    <Input
                      placeholder="SPIRAL Center — Location"
                      value={newCenter.name}
                      onChange={(e) => setNewCenter(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>ZIP Code</Label>
                      <Input
                        placeholder="55101"
                        value={newCenter.zip}
                        onChange={(e) => setNewCenter(prev => ({ ...prev, zip: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>Capacity</Label>
                      <Input
                        type="number"
                        value={newCenter.capacity}
                        onChange={(e) => setNewCenter(prev => ({ ...prev, capacity: parseInt(e.target.value) || 200 }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Address</Label>
                    <Textarea
                      placeholder="Street address"
                      value={newCenter.address}
                      onChange={(e) => setNewCenter(prev => ({ ...prev, address: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Hours</Label>
                    <Input
                      placeholder="10–8"
                      value={newCenter.hours}
                      onChange={(e) => setNewCenter(prev => ({ ...prev, hours: e.target.value }))}
                    />
                  </div>
                  <Button onClick={addPickupCenter} className="w-full">
                    Add Pickup Center
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Existing Centers ({pickupCenters.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pickupCenters.map((center: PickupCenter) => (
                      <div key={center.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium">{center.name}</h5>
                            <p className="text-sm text-gray-600">{center.address}</p>
                            <p className="text-xs text-gray-500">
                              ZIP {center.zip} • {center.hours} • Capacity: {center.capacity}
                            </p>
                          </div>
                          <Badge variant="outline">{center.id}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="couriers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Courier Partners ({couriers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {couriers.map((courier: Courier) => (
                    <div key={courier.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium">{courier.name}</h5>
                          <p className="text-sm text-gray-600 capitalize">{courier.kind} courier</p>
                          <p className="text-xs text-gray-500">
                            Base: ${courier.base_fee} • ${courier.per_km}/km • ${courier.per_kg}/kg
                          </p>
                          <p className="text-xs text-gray-500">
                            SLA: {courier.sla_mins[0]}-{courier.sla_mins[1]} minutes
                          </p>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {courier.kind}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="returns" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Returns Management ({returns.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {returns.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Package2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No returns to display</p>
                    </div>
                  ) : (
                    returns.slice(0, 10).map((ret: any) => (
                      <div key={ret.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium">Return {ret.id}</h5>
                            <p className="text-sm text-gray-600">Order: {ret.order_id}</p>
                            <p className="text-xs text-gray-500">
                              Reason: {ret.reason} • Method: {ret.method}
                            </p>
                            <p className="text-xs text-gray-500">
                              Created: {new Date(ret.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge 
                              variant={ret.status === 'authorized' ? 'default' : ret.status === 'closed' ? 'secondary' : 'outline'}
                            >
                              {ret.status.charAt(0).toUpperCase() + ret.status.slice(1)}
                            </Badge>
                            <div className="mt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(ret.label_url, '_blank')}
                              >
                                Download Label
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}