import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, X, Send, Clock, Users, Minimize2 } from 'lucide-react';

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! Welcome to SPIRAL. I'm here to help you with any questions about local shopping, SPIRALs, or our platform. How can I assist you today?",
      sender: 'agent',
      timestamp: new Date(Date.now() - 2000),
      name: 'Maya - SPIRAL Support'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const userMessage = {
        id: messages.length + 1,
        text: message,
        sender: 'user',
        timestamp: new Date(),
        name: 'You'
      };
      
      setMessages([...messages, userMessage]);
      setMessage('');
      setIsTyping(true);

      // Simulate agent response
      setTimeout(() => {
        const responses = [
          "Thanks for your message! For questions about SPIRALs, you earn 5 points per $100 spent online and 10 points per $100 in-store. Is there something specific you'd like to know?",
          "I'd be happy to help you find local stores! What type of business are you looking for and in which area?",
          "Great question! Local retailers love SPIRAL because it helps them connect with community members. Would you like me to connect you with our retailer onboarding team?",
          "I can help you with that! For account-related questions, you can also visit your profile settings or contact our support team directly.",
          "That sounds like a wonderful SPIRAL story! Have you considered sharing it on our homepage? You can use the 'Share My SPIRAL Story' button."
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const agentMessage = {
          id: messages.length + 2,
          text: randomResponse,
          sender: 'agent',
          timestamp: new Date(),
          name: 'Maya - SPIRAL Support'
        };
        
        setMessages(prev => [...prev, agentMessage]);
        setIsTyping(false);
      }, 1500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
        
        {/* Notification badge for new messages */}
        <div className="absolute -top-1 -right-1">
          <Badge className="bg-[var(--spiral-gold)] text-white text-xs px-1.5 py-0.5 animate-pulse">
            💬
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-80 bg-white shadow-2xl border-0 transition-all duration-300 ${isMinimized ? 'h-16' : 'h-96'}`}>
        <CardHeader className="p-4 bg-[var(--spiral-coral)] text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">SPIRAL Support</CardTitle>
                <div className="flex items-center gap-1 text-xs opacity-90">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Online now</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-6 w-6 p-0 text-white hover:bg-white/20"
              >
                <Minimize2 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0 text-white hover:bg-white/20"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-80">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
                    {msg.sender === 'agent' && (
                      <p className="text-xs text-gray-500 mb-1">{msg.name}</p>
                    )}
                    <div
                      className={`rounded-lg px-3 py-2 text-sm ${
                        msg.sender === 'user'
                          ? 'bg-[var(--spiral-coral)] text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm">
                    <div className="flex items-center gap-1">
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
            <div className="border-t p-3">
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 text-sm border-gray-200 focus:border-[var(--spiral-coral)]"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90 text-white px-3"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Quick Actions */}
              <div className="flex gap-1 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMessage("How do SPIRALs work?")}
                  className="text-xs px-2 py-1 h-6"
                >
                  SPIRALs Help
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMessage("Find local stores")}
                  className="text-xs px-2 py-1 h-6"
                >
                  Find Stores
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}