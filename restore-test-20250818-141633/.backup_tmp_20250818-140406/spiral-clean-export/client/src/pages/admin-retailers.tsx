import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';
import { 
  Store, 
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Settings,
  Building,
  Users,
  AlertCircle
} from 'lucide-react';

interface Retailer {
  id: number;
  email: string;
  businessName: string;
  contactName: string;
  phone?: string;
  city: string;
  state: string;
  isApproved: boolean;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export default function AdminRetailersPage() {
  const { toast } = useToast();
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRetailer, setSelectedRetailer] = useState<Retailer | null>(null);
  const [moderationNotes, setModerationNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadRetailers();
  }, []);

  const loadRetailers = async () => {
    try {
      const response = await fetch('/api/admin/retailers');
      const data = await response.json();
      
      if (data.success) {
        setRetailers(data.retailers);
      }
    } catch (error) {
      console.error('Error loading retailers:', error);
      toast({
        title: "Error",
        description: "Failed to load retailers",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeration = async (retailerId: number, action: 'approve' | 'reject') => {
    setIsProcessing(true);
    try {
      const response = await fetch(`/api/admin/retailers/${retailerId}/moderate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          notes: moderationNotes,
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        toast({
          title: `Retailer ${action}d`,
          description: result.message,
        });
        
        // Update local state
        setRetailers(retailers.map(r => 
          r.id === retailerId 
            ? { ...r, isApproved: action === 'approve', isActive: action === 'approve' }
            : r
        ));
        
        setSelectedRetailer(null);
        setModerationNotes('');
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to moderate retailer",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Failed to process request",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const pendingRetailers = retailers.filter(r => !r.isApproved);
  const approvedRetailers = retailers.filter(r => r.isApproved);
  const totalRetailers = retailers.length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--spiral-cream)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[var(--spiral-coral)] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading retailer management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Admin
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-[var(--spiral-navy)]">
                  Retailer Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage retailer accounts and approvals
                </p>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Retailers</p>
                    <p className="text-2xl font-bold text-[var(--spiral-navy)]">{totalRetailers}</p>
                  </div>
                  <Store className="h-8 w-8 text-[var(--spiral-coral)]" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Approved</p>
                    <p className="text-2xl font-bold text-green-600">{approvedRetailers.length}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">{pendingRetailers.length}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active</p>
                    <p className="text-2xl font-bold text-[var(--spiral-navy)]">
                      {retailers.filter(r => r.isActive).length}
                    </p>
                  </div>
                  <Building className="h-8 w-8 text-[var(--spiral-coral)]" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pending Approvals */}
          {pendingRetailers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  Pending Retailer Approvals ({pendingRetailers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingRetailers.map((retailer) => (
                    <div key={retailer.id} className="border rounded-lg p-4 bg-yellow-50">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-4">
                            <h3 className="font-semibold text-lg">{retailer.businessName}</h3>
                            <Badge variant="outline" className="border-yellow-400 text-yellow-600">
                              Pending Review
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {retailer.contactName}
                            </div>
                            <div className="flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              {retailer.email}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {retailer.city}, {retailer.state}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(retailer.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          
                          {retailer.phone && (
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Phone className="h-4 w-4" />
                              {retailer.phone}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => setSelectedRetailer(retailer)}
                            className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/80"
                          >
                            Review
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Retailers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                All Retailers ({totalRetailers})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {retailers.length > 0 ? (
                <div className="space-y-4">
                  {retailers.map((retailer) => (
                    <div key={retailer.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-4">
                            <h3 className="font-semibold text-lg">{retailer.businessName}</h3>
                            <div className="flex gap-2">
                              <Badge variant={retailer.isApproved ? "default" : "outline"}>
                                {retailer.isApproved ? "Approved" : "Pending"}
                              </Badge>
                              <Badge variant={retailer.isActive ? "default" : "destructive"}>
                                {retailer.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {retailer.contactName}
                            </div>
                            <div className="flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              {retailer.email}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {retailer.city}, {retailer.state}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Joined {new Date(retailer.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          
                          {retailer.lastLoginAt && (
                            <div className="text-sm text-gray-500">
                              Last login: {new Date(retailer.lastLoginAt).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          {!retailer.isApproved && (
                            <Button
                              size="sm"
                              onClick={() => setSelectedRetailer(retailer)}
                              className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/80"
                            >
                              Review
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Store className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No Retailers Yet</h3>
                  <p className="text-gray-500">Retailers will appear here once they sign up</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Moderation Modal */}
          {selectedRetailer && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-2xl">
                <CardHeader>
                  <CardTitle>Review Retailer Application</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">{selectedRetailer.businessName}</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Contact Name</label>
                        <p className="text-lg">{selectedRetailer.contactName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <p className="text-lg">{selectedRetailer.email}</p>
                      </div>
                      {selectedRetailer.phone && (
                        <div>
                          <label className="block text-sm font-medium mb-1">Phone</label>
                          <p className="text-lg">{selectedRetailer.phone}</p>
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium mb-1">Location</label>
                        <p className="text-lg">{selectedRetailer.city}, {selectedRetailer.state}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Applied</label>
                        <p className="text-lg">{new Date(selectedRetailer.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Moderation Notes (Optional)</label>
                    <Textarea
                      value={moderationNotes}
                      onChange={(e) => setModerationNotes(e.target.value)}
                      placeholder="Add any notes about this decision..."
                      rows={3}
                    />
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Approving this retailer will allow them to sell products on SPIRAL. 
                      Rejecting will prevent access and notify them of the decision.
                    </AlertDescription>
                  </Alert>

                  <div className="flex gap-4">
                    <Button
                      onClick={() => handleModeration(selectedRetailer.id, 'approve')}
                      disabled={isProcessing}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve Retailer
                    </Button>
                    <Button
                      onClick={() => handleModeration(selectedRetailer.id, 'reject')}
                      disabled={isProcessing}
                      variant="destructive"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject Application
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedRetailer(null);
                        setModerationNotes('');
                      }}
                      variant="outline"
                      disabled={isProcessing}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}