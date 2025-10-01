const express = require('express');
const path = require('path');
const { 
  createWatsonSession, 
  sendMessageToWatson, 
  deleteWatsonSession, 
  testWatsonConnection 
} = require(path.join(__dirname, '..', 'lib', 'watson-assistant.js'));

const router = express.Router();

// Test Watson Assistant connection
router.get('/api/watson/test', async (req, res) => {
  try {
    const result = await testWatsonConnection();
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create Watson session
router.post('/api/watson/session', async (req, res) => {
  try {
    const result = await createWatsonSession();
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Send message to Watson
router.post('/api/watson/message', async (req, res) => {
  try {
    const { sessionId, message } = req.body;
    
    if (!sessionId || !message) {
      return res.status(400).json({
        success: false,
        error: 'sessionId and message are required'
      });
    }

    const result = await sendMessageToWatson(sessionId, message);
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete Watson session
router.delete('/api/watson/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const result = await deleteWatsonSession(sessionId);
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;