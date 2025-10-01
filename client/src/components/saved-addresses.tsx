import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  Home, 
  Building, 
  User, 
  Star,
  CheckCircle
} from 'lucide-react';

interface SavedAddress {
  id: string;
  label: string;
  type: 'home' | 'work' | 'other';
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
  phone?: string;
  instructions?: string;
}

interface SavedAddressesProps {
  userId?: string;
}

export default function SavedAddresses({ userId }: SavedAddressesProps) {
  const { toast } = useToast();
  
  const [addresses, setAddresses] = useState<SavedAddress[]>([
    {
      id: '1',
      label: 'Home',
      type: 'home',
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Main Street, Apt 4B',
      city: 'Minneapolis',
      state: 'MN',
      zipCode: '55401',
      isDefault: true,
      phone: '(555) 123-4567',
      instructions: 'Ring buzzer for apartment'
    },
    {
      id: '2',
      label: 'Work Office',
      type: 'work',
      firstName: 'John',
      lastName: 'Doe',
      address: '456 Business Ave, Suite 100',
      city: 'Minneapolis',
      state: 'MN',
      zipCode: '55402',
      isDefault: false,
      phone: '(555) 987-6543',
      instructions: 'Reception desk on first floor'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);
  const [formData, setFormData] = useState<Partial<SavedAddress>>({
    label: '',
    type: 'home',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    isDefault: false,
    phone: '',
    instructions: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.label) newErrors.label = 'Address label is required';
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';
    else if (!/^\d{5}$/.test(formData.zipCode)) newErrors.zipCode = 'Invalid ZIP code format';
    
    if (formData.phone && !/^\(\d{3}\) \d{3}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof SavedAddress, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    handleInputChange('phone', formatted);
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast({
        title: "Please correct the errors",
        description: "Check the highlighted fields and try again.",
        variant: "destructive",
      });
      return;
    }

    const addressData = {
      ...formData,
      id: editingAddress?.id || `addr-${Date.now()}`,
    } as SavedAddress;

    if (editingAddress) {
      // Update existing address
      setAddresses(prev => prev.map(addr => 
        addr.id === editingAddress.id ? addressData : addr
      ));
      toast({
        title: "Address updated",
        description: "Your saved address has been updated successfully.",
      });
    } else {
      // Add new address
      if (addressData.isDefault) {
        // Remove default from other addresses
        setAddresses(prev => prev.map(addr => ({ ...addr, isDefault: false })));
      }
      setAddresses(prev => [...prev, addressData]);
      toast({
        title: "Address saved",
        description: "Your new address has been saved successfully.",
      });
    }

    setIsDialogOpen(false);
    setEditingAddress(null);
    setFormData({});
    setErrors({});
  };

  const handleEdit = (address: SavedAddress) => {
    setEditingAddress(address);
    setFormData(address);
    setIsDialogOpen(true);
  };

  const handleDelete = (addressId: string) => {
    const addressToDelete = addresses.find(addr => addr.id === addressId);
    if (addressToDelete?.isDefault && addresses.length > 1) {
      toast({
        title: "Cannot delete default address",
        description: "Please set another address as default before deleting this one.",
        variant: "destructive",
      });
      return;
    }

    setAddresses(prev => prev.filter(addr => addr.id !== addressId));
    toast({
      title: "Address deleted",
      description: "The saved address has been removed.",
    });
  };

  const handleSetDefault = (addressId: string) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    })));
    toast({
      title: "Default address updated",
      description: "This address is now your default shipping address.",
    });
  };

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'home': return Home;
      case 'work': return Building;
      default: return MapPin;
    }
  };

  const getAddressTypeColor = (type: string) => {
    switch (type) {
      case 'home': return 'bg-blue-100 text-blue-800';
      case 'work': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--spiral-navy)]">Saved Addresses</h2>
          <p className="text-gray-600">Manage your shipping addresses</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                setEditingAddress(null);
                setFormData({
                  label: '',
                  type: 'home',
                  firstName: '',
                  lastName: '',
                  address: '',
                  city: '',
                  state: '',
                  zipCode: '',
                  isDefault: false,
                  phone: '',
                  instructions: ''
                });
                setErrors({});
              }}
              className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Address
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </DialogTitle>
              <DialogDescription>
                {editingAddress ? 'Update your saved address information' : 'Add a new shipping address to your account'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Address Label and Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="label">Address Label *</Label>
                  <Input
                    id="label"
                    placeholder="e.g., Home, Work, Mom's House"
                    value={formData.label || ''}
                    onChange={(e) => handleInputChange('label', e.target.value)}
                    className={errors.label ? 'border-red-500' : ''}
                  />
                  {errors.label && <p className="text-sm text-red-500 mt-1">{errors.label}</p>}
                </div>
                <div>
                  <Label htmlFor="type">Address Type</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home">Home</SelectItem>
                      <SelectItem value="work">Work</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName || ''}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={errors.firstName ? 'border-red-500' : ''}
                  />
                  {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName || ''}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={errors.lastName ? 'border-red-500' : ''}
                  />
                  {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
                </div>
              </div>

              {/* Address Information */}
              <div>
                <Label htmlFor="address">Street Address *</Label>
                <Input
                  id="address"
                  placeholder="123 Main Street, Apt 4B"
                  value={formData.address || ''}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={errors.address ? 'border-red-500' : ''}
                />
                {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city || ''}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className={errors.city ? 'border-red-500' : ''}
                  />
                  {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    maxLength={2}
                    placeholder="MN"
                    value={formData.state || ''}
                    onChange={(e) => handleInputChange('state', e.target.value.toUpperCase())}
                    className={errors.state ? 'border-red-500' : ''}
                  />
                  {errors.state && <p className="text-sm text-red-500 mt-1">{errors.state}</p>}
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code *</Label>
                  <Input
                    id="zipCode"
                    placeholder="55401"
                    value={formData.zipCode || ''}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    className={errors.zipCode ? 'border-red-500' : ''}
                  />
                  {errors.zipCode && <p className="text-sm text-red-500 mt-1">{errors.zipCode}</p>}
                </div>
              </div>

              {/* Optional Information */}
              <div>
                <Label htmlFor="phone">Phone Number (optional)</Label>
                <Input
                  id="phone"
                  placeholder="(555) 123-4567"
                  value={formData.phone || ''}
                  onChange={handlePhoneChange}
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <Label htmlFor="instructions">Delivery Instructions (optional)</Label>
                <Input
                  id="instructions"
                  placeholder="Ring buzzer, Leave at door, etc."
                  value={formData.instructions || ''}
                  onChange={(e) => handleInputChange('instructions', e.target.value)}
                />
              </div>

              {/* Default Address */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isDefault"
                  checked={formData.isDefault || false}
                  onCheckedChange={(checked) => handleInputChange('isDefault', !!checked)}
                />
                <Label htmlFor="isDefault" className="text-sm">
                  Set as default shipping address
                </Label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleSubmit}
                  className="flex-1 bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90"
                >
                  {editingAddress ? 'Update Address' : 'Save Address'}
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

      {/* Address Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((address) => {
          const IconComponent = getAddressIcon(address.type);
          
          return (
            <Card key={address.id} className={`relative ${address.isDefault ? 'ring-2 ring-[var(--spiral-coral)]' : ''}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5 text-[var(--spiral-coral)]" />
                    <CardTitle className="text-lg">{address.label}</CardTitle>
                    {address.isDefault && (
                      <Badge className="bg-[var(--spiral-coral)] text-white">
                        <Star className="mr-1 h-3 w-3" />
                        Default
                      </Badge>
                    )}
                  </div>
                  <Badge className={getAddressTypeColor(address.type)}>
                    {address.type}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div>
                  <p className="font-semibold text-[var(--spiral-navy)]">
                    {address.firstName} {address.lastName}
                  </p>
                  <p className="text-gray-600">{address.address}</p>
                  <p className="text-gray-600">
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  {address.phone && (
                    <p className="text-gray-600">{address.phone}</p>
                  )}
                  {address.instructions && (
                    <p className="text-sm text-gray-500 italic">
                      "{address.instructions}"
                    </p>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(address)}
                  >
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                  
                  {!address.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(address.id)}
                    >
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Set Default
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(address.id)}
                    className="text-red-600 hover:text-red-700 hover:border-red-300"
                    disabled={address.isDefault && addresses.length === 1}
                  >
                    <Trash2 className="mr-1 h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {addresses.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-[var(--spiral-navy)] mb-2">
              No saved addresses
            </h3>
            <p className="text-gray-600 mb-4">
              Add your first address to speed up checkout
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}