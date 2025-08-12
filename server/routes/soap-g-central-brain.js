// /server/routes/soap-g-central-brain.js
// SOAP G - SPIRAL Operations AI Platform Overseer
// Master orchestrator for all SPIRAL AI agents with checks & balances

import express from "express";
// Remove unused imports since we're using our own agent system
// import { mallManagerAgent, retailerAgent, shopperAgent } from "./ai-dashboard-agents.js";
// import { socialMediaAgent, marketingAgent, adminAgent } from "./ai-agents.js";

const router = express.Router();

// Centralized state management
let soapGStatus = {
    uptime: 0,
    lastCheck: null,
    agents: {},
    alerts: [],
    tasks: [],
    systemHealthy: true,
    performance: {
        totalTasks: 0,
        completedTasks: 0,
        failedTasks: 0,
        averageResponseTime: 0
    }
};

// Enhanced Checks & Balances System
function runChecksAndBalances() {
    const now = new Date();
    soapGStatus.lastCheck = now;
    soapGStatus.alerts = [];
    let systemHealthy = true;

    // Check each agent's health status
    Object.keys(soapGStatus.agents).forEach(agentName => {
        const agent = soapGStatus.agents[agentName];
        
        // Heartbeat check (agent should respond within 60 seconds)
        if (!agent || !agent.lastHeartbeat || (now - agent.lastHeartbeat > 60000)) {
            soapGStatus.alerts.push(`${agentName} has not responded in the last minute`);
            systemHealthy = false;
        }
        
        // Task load monitoring
        if (agent && agent.pendingTasks > 10) {
            soapGStatus.alerts.push(`${agentName} has unusually high task load (${agent.pendingTasks} pending)`);
        }
        
        // Error rate monitoring
        if (agent && agent.errorRate > 0.1) {
            soapGStatus.alerts.push(`${agentName} has high error rate: ${(agent.errorRate * 100).toFixed(1)}%`);
        }
        
        // Response time monitoring
        if (agent && agent.averageResponseTime > 5000) {
            soapGStatus.alerts.push(`${agentName} has slow response time: ${agent.averageResponseTime}ms`);
        }
    });

    soapGStatus.systemHealthy = systemHealthy;
    return systemHealthy;
}

// Agent heartbeat registration with enhanced metrics
function heartbeat(agentName, stats = {}) {
    const now = new Date();
    const previousAgent = soapGStatus.agents[agentName];
    
    soapGStatus.agents[agentName] = {
        lastHeartbeat: now,
        status: stats.status || 'active',
        pendingTasks: stats.pendingTasks || 0,
        completedTasks: stats.completedTasks || (previousAgent?.completedTasks || 0),
        errorRate: stats.errorRate || 0,
        averageResponseTime: stats.averageResponseTime || 0,
        specialization: getAgentSpecialization(agentName),
        ...stats
    };
}

// Get agent specialization description
function getAgentSpecialization(agentName) {
    const specializations = {
        mallManager: "Tenant recruitment, space optimization, performance analytics",
        retailer: "Inventory optimization, pricing strategies, customer acquisition",
        shopperEngagement: "Personalized recommendations, deal hunting, loyalty optimization",
        socialMedia: "Content creation, community engagement, viral campaigns",
        marketingPartnerships: "Strategic partnerships, cross-promotions, growth strategies",
        admin: "System monitoring, analytics, security, platform optimization"
    };
    return specializations[agentName] || "General AI assistance";
}

// Enhanced task dispatcher with load balancing
async function assignTask(agentName, task, priority = 'normal') {
    if (!soapGStatus.agents[agentName]) {
        // Auto-register agent if not exists
        heartbeat(agentName, { status: 'initializing' });
    }
    
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const taskEntry = { 
        id: taskId,
        agentName, 
        task, 
        priority,
        assigned: new Date(),
        status: 'assigned'
    };
    
    soapGStatus.tasks.push(taskEntry);
    soapGStatus.performance.totalTasks++;
    
    // Update agent pending tasks
    if (soapGStatus.agents[agentName]) {
        soapGStatus.agents[agentName].pendingTasks = 
            (soapGStatus.agents[agentName].pendingTasks || 0) + 1;
    }
    
    return { success: true, taskId, task: taskEntry };
}

// Invite to Shop workflow coordination
async function coordinateInviteWorkflow(inviteData) {
    console.log('[SOAP G] Coordinating Invite to Shop workflow...');
    
    const workflowId = `workflow_invite_${Date.now()}`;
    const coordination = {
        id: workflowId,
        type: 'inviteToShop',
        data: inviteData,
        agents: [],
        status: 'active',
        startTime: new Date()
    };
    
    try {
        // Step 1: Assign to Shopper Engagement Agent
        if (inviteData.aiEnabled) {
            const shopperTask = await assignTask('shopperEngagement', 
                `Generate personalized shopping plan for invite: ${JSON.stringify(inviteData)}`, 
                'high');
            coordination.agents.push({
                agent: 'shopperEngagement',
                taskId: shopperTask.taskId,
                purpose: 'Personalized shopping recommendations'
            });
            
            // Step 2: Assign to Social Media Agent
            const socialTask = await assignTask('socialMedia', 
                `Create optimized social content for platform ${inviteData.platform}: ${JSON.stringify(inviteData)}`, 
                'high');
            coordination.agents.push({
                agent: 'socialMedia',
                taskId: socialTask.taskId,
                purpose: 'Social media content optimization'
            });
            
            // Step 3: Assign to Mall Manager Agent
            const mallTask = await assignTask('mallManager', 
                `Coordinate group offers and timing for location ${inviteData.location}: ${JSON.stringify(inviteData)}`, 
                'medium');
            coordination.agents.push({
                agent: 'mallManager',
                taskId: mallTask.taskId,
                purpose: 'Group offers and mall coordination'
            });
        }
        
        // Store workflow coordination
        soapGStatus.workflows = soapGStatus.workflows || [];
        soapGStatus.workflows.push(coordination);
        
        console.log(`[SOAP G] Invite workflow ${workflowId} coordinated with ${coordination.agents.length} agents`);
        return coordination;
        
    } catch (error) {
        console.error('[SOAP G] Invite workflow coordination failed:', error);
        coordination.status = 'failed';
        coordination.error = error.message;
        return coordination;
    }
}

// Task completion handler
function completeTask(taskId, result, success = true) {
    const taskIndex = soapGStatus.tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        const task = soapGStatus.tasks[taskIndex];
        task.completed = new Date();
        task.status = success ? 'completed' : 'failed';
        task.result = result;
        
        // Update performance metrics
        if (success) {
            soapGStatus.performance.completedTasks++;
        } else {
            soapGStatus.performance.failedTasks++;
        }
        
        // Update agent metrics
        const agent = soapGStatus.agents[task.agentName];
        if (agent) {
            agent.pendingTasks = Math.max(0, (agent.pendingTasks || 1) - 1);
            agent.completedTasks = (agent.completedTasks || 0) + 1;
        }
    }
}

// Multi-agent coordination with load balancing
async function coordinateAgents(involvedAgents, task, priority = 'normal') {
    const coordinationId = `coord_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const tasks = [];
    
    for (const agentName of involvedAgents) {
        const taskResult = await assignTask(agentName, task, priority);
        tasks.push(taskResult);
    }
    
    return {
        success: true,
        coordinationId,
        involvedAgents,
        tasks,
        timestamp: new Date().toISOString()
    };
}

// Mall Manager AI Agent
class MallManagerAgent {
  async process(task, context) {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are the Mall Manager AI Agent in the SOAP G system. You help mall managers with:
          - Tenant recruitment and retention strategies
          - Mall performance optimization
          - Lease negotiations and space planning
          - Event planning and community engagement
          - Revenue optimization and cost management
          - Market analysis and competitive intelligence
          
          Provide actionable, data-driven recommendations with specific next steps.`
        },
        {
          role: "user", 
          content: `Task: ${task}\nContext: ${JSON.stringify(context)}`
        }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content);
  }
}

// Retailer AI Agent
class RetailerAgent {
  async process(task, context) {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are the Retailer AI Agent in the SOAP G system. You assist retailers with:
          - Inventory optimization and demand forecasting
          - Pricing strategies and profit margin analysis
          - Customer acquisition and retention
          - Marketing campaigns and promotional planning
          - Operations efficiency and cost reduction
          - Competitive analysis and market positioning
          
          Focus on actionable insights that drive revenue and reduce costs.`
        },
        {
          role: "user",
          content: `Task: ${task}\nContext: ${JSON.stringify(context)}`
        }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content);
  }
}

// Shopper Engagement AI Agent
class ShopperEngagementAgent {
  async process(task, context) {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are the Shopper Engagement AI Agent in the SOAP G system. You enhance shopper experiences with:
          - Personalized product recommendations
          - Smart deal hunting and price optimization
          - Shopping journey optimization
          - Loyalty program engagement
          - Wishlist management and alerts
          - Budget tracking and spending insights
          
          Create engaging, personalized experiences that maximize shopper satisfaction and platform loyalty.`
        },
        {
          role: "user",
          content: `Task: ${task}\nContext: ${JSON.stringify(context)}`
        }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content);
  }
}

// Social Media AI Agent
class SocialMediaAgent {
  async process(task, context) {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are the Social Media AI Agent in the SOAP G system. You manage social presence with:
          - Content creation and scheduling
          - Community engagement and response management
          - Influencer partnerships and collaborations
          - Social commerce optimization
          - Brand reputation monitoring
          - Viral campaign development
          
          Create authentic, engaging content that builds community and drives commerce.`
        },
        {
          role: "user",
          content: `Task: ${task}\nContext: ${JSON.stringify(context)}`
        }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content);
  }
}

// Marketing & Partnerships AI Agent
class MarketingPartnershipsAgent {
  async process(task, context) {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are the Marketing & Partnerships AI Agent in the SOAP G system. You drive growth through:
          - Strategic partnership development
          - Cross-promotional campaigns
          - Brand collaboration opportunities
          - Market expansion strategies
          - Customer acquisition campaigns
          - Revenue optimization initiatives
          
          Focus on scalable strategies that create win-win partnerships and sustainable growth.`
        },
        {
          role: "user",
          content: `Task: ${task}\nContext: ${JSON.stringify(context)}`
        }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content);
  }
}

// Admin AI Agent
class AdminAgent {
  async process(task, context) {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are the Admin AI Agent in the SOAP G system. You handle platform administration with:
          - System monitoring and performance optimization
          - User management and access control
          - Data analytics and reporting
          - Security and compliance oversight
          - Technical issue resolution
          - Platform feature deployment
          
          Ensure smooth operations, security, and continuous improvement of the platform.`
        },
        {
          role: "user",
          content: `Task: ${task}\nContext: ${JSON.stringify(context)}`
        }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content);
  }
}

// SOAP G Central Brain is now implemented as functional system above
// const soapG = new SOAPGCentralBrain(); // Removed class-based approach

// Public API routes with enhanced monitoring

// System status with comprehensive health monitoring
router.get("/soap-g/status", (req, res) => {
    soapGStatus.uptime++;
    const systemHealthy = runChecksAndBalances();
    
    // Calculate performance metrics
    const successRate = soapGStatus.performance.totalTasks > 0 
        ? (soapGStatus.performance.completedTasks / soapGStatus.performance.totalTasks * 100).toFixed(1)
        : 100;
    
    res.json({ 
        success: true,
        system: "SOAP G Central Brain",
        systemHealthy, 
        agents: Object.keys(soapGStatus.agents),
        agentDetails: soapGStatus.agents,
        alerts: soapGStatus.alerts,
        performance: {
            ...soapGStatus.performance,
            successRate: `${successRate}%`,
            uptime: soapGStatus.uptime
        },
        status: systemHealthy ? 'operational' : 'degraded',
        timestamp: new Date().toISOString()
    });
});

// Task assignment endpoint
router.post("/soap-g/assign", async (req, res) => {
    const { agentName, task, priority } = req.body;
    try {
        const result = await assignTask(agentName, task, priority);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Agent heartbeat registration
router.post("/soap-g/heartbeat", (req, res) => {
    const { agentName, stats } = req.body;
    heartbeat(agentName, stats);
    res.json({ success: true, message: `Heartbeat registered for ${agentName}` });
});

// Multi-agent coordination endpoint
router.post("/soap-g/coordinate", async (req, res) => {
    try {
        const { task, agents, priority } = req.body;
        if (!agents || !Array.isArray(agents)) {
            return res.status(400).json({ error: "agents must be an array" });
        }
        const result = await coordinateAgents(agents, task, priority);
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Task completion endpoint
router.post("/soap-g/complete", (req, res) => {
    const { taskId, result, success } = req.body;
    completeTask(taskId, result, success);
    res.json({ success: true, message: "Task completion recorded" });
});

// Individual agent endpoints with enhanced error handling

router.post('/soap-g/mall-manager', async (req, res) => {
    const startTime = Date.now();
    try {
        heartbeat('mallManager', { status: 'processing' });
        const result = await assignTask('mallManager', req.body.task, req.body.priority);
        const responseTime = Date.now() - startTime;
        heartbeat('mallManager', { 
            status: 'active', 
            averageResponseTime: responseTime,
            lastTaskType: 'mall-management'
        });
        res.json({ success: true, result, responseTime });
    } catch (error) {
        heartbeat('mallManager', { status: 'error', lastError: error.message });
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/soap-g/retailer', async (req, res) => {
    const startTime = Date.now();
    try {
        heartbeat('retailer', { status: 'processing' });
        const result = await assignTask('retailer', req.body.task, req.body.priority);
        const responseTime = Date.now() - startTime;
        heartbeat('retailer', { 
            status: 'active', 
            averageResponseTime: responseTime,
            lastTaskType: 'retailer-optimization'
        });
        res.json({ success: true, result, responseTime });
    } catch (error) {
        heartbeat('retailer', { status: 'error', lastError: error.message });
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/soap-g/shopper-engagement', async (req, res) => {
    const startTime = Date.now();
    try {
        heartbeat('shopperEngagement', { status: 'processing' });
        const result = await assignTask('shopperEngagement', req.body.task, req.body.priority);
        const responseTime = Date.now() - startTime;
        heartbeat('shopperEngagement', { 
            status: 'active', 
            averageResponseTime: responseTime,
            lastTaskType: 'shopper-engagement'
        });
        res.json({ success: true, result, responseTime });
    } catch (error) {
        heartbeat('shopperEngagement', { status: 'error', lastError: error.message });
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/soap-g/social-media', async (req, res) => {
    const startTime = Date.now();
    try {
        heartbeat('socialMedia', { status: 'processing' });
        const result = await assignTask('socialMedia', req.body.task, req.body.priority);
        const responseTime = Date.now() - startTime;
        heartbeat('socialMedia', { 
            status: 'active', 
            averageResponseTime: responseTime,
            lastTaskType: 'social-media-campaign'
        });
        res.json({ success: true, result, responseTime });
    } catch (error) {
        heartbeat('socialMedia', { status: 'error', lastError: error.message });
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/soap-g/marketing-partnerships', async (req, res) => {
    const startTime = Date.now();
    try {
        heartbeat('marketingPartnerships', { status: 'processing' });
        const result = await assignTask('marketingPartnerships', req.body.task, req.body.priority);
        const responseTime = Date.now() - startTime;
        heartbeat('marketingPartnerships', { 
            status: 'active', 
            averageResponseTime: responseTime,
            lastTaskType: 'partnership-strategy'
        });
        res.json({ success: true, result, responseTime });
    } catch (error) {
        heartbeat('marketingPartnerships', { status: 'error', lastError: error.message });
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/soap-g/admin', async (req, res) => {
    const startTime = Date.now();
    try {
        heartbeat('admin', { status: 'processing' });
        const result = await assignTask('admin', req.body.task, req.body.priority);
        const responseTime = Date.now() - startTime;
        heartbeat('admin', { 
            status: 'active', 
            averageResponseTime: responseTime,
            lastTaskType: 'platform-administration'
        });
        res.json({ success: true, result, responseTime });
    } catch (error) {
        heartbeat('admin', { status: 'error', lastError: error.message });
        res.status(500).json({ success: false, error: error.message });
    }
});

// Initialize all agents with heartbeats on startup
function initializeAgents() {
    const agents = ['mallManager', 'retailer', 'shopperEngagement', 'socialMedia', 'marketingPartnerships', 'admin', 'inviteToShop'];
    agents.forEach(agentName => {
        heartbeat(agentName, { 
            status: 'initialized',
            pendingTasks: 0,
            completedTasks: 0,
            errorRate: 0,
            averageResponseTime: 0
        });
    });
    console.log('🧠 SOAP G Central Brain: All 7 agents initialized with heartbeat monitoring');
}

// Invite to Shop agent endpoint
router.post('/soap-g/invite-to-shop/coordinate', async (req, res) => {
    const startTime = Date.now();
    try {
        heartbeat('inviteToShop', { status: 'processing' });
        const coordination = await coordinateInviteWorkflow(req.body);
        const responseTime = Date.now() - startTime;
        heartbeat('inviteToShop', { 
            status: 'active', 
            averageResponseTime: responseTime,
            lastTaskType: 'invite-coordination'
        });
        res.json({ success: true, coordination, responseTime });
    } catch (error) {
        heartbeat('inviteToShop', { status: 'error', lastError: error.message });
        res.status(500).json({ success: false, error: error.message });
    }
});

// Initialize agents on module load
initializeAgents();

export default router;