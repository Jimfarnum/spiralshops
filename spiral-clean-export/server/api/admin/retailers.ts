import { Request, Response } from 'express';

interface Retailer {
  id: string;
  storeName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  plan: string;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  stripeAccountId?: string;
  stripeStatus: 'connected' | 'pending' | 'none';
  productsCount: number;
  createdAt: string;
  lastActivity: string;
  notes?: string;
}

// Mock data storage - replace with actual database
let retailers: Retailer[] = [
  {
    id: '1',
    storeName: 'Tech Hub Electronics',
    ownerName: 'John Smith',
    email: 'john@techhub.com',
    phone: '(555) 123-4567',
    address: '123 Main St, San Francisco, CA 94102',
    plan: 'Gold',
    status: 'pending',
    stripeAccountId: 'acct_1234567890',
    stripeStatus: 'connected',
    productsCount: 15,
    createdAt: '2025-01-07T10:30:00Z',
    lastActivity: '2025-01-07T12:45:00Z',
  },
  {
    id: '2',
    storeName: 'Fashion Forward Boutique',
    ownerName: 'Sarah Johnson',
    email: 'sarah@fashionforward.com',
    phone: '(555) 987-6543',
    address: '456 Oak Ave, Los Angeles, CA 90210',
    plan: 'Silver',
    status: 'approved',
    stripeAccountId: 'acct_0987654321',
    stripeStatus: 'connected',
    productsCount: 42,
    createdAt: '2025-01-06T14:20:00Z',
    lastActivity: '2025-01-07T11:30:00Z',
  },
  {
    id: '3',
    storeName: 'Local Coffee Roasters',
    ownerName: 'Mike Chen',
    email: 'mike@localcoffee.com',
    phone: '(555) 456-7890',
    address: '789 Pine St, Seattle, WA 98101',
    plan: 'Free',
    status: 'flagged',
    stripeStatus: 'pending',
    productsCount: 8,
    createdAt: '2025-01-05T09:15:00Z',
    lastActivity: '2025-01-06T16:20:00Z',
    notes: 'Requires verification of business license',
  }
];

export const getRetailers = (req: Request, res: Response) => {
  try {
    res.status(200).json({
      success: true,
      data: retailers,
      error: null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      error: 'Failed to fetch retailers'
    });
  }
};

export const updateRetailerStatus = (req: Request, res: Response) => {
  try {
    const { id, status } = req.body;
    
    const retailerIndex = retailers.findIndex(r => r.id === id);
    if (retailerIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Retailer not found'
      });
    }

    retailers[retailerIndex] = {
      ...retailers[retailerIndex],
      status,
      lastActivity: new Date().toISOString()
    };

    res.status(200).json({
      success: true,
      data: retailers[retailerIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update retailer status'
    });
  }
};

export const updateRetailerNotes = (req: Request, res: Response) => {
  try {
    const { id, notes } = req.body;
    
    const retailerIndex = retailers.findIndex(r => r.id === id);
    if (retailerIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Retailer not found'
      });
    }

    retailers[retailerIndex] = {
      ...retailers[retailerIndex],
      notes,
      lastActivity: new Date().toISOString()
    };

    res.status(200).json({
      success: true,
      data: retailers[retailerIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update retailer notes'
    });
  }
};