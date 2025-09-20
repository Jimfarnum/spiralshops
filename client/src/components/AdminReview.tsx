import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, RotateCcw, Clock } from "lucide-react";

interface RetailerSubmission {
  _id: string;
  status: string;
  retailer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    hasPhysicalStore: boolean;
  };
  input: {
    selectedCategory: string;
    description: string;
    photoUrls: string[];
  };
  ai: {
    suggestedCategory: string;
    confidence: number;
    complianceFlags: string[];
    verification: {
      onlinePresenceFound: boolean;
      signals: string[];
    };
    decision: string;
  };
  admin: {
    reviewer: string | null;
    action: string | null;
    notes: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

export default function AdminReview() {
  const [items, setItems] = useState<RetailerSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reviews?status=${filter}`);
      const data = await res.json();
      setItems(data.items || []);
    } catch (error) {
      console.error("Failed to load reviews:", error);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, [filter]);

  async function approve(id: string, category: string) {
    try {
      await fetch(`/api/admin/review/${id}/approve`, {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category })
      });
      load();
    } catch (error) {
      console.error("Failed to approve:", error);
    }
  }

  async function deny(id: string, reason: string) {
    try {
      await fetch(`/api/admin/review/${id}/deny`, {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason })
      });
      load();
    } catch (error) {
      console.error("Failed to deny:", error);
    }
  }

  async function reclassify(id: string, category: string, notes: string) {
    try {
      await fetch(`/api/admin/review/${id}/reclassify`, {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, notes })
      });
      load();
    } catch (error) {
      console.error("Failed to reclassify:", error);
    }
  }

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Retailer Reviews</h1>
        <div className="flex gap-2">
          <Button 
            variant={filter === "pending" ? "default" : "outline"}
            onClick={() => setFilter("pending")}
            className="gap-2"
          >
            <Clock className="w-4 h-4" />
            Pending ({items.filter(i => i.status === "pending").length})
          </Button>
          <Button 
            variant={filter === "approved" ? "default" : "outline"}
            onClick={() => setFilter("approved")}
            className="gap-2"
          >
            <Check className="w-4 h-4" />
            Approved
          </Button>
          <Button 
            variant={filter === "rejected" ? "default" : "outline"}
            onClick={() => setFilter("rejected")}
            className="gap-2"
          >
            <X className="w-4 h-4" />
            Rejected
          </Button>
        </div>
      </div>

      {items.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            No {filter} retailer submissions found.
          </CardContent>
        </Card>
      )}

      {items.map((item) => (
        <Card key={item._id} className="border-l-4 border-l-blue-500">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{item.retailer?.name}</CardTitle>
                <p className="text-sm text-gray-600 mt-1">{item.retailer?.address}</p>
                <p className="text-sm text-gray-600">{item.retailer?.email} • {item.retailer?.phone}</p>
              </div>
              <div className="flex gap-2">
                <Badge variant={item.status === "approved" ? "default" : item.status === "rejected" ? "destructive" : "secondary"}>
                  {item.status}
                </Badge>
                <Badge variant="outline">
                  {item.ai?.decision}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Business Description</h4>
              <p className="text-sm bg-gray-50 p-3 rounded">{item.input?.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Selected Category</h4>
                <p className="text-sm">{item.input?.selectedCategory}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">AI Suggestion</h4>
                <p className="text-sm">
                  <span className="font-medium">{item.ai?.suggestedCategory}</span>
                  <span className="text-gray-500 ml-2">({Math.round((item.ai?.confidence || 0) * 100)}% confidence)</span>
                </p>
              </div>
            </div>

            {item.input?.photoUrls && item.input.photoUrls.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Photos ({item.input.photoUrls.length})</h4>
                <div className="flex gap-2 overflow-x-auto">
                  {item.input.photoUrls.map((url, idx) => (
                    <img 
                      key={idx} 
                      src={url} 
                      alt={`Store photo ${idx + 1}`}
                      className="w-20 h-20 object-cover rounded border"
                    />
                  ))}
                </div>
              </div>
            )}

            {item.ai?.verification && (
              <div>
                <h4 className="font-semibold mb-2">Verification Status</h4>
                <div className="flex gap-2">
                  <Badge variant={item.ai.verification.onlinePresenceFound ? "default" : "secondary"}>
                    {item.ai.verification.onlinePresenceFound ? "Presence Found" : "No Presence"}
                  </Badge>
                  {item.ai.verification.signals.map((signal, idx) => (
                    <Badge key={idx} variant="outline">{signal}</Badge>
                  ))}
                </div>
              </div>
            )}

            {filter === "pending" && (
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  onClick={() => approve(item._id, item.ai?.suggestedCategory)}
                  className="gap-2 bg-green-600 hover:bg-green-700"
                >
                  <Check className="w-4 h-4" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    const category = prompt("New category:", item.ai?.suggestedCategory || "Specialty & Unique Finds");
                    if (category) {
                      reclassify(item._id, category, "Admin reclassification");
                    }
                  }}
                  className="gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reclassify
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    const reason = prompt("Reason for denial:", "Not permitted on platform");
                    if (reason) {
                      deny(item._id, reason);
                    }
                  }}
                  className="gap-2"
                >
                  <X className="w-4 h-4" />
                  Deny
                </Button>
              </div>
            )}

            {item.admin?.notes && (
              <div className="mt-4 p-3 bg-gray-50 rounded">
                <h4 className="font-semibold text-sm">Admin Notes</h4>
                <p className="text-sm mt-1">{item.admin.notes}</p>
                {item.admin.reviewer && (
                  <p className="text-xs text-gray-500 mt-1">
                    Reviewed by {item.admin.reviewer} on {new Date(item.updatedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}