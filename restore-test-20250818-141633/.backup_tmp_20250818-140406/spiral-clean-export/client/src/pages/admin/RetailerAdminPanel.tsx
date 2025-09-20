import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Flag, Eye, Store, CreditCard, Package, User, Search } from 'lucide-react';
import AdminLayout from './AdminLayout';

interface Retailer {
  id: string;
  storeName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  plan: string;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  stripeAccountId?: string;
  stripeStatus: 'connected' | 'pending' | 'none';
  productsCount: number;
  createdAt: string;
  lastActivity: string;
  notes?: string;
}

export default function RetailerAdminPanel() {
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRetailer, setSelectedRetailer] = useState<Retailer | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchRetailers();
  }, []);

  const fetchRetailers = async () => {
    try {
      const response = await fetch('/api/admin/retailers');
      const data = await response.json();
      
      if (data.success) {
        setRetailers(data.data);
      }
    } catch (error) {
      toast({
        title: "Error Loading Retailers",
        description: "Failed to fetch retailer data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateRetailerStatus = async (id: string, status: Retailer['status']) => {
    try {
      const response = await fetch('/api/admin/update-retailer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      
      if (response.ok) {
        setRetailers(prev => 
          prev.map(retailer => 
            retailer.id === id ? { ...retailer, status } : retailer
          )
        );
        
        toast({
          title: "Status Updated",
          description: `Retailer status changed to ${status}`,
        });
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Could not update retailer status.",
        variant: "destructive"
      });
    }
  };

  const saveAdminNotes = async (id: string, notes: string) => {
    try {
      setRetailers(prev => 
        prev.map(retailer => 
          retailer.id === id ? { ...retailer, notes } : retailer
        )
      );
      
      toast({
        title: "Notes Saved",
        description: "Admin notes have been updated.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Could not save admin notes.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: Retailer['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800', 
      rejected: 'bg-red-100 text-red-800',
      flagged: 'bg-orange-100 text-orange-800'
    };

    return (
      <Badge className={colors[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getStripeBadge = (stripeStatus: Retailer['stripeStatus']) => {
    return stripeStatus === 'connected' ? (
      <Badge className="bg-green-100 text-green-800">
        <CreditCard className="w-3 h-3 mr-1" />
        Connected
      </Badge>
    ) : stripeStatus === 'pending' ? (
      <Badge className="bg-yellow-100 text-yellow-800">
        <CreditCard className="w-3 h-3 mr-1" />
        Pending
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">
        <CreditCard className="w-3 h-3 mr-1" />
        Not Connected
      </Badge>
    );
  };

  const filteredRetailers = retailers.filter(retailer =>
    retailer.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    retailer.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    retailer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: retailers.length,
    pending: retailers.filter(r => r.status === 'pending').length,
    approved: retailers.filter(r => r.status === 'approved').length,
    flagged: retailers.filter(r => r.status === 'flagged').length,
    stripeConnected: retailers.filter(r => r.stripeStatus === 'connected').length
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-teal-600">Retailer Review Panel</h1>
            <p className="text-gray-600 mt-2">Monitor and manage SPIRAL retailer applications</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Retailers</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Store className="w-8 h-8 text-teal-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <User className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Flagged</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.flagged}</p>
                </div>
                <Flag className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Stripe Connected</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.stripeConnected}</p>
                </div>
                <CreditCard className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search retailers by name, owner, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Retailers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Retailers ({filteredRetailers.length})</CardTitle>
            <CardDescription>
              Review and manage retailer applications and status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Store</th>
                    <th className="text-left p-3">Owner</th>
                    <th className="text-left p-3">Plan</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Stripe</th>
                    <th className="text-left p-3">Products</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRetailers.map((retailer) => (
                    <tr key={retailer.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div>
                          <div className="font-medium">{retailer.storeName}</div>
                          <div className="text-sm text-gray-500">{retailer.email}</div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div>
                          <div className="font-medium">{retailer.ownerName}</div>
                          <div className="text-sm text-gray-500">{retailer.phone}</div>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline">{retailer.plan}</Badge>
                      </td>
                      <td className="p-3">
                        {getStatusBadge(retailer.status)}
                      </td>
                      <td className="p-3">
                        {getStripeBadge(retailer.stripeStatus)}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <Package className="w-4 h-4 text-gray-400" />
                          {retailer.productsCount}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateRetailerStatus(retailer.id, 'approved')}
                            disabled={retailer.status === 'approved'}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateRetailerStatus(retailer.id, 'rejected')}
                            disabled={retailer.status === 'rejected'}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateRetailerStatus(retailer.id, 'flagged')}
                            disabled={retailer.status === 'flagged'}
                          >
                            <Flag className="w-4 h-4" />
                          </Button>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedRetailer(retailer);
                                  setAdminNotes(retailer.notes || '');
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{retailer.storeName} - Details</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold mb-2">Business Information</h4>
                                    <div className="space-y-1 text-sm">
                                      <p><strong>Store:</strong> {retailer.storeName}</p>
                                      <p><strong>Owner:</strong> {retailer.ownerName}</p>
                                      <p><strong>Email:</strong> {retailer.email}</p>
                                      <p><strong>Phone:</strong> {retailer.phone}</p>
                                      <p><strong>Address:</strong> {retailer.address}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold mb-2">Platform Status</h4>
                                    <div className="space-y-2">
                                      <div className="flex justify-between">
                                        <span>Plan:</span>
                                        <Badge variant="outline">{retailer.plan}</Badge>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Status:</span>
                                        {getStatusBadge(retailer.status)}
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Stripe:</span>
                                        {getStripeBadge(retailer.stripeStatus)}
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Products:</span>
                                        <span>{retailer.productsCount}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="font-semibold mb-2">Admin Notes</h4>
                                  <Textarea
                                    placeholder="Add internal notes about this retailer..."
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    rows={3}
                                  />
                                  <Button
                                    className="mt-2"
                                    onClick={() => {
                                      if (selectedRetailer) {
                                        saveAdminNotes(selectedRetailer.id, adminNotes);
                                      }
                                    }}
                                  >
                                    Save Notes
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}