import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MapPin, ShoppingCart, Star, Navigation } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from '@/hooks/useLocation';
import { formatDistance } from '@/utils/getDistance';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  products?: any[];
}

interface ShoppingAssistantProps {
  className?: string;
}

export default function AIShoppingAssistant({ className = '' }: ShoppingAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm your AI shopping assistant. I can help you find products in local stores. What are you looking for today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { coordinates: userLocation, getCurrentLocation } = useLocation();
  
  const requestLocation = async () => {
    try {
      await getCurrentLocation();
    } catch (error) {
      console.error('Location error:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/shopping-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: inputValue,
          userLocation,
          preferences: {} // Could be expanded to include user preferences
        })
      });

      const data = await response.json();

      if (data.success) {
        const aiResponse = data.data.aiResponse;
        const products = data.data.matches;

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: aiResponse.recommendations || 
                   `I found ${products.length} products that match your search. Here are some great options from local stores!`,
          timestamp: new Date(),
          products: products.slice(0, 3) // Show top 3 products in chat
        };

        setMessages(prev => [...prev, assistantMessage]);

        if (aiResponse.tips) {
          const tipsMessage: Message = {
            id: (Date.now() + 2).toString(),
            type: 'assistant',
            content: `💡 Shopping Tips: ${aiResponse.tips}`,
            timestamp: new Date()
          };
          setTimeout(() => {
            setMessages(prev => [...prev, tipsMessage]);
          }, 1000);
        }
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('AI assistant error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I'm sorry, I couldn't process your request right now. Please try again later.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const addToCart = (product: any) => {
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart`,
    });
  };

  return (
    <Card className={`h-96 flex flex-col ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-teal-600" />
          AI Shopping Assistant
        </CardTitle>
        {!userLocation && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>Enable location for personalized results</span>
            <Button size="sm" variant="outline" onClick={requestLocation}>
              Enable
            </Button>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="space-y-2">
              <div
                className={`flex gap-3 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.type === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-teal-600" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 ${
                    message.type === 'user'
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>

                {message.type === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </div>

              {/* Products */}
              {message.products && message.products.length > 0 && (
                <div className="ml-11 space-y-2">
                  {message.products.map((product, index) => (
                    <Card key={index} className="border border-gray-200">
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{product.name}</h4>
                            <p className="text-xs text-gray-600">{product.store}</p>
                            <Badge variant="outline" className="text-xs mt-1">
                              {product.category}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">${product.price}</p>
                            {product.distance && (
                              <p className="text-xs text-gray-500">
                                {formatDistance(product.distance)}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-2">
                          {product.distance && userLocation && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs h-7"
                              onClick={() => window.open(
                                `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(product.store)}`,
                                '_blank'
                              )}
                            >
                              <Navigation className="w-3 h-3 mr-1" />
                              Directions
                            </Button>
                          )}
                          <Button
                            size="sm"
                            className="text-xs h-7"
                            onClick={() => addToCart(product)}
                          >
                            <ShoppingCart className="w-3 h-3 mr-1" />
                            Add to Cart
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                <Bot className="w-4 h-4 text-teal-600" />
              </div>
              <div className="bg-gray-100 rounded-lg px-3 py-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me about products you're looking for..."
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}