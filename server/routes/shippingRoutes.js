import express from 'express';
import { CarrierManager } from '../carriers/CarrierManager.js';
import { getDiscountTier, getLogisticsDiscountTier, calculateSpiralPointsFromSavings } from '../discounts.js';

const router = express.Router();
const carrierManager = new CarrierManager();

// Get shipping quotes from all carriers
router.post('/quotes', async (req, res) => {
  try {
    const { destinationZip, weightOz, dimensionsIn, speed, mode, includeDiscounts } = req.body;
    
    if (!destinationZip || !weightOz || !speed || !mode) {
      return res.status(400).json({ 
        error: 'Missing required fields: destinationZip, weightOz, speed, mode' 
      });
    }
    
    const quoteParams = {
      destinationZip,
      weightOz: parseFloat(weightOz),
      dimensionsIn,
      speed,
      mode
    };
    
    // Get quotes from all carriers
    const quotes = await carrierManager.getQuotes(quoteParams);
    
    // Apply volume discounts if requested
    if (includeDiscounts && req.body.parcelsPerMonth) {
      const { parcelsPerMonth } = req.body;
      const logisticsTier = getLogisticsDiscountTier(parcelsPerMonth);
      const discountPct = logisticsTier.discountPct / 100;
      
      quotes.forEach(quote => {
        const originalCost = quote.cost;
        const discountAmount = originalCost * discountPct;
        quote.originalCost = originalCost;
        quote.discountAmount = Number(discountAmount.toFixed(2));
        quote.cost = Number((originalCost - discountAmount).toFixed(2));
        quote.discountTier = logisticsTier.tier;
        quote.spiralPointsEarned = calculateSpiralPointsFromSavings(discountAmount);
      });
    }
    
    res.json({
      success: true,
      quotes,
      recommendedQuote: quotes[0] || null, // Cheapest option
      quoteParams
    });
    
  } catch (error) {
    console.error('Shipping quotes error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get shipping quotes' 
    });
  }
});

// Get quote from specific carrier
router.post('/quotes/:carrier', async (req, res) => {
  try {
    const carrierName = req.params.carrier;
    const { destinationZip, weightOz, dimensionsIn, speed, mode } = req.body;
    
    const quoteParams = {
      destinationZip,
      weightOz: parseFloat(weightOz),
      dimensionsIn,
      speed,
      mode
    };
    
    const quote = await carrierManager.getQuotesByCarrier(quoteParams, carrierName);
    
    if (!quote) {
      return res.status(404).json({ 
        success: false, 
        error: `No quote available from ${carrierName} for these parameters` 
      });
    }
    
    res.json({
      success: true,
      quote,
      quoteParams
    });
    
  } catch (error) {
    console.error(`${req.params.carrier} quote error:`, error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get best (cheapest) shipping option
router.post('/best-quote', async (req, res) => {
  try {
    const { destinationZip, weightOz, dimensionsIn, speed, mode } = req.body;
    
    const quoteParams = {
      destinationZip,
      weightOz: parseFloat(weightOz),
      dimensionsIn,
      speed,
      mode
    };
    
    const bestQuote = await carrierManager.getBestQuote(quoteParams);
    
    if (!bestQuote) {
      return res.status(404).json({ 
        success: false, 
        error: 'No shipping quotes available for these parameters' 
      });
    }
    
    res.json({
      success: true,
      bestQuote,
      quoteParams
    });
    
  } catch (error) {
    console.error('Best quote error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get best shipping quote' 
    });
  }
});

// Calculate comprehensive shipping with all discounts
router.post('/calculate-total', async (req, res) => {
  try {
    const { 
      destinationZip, 
      weightOz, 
      dimensionsIn, 
      speed, 
      mode,
      subtotal,
      annualVolumeUSD,
      parcelsPerMonth,
      coupon
    } = req.body;
    
    // Get shipping quotes
    const quoteParams = { destinationZip, weightOz: parseFloat(weightOz), dimensionsIn, speed, mode };
    const bestQuote = await carrierManager.getBestQuote(quoteParams);
    
    if (!bestQuote) {
      return res.status(400).json({ 
        success: false, 
        error: 'No shipping quotes available' 
      });
    }
    
    // Apply discount calculations
    const cardTier = getDiscountTier(annualVolumeUSD || 0);
    const logisticsTier = getLogisticsDiscountTier(parcelsPerMonth || 0);
    
    // Card fee savings
    const cardBps = cardTier.discountBps || 0;
    const cardFeeSavings = (subtotal || 0) * (cardBps / 10_000);
    
    // Shipping discount
    const shippingDiscountPct = logisticsTier.discountPct / 100;
    const shippingDiscount = bestQuote.cost * shippingDiscountPct;
    const discountedShipping = bestQuote.cost - shippingDiscount;
    
    // Coupon application
    let subtotalAfterCoupon = subtotal || 0;
    let couponSavings = 0;
    
    if (coupon) {
      if (coupon.type === "percent") {
        couponSavings = subtotalAfterCoupon * (coupon.value / 100);
        subtotalAfterCoupon = subtotalAfterCoupon - couponSavings;
      } else {
        couponSavings = Math.min(coupon.value, subtotalAfterCoupon);
        subtotalAfterCoupon = subtotalAfterCoupon - couponSavings;
      }
    }
    
    // Calculate totals
    const effectiveSubtotal = Math.max(0, subtotalAfterCoupon - cardFeeSavings);
    const total = effectiveSubtotal + discountedShipping;
    const totalSavings = cardFeeSavings + shippingDiscount + couponSavings;
    const spiralPointsEarned = calculateSpiralPointsFromSavings(totalSavings);
    
    res.json({
      success: true,
      shipping: {
        carrier: bestQuote.carrier,
        service: bestQuote.service,
        originalCost: bestQuote.cost,
        discountedCost: Number(discountedShipping.toFixed(2)),
        savings: Number(shippingDiscount.toFixed(2)),
        estDays: bestQuote.estDays
      },
      discounts: {
        cardTier: cardTier.tier,
        logisticsTier: logisticsTier.tier,
        cardFeeSavings: Number(cardFeeSavings.toFixed(2)),
        shippingDiscount: Number(shippingDiscount.toFixed(2)),
        couponSavings: Number(couponSavings.toFixed(2)),
        totalSavings: Number(totalSavings.toFixed(2))
      },
      totals: {
        subtotal: subtotal || 0,
        subtotalAfterCoupon: Number(subtotalAfterCoupon.toFixed(2)),
        effectiveSubtotal: Number(effectiveSubtotal.toFixed(2)),
        shipping: Number(discountedShipping.toFixed(2)),
        total: Number(total.toFixed(2))
      },
      spiralPointsEarned
    });
    
  } catch (error) {
    console.error('Calculate total error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to calculate shipping total' 
    });
  }
});

export default router;