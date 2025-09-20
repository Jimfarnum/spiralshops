import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Bell,
  Heart,
  TrendingDown,
  Package,
  Trash2,
  DollarSign,
  Mail,
  Smartphone,
  Monitor,
  Plus,
  Zap
} from 'lucide-react';

interface WishlistAlertManagerProps {
  productId: number;
  productName: string;
  currentPrice: number;
  onAlertCreated?: () => void;
}

export default function WishlistAlertManager({ 
  productId, 
  productName, 
  currentPrice,
  onAlertCreated 
}: WishlistAlertManagerProps) {
  const [alertType, setAlertType] = useState<'stock' | 'price' | 'promo'>('price');
  const [targetPrice, setTargetPrice] = useState<string>('');
  const [notificationMethods, setNotificationMethods] = useState<string[]>(['email']);
  const [isCreating, setIsCreating] = useState(false);
  const [hasAlert, setHasAlert] = useState(false);
  
  const { toast } = useToast();

  const createAlert = async () => {
    setIsCreating(true);
    try {
      const alertData = {
        productId,
        productName,
        currentPrice: currentPrice * 100, // Convert to cents
        alertType,
        notificationMethods,
        ...(alertType === 'price' && targetPrice && { 
          targetPrice: Math.floor(parseFloat(targetPrice) * 100) 
        })
      };

      const response = await fetch('/api/wishlist/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertData),
      });

      if (response.ok) {
        setHasAlert(true);
        toast({
          title: "Alert Created! 🔔",
          description: `You'll be notified when ${productName} ${
            alertType === 'stock' ? 'is back in stock' :
            alertType === 'price' ? `drops below $${targetPrice}` :
            'has a special promotion'
          }`,
        });
        onAlertCreated?.();
      } else {
        throw new Error('Failed to create alert');
      }
    } catch (error) {
      toast({
        title: "Alert Creation Failed",
        description: "Please try again or check your connection",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const toggleNotificationMethod = (method: string) => {
    setNotificationMethods(prev => 
      prev.includes(method) 
        ? prev.filter(m => m !== method)
        : [...prev, method]
    );
  };

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case 'stock': return <Package className="h-4 w-4" />;
      case 'price': return <TrendingDown className="h-4 w-4" />;
      case 'promo': return <Zap className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  if (hasAlert) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-green-700">
            <Bell className="h-5 w-5" />
            <span className="font-medium">Alert Active</span>
            <Badge variant="secondary">
              {alertType} · {notificationMethods.length} method{notificationMethods.length !== 1 ? 's' : ''}
            </Badge>
          </div>
          <p className="text-sm text-green-600 mt-1">
            You'll be notified when this item meets your criteria
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          Create Wishlist Alert
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Alert Type Selection */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Alert Type
          </label>
          <Select value={alertType} onValueChange={(value: any) => setAlertType(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stock">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span>Back in Stock</span>
                </div>
              </SelectItem>
              <SelectItem value="price">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4" />
                  <span>Price Drop</span>
                </div>
              </SelectItem>
              <SelectItem value="promo">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <span>Special Promotion</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Target Price Input (for price alerts) */}
        {alertType === 'price' && (
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Notify when price drops below:
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="number"
                placeholder="0.00"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className="pl-8"
                step="0.01"
                min="0"
              />
            </div>
            {currentPrice && targetPrice && parseFloat(targetPrice) >= currentPrice && (
              <p className="text-sm text-amber-600 mt-1">
                ⚠️ Target price should be lower than current price (${currentPrice})
              </p>
            )}
          </div>
        )}

        {/* Notification Methods */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-3 block">
            How would you like to be notified?
          </label>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Email</span>
              </div>
              <Switch
                checked={notificationMethods.includes('email')}
                onCheckedChange={() => toggleNotificationMethod('email')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-green-500" />
                <span className="text-sm">SMS Text</span>
              </div>
              <Switch
                checked={notificationMethods.includes('sms')}
                onCheckedChange={() => toggleNotificationMethod('sms')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4 text-purple-500" />
                <span className="text-sm">Push Notification</span>
              </div>
              <Switch
                checked={notificationMethods.includes('push')}
                onCheckedChange={() => toggleNotificationMethod('push')}
              />
            </div>
          </div>
        </div>

        {/* Create Button */}
        <Button 
          onClick={createAlert} 
          disabled={isCreating || notificationMethods.length === 0 || 
                   (alertType === 'price' && (!targetPrice || parseFloat(targetPrice) >= currentPrice))}
          className="w-full"
        >
          {isCreating ? (
            <>Creating Alert...</>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Create Alert
            </>
          )}
        </Button>

        {notificationMethods.length === 0 && (
          <p className="text-sm text-red-600 text-center">
            Please select at least one notification method
          </p>
        )}
      </CardContent>
    </Card>
  );
}