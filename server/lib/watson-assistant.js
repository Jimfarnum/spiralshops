const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');

// Watson Assistant configuration with fallback handling
const getWatsonConfig = () => {
  const apikey = process.env.WATSON_ASSISTANT_APIKEY;
  const serviceUrl = process.env.WATSON_ASSISTANT_URL;
  const assistantId = process.env.WATSON_ASSISTANT_ID;

  if (!apikey || !serviceUrl || !assistantId) {
    throw new Error('Watson Assistant credentials not properly configured');
  }

  return { apikey, serviceUrl, assistantId };
};

// Initialize Watson Assistant client
let watsonClient = null;

const initializeWatson = () => {
  try {
    const { apikey, serviceUrl } = getWatsonConfig();
    
    watsonClient = new AssistantV2({
      version: '2024-08-25',
      authenticator: new IamAuthenticator({
        apikey: apikey,
      }),
      serviceUrl: serviceUrl,
    });

    console.log('✅ Watson Assistant client initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Watson Assistant initialization failed:', error.message);
    return false;
  }
};

// Create a session for conversation
const createWatsonSession = async () => {
  try {
    if (!watsonClient) {
      const initialized = initializeWatson();
      if (!initialized) throw new Error('Watson client not initialized');
    }

    const { assistantId } = getWatsonConfig();
    const response = await watsonClient.createSession({
      assistantId: assistantId
    });

    return {
      success: true,
      sessionId: response.result.session_id,
      data: response.result
    };
  } catch (error) {
    console.error('❌ Watson session creation failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

// Send message to Watson Assistant
const sendMessageToWatson = async (sessionId, message) => {
  try {
    if (!watsonClient) {
      const initialized = initializeWatson();
      if (!initialized) throw new Error('Watson client not initialized');
    }

    const { assistantId } = getWatsonConfig();
    const response = await watsonClient.message({
      assistantId: assistantId,
      sessionId: sessionId,
      input: {
        messageType: 'text',
        text: message
      }
    });

    return {
      success: true,
      response: response.result.output.generic,
      data: response.result
    };
  } catch (error) {
    console.error('❌ Watson message failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

// Delete Watson session
const deleteWatsonSession = async (sessionId) => {
  try {
    if (!watsonClient) {
      const initialized = initializeWatson();
      if (!initialized) throw new Error('Watson client not initialized');
    }

    const { assistantId } = getWatsonConfig();
    await watsonClient.deleteSession({
      assistantId: assistantId,
      sessionId: sessionId
    });

    return {
      success: true,
      message: 'Session deleted successfully'
    };
  } catch (error) {
    console.error('❌ Watson session deletion failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

// Test Watson Assistant connection
const testWatsonConnection = async () => {
  try {
    console.log('🧪 Testing Watson Assistant connection...');
    
    // Test session creation
    const sessionResult = await createWatsonSession();
    if (!sessionResult.success) {
      throw new Error(`Session creation failed: ${sessionResult.error}`);
    }

    console.log('✅ Watson session created successfully');

    // Test message sending
    const messageResult = await sendMessageToWatson(sessionResult.sessionId, 'Hello Watson!');
    if (!messageResult.success) {
      throw new Error(`Message sending failed: ${messageResult.error}`);
    }

    console.log('✅ Watson message sent successfully');

    // Clean up session
    await deleteWatsonSession(sessionResult.sessionId);
    console.log('✅ Watson session cleaned up successfully');

    return {
      success: true,
      message: 'Watson Assistant connection test successful',
      data: {
        sessionCreated: true,
        messageProcessed: true,
        sessionCleaned: true,
        assistantResponse: messageResult.response
      }
    };

  } catch (error) {
    console.error('❌ Watson connection test failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

// Initialize on module load
initializeWatson();

module.exports = {
  createWatsonSession,
  sendMessageToWatson,
  deleteWatsonSession,
  testWatsonConnection,
  watsonClient
};