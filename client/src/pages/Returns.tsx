import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, FileText, RefreshCw, ArrowLeft } from "lucide-react";

interface ReturnRequest {
  id?: string;
  order_id: string;
  retailer_id?: string;
  reason?: string;
  method: "dropoff" | "pickup";
  customer_zip?: string;
  pickup_center_id?: string;
  label_url?: string;
  created_at?: string;
  status?: string;
}

export default function Returns() {
  const [orderId, setOrderId] = useState("");
  const [retailerId, setRetailerId] = useState("");
  const [customerZip, setCustomerZip] = useState("");
  const [method, setMethod] = useState<"dropoff" | "pickup">("dropoff");
  const [reason, setReason] = useState("");
  const [result, setResult] = useState<ReturnRequest | null>(null);
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createReturn = async () => {
    if (!orderId.trim()) {
      setError("Order ID is required");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const payload: Partial<ReturnRequest> = {
        order_id: orderId.trim(),
        method,
        customer_zip: customerZip.trim() || undefined,
        reason: reason.trim() || "Customer requested return"
      };

      if (retailerId.trim()) {
        payload.retailer_id = retailerId.trim();
      }

      const response = await fetch('/api/fulfillment/returns/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult(data);
        setError("");
        // Clear form
        setOrderId("");
        setRetailerId("");
        setCustomerZip("");
        setReason("");
      } else {
        setError(data.error || 'Failed to create return');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const listReturns = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/fulfillment/returns');
      const data = await response.json();
      
      if (response.ok) {
        setReturns(Array.isArray(data) ? data : []);
      } else {
        setError('Failed to fetch returns');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Package className="h-6 w-6 text-blue-600" />
                <CardTitle className="text-2xl">Return an Order</CardTitle>
              </div>
              <Button variant="outline" onClick={() => window.location.href = '/'}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </div>
            <p className="text-gray-600">
              Start a return for your SPIRAL order. You'll receive a return label and tracking information.
            </p>
          </CardHeader>
        </Card>

        {/* Create Return Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create New Return</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Order ID *</label>
                <Input
                  placeholder="e.g. ORDER-123456"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Retailer ID (optional)</label>
                <Input
                  placeholder="e.g. ret-electronics-plus"
                  value={retailerId}
                  onChange={(e) => setRetailerId(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Your ZIP Code</label>
                <Input
                  placeholder="e.g. 55101"
                  value={customerZip}
                  onChange={(e) => setCustomerZip(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Return Method</label>
                <Select value={method} onValueChange={(value: "dropoff" | "pickup") => setMethod(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dropoff">Drop off at SPIRAL Center</SelectItem>
                    <SelectItem value="pickup">Schedule pickup</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Reason for Return (optional)</label>
              <Input
                placeholder="e.g. Defective item, Wrong size, Changed mind"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700">
                {error}
              </div>
            )}

            <Button 
              onClick={createReturn} 
              disabled={loading}
              className="w-full md:w-auto"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Package className="h-4 w-4 mr-2" />
                  Create Return
                </>
              )}
            </Button>

            <p className="text-sm text-gray-500">
              You will receive a return ID and downloadable label (PDF). For dropoff, you can use any SPIRAL Pickup Center in your area.
            </p>
          </CardContent>
        </Card>

        {/* Return Result */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">Return Created Successfully</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
                <div><strong>Return ID:</strong> {result.id}</div>
                <div><strong>Order ID:</strong> {result.order_id}</div>
                <div><strong>Method:</strong> {result.method}</div>
                <div><strong>Status:</strong> {result.status}</div>
                <div><strong>Created:</strong> {result.created_at ? new Date(result.created_at).toLocaleString() : 'N/A'}</div>
                {result.label_url && (
                  <div className="pt-2">
                    <Button asChild>
                      <a href={result.label_url} target="_blank" rel="noopener noreferrer">
                        <FileText className="h-4 w-4 mr-2" />
                        Download Return Label (PDF)
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Past Returns */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Your Past Returns</CardTitle>
              <Button variant="outline" onClick={listReturns} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {returns.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No returns found. Click Refresh to load your returns.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {returns.map((ret) => (
                  <div key={ret.id} className="border rounded-lg p-4 bg-white">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="font-medium">Return ID: {ret.id}</div>
                        <div className="text-sm text-gray-600">Order: {ret.order_id}</div>
                        <div className="text-sm text-gray-600">Method: {ret.method}</div>
                        <div className="text-sm text-gray-600">Status: {ret.status}</div>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        {ret.created_at ? new Date(ret.created_at).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                    {ret.label_url && (
                      <div className="mt-3">
                        <Button size="sm" asChild>
                          <a href={ret.label_url} target="_blank" rel="noopener noreferrer">
                            <FileText className="h-3 w-3 mr-1" />
                            Download Label
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-gray-500 py-4">
          <p>© SPIRAL — Tech that builds towns</p>
          <p className="text-sm mt-1">
            <a href="/admin/fulfillment" className="underline hover:text-gray-700">
              Admin Fulfillment Dashboard
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}