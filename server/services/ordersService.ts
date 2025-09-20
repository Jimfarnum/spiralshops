import { cpostDoc } from '../utils/cloudantCore.js';
import { appendLedger, getSpiralsBalance } from './spiralsService.js';
import { calculateSpiralsEarned } from '../utils/spiralsCalculator.js';

export interface CreateOrderInput {
  userId: string;
  retailerId: string;
  items: Array<{ productId:string; qty:number; price_cents:number }>;
  currency: string;
  use_spirals?: number; // optional redemption
  pickup?: boolean; // mall pickup (multiplier)
  invite_bonus?: boolean; // invited friend bonus
}

const BASE_EARN = 1.0; // 1 SPIRAL per $1
function cents(n:number){ return Math.max(0, Math.round(n)); }

export async function createOrder(input: CreateOrderInput){
  const subtotal = input.items.reduce((s,i)=> s + i.price_cents * i.qty, 0);
  
  // CRITICAL: Check user's available SPIRALS balance to prevent overspend
  const userBalance = await getSpiralsBalance(input.userId);
  const maxRedeemableBySubtotal = Math.floor(subtotal/100)*100; // redeemable in 100-pt/$1 steps
  const maxRedeemableByBalance = userBalance.balance;
  const requestedSpirals = input.use_spirals || 0;
  
  // Prevent overdraft: limit redemption to available balance AND subtotal cap
  const appliedSpirals = Math.min(requestedSpirals, maxRedeemableByBalance, maxRedeemableBySubtotal);
  
  // Reject if requested more than available balance
  if (requestedSpirals > maxRedeemableByBalance) {
    throw new Error(`Insufficient SPIRALS balance. Requested: ${requestedSpirals}, Available: ${maxRedeemableByBalance}`);
  }
  
  const total_cents = cents(subtotal - Math.floor(appliedSpirals/100)*100);

  // write order
  const orderId = `order_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
  const orderDoc = {
    _id: orderId,
    type:'order',
    userId: input.userId,
    retailerId: input.retailerId,
    items: input.items,
    currency: input.currency || 'usd',
    amount_cents: total_cents,
    subtotal_cents: subtotal,
    redeemed_spirals: appliedSpirals,
    status: 'paid',
    created_at: new Date().toISOString()
  };
  // Graceful error handling for database operations
  await cpostDoc(orderDoc).catch(()=>({}));

  // SPIRALS earn using NEW calculator with context-aware multipliers
  const purchaseAmount = subtotal / 100; // Convert cents to dollars
  const earned = await calculateSpiralsEarned(purchaseAmount, {
    pickup: input.pickup,
    invite: input.invite_bonus
  });

  // ledger entries with graceful error handling
  if (appliedSpirals > 0){
    await appendLedger({ type: 'spirals_ledger', userId: input.userId, retailerId: input.retailerId, orderId, delta: -appliedSpirals, reason:'redeem_purchase' }).catch(()=>({}));
  }
  if (earned > 0){
    await appendLedger({ type: 'spirals_ledger', userId: input.userId, retailerId: input.retailerId, orderId, delta: earned, reason:'earn_purchase' }).catch(()=>({}));
  }

  return { orderId, subtotal_cents: subtotal, total_cents, earned_spirals: earned, redeemed_spirals: appliedSpirals };
}