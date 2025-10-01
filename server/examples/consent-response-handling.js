// Frontend handling for consent middleware responses

// When the middleware returns 428 Consent Required, handle it in your API client
async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  // Handle consent required response
  if (response.status === 428) {
    const data = await response.json();
    
    if (data.error === 'ConsentRequired') {
      // Show consent modal with current versions
      showConsentModal({
        userId: getCurrentUserId(),
        role: getCurrentUserRole(),
        requiredVersions: data.versions,
        onConsentCompleted: () => {
          // Retry the original request
          return apiRequest(url, options);
        }
      });
      
      throw new ConsentRequiredError('Legal consent required', data);
    }
  }

  return response;
}

// React hook for handling consent-protected API calls
function useConsentProtectedApi() {
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [pendingRequest, setPendingRequest] = useState(null);
  
  const makeRequest = async (url, options) => {
    try {
      return await apiRequest(url, options);
    } catch (error) {
      if (error instanceof ConsentRequiredError) {
        setPendingRequest({ url, options });
        setShowConsentModal(true);
        return null;
      }
      throw error;
    }
  };

  const retryAfterConsent = async () => {
    if (pendingRequest) {
      const result = await apiRequest(pendingRequest.url, pendingRequest.options);
      setPendingRequest(null);
      setShowConsentModal(false);
      return result;
    }
  };

  return {
    makeRequest,
    retryAfterConsent,
    showConsentModal,
    setShowConsentModal
  };
}

// Usage in React components
function OrdersPage() {
  const { makeRequest, retryAfterConsent, showConsentModal, setShowConsentModal } = useConsentProtectedApi();
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    const response = await makeRequest('/api/orders');
    if (response) {
      const data = await response.json();
      setOrders(data.orders);
    }
  };

  const createOrder = async (orderData) => {
    const response = await makeRequest('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
    if (response) {
      loadOrders(); // Refresh orders list
    }
  };

  return (
    <div>
      <h1>Orders</h1>
      {/* Orders UI */}
      
      <LegalConsentModal
        isOpen={showConsentModal}
        onClose={() => setShowConsentModal(false)}
        role="retailer"
        userId={getCurrentUserId()}
        onConsentCompleted={retryAfterConsent}
        blockingModal={true}
      />
    </div>
  );
}

class ConsentRequiredError extends Error {
  constructor(message, data) {
    super(message);
    this.name = 'ConsentRequiredError';
    this.data = data;
  }
}