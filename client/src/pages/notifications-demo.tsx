import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Mail, MessageSquare, Smartphone, CheckCircle, AlertCircle, Settings } from 'lucide-react';

interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  inApp: boolean;
}

interface NotificationType {
  id: string;
  title: string;
  description: string;
  settings: NotificationSettings;
  icon: React.ReactNode;
}

export default function NotificationsDemo() {
  const [notificationTypes, setNotificationTypes] = useState<NotificationType[]>([
    {
      id: 'wishlist-drops',
      title: 'Wishlist Item Back in Stock',
      description: 'Get notified when wishlist items become available',
      settings: { email: true, sms: true, push: true, inApp: true },
      icon: <Bell className="w-5 h-5" />
    },
    {
      id: 'price-drops',
      title: 'Price Drop Alerts',
      description: 'Notifications when prices decrease on saved items',
      settings: { email: true, sms: false, push: true, inApp: true },
      icon: <AlertCircle className="w-5 h-5" />
    },
    {
      id: 'social-invites',
      title: 'Social Shopping Invites',
      description: 'Invitations to shop with friends and community',
      settings: { email: true, sms: true, push: true, inApp: true },
      icon: <MessageSquare className="w-5 h-5" />
    },
    {
      id: 'promotions',
      title: 'Promotional Offers',
      description: 'Special deals and SPIRAL bonus opportunities',
      settings: { email: true, sms: false, push: false, inApp: true },
      icon: <Mail className="w-5 h-5" />
    },
    {
      id: 'order-updates',
      title: 'Order Status Updates',
      description: 'Shipping, delivery, and order confirmations',
      settings: { email: true, sms: true, push: true, inApp: true },
      icon: <Smartphone className="w-5 h-5" />
    }
  ]);

  const [testResults, setTestResults] = useState<Record<string, any>>({});

  // Send test notification mutation
  const sendTestMutation = useMutation({
    mutationFn: async (data: { type: string; channel: string; message: string }) => {
      const response = await fetch('/api/notifications/send-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: (data, variables) => {
      setTestResults(prev => ({
        ...prev,
        [`${variables.type}-${variables.channel}`]: data
      }));
    },
  });

  // Update notification preferences mutation
  const updatePreferencesMutation = useMutation({
    mutationFn: async (preferences: NotificationType[]) => {
      const response = await fetch('/api/notifications/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences }),
      });
      return response.json();
    },
  });

  const handleSettingChange = (typeId: string, channel: keyof NotificationSettings, enabled: boolean) => {
    const updated = notificationTypes.map(type => 
      type.id === typeId 
        ? { ...type, settings: { ...type.settings, [channel]: enabled } }
        : type
    );
    setNotificationTypes(updated);
    updatePreferencesMutation.mutate(updated);
  };

  const sendTestNotification = (type: string, channel: string) => {
    const messages = {
      'wishlist-drops': 'Your wishlist item "Wireless Headphones" is back in stock at TechMart!',
      'price-drops': 'Price dropped! "Running Shoes" is now $79.99 (was $99.99) at SportWorld.',
      'social-invites': 'Sarah invited you to shop together at Maple Grove Mall this Saturday!',
      'promotions': 'Exclusive offer: 20% off + 50 bonus SPIRALs at your favorite stores today!',
      'order-updates': 'Your order #12345 has shipped and will arrive tomorrow by 3 PM.'
    };

    sendTestMutation.mutate({
      type,
      channel,
      message: messages[type as keyof typeof messages] || 'Test notification message'
    });
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'sms': return <MessageSquare className="w-4 h-4" />;
      case 'push': return <Smartphone className="w-4 h-4" />;
      case 'inApp': return <Bell className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getChannelName = (channel: string) => {
    switch (channel) {
      case 'email': return 'Email';
      case 'sms': return 'SMS';
      case 'push': return 'Push';
      case 'inApp': return 'In-App';
      default: return channel;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            <Bell className="inline-block w-10 h-10 text-blue-600 mr-3" />
            Push Notifications & Alerts Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Multi-channel notification system for wishlist drops, invites, and promotional messaging
          </p>
        </div>

        <Tabs defaultValue="preferences" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="preferences">Notification Settings</TabsTrigger>
            <TabsTrigger value="test-center">Test Center</TabsTrigger>
            <TabsTrigger value="analytics">Delivery Analytics</TabsTrigger>
            <TabsTrigger value="integration">System Integration</TabsTrigger>
          </TabsList>

          <TabsContent value="preferences">
            <div className="space-y-6">
              {notificationTypes.map((type) => (
                <Card key={type.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      {type.icon}
                      <span className="ml-2">{type.title}</span>
                    </CardTitle>
                    <CardDescription>{type.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-4 gap-4">
                      {Object.entries(type.settings).map(([channel, enabled]) => (
                        <div key={channel} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-2">
                            {getChannelIcon(channel)}
                            <span className="font-medium">{getChannelName(channel)}</span>
                          </div>
                          <Switch
                            checked={enabled}
                            onCheckedChange={(checked) => handleSettingChange(type.id, channel as keyof NotificationSettings, checked)}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="test-center">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Test Notification Delivery</CardTitle>
                  <CardDescription>Send test notifications across all channels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notificationTypes.map((type) => (
                      <div key={type.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            {type.icon}
                            <span className="ml-2 font-medium">{type.title}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(type.settings).map(([channel, enabled]) => (
                            <Button
                              key={channel}
                              variant="outline"
                              size="sm"
                              disabled={!enabled || sendTestMutation.isPending}
                              onClick={() => sendTestNotification(type.id, channel)}
                              className="flex items-center justify-center"
                            >
                              {getChannelIcon(channel)}
                              <span className="ml-1">{getChannelName(channel)}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Test Results</CardTitle>
                  <CardDescription>Real-time delivery status</CardDescription>
                </CardHeader>
                <CardContent>
                  {Object.keys(testResults).length > 0 ? (
                    <div className="space-y-3">
                      {Object.entries(testResults).map(([key, result]) => (
                        <div key={key} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{key.replace('-', ' → ')}</span>
                            <Badge variant={result.success ? "default" : "destructive"}>
                              {result.success ? 'Delivered' : 'Failed'}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{result.message}</p>
                          {result.deliveryTime && (
                            <p className="text-xs text-blue-600">Delivered in {result.deliveryTime}ms</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Send test notifications to see delivery results</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Email Delivery Rate</span>
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{width: '94%'}}></div>
                        </div>
                        <span className="text-sm font-medium">94%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">SMS Delivery Rate</span>
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{width: '97%'}}></div>
                        </div>
                        <span className="text-sm font-medium">97%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Push Delivery Rate</span>
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                          <div className="bg-yellow-600 h-2 rounded-full" style={{width: '89%'}}></div>
                        </div>
                        <span className="text-sm font-medium">89%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">In-App Delivery Rate</span>
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{width: '99%'}}></div>
                        </div>
                        <span className="text-sm font-medium">99%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Engagement Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-1">23.7%</div>
                      <p className="text-sm text-gray-600">Email Open Rate</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-1">8.4%</div>
                      <p className="text-sm text-gray-600">Click-through Rate</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-1">67%</div>
                      <p className="text-sm text-gray-600">Push Open Rate</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600 mb-1">12.1%</div>
                      <p className="text-sm text-gray-600">Conversion Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-1">1.2s</div>
                      <p className="text-sm text-gray-600">Avg. Delivery Time</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-1">99.2%</div>
                      <p className="text-sm text-gray-600">System Uptime</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-1">4.7K</div>
                      <p className="text-sm text-gray-600">Daily Notifications</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600 mb-1">0.02%</div>
                      <p className="text-sm text-gray-600">Error Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="integration">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Service Integrations</CardTitle>
                  <CardDescription>Connected notification services and their status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <div>
                          <p className="font-medium">Firebase Push</p>
                          <p className="text-xs text-gray-600">Push notifications for mobile/web</p>
                        </div>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <div>
                          <p className="font-medium">Twilio SMS</p>
                          <p className="text-xs text-gray-600">SMS delivery worldwide</p>
                        </div>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <div>
                          <p className="font-medium">SendGrid Email</p>
                          <p className="text-xs text-gray-600">Transactional email service</p>
                        </div>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                        <div>
                          <p className="font-medium">WebSocket</p>
                          <p className="text-xs text-gray-600">Real-time in-app notifications</p>
                        </div>
                      </div>
                      <Badge variant="secondary">Testing</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Configuration</CardTitle>
                  <CardDescription>Notification system settings and limits</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-800">Rate Limits</h4>
                      <div className="text-sm text-blue-700 mt-2 space-y-1">
                        <p>Email: 1000/hour per user</p>
                        <p>SMS: 100/hour per user</p>
                        <p>Push: 500/hour per user</p>
                        <p>In-App: Unlimited</p>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-800">Retry Policy</h4>
                      <div className="text-sm text-green-700 mt-2 space-y-1">
                        <p>Max Retries: 3 attempts</p>
                        <p>Backoff: Exponential (1s, 5s, 25s)</p>
                        <p>Timeout: 30 seconds</p>
                        <p>Dead Letter Queue: Enabled</p>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold text-purple-800">Security</h4>
                      <div className="text-sm text-purple-700 mt-2 space-y-1">
                        <p>End-to-end encryption</p>
                        <p>PII data masking</p>
                        <p>GDPR compliant</p>
                        <p>Opt-out honored</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}