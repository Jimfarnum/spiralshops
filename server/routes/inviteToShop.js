// SPIRAL Invite to Shop - AI-Enhanced Workflow System
import express from "express";
import { InviteToShopAgent } from "../ai-agents/InviteToShopAgent.js";

const router = express.Router();

// Initialize AI Agent
const inviteAgent = new InviteToShopAgent();

// Create invite with AI coordination
router.post('/create', async (req, res) => {
  try {
    const { 
      shopperId, 
      friends, 
      platform, 
      location, 
      preferences, 
      budget,
      aiEnabled = false 
    } = req.body;

    console.log(`[Invite to Shop] Creating invite for shopper ${shopperId} with AI ${aiEnabled ? 'enabled' : 'disabled'}`);

    let inviteData = {
      shopperId,
      friends,
      platform,
      location,
      preferences,
      budget,
      aiEnabled,
      createdAt: new Date().toISOString(),
      status: 'created'
    };

    if (aiEnabled) {
      // AI-enhanced invite with multi-agent coordination
      const aiResult = await inviteAgent.processInviteRequest({
        shopperId,
        friends,
        platform,
        location,
        preferences,
        budget
      });

      inviteData = {
        ...inviteData,
        ...aiResult,
        status: 'ai_processed'
      };
    } else {
      // Basic invite without AI
      inviteData.basicMessage = `Join me for shopping at ${location}! Let's discover amazing local stores together.`;
    }

    // Store invite data (using in-memory for now, can be extended to Cloudant)
    const inviteId = `invite_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    inviteData.id = inviteId;

    // Simulate storage
    global.inviteStorage = global.inviteStorage || new Map();
    global.inviteStorage.set(inviteId, inviteData);

    res.status(200).json({
      success: true,
      inviteId,
      message: 'Invite created successfully',
      data: inviteData
    });

  } catch (error) {
    console.error('Error creating invite:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create invite',
      message: error.message 
    });
  }
});

// Get invite details
router.get('/:inviteId', async (req, res) => {
  try {
    const { inviteId } = req.params;
    
    global.inviteStorage = global.inviteStorage || new Map();
    const invite = global.inviteStorage.get(inviteId);

    if (!invite) {
      return res.status(404).json({
        success: false,
        error: 'Invite not found'
      });
    }

    res.status(200).json({
      success: true,
      data: invite
    });

  } catch (error) {
    console.error('Error fetching invite:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch invite' 
    });
  }
});

// List invites for a shopper
router.get('/shopper/:shopperId', async (req, res) => {
  try {
    const { shopperId } = req.params;
    
    global.inviteStorage = global.inviteStorage || new Map();
    const invites = Array.from(global.inviteStorage.values())
      .filter(invite => invite.shopperId === shopperId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({
      success: true,
      data: invites
    });

  } catch (error) {
    console.error('Error fetching shopper invites:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch invites' 
    });
  }
});

// Accept invite
router.post('/:inviteId/accept', async (req, res) => {
  try {
    const { inviteId } = req.params;
    const { friendId, friendName } = req.body;

    global.inviteStorage = global.inviteStorage || new Map();
    const invite = global.inviteStorage.get(inviteId);

    if (!invite) {
      return res.status(404).json({
        success: false,
        error: 'Invite not found'
      });
    }

    // Update invite with acceptance
    invite.acceptances = invite.acceptances || [];
    invite.acceptances.push({
      friendId,
      friendName,
      acceptedAt: new Date().toISOString()
    });

    global.inviteStorage.set(inviteId, invite);

    res.status(200).json({
      success: true,
      message: 'Invite accepted successfully',
      data: invite
    });

  } catch (error) {
    console.error('Error accepting invite:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to accept invite' 
    });
  }
});

export default router;