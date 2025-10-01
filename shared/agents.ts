import { z } from "zod";

// Agent Types - All SPIRAL platform agents
export const AgentType = z.enum([
  "EJ",
  "Clara", 
  "Bannister",
  "RetailerOnboardAgent",
  "PromoBuilder",
  "ShopperUX",
  "Mini",
  "SpiralAI",
  "SystemOrchestrator",
  "AnalyticsAgent",
  "ContentAgent",
  "NotificationAgent",
]);

export type Agent = z.infer<typeof AgentType>;

// Message Topics - Categorization of inter-agent communication
export const MessageTopic = z.enum([
  "gtm.strategy",
  "gtm.campaign", 
  "weekly.review",
  "spiralai.query",
  "spiralai.insight",
  "spiralai.analysis",
  "promo.campaign",
  "promo.approval",
  "retailer.onboarding",
  "retailer.verification",
  "shopper.ux",
  "shopper.journey",
  "user.engagement",
  "system.status",
  "system.alert",
  "workflow.coordination",
  "data.sync",
  "content.generation",
  "narrative.reframing",
  "notification.dispatch",
  "analytics.report",
  "performance.metrics",
  "insight.synthesis",
]);

export type Topic = z.infer<typeof MessageTopic>;

// Message Status - Lifecycle tracking for messages
export const MessageStatus = z.enum([
  "queued",
  "processing", 
  "processed",
  "failed",
  "retrying",
  "timeout",
  "cancelled",
  "delivered",
]);

export type Status = z.infer<typeof MessageStatus>;

// Message Priority Levels
export const MessagePriority = z.enum([
  "low",
  "normal",
  "high", 
  "urgent",
  "critical",
]);

export type Priority = z.infer<typeof MessagePriority>;

// Base Agent Message Schema
export const agentMessageSchema = z.object({
  id: z.string().uuid(),
  topic: MessageTopic,
  sender: AgentType,
  recipient: AgentType.or(z.literal("broadcast")),
  payload: z.record(z.any()),
  timestamp: z.date(),
  correlationId: z.string().optional(),
  status: MessageStatus,
  priority: MessagePriority.default("normal"),
  retryCount: z.number().default(0),
  maxRetries: z.number().default(3),
  expiresAt: z.date().optional(),
  metadata: z.record(z.any()).optional(),
});

export type AgentMessage = z.infer<typeof agentMessageSchema>;

// Specific Message Payload Schemas
export const gtmStrategyPayloadSchema = z.object({
  market: z.string().optional(),
  horizon_weeks: z.number().optional(),
  target_audience: z.string().optional(),
  focus_area: z.enum(["spiralmalls", "spiralshops", "both"]).optional(),
  budget_range: z.string().optional(),
  strategy_data: z.record(z.any()).optional(),
});

export const weeklyReviewPayloadSchema = z.object({
  week_ending: z.date(),
  performance_metrics: z.record(z.any()).optional(),
  key_insights: z.array(z.string()).optional(),
  action_items: z.array(z.string()).optional(),
  next_week_priorities: z.array(z.string()).optional(),
});

export const spiralAIQueryPayloadSchema = z.object({
  query_type: z.enum(["analysis", "insight", "recommendation", "prediction"]),
  query_text: z.string(),
  context: z.record(z.any()).optional(),
  parameters: z.record(z.any()).optional(),
  expected_response_format: z.string().optional(),
});

export const promoCampaignPayloadSchema = z.object({
  campaign_name: z.string(),
  target_retailers: z.array(z.number()).optional(),
  target_categories: z.array(z.string()).optional(),
  multiplier: z.number(),
  start_date: z.date(),
  end_date: z.date(),
  budget: z.number().optional(),
  approval_status: z.enum(["pending", "approved", "rejected"]).optional(),
});

export const retailerOnboardingPayloadSchema = z.object({
  retailer_id: z.number(),
  onboarding_step: z.enum(["application", "verification", "setup", "training", "go_live"]),
  status: z.enum(["pending", "in_progress", "completed", "failed", "requires_attention"]),
  data: z.record(z.any()).optional(),
  next_actions: z.array(z.string()).optional(),
});

export const shopperUXPayloadSchema = z.object({
  user_id: z.number().optional(),
  event_type: z.string(),
  page_context: z.string().optional(),
  user_journey_stage: z.string().optional(),
  optimization_target: z.enum(["conversion", "engagement", "retention", "satisfaction"]),
  data: z.record(z.any()).optional(),
});

export const systemStatusPayloadSchema = z.object({
  component: z.string(),
  status: z.enum(["healthy", "warning", "error", "maintenance"]),
  message: z.string(),
  metrics: z.record(z.any()).optional(),
  timestamp: z.date(),
});