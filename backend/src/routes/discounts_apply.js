export async function applyDiscountsHandler(req, res) {
  try {
    const { subtotal, shippingBase, annualVolumeUSD, parcelsPerMonth, coupon } = req.body;

    // Calculate volume-based tier discount
    let tierDiscount = 0;
    if (annualVolumeUSD >= 100000000) {
      tierDiscount = 0.35; // Tier 3: 35%
    } else if (annualVolumeUSD >= 10000000) {
      tierDiscount = 0.20; // Tier 2: 20%
    } else if (annualVolumeUSD >= 1000000) {
      tierDiscount = 0.10; // Tier 1: 10%
    }

    // Apply tier discount to subtotal
    const tierDiscountAmount = subtotal * tierDiscount;
    let discountedSubtotal = subtotal - tierDiscountAmount;

    // Apply coupon if provided
    let couponDiscountAmount = 0;
    if (coupon) {
      if (coupon.type === 'percent') {
        couponDiscountAmount = discountedSubtotal * (coupon.value / 100);
      } else if (coupon.type === 'fixed') {
        couponDiscountAmount = coupon.value;
      }
      discountedSubtotal -= couponDiscountAmount;
    }

    // Calculate shipping discount based on volume
    let shippingDiscount = 0;
    if (parcelsPerMonth >= 50000) {
      shippingDiscount = 0.50; // 50% shipping discount
    } else if (parcelsPerMonth >= 10000) {
      shippingDiscount = 0.30; // 30% shipping discount
    } else if (parcelsPerMonth >= 1000) {
      shippingDiscount = 0.15; // 15% shipping discount
    }

    const shippingDiscountAmount = shippingBase * shippingDiscount;
    const finalShipping = shippingBase - shippingDiscountAmount;

    const total = Math.max(0, discountedSubtotal + finalShipping);

    res.json({
      success: true,
      subtotal,
      discounts: {
        tierDiscount: {
          percentage: tierDiscount * 100,
          amount: tierDiscountAmount
        },
        couponDiscount: {
          type: coupon?.type || null,
          value: coupon?.value || 0,
          amount: couponDiscountAmount
        },
        shippingDiscount: {
          percentage: shippingDiscount * 100,
          amount: shippingDiscountAmount
        }
      },
      shipping: {
        base: shippingBase,
        discounted: finalShipping
      },
      total,
      savings: (tierDiscountAmount + couponDiscountAmount + shippingDiscountAmount)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to apply discounts'
    });
  }
}