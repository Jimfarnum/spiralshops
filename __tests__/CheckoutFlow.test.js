// ✅ __tests__/CheckoutFlow.test.js — SPIRAL Checkout Integration Test

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import fetchMock from "jest-fetch-mock";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Checkout from "../client/src/pages/checkout";

fetchMock.enableMocks();

// Mock Stripe Elements
jest.mock('@stripe/react-stripe-js', () => ({
  useStripe: () => ({
    confirmPayment: jest.fn().mockResolvedValue({ error: null })
  }),
  useElements: () => ({
    getElement: jest.fn().mockReturnValue({})
  }),
  Elements: ({ children }) => children,
  PaymentElement: () => <div data-testid="payment-element">Card Information</div>,
  loadStripe: jest.fn().mockResolvedValue({})
}));

// Mock cart store
jest.mock('../client/src/lib/cartStore', () => ({
  useCartStore: () => ({
    items: [
      {
        id: 1,
        name: "Wireless Bluetooth Headphones",
        price: 79.99,
        quantity: 1,
        storeId: 1,
        storeName: "Tech Haven"
      }
    ],
    getTotalPrice: () => 79.99,
    clearCart: jest.fn()
  })
}));

// Mock wouter
jest.mock('wouter', () => ({
  Link: ({ children, to }) => <a href={to}>{children}</a>,
  useLocation: () => ['/checkout', jest.fn()]
}));

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false }
  }
});

const renderWithProviders = (component) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

beforeEach(() => {
  fetch.resetMocks();
  // Mock successful payment intent creation
  fetch.mockResponseOnce(JSON.stringify({ 
    success: true,
    clientSecret: "pi_mock_client_secret" 
  }));
});

describe("💳 SPIRAL Checkout Flow Test", () => {
  test("Renders Checkout Page & Stripe Form", async () => {
    renderWithProviders(<Checkout />);

    // 1. Page loads with checkout title
    await waitFor(() => {
      expect(screen.getByText(/Complete Your Order/i)).toBeInTheDocument();
    });

    // 2. Order summary is present
    expect(screen.getByText(/Order Summary/i)).toBeInTheDocument();
    expect(screen.getByText(/Wireless Bluetooth Headphones/i)).toBeInTheDocument();

    // 3. Payment element loads
    await waitFor(() => {
      expect(screen.getByTestId('payment-element')).toBeInTheDocument();
    });

    // 4. Complete payment button exists
    const button = screen.getByRole('button', { name: /Complete Payment/i });
    expect(button).toBeInTheDocument();
  });

  test("Displays order total and SPIRAL points preview", async () => {
    renderWithProviders(<Checkout />);

    await waitFor(() => {
      // Order total
      expect(screen.getByText(/\$79\.99/)).toBeInTheDocument();
      
      // SPIRAL points calculation (5 points per $100)
      expect(screen.getByText(/\+4 SPIRAL Points/i)).toBeInTheDocument();
    });
  });

  test("Submits payment successfully", async () => {
    const mockStripe = {
      confirmPayment: jest.fn().mockResolvedValue({ 
        error: null,
        paymentIntent: { status: 'succeeded' }
      })
    };

    // Override the stripe mock for this test
    const { useStripe } = require('@stripe/react-stripe-js');
    useStripe.mockReturnValue(mockStripe);

    renderWithProviders(<Checkout />);

    await waitFor(() => {
      const button = screen.getByRole('button', { name: /Complete Payment/i });
      expect(button).toBeInTheDocument();
    });

    const button = screen.getByRole('button', { name: /Complete Payment/i });
    fireEvent.click(button);

    // 5. Verify payment confirmation was attempted
    await waitFor(() => {
      expect(mockStripe.confirmPayment).toHaveBeenCalled();
    });
  });

  test("Handles payment errors gracefully", async () => {
    const mockStripe = {
      confirmPayment: jest.fn().mockResolvedValue({ 
        error: { 
          message: "Your card was declined.",
          type: "card_error"
        }
      })
    };

    const { useStripe } = require('@stripe/react-stripe-js');
    useStripe.mockReturnValue(mockStripe);

    renderWithProviders(<Checkout />);

    await waitFor(() => {
      const button = screen.getByRole('button', { name: /Complete Payment/i });
      fireEvent.click(button);
    });

    // 6. Error message should appear
    await waitFor(() => {
      expect(screen.getByText(/Your card was declined/i)).toBeInTheDocument();
    });
  });

  test("Handles Stripe Connect marketplace payment", async () => {
    // Mock marketplace payment intent creation
    fetch.resetMocks();
    fetch.mockResponseOnce(JSON.stringify({ 
      success: true,
      clientSecret: "pi_marketplace_secret",
      applicationFee: 2.40,
      retailerAmount: 77.59
    }));

    renderWithProviders(<Checkout />);

    // Wait for component to load and payment intent to be created
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/create-payment-intent', expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json'
        }),
        body: expect.stringContaining('"amount":79.99')
      }));
    });

    // Verify fee breakdown is displayed
    await waitFor(() => {
      expect(screen.getByText(/Platform Fee/i)).toBeInTheDocument();
    });
  });

  test("Shows loading state during payment processing", async () => {
    const mockStripe = {
      confirmPayment: jest.fn().mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({ error: null }), 1000))
      )
    };

    const { useStripe } = require('@stripe/react-stripe-js');
    useStripe.mockReturnValue(mockStripe);

    renderWithProviders(<Checkout />);

    await waitFor(() => {
      const button = screen.getByRole('button', { name: /Complete Payment/i });
      fireEvent.click(button);
    });

    // Should show processing state
    expect(screen.getByText(/Processing/i)).toBeInTheDocument();
  });

  test("Displays security indicators", async () => {
    renderWithProviders(<Checkout />);

    await waitFor(() => {
      // SSL security badge
      expect(screen.getByText(/Secure Checkout/i)).toBeInTheDocument();
      
      // Stripe powered by text
      expect(screen.getByText(/Powered by Stripe/i)).toBeInTheDocument();
    });
  });
});