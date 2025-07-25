import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, Send, Clock, User, Store, Mail } from "lucide-react";

interface Message {
  id: number;
  senderId: string;
  receiverId: string;
  senderType: 'user' | 'retailer';
  receiverType: 'user' | 'retailer';
  subject?: string;
  message: string;
  isRead: boolean;
  timestamp: string;
}

interface Conversation {
  partnerId: string;
  partnerType: 'user' | 'retailer';
  lastMessage: string;
  lastTimestamp: string;
  isRead: boolean;
}

interface RetailerMessagingProps {
  currentUserId: string;
  currentUserType: 'user' | 'retailer';
  retailerId?: string;
  className?: string;
}

export default function RetailerMessaging({ 
  currentUserId, 
  currentUserType,
  retailerId,
  className = ""
}: RetailerMessagingProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(retailerId || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchConversations();
  }, [currentUserId]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversations = async () => {
    try {
      const response = await fetch(`/api/messages/conversations/${currentUserId}`);
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const fetchMessages = async (partnerId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/messages/${currentUserId}/${partnerId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
        
        // Mark messages as read
        await markAsRead(partnerId);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (partnerId: string) => {
    try {
      await fetch("/api/messages/mark-read", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: partnerId,
          receiverId: currentUserId
        })
      });
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const sendMessage = async () => {
    if (!selectedConversation || !newMessage.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a conversation and enter a message",
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch("/api/messages/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: currentUserId,
          receiverId: selectedConversation,
          senderType: currentUserType,
          receiverType: currentUserType === 'user' ? 'retailer' : 'user',
          subject: newSubject || undefined,
          message: newMessage
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [data.message, ...prev]);
        setNewMessage("");
        setNewSubject("");
        
        toast({
          title: "Message Sent",
          description: "Your message has been delivered",
        });

        // Refresh conversations to update last message
        fetchConversations();
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Send Failed",
        description: "Unable to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getPartnerName = (partnerId: string, partnerType: string) => {
    if (partnerType === 'retailer') {
      return `Store ${partnerId}`;
    }
    return `User ${partnerId}`;
  };

  return (
    <div className={`flex h-[600px] bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
      {/* Conversations Sidebar */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-[var(--spiral-navy)] flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Messages
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {currentUserType === 'user' ? 'Chat with retailers' : 'Customer messages'}
          </p>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {conversations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No conversations yet</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.partnerId}
                  onClick={() => setSelectedConversation(conv.partnerId)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                    selectedConversation === conv.partnerId
                      ? 'bg-[var(--spiral-navy)] text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {conv.partnerType === 'retailer' ? (
                        <Store className="w-4 h-4 flex-shrink-0" />
                      ) : (
                        <User className="w-4 h-4 flex-shrink-0" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">
                          {getPartnerName(conv.partnerId, conv.partnerType)}
                        </p>
                        <p className="text-xs opacity-75 truncate">
                          {conv.lastMessage}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="text-xs opacity-75">
                        {formatTimestamp(conv.lastTimestamp)}
                      </p>
                      {!conv.isRead && (
                        <Badge variant="default" className="text-xs mt-1">
                          New
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2">
                {currentUserType === 'user' ? (
                  <Store className="w-5 h-5 text-[var(--spiral-navy)]" />
                ) : (
                  <User className="w-5 h-5 text-[var(--spiral-navy)]" />
                )}
                <h4 className="font-semibold text-[var(--spiral-navy)]">
                  {getPartnerName(selectedConversation, currentUserType === 'user' ? 'retailer' : 'user')}
                </h4>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--spiral-navy)] mx-auto"></div>
                    <p className="text-sm text-gray-500 mt-2">Loading messages...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Mail className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.slice().reverse().map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          message.senderId === currentUserId
                            ? 'bg-[var(--spiral-navy)] text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        {message.subject && (
                          <p className="font-semibold text-sm mb-1 opacity-90">
                            {message.subject}
                          </p>
                        )}
                        <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                        <div className="flex items-center gap-2 mt-2 pt-1 border-t border-current opacity-60">
                          <Clock className="w-3 h-3" />
                          <span className="text-xs">
                            {formatTimestamp(message.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="space-y-3">
                <Input
                  placeholder="Subject (optional)"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="text-sm"
                />
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    rows={2}
                    className="flex-1 resize-none"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={isSending || !newMessage.trim()}
                    className="bg-[var(--spiral-navy)] hover:bg-[var(--spiral-coral)] px-4"
                  >
                    {isSending ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Select a conversation</p>
              <p className="text-sm">Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}