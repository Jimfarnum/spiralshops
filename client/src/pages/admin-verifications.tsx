import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Store, 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  FileText,
  Image as ImageIcon,
  Star
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PendingStore {
  id: number;
  name: string;
  description: string;
  category: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  verificationDocumentPath?: string;
  submittedAt: string;
}

export default function AdminVerifications() {
  const [selectedStore, setSelectedStore] = useState<PendingStore | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [approvalData, setApprovalData] = useState({
    imageUrl: "",
    rating: "4.5",
    verificationTier: "Local"
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch pending verifications
  const { data: pendingStores, isLoading } = useQuery({
    queryKey: ['/api/admin/pending-verifications'],
    queryFn: () => fetch('/api/admin/pending-verifications').then(res => res.json()),
  });

  // Approve verification mutation
  const approveMutation = useMutation({
    mutationFn: async (data: { storeId: number; imageUrl: string; rating: number; verificationTier: string }) => {
      return apiRequest(`/api/admin/approve-verification/${data.storeId}`, {
        method: 'POST',
        body: {
          imageUrl: data.imageUrl,
          rating: data.rating,
          verificationTier: data.verificationTier
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pending-verifications'] });
      setSelectedStore(null);
      setApprovalData({ imageUrl: "", rating: "4.5", verificationTier: "Local" });
      toast({
        title: "Store Approved!",
        description: "The store verification has been approved and is now live.",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Approval Failed",
        description: error.message || "Failed to approve store verification.",
        variant: "destructive",
      });
    },
  });

  // Reject verification mutation
  const rejectMutation = useMutation({
    mutationFn: async (data: { storeId: number; rejectionReason: string }) => {
      return apiRequest(`/api/admin/reject-verification/${data.storeId}`, {
        method: 'POST',
        body: {
          rejectionReason: data.rejectionReason
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pending-verifications'] });
      setSelectedStore(null);
      setRejectionReason("");
      toast({
        title: "Store Rejected",
        description: "The store verification has been rejected and the owner will be notified.",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Rejection Failed",
        description: error.message || "Failed to reject store verification.",
        variant: "destructive",
      });
    },
  });

  const handleApprove = () => {
    if (!selectedStore) return;
    
    if (!approvalData.imageUrl) {
      toast({
        title: "Image URL Required",
        description: "Please provide an image URL for the store.",
        variant: "destructive",
      });
      return;
    }

    approveMutation.mutate({
      storeId: selectedStore.id,
      imageUrl: approvalData.imageUrl,
      rating: parseFloat(approvalData.rating),
      verificationTier: approvalData.verificationTier
    });
  };

  const handleReject = () => {
    if (!selectedStore || !rejectionReason.trim()) {
      toast({
        title: "Rejection Reason Required",
        description: "Please provide a reason for rejecting this verification.",
        variant: "destructive",
      });
      return;
    }

    rejectMutation.mutate({
      storeId: selectedStore.id,
      rejectionReason: rejectionReason.trim()
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Clock className="w-8 h-8 mx-auto mb-4 animate-spin" />
            <p>Loading pending verifications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Store Verification Management</h1>
          <p className="text-xl text-gray-600">
            Review and approve store verification applications
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold">{pendingStores?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">This Week</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Store className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Stores</p>
                  <p className="text-2xl font-bold">247</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Verifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Pending Verifications ({pendingStores?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!pendingStores || pendingStores.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No pending verifications</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingStores.map((store: PendingStore) => (
                  <div key={store.id} className="border rounded-lg p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">{store.name}</h3>
                          <Badge variant="secondary">{store.category}</Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-4 line-clamp-2">{store.description}</p>
                        
                        <div className="grid gap-2 md:grid-cols-2 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{store.address}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <span>{store.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{store.email}</span>
                          </div>
                          {store.website && (
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4" />
                              <a 
                                href={store.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                Website
                              </a>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500">
                            Submitted: {new Date(store.submittedAt).toLocaleDateString()}
                          </p>
                          
                          <div className="flex gap-2">
                            {store.verificationDocumentPath && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(store.verificationDocumentPath, '_blank')}
                              >
                                <FileText className="w-4 h-4 mr-1" />
                                View Document
                              </Button>
                            )}
                            
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedStore(store)}
                                >
                                  Review
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Review Store Verification</DialogTitle>
                                </DialogHeader>
                                
                                {selectedStore && (
                                  <div className="space-y-6">
                                    {/* Store Details */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                      <h3 className="font-semibold mb-2">{selectedStore.name}</h3>
                                      <p className="text-sm text-gray-600 mb-2">{selectedStore.description}</p>
                                      <div className="text-sm text-gray-600">
                                        <p><strong>Category:</strong> {selectedStore.category}</p>
                                        <p><strong>Address:</strong> {selectedStore.address}</p>
                                        <p><strong>Phone:</strong> {selectedStore.phone}</p>
                                        <p><strong>Email:</strong> {selectedStore.email}</p>
                                        {selectedStore.website && (
                                          <p><strong>Website:</strong> 
                                            <a href={selectedStore.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                                              {selectedStore.website}
                                            </a>
                                          </p>
                                        )}
                                      </div>
                                    </div>

                                    <Tabs defaultValue="approve" className="w-full">
                                      <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="approve" className="text-green-600">
                                          <CheckCircle className="w-4 h-4 mr-1" />
                                          Approve
                                        </TabsTrigger>
                                        <TabsTrigger value="reject" className="text-red-600">
                                          <XCircle className="w-4 h-4 mr-1" />
                                          Reject
                                        </TabsTrigger>
                                      </TabsList>
                                      
                                      <TabsContent value="approve" className="space-y-4">
                                        <div>
                                          <Label htmlFor="imageUrl">Store Image URL *</Label>
                                          <Input
                                            id="imageUrl"
                                            value={approvalData.imageUrl}
                                            onChange={(e) => setApprovalData(prev => ({ ...prev, imageUrl: e.target.value }))}
                                            placeholder="https://example.com/store-image.jpg"
                                          />
                                        </div>
                                        
                                        <div>
                                          <Label htmlFor="rating">Initial Rating</Label>
                                          <Input
                                            id="rating"
                                            type="number"
                                            min="1"
                                            max="5"
                                            step="0.1"
                                            value={approvalData.rating}
                                            onChange={(e) => setApprovalData(prev => ({ ...prev, rating: e.target.value }))}
                                          />
                                        </div>

                                        <div>
                                          <Label htmlFor="verificationTier">Verification Tier</Label>
                                          <Select
                                            value={approvalData.verificationTier}
                                            onValueChange={(value) => setApprovalData(prev => ({ ...prev, verificationTier: value }))}
                                          >
                                            <SelectTrigger>
                                              <SelectValue placeholder="Select verification tier" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="Local">Local Store - Green Badge</SelectItem>
                                              <SelectItem value="Regional">Regional Store - Yellow Badge</SelectItem>
                                              <SelectItem value="National">National Store - Blue Badge</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        
                                        <Button 
                                          onClick={handleApprove}
                                          disabled={approveMutation.isPending || !approvalData.imageUrl}
                                          className="w-full bg-green-600 hover:bg-green-700"
                                        >
                                          <CheckCircle className="w-4 h-4 mr-1" />
                                          {approveMutation.isPending ? "Approving..." : "Approve Store"}
                                        </Button>
                                      </TabsContent>
                                      
                                      <TabsContent value="reject" className="space-y-4">
                                        <div>
                                          <Label htmlFor="rejectionReason">Rejection Reason *</Label>
                                          <Textarea
                                            id="rejectionReason"
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            placeholder="Please provide a detailed reason for rejection..."
                                            rows={4}
                                          />
                                        </div>
                                        
                                        <Button 
                                          onClick={handleReject}
                                          disabled={rejectMutation.isPending || !rejectionReason.trim()}
                                          variant="destructive"
                                          className="w-full"
                                        >
                                          <XCircle className="w-4 h-4 mr-1" />
                                          {rejectMutation.isPending ? "Rejecting..." : "Reject Store"}
                                        </Button>
                                      </TabsContent>
                                    </Tabs>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}