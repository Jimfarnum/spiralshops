import { Request, Response, Router } from 'express';
import { z } from 'zod';

const router = Router();

// Mock database for gift cards and mall credits
interface GiftCard {
  id: string;
  code: string;
  issuerId?: number;
  issuerType: 'retailer' | 'mall' | 'spiral';
  amount: number;
  remainingBalance: number;
  isActive: boolean;
  expiresAt?: string;
  title: string;
  description?: string;
  terms?: string;
  createdAt: string;
}

interface UserWallet {
  id: string;
  userId: number;
  giftCardId: string;
  addedAt: string;
  isRedeemed: boolean;
  redeemedAt?: string;
  redeemedAmount?: number;
}

interface MallCredit {
  id: string;
  userId: number;
  mallId: string;
  mallName: string;
  amount: number;
  remainingBalance: number;
  source: 'promotion' | 'loyalty_bonus' | 'event' | 'referral';
  description?: string;
  isActive: boolean;
  expiresAt?: string;
  earnedAt: string;
}

interface WalletTransaction {
  id: string;
  userId: number;
  transactionType: 'gift_card_redeem' | 'mall_credit_earn' | 'mall_credit_redeem';
  amount: number;
  giftCardId?: string;
  mallCreditId?: string;
  orderId?: string;
  description: string;
  transactionDate: string;
}

// Mock data storage
let giftCards: GiftCard[] = [
  {
    id: 'gc1',
    code: 'SPRL-GIFT-2024',
    issuerType: 'spiral',
    amount: 25.00,
    remainingBalance: 25.00,
    isActive: true,
    expiresAt: '2025-12-31',
    title: 'SPIRAL Welcome Bonus',
    description: '$25 gift card for new users',
    terms: 'Valid for 1 year. Cannot be combined with other offers.',
    createdAt: '2025-01-23T00:00:00Z'
  },
  {
    id: 'gc2',
    code: 'MALL-50-PROMO',
    issuerType: 'mall',
    amount: 50.00,
    remainingBalance: 50.00,
    isActive: true,
    expiresAt: '2025-06-30',
    title: 'Mall Promo Gift Card',
    description: '$50 gift card for Burnsville Mall',
    terms: 'Valid at participating Burnsville Mall stores only.',
    createdAt: '2025-01-20T00:00:00Z'
  }
];

let userWallets: UserWallet[] = [];
let mallCredits: MallCredit[] = [
  {
    id: 'mc1',
    userId: 1,
    mallId: 'burnsville-mall',
    mallName: 'Burnsville Mall',
    amount: 15.00,
    remainingBalance: 15.00,
    source: 'promotion',
    description: 'Earned from 3-store shopping challenge',
    isActive: true,
    expiresAt: '2025-03-23',
    earnedAt: '2025-01-23T00:00:00Z'
  }
];
let walletTransactions: WalletTransaction[] = [];

// Validation schemas
const redeemGiftCardSchema = z.object({
  code: z.string().min(1),
  userId: z.number(),
  amount: z.number().min(0.01).optional()
});

const sendGiftCardSchema = z.object({
  recipientEmail: z.string().email(),
  amount: z.number().min(5).max(500),
  message: z.string().optional(),
  senderName: z.string().min(1)
});

const earnMallCreditSchema = z.object({
  userId: z.number(),
  mallId: z.string().min(1),
  mallName: z.string().min(1),
  amount: z.number().min(0.01),
  source: z.enum(['promotion', 'loyalty_bonus', 'event', 'referral']),
  description: z.string().optional(),
  expiresAt: z.string().optional()
});

// GET /api/wallet/user/:userId - Get user's complete wallet
router.get('/user/:userId', (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    
    // Get user's gift cards
    const userGiftCards = userWallets
      .filter(w => w.userId === userId)
      .map(wallet => {
        const giftCard = giftCards.find(gc => gc.id === wallet.giftCardId);
        return { ...wallet, giftCard };
      })
      .filter(w => w.giftCard);

    // Get user's mall credits
    const userMallCredits = mallCredits.filter(mc => mc.userId === userId && mc.isActive);

    // Calculate totals
    const totalGiftCardBalance = userGiftCards.reduce((sum, w) => 
      sum + (w.giftCard?.remainingBalance || 0), 0
    );
    const totalMallCredits = userMallCredits.reduce((sum, mc) => 
      sum + mc.remainingBalance, 0
    );

    // Get recent transactions
    const recentTransactions = walletTransactions
      .filter(t => t.userId === userId)
      .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime())
      .slice(0, 10);

    res.json({
      userId,
      giftCards: userGiftCards,
      mallCredits: userMallCredits,
      totalGiftCardBalance,
      totalMallCredits,
      recentTransactions
    });
  } catch (error) {
    console.error('Error fetching wallet:', error);
    res.status(500).json({ error: 'Failed to fetch wallet' });
  }
});

// POST /api/wallet/giftcard/redeem - Redeem a gift card
router.post('/giftcard/redeem', (req: Request, res: Response) => {
  try {
    const validation = redeemGiftCardSchema.parse(req.body);
    const { code, userId, amount } = validation;

    // Find the gift card
    const giftCard = giftCards.find(gc => gc.code === code && gc.isActive);
    if (!giftCard) {
      return res.status(404).json({ error: 'Gift card not found or inactive' });
    }

    // Check if already in user's wallet
    const existingWallet = userWallets.find(w => w.giftCardId === giftCard.id && w.userId === userId);
    if (existingWallet) {
      return res.status(400).json({ error: 'Gift card already added to wallet' });
    }

    // Add to user's wallet
    const newWallet: UserWallet = {
      id: `wallet_${Date.now()}`,
      userId,
      giftCardId: giftCard.id,
      addedAt: new Date().toISOString(),
      isRedeemed: false
    };
    userWallets.push(newWallet);

    // Create transaction record
    const transaction: WalletTransaction = {
      id: `txn_${Date.now()}`,
      userId,
      transactionType: 'gift_card_redeem',
      amount: giftCard.amount,
      giftCardId: giftCard.id,
      description: `Added gift card: ${giftCard.title}`,
      transactionDate: new Date().toISOString()
    };
    walletTransactions.push(transaction);

    res.json({ 
      success: true, 
      message: 'Gift card added to wallet successfully',
      wallet: newWallet,
      giftCard,
      transaction
    });
  } catch (error) {
    console.error('Error redeeming gift card:', error);
    res.status(400).json({ error: 'Invalid request data' });
  }
});

// POST /api/wallet/giftcard/send - Send gift card to another user
router.post('/giftcard/send', (req: Request, res: Response) => {
  try {
    const validation = sendGiftCardSchema.parse(req.body);
    const { recipientEmail, amount, message, senderName } = validation;

    // Generate unique gift card code
    const code = `SPRL-${Math.random().toString(36).substr(2, 4).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    
    // Create new gift card
    const newGiftCard: GiftCard = {
      id: `gc_${Date.now()}`,
      code,
      issuerType: 'spiral',
      amount,
      remainingBalance: amount,
      isActive: true,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
      title: `Gift from ${senderName}`,
      description: message || 'A SPIRAL gift card sent with love',
      terms: 'Valid for 1 year from issue date.',
      createdAt: new Date().toISOString()
    };
    giftCards.push(newGiftCard);

    // Simulate email sending
    console.log(`Sending gift card ${code} to ${recipientEmail}`);

    res.json({ 
      success: true, 
      message: 'Gift card sent successfully',
      giftCard: newGiftCard,
      recipientEmail,
      redemptionLink: `/wallet/redeem?code=${code}`
    });
  } catch (error) {
    console.error('Error sending gift card:', error);
    res.status(400).json({ error: 'Invalid request data' });
  }
});

// POST /api/wallet/mall-credit/earn - Award mall credit
router.post('/mall-credit/earn', (req: Request, res: Response) => {
  try {
    const validation = earnMallCreditSchema.parse(req.body);
    const { userId, mallId, mallName, amount, source, description, expiresAt } = validation;

    // Create new mall credit
    const newMallCredit: MallCredit = {
      id: `mc_${Date.now()}`,
      userId,
      mallId,
      mallName,
      amount,
      remainingBalance: amount,
      source,
      description: description || `${source.replace('_', ' ')} credit`,
      isActive: true,
      expiresAt,
      earnedAt: new Date().toISOString()
    };
    mallCredits.push(newMallCredit);

    // Create transaction record
    const transaction: WalletTransaction = {
      id: `txn_${Date.now()}`,
      userId,
      transactionType: 'mall_credit_earn',
      amount,
      mallCreditId: newMallCredit.id,
      description: `Earned mall credit: ${newMallCredit.description}`,
      transactionDate: new Date().toISOString()
    };
    walletTransactions.push(transaction);

    res.json({ 
      success: true, 
      message: 'Mall credit earned successfully',
      mallCredit: newMallCredit,
      transaction
    });
  } catch (error) {
    console.error('Error earning mall credit:', error);
    res.status(400).json({ error: 'Invalid request data' });
  }
});

// POST /api/wallet/mall-credit/redeem - Use mall credit during checkout
router.post('/mall-credit/redeem', (req: Request, res: Response) => {
  try {
    const { userId, mallCreditId, amount, orderId } = req.body;

    // Find the mall credit
    const mallCredit = mallCredits.find(mc => mc.id === mallCreditId && mc.userId === userId && mc.isActive);
    if (!mallCredit) {
      return res.status(404).json({ error: 'Mall credit not found or inactive' });
    }

    // Check if sufficient balance
    if (mallCredit.remainingBalance < amount) {
      return res.status(400).json({ error: 'Insufficient mall credit balance' });
    }

    // Update mall credit balance
    mallCredit.remainingBalance -= amount;
    if (mallCredit.remainingBalance === 0) {
      mallCredit.isActive = false;
    }

    // Create transaction record
    const transaction: WalletTransaction = {
      id: `txn_${Date.now()}`,
      userId,
      transactionType: 'mall_credit_redeem',
      amount,
      mallCreditId,
      orderId,
      description: `Used mall credit for order ${orderId || 'checkout'}`,
      transactionDate: new Date().toISOString()
    };
    walletTransactions.push(transaction);

    res.json({ 
      success: true, 
      message: 'Mall credit applied successfully',
      appliedAmount: amount,
      remainingBalance: mallCredit.remainingBalance,
      transaction
    });
  } catch (error) {
    console.error('Error redeeming mall credit:', error);
    res.status(400).json({ error: 'Failed to redeem mall credit' });
  }
});

// GET /api/wallet/transactions/:userId - Get user's wallet transaction history
router.get('/transactions/:userId', (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const transactions = walletTransactions
      .filter(t => t.userId === userId)
      .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());

    res.json({ transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

export default router;