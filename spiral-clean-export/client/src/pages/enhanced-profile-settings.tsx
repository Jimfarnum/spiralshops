import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  MapPin, 
  CreditCard, 
  Bell, 
  Shield, 
  Heart,
  Store,
  Settings,
  Camera,
  Edit3,
  Save,
  Plus,
  Trash2,
  Star
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'spiral';
  label: string;
  last4?: string;
  expiry?: string;
  isDefault: boolean;
}

export default function EnhancedProfileSettings() {
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '(555) 123-4567',
    avatar: '',
    bio: 'Love shopping local and supporting small businesses!',
    location: 'Minneapolis, MN',
    joinDate: '2025-01-15',
    spiralPoints: 2450
  });

  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      label: 'Home',
      street: '123 Main Street',
      city: 'Minneapolis',
      state: 'MN',
      zipCode: '55401',
      isDefault: true
    },
    {
      id: '2',
      label: 'Work',
      street: '456 Business Ave',
      city: 'Minneapolis',
      state: 'MN',
      zipCode: '55402',
      isDefault: false
    }
  ]);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      label: 'Visa ending in 4242',
      last4: '4242',
      expiry: '12/26',
      isDefault: true
    },
    {
      id: '2',
      type: 'spiral',
      label: 'SPIRAL Points Wallet',
      isDefault: false
    }
  ]);

  const [notifications, setNotifications] = useState({
    email: {
      promotions: true,
      orderUpdates: true,
      newStores: false,
      spiralPoints: true
    },
    push: {
      orderDelivery: true,
      wishlistAlerts: true,
      storeEvents: false,
      spiralBonus: true
    },
    sms: {
      orderConfirmation: false,
      deliveryUpdates: true,
      emergencyOnly: true
    }
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'friends',
    showPurchaseHistory: false,
    allowStoreRecommendations: true,
    shareDataForImprovement: true
  });

  const [interests, setInterests] = useState([
    'Electronics',
    'Fashion',
    'Home & Garden',
    'Books'
  ]);

  const [followedStores, setFollowedStores] = useState([
    { id: '1', name: 'Target Store', followers: 1250, category: 'Retail' },
    { id: '2', name: 'Local Coffee Shop', followers: 342, category: 'Food & Beverage' },
    { id: '3', name: 'Garden Center Plus', followers: 891, category: 'Home & Garden' }
  ]);

  const [newAddress, setNewAddress] = useState({
    label: '',
    street: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);

  const handleProfileUpdate = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (category: string, setting: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value
      }
    }));
  };

  const handlePrivacyChange = (setting: string, value: any) => {
    setPrivacy(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const addAddress = () => {
    if (newAddress.label && newAddress.street && newAddress.city && newAddress.zipCode) {
      const address: Address = {
        id: Date.now().toString(),
        ...newAddress,
        isDefault: addresses.length === 0
      };
      setAddresses(prev => [...prev, address]);
      setNewAddress({ label: '', street: '', city: '', state: '', zipCode: '' });
      setShowAddressForm(false);
      toast({
        title: "Address Added",
        description: "Your new address has been saved."
      });
    }
  };

  const deleteAddress = (id: string) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
    toast({
      title: "Address Deleted",
      description: "Address has been removed from your profile."
    });
  };

  const setDefaultAddress = (id: string) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  const setDefaultPayment = (id: string) => {
    setPaymentMethods(prev => prev.map(method => ({
      ...method,
      isDefault: method.id === id
    })));
  };

  const addInterest = (interest: string) => {
    if (interest && !interests.includes(interest)) {
      setInterests(prev => [...prev, interest]);
    }
  };

  const removeInterest = (interest: string) => {
    setInterests(prev => prev.filter(i => i !== interest));
  };

  const unfollowStore = (storeId: string) => {
    setFollowedStores(prev => prev.filter(store => store.id !== storeId));
    toast({
      title: "Store Unfollowed",
      description: "You'll no longer receive updates from this store."
    });
  };

  const saveSettings = () => {
    // Save to localStorage or API
    localStorage.setItem('spiralUserProfile', JSON.stringify({
      profile,
      addresses,
      paymentMethods,
      notifications,
      privacy,
      interests,
      followedStores
    }));
    
    toast({
      title: "Settings Saved",
      description: "Your profile settings have been updated successfully."
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--spiral-navy)] mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your account, preferences, and privacy settings</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-6 w-full">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="addresses" className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Addresses</span>
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Payment</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="stores" className="flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Stores</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Personal Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profile.firstName}
                        onChange={(e) => handleProfileUpdate('firstName', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profile.lastName}
                        onChange={(e) => handleProfileUpdate('lastName', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleProfileUpdate('email', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => handleProfileUpdate('phone', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => handleProfileUpdate('bio', e.target.value)}
                      placeholder="Tell other shoppers about yourself..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profile.location}
                      onChange={(e) => handleProfileUpdate('location', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-[var(--spiral-navy)] to-[var(--spiral-coral)] rounded-full mx-auto mb-4 flex items-center justify-center">
                      <User className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="font-semibold">{profile.firstName} {profile.lastName}</h3>
                    <p className="text-sm text-gray-600">Member since {new Date(profile.joinDate).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{profile.spiralPoints}</div>
                      <div className="text-sm text-green-700">SPIRAL Points</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Addresses</span>
                      <span className="font-semibold">{addresses.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Payment Methods</span>
                      <span className="font-semibold">{paymentMethods.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Followed Stores</span>
                      <span className="font-semibold">{followedStores.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Saved Addresses</h2>
                <Button
                  onClick={() => setShowAddressForm(true)}
                  className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Address
                </Button>
              </div>

              {showAddressForm && (
                <Card>
                  <CardHeader>
                    <CardTitle>Add New Address</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="addressLabel">Address Label</Label>
                      <Input
                        id="addressLabel"
                        value={newAddress.label}
                        onChange={(e) => setNewAddress(prev => ({...prev, label: e.target.value}))}
                        placeholder="Home, Work, etc."
                      />
                    </div>
                    <div>
                      <Label htmlFor="street">Street Address</Label>
                      <Input
                        id="street"
                        value={newAddress.street}
                        onChange={(e) => setNewAddress(prev => ({...prev, street: e.target.value}))}
                        placeholder="123 Main Street"
                      />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress(prev => ({...prev, city: e.target.value}))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress(prev => ({...prev, state: e.target.value}))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          value={newAddress.zipCode}
                          onChange={(e) => setNewAddress(prev => ({...prev, zipCode: e.target.value}))}
                        />
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={addAddress} className="bg-green-600 hover:bg-green-700">
                        Save Address
                      </Button>
                      <Button variant="outline" onClick={() => setShowAddressForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((address) => (
                  <Card key={address.id} className={address.isDefault ? 'ring-2 ring-[var(--spiral-coral)]' : ''}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{address.label}</h3>
                          {address.isDefault && (
                            <Badge className="bg-[var(--spiral-coral)] text-white text-xs">Default</Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteAddress(address.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>{address.street}</div>
                        <div>{address.city}, {address.state} {address.zipCode}</div>
                      </div>
                      {!address.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDefaultAddress(address.id)}
                          className="mt-2"
                        >
                          Set as Default
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Payment Tab */}
          <TabsContent value="payment">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Payment Methods</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentMethods.map((method) => (
                  <Card key={method.id} className={method.isDefault ? 'ring-2 ring-[var(--spiral-coral)]' : ''}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <CreditCard className="h-5 w-5 text-gray-400" />
                          <h3 className="font-semibold">{method.label}</h3>
                          {method.isDefault && (
                            <Badge className="bg-[var(--spiral-coral)] text-white text-xs">Default</Badge>
                          )}
                        </div>
                      </div>
                      {method.expiry && (
                        <div className="text-sm text-gray-600">
                          Expires {method.expiry}
                        </div>
                      )}
                      {!method.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDefaultPayment(method.id)}
                          className="mt-2"
                        >
                          Set as Default
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Notification Preferences</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Email Notifications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(notifications.email).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <Label htmlFor={`email-${key}`} className="text-sm">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </Label>
                        <Switch
                          id={`email-${key}`}
                          checked={value}
                          onCheckedChange={(checked) => handleNotificationChange('email', key, checked)}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Push Notifications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(notifications.push).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <Label htmlFor={`push-${key}`} className="text-sm">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </Label>
                        <Switch
                          id={`push-${key}`}
                          checked={value}
                          onCheckedChange={(checked) => handleNotificationChange('push', key, checked)}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">SMS Notifications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(notifications.sms).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <Label htmlFor={`sms-${key}`} className="text-sm">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </Label>
                        <Switch
                          id={`sms-${key}`}
                          checked={value}
                          onCheckedChange={(checked) => handleNotificationChange('sms', key, checked)}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Privacy Settings</h2>
              
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Profile Visibility</Label>
                      <p className="text-sm text-gray-600">Who can see your profile information</p>
                    </div>
                    <select 
                      value={privacy.profileVisibility}
                      onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                      className="border rounded px-3 py-2"
                    >
                      <option value="public">Public</option>
                      <option value="friends">Friends Only</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Show Purchase History</Label>
                      <p className="text-sm text-gray-600">Allow others to see what you've bought</p>
                    </div>
                    <Switch
                      checked={privacy.showPurchaseHistory}
                      onCheckedChange={(checked) => handlePrivacyChange('showPurchaseHistory', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Store Recommendations</Label>
                      <p className="text-sm text-gray-600">Allow stores to recommend products to you</p>
                    </div>
                    <Switch
                      checked={privacy.allowStoreRecommendations}
                      onCheckedChange={(checked) => handlePrivacyChange('allowStoreRecommendations', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Data for Improvement</Label>
                      <p className="text-sm text-gray-600">Share anonymized data to help improve SPIRAL</p>
                    </div>
                    <Switch
                      checked={privacy.shareDataForImprovement}
                      onCheckedChange={(checked) => handlePrivacyChange('shareDataForImprovement', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Stores Tab */}
          <TabsContent value="stores">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Followed Stores</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {followedStores.map((store) => (
                  <Card key={store.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{store.name}</h3>
                          <p className="text-sm text-gray-600">{store.category}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => unfollowStore(store.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Unfollow
                        </Button>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Star className="h-4 w-4" />
                        <span>{store.followers} followers</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Shopping Interests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {interests.map((interest) => (
                      <Badge
                        key={interest}
                        variant="secondary"
                        className="cursor-pointer hover:bg-red-100"
                        onClick={() => removeInterest(interest)}
                      >
                        {interest} ×
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add new interest..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addInterest(e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <Button
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        addInterest(input.value);
                        input.value = '';
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end mt-8">
          <Button
            onClick={saveSettings}
            className="bg-green-600 hover:bg-green-700 flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Save All Settings</span>
          </Button>
        </div>
      </div>
    </div>
  );
}