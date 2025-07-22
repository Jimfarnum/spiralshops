import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { 
  RotateCcw, 
  DollarSign, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Upload,
  FileText,
  Camera,
  ArrowRight
} from 'lucide-react';

interface ReturnItem {
  id: string;
  orderId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  reason: string;
  condition: string;
  status: 'pending' | 'approved' | 'shipped' | 'received' | 'processed' | 'refunded';
  requestDate: Date;
  refundAmount?: number;
  trackingNumber?: string;
}

interface RefundRequest {
  id: string;
  orderId: string;
  items: ReturnItem[];
  totalRefund: number;
  status: 'pending' | 'processing' | 'approved' | 'completed';
  method: 'original' | 'store-credit' | 'spiral-points';
  requestDate: Date;
  processingTime: string;
}

export default function ReturnsRefunds() {
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'return' | 'refund' | 'history'>('return');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [returnForm, setReturnForm] = useState({
    orderId: '',
    selectedItems: [] as string[],
    reason: '',
    condition: '',
    description: '',
    refundMethod: 'original',
    uploadedImages: [] as File[]
  });

  const [mockOrders] = useState([
    {
      id: 'SPIRAL-1753150001',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      items: [
        {
          id: '1',
          name: 'Artisan Coffee Blend',
          image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=100&h=100&fit=crop',
          price: 24.99,
          quantity: 2
        },
        {
          id: '2',
          name: 'Handmade Ceramic Mug',
          image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=100&h=100&fit=crop',
          price: 18.50,
          quantity: 1
        }
      ],
      total: 68.48,
      eligibleForReturn: true
    },
    {
      id: 'SPIRAL-1753149001',
      date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      items: [
        {
          id: '3',
          name: 'Vintage Leather Jacket',
          image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100&h=100&fit=crop',
          price: 89.99,
          quantity: 1
        }
      ],
      total: 89.99,
      eligibleForReturn: true
    }
  ]);

  const [returnHistory] = useState<ReturnItem[]>([
    {
      id: 'RET-001',
      orderId: 'SPIRAL-1753140001',
      productName: 'Organic Honey',
      productImage: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=100&h=100&fit=crop',
      price: 12.99,
      quantity: 1,
      reason: 'defective',
      condition: 'damaged',
      status: 'refunded',
      requestDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      refundAmount: 12.99,
      trackingNumber: 'RET123456789'
    },
    {
      id: 'RET-002',
      orderId: 'SPIRAL-1753135001',
      productName: 'Coffee Filter Papers',
      productImage: 'https://images.unsplash.com/photo-1516024851043-bdf063c21bf1?w=100&h=100&fit=crop',
      price: 8.99,
      quantity: 2,
      reason: 'wrong-item',
      condition: 'unopened',
      status: 'shipped',
      requestDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      trackingNumber: 'RET987654321'
    }
  ]);

  const [refundRequests] = useState<RefundRequest[]>([
    {
      id: 'REF-001',
      orderId: 'SPIRAL-1753140001',
      items: returnHistory.filter(item => item.orderId === 'SPIRAL-1753140001'),
      totalRefund: 12.99,
      status: 'completed',
      method: 'original',
      requestDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      processingTime: '2-3 business days'
    },
    {
      id: 'REF-002',
      orderId: 'SPIRAL-1753135001',
      items: returnHistory.filter(item => item.orderId === 'SPIRAL-1753135001'),
      totalRefund: 17.98,
      status: 'processing',
      method: 'original',
      requestDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      processingTime: '3-5 business days'
    }
  ]);

  const returnReasons = [
    { value: 'defective', label: 'Defective/Damaged' },
    { value: 'wrong-item', label: 'Wrong Item Received' },
    { value: 'not-as-described', label: 'Not as Described' },
    { value: 'size-fit', label: 'Size/Fit Issues' },
    { value: 'changed-mind', label: 'Changed Mind' },
    { value: 'duplicate', label: 'Duplicate Order' },
    { value: 'other', label: 'Other' }
  ];

  const conditionOptions = [
    { value: 'unopened', label: 'Unopened/New' },
    { value: 'gently-used', label: 'Gently Used' },
    { value: 'damaged', label: 'Damaged' },
    { value: 'defective', label: 'Defective' }
  ];

  const refundMethods = [
    { value: 'original', label: 'Original Payment Method' },
    { value: 'store-credit', label: 'SPIRAL Store Credit' },
    { value: 'spiral-points', label: 'SPIRAL Points (1.5x value)' }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setReturnForm(prev => ({
      ...prev,
      uploadedImages: [...prev.uploadedImages, ...files].slice(0, 5) // Max 5 images
    }));
  };

  const removeImage = (index: number) => {
    setReturnForm(prev => ({
      ...prev,
      uploadedImages: prev.uploadedImages.filter((_, i) => i !== index)
    }));
  };

  const handleItemSelection = (itemId: string, checked: boolean) => {
    setReturnForm(prev => ({
      ...prev,
      selectedItems: checked 
        ? [...prev.selectedItems, itemId]
        : prev.selectedItems.filter(id => id !== itemId)
    }));
  };

  const submitReturnRequest = () => {
    if (!returnForm.orderId || returnForm.selectedItems.length === 0 || !returnForm.reason) {
      toast({
        title: "Please complete all required fields",
        description: "Order ID, items, and reason are required.",
        variant: "destructive",
      });
      return;
    }

    // Generate return tracking number
    const returnId = `RET-${Date.now().toString().slice(-6)}`;
    
    toast({
      title: "Return request submitted",
      description: `Your return request ${returnId} has been submitted. You'll receive an email with return instructions.`,
    });

    setIsDialogOpen(false);
    setReturnForm({
      orderId: '',
      selectedItems: [],
      reason: '',
      condition: '',
      description: '',
      refundMethod: 'original',
      uploadedImages: []
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'approved': return CheckCircle;
      case 'shipped': return Truck;
      case 'received': return Package;
      case 'processed': return CheckCircle;
      case 'refunded': return DollarSign;
      case 'completed': return CheckCircle;
      case 'processing': return Clock;
      default: return AlertCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600';
      case 'approved': return 'text-green-600';
      case 'shipped': return 'text-blue-600';
      case 'received': return 'text-purple-600';
      case 'processed': return 'text-green-600';
      case 'refunded': return 'text-green-600';
      case 'completed': return 'text-green-600';
      case 'processing': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-[var(--spiral-coral)]" />
            Returns & Refunds
          </CardTitle>
          <CardDescription>
            Manage your returns, refunds, and exchanges easily
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: 'return', label: 'Start Return', icon: RotateCcw },
          { id: 'refund', label: 'Refund Status', icon: DollarSign },
          { id: 'history', label: 'Return History', icon: FileText }
        ].map(tab => {
          const IconComponent = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              onClick={() => setActiveTab(tab.id as any)}
              className={`${activeTab === tab.id ? 'bg-[var(--spiral-coral)] text-white' : ''}`}
            >
              <IconComponent className="mr-2 h-4 w-4" />
              {tab.label}
            </Button>
          );
        })}
      </div>

      {/* Start Return Tab */}
      {activeTab === 'return' && (
        <div className="space-y-6">
          {/* Return Policy Info */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">30</div>
                  <div className="text-sm text-blue-700">Days to return</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">FREE</div>
                  <div className="text-sm text-blue-700">Return shipping</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">2-3</div>
                  <div className="text-sm text-blue-700">Business days refund</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Eligible Orders */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[var(--spiral-navy)]">Eligible Orders</h3>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Start Return
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Start Return Request</DialogTitle>
                    <DialogDescription>
                      Fill out the form below to start your return process
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    {/* Order Selection */}
                    <div>
                      <Label htmlFor="orderId">Order ID</Label>
                      <Select value={returnForm.orderId} onValueChange={(value) => setReturnForm(prev => ({ ...prev, orderId: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an order" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockOrders.map(order => (
                            <SelectItem key={order.id} value={order.id}>
                              {order.id} - ${order.total.toFixed(2)} ({formatDate(order.date)})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Item Selection */}
                    {returnForm.orderId && (
                      <div>
                        <Label>Select Items to Return</Label>
                        <div className="space-y-3 mt-2">
                          {mockOrders.find(o => o.id === returnForm.orderId)?.items.map(item => (
                            <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                              <Checkbox
                                id={`item-${item.id}`}
                                checked={returnForm.selectedItems.includes(item.id)}
                                onCheckedChange={(checked) => handleItemSelection(item.id, !!checked)}
                              />
                              <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover" />
                              <div className="flex-1">
                                <h4 className="font-medium">{item.name}</h4>
                                <p className="text-sm text-gray-600">Qty: {item.quantity} • ${item.price.toFixed(2)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Return Reason */}
                    <div>
                      <Label htmlFor="reason">Reason for Return</Label>
                      <Select value={returnForm.reason} onValueChange={(value) => setReturnForm(prev => ({ ...prev, reason: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a reason" />
                        </SelectTrigger>
                        <SelectContent>
                          {returnReasons.map(reason => (
                            <SelectItem key={reason.value} value={reason.value}>
                              {reason.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Item Condition */}
                    <div>
                      <Label htmlFor="condition">Item Condition</Label>
                      <Select value={returnForm.condition} onValueChange={(value) => setReturnForm(prev => ({ ...prev, condition: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          {conditionOptions.map(condition => (
                            <SelectItem key={condition.value} value={condition.value}>
                              {condition.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Refund Method */}
                    <div>
                      <Label htmlFor="refundMethod">Preferred Refund Method</Label>
                      <Select value={returnForm.refundMethod} onValueChange={(value) => setReturnForm(prev => ({ ...prev, refundMethod: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {refundMethods.map(method => (
                            <SelectItem key={method.value} value={method.value}>
                              {method.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Description */}
                    <div>
                      <Label htmlFor="description">Additional Details (Optional)</Label>
                      <Textarea
                        id="description"
                        placeholder="Provide any additional details about the return..."
                        value={returnForm.description}
                        onChange={(e) => setReturnForm(prev => ({ ...prev, description: e.target.value }))}
                        className="min-h-[80px]"
                      />
                    </div>

                    {/* Image Upload */}
                    <div>
                      <Label>Upload Images (Optional)</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleFileUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <label htmlFor="image-upload" className="cursor-pointer">
                          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">Click to upload images</p>
                          <p className="text-xs text-gray-500">Max 5 images, 10MB each</p>
                        </label>
                      </div>
                      
                      {returnForm.uploadedImages.length > 0 && (
                        <div className="grid grid-cols-5 gap-2 mt-3">
                          {returnForm.uploadedImages.map((file, index) => (
                            <div key={index} className="relative">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Upload ${index + 1}`}
                                className="w-full h-20 object-cover rounded"
                              />
                              <Button
                                variant="destructive"
                                size="sm"
                                className="absolute top-1 right-1 h-6 w-6 p-0"
                                onClick={() => removeImage(index)}
                              >
                                ×
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-4">
                      <Button 
                        onClick={submitReturnRequest}
                        className="flex-1 bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90"
                      >
                        Submit Return Request
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsDialogOpen(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {mockOrders.map(order => (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-[var(--spiral-navy)]">Order {order.id}</h4>
                      <p className="text-sm text-gray-600">{formatDate(order.date)} • ${order.total.toFixed(2)}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      Return Eligible
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {order.items.map(item => (
                      <div key={item.id} className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover" />
                        <div>
                          <h5 className="font-medium text-sm">{item.name}</h5>
                          <p className="text-xs text-gray-600">Qty: {item.quantity} • ${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Refund Status Tab */}
      {activeTab === 'refund' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[var(--spiral-navy)]">Refund Requests</h3>
          
          {refundRequests.map(refund => {
            const StatusIcon = getStatusIcon(refund.status);
            
            return (
              <Card key={refund.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-[var(--spiral-navy)]">Refund {refund.id}</h4>
                      <p className="text-sm text-gray-600">Order: {refund.orderId}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <StatusIcon className={`h-4 w-4 ${getStatusColor(refund.status)}`} />
                        <Badge className={refund.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                          {refund.status.charAt(0).toUpperCase() + refund.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-lg font-semibold text-[var(--spiral-navy)]">
                        ${refund.totalRefund.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Method: {refundMethods.find(m => m.value === refund.method)?.label}</p>
                      <p className="text-sm text-gray-600">Processing Time: {refund.processingTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Request Date: {formatDate(refund.requestDate)}</p>
                      {refund.status === 'processing' && (
                        <p className="text-sm text-blue-600">Expected completion: 2-3 business days</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Return History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[var(--spiral-navy)]">Return History</h3>
          
          {returnHistory.map(returnItem => {
            const StatusIcon = getStatusIcon(returnItem.status);
            
            return (
              <Card key={returnItem.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <img 
                      src={returnItem.productImage} 
                      alt={returnItem.productName} 
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-[var(--spiral-navy)]">{returnItem.productName}</h4>
                        <div className="flex items-center gap-2">
                          <StatusIcon className={`h-4 w-4 ${getStatusColor(returnItem.status)}`} />
                          <Badge className={returnItem.status === 'refunded' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                            {returnItem.status.charAt(0).toUpperCase() + returnItem.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <p>Return ID: {returnItem.id}</p>
                          <p>Order: {returnItem.orderId}</p>
                        </div>
                        <div>
                          <p>Reason: {returnReasons.find(r => r.value === returnItem.reason)?.label}</p>
                          <p>Condition: {conditionOptions.find(c => c.value === returnItem.condition)?.label}</p>
                        </div>
                        <div>
                          <p>Quantity: {returnItem.quantity}</p>
                          <p>Price: ${returnItem.price.toFixed(2)}</p>
                        </div>
                        <div>
                          <p>Request Date: {formatDate(returnItem.requestDate)}</p>
                          {returnItem.trackingNumber && (
                            <p>Tracking: {returnItem.trackingNumber}</p>
                          )}
                        </div>
                      </div>
                      
                      {returnItem.refundAmount && (
                        <div className="mt-3 p-3 bg-green-50 rounded-lg">
                          <p className="text-sm font-medium text-green-800">
                            Refund Processed: ${returnItem.refundAmount.toFixed(2)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}