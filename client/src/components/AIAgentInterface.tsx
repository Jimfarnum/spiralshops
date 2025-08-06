import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Bot, User, Loader2 } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface AIAgentInterfaceProps {
  agentType: 'shopper-assist' | 'wishlist' | 'image-search' | 'mall-directory' | 'admin-audit' | 'retailer-onboard' | 'product-entry';
  title: string;
  description: string;
  placeholder?: string;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  agentName?: string;
}

export function AIAgentInterface({ agentType, title, description, placeholder = "How can I help you today?" }: AIAgentInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let endpoint = '';
      let payload = {};

      switch (agentType) {
        case 'shopper-assist':
          endpoint = '/api/ai-agents/shopper-assist/chat';
          payload = { query: input, context: {} };
          break;
        case 'wishlist':
          endpoint = '/api/ai-agents/wishlist/organize';
          payload = { items: [], preferences: { query: input } };
          break;
        case 'image-search':
          endpoint = '/api/ai-agents/image-search/find-similar';
          payload = { productDescription: input, stylePreferences: {} };
          break;
        case 'mall-directory':
          endpoint = '/api/ai-agents/mall-directory/discover-stores';
          payload = { interests: [input], mallInfo: {} };
          break;
        case 'admin-audit':
          endpoint = '/api/ai-agents/admin-audit/performance';
          payload = { metrics: { query: input }, timeframe: '24h' };
          break;
        case 'retailer-onboard':
          endpoint = '/api/ai-agents/retailer-onboard/chat';
          payload = { query: input, context: {} };
          break;
        case 'product-entry':
          endpoint = '/api/ai-agents/product-entry/analyze';
          payload = { productData: { description: input } };
          break;
      }

      const data = await apiRequest('POST', endpoint, payload);
      
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.data?.response || data.data?.analysis || data.data?.recommendations || data.data?.organization || data.data?.message || 'I received your message and I\'m here to help!',
        sender: 'agent',
        timestamp: new Date(),
        agentName: data.agent || data.data?.agent || 'AI Assistant'
      };

      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      console.error('AI Agent error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'I apologize, but I\'m having trouble processing your request right now. Please try again in a moment.',
        sender: 'agent',
        timestamp: new Date(),
        agentName: 'AI Assistant'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-600" />
          {title}
        </CardTitle>
        <p className="text-sm text-gray-600">{description}</p>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-gray-50 rounded-lg">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <Bot className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>Start a conversation with your AI assistant</p>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border shadow-sm'
                }`}
              >
                <div className="flex items-start gap-2">
                  {message.sender === 'agent' && (
                    <Bot className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                  )}
                  {message.sender === 'user' && (
                    <User className="w-4 h-4 mt-0.5 text-white flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                      {message.agentName && (
                        <Badge variant="secondary" className="text-xs">
                          {message.agentName}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border shadow-sm rounded-lg p-3 max-w-[80%]">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span className="text-sm text-gray-600">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="flex-1 resize-none"
            rows={2}
            disabled={isLoading}
          />
          <Button 
            onClick={sendMessage} 
            disabled={!input.trim() || isLoading}
            className="self-end"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <MessageSquare className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}