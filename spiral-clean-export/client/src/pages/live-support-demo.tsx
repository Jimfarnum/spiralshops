import React, { useState, useRef, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Bot, User, Phone, Mail, Clock, CheckCircle, HelpCircle } from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot' | 'agent';
  message: string;
  timestamp: Date;
  resolved?: boolean;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpfulness: number;
}

export default function LiveSupportDemo() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      message: 'Hello! I\'m SPIRAL Assistant. How can I help you today?',
      timestamp: new Date(),
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [chatMode, setChatMode] = useState<'bot' | 'agent'>('bot');
  const [supportTicket, setSupportTicket] = useState<string>('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // FAQ data query
  const { data: faqItems } = useQuery({
    queryKey: ['/api/live-support/faq'],
    initialData: [
      {
        id: '1',
        question: 'How do I earn SPIRAL points?',
        answer: 'You earn 5 SPIRALs per $100 spent online, 10 SPIRALs per $100 spent in-store, plus bonus points for referrals, reviews, and social sharing.',
        category: 'SPIRAL Loyalty',
        helpfulness: 98
      },
      {
        id: '2',
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards, PayPal, Apple Pay, Google Pay, and SPIRAL points for purchases.',
        category: 'Payments',
        helpfulness: 95
      },
      {
        id: '3',
        question: 'How do I track my order?',
        answer: 'You can track your order by going to "My Orders" in your account or using the tracking link in your confirmation email.',
        category: 'Orders',
        helpfulness: 92
      },
      {
        id: '4',
        question: 'Can I shop from multiple stores in one order?',
        answer: 'Yes! SPIRAL\'s multi-retailer cart lets you shop from different stores and choose different fulfillment methods for each item.',
        category: 'Shopping',
        helpfulness: 90
      },
      {
        id: '5',
        question: 'How do I become a verified retailer?',
        answer: 'Submit your business documents through our verification portal. We offer 5 verification tiers from Basic to National level.',
        category: 'Retailers',
        helpfulness: 87
      }
    ] as FAQItem[]
  });

  // Send chat message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (data: { message: string; mode: 'bot' | 'agent' }) => {
      const response = await fetch('/api/live-support/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: (data) => {
      const botResponse: ChatMessage = {
        id: Date.now().toString(),
        type: data.escalated ? 'agent' : 'bot',
        message: data.response,
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, botResponse]);
      
      if (data.escalated) {
        setChatMode('agent');
        setSupportTicket(data.ticketId);
      }
    },
  });

  // FAQ search mutation
  const faqSearchMutation = useMutation({
    mutationFn: async (query: string) => {
      const response = await fetch('/api/live-support/faq-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      return response.json();
    },
  });

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: currentMessage,
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    sendMessageMutation.mutate({ message: currentMessage, mode: chatMode });
    setCurrentMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const searchFAQ = (query: string) => {
    faqSearchMutation.mutate(query);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'user': return <User className="w-5 h-5" />;
      case 'bot': return <Bot className="w-5 h-5" />;
      case 'agent': return <MessageCircle className="w-5 h-5" />;
      default: return <MessageCircle className="w-5 h-5" />;
    }
  };

  const faqCategories = Array.from(new Set(faqItems?.map(item => item.category) || []));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            <MessageCircle className="inline-block w-10 h-10 text-indigo-600 mr-3" />
            Live Support & FAQ Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Watson Assistant chatbot with intelligent routing, human escalation, and comprehensive FAQ engine
          </p>
        </div>

        <Tabs defaultValue="live-chat" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="live-chat">Live Chat</TabsTrigger>
            <TabsTrigger value="faq">FAQ Center</TabsTrigger>
            <TabsTrigger value="support-analytics">Support Analytics</TabsTrigger>
            <TabsTrigger value="integration">Watson Integration</TabsTrigger>
          </TabsList>

          <TabsContent value="live-chat">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card className="h-[600px] flex flex-col">
                  <CardHeader className="flex-shrink-0">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <MessageCircle className="w-6 h-6 mr-2" />
                        Live Support Chat
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={chatMode === 'bot' ? 'default' : 'secondary'}>
                          {chatMode === 'bot' ? 'AI Assistant' : 'Human Agent'}
                        </Badge>
                        {supportTicket && (
                          <Badge variant="outline">Ticket #{supportTicket}</Badge>
                        )}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                      {chatMessages.map((message) => (
                        <div key={message.id} className={`flex items-start space-x-3 ${
                          message.type === 'user' ? 'justify-end' : 'justify-start'
                        }`}>
                          {message.type !== 'user' && (
                            <div className={`p-2 rounded-full ${
                              message.type === 'bot' ? 'bg-blue-100' : 'bg-green-100'
                            }`}>
                              {getMessageIcon(message.type)}
                            </div>
                          )}
                          <div className={`max-w-[70%] p-3 rounded-lg ${
                            message.type === 'user' 
                              ? 'bg-indigo-600 text-white' 
                              : message.type === 'bot'
                              ? 'bg-gray-100'
                              : 'bg-green-100'
                          }`}>
                            <p className="text-sm">{message.message}</p>
                            <p className={`text-xs mt-1 ${
                              message.type === 'user' ? 'text-indigo-200' : 'text-gray-500'
                            }`}>
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                          {message.type === 'user' && (
                            <div className="p-2 rounded-full bg-indigo-100">
                              {getMessageIcon(message.type)}
                            </div>
                          )}
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                    </div>
                    
                    <div className="flex space-x-2">
                      <Input
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        disabled={sendMessageMutation.isPending}
                      />
                      <Button 
                        onClick={handleSendMessage}
                        disabled={!currentMessage.trim() || sendMessageMutation.isPending}
                      >
                        Send
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <HelpCircle className="w-4 h-4 mr-2" />
                      View FAQ
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Phone className="w-4 h-4 mr-2" />
                      Request Callback
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Support
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Escalate to Agent
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Support Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Response Time</span>
                      <Badge variant="default">&lt; 30 seconds</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Agents Available</span>
                      <Badge variant="default">12 online</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Queue Position</span>
                      <Badge variant="outline">N/A</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Satisfaction Rate</span>
                      <Badge variant="default">97.2%</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="faq">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        All Categories
                      </Button>
                      {faqCategories.map((category) => (
                        <Button key={category} variant="ghost" className="w-full justify-start">
                          {category}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="md:col-span-3 space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Search FAQ..."
                        onChange={(e) => searchFAQ(e.target.value)}
                      />
                      <Button variant="outline">Search</Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  {faqItems?.map((item) => (
                    <Card key={item.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span className="text-lg">{item.question}</span>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{item.category}</Badge>
                            <Badge variant="default">{item.helpfulness}% helpful</Badge>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 mb-4">{item.answer}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              👍 Helpful
                            </Button>
                            <Button variant="outline" size="sm">
                              👎 Not Helpful
                            </Button>
                          </div>
                          <Button variant="ghost" size="sm">
                            Still need help?
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="support-analytics">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Response Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-1">23s</div>
                      <p className="text-sm text-gray-600">Avg. First Response</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-1">4.2min</div>
                      <p className="text-sm text-gray-600">Avg. Resolution Time</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-1">97.2%</div>
                      <p className="text-sm text-gray-600">Customer Satisfaction</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Channel Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Live Chat</span>
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{width: '89%'}}></div>
                        </div>
                        <span className="text-sm font-medium">89%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Email Support</span>
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{width: '94%'}}></div>
                        </div>
                        <span className="text-sm font-medium">94%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Phone Support</span>
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                          <div className="bg-yellow-600 h-2 rounded-full" style={{width: '87%'}}></div>
                        </div>
                        <span className="text-sm font-medium">87%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">FAQ Self-Service</span>
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{width: '76%'}}></div>
                        </div>
                        <span className="text-sm font-medium">76%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Volume Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-1">1,247</div>
                      <p className="text-sm text-gray-600">Daily Conversations</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-1">73%</div>
                      <p className="text-sm text-gray-600">Bot Resolution Rate</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-1">27%</div>
                      <p className="text-sm text-gray-600">Human Escalation Rate</p>
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
                  <CardTitle>Watson Assistant Integration</CardTitle>
                  <CardDescription>AI-powered conversational support</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <div>
                          <p className="font-medium">Watson Discovery</p>
                          <p className="text-xs text-gray-600">Knowledge base search</p>
                        </div>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <div>
                          <p className="font-medium">Natural Language Understanding</p>
                          <p className="text-xs text-gray-600">Intent recognition</p>
                        </div>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <div>
                          <p className="font-medium">Conversation Flow</p>
                          <p className="text-xs text-gray-600">Dialog management</p>
                        </div>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                        <div>
                          <p className="font-medium">Human Handoff</p>
                          <p className="text-xs text-gray-600">Agent escalation</p>
                        </div>
                      </div>
                      <Badge variant="secondary">Testing</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Performance</CardTitle>
                  <CardDescription>Real-time support system metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-800">Response Times</h4>
                      <div className="text-sm text-blue-700 mt-2 space-y-1">
                        <p>Bot Response: &lt;1 second</p>
                        <p>Human Agent: 23 seconds avg</p>
                        <p>FAQ Search: 200ms</p>
                        <p>Knowledge Base: 500ms</p>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-800">Accuracy Metrics</h4>
                      <div className="text-sm text-green-700 mt-2 space-y-1">
                        <p>Intent Recognition: 94.2%</p>
                        <p>FAQ Match Relevance: 87.8%</p>
                        <p>Answer Confidence: 91.5%</p>
                        <p>Customer Satisfaction: 97.2%</p>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold text-purple-800">System Health</h4>
                      <div className="text-sm text-purple-700 mt-2 space-y-1">
                        <p>Uptime: 99.8%</p>
                        <p>Error Rate: 0.3%</p>
                        <p>API Latency: 45ms</p>
                        <p>Concurrent Users: 234</p>
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