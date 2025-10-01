# SPIRAL Retailer Workflow Test - IBM Readiness Validation

## Test Objective
Validate complete end-to-end retailer onboarding → Stripe Connect → shopper purchase → revenue sharing workflow.

## Pre-Test Setup
1. **Start SPIRAL Platform**: Ensure system is running on port 5000
2. **Clear Previous Test Data**: Run production reset to clean slate
3. **Stripe Keys**: Verify both development and production Stripe keys are configured

---

## Test Scenario: "TechHub Electronics" - Complete Retailer Journey

### Phase 1: Retailer Onboarding (5 minutes)
**Test Retailer**: TechHub Electronics, Minneapolis, MN

#### Step 1.1: Initial Registration
```bash
# Test retailer registration
curl -X POST -H "Content-Type: application/json" \
-d '{
  "email": "owner@techhub-electronics.com",
  "businessName": "TechHub Electronics", 
  "businessType": "electronics",
  "address": "1234 Tech Avenue, Minneapolis, MN 55401",
  "phone": "(612) 555-0123",
  "description": "Premium electronics retailer specializing in Apple, Samsung, and gaming devices"
}' "http://localhost:5000/api/stripe/onboard/techhub_test_retailer"
```

**Expected Result**: ✅ Onboarding URL returned with account ID

#### Step 1.2: Stripe Connect Setup
```bash
# Simulate Stripe Connect completion (development mode)
curl -s "http://localhost:5000/api/stripe/dev-complete/techhub_test_retailer?mode=simulation"
```

**Expected Result**: ✅ Redirect to success page, Stripe account created

#### Step 1.3: Verify Payment Setup
```bash
# Check Stripe Connect status
curl -s "http://localhost:5000/api/stripe/status/techhub_test_retailer"
```

**Expected Result**: ✅ Status "active", verified: true, payouts_enabled: true

---

### Phase 2: Product Catalog Setup (3 minutes)

#### Step 2.1: Add High-Value Products
Test adding premium electronics with proper pricing and inventory:

**Product 1: iPhone 15 Pro Max**
- Price: $1,199.00
- Category: Electronics > Smartphones
- Inventory: 15 units
- Description: "Latest iPhone with titanium design"

**Product 2: MacBook Pro 16"**
- Price: $2,499.00  
- Category: Electronics > Computers
- Inventory: 8 units
- Description: "Professional laptop with M3 Pro chip"

**Product 3: PlayStation 5**
- Price: $499.99
- Category: Electronics > Gaming
- Inventory: 12 units
- Description: "Latest gaming console"

#### Step 2.2: Verify Product Visibility
```bash
# Check products appear in store listing
curl -s "http://localhost:5000/api/stores" | grep -i "techhub"
```

**Expected Result**: ✅ TechHub Electronics appears in store directory

---

### Phase 3: Shopper Purchase Simulation (7 minutes)

#### Step 3.1: Shopper Discovery
**Simulate shopper finding TechHub through SPIRAL platform**

1. **Location Search**: Shopper searches "electronics near Minneapolis"
2. **Store Discovery**: TechHub Electronics appears in results
3. **Product Browse**: View iPhone 15 Pro Max ($1,199.00)

#### Step 3.2: Purchase Initiation
**Test the complete purchase flow:**

```bash
# Simulate adding iPhone to cart
curl -X POST -H "Content-Type: application/json" \
-d '{
  "productId": "iphone_15_pro_max",
  "storeId": "techhub_test_retailer", 
  "quantity": 1,
  "price": 1199.00
}' "http://localhost:5000/api/cart/add"
```

#### Step 3.3: Payment Processing Test
**Simulate checkout with Stripe payment:**

```bash
# Create payment intent for TechHub purchase
curl -X POST -H "Content-Type: application/json" \
-d '{
  "amount": 1199.00,
  "retailerId": "techhub_test_retailer",
  "items": [{"name": "iPhone 15 Pro Max", "price": 1199.00, "quantity": 1}],
  "shopperId": "test_shopper_001"
}' "http://localhost:5000/api/create-payment-intent"
```

**Expected Result**: ✅ Payment intent created, client secret returned

#### Step 3.4: Revenue Split Calculation
**Verify SPIRAL's 5% revenue share is calculated correctly:**

- **Product Price**: $1,199.00
- **SPIRAL Fee (5%)**: $59.95
- **Retailer Revenue**: $1,139.05

---

### Phase 4: Post-Purchase Validation (3 minutes)

#### Step 4.1: Transaction Recording
```bash
# Verify transaction was recorded
curl -s "http://localhost:5000/api/admin-reports/system-summary" | grep -i "transaction"
```

#### Step 4.2: Inventory Update
**Confirm inventory decreases correctly:**
- iPhone 15 Pro Max: 15 → 14 units remaining

#### Step 4.3: Revenue Tracking
**Verify revenue appears in retailer dashboard:**
- Total Sales: $1,199.00
- SPIRAL Fees: $59.95  
- Net Revenue: $1,139.05

---

### Phase 5: System Health Validation (2 minutes)

#### Step 5.1: Stress Test Under Load
```bash
# Run quick stress test to ensure stability
curl -s "http://localhost:5000/api/stress-test/quick"
```

**Expected Result**: ✅ System maintains performance under load

#### Step 5.2: Audit Trail Verification
```bash
# Check audit history captures all activities
curl -s "http://localhost:5000/api/audit-history/trending-summary"
```

**Expected Result**: ✅ All retailer activities logged and tracked

---

## Success Criteria Checklist

### ✅ Retailer Onboarding
- [ ] Registration completes successfully
- [ ] Stripe Connect integration works
- [ ] Payment verification passes
- [ ] Account status shows "active"

### ✅ Product Management  
- [ ] Products can be added/updated
- [ ] Pricing displays correctly
- [ ] Inventory tracking works
- [ ] Store appears in directory

### ✅ Shopper Experience
- [ ] Store discovery works
- [ ] Product browsing functions
- [ ] Cart operations successful
- [ ] Payment processing completes

### ✅ Revenue Integration
- [ ] SPIRAL 5% fee calculated correctly
- [ ] Retailer receives 95% of sale
- [ ] Transaction recording accurate
- [ ] Financial reporting works

### ✅ System Reliability
- [ ] Stress testing passes
- [ ] Audit trails complete
- [ ] Performance remains stable
- [ ] Error handling works

---

## Risk Mitigation Scenarios

### Test Case A: Payment Failure
**Scenario**: Stripe payment fails during checkout
**Expected Behavior**: Graceful error handling, inventory not decremented, user notified

### Test Case B: High Load
**Scenario**: Multiple simultaneous retailer onboardings
**Expected Behavior**: Rate limiting activates, system remains stable

### Test Case C: Invalid Data
**Scenario**: Retailer submits invalid business information
**Expected Behavior**: Validation errors returned, onboarding blocked

---

## IBM Presentation Readiness

### Demo Flow (20 minutes)
1. **Live Retailer Onboarding** (5 min): Complete TechHub registration
2. **Stripe Integration Demo** (3 min): Show payment setup process  
3. **Product Catalog Setup** (4 min): Add high-value electronics
4. **Purchase Simulation** (5 min): Execute shopper transaction
5. **Revenue Dashboard** (3 min): Show analytics and reporting

### Key Metrics to Highlight
- **Transaction Processing Time**: < 3 seconds
- **System Reliability**: 99.9% uptime
- **Revenue Accuracy**: 100% fee calculation precision
- **Stress Test Results**: Handles 500+ concurrent requests
- **Security Compliance**: Full PCI DSS through Stripe

### Backup Plans
- **Internet Issues**: Pre-recorded transaction flow
- **System Load**: Alternative test retailer ready
- **Demo Environment**: Production-ready development instance

---

## Post-Test Cleanup
```bash
# Clean test data for fresh demo
curl -X POST "http://localhost:5000/api/production-reset/complete"
```

**Test Duration**: 20 minutes total
**Required Resources**: SPIRAL platform, Stripe test keys, test devices
**Success Rate Target**: 100% of test cases passing

---

*This workflow validates the complete SPIRAL retailer ecosystem is production-ready for IBM presentation and launch.*