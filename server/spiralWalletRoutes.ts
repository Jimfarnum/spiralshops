import { Router } from "express";
import { nanoid } from "nanoid";

const router = Router();

interface WalletTransaction {
  date: Date;
  type: "earn" | "spend";
  source: "purchase" | "referral" | "share" | "in_person_bonus" | "reward_redeem";
  amount: number;
  description: string;
}

interface SpiralWallet {
  userId: string;
  balance: number;
  history: WalletTransaction[];
}

// In-memory storage for the wallet system
class WalletStorage {
  private wallets: Map<string, SpiralWallet> = new Map();

  async getWallet(userId: string): Promise<SpiralWallet> {
    if (!this.wallets.has(userId)) {
      // Create new wallet for user
      const newWallet: SpiralWallet = {
        userId,
        balance: 0,
        history: []
      };
      this.wallets.set(userId, newWallet);
      return newWallet;
    }
    return this.wallets.get(userId)!;
  }

  async addTransaction(userId: string, transaction: Omit<WalletTransaction, 'date'>): Promise<SpiralWallet> {
    const wallet = await this.getWallet(userId);
    
    const newTransaction: WalletTransaction = {
      ...transaction,
      date: new Date()
    };

    // Update balance
    if (transaction.type === "earn") {
      wallet.balance += transaction.amount;
    } else {
      wallet.balance = Math.max(0, wallet.balance - transaction.amount);
    }

    // Add to history
    wallet.history.unshift(newTransaction);

    this.wallets.set(userId, wallet);
    return wallet;
  }

  async updateBalance(userId: string, newBalance: number): Promise<SpiralWallet> {
    const wallet = await this.getWallet(userId);
    wallet.balance = Math.max(0, newBalance);
    this.wallets.set(userId, wallet);
    return wallet;
  }

  async getTransactionHistory(userId: string, limit: number = 50): Promise<WalletTransaction[]> {
    const wallet = await this.getWallet(userId);
    return wallet.history.slice(0, limit);
  }
}

const walletStorage = new WalletStorage();

// GET /api/wallet/:userId - Get user's wallet
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const wallet = await walletStorage.getWallet(userId);
    res.json(wallet);
  } catch (error) {
    console.error("Error fetching wallet:", error);
    res.status(500).json({ message: "Failed to fetch wallet" });
  }
});

// POST /api/wallet/:userId/earn - Add earning transaction
router.post("/:userId/earn", async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount, source, description } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    if (!source || !description) {
      return res.status(400).json({ message: "Source and description are required" });
    }

    const wallet = await walletStorage.addTransaction(userId, {
      type: "earn",
      amount,
      source,
      description
    });

    res.json({
      success: true,
      wallet,
      message: `Earned ${amount} SPIRALs from ${source}`
    });
  } catch (error) {
    console.error("Error adding earning transaction:", error);
    res.status(500).json({ message: "Failed to add earning transaction" });
  }
});

// POST /api/wallet/:userId/spend - Add spending transaction
router.post("/:userId/spend", async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount, source, description } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    if (!source || !description) {
      return res.status(400).json({ message: "Source and description are required" });
    }

    const currentWallet = await walletStorage.getWallet(userId);
    
    if (currentWallet.balance < amount) {
      return res.status(400).json({ 
        message: "Insufficient SPIRAL balance",
        currentBalance: currentWallet.balance,
        requestedAmount: amount
      });
    }

    const wallet = await walletStorage.addTransaction(userId, {
      type: "spend",
      amount,
      source,
      description
    });

    res.json({
      success: true,
      wallet,
      message: `Spent ${amount} SPIRALs on ${description}`
    });
  } catch (error) {
    console.error("Error adding spending transaction:", error);
    res.status(500).json({ message: "Failed to add spending transaction" });
  }
});

// GET /api/wallet/:userId/history - Get transaction history
router.get("/:userId/history", async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;
    
    const history = await walletStorage.getTransactionHistory(userId, limit);
    res.json({ history, total: history.length });
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    res.status(500).json({ message: "Failed to fetch transaction history" });
  }
});

// POST /api/wallet/:userId/balance - Update balance directly (admin function)
router.post("/:userId/balance", async (req, res) => {
  try {
    const { userId } = req.params;
    const { balance } = req.body;

    if (balance < 0) {
      return res.status(400).json({ message: "Balance cannot be negative" });
    }

    const wallet = await walletStorage.updateBalance(userId, balance);
    res.json({
      success: true,
      wallet,
      message: `Updated balance to ${balance} SPIRALs`
    });
  } catch (error) {
    console.error("Error updating balance:", error);
    res.status(500).json({ message: "Failed to update balance" });
  }
});

// POST /api/wallet/demo-transactions - Create demo transactions for testing
router.post("/demo-transactions", async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Create sample transactions
    const demoTransactions = [
      { type: "earn", amount: 50, source: "purchase", description: "Online purchase at Tech Store" },
      { type: "earn", amount: 25, source: "referral", description: "Friend signed up using your code" },
      { type: "earn", amount: 10, source: "share", description: "Shared product on social media" },
      { type: "spend", amount: 20, source: "reward_redeem", description: "Redeemed 10% discount at Fashion Boutique" },
      { type: "earn", amount: 100, source: "in_person_bonus", description: "In-person shopping bonus at Electronics Mall" },
      { type: "earn", amount: 15, source: "share", description: "Shared store on Facebook" },
    ];

    let wallet = await walletStorage.getWallet(userId);

    for (const transaction of demoTransactions) {
      wallet = await walletStorage.addTransaction(userId, transaction);
      // Add small delay to create different timestamps
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    res.json({
      success: true,
      wallet,
      message: `Created ${demoTransactions.length} demo transactions`
    });
  } catch (error) {
    console.error("Error creating demo transactions:", error);
    res.status(500).json({ message: "Failed to create demo transactions" });
  }
});

export default router;