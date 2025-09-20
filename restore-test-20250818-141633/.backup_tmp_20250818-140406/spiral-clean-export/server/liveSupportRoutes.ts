import type { Express } from "express";
import { z } from "zod";

// Live Support + FAQ with Watson Assistant-style chatbot
export function registerLiveSupportRoutes(app: Express) {
  
  // Initialize chat session
  app.post("/api/support/chat/start", async (req, res) => {
    try {
      const { userId, userType = "shopper", department } = req.body;
      
      // Mock chat session creation
      const chatSession = {
        sessionId: `chat_${Date.now()}`,
        userId,
        userType, // shopper, retailer, admin
        department: department || "general",
        status: "active",
        startedAt: new Date().toISOString(),
        assignedAgent: null,
        botActive: true,
        context: {
          previousPurchases: userType === "shopper" ? 3 : null,
          accountTier: userType === "shopper" ? "Gold" : null,
          businessName: userType === "retailer" ? "Sample Business" : null
        },
        welcomeMessage: {
          message: "Hi! I'm SPIRAL Assistant. How can I help you today?",
          quickReplies: [
            "Order status",
            "Account help", 
            "Store information",
            "Technical issue",
            "Speak to agent"
          ]
        }
      };

      res.json({
        success: true,
        session: chatSession,
        message: "Chat session started successfully"
      });
      
    } catch (error) {
      console.error("Chat start error:", error);
      res.status(500).json({ error: "Failed to start chat session" });
    }
  });

  // Send message to chatbot
  app.post("/api/support/chat/message", async (req, res) => {
    try {
      const { sessionId, message, userId } = req.body;
      
      if (!sessionId || !message) {
        return res.status(400).json({ error: "Session ID and message required" });
      }

      // Mock Watson Assistant response
      const botResponse = generateBotResponse(message);
      
      const chatResponse = {
        sessionId,
        messageId: `msg_${Date.now()}`,
        userMessage: {
          text: message,
          timestamp: new Date().toISOString(),
          sender: "user"
        },
        botResponse: {
          ...botResponse,
          timestamp: new Date().toISOString(),
          sender: "bot"
        },
        context: {
          intent: botResponse.intent,
          confidence: botResponse.confidence,
          needsHumanAgent: botResponse.confidence < 0.7 || message.toLowerCase().includes("agent")
        }
      };

      res.json(chatResponse);
      
    } catch (error) {
      console.error("Chat message error:", error);
      res.status(500).json({ error: "Failed to process chat message" });
    }
  });

  // Request human agent
  app.post("/api/support/chat/request-agent", async (req, res) => {
    try {
      const { sessionId, reason, priority = "normal" } = req.body;
      
      if (!sessionId) {
        return res.status(400).json({ error: "Session ID required" });
      }

      // Mock agent request
      const agentRequest = {
        requestId: `agent_req_${Date.now()}`,
        sessionId,
        reason,
        priority, // low, normal, high, urgent
        status: "queued",
        estimatedWaitTime: priority === "urgent" ? "2-5 minutes" : "5-15 minutes",
        queuePosition: priority === "urgent" ? 1 : 3,
        requestedAt: new Date().toISOString(),
        departmentRouting: {
          technical: reason?.toLowerCase().includes("bug") || reason?.toLowerCase().includes("error"),
          billing: reason?.toLowerCase().includes("payment") || reason?.toLowerCase().includes("charge"),
          general: true
        }
      };

      res.json({
        success: true,
        agentRequest,
        message: "Agent request submitted. You'll be connected soon."
      });
      
    } catch (error) {
      console.error("Agent request error:", error);
      res.status(500).json({ error: "Failed to request agent" });
    }
  });

  // Get FAQ categories and articles
  app.get("/api/support/faq", async (req, res) => {
    try {
      const { category, search } = req.query;
      
      // Mock FAQ data
      const faqData = {
        categories: [
          {
            id: "account",
            name: "Account & Profile",
            icon: "user",
            articleCount: 12
          },
          {
            id: "orders",
            name: "Orders & Shipping",
            icon: "package",
            articleCount: 18
          },
          {
            id: "spiral",
            name: "SPIRAL Rewards",
            icon: "award",
            articleCount: 8
          },
          {
            id: "retailer",
            name: "Retailer Support",
            icon: "store",
            articleCount: 15
          },
          {
            id: "technical",
            name: "Technical Issues",
            icon: "settings",
            articleCount: 10
          }
        ],
        articles: [
          {
            id: "faq_001",
            title: "How do I earn SPIRAL points?",
            category: "spiral",
            summary: "Learn about earning SPIRAL points through purchases and activities",
            content: "You can earn SPIRAL points by: 1) Making purchases (5 points per $100 online, 10 points per $100 in-store), 2) Referring friends (50 points), 3) Social sharing (5 points), 4) Writing reviews (10 points)",
            tags: ["points", "earning", "rewards"],
            helpful: 94,
            views: 1247
          },
          {
            id: "faq_002",
            title: "Where is my order?",
            category: "orders",
            summary: "Track your order status and delivery information",
            content: "To track your order: 1) Go to My Account > Orders, 2) Click on your order number, 3) View real-time tracking information, 4) Contact support if you have concerns",
            tags: ["tracking", "delivery", "status"],
            helpful: 89,
            views: 2156
          },
          {
            id: "faq_003",
            title: "How to verify my store?",
            category: "retailer",
            summary: "Complete store verification process for trust badges",
            content: "To verify your store: 1) Upload business license, 2) Provide tax ID, 3) Submit bank verification, 4) Wait for review (2-3 business days), 5) Receive verification badge",
            tags: ["verification", "business", "trust"],
            helpful: 97,
            views: 892
          }
        ],
        popularSearches: [
          "reset password",
          "cancel order", 
          "refund policy",
          "shipping costs",
          "SPIRAL points"
        ]
      };

      // Apply filters
      let filteredArticles = faqData.articles;
      
      if (category) {
        filteredArticles = filteredArticles.filter(article => article.category === category);
      }
      
      if (search) {
        const searchTerm = (search as string).toLowerCase();
        filteredArticles = filteredArticles.filter(article => 
          article.title.toLowerCase().includes(searchTerm) ||
          article.content.toLowerCase().includes(searchTerm) ||
          article.tags.some(tag => tag.includes(searchTerm))
        );
      }

      res.json({
        categories: faqData.categories,
        articles: filteredArticles,
        popularSearches: faqData.popularSearches,
        searchResults: search ? filteredArticles.length : null
      });
      
    } catch (error) {
      console.error("FAQ error:", error);
      res.status(500).json({ error: "Failed to retrieve FAQ data" });
    }
  });

  // Submit support ticket
  app.post("/api/support/ticket", async (req, res) => {
    try {
      const { 
        userId, 
        subject, 
        description, 
        category, 
        priority = "normal",
        attachments = []
      } = req.body;
      
      if (!userId || !subject || !description) {
        return res.status(400).json({ error: "User ID, subject, and description required" });
      }

      // Mock ticket creation
      const ticket = {
        ticketId: `TKT-${Date.now()}`,
        userId,
        subject,
        description,
        category: category || "general",
        priority,
        status: "open",
        assignedAgent: null,
        createdAt: new Date().toISOString(),
        estimatedResolution: calculateResolutionTime(priority),
        autoResponses: [
          {
            message: "Thank you for contacting SPIRAL support. We've received your ticket and will respond soon.",
            timestamp: new Date().toISOString()
          }
        ],
        attachments,
        tags: extractTags(description)
      };

      res.json({
        success: true,
        ticket,
        message: "Support ticket created successfully"
      });
      
    } catch (error) {
      console.error("Ticket creation error:", error);
      res.status(500).json({ error: "Failed to create support ticket" });
    }
  });

  // Get support ticket status
  app.get("/api/support/ticket/:ticketId", async (req, res) => {
    try {
      const { ticketId } = req.params;
      
      // Mock ticket details
      const ticket = {
        ticketId,
        subject: "Unable to redeem SPIRAL points",
        description: "I'm trying to redeem my SPIRAL points but getting an error message",
        status: "in_progress",
        priority: "normal",
        category: "spiral",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        assignedAgent: {
          name: "Sarah Johnson",
          id: "agent_001",
          department: "Customer Success"
        },
        responses: [
          {
            id: "resp_001",
            sender: "system",
            message: "Thank you for contacting SPIRAL support. We've received your ticket and will respond soon.",
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: "resp_002",
            sender: "agent",
            senderName: "Sarah Johnson",
            message: "Hi! I'm looking into your SPIRAL points issue. Can you tell me what error message you're seeing?",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
          }
        ],
        estimatedResolution: "24-48 hours",
        tags: ["spiral_points", "redemption", "error"]
      };

      res.json(ticket);
      
    } catch (error) {
      console.error("Ticket retrieval error:", error);
      res.status(500).json({ error: "Failed to retrieve ticket" });
    }
  });

  // Get support analytics (admin)
  app.get("/api/support/analytics", async (req, res) => {
    try {
      const { startDate, endDate, department } = req.query;
      
      // Mock support analytics
      const analytics = {
        period: {
          startDate: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: endDate || new Date().toISOString()
        },
        overview: {
          totalTickets: 1247,
          resolvedTickets: 1156,
          averageResponseTime: "2.4 hours",
          averageResolutionTime: "18.7 hours",
          customerSatisfaction: 4.3
        },
        byCategory: [
          {
            category: "orders",
            tickets: 456,
            avgResolutionTime: "12.5 hours",
            satisfaction: 4.5
          },
          {
            category: "spiral",
            tickets: 342,
            avgResolutionTime: "8.2 hours", 
            satisfaction: 4.4
          },
          {
            category: "retailer",
            tickets: 289,
            avgResolutionTime: "24.1 hours",
            satisfaction: 4.1
          },
          {
            category: "technical",
            tickets: 160,
            avgResolutionTime: "31.7 hours",
            satisfaction: 3.9
          }
        ],
        agentPerformance: [
          {
            agentId: "agent_001",
            name: "Sarah Johnson",
            ticketsHandled: 89,
            avgResponseTime: "1.8 hours",
            satisfaction: 4.6
          },
          {
            agentId: "agent_002", 
            name: "Mike Chen",
            ticketsHandled: 76,
            avgResponseTime: "2.1 hours",
            satisfaction: 4.4
          }
        ],
        chatbotMetrics: {
          sessionsStarted: 3456,
          resolvedByBot: 2134,
          escalatedToAgent: 1322,
          botSatisfaction: 3.8,
          topIntents: ["order_status", "account_help", "spiral_points"]
        }
      };

      res.json(analytics);
      
    } catch (error) {
      console.error("Support analytics error:", error);
      res.status(500).json({ error: "Failed to retrieve support analytics" });
    }
  });
}

// Utility functions
function generateBotResponse(message: string): any {
  const lowerMessage = message.toLowerCase();
  
  // Intent recognition and response generation
  if (lowerMessage.includes("order") || lowerMessage.includes("shipping")) {
    return {
      text: "I can help you track your order! Please provide your order number or email address.",
      intent: "order_inquiry",
      confidence: 0.92,
      quickReplies: ["Check order status", "Shipping information", "Cancel order"],
      suggestedActions: [
        {
          title: "Track Order",
          url: "/orders"
        }
      ]
    };
  }
  
  if (lowerMessage.includes("spiral") || lowerMessage.includes("points") || lowerMessage.includes("rewards")) {
    return {
      text: "SPIRAL points questions! You can earn points through purchases, referrals, and activities. Current ways to earn: • 5 points per $100 online • 10 points per $100 in-store • 50 points for referrals",
      intent: "spiral_inquiry",
      confidence: 0.89,
      quickReplies: ["Check my balance", "How to earn more", "Redeem points"],
      suggestedActions: [
        {
          title: "View SPIRAL Balance",
          url: "/loyalty"
        }
      ]
    };
  }
  
  if (lowerMessage.includes("agent") || lowerMessage.includes("human") || lowerMessage.includes("speak")) {
    return {
      text: "I'll connect you with a human agent right away. Please hold on while I find someone to help you.",
      intent: "agent_request",
      confidence: 0.95,
      escalateToAgent: true
    };
  }
  
  if (lowerMessage.includes("store") || lowerMessage.includes("retailer") || lowerMessage.includes("business")) {
    return {
      text: "Are you looking for store information or retailer support? I can help with store verification, business onboarding, or finding local stores.",
      intent: "store_inquiry",
      confidence: 0.85,
      quickReplies: ["Find stores", "Retailer help", "Store verification"],
      suggestedActions: [
        {
          title: "Browse Stores", 
          url: "/stores"
        }
      ]
    };
  }
  
  // Default response
  return {
    text: "I'm here to help! I can assist with orders, SPIRAL rewards, store information, and account questions. What specific help do you need today?",
    intent: "general_inquiry",
    confidence: 0.60,
    quickReplies: ["Order help", "Account questions", "SPIRAL rewards", "Store information", "Speak to agent"]
  };
}

function calculateResolutionTime(priority: string): string {
  switch (priority) {
    case "urgent":
      return "2-4 hours";
    case "high":
      return "4-8 hours";
    case "normal":
      return "24-48 hours";
    case "low":
      return "48-72 hours";
    default:
      return "24-48 hours";
  }
}

function extractTags(description: string): string[] {
  const commonTags: { [key: string]: string } = {
    "order": "orders",
    "shipping": "shipping",
    "spiral": "spiral_points",
    "points": "spiral_points",
    "payment": "billing",
    "refund": "refunds",
    "account": "account",
    "login": "login",
    "password": "password_reset"
  };
  
  const tags: string[] = [];
  const lowerDesc = description.toLowerCase();
  
  Object.keys(commonTags).forEach(keyword => {
    if (lowerDesc.includes(keyword)) {
      tags.push(commonTags[keyword]);
    }
  });
  
  return [...new Set(tags)]; // Remove duplicates
}