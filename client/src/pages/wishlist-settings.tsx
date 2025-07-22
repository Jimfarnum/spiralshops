import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Monitor,
  Settings,
  Clock,
  CheckCircle,
  AlertTriangle,
  History,
  ArrowLeft,
  Save,
  Play,
  Package,
  DollarSign,
  TrendingDown
} from 'lucide-react';

interface NotificationPreferences {
  emailEnabled: boolean;
  smsEnabled: boolean;
  browserEnabled: boolean;
  alertFrequency: string;
}

interface WishlistTracker {
  id: number;
  productId: number;
  originalPrice: string;
  alertType: string;
  lastAlertedAt: string | null;
  createdAt: string;
}

interface NotificationHistoryItem {
  id: number;
  productId: number;
  notificationType: string;
  deliveryMethod: string;
  status: string;
  sentAt: string;
  metadata: string;
}

export default function WishlistSettingsPage() {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    emailEnabled: true,
    smsEnabled: false,
    browserEnabled: true,
    alertFrequency: 'immediate'
  });
  const [trackers, setTrackers] = useState<WishlistTracker[]>([]);
  const [history, setHistory] = useState<NotificationHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [activeTab, setActiveTab] = useState('preferences');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [prefsRes, trackersRes, historyRes] = await Promise.all([
        fetch('/api/wishlist-alerts/preferences'),
        fetch('/api/wishlist-alerts/trackers'),
        fetch('/api/wishlist-alerts/history')
      ]);

      if (prefsRes.ok) {
        const prefsData = await prefsRes.json();
        setPreferences(prefsData);
      }

      if (trackersRes.ok) {
        const trackersData = await trackersRes.json();
        setTrackers(trackersData);
      }

      if (historyRes.ok) {
        const historyData = await historyRes.json();
        setHistory(historyData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Loading Error",
        description: "Failed to load settings data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/wishlist-alerts/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      });

      if (response.ok) {
        toast({
          title: "Settings Saved",
          description: "Your notification preferences have been updated",
        });
      } else {
        throw new Error('Failed to save preferences');
      }
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save notification preferences",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const testAlert = async (productId: number, alertType: string) => {
    setTesting(true);
    try {
      const response = await fetch('/api/wishlist-alerts/trigger-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, alertType }),
      });

      const result = await response.json();
      
      if (response.ok) {
        toast({
          title: "Test Alert Sent",
          description: result.message,
        });
        // Reload history to show new test alert
        loadData();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Failed to send test alert",
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  const removeTracker = async (productId: number) => {
    try {
      const response = await fetch(`/api/wishlist-alerts/track/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: "Alert Disabled",
          description: "Product removed from alert tracking",
        });
        loadData();
      }
    } catch (error) {
      toast({
        title: "Remove Failed",
        description: "Failed to remove product tracking",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case 'stock':
      case 'back_in_stock':
        return <Package className="h-4 w-4" />;
      case 'price':
      case 'price_drop':
        return <DollarSign className="h-4 w-4" />;
      case 'both':
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getDeliveryIcon = (method: string) => {
    switch (method) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'sms':
        return <Smartphone className="h-4 w-4" />;
      case 'browser':
        return <Monitor className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--spiral-cream)]">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Link href="/wishlist">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Wishlist
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-[var(--spiral-navy)]">
                Wishlist Alert Settings
              </h1>
              <p className="text-gray-600 mt-1">
                Configure how you want to be notified about your wishlist items
              </p>
            </div>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="preferences" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Preferences
              </TabsTrigger>
              <TabsTrigger value="tracking" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Active Alerts ({trackers.length})
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                Alert History
              </TabsTrigger>
            </TabsList>

            {/* Notification Preferences */}
            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Delivery Methods */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Delivery Methods</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-blue-600" />
                        <div>
                          <Label htmlFor="email-alerts" className="font-medium">Email Alerts</Label>
                          <p className="text-sm text-gray-600">Get notifications via email</p>
                        </div>
                      </div>
                      <Switch
                        id="email-alerts"
                        checked={preferences.emailEnabled}
                        onCheckedChange={(checked) => 
                          setPreferences({...preferences, emailEnabled: checked})
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-5 w-5 text-green-600" />
                        <div>
                          <Label htmlFor="sms-alerts" className="font-medium">SMS Alerts</Label>
                          <p className="text-sm text-gray-600">Get notifications via text message</p>
                        </div>
                      </div>
                      <Switch
                        id="sms-alerts"
                        checked={preferences.smsEnabled}
                        onCheckedChange={(checked) => 
                          setPreferences({...preferences, smsEnabled: checked})
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Monitor className="h-5 w-5 text-purple-600" />
                        <div>
                          <Label htmlFor="browser-alerts" className="font-medium">Browser Notifications</Label>
                          <p className="text-sm text-gray-600">Get push notifications in your browser</p>
                        </div>
                      </div>
                      <Switch
                        id="browser-alerts"
                        checked={preferences.browserEnabled}
                        onCheckedChange={(checked) => 
                          setPreferences({...preferences, browserEnabled: checked})
                        }
                      />
                    </div>
                  </div>

                  {/* Alert Frequency */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Alert Frequency</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {[
                        { value: 'immediate', label: 'Immediate', desc: 'Get alerts right away' },
                        { value: 'daily', label: 'Daily Summary', desc: 'Once per day digest' },
                        { value: 'weekly', label: 'Weekly Summary', desc: 'Weekly digest only' }
                      ].map((option) => (
                        <Card 
                          key={option.value}
                          className={`cursor-pointer transition-colors ${
                            preferences.alertFrequency === option.value ? 
                            'border-[var(--spiral-coral)] bg-[var(--spiral-coral)]/5' : 
                            'hover:border-gray-300'
                          }`}
                          onClick={() => setPreferences({...preferences, alertFrequency: option.value})}
                        >
                          <CardContent className="p-4 text-center">
                            <Clock className="h-6 w-6 mx-auto mb-2 text-[var(--spiral-coral)]" />
                            <h4 className="font-medium">{option.label}</h4>
                            <p className="text-sm text-gray-600">{option.desc}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="pt-4 border-t">
                    <Button 
                      onClick={savePreferences} 
                      disabled={saving}
                      className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/80"
                    >
                      {saving ? (
                        <>
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Preferences
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Active Tracking */}
            <TabsContent value="tracking" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Active Alert Tracking ({trackers.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {trackers.length === 0 ? (
                    <div className="text-center py-8">
                      <Bell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Alerts</h3>
                      <p className="text-gray-600 mb-4">
                        You don't have any products being tracked for alerts yet.
                      </p>
                      <Link href="/wishlist">
                        <Button variant="outline">
                          Go to Wishlist
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {trackers.map((tracker) => (
                        <div key={tracker.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                {getAlertTypeIcon(tracker.alertType)}
                                <h3 className="font-medium">Product {tracker.productId}</h3>
                                <Badge variant="outline">
                                  {tracker.alertType === 'both' ? 'Stock & Price' : 
                                   tracker.alertType === 'stock' ? 'Stock Only' : 'Price Only'}
                                </Badge>
                              </div>
                              <div className="text-sm text-gray-600">
                                <p>Original Price: ${tracker.originalPrice}</p>
                                <p>Added: {formatDate(tracker.createdAt)}</p>
                                {tracker.lastAlertedAt && (
                                  <p>Last Alert: {formatDate(tracker.lastAlertedAt)}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => testAlert(tracker.productId, tracker.alertType)}
                                disabled={testing}
                              >
                                <Play className="h-4 w-4 mr-1" />
                                Test
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => removeTracker(tracker.productId)}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notification History */}
            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Notification History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {history.length === 0 ? (
                    <div className="text-center py-8">
                      <History className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Notifications Yet</h3>
                      <p className="text-gray-600">
                        Your notification history will appear here once alerts are sent.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {history.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            {getAlertTypeIcon(item.notificationType)}
                            {getDeliveryIcon(item.deliveryMethod)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {item.notificationType === 'back_in_stock' ? 'Back in Stock' : 'Price Drop'}
                              </span>
                              <span className="text-gray-600">via {item.deliveryMethod}</span>
                              <Badge variant={item.status === 'sent' ? 'default' : 'destructive'}>
                                {item.status}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600">
                              Product {item.productId} • {formatDate(item.sentAt)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Info Alert */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Testing Mode:</strong> This demo uses simulated notifications. In production, 
              real email and SMS alerts would be sent when your wishlist items come back in stock or drop in price.
            </AlertDescription>
          </Alert>
        </div>
      </div>
      <Footer />
    </div>
  );
}