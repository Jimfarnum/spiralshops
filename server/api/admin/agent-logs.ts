import { Request, Response } from 'express';

interface AgentLog {
  id: string;
  agentName: 'RetailerOnboardAgent' | 'ProductEntryAgent' | 'ShopperAssistAgent' | 'AdminAuditAgent';
  retailerId: string;
  retailerName: string;
  status: 'active' | 'complete' | 'error' | 'abandoned';
  sessionDuration: number; // in minutes
  timestamp: string;
  lastActivity: string;
  stepCompleted: string;
  totalSteps: number;
  currentStep: number;
  notes?: string;
  errorMessage?: string;
  metadata?: {
    productsAdded?: number;
    planSelected?: string;
    stripeConnected?: boolean;
    [key: string]: any;
  };
}

// Mock data storage - replace with actual database
let agentLogs: AgentLog[] = [
  {
    id: '1',
    agentName: 'RetailerOnboardAgent',
    retailerId: 'ret_001',
    retailerName: 'Tech Hub Electronics',
    status: 'complete',
    sessionDuration: 12,
    timestamp: '2025-01-07T14:30:00Z',
    lastActivity: '2025-01-07T14:42:00Z',
    stepCompleted: 'Inventory Upload',
    totalSteps: 5,
    currentStep: 5,
    notes: 'Successfully completed onboarding with Gold plan',
    metadata: {
      planSelected: 'Gold',
      stripeConnected: true
    }
  },
  {
    id: '2',
    agentName: 'ProductEntryAgent',
    retailerId: 'ret_001',
    retailerName: 'Tech Hub Electronics',
    status: 'active',
    sessionDuration: 8,
    timestamp: '2025-01-07T14:45:00Z',
    lastActivity: '2025-01-07T14:53:00Z',
    stepCompleted: 'Product Information',
    totalSteps: 5,
    currentStep: 2,
    notes: 'Adding first batch of electronics products',
    metadata: {
      productsAdded: 3
    }
  },
  {
    id: '3',
    agentName: 'RetailerOnboardAgent',
    retailerId: 'ret_002',
    retailerName: 'Fashion Forward Boutique',
    status: 'error',
    sessionDuration: 15,
    timestamp: '2025-01-07T13:20:00Z',
    lastActivity: '2025-01-07T13:35:00Z',
    stepCompleted: 'Payment Setup',
    totalSteps: 5,
    currentStep: 3,
    errorMessage: 'Stripe Connect authentication failed',
    notes: 'User needs to retry Stripe connection'
  },
  {
    id: '4',
    agentName: 'ShopperAssistAgent',
    retailerId: 'shopper_001',
    retailerName: 'Guest User',
    status: 'complete',
    sessionDuration: 5,
    timestamp: '2025-01-07T14:10:00Z',
    lastActivity: '2025-01-07T14:15:00Z',
    stepCompleted: 'Product Recommendations',
    totalSteps: 3,
    currentStep: 3,
    notes: 'Provided product recommendations for electronics'
  },
  {
    id: '5',
    agentName: 'ProductEntryAgent',
    retailerId: 'ret_003',
    retailerName: 'Local Coffee Roasters',
    status: 'abandoned',
    sessionDuration: 3,
    timestamp: '2025-01-07T12:00:00Z',
    lastActivity: '2025-01-07T12:03:00Z',
    stepCompleted: 'Welcome',
    totalSteps: 5,
    currentStep: 1,
    notes: 'Session abandoned after welcome message'
  }
];

export const getAgentLogs = (req: Request, res: Response) => {
  try {
    // Sort by timestamp descending (most recent first)
    const sortedLogs = agentLogs.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    res.status(200).json({
      success: true,
      data: sortedLogs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch agent logs'
    });
  }
};

export const createAgentLog = (req: Request, res: Response) => {
  try {
    const logData = req.body;
    
    const newLog: AgentLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      ...logData
    };

    agentLogs.push(newLog);

    res.status(201).json({
      success: true,
      data: newLog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create agent log'
    });
  }
};

export const updateAgentLog = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const logIndex = agentLogs.findIndex(log => log.id === id);
    if (logIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Agent log not found'
      });
    }

    agentLogs[logIndex] = {
      ...agentLogs[logIndex],
      ...updateData,
      lastActivity: new Date().toISOString()
    };

    res.status(200).json({
      success: true,
      data: agentLogs[logIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update agent log'
    });
  }
};